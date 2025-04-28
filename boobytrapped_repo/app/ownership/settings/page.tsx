import { Metadata } from "next";
import dynamic from "next/dynamic";

const OwnershipSettingsContent = dynamic(
    () => import("@/components/ownership/OwnershipSettingsContent"),
);

export const metadata: Metadata = {
    title: "WoV Management Hub",
    description:
        "Discover the WoV Management Hub, a revolutionary ecosystem for digital ownership. Enhance item interactions, control digital presence, and connect with brands.",
};

const OwnershipSettingsPage = () => {
    return <OwnershipSettingsContent />;
};

export default OwnershipSettingsPage;
