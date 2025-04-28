import { gql } from "@apollo/client";

export const GET_TOKENS = gql`
    query GetTokens(
        $ownerAddress: String
        $smartContractAddress: String
        $page: Int!
        $perPage: Int!
    ) {
        tokens(
            pagination: { perPage: $perPage, page: $page }
            filters: {
                ownerAddress: $ownerAddress
                smartContractAddress: $smartContractAddress
            }
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
