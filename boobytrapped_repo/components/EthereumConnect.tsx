import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { FC } from "react";
import Button from "./common/Button";
import Flex from "./common/Flex";
import Text from "./common/Text";
interface EterehumConnectProps {
    setIsClaiming?: (bool: boolean) => void;
}

const EterehumConnect: FC<React.PropsWithChildren<EterehumConnectProps>> = ({
    setIsClaiming,
}) => {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
            }) => {
                // Note: If your app doesn't use authentication, you
                // can remove all 'authenticationStatus' checks
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                        authenticationStatus === "authenticated");

                return (
                    <>
                        {(() => {
                            if (!connected) {
                                return (
                                    <Button
                                        onClick={() => {
                                            if (setIsClaiming)
                                                setIsClaiming(true);
                                            openConnectModal();
                                        }}
                                        fullWidth
                                    >
                                        <Flex
                                            justifyContent="center"
                                            rowGap={2}
                                            alignItems="center"
                                            px={3}
                                        >
                                            <Image
                                                src="/images/wallet.png"
                                                alt="wallet"
                                                width={24}
                                                height={24}
                                            />
                                            <Text>Wallet</Text>
                                        </Flex>
                                    </Button>
                                );
                            }
                            if (chain.unsupported) {
                                return (
                                    <Button
                                        onClick={openChainModal}
                                        type="button"
                                        small
                                        error
                                    >
                                        Wrong network
                                    </Button>
                                );
                            }
                        })()}
                    </>
                );
            }}
        </ConnectButton.Custom>
    );
};

export default EterehumConnect;
