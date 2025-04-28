"use client";

import AuthService from "@/services/AuthService";
import { RequestService } from "@/services/RequestService";
import { logoState } from "@/state/logo";
import { theme } from "@/styles/theme";
import { LOGIN_ROUTE } from "@/utils/constants";
import { useMediaQuery } from "@react-hook/media-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import Flex from "../common/Flex";
import SideBarItem from "./SideBarItem";

const SideBar: React.FC = () => {
    const router = useRouter();
    const customLogo = useRecoilValue(logoState);
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    const [smartTokensMenuShow, setSmartTokensMenuShow] = useState(false);
    const [showMenuOnMobile, setShowMenuOnMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [userRole, setUserRole] = React.useState<"ADMIN" | "USER">();

    React.useEffect(() => {
        const parsedJwt = AuthService.parsedJwt;

        if (!parsedJwt) {
            router.replace(LOGIN_ROUTE);
        }

        setUserRole(parsedJwt?.role);
    }, []);

    const changeShowMenuOnMobile = () => {
        isMobile && setShowMenuOnMobile((state) => !state);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setShowMenuOnMobile(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <Container
            ref={containerRef}
            style={{
                width: isMobile && !showMenuOnMobile ? "50px" : "250px",
                padding: isMobile && !showMenuOnMobile ? 0 : "20px",
                paddingTop: isMobile && !showMenuOnMobile ? "30px" : 0,
            }}
        >
            <div onClick={changeShowMenuOnMobile}>
                <img
                    src={
                        isMobile && !showMenuOnMobile
                            ? "/images/logo2.webp"
                            : "/images/wov-labs-white-logo.png"
                    }
                    width="100%"
                    height="auto"
                />
            </div>

            <Flex
                style={{ fontWeight: "bold" }}
                flexDirection={"column"}
                marginTop="12px"
                columnGap={10}
            >
                <SideBarItem
                    onClick={() => {
                        showMenuOnMobile && changeShowMenuOnMobile();
                    }}
                    icon="home"
                    route={"/admin/home"}
                >
                    {(!isMobile || showMenuOnMobile) && "Home"}
                </SideBarItem>

                {userRole == "USER" && (
                    <SideBarItem
                        onClick={() => {
                            showMenuOnMobile && changeShowMenuOnMobile();
                        }}
                        icon="items"
                        route={"/admin/items"}
                    >
                        {(!isMobile || showMenuOnMobile) && "Items"}
                    </SideBarItem>
                )}
                {userRole == "USER" && (
                    <SideBarItem
                        onClick={() => {
                            showMenuOnMobile && changeShowMenuOnMobile();
                        }}
                        icon="projects-icon"
                        route={"/admin/projects"}
                    >
                        {(!isMobile || showMenuOnMobile) && "Projects"}
                    </SideBarItem>
                )}

                <SideBarItem
                    icon="chips"
                    route={isMobile ? "#" : "/admin/chips/available"}
                    canBeClicked={false}
                    onClick={() => {
                        if (isMobile && !showMenuOnMobile) {
                            setSmartTokensMenuShow((state) => !state);
                        }
                        showMenuOnMobile && changeShowMenuOnMobile();
                    }}
                >
                    {(!isMobile || showMenuOnMobile) && "Smart Tags"}
                </SideBarItem>

                {(!isMobile || smartTokensMenuShow || showMenuOnMobile) && (
                    <div style={{ marginLeft: ".3rem" }}>
                        <SideBarItem
                            onClick={() => {
                                showMenuOnMobile && changeShowMenuOnMobile();
                            }}
                            icon="chips-available--dark"
                            route={"/admin/chips/available"}
                            level={isMobile && !showMenuOnMobile ? 0 : 3}
                        >
                            {(!isMobile || showMenuOnMobile) && "Available"}
                        </SideBarItem>
                    </div>
                )}

                {userRole == "USER" &&
                    (!isMobile || smartTokensMenuShow || showMenuOnMobile) && (
                        <div style={{ marginLeft: ".3rem" }}>
                            <SideBarItem
                                onClick={() => {
                                    showMenuOnMobile &&
                                        changeShowMenuOnMobile();
                                }}
                                icon="chips-groups--dark"
                                route={"/admin/groups"}
                                level={isMobile && !showMenuOnMobile ? 0 : 3}
                            >
                                {(!isMobile || showMenuOnMobile) && "Groups"}
                            </SideBarItem>
                        </div>
                    )}

                {userRole == "ADMIN" && (
                    <SideBarItem
                        icon="chips-assigned--dark"
                        route={"/admin/chips/assigned"}
                        level={3}
                    >
                        {!isMobile && "Assigned"}
                    </SideBarItem>
                )}

                {(!isMobile || smartTokensMenuShow || showMenuOnMobile) && (
                    <div style={{ marginLeft: ".3rem" }}>
                        <SideBarItem
                            onClick={() => {
                                showMenuOnMobile && changeShowMenuOnMobile();
                            }}
                            icon="chips-used--dark"
                            route={"/admin/chips/used"}
                            level={isMobile && !showMenuOnMobile ? 0 : 3}
                        >
                            {(!isMobile || showMenuOnMobile) && "Tokenized"}
                        </SideBarItem>
                    </div>
                )}
                {userRole == "ADMIN" && (
                    <>
                        <SideBarItem
                            icon="chips-import--dark"
                            level={3}
                            route={"/admin/chips/import"}
                        >
                            {!isMobile && "Import"}
                        </SideBarItem>

                        <SideBarItem icon="user-add" route={"/admin/codes"}>
                            {!isMobile && "Invitations"}
                        </SideBarItem>

                        <SideBarItem icon="users" route={"/admin/clients"}>
                            {!isMobile && "Clients"}
                        </SideBarItem>
                    </>
                )}

                {userRole == "USER" && (
                    <>
                        <SideBarItem
                            icon="campaigns"
                            route={"/admin/campaigns"}
                            onClick={() => {
                                showMenuOnMobile && changeShowMenuOnMobile();
                            }}
                        >
                            {(!isMobile || showMenuOnMobile) && "Campaigns"}
                        </SideBarItem>

                        <SideBarItem
                            onClick={() => {
                                showMenuOnMobile && changeShowMenuOnMobile();
                            }}
                            icon="passport"
                            route={"/admin/profile"}
                        >
                            {(!isMobile || showMenuOnMobile) &&
                                "Digital Passport"}
                        </SideBarItem>
                    </>
                )}

                <SideBarItem
                    icon="help"
                    route={"https://info.wovlabs.com/"}
                    externalWindow={true}
                    onClick={() => {
                        showMenuOnMobile && changeShowMenuOnMobile();
                    }}
                >
                    {(!isMobile || showMenuOnMobile) && "Help"}
                </SideBarItem>

                <SideBarItem
                    icon={"logout"}
                    route={"#"}
                    onClick={RequestService.logout}
                >
                    {(!isMobile || showMenuOnMobile) && "Logout"}
                </SideBarItem>
            </Flex>
        </Container>
    );
};

const Container = styled.div`
    transition:
        width 0.3s ease,
        padding 0.3s ease;
    position: fixed;
    height: 100vh;
    background: black;
    color: white;
    border-right: 1px solid #e5eaef;
    flex-shrink: 0;
    font-family: "Poppins", sans-serif;
    z-index: 1000;
`;

export default SideBar;
