import { useMemo } from "react";
import { Ecosystem } from "./useConnect";
import useEthereum from "./useEthereum";
import useVechain from "./useVechain";

interface useBlockChainArgs {
    ecosystem: Ecosystem;
    collectionAddress?: `0x${string}`;
    chainId?: number;
}

const useBlockchain = ({
    collectionAddress,
    ecosystem,
    chainId,
}: useBlockChainArgs) => {
    const {
        address: vechainAddress,
        getNftOwner: vechainGetNftOwner,
        getContractOwner: vechainGetContractOwner,
        getIsClaimable: vechainGetIsClaimable,
        getAddressFromNameservice: getaddressFromVns,
        getCreatedCollections: vechainGetCreatedCollections,
        getMintTxId: vechainGetMintTxId,
        mint: vechainMint,
        waitForTokenIds: vechainWaitForTokenIds,
        createCollection: vechainCreateCollection,
        makeCollectionClaimable: vechainMakeClaimable,
    } = useVechain({ collectionAddress, ecosystem });

    const {
        address: ethAddress,
        getNftOwner: ethGetNftOwner,
        getContractOwner: ethGetContractOwner,
        getIsClaimable: ethGetIsClaimable,
        getAddressFromNameservice: getaddressFromEns,
        getCreatedCollections: ethGetCreatedCollections,
        getMintTxId: ethGetMintTxId,
        mint: ethMint,
        waitForTokenIds: ethWaitForTokenIds,
        createCollection: ethCreateCollection,
        makeCollectionClaimable: ethMakeClaimable,
    } = useEthereum({ collectionAddress, chainId });

    const returnValue = useMemo(() => {
        if (ecosystem === Ecosystem.VECHAIN) {
            return {
                address: vechainAddress,
                getNftOwner: vechainGetNftOwner,
                getContractOwner: vechainGetContractOwner,
                getIsClaimable: vechainGetIsClaimable,
                getAddressFromNameservice: getaddressFromVns,
                getCreatedCollections: vechainGetCreatedCollections,
                getMintTxId: vechainGetMintTxId,
                mint: vechainMint,
                waitForTokenIds: vechainWaitForTokenIds,
                createCollection: vechainCreateCollection,
                makeCollectionClaimable: vechainMakeClaimable,
            };
        }

        return {
            address: ethAddress,
            getContractOwner: ethGetContractOwner,
            getNftOwner: ethGetNftOwner,
            getIsClaimable: ethGetIsClaimable,
            getAddressFromNameservice: getaddressFromEns,
            getCreatedCollections: ethGetCreatedCollections,
            getMintTxId: ethGetMintTxId,
            mint: ethMint,
            waitForTokenIds: ethWaitForTokenIds,
            createCollection: ethCreateCollection,
            makeCollectionClaimable: ethMakeClaimable,
        };
    }, [
        ecosystem,
        ethAddress,
        ethCreateCollection,
        ethGetContractOwner,
        ethGetCreatedCollections,
        ethGetIsClaimable,
        ethGetMintTxId,
        ethGetNftOwner,
        ethMakeClaimable,
        ethMint,
        ethWaitForTokenIds,
        getaddressFromEns,
        getaddressFromVns,
        vechainAddress,
        vechainCreateCollection,
        vechainGetContractOwner,
        vechainGetCreatedCollections,
        vechainGetIsClaimable,
        vechainGetMintTxId,
        vechainGetNftOwner,
        vechainMakeClaimable,
        vechainMint,
        vechainWaitForTokenIds,
    ]);

    return { ...returnValue };
};

export default useBlockchain;
