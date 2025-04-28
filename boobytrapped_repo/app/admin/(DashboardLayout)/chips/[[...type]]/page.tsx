"use client";
import MediaDisplayer from "@/components/chip/MediaDisplayer";
import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import PageContentTitle from "@/components/common/PageContentTitle";
import Spacer from "@/components/common/Spacer";
import Table, { TableFilter } from "@/components/common/Table";
import { Tooltip } from "@/components/common/Tooltip";
import { ClientProps } from "@/dtos/clients.dto";
import { Campaign } from "@/services/CampaignsService";
import ChipService from "@/services/ChipService";
import { userRole } from "@/state/user";
import { theme } from "@/styles/theme";
import fetchMimeType from "@/utils/fetchMimeType";
import { getTimeAgo } from "@/utils/getTimeAgo";
import { useMediaQuery } from "@react-hook/media-query";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AspectRatio } from "react-aspect-ratio";
import { FiExternalLink } from "react-icons/fi";
import { MdDownloading, MdQrCode2 } from "react-icons/md";
import QRCode from "react-qr-code";
import { Column, Row } from "react-table";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import useSWR from "swr";
import AssignToGroupModal from "../../groups/AssignToGroupModal";
import ShowQRModal, { downloadQR, getQRFinalUrl } from "../QRModal";
import ActionsChipModal from "./ActionsChipModal";
import AssignChipModal from "./AssignChipModal";

export interface ChipProps {
    id: any;
    serial: string;
    hash: string;
    uidHash: string;
    enabled: boolean;
    addedAt: Date;
    usedAt?: Date;
    chain: string | null;
    tokenId: string | null;
    smartContractAddress: string | null;
    tokenUri: string | null;
    Owner: {
        name: string;
    };
    Token: {
        tokenData: {
            name: string;
            image: string;
        };
    };
    ChipGroup: {
        name: string;
    };
    Campaign: {
        name: string;
    };
    chipType: string | null;
    batch: string | null;
    isQR: boolean;
    claimedBy?: string;
}

interface ChipPageProps {
    params: {
        type: string;
    };
}

const Chips: React.FC<ChipPageProps> = ({ params }: ChipPageProps) => {
    const [selectedQR, setSelectedQR] = React.useState<string>();
    const [isOpenQRModal, setIsOpenQRModal] = React.useState(false);
    const [actionsChipModalOpen, setActionsChipModalOpen] =
        React.useState(false);
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    const [assignChipModalOpen, setAssignChipModalOpen] = React.useState(false);
    const [isAssignToGroupModalOpen, setIsAssignToGroupModalOpen] =
        React.useState(false);

    const currentUserRole = useRecoilValue(userRole);

    const [selectedChips, setSelectedChips] = React.useState<string[]>([]);

    const [filters, setFilters] = React.useState<any>({});
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);

    const { data: clientsData } = useSWR(`/clients`);

    const clients = React.useMemo(() => {
        if (!clientsData?.ok) return [];
        return (clientsData?.data?.json as ClientProps[]) || [];
    }, [clientsData]);

    const { data: chipsData, mutate: refreshChips } = useSWR(
        `/chips?${new URLSearchParams({
            ...(params.type ? { type: params.type } : {}),
            ...(filters.serial ? { serial: filters.serial } : {}),
            ...(filters.claim ? { claim: filters.claim } : {}),
            ...(filters.chipType ? { chipType: filters.chipType } : {}),
            ...(filters.batch ? { batch: filters.batch } : {}),
            ...(filters.group ? { group: filters.group } : {}),
            ...(filters.title ? { title: filters.title } : {}),
            ...(filters.uidHash ? { uidHash: filters.uidHash } : {}),
            ...(filters.ownerId ? { ownerId: filters.ownerId } : {}),
            ...(page ? { page: page.toString() } : {}),
            ...(pageSize ? { pageSize: pageSize.toString() } : {}),
        })}`,
    );

    const [mimeTypes, setMimeTypes] = useState<(string | null | undefined)[]>(
        [],
    );

    const data = React.useMemo(() => {
        const chips = (chipsData?.data?.json as ChipProps[]) || [];
        const updatedChips = chips.map((chip, idx) => ({
            ...chip,
            mimeType: mimeTypes[idx],
        }));
        return updatedChips;
    }, [chipsData?.data?.json, mimeTypes]);

    const fetchMimeTypes = useCallback(async (chips: ChipProps[]) => {
        const mimeTypes = await Promise.all(
            chips.map((chip) => {
                return fetchMimeType(chip.Token?.tokenData?.image);
            }),
        );
        setMimeTypes(mimeTypes);
    }, []);

    useEffect(() => {
        if (chipsData?.data?.json) fetchMimeTypes(chipsData?.data?.json);
    }, [chipsData?.data?.json, fetchMimeTypes]);

    const { data: campaignsData } = useSWR(
        currentUserRole == "USER" ? `/campaigns?skip=0&take=10000` : null,
    ); // TODO: Handle search/load more

    const campaigns = React.useMemo(() => {
        if (!campaignsData?.ok) return [];
        return (
            (campaignsData?.data?.json as Campaign[])?.map((campaign) => ({
                label: campaign.name,
                value: campaign.id,
            })) || []
        );
    }, [campaignsData]);

    const unlinkChip = async (hash: string) => {
        await ChipService.unlinkChip(hash)
            .then((res) => {
                if (res.ok) {
                    toast.success("Chip unlinked successfully");
                } else {
                    toast.error("Failed to unlink chip");
                }
            })
            .catch(() => {
                toast.error("Failed to unlink chip");
            })
            .finally(() => {
                refreshChips();
            });
    };

    const columns = React.useMemo<Column<ChipProps>[]>(() => {
        return [
            ...(params.type == "used"
                ? [
                      {
                          id: "preview",
                          Header: "Preview",
                          accessor: "Token",
                          Cell: ({ value, row }: any) => {
                              const link = row.original.uidHash
                                  ? `/a/${row.original.uidHash}`
                                  : null;
                              return link ? (
                                  <AspectRatio
                                      ratio={2.1}
                                      style={{
                                          maxWidth: 80,
                                          maxHeight: 80,
                                          height: 80,
                                      }}
                                  >
                                      <a href={link} target="_blank">
                                          <MediaDisplayer
                                              image={value?.tokenData?.image}
                                              alt="token preview"
                                              image_mime_type={
                                                  row?.original?.mimeType
                                              }
                                              videoOptions={{
                                                  height: 80,
                                                  maxHeight: 80,
                                              }}
                                              imageOptions={{
                                                  respectRatio: true,
                                                  height: 80,
                                                  width: 80,
                                                  maxHeight: 80,
                                              }}
                                          />
                                      </a>
                                  </AspectRatio>
                              ) : (
                                  <span>Not Available</span>
                              );
                          },
                      } as Column<ChipProps>,
                      {
                          Header: "Title",
                          accessor: "Token",
                          Cell: ({ value, row }: any) => {
                              const link = row.original.isAuthenticate
                                  ? `/a/${row.original.hash}`
                                  : `/a/${row.original.uidHash}`;
                              return link ? (
                                  <a href={link} target="_blank">
                                      <FiExternalLink
                                          size={20}
                                          style={{
                                              marginRight: "10px",
                                          }}
                                      />

                                      {value?.tokenData.name.length > 20 ? (
                                          <Tooltip
                                              placement={"top-start"}
                                              content={value?.tokenData.name}
                                          >
                                              <span>
                                                  {value?.tokenData.name
                                                      .length > 20
                                                      ? `${value?.tokenData.name.slice(
                                                            0,
                                                            20,
                                                        )}...`
                                                      : value?.tokenData.name}
                                              </span>
                                          </Tooltip>
                                      ) : (
                                          <span>
                                              {value?.tokenData.name.length > 20
                                                  ? `${value?.tokenData.name.slice(
                                                        0,
                                                        20,
                                                    )}...`
                                                  : value?.tokenData.name}
                                          </span>
                                      )}
                                  </a>
                              ) : (
                                  <span>
                                      {value?.tokenData.name.length > 20
                                          ? `${value?.tokenData.name.slice(
                                                0,
                                                20,
                                            )}...`
                                          : value?.tokenData.name}
                                  </span>
                              );
                          },
                      } as Column<ChipProps>,
                  ]
                : []),
            {
                id: "serial",
                Header: "Serial",
                accessor: "serial",
                Cell: ({ value, row }) => (
                    <div
                        style={{
                            maxWidth: 200,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {value}
                    </div>
                ),
            },
            ...(params.type == "available"
                ? [
                      {
                          id: "hash",
                          Header: "Code",
                          accessor: "uidHash",
                          Cell: ({ value, row }) => {
                              const link = row.original.uidHash
                                  ? `/a/${value}`
                                  : null;
                              return (
                                  <Flex
                                      alignItems={"center"}
                                      justifyContent={"start"}
                                      flexWrap={"wrap"}
                                  >
                                      {link ? (
                                          <HashLink
                                              href={`/a/${value}`}
                                              target="_blank"
                                          >
                                              <FiExternalLink
                                                  size={20}
                                                  style={{
                                                      marginRight: "10px",
                                                  }}
                                              />
                                              {value}
                                          </HashLink>
                                      ) : (
                                          <span>Not Available</span>
                                      )}
                                  </Flex>
                              );
                          },
                      } as Column<ChipProps>,
                  ]
                : []),

            ...(params.type == "used"
                ? [
                      {
                          Header: "Claim",
                          Cell: ({ row }: any) => ClaimCell(row),
                      } as Column<ChipProps>,

                      {
                          Header: "Campaign",
                          Cell: ({ row }: { row: Row<ChipProps> }) => (
                              <span>{row.original?.Campaign?.name}</span>
                          ),
                      } as Column<ChipProps>,
                  ]
                : []),
            ...(params.type == "available" || currentUserRole != "ADMIN"
                ? []
                : [
                      {
                          Header: "Owner",
                          accessor: "Owner",
                          Cell: ({ value }: any) => <span>{value?.name}</span>,
                      } as Column<ChipProps>,
                  ]),

            {
                Header: "Group",
                Cell: ({ row }: { row: Row<ChipProps> }) => (
                    <span>{row.original?.ChipGroup?.name}</span>
                ),
            } as Column<ChipProps>,
            {
                id: "chipType",
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

            ...(params.type == "used"
                ? [
                      {
                          id: "mintedAt",
                          Header: "Tokenized",
                          accessor: "usedAt",
                          Cell: ({ value }: any) => {
                              const displayedTime = getTimeAgo(value);
                              return (
                                  <Tooltip
                                      placement={"top-start"}
                                      content={new Date(value).toLocaleString()}
                                  >
                                      <label>{displayedTime}</label>
                                  </Tooltip>
                              );
                          },
                      } as Column<ChipProps>,
                  ]
                : [
                      //   {
                      //       id: "batch",
                      //       Header: "Batch",
                      //       accessor: "batch",
                      //   } as Column<ChipProps>,
                      {
                          id: "addedAt",
                          Header: "Added",
                          accessor: "addedAt",
                          Cell: ({ value }: any) => {
                              const displayedTime = getTimeAgo(value);
                              return (
                                  <Tooltip
                                      placement={"top-start"}
                                      content={new Date(value).toLocaleString()}
                                  >
                                      <label>{displayedTime}</label>
                                  </Tooltip>
                              );
                          },
                      } as Column<ChipProps>,
                  ]),
            ...(params.type == "used"
                ? currentUserRole == "ADMIN"
                    ? [
                          {
                              id: "actions",
                              Header: "Actions",
                              Cell: ({ row }: { row: Row<ChipProps> }) => (
                                  <Flex rowGap={2}>
                                      <Button
                                          error
                                          small
                                          outline
                                          onClick={() => {
                                              unlinkChip(row.original.hash);
                                          }}
                                      >
                                          Unlink
                                      </Button>
                                  </Flex>
                              ),
                          } as Column<ChipProps>,
                      ]
                    : [
                          {
                              id: "actions",
                              Header: "Actions",
                              Cell: ({ row }: { row: Row<ChipProps> }) => (
                                  <Flex rowGap={2} paddingTop={"1.5rem"}>
                                      <Button
                                          small
                                          onClick={() => {
                                              setSelectedChips([
                                                  row.original.hash,
                                              ]);
                                              setActionsChipModalOpen(true);
                                          }}
                                      >
                                          Actions
                                      </Button>
                                  </Flex>
                              ),
                          },
                      ]
                : [
                      {
                          id: "actions",
                          Header: "Actions",
                          Cell: ({ row }: { row: Row<ChipProps> }) => (
                              <Flex rowGap={2}>
                                  {currentUserRole == "ADMIN" ? (
                                      <Button
                                          small
                                          onClick={() => {
                                              setSelectedChips([
                                                  row.original.hash,
                                              ]);
                                              setAssignChipModalOpen(true);
                                          }}
                                      >
                                          Assign
                                      </Button>
                                  ) : null}

                                  <Button
                                      small
                                      onClick={() => {
                                          setSelectedChips([row.original.hash]);
                                          setIsAssignToGroupModalOpen(true);
                                      }}
                                  >
                                      Group
                                  </Button>
                              </Flex>
                          ),
                      } as Column<ChipProps>,
                  ]),
        ];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.type, currentUserRole, page]);

    const total = useMemo(() => {
        return chipsData?.headers?.["x-total-count"] || 0;
    }, [chipsData]);

    return (
        <Container>
            <PageContentTitle>
                {params.type == "used" ? "Smart Tags" : "Available"}
            </PageContentTitle>

            <Spacer y size={isMobile ? 1 : 5} />

            <Table
                total={total}
                hasPagination
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                data={data}
                columns={columns}
                selectable
                hasActionColumn
                uniqueRowSelector={(r) => {
                    return r.hash;
                }}
                renderActions={(selectedRows) => {
                    if (params.type == "used")
                        return (
                            <>
                                <Button
                                    small
                                    onClick={() => {
                                        setActionsChipModalOpen(true);
                                        setSelectedChips(
                                            selectedRows.map((r) => r.hash),
                                        );
                                    }}
                                >
                                    Actions{" "}
                                    <div
                                        style={{
                                            background: `${theme.colors.primaryLight30}`,
                                            borderRadius: "50px",
                                            padding: "5px 10px",
                                            marginLeft: 10,
                                            color: `${theme.colors.black}`,
                                        }}
                                    >
                                        {selectedRows?.length}
                                    </div>
                                </Button>
                            </>
                        );
                    return (
                        <>
                            {currentUserRole == "ADMIN" ? (
                                <Button
                                    small
                                    onClick={() => {
                                        setSelectedChips(
                                            selectedRows.map((r) => r.hash),
                                        );
                                        setAssignChipModalOpen(true);
                                    }}
                                >
                                    Assign {selectedRows?.length}
                                </Button>
                            ) : null}

                            <Button
                                small
                                onClick={() => {
                                    setSelectedChips(
                                        selectedRows.map((r) => r.hash),
                                    );
                                    setIsAssignToGroupModalOpen(true);
                                }}
                            >
                                Group
                                <div
                                    style={{
                                        background: `${theme.colors.primaryLight30}`,
                                        borderRadius: "50px",
                                        padding: "5px 10px",
                                        marginLeft: 10,
                                        color: `${theme.colors.black}`,
                                    }}
                                >
                                    {selectedRows?.length}
                                </div>
                            </Button>
                        </>
                    );
                }}
                filters={[
                    ...(params.type == "used"
                        ? [
                              {
                                  label: "Title",
                                  name: "title",
                                  type: "text" as const,
                              },
                          ]
                        : []),
                    {
                        label: "Serial",
                        name: "serial",
                        type: "text",
                    },
                    ...(params.type == "used"
                        ? [
                              {
                                  label: "Claim",
                                  name: "claim",
                                  type: "select",
                                  options: [
                                      {
                                          label: "All",
                                          value: "",
                                      },
                                      {
                                          label: "Visible",
                                          value: "Visible",
                                      },
                                      {
                                          label: "Hidden",
                                          value: "Hidden",
                                      },
                                      {
                                          label: "Claimed",
                                          value: "Claimed",
                                      },
                                      {
                                          label: "Inactive",
                                          value: "Inactive",
                                      },
                                  ],
                              } as TableFilter,
                          ]
                        : []),

                    {
                        label: "Code",
                        name: "uidHash",
                        type: "text",
                    },

                    {
                        label: "Type",
                        name: "chipType",
                        type: "text",
                    },
                    ...(params.type != "used"
                        ? [
                              {
                                  label: "Batch",
                                  name: "batch",
                                  type: "text" as const,
                              },
                          ]
                        : [
                              {
                                  label: "Group",
                                  name: "group",
                                  type: "text" as const,
                              },
                          ]),
                    ...(currentUserRole == "ADMIN"
                        ? [
                              {
                                  label: "Client",
                                  name: "ownerId",
                                  type: "select",
                                  options: [
                                      {
                                          label: "All",
                                          value: "",
                                      },
                                      ...clients.map((c) => ({
                                          label: c.name,
                                          value: c.id,
                                      })),
                                  ],
                              } as TableFilter,
                          ]
                        : []),
                ]}
                dataFetcher={async (pageIndex, pageSize, filters) => {
                    setPage(pageIndex);
                    setPageSize(pageSize);
                    setFilters(filters);
                    return [] as any;
                }}
            />

            {data?.length == 0 ? (
                <p style={{ textAlign: "center" }}>No smart tags found</p>
            ) : null}

            <Spacer size={2} />

            <AssignChipModal
                isOpen={assignChipModalOpen}
                setIsOpen={setAssignChipModalOpen}
                chipHashes={selectedChips}
                onAssign={() => {
                    refreshChips();
                    setSelectedChips([]);
                }}
                isAlreadyAssigned={!(params.type == "available")}
            />

            <AssignToGroupModal
                isOpen={isAssignToGroupModalOpen}
                setIsOpen={setIsAssignToGroupModalOpen}
                hashes={selectedChips}
                onAssign={() => {
                    refreshChips();
                    setSelectedChips([]);
                }}
            />

            <ActionsChipModal
                isOpen={actionsChipModalOpen}
                setIsOpen={setActionsChipModalOpen}
                chipHashes={selectedChips}
                chips={chipsData?.data?.json}
                claimOptionEnabled={
                    selectedChips.length > 0 &&
                    selectedChips.some((selectedChip) =>
                        chipsData?.data?.json?.some(
                            (state: any) =>
                                state.hash === selectedChip &&
                                (state.claimStatus === "Visible" ||
                                    state.claimStatus === "Hidden"),
                        ),
                    )
                }
                onSave={() => {
                    refreshChips();
                    setSelectedChips([]);
                }}
                options={campaigns}
            />

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
        </Container>
    );
};

const ClaimCell = (row: any) => {
    return <label>{row.original.claimStatus}</label>;
};

const Container = styled.div`
    width: 99%;
`;

const HashLink = styled.a`
    display: block;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export default Chips;
