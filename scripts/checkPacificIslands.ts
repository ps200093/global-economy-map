import { connectToDatabase, closeDatabaseConnection } from '../lib/mongodb.js';

(async () => {
  try {
    const { db } = await connectToDatabase();
    const countries = await db.collection('CountryBasic').find({ 
      name: { $in: ['Nauru', 'Tuvalu', 'Fiji', 'Tonga', 'Samoa', 'Kiribati'] } 
    }).toArray();
    
    console.log('\n태평양 섬나라 좌표 정보:\n');
    countries.forEach(c => {
      console.log(`${c.name} (${c.iso3}): [${c.coordinates[0]}, ${c.coordinates[1]}]`);
    });
    
    await closeDatabaseConnection();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();

