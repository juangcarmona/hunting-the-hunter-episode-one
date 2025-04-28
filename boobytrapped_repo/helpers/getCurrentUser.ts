import axios from "axios";

export const getCurrentUser = async (wallet: any) => {
    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BE_URL}/users/getInfo?wallet=${wallet}`,
        );
        return res?.data?.[0];
    } catch (err) {
        console.log(err);
        return null;
    }
};
