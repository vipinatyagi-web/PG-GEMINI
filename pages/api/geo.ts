import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query, lat, lon } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'Google API key server par nahi mili.' });

  try {
    let geocodeUrl = '';
    if (query) geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query as string)}&key=${apiKey}`;
    else if (lat && lon) geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;
    else return res.status(400).json({ error: 'Jagah ka naam ya coordinates anivarya hai.' });
    
    const geoResponse = await fetch(geocodeUrl);
    const geoData = await geoResponse.json();
    if (geoData.status !== 'OK' || !geoData.results[0]) throw new Error('Jagah nahi mili.');

    const location = geoData.results[0].geometry.location;
    const fullAddress = geoData.results[0].formatted_address;

    const tzResponse = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${location.lat},${location.lng}&timestamp=${Math.floor(Date.now() / 1000)}&key=${apiKey}`);
    const tzData = await tzResponse.json();
    if (tzData.status !== 'OK') throw new Error('Timezone ki jaankari nahi mil saki.');

    const timezoneOffsetMinutes = Math.round((tzData.dstOffset + tzData.rawOffset) / 60);

    res.status(200).json({ lat: location.lat, lon: location.lng, timezoneOffsetMinutes, fullAddress });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Location data prapt karne mein विफल.' });
  }
}
