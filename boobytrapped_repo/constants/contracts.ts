import { Chain } from "@/types/Chains";

// Elem 0 is always the current factory contract in use
// the old ones aree keeped in order to fetch collections created from those
export const factoryContracts: Record<Chain, `0x${string}`[]> = {
    [Chain.ETHEREUM]: ["0x4D429EB48356D05ACB879917ECfCfe8787F6552a"],
    [Chain.MATIC]: [
        "0x3B0d703aAe1Bed0aD59697eB17d93D4b2d6b749A",
        "0x5de806a67b588545dc7228ede30a744a8b6ed552",
    ],
    [Chain.GOERLI]: ["0x1D6d89C2D2c112d03cFa9B39974b86965f7934E9"],
    [Chain.MUMBAI]: ["0x98B8F231F2Cef2CA98AE4fD51073ae5B9F07D59F"],
    [Chain.VECHAIN]: ["0x0000000000000000000000000000456E65726779"],
    [Chain.CARDANO]: ["0x0000000000000000000000000000456E65726779"],
};
