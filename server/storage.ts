import {
  type User,
  type InsertUser,
  type GazpachoCounter,
  type InsertCounter,
} from '@shared/schema';
import { randomUUID } from 'crypto';

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getGazpachoCounter(): Promise<GazpachoCounter>;
  incrementGazpachoCounter(): Promise<GazpachoCounter>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private counter: GazpachoCounter;

  constructor() {
    this.users = new Map();
    this.counter = {
      id: randomUUID(),
      count: 2847,
      updatedAt: new Date(),
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGazpachoCounter(): Promise<GazpachoCounter> {
    return this.counter;
  }

  async incrementGazpachoCounter(): Promise<GazpachoCounter> {
    this.counter = {
      ...this.counter,
      count: this.counter.count + 1,
      updatedAt: new Date(),
    };
    return this.counter;
  }
}

export const storage = new MemStorage();
