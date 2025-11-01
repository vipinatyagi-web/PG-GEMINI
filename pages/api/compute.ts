import type { NextApiRequest, NextApiResponse } from 'next';
// Dummy report generator
const generateHinglishReport = (formData: any) => ({
    meta: { name: formData.fullName, dob: formData.dob, tob: formData.tob, location: formData.birthplace },
    summary: { tone: "Practical aur motivational.", core_focus: `Aane wale 3 mahine aapke liye '${formData.topConcern}' par focus karne ke liye anukool hain.` },
    sections: {
      career: { headline: "Mehnat se Safalta!", forensic: "Budh (Mercury) ka prabhav communication ko strong banata hai.", actions: { today: "Apne goals likhein.", seven_days: "LinkedIn update karein."} },
      love: { headline: "Rishton mein Gehrai!", forensic: "Shukra (Venus) ki sthiti prem sambandhon mein madhurta la rahi hai." }
    },
    remedies: [{ name: "Surya Ko Jal Dena", reason: "Confidence badhane ke liye.", when: "Har Subah" }],
});
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    res.status(200).json(generateHinglishReport(req.body));
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
