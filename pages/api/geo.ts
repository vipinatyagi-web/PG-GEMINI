// pages/api/geo.js
// Keyless mode: accept lat/lon (and optional tz) and just echo back.
// Usage:
//   /api/geo?lat=29.39&lon=76.96&tz=330&address=Panipat,%20Haryana&country=India
// If Google key is present and ?query=... diya ho, toh geocode+timezone bhi chal sakta hai (optional).

export default async function handler(req, res) {
  const { query, address, lat, lon, tz, country } = req.query || {};
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // --------- A) Pure lat/lon mode (no Google) -----------
  if ((lat && lon) && !query) {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
      return res.status(400).json({ error: "Invalid lat/lon" });
    }
    const tzOffset = typeof tz !== "undefined" ? parseInt(tz, 10) : 330; // default IST
    return res.status(200).json({
      lat: latNum,
      lon: lonNum,
      tz_offset_minutes: tzOffset,
      address: address || `${latNum}, ${lonNum}`,
      country: country || "India"
    });
  }

  // --------- B) Optional Google mode (only if you want) -----------
  if (query) {
    if (!apiKey) {
      return res.status(400).json({
        error: "GOOGLE_MAPS_API_KEY missing. Use lat/lon mode: /api/geo?lat=..&lon=..&tz=.."
      });
    }
    try {
      // Geocode
      const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;
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
      const location = r.geometry.location; // {lat,lng}
      const formatted = r.formatted_address;
      const comp = r.address_components || [];
      const ctry = comp.find(x => (x.types || []).includes("country"))?.long_name || "";

      // Timezone
      const ts = Math.floor(Date.now() / 1000);
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
      const tzOffset = Math.round(((tzj.rawOffset || 0) + (tzj.dstOffset || 0)) / 60);

      return res.status(200).json({
        lat: location.lat,
        lon: location.lng,
        tz_offset_minutes: tzOffset,
        address: formatted,
        country: ctry
      });
    } catch (e) {
      return res.status(500).json({ error: e.message || "Unknown error" });
    }
  }

  // --------- C) Nothing provided -----------
  return res.status(400).json({
    error: "Provide either lat/lon (no key): /api/geo?lat=..&lon=..&tz=..\nOr place (needs Google): /api/geo?query=City"
  });
}
