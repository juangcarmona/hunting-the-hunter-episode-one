"use client";

import { Title } from "@/app/templates/common";
import PageContentTitle from "@/components/common/PageContentTitle";
import { theme } from "@/styles/theme";
import { useMediaQuery } from "@react-hook/media-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import Box from "../common/Box";
import Button from "../common/Button";
import FlatLoader from "../common/FlatLoader";
import Flex from "../common/Flex";
import { Input } from "../common/FormInputs/Input";
import { Select } from "../common/FormInputs/Select";
import Modal from "../common/Modal";
import Spacer from "../common/Spacer";
import { ProjectCardProps } from "../projects/ProjectCard";
import SelectedTemplatePreview from "../templates_form/SelectedTemplatePreview";
import TemplateCard from "./TemplateCard";

export interface Template {
    id: string;
    name: string;
    createdAt: string;
    title: string;
    description: string;
    provenance: Record<string, string>;
    projectId: string;
    mintedCount: number;
    Medias: Record<string, string>[];
}

export interface OptionItemProps<T = any> {
    label: string;
    value: T;
}

const TemplatesContent = () => {
    const fetchedTemplates = useSWR("/templates");
    const { data } = useSWR("/projects");
    const router = useRouter();
    const projects = useMemo(() => data?.data?.json, [data]);
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);

    const initialTemplates: Template[] = useMemo(() => {
        const templates = fetchedTemplates.data?.data?.json || [];
        return templates.sort(
            (a: Template, b: Template) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
    }, [fetchedTemplates.data]);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    const projectOptions: OptionItemProps<string>[] = useMemo(() => {
        const options = projects
            ? projects.map((project: ProjectCardProps) => ({
                  label: project.name,
                  value: project.id,
              }))
            : [];

        options.unshift({ label: "All", value: null });

        return options;
    }, [projects]);

    const filteredTemplates = useMemo(() => {
        if (!searchTerm && !selectedProject) {
            return initialTemplates;
        }

        const lowercasedSearchTerm = searchTerm.toLowerCase();

        return initialTemplates.filter((template) => {
            const matchesSearch =
                !searchTerm ||
                template.name.toLowerCase().includes(lowercasedSearchTerm);
            const matchesProject =
                selectedProject === null ||
                template.projectId === selectedProject;
            return matchesSearch && matchesProject;
        });
    }, [initialTemplates, searchTerm, selectedProject]);

    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
        null,
    );

    const openModal = (template: Template) => {
        setSelectedTemplate(template);
    };

    const closeModal = () => {
        setSelectedTemplate(null);
    };

    return (
        <>
            {!isMobile && <PageContentTitle>Items</PageContentTitle>}

            <Container>
                {!isMobile ? (
                    <>
                        <Spacer y size={1} />
                        <Box>
                            <Spacer y size={2} />
                            {filteredTemplates.length === 0 ? (
                                <Flex
                                    justifyContent="center"
                                    alignItems="center"
                                    style={{ height: "80vh" }}
                                    flexDirection="column"
                                    columnGap={10}
                                    color="accent"
                                >
                                    {fetchedTemplates.isValidating ? (
                                        <>
                                            Loading...
                                            <FlatLoader />
                                        </>
                                    ) : (
                                        <>
                                            <h3>
                                                It looks like there&lsquo;s no
                                                project. Let&lsquo;s create one!
                                            </h3>
                                            <Button
                                                style={{
                                                    height: "3rem",
                                                    padding: "0 50px",
                                                    fontSize: "21px",
                                                }}
                                                onClick={() =>
                                                    router.replace(
                                                        "/templates/create",
                                                    )
                                                }
                                            >
                                                Create item
                                            </Button>
                                        </>
                                    )}
                                </Flex>
                            ) : (
                                <Flex justifyContent="space-between" rowGap={3}>
                                    <Box>
                                        <Button
                                            style={{
                                                height: "2.5rem",
                                                marginTop: ".2rem",
                                            }}
                                            onClick={() =>
                                                router.replace(
                                                    "/templates/create",
                                                )
                                            }
                                        >
                                            Create items
                                        </Button>
                                    </Box>
                                    <Box flex={1}>
                                        <Input
                                            inputProps={{
                                                placeholder:
                                                    "Search by item templates",
                                                value: searchTerm,
                                                onChange: (e) =>
                                                    setSearchTerm(
                                                        e.target.value,
                                                    ),
                                            }}
                                        />
                                    </Box>
                                    <Box
                                        style={{
                                            height:
                                                filteredTemplates.length === 0
                                                    ? "100vh"
                                                    : undefined,
                                        }}
                                        flex={1}
                                    >
                                        <Select
                                            inputProps={{
                                                options: projectOptions,
                                                placeholder: "Select project",
                                                onChange: (
                                                    selectedOption: OptionItemProps<string> | null,
                                                ) => {
                                                    setSelectedProject(
                                                        selectedOption
                                                            ? selectedOption.value
                                                            : null,
                                                    );
                                                },
                                            }}
                                        />
                                    </Box>
                                </Flex>
                            )}
                        </Box>
                    </>
                ) : (
                    <>
                        <Flex
                            style={{
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Title
                                style={{
                                    fontWeight: 600,
                                    fontSize: "18px",
                                    fontFamily: "Poppins, sans-serif",
                                    padding: "20px 16px",
                                }}
                            >
                                Items
                            </Title>

                            <Button
                                style={{
                                    height: "2.5rem",
                                }}
                                onClick={() =>
                                    router.replace("/templates/create")
                                }
                            >
                                Create item
                            </Button>
                        </Flex>
                        <Flex justifyContent="space-between" rowGap={2}>
                            <Box
                                style={{
                                    height:
                                        filteredTemplates.length === 0
                                            ? "100vh"
                                            : undefined,
                                }}
                                flex={3}
                            >
                                <Select
                                    inputProps={{
                                        options: projectOptions,
                                        placeholder: "Select project",
                                        onChange: (
                                            selectedOption: OptionItemProps<string> | null,
                                        ) => {
                                            setSelectedProject(
                                                selectedOption
                                                    ? selectedOption.value
                                                    : null,
                                            );
                                        },
                                    }}
                                />
                            </Box>{" "}
                            <Box flex={1}>
                                <Input
                                    inputProps={{
                                        placeholder: "Search",
                                        value: searchTerm,
                                        onChange: (e) =>
                                            setSearchTerm(e.target.value),
                                    }}
                                />
                            </Box>
                        </Flex>
                    </>
                )}
            </Container>

            <FlexContainer>
                {filteredTemplates.map((template) => (
                    <TemplateCard
                        template={template}
                        key={template.id}
                        onClick={() => openModal(template)}
                    />
                ))}
            </FlexContainer>

            {selectedTemplate && (
                <Modal isOpen={!!selectedTemplate} setIsOpen={closeModal}>
                    <SelectedTemplatePreview
                        closeModal={closeModal}
                        value={selectedTemplate}
                    />
                </Modal>
            )}
        </>
    );
};

const Container = styled.div`
    width: 100%;
    padding: 0.5rem;
`;
const FlexContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
`;

export default TemplatesContent;
