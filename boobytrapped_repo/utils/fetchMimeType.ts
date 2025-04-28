const fetchMimeType = async (url: string) => {
    const formattedUrl = url?.replace(" ", "%20");
    try {
        const res = await fetch(formattedUrl, {
            method: "HEAD",
        });
        return res.headers.get("content-type");
    } catch (e) {
        console.log(e);
    }
};

export default fetchMimeType;
