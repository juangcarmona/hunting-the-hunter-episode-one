import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import { Input } from "@/components/common/FormInputs/Input";
import Modal, { ModalProps } from "@/components/common/Modal";
import Spacer from "@/components/common/Spacer";
import { ClientProps } from "@/dtos/clients.dto";
import UserService from "@/services/UsersService.ts";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import * as yup from "yup";

export interface DomainSettingsModalProps {
    client: ClientProps | null;
    onConfirm: () => void;
}

interface UpdateDomainSettingsData {
    domain: string;
}

const validationSchema = yup.object().shape({
    domain: yup
        .string()
        .test(
            "forbidden-characters",
            "Domain contains forbidden characters",
            (value) => {
                return (
                    !value?.includes("http") &&
                    !value?.includes("/") &&
                    !value?.includes("\\") &&
                    !value?.includes(" ")
                );
            },
        ),
});

const DomainSettingsModal: React.FC<DomainSettingsModalProps & ModalProps> = ({
    isOpen,
    setIsOpen,
    client,
    onConfirm,
}) => {
    const [loading, setLoading] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<UpdateDomainSettingsData>({
        resolver: yupResolver(validationSchema as any),
        mode: "all",
    });

    if (!client) return null;

    const onSubmit = async (data: UpdateDomainSettingsData) => {
        setLoading(true);

        try {
            const result = await UserService.updateDomainSettings(
                client.id,
                data,
            );
            onConfirm();
            if (result.ok && result.data?.type === "success") {
                toast.success("Domain settings updated successfully");
            } else {
                toast.error("Failed to update domain settings");
            }
        } catch (error) {
            toast.error("Failed to update domain settings");
        } finally {
            setLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <Modal
            {...{
                isOpen,
                setIsOpen,
            }}
        >
            <Container onSubmit={handleSubmit(onSubmit)}>
                <Flex flexDirection={"column"} minHeight={300}>
                    <h2 style={{ textAlign: "center" }}>Domain Settings</h2>

                    <Spacer y size={2} />

                    <div>
                        Type your domain, without the the protocol or any
                        slashes. Empty to remove.
                    </div>

                    <Spacer y size={2} />

                    <Input
                        register={register}
                        inputProps={{
                            name: "domain",
                            placeholder: "e.g. app.wovlabs.com",
                            defaultValue: client.customDomain || "",
                        }}
                        errors={errors}
                    />

                    <div style={{ flex: 1 }} />

                    <Flex justifyContent={"flex-end"}>
                        <Button
                            small
                            outline
                            onClick={() => {
                                setIsOpen(false);
                            }}
                            type="reset"
                        >
                            Cancel
                        </Button>

                        <Spacer size={2} />

                        <Button
                            small
                            onClick={() => {}}
                            type="submit"
                            disabled={loading || !isValid}
                        >
                            Confirm
                        </Button>
                    </Flex>
                </Flex>
            </Container>
        </Modal>
    );
};

const Container = styled.form`
    width: 100%;
    padding: 20px;
`;

export default DomainSettingsModal;
