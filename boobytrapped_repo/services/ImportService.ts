import { ApiResult, RequestService } from "./RequestService";

interface ImportCsvResponseDto {
    added: number;
}

export class ImportService extends RequestService {
    public static readonly ENDPOINTS = {
        IMPORT: "/chips/import",
    };

    public static async import(data: FormData) {
        const res = await this.fetch.post<ApiResult<ImportCsvResponseDto>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.IMPORT}`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );

        return res;
    }
}

export default ImportService;
