/* eslint-disable @next/next/no-img-element */
"use client";
import AttributeList from "@/components/chip/AttributeList";
import Button from "@/components/common/Button";
import CircleButton from "@/components/common/CircleButton";
import Divider from "@/components/common/Divider";
import Flex from "@/components/common/Flex";
import PageContentTitle from "@/components/common/PageContentTitle";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import { personalizedImgs } from "@/components/templates_form/PersonalizedMessage";
import { getChipData } from "@/helpers/getChipData";
import { getChipIdFromAttributes } from "@/helpers/getChipIdFromAttributes";
import useAlchemySdk from "@/hooks/useAlchemySdk";
import { GET_TOKEN } from "@/lib/graphql/getToken";
import { Chain } from "@/types/Chains";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import styled from "styled-components";
import ProductHistory from "./../ProductHistory";
import ProductValues from "./../ProductValues";
import LostModal from "./LostModal";
export interface Attribute {
    value: string | number;
    trait_type: string;
    display_type?: string;
    mime_type?: string;
}
const NFTPage: React.FC = () => {
    const { chainId, address: contractAddress, tokenId } = useParams();
    const alchemySdk = useAlchemySdk();
    const [chipId, setChipId] = useState<string>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [nftName, setNftName] = useState<string | undefined>("");
    const [nftImg, setNftImg] = useState<string | undefined>("");
    const [nftDetail, setNftDetail] = useState<string | undefined>("");
    const [history, setHistory] = useState<any | undefined>();
    const [provenance, setProvenance] = useState<any | undefined>();
    const [nftValue, setNftValue] = useState<any>([]);
    const [campaign, setCampaign] = useState<any>();
    const [detailsShow, setDetailsShow] = useState(true);
    const [personalizedMessage, setPersonalizedMessage] = useState<any>();
    const [personalizedMessageShow, setPersonalizedMessageShow] =
        useState(true);
    const [descrptionExtended, setDescriptionExtended] = useState(false);

    useEffect(() => {
        if (+chainId === 100009) {
            (async () => {
                const apolloClient = new ApolloClient({
                    uri: "https://mainnet.api.worldofv.art/graphql",
                    cache: new InMemoryCache(),
                });

                // components/somewhere.ts
                const result = await apolloClient.query({
                    query: GET_TOKEN,
                    variables: {
                        tokenId: tokenId,
                        smartContractAddress: contractAddress,
                    },
                });

                setNftName(result?.data?.token?.name);
                setNftImg(result?.data?.token?.assets?.[2]?.url);
                setChipId(
                    getChipIdFromAttributes(result?.data?.token?.attributes),
                );
            })();
        }
    }, [chainId, tokenId, contractAddress]);

    useEffect(() => {
        if (+chainId === 1 || +chainId === 137) {
            (async () => {
                const nftDetails = await alchemySdk[
                    +chainId === 1 ? Chain.ETHEREUM : Chain.MATIC
                ].nft.getNftMetadata(
                    contractAddress as string,
                    tokenId as string,
                );

                setChipId(
                    getChipIdFromAttributes(
                        nftDetails?.raw?.metadata?.attributes,
                    ),
                );

                setNftName(nftDetails.collection?.name);
                setNftImg(nftDetails.image.cachedUrl);
            })();
        }
    }, [chainId, contractAddress, tokenId]);

    const [collapsedBePart, setCollapsedBePart] = useState<boolean>(false);
    const [collapsedDetail, setCollapsedDetail] = useState<boolean>(false);
    const [collapsedHistory, setCollapsedHistory] = useState<boolean>(false);
    const [collapsedValue, setCollapsedValue] = useState<boolean>(false);

    const dateCalculator = (param: Date) => {
        const time = new Date(param);
        const day =
            time.getDate() >= 10 ? time.getDate() : "0" + time.getDate();
        const year = time.getFullYear();

        const currentWeek = ["Sun", "Mon", "The", "Wed", "Thu", "Fri", "Sat"];
        const week = currentWeek[time.getDay()];
        const currentMonth = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const month = currentMonth[time.getMonth()];
        return week + " " + day + " " + month + " " + year;
    };
    useEffect(() => {
        if (chipId) {
            (async () => {
                try {
                    const { data, status } = await getChipData(chipId);
                    setNftValue(data?.tokenData?.values);
                    setHistory(data?.tokenData?.histories);
                    setProvenance(data?.tokenData?.attributes);
                    setNftDetail(data?.tokenData?.description);
                    setCampaign(data?.campaign);
                    setPersonalizedMessage(
                        data?.tokenData?.personalizedMessage,
                    );
                } catch (ex) {
                    console.error(ex);
                }
            })();
        }
    }, [chipId]);
    const filteredAttributes: Attribute[] = useMemo(
        () =>
            provenance
                ?.filter(
                    (a: Attribute) =>
                        !a.trait_type.startsWith("Media-") &&
                        !a.trait_type.startsWith("Category") &&
                        !a.trait_type.startsWith("NFC-") &&
                        (typeof a.value === "number" || a.value.length),
                )
                .map((a: Attribute) =>
                    a.display_type === "date"
                        ? {
                              ...a,
                              value: new Date(
                                  a.value as unknown as number,
                              ).toLocaleDateString(),
                          }
                        : a,
                ),
        [provenance],
    );
    console.log(personalizedMessage);
    return (
        <Main>
            <PageContentTitle>
                <Flex alignItems="center">
                    <Link
                        href={`/ownership/collections/${chainId}/${contractAddress}`}
                        className="redirect-icon-wrap"
                    >
                        <img
                            src="/images/direction_left_arrow.png"
                            alt=""
                            className="redirect-icon"
                        />
                    </Link>
                    <Spacer size={3} />
                    {nftName}
                    <div className="view-nft">
                        <div className="view-nft-icon">
                            <img
                                className="view-nft-icon-image"
                                src="/images/view_nft_icon_image.png"
                                alt=""
                            />
                        </div>
                        <div className="view-nft-icon-title">View NFT</div>
                    </div>
                </Flex>
            </PageContentTitle>

            <Spacer size={5} y />

            <Flex flexDirection={{ _: "column", m: "row" }} flexWrap={"wrap"}>
                <NFTImage>
                    <img
                        src={nftImg || "/images/default-featured-image.png.jpg"}
                        alt=""
                        className="nft-image"
                    />
                </NFTImage>
                <Spacer size={5} />
                <NFTInfo>
                    <Flex flexDirection={"column"}>
                        <NftHeader>
                            <h1>{nftName}</h1>
                            <div className="detail">{nftDetail}</div>
                        </NftHeader>
                        {personalizedMessage &&
                            !!Object.keys(personalizedMessage).length &&
                            personalizedMessage !== "null" && (
                                <>
                                    <Spacer y size={3} />
                                    <Divider />
                                    <Spacer y size={4} />
                                    <Flex
                                        flexDirection={"row"}
                                        rowGap={2}
                                        alignItems={"center"}
                                    >
                                        <Image
                                            src={
                                                personalizedImgs[
                                                    JSON.parse(
                                                        personalizedMessage,
                                                    ).icon
                                                ]
                                            }
                                            alt={"personalizedIcon"}
                                            width={28}
                                            height={28}
                                        />
                                        <Text
                                            fontSize={12}
                                            lineHeight={1.2}
                                            fontWeight={600}
                                        >
                                            {
                                                JSON.parse(personalizedMessage)
                                                    .title
                                            }
                                        </Text>
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
                                            {
                                                JSON.parse(personalizedMessage)
                                                    .description
                                            }
                                        </Text>
                                        {JSON.parse(personalizedMessage)
                                            .websiteLink && (
                                            <>
                                                {" "}
                                                <Spacer y size={2} />
                                                <a
                                                    href={
                                                        JSON.parse(
                                                            personalizedMessage,
                                                        ).websiteLink.startsWith(
                                                            "https://",
                                                        )
                                                            ? JSON.parse(
                                                                  personalizedMessage,
                                                              ).websiteLink
                                                            : `https://${
                                                                  JSON.parse(
                                                                      personalizedMessage,
                                                                  ).websiteLink
                                                              }`
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
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
                                                </a>
                                            </>
                                        )}
                                    </Accordion>
                                </>
                            )}
                        {!!filteredAttributes?.length && (
                            <>
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
                                    <Text
                                        fontSize={12}
                                        lineHeight={1.2}
                                        fontWeight={600}
                                    >
                                        Details
                                    </Text>
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
                                            displayInModal={true}
                                            attributes={filteredAttributes}
                                        />
                                    }
                                </Accordion>
                            </>
                        )}
                        {!!history?.length && (
                            <ProductHistory
                                displayInModal={true}
                                histories={history}
                            />
                        )}
                        {!!nftValue?.length && (
                            <ProductValues
                                displayInModal={true}
                                values={nftValue}
                            />
                        )}
                    </Flex>
                </NFTInfo>
            </Flex>
            <LostModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                receiveReport={campaign}
            />
        </Main>
    );
};

const Main = styled.div`
    width: 100%;
    height: 100%;
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
        margin: 0 0 0 40px;

        @media (max-width: 600px) {
            margin: 0 0 0 80px;
        }
    }

    .view-nft-icon-image {
        width: 20px;
        height: 20px;
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

const NftWov = styled.div`
    .icon-link {
        display: flex;

        .img {
            width: 40px;
            height: 40px;
            background-color: blue;
        }
    }
`;

const Body = styled.div`
    display: flex;
    flex-direction: row;
    font-weight: bold;
    padding: 0 100px 0 0;
    gap: 40px;

    @media (max-width: 600px) {
        flex-direction: column;
        padding: 0;
        gap: 10px;
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

const BeccomeMember = styled.div`
    display: flex;
    flex-direction: column;

    .ownership {
        font-size: 14px;
        font-weight: normal;
        margin: 0 0 15px 0;
    }

    .find-ownership-btn {
        display: flex;
        justify-content: center;
        border: 2px solid rgb(231, 232, 236);
        padding: 10px;
        border-radius: 20px;
        color: rgb(170, 170, 170);
        margin: 10px;
        font-size: 14px;
        font-weight: bold;

        &:hover {
            background-color: #044eff;
        }

        @media (max-width: 600px) {
            margin: 0px;
        }
    }
`;

const Detail = styled.div`
    display: flex;
    flex-direction: column;

    .detail-content {
        display: flex;
        margin: 16px 0 0 0;
        font-size: 17px;
        flex-wrap: wrap;
        white-space: pre-line;

        @media (max-width: 600px) {
            grid-template-columns: repeat(1, 1fr);
            font-size: 14px;
        }
    }

    .trait {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(45%, 1fr));

        @media (max-width: 1050px) {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .trait-group {
            padding: 10px 10px 5px 10px;
            display: flex;
            flex-direction: row;
            font-size: 14px;
            font-weight: normal;

            .trait-type {
                width: 50%;
                color: rgb(119, 126, 144);
            }

            .trait_value {
                width: 50%;
                margin: 0 0 0 20px;
                word-wrap: break-word;
            }
        }
    }
`;

const History = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;

    .history-title-bottom-line {
        display: flex;
    }

    .history-content-group {
        border-bottom: 1px solid #e6e8ec;
        padding: 0 0 20px 0;

       .history-content {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(45%, 1fr));

        @media (max-width: 600px) {
            display: flex;
            flex-direction: column;
        }

        .history-content-wrap {
            
            @media (max-width: 600px) {
                display: flex;
                flex-direction: row;
                margin: 0 50% 0 0;
            }

            .history-content-part {
                flex: 1;
                display: flex;
                flex-direction: column;
                font-size: 14px;
        
                .history-content-part-body {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
        
                    
                    .history-content-part-title {
                        flex: 5;
                        display: flex;
                        flex-direction: column;
                        font-weight: normal;
                            
                        .history-date {
                            color: rgb(180, 180, 180);
                        }
                        
                        .history-date-bottom-text {
                            font-size: 11px;
                            font-weight: 600;
                        }
                    }
        
                    
                    .history-content-alert-icon-wrap {
                        flex: 1;
                        display: flex;
                        justify-content: top;
                        padding: 10px 0 0 0;
                        
                        .history-content-alert-icon {
                            width: 20px;
                            height: 20px;
                        }
                    }
                }
        
                .history-content-part-footer {
                    font-size: 12px;
                    font-weight: 600;
                    font-family: Open Sans, Arial, sans-serif: 
                }
            }
        }

        
    }
    }
    
`;

const NFTValue = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 14px;
    font-weight: normal;

    .nft-value {
        margin: 10px 0 0 0;
        display: flex;
        flex-wrap: wrap;

        @media (max-width: 600px) {
            margin: 0;
        }

        .nft-value-group {
            display: flex;
            padding: 4px 16px;
            margin-right: 8px;
            margin-top: 8px;
            -webkit-box-align: center;
            align-items: center;
            border: 1px solid var(--color-accent);
            border-radius: 30px;

            .name {
                flex: 1;
                margin: 0 0 0 10px;
                text-align: center;
            }
        }
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
