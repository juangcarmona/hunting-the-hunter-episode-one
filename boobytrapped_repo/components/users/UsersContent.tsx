"use client";
import useEthereum from "@/hooks/useEthereum";
import { useMemo } from "react";
import Flex from "../common/Flex";

const UsersContent = () => {
    // const {} = useVechain()
    const { getCreatedCollections: getEthCollections } = useEthereum({
        chainId: 1,
    });
    const { getCreatedCollections: getPolygonCollections } = useEthereum({
        chainId: 137,
    });

    const collections = useMemo(async () => {
        const ethCollections = await getEthCollections();
    }, []);

    return <Flex>yo</Flex>;
};

export default UsersContent;
