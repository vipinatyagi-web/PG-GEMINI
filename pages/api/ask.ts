import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const fallbackResponses: { [key: string]: string } = {
  career: "Career mein saflta ke liye, apne skills ko hamesha behtar banate rahein.",
  love: "Prem sambandhon mein vishwas aur imandari sabse zaroori hai.",
  default: "Har samasya ka samadhan dhairya aur sahi disha mein kiye gaye prayas se milta hai."
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    const lowerCaseMessage = message.toLowerCase();
    let response = fallbackResponses.default;
    if (lowerCaseMessage.includes('career')) response = fallbackResponses.career;
    else if (lowerCaseMessage.includes('love')) response = fallbackResponses.love;
    await new Promise(resolve => setTimeout(resolve, 500));
    return res.status(200).json({ reply: response });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are 'AI Pandit', a wise astrologer. You provide short, practical advice in simple Hinglish. Keep answers to 2 sentences." },
        { role: "user", content: message }
      ],
      max_tokens: 80,
    });
    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'AI Pandit abhi dhyan me hain.' });
  }
}
