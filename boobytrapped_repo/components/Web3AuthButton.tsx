import iconArrowRight from "@/assets/arrow-right-dark.svg";
import hookUseConnect from "@/hooks/useConnect";
import { useWeb3AuthVechain } from "@/providers/Web3AuthVechainProvider";
import { chainState } from "@/state/minting";
import { emailState } from "@/state/socials";
import { Chain } from "@/types/Chains";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import * as yup from "yup";
import Button from "./common/Button";
import Flex from "./common/Flex";
import { Input } from "./common/FormInputs/Input";

const validationSchema = yup.object().shape({
    email: yup.string().email().required(),
}) as any;

interface Web3AuthButtonProps {
    setIsClaiming: (bool: boolean) => void;
    chain: Chain;
}
const Web3AuthButton: React.FC<Web3AuthButtonProps> = ({
    chain,
    setIsClaiming,
}) => {
    const setConnectedChain = useSetRecoilState(chainState);
    const {
        register,
        handleSubmit,
        formState: { isValid },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(validationSchema),
    });
    const { web3AuthVechain } = useWeb3AuthVechain();

    const { connectTo } = hookUseConnect();
    const [email, setEmail] = useRecoilState(emailState);
    const handleLogin = ({ email }: Record<string, string>) => {
        setEmail(email);
    };
    useEffect(() => {
        setConnectedChain(chain);
        if (email && chain !== Chain.VECHAIN) {
            setTimeout(() => {
                setEmail(undefined);
                connectTo(chain, email);
                setIsClaiming(true);
            }, 1);
        }
    }, [chain, email]);

    useEffect(() => {
        if (email && web3AuthVechain) {
            setEmail(undefined);
            web3AuthVechain.login(email);
            setIsClaiming(true);
        }
    }, [email, web3AuthVechain]);

    return (
        <form onSubmit={handleSubmit(handleLogin)} style={{ width: "100%" }}>
            <Flex alignItems="center" rowGap={2}>
                <Input
                    inputProps={{
                        placeholder: "Enter your email address here",
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
    );
};

export default Web3AuthButton;
