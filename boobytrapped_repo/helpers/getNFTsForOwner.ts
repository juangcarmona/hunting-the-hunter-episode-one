import { Alchemy, GetNftsForOwnerOptions } from "alchemy-sdk";

export const getNFTsForOwner = async (
    alchemy: Alchemy,
    owner: string,
    options?: GetNftsForOwnerOptions | undefined,
) => {
    for (let i = 0; i < 3; i++) {
        try {
            const res = await alchemy.nft.getNftsForOwner(owner, options);
            return res;
        } catch (ex) {
            await new Promise((resolve, reject) =>
                setTimeout(() => resolve(1), 1000),
            );
        }
    }

    throw "getNFTsForOwner error";
};
