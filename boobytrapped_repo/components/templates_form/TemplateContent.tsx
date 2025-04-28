"use client";

import Flex from "@/components/common/Flex";
import { theme } from "@/styles/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "@react-hook/media-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import useSWR from "swr";
import * as yup from "yup";
import Box from "../common/Box";
import Modal from "../common/Modal";
import { ProjectCardProps } from "../projects/ProjectCard";
import Navigation from "../templates/Navigation";
import ExitConfirmationModal from "./ExitConfirmationModal";
import NameModal from "./NameModal";
import TemplateForm from "./TemplateForm";
import TemplatePreview from "./TemplatePreview";

const validationSchema = [
    // Template Name
    yup.object().shape({
        name: yup.string().required(),
    }),
    // Product Details
    yup.object().shape({
        title: yup.string().required(),
        description: yup.string(),
        file: yup.mixed().required(),
        extraMedia: yup.array().of(yup.mixed().required()),
        animationFile: yup.mixed(),
    }),
    // Personalized message
    yup.object().shape({
        personalizedMessage: yup.object().shape({
            title: yup.string().min(1).required(),
            icon: yup.number().required(),
            description: yup.string().min(1).required(),
            websiteLink: yup.string(),
        }),
    }),
    // Product Data
    yup.object().shape({
        traits: yup.array().of(
            yup.object().shape({
                trait_type: yup.string().min(1).required(),
                value: yup.string().min(1).required(),
            }),
        ),
    }),
    // Product History
    yup.object().shape({
        history: yup.array().of(
            yup.object().shape({
                name: yup
                    .object()
                    .shape({
                        label: yup.string().required(),
                        value: yup.string().required(),
                    })
                    .required(),
                companyName: yup.string().required(),
                description: yup.string(),
                date: yup.string().required(),
                city: yup.string().required(),
            }),
        ),
    }),
    // Product Values
    yup.object().shape({
        values: yup.array().of(
            yup.object().shape({
                name: yup.string().min(1).nullable(),
                file: yup.mixed(),
            }),
        ),
    }),
    // Assign
    yup.object().shape(
        {
            project: yup.object().shape({
                label: yup.string().required(),
                value: yup.string().required(),
            }),
        },
        [["project", "newProject"]],
    ),
];

interface Content {
    Histories?: [];
    Medias?: [];
    Values?: [];
    createdAt?: string;
    description?: string;
    id?: string;
    name?: string;
    title?: string;
    projectId?: string;
    provenance?: [];
    personalizedMessage?: {};
    openedFrom?: string;
    media3d?: any;
}

const TemplateContent: React.FC<Content> = (content) => {
    const [step, setStep] = useState(0);
    const [isExitOpen, setIsExitOpen] = useState(false);
    const currentValidationSchema = validationSchema[step];
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    const [showMobileTemplatePreview, setShowMobileTemplatePreview] =
        useState(false);
    const {
        control,
        register,
        trigger,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(currentValidationSchema as any),
    });
    const router = useRouter();
    const values = useWatch({ control });
    const [isStepValid, setIsStepValid] = useState(false);
    const { data } = useSWR("/projects");

    useEffect(() => {
        if (content && Object.keys(content).length > 0) {
            const currentProject = data?.data?.json.find(
                (project: ProjectCardProps) => project.id === content.projectId,
            );
            if (currentProject) {
                setValue(
                    "project",
                    { label: currentProject.name, value: currentProject.id } ||
                        {},
                );
                setValue("templateId", content.id);
            }
            if (content.openedFrom === "projects")
                setValue("openedFrom", "projects");
        }
    }, []);

    useEffect(() => {
        const getIsStepValid = async () => {
            const isValid = await trigger();
            setIsStepValid(isValid);
        };
        getIsStepValid();
    }, [values, step]);

    useEffect(() => {
        // Set initial form values based on the content prop. Only for editing logic
        if (content && Object.keys(content).length > 0) {
            setValue("initialContent", content);
            setValue("name", content.name || "");

            setValue("title", content.title || "");
            setValue("description", content.description || "");

            content.media3d && setValue("animationFile", content.media3d);
            let extraMediaFiles: any[] = [];
            content.Medias?.forEach((file, index) => {
                if (index === 0) {
                    setValue("file", file || "");
                } else {
                    extraMediaFiles.push(file || "");
                }
            });
            extraMediaFiles.length > 0 &&
                setValue("extraMedia", extraMediaFiles || []);

            setValue("traits", content.provenance || []);
            // When editing adapt the content of history name to the template form:
            content.Histories?.forEach((history: any) => {
                if (typeof history.name !== "object") {
                    history.name = { value: history.name, label: history.name };
                    history.date = new Date(history.date).toDateString();
                }
            });
            setValue("history", content.Histories || []);

            content.Values?.forEach((value: any) => {
                value.file = {};

                value.file.name = value.mediaUrl?.substring(
                    value.mediaUrl?.lastIndexOf("/") + 1,
                );
            });
            setValue("values", content.Values || []);

            const parsedPersonalizedMessage =
                typeof content.personalizedMessage === "string"
                    ? JSON.parse(content.personalizedMessage)
                    : content.personalizedMessage;
            setValue("personalizedMessage", parsedPersonalizedMessage || {});
        }
    }, [content, setValue]);

    const onBack = () => {
        if (step === 0) {
            router.replace("/admin/projects");
        } else {
            setStep(step - 1);
        }
    };

    return (
        <Box width={isMobile ? "100%" : undefined}>
            {isExitOpen && (
                <ExitConfirmationModal
                    values={values}
                    setIsExitOpen={setIsExitOpen}
                />
            )}
            {showMobileTemplatePreview && (
                <Modal
                    isOpen={showMobileTemplatePreview}
                    setIsOpen={setShowMobileTemplatePreview}
                >
                    <TemplatePreview step={step} values={values} />
                </Modal>
            )}
            <Box
                style={{
                    filter: isExitOpen ? "blur(2px)" : "none",
                    minWidth: isMobile ? 0 : 500,
                    minHeight: 500,
                }}
            >
                <Navigation
                    setShowMobileTemplatePreview={setShowMobileTemplatePreview}
                    step={step}
                    onExit={() => {
                        setIsExitOpen(true);
                    }}
                    onBack={onBack}
                />

                <form>
                    {step === 0 && (
                        <NameModal
                            isValid={isStepValid}
                            register={register}
                            setStep={setStep}
                        />
                    )}
                    {step > 0 && (
                        <Flex
                            justifyContent={"center"}
                            rowGap={100}
                            width={"100%"}
                        >
                            <TemplateForm
                                control={control}
                                isValid={isStepValid}
                                register={register}
                                setStep={setStep}
                                step={step}
                                setValue={setValue}
                                values={values}
                            />
                            {!isMobile && (
                                <TemplatePreview step={step} values={values} />
                            )}
                        </Flex>
                    )}
                </form>
            </Box>
        </Box>
    );
};

export default TemplateContent;
