import Flex from "@/components/common/Flex";
import Modal, { ModalProps } from "@/components/common/Modal";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import Button from "../common/Button";

export interface ShowCampaignModalProps {
    campaign: any;
}

const getTitleColor = (campaignType: string) => {
    switch (campaignType) {
        case "LOST":
            return "#ffc700";
        case "STOLE":
            return "#FF0000";
        case "MESSAGE":
            return "#EB00FF";
        default:
            return "#000000";
    }
};

const ShowCampaignModal: React.FC<ShowCampaignModalProps & ModalProps> = ({
    isOpen,
    setIsOpen,
    campaign,
}) => {
    if (!campaign) return null;

    return (
        <Modal
            {...{
                isOpen,
                setIsOpen,
            }}
        >
            <Container>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    {["LOST", "STOLE"].includes(campaign.campaignType) ? (
                        <>
                            <Image
                                src={
                                    campaign.campaignType === "LOST"
                                        ? "/images/campaigns/lost.svg"
                                        : "/images/campaigns/stole.svg"
                                }
                                width={30}
                                height={30}
                                alt={""}
                            />

                            <Text
                                fontWeight={700}
                                fontSize={20}
                                display={"inline"}
                                color={getTitleColor(campaign.campaignType)}
                            >
                                {campaign.campaignType === "LOST"
                                    ? "Lost"
                                    : "Stolen"}
                            </Text>
                        </>
                    ) : campaign.campaignData.icon ? (
                        <Image
                            src={`/images/campaigns/icons/${campaign.campaignData.icon}.svg`}
                            width={36}
                            height={36}
                            alt={campaign.campaignData.campaignIcon}
                        />
                    ) : null}
                </Flex>
                {!["LOST", "STOLE"].includes(campaign.campaignType) && (
                    <Image
                        src="/images/close.svg"
                        width={40}
                        height={40}
                        alt={""}
                        style={{
                            position: "absolute",
                            right: 20,
                            top: 15,
                            cursor: "pointer",
                            borderRadius: "50%",
                            border: "1px solid #e6e6e6",
                            padding: 10,
                        }}
                        onClick={() => setIsOpen(false)}
                    />
                )}

                {campaign.campaignData.messageTitle ? (
                    <>
                        <Spacer y size={3} />

                        <Text
                            fontWeight={700}
                            fontSize={20}
                            style={{ textAlign: "center" }}
                        >
                            {campaign.campaignData.messageTitle}
                        </Text>
                    </>
                ) : null}

                <Spacer y size={2} />

                <div style={{ textAlign: "center" }}>
                    <Text>
                        {campaign.campaignData.messageDescription ??
                            campaign.campaignData?.campaignDescription}
                    </Text>
                </div>

                <Spacer y size={3} />

                {campaign.campaignData?.contact ? (
                    campaign.campaignData.contactType == "phone" ? (
                        <Flex
                            justifyContent={"center"}
                            rowGap={3}
                            alignItems={"center"}
                        >
                            <Image
                                alt="phone"
                                src={"/images/socials/phone.svg"}
                                width={30}
                                height={30}
                            />

                            <Link href={`tel:${campaign.campaignData.contact}`}>
                                {campaign.campaignData.contact}
                            </Link>
                        </Flex>
                    ) : (
                        <>
                            <Flex
                                justifyContent={"center"}
                                rowGap={3}
                                alignItems={"center"}
                            >
                                <Image
                                    alt="email"
                                    src={"/images/socials/email.svg"}
                                    width={30}
                                    height={30}
                                />

                                <Link
                                    href={`mailto:${campaign.campaignData.contact}`}
                                >
                                    {campaign.campaignData.contact}
                                </Link>
                            </Flex>
                            {campaign.campaignData.contact1 && (
                                <Flex
                                    justifyContent={"center"}
                                    rowGap={3}
                                    alignItems={"center"}
                                >
                                    <Image
                                        alt="phone"
                                        src={"/images/socials/phone.svg"}
                                        width={30}
                                        height={30}
                                    />

                                    <Link
                                        href={`tel:${campaign.campaignData.contact1}`}
                                    >
                                        {campaign.campaignData.contact1}
                                    </Link>
                                </Flex>
                            )}
                        </>
                    )
                ) : null}

                {campaign.campaignData?.link ? (
                    <Flex justifyContent={"center"}>
                        <Button
                            onClick={() => {
                                window.location.href =
                                    campaign.campaignData.link;
                            }}
                        >
                            {campaign.campaignData?.linkCtaText ||
                                "Find out more"}
                        </Button>
                    </Flex>
                ) : null}
            </Container>
        </Modal>
    );
};

const Container = styled.div`
    width: 100%;
    padding: 20px;
`;

export default ShowCampaignModal;
