import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fetch from "node-fetch";
import fs from "fs";
import crypto from "crypto";

const app = express();
const PORT = 3000;
app.use(express.json());

const CONFIG_FILE = path.join(process.cwd(), "admin_data.json");
let adminData = {
  tmdbApiKey: process.env.TMDB_API_KEY || "bf9139c03c93a2f46e389f8907fb107d",
  admins: {} as Record<string, string> // username -> password hash
};

if (fs.existsSync(CONFIG_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    adminData = { ...adminData, ...data };
  } catch (e) {
    console.error("Failed to read admin data", e);
  }
}

const saveAdminData = () => {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(adminData, null, 2));
};

const hashPassword = (password: string) => crypto.createHash("sha256").update(password).digest("hex");

// Admin API
app.post("/api/admin/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password required" });
  if (adminData.admins[username]) return res.status(400).json({ error: "Admin already exists" });
  
  adminData.admins[username] = hashPassword(password);
  saveAdminData();
  res.json({ success: true });
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password required" });
  
  if (adminData.admins[username] && adminData.admins[username] === hashPassword(password)) {
    res.json({ success: true, token: username }); // Simple token for this demo
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/api/admin/config", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !adminData.admins[auth]) return res.status(401).json({ error: "Unauthorized" });
  res.json({ tmdbApiKey: adminData.tmdbApiKey });
});

app.post("/api/admin/config", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !adminData.admins[auth]) return res.status(401).json({ error: "Unauthorized" });
  
  const { tmdbApiKey } = req.body;
  if (tmdbApiKey !== undefined) {
    adminData.tmdbApiKey = tmdbApiKey;
    saveAdminData();
  }
  res.json({ success: true });
});

// Proxy TMDb API requests
app.get("/api/tmdb/*", async (req, res) => {
  try {
    const tmdbPath = req.params[0];
    const tmdbApiKey = adminData.tmdbApiKey;
    
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

async function startServer() {
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
