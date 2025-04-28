import { ApiResult, RequestService } from "./RequestService";

export class ProjectsService extends RequestService {
    public static readonly ENDPOINTS = {
        CHECK: "/projects",
        CREATE: "/projects",
        UPDATE: "/projects",
        DELETE: "/projects/:id",
    };

    public static async get() {
        const res = await this.fetch.get<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.CHECK}`,
        );

        return res;
    }

    public static async create(data: any) {
        const res = await this.fetch.post<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.CREATE}`,
            data,
        );

        return res;
    }

    public static async update(data: any) {
        const res = await this.fetch.put<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.UPDATE}`,
            data,
        );

        return res;
    }

    public static async delete(id: string) {
        const res = await this.fetch.delete<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.DELETE.replace(
                ":id",
                id,
            )}`,
        );

        return res;
    }
}
