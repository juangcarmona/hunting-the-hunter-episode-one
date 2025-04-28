import { CHAINS, ETH_CHAINS } from "@/constants/chains";
import { useWeb3AuthVechain } from "@/providers/Web3AuthVechainProvider";
import { chainState } from "@/state/minting";
import { Chain } from "@/types/Chains";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useWallet, useWalletModal } from "@vechain/dapp-kit-react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
    useAccount,
    useDisconnect,
    useSwitchNetwork,
    useConnect as wagmiUseConnect,
} from "wagmi";

export enum Ecosystem {
    ETHEREUM = "ethereum",
    VECHAIN = "vechain",
}

const useConnect = () => {
    const { connect, connectors } = wagmiUseConnect();
    const { isConnected: ethIsConnected } = useAccount();
    const { disconnectAsync: disconnectEthereum } = useDisconnect();
    const { account: vechainAddress, disconnect: disconnectVechain } =
        useWallet();

    const {
        web3AuthVechain: web3AuthService,
        isConnected: isConnectedWeb3Auth,
    } = useWeb3AuthVechain();

    const [connectedChain, setConnectedChain] = useRecoilState(chainState);

    const { switchNetwork } = useSwitchNetwork();

    const { openConnectModal: openEthModal } = useConnectModal();
    const { open: openVechainModal } = useWalletModal();
    const [isConnected, setIsConnected] = useState<boolean | null>(null);

    useEffect(() => {
        setIsConnected(
            !!vechainAddress || ethIsConnected || isConnectedWeb3Auth,
        );
    }, [ethIsConnected, isConnectedWeb3Auth, vechainAddress]);

    const connectTo = useCallback(
        async (chain: Chain, email?: string) => {
            if (ETH_CHAINS.includes(chain) && email) {
                const web3authConn = connectors.find(
                    (c) => c.id === "web3auth",
                );
                return connect({ connector: web3authConn });
            }
            if (ETH_CHAINS.includes(chain) && openEthModal)
                return openEthModal();
            if (chain === Chain.VECHAIN && email)
                return await web3AuthService!.login(email);
            if (chain === Chain.VECHAIN) return openVechainModal();
        },
        [connect, connectors, openEthModal, openVechainModal, web3AuthService],
    );

    const disconnectWallet = useCallback(async () => {
        try {
            disconnectVechain();
            await disconnectEthereum();
            await web3AuthService?.logout();
            setConnectedChain(Chain.ETHEREUM);
        } catch (err) {
            console.warn("Failed to disconnect ", err);
        }
    }, [
        disconnectEthereum,
        disconnectVechain,
        setConnectedChain,
        web3AuthService,
    ]);

    useEffect(() => {
        if (ethIsConnected && switchNetwork && connectedChain) {
            switchNetwork(
                CHAINS.find((c) => c.name === connectedChain)?.config.id,
            );
        }
    }, [connectedChain, ethIsConnected, switchNetwork]);

    return {
        isConnected,
        disconnectWallet,
        connectTo,
    };
};

export default useConnect;
