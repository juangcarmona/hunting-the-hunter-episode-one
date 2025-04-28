import { ApiResult, RequestService } from "./RequestService";

export class BlockchainService extends RequestService {
    public static readonly ENDPOINTS = {
        CLAIM: "/blockchain/claim",
        IMPORT_COLLECTION: "/blockchain/import-collection-wov",
    };

    public static async claim(
        code: string,
        address: `0x${string}`,
        ecosystem: string,
    ) {
        const res = await this.fetch.post<ApiResult<any>>( // pass proper interface
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.CLAIM}`,
            {
                code,
                address,
                ecosystem,
            },
        );

        return res;
    }

    public static async importCollection(
        name: string,
        smartContractAddress: `0x${string}`,
        creatorAddress: `0x${string}`,
    ) {
        const res = await this.fetch.post<ApiResult<any>>( // pass proper interface
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.IMPORT_COLLECTION}`,
            {
                name,
                smartContractAddress,
                creatorAddress,
            },
        );

        return res;
    }
}

export default BlockchainService;
