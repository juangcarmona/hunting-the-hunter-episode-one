import { ApiResult, RequestService } from "./RequestService";

export class TemplateService extends RequestService {
    public static readonly ENDPOINTS = {
        CREATE: "/projects/:id/templates",
        DELETE_TEMPLATE: "/templates/:id",
        UPDATE_TEMPLATE: "/templates/:id",
        UPLOAD_TEMPLATE_MEDIA: "/templates/:id/medias",
        UPLOAD_HISTORY_MEDIA: "/templates/:id:/histories/:historyId/media",
        UPLOAD_VALUE_MEDIA: "/templates/:id:/values/:valueId/media",
        COPY_TEMPLATE_MEDIA: "/templates/:id/mediacopy",
        COPY_VALUE_MEDIA: "/templates/:id/valuecopy",
    };

    public static async deleteTemplate(id: string) {
        const res = await this.fetch.delete<ApiResult<void>>(
            `${
                process.env.NEXT_PUBLIC_BE_URL
            }${this.ENDPOINTS.DELETE_TEMPLATE.replace(":id", id)}`,
        );
        return res;
    }

    public static async copyTemplateMedia(id: string, data: Array<String>) {
        const res = await this.fetch.post<ApiResult<void>>(
            `${
                process.env.NEXT_PUBLIC_BE_URL
            }${this.ENDPOINTS.COPY_TEMPLATE_MEDIA.replace(":id", id)}`,
            data,
        );
        return res;
    }

    public static async copyTemplateValues(id: string, data: Array<String>) {
        const res = await this.fetch.post<ApiResult<void>>(
            `${
                process.env.NEXT_PUBLIC_BE_URL
            }${this.ENDPOINTS.COPY_VALUE_MEDIA.replace(":id", id)}`,
            data,
        );
        return res;
    }

    public static async update(projectId: string, data: any) {
        const res = await this.fetch.put<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.CREATE.replace(
                ":id",
                projectId,
            )}`,
            data,
        );

        return res;
    }

    public static async create(id: string, data: any) {
        const res = await this.fetch.post<ApiResult<any>>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.CREATE.replace(
                ":id",
                id,
            )}`,
            data,
        );

        return res;
    }

    public static async uploadTemplateMedia(id: string, data: FormData) {
        try {
            const res = await this.fetch.post<ApiResult<any>>(
                `${
                    process.env.NEXT_PUBLIC_BE_URL
                }${this.ENDPOINTS.UPLOAD_TEMPLATE_MEDIA.replace(":id", id)}`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            return res;
        } catch (error) {
            console.error("Error uploading template media:", error);
            throw error;
        }
    }

    public static async uploadUpdateTemplateMedia(id: string, data: FormData) {
        try {
            const res = await this.fetch.post<ApiResult<any>>(
                `${
                    process.env.NEXT_PUBLIC_BE_URL
                }${this.ENDPOINTS.UPLOAD_TEMPLATE_MEDIA.replace(":id", id)}`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            return res;
        } catch (error) {
            console.error("Error uploading template media:", error);
            throw error;
        }
    }

    public static async uploadHistoryMedia(
        id: string,
        historyId: string,
        data: FormData,
    ) {
        const res = await this.fetch.post<ApiResult<any>>(
            `${
                process.env.NEXT_PUBLIC_BE_URL
            }${this.ENDPOINTS.UPLOAD_HISTORY_MEDIA.replace(":id", id).replace(
                ":historyId",
                historyId,
            )}`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );

        return res;
    }

    public static async uploadValueMedia(
        id: string,
        valueId: string,
        data: FormData,
    ) {
        const res = await this.fetch.post<ApiResult<any>>(
            `${
                process.env.NEXT_PUBLIC_BE_URL
            }${this.ENDPOINTS.UPLOAD_VALUE_MEDIA.replace(":id", id).replace(
                ":valueId",
                valueId,
            )}`,
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
