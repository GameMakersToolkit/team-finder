import * as React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AuthContextProvider} from "./api/AuthContext.tsx";
import { LoadingSpinner } from "./common/components/LoadingSpinner.tsx";

const Maintenance = React.lazy(() => import("./pages/maintenance/Maintenance.tsx").then((m) => ({ default: m.Maintenance })));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

export const AppRoutes: React.FC = () => {

    return (
        <BrowserRouter>
            <ReactQuerySiteWrapper>
            <React.Suspense fallback={<LoadingSpinner label="Loading page..." />}>
                <Routes>
                    <Route path="*" element={<Maintenance />}/>
                </Routes>
            </React.Suspense>

            </ReactQuerySiteWrapper>
        </BrowserRouter>
  )
};

/**
 * Magic handling for the query context for react-query
 *
 * Allows us to get the userInfo and auth state on all pages
 */
const ReactQuerySiteWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
    return (
        <AuthContextProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </AuthContextProvider>
    )
}
