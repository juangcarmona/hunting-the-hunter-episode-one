import AttributeList from "@/components/chip/AttributeList";
import Box from "@/components/common/Box";
import Button from "@/components/common/Button";
import CircleButton from "@/components/common/CircleButton";
import Divider from "@/components/common/Divider";
import Flex from "@/components/common/Flex";
import Modal from "@/components/common/Modal";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import { personalizedImgs } from "@/components/templates_form/PersonalizedMessage";
import { getChipData } from "@/helpers/getChipData";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useRecoilState } from "recoil";
import ProductHistory from "./ProductHistory";
import ProductValues from "./ProductValues";
// import styled, { createGlobalStyle } from "styled-components";
import { accessTokenState } from "@/state/accessToken";
import styled, { createGlobalStyle, useTheme } from "styled-components";
import LostModal from "./LostModal";
import RegisterPromptModal from "./RegisterPromptModal";
import RenounceModal from "./RenounceModal";
import ReportModal from "./ReportModal";
import StolenModal from "./StolenModal";
import TransferModal from "./TransferModal";

type NFTModalProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    image: string;
    label: string;
    chainId: number;
    address: string;
    value: string;
    chipId: string;
    currentUser: any;
    onReload: (_chipId: string) => void;
};
export interface Attribute {
    value: string | number;
    trait_type: string;
    display_type?: string;
    mime_type?: string;
}
const NFTModal: React.FC<NFTModalProps> = ({
    isOpen,
    setIsOpen,
    image,
    label,
    chainId,
    address: contractAddress,
    value,
    chipId,
    currentUser,
    onReload,
}) => {
    const [nftDetail, setNftDetail] = useState<string | undefined>("");
    const [history, setHistory] = useState<any | undefined>();
    const [provenance, setProvenance] = useState<any | undefined>();
    const [nftValue, setNftValue] = useState<any>([]);
    const [status, setStatus] = useState<"dev" | "production" | null>();
    const [campaign, setCampaign] = useState<any>();
    const [detailsShow, setDetailsShow] = useState(true);
    const [personalizedMessage, setPersonalizedMessage] = useState<any>();
    const [personalizedMessageShow, setPersonalizedMessageShow] =
        useState(true);
    const [collapsedBePart, setCollapsedBePart] = useState<boolean>(false);
    const [collapsedDetail, setCollapsedDetail] = useState<boolean>(false);
    const [collapsedHistory, setCollapsedHistory] = useState<boolean>(false);
    const [collapsedValue, setCollapsedValue] = useState<boolean>(false);
    const [collapsedShowDetail, setCollapsedShowDetail] =
        useState<boolean>(true);

    const [isOpenTransferModal, setIsOpenTransferModal] =
        useState<boolean>(false);
    const [isOpenLostModal, setIsOpenLostModal] = useState<boolean>(false);
    const [isOpenReportModal, setIsOpenReportModal] = useState<boolean>(false);
    const [isOpenStolenModal, setIsOpenStolenModal] = useState<boolean>(false);
    const [isOpenRenounceModal, setIsOpenRenounceModal] =
        useState<boolean>(false);

    const [accessToken, setAccesToken] = useRecoilState(accessTokenState);
    const [descrptionExtended, setDescriptionExtended] = useState(false);

    const [openedRegisterPrompt, setOpenedRegisterPrompt] =
        useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                await loadData(chipId);
            } catch (ex) {
                console.error(ex);
            }
        })();
    }, [chipId]);

    const loadData = async (_chipId: string) => {
        console.log("loadData NFTModal", _chipId);
        const { data, status } = await getChipData(chipId);
        setStatus(status as "dev" | "production" | null);
        setNftValue(data?.tokenData?.values);
        setHistory(data?.tokenData?.histories);
        setProvenance(data?.tokenData?.attributes);
        setNftDetail(data?.tokenData?.description);
        setCampaign(data?.campaign);
        setPersonalizedMessage(data?.tokenData?.personalizedMessage);
        onReload?.(_chipId);
    };

    const openTransferModal = () => {
        setIsOpenTransferModal(!isOpenTransferModal);
    };

    const openLostModal = () => {
        if (!currentUser?.email) {
            setOpenedRegisterPrompt(true);
            return;
        }

        setIsOpenLostModal(!isOpenLostModal);
    };

    const openStolenModal = () => {
        if (!currentUser?.email) {
            setOpenedRegisterPrompt(true);
            return;
        }

        setIsOpenStolenModal(!isOpenStolenModal);
    };

    const openRenounceModal = () => {
        setIsOpenRenounceModal(!isOpenRenounceModal);
    };

    const onChangeShowDetail = () => {
        setCollapsedShowDetail(!collapsedShowDetail);
    };

    const theme = useTheme();

    const deleteReported = async () => {
        setIsOpenReportModal(!isOpenReportModal);
    };
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

    return (
        <Modal
            small
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            zIndex={1}
            style={{
                scrollbarColor: "grey transparent",
                scrollbarWidth: "auto",
            }}
            hasCloseButton={true}
        >
            <Spacer y size={4} />
            <Flex
                flexDirection={"column"}
                alignItems={"center"}
                style={{
                    border: "2px solid white",
                    borderRadius: "10px",
                    transition: "border-color 0.7s ease",
                    padding: "20px 40px",
                }}
            >
                <a
                    href={`/ownership/collections/${chainId}/${contractAddress}/${value}`}
                >
                    <div className="nftImage">
                        {(campaign === undefined ||
                            campaign?.campaignType === "LOST" ||
                            campaign?.campaignType === "STOLE") && (
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
                                    campaign?.campaignType === "LOST"
                                        ? "#FFC701"
                                        : campaign?.campaignType === "STOLE"
                                          ? "#FF0000"
                                          : ""
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
                                                campaign?.campaignType ===
                                                "LOST"
                                                    ? "/images/campaigns/lost.svg"
                                                    : campaign?.campaignType ===
                                                        "STOLE"
                                                      ? "/images/campaigns/stole.svg"
                                                      : ""
                                            }
                                            width={20}
                                            height={20}
                                            alt={""}
                                        />
                                    </Flex>
                                    <Flex
                                        color={
                                            campaign?.campaignType === "LOST"
                                                ? "#FFC701"
                                                : campaign?.campaignType ===
                                                    "STOLE"
                                                  ? "#FF0000"
                                                  : ""
                                        }
                                    >
                                        <strong>
                                            {campaign?.campaignType === "LOST"
                                                ? "Lost"
                                                : campaign?.campaignType ===
                                                    "STOLE"
                                                  ? "Stolen"
                                                  : ""}
                                        </strong>
                                    </Flex>
                                </Flex>
                            </Box>
                        )}
                        <img src={image} alt="" className="image" />
                    </div>
                </a>
                <div className="description">{label}</div>
                {collapsedShowDetail === false && (
                    <div className="detail-content">{nftDetail}</div>
                )}
                <div
                    className="showmore-btn"
                    onClick={() => onChangeShowDetail()}
                >
                    <Flex
                        alignItems="center"
                        justifyContent="center"
                        style={{ cursor: "pointer" }}
                        height={20}
                        rowGap={1}
                    >
                        <Text
                            mt={10}
                            onClick={() =>
                                setDescriptionExtended(!descrptionExtended)
                            }
                            color="text"
                            fontSize={{ _: 12, m: 14 }}
                        >
                            {descrptionExtended ? "Show Less" : "Show More"}
                        </Text>

                        {descrptionExtended ? (
                            <FaAngleUp
                                style={{
                                    marginTop: "12px",
                                    color: theme.colors.text,
                                }}
                            />
                        ) : (
                            <FaAngleDown
                                style={{
                                    marginTop: "12px",
                                    color: theme.colors.text,
                                }}
                            />
                        )}
                    </Flex>
                </div>
                {!collapsedShowDetail && (
                    <div>
                        <NFTInfo>
                            <Spacer y size={5} />
                            {personalizedMessage &&
                                !!Object.keys(personalizedMessage).length &&
                                personalizedMessage !== "null" &&
                                descrptionExtended && (
                                    <>
                                        <Spacer y size={3} />
                                        <Divider />
                                        <Spacer y size={3} />
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
                                                    JSON.parse(
                                                        personalizedMessage,
                                                    ).title
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
                                                        (prevState) =>
                                                            !prevState,
                                                    )
                                                }
                                            >
                                                <ArrowDownIcon
                                                    open={
                                                        personalizedMessageShow
                                                    }
                                                />
                                            </CircleButton>
                                        </Flex>
                                        <Accordion
                                            open={personalizedMessageShow}
                                        >
                                            <Spacer y size={2} />
                                            <Text
                                                fontSize={12}
                                                lineHeight={1.2}
                                            >
                                                {
                                                    JSON.parse(
                                                        personalizedMessage,
                                                    ).description
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
                                                                      )
                                                                          .websiteLink
                                                                  }`
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button
                                                            fullWidth
                                                            style={{
                                                                height: "2.5rem",
                                                                fontSize:
                                                                    ".8rem",
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
                                    <Spacer y size={3} />
                                    <Divider />
                                    <Spacer y size={3} />
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
                        </NFTInfo>
                    </div>
                )}
                <Spacer y size={5} />

                {campaign?.campaignType !== "Message" && campaign && (
                    <Flex
                        flexDirection="column"
                        justifyContent="space-evenly"
                        style={{ width: "100%" }}
                    >
                        <Button
                            outline
                            style={{ width: "100%" }}
                            onClick={() => openTransferModal()}
                            className="actionBtn"
                        >
                            <img
                                src="/images/modal_transfer_icon.png"
                                alt=""
                                className="icon"
                                style={{
                                    width: "25px",
                                    margin: 0,
                                    padding: 0,
                                    marginRight: "5px",
                                }}
                            />
                            Transfer
                        </Button>
                        <Spacer y size={3} />

                        <Button
                            outline
                            style={{ width: "100%" }}
                            onClick={() => deleteReported()}
                            className="actionBtn"
                        >
                            Mark as Found
                        </Button>
                    </Flex>
                )}
                {campaign?.campaignType !== "Message" && !campaign && (
                    <>
                        <Flex
                            flexDirection="row"
                            justifyContent="space-evenly"
                            style={{ width: "100%" }}
                        >
                            <Button
                                outline
                                style={{ width: "100%" }}
                                onClick={() => openTransferModal()}
                                className="actionBtn"
                            >
                                <img
                                    src="/images/modal_transfer_icon.png"
                                    alt=""
                                    className="icon"
                                    style={{
                                        width: "25px",
                                        margin: 0,
                                        padding: 0,
                                        marginRight: "5px",
                                    }}
                                />
                                Transfer
                            </Button>
                            <Spacer size={3} />

                            <Button
                                outline
                                style={{ width: "100%" }}
                                onClick={() =>
                                    campaign?.campaignType !== "Message"
                                        ? campaign
                                            ? deleteReported()
                                            : openRenounceModal()
                                        : openRenounceModal()
                                }
                                className="actionBtn"
                            >
                                <img
                                    src="/images/modal_renounce.png"
                                    alt=""
                                    className="icon"
                                    style={{
                                        width: "25px",
                                        margin: 0,
                                        padding: 0,
                                        marginRight: "5px",
                                    }}
                                />
                                {campaign?.campaignType !== "Message"
                                    ? campaign
                                        ? "Reported"
                                        : "Renounce"
                                    : "Renounce"}
                            </Button>
                        </Flex>
                        <Spacer y size={3} />
                        <Flex
                            flexDirection="row"
                            justifyContent="space-evenly"
                            style={{ width: "100%" }}
                        >
                            <Button
                                outline
                                style={{ width: "100%" }}
                                onClick={() =>
                                    campaign?.campaignType !== "Message"
                                        ? campaign
                                            ? deleteReported()
                                            : openLostModal()
                                        : openLostModal()
                                }
                                className="actionBtn"
                            >
                                <img
                                    src="/images/modal_lost.png"
                                    alt=""
                                    className="icon"
                                    style={{
                                        width: "25px",
                                        margin: 0,
                                        padding: 0,
                                        marginRight: "5px",
                                    }}
                                />
                                {campaign?.campaignType !== "Message"
                                    ? campaign
                                        ? "Reported"
                                        : "Lost"
                                    : "Lost"}
                            </Button>

                            <Spacer size={3} />
                            <Button
                                outline
                                style={{ width: "100%" }}
                                onClick={() =>
                                    campaign?.campaignType !== "Message"
                                        ? campaign
                                            ? deleteReported()
                                            : openStolenModal()
                                        : openStolenModal()
                                }
                                className="actionBtn"
                            >
                                <img
                                    src="/images/modal_stolen.png"
                                    alt=""
                                    className="icon"
                                    style={{
                                        width: "25px",
                                        margin: 0,
                                        padding: 0,
                                        marginRight: "5px",
                                    }}
                                />
                                {campaign?.campaignType !== "Message"
                                    ? campaign
                                        ? "Reported"
                                        : "Stolen"
                                    : "Stolen"}
                            </Button>
                        </Flex>
                    </>
                )}
            </Flex>
            <TransferModal
                isOpen={isOpenTransferModal}
                setIsOpen={setIsOpenTransferModal}
                address={contractAddress}
                tokenId={value}
                chainId={chainId}
            />
            <LostModal
                isOpen={isOpenLostModal}
                setIsOpen={setIsOpenLostModal}
                address={contractAddress}
                tokenId={value}
                chainId={chainId}
                label={label}
                currentUser={currentUser}
                chipId={chipId}
                onReload={(_chipId) => loadData(_chipId)}
            />
            <StolenModal
                isOpen={isOpenStolenModal}
                setIsOpen={setIsOpenStolenModal}
                address={contractAddress}
                tokenId={value}
                chainId={chainId}
                label={label}
                currentUser={currentUser}
                chipId={chipId}
                onReload={(_chipId) => loadData(_chipId)}
            />
            <RenounceModal
                isOpen={isOpenRenounceModal}
                setIsOpen={setIsOpenRenounceModal}
                address={contractAddress}
                tokenId={value}
                chainId={chainId}
                label={label}
                value={value}
                currentUser={currentUser}
                chipId={chipId}
                onReload={(_chipId) => loadData(_chipId)}
            />
            <ReportModal
                isOpen={isOpenReportModal}
                setIsOpen={setIsOpenReportModal}
                campaign={campaign}
                accessToken={accessToken}
                chipId={chipId}
                onReload={(_chipId) => loadData(_chipId)}
            />
            <RegisterPromptModal
                isOpen={openedRegisterPrompt}
                setIsOpen={setOpenedRegisterPrompt}
            />
            <GlobalStyles />
        </Modal>
    );
};

const GlobalStyles = createGlobalStyle`
    .Modal__Wrapper{
        display: flex;
        justify-content: center;
        max-width: 450px;
    }

    .Modal__Body {
        padding: 0;
        overflow: auto;
        height: 100%;
        width: 100%;
    }

    @media (max-width: 600px) {
        body {
            overflow: hidden;
        }

        .Modal__Container {
            padding: 0;
            margin: 0;
        }

        .Modal__Content {
            width: 100%;
        }

        .Modal__Wrapper {
            margin: 0;
            max-width: unset;
            max-height: unset;
            height: 100vh;
            border-radius: 0;
            width: 100%;
        }
    }
    .actionBtn:hover img {
        filter: brightness(0) invert(1);
    }
    .nftImage {
        width: 350px;
        height: 350px;
        border-radius: 20px;
        box-shadow: rgba(0, 0, 0, 0.1) 10px 4px 10px 0px;
        display: felx;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        // padding: 16px;

        margin: 16px;

        .image {
            width: 350px;
            height: 350px;
            border-radius: 20px;
            object-fit: cover;
        }
    }

    .description {
        font-size: 21px;
        width: 100%;
        font-weight: bold;
        text-align: left;
        margin: 20px 0 0 0;
        word-wrap: break-word;
    }

    .showmore-btn {
        font-size: 12px;
        font-weight: bold;
        display: flex;
        flex-direction: row;
        margin: 20px 0 0 0;
        cursor: pointer;

        .icon {
            margin: 0 0 0 10px;
        }
    }
`;

const NFTInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 10px;
    width: 350px;
`;

const BeccomeMember = styled.div`
    display: flex;
    flex-direction: column;

    .ownership {
        font-size: 12px;
        font-weight: normal;
        margin: 10px 0 15px 0;
    }

    .find-ownership-btn {
        display: flex;
        justify-content: center;
        border: 2px solid ${({ theme }) => theme.colors.accent};
        padding: 10px;
        border-radius: 20px;
        color: ${({ theme }) => theme.colors.accent};
        font-size: 14px;
        font-weight: bold;

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
        font-size: 10px;
        flex-wrap: wrap;
        white-space: pre-line;

        @media (max-width: 600px) {
            grid-template-columns: repeat(1, 1fr);
            font-size: 10px;
        }
    }

    // .trait {
    //     display: flex;
    //     flex-direction: column;
    //     margin: 10px 0 0 0;

    .trait-type {
        width: 30%;
        color: #9e9e9e;

        white-space: normal;
        word-break: normal;
        text-overflow: clip;
        overflow: visible;
        width: 30%;
        font-size: 12px;
        line-height: 21px;
    }

    .trait_value {
        width: 70%;
        margin: 0 0 0 20px;
        word-wrap: break-word;

        white-space: normal;
        word-break: normal;
        text-overflow: clip;
        overflow: visible;
        width: 70%;
        font-size: 12px;
        line-height: 21px;
    }
    // }
`;

const History = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;

    .history-title-bottom-line {
        display: flex;
    }

    .history-content-group {
       .history-content {
            margin: 10px 0 0 20px;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(45%, 1fr));
        
            @media (max-width: 600px) {
                flex-direction: column;
                gap: 20px;
            }

            .history-content-part {
                flex: 1;
                display: flex;
                flex-direction: column;
        
                .history-content-part-body {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    margin: 0 20px 0 0;
                    font-size: 12px;
        
                    .history-content-part-title {
                        display: flex;
                        flex-direction: column;
                        font-weight: normal;
                            
                        .history-date {
                            color: rgb(144,149,165);
                            font-weight: normal;

                        }
                    }
                    
                    .history-content-alert-icon-wrap {
                        display: flex;
                        
                        .history-content-alert-icon {
                            width: 20px;
                            height: 20px;
                        }
                    }
                }
        
                .history-content-part-footer {
                    font-size: 12px;
                    font-family: Open Sans, Arial, sans-serif: 
                }
            }
        }
    }
    
`;

const HoverableFlex = styled(Flex)`
    background: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.muted} inset;
    color: ${({ theme }) => theme.colors.accent};
    font-family: ${({ theme }) => theme.fonts.DM_Sans};
    font-size: 16px;
    line-height: 1;
    font-weight: 700;
    justify-content: center;
    cursor: pointer;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    padding: 10px;
    border-radius: 40px;
    transition: all 0.3s ease;
    width: 100%;

    &:hover {
        background: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary} inset;
        color: ${({ theme }) => theme.colors.white};

        img {
            filter: brightness(0) invert(1);
        }
    }
`;

const NFTValue = styled.div`
    display: flex;
    flex-direction: column;

    .nft-value {
        margin: 10px 0 0 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(45%, 1fr));

        .nft-value-group {
            flex-basis: calc(50% - 10px);
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            font-weight: normal;
            margin: 5px 10px 0 10px;
            height: 40px;
            border: 1px solid rgb(221, 223, 226);
            border-radius: 20px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 10px;

            img {
                width: 20px;
                margin: 0 6px 0 0;
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
export default NFTModal;
