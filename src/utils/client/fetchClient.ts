const env = process.env.NEXT_PUBLIC_ENV ?? "local"

let baseURL = "http://localhost:8080"
if (env === "production") {
  baseURL = "https://netviser-app-dev-440043701198.asia-east1.run.app"
}

/**
 * A custom fetch client that:
 * - Prepends a base URL for relative requests.
 * - Merges in default settings (e.g., credentials: "include").
 * - Throws an error when the response is not OK.
 *
 * @param input - The input URL or Request object.
 * @param init - Optional RequestInit configuration.
 * @returns A promise resolving to the parsed JSON response.
 */
export async function customFetch(
  input: RequestInfo,
  init?: RequestInit & { parseJson?: boolean } // Add optional flag
): Promise<any> {
  let url = typeof input === "string" ? input : "";
  if (typeof input === "string" && !/^https?:\/\//i.test(input)) {
    url = baseURL + input;
  } else if (input instanceof Request && !/^https?:\/\//i.test(input.url)) {
    url = baseURL + input.url;
  }

  console.log("Final url: ", url);

  const defaultInit: RequestInit = { credentials: "include" };
  const mergedInit: RequestInit = { ...defaultInit, ...init };

  const response = await fetch(url, mergedInit);

  if (!response.ok) {
    let errorMessage = "Fetch error";
    try {
      const errorData = await response.json();
      errorMessage = errorData?.message || JSON.stringify(errorData);
    } catch (e) {
      // Fallback error message
    }
    throw new Error(errorMessage);
  }

  // Only parse JSON if parseJson isn’t explicitly false
  return init?.parseJson === false ? response : response.json();
}
