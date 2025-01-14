import React, {useContext} from 'react';
import {JamSpecificContext, JamSpecificStyling} from '../../common/components/JamSpecificStyling.tsx';
import './JamAdmin.css'
import {useMatch, useNavigate} from 'react-router-dom';
import {Dashboard} from './components/Dashboard.tsx';
import {Styling} from './components/Styling.tsx';
import {Moderation} from './components/Moderation.tsx';
import {useAuth} from '../../api/AuthContext.tsx';
import {useUserInfo} from '../../api/userInfo.ts';

export const JamAdmin = () => {
    const currentAdminPage = useMatch("/:jamId/admin/:page")?.params.page || "dashboard";
    const auth = useAuth();
    const userInfo = useUserInfo();

    if (!auth || userInfo?.data?.isAdmin == false) {
        return <UnauthorisedView />
    }

    if (auth && userInfo?.isLoading) {
        return <LoadingView />
    }

    return (
        <JamSpecificStyling>
            <main>
                <h1>Admin</h1>

                <NavButtons currentAdminPage={currentAdminPage}/>

                {currentAdminPage == "dashboard" && <Dashboard />}
                {currentAdminPage == "styling" && <Styling />}
                {currentAdminPage == "moderation" && <Moderation />}
            </main>
        </JamSpecificStyling>
    )
}

const NavButtons: React.FC<{currentAdminPage: string}> = ({currentAdminPage}) => {
    const theme = useContext(JamSpecificContext)
    const navigate = useNavigate()

    return (
        <nav id="admin-nav" className="row flex justify-center mb-16">
            <button
                className={`nav--button ${currentAdminPage == 'dashboard' && 'active'}`}
                type="button"
                onClick={() => navigate(`/${theme.jamId}/admin`)}
            >
                Admin dashboard
            </button>
            <button
                className={`nav--button ${currentAdminPage == 'styling' && 'active'}`}
                type="button"
                onClick={() => navigate(`/${theme.jamId}/admin/styling`)}
            >
                Site Styling
            </button>
            <button
                className={`nav--button ${currentAdminPage == 'moderation' && 'active'}`}
                type="button"
                onClick={() => navigate(`/${theme.jamId}/admin/moderation`)}
            >
                Post moderation
            </button>
        </nav>
    )
}

const UnauthorisedView = () => (
    <JamSpecificStyling>
        <main>
            <h1>Admin</h1>

            <p>You do not have permission to view this page.</p>
        </main>
    </JamSpecificStyling>
)

const LoadingView = () => (
    <JamSpecificStyling>
        <main>
            <h1>Admin</h1>

            <p>Loading...</p>
        </main>
    </JamSpecificStyling>
)
