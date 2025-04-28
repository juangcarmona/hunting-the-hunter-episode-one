import { BaseError } from "./AuthService";
import { ApiResult, RequestService } from "./RequestService";

interface ImportMetadataRequest {
    templateId: string;
    chipsGroupId?: string;
    chipsHashes?: string[];
}

interface ImportMetadataResponse {
    importId: string;
}

export interface ImportStatusResponse {
    totalJobs: number;
    completedJobs: number;
    failedJobs: number;
    status: string;
    metadataUrls: string[];
}

export class MetadataService extends RequestService {
    public static readonly ENDPOINTS = {
        START_IMPORT: "/metadata/import",
        IMPORT_STATUS: "/metadata/import/{importId}",
    };

    public static async startImport(data: ImportMetadataRequest) {
        const res = await this.fetch.post<
            ApiResult<ImportMetadataResponse & BaseError>
        >(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.START_IMPORT}`,
            data,
        );

        return res;
    }

    public static async getImportStatus(importId: string) {
        const res = await this.fetch.get<
            ApiResult<ImportStatusResponse & BaseError>
        >(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.IMPORT_STATUS}`.replace(
                "{importId}",
                importId,
            ),
        );

        return res;
    }
}

export default MetadataService;
