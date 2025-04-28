import Box from "@/components/common/Box";
import Button from "@/components/common/Button";
import CircleButton from "@/components/common/CircleButton";
import Divider from "@/components/common/Divider";
import Flex from "@/components/common/Flex";
import { Select } from "@/components/common/FormInputs/Select";
import Modal, { ModalProps } from "@/components/common/Modal";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import { Tooltip } from "@/components/common/Tooltip";
import ChipService from "@/services/ChipService";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import styled from "styled-components";
import flagIcon from "../../../../../assets/flag.svg";
import informationIcon from "../../../../../assets/informationIcon.svg";

export interface ActionsChipModalProps {
    chipHashes: string[];
    chips: any;
    options: {
        label: string;
        value: string;
    }[];
    onSave: () => void;
    claimOptionEnabled: boolean;
}

const ActionsChipModal: React.FC<ActionsChipModalProps & ModalProps> = ({
    isOpen,
    setIsOpen,
    chipHashes,
    onSave,
    options,
    claimOptionEnabled,
    chips,
}) => {
    const [isClaimVisible, setIsClaimVisible] = React.useState(false);
    const [selectedCampaign, setSelectedCampaign] = React.useState<string>("");
    const [optionSelected, setOptionSelected] = React.useState(0);

    const claimableChips = chips?.filter(
        (chip: any) =>
            chipHashes.includes(chip.hash) &&
            (chip.claimStatus === "Visible" || chip.claimStatus === "Hidden"),
    );

    const usedChips = chips?.filter((chip: any) =>
        chipHashes.includes(chip.hash),
    );

    const campaignId = (
        usedChips?.find(
            (chip: any) =>
                chip.campaignId !== null && chip.campaignId !== undefined,
        ) || { campaignId: null }
    ).campaignId;

    useEffect(() => {
        if (isOpen === true) {
            setSelectedCampaign(campaignId || "");
        } else {
            setSelectedCampaign("");
        }
    }, [isOpen, campaignId]);

    const onSubmit = async (campaignId: string | null) => {
        switch (optionSelected) {
            case 0:
                if (claimableChips.length > 0) {
                    await ChipService.updateChipClaimStatus({
                        chipHashes: claimableChips.map(
                            (chip: { hash: string }) => chip.hash,
                        ),
                        claimStatus: isClaimVisible ? "Visible" : "Hidden",
                    })
                        .then(async (res) => {
                            if (res.ok) {
                                onSave();
                                toast.success(
                                    "Successfully updated claim status",
                                );
                                setIsOpen(false);
                            } else {
                                toast.error("Failed to update campaign");
                            }
                        })
                        .catch((err) => {
                            toast.error("Failed to update Campaign");
                        });
                }
                break;
            case 1:
                const data = {
                    hashes: chipHashes,
                    campaignId: campaignId || null,
                };
                await ChipService.setChipCampaign(data)
                    .then(async (res) => {
                        if (res.ok) {
                            onSave();
                            toast.success("Successfully updated campaign");
                            setIsOpen(false);
                        } else {
                            toast.error("Failed to update campaign");
                        }
                    })
                    .catch((err) => {
                        toast.error("Failed to update Campaign");
                    });

                break;
            default:
                break;
        }
    };

    return (
        <Modal
            {...{
                isOpen,
                setIsOpen,
            }}
        >
            <Container>
                <Flex flexDirection={"column"} minHeight={300}>
                    <div>
                        <Image
                            src="/images/actions.svg"
                            width={30}
                            height={30}
                            alt={""}
                        />

                        <Spacer size={2} />

                        <Text
                            fontSize={20}
                            fontWeight={1000}
                            display={"inline"}
                        >
                            Actions
                        </Text>

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
                    </div>
                    <Spacer y size={2} />
                    <Box
                        border={`2px solid ${optionSelected === 0 ? theme.colors.primary : theme.colors.muted}`}
                        borderRadius={3}
                        mt={2}
                        p={2}
                        backgroundColor={true ? "inherit" : theme.colors.muted}
                        style={{
                            opacity: claimOptionEnabled ? 1 : 0.5,
                        }}
                        onClick={() => {
                            claimOptionEnabled && setOptionSelected(0);
                        }}
                    >
                        <Flex justifyContent="space-between">
                            <Flex>
                                <CircleButton outline={true} smaller>
                                    {optionSelected === 0 && (
                                        <FaCircle
                                            size={22}
                                            color={theme.colors.primary}
                                        />
                                    )}
                                </CircleButton>
                                <Spacer size={20} />
                                <Image
                                    src={flagIcon}
                                    width={30}
                                    height={30}
                                    alt={""}
                                />
                                <Spacer size={2} />
                                <Text fontSize={17}>
                                    <strong>Claim Status</strong>
                                </Text>
                            </Flex>
                            <Tooltip
                                placement={"bottom-end"}
                                content={
                                    "Display or hide the claiming option that allows user to redeem the digital ownership of the item. This option is only available for items that have been tokenized with the claim feature."
                                }
                            >
                                <Image
                                    src={informationIcon}
                                    width={30}
                                    height={30}
                                    alt={""}
                                />
                            </Tooltip>
                        </Flex>

                        <Spacer y size={2} />

                        <Divider />

                        <Spacer y size={3} />

                        <Flex
                            justifyContent={"center"}
                            alignItems={"center"}
                            rowGap={3}
                        >
                            <div>
                                <strong>Hide claim</strong>
                            </div>

                            <div
                                style={
                                    getToggleButtonStyle(isClaimVisible)
                                        .toggleContainer
                                }
                            >
                                <input
                                    type="checkbox"
                                    id="toggle"
                                    style={
                                        getToggleButtonStyle(isClaimVisible)
                                            .toggleInput
                                    }
                                    disabled={claimOptionEnabled}
                                    onChange={(e) => e.preventDefault()}
                                    checked={isClaimVisible}
                                    onClick={() =>
                                        setIsClaimVisible(!isClaimVisible)
                                    }
                                />

                                <label
                                    htmlFor="toggle"
                                    style={
                                        getToggleButtonStyle(isClaimVisible)
                                            .toggleLabel
                                    }
                                    onClick={() => {
                                        setIsClaimVisible(
                                            (claimVisible) => !claimVisible,
                                        );
                                    }}
                                >
                                    <div
                                        style={
                                            getToggleButtonStyle(isClaimVisible)
                                                .toggleButton
                                        }
                                    ></div>
                                </label>
                            </div>

                            <div>
                                <strong>Show claim</strong>
                            </div>
                        </Flex>
                    </Box>

                    <Spacer y size={4} />

                    <Box
                        border={`2px solid ${optionSelected === 1 ? theme.colors.primary : theme.colors.muted}`}
                        borderRadius={3}
                        p={2}
                        mt={2}
                        backgroundColor={true ? "inherit" : theme.colors.muted}
                        style={{}}
                        onClick={() => {
                            setOptionSelected(1);
                        }}
                    >
                        <h3 style={{ display: "flex" }}>
                            <CircleButton outline={true} smaller>
                                {optionSelected === 1 && (
                                    <FaCircle
                                        size={22}
                                        color={theme.colors.primary}
                                    />
                                )}
                            </CircleButton>
                            <Spacer size={20} />
                            <Image
                                src="/images/campaigns.svg"
                                width={30}
                                height={30}
                                alt={""}
                            />
                            <Spacer size={2} />
                            Campaigns
                        </h3>
                        <Spacer y size={2} />

                        <Divider />

                        <Spacer y size={3} />

                        <div>
                            Please select a campaign you want to assign for this
                            tokenized item.
                        </div>

                        <Spacer y size={3} />

                        <Select
                            inputProps={{
                                options,
                                placeholder: "Select...",
                                onChange: (e: {
                                    label: string;
                                    value: string;
                                }) => {
                                    setSelectedCampaign(e.value);
                                },
                                value: options.find(
                                    (option) =>
                                        option.value === selectedCampaign,
                                ),
                            }}
                        />

                        <Spacer y size={3} />

                        <Button
                            style={{ width: "100%" }}
                            error
                            outline
                            onClick={() => onSubmit(null)}
                        >
                            End Campaign
                        </Button>
                    </Box>

                    <Spacer y size={20} />

                    <Button
                        disabled={optionSelected === 1 && !selectedCampaign}
                        onClick={() => onSubmit(selectedCampaign)}
                    >
                        Save
                    </Button>
                </Flex>
            </Container>
        </Modal>
    );
};

const Container = styled.div`
    width: 100%;
    padding: 20px;
    overflow-y: auto;
`;

const getToggleButtonStyle = (
    isChecked: boolean,
): { [key: string]: React.CSSProperties } => {
    return {
        toggleContainer: {
            position: "relative",
            display: "inline-block",
            width: "3rem",
            height: "1.5rem",
        },
        toggleInput: {
            display: "none",
        },
        toggleLabel: {
            position: "absolute",
            cursor: "pointer",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isChecked
                ? theme.colors.primary
                : theme.colors.muted,
            borderRadius: "34px",
            transition: "background-color 0.4s",
        },
        toggleButton: {
            position: "absolute",
            top: 0,
            left: !isChecked ? 0 : "50%",
            width: "1.5rem",
            height: "1.5rem",
            backgroundColor: isChecked ? "white" : theme.colors.primary,
            borderRadius: "50%",
            transition: "left 0.4s",
        },
    };
};

export default ActionsChipModal;
