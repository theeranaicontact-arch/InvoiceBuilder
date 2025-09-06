import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Since we're using the Google Apps Script API directly from the frontend,
  // we don't need any backend routes for this application.
  // All API calls are made directly to the external API.
  
  // Health check endpoint for monitoring
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      message: "Receipt API proxy is running" 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
