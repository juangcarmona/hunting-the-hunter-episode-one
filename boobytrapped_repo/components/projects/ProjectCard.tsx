import { theme } from "@/styles/theme";
import { useMediaQuery } from "@react-hook/media-query";
import moment from "moment";
import { useMemo, useState } from "react";
import { AspectRatio } from "react-aspect-ratio";
import { FiEdit2 } from "react-icons/fi";
import { toast } from "react-toastify";
import styled, { useTheme } from "styled-components";
import useSWR from "swr";
import MediaDisplayer from "../chip/MediaDisplayer";
import Box from "../common/Box";
import Flex from "../common/Flex";
import Modal from "../common/Modal";
import Text from "../common/Text";
import { Tooltip } from "../common/Tooltip";
import { Template } from "../templates/TemplatesContent";
import SelectedTemplatePreview from "../templates_form/SelectedTemplatePreview";

export interface ProjectCardProps {
    id: string;
    name: string;
    createdAt: string;
    editProject: any;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    id,
    name,
    createdAt,
    editProject,
}) => {
    const theme = useTheme();
    const { data: templatesData, mutate } = useSWR(`/projects/${id}/templates`);
    const templates = useMemo(() => templatesData?.data?.json, [templatesData]);
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);

    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
        null,
    );

    const openModal = (template: any) => {
        const { histories, medias, values, personalizedMessage, ...rest } =
            template;

        let modifiedTemplate = {
            Histories: histories,
            Medias: medias,
            Values: values,
            ...rest,
        };

        if (personalizedMessage !== null && personalizedMessage !== undefined) {
            modifiedTemplate.personalizedMessage =
                JSON.stringify(personalizedMessage);
        } else {
            modifiedTemplate.personalizedMessage = null;
        }

        const modifiedMedias = modifiedTemplate.Medias.map((media: any) => {
            const { url, type, ...rest } = media;
            return {
                ...rest,
                mediaUrl: url,
                mimeType: type,
            };
        });

        modifiedTemplate = {
            ...modifiedTemplate,
            openedFrom: "projects",
            Medias: modifiedMedias,
        };

        setSelectedTemplate(modifiedTemplate);
    };

    const closeModal = () => {
        setSelectedTemplate(null);
        mutate();
    };

    return (
        <Flex
            height={300}
            border={`1px solid #E5EAEF`}
            borderRadius={20}
            padding={12}
            width="100%"
            alignItems="center"
            rowGap={3}
            overflowX="scroll"
            style={{ scrollbarColor: "grey transparent" }}
            flexDirection={isMobile ? "column" : "row"}
        >
            {selectedTemplate && (
                <Modal isOpen={!!selectedTemplate} setIsOpen={closeModal}>
                    <SelectedTemplatePreview
                        closeModal={closeModal}
                        value={selectedTemplate}
                    />
                </Modal>
            )}
            <Box>
                <Box
                    style={{ cursor: "pointer" }}
                    display={"flex"}
                    alignItems={"center"}
                    width={200}
                    onClick={() => {
                        name !== "Default" && name !== "Drafts"
                            ? editProject(id, name)
                            : toast.info("Default project cannot be edited!");
                    }}
                >
                    <Text as="h1" variant="bodyBold1">
                        {name}
                    </Text>
                    {name !== "Default" && name !== "Drafts" && (
                        <FiEdit2
                            style={{ marginLeft: ".5rem", fontWeight: 900 }}
                        />
                    )}
                </Box>
                <Text>{moment(new Date(createdAt)).fromNow()}</Text>
            </Box>

            {templates?.map((template: any) => (
                <StyledBox
                    key={template.id}
                    onClick={() => openModal(template)}
                >
                    <Flex key={template.id} flexDirection="column">
                        <Box
                            borderRadius={20}
                            border={`1px solid ${theme.colors.muted}`}
                            overflow="hidden"
                            position="relative"
                        >
                            <AspectRatio>
                                <MediaDisplayer
                                    image={template.medias[0]?.url}
                                    image_mime_type={template.medias[0]?.type}
                                    alt="template preview"
                                    videoOptions={{
                                        height: 200,
                                        maxWidth: 300,
                                    }}
                                    imageOptions={{
                                        width: 200,
                                        height: 200,
                                        respectRatio: true,
                                    }}
                                />
                            </AspectRatio>
                        </Box>

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
                                    textOverflow: "ellipsis",
                                }}
                            >
                                <Text variant="bodyBold2">
                                    {template.name.length > 18
                                        ? `${template.name.slice(0, 18)}...`
                                        : template.name}
                                </Text>
                            </div>
                        </Tooltip>
                    </Flex>
                </StyledBox>
            ))}
        </Flex>
    );
};

const StyledBox = styled(Box)`
    border: solid 0.1rem transparent;
    transition: border 0.2s ease;
    :hover {
        border-color: ${theme.colors.primaryDark10};
    }
    border-radius: 1rem;
`;

export default ProjectCard;
