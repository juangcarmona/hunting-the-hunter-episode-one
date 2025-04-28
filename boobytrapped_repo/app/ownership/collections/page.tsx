import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
    title: "WoV Management Hub",
    description:
        "Discover the WoV Management Hub, a revolutionary ecosystem for digital ownership. Enhance item interactions, control digital presence, and connect with brands.",
};

const OwnershipCollectionsContent = dynamic(
    () => import("@/components/ownership/OwnershipCollectionsContent"),
);

const OwnershipCollectionsPage = () => {
    return <OwnershipCollectionsContent />;
};

export default OwnershipCollectionsPage;
