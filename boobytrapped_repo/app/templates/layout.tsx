"use client";

import { RequestService } from "@/services/RequestService";
import styled from "styled-components";
import { SWRConfig } from "swr";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig
            value={{
                fetcher: RequestService.fetch.get,
                revalidateOnFocus: false,
                revalidateOnReconnect: false,
            }}
        >
            <ContentContainer>
                <BackdropFilter>{children}</BackdropFilter>
            </ContentContainer>
        </SWRConfig>
    );
}

const ContentContainer = styled.div`
    width: 100vw;
    height: 100vh;

    background-color: black;
    background:
        url("/images/wov__bg.jpg"),
        black 50% / cover no-repeat;
    /* filter: blur(100px); */
    background-size: 100% 100%;
`;

const BackdropFilter = styled.div`
    width: 100%;
    height: 100%;

    backdrop-filter: blur(30px);

    display: flex;
    justify-content: center;
    align-items: center;
`;
