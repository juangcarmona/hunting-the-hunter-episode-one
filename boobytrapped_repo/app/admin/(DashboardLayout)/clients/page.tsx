"use client";

import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import Table from "@/components/common/Table";
import { ClientProps } from "@/dtos/clients.dto";
import UserService from "@/services/UsersService.ts";
import moment from "moment";
import React from "react";
import { Column } from "react-table";
import { toast } from "react-toastify";
import styled from "styled-components";
import useSWR from "swr";
import DomainSettingsModal from "./DomainSettingsModal";

interface ChipPageProps {
    params: {
        type: string;
    };
}

const Clients: React.FC<ChipPageProps> = ({ params }: ChipPageProps) => {
    const [isDomainSettingsOpen, setIsDomainSettingsOpen] =
        React.useState(false);
    const [selectedClient, setSelectedClient] =
        React.useState<ClientProps | null>(null);

    const { data: clientsData, isValidating, mutate } = useSWR(`/clients`);

    const data = React.useMemo(
        () => (clientsData?.data?.json as ClientProps[]) || [],
        [clientsData],
    );

    const toggleUserEnabled = async (userId: string, enabled: boolean) => {
        await UserService.setEnabled(userId, enabled)
            .then((res) => {
                if (res.ok) toast.success("User status updated successfully");
                else toast.error("Failed to update user status");
            })
            .catch((err) => {
                toast.error("Failed to update user status");
            })
            .finally(() => {
                mutate();
            });
    };

    const columns = React.useMemo<Column<ClientProps>[]>(
        () => [
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "email",
                accessor: "User",
                Cell: ({ value }) => <span>{value?.email}</span>,
            },
            {
                id: "status",
                Header: "Status",
                Cell: ({ row }) => (
                    <span>
                        {row.original.User?.enabled ? "Enabled" : "Disabled"}
                    </span>
                ),
            },
            {
                id: "domain",
                Header: "Domain",
                Cell: ({ row }) => (
                    <span>{row.original.customDomain || "N/A"}</span>
                ),
            },
            {
                id: "createdAt",
                Header: "Created At",
                Cell: ({ row }) => (
                    <span>
                        {moment(
                            new Date(row.original.User?.createdAt),
                        ).fromNow()}
                    </span>
                ),
            },
            {
                id: "actions",
                Header: "Actions",
                Cell: ({ row }) => (
                    <Flex rowGap={2}>
                        <Button
                            type="button"
                            small
                            onClick={() => {
                                setSelectedClient(row.original);
                                setIsDomainSettingsOpen(true);
                            }}
                        >
                            Domain
                        </Button>

                        <Button
                            type="button"
                            small
                            onClick={() => {
                                toggleUserEnabled(
                                    row.original.User.id,
                                    !row.original.User.enabled,
                                );
                            }}
                        >
                            {row.original.User?.enabled ? "Disable" : "Enable"}
                        </Button>
                    </Flex>
                ),
            },
        ],
        [],
    );

    return (
        <Container>
            <h2>Clients</h2>
            {isValidating ? (
                <h3>Loading clients...</h3>
            ) : (
                <Table
                    data={data}
                    columns={columns}
                    hasActionColumn
                    page={1}
                    setPage={undefined}
                    pageSize={100}
                    setPageSize={undefined}
                    total={0}
                />
            )}

            <DomainSettingsModal
                isOpen={isDomainSettingsOpen}
                setIsOpen={setIsDomainSettingsOpen}
                client={selectedClient}
                onConfirm={mutate}
            />
        </Container>
    );
};

const Container = styled.div`
    padding: 10px;
    width: 100%;
`;

export default Clients;
