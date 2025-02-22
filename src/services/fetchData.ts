import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_END_POINT } from "../constants";

export async function getDataFromServer<T>(
  config: {
    endPoint: string;
    customParams?: Record<string, unknown>;
  } & AxiosRequestConfig
): Promise<T | null> {
  try {
    const axiosConfig: AxiosRequestConfig = {
      ...config, // Spread other Axios config options
      params: config.customParams,
      url: `${BASE_END_POINT}${config.endPoint}`,
      method: "GET",
    };

    const response: AxiosResponse<T> = await axios(axiosConfig);

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    return null;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      console.error(
        "Server responded with error status:",
        axiosError.response.status
      );
      console.error("Error data:", axiosError.response.data);
    } else if (axiosError.request) {
      console.error("No response received:", axiosError.request);
    } else {
      console.error("Error setting up request:", axiosError.message);
    }

    return null;
  }
}
