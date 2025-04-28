"use client";

import GlobalStyle from "@/styles/GlobalStyle";
import { theme } from "@/styles/theme";
import { ThemeProvider } from "styled-components";
import StyledComponentsRegistry from "../lib/StyledComponentsRegistry";
import WagmiProvider from "./WagmiProvider";

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <StyledComponentsRegistry>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                <WagmiProvider>{children}</WagmiProvider>
            </ThemeProvider>
        </StyledComponentsRegistry>
    );
};

export default GlobalProvider;
