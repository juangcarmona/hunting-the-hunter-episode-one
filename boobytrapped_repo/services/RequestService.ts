import { ApisauceInstance, create } from "apisauce";
import { getCookie, setCookie } from "cookies-next";
import https from "https";
import _ from "lodash";
import { LOGIN_ROUTE } from "../utils/constants";
import { parseJWT } from "../utils/parseJWT";

export interface ApiError {
    error?: string;
    field?: string;
    message?: string;
}

export type ApiResult<T> =
    | { type: "error"; json: ApiError }
    | { type: "success"; json: T };

export class RequestService {
    private static API_URL = `${process.env.NEXT_PUBLIC_BE_URL}`;
    protected static JWT_TOKEN?: string = getCookie("jwt")?.toString();

    private static _api?: ApisauceInstance;

    public static logout() {
        RequestService.jwt = "";
        window.location.href = LOGIN_ROUTE;
    }

    public static get parsedJwt(): any {
        if (!this.JWT_TOKEN) return null;
        return parseJWT(this.JWT_TOKEN);
    }

    public static get fetch(): ApisauceInstance {
        if (!this._api) {
            this._api = create({
                baseURL: this.API_URL,
                headers: {
                    "Content-Type": "application/json",
                    ...(this.JWT_TOKEN
                        ? { Authorization: `Bearer ${this.JWT_TOKEN}` }
                        : {}),
                },
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false,
                }),
            });

            this._api.addResponseTransform((res) => {
                if (
                    res.data &&
                    res.headers?.["content-type"].startsWith("application/json")
                ) {
                    const json = _.cloneDeep(res.data);
                    const type =
                        !res.ok || res.data.hasOwnProperty("error")
                            ? "error"
                            : "success";

                    delete res.data;

                    res.data = { type, json };
                }
            });

            this._api.addResponseTransform((res) => {
                if (res.config?.url?.includes("/auth/login")) return;
                if (res.status === 401) {
                    this.jwt = "";
                    window.location.href = LOGIN_ROUTE;
                }
            });
        }

        return this._api;
    }

    public static set jwt(value: string) {
        setCookie("jwt", value);

        this.JWT_TOKEN = value;
        this.fetch.setHeader("Authorization", `Bearer ${this.JWT_TOKEN}`);
    }
}
