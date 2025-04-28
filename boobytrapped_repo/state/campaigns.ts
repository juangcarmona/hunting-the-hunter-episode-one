import { atom } from "recoil";

import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const campaignState = atom<{
    campaignType: "lost" | "stole" | "message";
    campaignData: {
        [k: string]: any;
    };
} | null>({
    key: "campaignState",
    default: null,
    effects_UNSTABLE: [persistAtom],
});
