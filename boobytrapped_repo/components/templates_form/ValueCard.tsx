import {
    SINGLE_UPLOAD_MAX_FILE_SIZE_BYTES,
    SUPPORTED_VALUE_MIME_TYPES,
} from "@/constants/uploadInfo";
import { theme } from "@/styles/theme";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    Control,
    Controller,
    UseFieldArrayRemove,
    UseFormSetValue,
} from "react-hook-form";
import { FaCheckCircle, FaRegTrashAlt } from "react-icons/fa";
import Box from "../common/Box";
import Flex from "../common/Flex";
import { Input } from "../common/FormInputs/Input";
import UploadValueMedia from "./UploadValueMedia";

interface ValueCardProps {
    index: number;
    control: Control;
    remove: UseFieldArrayRemove;
    value: any;
    setValue: UseFormSetValue<any>;
    fields: string[];
    setFields: Dispatch<SetStateAction<string[]>>;
    subformOpened: boolean;
    values: any;
}

const ValueCard: React.FC<ValueCardProps> = ({
    index,
    control,
    remove,
    value,
    setValue,
    fields,
    setFields,
    subformOpened,
    values,
}) => {
    const [isSelected, setIsSelected] = useState(
        !!value?.length && !subformOpened ? false : true,
    );

    const [tempValue, setTempValue] = useState(
        typeof value === "object" ? value.name : value,
    );
    useEffect(() => {
        if (isSelected) setValue(`values.${index}.name`, tempValue);
        else setValue(`values.${index}.name`, undefined);
    }, [tempValue, isSelected]);

    useEffect(() => {
        setTempValue(typeof value === "object" ? value.name : value);
    }, [fields]);

    return (
        <Box
            border={`2px solid ${theme.colors.muted}`}
            borderRadius={3}
            p={2}
            mb={4}
            backgroundColor={isSelected ? "inherit" : theme.colors.muted}
        >
            <Flex mb={isSelected ? 3 : 0} rowGap={2} alignItems="center">
                <Flex
                    height={42}
                    borderRadius={200}
                    backgroundColor={theme.colors.white}
                    width={isSelected ? 42 : 50}
                    border={`3px solid ${theme.colors.accent}`}
                    onClick={() => setIsSelected(!isSelected)}
                    alignItems="center"
                >
                    {isSelected && <FaCheckCircle color="green" size={50} />}
                </Flex>
                {isSelected ? (
                    <Input
                        inputProps={{
                            name: `values.${index}.name`,
                            value: tempValue,
                            placeholder: "Enter value...",
                            onChange: (e) => {
                                setValue(
                                    `values.${index}.name`,
                                    e.target.value,
                                );
                                setTempValue(e.target.value);
                            },
                        }}
                        backgroundColor={isSelected ? "inherit" : "#cfd0d3"}
                    />
                ) : (
                    <Input
                        inputProps={{
                            value:
                                typeof value === "object" ? value.name : value,
                            disabled: true,
                        }}
                        backgroundColor={isSelected ? "inherit" : "#cfd0d3"}
                    />
                )}
                <Box style={{ cursor: "pointer" }}>
                    <FaRegTrashAlt
                        size={30}
                        color={`${theme.colors.accent}`}
                        onClick={() => {
                            setTempValue(value);
                            remove(index);
                            setFields(
                                values.values.filter(
                                    (field: any, idx: number) => index !== idx,
                                ),
                            );
                        }}
                    />
                </Box>
            </Flex>
            {isSelected && (
                <Controller
                    name={`values.${index}.file`}
                    control={control}
                    render={({ field: { onChange } }) => (
                        <UploadValueMedia
                            values={values}
                            index={index}
                            value={value}
                            maxSize={SINGLE_UPLOAD_MAX_FILE_SIZE_BYTES}
                            accept={SUPPORTED_VALUE_MIME_TYPES}
                            onChange={(f) => {
                                onChange(f);
                            }}
                        />
                    )}
                />
            )}
        </Box>
    );
};

export default ValueCard;
