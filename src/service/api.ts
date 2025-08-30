import axios, { AxiosInstance } from "axios";
import { setupCache } from "axios-cache-interceptor";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND_URL,
  withCredentials: true,
});

const cache = setupCache(axiosInstance, {
  // Define el tiempo de vida (TTL) de la caché en milisegundos
  // Ejemplo: 5 minutos
  ttl: 1000 * 60 * 5,
});

export default cache;
