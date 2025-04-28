import { ApiResult, RequestService } from "./RequestService";

interface BindMintedChipsRequest {
    importId: string;
    tokenUris: string[];
    tokenIds: string[];
    smartContractAddress: string;
    chainId: string;
}

interface ChipsClaimVisibilityChange {
    chipsHashes?: string[];
    visibilityStatus: boolean;
}

interface ChipsClaimStatusUpdate {
    chipHashes: string[];
    claimStatus: string;
    collectionAddresses?: string[];
}

interface GenerateQRCodesRequest {
    count: number;
    clientId?: string;
}

export interface SetChipCampaignRequest {
    hashes: string[];
    campaignId: string | null;
}

export class ChipService extends RequestService {
    public static readonly ENDPOINTS = {
        ASSIGN_TO_CLIENT: "/chips/assign",
        ASSIGN_TO_GROUP: "/chips/assign-to-group",
        BIND_MINTED_CHIPS: "/chips/batch-bind",
        GENERATE_QR_CODES: "/chips/generate-qr",
        UNLINK_CHIP: "/chips/{hash}/unlink",
        SET_CAMPAIGN: "/chips/campaign",
        CHANGE_CHIPS_CLAIM_VISIBILITY: "/chips/change-chips-claim-visibility",
        UPDATE_CHIPS_CLAIM_STATUS: "/chips/claim",
    };

    public static async setChipCampaign(data: SetChipCampaignRequest) {
        const res = await this.fetch.post<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.SET_CAMPAIGN}`,
            data,
        );

        return res;
    }

    public static async unlinkChip(hash: string) {
        const res = await this.fetch.post<ApiResult<any>>(
            `${
                process.env.NEXT_PUBLIC_BE_URL
            }${this.ENDPOINTS.UNLINK_CHIP.replace("{hash}", hash)}`,
        );

        return res;
    }

    public static async assignToClient(
        hashes: string[],
        clientId: string | null,
    ) {
        const res = await this.fetch.post<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${
                this.ENDPOINTS.ASSIGN_TO_CLIENT
            }?${
                clientId
                    ? new URLSearchParams({
                          clientId,
                      }).toString()
                    : ""
            }`,
            {
                hashes,
            },
        );

        return res;
    }

    public static async assignToGroup(
        hashes: string[],
        groupId: string | null,
    ) {
        const res = await this.fetch.post<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.ASSIGN_TO_GROUP}`,
            {
                hashes,
                groupId,
            },
        );

        return res;
    }

    public static async bindMintedChips(data: BindMintedChipsRequest) {
        const res = await this.fetch.post<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.BIND_MINTED_CHIPS}`,
            data,
        );

        return res;
    }

    public static async updateChipClaimStatus(data: ChipsClaimStatusUpdate) {
        const res = await this.fetch.put<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.UPDATE_CHIPS_CLAIM_STATUS}`,
            data,
        );

        return res;
    }

    public static async generateQRCodes(data: GenerateQRCodesRequest) {
        const res = await this.fetch.post<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.GENERATE_QR_CODES}`,
            data,
        );

        return res;
    }
}

export default ChipService;
