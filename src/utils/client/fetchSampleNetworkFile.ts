import { customFetch } from "./fetchClient";

/**
 * Fetches a sample network file from the server.
 *
 * @param samplefilename - The name of the sample network file to fetch.
 * @returns The sample network file.
 */
export async function fetchSampleNetworkFile(samplefilename: string) {
  try {
    const data = await customFetch(`/api/upload?samplefile=${samplefilename}`, {
      method: "POST",
    });

    return data;
  } catch (error) {
    console.error("Error fetching sample network files:", error);
    throw new Error("Failed to fetch sample network files.");
  }
}
