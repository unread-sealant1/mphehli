const { connectDB, getDB, client } = require('./config/db');

async function seed() {
  try {
    await connectDB();
    const db = getDB();
    
    const content = {
      home: {
        heroTitle: "Mphehli All Stars",
        heroSub: "Founded 2022 · Mphehli, South Africa · Champions 2025/26",
        heroQuote: "Cometh the hour, Cometh the man.",
        storyTitle: "Built on Belief",
        storyText: "Mphehli All Stars was founded in 2022 by a group of passionate individuals who believed that their community deserved more than just a football club — it deserved a symbol of excellence, ambition, and unity.",
        storyTextSecondary: "Three years on, that belief has been turned into results. On the pitch and off it, the All Stars continue to grow, inspire, and prove that when the hour comes — the men and women of Mphehli are ready.",
        timeline: [
          { year: '2022', event: 'Club Founded' },
          { year: '2023', event: 'GMLFA Premier League 3rd' },
          { year: '2024', event: 'GMLFA Premier League 5th' },
          { year: '2025', event: 'League Champions' },
        ]
      },
      about: {
        values: [
          { name: 'Discipline', desc: 'We hold ourselves to the highest standards, on and off the pitch.' },
          { name: 'Teamwork', desc: 'Together we achieve what none of us can achieve alone.' },
          { name: 'Respect', desc: 'We respect each other, our opponents, officials, and our community.' },
          { name: 'Ambition', desc: 'We set our sights high and pursue our goals relentlessly.' },
          { name: 'Community', desc: 'We exist to serve and inspire the people of Mphehli.' },
        ],
        timeline: [
          { year: '2022', title: 'The Foundation', description: 'Mphehli All Stars is founded by Coach Themba Mabaso and a group of passionate community footballers. The first training session takes place on a Sunday morning with eleven players and one ball.' },
          { year: 'Late 2022', title: 'First Competitive Match', description: 'The All Stars play their first official competitive fixture. A 2-1 victory sends a message — this club is here to compete.' },
          { year: '2023', title: 'Building the Foundation', description: 'The squad grows to twenty players. The club registers with the Regional Football Association and completes its first full league season in the GMLFA Premier League, finishing 3rd place in the 2023/2024 season.' },
          { year: '2024', title: 'A Culture Forms', description: 'Player quality increases and results improve. The All Stars continue their ascent in the GMLFA Premier League, securing a 5th place finish for the 2024/2025 season as a genuine club culture emerges.' },
          { year: '2025', title: 'Champions of the Region', description: 'The most ambitious chapter yet. The All Stars dominate the SAFA Johannesburg Hollywoodbets Regional League for the 2025/2026 season, finishing in 1st place as League Champions.' },
        ]
      },
      contact: {
        socials: [
          { name: 'Facebook', handle: '@MphehliAllStars', href: 'https://facebook.com/MphehliAllStars' },
          { name: 'Instagram', handle: '@mphehliallstars', href: 'https://instagram.com/mphehliallstars' },
          { name: 'TikTok', handle: '@mphehliallstars', href: 'https://tiktok.com/@mphehliallstars' },
          { name: 'X (Twitter)', handle: '@MphehliAllStars', href: 'https://x.com/MphehliAllStars' },
          { name: 'WhatsApp', handle: '+27 00 000 0000', href: 'https://wa.me/27000000000' },
        ]
      }
    };

    for (const [key, value] of Object.entries(content)) {
      await db.collection('site_content').updateOne(
        { page: key },
        { $set: value },
        { upsert: true }
      );
    }
    console.log('Site content seeded successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await client.close();
  }
}

seed();
