/** Weatherstack API response types */

export interface LocationInfo {
  name: string;
  country: string;
  region: string;
  lat: string;
  lon: string;
  timezone_id: string;
  localtime: string;
  localtime_epoch: number;
  utc_offset: string;
}

export interface CurrentWeather {
  observation_time: string;
  temperature: number;
  weather_code: number;
  weather_icons: string[];
  weather_descriptions: string[];
  wind_speed: number;
  wind_degree: number;
  wind_dir: string;
  pressure: number;
  precip: number;
  humidity: number;
  cloudcover: number;
  feelslike: number;
  uv_index: number;
  visibility: number;
}

export interface CurrentWeatherResponse {
  request?: { type: string; query: string; language: string; unit: string };
  location?: LocationInfo;
  current?: CurrentWeather;
  success?: boolean;
  error?: { code: number; type: string; info: string };
}

export interface HistoricalDay {
  date: string;
  date_epoch: number;
  astro?: Array<{ sunrise: string; sunset: string; moonrise: string; moonset: string; moon_phase: string; moon_illumination: string }>;
  mintemp?: number;
  maxtemp?: number;
  avgtemp?: number;
  totalsnow?: number;
  sunhour?: number;
  uv_index?: number;
  hourly?: unknown;
}

export interface HistoricalWeatherResponse {
  request?: { type: string; query: string; historical_date: string; unit: string };
  location?: LocationInfo;
  historical?: Record<string, HistoricalDay>;
  success?: boolean;
  error?: { code: number; type: string; info: string };
}

export interface MarineWeatherHour {
  time: string;
  temperature: number;
  wind_speed: number;
  wind_degree: number;
  wind_dir: string;
  weather_code: number;
  weather_descriptions: string[];
  pressure: number;
  visibility: number;
  water_temperature?: number;
  wave_height?: number;
  swell_height?: number;
  swell_direction?: string;
  swell_period?: string;
}

export interface MarineDay {
  date: string;
  astronomy?: Array<{ sunrise: string; sunset: string; moonrise: string; moonset: string }>;
  marine?: MarineWeatherHour[];
}

export interface MarineWeatherResponse {
  request?: { type: string; query: string; unit: string };
  marine?: Record<string, MarineDay>;
  success?: boolean;
  error?: { code: number; type: string; info: string };
}
