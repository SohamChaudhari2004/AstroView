import axios from "axios";

const NASA_API_KEY =
  process.env.NASA_API_KEY || "fxpgQ4j0RVUvt8lIaQvzaVgb6LNZ7GPgTIHAv4b6";
const TECH_TRANSFER_BASE_URL = "https://technology.nasa.gov/api/api";

interface TechTransferQueryParams {
  patent?: string;
  patent_issued?: string;
  software?: string;
  spinoff?: string;
}

interface TechTransferResponse {
  results?: any[];
  count?: number;
  total?: number;
  perpage?: number;
  page?: number;
  [key: string]: any;
}

/**
 * Fetches NASA Technology Transfer data (patents, software, spinoffs)
 * API Documentation: Per NASA HTML response, actual working endpoint is:
 * https://technology.nasa.gov/api/api/[patent|software|spinoff]/{keywords}
 * Example: https://technology.nasa.gov/api/api/patent/rocket
 * @param queryParams - Query parameters for filtering tech transfer data
 * @returns Promise<TechTransferResponse>
 */
export const fetchTechTransferData = async (
  queryParams: TechTransferQueryParams,
): Promise<TechTransferResponse> => {
  try {
    const { patent, patent_issued, software, spinoff } = queryParams;

    // Build the API endpoint based on the query type
    // Format: https://technology.nasa.gov/api/api/[patent|software|spinoff]/{keyword}
    let endpoint = TECH_TRANSFER_BASE_URL;
    let keyword = "";

    // Determine which endpoint to use based on query parameters
    if (patent) {
      endpoint += "/patent";
      keyword = patent;
    } else if (patent_issued) {
      endpoint += "/patent";
      keyword = patent_issued;
    } else if (software) {
      endpoint += "/software";
      keyword = software;
    } else if (spinoff) {
      endpoint += "/spinoff";
      keyword = spinoff;
    } else {
      // Default to patent if no specific type is provided
      endpoint += "/patent";
      keyword = "";
    }

    // Append keyword to the URL path if provided
    if (keyword) {
      endpoint += `/${encodeURIComponent(keyword)}`;
    }

    console.log(`Fetching Tech Transfer data from: ${endpoint}`);

    const response = await axios.get(endpoint, {
      headers: {
        Accept: "application/json",
      },
    });

    console.log(`Tech Transfer API Response Status: ${response.status}`);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching tech transfer data:", error.message);

    if (error.response) {
      console.error("API Response Error:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
      throw new Error(
        `NASA API Error: ${error.response.status} - ${error.response.statusText}`,
      );
    }

    throw new Error("Failed to fetch tech transfer data");
  }
};

/**
 * Search for patents by keyword
 * @param keyword - Search term for patents
 * @returns Promise<TechTransferResponse>
 */
export const searchPatents = async (
  keyword: string,
): Promise<TechTransferResponse> => {
  return fetchTechTransferData({ patent: keyword });
};

/**
 * Search for NASA software by keyword
 * @param keyword - Search term for software
 * @returns Promise<TechTransferResponse>
 */
export const searchSoftware = async (
  keyword: string,
): Promise<TechTransferResponse> => {
  return fetchTechTransferData({ software: keyword });
};

/**
 * Search for NASA spinoff technologies by keyword
 * @param keyword - Search term for spinoffs
 * @returns Promise<TechTransferResponse>
 */
export const searchSpinoffs = async (
  keyword: string,
): Promise<TechTransferResponse> => {
  return fetchTechTransferData({ spinoff: keyword });
};
