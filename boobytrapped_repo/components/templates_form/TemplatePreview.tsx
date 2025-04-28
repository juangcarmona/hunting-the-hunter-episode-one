import { theme } from "@/styles/theme";
import { useMediaQuery } from "@react-hook/media-query";
import { useMemo } from "react";
import AspectRatio from "react-aspect-ratio";
import { FieldValues } from "react-hook-form";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import MediaDisplayer from "../chip/MediaDisplayer";
import Box from "../common/Box";
import Button from "../common/Button";
import Divider from "../common/Divider";
import Flex from "../common/Flex";
import Spacer from "../common/Spacer";
import Text from "../common/Text";
import { Tooltip } from "../common/Tooltip";
import { Card } from "./SelectedTemplatePreview";

interface TemplatePreviewProps {
    values: FieldValues;
    step: number;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ step, values }) => {
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    const imageSrc = useMemo(() => {
        if (values.file && values.file.mediaUrl) {
            return values.file.mediaUrl;
        } else if (values.file) {
            return URL.createObjectURL(values.file);
        }
        return null;
    }, [values.file]);

    return (
        <Box
            width={isMobile ? "100%" : 500}
            borderRadius={30}
            backgroundColor="white"
            height="80vh"
            position="relative"
            overflow={"hidden"}
        >
            <Flex
                alignItems="center"
                justifyContent="center"
                width={115}
                height={40}
                position="absolute"
                boxShadow="0px 2.921px 5.921px 0px rgba(0, 0, 0, 0.25)"
                borderRadius="0px 14800px 14800px 0px"
                backgroundColor={theme.colors.white}
                top={"5rem"}
                zIndex={2}
            >
                <FaRegEye color={`${theme.colors.primary}`} />
                <Text variant="bodyBold2" ml={2}>
                    Preview
                </Text>
            </Flex>
            <Box
                width={isMobile ? "100%" : 500}
                mx="auto"
                pt={0}
                pb={4}
                px={5}
                overflowY="scroll"
                height="inherit"
                style={{ scrollbarColor: "grey transparent" }}
            >
                {!values.file && (
                    <Box
                        mx="auto"
                        my={20}
                        height={400}
                        style={{
                            background:
                                'linear-gradient(rgba(255, 255, 255, 0.9),rgba(255, 255, 255, 0.9)),url("/images/checker.png")',
                        }}
                    />
                )}
                {values.file && (
                    <Box mt={5} mx="auto">
                        <AspectRatio>
                            <Card
                                style={{
                                    overflow: "hidden",
                                }}
                            >
                                <MediaDisplayer
                                    alt="nft image"
                                    image={imageSrc}
                                    image_mime_type={
                                        values.file.mimeType || values.file.type
                                    }
                                />
                            </Card>
                        </AspectRatio>
                    </Box>
                )}
                <Spacer y size={3} />
                {step > 0 && (
                    <>
                        {values.title && (
                            <Flex
                                height={50}
                                width="fit-content"
                                justifyContent="center"
                                alignItems="center"
                                px={2}
                            >
                                <Text as="h2" variant="bodyBold1">
                                    {values.title}
                                </Text>
                            </Flex>
                        )}
                        {values.personalizedMessage &&
                            !!Object.keys(values.personalizedMessage)
                                .length && (
                                <Box
                                    style={{
                                        width: "100%",
                                        wordWrap: "break-word",
                                    }}
                                >
                                    <Spacer y size={20} />
                                    <Divider />
                                    <Spacer y size={10} />
                                    <Text variant="bodyBold1">
                                        {values.personalizedMessage.title}
                                    </Text>
                                    <Spacer y size={10} />
                                    <Text variant="body2">
                                        {values.personalizedMessage.description}
                                    </Text>
                                    <Spacer y size={10} />

                                    {values.personalizedMessage.websiteLink && (
                                        <a
                                            href={
                                                values.personalizedMessage.websiteLink.startsWith(
                                                    "https://",
                                                )
                                                    ? values.personalizedMessage
                                                          .websiteLink
                                                    : `https://${values.personalizedMessage.websiteLink}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button
                                                fullWidth
                                                style={{ height: "2.5rem" }}
                                                outline
                                            >
                                                Find out more
                                            </Button>
                                        </a>
                                    )}
                                </Box>
                            )}
                    </>
                )}
                {step > 2 && !!values.traits?.length && (
                    <Box>
                        <Spacer y size={20} />
                        <Divider />
                        <Spacer y size={10} />
                        <Text variant="bodyBold1">Product Data</Text>
                        <Flex justifyContent="space-between" flexWrap="wrap">
                            {values.traits.map((trait: any, index: number) => (
                                <Box key={index} width="48%" mt={3}>
                                    <Text variant="bodyBold2" color="accent">
                                        {trait.trait_type}
                                    </Text>
                                    <Text variant="bodyBold2">
                                        {trait.value}
                                    </Text>
                                </Box>
                            ))}
                        </Flex>
                    </Box>
                )}
                {step > 3 && !!values.history?.length && (
                    <Box>
                        <Spacer y size={20} />
                        <Divider />
                        <Spacer y size={10} />
                        <Text variant="bodyBold1">History</Text>
                        {values.history.map(
                            (historyElement: any, idx: number) => (
                                <Box key={idx} mt={3}>
                                    <Flex rowGap={5}>
                                        <Flex
                                            flexDirection="column"
                                            alignItems="center"
                                        >
                                            <GoDotFill />
                                            <Box
                                                borderLeft={`1px solid ${theme.colors.accent}`}
                                                height={60}
                                            />
                                        </Flex>
                                        <Box flexGrow={1}>
                                            <Text color={theme.colors.accent}>
                                                {historyElement.date}
                                            </Text>
                                            <Text variant="bodyBold2">
                                                {historyElement.name.label?.toUpperCase()}
                                            </Text>
                                            <Text variant="caption2">
                                                {historyElement.companyName} -{" "}
                                                {historyElement.city}
                                            </Text>
                                        </Box>
                                        <Box mr={4} position="relative">
                                            <Tooltip
                                                content={
                                                    historyElement.description
                                                }
                                            >
                                                <Box>
                                                    <AiOutlineInfoCircle
                                                        color={
                                                            theme.colors
                                                                .grayLight
                                                        }
                                                        size={25}
                                                    />
                                                </Box>
                                            </Tooltip>
                                        </Box>
                                    </Flex>
                                </Box>
                            ),
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default TemplatePreview;
