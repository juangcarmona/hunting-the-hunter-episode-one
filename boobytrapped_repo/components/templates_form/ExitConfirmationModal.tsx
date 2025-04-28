import { Title } from "@/app/templates/common";
import { ProjectsService } from "@/services/ProjectsService";
import { TemplateService } from "@/services/TemplateService";
import { theme } from "@/styles/theme";
import { useMediaQuery } from "@react-hook/media-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import Button from "../common/Button";
import FlatLoader from "../common/FlatLoader";
import Flex from "../common/Flex";
import Spacer from "../common/Spacer";
import Text from "../common/Text";

interface ExitConfirmationModalProps {
    setIsExitOpen: (value: boolean) => void;
    values?: FieldValues;
}

interface Project {
    name?: string;
    id?: string;
    clientId?: string;
    createdAt?: string;
}

const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
    setIsExitOpen,
    values,
}) => {
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);

    return (
        <Container
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: isSaving ? "center" : "auto",
                width: isMobile ? "95%" : undefined,
            }}
        >
            <button
                style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "24px",
                    color: "black",
                }}
                onClick={() => setIsExitOpen(false)}
            >
                X
            </button>
            {isSaving ? (
                <FlatLoader style={{ width: "100px", height: "100px" }} />
            ) : (
                <>
                    {values?.file && values?.name && values?.title ? (
                        <>
                            <Title
                                style={{
                                    textAlign: "center",
                                    paddingBottom: "10px",
                                }}
                            >
                                Unsaved changes
                            </Title>
                            <Text
                                variant="body2"
                                color={theme.colors.grayLight400}
                                style={{
                                    textAlign: "center",
                                }}
                            >
                                Are you sure that you want to exit? All unsaved
                                changes will be lost.
                            </Text>

                            <Spacer y size={30} />
                            <Flex
                                width={"100%"}
                                justifyContent="space-between"
                                rowGap={2}
                            >
                                <Button
                                    fullWidth
                                    outline
                                    onClick={() => setIsExitOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    outline
                                    fullWidth
                                    onClick={() => {
                                        setIsExitOpen(false);
                                        values.openedFrom === "projects"
                                            ? router.replace("/admin/projects")
                                            : router.replace("/admin/items");
                                    }}
                                >
                                    Exit without saving
                                </Button>
                                <Button
                                    outline
                                    fullWidth
                                    onClick={() => {
                                        setIsSaving(true);
                                        saveDraft(
                                            values,
                                            setIsExitOpen,
                                            router,
                                        );
                                    }}
                                >
                                    Save and exit
                                </Button>
                            </Flex>
                        </>
                    ) : (
                        <>
                            <Title
                                style={{
                                    textAlign: "center",
                                    paddingBottom: "20px",
                                }}
                            >
                                Are you sure you want to exit?
                            </Title>
                            <Flex width={"100%"} rowGap={4}>
                                <Button
                                    fullWidth
                                    outline
                                    onClick={() => setIsExitOpen(false)}
                                >
                                    No
                                </Button>
                                <Button
                                    outline
                                    fullWidth
                                    onClick={() => {
                                        setIsExitOpen(false);
                                        router.replace("/admin/items");
                                    }}
                                >
                                    Yes
                                </Button>
                            </Flex>
                        </>
                    )}
                </>
            )}
        </Container>
    );
};

const saveDraft = async (
    draftValues: FieldValues,
    setIsExitOpen: any,
    router: any,
) => {
    const isMediasBeenUpdated = () => {
        if (
            draftValues.initialContent.Medias[0].createdAt !==
            draftValues.file.createdAt
        )
            return true;
        if (
            draftValues.initialContent.media3d?.createdAt !==
                draftValues.animationFile?.createdAt ||
            (!draftValues.initialContent.media3d && draftValues.animationFile)
        )
            return true;
        if (
            draftValues.initialContent.Medias.length !==
            draftValues.extraMedia?.length + 1
        )
            return true;
        for (let i = 1; i < draftValues.initialContent.Medias.length; i++) {
            if (!draftValues.extraMedia) return true;
            if (
                draftValues.extraMedia[i - 1].createdAt !==
                draftValues.initialContent.Medias[i].createdAt
            )
                return true;
        }
        return false;
    };

    const histories = (draftValues.history ?? []).map(
        (historyElement: Record<string, any>) => {
            // historiesMedia.push(historyElement.file);
            // delete historyElement.file;
            historyElement.name = historyElement.name.value;
            historyElement.date = new Date(historyElement.date).toISOString();
            return historyElement;
        },
    );

    const valuesMedia: File[] = [];

    const values = (draftValues.values ?? [])
        .filter((value: Record<string, any>) => !!value?.name)
        .map((value: Record<string, any>) => {
            valuesMedia.push(value.file);
            delete value.file;
            return value;
        });

    // Personalized message cleanup
    if (
        typeof draftValues.personalizedMessage === "object" &&
        Object.keys(draftValues.personalizedMessage).length === 1 &&
        draftValues.personalizedMessage.icon === 0
    ) {
        draftValues.personalizedMessage = undefined;
    }

    const templateBody = {
        name: draftValues.name,
        title: draftValues.title,
        description: draftValues.description,
        provenance: draftValues.traits || [],
        histories,
        values,
        personalizedMessage: draftValues.personalizedMessage,
    };

    if (draftValues?.initialContent?.id) {
        if (
            templateBody.personalizedMessage &&
            Object.keys(templateBody.personalizedMessage).length === 0
        ) {
            delete templateBody.personalizedMessage;
        }
        const updatedTemplateBody = {
            ...templateBody,
            templateId: draftValues.initialContent.id,
        };

        // Update the template collection itself first
        const templateRes = await TemplateService.update(
            draftValues.project.value,
            updatedTemplateBody,
        );
        // Check if updating medias is needed
        if (isMediasBeenUpdated()) {
            // Divide between new file to upload and existing media
            const formData = new FormData();
            const existingFilesIds: any = [];
            let shouldUploadFiles = false;

            if (draftValues.file instanceof File) {
                formData.append("files", draftValues.file);
                formData.append("mainFile", "newFile");
                shouldUploadFiles = true;
            } else {
                existingFilesIds.push(draftValues.file.id);
            }

            if (draftValues.animationFile instanceof File) {
                shouldUploadFiles = true;
                formData.append("files", draftValues.animationFile);
            } else {
                draftValues.animationFile !== undefined &&
                    existingFilesIds.push(draftValues.animationFile.id);
            }

            draftValues.extraMedia?.forEach((file: File | any, idx: Number) => {
                if (file instanceof File) {
                    shouldUploadFiles = true;
                    formData.append("files", file);
                } else {
                    existingFilesIds.push(file.id);
                }
            });

            existingFilesIds.length > 0 &&
                existingFilesIds.forEach((id: string) => {
                    formData.append("existingFilesIds", id);
                });

            if (!shouldUploadFiles) {
                formData.append("files", new Blob([], { type: "image/jpeg" }));
            }

            const templateMediaRes = await TemplateService.uploadTemplateMedia(
                draftValues.initialContent.id,
                formData,
            );
        }

        const valuesData = templateRes?.data?.json?.values;
        const valuesMediaRes = await Promise.all(
            valuesData?.map((value: Record<string, any>, idx: number) => {
                const id = value.id;
                if (valuesMedia[idx]) {
                    const formData = new FormData();
                    formData.append("file", valuesMedia[idx]);
                    return TemplateService.uploadValueMedia(
                        draftValues.initialContent.id,
                        id,
                        formData,
                    );
                }
            }),
        );
        toast.success("Template updated!");
    } else {
        // Create draft project if it has not been created yet
        let projectId;
        const userProjects = await ProjectsService.get();
        const projectsData = userProjects?.data?.json;
        const draftProject = projectsData.find(
            (project: Project) => project.name === "Drafts",
        );

        if (draftProject) {
            projectId = draftProject.id;
        } else {
            const newProjectRes = await ProjectsService.create({
                name: "Drafts",
            });
            projectId = newProjectRes.data?.json?.id;
        }

        const templateRes = await TemplateService.create(
            projectId,
            templateBody,
        );

        const templateId = templateRes?.data?.json?.id;
        const formData = new FormData();
        formData.append("files", draftValues.file);
        if (draftValues.animationFile)
            formData.append("files", draftValues.animationFile);
        draftValues.extraMedia?.forEach((media: File, idx: Number) =>
            formData.append("files", media),
        );
        const templateMediaRes = await TemplateService.uploadTemplateMedia(
            templateId,
            formData,
        );

        const valuesData = templateRes?.data?.json?.values;
        if (valuesData) {
            await Promise.all(
                valuesData?.map((value: Record<string, any>, idx: number) => {
                    const id = value.id;
                    if (valuesMedia[idx]) {
                        const formData = new FormData();
                        formData.append("file", valuesMedia[idx]);
                        return TemplateService.uploadValueMedia(
                            templateId,
                            id,
                            formData,
                        );
                    }
                }),
            );
        }
        toast.success("Draft saved!");
    }

    setIsExitOpen(false);
    draftValues.openedFrom === "projects"
        ? router.replace("/admin/projects")
        : router.replace("/admin/items");
};

const Container = styled.div`
    background-color: white;
    font-family: "Poppins", sans-serif;
    width: 100%;
    max-width: 700px;
    height: 40%;
    z-index: 4;
    // Centered horizontally and vertically
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    padding: 50px 20px;
    box-shadow: 0px 5.921px 5.921px 0px rgba(0, 0, 0, 0.25);
`;

const Label = styled.div`
    ${({ theme }) => theme.typography.body2};
`;

export default ExitConfirmationModal;
