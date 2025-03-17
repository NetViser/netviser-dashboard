// Choose the base URL based on the stage.
const baseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

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
  init?: RequestInit
): Promise<any> {
  // If input is a string and not an absolute URL, prepend the base URL.
  let url = typeof input === "string" ? input : "";
  if (typeof input === "string" && !/^https?:\/\//i.test(input)) {
    url = baseURL + input;
  } else if (input instanceof Request && !/^https?:\/\//i.test(input.url)) {
    url = baseURL + input.url;
  }

  console.log("Final url: ", url);

  // Merge default settings with any provided init; ensures credentials are included.
  const defaultInit: RequestInit = { credentials: "include" };
  const mergedInit: RequestInit = { ...defaultInit, ...init };

  // Perform the fetch request.
  const response = await fetch(url, mergedInit);

  // Throw an error if the response is not OK.
  if (!response.ok) {
    let errorMessage = "Fetch error";
    try {
      const errorData = await response.json();
      errorMessage = errorData?.message || JSON.stringify(errorData);
    } catch (e) {
      // Fallback error message if JSON parsing fails.
    }
    throw new Error(errorMessage);
  }

  // Return the parsed JSON response.
  return response.json();
}
