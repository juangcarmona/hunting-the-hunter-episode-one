import { gql } from "@apollo/client";

export const GET_OWNED_COLLECTIONS = gql`
    query GetOwnedWoVCollections($ownerAddress: String) {
        collections: getWoVCollections(ownerAddress: $ownerAddress) {
            collectionId
            name
            stakingContractAddresses
            customUrl
            thumbnailImageUrl
            isVerified
            smartContractAddress
        }
    }
`;
