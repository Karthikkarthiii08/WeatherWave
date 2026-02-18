/// <reference types="vite/client" />

/**
 * Weatherstack API client (https://www.weatherstack.com/documentation)
 */

import type {
  CurrentWeatherResponse,
  HistoricalWeatherResponse,
  MarineWeatherResponse,
} from "@/types/weather";

const BASE = "https://api.weatherstack.com";
const KEY = import.meta.env.VITE_WEATHERSTACK_API_KEY ?? "";

function buildParams(params: Record<string, string>): string {
  const search = new URLSearchParams({ access_key: KEY, ...params });
  return search.toString();
}

async function fetchApi<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const url = `${BASE}/${endpoint}?${buildParams(params)}`;
  
  if (!KEY) {
    throw new Error("API key is missing. Please check your .env file and restart the dev server.");
  }
  
  try {
    const res = await fetch(url);
    const data = (await res.json()) as T & { error?: { info: string; type?: string; code?: number }; success?: boolean };
    
    // Check for API errors first (Weatherstack returns 200 even with errors)
    if (data?.error) {
      const errorInfo = data.error.info || "Unknown API error";
      const errorCode = data.error.code;
      
      // Handle specific error codes
      if (errorCode === 101) {
        throw new Error("Invalid API key. Please check your .env file and restart the dev server.");
      }
      if (errorCode === 104) {
        throw new Error("Monthly API request limit reached. Please upgrade your plan or wait for the limit to reset.");
      }
      if (errorCode === 105) {
        throw new Error("API request limit reached. The free plan allows very limited requests per month.");
      }
      
      // Provide more user-friendly error messages
      if (errorInfo.toLowerCase().includes("subscription") || 
          errorInfo.toLowerCase().includes("plan") || 
          errorInfo.toLowerCase().includes("restricted") ||
          errorInfo.toLowerCase().includes("access restricted")) {
        throw new Error(errorInfo);
      }
      
      throw new Error(errorInfo);
    }
    
    // Check if success is explicitly false
    if (data?.success === false) {
      throw new Error("API request failed. Please try again.");
    }
    
    // Check HTTP status
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch weather data. Please check your connection and API key.");
  }
}

export async function fetchCurrentWeather(query: string): Promise<CurrentWeatherResponse> {
  return fetchApi<CurrentWeatherResponse>("current", { query });
}

export async function fetchHistoricalWeather(
  query: string,
  historical_date: string
): Promise<HistoricalWeatherResponse> {
  return fetchApi<HistoricalWeatherResponse>("historical", { query, historical_date });
}

export async function fetchMarineWeather(query: string): Promise<MarineWeatherResponse> {
  return fetchApi<MarineWeatherResponse>("marine", { query });
}
