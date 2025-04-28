import { tNFT } from "@/types/tNFT";
import { getChipIdFromAttributes } from "./getChipIdFromAttributes";

export const convertToNFT = (data: any) => {
    const nfts: tNFT[] = [];

    data?.tokens?.items?.forEach((e: any) => {
        const chipId = getChipIdFromAttributes(e?.attributes);
        if (!chipId) {
            return;
        }

        let image = "";
        if (e.assets.length > 0) {
            image = e.assets.find((a: any) => a.size === "ORIGINAL")?.url;
            if (!image) {
                image = e.assets[e.assets.length - 1].url;
            }
        }

        nfts.push({
            name: e.name,
            tokenId: e.tokenId,
            smartContractAddress: e.smartContractAddress,
            asset: image,
            chipId,
        });
    });

    return nfts;
};
