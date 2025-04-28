/* eslint-disable @next/next/no-img-element */
"use client";
import AttributeList from "@/components/chip/AttributeList";
import ProductHistory from "@/components/chip/ProductHistory";
import ProductValues from "@/components/chip/ProductValues";
import Box from "@/components/common/Box";
import Button from "@/components/common/Button";
import CircleButton from "@/components/common/CircleButton";
import Divider from "@/components/common/Divider";
import Flex from "@/components/common/Flex";
import PageContentTitle from "@/components/common/PageContentTitle";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import Image from "next/image";
import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import styled from "styled-components";

export interface Attribute {
    value: string | number;
    trait_type: string;
    display_type?: string;
    mime_type?: string;
}

const history = [
    {
        city: "test",
        companyName: "test",
        date: "Sun Apr 14 2024 22:00:00 GMT+0000 (Coordinated Universal Time)",
        name: "Warehouse Distribution",
    },
    {
        city: "test",
        companyName: "test",
        date: "Sun Apr 14 2024 22:00:00 GMT+0000 (Coordinated Universal Time)",
        name: "Warehouse Distribution",
    },
    {
        city: "test",
        companyName: "test",
        date: "Sun Apr 14 2024 22:00:00 GMT+0000 (Coordinated Universal Time)",
        name: "Finishing And Printing",
    },
    {
        city: "test",
        companyName: "test",
        date: "Mon Apr 08 2024 22:00:00 GMT+0000 (Coordinated Universal Time)",
        name: "Finishing And Printing",
    },
];

const nftValue = [
    {
        mime: "application/pdf",
        name: "Blockchain Verified",
        url: "https://nfc-auth.ams3.digitaloceanspaces.com/dev-templates-media/81fde49f-547f-4f45-99fd-25e1c62032f7%3A/SCHEDA%20PALEO%20ROSSO.pdf",
    },
    {
        mime: "application/pdf",
        name: "Traditional Recipes",
        url: "https://nfc-auth.ams3.digitaloceanspaces.com/dev-templates-media/81fde49f-547f-4f45-99fd-25e1c62032f7%3A/SCHEDA%20PALEO%20BIANCO.pdf",
    },
];

const filteredAttributes = [
    {
        value: "Vinci, Toscana",
        trait_type: "Origin",
        display_type: "string",
        mime_type: "string",
    },
    {
        value: "Dianella 1",
        trait_type: "Producer",
        display_type: "string",
        mime_type: "string",
    },
    {
        value: "Idèo Chianti",
        trait_type: "Product name",
        display_type: "string",
        mime_type: "string",
    },
    {
        value: "Sangiovese, Merlot",
        trait_type: "Grape variety",
        display_type: "string",
        mime_type: "string",
    },
    {
        value: "13.5%",
        trait_type: "Alcohol by volume",
        display_type: "string",
        mime_type: "string",
    },
    {
        value: "2021",
        trait_type: "Production year",
        display_type: "string",
        mime_type: "string",
    },
] as Attribute[];

const NFTPage: React.FC = () => {
    const [detailsShow, setDetailsShow] = useState(true);
    const [historyShow, setHistoryShow] = useState(true);

    const [personalizedMessageShow, setPersonalizedMessageShow] =
        useState(true);

    return (
        <Main>
            <div style={{ overflowY: "auto" }}>
                <PageContentTitle>
                    <Flex alignItems="center">
                        <div className="view-nft">
                            <div className="view-nft-icon">
                                <img
                                    className="view-nft-icon-image"
                                    src="/images/wov-labs-black-logo.png"
                                    alt=""
                                />
                            </div>
                        </div>
                    </Flex>
                </PageContentTitle>

                <Spacer size={5} y />

                <Flex
                    flexDirection={{ _: "column", m: "row" }}
                    flexWrap={"wrap"}
                >
                    <NFTImage>
                        <img
                            src="/images/template-demo.png"
                            alt=""
                            className="nft-image"
                        />
                    </NFTImage>
                    <Spacer size={5} />
                    <NFTInfo>
                        <Flex flexDirection={"column"}>
                            <NftHeader>
                                <h1>Idèo - Vino Chianti #164</h1>
                                <div className="detail">
                                    Blend di uve Sangiovese e Merlot,
                                    vendemmiate a mano. Vinificazione separata
                                    delle uve in rosso di 15 giorni. Affinato
                                    per dieci mesi: sette in tini di acciaio
                                    inox, tre in barrique di rovere francese e
                                    due in bottiglia. Di 13,5% gradi alcolici.
                                    Alla vista rosso rubino vivace. Il bouquet è
                                    ampio: note fruttate di frutta rossa molto
                                    matura come marasca e prugna e toni più
                                    speziati come vaniglia e cannella. Al palato
                                    è rotondo e piacevole, con un’acidità
                                    equilibrata e un tannino definito. Risulta
                                    in bocca gustosamente persistente e con un
                                    retrogusto fruttato. Idèo si presenta come
                                    un vino avvolgente, pensato per accompagnare
                                    l’autunno, con il suo bouquet fruttato e la
                                    sua morbidezza, rappresenta un vero e
                                    proprio stato d’animo.
                                </div>
                            </NftHeader>
                            <Spacer y size={3} />
                            <Divider />
                            <Spacer y size={4} />
                            <Flex
                                flexDirection={"row"}
                                rowGap={2}
                                alignItems={"center"}
                            >
                                <Image
                                    src="/images/hand.svg"
                                    alt={"personalizedIcon"}
                                    width={28}
                                    height={28}
                                />
                                <h2>Claim Ownership to be part of the club!</h2>
                                <CircleButton
                                    smaller
                                    outline
                                    style={{
                                        marginLeft: "auto",
                                        marginRight: "0",
                                    }}
                                    onClick={() =>
                                        setPersonalizedMessageShow(
                                            (prevState) => !prevState,
                                        )
                                    }
                                >
                                    <ArrowDownIcon
                                        open={personalizedMessageShow}
                                    />
                                </CircleButton>
                            </Flex>
                            <Accordion open={personalizedMessageShow}>
                                <Spacer y size={2} />
                                <Text fontSize={12} lineHeight={1.2}>
                                    Explore the exclusive benefits!
                                </Text>

                                <Spacer y size={2} />
                                <Button
                                    fullWidth
                                    style={{
                                        height: "2.5rem",
                                        fontSize: ".8rem",
                                    }}
                                    outline
                                >
                                    Find out more
                                </Button>
                            </Accordion>
                            <Spacer y size={4} />
                            <Divider />
                            <Spacer y size={4} />
                            <Flex
                                flexDirection={"row"}
                                rowGap={2}
                                alignItems={"center"}
                                pb={"10px"}
                            >
                                <Image
                                    src={"/images/blockchain_2.svg"}
                                    alt={"WOV logo"}
                                    width={28}
                                    height={28}
                                />
                                <h2>Details</h2>
                                <CircleButton
                                    smaller
                                    outline
                                    style={{
                                        marginLeft: "auto",
                                        marginRight: "0",
                                    }}
                                    onClick={() =>
                                        setDetailsShow(
                                            (prevState) => !prevState,
                                        )
                                    }
                                >
                                    <ArrowDownIcon open={detailsShow} />
                                </CircleButton>
                            </Flex>
                            <Spacer y size={2} />
                            <Accordion open={detailsShow}>
                                {
                                    <AttributeList
                                        displayInModal={false}
                                        attributes={filteredAttributes}
                                    />
                                }
                            </Accordion>
                            <Spacer y size={2} />
                            <Box>
                                <Divider />
                                <Spacer y size={4} />
                                {!!history?.length && (
                                    <ProductHistory
                                        displayInModal={false}
                                        histories={history as any}
                                    />
                                )}
                                <ProductValues
                                    displayInModal={false}
                                    values={nftValue}
                                />
                                <WovIcons>
                                    <div className="head">
                                        <img
                                            src="/images/get-in-touch.svg"
                                            alt="icon"
                                            className="head-icon"
                                        />
                                        Get in touch with WoV Labs
                                    </div>
                                    <div className="links">
                                        <a href="https://twitter.com/wovlabs.com">
                                            <img
                                                src="/images/x-black.webp"
                                                alt=""
                                                className="img-first"
                                            />
                                        </a>

                                        <a href="https://www.instagram.com/wovlabs.com">
                                            <img
                                                src="/images/instagram-black.webp"
                                                alt="img"
                                                className="img"
                                            />
                                        </a>
                                        <a href="https://it.linkedin.com/company/wovlabs">
                                            <img
                                                src="/images/linkedin-black.webp"
                                                alt="img"
                                                className="img"
                                            />
                                        </a>
                                        <a href="https://wovlabs.com">
                                            <img
                                                src="/images/website.svg"
                                                alt="img"
                                                className="img"
                                            />
                                        </a>
                                        <a href="mailto:americo@wovlabs.com">
                                            <img
                                                src="/images/email.svg"
                                                alt="img"
                                                className="img"
                                            />
                                        </a>
                                    </div>
                                </WovIcons>
                            </Box>
                        </Flex>
                    </NFTInfo>
                </Flex>
            </div>
            <ClaimButton>Claim Ownership</ClaimButton>
        </Main>
    );
};

const WovIcons = styled.div`
    display: flex;
    flex-direction: column;

    .head {
        display: flex;
        flex-direction: row;
        font-size: 28px;
        font-weight: 600;

        @media (max-width: 600px) {
            font-size: 12px;
        }

        .head-icon {
            width: 25px;
            margin: 0 10px 0 0;
        }
    }

    .links {
        display: flex;
        flex-direction: row;
        margin: 20px 0 0 0;

        .img,
        .img-first {
            width: 25px;
            margin: 0 15px 20px 15px;
        }

        .img-first {
            margin: 0 15px 20px 0;
        }
    }
`;

const ClaimButton = styled.button`
    border-radius: 20px;
    height: 7.5rem;
    font-size: 1rem;
    font-weight: 600;
    background: #3772ff;
    color: white;
    margin: 0 0 -30px 0;
    transition: background 0.3s ease;

    &:hover {
        background: #044eff;
    }

    @media (max-width: 600px) {
        height: 7.5rem;
    }
`;

const Main = styled.div`
    width: 100%;
    height: 700px;
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    padding-right: 20px;

    @media (max-width: 600px) {
        padding: 5px;
    }

    .redirect-icon {
        width: 20px;
        height: 20px;

        @media (max-width: 600px) {
            width: 15px;
            height: 15px;
        }
    }

    .redirect-icon-wrap {
        width: 40px;
        height: 40px;
        background-color: rgb(231, 232, 238);
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 3px;

        &:hover {
            background-color: rgb(181, 190, 209);
        }

        @media (max-width: 600px) {
            width: 30px;
            height: 30px;
        }
    }
    .label {
        margin: 0 0 0 20px;

        @media (max-width: 600px) {
            font-size: 20px;
        }
    }

    .view-nft {
        display: flex;
        flex-direction: row;
        margin: 0 0 0 20px;
    }

    .view-nft-icon-image {
        width: 200px;
    }

    .view-nft-icon-image {
    }

    .view-nft-icon-title {
        margin: 0 0 0 5px;
    }
`;

const NftHeader = styled.div`
    .detail {
        margin: 20px 0 0 0;
        padding: 0 0 10px 0;
        font-weight: normal;
    }
`;

const NFTImage = styled.div`
    flex: 1;
    display: flex;
    height: fit-content;
    justify-content: center;
    align-items: center;

    @media (max-width: 600px) {
        justify-content: center;
        margin: 12px 0;
    }

    .nft-image {
        width: 100%;
        height: 100%;
        border-radius: 40px;

        @media (max-width: 600px) {
            padding: 20px;
        }
    }
`;

const NFTInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (max-width: 600px) {
        padding: 0 20px;
    }
`;

const Accordion = styled.div<{ open: boolean }>`
    opacity: ${(props) => (props.open ? null : 0)};
    max-height: ${(props) => (!props.open ? 0 : "auto")};
    transition: all 200ms ease-in-out;
    overflow: auto;
`;

const ArrowDownIcon = styled(FaAngleDown)<{ open: boolean }>`
    transition: transform 200ms ease-in-out;
    transform: ${(props) => (props.open ? "rotate(180deg)" : null)};
`;
export default NFTPage;
