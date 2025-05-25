import React from "react";
import './App.css'
import {AppRoutes} from "./AppRoutes.tsx";
import {Toaster} from "react-hot-toast";
import {KoFiButton} from './common/components/KoFiButton.tsx';

export const App: React.FC = () => {
    return (
        <>
            <AppRoutes />
            <Toaster
                position="bottom-center"
                reverseOrder={false}
            />
            <KoFiButton />
        </>
    )
}
