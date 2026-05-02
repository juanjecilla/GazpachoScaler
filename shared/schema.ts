// Type definitions for shared data structures.
// Server-side Drizzle ORM schema is in server/schema.ts (archived, not used in production).

export interface User {
  id: string;
  username: string;
  password: string;
}

export interface GazpachoCounter {
  id: string;
  count: number;
  updatedAt: Date;
}

export type InsertUser = Omit<User, 'id'>;
export type InsertCounter = Pick<GazpachoCounter, 'count'>;
