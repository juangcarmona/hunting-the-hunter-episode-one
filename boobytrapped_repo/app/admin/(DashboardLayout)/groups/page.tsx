"use client";
import Button from "@/components/common/Button";
import PageContentTitle from "@/components/common/PageContentTitle";
import Table from "@/components/common/Table";
import GroupService, { ChipGroupDto } from "@/utils/GroupService";
import { getTimeAgo } from "@/utils/getTimeAgo";
import Link from "next/link";
import React from "react";
import { MdInsertLink } from "react-icons/md";
import { Column } from "react-table";
import { toast } from "react-toastify";
import useSWR from "swr";

interface GroupProps {
    id: string;
    name: string;
    description: string;
    chipsCount: number;
    usedCount: number;
    createdAt: string;
}

const GroupsPage: React.FC = () => {
    const { data: chipsGroupsData, mutate: reloadGroups } =
        useSWR("/chips-group");

    const chipsGroups = React.useMemo(() => {
        if (!chipsGroupsData?.ok) return [];
        const chipsGroupsDataWithDateConverted = (
            chipsGroupsData?.data?.json as GroupProps[]
        ).map((element: GroupProps) => {
            return {
                ...element,
                createdAt: getTimeAgo(element.createdAt),
            };
        });
        return (chipsGroupsDataWithDateConverted as GroupProps[]) || [];
    }, [chipsGroupsData]);

    const deleteGroup = async (group: ChipGroupDto) => {
        if (
            confirm(
                `Are you sure you want to delete the group "${group.name}"?`,
            )
        ) {
            await GroupService.deleteGroup(group.id)
                .then((res) => {
                    if (res.ok) {
                        toast.success("Group deleted successfully");
                    } else {
                        toast.error(
                            "Error deleting group: " + res.data?.json?.message,
                        );
                    }
                })
                .catch((err) => {
                    alert("Error deleting group");
                })
                .finally(() => {
                    reloadGroups();
                });
        }
    };

    const columns = React.useMemo<Column<GroupProps>[]>(
        () => [
            {
                Header: "Name",
                Cell: ({ row }) => (
                    <Link href={`/admin/groups/${row.original.id}`}>
                        <MdInsertLink
                            size={25}
                            style={{
                                marginRight: "10px",
                            }}
                        />
                        <strong>{row.original.name}</strong>
                    </Link>
                ),
            },
            {
                Header: "Available Smart Tags",
                accessor: "chipsCount",
            },
            {
                Header: "Tokenized Smart Tags",
                accessor: "usedCount",
            },
            {
                Header: "Created",
                accessor: "createdAt",
            },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <div>
                        <Button
                            outline
                            small
                            error
                            onClick={() => {
                                deleteGroup(row.original);
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <div>
            <PageContentTitle>Groups</PageContentTitle>

            <Table
                columns={columns}
                data={chipsGroups}
                page={0}
                setPage={undefined}
                pageSize={0}
                setPageSize={undefined}
                total={0}
                hasActionColumn
            />

            {chipsGroups.length === 0 && (
                <div>
                    <Link href={"/admin/chips/available"}>
                        No groups found, to create one go to Available Smart
                        Tags
                    </Link>
                </div>
            )}
        </div>
    );
};

export default GroupsPage;
