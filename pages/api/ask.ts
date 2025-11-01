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

    // Simple fallback logic (Hinglish tone)
    let reply = "Sab theek ho jayega. Apna focus banaye rakhiye 🙏";
    if (lowerMsg.includes('career')) {
      reply = "Career mein consistency aur network dono zaruri hain. Mehnat aur patience se naya mauka milega.";
    } else if (lowerMsg.includes('love')) {
      reply = "Dil se baat karein aur samjhauta ka mool mantra yaad rakhein 💫";
    } else if (lowerMsg.includes('money') || lowerMsg.includes('finance')) {
      reply = "Kharch kam, investment badhayein. 70-20-10 rule follow karein 💰";
    } else if (lowerMsg.includes('health')) {
      reply = "Apni neend aur diet pe dhyaan dein, body aur mind dono balance me rahenge 🌿";
    } else if (lowerMsg.includes('stress') || lowerMsg.includes('tension')) {
      reply = "5-min deep breathing karein aur Surya ko jal chadhayein ☀️";
    }

    await new Promise(resolve => setTimeout(resolve, 600)); // thoda human delay

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
