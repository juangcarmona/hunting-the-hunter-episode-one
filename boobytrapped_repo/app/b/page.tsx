import ChipContent from "@/components/chip/ChipContent";
import { Metadata } from "next";

//TODO: pass dynamic metadata
export const metadata: Metadata = {
    title: "Smart Tag | WoV Labs",
    description: "See your smart tag page on WoV Labs",
};

const Chip = () => {
    return <ChipContent isAuthenticateChip />;
};

export default Chip;
