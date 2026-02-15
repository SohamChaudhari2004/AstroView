import axios from "axios";

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const APOD_BASE_URL = "https://api.nasa.gov/planetary/apod";

export interface APODResponse {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  copyright?: string;
  thumbnail_url?: string;
}

/**
 * Get APOD for a specific date
 */
export const getAPOD = async (date?: string): Promise<APODResponse> => {
  const params: Record<string, string> = {
    api_key: NASA_API_KEY,
    thumbs: "true",
  };
  if (date) params.date = date;

  const response = await axios.get(APOD_BASE_URL, { params, timeout: 15000 });
  return response.data;
};

/**
 * Get a random APOD image
 */
export const getRandomAPOD = async (
  count: number = 1,
): Promise<APODResponse[]> => {
  const params: Record<string, string | number> = {
    api_key: NASA_API_KEY,
    count,
    thumbs: "true",
  };

  const response = await axios.get(APOD_BASE_URL, { params, timeout: 15000 });
  return Array.isArray(response.data) ? response.data : [response.data];
};

/**
 * Get APOD for a date range
 */
export const getAPODRange = async (
  startDate: string,
  endDate?: string,
): Promise<APODResponse[]> => {
  const params: Record<string, string> = {
    api_key: NASA_API_KEY,
    start_date: startDate,
    thumbs: "true",
  };
  if (endDate) params.end_date = endDate;

  const response = await axios.get(APOD_BASE_URL, { params, timeout: 15000 });
  return Array.isArray(response.data) ? response.data : [response.data];
};
