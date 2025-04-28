import axios from "axios";

export const getReportedData = async (user: any, token: string) => {
    try {
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_BE_URL}/campaigns`,
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
