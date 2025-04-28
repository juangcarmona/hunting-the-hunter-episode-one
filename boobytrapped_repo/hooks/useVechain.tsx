"use client";

import ERC721_ABI from "@/contracts/ERC721ManifoldAbi.json";
import FACTORY_ABI from "@/contracts/FactoryAbi.json";
import VNS_ABI from "@/contracts/VnsAbi.json";
import { GET_OWNED_COLLECTIONS } from "@/lib/graphql/getOwnedCollections";
import { useWeb3AuthVechain } from "@/providers/Web3AuthVechainProvider";
import BlockchainService from "@/services/BlockchainService";
import { tCollection } from "@/types/tCollection";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useConnex } from "@vechain/dapp-kit-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import useBlockchainRequests from "./useBlockchainRequests";
import { Ecosystem } from "./useConnect";
import useVechainDappkit from "./useVechainDappkit";

enum ConnectionService {
    VECHAIN = "vechain",
    WEB3AUTH = "web3auth",
}
interface useVechainArgs {
    ecosystem: Ecosystem;
    collectionAddress?: `0x${string}`;
}

const FACTORY_CONTRACT_ADDRESS = "0x697b70F0Ec7157b4Cd786A3D57c8E0769A9c1155";
const VNS_CONTRACT_ADDRESS = "0xA11413086e163e41901bb81fdc5617c975Fa5a1A";

const useVechain = ({ collectionAddress, ecosystem }: useVechainArgs) => {
    const { web3AuthVechain, isConnected: isSocialConnected } =
        useWeb3AuthVechain();
    const { address: dappkitAddress, sign } = useVechainDappkit();

    const [address, setAddress] = useState(dappkitAddress);

    const setWeb3AuthAddress = useCallback(async () => {
        if (isSocialConnected && web3AuthVechain) {
            const wallet = await web3AuthVechain.getWallet();
            const address = wallet.address as `0x${string}`;
            setAddress(address);
        }
    }, [isSocialConnected, web3AuthVechain]);

    useEffect(() => {
        setWeb3AuthAddress();
    }, [setWeb3AuthAddress]);

    const connectionService = useMemo(() => {
        if (isSocialConnected) return ConnectionService.WEB3AUTH;
        else if (ecosystem === Ecosystem.VECHAIN)
            return ConnectionService.VECHAIN;
        return null;
    }, [ecosystem, isSocialConnected]);

    const { onCheckTxRequest, onCheckTxResponse, onCheckTxError } =
        useBlockchainRequests();

    const { thor } = useConnex();

    const waitForTransaction = useCallback(
        async (txID: string, iterations = 5) => {
            onCheckTxRequest(txID);
            try {
                const ticker = thor.ticker();
                for (let i = 0; ; i++) {
                    if (i >= iterations) {
                        throw new Error("Transaction not found.");
                    }
                    await ticker.next();
                    const receipt = await thor.transaction(txID).getReceipt();
                    if (receipt?.reverted) {
                        throw new Error("The transaction has been reverted.");
                    }
                    if (receipt) {
                        onCheckTxResponse(txID);
                        return receipt;
                    }
                }
            } catch (error) {
                onCheckTxError(txID, error);
            }
        },
        [onCheckTxError, onCheckTxRequest, onCheckTxResponse, thor],
    );

    const getMethods = useCallback(
        (abi: any[], address: string) => {
            const methods: Record<string, any> = {};

            for (const item of abi) {
                if (item.name && item.type === "function") {
                    methods[item.name] = thor.account(address).method(item);
                }
            }

            return methods;
        },
        [thor],
    );

    const getEvents = useCallback(
        (abi: any[], address: string) => {
            const events: Record<string, any> = {};

            for (const item of abi) {
                if (item.name && item.type === "event") {
                    events[item.name] = thor.account(address).event(item);
                }
            }
            return events;
        },
        [thor],
    );

    const getContract = useCallback(
        (abi: any[], address: string) => {
            const methods = getMethods(abi, address);
            const events = getEvents(abi, address);
            return {
                methods,
                events,
            };
        },
        [getEvents, getMethods],
    );

    const factoryContract = useMemo(
        () => getContract(FACTORY_ABI, FACTORY_CONTRACT_ADDRESS),
        [getContract],
    );

    const getOwnedCollections = useCallback(
        async (ownerAddress: string) => {
            // get created collections
            const promiseCreatedCollections =
                factoryContract.events.CollectionCreated?.filter([
                    { address: FACTORY_CONTRACT_ADDRESS },
                ]) //pass proper types
                    .order("desc")
                    .range({
                        unit: "time",
                        from: 0,
                        to: Math.floor(Date.now() / 1000),
                    })
                    .apply(0, 256); // max limit

            // get owned nfts
            const apolloClient = new ApolloClient({
                uri: "https://mainnet.api.worldofv.art/graphql",
                cache: new InMemoryCache(),
            });

            // components/somewhere.ts
            const promiseOwnedCollections = apolloClient.query({
                query: GET_OWNED_COLLECTIONS,
                variables: {
                    ownerAddress,
                },
            });

            const values = await Promise.all([
                promiseCreatedCollections,
                promiseOwnedCollections,
            ]);

            const latestEvents: any[] = values[0];
            const createdCollections: { [address: string]: string } = {};
            latestEvents?.forEach(
                (event) =>
                    (createdCollections[
                        event.decoded.collectionAddress?.toLowerCase() || ""
                    ] = event.decoded._name),
            );

            // components/somewhere.ts
            const result = values[1];

            const collections: tCollection[] = [];

            result?.data?.collections?.forEach((c: any) => {
                const contractAddress = c.smartContractAddress?.toLowerCase();
                const collectionName = createdCollections[contractAddress];

                if (collectionName === undefined) {
                    return;
                }

                collections.push({
                    address: contractAddress,
                    name: collectionName,
                    chainId: 100009,
                    nfts: [],
                });
            });

            return collections;
        },
        [address],
    );

    const getCreatedCollections = useCallback(
        async (onlyOwner?: boolean) => {
            if (onlyOwner && !address) return;
            const latestEvents: any[] =
                await factoryContract.events.CollectionCreated?.filter([
                    { ownerAddress: onlyOwner ? address : null },
                ]) //pass proper types
                    .order("desc")
                    .range({
                        unit: "time",
                        from: 0,
                        to: Math.floor(Date.now() / 1000),
                    })
                    .apply(0, 256); // max limit

            return latestEvents?.map((event) => ({
                label: event.decoded._name,
                value: event.decoded.collectionAddress,
            }));
        },
        [address, factoryContract.events.CollectionCreated],
    );

    const vnsContract = useMemo(
        () => getContract(VNS_ABI, VNS_CONTRACT_ADDRESS),
        [getContract],
    );
    const collectionContract = useMemo(
        () =>
            collectionAddress
                ? getContract(ERC721_ABI, collectionAddress)
                : null,
        [collectionAddress, getContract],
    );

    const getNftOwner = useCallback(
        async (tokenId: string) => {
            const res = await collectionContract?.methods.ownerOf.call(tokenId);
            const tokenOwner = res?.decoded[0];
            return tokenOwner;
        },
        [collectionContract?.methods.ownerOf],
    );

    const getContractOwner = useCallback(async () => {
        const events =
            await collectionContract?.events.OwnershipTransferred.filter([{}]) //pass proper types
                .order("asc")
                .range({
                    unit: "time",
                    from: 0,
                    to: Math.floor(Date.now() / 1000),
                })
                .apply(0, 256); // max limit
        return events?.pop()?.decoded.newOwner;
    }, [collectionContract?.events.OwnershipTransferred]);

    const getIsClaimable = useCallback(
        async (tokenId: string) => {
            const [nftOwner, contractOwner] = await Promise.all([
                getNftOwner(tokenId),
                getContractOwner(),
            ]);
            if (nftOwner !== contractOwner) return false;
            const events =
                await collectionContract?.events.ApprovalForAll.filter([
                    {
                        operator: process.env.NEXT_PUBLIC_CLAIM_ADDRESS_VECHAIN,
                        owner: contractOwner,
                    },
                ]) //pass proper types
                    .order("asc")
                    .range({
                        unit: "time",
                        from: 0,
                        to: Math.floor(Date.now() / 1000),
                    })
                    .apply(0, 256); // max limit
            return !!events?.[0]?.decoded.approved;
        },
        [
            collectionContract?.events.ApprovalForAll,
            getContractOwner,
            getNftOwner,
        ],
    );

    const getAddressFromNameservice = useCallback(
        async (nameservice: string) => {
            if (nameservice?.endsWith(".vet")) {
                const res = await vnsContract.methods.getAddresses.call([
                    nameservice,
                ]);
                const address = res.decoded.addresses[0];
                if (!!Number(address)) return address;
            }
            return null;
        },
        [vnsContract.methods.getAddresses],
    );

    const getMintTxId = useCallback(
        async (tokenId: string) => {
            const mintEvents = await collectionContract?.events.Transfer.filter(
                [
                    {
                        from: `0x0000000000000000000000000000000000000000`,
                        tokenId,
                    },
                ],
            ) //pass proper types
                .order("asc")
                .range({
                    unit: "time",
                    from: 0,
                    to: Math.floor(Date.now() / 1000),
                })
                .apply(0, 1);

            return mintEvents[0].meta.txID;
        },
        [collectionContract?.events.Transfer],
    );

    const transfer = useCallback(
        async (
            collectionAddress: `0x${string}`,
            tokenId: string,
            from: `0x${string}`,
            to: string | undefined,
        ) => {
            const collection = collectionAddress
                ? getContract(ERC721_ABI, collectionAddress)
                : null;
            const clauses = [
                collection?.methods.transferFrom.asClause(from, to, tokenId),
            ];
            let txHash;
            if (connectionService === ConnectionService.VECHAIN) {
                txHash = await sign(clauses, "transfer tokens");
            }
            if (connectionService == ConnectionService.WEB3AUTH) {
                const tx = await web3AuthVechain?.signTransaction(clauses);
                txHash = tx?.txid;
            }
            await waitForTransaction(txHash);
            return txHash;
        },
        [sign, getContract, waitForTransaction, connectionService],
    );

    const mint = useCallback(
        async (finalUrls: string[]) => {
            const clauses = [
                collectionContract?.methods.mintBaseBatch.asClause(
                    address,
                    finalUrls,
                ),
            ];
            let txHash;
            if (connectionService === ConnectionService.VECHAIN) {
                txHash = await sign(clauses, "mint tokens");
            }
            if (connectionService == ConnectionService.WEB3AUTH) {
                const tx = await web3AuthVechain?.signTransaction(clauses);
                txHash = tx?.txid;
            }
            return txHash as string;
        },
        [
            address,
            collectionContract?.methods.mintBaseBatch,
            connectionService,
            sign,
            web3AuthVechain,
        ],
    );

    const waitForTokenIds = useCallback(
        async (txHash: string) => {
            const txReceipt = await waitForTransaction(txHash);
            const tokenIds: string[] = txReceipt.outputs[0].events.map(
                (log: { topics: any[] }) => Number(log.topics[3]).toString(),
            );
            return tokenIds;
        },
        [waitForTransaction],
    );

    const createCollection = useCallback(
        async (name: string) => {
            let txId;
            if (isSocialConnected) {
                const tx = await web3AuthVechain?.signTransaction([
                    factoryContract.methods.createCollection.asClause(name),
                ]);
                txId = tx?.txid;
            } else {
                txId = await sign(
                    [factoryContract.methods.createCollection.asClause(name)],
                    "create a collection",
                );
            }
            const receipt = await waitForTransaction(txId);
            await BlockchainService.importCollection(
                name,
                receipt?.outputs?.[0]?.events?.[0].address,
                receipt?.meta.txOrigin,
            );
            const collectionAddress =
                receipt?.outputs?.[0]?.events?.[0].address.toString();
            return collectionAddress as Promise<`0x${string}`>;
        },
        [
            factoryContract.methods.createCollection,
            isSocialConnected,
            sign,
            waitForTransaction,
            web3AuthVechain,
        ],
    );

    const makeCollectionClaimable = useCallback(async () => {
        let txId;
        if (isSocialConnected) {
            const tx = await web3AuthVechain?.signTransaction([
                collectionContract?.methods.setApprovalForAll.asClause(
                    process.env.NEXT_PUBLIC_CLAIM_ADDRESS_VECHAIN,
                    true,
                ),
            ]);
            txId = tx?.txid;
        } else {
            txId = await sign(
                [
                    collectionContract?.methods.setApprovalForAll.asClause(
                        process.env.NEXT_PUBLIC_CLAIM_ADDRESS_VECHAIN,
                        true,
                    ),
                ],
                "make tokens claimable",
            );
        }
        await waitForTransaction(txId);
    }, [
        collectionContract?.methods.setApprovalForAll,
        isSocialConnected,
        sign,
        waitForTransaction,
        web3AuthVechain,
    ]);

    return {
        address: address as `0x${string}` | undefined,
        waitForTransaction,
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
        transfer,
    };
};

export default useVechain;
