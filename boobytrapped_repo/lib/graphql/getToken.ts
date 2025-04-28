import { gql } from "@apollo/client";

export const GET_TOKEN = gql`
    fragment Asset on AssetDTO {
        size
        url
        mimeType
    }

    fragment AggregatedTokenCollection on CollectionDTO {
        collectionId
        blockchainId
        smartContractAddress
        stakingContractAddresses
        creatorAddress
        name
        customUrl
        thumbnailImageUrl
        isVerified
        isVisible
        type
        importedAt
    }

    fragment AggregatedTokenCreator on User {
        address
        name
        customUrl
        blacklisted
        verified
        verifiedLevel

        assets {
            ...Asset
        }
    }

    fragment AggregatedToken on AggregatedToken {
        tokenId
        smartContractAddress
        name
        description
        creatorAddress
        editionsCount
        royalty
        mintedAt
        attributes
        score
        rank
        stakingEarnings
        animationUrl
        collection {
            ...AggregatedTokenCollection
        }
        creator {
            ...AggregatedTokenCreator
        }
        assets {
            ...Asset
        }
    }

    query GetToken($tokenId: String!, $smartContractAddress: String!) {
        token: getToken(
            tokenId: $tokenId
            smartContractAddress: $smartContractAddress
        ) {
            ...AggregatedToken
        }
    }
`;
