import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding multi-team database...');

  // 1. Seed Club Settings
  await prisma.clubSettings.upsert({
    where: { id: 1 },
    update: {
      clubName: 'MPHEHLI ALL STARS',
      slogan: 'COMETH THE HOUR, COMETH THE MAN.',
      identityStatement: 'ONE CLUB. MULTIPLE TEAMS. ONE IDENTITY.',
      contactEmail: 'info@mphehliallstarsfc.com',
    },
    create: {
      id: 1,
      clubName: 'MPHEHLI ALL STARS',
      slogan: 'COMETH THE HOUR, COMETH THE MAN.',
      identityStatement: 'ONE CLUB. MULTIPLE TEAMS. ONE IDENTITY.',
      contactEmail: 'info@mphehliallstarsfc.com',
    },
  });

  // 2. Seed Teams
  const teams = [
    {
      name: 'MPHEHLI UNITED',
      slug: 'mphehli-united',
      identity: 'TEAM 01 / BLUE',
      competition: 'ABC MOTSEPE LEAGUE',
    },
    {
      name: 'MPHEHLI ALL STARS MEN',
      slug: 'all-stars-men',
      identity: 'TEAM 02 / RED',
      competition: 'REGIONAL LEAGUE',
    },
    {
      name: 'MPHEHLI ALL STARS LADIES',
      slug: 'all-stars-ladies',
      identity: 'TEAM 03 / RED + WHITE',
      competition: 'SASOL LEAGUE',
    },
  ];

  for (const teamData of teams) {
    await prisma.team.upsert({
      where: { slug: teamData.slug },
      update: teamData,
      create: teamData,
    });
  }

  console.log('✅ Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
