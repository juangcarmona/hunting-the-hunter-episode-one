import iconArrowRight from "@/assets/arrow-right-dark.svg";
import useConnect from "@/hooks/useConnect";
import { useWeb3AuthVechain } from "@/providers/Web3AuthVechainProvider";
import { chainState } from "@/state/minting";
import { theme } from "@/styles/theme";
import { Chain } from "@/types/Chains";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "@react-hook/media-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import * as yup from "yup";
import Button from "../common/Button";
import Flex from "../common/Flex";
import { Input } from "../common/FormInputs/Input";
import Modal from "../common/Modal";
import Spacer from "../common/Spacer";
import Text from "../common/Text";

const validationSchema = yup.object().shape({
    email: yup.string().email().required(),
}) as any;

interface ConnectBlockchainProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const ConnectBlockchain: React.FC<ConnectBlockchainProps> = ({
    isOpen,
    setIsOpen,
}) => {
    const { isConnected, connectTo, disconnectWallet } = useConnect();
    const setConnectedChain = useSetRecoilState(chainState);
    const { web3AuthVechain } = useWeb3AuthVechain();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    const [pendingLoginEmail, setPendingLoginEmail] = useState<
        string | undefined
    >();

    const {
        register,
        handleSubmit,
        formState: { isValid },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (isConnected) {
            toast.success("wallet connected");
            setIsOpen(false);
        }
    }, [isConnected, setIsOpen]);

    const handleConnectTo = async (
        chain: Chain,
        email?: string, // add validation
    ) => {
        await disconnectWallet();
        setConnectedChain(chain);
        if (email) {
            setPendingLoginEmail(email);
        } else {
            setTimeout(async () => await connectTo(chain), 2000);
        }
    };

    useEffect(() => {
        if (pendingLoginEmail && web3AuthVechain) {
            setPendingLoginEmail(undefined);
            web3AuthVechain.login(pendingLoginEmail);
        }
    }, [pendingLoginEmail, web3AuthVechain]);

    const handleFormSubmit = async (data: Record<string, string>) => {
        await handleConnectTo(Chain.VECHAIN, data.email);
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} zIndex={0}>
            <Spacer size={4} y />
            <Text variant="h5" textAlign="center">
                Connect Ecosystem
            </Text>
            <Spacer size={5} y />
            <Flex columnGap={4} justifyContent="center" flexDirection="column">
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Flex alignItems="center" rowGap={2}>
                        <Input
                            inputProps={{
                                placeholder: isMobile
                                    ? "Enter your email address"
                                    : "Enter your email address here",
                                type: "email",
                                name: "email",
                            }}
                            register={register}
                        />
                        <Button
                            type="submit"
                            disabled={!isValid}
                            style={{
                                borderRadius: "50px",
                                height: "45px",
                                width: "45px",
                            }}
                        >
                            <Image alt="Logo" src={iconArrowRight} />
                        </Button>
                    </Flex>
                </form>
                <DividerORContainer>
                    <div className="line-behind">
                        <h3>OR</h3>
                    </div>
                </DividerORContainer>
                <Button
                    image
                    onClick={() => {
                        handleConnectTo(Chain.VECHAIN);
                    }}
                >
                    <Image
                        src={"/images/logos/vechain.png"}
                        alt={"vechain"}
                        width={164}
                        height={58.11}
                    />
                </Button>
                <Button
                    image
                    onClick={() => {
                        handleConnectTo(Chain.MATIC);
                    }}
                >
                    <Image
                        src={"/images/logos/polygon.png"}
                        alt={"polygon"}
                        width={164}
                        height={48.24}
                    />
                </Button>
                <Button
                    image
                    onClick={() => {
                        handleConnectTo(Chain.ETHEREUM);
                    }}
                >
                    <Image
                        src={"/images/logos/ethereum.png"}
                        alt={"ethereum"}
                        width={164}
                        height={40.28}
                    />
                </Button>

                <Spacer size={2} y />
            </Flex>
        </Modal>
    );
};

const DividerORContainer = styled.div`
    width: 100%;
    padding: 0 30px;
    .line-behind {
        display: grid;
        grid-template-columns: 1fr max-content 1fr;
        align-items: center;
        gap: 1rem;
        color: #b1b5c3;
    }

    .line-behind:before,
    .line-behind:after {
        content: "";
        height: 1px;
        background-color: #b1b5c3;
    }
`;

export default ConnectBlockchain;
