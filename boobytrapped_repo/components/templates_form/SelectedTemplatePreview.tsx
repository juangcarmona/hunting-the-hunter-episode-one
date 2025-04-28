import { TemplateService } from "@/services/TemplateService";
import variables from "@/styles/_variables";
import { theme } from "@/styles/theme";
import GenericModal from "@/utils/GenericModal";
import { useMediaQuery } from "@react-hook/media-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AspectRatio from "react-aspect-ratio";
import { FieldValues } from "react-hook-form";
import {
    FaAngleDown,
    FaAngleUp,
    FaRegClone,
    FaRegTrashAlt,
} from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { toast } from "react-toastify";
import styled from "styled-components";
import { mutate } from "swr";
import AttributeList from "../chip/AttributeList";
import CertifiedProduct from "../chip/CertifiedProduct";
import MediaDisplayer from "../chip/MediaDisplayer";
import ProductHistory from "../chip/ProductHistory";
import ProductValues from "../chip/ProductValues";
import Box from "../common/Box";
import Button from "../common/Button";
import CircleButton from "../common/CircleButton";
import Divider from "../common/Divider";
import Flex from "../common/Flex";
import Spacer from "../common/Spacer";
import Text from "../common/Text";
import { personalizedImgs } from "./PersonalizedMessage";

const {
    colors: { red },
} = variables;

interface TemplatePreviewProps {
    value: FieldValues;
    closeModal: () => void;
}

const SelectedTemplatePreview: React.FC<TemplatePreviewProps> = ({
    value,
    closeModal,
}) => {
    const [descrptionExtended, setDescriptionExtended] = useState(false);
    const [deleteConfirmationModalOpened, setDeleteConfirmationModalOpened] =
        useState(false);
    // const [forceUpdate, setForceUpdate] = useState(false);
    const [
        duplicateConfirmationModalOpened,
        setDuplicateConfirmationModalOpened,
    ] = useState(false);
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    const [selectedMediaElement, setSetselectedMediaElement] = useState(0);
    const getCurrentDimension = () => {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    };
    const [detailsShow, setDetailsShow] = useState(true);
    const [personalizedMessageShow, setPersonalizedMessageShow] =
        useState(true);

    const [screenSize, setScreenSize] = useState(getCurrentDimension());
    const router = useRouter();

    const isMedia3DLoaded = () => {
        const hasOnlyMediaUrl = (obj: any) => {
            return (
                Object.keys(obj).length === 1 &&
                obj.hasOwnProperty("animationurl")
            );
        };
        if (
            value.animationurl &&
            !value.Medias.some((obj: any) => hasOnlyMediaUrl(obj))
        ) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        if (value.animationurl) {
            setSetselectedMediaElement(1);
        }
    }, []);

    useEffect(() => {
        if (isMedia3DLoaded()) {
            value.Medias.splice(1, 0, { animationurl: value.animationurl });
            setSetselectedMediaElement(1);
        }
    }, [value.Medias, value.animationurl]);

    useEffect(() => {
        const updateDimension = () => {
            setScreenSize(getCurrentDimension());
        };
        window.addEventListener("resize", updateDimension);
        return () => {
            window.removeEventListener("resize", updateDimension);
        };
    }, [screenSize]);

    const deleteTemplate = async (shouldDeleteTemplate: boolean) => {
        if (shouldDeleteTemplate) {
            try {
                await TemplateService.deleteTemplate(value.id);
                mutate("/templates");
                toast.success("The template has been deleted!");
                closeModal();
            } catch (error) {
                toast.error(
                    "An error occurred! Please contact the administrators",
                );
                console.error("Error while deleting template", error);
            }
        }
        setDeleteConfirmationModalOpened(false);
    };

    const duplicateTemplate = async (shouldDuplicateTemplate: boolean) => {
        if (shouldDuplicateTemplate) {
            try {
                // Filter duplicate
                value.Medias = value.Medias.filter(
                    (obj: any) =>
                        Object.keys(obj).length !== 1 ||
                        !obj.hasOwnProperty("animationurl"),
                );

                const templateBody = {
                    name: `Copy of ${value.name}`,
                    title: value.title,
                    description: value.description,
                    provenance: value.provenance,
                    histories: value.Histories,
                    values: value.Values,
                    personalizedMessage: JSON.parse(value.personalizedMessage),
                };

                const templateRes = await TemplateService.create(
                    value.projectId,
                    templateBody,
                );

                const templateId = templateRes?.data?.json?.id;

                if (value.media3d) {
                    value.Medias.splice(1, 0, value.media3d);
                }
                await TemplateService.copyTemplateMedia(
                    templateId,
                    value.Medias,
                );

                // await TemplateService.copyTemplateValues(
                //     templateId,
                //     value.Values,
                // );
                mutate("/templates");
                toast.success("The template has been duplicated!");
                closeModal();
            } catch (error) {
                toast.error(
                    "An error occurred! Please contact the administrators",
                );
                console.error("Error while duplicating template", error);
            }
        }
        setDuplicateConfirmationModalOpened(false);
    };

    const openTokenizeContent = () => {
        router.push(`/templates/${value.id}/mint/connect`);
    };

    const totalMedias = value.Medias.length;

    const handleNext = () => {
        if (
            selectedMediaElement === totalMedias - 1 &&
            value.Medias[1]?.animationurl
        ) {
            setSetselectedMediaElement(1);
        } else {
            setSetselectedMediaElement((prev) => (prev + 1) % totalMedias);
        }
    };

    const handlePrev = () => {
        if (value.Medias[selectedMediaElement].animationurl) {
            setSetselectedMediaElement(totalMedias - 1);
        } else {
            setSetselectedMediaElement(
                (prev) => (prev - 1 + totalMedias) % totalMedias,
            );
        }
    };

    const ImagesContent = () => {
        return (
            <>
                <Box mx="auto">
                    <SwiperContainer>
                        <AspectRatio>
                            <Card>
                                {totalMedias > 1 && (
                                    <div
                                        className="swiper-button image-swiper-button-next"
                                        onClick={handleNext}
                                    >
                                        <IoIosArrowForward />
                                    </div>
                                )}

                                <MediaDisplayer
                                    animation_url={
                                        value.Medias?.[selectedMediaElement]
                                            ?.animationurl
                                    }
                                    image={
                                        value.Medias?.[selectedMediaElement]
                                            ?.mediaUrl || ""
                                    }
                                    alt="preview"
                                    image_mime_type={
                                        value.Medias?.[selectedMediaElement]
                                            ?.mimeType
                                    }
                                    videoOptions={{
                                        height: isMobile ? 350 : 600,
                                        maxWidth: 300,
                                    }}
                                    imageOptions={{
                                        sizes: isMobile ? undefined : "50vw",
                                        width: isMobile ? 220 : undefined,
                                        height: isMobile ? 220 : undefined,
                                        respectRatio: true,
                                    }}
                                />

                                {totalMedias > 1 && (
                                    <div
                                        className="swiper-button image-swiper-button-prev"
                                        onClick={handlePrev}
                                    >
                                        <IoIosArrowBack />
                                    </div>
                                )}
                            </Card>
                        </AspectRatio>
                    </SwiperContainer>
                </Box>
            </>
        );
    };
    return (
        <Box
            borderRadius={20}
            overflowY="scroll"
            backgroundColor="white"
            height={
                deleteConfirmationModalOpened ||
                duplicateConfirmationModalOpened
                    ? "20vh"
                    : isMobile && !descrptionExtended
                      ? "80%"
                      : "100vh"
            }
            mr="-15px"
            pr="20px"
            pl="20px"
            style={{
                scrollbarColor: "grey transparent",
                scrollbarWidth: "auto",
            }}
        >
            {deleteConfirmationModalOpened && (
                <GenericModal
                    title={`Delete ${value.name}?`}
                    onAnswer={deleteTemplate}
                    additionalProps={{ isError: "true" }}
                />
            )}
            {duplicateConfirmationModalOpened && (
                <GenericModal
                    title={`Duplicate ${value.name}?`}
                    onAnswer={duplicateTemplate}
                />
            )}
            {!deleteConfirmationModalOpened &&
                !duplicateConfirmationModalOpened && (
                    <>
                        <Spacer y size={5} />
                        <Box width={"100%"} mx="auto">
                            {!value.Medias[0]?.mediaUrl && (
                                <Box
                                    mx="auto"
                                    height={400}
                                    style={{
                                        background:
                                            'linear-gradient(rgba(255, 255, 255, 0.9),rgba(255, 255, 255, 0.9)),url("/images/checker.png")',
                                    }}
                                />
                            )}
                            {value.Medias[0]?.mediaUrl && <ImagesContent />}
                            <Spacer y size={2} />

                            <Flex
                                flexDirection={"column-reverse"}
                                columnGap={6}
                                pl={0}
                                mt={5}
                            >
                                <Flex flexDirection={"column"} columnGap={1}>
                                    <Text
                                        fontSize={"20px"}
                                        fontWeight={600}
                                        lineHeight={"50px"}
                                    >
                                        {descrptionExtended
                                            ? value.title
                                            : value.title.length > 20
                                              ? `${value.title.slice(0, 20)}...`
                                              : value.title}
                                    </Text>

                                    {value.description && (
                                        <Text
                                            variant="caption1"
                                            fontSize={12}
                                            style={{
                                                whiteSpace: "pre-wrap",
                                            }}
                                        >
                                            {value.description.length > 200 &&
                                            !descrptionExtended
                                                ? `${value.description.slice(
                                                      0,
                                                      200,
                                                  )}...`
                                                : value.description}
                                        </Text>
                                    )}
                                    {
                                        <Flex
                                            alignItems="center"
                                            justifyContent="center"
                                            style={{
                                                fontWeight: "1000",
                                                cursor: "pointer",
                                            }}
                                            height={20}
                                            rowGap={1}
                                            onClick={() =>
                                                setDescriptionExtended(
                                                    !descrptionExtended,
                                                )
                                            }
                                        >
                                            <Text
                                                mt={10}
                                                color="text"
                                                fontSize={12}
                                            >
                                                {descrptionExtended
                                                    ? "Show Less"
                                                    : "Show More"}
                                            </Text>
                                            {descrptionExtended ? (
                                                <FaAngleUp
                                                    color={theme.colors.text}
                                                    style={{
                                                        marginTop: "12px",
                                                    }}
                                                />
                                            ) : (
                                                <FaAngleDown
                                                    color={theme.colors.text}
                                                    style={{
                                                        marginTop: "12px",
                                                    }}
                                                />
                                            )}
                                        </Flex>
                                    }

                                    {value.personalizedMessage &&
                                        !!Object.keys(value.personalizedMessage)
                                            .length &&
                                        value.personalizedMessage !== "null" &&
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
                                                                    value.personalizedMessage,
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
                                                                value.personalizedMessage,
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
                                                    open={
                                                        personalizedMessageShow
                                                    }
                                                >
                                                    <Spacer y size={2} />
                                                    <Text
                                                        fontSize={12}
                                                        lineHeight={1.2}
                                                    >
                                                        {
                                                            JSON.parse(
                                                                value.personalizedMessage,
                                                            ).description
                                                        }
                                                    </Text>
                                                    {JSON.parse(
                                                        value.personalizedMessage,
                                                    ).websiteLink && (
                                                        <>
                                                            {" "}
                                                            <Spacer
                                                                y
                                                                size={2}
                                                            />
                                                            <a
                                                                href={
                                                                    JSON.parse(
                                                                        value.personalizedMessage,
                                                                    ).websiteLink.startsWith(
                                                                        "https://",
                                                                    )
                                                                        ? JSON.parse(
                                                                              value.personalizedMessage,
                                                                          )
                                                                              .websiteLink
                                                                        : `https://${
                                                                              JSON.parse(
                                                                                  value.personalizedMessage,
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
                                                                    Find out
                                                                    more
                                                                </Button>
                                                            </a>
                                                        </>
                                                    )}
                                                </Accordion>
                                            </>
                                        )}

                                    {!!value.provenance.length &&
                                        descrptionExtended && (
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
                                                        src={
                                                            "/images/blockchain_2.svg"
                                                        }
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
                                                                (prevState) =>
                                                                    !prevState,
                                                            )
                                                        }
                                                    >
                                                        <ArrowDownIcon
                                                            open={detailsShow}
                                                        />
                                                    </CircleButton>
                                                </Flex>
                                                <Spacer y size={2} />
                                                <Accordion open={detailsShow}>
                                                    {
                                                        <AttributeList
                                                            displayInModal={
                                                                true
                                                            }
                                                            attributes={
                                                                value.provenance
                                                            }
                                                        />
                                                    }
                                                </Accordion>
                                            </>
                                        )}
                                </Flex>

                                <CertifiedProduct />
                            </Flex>
                            {descrptionExtended && (
                                <div>
                                    {!!value.Histories?.length && (
                                        <ProductHistory
                                            displayInModal={true}
                                            histories={value.Histories}
                                        />
                                    )}
                                    {!!value.Values?.length && (
                                        <ProductValues
                                            displayInModal={true}
                                            values={value.Values}
                                        />
                                    )}
                                </div>
                            )}
                            <Spacer y size={20} />

                            <Flex flexDirection="column" alignItems="center">
                                <Button
                                    onClick={() => openTokenizeContent()}
                                    style={{ width: "100%" }}
                                >
                                    Tokenize
                                </Button>
                                <Spacer y size={3} />
                                <Button
                                    onClick={async () => {
                                        // Clean up function before initiating the edit flow
                                        value.Medias = value.Medias.filter(
                                            (obj: any) =>
                                                Object.keys(obj).length !== 1 ||
                                                !obj.hasOwnProperty(
                                                    "animationurl",
                                                ),
                                        );

                                        const url = new URL(
                                            `/templates/create`,
                                            window.location.href,
                                        );
                                        url.searchParams.set(
                                            "templateId",
                                            value.id,
                                        );
                                        // Can be added for faster search in the future if needed
                                        // url.searchParams.set(
                                        //     "projectId",
                                        //     value.projectId,
                                        // );
                                        router.replace(url.href);
                                    }}
                                    outline
                                    style={{ width: "100%" }}
                                >
                                    Edit
                                </Button>
                                <Spacer y size={3} />
                                <Flex
                                    flexDirection="row"
                                    justifyContent="space-evenly"
                                    style={{ width: "100%" }}
                                >
                                    <HoverableDuplicateFlex
                                        alignItems="center"
                                        style={{ cursor: "pointer" }}
                                        flexDirection={"row"}
                                        rowGap={2}
                                        onClick={() =>
                                            setDuplicateConfirmationModalOpened(
                                                true,
                                            )
                                        }
                                    >
                                        <FaRegClone />
                                        <Text variant="bodyBold2">
                                            Duplicate
                                        </Text>
                                    </HoverableDuplicateFlex>
                                    <HoverableDeleteFlex
                                        alignItems="center"
                                        onClick={() =>
                                            setDeleteConfirmationModalOpened(
                                                true,
                                            )
                                        }
                                        rowGap={2}
                                    >
                                        <FaRegTrashAlt />

                                        <Text variant="bodyBold2">Delete</Text>
                                    </HoverableDeleteFlex>
                                </Flex>
                            </Flex>
                            <Spacer
                                y
                                size={screenSize.width > 767 ? 100 : 50}
                            />
                        </Box>
                    </>
                )}
        </Box>
    );
};

const HoverableDeleteFlex = styled(Flex)`
    color: ${red};
    justify-content: center;
    cursor: pointer;
    flex-direction: row;
    row-gap: 2px;
    padding: 10px;
    border-radius: 20px;
    transition: background-color 0.3s ease;
    width: 50%;

    &:hover {
        color: white;
        background-color: ${red};
    }
`;

const HoverableDuplicateFlex = styled(Flex)`
    color: ${theme.colors.black};
    justify-content: center;
    cursor: pointer;
    flex-direction: row;
    row-gap: 2px;
    padding: 10px;
    border-radius: 20px;
    transition: background-color 0.3s ease;
    width: 50%;

    &:hover {
        color: white;
        background-color: ${theme.colors.black};
    }
`;

export const Card = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-right: 2px;
    border-radius: 20px;
    background: #fcfcfd;
    box-shadow: 10px 4px 10px 0px rgba(0, 0, 0, 0.1);
`;

export const ArrowDownIcon = styled(FaAngleDown)<{ open: boolean }>`
    transition: transform 200ms ease-in-out;
    transform: ${(props) => (props.open ? "rotate(180deg)" : null)};
`;

export const Accordion = styled.div<{ open: boolean }>`
    opacity: ${(props) => (props.open ? null : 0)};
    max-height: ${(props) => (!props.open ? 0 : "auto")};
    transition: all 200ms ease-in-out;
    overflow: auto;
`;

export const SwiperContainer = styled.div`
    height: 100%;
    max-height: calc(100vh - 80px - 64px - 64px);
    width: 100%;
    .swiperContainer {
        overflow: hidden;
        height: 100%;
    }
    .swiper-button svg {
        width: 30px;
        height: 30px;
        color: #276efe;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 25px;
    }
    .image-swiper-button-prev {
        left: 0rem;
    }
    .image-swiper-button-next {
        right: 0rem;
    }
    .swiper-button {
        display: flex;
        position: absolute;
        top: 45%;
        z-index: 2;
        cursor: pointer;
    }
`;

export default SelectedTemplatePreview;
