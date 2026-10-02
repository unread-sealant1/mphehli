export interface Fixture {
  id: number;
  opponent: string;
  date: string;
  location: string;
  result?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  homeAway: boolean;
  createdAt?: string;
}
