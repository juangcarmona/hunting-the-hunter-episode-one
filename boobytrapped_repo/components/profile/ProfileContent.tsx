import useConnect, { Ecosystem } from "@/hooks/useConnect";
import { SocialSettingsData } from "@/services/UsersService.ts";
import { chainState } from "@/state/minting";
import { theme } from "@/styles/theme";
import { Chain } from "@/types/Chains";
import { useMediaQuery } from "@react-hook/media-query";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import useSWR from "swr";
import { useNetwork, useSwitchNetwork } from "wagmi";
import Box from "../common/Box";
import Button from "../common/Button";
import Flex from "../common/Flex";
import { Select } from "../common/FormInputs/Select";
import PageContentTitle from "../common/PageContentTitle";
import ConnectBlockchain from "./ConnectBlockchain";
import GeneralSettings from "./GeneralSettings";
import PreviewContainer from "./PreviewContainer";
import SocialSettings from "./SocialSettings";

export interface UserProps {
    customLogo: string;
    socials?: SocialSettingsData;
}

const ProfileContent = () => {
    const { data, isLoading, isValidating, mutate } = useSWR("/users/me");
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    const { chains, switchNetwork } = useSwitchNetwork();
    const { chain } = useNetwork();
    const connectedChain = useRecoilValue(chainState);

    const currentUserData = useMemo<UserProps>(
        () => data?.data?.json || { customLogo: null },
        [data],
    );

    const [isConnectOpen, setIsConnectOpen] = useState(false);

    const { isConnected, disconnectWallet } = useConnect();

    return (
        <div style={{ padding: isMobile ? 5 : 24 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: isMobile ? "center" : undefined,
                }}
            >
                <PageContentTitle>
                    Customize your Digital Passport
                </PageContentTitle>
            </div>
            <SettingsHeader>
                {isConnected ? (
                    <Flex rowGap={3}>
                        <Box flex={3}>
                            <Button
                                outline
                                onClick={disconnectWallet}
                                style={{ width: isMobile ? undefined : 400 }}
                            >
                                Disconnect Ecosystem
                            </Button>
                        </Box>
                        <Box flex={1}>
                            {connectedChain !== Chain.VECHAIN && (
                                <Flex>
                                    <Select
                                        inputProps={{
                                            options: chains
                                                .map((chain) => ({
                                                    value: chain.id,
                                                    label: chain.name,
                                                }))
                                                .filter(
                                                    (chain) =>
                                                        chain.label.toLowerCase() !==
                                                        Ecosystem.VECHAIN,
                                                ),
                                            value: {
                                                label: chain?.name,
                                                value: chain?.id,
                                            },
                                            onChange: (value: any) => {
                                                switchNetwork?.(value.value);
                                            },
                                        }}
                                    />
                                </Flex>
                            )}

                            {connectedChain === Chain.VECHAIN && (
                                <Image
                                    src={"/images/logos/vechain.png"}
                                    alt={"vechain"}
                                    width={164}
                                    height={58.11}
                                />
                            )}
                        </Box>
                    </Flex>
                ) : (
                    <Button
                        onClick={() => setIsConnectOpen(true)}
                        style={{ width: 400 }}
                    >
                        Connect Ecosystem
                    </Button>
                )}
            </SettingsHeader>
            {isLoading || isValidating ? (
                <LoaderContainer>Loading...</LoaderContainer>
            ) : (
                <SettingsContainer
                    style={{ justifyContent: isMobile ? "center" : undefined }}
                >
                    <LeftColumn
                        style={{
                            width: isMobile ? "inherit" : undefined,
                        }}
                    >
                        <GeneralSettings
                            userData={currentUserData}
                            reloadUserProps={mutate}
                        />

                        <SocialSettings
                            userData={currentUserData}
                            reloadUserProps={mutate}
                        />
                    </LeftColumn>

                    {!isMobile && <PreviewContainer userData={data} />}
                </SettingsContainer>
            )}
            {isConnectOpen && (
                <ConnectBlockchain
                    isOpen={isConnectOpen}
                    setIsOpen={setIsConnectOpen}
                />
            )}
        </div>
    );
};

const SettingsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    // max-width: 1000px;
    width: 100%;
    padding: 20px;
    border: 1px solid #e5e5e5;
    border-radius: 30px;
`;

const LeftColumn = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
`;

const SettingsHeader = styled.div`
    // max-width: 1000px;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 20px;
`;

const LoaderContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: 16px;
`;

export default ProfileContent;
