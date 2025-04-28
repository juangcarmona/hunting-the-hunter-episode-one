import { tNFT } from "@/types/tNFT";
import { getChipIdFromAttributes } from "./getChipIdFromAttributes";

export const convertToEthereum = (data: any) => {
    const nfts: tNFT[] = [];

    data?.forEach((e: any) => {
        const chipId = getChipIdFromAttributes(e?.raw?.metadata?.attributes);
        if (!chipId) {
            return;
        }

        nfts.push({
            name: e.name,
            tokenId: e.tokenId,
            smartContractAddress: e.contract.address,
            asset: e.image.cachedUrl,
            chipId,
        });
    });

    return nfts;
};
