import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Translation endpoint for custom languages requested by user
app.post('/api/translate', async (req, res) => {
  try {
    const { targetLanguage, templateStrings } = req.body;
    if (!targetLanguage || !templateStrings) {
      return res.status(400).json({ error: 'Missing targetLanguage or templateStrings' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are a professional software localization specialist. Translate the following key-value pairs of UI text strings into the language "${targetLanguage}".
Maintain natural, polite, and encouraging tone suitable for a daily planner application.
Preserve emojis where appropriate.
Return ONLY valid JSON matching the exact same keys:
${JSON.stringify(templateStrings, null, 2)}`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const translatedText = response.text?.trim() || '{}';
    const parsed = JSON.parse(translatedText);
    res.json({ translated: parsed });
  } catch (err: any) {
    console.error('Translation error:', err);
    res.status(500).json({ error: err.message || 'Translation failed' });
  }
});

// Mount Vite middleware in development or serve static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
