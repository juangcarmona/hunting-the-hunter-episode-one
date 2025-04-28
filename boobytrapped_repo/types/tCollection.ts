import { tNFT } from "./tNFT";

export type tCollection = {
    name: string;
    address?: `0x${string}`;
    nfts: tNFT[];
    chainId: number;
};
