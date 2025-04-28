import { SocialSettingsData } from "@/services/UsersService.ts";
import Image from "next/image";
import styled from "styled-components";
import Divider from "../common/Divider";
import Flex from "../common/Flex";
import Spacer from "../common/Spacer";
import Text from "../common/Text";

interface GetInTouchProps {
    socials: SocialSettingsData;
    mobilePreview?: boolean;
}

const GetInTouch: React.FC<GetInTouchProps> = ({ socials, mobilePreview }) => {
    return (
        <Container mobilePreview={mobilePreview}>
            <Divider />

            <Spacer y size={4} />

            <Flex alignItems={"center"}>
                <Image
                    src="/images/socials/get-in-touch.svg"
                    width={24}
                    height={24}
                    alt={"get in touch"}
                />
                <Spacer size={2} />

                <Text
                    fontSize={{ _: 12, m: mobilePreview ? 16 : 28 }}
                    lineHeight={mobilePreview ? 1 : 1.2}
                    fontWeight={600}
                >
                    {socials.getInTouchMessage ?? "Get In Touch"}
                </Text>
            </Flex>

            <Spacer y size={3} />

            <Flex maxWidth={"100vw"} rowGap={mobilePreview ? 24 : 32}>
                {!!socials.facebook && (
                    <a href={socials.facebook} target="_blank">
                        <Image
                            src={"/images/socials/facebook-black.png"}
                            alt={"facebook"}
                            width={24}
                            height={24}
                        />
                    </a>
                )}

                {!!socials.x && (
                    <a href={socials.x} target="_blank">
                        <Image
                            src={"/images/socials/x-black.png"}
                            alt={"twitter"}
                            width={24}
                            height={24}
                        />
                    </a>
                )}

                {!!socials.instagram && (
                    <a href={socials.instagram} target="_blank">
                        <Image
                            src={"/images/socials/instagram-black.png"}
                            alt={"instagram"}
                            width={24}
                            height={24}
                        />
                    </a>
                )}

                {!!socials.linkedin && (
                    <a href={socials.linkedin} target="_blank">
                        <Image
                            src={"/images/socials/linkedin-black.png"}
                            alt={"linkedin"}
                            width={24}
                            height={24}
                        />
                    </a>
                )}

                {!!socials.website && (
                    <a href={socials.website} target="_blank">
                        <Image
                            src={"/images/socials/website.svg"}
                            alt={"website"}
                            width={24}
                            height={24}
                        />
                    </a>
                )}

                {!!socials.email && (
                    <a href={`mailto:${socials.email}`} target="_blank">
                        <Image
                            src={"/images/socials/email.svg"}
                            alt={"email"}
                            width={24}
                            height={24}
                        />
                    </a>
                )}
            </Flex>
        </Container>
    );
};

const Container = styled.div<{ mobilePreview?: boolean }>`
    ${({ mobilePreview }) => (mobilePreview ? "margin: 0 24px;" : "margin: 0;")}
`;

export default GetInTouch;
