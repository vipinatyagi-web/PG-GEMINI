// pages/api/ask.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'Message missing in request body.' });

    const lower = String(message).toLowerCase();
    let reply = 'Sab theek ho jayega 🙏 Apna focus banaye rakhiye.';
    if (lower.includes('career')) {
      reply = 'Career mein mehnat + consistency + networking — naye mauke milenge 💼';
    } else if (lower.includes('love')) {
      reply = 'Rishton mein communication aur patience sabse bada mantra hai 💖';
    } else if (lower.includes('money') || lower.includes('finance')) {
      reply = '70-20-10 rule follow karein, subscriptions review karein, D+1 auto 10% transfer 💰';
    } else if (lower.includes('health')) {
      reply = 'Neend + hydration + 3PM walk — energy stable rahegi 🌿';
    } else if (lower.includes('stress') || lower.includes('tension')) {
      reply = '5-min deep breathing, Om ka jap, aur Surya ko jal chadhayein ☀️';
    }

    await new Promise((r) => setTimeout(r, 500));
    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}
