"use client";

import { CHAINS_BY_ID } from "@/constants/chains";
import { factoryContracts } from "@/constants/contracts";
import ERC721ABI from "@/contracts/ERC721ManifoldAbi.json";
import FACTORY_ABI from "@/contracts/FactoryAbi.json";
import { Chain } from "@/types/Chains";
import { tCollection } from "@/types/tCollection";
import {
    fetchEnsAddress,
    waitForTransaction,
    WriteContractResult,
} from "@wagmi/core";
import { BlockTag } from "alchemy-sdk";
import { useCallback, useMemo } from "react";
import { parseAbiItem } from "viem";
import { useAccount, useContractWrite, usePublicClient } from "wagmi";
import useAlchemySdk from "./useAlchemySdk";

interface useEthereumArgs {
    collectionAddress?: `0x${string}`;
    chainId?: number;
}

const useEthereum = ({ collectionAddress, chainId }: useEthereumArgs) => {
    const { address } = useAccount();

    const alchemySdk = useAlchemySdk();

    const chainName: Chain = useMemo(
        () => CHAINS_BY_ID[chainId || 1]?.name,
        [chainId],
    );

    const publicClient = usePublicClient({ chainId });
    const factoryContractAddresses = useMemo(
        () => factoryContracts[chainName!],
        [chainName],
    );

    const getOwnedCollections = useCallback(
        async (ownerAddress: string) => {
            // get all created collections
            const eventsPromise = factoryContractAddresses!.map(
                async (fcAddress) =>
                    await publicClient.getLogs({
                        address: fcAddress,
                        event: parseAbiItem(
                            "event CollectionCreated(address indexed ownerAddress, address indexed collectionAddress, uint32 indexed collectionId, string _name)",
                        ),
                        fromBlock: "earliest",
                        toBlock: "latest",
                        args: {},
                    }),
            );
            const events = (await Promise.all(eventsPromise)).flat();

            const createdCollections: { [address: string]: string } = {};
            events.forEach((event) => {
                const collection = event.args;
                createdCollections[
                    (collection.collectionAddress || "").toLowerCase()
                ] = collection._name || "";
            });

            let totalContracts: any[] = [];
            let pageKeyValue = "";
            do {
                const { contracts, pageKey }: any = await alchemySdk[
                    CHAINS_BY_ID[chainId || 1]?.name
                ].nft.getContractsForOwner(
                    ownerAddress,
                    pageKeyValue
                        ? {
                              pageKey: pageKeyValue,
                          }
                        : {},
                );
                pageKeyValue = pageKey;
                totalContracts = [...totalContracts, ...contracts];
            } while (pageKeyValue);

            const collections: tCollection[] = [];
            totalContracts.forEach((c: any) => {
                const contractAddress = c.address?.toLowerCase();
                const collectionName = createdCollections[contractAddress];

                if (collectionName === undefined) {
                    return;
                }

                collections.push({
                    address: contractAddress,
                    name: collectionName,
                    chainId: chainId || 1,
                    nfts: [],
                });
            });

            return collections;
        },
        [chainId, factoryContractAddresses, publicClient],
    );

    const getCreatedCollections = useCallback(
        async (onlyOwner?: boolean) => {
            const eventsPromise = factoryContractAddresses!.map(
                async (fcAddress) =>
                    await publicClient.getLogs({
                        address: fcAddress,
                        event: parseAbiItem(
                            "event CollectionCreated(address indexed ownerAddress, address indexed collectionAddress, uint32 indexed collectionId, string _name)",
                        ),
                        fromBlock: "earliest",
                        toBlock: "latest",
                        args: {
                            ownerAddress: onlyOwner ? address : null,
                        },
                    }),
            );
            const events = (await Promise.all(eventsPromise)).flat();

            return events.map((event) => {
                const collection = event.args;
                return {
                    label: collection._name,
                    value: collection.collectionAddress,
                };
            });
        },
        [address, factoryContractAddresses, publicClient],
    );

    const contractMintBatch = useContractWrite({
        address: collectionAddress,
        abi: ERC721ABI,
        functionName: "mintBaseBatch",
    });
    const setApprovalForAll = useContractWrite({
        address: collectionAddress,
        abi: ERC721ABI,
        functionName: "setApprovalForAll",
    });

    const deployProxy = useContractWrite({
        address: factoryContractAddresses?.[0],
        abi: FACTORY_ABI,
        functionName: "createCollection",
    });

    const getNftOwner = useCallback(
        async (tokenId: string) => {
            if (!collectionAddress) return null;
            const res = await alchemySdk[chainName].nft.getOwnersForNft(
                collectionAddress,
                tokenId,
            );
            return res.owners[0];
        },
        [alchemySdk, chainName, collectionAddress],
    );

    const getContractOwner = useCallback(async () => {
        const events = await publicClient.getLogs({
            address: collectionAddress,
            event: parseAbiItem(
                "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
            ),
            fromBlock: "earliest",
            toBlock: "latest",
            args: {},
        });
        return events.pop()?.args.newOwner;
    }, [collectionAddress, publicClient]);

    const getIsClaimable = useCallback(
        async (tokenId: string) => {
            if (!collectionAddress) return false;

            let retries = 0;
            const waitTimes = [1000, 2000, 4000, 8000];

            while (true) {
                try {
                    let startingBlock: bigint | BlockTag | undefined =
                        "earliest";
                    const [nftRes] = await Promise.all([
                        alchemySdk[chainName].nft.getOwnersForNft(
                            collectionAddress,
                            tokenId,
                        ),
                    ]);

                    const ownershipEvents = await publicClient.getLogs({
                        address: collectionAddress,
                        event: parseAbiItem(
                            "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
                        ),
                        fromBlock: startingBlock as any,
                        toBlock: "latest",
                        args: {},
                    });

                    // Update startingBlock for next call if events are found
                    if (ownershipEvents.length > 0) {
                        startingBlock = ownershipEvents[0].blockNumber as any;
                    }

                    const contractOwner = ownershipEvents.pop()?.args.newOwner;
                    const nftOwner = nftRes.owners[0];

                    if (nftOwner !== contractOwner) return false;

                    const approvalEvents = await publicClient.getLogs({
                        address: collectionAddress,
                        event: parseAbiItem(
                            "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
                        ),
                        fromBlock: "earliest",
                        toBlock: "latest",
                        args: {
                            operator: process.env
                                .NEXT_PUBLIC_CLAIM_ADDRESS as `0x${string}`,
                            owner: contractOwner,
                        },
                    });
                    return !!approvalEvents?.[0]?.args.approved;
                } catch (error) {
                    if (retries === waitTimes.length) {
                        throw new Error(
                            "Exceeded retry attempts for getOwnersForNft",
                        );
                    }
                    const waitTime = waitTimes[retries];
                    retries += 1;
                    console.log(
                        `Retrying getOwnersForNft after ${waitTime}ms due to rate limit (attempt ${retries})`,
                    );
                    await new Promise((resolve) =>
                        setTimeout(resolve, waitTime),
                    );
                }
            }
        },
        [alchemySdk, chainName, collectionAddress, publicClient],
    );
    const getAddressFromNameservice = useCallback(
        async (nameservice: string) => {
            if (nameservice?.endsWith(".eth")) {
                const address = await fetchEnsAddress({
                    chainId: 1,
                    name: nameservice,
                });
                return address;
            }
            return null;
        },
        [],
    );

    const getMintTxId = useCallback(
        async (tokenId: string) => {
            const mintEvents = await publicClient.getLogs({
                address: collectionAddress,
                event: parseAbiItem(
                    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
                ),
                fromBlock: "earliest",
                toBlock: "latest",
                args: {
                    from: `0x0000000000000000000000000000000000000000`,
                    tokenId: BigInt(tokenId),
                },
            });
            return mintEvents[0].transactionHash;
        },
        [collectionAddress, publicClient],
    );

    const mint = useCallback(
        async (finalUrls: string[]) => {
            const tx = await contractMintBatch.writeAsync({
                args: [address, finalUrls],
            });
            return tx;
        },
        [address, contractMintBatch],
    );

    const waitForTokenIds = useCallback(async (tx: WriteContractResult) => {
        const txReceipt = await waitForTransaction({
            hash: tx.hash,
        });
        const tokenIds = txReceipt.logs.map((log) =>
            Number(log.topics[3]).toString(),
        );

        return tokenIds;
    }, []);

    const createCollection = useCallback(
        async (name: string) => {
            const { hash } = await deployProxy.writeAsync({
                args: [name],
            });
            const receipt = await waitForTransaction({ hash });
            const collectionAddress = receipt.logs[0].address;
            return collectionAddress;
        },
        [deployProxy],
    );

    const makeCollectionClaimable = useCallback(async () => {
        const { hash } = await setApprovalForAll.writeAsync({
            args: [process.env.NEXT_PUBLIC_CLAIM_ADDRESS, true],
        });
        await waitForTransaction({ hash });
    }, [setApprovalForAll]);

    return {
        address,
        getNftOwner,
        getContractOwner,
        getIsClaimable,
        getAddressFromNameservice,
        getCreatedCollections,
        getMintTxId,
        mint,
        waitForTokenIds,
        createCollection,
        makeCollectionClaimable,
        getOwnedCollections,
    };
};

export default useEthereum;
