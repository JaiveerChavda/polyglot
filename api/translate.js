import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!process.env.AI_URL || !process.env.AI_MODEL || !process.env.AI_KEY) {
    console.error('Missing AI_URL, AI_MODEL, or AI_KEY environment variable.');
    return res.status(500).json({ error: 'Translation service is not configured.' });
  }

  const { sourceText, selectedLanguage } = req.body ?? {};

  if (!sourceText || typeof sourceText !== 'string' || !sourceText.trim()) {
    return res.status(400).json({ error: "Invalid input: 'sourceText' is required." });
  }

  if (!selectedLanguage || typeof selectedLanguage !== 'string' || selectedLanguage.trim().length !== 2) {
    return res.status(400).json({ error: "Invalid input: 'selectedLanguage' must be a 2-letter ISO 639-1 code." });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.AI_KEY,
      baseURL: process.env.AI_URL,
    });

    const response = await openai.responses.create({
      model: process.env.AI_MODEL,
      instructions: `You are an expert, multilingual AI translator specializing in natural, context-aware translations.

Translate the user's text into the target language. Return ONLY the final translated text, without explanations or conversational filler.`,
      input: `Target Language Code: ${selectedLanguage.trim().toLowerCase()}\nSource Text: ${sourceText.trim()}`,
      temperature: 0.3,
      stream: false,
    });

    return res.status(200).json({
      success: true,
      source: sourceText,
      language: selectedLanguage,
      translation: response.output_text?.trim() ?? '',
    });
  } catch (error) {
    console.error('Translation API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing the translation.',
    });
  }
}
