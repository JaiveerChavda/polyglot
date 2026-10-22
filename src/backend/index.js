import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { checkEnvironment } from '../../utils.js';

checkEnvironment();

const app = express();
const port = 3000;
const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/translate', async (req, res) => {
  try {
    const { sourceText, selectedLanguage } = req.body;

    // 1. Guardrails & Validation
    if (!sourceText || typeof sourceText !== 'string' || !sourceText.trim()) {
      return res.status(400).json({ error: "Invalid input: 'sourceText' is required." });
    }
    if (!selectedLanguage || typeof selectedLanguage !== 'string' || selectedLanguage.trim().length !== 2) {
      return res.status(400).json({ error: "Invalid input: 'selectedLanguage' must be a 2-letter ISO 639-1 code." });
    }

    const systemPrompt = `You are an expert, multilingual AI translator specializing in natural, context-aware translations. 

Your task is to translate the user's provided "source text" into the target language specified by its ISO 639-1 two-letter code (e.g., 'en' for English, 'es' for Spanish, 'fr' for French, 'zh' for Chinese).

Strictly adhere to the following rules:
1. Natural Translation: Do NOT perform a literal, word-by-word translation. Instead, translate the core meaning, intent, tone, and cultural nuances of the source text so that it sounds completely natural to a native speaker of the target language.
2. Output Format: Return ONLY the final translated text. Do not include any conversational filler, explanations, introductory remarks, notes, or punctuation marks outside the translated text.
3. Errors & Ambiguity: If the target ISO code is missing or completely invalid, default to English ('en') translation. If the source text contains ambiguous idioms, choose the most widely accepted natural equivalent in the target language.
     `;

    // const userPrompt = `${systemPrompt} This is the text to translate: "${sourceText}" and this is the target language : ${selectedLanguage}`;
    const userPrompt = `Target Language Code: ${selectedLanguage.trim().toLowerCase()}\nSource Text: ${sourceText.trim()}`;
    const response = await openai.responses.create({
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      instructions: systemPrompt,
      input: userPrompt,
      temperature: 0.3,
      stream: false
    });

    const translatedText = response.output_text ? response.output_text.trim() : "";

    return res.status(200).json({
      success: true,
      source: sourceText,
      language: selectedLanguage,
      translation: translatedText
    });
  } catch (error) {
    console.error("Translation API Error:", error);
    return res.status(500).json({
      success: false,
      error: "An internal server error occurred while processing the translation."
    });
  }

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});