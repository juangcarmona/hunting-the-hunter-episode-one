import Flex from "@/components/common/Flex";
import {
    ANIMATION_UPLOAD_MAX_FILE_SIZE_BYTES,
    SUPPORTED_MODEL_3D_MIME_TYPES,
} from "@/constants/uploadInfo";
import { theme } from "@/styles/theme";
import { useState } from "react";
import {
    Control,
    Controller,
    FieldValues,
    UseFormSetValue,
} from "react-hook-form";
import styled from "styled-components";
import UploadFile from "../common/UploadFile";

interface Media3DProps {
    setValue: UseFormSetValue<any>;
    values: FieldValues;
    control: Control;
    subFormOpened: boolean;
}

const Media3D: React.FC<Media3DProps> = ({
    setValue,
    subFormOpened,
    control,
    values,
}) => {
    const [isAdditionalFilesButtonChecked, setiIsAdditionalFilesButtonChecked] =
        useState(values.animationFile);

    const handleToggle = () => {
        setiIsAdditionalFilesButtonChecked(!isAdditionalFilesButtonChecked);
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
                ? theme.colors.white
                : theme.colors.primary,
            borderRadius: "50%",
            transition: "left 0.4s",
        },
    };

    return (
        <Flex flexDirection="column">
            <Flex justifyContent="space-between">
                <Label>
                    Upload a <strong>3D file</strong>
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
                    <Controller
                        name={"animationFile"}
                        control={control}
                        render={({ field: { onChange } }) => (
                            <UploadFile
                                values={values}
                                maxSize={ANIMATION_UPLOAD_MAX_FILE_SIZE_BYTES}
                                accept={SUPPORTED_MODEL_3D_MIME_TYPES}
                                onChange={(f) => {
                                    onChange(f);
                                }}
                                setValue={setValue}
                                is3DEnabled
                                origin="Media"
                            />
                        )}
                    />
                </>
            )}
        </Flex>
    );
};

const Label = styled.div`
    ${({ theme }) => theme.typography.body2};
`;

export default Media3D;
