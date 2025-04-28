"use client";

import { RequestService } from "@/services/RequestService";
import { SWRConfig } from "swr";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig
            value={{
                fetcher: RequestService.fetch.get,
                revalidateOnFocus: false,
                revalidateOnReconnect: false,
            }}
        >
            {children}
        </SWRConfig>
    );
}
