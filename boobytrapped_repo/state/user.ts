import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const userRole = atom<"ADMIN" | "USER" | null>({
    key: "userRole",
    default: null,
    effects_UNSTABLE: [persistAtom],
});
