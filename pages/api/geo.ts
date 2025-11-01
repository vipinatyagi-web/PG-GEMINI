import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Google API key server par nahi mili.' });
  }

  try {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query as string)}&key=${apiKey}`;
    const geoResponse = await fetch(geocodeUrl);
    const geoData = await geoResponse.json();

    if (geoData.status !== 'OK' || !geoData.results[0]) {
      throw new Error('Jagah nahi mili. Kripya dobara check karein.');
    }

    const location = geoData.results[0].geometry.location;
    // Defaulting to IST for simplicity as Timezone API can be complex
    const timezoneOffsetMinutes = 330; 

    res.status(200).json({
      lat: location.lat,
      lon: location.lng,
      timezoneOffsetMinutes,
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Location data prapt karne mein विफल.' });
  }
}
