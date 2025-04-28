import { Title } from "@/app/templates/common";
import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import { Input } from "@/components/common/FormInputs/Input";
import Spacer from "@/components/common/Spacer";
import UploadFile from "@/components/common/UploadFile";
import {
    SINGLE_UPLOAD_MAX_FILE_SIZE_BYTES,
    SUPPORTED_IMAGE_MIME_TYPES,
} from "@/constants/uploadInfo";
import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

import { theme } from "@/styles/theme";
import {
    Control,
    Controller,
    FieldValues,
    UseFormRegister,
    UseFormSetValue,
} from "react-hook-form";
import Box from "../common/Box";
import { Textarea } from "../common/FormInputs/TextArea/TextArea";
import { Tooltip } from "../common/Tooltip";
import ExtraMedia from "./ExtraMedia";
import Media3D from "./Media3D";

interface DetailsProps<T extends object = any> {
    control: Control<T>;
    register: UseFormRegister<T>;
    isValid: boolean;
    setStep: (step: number) => void;
    values: FieldValues;
    setValue: UseFormSetValue<FieldValues>;
}

const Details: React.FC<DetailsProps> = ({
    control,
    register,
    isValid,
    setStep,
    values,
    setValue,
}) => {
    return (
        <>
            <Title>Details</Title>
            <Spacer y size={2} />
            <Flex rowGap={2}>
                <Input
                    inputProps={{
                        name: "title",
                        placeholder: "Enter Title",
                    }}
                    register={register}
                />
                <Tooltip content="Our system will automatically generate a distinct product number for each NFT created, ensuring that no tokens share the same number. For example, 'Shoe #1,' 'Shoe #2,' and so forth.">
                    <Box margin="auto">
                        <AiOutlineInfoCircle
                            color={theme.colors.accent}
                            size={25}
                        />
                    </Box>
                </Tooltip>
            </Flex>
            <Spacer y size={4} />
            <Controller
                name={"file"}
                control={control}
                render={({ field: { onChange } }) => (
                    <UploadFile
                        maxSize={SINGLE_UPLOAD_MAX_FILE_SIZE_BYTES}
                        accept={SUPPORTED_IMAGE_MIME_TYPES}
                        onChange={(f) => {
                            onChange(f);
                        }}
                        values={values}
                        setValue={setValue}
                        origin="Details"
                    />
                )}
            />
            <Spacer y size={4} />
            <Media3D
                control={control}
                setValue={setValue}
                values={values}
                subFormOpened={false}
            />
            <Spacer y size={4} />
            <ExtraMedia
                control={control}
                setStep={setStep}
                isValid={isValid || values.extraMedia}
                setValue={setValue}
                values={values}
                subFormOpened={values.extraMedia}
            />
            <Spacer y size={3} />

            <Textarea
                inputProps={{
                    name: "description",
                    placeholder: "Enter description... (optional)",
                }}
                register={register}
            />
            <Spacer y size={3} />
            <Flex justifyContent={"space-between"}>
                <Button outline fullWidth onClick={() => setStep(0)}>
                    Previous
                </Button>

                <Spacer size={2} />

                <Button
                    outline
                    fullWidth
                    disabled={!isValid}
                    onClick={() => setStep(2)}
                >
                    Next
                </Button>
            </Flex>
        </>
    );
};

export default Details;
