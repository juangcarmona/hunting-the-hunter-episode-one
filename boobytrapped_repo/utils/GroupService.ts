import { BaseError } from "@/services/AuthService";
import { ApiResult, RequestService } from "@/services/RequestService";

export interface ChipGroupDto {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    chipsCount: number;
}

export class GroupService extends RequestService {
    public static readonly ENDPOINTS = {
        CREATE: "/chips-group",
        DELETE: "/chips-group/:id",
    };

    public static async deleteGroup(id: string) {
        const res = await this.fetch.delete<
            ApiResult<ChipGroupDto & BaseError>
        >(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.DELETE.replace(
                ":id",
                id,
            )}`,
        );

        return res;
    }

    public static async createGroup(name: string, description?: string) {
        const res = await this.fetch.post<ApiResult<ChipGroupDto & BaseError>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.CREATE}`,
            {
                name,
                description,
            },
        );

        return res;
    }
}

export default GroupService;
