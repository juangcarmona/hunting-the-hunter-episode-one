import { CHAINS } from "@/constants/chains";
import { chainState } from "@/state/minting";
import { Chain } from "@/types/Chains";
import {
    CHAIN_NAMESPACES,
    CustomChainConfig,
    OPENLOGIN_NETWORK_TYPE,
} from "@web3auth/base";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { createContext, useContext, useMemo } from "react";
import { useRecoilValue } from "recoil";

export const Web3AuthContext = createContext({
    web3Auth: {} as Web3AuthNoModal,
});

const CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!;
const NETWORK = process.env
    .NEXT_PUBLIC_WEB3AUTH_NETWORK as OPENLOGIN_NETWORK_TYPE;

export const useWeb3Auth = () => {
    return useContext(Web3AuthContext);
};

export default function Web3AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const connectedChain = useRecoilValue(chainState);

    const chain = useMemo(
        () =>
            CHAINS.find(
                (c) => c.name.toLowerCase() === connectedChain.toLowerCase(),
            )!.config,
        [connectedChain],
    );

    const chainConfig = useMemo(() => {
        let chainConfig: CustomChainConfig = {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: chain.id.toString(16),
            rpcTarget:
                chain.name !== "Vechain"
                    ? `${chain.rpcUrls.alchemy.http[0]}/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
                    : chain.rpcUrls.default.http[0],
            displayName: chain.name,
            tickerName: chain.nativeCurrency?.name,
            ticker: chain.nativeCurrency?.symbol,
            blockExplorer: chain.blockExplorers!.default.url[0],
        };

        if (connectedChain === Chain.VECHAIN) {
            chainConfig = {
                chainId: "74",
                blockExplorer: "https://explore.vechain.org/",
                rpcTarget: "https://node.vechain.energy",
                chainNamespace: CHAIN_NAMESPACES.OTHER,
                displayName: "VeChain",
                ticker: "VET",
                tickerName: "VeChain",
            };
        }
        return chainConfig;
    }, [
        chain.blockExplorers,
        chain.id,
        chain.name,
        chain.nativeCurrency?.name,
        chain.nativeCurrency?.symbol,
        chain.rpcUrls.alchemy?.http,
        chain.rpcUrls.default.http,
        connectedChain,
    ]);

    const web3Auth = useMemo(() => {
        const web3Auth = new Web3AuthNoModal({
            chainConfig,
            clientId: CLIENT_ID,
            web3AuthNetwork: NETWORK,
        });
        let privateKeyProvider:
            | EthereumPrivateKeyProvider
            | CommonPrivateKeyProvider = new EthereumPrivateKeyProvider({
            config: { chainConfig },
        });

        if (connectedChain === Chain.VECHAIN) {
            privateKeyProvider = new CommonPrivateKeyProvider({
                config: { chainConfig },
            });
        }

        web3Auth.configureAdapter(
            new OpenloginAdapter({
                privateKeyProvider,
                adapterSettings: {
                    uxMode: "popup",
                    network: NETWORK,
                },
            }),
        );
        return web3Auth;
    }, [chainConfig, connectedChain]);

    return (
        <Web3AuthContext.Provider value={{ web3Auth }}>
            {children}
        </Web3AuthContext.Provider>
    );
}
