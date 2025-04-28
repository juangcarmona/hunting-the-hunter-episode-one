"use client";

import dynamic from "next/dynamic";

const HomepageContent = dynamic(
    () => import("@/components/homepage/HomepageContent"),
);

const Homepage = () => {
    return <HomepageContent />;
};

export default Homepage;
