import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import { Select } from "@/components/common/FormInputs/Select";
import Modal, { ModalProps } from "@/components/common/Modal";
import Spacer from "@/components/common/Spacer";
import { ClientProps } from "@/dtos/clients.dto";
import ChipService from "@/services/ChipService";
import React from "react";
import styled from "styled-components";
import useSWR from "swr";

export interface AssignChipModalProps {
    chipHashes: string[];
    isAlreadyAssigned: boolean;
    onAssign: () => void;
}

const AssignChipModal: React.FC<AssignChipModalProps & ModalProps> = ({
    isOpen,
    setIsOpen,
    chipHashes,
    isAlreadyAssigned,
    onAssign,
}) => {
    const [loading, setLoading] = React.useState(false);
    const [selectedAssignee, setSelectedAssignee] = React.useState<string>("");

    const { data: clientsData } = useSWR(`/clients`);

    const clients = React.useMemo(() => {
        if (!clientsData?.ok) return [];
        return (clientsData?.data?.json as ClientProps[]) || [];
    }, [clientsData]);

    const assign = async (client: string | null) => {
        setLoading(true);
        await ChipService.assignToClient(chipHashes, client)
            .then((res) => {
                if (res.ok && res.data?.type == "success") {
                    onAssign();
                    setIsOpen(false);
                } else {
                    alert("There was an error assigning the chip");
                }
            })
            .catch((err) => {
                alert("Unknown error");
                console.error({ err });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Modal
            {...{
                isOpen,
                setIsOpen,
            }}
        >
            <Container>
                <Flex flexDirection={"column"} minHeight={300} height={500}>
                    <h2 style={{ textAlign: "center" }}>Assign chips</h2>

                    <Spacer y size={2} />

                    <div>Assign {chipHashes?.length} chips to:</div>

                    <Spacer y size={2} />

                    <Select
                        label="Client"
                        inputProps={{
                            name: "client",
                            options: clients.map((client) => ({
                                label: client.name,
                                value: client.id,
                            })),
                            onChange: (value) => {
                                setSelectedAssignee(value.value);
                            },
                        }}
                    />

                    <div style={{ flex: 1 }}></div>

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

                        {isAlreadyAssigned && (
                            <Button
                                yellow
                                small
                                disabled={loading}
                                onClick={() => {
                                    assign(null);
                                }}
                            >
                                Remove
                            </Button>
                        )}

                        <Spacer size={2} />

                        <Button
                            small
                            onClick={() => {
                                assign(selectedAssignee);
                            }}
                            type="submit"
                            disabled={loading || !selectedAssignee}
                        >
                            Assign
                        </Button>
                    </Flex>
                </Flex>
            </Container>
        </Modal>
    );
};

const Container = styled.div`
    width: 100%;
    padding: 20px;
`;

export default AssignChipModal;
