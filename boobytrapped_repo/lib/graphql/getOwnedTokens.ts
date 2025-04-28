import { gql } from "@apollo/client";

export const GET_OWNED_TOKENS = gql`
    query GetTokens($ownerAddress: String!, $page: Int!, $perPage: Int!) {
        tokens(
            pagination: { perPage: $perPage, page: $page }
            filters: { ownerAddress: $ownerAddress }
        ) {
            items {
                name
                tokenId
                smartContractAddress
                attributes
                assets {
                    mimeType
                    size
                    url
                }
            }
            meta {
                total
            }
        }
    }
`;
