"use client";
import SideBarItem from "@/components/dashboard/SideBarItem";
import { getCurrentUser } from "@/helpers/getCurrentUser";
import useConnect from "@/hooks/useConnect";
import useConnectedChain from "@/hooks/useConnectedChain";
import { userStatus } from "@/state/userStatus";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Jazzicon } from "@ukstv/jazzicon-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

const Sidebar = () => {
    const { disconnectWallet } = useConnect();
    const { address } = useConnectedChain();
    const [copySuccess, setCopySuccess] = useState("");
    const [user, setUser] = useState<any>();
    const [status, setStatus] = useRecoilState(userStatus);

    const isSmallDevice = useMediaQuery("only screen and (max-width : 600px)");

    const onCopyAddress = () => {
        const copyText = address;
        navigator.clipboard.writeText(copyText as string);
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000);
    };

    useEffect(() => {
        (async () => {
            if (!address) {
                return;
            }
            const user = await getCurrentUser(address);
            if (user) {
                setUser(user);
            }
        })();
    }, [address, status]);

    const abbrAddress: any = (addr: `0x${string}` | undefined) =>
        addr ? addr.slice(0, 5) + "..." + addr.slice(37, 42) : "";

    return (
        <Container>
            <Link href="https://wovlabs.com" target="_blank">
                <Image
                    src={
                        isSmallDevice
                            ? "/images/wov-labs--white-square.png"
                            : "/images/wov-labs-white-logo.png"
                    }
                    alt="logo"
                    width={209}
                    height={75}
                    className="head-image"
                />
            </Link>

            <div className="addressbar">
                <div className="avatar">
                    <div
                        style={{
                            width: "30px",
                            height: "30px",
                            margin: "4px 0 0 0",
                        }}
                    >
                        {!user?.avatar ? (
                            <Jazzicon address={(address || "") as string} />
                        ) : (
                            <img
                                src={user.avatar}
                                alt="avatar"
                                style={{ width: "30px" }}
                            />
                        )}
                    </div>
                </div>
                {!isSmallDevice && (
                    <>
                        <div className="user_id">
                            {user === undefined
                                ? abbrAddress(address)
                                : user.name}
                        </div>
                        <div className="icon" onClick={onCopyAddress}>
                            <Image
                                src="/images/add.png"
                                alt="logo"
                                width={30}
                                height={30}
                            />
                        </div>
                        {copySuccess && (
                            <span className="copied">{copySuccess}</span>
                        )}
                    </>
                )}
            </div>
            <SideBarItem icon="nft" route={"/ownership/collections"}>
                {!isSmallDevice && "Ownership"}
            </SideBarItem>
            {/* <SideBarItem icon="notification" route={"/ownership/notification"}>
                {!isSmallDevice && "Notifications"}
            </SideBarItem> */}
            <Notification style={{ opacity: 0.25 }}>
                <div className="image-wrap">
                    <img
                        src="/images/sidebar/notification.svg"
                        alt="notification"
                        className="image"
                    />
                </div>
                {!isSmallDevice && <div className="text"> Notification</div>}
            </Notification>

            <SideBarItem icon="passport" route={"/ownership/settings"}>
                {!isSmallDevice && "Settings"}
            </SideBarItem>
            <SideBarItem icon="demo" route={"/ownership/demo"}>
                {!isSmallDevice && "Demo"}
            </SideBarItem>
            <SideBarItem icon="logout" route={"/"} onClick={disconnectWallet}>
                {!isSmallDevice && "Logout"}
            </SideBarItem>
        </Container>
    );
};

const Container = styled.div`
    width: 250px;
    height: auto;
    padding: 20px;
    background: black;
    color: white;
    border-right: 1px solid #e5eaef;
    flex-shrink: 0;
    font-family: "Poppins", sans-serif;

    @media (max-width: 600px) {
        width: 50px;
        padding: 30px 2px 0 2px;
    }

    @media (max-width: 600px) {
        .Box-sc-e2f29d71-0
            Flex__StyledBox-sc-bbc0b9c-0
            hzNxpy
            dQBjtw
            SideBarItem__ItemContainer-sc-92736b2f-0
            hbuchs {
            padding: 0 0 0 0;
        }
    }

    .head-image {
        @media (max-width: 600px) {
            width: 45px;
            height: 45px;
        }
    }

    .addressbar {
        display: flex;
        flex-direction: row;
        padding: 25px 0 25px 10px;
        position: relative;

        @media (max-width: 600px) {
            padding: 25px 0 25px 7px;
        }

        .avatar {
            width: 30px;
            height: 30px;
            border-radius: 20px;
            overflow: hidden;
            border: 2px solid white;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .icon {
            opacity: 1;
        }

        .copied {
            animation: fadeOutAnimation 2s ease forwards;
            color: white;
            position: absolute;
            right: 0;
            top: 80%;
            background: #08f;
            border-radius: 10px;
            padding: 10px;
        }

        @keyframes fadeOutAnimation {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }

        .user_id {
            text-align: center;
            padding: 0 10px 0 10px;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .icon {
            cursor: pointer;
        }
    }
`;

const Notification = styled.div`
            display: flex;
            flex-direction: row;
            width: 100%;
            padding: 10px 15px 10px 15px;

            @media (max-width: 600px) {
                margin: 0 0 0 3px;
            }

            .image-wrap {
                width: 23px;
                display: flex;
                justify-content: center;
                align-items; center;
                overflow: hidden;
                .image {
                    width: 23px;
                }
            }

            .text {
                padding: 0 0 0 10px;
                font-size: 16px;
            }
`;

export default Sidebar;
