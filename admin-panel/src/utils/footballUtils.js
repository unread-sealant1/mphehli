export function getResult(fixture) {
  if (!fixture || fixture.status !== 'completed' || fixture.homeScore === undefined || fixture.awayScore === undefined) return null;
  const isHome = fixture.homeTeam === 'Mphehli All Stars';
  const mphehliScore = isHome ? fixture.homeScore : fixture.awayScore;
  const opponentScore = isHome ? fixture.awayScore : fixture.homeScore;
  if (mphehliScore > opponentScore) return 'WIN';
  if (mphehliScore === opponentScore) return 'DRAW';
  return 'LOSS';
}

export function getOpponent(fixture) {
  if (!fixture) return '';
  return fixture.homeTeam === 'Mphehli All Stars' ? fixture.awayTeam : fixture.homeTeam;
}
