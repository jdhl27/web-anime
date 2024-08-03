import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const MAX_RETRIES = 2;
const baseAPI = "https://localhost:8080/";

// Extender la interfaz InternalAxiosRequestConfig para incluir __retryCount
interface CustomInternalAxiosRequestConfig
  extends InternalAxiosRequestConfig<unknown> {
  __retryCount?: number;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: baseAPI,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const { config, response } = error;

    if (config) {
      // Verificar que response y response.status estén definidos
      if (response && response.status >= 500) {
        const customConfig = config as CustomInternalAxiosRequestConfig;
        customConfig.__retryCount = customConfig.__retryCount || 0;

        if (customConfig.__retryCount < MAX_RETRIES) {
          customConfig.__retryCount += 1;

          // Espera un poco antes de reintentar
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Reintenta la petición
          return apiClient(customConfig);
        }
      }
      return Promise.reject(error);
    }

    // Si no podemos reintentar o el error es de cliente (4xx), rechazamos el error
    return Promise.reject(error);
  }
);

export default apiClient;
