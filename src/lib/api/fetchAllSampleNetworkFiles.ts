import { customFetch } from "@/lib/api/fetchClient";
import { FetchSampleNetworkFileResponse } from "./types";

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
