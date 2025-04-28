import axios from "axios";

export const getChipData = async (chipId: string) => {
    const isProduction = window.location.href.includes("app.wovlabs.com");
    if (isProduction) {
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_CHIP_URL2}/chips/${chipId}`,
            );

            return { data: data, status: "production" };
        } catch (ex) {
            console.error(ex);
        }
    } else {
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_CHIP_URL1}/chips/${chipId}`,
            );

            return { data: data, status: "dev" };
        } catch (ex) {
            try {
                const { data } = await axios.get(
                    `${process.env.NEXT_PUBLIC_CHIP_URL2}/chips/${chipId}`,
                );

                return { data: data, status: "production" };
            } catch (ex) {
                console.error(ex);
            }
        }
        return { data: null, status: null };
    }
    return { data: null, status: null };
};
