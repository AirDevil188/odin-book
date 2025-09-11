import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "../api/axiosInstance";

// let isRefreshing = false;

const AxiosInterceptor = ({ children }) => {
  const authContext = useAuth();

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (authContext.authState.accessToken) {
          config.headers.Authorization = `Bearer ${authContext.authState.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          //   if (isRefreshing) {
          //     // Just reject immediately if a refresh is already happening
          //     return Promise.reject(error);
          //   }

          originalRequest._retry = true;
          //   isRefreshing = true;

          try {
            const response = await axios.post(
              "/token/refresh",
              {},
              { withCredentials: true },
            );

            const { accessToken, userInfo, expiresAt } = response.data;
            authContext.setAuthState({ accessToken, userInfo, expiresAt });

            originalRequest.headers.Authorization = "Bearer " + accessToken;
            return axios(originalRequest);
          } catch (refreshError) {
            // Optionally handle logout here if refresh fails
            return Promise.reject(refreshError);
          } finally {
            // isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [authContext.authState.accessToken]);

  return children;
};

export default AxiosInterceptor;
