import { CampaignType, CampaignsService } from "@/services/CampaignsService";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import Switch from "../Switch";
import Button from "../common/Button";
import Flex from "../common/Flex";
import { Input } from "../common/FormInputs/Input";
import { Textarea } from "../common/FormInputs/TextArea/TextArea";
import Spacer from "../common/Spacer";

const validationSchema = yup.object().shape({
    campaignName: yup.string().required(),
    campaignDescription: yup.string().required(),
}) as any;

interface LostCampaignData {
    campaignName: string;
    campaignDescription: string;
    contactType: "email" | "phone";
    contact?: string;
}

const Lost = () => {
    const router = useRouter();
    const [isPhoneContact, setIsPhoneContact] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LostCampaignData>({
        resolver: yupResolver(validationSchema),
        mode: "onBlur",
    });

    const onSubmit = async (formData: LostCampaignData) => {
        const { campaignName: name, ...rest } = formData;

        const data = {
            name,
            campaignData: {
                ...rest,
                contactType: isPhoneContact ? "phone" : "email",
            },
        };

        await CampaignsService.create({
            ...data,
            campaignType: CampaignType.LOST,
        })
            .then((res) => {
                if (res.ok && res.data?.type == "success") {
                    toast.success("Campaign created successfully");
                    router.push(`/admin/campaigns`);
                } else {
                    toast.error("Failed to create campaign");
                }
            })
            .catch((err) => {
                toast.error("Failed to create campaign");
            });
    };

    return (
        <form style={{ padding: "20px 0" }} onSubmit={handleSubmit(onSubmit)}>
            <div>Enter a name for your new campaign:</div>

            <Input
                register={register}
                errors={errors}
                inputProps={{
                    name: "campaignName",
                    placeholder: "e.g. Bag Lost",
                }}
            />

            <Spacer y size={3} />

            <div>Enter a description for your new campaign:</div>

            <Textarea
                register={register}
                errors={errors}
                inputProps={{
                    name: "campaignDescription",
                    placeholder:
                        "e.g. The owner of this item lost it. If you want more information about this please get in touch with the owner using the email address below.",
                }}
            />

            <Spacer y size={3} />

            <Flex justifyContent={"center"} rowGap={20} alignItems={"center"}>
                <div>Email</div>
                <Switch onChange={setIsPhoneContact} />
                <div>Phone</div>
            </Flex>

            <Spacer y size={3} />

            {isPhoneContact ? (
                <>
                    <div>Enter a phone number (optional):</div>

                    <Input
                        register={register}
                        inputProps={{
                            name: "contact",
                            placeholder: "+44 123 123 123",
                        }}
                    />
                </>
            ) : (
                <>
                    <div>Enter an email address (optional):</div>

                    <Input
                        register={register}
                        inputProps={{
                            name: "contact",
                            placeholder: "e.g. contactme@domain.com",
                        }}
                    />
                </>
            )}

            <Flex justifyContent={"space-between"} style={{ marginTop: 20 }}>
                <Button outline type="button" onClick={router.back}>
                    Previous
                </Button>

                <Button type="submit">Save</Button>
            </Flex>
        </form>
    );
};

export default Lost;
