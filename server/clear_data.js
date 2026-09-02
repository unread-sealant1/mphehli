const { connectDB, getDB, client } = require('./config/db');
require('dotenv').config();

async function clearFakeData() {
  try {
    await connectDB();
    const db = getDB();

    const collectionsToClear = ['fixtures', 'news'];

    for (const col of collectionsToClear) {
      await db.collection(col).deleteMany({});
      console.log(`Cleared ${col} collection`);
    }

    console.log('Fake fixtures and news removed successfully!');
  } catch (error) {
    console.error('Error clearing data:', error);
  } finally {
    await client.close();
  }
}

clearFakeData();
