import * as React from "react";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import { Home } from "./pages/home/Home";
import {Header} from "./pages/components/Header.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import {AuthContextProvider} from "./api/AuthContext.tsx";
import {MyPostWrapper} from "./pages/mypost/MyPostWrapper.tsx";
import {Callback} from "./pages/callback/Callback.tsx";
import {Post} from "./pages/post/Post.tsx";
import {Logout} from "./pages/logout/Logout.tsx";
import Footer from "./pages/components/Footer.tsx";

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
            <Header />

            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/:postId" element={<Post/>}/>
                <Route path="/my-post" element={<MyPostWrapper/>}/>
                <Route path="/login/authorized" element={<Callback/>}/>
                <Route path="/logout" element={<Logout/>}/>

                {/* TODO: replace with a proper Not Found page */}
                <Route path="*" element={<p>u wot m8</p>}/>
            </Routes>

            <Footer />

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