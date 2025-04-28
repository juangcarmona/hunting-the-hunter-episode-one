import { CampaignType, CampaignsService } from "@/services/CampaignsService";
import { theme } from "@/styles/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "@react-hook/media-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import * as yup from "yup";
import Button from "../common/Button";
import Flex from "../common/Flex";
import { Input } from "../common/FormInputs/Input";
import { Textarea } from "../common/FormInputs/TextArea/TextArea";
import Spacer from "../common/Spacer";

const validationSchema = yup.object().shape({
    campaignName: yup.string().required(),
    messageTitle: yup.string().required(),
    link: yup.string().optional(),
    icon: yup.string().optional(),
}) as any;

interface MessageCampaignData {
    campaignName: string;
    messageTitle: string;
    messageDescription: string;
    link?: string;
    linkCtaText?: string;
    icon?: string;
}

const AVAILABLE_ICONS = [
    "diamond",
    "gift",
    "target",
    "hands",
    "circle",
    "leaf",
    "ticket",
    "chat",
    "heart",
    "award",
];

const Message = () => {
    const router = useRouter();
    const [selectedIcon, setSelectedIcon] = useState<string>("");
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<MessageCampaignData>({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });

    const onSubmit = async (formData: MessageCampaignData) => {
        const { campaignName: name, ...rest } = formData;
        const data = {
            name,
            campaignType: CampaignType.MESSAGE,
            campaignData: {
                ...rest,
                icon: selectedIcon,
            },
        };

        await CampaignsService.create(data)
            .then((res) => {
                if (res.ok && res.data?.type == "success") {
                    toast.success("Campaign created successfully");
                    router.push(`/admin/campaigns`);
                } else {
                    toast.error("Failed to create campaign");
                }
            })
            .catch(() => {
                toast.error("Failed to create campaign");
            });
    };

    return (
        <form
            style={{
                padding: "20px 0",
            }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div>Enter a name for your new campaign:</div>

            <Input
                register={register}
                errors={errors}
                inputProps={{
                    name: "campaignName",
                    placeholder: "e.g. 20% Discount Code Christmas",
                }}
            />

            <div>
                Add a personal message to the product to attract your customers.
            </div>

            <Input
                register={register}
                errors={errors}
                inputProps={{
                    name: "messageTitle",
                    placeholder:
                        "e.g. Enjoy a discount code on the next purchase!",
                }}
            />

            <Spacer y size={3} />

            <div>Select an icon for personalised message:</div>

            <IconsContainer>
                {AVAILABLE_ICONS.map((icon) => (
                    <Icon
                        style={{
                            width: isMobile ? "50px" : "64px",
                            height: isMobile ? "50px" : "64px",
                        }}
                        key={icon}
                        selected={selectedIcon === icon}
                        onClick={() => setSelectedIcon(icon)}
                    >
                        <Image
                            src={`/images/campaigns/icons/${icon}.svg`}
                            width={isMobile ? 30 : 36}
                            height={isMobile ? 30 : 36}
                            alt={icon}
                        />
                    </Icon>
                ))}
            </IconsContainer>

            <Spacer y size={3} />

            <Textarea
                register={register}
                errors={errors}
                inputProps={{
                    name: "messageDescription",
                    placeholder: `e.g. Join us in celebrating our 20th anniversary with a lavish 25% discount on this exquisite item! Use code "25OFF" and treat yourself to luxury at an exceptional value.`,
                }}
            />

            <Spacer y size={3} />

            <Input
                register={register}
                errors={errors}
                inputProps={{
                    name: "link",
                    placeholder: "https://example.com/",
                }}
            />

            <Spacer y size={3} />

            <Input
                register={register}
                errors={errors}
                inputProps={{
                    name: "linkCtaText",
                    placeholder: "Link button's text (optional)",
                }}
            />

            <Spacer y size={3} />

            <Flex justifyContent={"space-between"}>
                <Button outline onClick={router.back} type="button">
                    Previous
                </Button>

                <Button type="submit" disabled={!isValid}>
                    Save
                </Button>
            </Flex>
        </form>
    );
};

const IconsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    margin-top: 10px;
`;

const Icon = styled.div<{ selected?: boolean }>`
    border: 2px solid #e6e6e6;
    border-radius: 8px;

    width: 64px;
    height: 64px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    ${({ selected }) =>
        selected &&
        `
        border-color: #3772ff;
    `}

    &:hover {
        cursor: pointer;
        border-color: #3772ff;
    }
`;

export default Message;
