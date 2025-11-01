import type { NextApiRequest, NextApiResponse } from 'next';

// This is a mock AI engine. It uses rule-based logic to generate a personalized report.
const generateHinglishReport = (formData: any) => {
  const { fullName, gender, relationshipStatus, careerGoal, topConcern } = formData;
  const tone = "Aaj ka tone hai: practical aur motivational. Universe aapke saath hai, bas focus rakhein.";
  let careerHeadline = "Career ka Grah: Mehnat se Safalta, Focus se Tarakki!";
  if (careerGoal === "promotion") careerHeadline = "Promotion Yog: Sahi Samay par Sahi Kadam aapko aage le jayega!";
  else if (careerGoal === "job_change") careerHeadline = "Naukri Badlav Ke Sanket: Naye Raaste, Nayi Oonchaiyan!";

  return {
    meta: { name: fullName, dob: formData.dob, tob: formData.tob, location: formData.birthplace },
    summary: { tone: tone, core_focus: `Aane wale 3 mahine aapke liye '${topConcern}' par focus karne ke liye sabse anukool hain.` },
    sections: {
      career: {
        headline: careerHeadline,
        indicators: "Shani ki sthiti thodi challenging ho sakti hai, lekin Guru ka support aapko discipline aur patience dega.",
        forensic: "Aapki kundali mein Budh (Mercury) ka prabhav communication ko strong banata hai. Iska istemal meetings aur interviews mein karein.",
        pinpoint: "Monday se Wednesday communication ke liye best hain. Saturday ko naye kaam shuru karne se bachein.",
        actions: { today: "Apne 5 saal ke career goal ko ek paper par likhein.", seven_days: "Apne LinkedIn profile ko update karein.", ninety_days: "Ek naya skill seekhna shuru karein." },
        confidence: "High",
      },
      love: {
        headline: relationshipStatus === 'single' ? "Naye Rishtey ki Aahat: Dil ke Darwaze khule rakhein!" : "Rishton mein Gehrai: Samajh aur Pyaar se har pal ko jeetein!",
        indicators: "Shukra (Venus) ki sthiti prem sambandhon mein madhurta la rahi hai. Communication gap se bachein.",
        forensic: "Agar single hain, to kisi social gathering mein kisi khaas se mulakat ho sakti hai. Jo relationship mein hain, unke liye yeh samay ek doosre ko behtar samajhne ka hai.",
        pinpoint: "Full Moon (Purnima) ke aas paas emotional conversations ke liye samay anukool hai.",
        actions: { today: "Apne partner ko ek heartfelt compliment dein.", seven_days: "Ek 'date night' plan karein.", ninety_days: "Relationship goals par apne partner se baat karein." },
        confidence: "Medium",
      },
    },
    remedies: [{ name: "Surya Ko Jal Dena", reason: "Confidence aur energy badhane ke liye.", when: "Har Subah" }],
    timelines: { good_period: "Agle 45 din naye project shuru karne ke liye anukool hain.", challenging_period: "Is mahine ke aakhri hafte mein swasthya par dhyan dein." },
    dos_donts: { dos: ["Roz subah 10 minute meditate karein."], donts: ["Gusse mein koi faisla na lein."] },
    lucky_signals: { number: 7, color: "Royal Blue", day: "Thursday (Guruwaar)" }
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await new Promise(resolve => setTimeout(resolve, 2500)); 
      res.status(200).json(generateHinglishReport(req.body));
    } catch (error) {
      res.status(500).json({ error: 'Kundali generate karne mein kuch samasya aa gayi.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
