/**
 * Sportsbit Synthetic Data Generator
 * Generates realistic, correlated data for Strikers, Midfielders, Defenders,
 * Clubs, Matches, and Spatial Tracking Coordinates using a fixed seed for reproducibility.
 */
import * as fs from 'fs';
import * as path from 'path';

function pseudoRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export function generateSyntheticDataset(seed = 42) {
  const rand = pseudoRandom(seed);

  const positions = ['ST', 'CAM', 'CM', 'CDM', 'CB', 'LB', 'RB', 'LW', 'RW'];
  const players: any[] = [];

  for (let i = 1; i <= 100; i++) {
    const pos = positions[i % positions.length];
    const isStriker = pos === 'ST' || pos === 'LW' || pos === 'RW';
    const isMidfielder = pos === 'CAM' || pos === 'CM' || pos === 'CDM';
    const isDefender = pos === 'CB' || pos === 'LB' || pos === 'RB';

    const matchesPlayed = Math.floor(15 + rand() * 20);
    const minutesPlayed = matchesPlayed * (60 + Math.floor(rand() * 30));

    const shots = isStriker ? Math.floor(30 + rand() * 50) : isMidfielder ? Math.floor(15 + rand() * 25) : Math.floor(2 + rand() * 10);
    const shotsOnTarget = Math.floor(shots * (0.4 + rand() * 0.3));
    const goals = Math.floor(shotsOnTarget * (0.3 + rand() * 0.4));
    const assists = isMidfielder ? Math.floor(5 + rand() * 10) : isStriker ? Math.floor(3 + rand() * 7) : Math.floor(0 + rand() * 3);

    const passes = Math.floor((isMidfielder ? 800 : isDefender ? 600 : 400) + rand() * 400);
    const passAccuracy = Number((72 + rand() * 22).toFixed(1));
    const keyPasses = isMidfielder ? Math.floor(20 + rand() * 30) : isStriker ? Math.floor(10 + rand() * 20) : Math.floor(2 + rand() * 8);

    const tackles = isDefender ? Math.floor(40 + rand() * 50) : isMidfielder ? Math.floor(25 + rand() * 35) : Math.floor(5 + rand() * 15);
    const interceptions = isDefender ? Math.floor(35 + rand() * 45) : isMidfielder ? Math.floor(20 + rand() * 30) : Math.floor(2 + rand() * 10);

    const distanceCovered = Number((9.5 + rand() * 3.0).toFixed(1)); // km
    const maxSpeed = Number((28.5 + rand() * 6.0).toFixed(1));       // km/h
    const sprintCount = Math.floor(15 + rand() * 25);

    players.push({
      id: `p-${i}`,
      playerName: `Player ${i}`,
      position: pos,
      age: Math.floor(18 + rand() * 16),
      matchesPlayed,
      minutesPlayed,
      goals,
      assists,
      shots,
      shotsOnTarget,
      passes,
      passAccuracy,
      keyPasses,
      tackles,
      interceptions,
      distanceCovered,
      maxSpeed,
      sprintCount,
    });
  }

  const dataset = {
    generatedAt: new Date().toISOString(),
    seed,
    dataType: 'SYNTHETIC_DATA',
    disclaimer: 'SYNTHETIC DATA - Generated for model pipeline validation',
    totalPlayers: players.length,
    players,
  };

  const outputDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(path.join(outputDir, 'synthetic-dataset.json'), JSON.stringify(dataset, null, 2));
  console.log(`[ML] Synthetic dataset successfully generated (${players.length} records). Saved to data/synthetic-dataset.json`);

  return dataset;
}

if (require.main === module) {
  generateSyntheticDataset();
}
