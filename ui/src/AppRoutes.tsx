import * as React from "react";
import {Routes, Route, BrowserRouter, Navigate} from "react-router-dom";
import { Home } from "./pages/home/Home";
import {Header} from "./pages/components/Header.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import {AuthContextProvider} from "./api/AuthContext.tsx";
import {MyPostWrapper} from "./pages/mypost/MyPostWrapper.tsx";
import {Callback} from "./pages/callback/Callback.tsx";
import {Post} from "./pages/post/Post.tsx";
import {Logout} from "./pages/logout/Logout.tsx";
import Footer from "./pages/components/Footer.tsx";
import {About} from "./pages/about/About.tsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

export const AppRoutes: React.FC = () => {
    const queryParams = new URLSearchParams(window.location.search)

    if (queryParams.get("hn")) {
        const hideNoticeFlag = queryParams.get("hn") === "1"
        localStorage.setItem("tf.hideDevNotice", hideNoticeFlag.toString())
    }

    const showDevNotice = localStorage.getItem("tf.hideDevNotice") === "false"

    return (
        <BrowserRouter>
            <ReactQuerySiteWrapper>
            <Header />
                {showDevNotice
                    ? <div style={{
                            width: '100%',
                            padding: '1rem',
                            backgroundColor: '#FFA726',
                            border: '3px solid black',
                            color: 'black',
                            fontSize: '2rem',
                            textAlign: 'center',
                        }}>
                            The team finder is in development mode, please come back later!
                        </div>
                    : <></>
                }

            <Routes>
                <Route path="/" element={<Navigate to="/gmtk" />} />

                <Route path="/gmtk/" element={<Home/>}/>
                <Route path="/gmtk/:postId" element={<Post/>}/>
                <Route path="/gmtk/my-post" element={<MyPostWrapper/>}/>

                <Route path="/about" element={<About/>}/>
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