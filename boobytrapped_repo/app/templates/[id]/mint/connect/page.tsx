"use client";

import Loader from "@/components/common/Loader";
import ConnectBlockchain from "@/components/profile/ConnectBlockchain";
import useConnect from "@/hooks/useConnect";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Connect = () => {
    const router = useRouter();
    const { isConnected } = useConnect();

    useEffect(() => {
        if (isConnected) {
            router.replace("collection");
        }
    }, [isConnected, router]);

    if (isConnected) return <Loader />;

    return <ConnectBlockchain isOpen={true} setIsOpen={() => true} />;
};

export default Connect;
