"use client";

import { Title } from "@/app/templates/common";
import Box from "@/components/common/Box";
import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import { Input } from "@/components/common/FormInputs/Input";
import Modal from "@/components/common/Modal";
import PageContentTitle from "@/components/common/PageContentTitle";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import ModalNewProject from "@/components/projects/ModalNewProject";
import ProjectCard, {
    ProjectCardProps,
} from "@/components/projects/ProjectCard";
import { ProjectsService } from "@/services/ProjectsService";
import GenericModal from "@/utils/GenericModal";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

const Projects = () => {
    const { data, isLoading, mutate } = useSWR("/projects");
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    const [isProjectEditOpened, setIsProjectEditOpened] = useState(false);
    const [isDeleteConfirmationOpened, setIsDeleteConfirmationOpened] =
        useState(false);
    const [editProjectData, setEditProjectData] = useState({
        id: "",
        name: "",
    });

    const projects = useMemo(() => data?.data?.json, [data]);

    const editProject = (id: string, name: string) => {
        setIsProjectEditOpened(true);
        setEditProjectData({ id, name });
    };

    // MAYBE NEED TO MUTATE TEMPLATES AS WELL
    const deleteProject = async (shouldDeleteProject: boolean) => {
        if (shouldDeleteProject) {
            await ProjectsService.delete(editProjectData.id);
            toast.success(`${editProjectData.name} deleted!`);
            setIsDeleteConfirmationOpened(false);
            // Mutate the projects endpoint
            mutate();
            // Mutate the templates endpoint for the deleted project
            mutate(`/projects/${editProjectData.id}/templates`);
        } else {
            setIsDeleteConfirmationOpened(false);
            setIsProjectEditOpened(true);
        }
    };

    return (
        <>
            <Modal
                isOpen={isProjectEditOpened}
                setIsOpen={setIsProjectEditOpened}
                hasCloseButton
            >
                <Spacer y size={4} />
                <Title style={{ fontWeight: 900 }}>Project</Title>
                <Spacer y size={3} />
                <Text variant="body2">Enter a name for your project</Text>

                <Input
                    inputProps={{
                        defaultValue: editProjectData.name,
                        placeholder: "Type the new project name",
                        type: "text",
                        name: "name",
                        onChange: (e) => {
                            setEditProjectData((prevState) => ({
                                ...prevState,
                                name: e.target.value,
                            }));
                        },
                    }}
                />

                <Spacer y size={3} />

                <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    style={{ width: "100%" }}
                >
                    <Button
                        error
                        style={{ width: "48%", color: "red" }}
                        outline
                        onClick={() => {
                            setIsProjectEditOpened(false);
                            setIsDeleteConfirmationOpened(true);
                        }}
                    >
                        <Text variant="bodyBold2">Delete project</Text>
                    </Button>
                    <Button
                        onClick={async () => {
                            if (
                                data?.data?.json.some(
                                    (obj: any) =>
                                        obj.name === editProjectData.name,
                                )
                            ) {
                                toast.error("That project already exists");
                            } else {
                                await ProjectsService.update(editProjectData);
                                toast.success("Project name changed!");
                                setIsProjectEditOpened(false);
                                mutate();
                            }
                        }}
                        outline
                        style={{ width: "48%" }}
                    >
                        Save
                    </Button>
                </Flex>
                <Spacer y size={5} />
                <Text color="error" variant="caption2">
                    <strong>DELETION:</strong>The assigned items will be moved
                    to a default project which will be created automatically.
                </Text>
            </Modal>
            <Modal
                isOpen={isDeleteConfirmationOpened}
                setIsOpen={setIsDeleteConfirmationOpened}
                additionalProperties={{ height: "18rem" }}
                hasCloseButton
            >
                <GenericModal
                    title={`Delete ${editProjectData.name}?`}
                    onAnswer={deleteProject}
                    additionalProps={{
                        isError: "true",
                    }}
                />
            </Modal>
            <PageContentTitle>Projects</PageContentTitle>

            <Box mt={4}>
                {!projects?.length && !isLoading && (
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        position="relative"
                        mr={2}
                        marginLeft={"1rem"}
                        style={{ height: "80vh" }}
                        flexDirection="column"
                        columnGap={10}
                        color="accent"
                    >
                        <h3>
                            It looks like there&lsquo;s no item. Let&lsquo;s
                            create one!
                        </h3>
                        <Button
                            style={{
                                height: "3rem",
                                padding: "0 50px",
                                fontSize: "21px",
                            }}
                            onClick={() => setIsNewProjectModalOpen(true)}
                        >
                            Create Project
                        </Button>
                    </Flex>
                )}
                <Flex padding={12} rowGap={2} columnGap={2} flexWrap="wrap">
                    {projects?.map((project: ProjectCardProps) => (
                        <ProjectCard
                            key={project.id}
                            {...project}
                            editProject={editProject}
                        />
                    ))}
                </Flex>

                <ModalNewProject
                    isOpen={isNewProjectModalOpen}
                    setIsOpen={setIsNewProjectModalOpen}
                />
            </Box>
        </>
    );
};

export default Projects;
