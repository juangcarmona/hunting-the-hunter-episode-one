import { ChipProps } from "@/app/admin/(DashboardLayout)/chips/[[...type]]/page";
import { Chain } from "@/types/Chains";
import { ChipGroupDto } from "@/utils/GroupService";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export interface Collection {
    label: string | undefined;
    value: `0x${string}` | undefined;
}

export const mintingCollectionState = atom<Collection | null>({
    key: "mintingCollectionState",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const mintingSelectedChipGroupState = atom<ChipGroupDto | null>({
    key: "mintingSelectedChipGroup",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const mintingSelectedChipsState = atom<ChipProps[] | null>({
    key: "mintingSelectedChips",
    default: null,
    effects_UNSTABLE: [persistAtom],
});

export const chainState = atom<Chain>({
    key: "chain",
    default: Chain.ETHEREUM,
    effects_UNSTABLE: [persistAtom],
});
