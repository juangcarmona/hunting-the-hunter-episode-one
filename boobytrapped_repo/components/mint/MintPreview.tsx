import { TemplateProps } from "@/app/templates/[id]/mint/confirm/page";
import {
    mintingSelectedChipGroupState,
    mintingSelectedChipsState,
} from "@/state/minting";
import { theme } from "@/styles/theme";
import fetchMimeType from "@/utils/fetchMimeType";
import { useEffect, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import MediaDisplayer from "../chip/MediaDisplayer";
import Box from "../common/Box";
import Button from "../common/Button";
import Flex from "../common/Flex";
import Spacer from "../common/Spacer";
import Text from "../common/Text";
import { Tooltip } from "../common/Tooltip";

interface MintPreviewProps {
    template?: TemplateProps | null;
    isMintingFailed: boolean;
    setIsMintingFailed: (bool: boolean) => void;
    startMinting: () => void;
}

const MintPreview: React.FC<MintPreviewProps> = ({
    template,
    isMintingFailed,
    setIsMintingFailed,
    startMinting,
}) => {
    const mintingChipGroup = useRecoilValue(mintingSelectedChipGroupState);
    const mintingChips = useRecoilValue(mintingSelectedChipsState);

    const [mimeType, setMimeType] = useState<string | null>(null);

    useEffect(() => {
        fetchMimeType(template?.medias?.[0]?.url || "").then((res) =>
            setMimeType(res as string),
        );
    }, [template?.medias]);

    return (
        <>
            <Box
                width={450}
                backgroundColor={theme.colors.white}
                p={20}
                borderRadius={20}
            >
                <Box width={360} height={240} m="0 auto" position="relative">
                    <MediaDisplayer
                        image={template?.medias?.[0]?.url || ""}
                        alt="token preview"
                        image_mime_type={mimeType}
                        videoOptions={{ height: 240 }}
                    />
                </Box>

                <Spacer y size={4} />
                <Flex rowGap={2} justifyContent={"space-between"}>
                    <Text variant="bodyBold1">
                        {template?.title}{" "}
                        {template?.mintedCount! > 0 &&
                            `#${template?.mintedCount! + 1}`}
                    </Text>

                    <Tooltip content="Each NFT will be assigned a distinct product number to ensure no duplicates exist. Numbering starts from the specified number and follows a sequential order (e.g., Shoe #1, Shoe #2, etc.).">
                        <Box marginY="auto">
                            <AiOutlineInfoCircle
                                color={theme.colors.accent}
                                size={25}
                            />
                        </Box>
                    </Tooltip>
                </Flex>

                <Spacer y size={4} />

                <Flex
                    width="100%"
                    py={12}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor={theme.colors.neutral}
                    color={theme.colors.text}
                    borderRadius={20}
                >
                    {mintingChipGroup
                        ? mintingChipGroup.chipsCount
                        : mintingChips!.length}{" "}
                    smart tags assigned to this item
                </Flex>
            </Box>

            <Spacer y size={4} />

            {!isMintingFailed ? (
                <Button
                    style={{ width: 450, fontSize: 25, height: 80 }}
                    onClick={startMinting}
                >
                    <img src="/images/rocket.svg" />
                    <Spacer size={4} />
                    Tokenize
                </Button>
            ) : (
                <Button
                    style={{ width: 450, fontSize: 25, height: 80 }}
                    onClick={() => setIsMintingFailed(false)}
                >
                    Retry
                </Button>
            )}
        </>
    );
};

export default MintPreview;
