// pages/api/compute.js
// Ultra-detailed Hinglish report generator.
// Works without OpenAI. If OPENAI_API_KEY exists, enhances long paragraphs.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']); return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const body = req.body || {};
  const {
    fullName='User', dob='—', tob='—', birthplace='—',
    lat='—', lon='—', tz_offset_minutes=330,
    gender='—', relationshipStatus='—', careerGoal='—', topConcern='—',
    freeQuestion='', background=''
  } = body;

  // Utility: make some time windows for next 90 days (dummy deterministic)
  const now = new Date();
  const addDays = (n)=> { const d=new Date(now); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };
  const windows = [
    { label: "Window A", from: addDays(3),  to: addDays(14)  },
    { label: "Window B", from: addDays(21), to: addDays(35)  },
    { label: "Window C", from: addDays(47), to: addDays(63)  },
    { label: "Window D", from: addDays(70), to: addDays(90)  },
  ];

  // Helper to craft detailed paragraphs using inputs
  const mkPara = (topic)=>(
    `${fullName}, aapki details (DOB ${dob}, TOB ${tob}, Place ${birthplace}, TZ ${tz_offset_minutes}) ko dekhte hue ` +
    `${topic} area me is waqt “grounded action + patience” sabse bada mantra hai. ` +
    `Agar aapka focus “${topConcern}” ya goal “${careerGoal}” par hai to iss mahine discipline aur communication par khaas dhyaan rakhein.`
  );

  // Optional AI enhancement
  let aiNote = null;
  try {
    if (process.env.OPENAI_API_KEY) {
      // Light AI call (model name can differ by your account; keep minimal)
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

  const report = {
    meta: {
      name: fullName, dob, tob, location: birthplace,
      lat, lon, tz_offset_minutes, gender, relationshipStatus, careerGoal, topConcern,
      primary_question: freeQuestion, background
    },

    summary: {
      tone: "Seedhi baat, practical pandit.",
      core_focus: `${topConcern || 'Clarity'} par agle 3 mahino me focused action.`,
      personalized_note: aiNote || mkPara("overall life")
    },

    grah_prabhav: {
      surya: "Confidence & authority ko steady rakhna; subah Surya ko jal chadhana energy align karta hai.",
      chandra: "Emotions ko balance karna; raat me 10 min gratitude journaling helpful.",
      budh:   "Communication aur documentation aapke favour me; emails/meetings me clarity rakhein.",
      shukra: "Relationships & aesthetics me improvement; self-presentation ka dhyaan rakhein.",
      mangal: "Action oriented weeks; overreact na karein, energy ko gym/walk me channelize karein.",
      brihaspati: "Learning, mentors, spirituality uplift; guru-margdarshan lein.",
      shani:  "Discipline, deadlines, structure; slow & steady wins.",
      rahu_ketu: "Sudden twists me bhi composure rakhein; shortcuts avoid."
    },

    sections: {
      career: {
        headline: "Career — Mehnat + Network = Breakthrough",
        indicators: [
          "Boss/clients ke saath clarity aur follow-ups aapka strongest point ban sakta hai.",
          "Skill stack par dhyaan: weekly micro-goals rakhein."
        ],
        forensic: mkPara("career"),
        pinpoint: windows.map(w=> `${w.label}: ${w.from} → ${w.to} (interviews/pitches ke liye shubh)`),
        actions: { today: "Resume/Portfolio ko 30 min polish.", seven_days: "2 mentors/HR ko reach-out.", ninety_days: "1 certificate complete." },
        confidence: "High"
      },
      money: {
        headline: "Money — Smart Budgeting, Not Panic",
        indicators: ["Subscriptions audit karein", "70-20-10 rule follow karein"],
        forensic: mkPara("finance/wealth"),
        pinpoint: ["Har month ke 1-3 tarikh funds organize karein", "Unexpected kharch avoid"],
        actions: { today: "Expense tracker set.", seven_days: "SIP auto-debit.", ninety_days: "Emergency fund 1x monthly expense." },
        confidence: "Medium"
      },
      love: {
        headline: "Love — Communication se Gehrai",
        indicators: ["Listening > Reacting", "Weekly quality-time slot"],
        forensic: mkPara("relationships"),
        pinpoint: ["Fri-Sun light/outdoor plans", "Sensitive talks Wed/Thu ko"],
        actions: { today: "Appreciation message.", seven_days: "Small date/outing.", ninety_days: "Shared goals discuss." },
        confidence: "Medium"
      },
      health: {
        headline: "Health — Routine hi dawai",
        indicators: ["7-8h sleep, hydration, sunlight"],
        forensic: mkPara("health/routine"),
        pinpoint: ["Morning 20-min walk", "3PM water+walk break"],
        actions: { today: "Sleep by 11PM.", seven_days: "Sugar audit.", ninety_days: "Habit streak 80%+" },
        confidence: "High"
      },
      family: {
        headline: "Family — Samvaad aur Santulan",
        indicators: ["Elder’s blessings, shared chores"],
        forensic: "Ghar me shanti ke liye expectations clear rakhein; weekends me family-time reserve.",
        pinpoint: ["Sunday lunch plans", "Monthly finances clarity"],
        actions: { today: "Phone call/namaste.", seven_days: "Family calendar.", ninety_days: "Mini vacation plan." },
        confidence: "Medium"
      },
      education: {
        headline: "Education — Deep Work Blocks",
        indicators: ["Pomodoro/Focus blocks", "Notes → recall"],
        forensic: "Budh strong: concise notes + weekly revision best.",
        pinpoint: ["Morning 7-9am study", "Mock tests Sat"],
        actions: { today: "Syllabus map.", seven_days: "2 mocks.", ninety_days: "Full revision cycle." },
        confidence: "High"
      },
      travel: {
        headline: "Travel/Relocation — Paperwork First",
        indicators: ["Docs checklist", "Buffer days"],
        forensic: "Rahu-ke-tuplike delays avoid karne ke liye documents pehle ready rakhein.",
        pinpoint: ["Window B/C me travel better", "Mid-week tickets cheaper"],
        actions: { today: "ID/docs scan.", seven_days: "Visa checklist.", ninety_days: "Travel insurance." },
        confidence: "Medium"
      },
      spiritual: {
        headline: "Spiritual — Sadhgi me Shakti",
        indicators: ["Morning mantra, kindness"],
        forensic: "Daily 5-min ‘Om’ jap + gratitude se mann stable rehta hai.",
        pinpoint: ["Pratahkal 5–15 min", "Sunday deep clean + diya"],
        actions: { today: "5-min jap.", seven_days: "Satvik meal.", ninety_days: "Seva/daan." },
        confidence: "High"
      }
    },

    remedies: [
      { name: "Surya ko jal", reason: "Confidence & focus", when: "Roz subah" },
      { name: "Tulsi paudha", reason: "Positivity at home", when: "Somvaar" },
      { name: "Hanuman Chalisa", reason: "Fear/stress relief", when: "Mangalvaar/Shanivaar" },
    ],

    lucky: {
      number: ["3","6","9"],
      color: ["Saffron","Sky Blue","White"],
      day: ["Monday","Thursday"],
      stone_note: "Ratna sirf verified astrologer ki salah se pehnen."
    },

    do_dont: {
      do: [
        "Early to bed, early to rise",
        "Weekly planning + review",
        "Gratitude & parents’ blessings"
      ],
      dont: [
        "Impulse decisions without note-making",
        "Over-sharing sensitive info",
        "Neglecting sleep & hydration"
      ]
    },

    timeline: windows,

    action_plan: {
      today: [
        "10-minute planning + 3 priorities",
        "1 gratitude message to a mentor/parent",
        "Sleep target 11:00 PM"
      ],
      seven_days: [
        "2 professional reach-outs (LinkedIn/HR)",
        "1 family outing / quality time",
        "Sugar/caffeine audit"
      ],
      ninety_days: [
        "1 certificate/skill upgrade",
        "Emergency fund set-up",
        "Habit tracker 80% consistency"
      ]
    }
  };

  return res.status(200).json(report);
}
