import { customFetch } from "@/lib/api/fetchClient";

export interface SampleNetworkFile {
  name: string;
  featuredAttacks: string[]
}

export interface FetchSampleNetworkFileResponse {
  sample_files: SampleNetworkFile[];
}

export async function fetchAllSampleNetworkFiles(): Promise<
  FetchSampleNetworkFileResponse
> {
  try {
    const url = "/api/sample-network-files";
    const data: FetchSampleNetworkFileResponse = await customFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'omit'
    });
    return data;
  } catch (error) {
    console.error("Error fetching sample network files:", error);
    throw new Error("Failed to fetch sample network files.");
  }
}
