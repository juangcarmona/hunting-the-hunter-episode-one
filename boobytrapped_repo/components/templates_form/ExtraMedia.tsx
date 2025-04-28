import Flex from "@/components/common/Flex";
import Spacer from "@/components/common/Spacer";
import {
    MULTI_UPLOAD_MAX_FILE_SIZE_BYTES,
    MULTI_UPLOAD_MAX_TOKEN_COUNT,
    SUPPORTED_IMAGE_MIME_TYPES,
} from "@/constants/uploadInfo";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useState } from "react";
import { AspectRatio } from "react-aspect-ratio";
import { Control, FieldValues, UseFormSetValue } from "react-hook-form";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import styled from "styled-components";
import MediaDropzone, { ClearButton } from "../common/MediaDropzone";
import { Card, SwiperContainer } from "./SelectedTemplatePreview";

interface ExtraMediaProps {
    setStep: (step: number) => void;
    isValid: boolean;
    setValue: UseFormSetValue<any>;
    control: Control;
    subFormOpened: boolean;
    values?: FieldValues;
}

const ExtraMedia: React.FC<ExtraMediaProps> = ({
    setValue,
    subFormOpened,
    values,
}) => {
    const [isAdditionalFilesButtonChecked, setiIsAdditionalFilesButtonChecked] =
        useState(subFormOpened);

    const handleToggle = () => {
        setiIsAdditionalFilesButtonChecked(!isAdditionalFilesButtonChecked);
    };
    const [selectedMediaElement, setSetselectedMediaElement] = useState(0);
    const totalMedias = values?.extraMedia?.length;

    const handleNext = () => {
        let nextIndex = (selectedMediaElement + 1) % totalMedias;

        while (values?.extraMedia?.[nextIndex]?.mediaUrl === undefined) {
            nextIndex = (nextIndex + 1) % totalMedias;
        }

        setSetselectedMediaElement(nextIndex);
    };

    const handlePrev = () => {
        let nextIndex = (selectedMediaElement - 1 + totalMedias) % totalMedias;

        while (values?.extraMedia?.[nextIndex]?.mediaUrl === undefined) {
            nextIndex = (nextIndex - 1 + totalMedias) % totalMedias;
        }
        setSetselectedMediaElement(nextIndex);
    };

    const toggleButtonStyle: { [key: string]: React.CSSProperties } = {
        toggleContainer: {
            position: "relative",
            display: "inline-block",
            width: "3rem",
            height: "1.5rem",
        },
        toggleInput: {
            display: "none",
        },
        toggleLabel: {
            position: "absolute",
            cursor: "pointer",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isAdditionalFilesButtonChecked
                ? theme.colors.primary
                : theme.colors.muted,
            borderRadius: "34px",
            transition: "background-color 0.4s",
        },
        toggleButton: {
            position: "absolute",
            top: 0,
            left: !isAdditionalFilesButtonChecked ? 0 : "50%",
            width: "1.5rem",
            height: "1.5rem",
            backgroundColor: isAdditionalFilesButtonChecked
                ? "white"
                : theme.colors.primary,
            borderRadius: "50%",
            transition: "left 0.4s",
        },
    };

    return (
        <Flex flexDirection="column">
            <Flex justifyContent="space-between">
                <Label>
                    Upload <strong>additional files</strong>
                </Label>
                <div style={toggleButtonStyle.toggleContainer}>
                    <input
                        type="checkbox"
                        id="toggle"
                        style={toggleButtonStyle.toggleInput}
                    />
                    <label
                        htmlFor="toggle"
                        style={toggleButtonStyle.toggleLabel}
                        onClick={handleToggle}
                    >
                        <div style={toggleButtonStyle.toggleButton}></div>
                    </label>
                </div>
            </Flex>
            {isAdditionalFilesButtonChecked && (
                <>
                    <Spacer y size={3} />
                    {totalMedias > 0 &&
                        values?.extraMedia.some(
                            (item: any) => !(item instanceof File),
                        ) && (
                            <>
                                <SwiperContainer>
                                    <Label style={{ fontWeight: 900 }}>
                                        Current additional files:{" "}
                                    </Label>
                                    <Spacer y size={3} />
                                    <AspectRatio>
                                        <Card
                                            style={{
                                                boxShadow:
                                                    "5.921px 5.921px 5.921px 5.921px rgba(0, 0, 0, 0.1)",
                                            }}
                                        >
                                            {totalMedias > 1 &&
                                                Object.values(
                                                    values?.extraMedia || {},
                                                ).filter(
                                                    (media: any) =>
                                                        media?.mediaUrl !==
                                                        undefined,
                                                ).length >= 2 && (
                                                    <div
                                                        className="swiper-button image-swiper-button-next"
                                                        onClick={handleNext}
                                                    >
                                                        <IoIosArrowForward />
                                                    </div>
                                                )}

                                            <Image
                                                src={
                                                    values?.extraMedia?.[
                                                        selectedMediaElement
                                                    ]?.mediaUrl || ""
                                                }
                                                alt="preview"
                                                fill
                                                style={{
                                                    objectFit: "cover",
                                                    userSelect: "none",
                                                }}
                                            />
                                            {totalMedias > 1 &&
                                                Object.values(
                                                    values?.extraMedia || {},
                                                ).filter(
                                                    (media: any) =>
                                                        media?.mediaUrl !==
                                                        undefined,
                                                ).length >= 2 && (
                                                    <div
                                                        className="swiper-button image-swiper-button-prev"
                                                        onClick={handlePrev}
                                                    >
                                                        <IoIosArrowBack />
                                                    </div>
                                                )}
                                        </Card>
                                        <ClearButton
                                            isVisible={true}
                                            small
                                            title="Clear"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                const updatedExtraMedia =
                                                    values?.extraMedia.filter(
                                                        (item: any) =>
                                                            item.id !==
                                                            values
                                                                ?.extraMedia?.[
                                                                selectedMediaElement
                                                            ]?.id,
                                                    );

                                                setValue &&
                                                    setValue(
                                                        "extraMedia",
                                                        updatedExtraMedia,
                                                    );
                                                setSetselectedMediaElement(
                                                    selectedMediaElement === 0
                                                        ? 0
                                                        : selectedMediaElement -
                                                              1,
                                                );
                                            }}
                                        >
                                            <FaRegTrashAlt size={20} />
                                        </ClearButton>
                                    </AspectRatio>
                                </SwiperContainer>
                            </>
                        )}
                    <Spacer y size={3} />
                    <Label style={{ fontWeight: 900 }}>
                        New additional files to be added:{" "}
                    </Label>
                    <Spacer y size={3} />
                    <MediaDropzone
                        supportedMimeTypes={SUPPORTED_IMAGE_MIME_TYPES}
                        maxFileCount={MULTI_UPLOAD_MAX_TOKEN_COUNT}
                        maxFileSizeBytes={MULTI_UPLOAD_MAX_FILE_SIZE_BYTES}
                        setValue={setValue}
                        values={values}
                    />
                </>
            )}
        </Flex>
    );
};

const Label = styled.div`
    ${({ theme }) => theme.typography.body2};
`;

export default ExtraMedia;
