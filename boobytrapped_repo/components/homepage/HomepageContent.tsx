import useConnect from "@/hooks/useConnect";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";
import EmailLogin from "./EmailLogin";
import ModalComponent from "./ModalComponent";

const HomepageContent = () => {
    const router = useRouter();
    const { isConnected } = useConnect();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const onConectWallet = () => {
        setIsOpen(true);
    };
    const [isConnectOpen, setIsConnectOpen] = useState(false);
    const onSocialWallet = () => {
        setIsConnectOpen(true);
    };

    useEffect(() => {
        if (isConnected) {
            router.push("/ownership/collections", { scroll: false });
        }
    }, [isConnected, router]);

    return (
        <Main>
            <Container>
                <Image
                    src="/images/wov-labs-white-logo.png"
                    alt="logo"
                    width={317}
                    height={115}
                />
                <div className="login-box">
                    <div className="login-heading">
                        <h1>
                            Your digital
                            <br />
                            journey starts
                            <br />
                            here.
                        </h1>
                        <div className="description">
                            Connect to see your
                            <br />
                            ownership certificates
                        </div>
                    </div>
                    <div className="button-box">
                        <div className="policy-description">
                            By continuing you agree to the &nbsp;
                            <Link href={"#"}>Terms of Use</Link>&nbsp;&&nbsp;
                            <Link href={"#"}>Privacy Policy</Link>.
                        </div>
                        <button
                            className="social-button"
                            type="button"
                            onClick={onSocialWallet}
                        >
                            <div className="icon">
                                <Image
                                    src="/images/social.svg"
                                    alt="icon1"
                                    width={30}
                                    height={30}
                                />
                            </div>
                            Email
                        </button>
                        <div className="separator">OR</div>
                        <button
                            className="wallet-button"
                            type="button"
                            onClick={onConectWallet}
                        >
                            <div className="icon">
                                <Image
                                    src="/images/wallet.svg"
                                    alt="icon3"
                                    width={30}
                                    height={30}
                                />
                            </div>
                            Wallet
                        </button>
                    </div>
                </div>
            </Container>
            <EmailLogin isOpen={isConnectOpen} setIsOpen={setIsConnectOpen} />
            {/* <ConnectBlockchain isOpen={isOpen} setIsOpen={setIsOpen} /> */}
            <ModalComponent isOpen={isOpen} setIsOpen={setIsOpen} />
        </Main>
    );
};

const Main = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    flex: 1;
    background-image: url(/images/wov__bg.jpg);
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: boder-box;
    background-repeat: no-repeat;
    background-attachment: fixed;
    padding: 10px 0 40px 0;

    * {
        box-sizing: boder-box;
    }

    .login-box {
        display: flex;
        width: 480px;
        display: flex;
        flex-direction: column;

        @media (max-width: 600px) {
            width: 300px;
        }
    }

    .options {
        display: flex;
        flex-direction: column;
        background-color: grey;
    }

    .option {
        cursor: pointer;
    }

    .login-heading {
        margin: 100px 0 50px 0;
        display: flex;
        flex-direction: column;

        h1 {
            background-image: linear-gradient(90deg, #3872ff, #d171ff);
            background-clip: text;
            text-fill-color: transparent;
            color: transparent;
            font-weight: 900;
            font-size: 50px;
            font-family: "Poppins";
            line-height: 64px;
            margin: 0 0 20px 0;
            padding: 0;

            @media (max-width: 600px) {
                font-size: 40px;
            }
        }

        .description {
            color: white;
            font-size: 30px;
            font-family: Poppins;
            font-weight: 400;
            line-height: 40px;
        }
    }

    .button-box {
        display: flex;
        flex-direction: column;
        align-items: center;

        .policy-description {
            color: white;
            font-size: 15px;

            a {
                text-decoration: underline;
                font-weight: bold;
            }

            margin: 0 0 30px 0;
        }

        .separator {
            font-weight: 17.6px;
            color: white;
            margin: 10px 0;
        }

        button {
            height: 50px;
            border-radius: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            font-weight: bold;
            font-size: 20px;
            transition: all 0.3s;

            &.social-button {
                color: white;
                background: #3772ff;

                &:hover:not(:active) {
                    background: #5792ff;
                }
                .icon {
                    padding: 0 5px 0 0;
                }
            }

            &.wallet-button {
                color: #000;
                background: white;

                &:hover:not(:active) {
                    background: #bbb;
                }
                .icon {
                    padding: 0 5px 0 0;
                }
            }
        }
    }
`;

export default HomepageContent;
