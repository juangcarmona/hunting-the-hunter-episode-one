import { Attribute } from "@/components/chip/ChipBound";
import fetchMimeType from "@/utils/fetchMimeType";
import { useEffect, useMemo, useState } from "react";

interface MediaAttribute {
    url: string;
    mimeType: string;
}

const useMediaAttributes = (attributes: Attribute[]): MediaAttribute[] => {
    const [mediaAttributes, setMediaAttributes] = useState<any[]>([]); //pass proper type

    const filtered: Attribute[] = useMemo(
        () =>
            attributes?.filter((a: Attribute) =>
                a.trait_type.startsWith("Media-"),
            ),
        [attributes],
    );

    useEffect(() => {
        const getAttributes = async () => {
            return await Promise.all(
                filtered.map(async (attribute) => {
                    const url = attribute.value.toString();
                    const mimeType = await fetchMimeType(url);
                    return {
                        url,
                        mimeType,
                    };
                }),
            );
        };
        getAttributes().then((res) => setMediaAttributes(res));
    }, [filtered]);

    return mediaAttributes;
};

export default useMediaAttributes;
