import { Title } from "@/app/templates/common";
import { theme } from "@/styles/theme";
import { useMemo, useState } from "react";
import {
    Control,
    FieldValues,
    UseFormSetValue,
    useFieldArray,
} from "react-hook-form";
import useSWR from "swr";
import Box from "../common/Box";
import Button from "../common/Button";
import Flex from "../common/Flex";
import { Select } from "../common/FormInputs/Select";
import Spacer from "../common/Spacer";
import Text from "../common/Text";
import ValueCard from "./ValueCard";

interface ValuesProps {
    setStep: (step: number) => void;
    isValid: boolean;
    subFormOpened: boolean;
    control: Control;
    setValue: UseFormSetValue<any>;
    values: FieldValues;
}

const Values: React.FC<ValuesProps> = ({
    setStep,
    isValid,
    control,
    setValue,
    values,
    subFormOpened,
}) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "values",
    });

    const [isValuesRequired, setIsValuesRequired] = useState(
        subFormOpened || fields.length > 0,
    );

    const [fieldss, setFields] = useState<any[]>(fields ? fields : []);
    const { data } = useSWR("/templates/standard-values");

    const valuesOptions = useMemo(
        () =>
            data?.data?.json?.map((option: Record<string, any>) => ({
                label: option.name,
                value: option.values.map(
                    (value: Record<string, string>) => value.name,
                ),
            })),
        [data],
    );

    return (
        <Box>
            {!isValuesRequired && (
                <>
                    <Spacer y size={4} />
                    <Title>Do you want to add Product Values?</Title>
                    <Spacer y size={4} />
                    <Flex justifyContent="center" rowGap={5}>
                        <Button outline fullWidth onClick={() => setStep(6)}>
                            Skip
                        </Button>
                        <Button
                            outline
                            fullWidth
                            onClick={() => setIsValuesRequired(true)}
                        >
                            Yes
                        </Button>
                    </Flex>
                    <Spacer y size={4} />
                    <Text variant="body2" color={theme.colors.grayLight400}>
                        Complete your passport with certificates, sustainability
                        credentials, and other evidence validating specific
                        standards and values. Utilize pre-existing templates or
                        upload files as necessary.
                    </Text>
                    <Spacer y size={4} />
                    <Text variant="body2" color={theme.colors.grayLight400}>
                        Select &quot;Yes&quot; to continue or &quot;Skip&quot;
                        to proceed without adding product values.
                    </Text>
                </>
            )}
            {isValuesRequired && (
                <Box>
                    <Text mb={3}>
                        Fill out the digital passport by selecting a template
                        category and entering the product details.
                    </Text>
                    <Select
                        label="Templates"
                        inputProps={{
                            name: "productData",
                            options: valuesOptions,
                            onChange: (option) => {
                                remove();
                                setFields(option.value);
                            },
                            placeholder: "Select Values template",
                        }}
                    />
                    <Spacer y size={4} />
                    {fieldss.map((value: any, index) => {
                        if (
                            typeof value !== "string" &&
                            value.name === undefined
                        ) {
                            return;
                        }
                        return (
                            <ValueCard
                                key={index}
                                value={value}
                                values={values}
                                control={control}
                                index={index}
                                remove={remove}
                                fields={fieldss}
                                setFields={setFields}
                                setValue={setValue}
                                subformOpened={
                                    subFormOpened || typeof value !== "string"
                                }
                            />
                        );
                    })}

                    <Button
                        gray
                        fullWidth
                        onClick={() => {
                            setFields([
                                ...values.values,
                                { file: undefined, name: "" },
                            ]);
                        }}
                    >
                        + Add Product Value
                    </Button>

                    <Flex justifyContent={"space-between"} mt={3}>
                        <Button outline fullWidth onClick={() => setStep(4)}>
                            Previous
                        </Button>

                        <Spacer size={2} />

                        <Button
                            outline
                            fullWidth
                            disabled={!isValid}
                            onClick={() => setStep(6)}
                        >
                            Next
                        </Button>
                    </Flex>
                </Box>
            )}
        </Box>
    );
};

export default Values;
