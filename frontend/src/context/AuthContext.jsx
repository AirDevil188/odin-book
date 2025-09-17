import { useState, createContext, useContext } from "react";
import { redirect } from "@tanstack/react-router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const userInfo = localStorage.getItem("userInfo");

  const [authState, setAuthState] = useState({
    accessToken: null,
    userInfo: userInfo ? JSON.stringify(userInfo) : {},
    expiresAt: null,
  });

  const setAuthInfo = ({ accessToken, userInfo, expiresAt }) => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    return setAuthState({ accessToken, userInfo, expiresAt });
  };

  const logout = () => {
    // remove userInfo from the local storage
    localStorage.removeItem("userInfo");
    // delete token from the state
    setAuthState((prevState) => ({
      ...prevState,
      accessToken: null,
      userInfo: {},
    }));
    redirect({ to: "/sign-in" });
  };

  const isAuthenticated = () => {
    if (!authState.accessToken || !authState.expiresAt) return false;
    // return true if current time is less than expires on the token
    else return new Date().getTime() / 1000 < authState.expiresAt;
  };

  const contextValue = {
    authState,
    setAuthState: (authInfo) => setAuthInfo(authInfo),
    isAuthenticated,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
