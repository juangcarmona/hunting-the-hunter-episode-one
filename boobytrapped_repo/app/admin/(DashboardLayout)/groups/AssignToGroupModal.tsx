import Button from "@/components/common/Button";
import { Input } from "@/components/common/FormInputs/Input";
import { Select } from "@/components/common/FormInputs/Select";
import Modal from "@/components/common/Modal";
import Spacer from "@/components/common/Spacer";
import ChipService from "@/services/ChipService";
import { theme } from "@/styles/theme";
import GroupService, { ChipGroupDto } from "@/utils/GroupService";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import useSWR from "swr";
import * as yup from "yup";

interface AssignToGroupModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    hashes?: string[];
    onAssign?: () => void;
}

const addFormValidation = yup.object().shape({
    name: yup.string().required(),
});

interface CreateGroupForm {
    name: string;
}

const AssignToGroupModal: React.FC<AssignToGroupModalProps> = ({
    isOpen,
    setIsOpen,
    hashes,
    onAssign,
}) => {
    const { data: chipsGroupsData, mutate: reloadGroups } =
        useSWR("/chips-group");

    const [loading, setLoading] = React.useState(false);
    const [selectedGroupId, setSelectedGroupId] = React.useState<string>();

    const chipsGroups = React.useMemo(() => {
        if (!chipsGroupsData?.ok) return [];
        return (chipsGroupsData?.data?.json as ChipGroupDto[]) || [];
    }, [chipsGroupsData]);

    const [isCreatingGroup, setIsCreatingGroup] = React.useState(false);

    const {
        register: add_register,
        handleSubmit: add_handleSubmit,
        formState: { errors: add_errors },
    } = useForm<CreateGroupForm>({
        mode: "all",
        resolver: yupResolver(addFormValidation) as any,
    });

    const createNewGroup = async (data: CreateGroupForm) => {
        setLoading(true);
        await GroupService.createGroup(data.name)
            .then(async (res) => {
                if (res.ok && res.data?.type == "success") {
                    toast.success("Group created successfully");
                    const groupId = res.data?.json.id;

                    await assignToExistingGroup(groupId);

                    setIsOpen(false);
                } else {
                    toast.error(
                        "Error creating group: " + res.data?.json?.message,
                    );
                }
            })
            .catch((err) => {
                alert("Error creating group");
            })
            .finally(() => {
                reloadGroups();
                setLoading(false);
            });
    };

    const assignToExistingGroup = async (groupId: string) => {
        if (!hashes) return;

        ChipService.assignToGroup(hashes, groupId)
            .then((res) => {
                if (res.ok) {
                    toast.success("Smart tags assigned to group successfully");
                    setIsOpen(false);
                } else {
                    toast.error(
                        "Error assigning smart tags to group: " +
                            res.data?.json?.message,
                    );
                }
            })
            .catch((err) => {
                alert("Error assigning smart tags to group");
            })
            .finally(() => {
                if (onAssign) onAssign();
                setLoading(false);
            });
    };

    React.useEffect(() => {
        setSelectedGroupId(undefined);
        setIsCreatingGroup(false);
    }, [isOpen]);

    return (
        <Modal {...{ isOpen, setIsOpen }}>
            <Container>
                <h2>Assign {hashes?.length || 0} to group</h2>

                <Spacer y size={3} />

                {isCreatingGroup ? (
                    <FlexForm onSubmit={add_handleSubmit(createNewGroup)}>
                        <Input
                            label="New group name"
                            register={add_register}
                            errors={add_errors}
                            inputProps={{
                                name: "name",
                                placeholder: "Group name",
                            }}
                        />

                        <Spacer y size={3} />

                        <div>
                            Or you can{" "}
                            <ClickableText
                                onClick={() => {
                                    setIsCreatingGroup(false);
                                }}
                            >
                                assign to an existing group
                            </ClickableText>
                        </div>

                        <div style={{ flex: 1 }}></div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button
                                onClick={() => setIsOpen(false)}
                                outline
                                small
                            >
                                Cancel
                            </Button>

                            <Spacer size={2} />

                            <Button small type="submit" disabled={loading}>
                                Create and assign
                            </Button>
                        </div>
                    </FlexForm>
                ) : (
                    <FlexForm>
                        <Select
                            label="Group"
                            inputProps={{
                                name: "groupId",
                                placeholder: "Select a group",
                                options: chipsGroups.map((group) => ({
                                    label: group.name,
                                    value: group.id,
                                })),
                                onChange: (e: { value: string }) => {
                                    setSelectedGroupId(e.value);
                                },
                            }}
                        />

                        <Spacer y size={3} />

                        <div>
                            If you need a new group, you can{" "}
                            <ClickableText
                                onClick={() => setIsCreatingGroup(true)}
                            >
                                create a new one.
                            </ClickableText>
                        </div>

                        <div style={{ flex: 1 }}></div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button
                                onClick={() => setIsOpen(false)}
                                outline
                                small
                            >
                                Cancel
                            </Button>

                            <Spacer size={2} />

                            <Button
                                small
                                type="button"
                                disabled={loading || !selectedGroupId}
                                onClick={() => {
                                    if (!selectedGroupId) return;
                                    assignToExistingGroup(selectedGroupId);
                                }}
                            >
                                Assign
                            </Button>
                        </div>
                    </FlexForm>
                )}
            </Container>
        </Modal>
    );
};

const ClickableText = styled.span`
    cursor: pointer;
    color: ${theme.colors.primary};
    font-weight: 600;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 300px;
    padding: 16px;
`;

const FlexForm = styled.form`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

export default AssignToGroupModal;
