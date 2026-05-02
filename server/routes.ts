import type { Express } from 'express';
import { createServer, type Server } from 'http';
import { storage } from './storage';

export async function registerRoutes(app: Express): Promise<Server> {
  // Get gazpacho counter
  app.get('/api/gazpacho/counter', async (req, res) => {
    try {
      const counter = await storage.getGazpachoCounter();
      res.json(counter);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get counter' });
    }
  });

  // Increment gazpacho counter
  app.post('/api/gazpacho/counter/increment', async (req, res) => {
    try {
      const counter = await storage.incrementGazpachoCounter();
      res.json(counter);
    } catch (error) {
      res.status(500).json({ message: 'Failed to increment counter' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
