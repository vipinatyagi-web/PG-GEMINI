export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return res.status(400).json({ error: "Missing GOOGLE_MAPS_API_KEY" });

  const { query, address, lat, lon } = req.query || {};
  const place = (query || address || "").toString().trim();

  try {
    let location = null, formatted = "", country = "";

    if (place) {
      const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(place)}&key=${apiKey}`;
      const gRes = await fetch(geoUrl);
      const gj = await gRes.json();

      if (gj.status !== "OK" || !gj.results?.length) {
        return res.status(404).json({
          error: "Place not found",
          status: gj.status,
          google_error: gj.error_message || null
        });
      }
      const r = gj.results[0];
      location = r.geometry.location;
      formatted = r.formatted_address;
      const comp = r.address_components || [];
      country = comp.find(c => (c.types||[]).includes("country"))?.long_name || "";
    }
    else if (lat && lon) {
      location = { lat: parseFloat(lat), lng: parseFloat(lon) };
      formatted = `${lat}, ${lon}`;
    }
    else {
      return res.status(400).json({ error: "Provide ?query=City or ?lat=..&lon=.." });
    }

    // Timezone
    const ts = Math.floor(Date.now()/1000);
    const tzUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${location.lat},${location.lng}&timestamp=${ts}&key=${apiKey}`;
    const tzRes = await fetch(tzUrl);
    const tzj = await tzRes.json();

    if (tzj.status !== "OK") {
      return res.status(502).json({
        error: "Timezone lookup failed",
        status: tzj.status,
        google_error: tzj.errorMessage || tzj.error_message || null
      });
    }

    const tz_offset_minutes = Math.round(((tzj.rawOffset||0)+(tzj.dstOffset||0))/60);

    return res.status(200).json({
      lat: location.lat,
      lon: location.lng,
      tz_offset_minutes,
      address: formatted,
      country
    });

  } catch (e) {
    return res.status(500).json({ error: e.message || "Unknown error" });
  }
}
