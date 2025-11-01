// pages/api/geo.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query, address, lat, lon, tz, country } = (req.query || {}) as {
    query?: string; address?: string; lat?: string; lon?: string; tz?: string; country?: string;
  };
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  // A) Keyless lat/lon mode
  if ((lat && lon) && !query) {
    const latNum = parseFloat(lat as string);
    const lonNum = parseFloat(lon as string);
    if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
      return res.status(400).json({ error: "Invalid lat/lon" });
    }
    const tzOffset = typeof tz !== "undefined" ? parseInt(tz as string, 10) : 330;
    return res.status(200).json({
      lat: latNum,
      lon: lonNum,
      tz_offset_minutes: tzOffset,
      address: address || `${latNum}, ${lonNum}`,
      country: country || "India"
    });
  }

  // B) Optional Google mode (if place query present)
  if (query) {
    if (!apiKey) {
      return res.status(400).json({ error: "GOOGLE_MAPS_API_KEY missing. Use lat/lon mode: /api/geo?lat=..&lon=..&tz=.." });
    }
    try {
      const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;
      const gRes = await fetch(geoUrl);
      const gj = await gRes.json();
      if (gj.status !== "OK" || !gj.results?.length) {
        return res.status(404).json({ error: "Place not found", status: gj.status, google_error: gj.error_message || null });
      }
      const r = gj.results[0];
      const location = r.geometry.location as { lat: number; lng: number };
      const formatted: string = r.formatted_address;
      const comp = (r.address_components || []) as Array<{ long_name: string; types: string[] }>;
      const ctry = comp.find(c => (c.types || []).includes("country"))?.long_name || "";

      const ts = Math.floor(Date.now() / 1000);
      const tzUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${location.lat},${location.lng}&timestamp=${ts}&key=${apiKey}`;
      const tzRes = await fetch(tzUrl);
      const tzj = await tzRes.json();
      if (tzj.status !== "OK") {
        return res.status(502).json({ error: "Timezone lookup failed", status: tzj.status, google_error: tzj.errorMessage || tzj.error_message || null });
      }
      const tzOffset = Math.round(((tzj.rawOffset || 0) + (tzj.dstOffset || 0)) / 60);

      return res.status(200).json({
        lat: location.lat,
        lon: location.lng,
        tz_offset_minutes: tzOffset,
        address: formatted,
        country: ctry
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message || "Unknown error" });
    }
  }

  // C) Nothing provided
  return res.status(400).json({
    error: "Provide either lat/lon (no key): /api/geo?lat=..&lon=..&tz=..\nOr place (needs Google): /api/geo?query=City"
  });
}
