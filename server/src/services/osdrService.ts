import axios from "axios";

const OSDR_BASE_URL = "https://osdr.nasa.gov";

interface OSDRSearchParams {
  term?: string;
  from?: number;
  size?: number;
  type?: string;
  sort?: string;
  order?: "ASC" | "DESC";
  ffield?: string;
  fvalue?: string;
}

interface OSDRStudyFilesParams {
  studyIds: string;
  page?: number;
  size?: number;
  all_files?: boolean;
}

/**
 * Search for datasets in OSDR
 * @param params - Search parameters
 * @returns Promise with search results
 */
export const searchOSDRDatasets = async (params: OSDRSearchParams) => {
  try {
    const queryParams: any = {
      term: params.term || "",
      from: params.from || 0,
      size: params.size || 25,
    };

    if (params.type) queryParams.type = params.type;
    if (params.sort) queryParams.sort = params.sort;
    if (params.order) queryParams.order = params.order;
    if (params.ffield) queryParams.ffield = params.ffield;
    if (params.fvalue) queryParams.fvalue = params.fvalue;

    console.log(`Searching OSDR datasets with params:`, queryParams);

    const response = await axios.get(`${OSDR_BASE_URL}/osdr/data/search`, {
      params: queryParams,
    });

    console.log(`OSDR Search Response Status: ${response.status}`);
    return response.data;
  } catch (error: any) {
    console.error("Error searching OSDR datasets:", error.message);
    if (error.response) {
      throw new Error(
        `OSDR API Error: ${error.response.status} - ${error.response.statusText}`,
      );
    }
    throw new Error("Failed to search OSDR datasets");
  }
};

/**
 * Get study files for specific study IDs
 * @param params - Study files parameters
 * @returns Promise with study files data
 */
export const getStudyFiles = async (params: OSDRStudyFilesParams) => {
  try {
    const queryParams: any = {};
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.size !== undefined) queryParams.size = params.size;
    if (params.all_files !== undefined)
      queryParams.all_files = params.all_files;

    console.log(`Fetching study files for: ${params.studyIds}`);

    const response = await axios.get(
      `${OSDR_BASE_URL}/osdr/data/osd/files/${params.studyIds}`,
      { params: queryParams },
    );

    console.log(`Study Files Response Status: ${response.status}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching study files:", error.message);
    if (error.response) {
      throw new Error(
        `OSDR API Error: ${error.response.status} - ${error.response.statusText}`,
      );
    }
    throw new Error("Failed to fetch study files");
  }
};

/**
 * Get metadata for a specific study
 * @param studyId - Study ID (e.g., "87")
 * @returns Promise with study metadata
 */
export const getStudyMetadata = async (studyId: string) => {
  try {
    console.log(`Fetching metadata for study: ${studyId}`);

    const response = await axios.get(
      `${OSDR_BASE_URL}/osdr/data/osd/meta/${studyId}`,
    );

    console.log(`Study Metadata Response Status: ${response.status}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching study metadata:", error.message);
    if (error.response) {
      throw new Error(
        `OSDR API Error: ${error.response.status} - ${error.response.statusText}`,
      );
    }
    throw new Error("Failed to fetch study metadata");
  }
};

/**
 * Get all missions with full details
 * The /missions endpoint only returns URLs, so we fetch each mission's details
 * @returns Promise with array of mission objects
 */
export const getAllMissions = async () => {
  try {
    console.log("Fetching all missions from OSDR");

    // Step 1: Get the list of mission URLs
    const listResponse = await axios.get(
      `${OSDR_BASE_URL}/geode-py/ws/api/missions`,
    );

    const missionList = listResponse.data?.data || [];
    console.log(`Found ${missionList.length} missions, fetching details...`);

    // Step 2: Fetch details for each mission (in batches to avoid overwhelming the API)
    const BATCH_SIZE = 20;
    const allMissions: any[] = [];

    for (let i = 0; i < missionList.length; i += BATCH_SIZE) {
      const batch = missionList.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(async (item: any) => {
        try {
          const url = item.mission;
          if (!url) return null;
          const resp = await axios.get(url, { timeout: 10000 });
          return resp.data;
        } catch (err: any) {
          console.warn(`Failed to fetch mission detail: ${err.message}`);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      allMissions.push(...batchResults.filter(Boolean));
    }

    console.log(`Successfully fetched ${allMissions.length} mission details`);
    return allMissions;
  } catch (error: any) {
    console.error("Error fetching missions:", error.message);
    if (error.response) {
      throw new Error(
        `OSDR API Error: ${error.response.status} - ${error.response.statusText}`,
      );
    }
    throw new Error("Failed to fetch missions");
  }
};

/**
 * Get specific mission details
 * @param missionId - Mission identifier
 * @returns Promise with mission data
 */
export const getMissionById = async (missionId: string) => {
  try {
    console.log(`Fetching mission: ${missionId}`);

    const response = await axios.get(
      `${OSDR_BASE_URL}/geode-py/ws/api/mission/${missionId}`,
    );

    console.log(`Mission Response Status: ${response.status}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching mission:", error.message);
    if (error.response) {
      throw new Error(
        `OSDR API Error: ${error.response.status} - ${error.response.statusText}`,
      );
    }
    throw new Error("Failed to fetch mission");
  }
};

/**
 * Get all experiments with full details
 * The /experiments endpoint only returns URLs, so we fetch each experiment's details
 * @returns Promise with array of experiment objects
 */
export const getAllExperiments = async () => {
  try {
    console.log("Fetching all experiments from OSDR");

    // Step 1: Get the list of experiment URLs
    const listResponse = await axios.get(
      `${OSDR_BASE_URL}/geode-py/ws/api/experiments`,
    );

    const experimentList = listResponse.data?.data || [];
    console.log(
      `Found ${experimentList.length} experiments, fetching details...`,
    );

    // Step 2: Fetch details in batches (limit to first 100 to avoid massive request count)
    const MAX_EXPERIMENTS = 100;
    const limitedList = experimentList.slice(0, MAX_EXPERIMENTS);
    const BATCH_SIZE = 20;
    const allExperiments: any[] = [];

    for (let i = 0; i < limitedList.length; i += BATCH_SIZE) {
      const batch = limitedList.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(async (item: any) => {
        try {
          const url = item.experiment;
          if (!url) return null;
          const resp = await axios.get(url, { timeout: 10000 });
          return resp.data;
        } catch (err: any) {
          console.warn(`Failed to fetch experiment detail: ${err.message}`);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      allExperiments.push(...batchResults.filter(Boolean));
    }

    console.log(
      `Successfully fetched ${allExperiments.length} experiment details`,
    );
    return {
      experiments: allExperiments,
      totalAvailable: experimentList.length,
    };
  } catch (error: any) {
    console.error("Error fetching experiments:", error.message);
    if (error.response) {
      throw new Error(
        `OSDR API Error: ${error.response.status} - ${error.response.statusText}`,
      );
    }
    throw new Error("Failed to fetch experiments");
  }
};

/**
 * Get specific experiment details
 * @param experimentId - Experiment identifier
 * @returns Promise with experiment data
 */
export const getExperimentById = async (experimentId: string) => {
  try {
    console.log(`Fetching experiment: ${experimentId}`);

    const response = await axios.get(
      `${OSDR_BASE_URL}/geode-py/ws/api/experiment/${experimentId}`,
    );

    console.log(`Experiment Response Status: ${response.status}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching experiment:", error.message);
    if (error.response) {
      throw new Error(
        `OSDR API Error: ${error.response.status} - ${error.response.statusText}`,
      );
    }
    throw new Error("Failed to fetch experiment");
  }
};

/**
 * Download a file from OSDR by its full path.
 * Returns an axios response with responseType 'stream' for piping.
 * @param filePath - The full path of the file in the OSDR data store
 */
export const downloadFile = async (filePath: string) => {
  const downloadUrl = `${OSDR_BASE_URL}/bio/repo/data/studies/${filePath}`;
  console.log(`Attempting OSDR file download: ${downloadUrl}`);

  try {
    const response = await axios.get(downloadUrl, {
      responseType: "stream",
      timeout: 120000,
    });
    return response;
  } catch (error: any) {
    // Fallback: try alternative URL pattern
    const altUrl = `${OSDR_BASE_URL}/geode-py/ws/api/file/download?source=${encodeURIComponent(filePath)}`;
    console.log(`Primary download failed, trying fallback: ${altUrl}`);
    try {
      const altResponse = await axios.get(altUrl, {
        responseType: "stream",
        timeout: 120000,
      });
      return altResponse;
    } catch (altError: any) {
      console.error("Error downloading OSDR file:", error.message);
      if (error.response) {
        throw new Error(
          `OSDR Download Error: ${error.response.status} - ${error.response.statusText}`,
        );
      }
      throw new Error("Failed to download file from OSDR");
    }
  }
};
