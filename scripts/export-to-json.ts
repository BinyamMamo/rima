import { getAllWorkspaces, getAllProfiles, getAllUsers, initializeDatabase } from '../lib/db';
import fs from 'fs';
import path from 'path';

function main() {
  console.log('📤 Exporting database to JSON...\n');

  initializeDatabase();

  const profiles = getAllProfiles();
  const users = getAllUsers();
  const workspaces = getAllWorkspaces();

  const data = {
    profiles,
    users,
    workspaces,
    exportedAt: new Date().toISOString(),
  };

  const outputPath = path.join(process.cwd(), 'lib', 'data.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log('✅ Data exported successfully!');
  console.log(`📁 Output: ${outputPath}`);
  console.log('\n📊 Export Summary:');
  console.log(`   - Profiles: ${profiles.length}`);
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Workspaces: ${workspaces.length}`);
  console.log(`   - Total Rooms: ${workspaces.reduce((sum, w) => sum + w.rooms.length, 0)}`);
  console.log(`   - Total Messages: ${workspaces.reduce((sum, w) =>
    sum + w.messages.length + w.rooms.reduce((rsum, r) => rsum + r.messages.length, 0), 0
  )}`);
}

main();
