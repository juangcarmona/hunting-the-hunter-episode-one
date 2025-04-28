import axios from "axios";
import { toast } from "react-toastify";

export const createReportData = async (
    label: string,
    user: any,
    token: string,
    type: string,
    contractAddress: string,
    tokenId: string,
    chainId: number,
    chipId: string,
) => {
    if (!user?.email) {
        toast.warn("Please register profile first");
        return null;
    }

    try {
        const createCampaignDto = {
            name: label,
            campaignType: type,
            campaignData: {
                campaignDescription: `This item has been ${type === "LOST" ? "lost" : "stolen"}. Please contact the owner to return it.`,
                campaignName: "Lost campaign",
                contactType: "email",
                contact: user.email,
                contact1: user.phone,
                chainId: chainId,
                contractAddress: contractAddress,
                tokenId: tokenId,
            },
        };
        const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_BE_URL}/campaigns`,
            createCampaignDto,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        const campaignId = data.id;
        const { data: data1 } = await axios.post(
            `${process.env.NEXT_PUBLIC_BE_URL}/chips/campaign-nfc`,
            {
                hashes: [chipId],
                campaignId,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        if (data1.count === 0) {
            return null;
        }

        return data;
    } catch (err) {
        console.log(err);
        return null;
    }
};
