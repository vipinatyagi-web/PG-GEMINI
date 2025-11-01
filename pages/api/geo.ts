import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Google API key missing.' });
  try {
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query as string)}&key=${apiKey}`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();
    if (geoData.status !== 'OK') throw new Error('Jagah nahi mili.');
    const loc = geoData.results[0].geometry.location;
    res.status(200).json({ lat: loc.lat, lon: loc.lng, timezoneOffsetMinutes: 330 }); // Defaulting to IST
  } catch (err: any) { res.status(500).json({ error: err.message }); }
}
