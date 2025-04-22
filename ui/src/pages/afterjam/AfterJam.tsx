import React, {useContext, useEffect} from 'react';
import {JamSpecificContext, JamSpecificStyling} from '../../common/components/JamSpecificStyling.tsx';
import {useNavigate} from 'react-router-dom';

export const AfterJam: React.FC = () => {

    return (
        <JamSpecificStyling>
            <AfterJamBody />
        </JamSpecificStyling>
    );
}

const AfterJamBody = () => {

    const theme = useContext(JamSpecificContext)
    const navigate = useNavigate()

    useEffect(() => {
    if (new Date() < new Date(theme.end)) {
        return navigate("/", {replace: true})
    }
    }, [])

    return (
        <div className="container max-w-screen-xxl h-[100vh]">
            <div style={{
                width: "100%",
                margin: 0,
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
            }}>
                <img
                    className="block"
                    style={{margin: "0 auto"}}
                    src={theme?.logoLargeUrl}
                    width={400}
                    alt={`${theme?.name} Team Finder`}
                />

                <h1 className="text-3xl my-4 text-center font-bold px-2">Thanks for using the Team Finder!</h1>

                <p className="mb-2 text-center px-2">{`The ${theme?.name} has now ended, and the Team Finder is no longer active.`}</p>
                <p className="mb-2 text-center px-2">Thanks so much for using the Team Finder. We really hope you found
                    a good team and enjoyed the game jam!</p>
                <p className="mb-2 text-center px-2">{`The Team Finder will return in ${new Date(theme?.end).getFullYear() + 1} with next year's jam.`}</p>
            </div>
        </div>
    )
}
