import { CHAINS } from "@/constants/chains";
import { Chain } from "@/types/Chains";
import { Alchemy } from "alchemy-sdk";

const useAlchemySdk = () => {
    const apiKey = String(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "");
    const multiChainAlchemy = {} as Record<Chain, Alchemy>;
    CHAINS.forEach((chain) => {
        multiChainAlchemy[chain.name] = new Alchemy({
            apiKey,
            network: chain.network,
        });
    });
    return multiChainAlchemy;
};

export default useAlchemySdk;
