import * as React from "react";
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import { JamHome } from "./pages/jamhome/JamHome.tsx";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AuthContextProvider} from "./api/AuthContext.tsx";
import {MyPostWrapper} from "./pages/mypost/MyPostWrapper.tsx";
import {Callback} from "./pages/callback/Callback.tsx";
import {Post} from "./pages/post/Post.tsx";
import {Logout} from "./pages/logout/Logout.tsx";
import {About} from "./pages/about/About.tsx";
import {AfterJam} from './pages/afterjam/AfterJam.tsx';
import { JamAdmin } from "./pages/jamadmin/JamAdmin.tsx";
import { PreviewPage } from "./pages/jamadmin/components/PreviewPage.tsx";
import { Login } from "./pages/login/Login.tsx";
import { Index } from "./pages/index/Index.tsx";

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

            </ReactQuerySiteWrapper>
        </BrowserRouter>
  )
};

/**
 * Magic handling for the query context for react-query
 *
 * Allows us to get the userInfo and auth state on all pages
 */
const ReactQuerySiteWrapper: React.FC<{children: string | React.JSX.Element | React.JSX.Element[]}> = ({ children }) => {
    return (
        <AuthContextProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </AuthContextProvider>
    )
}
