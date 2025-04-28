import { tNFT } from "@/types/tNFT";
import Link from "next/link";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styled from "styled-components";

interface cardProps {
    name: string;
    address: string | undefined;
    nfts: tNFT[];
    chainId: number;
}

const images: { [chainId: number]: string } = {
    1: "/images/ethereum-eth-icon.webp",
    137: "/images/polygon-matic-icon.webp",
    100009: "/images/vechain-vet-logo.png",
};

const CollectionCard: React.FC<cardProps> = ({
    name,
    address,
    nfts,
    chainId,
}) => {
    return (
        <CardContainer>
            <Link href={`/ownership/collections/${chainId}/${address}`}>
                <img
                    src={images?.[chainId] || ""}
                    alt="image"
                    className="chain-icon"
                />
                <div className="nftNumbers">
                    <div className="text">{nfts.length}</div>
                </div>

                <CardImage>
                    {nfts.length > 0 ? (
                        <Carousel
                            autoPlay
                            interval={2000}
                            infiniteLoop={true}
                            showIndicators={false}
                            showArrows={false}
                            showThumbs={false}
                            showStatus={false}
                        >
                            {nfts.map((nft) => (
                                <div key={nft.tokenId} className="nft-slider">
                                    <img alt={nft.name} src={nft.asset} />
                                </div>
                            ))}
                        </Carousel>
                    ) : (
                        <img
                            src="/images/default-featured-image.png.jpg"
                            alt={name || ""}
                            className="image"
                        />
                    )}
                </CardImage>
                <CardLabel>{name}</CardLabel>
            </Link>
        </CardContainer>
    );
};

const CardContainer = styled.div`
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
    cursor: pointer;
    transition: border-color 0.7s ease;
    position: relative;
    @media (max-width: 600px) {
        width: 190px;
        height: 230px;
        margin: 1px 1px 0 1px;
    }

    &:hover {
        border-color: rgb(49, 115, 248);
    }

    .chain-icon {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 20px;
        right: 16px;
        z-index: 10;
    }

    .nftNumbers {
        width: 40px;
        height: 25px;
        border-radius: 10px;
        background-color: rgb(91, 92, 90);
        position: absolute;
        top: 15px;
        left: 20px;
        z-index: 10;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        opacity: 0.6;
    }
`;

const CardImage = styled.div`
    width: 200px;
    // height: 200px;
    border: 1px solid rgb(231, 232, 236);
    border-radius: 20px;
    object-fit: cover;
    @media (max-width: 600px) {
        width: 170px;
        height: 170px;
    }
    
    .nft-slider {
        width: "200px",
        height: "200px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "20px",
    }

    img {
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
`;

export default CollectionCard;
