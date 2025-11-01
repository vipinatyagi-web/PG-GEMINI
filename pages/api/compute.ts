export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Dummy delay for realism
    await new Promise(resolve => setTimeout(resolve, 2000));

    const formData = req.body || {};

    const report = {
      meta: {
        name: formData.fullName || 'User',
        dob: formData.dob || 'Not provided',
        tob: formData.tob || 'Not provided',
        location: formData.birthplace || 'Unknown',
      },
      summary: {
        tone: "Practical aur motivational.",
        core_focus: `Aane wale 3 mahine aapke liye '${formData.topConcern || 'Career Clarity'}' par focus karne ke liye anukool hain.`,
      },
      sections: {
        career: {
          headline: "Mehnat se Safalta!",
          forensic:
            "Budh (Mercury) ka prabhav communication ko strong banata hai. Apne kaam aur bolne ka andaaz dono par vishwas rakhiye.",
          actions: {
            today: "Apne goals likhein.",
            seven_days: "LinkedIn update karein.",
            ninety_days: "Ek nayi skill seekhna shuru karein.",
          },
        },
        love: {
          headline: "Rishton mein Gehrai!",
          forensic:
            "Shukra (Venus) ki sthiti prem sambandhon mein madhurta la rahi hai. Apne partner ko samajhne ka samay nikaaliye.",
          actions: {
            today: "Apne partner ko appreciate karein.",
            seven_days: "Ek chhoti outing plan karein.",
            ninety_days: "Dil ki baat khul ke karein.",
          },
        },
      },
      remedies: [
        {
          name: "Surya Ko Jal Dena",
          reason: "Confidence badhane ke liye.",
          when: "Har Subah 6:00 baje ke aas-paas.",
        },
        {
          name: "Tulsi ka paudha lagana",
          reason: "Ghar mein positivity aur shanti ke liye.",
          when: "Somvaar ko subah.",
        },
      ],
    };

    res.status(200).json(report);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
