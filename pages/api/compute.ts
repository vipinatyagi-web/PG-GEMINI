import type { NextApiRequest, NextApiResponse } from 'next';

// ✅ Fully Typed, 0 build error, always returns meta.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      return res.status(200).json(
        generateDetailedReport({
          fullName: 'Test User',
          dob: '1997-02-06',
          tob: '10:00',
          birthplace: 'Panipat, Haryana',
          lat: '29.3909',
          lon: '76.9635',
          timezoneOffsetMinutes: 330,
          gender: 'male',
          relationshipStatus: 'single',
          careerGoal: 'promotion',
          topConcern: 'career',
        })
      );
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const data = req.body || {};
    const report = generateDetailedReport(data);

    // if meta missing, handle fallback
    if (!report?.meta) {
      console.error('⚠️ Missing meta in report generation');
      return res.status(500).json({ error: 'Report generation incomplete.' });
    }

    return res.status(200).json(report);
  } catch (e: any) {
    console.error('[compute.ts] error:', e);
    return res.status(500).json({ error: e.message || 'Internal error' });
  }
}

// 🪔 Generator Function – detailed kundali structure
function generateDetailedReport(formData: any) {
  const p = {
    fullName: formData.fullName || 'User',
    dob: formData.dob || '—',
    tob: formData.tob || '—',
    birthplace: formData.birthplace || '—',
    lat: formData.lat || '—',
    lon: formData.lon || '—',
    timezoneOffsetMinutes: formData.timezoneOffsetMinutes || 330,
    gender: formData.gender || '—',
    relationshipStatus: formData.relationshipStatus || '—',
    careerGoal: formData.careerGoal || '—',
    topConcern: formData.topConcern || '—',
  };

  const windows = [
    { label: 'Phase 1', from: '2025-11-01', to: '2025-11-15' },
    { label: 'Phase 2', from: '2025-11-16', to: '2025-12-01' },
    { label: 'Phase 3', from: '2025-12-02', to: '2025-12-20' },
  ];

  return {
    meta: {
      name: p.fullName,
      dob: p.dob,
      tob: p.tob,
      location: p.birthplace,
      lat: p.lat,
      lon: p.lon,
      tz: p.timezoneOffsetMinutes,
      gender: p.gender,
      relationshipStatus: p.relationshipStatus,
      careerGoal: p.careerGoal,
      topConcern: p.topConcern,
    },
    summary: {
      tone: 'Practical aur grounded reading.',
      core_focus: `Agle 3 mahine ${p.topConcern} aur ${p.careerGoal} ke liye anukool samay hai.`,
    },
    sections: {
      career: {
        headline: 'Career — Badlav aur Pragati Dono',
        forensic: 'Budh aur Shani ke prabhav se focused planning se result milenge.',
        actions: {
          today: 'LinkedIn update karein',
          seven_days: '1 mentor se baat karein',
          ninety_days: 'Ek skill certification complete karein',
        },
      },
      love: {
        headline: 'Prem aur Samajh',
        forensic: 'Shukra ki sthiti rishte me clarity la rahi hai.',
        actions: {
          today: 'Partner se calmly baat karein',
          seven_days: 'Weekend outing plan karein',
          ninety_days: 'Mutual goals likhein',
        },
      },
      health: {
        headline: 'Health — Routine hi Remedy hai',
        forensic: 'Chandra ka prabhav emotional wellness par.',
        actions: {
          today: '8 ghante ki neend lein',
          seven_days: 'Har din 20 min walk',
          ninety_days: 'Yoga aur pranayam add karein',
        },
      },
    },
    grah_prabhav: {
      surya: 'Self-confidence aur authority me sudhar.',
      chandra: 'Mind peace aur focus me balance.',
      budh: 'Communication me sharpness.',
      shukra: 'Attraction aur charm strong.',
      shani: 'Discipline aur long-term planning ke yog.',
    },
    remedies: [
      { name: 'Surya ko jal chadhayein', reason: 'Confidence aur focus ke liye', when: 'Roz subah' },
      { name: 'Hanuman Chalisa', reason: 'Stress aur fear dur karne ke liye', when: 'Mangalvaar' },
    ],
    timeline: windows,
    lucky: {
      color: ['Saffron', 'White'],
      number: [1, 3, 9],
      day: ['Sunday', 'Thursday'],
    },
  };
}
