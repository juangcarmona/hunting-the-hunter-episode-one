import axios from "axios";

export const updateChipClaimStatus = async (chipId: string, token: string) => {
    try {
        const { data } = await axios.put(
            `${process.env.NEXT_PUBLIC_BE_URL}/chips/claim`,
            {
                chipHashes: [chipId],
                claimStatus: "Visible",
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return data;
    } catch (ex) {
        return null;
    }
};
