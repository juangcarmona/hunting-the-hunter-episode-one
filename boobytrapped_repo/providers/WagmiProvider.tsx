import { CHAINS } from "@/constants/chains";
import { chainState } from "@/state/minting";
import { emailState } from "@/state/socials";
import { Chain } from "@/types/Chains";
import {
    connectorsForWallets,
    getDefaultWallets,
    RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WALLET_ADAPTER_TYPE, WALLET_ADAPTERS } from "@web3auth/base";
import { ModalConfig } from "@web3auth/modal";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { createGlobalStyle } from "styled-components";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { useWeb3Auth } from "./Web3AuthProvider";

const { chains, publicClient } = configureChains(
    CHAINS.map((c) => c.config).filter((c) => c.name !== "Vechain"),
    [
        alchemyProvider({
            apiKey: String(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!),
        }),
    ],
);

const defaultWallets = getDefaultWallets({
    appName: "WoV Labs",
    projectId: String(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!),
    chains,
});

function useWeb3AuthWallet() {
    const { web3Auth } = useWeb3Auth();
    const email = useRecoilValue(emailState);
    return useMemo(() => {
        const modalConfig: Record<WALLET_ADAPTER_TYPE, ModalConfig> = {
            [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
                label: "",
                showOnModal: false,
            },
            [WALLET_ADAPTERS.METAMASK]: {
                label: "",
                showOnModal: false,
            },
        };

        return {
            id: "web3auth",
            name: "Web3Auth",
            iconUrl: "https://web3auth.io/docs/content-hub/logo-google.png",
            iconBackground: "#000000",
            createConnector: () => ({
                connector: new Web3AuthConnector({
                    chains,
                    options: {
                        web3AuthInstance: web3Auth,
                        modalConfig,
                        loginParams: {
                            loginProvider: "email_passwordless",
                            extraLoginOptions: {
                                login_hint: email,
                            },
                        },
                    },
                }),
            }),
        };
    }, [email, web3Auth]);
}

function useConnectors() {
    const web3AuthWallet = useWeb3AuthWallet();
    const chain = useRecoilValue(chainState);
    const connectors = useMemo(() => {
        const connectors = [
            {
                groupName: "Wallets",
                wallets: defaultWallets.wallets.map((w) => w.wallets).flat(),
            },
        ];
        if (chain !== Chain.VECHAIN) {
            connectors.unshift({
                groupName: "Social Media",
                wallets: [web3AuthWallet],
            });
        }
        return connectors;
    }, [chain, web3AuthWallet]);

    return useMemo(() => connectorsForWallets(connectors), [connectors]);
}

function useWagmiConfig() {
    const connectors = useConnectors();
    return useMemo(
        () => createConfig({ autoConnect: true, connectors, publicClient }),
        [connectors],
    );
}

export default function WagmiProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const wagmiConfig = useWagmiConfig();

    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitStyle />
            <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
        </WagmiConfig>
    );
}

const RainbowKitStyle = createGlobalStyle`
    div[aria-labelledby="rk_connect_title"] {
        // The rainbowkit modal by default is above the web3auth modal.
        z-index: 1000 !important;
    }
`;
