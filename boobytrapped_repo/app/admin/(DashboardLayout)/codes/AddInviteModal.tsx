import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import { Input } from "@/components/common/FormInputs/Input";
import Modal from "@/components/common/Modal";
import Spacer from "@/components/common/Spacer";
import InvitationsService from "@/utils/InvitationsService";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import * as yup from "yup";

interface AddInviteModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onConfirm: () => void;
}

interface InviteFromProps {
    email: string;
}

const validationSchema = yup.object().shape({
    email: yup.string().email().required(),
});

const AddInviteModal = ({
    isOpen,
    setIsOpen,
    onConfirm,
}: AddInviteModalProps) => {
    const [loading, setLoading] = React.useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InviteFromProps>({
        mode: "onChange",
        resolver: yupResolver(validationSchema) as any,
    });

    const inviteUser = async ({ email }: InviteFromProps) => {
        setLoading(true);
        await InvitationsService.create(email)
            .then((res) => {
                if (res.ok && res.data?.type == "success") {
                    toast.success("Invitation created");
                    if (onConfirm) onConfirm();
                    setIsOpen(false);
                } else {
                    toast.error(
                        "Error creating code: " + res.data?.json.message,
                    );
                }
            })
            .catch((error) => {
                alert(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Modal {...{ isOpen, setIsOpen }}>
            <FormContainer onSubmit={handleSubmit(inviteUser)}>
                <Flex flexDirection={"column"}>
                    <h2>Invite a new user</h2>

                    <Spacer y size={5} />

                    <Input
                        inputProps={{
                            type: "email",
                            required: true,
                            name: "email",
                        }}
                        register={register}
                        errors={errors}
                        label="Email"
                    />

                    <Spacer y size={2} />

                    <Flex justifyContent={"flex-end"}>
                        <Button
                            type="reset"
                            outline
                            onClick={() => {
                                reset();
                                setIsOpen(false);
                            }}
                        >
                            Cancel
                        </Button>

                        <Spacer size={2} />

                        <Button
                            type="submit"
                            onClick={() => {
                                onConfirm();
                            }}
                            disabled={loading}
                        >
                            Send Invite
                        </Button>
                    </Flex>
                </Flex>
            </FormContainer>
        </Modal>
    );
};

const FormContainer = styled.form`
    padding: 12px;
`;

export default AddInviteModal;
