"use client";

import Flex from "@/components/common/Flex";
import SideBar from "@/components/dashboard/SideBar";
import { RequestService } from "@/services/RequestService";
import { theme } from "@/styles/theme";
import { useMediaQuery } from "@react-hook/media-query";
import styled from "styled-components";
import { SWRConfig } from "swr";

export default function Layout({ children }: { children: React.ReactNode }) {
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    return (
        <SWRConfig
            value={{
                fetcher: RequestService.fetch.get,
                revalidateOnFocus: false,
                revalidateOnReconnect: false,
            }}
        >
            <Flex style={{ minHeight: "100vh" }}>
                <SideBar />

                <ContentContainer
                    style={{
                        marginLeft: isMobile ? "50px" : "250px",
                        width: isMobile ? "" : "calc(100% - 250px)",
                        paddingLeft: isMobile ? "" : "20px",
                        overflowX: "auto",
                    }}
                >
                    {children}
                </ContentContainer>
            </Flex>
        </SWRConfig>
    );
}

const ContentContainer = styled.div`
    overflow-x: auto;
`;
