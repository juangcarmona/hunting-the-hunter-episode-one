import { SocialSettingsData } from "@/services/UsersService.ts";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const socialsState = atom<SocialSettingsData | undefined>({
    key: "socials",
    default: undefined,
});

export const emailState = atom<string | undefined>({
    key: "email",
    default: undefined,
    effects_UNSTABLE: [persistAtom],
});
