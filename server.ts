import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // OpenAI Client Initialization (Lazy)
  let openai: OpenAI | null = null;
  const getOpenAI = () => {
    if (!openai) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OPENAI_API_KEY environment variable is required");
      }
      openai = new OpenAI({ apiKey });
    }
    return openai;
  };

  // API route for AI Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      const client = getOpenAI();

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini", // Cost-effective model
        messages: [
          { role: "system", content: "You are a luxury futuristic AI assistant for calculations and general queries. Your personality is elegant, tech-forward, and helpful. Use clear, concise language." },
          ...messages
        ],
      });

      res.json({ content: response.choices[0].message.content });
    } catch (error: any) {
      console.error("OpenAI Error:", error);
      res.status(500).json({ error: error.message || "Failed to get AI response" });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
