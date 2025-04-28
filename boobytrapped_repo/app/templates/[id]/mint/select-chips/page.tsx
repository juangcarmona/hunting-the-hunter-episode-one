"use client";
import ShowQRModal, {
    downloadQR,
    getQRFinalUrl,
} from "@/app/admin/(DashboardLayout)/chips/QRModal";
import { ChipProps } from "@/app/admin/(DashboardLayout)/chips/[[...type]]/page";
import Box from "@/components/common/Box";
import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import Spacer from "@/components/common/Spacer";
import Table from "@/components/common/Table";
import ExitConfirmationModal from "@/components/templates_form/ExitConfirmationModal";
import {
    mintingSelectedChipGroupState,
    mintingSelectedChipsState,
} from "@/state/minting";
import { theme } from "@/styles/theme";
import { ChipGroupDto } from "@/utils/GroupService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdDownloading, MdQrCode2 } from "react-icons/md";
import QRCode from "react-qr-code";
import { Column } from "react-table";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import useSWR from "swr";

const SelectChipPage = () => {
    const [tableMode, setTableMode] = React.useState<"singular" | "group">(
        "singular",
    );
    const [isExitOpen, setIsExitOpen] = useState(false);
    const [selectedQR, setSelectedQR] = React.useState<string>();
    const [isOpenQRModal, setIsOpenQRModal] = React.useState(false);
    const router = useRouter();

    const setMintingSelectedChips = useSetRecoilState(
        mintingSelectedChipsState,
    );

    const setMintingSelectedChipGroup = useSetRecoilState(
        mintingSelectedChipGroupState,
    );

    const chipColumns = React.useMemo<Column<ChipProps>[]>(
        () => [
            {
                Header: "Serial",
                accessor: "serial",

                Cell: ({ value, row }) => (
                    <div
                        style={{
                            maxWidth: 300,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {value}
                    </div>
                ),
            },
            {
                Header: "Type",
                accessor: "chipType",
                Cell: ({ value, row }) => (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {!row.original.isQR ? (
                            value
                        ) : (
                            <>
                                <MdQrCode2
                                    size={30}
                                    style={{
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        setSelectedQR(row.original.uidHash);
                                        setIsOpenQRModal(true);
                                    }}
                                />

                                <MdDownloading
                                    size={30}
                                    style={{
                                        marginLeft: "20px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        setSelectedQR(row.original.uidHash);

                                        setTimeout(() => {
                                            downloadQR(
                                                row.original.serial,
                                                "QRCode_Preview",
                                            );
                                        }, 1000);
                                    }}
                                />
                            </>
                        )}
                    </div>
                ),
            } as Column<ChipProps>,

            // {
            //     Header: "Batch",
            //     accessor: "batch",
            // },
            {
                Header: "Code",
                accessor: "uidHash",
                Cell: ({ value, row }) => (
                    <div
                        style={{
                            maxWidth: 300,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {value}
                    </div>
                ),
            },
            {
                Header: "Added At",
                accessor: "addedAt",
                Cell: ({ value }) => new Date(value).toLocaleString(),
            },
        ],
        [],
    );

    const groupColumns = React.useMemo<Column<ChipGroupDto>[]>(
        () => [
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Quantity",
                accessor: "chipsCount",
            },
            {
                Header: "Actions",
                Cell: ({ row }) => {
                    return (
                        <Button
                            small
                            onClick={() => {
                                setMintingSelectedChipGroup(row.original);
                                router.push("confirm");
                            }}
                        >
                            Tokenize
                        </Button>
                    );
                },
            },
        ],
        [],
    );

    const [filters, setFilters] = React.useState<any>({});
    const [chipsPage, setChipsPage] = React.useState<number>(1);
    const [chipsPageSize, setChipsPageSize] = React.useState<number>(10);

    const { data: chipsData } = useSWR(
        `/chips?${new URLSearchParams({
            type: "available",
            ...(filters.serial ? { serial: filters.serial } : {}),
            ...(filters.chipType ? { chipType: filters.chipType } : {}),
            // ...(filters.batch ? { batch: filters.batch } : {}),
            ...(filters.uidHash ? { uidHash: filters.uidHash } : {}),
            ...(chipsPage ? { page: chipsPage.toString() } : {}),
            ...(chipsPageSize ? { pageSize: chipsPageSize.toString() } : {}),
        })}`,
    );

    const { data: groupsData } = useSWR("/chips-group");

    const groups = React.useMemo<ChipGroupDto[]>(() => {
        if (!groupsData) return [];
        return groupsData.data.json || [];
    }, [groupsData]);

    const chips = React.useMemo<ChipProps[]>(() => {
        if (!chipsData) return [];
        return chipsData.data.json || [];
    }, [chipsData]);

    const total = React.useMemo(() => {
        return chipsData?.headers?.["x-total-count"] || 0;
    }, [chipsData]);

    const mintChips = (selectedChips: ChipProps[]) => {
        setMintingSelectedChipGroup(null);
        setMintingSelectedChips(selectedChips);
        router.push("confirm");
    };

    React.useEffect(() => {
        setMintingSelectedChipGroup(null);
        setMintingSelectedChips(null);
    }, [setMintingSelectedChipGroup, setMintingSelectedChips]);

    return (
        <PageContainer>
            {isExitOpen && (
                <ExitConfirmationModal setIsExitOpen={setIsExitOpen} />
            )}
            {selectedQR && (
                <ShowQRModal
                    isOpen={isOpenQRModal}
                    setIsOpen={setIsOpenQRModal}
                    data={selectedQR}
                />
            )}

            <div style={{ display: "none" }}>
                <QRCode
                    value={selectedQR ? getQRFinalUrl(selectedQR) : ""}
                    id="QRCode_Preview"
                />
            </div>
            <Box
                style={{
                    filter: isExitOpen ? "blur(2px)" : "none",
                    minWidth: 500,
                    minHeight: 500,
                }}
            >
                <Navigation>
                    <Button outline onClick={() => router.push("collection")}>
                        Back
                    </Button>
                    <Button outline onClick={() => setIsExitOpen(true)}>
                        Exit
                    </Button>
                </Navigation>
                <Container>
                    <h1>Smart Tags</h1>
                    <Spacer size={3} y />
                    <Flex rowGap={2}>
                        <Button
                            small
                            outline={tableMode !== "singular"}
                            onClick={() => setTableMode("singular")}
                        >
                            Single
                        </Button>
                        {groups.length > 0 && (
                            <Button
                                small
                                outline={tableMode !== "group"}
                                onClick={() => setTableMode("group")}
                            >
                                Group
                            </Button>
                        )}
                    </Flex>

                    <Spacer size={4} y />
                    {tableMode === "singular" ? (
                        <Table
                            width={1200}
                            data={chips}
                            filters={[
                                {
                                    label: "Serial",
                                    name: "serial",
                                    type: "text",
                                },
                                {
                                    label: "Type",
                                    name: "chipType",
                                    type: "text",
                                },
                                // {
                                //     label: "Batch",
                                //     name: "batch",
                                //     type: "text",
                                // },
                                {
                                    label: "Code",
                                    name: "uidHash",
                                    type: "text",
                                },
                            ]}
                            hasPagination
                            columns={chipColumns}
                            page={chipsPage}
                            setPage={setChipsPage}
                            pageSize={chipsPageSize}
                            setPageSize={setChipsPageSize}
                            total={total}
                            uniqueRowSelector={(r) => r.hash}
                            selectable
                            dataFetcher={async (page, pageSize, filters) => {
                                setFilters(filters);
                                setChipsPage(page);
                                setChipsPageSize(pageSize);
                                return [];
                            }}
                            maxSelectable={50}
                            origin="select-chips"
                            renderActions={(selectedChips) => {
                                return (
                                    <Button
                                        small
                                        onClick={() => mintChips(selectedChips)}
                                    >
                                        Tokenize
                                        <div
                                            style={{
                                                background: `${theme.colors.primaryLight30}`,
                                                borderRadius: "50px",
                                                padding: "5px 10px",
                                                marginLeft: 10,
                                                color: `${theme.colors.black}`,
                                            }}
                                        >
                                            {selectedChips.length}
                                        </div>
                                    </Button>
                                );
                            }}
                        />
                    ) : (
                        <Table
                            width={1200}
                            data={groups}
                            columns={groupColumns}
                            page={0}
                            setPage={undefined}
                            pageSize={100}
                            setPageSize={undefined}
                            total={groups.length}
                            hasActionColumn
                        />
                    )}
                </Container>
            </Box>
        </PageContainer>
    );
};

const Container = styled.div`
    padding: 20px;
    background-color: white;
    display: flex;
    border-radius: 10px;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    min-width: 80%;
    width: 1275px;
    min-height: 650px;
    height: 84vh;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-color: grey transparent;
`;

const Navigation = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
`;

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const HashLink = styled.a`
    display: block;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export default SelectChipPage;
