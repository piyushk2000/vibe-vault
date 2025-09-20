import { RequestServer } from "../config/api";

export async function getDataFromServer<T>(config: {
  endPoint: string;
  customParams?: Record<string, unknown>;
  token?: string;
}): Promise<T | null> {
  try {
    // Build query string from customParams
    let url = config.endPoint;
    if (config.customParams) {
      const params = new URLSearchParams();
      Object.entries(config.customParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await RequestServer(url, "GET", undefined, false, config.token);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function postDataToServer<T>(config: {
  endPoint: string;
  body?: object;
  token?: string;
  isFile?: boolean;
}): Promise<T | null> {
  try {
    const response = await RequestServer(
      config.endPoint,
      "POST",
      config.body,
      config.isFile,
      config.token
    );
    return response;
  } catch (error) {
    console.error("Error posting data:", error);
    return null;
  }
}

export async function putDataToServer<T>(config: {
  endPoint: string;
  body?: object;
  token?: string;
  isFile?: boolean;
}): Promise<T | null> {
  try {
    const response = await RequestServer(
      config.endPoint,
      "PUT",
      config.body,
      config.isFile,
      config.token
    );
    return response;
  } catch (error) {
    console.error("Error updating data:", error);
    return null;
  }
}

export async function deleteDataFromServer<T>(config: {
  endPoint: string;
  token?: string;
}): Promise<T | null> {
  try {
    const response = await RequestServer(config.endPoint, "DELETE", undefined, false, config.token);
    return response;
  } catch (error) {
    console.error("Error deleting data:", error);
    return null;
  }
}
