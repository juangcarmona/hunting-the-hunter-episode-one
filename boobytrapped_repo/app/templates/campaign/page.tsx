"use client";
import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import Navigation from "@/components/templates/Navigation";
import { theme } from "@/styles/theme";
import { useMediaQuery } from "@react-hook/media-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

const AVAILABLE_MODULES = [
    {
        name: "Lost",
        value: "lost",
        image: "/images/campaigns/lost.svg",
    },
    {
        name: "Stolen",
        value: "stole",
        image: "/images/campaigns/stole.svg",
    },
    {
        name: "Personal Message",
        value: "personal-message",
        image: "/images/campaigns/message.svg",
    },
];

const CampaignPage = () => {
    const [selectedModule, setSelectedModule] = useState<string>();
    const router = useRouter();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);

    const createModule = () => {
        router.push(`/templates/campaign/${selectedModule}`);
    };

    return (
        <div style={{ width: isMobile ? "90%" : undefined }}>
            <Navigation
                step={0}
                onExit={() => {
                    router.back();
                }}
            />

            <Container style={{ minWidth: isMobile ? 0 : "500px" }}>
                <div>Select a module for this campaign</div>

                <Flex justifyContent={"space-between"} rowGap={20}>
                    {AVAILABLE_MODULES.map((module) => (
                        <Module
                            key={module.value}
                            selected={selectedModule === module.value}
                            onClick={() => setSelectedModule(module.value)}
                        >
                            <Image
                                src={module.image}
                                width={50}
                                height={50}
                                alt={module.name}
                            />

                            <div style={{ maxWidth: 100, textAlign: "center" }}>
                                {module.name}
                            </div>
                        </Module>
                    ))}
                </Flex>

                <Flex justifyContent={"flex-end"}>
                    <Button
                        outline
                        disabled={!selectedModule}
                        onClick={createModule}
                    >
                        Next
                    </Button>
                </Flex>
            </Container>
        </div>
    );
};

const Module = styled.div<{ selected?: boolean }>`
    width: 150px;
    height: 150px;
    border-radius: 8px;
    border: 2px #e6e8ec solid;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    column-gap: 10px;

    font-family: "Work Sans", sans-serif;
    font-weight: bold;
    font-size: 14px;
    text-transform: uppercase;

    ${({ selected }) =>
        selected &&
        `
        border-color: #3772ff;
    `}

    &:hover {
        cursor: pointer;
        border-color: #3772ff;
    }
`;

const Container = styled.div`
    background-color: white;
    min-width: 500px;
    min-height: 300px;
    padding: 20px;
    border-radius: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export default CampaignPage;
