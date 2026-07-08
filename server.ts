import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fetch from "node-fetch";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy TMDb API requests
  app.get("/api/tmdb/*", async (req, res) => {
    try {
      const tmdbPath = req.params[0];
      const tmdbApiKey = process.env.TMDB_API_KEY || "bf9139c03c93a2f46e389f8907fb107d";
      
      if (!tmdbApiKey) {
        return res.status(500).json({ error: "TMDB_API_KEY is not configured on the server." });
      }

      const queryString = new URLSearchParams(req.query as Record<string, string>).toString();
      const url = `https://api.themoviedb.org/3/${tmdbPath}?api_key=${tmdbApiKey}&${queryString}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      res.json(data);
    } catch (error) {
      console.error("TMDb API Error:", error);
      res.status(500).json({ error: "Failed to fetch from TMDb" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
