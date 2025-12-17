import axios, { AxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.devportal.artgharana.com";

export type MethodType = "GET" | "POST" | "DELETE" | "PUT" | "PATCH";

export interface FetchApiInterface {
  method?: MethodType;
  path: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: Record<string, any> | FormData;
  onUploadProgress?: (percent: number) => void;
}

const getTimezoneOffset = () => {
  const offset = -new Date().getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};


const getCommonHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "timezone": getTimezoneOffset(),
});

export const fetchApi = async <T>({
  method = "GET",
  path,
  headers = {},
  params,
  data,
  onUploadProgress,
}: FetchApiInterface): Promise<T> => {
  try {
    const isFormData = data instanceof FormData;

    const config: AxiosRequestConfig = {
      baseURL: BASE_URL,
      url: `${BASE_URL}/${path}`,
      method,
      params,
      headers: isFormData
        ? { ...getCommonHeaders(), "Content-Type": undefined, ...headers }
        : { ...getCommonHeaders(), ...headers },
      data,
      onUploadProgress: onUploadProgress
        ? (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onUploadProgress(percent);
          }
        }
        : undefined,
    };

    if (path == 'auth/login'){
      delete config.headers.Authorization;
    }
    const response = await axios.request<T>(config);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      if (window.location.pathname !== "/unauthorize" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    throw error.response?.data || error.message || error;
  }
};
