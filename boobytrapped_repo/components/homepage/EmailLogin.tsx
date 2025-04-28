import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import { Input } from "@/components/common/FormInputs/Input";
import Modal from "@/components/common/Modal";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import useConnect from "@/hooks/useConnect";
import { useWeb3AuthVechain } from "@/providers/Web3AuthVechainProvider";
import { chainState } from "@/state/minting";
import { Chain } from "@/types/Chains";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
import * as yup from "yup";

const validationSchema = yup.object().shape({
    email: yup.string().email().required(),
}) as any;

interface EmailLoginProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const EmailLogin: React.FC<EmailLoginProps> = ({ isOpen, setIsOpen }) => {
    const { isConnected, connectTo, disconnectWallet } = useConnect();
    const setChain = useSetRecoilState(chainState);
    const [email, setEmail] = useState("");

    const { web3AuthVechain: web3AuthService } = useWeb3AuthVechain();

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
            toast.success("Wallet connected");
            setIsOpen(false);
        }
    }, [isConnected, setIsOpen]);

    useEffect(() => {
        if (web3AuthService && email) {
            connectTo(Chain.VECHAIN, email);
        }
    }, [web3AuthService, email]);

    const handleConnectTo = async (
        chain: Chain,
        email?: string, // add validation
    ) => {
        if (!email) {
            toast.error("Please input the email");
            return;
        }

        await disconnectWallet();
        setChain(chain);
        setEmail(email);
    };

    const handleFormSubmit = async (data: Record<string, string>) => {
        await handleConnectTo(Chain.VECHAIN, data.email);
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} zIndex={0}>
            <Spacer size={4} />
            <Spacer size={4} y />
            <Text variant="h5" textAlign="center">
                Enter your email
            </Text>
            <Spacer size={5} y />
            <Flex columnGap={4} justifyContent="center" flexDirection="column">
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Flex flexDirection={"column"}>
                        <Flex alignItems="center" rowGap={2}>
                            <Input
                                inputProps={{
                                    placeholder:
                                        "Enter your email address here",
                                    type: "email",
                                    name: "email",
                                }}
                                register={register}
                            />
                            <Button type="submit" disabled={!isValid}>
                                <Text fontSize={25}>&gt;</Text>
                            </Button>
                        </Flex>
                        <Spacer size={4} y />
                        <Flex px={3}>
                            <small>
                                <strong>Browser&apos;s Pop-ups:</strong> To
                                fully utilize our website&apos;s features,
                                please enable pop-ups in your browser settings.
                                .
                            </small>
                        </Flex>
                    </Flex>
                </form>

                <Spacer size={2} y />
            </Flex>
        </Modal>
    );
};

export default EmailLogin;
