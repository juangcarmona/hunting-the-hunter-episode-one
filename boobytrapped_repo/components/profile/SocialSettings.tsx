import Box from "@/components/common/Box";
import UserService, { SocialSettingsData } from "@/services/UsersService.ts";
import { socialsState } from "@/state/socials";
import { theme } from "@/styles/theme";
import { ALLOWED_VERIFICATION_LABELS } from "@/utils/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "@react-hook/media-query";
import _ from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import * as yup from "yup";
import Button from "../common/Button";
import Checkbox from "../common/Checkbox";
import Flex from "../common/Flex";
import { Input } from "../common/FormInputs/Input";
import { Select } from "../common/FormInputs/Select";
import Spacer from "../common/Spacer";
import { SectionLabel } from "./GeneralSettings";
import { UserProps } from "./ProfileContent";

const SUPPORTED_SOCIALS = [
    {
        name: "facebook",
        icon: "/images/socials/facebook-black.png",
    },
    {
        name: "x",
        icon: "/images/socials/x-black.png",
    },
    {
        name: "instagram",
        icon: "/images/socials/instagram-black.png",
    },
    {
        name: "linkedin",
        icon: "/images/socials/linkedin-black.png",
    },
    {
        name: "website",
        icon: "/images/socials/website.svg",
    },
    {
        name: "email",
        icon: "/images/socials/email.svg",
        placeholder: "example@mail.com",
    },
];

const validationSchema = yup.object().shape({
    getInTouchMessage: yup.string(),
    facebook: yup.string().url(),
    x: yup.string().url(),
    instagram: yup.string().url(),
    linkedin: yup.string().url(),
    email: yup.string().email(),
    website: yup.string().url(),
}) as any;

interface SocialSettingsProps {
    userData: UserProps;
    reloadUserProps: () => void;
}

interface SocialSettingsFormData {
    [x: string]: any;

    getInTouchMessage?: string;
    claimLabel?: string;
    facebook?: string;
    x?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;

    verificationLabel?: {
        label: string;
        value: string;
    } | null;

    phone?: string;
}

const SocialSettings: React.FC<SocialSettingsProps> = ({
    userData,
    reloadUserProps,
}) => {
    const [socialSettingsPreview, setSocialSettingsPreview] =
        useRecoilState(socialsState);
    const [showVerificationLabel, setShowVerificationLabel] =
        React.useState(false);
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    const [isUpdating, setIsUpdating] = React.useState(false);

    const {
        control,
        watch,
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<SocialSettingsFormData>({
        mode: "all",
        resolver: yupResolver(validationSchema),
        defaultValues: {
            verificationLabel: userData.socials?.verificationLabel
                ? {
                      label: userData.socials.verificationLabel,
                      value: userData.socials.verificationLabel,
                  }
                : undefined,
            getInTouchMessage: userData.socials?.getInTouchMessage || "",
            facebook: userData.socials?.facebook || "",
            x: userData.socials?.x || "",
            instagram: userData.socials?.instagram || "",
            linkedin: userData.socials?.linkedin || "",
            email: userData.socials?.email || "",
            website: userData.socials?.website || "",
            claimLabel: userData.socials?.claimLabel || "Claim Ownership",
        },
    });

    const onSubmit = async (formData: SocialSettingsFormData) => {
        const data: SocialSettingsData = {
            ...formData,
            verificationLabel: showVerificationLabel
                ? formData.verificationLabel?.value
                : null,
        };

        setSocialSettingsPreview(data);

        setIsUpdating(true);
        await UserService.updateSocials(data)
            .then((res) => {
                if (res.ok) {
                    toast.success("Socials updated successfully");
                    reloadUserProps();
                } else {
                    toast.error("Failed to update socials");
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error("Failed to update socials");
            })
            .finally(() => {
                setIsUpdating(false);
            });
    };

    const currentData = watch();

    React.useEffect(() => {
        setSocialSettingsPreview(userData.socials);
        setShowVerificationLabel(!!userData.socials?.verificationLabel);
    }, [userData.socials, setShowVerificationLabel, setSocialSettingsPreview]);

    React.useEffect(() => {
        const formData = {
            ...currentData,
            verificationLabel: showVerificationLabel
                ? currentData.verificationLabel?.value ||
                  userData.socials?.verificationLabel
                : undefined,
        };

        const shouldUpdate = !_.isEqual(formData, socialSettingsPreview);

        if (shouldUpdate && formData && setSocialSettingsPreview) {
            setSocialSettingsPreview(formData);
        }
    }, [
        currentData,
        userData,
        setSocialSettingsPreview,
        showVerificationLabel,
        socialSettingsPreview,
    ]);

    return (
        <div
            style={{
                minWidth: isMobile ? 0 : 400,
                maxWidth: 500,
                padding: 20,
                flex: 1,
                width: "inherit",
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: 12,
                    }}
                >
                    <SectionLabel>Show Verification Label?</SectionLabel>

                    <Checkbox
                        containerStyle={{ marginBottom: 12 }}
                        value={showVerificationLabel}
                        defaultChecked={!!userData.socials?.verificationLabel}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setShowVerificationLabel(e.target.checked);
                        }}
                    />
                </div>
                <Flex alignItems={"center"} rowGap={3}>
                    <IconContainer
                        style={{
                            opacity: showVerificationLabel ? "1" : "0.35",
                        }}
                    >
                        <img src="/images/verify_9918694.png" />
                    </IconContainer>
                    <Box style={{ flex: 1 }}>
                        <Select
                            control={control}
                            register={register}
                            errors={errors}
                            inputProps={{
                                isSearchable: false,
                                isDisabled: !showVerificationLabel,
                                name: "verificationLabel",
                                defaultValue: userData.socials
                                    ?.verificationLabel
                                    ? {
                                          label: userData.socials
                                              .verificationLabel,
                                          value: userData.socials
                                              .verificationLabel,
                                      }
                                    : null,
                                options: ALLOWED_VERIFICATION_LABELS.map(
                                    (label) => ({
                                        label,
                                        value: label,
                                    }),
                                ),
                            }}
                        />
                    </Box>
                </Flex>
                <Spacer y size={3} />

                <Input
                    register={register}
                    errors={errors}
                    inputProps={{
                        defaultValue: userData.socials?.getInTouchMessage,
                        name: "getInTouchMessage",
                        placeholder: `E.g. "Get in touch with <brand>"`,
                    }}
                    label="Invite users to connect with you"
                />

                <Spacer y size={3} />

                <SectionLabel>Social</SectionLabel>

                {SUPPORTED_SOCIALS.map((social) => (
                    <SocialWrapper key={social.name}>
                        <IconContainer>
                            <img src={social.icon} />
                        </IconContainer>

                        <SocialInput
                            register={register}
                            errors={errors}
                            inputProps={{
                                defaultValue: userData.socials?.[social.name],
                                name: social.name,
                                placeholder: social.placeholder ?? "https://",
                            }}
                        />
                    </SocialWrapper>
                ))}

                <Spacer y size={4} />

                <SectionLabel>
                    If it&apos;s claimable, would you like to change the text?
                </SectionLabel>

                <Input
                    register={register}
                    errors={errors}
                    inputProps={{
                        defaultValue:
                            userData.socials?.claimLabel || "Claim Ownership",
                        name: "claimLabel",
                        placeholder: "Claim",
                    }}
                />

                <Spacer y size={4} />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Button
                        type="submit"
                        disabled={isUpdating || !isValid}
                        style={{
                            width: "100%",
                        }}
                    >
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
};

const SocialWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
`;

const IconContainer = styled.div`
    max-width: 32px;

    img {
        width: 100%;
        height: auto;
    }
`;

const SocialInput = styled(Input)`
    flex: 1;
`;

export default SocialSettings;
