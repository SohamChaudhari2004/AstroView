import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types matching backend models
export interface Asteroid {
  _id: string;
  nasaId: string;
  name: string;
  isHazardous: boolean;
  closeApproachDate: string;
  missDistanceKm: number;
  relativeVelocityKph: number;
  lastUpdated: string;
}

export interface Mission {
  _id: string;
  name: string;
  organization: string;
  status: "upcoming" | "ongoing" | "completed" | "planned";
  destination: string;
  launchDate: string;
  description: string;
  crew: number;
  progress: number;
  missionType: string;
  imageUrl?: string;
  lastUpdated: string;
}

export interface SolarStorm {
  _id: string;
  gstID: string;
  startTime: string;
  kpIndex: number;
  observedTime: string;
  source: string;
}

export interface Satellite {
  _id: string;
  satelliteName: string;
  line1: string;
  line2: string;
  source: string;
  lastUpdated: string;
}

export interface DashboardData {
  asteroids: Asteroid[];
  solarStorms: SolarStorm[];
  satellites: Satellite[];
  kpIndex: number;
  systemStatus: {
    status: "stable" | "warning" | "critical";
    threatLevel: "low" | "moderate" | "high";
    lastUpdate: string;
  };
}

// Mock data for when API is unavailable or returns empty
const MOCK_ASTEROIDS: Asteroid[] = [
  {
    _id: "1",
    nasaId: "2465633",
    name: "(2011 MD)",
    isHazardous: true,
    closeApproachDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    missDistanceKm: 384400,
    relativeVelocityKph: 35000,
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "2",
    nasaId: "54509",
    name: "(2000 PH5) YORP",
    isHazardous: true,
    closeApproachDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    missDistanceKm: 4600000,
    relativeVelocityKph: 42000,
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "3",
    nasaId: "99942",
    name: "99942 Apophis",
    isHazardous: true,
    closeApproachDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    missDistanceKm: 31000,
    relativeVelocityKph: 28000,
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "4",
    nasaId: "101955",
    name: "101955 Bennu",
    isHazardous: true,
    closeApproachDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    missDistanceKm: 6000000,
    relativeVelocityKph: 25000,
    lastUpdated: new Date().toISOString(),
  },
];

const MOCK_SOLAR_STORMS: SolarStorm[] = [
  {
    _id: "1",
    gstID: "GST-2024-001",
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    kpIndex: 6,
    observedTime: new Date().toISOString(),
    source: "NOAA",
  },
  {
    _id: "2",
    gstID: "GST-2024-002",
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    kpIndex: 4,
    observedTime: new Date().toISOString(),
    source: "SWPC",
  },
];

const MOCK_SATELLITES: Satellite[] = [
  {
    _id: "1",
    satelliteName: "ISS (ZARYA)",
    line1:
      "1 25544U 98067A   24100.50000000  .00014000  00000-0  25000-3 0  9990",
    line2:
      "2 25544  51.6400 247.4600 0006700  30.0000 330.0000 15.49000000000000",
    source: "CelesTrak",
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "2",
    satelliteName: "HUBBLE",
    line1:
      "1 20580U 90037B   24100.50000000  .00001500  00000-0  90000-4 0  9990",
    line2:
      "2 20580  28.4700 120.3000 0002800 200.0000 160.0000 15.09000000000000",
    source: "CelesTrak",
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "3",
    satelliteName: "STARLINK-1234",
    line1:
      "1 44713U 19074A   24100.50000000  .00020000  00000-0  13000-3 0  9990",
    line2:
      "2 44713  53.0000  50.0000 0001200  90.0000 270.0000 15.06000000000000",
    source: "CelesTrak",
    lastUpdated: new Date().toISOString(),
  },
];

// API Functions
export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await api.get<DashboardData>("/api/nasa/dashboard");
    const data = response.data;

    // If data is empty, return mock data
    return {
      asteroids: data.asteroids.length > 0 ? data.asteroids : MOCK_ASTEROIDS,
      solarStorms:
        data.solarStorms.length > 0 ? data.solarStorms : MOCK_SOLAR_STORMS,
      satellites:
        data.satellites.length > 0 ? data.satellites : MOCK_SATELLITES,
      kpIndex: data.kpIndex || 4,
      systemStatus: data.systemStatus || {
        status: "stable",
        threatLevel: "low",
        lastUpdate: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      asteroids: MOCK_ASTEROIDS,
      solarStorms: MOCK_SOLAR_STORMS,
      satellites: MOCK_SATELLITES,
      kpIndex: 4,
      systemStatus: {
        status: "stable",
        threatLevel: "low",
        lastUpdate: new Date().toISOString(),
      },
    };
  }
};

export const fetchAsteroids = async (): Promise<Asteroid[]> => {
  try {
    const response = await api.get<Asteroid[]>("/api/nasa/asteroids");
    return response.data.length > 0 ? response.data : MOCK_ASTEROIDS;
  } catch (error) {
    console.error("Error fetching asteroids:", error);
    return MOCK_ASTEROIDS;
  }
};

export const fetchAsteroidById = async (
  id: string,
): Promise<Asteroid | null> => {
  try {
    const response = await api.get<Asteroid>(`/api/nasa/asteroids/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching asteroid by id:", error);
    // Fallback to mock data if backend can't find it (e.g. mock IDs)
    const mockMatch = MOCK_ASTEROIDS.find(
      (a) => a._id === id || a.nasaId === id,
    );
    return mockMatch || null;
  }
};

export const fetchSolarWeather = async (): Promise<SolarStorm[]> => {
  try {
    const response = await api.get<SolarStorm[]>("/api/nasa/solar-weather");
    return response.data.length > 0 ? response.data : MOCK_SOLAR_STORMS;
  } catch (error) {
    console.error("Error fetching solar weather:", error);
    return MOCK_SOLAR_STORMS;
  }
};

export const fetchSatellites = async (): Promise<Satellite[]> => {
  try {
    const response = await api.get<Satellite[]>("/api/nasa/satellite-tle");
    return response.data.length > 0 ? response.data : MOCK_SATELLITES;
  } catch (error) {
    console.error("Error fetching satellites:", error);
    return MOCK_SATELLITES;
  }
};

export const initializeData = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const response = await api.post("/api/nasa/init-data");
    return response.data;
  } catch (error) {
    console.error("Error initializing data:", error);
    return { success: false, message: "Failed to initialize data" };
  }
};

// Mission API Functions
export const fetchMissions = async (): Promise<Mission[]> => {
  try {
    const response = await api.get<Mission[]>("/api/missions");
    return response.data;
  } catch (error) {
    console.error("Error fetching missions:", error);
    return [];
  }
};

export const fetchMissionById = async (id: string): Promise<Mission | null> => {
  try {
    const response = await api.get<Mission>(`/api/missions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching mission by id:", error);
    return null;
  }
};

export const fetchMissionsByStatus = async (
  status: "upcoming" | "ongoing" | "completed" | "planned",
): Promise<Mission[]> => {
  try {
    const response = await api.get<Mission[]>(`/api/missions/status/${status}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching missions by status:", error);
    return [];
  }
};

export const fetchMissionsByOrganization = async (
  org: string,
): Promise<Mission[]> => {
  try {
    const response = await api.get<Mission[]>(
      `/api/missions/organization/${org}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching missions by organization:", error);
    return [];
  }
};

export const fetchOrganizations = async (): Promise<string[]> => {
  try {
    const response = await api.get<string[]>("/api/missions/organizations");
    return response.data;
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return ["NASA", "ISRO", "ESA", "SpaceX", "CNSA"];
  }
};

export const initializeMissions = async (): Promise<{
  message: string;
  count: number;
}> => {
  try {
    const response = await api.post("/api/missions/init");
    return response.data;
  } catch (error) {
    console.error("Error initializing missions:", error);
    return { message: "Failed to initialize missions", count: 0 };
  }
};

// Auth API (for future use)
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

// ISRO API
export interface ISROSpacecraft {
  id: number;
  name: string;
}
export interface ISROLauncher {
  id: string;
}
export interface ISROCentre {
  id: number;
  name: string;
  Place: string;
  State: string;
}
export interface ISRODashboard {
  spacecrafts: ISROSpacecraft[];
  launchers: ISROLauncher[];
  centres: ISROCentre[];
}

export const fetchISRODashboard = async (): Promise<ISRODashboard> => {
  try {
    const response = await api.get<ISRODashboard>("/api/isro/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching ISRO dashboard:", error);
    return { spacecrafts: [], launchers: [], centres: [] };
  }
};

// Mars API
export interface MarsRoverPhoto {
  id: number;
  sol: number;
  camera: { name: string; full_name: string };
  img_src: string;
  earth_date: string;
  rover: { name: string };
}
export interface MarsRover {
  name: string;
  agency: string;
  status: string;
  launchDate: string;
  landingDate: string;
  landingSite: string;
  totalPhotos: number;
  maxSol: number;
  latestPhotos: MarsRoverPhoto[];
  description: string;
}
export interface MarsOrbiter {
  name: string;
  agency: string;
  launchDate: string;
  status: string;
  description: string;
}
export interface MarsDashboard {
  rovers: MarsRover[];
  orbiters: MarsOrbiter[];
}

const MOCK_MARS_DATA: MarsDashboard = {
  rovers: [
    {
      name: "Curiosity",
      agency: "NASA",
      status: "active",
      launchDate: "2011-11-26",
      landingDate: "2012-08-06",
      landingSite: "Gale Crater",
      totalPhotos: 695670,
      maxSol: 4102,
      latestPhotos: [],
      description:
        "Car-sized rover exploring Gale Crater since 2012. Studying Mars habitability and geology.",
    },
    {
      name: "Perseverance",
      agency: "NASA",
      status: "active",
      launchDate: "2020-07-30",
      landingDate: "2021-02-18",
      landingSite: "Jezero Crater",
      totalPhotos: 289456,
      maxSol: 1428,
      latestPhotos: [],
      description:
        "Latest Mars rover searching for ancient microbial life and collecting samples for future return.",
    },
    {
      name: "Zhurong",
      agency: "CNSA",
      status: "hibernating",
      launchDate: "2020-07-23",
      landingDate: "2021-05-14",
      landingSite: "Utopia Planitia",
      totalPhotos: 0,
      maxSol: 0,
      latestPhotos: [],
      description:
        "Chinese rover that explored Utopia Planitia. Entered hibernation in May 2022.",
    },
  ],
  orbiters: [
    {
      name: "2001 Mars Odyssey",
      agency: "NASA",
      launchDate: "2001-04-07",
      status: "active",
      description:
        "Longest-serving spacecraft at Mars. Maps minerals and radiation environment.",
    },
    {
      name: "Mars Express",
      agency: "ESA",
      launchDate: "2003-06-02",
      status: "active",
      description:
        "European orbiter studying Mars atmosphere, surface, and subsurface.",
    },
    {
      name: "Mars Reconnaissance Orbiter",
      agency: "NASA",
      launchDate: "2005-08-12",
      status: "active",
      description:
        "High-resolution imaging and data relay for surface missions.",
    },
    {
      name: "MAVEN",
      agency: "NASA",
      launchDate: "2013-11-18",
      status: "active",
      description:
        "Studying Mars upper atmosphere and its interaction with solar wind.",
    },
    {
      name: "Mars Orbiter Mission (Mangalyaan)",
      agency: "ISRO",
      launchDate: "2013-11-05",
      status: "completed",
      description:
        "India's first Mars mission. Successfully orbited Mars on first attempt.",
    },
    {
      name: "ExoMars TGO",
      agency: "ESA/Roscosmos",
      launchDate: "2016-03-14",
      status: "active",
      description:
        "Studying trace gases in Mars atmosphere, especially methane.",
    },
    {
      name: "Hope (Al Amal)",
      agency: "UAESA",
      launchDate: "2020-07-19",
      status: "active",
      description: "UAE mission studying Mars weather and climate dynamics.",
    },
    {
      name: "Tianwen-1 Orbiter",
      agency: "CNSA",
      launchDate: "2020-07-23",
      status: "active",
      description:
        "Chinese orbiter conducting remote sensing of Mars surface and atmosphere.",
    },
  ],
};

export const fetchMarsDashboard = async (): Promise<MarsDashboard> => {
  try {
    const response = await api.get<MarsDashboard>("/api/mars/dashboard");
    if (
      response.data &&
      response.data.rovers &&
      response.data.rovers.length > 0
    ) {
      return response.data;
    }
    throw new Error("Empty Mars data");
  } catch (error) {
    console.error("Error fetching Mars dashboard, using fallback:", error);
    return MOCK_MARS_DATA;
  }
};

export const fetchMarsRoverPhotos = async (
  rover: string,
  sol: number,
): Promise<MarsRoverPhoto[]> => {
  try {
    const response = await api.get(
      `/api/mars/rover/${rover}?sol=${sol}&page=1`,
    );
    return response.data.photos || [];
  } catch (error) {
    console.error("Error fetching rover photos:", error);
    return [];
  }
};

// Satellite detail
export const fetchSatelliteById = async (
  id: string,
): Promise<Satellite | null> => {
  const decoded = decodeURIComponent(id);
  const findMatch = (sats: Satellite[]) =>
    sats.find(
      (s) =>
        s._id === id ||
        s._id === decoded ||
        s.satelliteName === decoded ||
        s.satelliteName === id,
    );

  try {
    // Try satellite-tle endpoint first
    const response = await api.get<Satellite[]>("/api/nasa/satellite-tle");
    if (response.data.length > 0) {
      const match = findMatch(response.data);
      if (match) return match;
    }
  } catch {
    /* try dashboard fallback */
  }

  try {
    // Try dashboard endpoint (which also has satellite data)
    const dashResponse = await api.get<DashboardData>("/api/nasa/dashboard");
    if (
      dashResponse.data.satellites &&
      dashResponse.data.satellites.length > 0
    ) {
      const match = findMatch(dashResponse.data.satellites);
      if (match) return match;
    }
  } catch {
    /* fall through to mock */
  }

  // Fallback to mock data
  const mockMatch = findMatch(MOCK_SATELLITES);
  return mockMatch || null;
};

// ──── SPACE WEATHER API ────
export interface SpaceWeatherSummary {
  solarFlareCount: number;
  cmeCount: number;
  geoStormCount: number;
  solarWindEvents: number;
  highSpeedStreamCount: number;
  maxKpIndex: number;
  earthImpactCMEs: number;
}

export interface AuroraForecast {
  kpIndex: number;
  visibility: string;
  probability: number;
  bestViewing: string;
}

export interface SolarFlare {
  flrID: string;
  beginTime: string;
  peakTime: string;
  classType: string;
  sourceLocation: string;
}

export interface CMEEvent {
  activityID: string;
  startTime: string;
  speed: number | null;
  type: string;
  earthImpact: boolean;
}

export interface GeoStorm {
  gstID: string;
  startTime: string;
  kpIndex: number;
}

export interface SolarWindEvent {
  activityID: string;
  eventTime: string;
  location: string;
}

export interface SpaceWeatherNotification {
  messageType: string;
  messageIssueTime: string;
  messageBody: string;
}

export interface SpaceWeatherDashboard {
  alertLevel: "nominal" | "watch" | "warning" | "alert";
  timestamp: string;
  summary: SpaceWeatherSummary;
  auroraForecast: AuroraForecast;
  solarFlares: SolarFlare[];
  cmeEvents: CMEEvent[];
  geoStorms: GeoStorm[];
  solarWind: SolarWindEvent[];
  recentNotifications: SpaceWeatherNotification[];
}

const MOCK_SPACE_WEATHER: SpaceWeatherDashboard = {
  alertLevel: "watch",
  timestamp: new Date().toISOString(),
  summary: {
    solarFlareCount: 12,
    cmeCount: 5,
    geoStormCount: 2,
    solarWindEvents: 8,
    highSpeedStreamCount: 3,
    maxKpIndex: 4,
    earthImpactCMEs: 1,
  },
  auroraForecast: {
    kpIndex: 4,
    visibility: "Visible near polar regions (60°+)",
    probability: 60,
    bestViewing: "Check back during active storms",
  },
  solarFlares: [
    {
      flrID: "FLR-2026-02-10",
      beginTime: "2026-02-10T08:00Z",
      peakTime: "2026-02-10T08:30Z",
      classType: "M2.1",
      sourceLocation: "N15E20",
    },
    {
      flrID: "FLR-2026-02-08",
      beginTime: "2026-02-08T14:00Z",
      peakTime: "2026-02-08T14:25Z",
      classType: "C5.4",
      sourceLocation: "S10W30",
    },
    {
      flrID: "FLR-2026-02-05",
      beginTime: "2026-02-05T22:00Z",
      peakTime: "2026-02-05T22:45Z",
      classType: "M1.0",
      sourceLocation: "N20W15",
    },
    {
      flrID: "FLR-2026-02-03",
      beginTime: "2026-02-03T06:30Z",
      peakTime: "2026-02-03T07:00Z",
      classType: "C3.2",
      sourceLocation: "S05E40",
    },
    {
      flrID: "FLR-2026-01-28",
      beginTime: "2026-01-28T18:00Z",
      peakTime: "2026-01-28T18:20Z",
      classType: "X1.2",
      sourceLocation: "N10E50",
    },
  ],
  cmeEvents: [
    {
      activityID: "CME-2026-02-10",
      startTime: "2026-02-10T09:00Z",
      speed: 850,
      type: "S",
      earthImpact: true,
    },
    {
      activityID: "CME-2026-02-05",
      startTime: "2026-02-05T23:00Z",
      speed: 520,
      type: "C",
      earthImpact: false,
    },
    {
      activityID: "CME-2026-01-28",
      startTime: "2026-01-28T18:30Z",
      speed: 1200,
      type: "O",
      earthImpact: false,
    },
  ],
  geoStorms: [
    { gstID: "GST-2026-02-12", startTime: "2026-02-12T04:00Z", kpIndex: 4 },
    { gstID: "GST-2026-02-08", startTime: "2026-02-08T16:00Z", kpIndex: 3 },
  ],
  solarWind: [
    {
      activityID: "IPS-2026-02-11",
      eventTime: "2026-02-11T12:00Z",
      location: "Earth",
    },
    {
      activityID: "IPS-2026-02-07",
      eventTime: "2026-02-07T08:00Z",
      location: "Earth",
    },
  ],
  recentNotifications: [
    {
      messageType: "FLR",
      messageIssueTime: "2026-02-10T09:00Z",
      messageBody:
        "Solar flare activity M2.1 detected from active region N15E20...",
    },
    {
      messageType: "CME",
      messageIssueTime: "2026-02-10T10:00Z",
      messageBody:
        "Coronal Mass Ejection observed with potential Earth impact...",
    },
  ],
};

export const fetchSpaceWeatherDashboard =
  async (): Promise<SpaceWeatherDashboard> => {
    try {
      const response = await api.get<SpaceWeatherDashboard>(
        "/api/space-weather/dashboard",
      );
      if (response.data && response.data.summary) return response.data;
      throw new Error("Empty data");
    } catch (error) {
      console.error("Error fetching space weather, using fallback:", error);
      return MOCK_SPACE_WEATHER;
    }
  };

// ──── MARS WEATHER ────
export interface MarsWeather {
  source: string;
  currentConditions: {
    temperature: { avg: number; min: number; max: number; unit: string };
    pressure: { avg: number; min: number; max: number; unit: string };
    windSpeed: { avg: number; max: number; unit: string };
    windDirection: string;
    season: string;
    opacity: string;
    uvIndex: string;
    sol: number;
  };
  atmosphere: {
    composition: { gas: string; percentage: number }[];
    surfacePressure: string;
    scaleHeight: string;
  };
  dustStorms: {
    global: boolean;
    regional: string;
    lastMajorStorm: string;
  };
  lastUpdated: string;
}

export const fetchMarsWeather = async (): Promise<MarsWeather | null> => {
  try {
    const response = await api.get<MarsWeather>("/api/mars/weather");
    return response.data;
  } catch (error) {
    console.error("Error fetching Mars weather:", error);
    return null;
  }
};

// ─── NeoWs (Near-Earth Object) API Functions ────────────────────────────────

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

export const fetchNeoFeed = async (
  startDate: string,
  endDate: string,
): Promise<NeoFeedResponse> => {
  const response = await api.get<NeoFeedResponse>("/api/neo/feed", {
    params: { start_date: startDate, end_date: endDate },
  });
  return response.data;
};

export const fetchNeoLookup = async (
  asteroidId: string,
): Promise<NeoObject> => {
  const response = await api.get<NeoObject>(`/api/neo/lookup/${asteroidId}`);
  return response.data;
};

export const fetchNeoBrowse = async (
  page: number = 0,
  size: number = 20,
): Promise<NeoBrowseResponse> => {
  const response = await api.get<NeoBrowseResponse>("/api/neo/browse", {
    params: { page, size },
  });
  return response.data;
};

export default api;
