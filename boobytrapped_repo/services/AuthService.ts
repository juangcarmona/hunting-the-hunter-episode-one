import { LoginRequestDto } from "@/dtos/login.dto";
import { ApiResult, RequestService } from "./RequestService";

export class LoginResponseDto {
    access_token: string;
}

export interface RegisterClientRequestDto {
    name: string;
    email: string;
    password: string;
    password2: string;
    companyName: string;
    activationCode: string;
}

export interface BaseError {
    error: string;
    message: string;
    statusCode: number;
}

export class AuthService extends RequestService {
    public static readonly ENDPOINTS = {
        LOGIN: "/auth/login",
        REGISTER_CLIENT: "/clients/register",
        CHECK: "/auth/me",
        VERIFY_EMAIL: "/auth/verify-email",
    };

    public static async login(data: LoginRequestDto) {
        const res = await this.fetch.post<ApiResult<LoginResponseDto>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.LOGIN}`,
            data,
        );

        if (
            res.ok &&
            res.data?.type === "success" &&
            res.data.json.access_token
        ) {
            RequestService.jwt = res.data.json.access_token;
        }

        return res;
    }

    public static async registerClient(data: RegisterClientRequestDto) {
        const res = await this.fetch.post<
            ApiResult<LoginResponseDto & BaseError>
        >(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.REGISTER_CLIENT}`,
            data,
        );

        return res;
    }

    public static async verifyEmail(code: string) {
        const res = await this.fetch.post<
            ApiResult<{ success: boolean } & BaseError>
        >(
            `${process.env.NEXT_PUBLIC_BE_URL}${
                this.ENDPOINTS.VERIFY_EMAIL
            }?${new URLSearchParams({ code }).toString()}`,
            {},
        );

        return res;
    }

    public static async check() {
        const res = await this.fetch.get<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.CHECK}`,
        );

        return res;
    }
}

export default AuthService;
