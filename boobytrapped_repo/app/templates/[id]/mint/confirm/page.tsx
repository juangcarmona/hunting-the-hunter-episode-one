"use client";
import Box from "@/components/common/Box";
import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import MintPreview from "@/components/mint/MintPreview";
import MintStarted from "@/components/mint/MintStarted";
import MintSuccesful from "@/components/mint/MintSuccesful";
import ExitConfirmationModal from "@/components/templates_form/ExitConfirmationModal";
import { CHAINS } from "@/constants/chains";
import useBlockchain from "@/hooks/useBlockchain";
import { Ecosystem } from "@/hooks/useConnect";

import ChipService from "@/services/ChipService";
import MetadataService, {
    ImportStatusResponse,
} from "@/services/MetadataService";
import {
    chainState,
    mintingCollectionState,
    mintingSelectedChipGroupState,
    mintingSelectedChipsState,
} from "@/state/minting";
import { theme } from "@/styles/theme";
import { Chain } from "@/types/Chains";
import { useRouter } from "next/navigation";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import useSWR from "swr";

interface MintConfirmPageProps {
    params: {
        id: string;
    };
}

export interface TemplateProps {
    id: string;
    name: string;
    title: string;
    description: string;
    createdAt: Date;
    mintedCount: number;
    medias: {
        type: string;
        url: string;
    }[];
}

const MintConfirmPage: React.FC<MintConfirmPageProps> = ({
    params: { id: templateId },
}) => {
    const mintingCollection = useRecoilValue(mintingCollectionState);

    const collectionAddress = useMemo(
        () => mintingCollection?.value,
        [mintingCollection?.value],
    );

    const connectedChain = useRecoilValue(chainState);
    const ecosystem = useMemo(
        () =>
            connectedChain === Chain.VECHAIN
                ? Ecosystem.VECHAIN
                : Ecosystem.ETHEREUM,
        [connectedChain],
    );

    const metadataStatusIntervalId = useRef<any>(null);

    const router = useRouter();

    const chainId = useMemo(
        () =>
            CHAINS.find(
                (c) => c.name.toLowerCase() === connectedChain.toLowerCase(),
            )!.config.id,
        [connectedChain],
    );
    const { mint, waitForTokenIds } = useBlockchain({
        collectionAddress,
        ecosystem,
        chainId: Number(chainId),
    });

    const [isSigned, setIsSigned] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [isExitOpen, setIsExitOpen] = useState(false);
    const [importId, setImportId] = useState<string | null>(null);
    const [isMintingStarted, setIsMintingStarted] = useState(false);
    const [isMintingSuccess, setIsMintingSuccess] = useState(false);
    const [isMetadataUploaded, setIsMetadataUploaded] = useState(false);
    const [metadataUploadStatus, setMetadataUploadStatus] =
        useState<ImportStatusResponse | null>(null);
    const [metadataUrls, setMetadataUrls] = useState<string[]>([]);
    const [isMintingFailed, setIsMintingFailed] = useState(false);
    const [tokenId, setTokenId] = useState<string | null>(null);
    const { data: templateData, isLoading: loadingTemplate } = useSWR(
        `/templates/${templateId}`,
    );

    const template = useMemo<TemplateProps | null>(() => {
        if (!templateData) return null;
        return templateData.data?.json;
    }, [templateData]);

    const mintingChipGroup = useRecoilValue(mintingSelectedChipGroupState);
    const mintingChips = useRecoilValue(mintingSelectedChipsState);

    const mintCount = mintingChipGroup
        ? mintingChipGroup.chipsCount
        : mintingChips!.length;

    const startMinting = () => {
        setIsMintingStarted(true);
        toast.success("Minting process started");
        MetadataService.startImport({
            templateId,
            ...(mintingChipGroup?.id
                ? {
                      chipsGroupId: mintingChipGroup?.id,
                  }
                : {
                      chipsHashes: mintingChips?.map((chip) => chip.hash),
                  }),
        })
            .then((res) => {
                if (res.ok && res.data?.type == "success") {
                    setImportId(res.data.json.importId);
                } else {
                    toast.error(
                        `Error while uploading metadata, please try again`,
                    );
                    console.error(res);
                    setIsMintingStarted(false);
                }
            })
            .catch((err) => {
                toast.error("Error while uploading metadata, please try again");
                console.error(err);
                setIsMintingStarted(false);
            });
    };

    const checkImportStatus = useCallback(async () => {
        if (!importId) return;

        console.log("Checking import status", importId);

        const res = await MetadataService.getImportStatus(importId);
        if (res.ok && res.data?.type == "success") {
            setMetadataUploadStatus(res.data.json);
            setMetadataUrls(res.data.json.metadataUrls);
            if (res.data.json.status == "completed") {
                setIsMetadataUploaded(true);
                clearInterval(metadataStatusIntervalId.current!);
                return;
            }

            setTimeout(checkImportStatus, 1000);
        } else {
            toast.error(
                `Error while checking import status: ${res.data?.json.message}`,
            );
            console.error(res);
        }
    }, [importId]);

    // Check metadata import status
    useEffect(() => {
        if (!importId) return;
        if (!isMintingStarted) return;
        console.log("Checking import status");
        checkImportStatus();
    }, [checkImportStatus, importId, isMintingStarted]);

    const mintAndBind = useCallback(async () => {
        if (!isMetadataUploaded) return;
        if (!metadataUrls.length) return;
        if (isMinting) return;
        if (!collectionAddress) return;
        if (!mint) return;
        if (isMintingFailed) return;

        try {
            const finalUrls = metadataUrls.map((url) => {
                const txId = url.split("/").pop();
                return `https://arweave.net/${txId}`;
            });

            console.log("Minting urls:", finalUrls);

            setIsMinting(true);
            const signRes = await mint(finalUrls);
            setIsSigned(true);
            const tokenIds = await waitForTokenIds(signRes as any);

            if (tokenIds?.length == metadataUrls.length + 1) {
                // Remove last element
                tokenIds?.splice(-1, 1);
            }
            if (!tokenIds?.length) {
                toast.error("Error while minting smart tags, invalid tokenIds");
                return;
            }

            console.log("Binding minted smart tags", {
                tokenIds,
                tokenUris: metadataUrls,
                importId: importId!,
                smartContractAddress: collectionAddress,
                chainId: chainId,
            });
            const res = await ChipService.bindMintedChips({
                tokenIds,
                tokenUris: metadataUrls,
                importId: importId!,
                smartContractAddress: collectionAddress,
                chainId: chainId?.toString() || "",
            });
            if (res.status == 201) {
                setTokenId(tokenIds[0]);
                toast.success("Smart Tags successfully minted");
                setIsMintingSuccess(true);
            } else {
                toast.error("Error while binding minted smart tags");
                console.error(res);
            }
        } catch (err) {
            setIsMintingFailed(true);
            setIsMinting(false);
        }
    }, [
        chainId,
        collectionAddress,
        importId,
        isMetadataUploaded,
        isMinting,
        isMintingFailed,
        metadataUrls,
        mint,
        waitForTokenIds,
    ]);

    // Mint chips
    useEffect(() => {
        mintAndBind();
    }, [mintAndBind]);

    if (loadingTemplate)
        return (
            <Box
                width={450}
                p={20}
                borderRadius={20}
                backgroundColor={theme.colors.white}
            >
                Loading...
            </Box>
        );

    return (
        <Flex flexDirection="column">
            {isExitOpen && (
                <ExitConfirmationModal setIsExitOpen={setIsExitOpen} />
            )}
            <Box
                style={{
                    filter: isExitOpen ? "blur(2px)" : "none",
                    minWidth: 500,
                    minHeight: 500,
                }}
            >
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    p={20}
                >
                    <Button outline onClick={() => router.push("select-chips")}>
                        Back
                    </Button>
                    <Button outline onClick={() => setIsExitOpen(true)}>
                        Exit
                    </Button>
                </Flex>

                <Flex
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    p={20}
                    borderRadius={10}
                >
                    {!isMintingStarted || isMintingFailed ? (
                        <MintPreview
                            template={template}
                            isMintingFailed={isMintingFailed}
                            setIsMintingFailed={setIsMintingFailed}
                            startMinting={startMinting}
                        />
                    ) : (
                        <Box
                            width={450}
                            p={20}
                            borderRadius={20}
                            backgroundColor={theme.colors.white}
                        >
                            {!isMintingSuccess ? (
                                <MintStarted
                                    isMetadataUploaded={isMetadataUploaded}
                                    mintingLoadingEth={false} // this to change
                                    metadataUploadStatus={metadataUploadStatus}
                                    setIsMinting={setIsMinting}
                                    isSigned={isSigned}
                                    mintCount={mintCount}
                                />
                            ) : (
                                <MintSuccesful
                                    mintedChipsHashes={
                                        mintingChips
                                            ? mintingChips.map(
                                                  (chip) => chip.hash,
                                              )
                                            : []
                                    }
                                    collectionAddress={collectionAddress}
                                    tokenId={tokenId}
                                />
                            )}
                        </Box>
                    )}
                </Flex>
            </Box>
        </Flex>
    );
};

export default MintConfirmPage;
