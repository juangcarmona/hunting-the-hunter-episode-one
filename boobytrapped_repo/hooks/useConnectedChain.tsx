"use client";

import { useWeb3AuthVechain } from "@/providers/Web3AuthVechainProvider";
import { eLoginType } from "@/types/eLoginType";
import { useWallet } from "@vechain/dapp-kit-react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

let oldAccount: string | null = null;
let oldEthAddress: `0x${string}` | undefined;
let oldWeb3Auth: any;

const useConnectedChain = () => {
    const { account } = useWallet();
    const { address: ethAddress } = useAccount();
    const web3AuthVechain = useWeb3AuthVechain();
    const [address, setAddress] = useState<string>();
    const [loginType, setLoginType] = useState<eLoginType>();

    useEffect(() => {
        (async () => {
            if (account) {
                setAddress(account);
                setLoginType(eLoginType.VECHAIN);
            } else if (ethAddress) {
                setAddress(ethAddress);
                setLoginType(eLoginType.EVM);
            } else {
                const addr =
                    await web3AuthVechain?.web3AuthVechain?.getWallet();
                if (addr) {
                    setAddress(addr.address);
                    setLoginType(eLoginType.EMAIL);
                } else {
                    setAddress(undefined);
                    setLoginType(undefined);
                }
            }
        })();
    }, [account, ethAddress, web3AuthVechain]);

    return {
        address: address as `0x${string}` | undefined,
        loginType,
    };
};

export default useConnectedChain;
