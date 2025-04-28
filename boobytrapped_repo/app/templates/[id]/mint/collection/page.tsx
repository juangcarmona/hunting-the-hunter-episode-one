"use client";

import SelectCollection from "@/components/templates_form/SelectCollection";
import useConnect from "@/hooks/useConnect";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SelectCollectionPage = () => {
    const router = useRouter();
    const { isConnected } = useConnect();

    useEffect(() => {
        if (isConnected === false) {
            router.replace("connect");
        }
    }, [isConnected, router]);

    return <SelectCollection />;
};

export default SelectCollectionPage;
