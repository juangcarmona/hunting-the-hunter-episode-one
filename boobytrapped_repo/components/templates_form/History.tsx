import { Title } from "@/app/templates/common";
import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import { Input } from "@/components/common/FormInputs/Input";
import { Select } from "@/components/common/FormInputs/Select";
import { Textarea } from "@/components/common/FormInputs/TextArea/TextArea";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import { theme } from "@/styles/theme";
import { useEffect, useMemo, useState } from "react";
import { Control, UseFormRegister, useFieldArray } from "react-hook-form";
import { FaRegTrashAlt } from "react-icons/fa";
import useSWR from "swr";
import Box from "../common/Box";
interface HistoryProps {
    setStep: (step: number) => void;
    control: Control;
    isValid: boolean;
    subFormOpened: boolean;
    register: UseFormRegister<any>;
}

export const ClearDataForValuesStep = (control: any) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "values",
    });

    useEffect(() => {
        if (fields.length > 0) {
            const itemsToRemove = fields.filter(
                (item: any) => item.name === undefined,
            );
            itemsToRemove.forEach((item) => {
                const indexToRemove = fields.findIndex(
                    (field) => field === item,
                );
                remove(indexToRemove);
            });
        }
    }, []);
};

const History: React.FC<HistoryProps> = ({
    setStep,
    control,
    isValid,
    register,
    subFormOpened,
}) => {
    ClearDataForValuesStep(control);
    const [isHistoryRequired, setIsHistoryRequired] = useState(subFormOpened);

    const { data } = useSWR("/templates/histories-types");

    const historyTypesOptions = useMemo(
        () =>
            data?.data?.json?.map((types: Record<string, string>) => ({
                label: types.name,
                value: types.name,
            })),
        [data],
    );
    const emptyHistoryElement = {
        name: "",
        companyName: "",
        date: "",
        city: "",
        country: "",
    };

    const { fields, append, remove } = useFieldArray({
        control,
        name: "history",
    });

    useEffect(() => {
        if (isHistoryRequired && !subFormOpened) append(emptyHistoryElement);
    }, [isHistoryRequired]);

    return (
        <Flex flexDirection="column">
            {!isHistoryRequired && (
                <>
                    <Spacer y size={4} />
                    <Title>Do you want to add Product History?</Title>
                    <Spacer y size={4} />
                    <Flex justifyContent="center" rowGap={5}>
                        <Button outline fullWidth onClick={() => setStep(5)}>
                            Skip
                        </Button>
                        <Button
                            outline
                            fullWidth
                            onClick={() => setIsHistoryRequired(true)}
                        >
                            Yes
                        </Button>
                    </Flex>
                    <Spacer y size={4} />
                    <Text variant="body2" color={theme.colors.grayLight400}>
                        Provide a detailed product history, including important
                        information about the manufacturing process, supply
                        chain, and key events.
                    </Text>
                    <Spacer y size={4} />
                    <Text variant="body2" color={theme.colors.grayLight400}>
                        Select &quot;Yes&quot; to continue or &quot;Skip&quot;
                        to proceed without adding a product history.
                    </Text>
                </>
            )}
            {isHistoryRequired && (
                <>
                    <Text mb={3}>
                        Input provenance and logistics details for a
                        comprehensive view of your product&apos;s journey
                    </Text>

                    {fields.map((history, index) => (
                        <Flex
                            key={history.id}
                            mb={3}
                            flexDirection="column"
                            columnGap={2}
                            borderRadius={10}
                            border={`1px solid ${theme.colors.muted}`}
                            p={2}
                            boxShadow="0px 5.921px 5.921px 0px rgba(0, 0, 0, 0.25)"
                            position="relative"
                        >
                            <Box
                                position="absolute"
                                top="7px"
                                right={10}
                                style={{ cursor: "pointer" }}
                            >
                                <FaRegTrashAlt
                                    size={20}
                                    onClick={() => remove(index)}
                                />
                            </Box>

                            <Select
                                label="Name"
                                inputProps={{
                                    name: `history.${index}.name`,
                                    options: historyTypesOptions,
                                }}
                                control={control}
                            />
                            <Flex alignItems="center" rowGap={2}>
                                <Input
                                    inputProps={{
                                        value: "Company Name",
                                        disabled: true,
                                        style: {
                                            color: `${theme.colors.text}`,
                                            backgroundColor: `${theme.colors.muted}`,
                                        },
                                    }}
                                />
                                <Text>: </Text>
                                <Input
                                    inputProps={{
                                        name: `history.${index}.companyName`,
                                        placeholder: "Enter name...",
                                    }}
                                    register={register}
                                />
                            </Flex>

                            <Flex alignItems="center" rowGap={2}>
                                <Input
                                    inputProps={{
                                        value: "Location",
                                        disabled: true,
                                        style: {
                                            color: `${theme.colors.text}`,
                                            backgroundColor: `${theme.colors.muted}`,
                                        },
                                    }}
                                />
                                <Text>: </Text>
                                <Input
                                    inputProps={{
                                        name: `history.${index}.city`,
                                        placeholder: "Enter location...",
                                    }}
                                    register={register}
                                />
                            </Flex>
                            <Flex alignItems="center" rowGap={2}>
                                <Input
                                    inputProps={{
                                        value: "Date",
                                        disabled: true,
                                        style: {
                                            color: `${theme.colors.text}`,
                                            backgroundColor: `${theme.colors.muted}`,
                                        },
                                    }}
                                />
                                <Text>: </Text>

                                <Input
                                    inputProps={{
                                        name: `history.${index}.date`,
                                        type: "text",
                                        placeholder: "Pick up a date",
                                        onFocus: (e) => {
                                            e.target.type = "date";
                                            e.target.showPicker();
                                        },
                                        onBlur: (e) => {
                                            e.target.type = "text";
                                        },
                                    }}
                                    register={register}
                                />
                            </Flex>
                            <Textarea
                                inputProps={{
                                    name: `history.${index}.description`,
                                    placeholder:
                                        "Enter description... (optional)",
                                }}
                                register={register}
                            />
                            {/* images not present for the time being commenting out for now */}
                            {/* <Controller
                                name={`history.${index}.file`}
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <UploadFile
                                        maxSize={
                                            SINGLE_UPLOAD_MAX_FILE_SIZE_BYTES
                                        }
                                        accept={SUPPORTED_IMAGE_MIME_TYPES}
                                        onChange={(f) => {
                                            onChange(f);
                                        }}
                                    />
                                )}
                            /> */}
                        </Flex>
                    ))}

                    <Button gray onClick={() => append(emptyHistoryElement)}>
                        + Add Journey
                    </Button>

                    <Flex justifyContent={"space-between"} mt={3}>
                        <Button outline fullWidth onClick={() => setStep(3)}>
                            Previous
                        </Button>

                        <Spacer size={2} />

                        <Button
                            outline
                            fullWidth
                            disabled={!isValid}
                            onClick={() => setStep(5)}
                        >
                            Next
                        </Button>
                    </Flex>
                </>
            )}
        </Flex>
    );
};

export default History;
