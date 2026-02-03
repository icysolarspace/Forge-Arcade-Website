
export type Genre = 
  | 'Action' 
  | 'Arcade' 
  | 'Puzzle' 
  | 'Space' 
  | 'Adventure' 
  | 'Racing' 
  | 'Strategy' 
  | 'RPG' 
  | 'Simulation' 
  | 'Sports' 
  | 'Horror' 
  | 'Rhythm';

export const GENRES: Genre[] = [
  'Action', 'Arcade', 'Puzzle', 'Space', 'Adventure', 'Racing', 
  'Strategy', 'RPG', 'Simulation', 'Sports', 'Horror', 'Rhythm'
];

export interface Game {
  id: string;
  title: string;
  description: string;
  creator: string;
  genre: Genre;
  htmlCode: string;
  coverImage?: string;
  createdAt: number;
  plays: number;
  reactions: Record<string, number>;
  userReactions?: Record<string, string>; // Maps username to emoji
  moderated?: boolean; // Indicates if the game passed safety checks
}

export interface User {
  username: string;
  joinedAt: number;
  profilePicture?: string;
}

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh';

export interface AppState {
  currentUser: User | null;
  allUsers: User[]; 
  games: Game[];
  language: Language;
  codingKey?: string;
  imageKey?: string;
}
