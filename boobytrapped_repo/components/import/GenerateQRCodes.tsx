import { ClientProps } from "@/dtos/clients.dto";
import ChipService from "@/services/ChipService";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import * as yup from "yup";
import Button from "../common/Button";
import Flex from "../common/Flex";
import { Input } from "../common/FormInputs/Input";
import { Select } from "../common/FormInputs/Select";
import Spacer from "../common/Spacer";

const validationSchema = yup.object().shape({
    count: yup
        .number()
        .typeError("You must specify a number")
        .required()
        .min(1)
        .max(100),
});

interface GenerateQRCodesFormData {
    count: number;
    clientId: {
        label: string;
        value: string;
    };
}

interface GenerateQRCodesProps {
    clients: ClientProps[];
}

const GenerateQRCodes: React.FC<GenerateQRCodesProps> = ({ clients }) => {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<GenerateQRCodesFormData>({
        mode: "all",
        resolver: yupResolver(validationSchema as any),
    });

    const router = useRouter();

    const [loading, setLoading] = React.useState(false);

    const onSubmit = async (formData: GenerateQRCodesFormData) => {
        const data = {
            count: formData.count,
            clientId: formData.clientId?.value,
        };

        setLoading(true);

        await ChipService.generateQRCodes(data)
            .then((res) => {
                if (res.ok) {
                    toast.success("Generated QR Codes successfully");
                    router.push("/admin/chips/available");
                } else {
                    toast.error(
                        "Failed to generate QR Codes: " +
                            res.data?.json?.message,
                    );
                }
            })
            .catch((err) => {
                toast.error("Failed to generate QR Codes");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Container onSubmit={handleSubmit(onSubmit)}>
            <h2>Generate QR Codes</h2>

            <Spacer y size={4} />

            <Input
                label="How many chips do you want to generate?"
                inputProps={{ name: "count" }}
                register={register}
                errors={errors}
            />

            <Spacer y size={3} />

            <Select
                label="Assign them to:"
                control={control}
                errors={errors}
                inputProps={{
                    name: "clientId",
                    options: clients.map((client) => ({
                        label: client.name,
                        value: client.id,
                    })),
                }}
            />

            <Spacer y size={3} />

            <Flex justifyContent={"center"} alignItems={"center"}>
                <Button disabled={loading} type="submit">
                    Generate
                </Button>
            </Flex>
        </Container>
    );
};

const Container = styled.form`
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    flex: 1;
    text-align: start;
`;

export default GenerateQRCodes;
