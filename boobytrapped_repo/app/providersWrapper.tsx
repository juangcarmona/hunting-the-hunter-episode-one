"use client";

import GlobalProvider from "@/providers/GlobalProvider";
import VechainProvider from "@/providers/VechainProvider";
import Web3AuthProvider from "@/providers/Web3AuthProvider";
import "@/styles/index.scss";
import dynamic from "next/dynamic";
import { RecoilRoot } from "recoil";
import styled, { ThemeProvider as SCThemeProvider } from "styled-components";
import { theme } from "../styles/theme";

const Web3AuthVechainProvider = dynamic(
    async () => import("@/providers/Web3AuthVechainProvider"),
    { ssr: false },
);

export default function ProvidersWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RecoilRoot>
            <Web3AuthProvider>
                <GlobalProvider>
                    <SCThemeProvider theme={theme}>
                        <Container>
                            <InnerContainer>
                                <VechainProvider>
                                    <Web3AuthVechainProvider>
                                        {children}
                                    </Web3AuthVechainProvider>
                                </VechainProvider>
                            </InnerContainer>
                        </Container>
                    </SCThemeProvider>
                </GlobalProvider>
            </Web3AuthProvider>
        </RecoilRoot>
    );
}

const Container = styled.main`
    touch-action: pan-x pan-y;
    max-width: 100%;
    min-height: 100vh;
    width: 100%;
    vertical-align: inherit;
    flex-shrink: 0;
    flex-direction: column;
    flex-basis: auto;
    display: flex;
    align-items: stretch;
`;

const InnerContainer = styled.div`
    flex: 1 0 auto;
    vertical-align: inherit;
    max-width: 100%;
    min-height: 0px;
    min-width: 0px;
    // padding-top: 1%;
    flex-direction: column;
    display: flex;
    align-items: stretch;
`;
