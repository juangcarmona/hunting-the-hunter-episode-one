export const getChipIdFromAttributes = (attributes: any) => {
    if (!Array.isArray(attributes)) {
        return null;
    }

    const chipId = attributes?.find(
        (attr: any) => attr.trait_type === "NFC-Chip",
    )?.value;
    return chipId;
};
