import { Title } from "@/app/templates/common";
import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import { Select } from "@/components/common/FormInputs/Select";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import { ProjectsService } from "@/services/ProjectsService";
import { TemplateService } from "@/services/TemplateService";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import {
    Control,
    FieldValues,
    UseFormRegister,
    UseFormSetValue,
} from "react-hook-form";
import { toast } from "react-toastify";
import useSWR from "swr";
import FlatLoader from "../common/FlatLoader";
import { ClearDataForValuesStep } from "./History";
import NewProjectModal from "./NewProjectModal";

interface AssignProps {
    register: UseFormRegister<any>;
    setStep: (step: number) => void;
    isValid: boolean;
    values: FieldValues;
    control: Control;
    setValue: UseFormSetValue<any>;
}
const Assign: React.FC<AssignProps> = ({
    isValid,
    values,
    control,
    setValue,
}) => {
    const { data: projectsData } = useSWR("/projects");
    const [newProjectModal, setNewProjectModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const ProjectsOptions = useMemo(
        () =>
            projectsData?.data?.json?.map(
                (project: Record<string, string>) => ({
                    label: project.name,
                    value: project.id,
                }),
            ),
        [projectsData],
    );
    const {
        name,
        title,
        description,
        file,
        traits,
        history,
        extraMedia,
        project,
        newProject,
        templateId,
        personalizedMessage,
        animationFile,
        values: productValues,
        initialContent,
        openedFrom,
    } = values;

    // Cleanup on values
    ClearDataForValuesStep(control);

    const isMediasBeenUpdated = () => {
        if (initialContent.Medias[0].createdAt !== file.createdAt) return true;
        if (
            initialContent.media3d?.createdAt !== animationFile?.createdAt ||
            (!initialContent.media3d && animationFile)
        )
            return true;
        if (initialContent.Medias.length !== extraMedia?.length + 1)
            return true;
        for (let i = 1; i < initialContent.Medias.length; i++) {
            if (!extraMedia) return true;
            if (
                extraMedia[i - 1].createdAt !==
                initialContent.Medias[i].createdAt
            )
                return true;
        }
        return false;
    };

    const onSave = async () => {
        setIsSaving(true);
        // history media not present for the time being commenting out all the uploading history media part for now
        // const historiesMedia: File[] = [];
        const histories = history.map((historyElement: Record<string, any>) => {
            // historiesMedia.push(historyElement.file);
            // delete historyElement.file;
            historyElement.name = historyElement.name.value;
            historyElement.date = new Date(historyElement.date).toISOString();
            return historyElement;
        });

        const valuesMedia: File[] = [];

        const values = productValues
            .filter((value: Record<string, any>) => !!value?.name)
            .map((value: Record<string, any>) => {
                valuesMedia.push(value.file);
                delete value.file;
                return value;
            });

        let projectId;
        if (newProject && !values.project) {
            const newProjectRes = await ProjectsService.create({
                name: newProject,
            });
            projectId = newProjectRes.data?.json?.id;
        } else {
            projectId = project.value;
        }

        const templateBody = {
            name,
            title,
            description,
            provenance: traits,
            histories,
            values,
            personalizedMessage,
        };

        if (templateId) {
            const updatedTemplateBody = {
                ...templateBody,
                templateId: templateId,
            };

            // Update the template collection itself first
            const templateRes = await TemplateService.update(
                projectId,
                updatedTemplateBody,
            );
            // Check if updating medias is needed
            if (isMediasBeenUpdated()) {
                // Divide between new file to upload and existing media
                const formData = new FormData();
                const existingFilesIds: any = [];
                let shouldUploadFiles = false;

                if (file instanceof File) {
                    formData.append("files", file);
                    formData.append("mainFile", "newFile");
                    shouldUploadFiles = true;
                } else {
                    existingFilesIds.push(file.id);
                }

                if (animationFile instanceof File) {
                    shouldUploadFiles = true;
                    formData.append("files", animationFile);
                } else {
                    animationFile !== undefined &&
                        existingFilesIds.push(animationFile.id);
                }

                extraMedia?.forEach((file: File | any, idx: Number) => {
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
                    formData.append(
                        "files",
                        new Blob([], { type: "image/jpeg" }),
                    );
                }

                const templateMediaRes =
                    await TemplateService.uploadTemplateMedia(
                        templateId,
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
                            templateId,
                            id,
                            formData,
                        );
                    }
                }),
            );
            toast.success("Template updated!");
        } else {
            const templateRes = await TemplateService.create(
                projectId,
                templateBody,
            );

            const templateId = templateRes?.data?.json?.id;
            const formData = new FormData();
            formData.append("files", file);
            if (animationFile) formData.append("files", animationFile);
            extraMedia?.forEach((media: File, idx: Number) =>
                formData.append("files", media),
            );
            const templateMediaRes = await TemplateService.uploadTemplateMedia(
                templateId,
                formData,
            );
            const valuesData = templateRes?.data?.json?.values;
            const valuesMediaRes = await Promise.all(
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
        setIsSaving(false);

        openedFrom === "projects"
            ? router.replace("/admin/projects")
            : router.replace("/admin/items");
    };

    const setSelectedProject = (project: any) => {
        setValue("project", project);
    };

    return !isSaving ? (
        <Flex flexDirection="column" columnGap={3}>
            <Spacer y size={2} />
            <Title>Assign to a project</Title>
            <Text>Assign this item template to a project</Text>
            {ProjectsOptions && (
                <Select
                    label="Project"
                    inputProps={{
                        name: "project",
                        options: ProjectsOptions,
                    }}
                    control={control}
                />
            )}

            <Text
                color="primary"
                style={{ cursor: "pointer", fontWeight: "600" }}
                onClick={() => setNewProjectModal(true)}
            >
                Create a new Project{" "}
            </Text>

            {newProjectModal && (
                <NewProjectModal
                    isOpen={newProjectModal}
                    setIsOpen={setNewProjectModal}
                    newProjectSelected={(project: any) => {
                        setSelectedProject(project);
                    }}
                    projects={projectsData.data.json}
                />
            )}

            <Flex justifyContent="center" rowGap={5}>
                <Button
                    outline
                    fullWidth
                    disabled={!isValid || !values.project}
                    onClick={onSave}
                >
                    Save
                </Button>
            </Flex>
        </Flex>
    ) : (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "50%",
            }}
        >
            <FlatLoader style={{ width: "100px", height: "100px" }} />
        </div>
    );
};

export default Assign;
