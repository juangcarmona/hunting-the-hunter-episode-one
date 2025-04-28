import { atom } from "recoil";

import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const logoState = atom<string | null>({
    key: "logo",
    default: null,
    effects_UNSTABLE: [persistAtom],
});
