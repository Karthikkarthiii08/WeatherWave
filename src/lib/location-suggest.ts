export type LocationSuggestion = {
  /** Human-friendly label to show in the dropdown */
  label: string;
  /** What we send to Weatherstack (lat,lon works well) */
  query: string;
  lat: string;
  lon: string;
};

/**
 * Lightweight location autocomplete using OpenStreetMap Nominatim.
 * No API key required.
 */
export async function suggestLocations(text: string, limit = 6): Promise<LocationSuggestion[]> {
  const q = text.trim();
  if (q.length < 2) return [];

  const url =
    `https://nominatim.openstreetmap.org/search?` +
    new URLSearchParams({
      format: "jsonv2",
      q,
      addressdetails: "1",
      limit: String(limit),
    }).toString();

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as Array<{
    display_name: string;
    lat: string;
    lon: string;
    type?: string;
    addresstype?: string;
  }>;

  return (data ?? [])
    .filter((x) => x?.display_name && x?.lat && x?.lon)
    .slice(0, limit)
    .map((x) => ({
      label: x.display_name,
      lat: x.lat,
      lon: x.lon,
      query: `${x.lat},${x.lon}`,
    }));
}

