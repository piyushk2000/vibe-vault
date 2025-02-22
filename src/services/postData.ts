import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_END_POINT } from "../constants";

export async function postDataToServer<T>(
  config: {
    endPoint: string;
    data: unknown; // Request body payload
    headers?: Record<string, string>;
  } & AxiosRequestConfig
): Promise<T | null> {
  try {
    const response: AxiosResponse<T> = await axios({
      ...config,
      url: `${BASE_END_POINT}${config.endPoint}`,
      method: "POST",
      data: config.data,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    return response.status >= 200 && response.status < 300
      ? response.data
      : null;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.data) {
      console.error("Error response data:", axiosError.response.data);
    }

    return null;
  }
}
