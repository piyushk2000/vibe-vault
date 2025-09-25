// API Configuration based on environment
let apiUrl = "";
let isDev = false;

if (window.location.href.includes("localhost")) {
  // Use localhost for development
  apiUrl = "http://localhost:3200";
  isDev = true;
} else {
  // Default to vibe-be for production
  apiUrl = "https://vibe-be.pkcode.in";
  isDev = false;
}

export const API_BASE_URL = apiUrl;
export const IS_DEV = isDev;

// Centralized request server function
export const RequestServer = async (
  url: string,
  method: string,
  body?: object,
  isFile?: boolean,
  tokenAPI?: string | null,
  getAbortController?: (ab: AbortController, clearTimeout: () => void) => void
) => {
  const authToken = tokenAPI || localStorage.getItem("token");
  const controller = new AbortController();

  const id = setTimeout(() => {
    controller.abort();
    if ((window as any).enqueueSnackbar) {
      (window as any).enqueueSnackbar("Server connection failed", {
        variant: "error",
      });
    }
  }, 60000);

  const headers: any = isFile
    ? {}
    : {
      "Content-Type": "application/json",
    };

  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const request: RequestInit = body
    ? {
      method: method,
      headers,
      body: isFile ? (body as BodyInit) : JSON.stringify(body),
      signal: controller.signal,
    }
    : {
      method: method,
      headers,
      signal: controller.signal,
    };

  try {
    if (getAbortController) {
      await getAbortController(controller, () => clearTimeout(id));
    }

    const response = await fetch(API_BASE_URL + url, request);
    !getAbortController && clearTimeout(id);

    if (response.status === 200) {
      if (typeof response === "string") {
        return response;
      }
      return await response.json();
    } else if (response.status === 401) {
      // Handle token expiration
      const data = await response.json();
      if (
        data.error === "Invalid token" ||
        data.error === "Session Expired" ||
        data.error === "JsonWebTokenError" ||
        data.error === "Your link has expired. Please request a new one." ||
        data.error === "We couldn't verify your access. Please try again or request a new link." ||
        data.error === "Your session is no longer valid. Please try again or request a new link." ||
        data.error === "Token Blocked"
      ) {
        const url = new URL(window.location.href);
        if (url.searchParams.get("token")) {
          url.searchParams.delete("token");
          window.history.replaceState(null, "", url.toString());
        }
        localStorage.clear();
        if (!tokenAPI) {
          window.location.reload();
        }
      }
      return data;
    } else {
      return await response.json();
    }
  } catch (error) {
    if (controller.signal.aborted) {
      console.error("Request was aborted.");
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
};