import { BaseError } from "@/services/AuthService";
import { ApiResult, RequestService } from "@/services/RequestService";

export interface Invitation {
    id: string;
    createdAt: Date;
    email: string;
}

export class InvitationsService extends RequestService {
    public static readonly ENDPOINTS = {
        CREATE: "/invitations",
        DELETE: "/invitations/:code",
        CHECK: "/invitations/:code",
    };

    public static async create(email: string) {
        const res = await this.fetch.post<ApiResult<Invitation & BaseError>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.CREATE}`,
            {
                email,
            },
        );

        return res;
    }

    public static async remove(code: string) {
        const res = await this.fetch.delete<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.DELETE.replace(
                ":code",
                code,
            )}`,
        );

        return res;
    }

    public static async check(code: string) {
        const res = await this.fetch.get<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.CHECK.replace(
                ":code",
                code,
            )}`,
        );

        return res;
    }
}

export default InvitationsService;
