// AxiosInterceptor.jsx
import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "../api/axiosInstance";

const AxiosInterceptor = ({ children }) => {
  const authContext = useAuth();

  useEffect(() => {
    // request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        // if accessToken is present put it in the Bearer auth header
        if (authContext.authState.accessToken) {
          config.headers.Authorization = `Bearer ${authContext.authState.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
    // response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        // if the error came from the /token/refresh endpoint reject it
        if (originalRequest._intercepted) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          // prevent loop
          originalRequest._retry = true;

          try {
            // make API call to the refresh token endpoint
            const response = await axios.post(
              "/token/refresh",
              {},
              { withCredentials: true, _intercepted: true },
            );
            const { accessToken, userInfo, expiresAt } = response.data;
            // set the state
            authContext.setAuthState({ accessToken, userInfo, expiresAt });

            // if all is successful assign  Bearer token with the accessToken
            originalRequest.headers.Authorization = "Bearer " + accessToken;
            return axios(originalRequest);
          } catch (refreshError) {
            // if there is err reject the Promise and logout the user
            authContext.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [authContext.authState.accessToken, authContext.logout]);

  return children;
};

export default AxiosInterceptor;
