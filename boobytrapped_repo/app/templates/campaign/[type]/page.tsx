"use client";
import Lost from "@/components/campaigns/Lost";
import Message from "@/components/campaigns/Message";
import Stole from "@/components/campaigns/Stole";
import Navigation from "@/components/templates/Navigation";
import { theme } from "@/styles/theme";
import { useMediaQuery } from "@react-hook/media-query";
import { useRouter } from "next/navigation";
import styled from "styled-components";

interface CreateCampaignProps {
    params: {
        type: string;
    };
}

const CreateCampaign: React.FC<CreateCampaignProps> = ({
    params: { type },
}) => {
    const router = useRouter();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    return (
        <div style={{ maxWidth: 500, width: isMobile ? "90%" : "100%" }}>
            <Navigation
                step={1}
                onExit={() => {
                    router.push("/admin/campaigns");
                }}
            />
            <Container>
                {type?.toLowerCase() === "lost" ? (
                    <Lost />
                ) : type?.toLowerCase() === "stole" ? (
                    <Stole />
                ) : type?.toLowerCase() === "personal-message" ? (
                    <Message />
                ) : null}
            </Container>
        </div>
    );
};

const Container = styled.div`
    padding: 20px;
    background: white;
    border-radius: 30px;
    max-width: 500px;
    width: 100%;
    margin: 0 auto;
`;

export default CreateCampaign;
