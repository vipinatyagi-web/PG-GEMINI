export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'Message missing in request body.' });
    }

    const lowerMsg = message.toLowerCase();

    // Simple Hinglish logic (fallback)
    let reply = "Sab theek ho jayega 🙏 Apna focus banaye rakhiye.";
    if (lowerMsg.includes('career')) {
      reply = "Career mein mehnat karein, consistency rakhein. Naye mauke jaldi milenge 💼";
    } else if (lowerMsg.includes('love')) {
      reply = "Rishton mein communication aur patience sabse bada mantra hai 💖";
    } else if (lowerMsg.includes('money') || lowerMsg.includes('finance')) {
      reply = "Paise ko sambhalke kharch karein, aur investment discipline banayein 💰";
    } else if (lowerMsg.includes('health')) {
      reply = "Health pe dhyaan dein — neend aur hydration par focus karein 🌿";
    } else if (lowerMsg.includes('stress') || lowerMsg.includes('tension')) {
      reply = "Deep breathing karein, Om ka jap karein aur Surya ko jal chadhayein ☀️";
    }

    await new Promise(resolve => setTimeout(resolve, 500)); // simulate realistic delay

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
