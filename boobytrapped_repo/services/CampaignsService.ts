import { RequestService } from "./RequestService";

export enum CampaignType {
    LOST = "LOST",
    STOLE = "STOLE",
    MESSAGE = "MESSAGE",
}

export interface Campaign {
    id: string;
    createdAt: Date;
    name: string;
    campaignType: CampaignType;
    campaignData: {
        [key: string]: any;
    };
}

export type CreateCampaignData = Omit<Campaign, "id" | "createdAt">;

export class CampaignsService extends RequestService {
    public static readonly ENDPOINTS = {
        CREATE: "/campaigns",
        GET: "/campaigns/{id}",
    };

    public static async create(data: CreateCampaignData) {
        const res = await this.fetch.post<any>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.CREATE}`,
            data,
        );

        return res;
    }

    public static async get(id: string) {
        const res = await this.fetch.get<Campaign>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.GET}`.replace(
                "{id}",
                id,
            ),
        );

        return res;
    }

    public static async update(id: string, data: any) {
        const res = await this.fetch.patch<any>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.GET}`.replace(
                "{id}",
                id,
            ),
            data,
        );

        return res;
    }

    public static async delete(id: string) {
        const res = await this.fetch.delete<any>(
            `${process.env.NEXT_PUBLIC_BE_URL}${this.ENDPOINTS.GET}`.replace(
                "{id}",
                id,
            ),
        );

        return res;
    }
}
