import { Chain } from "@/types/Chains";
import { Network } from "alchemy-sdk";
import { Chain as ViemChain } from "viem/chains";
import { goerli, mainnet, polygon, polygonMumbai, vechain } from "wagmi/chains";

export interface ChainConfig {
    name: Chain;
    network?: Network;
    logo: string;
    config: ViemChain;
}

export const CHAINS: ChainConfig[] = [
    {
        name: Chain.ETHEREUM,
        network: Network.ETH_MAINNET,
        logo: "/img/ethereum_logo.png",
        config: mainnet,
    },
    {
        name: Chain.MATIC,
        network: Network.MATIC_MAINNET,
        logo: "/img/matic_logo.png",
        config: polygon,
    },

    {
        name: Chain.GOERLI,
        network: Network.ETH_GOERLI,
        logo: "/img/ethereum_logo.png",
        config: goerli,
    },
    {
        name: Chain.MUMBAI,
        network: Network.MATIC_MUMBAI,
        logo: "/img/matic_logo.png",
        config: polygonMumbai,
    },
    {
        name: Chain.VECHAIN,
        logo: "", // add vechain logo
        config: vechain,
    },
];

export const CHAINS_BY_ID = Object.fromEntries(
    CHAINS.map((chain) => [chain.config.id, chain]),
);

export const ETH_CHAINS = [
    Chain.ETHEREUM,
    Chain.GOERLI,
    Chain.MATIC,
    Chain.MUMBAI,
];
