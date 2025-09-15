import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

router.post('/', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('GEMINI_API_KEY environment variable is not set.');
    return res.status(500).json({ message: 'Server configuration error: API key not found.' });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ message: 'Bad Request: A "prompt" string is required in the request body.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return res.status(500).json({ message: 'Internal Server Error: Failed to generate content from Gemini API.' });
  }
});

export default router;
