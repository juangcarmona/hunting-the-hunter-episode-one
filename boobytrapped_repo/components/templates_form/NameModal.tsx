import { Title } from "@/app/templates/common";
import { theme } from "@/styles/theme";
import { useMediaQuery } from "@react-hook/media-query";
import { UseFormRegister } from "react-hook-form";
import styled from "styled-components";
import Button from "../common/Button";
import Flex from "../common/Flex";
import { Input } from "../common/FormInputs/Input";
import Spacer from "../common/Spacer";
import Text from "../common/Text";

interface NameModalProps {
    setStep: (step: number) => void;
    isValid: boolean;
    register: UseFormRegister<any>;
}

const NameModal: React.FC<NameModalProps> = ({
    isValid,
    register,
    setStep,
}) => {
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    const onKeyDown = (event: any) => {
        if (event.key === "Enter" && isValid) {
            event.preventDefault();
            setStep(1);
        }
    };
    return (
        <Container style={{ width: isMobile ? "95%" : "100%" }}>
            <Title>Template</Title>

            <Spacer y size={3} />

            <Text>Enter a name for your new Item template.</Text>
            <Input
                inputProps={{
                    name: "name",
                    placeholder: "Template Name",
                    onKeyDown,
                }}
                register={register}
            />

            <Spacer y size={3} />

            <Flex justifyContent={"right"}>
                <Button
                    outline
                    style={{ minWidth: 150 }}
                    disabled={!isValid}
                    onClick={() => setStep(1)}
                >
                    Next
                </Button>
            </Flex>
        </Container>
    );
};

const Container = styled.div`
    background-color: white;
    font-family: "Poppins", sans-serif;
    width: 100%;
    max-width: 500px;
    height: 300px;

    // Centered horizontally and vertically
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;

    border-radius: 10px;
    border: 1px solid black;

    padding: 20px;
`;

export default NameModal;
