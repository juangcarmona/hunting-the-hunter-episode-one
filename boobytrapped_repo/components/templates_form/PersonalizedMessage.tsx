import { Title } from "@/app/templates/common";
import { useEffect, useState } from "react";
import {
    Control,
    FieldValues,
    UseFormRegister,
    UseFormSetValue,
} from "react-hook-form";
import { CSSProperties } from "styled-components";
import personalised1 from "../../assets/personalised1.svg";
import personalised10 from "../../assets/personalised10.svg";
import personalised2 from "../../assets/personalised2.svg";
import personalised3 from "../../assets/personalised3.svg";
import personalised4 from "../../assets/personalised4.svg";
import personalised5 from "../../assets/personalised5.svg";
import personalised6 from "../../assets/personalised6.svg";
import personalised7 from "../../assets/personalised7.svg";
import personalised8 from "../../assets/personalised8.svg";
import personalised9 from "../../assets/personalised9.svg";

import { theme } from "@/styles/theme";
import { FaRegTrashAlt } from "react-icons/fa";
import Box from "../common/Box";
import Button from "../common/Button";
import Flex from "../common/Flex";
import { Input } from "../common/FormInputs/Input";
import { Textarea } from "../common/FormInputs/TextArea/TextArea";
import Spacer from "../common/Spacer";
import Text from "../common/Text";

export const personalizedImgs = [
    personalised1,
    personalised2,
    personalised3,
    personalised4,
    personalised5,
    personalised6,
    personalised7,
    personalised8,
    personalised9,
    personalised10,
];

interface PersonalizedMessageProps {
    setStep: (step: number) => void;
    isValid: boolean;
    subFormOpened: boolean;
    control: Control;
    setValue: UseFormSetValue<any>;
    register: UseFormRegister<any>;
    values: FieldValues;
}

const PersonalizedMessage: React.FC<PersonalizedMessageProps> = ({
    setStep,
    isValid,
    setValue,
    register,
    values,
}) => {
    const [isValuesRequired, setIsValuesRequired] = useState(
        values.personalizedMessage &&
            !!Object.keys(values.personalizedMessage).length,
    );

    const [selectedIcon, setSelectedIcon] = useState(
        values.personalizedMessage?.icon || 0,
    );

    useEffect(() => {
        if (!values.personalizedMessage?.icon)
            setValue("personalizedMessage.icon", 0);
    }, [setValue]);

    return (
        <Box>
            {!isValuesRequired && (
                <>
                    <Spacer y size={4} />
                    <Title>Do you want to add a Personalised Message?</Title>
                    <Spacer y size={4} />
                    <Flex justifyContent="center" rowGap={5}>
                        <Button
                            outline
                            fullWidth
                            onClick={() => {
                                setValue("personalizedMessage", undefined);
                                setStep(3);
                            }}
                        >
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
                        Directly engage with your customers by sharing special
                        messages, customised promotions, inviting them to claim
                        ownership, and more.
                    </Text>
                    <Spacer y size={4} />
                    <Text variant="body2" color={theme.colors.grayLight400}>
                        Select &quot;yes&quot; to add a personalized message, or
                        &quot;skip&quot; to proceed without adding any
                        additional information.
                    </Text>
                </>
            )}
            {isValuesRequired && (
                <Flex
                    mb={3}
                    flexDirection="column"
                    columnGap={2}
                    p={2}
                    position="relative"
                >
                    <Box
                        position="absolute"
                        top="0rem"
                        right={10}
                        style={{ cursor: "pointer" }}
                    >
                        <FaRegTrashAlt
                            size={20}
                            onClick={() => {
                                setValue("personalizedMessage", undefined);
                                setIsValuesRequired(false);
                            }}
                        />
                    </Box>
                    <Spacer y size={2} />
                    <Box>
                        <Text mb={3}>
                            Add a personalised message to the product to attract
                            your customers.
                        </Text>

                        <Spacer y size={2} />
                        <Flex>
                            <Input
                                inputProps={{
                                    name: `personalizedMessage.title`,
                                    placeholder: "Enter Title e.g. Benefits",
                                }}
                                register={register}
                            />
                        </Flex>
                        <Spacer y size={4} />
                        <Text mb={3}>
                            Select an icon for personalised message:
                        </Text>

                        <Box mr={3}>
                            <div style={styles.iconContainer}>
                                {personalizedImgs.map((imagePath, index) => {
                                    const isSelected = index === selectedIcon;
                                    return (
                                        <div
                                            style={{
                                                ...styles.iconBox,
                                                border: `3px solid ${
                                                    isSelected
                                                        ? theme.colors.primary
                                                        : theme.colors.muted
                                                }`,
                                                borderRadius: "8px",
                                                display: "flex",
                                                justifyContent: "center",
                                                padding: ".5rem",
                                                width: "4rem",
                                                height: "4rem",
                                            }}
                                            key={index}
                                            onClick={() => {
                                                setSelectedIcon(index);
                                                setValue(
                                                    "personalizedMessage.icon",
                                                    index,
                                                );
                                            }}
                                        >
                                            <img
                                                src={imagePath.src}
                                                alt={`Icon ${index + 1}`}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </Box>

                        <Spacer size={2} />

                        <Textarea
                            inputProps={{
                                name: `personalizedMessage.description`,
                                placeholder:
                                    "Enter Description e.g. Discover all the benefits when claiming the ownership of your sneakers.",
                            }}
                            register={register}
                        />

                        <Spacer size={2} />

                        <Flex>
                            <Input
                                inputProps={{
                                    name: `personalizedMessage.websiteLink`,
                                    placeholder:
                                        "Enter a website link (optional)",
                                }}
                                register={register}
                            />
                        </Flex>

                        <Flex justifyContent={"space-between"} mt={3}>
                            <Button
                                outline
                                fullWidth
                                onClick={() => setStep(1)}
                            >
                                Previous
                            </Button>

                            <Spacer size={2} />

                            <Button
                                outline
                                fullWidth
                                disabled={!isValid}
                                onClick={() => setStep(3)}
                            >
                                Next
                            </Button>
                        </Flex>
                    </Box>
                </Flex>
            )}
        </Box>
    );
};

const styles: { [key: string]: CSSProperties } = {
    iconContainer: {
        // display: "grid",
        // gridTemplateColumns: "auto auto auto auto auto",
        // gridGap: "20px",

        display: "grid",
        justifyContent: "space-between",
        gridTemplateColumns: "50px 50px 50px 50px 50px",
        gap: "10px",
    },
    iconBox: {
        transition: "border-color 0.3s ease",
        cursor: "pointer",
    },
};
export default PersonalizedMessage;
