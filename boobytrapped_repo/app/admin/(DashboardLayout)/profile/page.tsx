"use client";

import dynamic from "next/dynamic";

const ProfileContent = dynamic(
    () => import("@/components/profile/ProfileContent"),
);

const ProfilePage = () => {
    return <ProfileContent />;
};

export default ProfilePage;
