"use client"
import React from "react";
import { GlobalContextProvider } from "@/context/globalContext";
import { JobsContextProvider } from "@/context/jobsContext";


interface Props {
    children: React.ReactNode;
}
function ContextProvider({ children }: Props) {
    return <GlobalContextProvider>
        <JobsContextProvider>

            {children}

        </JobsContextProvider>
    </GlobalContextProvider>;
}

export default ContextProvider;