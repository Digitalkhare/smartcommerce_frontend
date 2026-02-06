// import axios from "axios";

// const instance = axios.create({
//   baseURL: "http://localhost:8080/api",
// });

// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   // Don't attach token for login or register endpoints
//   if (
//     token &&
//     !config.url.includes("/auth/login") &&
//     !config.url.includes("/auth/register") &&
//     //!config.url.includes("/products/featured") &&
//     !config.url.includes("/products")
//   ) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default instance;

import axios from "axios";
import { redirectToLogin } from "./navigation";
// Get API base URL from environment variable
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api";

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const isPublicEndpoint = [
    "/auth/login",
    "/auth/register",
    "/products/featured",
  ].some((publicPath) => config.url.startsWith(publicPath));

  if (token && !isPublicEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(error);
  },
);

export default instance;
