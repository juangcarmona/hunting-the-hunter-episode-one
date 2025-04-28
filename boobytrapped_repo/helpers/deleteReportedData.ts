import axios from "axios";

export const deleteReportedData = async (
    id: string,
    token: string,
    chipId: string,
) => {
    try {
        const { data: data1 } = await axios.post(
            `${process.env.NEXT_PUBLIC_BE_URL}/chips/campaign-nfc`,
            {
                hashes: [chipId],
                campaignId: null,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        const { data } = await axios.delete(
            `${process.env.NEXT_PUBLIC_BE_URL}/campaigns/${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return data;
    } catch (err) {
        console.log(err);
        return null;
    }
};
