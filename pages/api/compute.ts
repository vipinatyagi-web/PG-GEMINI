// pages/api/compute.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']); 
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const body = (req.body || {}) as any;
  const {
    fullName='User', dob='—', tob='—', birthplace='—',
    lat='—', lon='—', tz_offset_minutes=330,
    gender='—', relationshipStatus='—', careerGoal='—', topConcern='—',
    freeQuestion='', background=''
  } = body;

  const now = new Date();
  const addDays = (n:number)=> { const d=new Date(now); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };
  const windows = [
    { label: "Window A", from: addDays(3),  to: addDays(14)  },
    { label: "Window B", from: addDays(21), to: addDays(35)  },
    { label: "Window C", from: addDays(47), to: addDays(63)  },
    { label: "Window D", from: addDays(70), to: addDays(90)  },
  ];

  const mkPara = (topic:string)=>(
    `${fullName}, aapki details (DOB ${dob}, TOB ${tob}, Place ${birthplace}, TZ ${tz_offset_minutes}) ko dekhte hue ` +
    `${topic} area me is waqt “grounded action + patience” sabse bada mantra hai. ` +
    `Agar aapka focus “${topConcern}” ya goal “${careerGoal}” par hai to iss mahine discipline aur communication par khaas dhyaan rakhein.`
  );

  let aiNote: string | null = null;
  try {
    if (process.env.OPENAI_API_KEY) {
      const g = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Tum ek gyani Hindu pandit ho. Tone: warm, precise, Hinglish." },
            { role: "user", content: `User: ${fullName}\nDOB: ${dob}\nTOB: ${tob}\nPlace: ${birthplace}\nLatLon: ${lat},${lon}\nTZ: ${tz_offset_minutes}\nGender:${gender}\nRS:${relationshipStatus}\nGoal:${careerGoal}\nConcern:${topConcern}\nQuestion:${freeQuestion}\nBackground:${background}\n\nEk 5-6 line ka seedha paragraph do jo user ko personalized lage (career/love/money/health me se jo question ke hisaab se ho).` }
          ],
          temperature: 0.7,
          max_tokens: 220
        })
      });
      const j = await g.json();
      aiNote = j?.choices?.[0]?.message?.content || null;
    }
  } catch(_) {}

  const report = {/* 👈 same as JS version ka object yahan bana do (upar wala hi copy) */};

  return res.status(200).json(report);
}
