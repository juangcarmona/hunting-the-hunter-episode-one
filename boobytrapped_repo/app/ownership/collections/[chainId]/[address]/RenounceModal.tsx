import animationProgress from "@/assets/lottie/progress-animation.json";
import animationSuccess from "@/assets/lottie/success-animation.json";
import Box from "@/components/common/Box";
import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import Modal from "@/components/common/Modal";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import { Tooltip } from "@/components/common/Tooltip";
import { updateChipClaimStatus } from "@/helpers/updateChipClaimStatus";
import { Ecosystem } from "@/hooks/useConnect";
import useConnectedChain from "@/hooks/useConnectedChain";
import useEthereum from "@/hooks/useEthereum";
import useVechain from "@/hooks/useVechain";
import { accessTokenState } from "@/state/accessToken";
import { reloadPage } from "@/state/reloadPage";
import { theme } from "@/styles/theme";
import { eLoginType } from "@/types/eLoginType";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoWarning } from "react-icons/io5";
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
    currentUser: any;
    label: string;
    chipId: string;
    value: string;
    onReload?: (chipId: string) => void;
}

const RenounceModal: React.FC<TransferModalProps> = ({
    isOpen,
    setIsOpen,
    address: contractAddress,
    tokenId,
    chainId,
    currentUser,
    label,
    chipId,
    value,
    onReload,
}) => {
    const [accessToken, setAccesToken] = useRecoilState(accessTokenState);
    const { address, loginType } = useConnectedChain();
    const { transfer } = useVechain({ ecosystem: Ecosystem.VECHAIN });
    const { getContractOwner: getVechainContractOwner } = useVechain({
        ecosystem: Ecosystem.VECHAIN,
        collectionAddress: contractAddress as `0x${string}`,
    });
    const { getContractOwner: getEvmContractOwner } = useEthereum({
        collectionAddress: contractAddress as `0x${string}`,
        chainId,
    });
    const currentChainId = useChainId();
    const { chains, switchNetworkAsync } = useSwitchNetwork();
    const [vechainLoading, setVechainLoading] = useState<boolean>(false);
    const [vechainHash, setVechainHash] = useState<string>();

    const [reload, setReloadPage] = useRecoilState(reloadPage);

    const [evmTo, setEvmTo] = useState<string>();

    useEffect(() => {
        if (loginType === eLoginType.EVM) {
            (async () => {
                const to = await getEvmContractOwner();
                setEvmTo(to);
            })();
        }
    }, [getEvmContractOwner, loginType]);

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
        args: [address as `0x${string}`, evmTo as `0x${string}`, value],
    });

    const { data, write } = useContractWrite(config);

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });

    useEffect(() => {
        (async () => {
            if (isSuccess) {
                await updateChipClaimStatus(chipId, accessToken);
                // setTimeout(() => setReloadPage(reload + 1), 3000);
                window.location.reload();
            }
        })();
    }, [isSuccess]);

    const onClickRenounce = async () => {
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
            try {
                setVechainLoading(true);
                const to = await getVechainContractOwner();
                const hash = await transfer(
                    contractAddress as `0x${string}`,
                    value,
                    address as `0x${string}`,
                    to as `0x${string}`,
                );
                await updateChipClaimStatus(chipId, accessToken);
                setVechainLoading(false);
                setVechainHash(hash);
                // setTimeout(() => setReloadPage(reload + 1), 3000);
                window.location.reload();
            } catch (ex) {
                console.error(ex);
            }
        }
    };

    if (
        ((chainId === 1 || chainId === 137) && isLoading) ||
        (chainId === 100009 && vechainLoading)
    ) {
        return <RenounceInProgress />;
    }

    if (
        ((chainId === 1 || chainId === 137) && isSuccess) ||
        (chainId === 100009 && vechainHash && !vechainLoading)
    ) {
        return <RenounceCompleted />;
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} zIndex={1000}>
            <Header>
                <div className="img-wrapper">
                    <img
                        src="/images/modal_renounce.png"
                        alt=""
                        className="icon"
                        style={{
                            width: "40px",
                            margin: 0,
                            padding: 0,
                            marginRight: "5px",
                        }}
                    />
                </div>
                <Spacer y size={3} />
                <div className="text">
                    <Flex position={"relative"} px={45}>
                        Are you sure to renounce
                        <br />
                        the ownership?{" "}
                        <Tooltip
                            content={
                                "Select “Renounce” to give up control of this item. You can reclaim it later by tapping on the smart tag, as long as you still own the product."
                            }
                        >
                            <Box position="absolute" right={0}>
                                <AiOutlineInfoCircle
                                    color={theme.colors.accent}
                                    size={25}
                                />
                            </Box>
                        </Tooltip>
                    </Flex>
                </div>
            </Header>

            <Accept>
                <Flex
                    flexDirection="row"
                    justifyContent="space-evenly"
                    style={{ width: "100%" }}
                >
                    <Button
                        outline
                        style={{ width: "100%" }}
                        onClick={() => setIsOpen(false)}
                    >
                        No
                    </Button>
                    <Spacer size={3} />
                    <Button
                        outline
                        style={{ width: "100%" }}
                        onClick={() => onClickRenounce()}
                    >
                        Yes
                    </Button>
                </Flex>{" "}
                <Spacer size={4} y />
                <Flex
                    alignContent={"center"}
                    justifyContent={"center"}
                    style={{
                        fontSize: "14px",
                        color: `${theme.colors.error}`,
                        textAlign: "center",
                    }}
                >
                    <IoWarning size="25px" />
                    <Spacer y size={3} />
                    <strong>Warning:</strong>&nbsp;This action cannot be undone.
                </Flex>
            </Accept>
        </Modal>
    );
};

function RenounceInProgress() {
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
                        Renouncing
                    </Text>
                    <Text textAlign="center">
                        Renouncing in progress. Please wait.
                    </Text>
                </Flex>
            </OverlayBody>
        </Overlay>
    );
}

function RenounceCompleted() {
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
                        You have successfully renounced ownership of this item.
                        Enjoy the benefits!
                    </Text>
                </Flex>
            </OverlayBody>
        </Overlay>
    );
}

const Header = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px;
    .image-wrapper {
        width: 20px;
        height: 20px;
    }
    .text,
    .renounce-text {
        line-height: 1.71429;
        white-space: normal;
        word-break: normal;
        text-overflow: clip;
        overflow: visible;
        font-weight: 700;
        font-size: 20px;
        display: inline;
        text-align: center;
    }
`;

const Accept = styled.div`
    display: flex;
    flex-direction: column;
    padding: 15px;
    width: 100%;
    justify-content: center;
    margin: 0 0 20px 0;

    .accept,
    .cancel {
        padding: 10px;
        width: 100px;
        height: 100%;
        background-color: #044eff;
        border-radius: 30px;
        font-size: 18px;
        color: white;
    }

    .cancel {
        margin: 0 0 0 20px;
    }
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

export default RenounceModal;
