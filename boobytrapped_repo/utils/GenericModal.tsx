import { Title } from "@/app/templates/common";
import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import Spacer from "@/components/common/Spacer";
import styled from "styled-components";

interface GenericModalProps {
    title?: string;
    body?: string;
    additionalProps?: any;
    onAnswer: (value: boolean) => void;
}

const GenericModal: React.FC<GenericModalProps> = ({
    title,
    body,
    additionalProps,
    onAnswer,
}) => {
    return (
        <Container>
            <Title style={{ paddingTop: "2rem", textAlign: "center" }}>
                {title}
            </Title>
            <Spacer y size={5} />
            {body}
            <Flex rowGap={4}>
                <Button fullWidth outline onClick={() => onAnswer(false)}>
                    No
                </Button>
                <Button
                    error={additionalProps?.isError ? true : false}
                    outline
                    fullWidth
                    onClick={() => {
                        onAnswer(true);
                    }}
                >
                    Yes
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
    z-index: 4;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    padding: 50px 20px;
    box-shadow: 0px 5.921px 5.921px 0px rgba(0, 0, 0, 0.25);
`;

export default GenericModal;
