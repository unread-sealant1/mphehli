const { connectDB, getDB, client } = require('./config/db');
require('dotenv').config();

async function seedSettings() {
  try {
    await connectDB();
    const db = getDB();

    const settings = [
      {
        section: 'about',
        values: {
          historyTitle: 'Where It All Began',
          historyText: 'Mphehli All Stars Football Club was founded in 2022 by Head Coach Themba Mabaso and a dedicated group of football lovers from the local community. Based in Greater Mayfair, operating under the Johannesburg Football Association in Gauteng (Club ID: 14D1IPI), what began as an idea — a conviction that the Mphehli community deserved a football club to call their own — quickly became a reality.',
          identityTitle: 'Our Identity',
          identityBody: 'Mphehli All Stars is a community football club built on the principles of excellence, inclusivity, and ambition. We represent every person in this community who has ever dared to dream big. Our blue and white colours are worn with honour.',
          missionTitle: 'Our Mission',
          missionBody: 'To build a competitive, professional football club that develops talent, inspires the community, and achieves sustained success on the regional and national stage. We do not accept mediocrity. We compete to win.',
          visionTitle: 'Our Vision',
          visionBody: 'To be recognised as the premier community football club in the region by 2028. To have a fully equipped training facility, a thriving youth academy, and a first team competing at the highest level of regional football.',
        }
      },
      {
        section: 'contact',
        values: {
          email: 'info@mphehliallstars.co.za',
          phone: '+27 11 123 4567',
          address: 'Trezona Park, Florida, Johannesburg',
        }
      }
    ];

    for (const setting of settings) {
      await db.collection('settings').updateOne(
        { section: setting.section },
        { $set: setting },
        { upsert: true }
      );
    }

    console.log('Settings seeded successfully!');
  } catch (error) {
    console.error('Error seeding settings:', error);
  } finally {
    await client.close();
  }
}

seedSettings();
