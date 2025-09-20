import * as React from "react";
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom';
import { JamHome } from "./pages/jamhome/JamHome.tsx";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AuthContextProvider} from "./api/AuthContext.tsx";
import {MyPostWrapper} from "./pages/mypost/MyPostWrapper.tsx";
import {Callback} from "./pages/callback/Callback.tsx";
import {Post} from "./pages/post/Post.tsx";
import {Logout} from "./pages/logout/Logout.tsx";
import {About} from "./pages/about/About.tsx";
import {AfterJam} from './pages/afterjam/AfterJam.tsx';

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

            <Routes>
                <Route path="/" element={<Navigate to="/gmtk" />}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/login/authorized" element={<Callback/>}/>
                <Route path="/logout" element={<Logout/>}/>

                <Route path="/:jamId" element={<JamHome/>}/>
                <Route path="/:jamId/my-post" element={<MyPostWrapper/>}/>
                <Route path="/:jamId/about" element={<About/>}/>
                <Route path="/:jamId/finished" element={<AfterJam />}/>
                <Route path="/:jamId/:postId" element={<Post/>}/>

                {/* TODO: replace with a proper Not Found page */}
                <Route path="*" element={<p>u wot m8</p>}/>
            </Routes>

            </ReactQuerySiteWrapper>
        </BrowserRouter>
  )
};

/**
 * Magic handling for the query context for react-query
 *
 * Allows us to get the userInfo and auth state on all pages
 */
const ReactQuerySiteWrapper: React.FC<{children: string | JSX.Element | JSX.Element[]}> = ({ children }) => {
    return (
        <AuthContextProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </AuthContextProvider>
    )
}
