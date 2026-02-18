import { useEffect, useMemo, useState } from "react";
import {
  fetchCurrentWeather,
  fetchHistoricalWeather,
  fetchMarineWeather,
} from "@/lib/weather-api";
import { suggestLocations, type LocationSuggestion } from "@/lib/location-suggest";
import type {
  CurrentWeatherResponse,
  HistoricalWeatherResponse,
  MarineWeatherResponse,
} from "@/types/weather";
import {
  MapPin,
  Cloud,
  Thermometer,
  Wind,
  Droplets,
  Gauge,
  Sun,
  Anchor,
  Waves,
  Loader2,
  Search,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";

const glass =
  "bg-white/20 dark:bg-gray-900/40 backdrop-blur-xl border border-white/30 dark:border-white/20 shadow-2xl";

type Tab = "current" | "historical" | "marine";

export default function App() {
  const [locationInput, setLocationInput] = useState("London");
  const [locationQuery, setLocationQuery] = useState("London");
  const [historicalDate, setHistoricalDate] = useState(
    format(new Date(Date.now() - 86400000 * 7), "yyyy-MM-dd")
  );
  const [tab, setTab] = useState<Tab>("current");
  const [current, setCurrent] = useState<CurrentWeatherResponse | null>(null);
  const [historical, setHistorical] = useState<HistoricalWeatherResponse | null>(null);
  const [marine, setMarine] = useState<MarineWeatherResponse | null>(null);
  const [loading, setLoading] = useState<Tab | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);

  const effectiveQuery = useMemo(() => {
    const q = locationQuery.trim();
    if (q) return q;
    return locationInput.trim();
  }, [locationInput, locationQuery]);

  // Debounced location suggestions
  useEffect(() => {
    const q = locationInput.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    const handle = window.setTimeout(async () => {
      try {
        setSuggestLoading(true);
        const list = await suggestLocations(q, 6);
        setSuggestions(list);
      } finally {
        setSuggestLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(handle);
  }, [locationInput]);

  const searchCurrent = async () => {
    setError(null);
    setLoading("current");
    try {
      const data = await fetchCurrentWeather(effectiveQuery);
      if (data?.error) {
        throw new Error(data.error.info || "Failed to fetch current weather");
      }
      setCurrent(data);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Failed to fetch current weather";
      setError(errorMsg);
      setCurrent(null);
    } finally {
      setLoading(null);
    }
  };

  const searchHistorical = async () => {
    setError(null);
    setLoading("historical");
    try {
      const data = await fetchHistoricalWeather(effectiveQuery, historicalDate);
      setHistorical(data);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Failed to fetch historical weather";
      if (errorMsg.toLowerCase().includes("subscription") || errorMsg.toLowerCase().includes("plan") || errorMsg.toLowerCase().includes("restricted")) {
        setError("⚠️ Historical weather requires a paid Weatherstack plan. Your current plan only supports current weather. Please upgrade at weatherstack.com to access historical data.");
      } else {
        setError(errorMsg);
      }
      setHistorical(null);
    } finally {
      setLoading(null);
    }
  };

  const searchMarine = async () => {
    setError(null);
    setLoading("marine");
    try {
      const data = await fetchMarineWeather(effectiveQuery);
      setMarine(data);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Failed to fetch marine weather";
      if (errorMsg.toLowerCase().includes("subscription") || errorMsg.toLowerCase().includes("plan") || errorMsg.toLowerCase().includes("restricted")) {
        setError("⚠️ Marine weather requires a paid Weatherstack plan. Your current plan only supports current weather. Please upgrade at weatherstack.com to access marine data.");
      } else {
        setError(errorMsg);
      }
      setMarine(null);
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-500/20 via-indigo-500/20 to-purple-500/20"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent"
        aria-hidden
      />

      <div className="px-space-2 sm:px-space-3 py-space-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-white drop-shadow-lg mb-2">
          Weather
        </h1>
        <p className="text-blue-100 text-base mb-3">
          Current, historical & marine weather via Weatherstack
        </p>


        <div className={`${glass} rounded-2xl p-4 mb-space-4`}>
          <label className="text-white font-semibold text-base flex items-center gap-2 mb-2">
            <MapPin className="size-5" />
            Location filter
          </label>
          <p className="text-blue-100 text-sm mt-0.5 mb-3">
            Type any city or place name and press Enter to get weather. You can also pick from suggestions for better accuracy.
          </p>

          <div className="space-y-3">
            <div>
              <label htmlFor="location" className="text-blue-100 text-xs font-medium block mb-1.5">
                Location
              </label>
              <div className="relative">
                <input
                  id="location"
                  type="text"
                  value={locationInput}
                  onChange={(e) => {
                    const v = e.target.value;
                    setLocationInput(v);
                    setLocationQuery(v); // if user doesn't pick a suggestion, use typed text
                    setSuggestOpen(true);
                  }}
                  onFocus={() => setSuggestOpen(true)}
                  onBlur={() => {
                    // allow click selection before closing
                    window.setTimeout(() => setSuggestOpen(false), 150);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) {
                      // Use whatever is typed in the input
                      setLocationQuery(locationInput);
                      setSuggestOpen(false);
                      if (tab === "current") searchCurrent();
                      else if (tab === "historical") searchHistorical();
                      else if (tab === "marine") searchMarine();
                    }
                    if (e.key === "Escape") setSuggestOpen(false);
                  }}
                  placeholder="Type any city or place name (e.g. New York, Paris, Tokyo)"
                  className="w-full h-11 rounded-lg border-2 border-white/40 bg-white/25 px-4 py-2 text-white font-medium placeholder:text-blue-200/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />

                {suggestOpen && (suggestLoading || suggestions.length > 0) && (
                  <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/20 bg-slate-900/90 backdrop-blur-xl shadow-2xl overflow-hidden">
                    {suggestLoading && (
                      <div className="px-4 py-3 text-sm text-blue-100 flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Searching locations…
                      </div>
                    )}

                    {!suggestLoading && suggestions.length === 0 && (
                      <div className="px-4 py-3 text-sm text-blue-100">
                        No suggestions. Press Enter to search with what you typed.
                      </div>
                    )}

                    {!suggestLoading && suggestions.length > 0 && (
                      <ul className="max-h-64 overflow-auto">
                        {suggestions.map((s) => (
                          <li key={`${s.lat},${s.lon}`}>
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setLocationInput(s.label);
                                setLocationQuery(s.query); // lat,lon for best accuracy
                                setSuggestOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                            >
                              <div className="font-semibold">{s.label}</div>
                              <div className="text-blue-200/80 text-xs mt-0.5">
                                Use: {s.query}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-blue-200/80 text-xs mt-2">
            Selected query for API: <strong className="text-white">{effectiveQuery || "—"}</strong>
          </p>
        </div>

        {error && (
          <div
            className="bg-red-500/90 backdrop-blur-xl rounded-xl p-4 mb-space-4 border-2 border-red-400 text-white font-semibold shadow-lg"
          >
            <div className="flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <div className="flex-1">
                <p className="font-bold mb-1">Error</p>
                <p className="text-sm font-normal leading-relaxed">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className={`${glass} rounded-xl p-1.5 inline-flex gap-2 mb-4`}>
          {(
            [
              { id: "current" as Tab, label: "Current", icon: Cloud, free: true },
              { id: "historical" as Tab, label: "Historical", icon: Calendar, free: false },
              { id: "marine" as Tab, label: "Marine", icon: Anchor, free: false },
            ] as const
          ).map(({ id, label, icon: Icon, free }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                setError(null);
              }}
              className={`inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all relative ${
                tab === id
                  ? "bg-blue-500 text-white shadow-lg scale-105"
                  : "text-white hover:bg-white/20 hover:scale-102"
              }`}
            >
              <Icon className="size-4 mr-2" />
              {label}
              {!free && (
                <span className="ml-1.5 text-xs bg-yellow-500/80 text-yellow-900 px-1.5 py-0.5 rounded font-bold">
                  PRO
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "current" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  // Use whatever is currently typed
                  setLocationQuery(locationInput);
                  searchCurrent();
                }}
                disabled={loading === "current" || !locationInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-white font-semibold shadow-lg border-2 border-blue-400 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                {loading === "current" ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Search className="size-5" />
                )}
                Fetch current weather
              </button>
              {current?.location && (
                <div className="flex items-center gap-2 text-green-300 text-sm font-medium">
                  <span className="text-lg">✓</span>
                  <span>Weather data loaded successfully!</span>
                </div>
              )}
            </div>
            {current?.location && current?.current && (
              <div className={`${glass} rounded-2xl border-2 border-white/30 text-white overflow-hidden`}>
                <div className="p-4 pb-2">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <MapPin className="size-5" />
                    {current.location.name}, {current.location.region},{" "}
                    {current.location.country}
                  </h2>
                  <p className="text-white/70 text-sm">
                    {current.location.localtime} · {current.location.timezone_id}
                  </p>
                </div>
                <div className="px-4 pb-4 space-y-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Thermometer className="size-5 text-white/80" />
                      <span className="text-3xl font-semibold">
                        {current.current.temperature}°C
                      </span>
                      <span className="text-white/70">
                        Feels like {current.current.feelslike}°C
                      </span>
                    </div>
                    <div className="text-white/90">
                      {current.current.weather_descriptions?.[0]}
                    </div>
                  </div>
                  {current.current.weather_icons?.[0] && (
                    <img
                      src={current.current.weather_icons[0]}
                      alt=""
                      className="h-14 w-auto"
                    />
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-white/90">
                      <Wind className="size-4" />
                      {current.current.wind_speed} km/h {current.current.wind_dir}
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <Droplets className="size-4" />
                      {current.current.humidity}%
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <Gauge className="size-4" />
                      {current.current.pressure} mb
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <Sun className="size-4" />
                      UV {current.current.uv_index}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "historical" && (
          <div className="space-y-4">
            <div className="bg-yellow-500/20 border-2 border-yellow-500/50 rounded-xl p-3 mb-4">
              <p className="text-yellow-100 text-sm font-medium">
                💡 <strong>Premium Feature:</strong> Historical weather data requires a paid Weatherstack subscription. The free plan only includes current weather.
              </p>
            </div>
            <div className={`${glass} rounded-2xl p-4 flex flex-wrap items-end gap-3`}>
              <div>
                <label htmlFor="hist-date" className="text-white font-semibold text-base block mb-2">
                  Date
                </label>
                <input
                  id="hist-date"
                  type="date"
                  value={historicalDate}
                  onChange={(e) => setHistoricalDate(e.target.value)}
                  className="h-11 rounded-lg border-2 border-white/40 bg-white/25 px-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setLocationQuery(locationInput);
                  searchHistorical();
                }}
                disabled={loading === "historical" || !locationInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-white font-semibold shadow-lg border-2 border-blue-400 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                {loading === "historical" ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Search className="size-5" />
                )}
                Fetch historical
              </button>
            </div>
            {historical?.historical && (
              <div className={`${glass} rounded-2xl border-2 border-white/30 text-white overflow-hidden`}>
                <div className="p-4 pb-2">
                  <h2 className="text-xl font-semibold">
                    {historical.location?.name}, {historical.location?.country} —{" "}
                    {historicalDate}
                  </h2>
                </div>
                <div className="px-4 pb-4">
                  {Object.entries(historical.historical).map(([date, day]) => (
                    <div key={date} className="space-y-3">
                      <div className="flex flex-wrap gap-4 text-sm">
                        {(day.maxtemp != null || day.mintemp != null) && (
                          <>
                            <span className="flex items-center gap-1">
                              <Thermometer className="size-4" /> Max {day.maxtemp}°C · Min{" "}
                              {day.mintemp}°C
                            </span>
                            {day.avgtemp != null && <span>Avg {day.avgtemp}°C</span>}
                          </>
                        )}
                        {day.uv_index != null && (
                          <span className="flex items-center gap-1">
                            <Sun className="size-4" /> UV {day.uv_index}
                          </span>
                        )}
                        {day.sunhour != null && <span>Sun {day.sunhour}h</span>}
                        {day.totalsnow != null && day.totalsnow > 0 && (
                          <span>Snow {day.totalsnow} cm</span>
                        )}
                      </div>
                      {day.astro?.[0] && (
                        <p className="text-white/70 text-xs">
                          Sunrise {day.astro[0].sunrise} · Sunset {day.astro[0].sunset}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "marine" && (
          <div className="space-y-4">
            <div className="bg-yellow-500/20 border-2 border-yellow-500/50 rounded-xl p-3 mb-4">
              <p className="text-yellow-100 text-sm font-medium">
                💡 <strong>Premium Feature:</strong> Marine weather data requires a paid Weatherstack subscription. The free plan only includes current weather.
              </p>
            </div>
            <p className="text-blue-100 text-base font-medium mb-3">
              Use latitude,longitude for marine (e.g. 51.51,-0.13 for London area).
            </p>
            <button
              type="button"
              onClick={() => {
                setLocationQuery(locationInput);
                searchMarine();
              }}
              disabled={loading === "marine" || !locationInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-white font-semibold shadow-lg border-2 border-blue-400 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
              {loading === "marine" ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Waves className="size-5" />
              )}
              Fetch marine weather
            </button>
            {marine?.marine && (
              <div className={`${glass} rounded-2xl border-2 border-white/30 text-white overflow-hidden`}>
                <div className="p-4 pb-2">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Anchor className="size-5" />
                    Marine — {marine.request?.query ?? effectiveQuery}
                  </h2>
                </div>
                <div className="px-4 pb-4 space-y-4">
                  {Object.entries(marine.marine).map(([date, day]) => (
                    <div key={date} className="space-y-2">
                      <h4 className="text-sm font-medium text-white/90">{date}</h4>
                      {day.astronomy?.[0] && (
                        <p className="text-white/70 text-xs">
                          Sunrise {day.astronomy[0].sunrise} · Sunset {day.astronomy[0].sunset}
                        </p>
                      )}
                      {day.marine?.slice(0, 6).map((hour, i) => (
                        <div
                          key={i}
                          className="flex flex-wrap gap-3 text-sm py-2 border-b border-white/10 last:border-0"
                        >
                          <span className="text-white/80">{hour.time}</span>
                          <span>{hour.temperature}°C</span>
                          <span className="flex items-center gap-1">
                            <Wind className="size-3" /> {hour.wind_speed} km/h {hour.wind_dir}
                          </span>
                          {hour.wave_height != null && (
                            <span className="flex items-center gap-1">
                              <Waves className="size-3" /> Wave {hour.wave_height}m
                            </span>
                          )}
                          {hour.water_temperature != null && (
                            <span>Water {hour.water_temperature}°C</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
