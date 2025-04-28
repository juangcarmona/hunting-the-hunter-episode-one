import { Title } from "@/app/templates/common";
import animationProgress from "@/assets/lottie/progress-animation.json";
import animationSuccess from "@/assets/lottie/success-animation.json";
import CHAIN_IDS from "@/constants/chainIds";
import { ETH_CHAINS } from "@/constants/chains";
import useBlockchain from "@/hooks/useBlockchain";
import useConnect, { Ecosystem } from "@/hooks/useConnect";
import useMediaAttributes from "@/hooks/useMediaAttributes";
import BlockchainService from "@/services/BlockchainService";
import ChipService from "@/services/ChipService";
import { SocialSettingsData } from "@/services/UsersService.ts";
import mixins from "@/styles/_mixins";
import { Chain } from "@/types/Chains";
import fetchMimeType from "@/utils/fetchMimeType";
import { useMediaQuery } from "@react-hook/media-query";
import Lottie from "lottie-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { toast } from "react-toastify";
import styled, { useTheme } from "styled-components";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { isAddress } from "web3-validator";
import EterehumConnect from "../EthereumConnect";
import VechainConnect from "../VechainConnect";
import Web3AuthButton from "../Web3AuthButton";
import Box from "../common/Box";
import Button from "../common/Button";
import CircleButton from "../common/CircleButton";
import Divider from "../common/Divider";
import Flex from "../common/Flex";
import { Input } from "../common/FormInputs/Input";
import Loader from "../common/Loader";
import Modal from "../common/Modal";
import Spacer from "../common/Spacer";
import Text from "../common/Text";
import ThemeImage from "../common/ThemeImage";
import { personalizedImgs } from "../templates_form/PersonalizedMessage";
import {
    Accordion,
    ArrowDownIcon,
} from "../templates_form/SelectedTemplatePreview";
import AttributeList from "./AttributeList";
import CertifiedProduct from "./CertifiedProduct";
import GetInTouch from "./GetInTouch";
import MediaDisplayer from "./MediaDisplayer";
import ProductHistory from "./ProductHistory";
import ProductValues from "./ProductValues";
import ShowCampaignModal from "./ShowCampaignModal";

const { media } = mixins;

interface ChipBoundProps {
    tokenData: any; //pass proper type
    customLogo?: string;
    socials?: SocialSettingsData;
    campaign?: any;
    claimStatus?: string;
    chipHash?: string;
}

export interface Attribute {
    value: string | number;
    trait_type: string;
    display_type?: string;
    mime_type?: string;
}

const ChipBound: React.FC<ChipBoundProps> = ({
    tokenData,
    customLogo,
    socials,
    campaign,
    claimStatus,
    chipHash,
}) => {
    const {
        name,
        image,
        animation_url,
        attributes,
        description,
        chain_id,
        smart_contract_address,
        token_id,
        histories,
        values,
    } = tokenData;
    const chain = CHAIN_IDS[Number(chain_id)];

    const [isClaimOpen, setIsClaimOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [address, setAddress] = useState<`0x${string}` | null>(null);
    const [isClaimable, setIsClaimable] = useState(false);
    const [isClaimed, setIsClaimed] = useState(false);
    const [imageMimeType, setImageMimeType] = useState<string | null>(null);
    const [nameserviceAddress, setNameServiceAddress] = useState<
        `0x${string}` | null
    >(null);
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
    const [detailsShow, setDetailsShow] = useState(true);
    const [descrptionExtended, setDescriptionExtended] = useState(false);
    const [personalizedMessageShow, setPersonalizedMessageShow] =
        useState(true);
    const [mintTxId, setMintTxId] = useState<`0x${string}` | null>(null);

    const { isConnected, disconnectWallet } = useConnect();

    const theme = useTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    const mediaAttributes = useMediaAttributes(attributes);

    const ecosystem = useMemo(
        () =>
            ETH_CHAINS.includes(chain) ? Ecosystem.ETHEREUM : Ecosystem.VECHAIN,
        [chain],
    );

    const [isClaiming, setIsClaiming] = useState(false);

    const {
        getIsClaimable,
        getAddressFromNameservice,
        getMintTxId,
        address: connectedAddress,
    } = useBlockchain({
        collectionAddress: smart_contract_address,
        ecosystem,
        chainId: Number(chain_id),
    });

    const isValidInput = useMemo(
        () => isAddress(inputValue || "") || nameserviceAddress,
        [inputValue, nameserviceAddress],
    );

    const url = useMemo(() => {
        if (chain_id === Chain.CARDANO)
            return `https://cardano.worldofv.art/token/${smart_contract_address}/${Number(
                token_id,
            )}`;
        switch (chain) {
            case Chain.VECHAIN:
                return `https://worldofv.art/token/${smart_contract_address}/${Number(
                    token_id,
                )}`;
            case Chain.ETHEREUM:
            case Chain.MATIC:
                return `https://eth.worldofv.art/token/${chain}/${smart_contract_address}/${Number(
                    token_id,
                )}`;
            case Chain.GOERLI:
            case Chain.MUMBAI:
                return `https://world-of-v-eth-testenet.vercel.app/token/${chain}/${smart_contract_address}/${Number(
                    token_id,
                )}`;
            default:
                return "";
        }
    }, [chain, chain_id, smart_contract_address, token_id]);

    const filteredAttributes: Attribute[] = useMemo(
        () =>
            attributes
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
        [attributes],
    );

    const showAddress = useMemo(() => {
        if (isClaimable && nameserviceAddress) return true;
        return false;
    }, [isClaimable, nameserviceAddress]);

    const handleClaim = useCallback(async () => {
        try {
            const code = attributes.find(
                (attribute: Record<string, string>) =>
                    attribute.trait_type === "NFC-Chip",
            )?.value;
            const res = await BlockchainService.claim(
                code,
                address!,
                chain === Chain.VECHAIN ? "vechain" : "ethereum",
            );
            if (res.data?.json?.success === true && getIsClaimable) {
                await getIsClaimable(token_id);
                setIsClaimable(false);
                chipHash &&
                    ChipService.updateChipClaimStatus({
                        chipHashes: [chipHash],
                        claimStatus: "Claimed",
                    });
                setIsClaimed(true);
            } else {
                toast.error("Something went wrong");
            }
        } catch (err) {
            console.log(err);
        }
    }, [address, attributes, chain, token_id]);

    useEffect(() => {
        getIsClaimable(token_id).then((res) => {
            setIsClaimable(res);
        });
    }, [getIsClaimable, token_id]);

    useEffect(() => {
        getMintTxId(token_id).then((res) => setMintTxId(res));
    }, [getMintTxId, token_id]);

    useEffect(() => {
        if (campaign) setIsCampaignModalOpen(true);
    }, [campaign]);

    useEffect(() => {
        getAddressFromNameservice(inputValue).then((res) =>
            setNameServiceAddress(res),
        );
    }, [getAddressFromNameservice, inputValue]);

    useEffect(() => {
        if (isConnected && isClaiming && address) {
            handleClaim().then(() => setIsClaiming(false));
        }
    }, [address, isClaiming, isConnected]);

    useEffect(() => {
        if (isConnected) setInputValue(connectedAddress!);
    }, [connectedAddress, isConnected]);

    useEffect(() => {
        if (nameserviceAddress) setAddress(nameserviceAddress);
        else if (isAddress(inputValue)) setAddress(inputValue as `0x${string}`);
    }, [inputValue, nameserviceAddress]);

    useEffect(() => {
        fetchMimeType(image).then((res) => setImageMimeType(res as string));
    }, [image]);

    return (
        <Box maxWidth={1200} mx="auto" style={{ minHeight: "100vh" }}>
            <Flex
                justifyContent={{ _: "center", m: "start" }}
                alignItems={"center"}
                py={{ _: "10px", m: "10px" }}
            >
                <Link
                    href={
                        socials?.website
                            ? socials.website
                            : "https://wovlabs.com/"
                    }
                    target="_blank"
                >
                    <ThemeImage customLogo={customLogo} />
                </Link>
            </Flex>
            <Box
                width={"100%"}
                height={"1px"}
                backgroundColor={"#9e9e9e42"}
            ></Box>
            <Flex flexDirection={{ _: "column", m: "row" }} px={4} my={4}>
                <Flex width={{ _: "100%", m: "50%" }} zIndex={0}>
                    <SwiperContainer>
                        <Swiper
                            slidesPerView={1}
                            modules={[Pagination]}
                            pagination={{
                                clickable: true,
                            }}
                            className="swiperContainer"
                        >
                            <SwiperSlide>
                                <MediaDisplayer
                                    animation_url={animation_url}
                                    image={image}
                                    image_mime_type={imageMimeType}
                                    alt={name}
                                    videoOptions={{
                                        height: isMobile ? 350 : 600,
                                        maxWidth: 300,
                                    }}
                                    imageOptions={{
                                        sizes: isMobile ? undefined : "50vw",
                                        width: isMobile ? 350 : undefined,
                                        height: isMobile ? 350 : undefined,
                                        respectRatio: true,
                                    }}
                                />
                            </SwiperSlide>
                            {mediaAttributes.map((attr) => (
                                <SwiperSlide key={attr.url}>
                                    <MediaDisplayer
                                        image={attr.url}
                                        alt="Media Attribute Image"
                                        image_mime_type={attr.mimeType}
                                        videoOptions={{
                                            height: isMobile ? 350 : 600,
                                            maxWidth: 300,
                                        }}
                                        imageOptions={{
                                            sizes: isMobile
                                                ? undefined
                                                : "50vw",
                                            width: isMobile ? 350 : undefined,
                                            height: isMobile ? 350 : undefined,
                                            respectRatio: true,
                                        }}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </SwiperContainer>
                </Flex>
                <Flex
                    flexDirection={{ _: "column-reverse", m: "column" }}
                    columnGap={6}
                    pl={{ _: 0, m: 40 }}
                    mt={{ _: 5, m: 0 }}
                    width={{ _: "100%", m: "50%" }}
                >
                    <Flex flexDirection={"column"} columnGap={1}>
                        <Text
                            fontSize={{ _: "20px", m: "38px" }}
                            fontWeight={600}
                            lineHeight={{ _: "25px", m: "50px" }}
                        >
                            {name}
                        </Text>
                        <Spacer y size={3} />
                        {!isClaimable && claimStatus === "Claimed" && (
                            <Link href={url} target="_blank">
                                <Flex style={{ cursor: "pointer" }} rowGap={1}>
                                    <FiExternalLink size={20} />
                                    <Text variant="bodyBold2">Manage</Text>
                                </Flex>
                            </Link>
                        )}

                        {description && (
                            <Text
                                variant="caption1"
                                mt={20}
                                fontSize={{ _: 12, m: 14 }}
                                style={{
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {description.length > 200 && !descrptionExtended
                                    ? `${description.slice(0, 200)}...`
                                    : description}
                            </Text>
                        )}
                        {description?.length > 200 && (
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
                                        setDescriptionExtended(
                                            !descrptionExtended,
                                        )
                                    }
                                    color="text"
                                    fontSize={{ _: 12, m: 14 }}
                                >
                                    {descrptionExtended
                                        ? "Show Less"
                                        : "Show More"}
                                </Text>

                                {descrptionExtended ? (
                                    <FaAngleUp
                                        color={theme.colors.text}
                                        style={{ marginTop: "12px" }}
                                    />
                                ) : (
                                    <FaAngleDown
                                        color={theme.colors.text}
                                        style={{ marginTop: "12px" }}
                                    />
                                )}
                            </Flex>
                        )}
                        {tokenData.personalized_message &&
                            !!Object.keys(tokenData.personalized_message)
                                .length &&
                            tokenData.personalized_message !== "null" && (
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
                                                        tokenData.personalized_message,
                                                    ).icon
                                                ]
                                            }
                                            alt={"personalizedIcon"}
                                            width={28}
                                            height={28}
                                        />
                                        <Text
                                            fontSize={{ _: 12, m: 28 }}
                                            lineHeight={1.2}
                                            fontWeight={600}
                                        >
                                            {
                                                JSON.parse(
                                                    tokenData.personalized_message,
                                                ).title
                                            }
                                        </Text>
                                        {isMobile && (
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
                                        )}
                                    </Flex>
                                    <Accordion open={personalizedMessageShow}>
                                        <Spacer y size={2} />
                                        <Text fontSize={12} lineHeight={1.2}>
                                            {
                                                JSON.parse(
                                                    tokenData.personalized_message,
                                                ).description
                                            }
                                        </Text>
                                        {JSON.parse(
                                            tokenData.personalized_message,
                                        ).websiteLink && (
                                            <>
                                                <Spacer
                                                    y
                                                    size={isMobile ? 2 : 4}
                                                />
                                                <a
                                                    href={
                                                        JSON.parse(
                                                            tokenData.personalized_message,
                                                        ).websiteLink.startsWith(
                                                            "https://",
                                                        )
                                                            ? JSON.parse(
                                                                  tokenData.personalized_message,
                                                              ).websiteLink
                                                            : `https://${
                                                                  JSON.parse(
                                                                      tokenData.personalized_message,
                                                                  ).websiteLink
                                                              }`
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button
                                                        fullWidth
                                                        style={{
                                                            height: "2rem",
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
                        {!!filteredAttributes.length ? (
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
                                        src={"/images/blockchain_2.svg"}
                                        alt={"WOV logo"}
                                        width={28}
                                        height={28}
                                    />
                                    <Text
                                        fontSize={{ _: 12, m: 28 }}
                                        lineHeight={1.2}
                                        fontWeight={600}
                                    >
                                        Details
                                    </Text>
                                    {isMobile && (
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
                                    )}
                                </Flex>
                                <Spacer y size={3} />
                                {detailsShow && (
                                    <>
                                        <Accordion
                                            open={detailsShow}
                                            // style={{ background: "red" }}
                                        >
                                            {
                                                <AttributeList
                                                    attributes={
                                                        filteredAttributes
                                                    }
                                                />
                                            }
                                        </Accordion>
                                    </>
                                )}
                            </>
                        ) : (
                            !isMobile && <Spacer y size={1000} />
                        )}

                        {!isMobile && (
                            <CertifiedProduct
                                verificationLabel={
                                    socials?.verificationLabel || undefined
                                }
                                mintTxId={mintTxId}
                                chain={chain}
                            />
                        )}

                        {!!histories?.length && (
                            <ProductHistory histories={histories} />
                        )}
                        {!!values?.length && <ProductValues values={values} />}
                        {socials && <GetInTouch socials={socials} />}
                    </Flex>
                    {isMobile && (
                        <CertifiedProduct
                            verificationLabel={
                                socials?.verificationLabel || undefined
                            }
                            mintTxId={mintTxId}
                            chain={chain}
                        />
                    )}
                    {!isMobile && !detailsShow && <Spacer y size={110} />}
                </Flex>
            </Flex>
            <Spacer y size={100} />

            {isClaimable && claimStatus === "Visible" && (
                <>
                    <div
                        style={{
                            position: isMobile ? "fixed" : "sticky",
                            bottom: isMobile ? "0" : "0px",

                            background: "#fff",
                            width: "100%",
                            padding: "10px",
                            paddingBottom: "20px",
                        }}
                    >
                        <Button
                            onClick={async () => {
                                await disconnectWallet();
                                setIsClaimOpen(true);
                                setAddress(null);
                                setInputValue("");
                            }}
                            style={{ width: "100%" }}
                        >
                            {isClaiming && isConnected ? (
                                <Loader />
                            ) : (
                                socials?.claimLabel || "Claim Ownership"
                            )}
                        </Button>
                    </div>
                </>
            )}

            <ShowCampaignModal
                isOpen={isCampaignModalOpen}
                setIsOpen={setIsCampaignModalOpen}
                campaign={campaign}
            />

            <Modal
                isOpen={isClaimOpen}
                setIsOpen={setIsClaimOpen}
                hasCloseButton={true}
                zIndex={0}
            >
                <Spacer y size={30} />
                <Flex
                    p={4}
                    flexDirection="column"
                    columnGap={3}
                    alignItems="center"
                >
                    {isClaimed ? (
                        <ClaimCompleted />
                    ) : isClaiming ? (
                        <ClaimInProgress />
                    ) : (
                        <>
                            <Title style={{ fontSize: 24, fontWeight: 900 }}>
                                Claim Ownership
                            </Title>

                            <Web3AuthButton
                                setIsClaiming={setIsClaiming}
                                chain={chain}
                            />

                            <DividerORContainer>
                                <div className="line-behind">
                                    <h3>OR</h3>
                                </div>
                            </DividerORContainer>

                            {ETH_CHAINS.includes(chain) && (
                                <EterehumConnect
                                    setIsClaiming={setIsClaiming}
                                />
                            )}
                            {chain === Chain.VECHAIN && (
                                <VechainConnect setIsClaiming={setIsClaiming} />
                            )}
                            <DividerORContainer>
                                <div className="line-behind">
                                    <h3>OR</h3>
                                </div>
                            </DividerORContainer>
                            <Input
                                inputProps={{
                                    placeholder: `Enter a ${
                                        ETH_CHAINS.includes(chain)
                                            ? "eth"
                                            : "vechain"
                                    } wallet ${
                                        ETH_CHAINS.includes(chain)
                                            ? "or ENS address here..."
                                            : "or .VET domain here..."
                                    }`,
                                    value: inputValue,
                                    onChange: (e) =>
                                        setInputValue(e.target.value as any),
                                }}
                            />
                            {showAddress ? (
                                <Text variant="captionBold2">{address}</Text>
                            ) : (
                                <Spacer size={3} y />
                            )}
                            <Button
                                onClick={() => {
                                    setIsClaiming(true);
                                    handleClaim();
                                }}
                                disabled={!isValidInput || isClaiming}
                                style={{ width: "100%" }}
                            >
                                {isClaiming ? <Loader /> : "Claim"}
                            </Button>
                        </>
                    )}
                </Flex>
            </Modal>
        </Box>
    );
};

function ClaimInProgress() {
    return (
        <Flex flexDirection="column" alignItems="center" columnGap={4}>
            <Lottie
                animationData={animationProgress}
                loop={true}
                style={{ width: 150, height: 150 }}
            />
            <Text variant="bodyBold1" textAlign="center">
                Claiming ownership
            </Text>
            <Text textAlign="center">
                Ownership transfer in progress. Please wait.
            </Text>
        </Flex>
    );
}

function ClaimCompleted() {
    return (
        <Flex flexDirection="column" alignItems="center" columnGap={4}>
            <Lottie
                animationData={animationSuccess}
                loop={false}
                style={{ width: 150, height: 150 }}
            />
            <Text variant="bodyBold1" textAlign="center">
                Congratulations!
            </Text>
            <Text textAlign="center">
                You have successfully claimed ownership of this item. Enjoy the
                benefits!
            </Text>
        </Flex>
    );
}

const SwiperContainer = styled.div`
    position: relative;
    height: 100%;
    max-height: calc(100vh - 80px - 64px - 64px);
    width: 100%;
    video {
        height: 100%;
    }
    .swiperContainer {
        overflow: hidden;
        height: 100%;
    }

    ${media.m`
        height: 500px;
    `}
`;

const DividerORContainer = styled.div`
    width: 100%;
    .line-behind {
        display: grid;
        grid-template-columns: 1fr max-content 1fr;
        align-items: center;
        gap: 1rem;
        color: #b1b5c3;
    }

    .line-behind:before,
    .line-behind:after {
        content: "";
        height: 1px;
        background-color: #b1b5c3;
    }
`;

export default ChipBound;
