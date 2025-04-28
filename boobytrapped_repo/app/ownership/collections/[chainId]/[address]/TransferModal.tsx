import animationProgress from "@/assets/lottie/progress-animation.json";
import animationSuccess from "@/assets/lottie/success-animation.json";
import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import Modal from "@/components/common/Modal";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import { Ecosystem } from "@/hooks/useConnect";
import useConnectedChain from "@/hooks/useConnectedChain";
import useEthereum from "@/hooks/useEthereum";
import useVechain from "@/hooks/useVechain";
import { reloadPage } from "@/state/reloadPage";
import { eLoginType } from "@/types/eLoginType";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import {
    useChainId,
    useContractWrite,
    usePrepareContractWrite,
    useSwitchNetwork,
    useWaitForTransaction,
} from "wagmi";

interface TransferModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    address: string;
    tokenId: string;
    chainId: number;
}

const TransferModal: React.FC<TransferModalProps> = ({
    isOpen,
    setIsOpen,
    address: contractAddress,
    tokenId,
    chainId,
}) => {
    const { address, loginType } = useConnectedChain();
    const { transfer } = useVechain({ ecosystem: Ecosystem.VECHAIN });
    const [reload, setReloadPage] = useRecoilState(reloadPage);

    const [inputValue, setInputValue] = useState("");
    const [hexAddress, setHexAddress] = useState<string>("");
    const [vechainLoading, setVechainLoading] = useState<boolean>(false);
    const [vechainHash, setVechainHash] = useState<string>();
    const currentChainId = useChainId();
    const { chains, switchNetworkAsync } = useSwitchNetwork();
    const { getAddressFromNameservice: ensEthName } = useEthereum({
        chainId: 1,
    });
    const { getAddressFromNameservice: vnsName } = useVechain({
        ecosystem: Ecosystem.VECHAIN,
    });

    useEffect(() => {
        (async () => {
            let nickName;

            if (loginType === eLoginType.EVM) {
                nickName = await ensEthName(inputValue);
            } else if (loginType === eLoginType.VECHAIN) {
                nickName = await vnsName(inputValue);
            }
            nickName = await vnsName(inputValue);

            if (nickName !== null) {
                setHexAddress(nickName);
            } else {
                setHexAddress("");
            }
        })();
    }, [inputValue, ensEthName, vnsName, loginType]);

    const handleChange = (event: any) => {
        setInputValue(event.target.value);
    };

    const { config } = usePrepareContractWrite({
        address: contractAddress as `0x${string}`,
        abi: [
            {
                name: "transferFrom",
                type: "function",
                stateMutability: "nonpayable",
                inputs: [
                    {
                        internalType: "address",
                        name: "from",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "to",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256",
                    },
                ],

                outputs: [],
            },
        ],
        functionName: "transferFrom",
        account: address as `0x${string}`,
        args: [
            address as `0x${string}`,
            inputValue.startsWith("0x") ? inputValue.trim() : hexAddress || "",
            tokenId,
        ],
    });

    const { data, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });

    useEffect(() => {
        (async () => {
            if (isSuccess) {
                // setTimeout(() => setReloadPage(reload + 1), 1000);
                window.location.reload();
            }
        })();
    }, [isSuccess, setReloadPage, reload]);

    const onTransfer = async () => {
        if (chainId === 1 || chainId === 137) {
            try {
                if (currentChainId != chainId) {
                    await switchNetworkAsync?.(chainId);
                }
                write?.();
            } catch (ex) {
                console.error(ex);
            }
        } else if (chainId === 100009) {
            setVechainLoading(true);
            const hash = await transfer(
                contractAddress as `0x${string}`,
                tokenId,
                address as `0x${string}`,
                inputValue.startsWith("0x")
                    ? inputValue.trim()
                    : hexAddress || undefined,
            );
            setVechainLoading(false);
            setVechainHash(hash);
            // setTimeout(() => setReloadPage(reload + 1), 1000);
            setTimeout(() => window.location.reload(), 5000);
        }
    };

    if (
        ((chainId === 1 || chainId === 137) && isLoading) ||
        (chainId === 100009 && vechainLoading)
    ) {
        return <TransferInProgress />;
    }

    if (
        ((chainId === 1 || chainId === 137) && isSuccess) ||
        (chainId === 100009 && vechainHash && !vechainLoading)
    ) {
        return <TransferCompleted />;
    }

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            zIndex={100}
            hasCloseButton={true}
        >
            <Spacer y size={30} />
            <Flex
                p={4}
                flexDirection="column"
                columnGap={3}
                alignItems="center"
            >
                <Text variant="h5" textAlign="center">
                    Transfer
                </Text>
                <Flex
                    columnGap={4}
                    justifyContent="center"
                    flexDirection="column"
                >
                    <Flex alignItems="center" rowGap={2}>
                        <Input>
                            <input
                                placeholder={
                                    loginType === eLoginType.EVM
                                        ? "Enter a .eth domain here"
                                        : "Enter a vechain wallet or .VET domain here..."
                                }
                                type="text"
                                value={inputValue}
                                onChange={handleChange}
                                className="input-box"
                            />
                        </Input>
                        <Button
                            style={{
                                width: "50px",
                                height: "50px",
                                margin: "0 0 0 5px",
                            }}
                            onClick={onTransfer}
                            type="button"
                        >
                            <Text fontSize={25}>&gt;</Text>
                        </Button>
                    </Flex>
                    {hexAddress !== "" ? (
                        <HexAddress>{hexAddress}</HexAddress>
                    ) : (
                        <></>
                    )}
                    <Spacer size={2} y />
                </Flex>
                {isSuccess && (
                    <div>
                        Successfully transferred your NFT!
                        <div>
                            <a href={`https://etherscan.io/tx/${data?.hash}`}>
                                Transaction link
                            </a>
                        </div>
                    </div>
                )}
            </Flex>
        </Modal>
    );
};

function TransferInProgress() {
    return (
        <Overlay>
            <OverlayBody>
                <Flex flexDirection="column" alignItems="center" columnGap={4}>
                    <Lottie
                        animationData={animationProgress}
                        loop={true}
                        style={{ width: 150, height: 150 }}
                    />
                    <Text variant="bodyBold1" textAlign="center">
                        Transferring Token
                    </Text>
                    <Text textAlign="center">
                        Token transfer in progress. Please wait.
                    </Text>
                </Flex>
            </OverlayBody>
        </Overlay>
    );
}

function TransferCompleted() {
    return (
        <Overlay>
            <OverlayBody>
                <Flex flexDirection="column" alignItems="center" columnGap={4}>
                    <Lottie
                        animationData={animationSuccess}
                        loop={false}
                        style={{ width: 150, height: 150 }}
                    />
                    <Text variant="bodyBold1" textAlign="center">
                        Congratulations!
                    </Text>
                    <Text textAlign="center">
                        You have successfully transferred ownership of this
                        item. Enjoy the benefits!
                    </Text>
                </Flex>
            </OverlayBody>
        </Overlay>
    );
}

const Input = styled.div`
    .input-box {
        border: 2px solid ${({ theme }) => theme.colors.muted};
        width: 330px;
        margin: 0 0 0 5px;
        height: 50px;
        font-size: 13px;
        padding: 0 0 0 10px;
        border-radius: 10px;
        font-weight: 500;
        font-size: 14px;
        font-family: Poppins;
        color: ${({ theme }) => theme.colors.black};
        display: flex;
        justify-content: center;
        align-items: center;
        &:focus-within {
            border-color: ${({ theme }) => theme.colors.accent};
        }
        &::placeholder {
            color: ${({ theme }) => theme.colors.neutral};
            opacity: 1; /* Firefox */
        }
    }
`;

const HexAddress = styled.div`
    display: flex;
    justify-content: center;
    text-align: center;
`;

const Overlay = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: #000a;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
`;

const OverlayBody = styled.div`
    padding: 20px 40px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 3px 3px 10px #000a;
`;

export default TransferModal;
