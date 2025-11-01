import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { message } = req.body;
  // Simple fallback logic
  const response = message.toLowerCase().includes('career') ? "Career mein mehnat karein." : "Sab theek ho jayega.";
  await new Promise(resolve => setTimeout(resolve, 500));
  res.status(200).json({ reply: response });
}
