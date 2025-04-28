"use client";

import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import Table from "@/components/common/Table";
import InvitationsService, { Invitation } from "@/utils/InvitationsService";
import React from "react";
import { Column } from "react-table";
import { toast } from "react-toastify";
import styled from "styled-components";
import useSWR from "swr";
import AddInviteModal from "./AddInviteModal";

const Codes: React.FC = () => {
    const { data: reqData, mutate: mutateInvites } = useSWR("/invitations");
    const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);

    const data = React.useMemo(
        () => (reqData?.data?.json as Invitation[]) || [],
        [reqData],
    );

    const deleteCode = (code: string) => {
        InvitationsService.remove(code)
            .then((res) => {
                if (res.ok) {
                    toast.success("Invitation deleted");
                } else toast.error("Error deleting code");
            })
            .catch((error) => {
                alert(error);
            })
            .finally(() => {
                mutateInvites();
            });
    };

    const columns = React.useMemo<Column<Invitation>[]>(
        () => [
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Created At",
                accessor: "createdAt",
                Cell: ({ value }) => {
                    return new Date(value).toLocaleDateString();
                },
            },
            {
                Header: "Actions",
                Cell: ({ row }) => {
                    return (
                        <Button
                            small
                            onClick={() => deleteCode(row.original.id)}
                        >
                            Delete
                        </Button>
                    );
                },
            },
        ],
        [],
    );

    return (
        <Container>
            <h2>Invitations</h2>

            <Flex justifyContent="flex-end">
                <Button
                    small
                    onClick={() => {
                        setIsInviteModalOpen(true);
                    }}
                >
                    Add invite
                </Button>
            </Flex>

            <Table
                columns={columns}
                data={data}
                page={1}
                setPage={undefined}
                pageSize={100}
                setPageSize={undefined}
                total={0}
            />

            {data?.length == 0 && <p>No invitations found</p>}

            <AddInviteModal
                onConfirm={mutateInvites}
                {...{
                    isOpen: isInviteModalOpen,
                    setIsOpen: setIsInviteModalOpen,
                }}
            />
        </Container>
    );
};

const Container = styled.div`
    padding: 10px;
    width: 100%;
`;

export default Codes;
