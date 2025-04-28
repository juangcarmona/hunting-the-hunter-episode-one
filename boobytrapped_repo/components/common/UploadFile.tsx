import { Title } from "@/app/templates/common";
import animationSuccess from "@/assets/lottie/success-animation.json";
import animationUpload from "@/assets/lottie/upload-animation.json";
import { theme } from "@/styles/theme";
import Lottie from "lottie-react";
import { useMemo, useState } from "react";
import { DropEvent, DropzoneOptions, useDropzone } from "react-dropzone";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import { FaRegFolderOpen, FaRegTrashAlt, FaStarOfLife } from "react-icons/fa";
import styled from "styled-components";
import Button from "./Button";
import Flex from "./Flex";
import Modal from "./Modal";
import Spacer from "./Spacer";
import Text from "./Text";

export interface UploadFileProps
    extends Omit<
        DropzoneOptions,
        | "onDrop"
        | "onDropAccepted"
        | "onDropRejected"
        | "multiple"
        | "maxFiles"
        | "accept"
    > {
    accept?: string[];
    onChange?: (file: File, event: DropEvent) => void;
    is3DEnabled?: boolean;
    setValue?: UseFormSetValue<any>;
    values: FieldValues;
    origin?: string;
}

const UploadFile = ({
    onChange,
    accept: supportedMimeTypes,
    is3DEnabled,
    setValue,
    values,
    origin,
    ...dropzoneProps
}: UploadFileProps) => {
    const [isUploaded, setIsUploaded] = useState(false);
    const [isRefused, setIsRefused] = useState(false);

    const accept: Record<string, any> | undefined = useMemo(
        () => supportedMimeTypes?.reduce((vs, v) => ({ ...vs, [v]: [] }), {}),
        [supportedMimeTypes],
    );
    if (accept && Object.keys(accept).includes("model/gltf-binary")) {
        accept[".glb"] = "model/gltf-binary";
    }

    const { getRootProps, getInputProps } = useDropzone({
        ...dropzoneProps,
        accept,
        onDropAccepted: (files: any[], event) => {
            let fileToUpload = files;

            if (fileToUpload[0]?.path?.endsWith(".glb")) {
                const modifiedFile = new File(
                    [fileToUpload[0]],
                    fileToUpload[0].name,
                    { type: "model/gltf-binary" },
                );
                fileToUpload[0] = modifiedFile;
            }

            setIsUploaded(true);
            onChange?.(files[0], event);
        },
        onDropRejected() {
            setIsRefused(true);
        },
    });

    const supportedFormats = useMemo(
        () =>
            supportedMimeTypes
                ?.map((v) => v.split("/")[1].toUpperCase())
                ?.join(", "),
        [supportedMimeTypes],
    );

    const handleClear = () => {
        setIsUploaded(false);
    };

    return (
        <Container>
            <Label>
                {!is3DEnabled && (
                    <>
                        Upload <strong>featured file</strong>
                        <sup>
                            <FaStarOfLife
                                size={8}
                                style={{
                                    position: "absolute",
                                    top: "2px",
                                    marginLeft: "3px",
                                }}
                            />
                        </sup>
                    </>
                )}
            </Label>

            <UploadFileElement {...getRootProps()} isUploaded={isUploaded}>
                {(!isUploaded && origin === "Details" && !values.file) ||
                (!isUploaded &&
                    !values.animationFile?.id &&
                    origin !== "Details") ? (
                    <>
                        <input {...getInputProps()} />
                        <Spacer y size={10} />
                        <Lottie
                            animationData={animationUpload}
                            style={{ width: 80 }}
                        />
                        <Spacer y size={10} />
                        <Title>Drag and drop your file here</Title>
                        <Spacer y size={10} />

                        <Button>
                            <FaRegFolderOpen
                                size="20"
                                style={{ marginRight: "13px" }}
                            />
                            Browse
                        </Button>
                        <Spacer y size={20} />

                        {dropzoneProps?.maxSize && (
                            <Text variant="caption2" color="accent">
                                Max Size{" "}
                                <strong>
                                    {dropzoneProps.maxSize / 1024 / 1024}MB
                                </strong>
                            </Text>
                        )}
                        <Spacer y size={10} />

                        {supportedFormats?.length && (
                            <Text variant="caption2" color="accent" px={50}>
                                Accepted Formats{" "}
                                <strong>
                                    {is3DEnabled
                                        ? "GLB, GLTF"
                                        : supportedFormats}
                                </strong>
                            </Text>
                        )}

                        <Modal isOpen={isRefused} setIsOpen={setIsRefused}>
                            <Spacer size={3} y />
                            <Flex
                                flexDirection="column"
                                alignItems="center"
                                height={100}
                                columnGap={3}
                            >
                                <Text textAlign="center">
                                    The file you tried to upload is not valid
                                </Text>
                                <Button
                                    onClick={() => setIsRefused(false)}
                                    outline
                                >
                                    Ok
                                </Button>
                            </Flex>
                        </Modal>
                    </>
                ) : (
                    <>
                        {values.animationFile?.id ||
                            (origin === "Details" && !isUploaded && (
                                <Spacer y size={55} />
                            ))}
                        <Lottie
                            animationData={animationSuccess}
                            loop={false}
                            style={{ width: 150 }}
                        />
                        <Text
                            mt={2}
                            fontWeight={700}
                            fontSize={21}
                            color={theme.colors.success}
                        >
                            Upload Successful
                        </Text>
                        <div
                            style={{
                                position: "absolute",
                                bottom: "8px",
                                right: "8px",
                                transition: "opacity 200ms ease-in-out",
                                zIndex: 4,
                            }}
                            title="Clear"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (origin === "Details" && setValue) {
                                    setValue("file", undefined);
                                } else {
                                    if (values.animationFile && setValue) {
                                        setValue("animationFile", undefined);
                                    }
                                }

                                handleClear();
                            }}
                        >
                            <FaRegTrashAlt size={30} />
                        </div>
                    </>
                )}
            </UploadFileElement>

            <InfoContainer></InfoContainer>
        </Container>
    );
};

const Container = styled.div`
    position: relative;
`;

const Label = styled.div`
    ${({ theme }) => theme.typography.body2};
`;

const UploadFileElement = styled.div<{ isUploaded: boolean }>`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: ${(props) => (props.isUploaded ? "center" : "start")};
    align-items: center;
    height: 300px;
    margin-top: 16px;
    border-radius: 16px;
    border: ${(props) =>
        props.isUploaded ? `solid 1px ${theme.colors.muted}` : "none"};
    overflow: hidden;
    background: ${(props) =>
        props.isUploaded ? theme.colors.white : theme.colors.muted};
    transition: all 0.2s;
`;

const InfoContainer = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 4px;
`;

export default UploadFile;
