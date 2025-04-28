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
            <Container>
                <Heading>
                    <img src="/images/logo.png" alt="logo" />
                </Heading>

                {children}
            </Container>
        </SWRConfig>
    );
}

const Container = styled.div``;

const Heading = styled.div`
    margin: 20px auto;

    max-width: 500px;
    text-align: center;

    img {
        max-width: 100%;
        object-fit: contain;
    }
`;
