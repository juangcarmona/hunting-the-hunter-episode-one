import HistoryLogo from "@/assets/history.png";
import { logoState } from "@/state/logo";
import { socialsState } from "@/state/socials";
import Image from "next/image";
import { AiOutlineTag } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import CertifiedProduct from "../chip/CertifiedProduct";
import GetInTouch from "../chip/GetInTouch";
import Button from "../common/Button";
import Divider from "../common/Divider";
import Flex from "../common/Flex";
import Spacer from "../common/Spacer";
import Text from "../common/Text";
import { UserProps } from "./ProfileContent";

interface PreviewContainerProps {
    userData: UserProps;
}

const PreviewContainer: React.FC<PreviewContainerProps> = ({ userData }) => {
    const customLogo = useRecoilValue(logoState);
    const socials = useRecoilValue(socialsState);

    return (
        <div style={{ margin: "0 32px", flex: 1 }}>
            <IphoneFrame>
                <IphoneContainer>
                    <LogoContainer>
                        <Spacer y size={2} />
                        <ImageContainer>
                            <Image
                                src={
                                    customLogo
                                        ? `${customLogo}?t=${new Date().getTime()}`
                                        : "/images/logo.png"
                                }
                                alt="wov-logo"
                                fill
                                objectFit={"contain"}
                            />
                        </ImageContainer>
                        <Spacer y size={2} />
                    </LogoContainer>

                    <Spacer y size={7} />

                    <div style={{ padding: 20 }}>
                        <CertifiedProduct
                            verificationLabel={
                                socials?.verificationLabel || undefined
                            }
                        />

                        {!socials?.verificationLabel ? (
                            <Spacer y size={68} />
                        ) : null}
                    </div>

                    <InfoContainer>
                        <Text fontWeight={600}>Your product</Text>

                        <Spacer y size={5} />

                        <Divider />

                        <Spacer y size={2} />

                        <Flex
                            flexDirection={"row"}
                            rowGap={2}
                            alignItems={"center"}
                        >
                            <Image
                                src={"/images/blockchain_2.svg"}
                                alt={"WOV logo"}
                                width={24}
                                height={24}
                            />
                            <Text fontSize={{ _: 12, m: 16 }} fontWeight={600}>
                                Details
                            </Text>
                        </Flex>

                        <Spacer y size={2} />

                        <Divider />

                        <Spacer y size={2} />

                        <Flex rowGap={2} alignItems="center">
                            <div style={{ width: 24, textAlign: "center" }}>
                                <Image
                                    alt="Logo"
                                    src={HistoryLogo}
                                    width={14}
                                    height={24}
                                />
                            </div>
                            <Text fontSize={{ _: 12, m: 16 }} fontWeight={600}>
                                History
                            </Text>
                        </Flex>

                        <Spacer y size={2} />

                        <Divider />

                        <Spacer y size={2} />

                        <Flex rowGap={2} alignItems="center">
                            <AiOutlineTag size={24} />

                            <Text fontSize={{ _: 12, m: 16 }} fontWeight={600}>
                                Values
                            </Text>
                        </Flex>

                        <Spacer y size={2} />
                    </InfoContainer>

                    {socials ? (
                        <GetInTouch socials={socials} mobilePreview />
                    ) : null}

                    <Spacer y size={30} />

                    <div style={{ padding: 8 }}>
                        <Button style={{ width: "100%", fontSize: 12 }}>
                            {socials?.claimLabel || "Claim Ownership"}
                        </Button>
                    </div>
                </IphoneContainer>
            </IphoneFrame>
        </div>
    );
};

const IphoneContainer = styled.div`
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 40px;
    overflow: hidden;
    position: relative;
`;

const LogoContainer = styled.div`
    border-bottom: 1px solid #e5e5e5;
`;

const ImageContainer = styled.div`
    position: relative;
    width: 50%;
    text-align: center;
    height: 50px;
    margin: 0 auto;
`;
const IphoneFrame = styled.div`
    margin: 50px auto 0;
    height: 703px;
    width: 341px;
    background-image: url("/images/iphone-frame.png");
    background-size: cover;
    overflow: hidden;
    padding: 12px 12px;
`;

const InfoContainer = styled.div`
    padding: 0 20px;
`;

export default PreviewContainer;
