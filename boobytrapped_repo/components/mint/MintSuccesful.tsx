import animationSuccess from "@/assets/lottie/success-animation.json";

import { CHAINS } from "@/constants/chains";
import useBlockchain from "@/hooks/useBlockchain";
import { Ecosystem } from "@/hooks/useConnect";
import ChipService from "@/services/ChipService";
import { chainState, mintingCollectionState } from "@/state/minting";
import { theme } from "@/styles/theme";
import { Chain } from "@/types/Chains";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import claimable from "../../assets/claimable.svg";
import tokenized from "../../assets/tokenized.svg";
import Button from "../common/Button";
import FlatLoader from "../common/FlatLoader";
import Flex from "../common/Flex";
import Spacer from "../common/Spacer";

interface MintSuccesfulProps {
    mintedChipsHashes?: string[];
    collectionAddress?: string;
    tokenId?: string | null;
}

const MintSuccesful = ({
    mintedChipsHashes,
    collectionAddress,
    tokenId,
}: MintSuccesfulProps) => {
    const router = useRouter();
    const connectedChain = useRecoilValue(chainState);
    const ecosystem = useMemo(
        () =>
            connectedChain === Chain.VECHAIN
                ? Ecosystem.VECHAIN
                : Ecosystem.ETHEREUM,
        [connectedChain],
    );

    const mintingCollection = useRecoilValue(mintingCollectionState);

    const chainId = useMemo(
        () =>
            CHAINS.find(
                (c) => c.name.toLowerCase() === connectedChain.toLowerCase(),
            )!.config.id,
        [connectedChain],
    );

    const { makeCollectionClaimable, getIsClaimable } = useBlockchain({
        collectionAddress: mintingCollection?.value,
        ecosystem,
        chainId: Number(chainId),
    });

    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const makeClaimable = async () => {
        // Smart contract address ->>> change visibility to hidden if inactive chip status. When user says "yes" to claimable
        if (mintedChipsHashes) {
            ChipService.updateChipClaimStatus({
                chipHashes: mintedChipsHashes,
                claimStatus: "Visible",
                collectionAddresses: [collectionAddress as string],
            });
        }
        if (!getIsClaimable || !makeCollectionClaimable) return;
        setIsLoading(true);
        const isClaimable = await getIsClaimable(tokenId || "0");
        if (!isClaimable) {
            await makeCollectionClaimable();
        }
        setIsLoading(false);
        setStep(1);
    };
    if (isLoading)
        return (
            <Flex justifyContent="center">
                <FlatLoader size={100} />
            </Flex>
        );
    return (
        <Flex
            justifyContent={"center"}
            flexDirection={"column"}
            alignItems={"center"}
        >
            {step === 0 && (
                <>
                    <Lottie
                        animationData={animationSuccess}
                        loop={false}
                        style={{ width: 150 }}
                    />

                    <h2>Items successfully tokenized!</h2>
                </>
            )}
            <Spacer y size={4} />
            <Flex
                justifyContent={"center"}
                flexDirection={"column"}
                border={step === 0 ? theme.colors.primary + "2px solid" : ""}
                borderRadius={step === 0 ? 20 : ""}
                p={20}
            >
                <p
                    style={{
                        color: theme.colors.primary,
                        fontWeight: "900",
                        fontSize: "18px",
                    }}
                >
                    <img
                        src={step === 0 ? claimable.src : tokenized.src}
                        style={{ paddingRight: "10px" }}
                    />
                    {step === 0
                        ? "Do you want to make it claimable?"
                        : "Do you need to tokenize more?"}
                </p>

                <Spacer y size={4} />

                <Flex justifyContent={"center"} rowGap={2}>
                    <Button
                        onClick={() => {
                            // Change the isClaimVisible to false, when user selects "No" to make it claimable (step === 0)
                            if (step === 0) {
                                mintedChipsHashes &&
                                    ChipService.updateChipClaimStatus({
                                        chipHashes: mintedChipsHashes,
                                        claimStatus: "Inactive",
                                    });
                            }
                            return step === 0
                                ? setStep(1)
                                : router.push("/admin/chips/used");
                        }}
                    >
                        No
                    </Button>

                    <Button
                        onClick={() =>
                            step === 0
                                ? makeClaimable()
                                : router.push("select-chips")
                        }
                    >
                        Yes
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default MintSuccesful;
