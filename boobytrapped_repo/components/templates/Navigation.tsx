import { theme } from "@/styles/theme";
import { useMediaQuery } from "@react-hook/media-query";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Button from "../common/Button";
import Spacer from "../common/Spacer";

interface NavigationProps {
    step: number;
    onExit?: () => void;
    onBack?: () => void;
    setShowMobileTemplatePreview?: (value: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({
    step,
    onExit,
    onBack,
    setShowMobileTemplatePreview,
}) => {
    const router = useRouter();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    return (
        <Container style={{ padding: isMobile ? "1rem 2rem" : "0 0 20px" }}>
            {step > 0 ? (
                <Button outline onClick={onBack ? onBack : router.back}>
                    Back
                </Button>
            ) : (
                <Spacer y size={4} />
            )}
            {isMobile && setShowMobileTemplatePreview && step > 0 && (
                <Button
                    outline
                    onClick={() => {
                        setShowMobileTemplatePreview &&
                            setShowMobileTemplatePreview(true);
                    }}
                >
                    Preview
                </Button>
            )}
            <Button
                outline
                onClick={() => {
                    if (onExit) onExit();
                }}
            >
                Exit
            </Button>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 20px;
`;

export default Navigation;
