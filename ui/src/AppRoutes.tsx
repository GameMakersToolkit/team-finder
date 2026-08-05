import * as React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AuthContextProvider} from "./api/AuthContext.tsx";
import { LoadingSpinner } from "./common/components/LoadingSpinner.tsx";

const JamHome = React.lazy(() => import("./pages/jamhome/JamHome.tsx").then((m) => ({ default: m.JamHome })));
const MyPostWrapper = React.lazy(() => import("./pages/mypost/MyPostWrapper.tsx").then((m) => ({ default: m.MyPostWrapper })));
const Callback = React.lazy(() => import("./pages/callback/Callback.tsx").then((m) => ({ default: m.Callback })));
const Post = React.lazy(() => import("./pages/post/Post.tsx").then((m) => ({ default: m.Post })));
const Logout = React.lazy(() => import("./pages/logout/Logout.tsx").then((m) => ({ default: m.Logout })));
const About = React.lazy(() => import("./pages/about/About.tsx").then((m) => ({ default: m.About })));
const AfterJam = React.lazy(() => import("./pages/afterjam/AfterJam.tsx").then((m) => ({ default: m.AfterJam })));
const JamAdmin = React.lazy(() => import("./pages/jamadmin/JamAdmin.tsx").then((m) => ({ default: m.JamAdmin })));
const PreviewPage = React.lazy(() => import("./pages/jamadmin/components/PreviewPage.tsx").then((m) => ({ default: m.PreviewPage })));
const Login = React.lazy(() => import("./pages/login/Login.tsx").then((m) => ({ default: m.Login })));
const Index = React.lazy(() => import("./pages/index/Index.tsx").then((m) => ({ default: m.Index })));

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
                    <Route path="/" element={<Index />}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/logout" element={<Logout/>}/>

                    <Route path="/:jamId" element={<JamHome/>}/>
                    <Route path="/:jamId/login/" element={<Login/>}/>
                    <Route path="/:jamId/login/authorized" element={<Callback/>}/>
                    <Route path="/:jamId/my-post" element={<MyPostWrapper/>}/>
                    <Route path="/:jamId/about" element={<About/>}/>
                    <Route path="/:jamId/finished" element={<AfterJam />}/>
                    <Route path="/:jamId/admin/*" element={<JamAdmin />}/>
                    <Route path="/:jamId/admin/styling/preview-page" element={<PreviewPage />}/>
                    <Route path="/:jamId/:postId" element={<Post/>}/>

                    {/* TODO: replace with a proper Not Found page */}
                    <Route path="*" element={<p>u wot m8</p>}/>
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
