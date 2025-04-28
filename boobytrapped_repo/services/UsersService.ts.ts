import { ApiResult, RequestService } from "./RequestService";

export interface SocialSettingsData {
    [x: string]: any;

    getInTouchMessage?: string;
    claimLabel?: string;
    facebook?: string;
    x?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;

    verificationLabel?: string | null;
}

export interface GetSettingsResponse {
    customLogo: string;
    socials: SocialSettingsData;
}

export interface GetNewUserResponse {
    newUser: boolean;
}

export interface UpdateClientDomainData {
    domain: string;
}

export class UserService extends RequestService {
    public static readonly ENDPOINTS = {
        UPLOAD_LOGO: "/users/logo",
        GET_USER: "/users/me",
        GET_NEW_USER: "/users/new",
        UPDATE_SOCIALS: "/users/socials",
        SET_ENABLED: "/users/{id}/status",
        UPDATE_CLIENT_DOMAIN: "/clients/{clientId}/domain",
    };

    public static async getSettings() {
        const res = await this.fetch.get<ApiResult<GetSettingsResponse>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.GET_USER}`,
        );

        return res;
    }

    public static async getNewUser() {
        const res = await this.fetch.get<ApiResult<GetNewUserResponse>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.GET_NEW_USER}`,
        );

        return res;
    }

    public static async deleteLogo() {
        const res = await this.fetch.delete<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.UPLOAD_LOGO}`,
        );

        return res;
    }

    public static async uploadLogo(data: FormData) {
        const res = await this.fetch.post<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.UPLOAD_LOGO}`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );

        return res;
    }

    public static async updateSocials(data: SocialSettingsData) {
        const res = await this.fetch.post<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.UPDATE_SOCIALS}`,
            data,
        );

        return res;
    }

    public static async setEnabled(id: string, enabled: boolean) {
        const res = await this.fetch.post<ApiResult<any>>(
            `${
                process.env.NEXT_PUBLIC_BE_URL
            }${this.ENDPOINTS.SET_ENABLED.replace("{id}", id)}`,
            {
                enabled,
            },
        );

        return res;
    }

    public static async updateDomainSettings(
        clientId: string,
        data: UpdateClientDomainData,
    ) {
        const res = await this.fetch.post<ApiResult<any>>(
            `${
                process.env.NEXT_PUBLIC_BE_URL
            }${this.ENDPOINTS.UPDATE_CLIENT_DOMAIN.replace("{clientId}", clientId)}`,
            data,
        );

        return res;
    }
}

export default UserService;
