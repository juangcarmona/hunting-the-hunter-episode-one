import { theme } from "@/styles/theme";
import fetchMimeType from "@/utils/fetchMimeType";
import { MouseEventHandler, useEffect, useState } from "react";
import styled from "styled-components";
import MediaDisplayer from "../chip/MediaDisplayer";
import Box from "../common/Box";
import Spacer from "../common/Spacer";
import Text from "../common/Text";
import { Tooltip } from "../common/Tooltip";
import { Template } from "./TemplatesContent";

interface TemplateCardProps {
    template: Template;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onClick }) => {
    const [mimeType, setMimeType] = useState<string | null | undefined>(null);
    useEffect(() => {
        fetchMimeType(template.Medias[0]?.mediaUrl).then((res) => {
            setMimeType(res);
        });
    }, [template]);

    return (
        <StyledBox p={2} onClick={onClick}>
            <Box
                borderRadius={20}
                border={`1px solid ${theme.colors.muted}`}
                overflow="hidden"
                height={200}
                width={200}
                position="relative"
            >
                <MediaDisplayer
                    image={template.Medias[0]?.mediaUrl}
                    image_mime_type={mimeType}
                    alt="template preview"
                    videoOptions={{
                        height: 200,
                        maxWidth: 300,
                    }}
                    imageOptions={{
                        width: 198,
                        height: 198,
                        respectRatio: true,
                    }}
                />
            </Box>

            <Spacer y size={4} />
            <Tooltip
                content={template.name}
                disabled={template.name.length <= 18}
                placement="bottom"
            >
                <div
                    style={{
                        width: "12rem",
                        textAlign: "center",
                        maxHeight: "1.5rem",
                        overflow: "hidden",
                    }}
                >
                    {template.name.length > 18 ? (
                        <Text variant="bodyBold2">
                            {`${template.name.slice(0, 18)}...`}
                        </Text>
                    ) : (
                        <Text variant="bodyBold2">{template.name}</Text>
                    )}
                </div>
            </Tooltip>
        </StyledBox>
    );
};

const StyledBox = styled(Box)`
    border: solid 2px transparent;
    transition: border 0.3s ease;
    :hover {
        border: ${`solid 2px ${theme.colors.primaryDark10}`};
    }

    border-radius: 20px;
`;

export default TemplateCard;
