import { theme } from "@/styles/theme";
import { useMemo, useState } from "react";
import { DropEvent, DropzoneOptions, useDropzone } from "react-dropzone";
import { MdUploadFile } from "react-icons/md";
import Flex from "../common/Flex";
import Text from "../common/Text";

export interface UploadValueMediaProps
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
    value: any;
    values: any;
    index: number;
}

const UploadValueMedia = ({
    onChange,
    accept: supportedMimeTypes,
    is3DEnabled,
    value,
    values,
    index,
    ...dropzoneProps
}: UploadValueMediaProps) => {
    const [isUploaded, setIsUploaded] = useState(false);
    const accept = useMemo(
        () => supportedMimeTypes?.reduce((vs, v) => ({ ...vs, [v]: [] }), {}),
        [supportedMimeTypes],
    );

    const [loadedCertificate, setLoadedCertificate] = useState(
        value.mediaUrl?.substring(value.mediaUrl?.lastIndexOf("/") + 1) ||
            value.file?.name?.substring(value.file?.name.lastIndexOf("/") + 1),
    );

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        ...dropzoneProps,
        accept,
        onDropAccepted: (files, event) => {
            setIsUploaded(true);
            setLoadedCertificate(files[0]?.name);
            onChange?.(files[0], event);
        },
    });

    return (
        <Flex
            height={50}
            borderRadius={16}
            border={`solid 1px ${theme.colors.muted}`}
            backgroundColor={theme.colors.muted}
            {...getRootProps()}
            justifyContent="center"
            alignItems="center"
        >
            {((!isUploaded && !(value.mediaUrl || value.file?.name)) ||
                !values.values[index]?.file) &&
            !loadedCertificate ? (
                <>
                    <input {...getInputProps()} />

                    <MdUploadFile size={20} />
                    <Text>Upload a certificate?</Text>
                </>
            ) : (
                <>
                    {!values.values[index]?.file?.name ? (
                        <>
                            <input {...getInputProps()} />

                            <MdUploadFile size={20} />
                            <Text>Upload a certificate?</Text>
                        </>
                    ) : (
                        <Text
                            mt={2}
                            fontWeight={700}
                            color={theme.colors.success}
                        >
                            {values.values[index]?.file?.name}
                        </Text>
                    )}
                </>
            )}
        </Flex>
    );
};

export default UploadValueMedia;
