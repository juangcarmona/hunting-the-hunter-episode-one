import React, { useCallback } from "react";
import { Accept, useDropzone } from "react-dropzone";
import styled from "styled-components";
import Icon from "../common/Icon";

interface FileSelectorProps {
    accept: Accept;
    onFileChange: (files: File[]) => void;
    register: any;
}

const FileSelector: React.FC<FileSelectorProps> = ({
    accept,
    onFileChange,
    register,
}) => {
    const onDrop = useCallback((file: File[]) => {
        onFileChange(file);
    }, []);

    const {
        ref: registerRef,
        onChange: registerOnChange,

        ...rest
    } = register("file", { required: true });

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
    });

    return (
        <DragDiv {...getRootProps()}>
            <input
                {...getInputProps()}
                onChange={(e) => {
                    registerOnChange(e);
                }}
                ref={(e) => {
                    registerRef(e);
                }}
            />
            {isDragActive ? (
                <p>Drop the files here ...</p>
            ) : (
                <p>
                    Drag and drop some files here, or click to select files
                    <br />
                    {accept ? (
                        <small>
                            Allowed files:&nbsp;
                            {Object.entries(accept).map(([key, value]) => (
                                <span key={value[0]}>{value.join(", ")}</span>
                            ))}
                        </small>
                    ) : null}
                </p>
            )}

            <Icon icon="upload" size={32} />
        </DragDiv>
    );
};

const DragDiv = styled.div`
    margin: auto;
    width: 600px;
    height: 200px;
    border: 1px dashed #ccc;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
    cursor: pointer;
`;

export default FileSelector;
