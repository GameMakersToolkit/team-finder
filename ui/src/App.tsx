import React from "react";
import './App.css'
import {AppRoutes} from "./AppRoutes.tsx";
import {Toaster} from "react-hot-toast";
import {KoFiButton} from './common/components/KoFiButton.tsx';
import { ErrorBoundary } from "./common/components/ErrorBoundary.tsx";

export const App: React.FC = () => {
    return (
        <>
            <ErrorBoundary>
                <AppRoutes />
            </ErrorBoundary>
            <Toaster
                position="bottom-center"
                reverseOrder={false}
            />
            <KoFiButton />
        </>
    )
}
