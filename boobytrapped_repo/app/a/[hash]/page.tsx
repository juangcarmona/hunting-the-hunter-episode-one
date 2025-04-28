import ChipContent from "@/components/chip/ChipContent";
import { Metadata, ResolvingMetadata } from "next";

const FALLBACK_IMAGE = `https://marketplace.worldofv.art/img/world-of-v.jpg`;

const Chip = () => {
    return <ChipContent />;
};

export async function generateMetadata(
    { params }: { params: { hash: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const url = `${process.env.NEXT_PUBLIC_BE_URL}/chips/${params.hash}`;
    const res = await fetch(url).then((res) => res.json());
    return {
        title: res.tokenData?.name || "Chip",
        description: res.tokenData?.description || "",
        openGraph: {
            images: res.tokenData?.image || FALLBACK_IMAGE,
        },
    };
}

export default Chip;
