import { createRoot } from "react-dom/client";
import { StrictMode, useEffect } from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { AuthProvider, useAuth } from "./context/AuthContext";
import AxiosInterceptor from "./context/AxiosInterceptor";

const router = createRouter({
  routeTree,
  context: {
    auth: undefined,
  },
});
const queryClient = new QueryClient();

// refresh token useEffect

const App = () => {
  const auth = useAuth();
  console.log(auth);
  useEffect(() => {
    toast.success("message");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={auth} />
    </QueryClientProvider>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    <AuthProvider>
      <AxiosInterceptor>
        <App />
      </AxiosInterceptor>
    </AuthProvider>
  </StrictMode>,
);
