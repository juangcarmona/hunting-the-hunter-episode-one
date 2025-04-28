import { tCollection } from "@/types/tCollection";

export const convertToCollection = (c: any): tCollection => ({
    name: c.label,
    address: c.value,
    nfts: [],
    chainId: c.chainId,
});
