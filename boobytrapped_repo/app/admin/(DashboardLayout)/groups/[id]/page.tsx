"use client";
import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import Icon from "@/components/common/Icon";
import PageContentTitle from "@/components/common/PageContentTitle";
import Spacer from "@/components/common/Spacer";
import Table from "@/components/common/Table";
import { theme } from "@/styles/theme";
import { ChipGroupDto } from "@/utils/GroupService";
import Link from "next/link";
import React, { useMemo } from "react";
import { Column } from "react-table";
import useSWR from "swr";
import { ChipProps } from "../../chips/[[...type]]/page";
import AssignToGroupModal from "../AssignToGroupModal";

interface GroupDetailProps {
    params: {
        id: string;
    };
}

const GroupDetailPage: React.FC<GroupDetailProps> = ({ params: { id } }) => {
    const [pageSize, setPageSize] = React.useState(10);
    const [page, setPage] = React.useState(1);
    const [selectedChips, setSelectedChips] = React.useState<string[]>([]);
    const [chipsType, setChipsType] = React.useState<"used" | "available">(
        "available",
    );

    const { data: groupData } = useSWR(`/chips-group/${id}`);

    const { data: chipsData, mutate: reloadChips } = useSWR(
        `/chips?${new URLSearchParams({
            groupId: id,
            type: chipsType,
            ...(page ? { page: page.toString() } : {}),
            ...(pageSize ? { pageSize: pageSize.toString() } : {}),
        })}`,
    );

    const group = React.useMemo(() => {
        if (!groupData?.ok) return null;
        return groupData?.data?.json as ChipGroupDto;
    }, [groupData]);

    const chips = React.useMemo(() => {
        if (!chipsData?.ok) return [];
        return chipsData?.data?.json as ChipProps[];
    }, [chipsData]);

    const [isGroupModalOpen, setIsGroupModalOpen] = React.useState(false);

    const total = useMemo(() => {
        return chipsData?.headers?.["x-total-count"] || 0;
    }, [chipsData]);

    const columns = React.useMemo<Column<ChipProps>[]>(
        () => [
            {
                Header: "Serial",
                accessor: "serial",
            },
            {
                Header: "Type",
                accessor: "chipType",
            },
            {
                Header: "Batch",
                accessor: "batch",
            },
            {
                Header: "Status",
                accessor: "tokenId",
                Cell: ({ value }) => {
                    if (value === null) return "Not minted";
                    return "Minted";
                },
            },
            ...(chipsType === "available"
                ? [
                      {
                          Header: "Actions",
                          Cell: ({ row }) => (
                              <Flex rowGap={2}>
                                  <Button outline small error>
                                      Remove
                                  </Button>

                                  <Button
                                      onClick={() => {
                                          setSelectedChips([row.original.hash]);
                                          setIsGroupModalOpen(true);
                                      }}
                                      small
                                  >
                                      Move
                                  </Button>
                              </Flex>
                          ),
                      } as Column<ChipProps>,
                  ]
                : []),
        ],
        [chipsType],
    );

    return (
        <div>
            <PageContentTitle>Smart Tags group: {group?.name}</PageContentTitle>

            <div style={{ padding: 12 }}>
                <Link
                    href={"/admin/groups"}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        color: `${theme.colors.primary}`,
                    }}
                >
                    <strong>
                        <Icon icon="arrow-left" /> Back to all groups
                    </strong>
                </Link>

                <Spacer y size={3} />
            </div>

            <Flex justifyContent={"center"}>
                <Button
                    small
                    onClick={() => {
                        setChipsType(
                            chipsType === "available" ? "used" : "available",
                        );
                        setPage(1);
                    }}
                >
                    {chipsType === "available"
                        ? "Show tokenized smart tags"
                        : "Show available smart tags"}
                </Button>
            </Flex>

            <Table
                hasActionColumn
                data={chips}
                columns={columns}
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                total={total}
                hasPagination={true}
                uniqueRowSelector={(r) => r.hash}
            />

            <AssignToGroupModal
                isOpen={isGroupModalOpen}
                setIsOpen={setIsGroupModalOpen}
                hashes={selectedChips}
                onAssign={reloadChips}
            />
        </div>
    );
};

export default GroupDetailPage;
