import { Tool } from "@langchain/core/tools";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

// NASA APOD Tool
export class APODTool extends Tool {
  name = "get_apod";
  description =
    "Get NASA's Astronomy Picture of the Day (APOD). ALWAYS use this tool when users ask about: 'astronomy picture of the day', 'APOD', 'today's space picture', 'space picture', 'picture of the day', 'astronomy image today', 'nasa picture today', or similar queries about today's astronomy image. Returns actual image URL, title, detailed explanation, and date.";

  async _call(input: string): Promise<string> {
    try {
      const response = await axios.get(`${API_BASE_URL}/apod`);
      const result = response.data;

      // Handle response structure (API returns { success: true, data: {...} })
      const data = result.success ? result.data : result;

      return JSON.stringify({
        type: "image",
        title: data.title,
        url: data.url || data.hdurl,
        explanation: data.explanation,
        date: data.date,
        mediaType: data.media_type,
      });
    } catch (error: any) {
      console.error("APOD API Error:", error.response?.data || error.message);
      return JSON.stringify({
        error: "Failed to fetch APOD data",
        details: error.response?.data?.error || error.message,
      });
    }
  }
}

// Near Earth Objects Tool
export class NEOTool extends Tool {
  name = "get_near_earth_objects";
  description =
    "Get information about Near Earth Objects (asteroids). Use this when users ask about asteroids, NEOs, space rocks, or potential hazards. Returns list of asteroids with details like size, velocity, and hazard status.";

  async _call(input: string): Promise<string> {
    try {
      const response = await axios.get(`${API_BASE_URL}/neo`);
      const result = response.data;
      const data = result.success ? result.data : result;

      return JSON.stringify({
        type: "data",
        count: data.element_count,
        objects: data.near_earth_objects,
      });
    } catch (error: any) {
      console.error("NEO API Error:", error.response?.data || error.message);
      return JSON.stringify({ error: "Failed to fetch NEO data" });
    }
  }
}

// Mars Rover Photos Tool
export class MarsRoverTool extends Tool {
  name = "get_mars_photos";
  description =
    "Get photos from Mars rovers (Curiosity, Perseverance, Spirit, Opportunity). Use this when users ask about Mars, rover images, or red planet exploration. Returns array of Mars photos with camera info.";

  async _call(input: string): Promise<string> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/mars/rovers/curiosity/photos?sol=1000`,
      );
      const result = response.data;
      const data = result.success ? result.data : result;

      return JSON.stringify({
        type: "images",
        photos: data.photos.slice(0, 10).map((photo: any) => ({
          id: photo.id,
          img_src: photo.img_src,
          earth_date: photo.earth_date,
          camera: photo.camera.full_name,
          rover: photo.rover.name,
        })),
      });
    } catch (error: any) {
      console.error("Mars API Error:", error.response?.data || error.message);
      return JSON.stringify({ error: "Failed to fetch Mars photos" });
    }
  }
}

// ISRO Missions Tool
export class ISROMissionsTool extends Tool {
  name = "get_isro_missions";
  description =
    "Get information about Indian Space Research Organisation (ISRO) missions. Use this when users ask about ISRO, Indian space program, Chandrayaan, Mangalyaan, or Indian satellites.";

  async _call(input: string): Promise<string> {
    try {
      const response = await axios.get(`${API_BASE_URL}/isro/spacecraft`);
      const result = response.data;
      const data = result.success ? result.data : result;

      return JSON.stringify({
        type: "data",
        missions: data.spacecrafts || data,
      });
    } catch (error: any) {
      console.error("ISRO API Error:", error.response?.data || error.message);
      return JSON.stringify({ error: "Failed to fetch ISRO data" });
    }
  }
}

// Space Weather Tool
export class SpaceWeatherTool extends Tool {
  name = "get_space_weather";
  description =
    "Get current space weather information including solar flares, geomagnetic storms, and coronal mass ejections. Use this when users ask about space weather, solar activity, auroras, or sun storms.";

  async _call(input: string): Promise<string> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/space-weather/notifications`,
      );
      const result = response.data;
      const data = result.success ? result.data : result;

      return JSON.stringify({
        type: "data",
        notifications: data,
      });
    } catch (error: any) {
      console.error(
        "Space Weather API Error:",
        error.response?.data || error.message,
      );
      return JSON.stringify({ error: "Failed to fetch space weather data" });
    }
  }
}

// NASA Media Search Tool
export class NASAMediaTool extends Tool {
  name = "search_nasa_media";
  description =
    "Search NASA's media library for images, videos, and audio. Use this when users want to search for specific space-related content. Input should be the search query.";

  async _call(input: string): Promise<string> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/nasa-media/search?q=${encodeURIComponent(input)}`,
      );
      const result = response.data;
      const data = result.success ? result.data : result;

      return JSON.stringify({
        type: "media",
        items:
          data.collection?.items?.slice(0, 5).map((item: any) => ({
            title: item.data[0]?.title,
            description: item.data[0]?.description,
            media_type: item.data[0]?.media_type,
            href: item.links?.[0]?.href,
            nasa_id: item.data[0]?.nasa_id,
          })) || [],
      });
    } catch (error: any) {
      console.error(
        "NASA Media API Error:",
        error.response?.data || error.message,
      );
      return JSON.stringify({ error: "Failed to search NASA media" });
    }
  }
}

// Tech Transfer Tool
export class TechTransferTool extends Tool {
  name = "get_tech_transfer";
  description =
    "Get NASA technology transfer opportunities including patents, software, and spinoffs. Use this when users ask about NASA technology, patents, or commercial applications of space tech.";

  async _call(input: string): Promise<string> {
    try {
      const response = await axios.get(`${API_BASE_URL}/tech-transfer`);
      const data = response.data;

      return JSON.stringify({
        type: "data",
        technologies: data.results || data,
      });
    } catch (error) {
      return JSON.stringify({ error: "Failed to fetch tech transfer data" });
    }
  }
}

// OSDR (Open Science Data Repository) Tool
export class OSDRTool extends Tool {
  name = "get_osdr_studies";
  description =
    "Get biological and physical science studies from NASA's Open Science Data Repository. Use this when users ask about space biology, experiments in space, or scientific studies.";

  async _call(input: string): Promise<string> {
    try {
      const response = await axios.get(`${API_BASE_URL}/osdr/studies`);
      const data = response.data;

      return JSON.stringify({
        type: "data",
        studies: data.studies || data,
      });
    } catch (error) {
      return JSON.stringify({ error: "Failed to fetch OSDR data" });
    }
  }
}

// Missions Tool
export class MissionsTool extends Tool {
  name = "get_missions";
  description =
    "Get comprehensive information about current and upcoming space missions from NASA, ESA, ISRO, CNSA, SpaceX and other agencies. Use this when users ask about space missions, upcoming launches, mission timelines, Artemis, Europa Clipper, Mars missions, lunar exploration, or any spacecraft missions. Returns detailed mission data including status, progress, crew, launch dates, and destinations.";

  async _call(input: string): Promise<string> {
    try {
      const response = await axios.get(`${API_BASE_URL}/missions`);
      const result = response.data;
      const data = result.success ? result.data : result;

      return JSON.stringify({
        type: "data",
        missions: Array.isArray(data) ? data : [data],
      });
    } catch (error: any) {
      console.error(
        "Missions API Error:",
        error.response?.data || error.message,
      );
      return JSON.stringify({ error: "Failed to fetch missions data" });
    }
  }
}

// Export all tools
export const getAllMCPTools = (): Tool[] => {
  return [
    new APODTool(),
    new NEOTool(),
    new MarsRoverTool(),
    new ISROMissionsTool(),
    new SpaceWeatherTool(),
    new NASAMediaTool(),
    new TechTransferTool(),
    new OSDRTool(),
    new MissionsTool(),
  ];
};
