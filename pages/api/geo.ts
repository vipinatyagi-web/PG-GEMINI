export default async function handler(req, res) {
  const { query } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Google API key missing.' });
  }

  try {
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (geoData.status !== 'OK' || !geoData.results?.length) {
      throw new Error('Jagah nahi mili.');
    }

    const loc = geoData.results[0].geometry.location;

    // Defaulting to IST = +5:30 (330 minutes)
    res.status(200).json({
      lat: loc.lat,
      lon: loc.lng,
      timezoneOffsetMinutes: 330,
      address: geoData.results[0].formatted_address
    });

  } catch (err) {
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
}
