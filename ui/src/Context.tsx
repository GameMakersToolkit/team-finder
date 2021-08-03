import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const Context: React.FC = ({ children }) => (
  <Router>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </Router>
);
