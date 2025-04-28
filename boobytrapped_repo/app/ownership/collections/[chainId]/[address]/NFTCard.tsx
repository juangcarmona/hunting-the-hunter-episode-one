/* eslint-disable @next/next/no-img-element */
import Box from "@/components/common/Box";
import Flex from "@/components/common/Flex";
import { getChipData } from "@/helpers/getChipData";
import { isProduction } from "@/helpers/isProduction";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NFTModal from "./NFTModal";

interface CardProps {
    label: string;
    tokenId: string;
    image: string;
    address: string;
    chainId: number;
    chipId: string;
    currentUser: any;
}

const NFTCard: React.FC<CardProps> = ({
    label,
    tokenId: value,
    image,
    address,
    chainId,
    chipId,
    currentUser,
}) => {
    const onpenCollectionModal = () => {
        setIsOpen(true);
    };
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [campaign, setCampaign] = useState<any>();
    const [status, setStatus] = useState<any>();

    const loadData = async (_chipId: string) => {
        console.log("loadData NFTCard", _chipId);
        const { data, status } = await getChipData(chipId);
        setStatus(status);
        setCampaign(data?.campaign);
    };
    useEffect(() => {
        (async () => {
            try {
                await loadData(chipId);
            } catch (ex) {
                console.error(ex);
            }
        })();
    }, [chipId]);

    return (
        <>
            {((isProduction() && status === "production") ||
                (!isProduction() && status === "dev")) && (
                <CardContainer>
                    {campaign && (
                        <Box
                            position={"absolute"}
                            zIndex={1}
                            top={20}
                            right={20}
                            py={1}
                            px={2}
                            backgroundColor="rgba(255,255,255,0.5)"
                            borderRadius={50}
                            border="solid 2px"
                            borderColor={
                                campaign.campaignType === "LOST"
                                    ? "#FFC701"
                                    : "#FF0000"
                            }
                        >
                            <Flex
                                justifyContent="space-between"
                                alignItems={"center"}
                                rowGap={10}
                            >
                                <Flex>
                                    <Image
                                        src={
                                            campaign.campaignType === "LOST"
                                                ? "/images/campaigns/lost.svg"
                                                : "/images/campaigns/stole.svg"
                                        }
                                        width={20}
                                        height={20}
                                        alt={""}
                                    />
                                </Flex>
                                <Flex
                                    color={
                                        campaign.campaignType === "LOST"
                                            ? "#FFC701"
                                            : "#FF0000"
                                    }
                                >
                                    <strong>
                                        {campaign.campaignType === "LOST"
                                            ? "Lost"
                                            : "Stolen"}
                                    </strong>
                                </Flex>
                            </Flex>
                        </Box>
                    )}
                    <CardImage
                        opacity={1}
                        onClick={() => onpenCollectionModal()}
                    >
                        <img
                            src={
                                image ||
                                "/images/default-featured-image.png.jpg"
                            }
                            alt=""
                            className="image"
                        />
                    </CardImage>
                    <CardLabel>{label}</CardLabel>
                    <NFTModal
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        image={image}
                        label={label}
                        chainId={chainId}
                        address={address}
                        value={value}
                        chipId={chipId}
                        currentUser={currentUser}
                        onReload={loadData}
                    />
                </CardContainer>
            )}
        </>
    );
};

const CardContainer = styled.div`
    position: relative;
    width: 220px;
    height: 260px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px solid white;
    border-radius: 20px;
    overflow: hidden;
    text-align: center;
    transition: border-color 0.7s ease;

    @media (max-width: 600px) {
        width: 190px;
        height: 230px;
        margin: 1px 1px 0 1px;
    }

    &:hover {
        border-color: rgb(49, 115, 248);
    }
`;

// .campaign {
//     color: red;
//     font-size: 20px;
//     font-weight: bold;
//     position: absolute;
//     top: 30px;
// }

const CardImage = styled.div<{ opacity: number }>`
    opacity: ${(props) => props.opacity};
    // width: 200px;
    // height: 200px;
    border: 1px solid rgb(231, 232, 236);
    border-radius: 20px;
    object-fit: cover;
    @media (max-width: 600px) {
        width: 170px;
        height: 170px;
    }

    .image {
        width: 200px;
        height: 200px;
        border-radius: 20px;
        object-fit: cover;
        @media (max-width: 600px) {
            width: 170px;
            height: 170px;
            border-radius: 20px;
        }
    }
`;

const CardLabel = styled.div`
    font-size: 15px;
    padding: 15px 0 0 0;
    font-weight: bold;
    color: black;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
`;

export default NFTCard;
