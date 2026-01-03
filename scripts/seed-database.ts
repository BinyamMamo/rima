import { db, initializeDatabase } from '../lib/db';
import { PROFILES, SYSTEM_USERS, INITIAL_WORKSPACES } from '../constants';

function clearDatabase() {
  console.log('Clearing existing database...');
  db.exec(`
    DELETE FROM task_dependencies;
    DELETE FROM task_rooms;
    DELETE FROM spending;
    DELETE FROM tasks;
    DELETE FROM insights;
    DELETE FROM messages;
    DELETE FROM room_members;
    DELETE FROM rooms;
    DELETE FROM workspace_tags;
    DELETE FROM workspace_members;
    DELETE FROM workspaces;
    DELETE FROM users;
    DELETE FROM profiles;
  `);
}

function seedProfiles() {
  console.log('Seeding profiles...');
  const stmt = db.prepare('INSERT INTO profiles (id, name, icon) VALUES (?, ?, ?)');

  for (const profile of PROFILES) {
    stmt.run(profile.id, profile.name, profile.icon);
  }
}

function seedUsers() {
  console.log('Seeding users...');
  const stmt = db.prepare(`
    INSERT INTO users (id, name, avatar_color, email, role, status, recent_activity, room_involvement)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const user of SYSTEM_USERS) {
    stmt.run(
      user.id,
      user.name,
      user.avatarColor,
      user.email || null,
      user.role || null,
      user.status || null,
      user.recentActivity || null,
      user.roomInvolvement || null
    );
  }
}

function seedWorkspaces() {
  console.log('Seeding workspaces...');

  const workspaceStmt = db.prepare(`
    INSERT INTO workspaces (id, title, description, theme, profile_id, budget, deadline, phase, progress, last_activity, parent_room_id, is_private)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const memberStmt = db.prepare('INSERT INTO workspace_members (workspace_id, user_id) VALUES (?, ?)');
  const tagStmt = db.prepare('INSERT INTO workspace_tags (workspace_id, tag) VALUES (?, ?)');
  const insightStmt = db.prepare(`
    INSERT INTO insights (id, workspace_id, category, text, icon, type, content, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const messageStmt = db.prepare(`
    INSERT INTO messages (id, workspace_id, sender_id, sender_type, content, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const workspace of INITIAL_WORKSPACES) {
    // Insert workspace
    workspaceStmt.run(
      workspace.id,
      workspace.title,
      workspace.description,
      workspace.theme,
      workspace.profileId,
      workspace.budget || null,
      workspace.deadline || null,
      workspace.phase || null,
      workspace.progress || null,
      workspace.lastActivity || null,
      workspace.parentRoomId || null,
      workspace.isPrivate ? 1 : 0
    );

    // Insert members
    for (const member of workspace.members) {
      memberStmt.run(workspace.id, member.id);
    }

    // Insert tags
    if (workspace.tags) {
      for (const tag of workspace.tags) {
        tagStmt.run(workspace.id, tag);
      }
    }

    // Insert insights
    if (workspace.insights) {
      for (const insight of workspace.insights) {
        // Map old insight format to new schema
        insightStmt.run(
          insight.id,
          workspace.id,
          (insight as any).type || insight.category || 'info', // category is required
          (insight as any).content || insight.text || '',
          insight.icon || '',
          (insight as any).type || null,
          (insight as any).content || null,
          (insight as any).timestamp || null
        );
      }
    }

    // Insert workspace messages
    for (const message of workspace.messages) {
      messageStmt.run(
        message.id,
        workspace.id,
        typeof message.sender === 'string' ? null : message.sender.id,
        typeof message.sender === 'string' ? 'rima' : 'user',
        message.content,
        message.timestamp
      );
    }
  }
}

function seedRooms() {
  console.log('Seeding rooms...');

  const roomStmt = db.prepare(`
    INSERT INTO rooms (id, workspace_id, title, description, is_private, unread_count)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const memberStmt = db.prepare('INSERT INTO room_members (room_id, user_id) VALUES (?, ?)');
  const messageStmt = db.prepare(`
    INSERT INTO messages (id, room_id, sender_id, sender_type, content, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const workspace of INITIAL_WORKSPACES) {
    for (const room of workspace.rooms) {
      // Insert room
      roomStmt.run(
        room.id,
        workspace.id,
        room.title,
        room.description || null,
        room.isPrivate ? 1 : 0,
        room.unreadCount || 0
      );

      // Insert members
      for (const member of room.members) {
        memberStmt.run(room.id, member.id);
      }

      // Insert messages
      for (const message of room.messages) {
        messageStmt.run(
          message.id,
          room.id,
          typeof message.sender === 'string' ? null : message.sender.id,
          typeof message.sender === 'string' ? 'rima' : 'user',
          message.content,
          message.timestamp
        );
      }
    }
  }
}

function expandMyHealthWorkspace() {
  console.log('Expanding My Health workspace with rooms and conversations...');

  const workspaceId = 'w_health_private';
  const sara = SYSTEM_USERS[0]; // Sara

  const rooms = [
    {
      id: 'r_health_workouts',
      title: 'Workouts',
      messages: [
        { sender: sara, content: "Starting my fitness journey today! Goal: 3 workouts per week.", offset: 15000 },
        { sender: 'Rima', content: "Great start! 🏃‍♀️\nI'll track your weekly workout frequency and suggest the best days based on your energy patterns.", offset: 14950 },
        { sender: sara, content: "Did 30 min HIIT today. Tough but felt amazing after!", offset: 13000 },
        { sender: 'Rima', content: "Logged ✅\n30-minute HIIT workout - High intensity\nYour heart rate recovery is improving compared to last week.", offset: 12950 },
        { sender: sara, content: "Skipped today. Too tired from work.", offset: 11000 },
        { sender: 'Rima', content: "Noted. Rest is important too 🌙\nYou've been consistent for 2 weeks - one rest day won't hurt your progress.", offset: 10950 },
        { sender: sara, content: "Yoga session - 45 mins. Much needed stretch.", offset: 9000 },
        { sender: 'Rima', content: "Perfect for recovery! 🧘‍♀️\nYoga session logged. I notice you recover better after yoga on high-stress days.", offset: 8950 },
        { sender: sara, content: "@RIMA remind me to workout tomorrow at 6 AM", offset: 7000 },
        { sender: 'Rima', content: "⏰ Reminder set for tomorrow at 6:00 AM\nI'll also check the weather and suggest indoor alternatives if needed.", offset: 6950 },
        { sender: sara, content: "Finished! 40 min run in the park. Beautiful morning.", offset: 5000 },
        { sender: 'Rima', content: "Amazing! 🌅\n40-minute run logged.\nYou're on track to hit your 3 workouts/week goal.", offset: 4950 },
        { sender: sara, content: "I want to try strength training. Where do I start?", offset: 3000 },
        { sender: 'Rima', content: "Based on your current fitness level, I suggest:\n* Start with bodyweight exercises (squats, push-ups, planks)\n* 2-3 sessions per week\n* Focus on form over weight\nShall I create a beginner strength plan?", offset: 2950 },
        { sender: sara, content: "Yes please!", offset: 2000 },
        { sender: 'Rima', content: "✅ Beginner Strength Plan created:\n* Monday: Upper body (20 min)\n* Wednesday: Lower body (20 min)\n* Friday: Core (15 min)\nI'll send reminders and track your progress.", offset: 1950 },
      ]
    },
    {
      id: 'r_health_nutrition',
      title: 'Nutrition',
      messages: [
        { sender: sara, content: "Need to track my meals better. Always forgetting what I ate.", offset: 14000 },
        { sender: 'Rima', content: "I can help with that! 🥗\nJust tell me what you eat and I'll log it with estimated nutrition info.", offset: 13950 },
        { sender: sara, content: "Breakfast: oatmeal with berries and honey. Coffee.", offset: 12000 },
        { sender: 'Rima', content: "Logged ✅\nBreakfast (8:30 AM):\n* Oatmeal with berries\n* Honey\n* Coffee\nGood fiber and antioxidants to start the day!", offset: 11950 },
        { sender: sara, content: "Lunch was chicken salad. Dinner: pasta with veggies.", offset: 10000 },
        { sender: 'Rima', content: "Both logged! 👍\nYour protein intake today looks good. Veggies are balanced.\nWater intake: Have you been drinking enough?", offset: 9950 },
        { sender: sara, content: "Probably not... maybe 3 glasses?", offset: 9000 },
        { sender: 'Rima', content: "Let's aim for 6-8 glasses daily 💧\nI'll remind you throughout the day.", offset: 8950 },
        { sender: sara, content: "Had a cheat day today 😅 Pizza and ice cream.", offset: 7000 },
        { sender: 'Rima', content: "Totally fine! 🍕🍦\nBalance is key. You've been consistent all week.\nOne cheat day won't affect your overall nutrition.", offset: 6950 },
        { sender: sara, content: "Feeling bloated lately. Any ideas why?", offset: 5000 },
        { sender: 'Rima', content: "Let me check your recent meals...\nI notice:\n* High sodium in processed foods last 3 days\n* Lower water intake\n* Less fiber\nTry increasing water and fiber-rich foods.", offset: 4950 },
        { sender: sara, content: "Makes sense. I'll focus on that this week.", offset: 3000 },
        { sender: 'Rima', content: "Great! I'll track improvements and flag if bloating persists.", offset: 2950 },
      ]
    },
    {
      id: 'r_health_mental',
      title: 'Mental Health',
      messages: [
        { sender: sara, content: "Feeling overwhelmed with work lately.", offset: 13000 },
        { sender: 'Rima', content: "I'm sorry you're feeling this way 💙\nWould it help to talk about what's overwhelming you?", offset: 12950 },
        { sender: sara, content: "Just too many deadlines. Not enough time to breathe.", offset: 11000 },
        { sender: 'Rima', content: "Noted. Your workload has increased significantly this month.\nHave you taken any breaks or done activities that help you relax?", offset: 10950 },
        { sender: sara, content: "Not really. Haven't had time.", offset: 9000 },
        { sender: 'Rima', content: "Even 5-10 minute breaks can help 🌸\nShall I remind you to take short mindfulness breaks?", offset: 8950 },
        { sender: sara, content: "Yes please. Maybe 3 times a day?", offset: 7000 },
        { sender: 'Rima', content: "⏰ Mindfulness break reminders set:\n* 11:00 AM\n* 3:00 PM\n* 7:00 PM\nI'll suggest simple breathing exercises or quick stretches.", offset: 6950 },
        { sender: sara, content: "Had a good day today. Felt calmer.", offset: 5000 },
        { sender: 'Rima', content: "That's wonderful to hear! 😊\nI noticed you took 2 breaks and had a yoga session.\nSeems like movement helps your mood.", offset: 4950 },
        { sender: sara, content: "Yeah, exercise definitely helps.", offset: 3000 },
        { sender: 'Rima', content: "I'll keep tracking this pattern.\nOn days you feel stressed, I can suggest quick workouts.", offset: 2950 },
        { sender: sara, content: "Sleep hasn't been great. Waking up at 3 AM a lot.", offset: 1000 },
        { sender: 'Rima', content: "Sleep disruption noted 😴\nThis has happened 4 times this week.\nFactors I notice:\n* Late-night screen time\n* Caffeine after 4 PM\n* High stress days\nShall we work on a better sleep routine?", offset: 950 },
      ]
    },
    {
      id: 'r_health_medical',
      title: 'Medical Records',
      messages: [
        { sender: sara, content: "Uploading my latest blood work results.", offset: 10000 },
        { sender: 'Rima', content: "📎 Blood work received (Dec 2025)\nReviewing... I'll compare with your previous results.", offset: 9950 },
        { sender: 'Rima', content: "Analysis complete:\n* Vitamin D: 18 ng/mL (Low - was 22 in Sept)\n* Iron: 45 µg/dL (Normal range)\n* Cholesterol: 190 mg/dL (Healthy)\n* Thyroid: Normal\n\n⚠️ Vitamin D has dropped. Consider supplements or more sun exposure.", offset: 9900 },
        { sender: sara, content: "Should I be worried about the Vitamin D?", offset: 8000 },
        { sender: 'Rima', content: "It's below optimal but manageable.\nLow Vitamin D correlates with:\n* Your recent fatigue\n* Mood changes\n* Slower workout recovery\nI recommend consulting your doctor about supplementation.", offset: 7950 },
        { sender: sara, content: "Okay, I'll book an appointment. @RIMA remind me to call the doctor tomorrow.", offset: 6000 },
        { sender: 'Rima', content: "⏰ Reminder set for tomorrow at 9:00 AM\n\"Call doctor about Vitamin D supplementation\"", offset: 5950 },
        { sender: sara, content: "Doctor prescribed Vitamin D 2000 IU daily.", offset: 4000 },
        { sender: 'Rima', content: "Great! Logging your prescription 💊\n* Vitamin D: 2000 IU daily\n* Start date: Today\nI'll remind you to take it and track when you need a refill.", offset: 3950 },
        { sender: sara, content: "Also got my annual checkup scheduled for March 15.", offset: 2000 },
        { sender: 'Rima', content: "📅 Annual checkup: March 15, 2026\nAdded to your health calendar.\nI'll remind you 1 week before to prepare any questions.", offset: 1950 },
      ]
    },
  ];

  const roomStmt = db.prepare(`
    INSERT INTO rooms (id, workspace_id, title, description, is_private, unread_count)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const memberStmt = db.prepare('INSERT INTO room_members (room_id, user_id) VALUES (?, ?)');
  const messageStmt = db.prepare(`
    INSERT INTO messages (id, room_id, sender_id, sender_type, content, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const createTimestamp = (offset: number) => {
    return new Date(Date.now() - offset * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  for (const room of rooms) {
    roomStmt.run(room.id, workspaceId, room.title, null, 1, 0);
    memberStmt.run(room.id, sara.id);

    for (const msg of room.messages) {
      const msgId = `m_${Date.now()}_${Math.random()}`;
      messageStmt.run(
        msgId,
        room.id,
        typeof msg.sender === 'string' ? null : msg.sender.id,
        typeof msg.sender === 'string' ? 'rima' : 'user',
        msg.content,
        createTimestamp(msg.offset)
      );
    }
  }
}

function addTaskGeneratingMessages() {
  console.log('Adding task-generating messages to workspaces...');

  const messageStmt = db.prepare(`
    INSERT INTO messages (id, workspace_id, room_id, sender_id, sender_type, content, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const createTimestamp = (offset: number) => {
    return new Date(Date.now() - offset * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const createMsgId = () => `m_${Date.now()}_${Math.random()}`;

  // Europe Trip - additional messages with tasks
  const europeMessages = [
    { workspaceId: 'w_europe_trip', roomId: null, senderId: SYSTEM_USERS[0].id, content: "I'll book the flights by Friday. Need to compare Emirates vs Qatar.", offset: 100 },
    { workspaceId: 'w_europe_trip', roomId: null, senderId: null, content: "✅ Task noted:\n\"Book flights\" - Sara - Due: Friday\nI'll remind you on Thursday if not done.", offset: 95 },
    { workspaceId: 'w_europe_trip', roomId: 'r_paris', senderId: SYSTEM_USERS[1].id, content: "I found 3 hotels. Will send options tonight for everyone to vote.", offset: 90 },
    { workspaceId: 'w_europe_trip', roomId: 'r_paris', senderId: null, content: "Task tracked:\n\"Share hotel options\" - Maryam - Due: Tonight", offset: 85 },
    { workspaceId: 'w_europe_trip', roomId: 'r_bookings', senderId: SYSTEM_USERS[2].id, content: "I can handle train bookings between cities. Budget estimate: €300 total.", offset: 80 },
    { workspaceId: 'w_europe_trip', roomId: 'r_bookings', senderId: null, content: "Assigned:\n\"Book inter-city trains\" - Noora\nBudget logged: €300", offset: 75 },
  ];

  // My Angels - additional messages with tasks
  const angelsMessages = [
    { workspaceId: 'w_supermom', roomId: 'r_omar', senderId: SYSTEM_USERS[4].id, content: "Mom, can you help me with my physics homework tonight?", offset: 200 },
    { workspaceId: 'w_supermom', roomId: 'r_omar', senderId: SYSTEM_USERS[0].id, content: "Of course! I'll be free after 7 PM.", offset: 195 },
    { workspaceId: 'w_supermom', roomId: 'r_omar', senderId: null, content: "Reminder set:\n\"Help Omar with physics homework\" - Sara - 7:00 PM", offset: 190 },
    { workspaceId: 'w_supermom', roomId: 'r_hessa', senderId: SYSTEM_USERS[0].id, content: "Hessa, don't forget your art supplies for tomorrow's class.", offset: 180 },
    { workspaceId: 'w_supermom', roomId: 'r_hessa', senderId: SYSTEM_USERS[5].id, content: "Okay! I'll pack them tonight.", offset: 175 },
    { workspaceId: 'w_supermom', roomId: 'r_salem', senderId: SYSTEM_USERS[0].id, content: "Salem, practice reading for 20 mins before bed.", offset: 170 },
  ];

  // Dubai Reefs - additional messages with tasks
  const reefsMessages = [
    { workspaceId: 'w_dubai_reefs', roomId: 'r_site_deployment', senderId: SYSTEM_USERS[7].id, content: "I'll finalize deployment schedule by Wednesday. Need final coordinates first.", offset: 250 },
    { workspaceId: 'w_dubai_reefs', roomId: 'r_site_deployment', senderId: null, content: "⚠️ Dependency noted:\n\"Finalize deployment schedule\" depends on survey coordinates\nDue: Wednesday", offset: 245 },
    { workspaceId: 'w_dubai_reefs', roomId: 'r_vendors', senderId: SYSTEM_USERS[9].id, content: "Updated quote: 52,000 AED for materials. Expires end of month.", offset: 240 },
    { workspaceId: 'w_dubai_reefs', roomId: 'r_vendors', senderId: null, content: "💰 Budget updated:\nMaterials: 52,000 AED\nQuote expires: End of month\n⚠️ Approval needed soon", offset: 235 },
  ];

  // Startup - additional messages with tasks
  const startupMessages = [
    { workspaceId: 'w_startup', roomId: 'r_designs', senderId: SYSTEM_USERS[11].id, content: "Final design revisions done. Ready for production by next Monday.", offset: 300 },
    { workspaceId: 'w_startup', roomId: 'r_designs', senderId: null, content: "✅ Design milestone:\n\"Final designs ready\" - Lina - Monday\nThis unblocks production.", offset: 295 },
    { workspaceId: 'w_startup', roomId: 'r_website', senderId: SYSTEM_USERS[13].id, content: "Need product photos by Friday to launch the site. Can't proceed without them.", offset: 290 },
    { workspaceId: 'w_startup', roomId: 'r_website', senderId: SYSTEM_USERS[0].id, content: "I'll do the photoshoot this weekend and send them to you by Sunday.", offset: 285 },
    { workspaceId: 'w_startup', roomId: 'r_website', senderId: null, content: "📸 Task chain:\n1. \"Photoshoot\" - Sara - Weekend\n2. \"Website launch\" - Khaled - Depends on photos\nTarget: Next week", offset: 280 },
  ];

  const allMessages = [...europeMessages, ...angelsMessages, ...reefsMessages, ...startupMessages];

  for (const msg of allMessages) {
    messageStmt.run(
      createMsgId(),
      msg.workspaceId,
      msg.roomId,
      msg.senderId,
      msg.senderId ? 'user' : 'rima',
      msg.content,
      createTimestamp(msg.offset)
    );
  }
}

function main() {
  console.log('🌱 Starting database seed...\n');

  initializeDatabase();
  clearDatabase();

  seedProfiles();
  seedUsers();
  seedWorkspaces();
  seedRooms();
  expandMyHealthWorkspace();
  addTaskGeneratingMessages();

  console.log('\n✅ Database seeded successfully!');
  console.log('📊 Summary:');
  console.log(`   - Profiles: ${db.prepare('SELECT COUNT(*) as count FROM profiles').get().count}`);
  console.log(`   - Users: ${db.prepare('SELECT COUNT(*) as count FROM users').get().count}`);
  console.log(`   - Workspaces: ${db.prepare('SELECT COUNT(*) as count FROM workspaces').get().count}`);
  console.log(`   - Rooms: ${db.prepare('SELECT COUNT(*) as count FROM rooms').get().count}`);
  console.log(`   - Messages: ${db.prepare('SELECT COUNT(*) as count FROM messages').get().count}`);

  db.close();
}

main();
