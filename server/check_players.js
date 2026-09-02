const { connectDB, getDB, client } = require('./config/db');
require('dotenv').config();

async function checkPlayers() {
  try {
    await connectDB();
    const db = getDB();
    const players = await db.collection('players').find().toArray();
    console.log('Current players in DB:');
    console.log(JSON.stringify(players, null, 2));
  } catch (error) {
    console.error('Error fetching players:', error);
  } finally {
    await client.close();
  }
}

checkPlayers();
