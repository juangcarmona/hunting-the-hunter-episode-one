import { Chain } from "@/types/Chains";

const CHAIN_IDS: Record<number, Chain> = {
    1: Chain.ETHEREUM,
    5: Chain.GOERLI,
    137: Chain.MATIC,
    80001: Chain.MUMBAI,
    100009: Chain.VECHAIN,
};

export default CHAIN_IDS;
