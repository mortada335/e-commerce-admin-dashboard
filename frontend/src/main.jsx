import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import "@/index.css";
import { ThemeProvider } from "@/context/theme/index.js";
import ErrorBoundary from "@/pages/error-boundary";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { ConfigProvider } from "./context/config";





const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 5 * 1000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
 
              <ConfigProvider>
                <App />
                <Toaster />
                </ConfigProvider>
           
           
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
