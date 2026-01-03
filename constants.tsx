
import { Workspace, Room, User, Profile, Message, Insight, Task } from './types';

export const PROFILES: Profile[] = [
  { id: 'all', name: 'All Workspaces', icon: '📁' },
  { id: 'p_work', name: 'Work', icon: '💼' },
  { id: 'p_life', name: 'Life', icon: '🏠' },
  { id: 'p_edu', name: 'Education', icon: '🎓' },
  { id: 'p_health', name: 'Health', icon: '❤️' },
];

export const SYSTEM_USERS: User[] = [
  { id: 'u_sara', name: 'Sara', avatarColor: 'bg-zinc-200 text-black', role: 'Owner / Founder', status: 'active', roomInvolvement: 25, recentActivity: 'Reviewing cross-universe dependencies' },
  { id: 'u_maryam', name: 'Maryam', avatarColor: 'bg-pink-500 text-white', role: 'Hotel Lead', status: 'active', roomInvolvement: 5, recentActivity: 'Updating bookings for Paris' },
  { id: 'u_noora', name: 'Noora', avatarColor: 'bg-orange-500 text-white', role: 'Shopping Lead', status: 'away', roomInvolvement: 4, recentActivity: 'Browsing Milan fashion guides' },
  { id: 'u_hind', name: 'Hind', avatarColor: 'bg-blue-500 text-white', role: 'Rome Lead', status: 'offline', roomInvolvement: 4, recentActivity: 'Working on coliseum tour' },
  { id: 'u_omar', name: 'Omar', avatarColor: 'bg-sky-600 text-white', role: 'Student (Son)', status: 'active', roomInvolvement: 3, recentActivity: 'Physics study plan updated' },
  { id: 'u_hessa', name: 'Hessa', avatarColor: 'bg-purple-500 text-white', role: 'Student (Daughter)', status: 'active', roomInvolvement: 3, recentActivity: 'Last message: 15m ago' },
  { id: 'u_salem', name: 'Salem', avatarColor: 'bg-emerald-500 text-white', role: 'Student (Son)', status: 'away', roomInvolvement: 3, recentActivity: 'Completed weekend task' },
  { id: 'u_alex', name: 'Alex', avatarColor: 'bg-teal-500 text-white', role: 'Ops Lead', status: 'active', roomInvolvement: 6, recentActivity: 'Reviewing Phase 1 dependencies' },
  { id: 'u_jordan', name: 'Jordan', avatarColor: 'bg-amber-500 text-white', role: 'Vendor Manager', status: 'active', roomInvolvement: 5, recentActivity: 'Negotiating brass pricing' },
  { id: 'u_lina', name: 'Lina', avatarColor: 'bg-rose-400 text-white', role: 'Designer', status: 'active', roomInvolvement: 3, recentActivity: 'Finalizing collection revisions' },
  { id: 'u_ali', name: 'Ali', avatarColor: 'bg-zinc-600 text-white', role: 'Supplier', status: 'offline', roomInvolvement: 2, recentActivity: 'Materials quote sent' },
  { id: 'u_khaled', name: 'Khaled', avatarColor: 'bg-indigo-500 text-white', role: 'Developer', status: 'away', roomInvolvement: 3, recentActivity: 'Web integration complete' },
  { id: 'u_marine', name: 'Marine Lead', avatarColor: 'bg-cyan-700 text-white', role: 'Marine Specialist', status: 'active', roomInvolvement: 3, recentActivity: 'Survey data processing' },
  { id: 'u_compliance', name: 'Compliance Officer', avatarColor: 'bg-slate-700 text-white', role: 'Regulatory Lead', status: 'active', roomInvolvement: 2, recentActivity: 'Permit A-14 audit' },
];

const createMsg = (sender: User | 'Rima', content: string, timeOffsetMinutes: number = 0): Message => ({
  id: `m_${Date.now()}_${Math.random()}`,
  sender,
  content,
  timestamp: new Date(Date.now() - (timeOffsetMinutes * 60000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
});

export const INITIAL_WORKSPACES: Workspace[] = [
  // SCENARIO: My Health (PRIVATE)
  {
    id: 'p_health_main',
    title: 'My Health',
    description: 'Private space for health reflections, symptom tracking, and personal wellness patterns.',
    theme: 'rose',
    profileId: 'p_health',
    progress: 40,
    members: [SYSTEM_USERS[0]],
    messages: [
      createMsg(SYSTEM_USERS[0], "Feeling a bit drained today, but sleep was okay.", 120),
    ],
    lastActivity: "Active 2h ago",
    insights: [
      { category: 'planning', text: 'Roll-up: Next doctor check-up is in 10 days.', icon: '📅' },
      { category: 'social', text: 'Pattern: Energy dips correlate with busy work cycles.', icon: '🌊' },
      { category: 'planning', text: 'Sleep quality improving with consistent exercise.', icon: '😴' }
    ],
    tasks: [
      { id: 'th1', title: 'Schedule Annual Physical', owner: 'Sara', completed: false, dueDate: 'Next Week' }
    ],
    rooms: [
      {
        id: 'c_health_gen',
        title: 'General',
        members: [SYSTEM_USERS[0]],
        messages: [
          createMsg(SYSTEM_USERS[0], "Feeling good today! Had a great workout.", 30),
          createMsg('Rima', "That's wonderful to hear! Your energy levels seem to be improving consistently. Keep it up!", 25)
        ],
        unreadCount: 1
      },
      { id: 'c_health_diet', title: 'Diet & Nutrition', members: [SYSTEM_USERS[0]], messages: [], unreadCount: 0 },
      { id: 'c_health_ex', title: 'Exercise Log', members: [SYSTEM_USERS[0]], messages: [], unreadCount: 3 },
      { id: 'c_health_journal', title: 'Private Journal', members: [SYSTEM_USERS[0]], messages: [], unreadCount: 0, isPrivate: true }
    ]
  },
  {
    id: 'p_health_phys',
    title: 'Physical Health',
    description: 'Energy levels, sleep patterns, and doctor recommendations.',
    theme: 'rose',
    parentRoomId: 'p_health_main',
    profileId: 'p_health',
    progress: 50,
    members: [SYSTEM_USERS[0]],
    insights: [
      { category: 'planning', text: 'Note: Sleep improving with earlier wind-down.', icon: '🛌' }
    ],
    messages: [],
    rooms: []
  },
  {
    id: 'p_health_mental',
    title: 'Mental & Emotional Health',
    description: 'Mood tracking, stress triggers, and emotional reflections.',
    theme: 'rose',
    parentRoomId: 'p_health_main',
    profileId: 'p_health',
    progress: 30,
    members: [SYSTEM_USERS[0]],
    insights: [
      { category: 'social', text: 'Stress trigger: Large meetings recorded.', icon: '🧘' }
    ],
    messages: [],
    rooms: []
  },
  {
    id: 'p_health_appt',
    title: 'Appointments & Medication',
    description: 'Doctor schedules, prescriptions, and test results.',
    theme: 'rose',
    parentRoomId: 'p_health_main',
    profileId: 'p_health',
    progress: 60,
    members: [SYSTEM_USERS[0]],
    insights: [
      { category: 'planning', text: 'Prescription refill due on Mar 15.', icon: '💊' }
    ],
    messages: [],
    rooms: []
  },
  {
    id: 'p_health_goals',
    title: 'Health Goals & Habits',
    description: 'Nutrition intentions, movement goals, and recovery plans.',
    theme: 'rose',
    parentRoomId: 'p_health_main',
    profileId: 'p_health',
    progress: 20,
    members: [SYSTEM_USERS[0]],
    insights: [
      { category: 'planning', text: 'Goal: 3x yoga sessions per week.', icon: '🧘' }
    ],
    messages: [],
    rooms: []
  },

  // SCENARIO 1: Europe Trip
  {
    id: 'p1',
    title: 'Europe Trip with the Ladies',
    description: '10-day multi-city trip. Paris, Milan, Rome alignment and planning.',
    theme: 'sky',
    profileId: 'p_life',
    progress: 35,
    budget: '€6,000',
    members: [SYSTEM_USERS[0], SYSTEM_USERS[1], SYSTEM_USERS[2], SYSTEM_USERS[3]],
    messages: [
      createMsg(SYSTEM_USERS[0], "April Europe trip is officially happening! 🇪🇺", 120),
      createMsg(SYSTEM_USERS[1], "I'm looking at hotels for Paris now.", 45),
    ],
    lastActivity: "Active 45m ago",
    insights: [
      { category: 'planning', text: 'Roll-up: Paris hotels being shortlisted by Maryam.', icon: '🏨' },
      { category: 'risk', text: 'Flight prices trending upwards for April 5th.', icon: '✈️' },
      { category: 'social', text: 'Everyone aligned on 3 cities: Paris, Milan, Rome.', icon: '🤝' }
    ],
    tasks: [],
    rooms: [
      {
        id: 'c1',
        title: 'General',
        members: [SYSTEM_USERS[0], SYSTEM_USERS[1], SYSTEM_USERS[2], SYSTEM_USERS[3]],
        messages: [
          createMsg(SYSTEM_USERS[0], "April Europe trip is officially happening! 🇪🇺", 120),
          createMsg(SYSTEM_USERS[1], "So excited! I can't wait to see Paris.", 110),
          createMsg(SYSTEM_USERS[2], "Milan shopping here we come!", 105),
          createMsg(SYSTEM_USERS[3], "Rome is going to be amazing for food tours!", 100)
        ],
        unreadCount: 3
      },
      {
        id: 'c2',
        title: 'Hotels',
        members: [SYSTEM_USERS[0], SYSTEM_USERS[1]],
        messages: [
          createMsg(SYSTEM_USERS[1], "Found a great boutique hotel near the Eiffel Tower", 60),
          createMsg(SYSTEM_USERS[0], "@Rima can you check if there are better deals in the area?", 55),
          createMsg('Rima', "I've analyzed the hotel options in that area. The boutique hotel Maryam found has excellent reviews and competitive pricing.", 50),
          createMsg(SYSTEM_USERS[1], "Does it have a pool?", 10)
        ],
        unreadCount: 2
      },
      { id: 'c3', title: 'Flights', members: [SYSTEM_USERS[0]], messages: [], unreadCount: 0 },
      {
        id: 'c4',
        title: 'Shopping',
        members: [SYSTEM_USERS[0], SYSTEM_USERS[2]],
        messages: [
          createMsg(SYSTEM_USERS[2], "Check out this vintage store list!", 30),
          createMsg(SYSTEM_USERS[2], "And this one in Milan.", 25)
        ],
        unreadCount: 2
      },
      {
        id: 'c5',
        title: 'Budget',
        members: [SYSTEM_USERS[0], SYSTEM_USERS[1]],
        messages: [
          createMsg(SYSTEM_USERS[1], "Updated the spreadsheet with hotel estimates.", 100),
        ],
        unreadCount: 1
      },
      { id: 'c6', title: 'Surprises', members: [SYSTEM_USERS[0]], messages: [], unreadCount: 0, isPrivate: true }
    ]
  },
  {
    id: 'p1_paris',
    title: 'Paris – Style & Culture',
    description: 'Museums, cafés, shopping, and hotel selections.',
    theme: 'sky',
    parentRoomId: 'p1',
    profileId: 'p_life',
    progress: 40,
    members: [SYSTEM_USERS[0], SYSTEM_USERS[1]],
    insights: [
      { category: 'planning', text: 'Informal ownership: Maryam is leading hotels.', icon: '🔑' },
      { category: 'social', text: 'Museum pass interest logged for Louvre.', icon: '🎨' }
    ],
    messages: [],
    rooms: []
  },
  {
    id: 'p1_milan',
    title: 'Milan – Shopping & Logistics',
    description: 'Shopping plans and short stay logistics.',
    theme: 'sky',
    parentRoomId: 'p1',
    profileId: 'p_life',
    progress: 20,
    members: [SYSTEM_USERS[0], SYSTEM_USERS[2]],
    insights: [],
    messages: [],
    rooms: []
  },
  {
    id: 'p1_rome',
    title: 'Rome – History & Food',
    description: 'Longer stay logistics and walking tours.',
    theme: 'sky',
    parentRoomId: 'p1',
    profileId: 'p_life',
    progress: 15,
    members: [SYSTEM_USERS[0], SYSTEM_USERS[3]],
    insights: [
      { category: 'planning', text: 'Hind assigned as city lead for food tours.', icon: '🍝' }
    ],
    messages: [],
    rooms: []
  },
  {
    id: 'p1_bookings',
    title: 'Bookings & Expenses',
    description: 'PDFs, expenses, and visa tracking.',
    theme: 'sky',
    parentRoomId: 'p1',
    profileId: 'p_life',
    progress: 50,
    members: [SYSTEM_USERS[0], SYSTEM_USERS[1], SYSTEM_USERS[2], SYSTEM_USERS[3]],
    insights: [
      { category: 'finance', text: 'Running total: €2,500 spent.', icon: '💰' },
      { category: 'risk', text: 'Visa applications pending for Hind.', icon: '📑' }
    ],
    messages: [],
    rooms: []
  },

  // SCENARIO 2: My Angels (EDUCATION)
  {
    id: 'p2',
    title: 'My Angels',
    description: 'Family command center. Calendar sync and progress tracking.',
    theme: 'teal',
    profileId: 'p_edu',
    progress: 60,
    members: [SYSTEM_USERS[0]],
    messages: [],
    lastActivity: "Active 5m ago",
    insights: [
      { category: 'planning', text: 'Omar has a busy exam week ahead.', icon: '📅' },
      { category: 'social', text: "Roll-up: Hessa's stress levels tracked as stable.", icon: '🧘' }
    ],
    rooms: [
      { id: 'c_ang_cal', title: 'Calendar', members: [SYSTEM_USERS[0]], messages: [], unreadCount: 4 },
      { id: 'c_ang_sch', title: 'School', members: [SYSTEM_USERS[0]], messages: [], unreadCount: 0 },
      { id: 'c_ang_act', title: 'Activities', members: [SYSTEM_USERS[0]], messages: [], unreadCount: 1 },
      { id: 'c_ang_gifts', title: 'Gifts & Ideas', members: [SYSTEM_USERS[0]], messages: [], unreadCount: 0, isPrivate: true }
    ]
  },
  {
    id: 'p2_omar',
    title: 'Omar – Progress',
    description: 'Exams, football schedule, and study planning.',
    theme: 'teal',
    parentRoomId: 'p2',
    profileId: 'p_edu',
    progress: 75,
    members: [SYSTEM_USERS[0], SYSTEM_USERS[4]],
    insights: [
      { category: 'planning', text: 'Physics study plan updated.', icon: '⚡' },
      { category: 'planning', text: 'Football training every Tuesday/Thursday.', icon: '⚽' }
    ],
    messages: [],
    rooms: []
  },
  {
    id: 'p2_hessa',
    title: 'Hessa – Support',
    description: 'Projects, stress support, and task breakdowns.',
    theme: 'teal',
    parentRoomId: 'p2',
    profileId: 'p_edu',
    progress: 45,
    members: [SYSTEM_USERS[0], SYSTEM_USERS[5]],
    insights: [
      { category: 'social', text: 'Gentle support mode active for art project.', icon: '🎨' }
    ],
    messages: [],
    rooms: []
  },
  {
    id: 'p2_salem',
    title: 'Salem – Encouragement',
    description: 'School progress and teacher notes.',
    theme: 'teal',
    parentRoomId: 'p2',
    profileId: 'p_edu',
    progress: 55,
    members: [SYSTEM_USERS[0], SYSTEM_USERS[6]],
    insights: [
      { category: 'planning', text: 'Positive feedback from math teacher logged.', icon: '📝' }
    ],
    messages: [],
    rooms: []
  },

  // SCENARIO 3: Dubai Reefs (ENTERPRISE)
  {
    id: 'p3',
    title: 'Dubai Reefs – Program Operations',
    description: 'High-level coordination of environmental surveys, site deployment, and procurement.',
    theme: 'rust',
    profileId: 'p_work',
    progress: 42,
    budget: '$450,000',
    phase: 'Operationalizing Phase 1',
    members: [SYSTEM_USERS[0], SYSTEM_USERS[7], SYSTEM_USERS[8], SYSTEM_USERS[12], SYSTEM_USERS[13]],
    messages: [
      createMsg(SYSTEM_USERS[7], "Synthesized high-level blockers for today's review.", 5),
    ],
    lastActivity: "Active 5m ago",
    insights: [
      { category: 'risk', text: 'Roll-up: 8-10% cost increase identified in Fabrication sub-room.', icon: '⚠️' },
      { category: 'planning', text: 'Dependency: Bathymetric survey → Reef module locations.', icon: '🔗' },
      { category: 'finance', text: 'Budget utilization is at 45%; variance check required.', icon: '💰' }
    ],
    tasks: [
      { id: 't_dr1', title: 'Weekly Stakeholder Sync', owner: 'Sara', completed: false, dueDate: 'Tomorrow' },
      { id: 't_dr2', title: 'Approve Vendor Selection', owner: 'Jordan', completed: true, dueDate: 'Mar 1' }
    ],
    rooms: [
      {
        id: 'c_dr_gen',
        title: 'Leadership',
        members: [SYSTEM_USERS[0], SYSTEM_USERS[7]],
        messages: [
          createMsg(SYSTEM_USERS[7], "Please review the updated timeline.", 120),
          createMsg(SYSTEM_USERS[7], "We need to sign off on the new budget.", 115),
          createMsg(SYSTEM_USERS[0], "Will do.", 60),
          createMsg(SYSTEM_USERS[7], "Any updates on the environmental permit?", 10),
          createMsg(SYSTEM_USERS[7], "@Rima what is the status of the permit application?", 5)
        ],
        unreadCount: 4
      },
      { id: 'c_dr_tech', title: 'Technical', members: [SYSTEM_USERS[0]], messages: [], unreadCount: 0 },
      {
        id: 'c_dr_finance',
        title: 'Budget',
        members: [SYSTEM_USERS[0], SYSTEM_USERS[8]],
        messages: [
          createMsg(SYSTEM_USERS[8], "FYI: Copper prices are up 5%.", 200),
          createMsg(SYSTEM_USERS[8], "Should we lock in the supplier contract now?", 195)
        ],
        unreadCount: 2
      },
      {
        id: 'c_dr_ops',
        title: 'Operations',
        members: [SYSTEM_USERS[0], SYSTEM_USERS[12]],
        messages: [
          createMsg(SYSTEM_USERS[12], "Site A survey complete.", 600),
          createMsg(SYSTEM_USERS[12], "Site B survey starting tomorrow.", 550),
          createMsg(SYSTEM_USERS[12], "Logistics team needs 2 more vans.", 50)
        ],
        unreadCount: 3
      },
      { id: 'c_dr_conf', title: 'Confidential', members: [SYSTEM_USERS[0]], messages: [], unreadCount: 0, isPrivate: true }
    ]
  },
  {
    id: 'p3_site',
    title: 'Site Deployment – Phase 1',
    description: 'Marine surveys, module locations, and logistics.',
    theme: 'rust',
    parentRoomId: 'p3',
    profileId: 'p_work',
    progress: 55,
    members: [SYSTEM_USERS[0], SYSTEM_USERS[7], SYSTEM_USERS[12]],
    insights: [
      { category: 'planning', text: 'Bathymetric survey 100% complete.', icon: '🌊' },
      { category: 'risk', text: 'Reef module locations need secondary confirmation.', icon: '📍' }
    ],
    messages: [],
    rooms: []
  },
  {
    id: 'p3_vendors',
    title: 'Vendors & Fabrication',
    description: 'Fabrication leads, material costs, and pricing blockers.',
    theme: 'rust',
    parentRoomId: 'p3',
    profileId: 'p_work',
    progress: 30,
    budget: '$120,000',
    members: [SYSTEM_USERS[8], SYSTEM_USERS[10]],
    insights: [
      { category: 'risk', text: 'BLOCKED: 8-10% cost increase if brass materials delayed.', icon: '💸' },
      { category: 'planning', text: 'Module prototype approved by marine team.', icon: '🏗️' }
    ],
    messages: [],
    rooms: []
  },
  {
    id: 'p3_permits',
    title: 'Permits & Compliance',
    description: 'Regulatory filings and authority responses.',
    theme: 'rust',
    parentRoomId: 'p3',
    profileId: 'p_work',
    progress: 15,
    members: [SYSTEM_USERS[0], SYSTEM_USERS[13]],
    insights: [
      { category: 'risk', text: 'Permit A-14 amendment delayed by 2 weeks.', icon: '🏛️' }
    ],
    messages: [],
    rooms: []
  },

  // SCENARIO 5: Startup Founder
  {
    id: 'p5',
    title: 'My Business',
    description: 'Jewelry startup founder brain-dump and collection launch.',
    theme: 'gold',
    profileId: 'p_work',
    progress: 25,
    budget: '$50,000',
    members: [SYSTEM_USERS[0], SYSTEM_USERS[9], SYSTEM_USERS[10], SYSTEM_USERS[11]],
    messages: [],
    lastActivity: "Active 1d ago",
    insights: [
      { category: 'planning', text: 'Dependency: Materials → Pricing → Website.', icon: '🔗' },
      { category: 'finance', text: 'Founders funding utilized: 20%.', icon: '💸' }
    ],
    rooms: [
      { id: 'c_biz_gen', title: 'General', members: [SYSTEM_USERS[0]], messages: [], unreadCount: 0 },
      {
        id: 'c_biz_design',
        title: 'Design',
        members: [SYSTEM_USERS[0], SYSTEM_USERS[9]],
        messages: [
          createMsg(SYSTEM_USERS[9], "Sketches for the new pendant are attached.", 120),
          createMsg(SYSTEM_USERS[9], "Use 18k gold for the prototype?", 115)
        ],
        unreadCount: 2
      },
      { id: 'c_biz_suppliers', title: 'Suppliers', members: [SYSTEM_USERS[0], SYSTEM_USERS[10]], messages: [], unreadCount: 0 },
      {
        id: 'c_biz_marketing',
        title: 'Marketing',
        members: [SYSTEM_USERS[0]],
        messages: [
          createMsg(SYSTEM_USERS[11], "Drafted the launch email. Please review.", 300)
        ],
        unreadCount: 1
      }
    ]
  },
  {
    id: 'p5_suppliers',
    title: 'Suppliers & Materials',
    description: 'Material options, MOQs, and cost implications.',
    theme: 'gold',
    parentRoomId: 'p5',
    profileId: 'p_work',
    progress: 30,
    members: [SYSTEM_USERS[0], SYSTEM_USERS[10]],
    insights: [
      { category: 'finance', text: 'Silver MOQ increased by 15%.', icon: '📉' }
    ],
    messages: [],
    rooms: []
  },
  {
    id: 'p5_design',
    title: 'Design & Collection',
    description: 'Design approvals and revisions log.',
    theme: 'gold',
    parentRoomId: 'p5',
    profileId: 'p_work',
    progress: 50,
    members: [SYSTEM_USERS[0], SYSTEM_USERS[9]],
    insights: [
      { category: 'planning', text: 'Reasons for revision 2: Weight reduction for comfort.', icon: '✍️' }
    ],
    messages: [],
    rooms: []
  },
  {
    id: 'p5_ops',
    title: 'Website & Operations',
    description: 'Product data and checkout blockers.',
    theme: 'gold',
    parentRoomId: 'p5',
    profileId: 'p_work',
    progress: 10,
    members: [SYSTEM_USERS[0], SYSTEM_USERS[11]],
    insights: [
      { category: 'risk', text: 'Checkout gateway test failing in sandbox.', icon: '🛒' }
    ],
    messages: [],
    rooms: []
  },
  {
    id: 'p5_marketing',
    title: 'Social Media & Marketing',
    description: 'Pre-launch ideas and content planning.',
    theme: 'gold',
    parentRoomId: 'p5',
    profileId: 'p_work',
    progress: 5,
    members: [SYSTEM_USERS[0]],
    insights: [
      { category: 'social', text: 'Influencer list for launch being drafted.', icon: '📱' }
    ],
    messages: [],
    rooms: []
  },
  // SCENARIO 6: Global Economics 101 (EDUCATION)
  {
    id: 'p_edu_econ',
    title: 'Global Economics 101',
    description: 'Coursework, study groups, and exam prep for ECON101.',
    theme: 'teal',
    profileId: 'p_edu',
    progress: 75,
    members: [SYSTEM_USERS[0], SYSTEM_USERS[4], SYSTEM_USERS[6]], // Sara, Omar, Salem
    messages: [
      createMsg(SYSTEM_USERS[4], "Can someone explain Isomorphic Utility curves again?", 15)
    ],
    lastActivity: "Active 15m ago",
    insights: [
      { category: 'planning', text: 'Exam scheduled for May 12th.', icon: '📅' },
      { category: 'social', text: 'Study group meeting proposed for Saturday.', icon: '📚' }
    ],
    rooms: [
      {
        id: 'c_econ_gen',
        title: 'General Discussion',
        members: [SYSTEM_USERS[0], SYSTEM_USERS[4], SYSTEM_USERS[6]],
        messages: [
          createMsg(SYSTEM_USERS[4], "Is chapter 4 included in the mid-term?", 1400),
          createMsg(SYSTEM_USERS[6], "Yes, the professor said everything up to supply shocks.", 1380)
        ],
        unreadCount: 0
      },
      {
        id: 'c_econ_study',
        title: 'Study Group',
        members: [SYSTEM_USERS[0], SYSTEM_USERS[4], SYSTEM_USERS[6]],
        messages: [
          createMsg(SYSTEM_USERS[4], "I'll bring the past papers.", 60),
          createMsg(SYSTEM_USERS[6], "I'll bring snacks.", 55),
          createMsg(SYSTEM_USERS[4], "Can someone explain Isomorphic Utility curves again?", 15),
          createMsg(SYSTEM_USERS[0], "I think I have notes on that, will check.", 5)
        ],
        unreadCount: 1 // 1 msg from Omar (15m ago) if we assume I read the others? No, simple logic: count recent from others.
        // Omar (60), Salem (55), Omar (15), Me (5).
        // If I last read at 0, unread is 0.
        // Let's make it 1 unread from Omar.
      },
      {
        id: 'c_econ_tutor',
        title: 'Tutor DMs',
        members: [SYSTEM_USERS[0]],
        messages: [],
        unreadCount: 0,
        isPrivate: true
      }
    ]
  },

  // SCENARIO 7: Q3 Marketing Blitz (WORK)
  {
    id: 'p_work_marketing',
    title: 'Q3 Marketing Blitz',
    description: 'High-intensity campaign planning for the summer launch.',
    theme: 'obsidian',
    profileId: 'p_work',
    progress: 10,
    budget: '$25,000',
    members: [SYSTEM_USERS[0], SYSTEM_USERS[11], SYSTEM_USERS[9], SYSTEM_USERS[13]], // Sara, Lina, Designer, Compliance
    messages: [],
    lastActivity: "Active 2h ago",
    insights: [
      { category: 'risk', text: 'Ad spend approval pending finance review.', icon: '⏳' },
      { category: 'planning', text: 'Asset deliverable list is incomplete.', icon: '📉' }
    ],
    rooms: [
      {
        id: 'c_mkt_ideas',
        title: 'Campaign Ideas',
        members: [SYSTEM_USERS[0], SYSTEM_USERS[11], SYSTEM_USERS[9]],
        messages: [
          createMsg(SYSTEM_USERS[11], "What if we did a 3D reveal?", 120),
          createMsg(SYSTEM_USERS[9], "That exceeds the budget, but looks cool.", 110),
          createMsg(SYSTEM_USERS[11], "Let's mock it up anyway.", 100)
        ],
        unreadCount: 3
      },
      {
        id: 'c_mkt_assets',
        title: 'Assets & Copy',
        members: [SYSTEM_USERS[0], SYSTEM_USERS[9]],
        messages: [],
        unreadCount: 0
      },
      {
        id: 'c_mkt_budget',
        title: 'Budget Allocation',
        members: [SYSTEM_USERS[0]], // Private or restricted?
        messages: [
          createMsg(SYSTEM_USERS[13], "Compliance needs to review the influencer contracts.", 300)
        ],
        unreadCount: 1, // Msg from Compliance
        isPrivate: true
      }
    ]
  },

  // SCENARIO 8: Weekend Hiking Club (LIFE)
  {
    id: 'p_life_hiking',
    title: 'Weekend Hiking Club',
    description: ' coordinating weekly hikes, carpools, and trail discoveries.',
    theme: 'emerald',
    profileId: 'p_life',
    progress: 88,
    members: [SYSTEM_USERS[0], SYSTEM_USERS[2], SYSTEM_USERS[3], SYSTEM_USERS[5]], // Sara, Noora, Hind, Hessa
    messages: [
      createMsg(SYSTEM_USERS[2], "The weather looks perfect for Jebel Jais.", 30)
    ],
    lastActivity: "Active 30m ago",
    insights: [],
    rooms: [
      {
        id: 'c_hike_gen',
        title: 'General',
        members: [SYSTEM_USERS[0], SYSTEM_USERS[2], SYSTEM_USERS[3]],
        messages: [
          createMsg(SYSTEM_USERS[3], "Did everyone get new boots?", 1000)
        ],
        unreadCount: 0
      },
      {
        id: 'c_hike_maps',
        title: 'Trail Maps',
        members: [SYSTEM_USERS[0], SYSTEM_USERS[5]],
        messages: [
          createMsg(SYSTEM_USERS[5], "Downloaded the offline map.", 45),
          createMsg(SYSTEM_USERS[2], "The weather looks perfect for Jebel Jais.", 30),
          createMsg(SYSTEM_USERS[2], "Meeting point at 5 AM?", 25)
        ],
        unreadCount: 2
      },
      {
        id: 'c_hike_carpool',
        title: 'Carpool Logistics',
        members: [SYSTEM_USERS[0]],
        messages: [],
        unreadCount: 0,
        isPrivate: true
      }
    ]
  }
];
