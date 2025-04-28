import axios from "axios";
import { toast } from "react-toastify";

export const postData = async (data: any) => {
    try {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_CHIP_URL1}/chips`,
            data,
        );

        if (res.status === 200 && res.data?.type == "success") {
            toast.success("Campaign created successfully");
            return true;
        }
    } catch (ex) {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_CHIP_URL2}/chips`,
                data,
            );

            if (res.status === 200 && res.data?.type == "success") {
                toast.success("Campaign created successfully");
                return true;
            } else {
            }
        } catch (ex) {
            toast.error("Failed to create campaign");
            console.error(ex);
            return false;
        }
    }

    return false;
};
