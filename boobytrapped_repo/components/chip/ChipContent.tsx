"use client";

import { useParams, useSearchParams } from "next/navigation";
import React from "react";
import useSWR from "swr";
import Box from "../common/Box";
import FlatLoader from "../common/FlatLoader";
import ChipBound from "./ChipBound";
import ChipUnbound from "./ChipUnbound";

interface ChipContentProps {
    isAuthenticateChip?: boolean;
}

const ChipContent: React.FC<ChipContentProps> = ({
    isAuthenticateChip: isAuthenticatedChip,
}) => {
    const params = useParams();
    const query = useSearchParams();

    const { data, isLoading, error } = useSWR(
        isAuthenticatedChip
            ? `${process.env.NEXT_PUBLIC_BE_URL}/chips/${
                  query.get("x")?.toString() || ""
              }?${new URLSearchParams({
                  isAuthenticateChip: "true",
                  e: query.get("e")?.toString() || "",
                  n: query.get("n")?.toString() || "",
              })}`
            : (`${process.env.NEXT_PUBLIC_BE_URL}/chips/${params.hash}` as string),
    );

    const errorMessage = React.useMemo<string | undefined>(() => {
        if (data?.data?.status < 200 || data?.status >= 300) {
            return data.data?.json?.message || error?.message;
        }
    }, [data, error?.message]);

    if (isLoading && !error)
        return <FlatLoader size={100} style={{ margin: "200px auto" }} />;

    return (
        <Box>
            {data?.data?.json.tokenData ? (
                <ChipBound
                    chipHash={data.data.json.hash}
                    claimStatus={data.data.json.claimStatus}
                    tokenData={data.data.json.tokenData}
                    customLogo={data.data.json.customLogo}
                    socials={data.data.json.socials}
                    campaign={data.data.json.campaign}
                />
            ) : (
                <ChipUnbound
                    serial={data?.data?.json.serial}
                    error={errorMessage}
                />
            )}
        </Box>
    );
};

export default ChipContent;
