// AxiosInterceptor.jsx
import { useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import axios from "../api/axiosInstance";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

const AxiosInterceptor = ({ children }) => {
  const authContext = useAuth();

  // Ref to always hold the latest access token
  const accessTokenRef = useRef(authContext.authState.accessToken);

  // Update ref whenever accessToken changes
  useEffect(() => {
    accessTokenRef.current = authContext.authState.accessToken;
  }, [authContext.authState.accessToken]);

  useEffect(() => {
    // Request interceptor - uses latest token from ref
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = accessTokenRef.current;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor - handles 401 and token refresh
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If already retried or intercepted, reject to prevent loops
        if (originalRequest._retry) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401) {
          if (isRefreshing) {
            // Queue requests while refreshing
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axios(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            // Call refresh token endpoint
            const response = await axios.post(
              "/token/refresh",
              {},
              { withCredentials: true },
            );

            const { accessToken, userInfo, expiresAt } = response.data;

            // Update auth context state with new token
            authContext.setAuthState({ accessToken, userInfo, expiresAt });

            // Update default header for all future requests
            axios.defaults.headers.common["Authorization"] =
              `Bearer ${accessToken}`;

            // Update ref to latest token
            accessTokenRef.current = accessToken;

            processQueue(null, accessToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError);
            // Optionally logout user here or handle the error
            authContext.logout();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
    // cleanup function
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [authContext]);

  return children;
};

export default AxiosInterceptor;
