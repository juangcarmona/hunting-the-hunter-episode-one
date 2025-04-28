import { Title } from "@/app/templates/common";
import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import { Input } from "@/components/common/FormInputs/Input";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import { theme } from "@/styles/theme";
import { useMemo, useState } from "react";
import { Control, UseFormRegister, useFieldArray } from "react-hook-form";
import { FaRegTrashAlt } from "react-icons/fa";
import useSWR from "swr";
import Box from "../common/Box";
import { Select } from "../common/FormInputs/Select";

interface ProductDataProps {
    setStep: (step: number) => void;
    isValid: boolean;
    subFormOpened: boolean;
    control: Control;
    register: UseFormRegister<any>;
}

const ProductData: React.FC<ProductDataProps> = ({
    setStep,
    isValid,
    control,
    register,
    subFormOpened,
}) => {
    const emptyTrait = {
        trait_type: "",
        value: "",
    };

    const [placeholders, setPlaceholders] = useState<string[]>([]);
    const [isProductDataRequired, setIsProductDataRequired] =
        useState(subFormOpened);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "traits",
    });

    const { data } = useSWR("/templates/standard-provenance");

    const productDataOptions = useMemo(
        () =>
            data?.data?.json?.map((option: Record<string, string>) => ({
                label: option.name,
                value: JSON.parse(option.data),
            })),
        [data],
    );

    return (
        <Flex flexDirection="column">
            {!isProductDataRequired && (
                <>
                    <Spacer y size={4} />
                    <Title>Do you want to add Product Data?</Title>
                    <Spacer y size={4} />

                    <Flex justifyContent="center" rowGap={5}>
                        <Button outline fullWidth onClick={() => setStep(4)}>
                            Skip
                        </Button>
                        <Button
                            outline
                            fullWidth
                            onClick={() => setIsProductDataRequired(true)}
                        >
                            Yes
                        </Button>
                    </Flex>
                    <Spacer y size={4} />
                    <Text variant="body2" color={theme.colors.grayLight400}>
                        Enrich your digital passport with detailed information
                        like colors, materials, features, size, measurements,
                        and other characteristics. Choose from pre-existing
                        templates or add your custom fields to tailor the
                        information.
                    </Text>
                    <Spacer y size={4} />
                    <Text variant="body2" color={theme.colors.grayLight400}>
                        Select &quot;Yes&quot; to continue or &quot;Skip&quot;
                        to proceed without additional information.
                    </Text>
                </>
            )}
            {isProductDataRequired && (
                <>
                    <Text mb={3}>
                        Fill out the digital passport by selecting a template
                        category and entering the product details.
                    </Text>
                    <Select
                        label="Templates"
                        inputProps={{
                            name: "productData",
                            options: productDataOptions,
                            onChange: (option) => {
                                remove();
                                setPlaceholders([]);
                                const placeholders: string[] = [];
                                Object.keys(option.value).forEach((key) => {
                                    placeholders.push(option.value[key]);
                                    append({
                                        trait_type:
                                            key.charAt(0).toUpperCase() +
                                            key.slice(1),
                                        value: "",
                                    });
                                });
                                setPlaceholders(placeholders);
                            },
                            placeholder: "Select Template",
                        }}
                    />
                    <Spacer y size={4} />
                    {fields.map((trait, index) => (
                        <Flex
                            key={trait.id}
                            mb={3}
                            rowGap={2}
                            alignItems="center"
                        >
                            <Input
                                inputProps={{
                                    name: `traits.${index}.trait_type`,
                                    placeholder: "Enter trait type...",
                                }}
                                register={register}
                            />
                            <Text>: </Text>
                            <Input
                                inputProps={{
                                    name: `traits.${index}.value`,
                                    placeholder:
                                        placeholders[index] || "Enter value...",
                                }}
                                register={register}
                            />
                            <Box style={{ cursor: "pointer" }}>
                                <FaRegTrashAlt
                                    size={30}
                                    color={`${theme.colors.accent}`}
                                    onClick={() => remove(index)}
                                />
                            </Box>
                        </Flex>
                    ))}

                    <Button gray onClick={() => append(emptyTrait)}>
                        + Add Product Data
                    </Button>

                    <Flex justifyContent={"space-between"} mt={3}>
                        <Button outline fullWidth onClick={() => setStep(2)}>
                            Previous
                        </Button>

                        <Spacer size={2} />

                        <Button
                            outline
                            fullWidth
                            disabled={!isValid}
                            onClick={() => setStep(4)}
                        >
                            Next
                        </Button>
                    </Flex>
                </>
            )}
        </Flex>
    );
};

export default ProductData;
