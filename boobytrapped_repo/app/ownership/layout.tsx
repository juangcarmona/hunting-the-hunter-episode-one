"use client";
import useConnect from "@/hooks/useConnect";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styled from "styled-components";
import Sidebar from "./SideBar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isConnected } = useConnect();

    useEffect(() => {
        if (isConnected === false) {
            router.push("/");
        }
    }, [isConnected]);

    if (isConnected === false) {
        return "Not connected";
    }

    return (
        <Main>
            <Sidebar />
            {children}
        </Main>
    );
}

const Main = styled.div`
    flex: 1;
    display: flex;
`;
