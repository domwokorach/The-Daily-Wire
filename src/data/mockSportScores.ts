export interface ScoreFixture {
  id: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  live: boolean;
}

export const FIXTURES: ScoreFixture[] = [
  {
    id: 'm1',
    competition: 'Premier Cup',
    homeTeam: 'Riverside FC',
    awayTeam: 'Harbor United',
    homeScore: 2,
    awayScore: 1,
    status: "78'",
    live: true,
  },
  {
    id: 'm2',
    competition: 'Premier Cup',
    homeTeam: 'North Athletic',
    awayTeam: 'City Rovers',
    homeScore: 0,
    awayScore: 0,
    status: "34'",
    live: true,
  },
  {
    id: 'm3',
    competition: 'National League',
    homeTeam: 'Summit Town',
    awayTeam: 'Vale Wanderers',
    homeScore: 3,
    awayScore: 2,
    status: 'Full Time',
    live: false,
  },
  {
    id: 'm4',
    competition: 'National League',
    homeTeam: 'Eastport',
    awayTeam: 'Fairview',
    homeScore: null,
    awayScore: null,
    status: 'Sat 15:00',
    live: false,
  },
];
