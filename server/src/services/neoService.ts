import axios from "axios";

const NASA_API_KEY =
  process.env.NASA_API_KEY || "fxpgQ4j0RVUvt8lIaQvzaVgb6LNZ7GPgTIHAv4b6";
const NEO_BASE_URL = "https://api.nasa.gov/neo/rest/v1";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface NeoCloseApproach {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
    miles_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
    miles: string;
  };
  orbiting_body: string;
}

export interface NeoObject {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: { estimated_diameter_min: number; estimated_diameter_max: number };
    miles: { estimated_diameter_min: number; estimated_diameter_max: number };
    feet: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: NeoCloseApproach[];
  is_sentry_object: boolean;
  orbital_data?: {
    orbit_id: string;
    orbit_determination_date: string;
    first_observation_date: string;
    last_observation_date: string;
    data_arc_in_days: number;
    observations_used: number;
    orbit_uncertainty: string;
    minimum_orbit_intersection: string;
    jupiter_tisserand_invariant: string;
    epoch_osculation: string;
    eccentricity: string;
    semi_major_axis: string;
    inclination: string;
    ascending_node_longitude: string;
    orbital_period: string;
    perihelion_distance: string;
    perihelion_argument: string;
    aphelion_distance: string;
    perihelion_time: string;
    mean_anomaly: string;
    mean_motion: string;
    equinox: string;
    orbit_class: {
      orbit_class_type: string;
      orbit_class_description: string;
      orbit_class_range: string;
    };
  };
}

export interface NeoFeedResponse {
  links: { next: string; previous: string; self: string };
  element_count: number;
  near_earth_objects: Record<string, NeoObject[]>;
}

export interface NeoBrowseResponse {
  links: { self: string; next?: string };
  page: {
    size: number;
    total_elements: number;
    total_pages: number;
    number: number;
  };
  near_earth_objects: NeoObject[];
}

// ─── Service Functions ──────────────────────────────────────────────────────

/**
 * Neo Feed — Get NEOs by date range (max 7 days)
 */
export const getNeoFeed = async (
  startDate: string,
  endDate: string,
): Promise<NeoFeedResponse> => {
  const response = await axios.get(`${NEO_BASE_URL}/feed`, {
    params: {
      start_date: startDate,
      end_date: endDate,
      api_key: NASA_API_KEY,
    },
  });
  return response.data;
};

/**
 * Neo Lookup — Get detailed info for a specific asteroid by its NASA SPK-ID
 */
export const getNeoLookup = async (asteroidId: string): Promise<NeoObject> => {
  const response = await axios.get(`${NEO_BASE_URL}/neo/${asteroidId}`, {
    params: {
      api_key: NASA_API_KEY,
    },
  });
  return response.data;
};

/**
 * Neo Browse — Browse the overall asteroid dataset with pagination
 */
export const getNeoBrowse = async (
  page: number = 0,
  size: number = 20,
): Promise<NeoBrowseResponse> => {
  const response = await axios.get(`${NEO_BASE_URL}/neo/browse`, {
    params: {
      page,
      size,
      api_key: NASA_API_KEY,
    },
  });
  return response.data;
};
