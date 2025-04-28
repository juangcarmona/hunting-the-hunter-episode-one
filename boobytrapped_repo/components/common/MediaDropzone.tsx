import { Title } from "@/app/templates/common";
import animationUpload from "@/assets/lottie/upload-animation.json";
import { useDropzone as useDropzoneHook } from "@/hooks/useDropzone";
import { theme } from "@/styles/theme";
import Lottie from "lottie-react";
import { darken } from "polished";
import { useMemo, useState } from "react";
import { ErrorCode, useDropzone } from "react-dropzone";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import { FaRegFolderOpen, FaRegTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import mixins from "../../styles/_mixins";
import variables from "../../styles/_variables";
import MediaDisplayer from "../chip/MediaDisplayer";
import Button from "./Button";
import CircleButton from "./CircleButton";
import Flex from "./Flex";
import Spacer from "./Spacer";
import Text from "./Text";

const { dark } = mixins;
const { colors, typography } = variables;
const { neutrals } = colors;

export interface MediaDropzoneProps {
    supportedMimeTypes: string[];
    maxFileCount: number;
    maxFileSizeBytes: number;
    setValue: UseFormSetValue<any>;
    values?: FieldValues;
}

export default function MediaDropzone({
    supportedMimeTypes,
    maxFileCount,
    maxFileSizeBytes,
    setValue,
    values,
}: MediaDropzoneProps) {
    const getFormatsFromAccept = (formats: string[]): string[] => {
        return formats.reduce((acc: string[], format: string) => {
            const [type, subtype] = format.split("/");
            acc.push(subtype.toUpperCase());
            return acc;
        }, []);
    };
    const { handleClear, handleDrop, handleRemove, files } = useDropzoneHook();

    const supportedFormats = useMemo(
        () => getFormatsFromAccept(supportedMimeTypes).join(", "),
        [supportedMimeTypes],
    );

    const accept = useMemo(
        () => supportedMimeTypes.reduce((vs, v) => ({ ...vs, [v]: [] }), {}),
        [supportedMimeTypes],
    );

    const maxFileSizeMiB = useMemo(
        () => maxFileSizeBytes / (1024 * 1024),
        [maxFileSizeBytes],
    );

    const [error, setError] = useState<string | null>(null);
    const [lastTimeout, setLastTimeout] = useState<NodeJS.Timeout | null>(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept,
        maxSize: maxFileSizeBytes,
        multiple: true,
        maxFiles: maxFileCount - files.length,
        onDropAccepted: (data) => {
            if (values?.extraMedia?.length > 0) {
                const newData = values?.extraMedia.concat(data);
                setValue("extraMedia", newData);
            } else {
                setValue("extraMedia", data);
            }

            handleDrop(data);
        },
        onDropRejected: (data) => {
            setError(data[0].errors[0].message);
            if (lastTimeout) clearTimeout(lastTimeout);
            const timeout = setTimeout(() => setLastTimeout(null), 1500);
            setLastTimeout(timeout);
        },
        validator: (file) => {
            if (files.length + 1 > maxFileCount) {
                return {
                    message: `Maximum file count is ${maxFileCount}`,
                    code: ErrorCode.TooManyFiles,
                };
            } else if (files.some((f) => f.name === file.name)) {
                return {
                    message: `File already exists`,
                    code: "file-already-present",
                };
            } else {
                return null;
            }
        },
    });

    return (
        <Container onDropCapture={(e) => e.preventDefault()}>
            <Dropzone {...getRootProps()}>
                <input {...getInputProps()} />
                {files.length ? (
                    <Flex flexWrap="wrap">
                        {files.map((file) => (
                            <FilePreview
                                key={file.name}
                                file={file}
                                deselectSelf={() => handleRemove(file)}
                                elementsCount={files.length}
                                setValue={setValue}
                                values={values}
                            />
                        ))}
                    </Flex>
                ) : (
                    <>
                        <Flex
                            flexDirection={"column"}
                            flexWrap={"wrap"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            style={{ paddingLeft: 20 }}
                        >
                            <Lottie
                                animationData={animationUpload}
                                style={{ width: 80 }}
                            />
                            <Spacer y size={10} />
                            <Title>Drag and drop your files here</Title>
                            <Spacer y size={10} />
                            <Button>
                                <FaRegFolderOpen
                                    size="20"
                                    style={{ marginRight: "13px" }}
                                />
                                Browse
                            </Button>
                            <Spacer y size={20} />
                            <Text variant="caption2" color="accent">
                                Max Size <strong>{maxFileSizeMiB}MB</strong>
                            </Text>

                            <Spacer y size={10} />

                            {supportedFormats?.length && (
                                <Text variant="caption2" color="accent" px={50}>
                                    Accepted Formats{" "}
                                    <strong>{supportedFormats}</strong>
                                </Text>
                            )}
                        </Flex>
                    </>
                )}
            </Dropzone>{" "}
            <ClearButton
                isVisible={!!files.length}
                small
                title="Clear"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setValue &&
                        setValue(
                            "extraMedia",
                            values?.extraMedia.filter(
                                (item: any) => !files.includes(item),
                            ),
                        );

                    handleClear();
                }}
            >
                <FaRegTrashAlt size={20} />
            </ClearButton>
            <DropzoneError isOpen={!!lastTimeout}>{error}</DropzoneError>
        </Container>
    );
}

interface FilePreviewProps {
    file: File;
    deselectSelf: () => void;
    elementsCount: number;
    setValue?: UseFormSetValue<any>;
    values?: FieldValues;
}

export function FilePreview({
    file,
    deselectSelf,
    elementsCount,
    setValue,
    values,
}: FilePreviewProps) {
    const src = useMemo(() => URL.createObjectURL(file), [file]);
    const elementsCountUpdated =
        elementsCount === 1 || elementsCount % 2 === 0
            ? elementsCount
            : elementsCount + 1;
    return (
        <FilePreviewContainer elementsCount={elementsCountUpdated}>
            <DeselectButton
                onClick={(e) => {
                    e.stopPropagation();
                    setValue &&
                        values &&
                        setValue(
                            "extraMedia",
                            values.extraMedia.filter(
                                (item: any) => item !== file,
                            ),
                        );

                    deselectSelf();
                }}
            />
            <MediaDisplayer
                image_mime_type={file.type}
                image={src}
                alt="uploaded image"
            />
            <FilePreviewOverlay>{file.name}</FilePreviewOverlay>
        </FilePreviewContainer>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: ${theme.colors.muted};
    border-radius: 16px;
    position: relative;
`;

const Dropzone = styled.div`
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    height: 300px;
    margin-top: 10px;
    border-radius: 16px;
    overflow-y: scroll;
    scrollbar-color: grey transparent;
    border: ${`solid 1px ${theme.colors.muted}`};
`;

const DropzoneError = styled.div<{ isOpen?: boolean }>`
    ${typography.caption1}
    color: ${colors.red};
    overflow: hidden;
    max-height: ${(props) => (props.isOpen ? "24px" : "0px")};
    transition: max-height 200ms ease-in-out;
`;

const ButtonBase = styled(CircleButton)`
    background-color: ${colors.red};

    :hover {
        background-color: ${darken(0.1, colors.red)};
    }

    :active {
        background-color: ${darken(0.2, colors.red)};
    }
`;

const DeselectButton = styled(ButtonBase)`
    position: absolute;
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
    z-index: 4;

    ::before {
        content: "×";
        font-size: 24px;
        color: ${colors.neutrals[8]};
    }
`;

export const ClearButton = styled(ButtonBase)<{ isVisible?: boolean }>`
    position: absolute;
    bottom: 8px;
    right: 8px;
    opacity: ${(props) => (props.isVisible ? "1" : "0")};
    transition: opacity 200ms ease-in-out;
    z-index: 4;
`;

const FilePreviewContainer = styled.div<{ elementsCount: number }>`
    position: relative;
    // width: ${(props) => `${(450 / props.elementsCount) * 2}px`};
    // height: ${(props) => (props.elementsCount > 1 ? "190px" : "380px")};
    width: 200px;
    height: 200px;
    background: ${theme.colors.white};
    border-radius: 8px;
    // box-shadow: 0 0 8px 4px ${neutrals[5]};
    padding: 10px;
    margin: 5px;
`;

const FilePreviewOverlay = styled.div`
    ${typography.caption1}
    position: absolute;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    left: 0;
    text-align: center;
    font-weight: 600;
    padding: 2px 5px;
    color: white;
    background: rgba(0, 0, 0, 0.6);
`;
