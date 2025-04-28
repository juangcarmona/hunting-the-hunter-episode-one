import { theme } from "@/styles/theme";
import { useMediaQuery } from "@react-hook/media-query";
import React, { useState } from "react";
import { Column, useTable } from "react-table";
import styled from "styled-components";
import Button from "./Button";
import Flex from "./Flex";
import { Input } from "./FormInputs/Input";
import { Select } from "./FormInputs/Select";
import Modal from "./Modal";
import Spacer from "./Spacer";
import Pagination from "./TablePagination";

export class TableFilter {
    label: string;
    name: string;
    type: "text" | "select" | "date";
    options?: {
        label: string;
        value: string;
    }[];
}

interface TableProps<T extends object> {
    data: T[];
    columns: Column<T>[];
    selectable?: boolean;
    onRowSelect?: (row: T) => void;
    hasActionColumn?: boolean;
    uniqueRowSelector?: (row: T) => any;
    hasPagination?: boolean;
    dataFetcher?: (
        pageIndex: number,
        pageSize: number,
        filters: { [key: string]: string },
    ) => Promise<T[]>;
    renderActions?: (rows: T[]) => React.ReactNode;
    filters?: TableFilter[];
    page: number;
    setPage: any;
    pageSize: number;
    setPageSize: any;
    total: number;
    width?: number;
    hideClearBtn?: boolean;
    maxSelectable?: number;
    origin?: string;
}

const Table = <T extends object, TF extends object>({
    data,
    columns,
    hasActionColumn,
    selectable,
    onRowSelect,
    uniqueRowSelector,
    dataFetcher,
    hasPagination,
    renderActions,
    filters = [],
    page = 1,
    pageSize = 10,
    setPage,
    setPageSize,
    total,
    width,
    hideClearBtn,
    maxSelectable,
    origin,
}: TableProps<T>) => {
    const [filterValues, setFilterValues] = useState<{ [key: string]: string }>(
        {},
    );
    const [mobileFilterOptionsOpened, setMobileFilterOptionsOpened] =
        useState(false);
    const [selectedRows, setSelectedRows] = React.useState<T[]>([]);

    const totalPages = React.useMemo(() => {
        return Math.ceil(total / pageSize);
    }, [total, pageSize]);
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    const shownData = React.useMemo(() => {
        return data;
    }, [data]);

    React.useEffect(() => {
        if (dataFetcher) {
            dataFetcher(page, pageSize, filterValues);
        }
    }, [filterValues, page, pageSize]);

    const selectedAll = React.useMemo(
        () =>
            shownData.length > 0 &&
            // All shownData is present inside selectedRows
            shownData.every((d) => {
                return !!selectedRows.find(
                    (r) =>
                        uniqueRowSelector &&
                        uniqueRowSelector(r) == uniqueRowSelector(d),
                );
            }),
        [selectedRows, shownData],
    );

    const tableColumns = React.useMemo(
        () =>
            !selectable
                ? columns
                : [
                      {
                          id: "selection",
                          Header: () => (
                              <input
                                  type="checkbox"
                                  checked={selectedAll}
                                  onChange={(evt) => {
                                      if (evt.target.checked) {
                                          const uniqueShownData =
                                              shownData.filter(
                                                  (item: any) =>
                                                      !selectedRows.some(
                                                          (row: any) =>
                                                              row.uidHash ===
                                                              item.uidHash,
                                                      ),
                                              );

                                          setSelectedRows((s) => {
                                              const selectedRows = [
                                                  ...s,
                                                  ...uniqueShownData,
                                              ];
                                              if (
                                                  maxSelectable &&
                                                  selectedRows.length >=
                                                      maxSelectable
                                              ) {
                                                  return selectedRows.slice(
                                                      0,
                                                      maxSelectable,
                                                  );
                                              }
                                              return selectedRows;
                                          });
                                      } else {
                                          setSelectedRows((s) =>
                                              s.filter(
                                                  (r) =>
                                                      !shownData.find(
                                                          (d) =>
                                                              uniqueRowSelector &&
                                                              uniqueRowSelector(
                                                                  d,
                                                              ) ==
                                                                  uniqueRowSelector(
                                                                      r,
                                                                  ),
                                                      ),
                                              ),
                                          );
                                      }
                                  }}
                              />
                          ),
                          Cell: ({ row }: any) => (
                              <span>
                                  <input
                                      checked={
                                          uniqueRowSelector &&
                                          !!selectedRows.find(
                                              (r) =>
                                                  uniqueRowSelector(r) ==
                                                  uniqueRowSelector(
                                                      row.original,
                                                  ),
                                          )
                                      }
                                      type="checkbox"
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          rowClicked(row);
                                      }}
                                  />
                              </span>
                          ),
                      },
                      ...columns,
                  ],
        [
            selectedRows,
            setSelectedRows,
            columns,
            selectedAll,
            uniqueRowSelector,
            selectable,
            shownData,
        ],
    );

    const rowClicked = (row: any) => {
        if (!uniqueRowSelector) return false;
        const foundRow = selectedRows.find(
            (r) => uniqueRowSelector(r) == uniqueRowSelector(row.original),
        );
        if (foundRow) {
            setSelectedRows((s) =>
                s.filter(
                    (r) => uniqueRowSelector(r) != uniqueRowSelector(foundRow),
                ),
            );
        } else if (maxSelectable && selectedRows.length >= maxSelectable) {
            setSelectedRows((s) =>
                [...s, row.original].slice(0, maxSelectable),
            );
        } else setSelectedRows((s) => [...s, row.original]);
    };

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable<T>({
            columns: tableColumns,
            data: shownData,
        });

    const handleFilterChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValues((s) => ({
            ...s,
            [evt.target.name]: evt.target.value,
        }));
        setPage(1);
    };

    return (
        <div style={{ width: width ? `${width}px` : "100%" }}>
            <>
                {mobileFilterOptionsOpened && (
                    <Modal
                        isOpen={mobileFilterOptionsOpened}
                        setIsOpen={setMobileFilterOptionsOpened}
                        zIndex={0}
                        contentPadding={20}
                    >
                        <Spacer y size={30} />
                        {filters.map((filter) => {
                            return filter.type == "text" ? (
                                <Input
                                    isOverlapped={true}
                                    key={filter.name}
                                    label={filter.label}
                                    inputProps={{
                                        type: filter.type,
                                        name: filter.name,
                                        value: filterValues[filter.name],
                                        onChange: handleFilterChange,
                                        style: { width: 220 },
                                    }}
                                />
                            ) : filter.type == "select" &&
                              filter.label != "Claim" ? (
                                <div
                                    style={{ width: "100%" }}
                                    key={filter.name}
                                >
                                    <Select
                                        label={filter.label}
                                        inputProps={{
                                            name: filter.name,
                                            options: filter.options,
                                            // value: filterValues[filter.name],
                                            onChange: (e) => {
                                                handleFilterChange({
                                                    target: {
                                                        name: filter.name,
                                                        value: e.value,
                                                    },
                                                } as any);
                                            },
                                        }}
                                    />
                                </div>
                            ) : filter.type == "select" &&
                              filter.label == "Claim" ? (
                                <div
                                    style={{
                                        width: "100%",
                                        height: "3.65rem",
                                    }}
                                    key={filter.name}
                                >
                                    <Select
                                        labelInline={true}
                                        label={filter.name.toLocaleUpperCase()}
                                        inputProps={{
                                            name: filter.name,
                                            options: filter.options,
                                            placeholder:
                                                filter?.options?.[0].label,
                                            // value: filterValues[filter.name],
                                            onChange: (e) => {
                                                handleFilterChange({
                                                    target: {
                                                        name: filter.name,
                                                        value: e.value,
                                                    },
                                                } as any);
                                            },
                                        }}
                                    />
                                </div>
                            ) : null;
                        })}
                    </Modal>
                )}
            </>

            <Flex alignItems="start" rowGap={3} justifyContent="space-between">
                <form>
                    <Flex rowGap={3} alignItems="center">
                        {isMobile && filters.length > 0 ? (
                            <Button
                                style={{
                                    position: "absolute",
                                    top: "1rem",
                                    right: "1rem",
                                    padding: "1rem",
                                }}
                                small
                                onClick={() => {
                                    setMobileFilterOptionsOpened(true);
                                }}
                            >
                                Filters
                            </Button>
                        ) : (
                            filters.map((filter) => {
                                return filter.type == "text" ? (
                                    <Input
                                        isOverlapped={true}
                                        key={filter.name}
                                        label={filter.label}
                                        inputProps={{
                                            type: filter.type,
                                            name: filter.name,
                                            value: filterValues[filter.name],
                                            onChange: handleFilterChange,
                                            style: { width: 220 },
                                        }}
                                    />
                                ) : filter.type == "select" &&
                                  filter.label != "Claim" ? (
                                    <div style={{ width: "100%" }}>
                                        <Select
                                            key={filter.name}
                                            label={filter.label}
                                            inputProps={{
                                                name: filter.name,
                                                options: filter.options,
                                                // value: filterValues[filter.name],
                                                onChange: (e) => {
                                                    handleFilterChange({
                                                        target: {
                                                            name: filter.name,
                                                            value: e.value,
                                                        },
                                                    } as any);
                                                },
                                            }}
                                        />
                                    </div>
                                ) : filter.type == "select" &&
                                  filter.label == "Claim" ? (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "3.65rem",
                                        }}
                                    >
                                        <Select
                                            key={filter.name}
                                            labelInline={true}
                                            label={filter.name.toLocaleUpperCase()}
                                            inputProps={{
                                                name: filter.name,
                                                options: filter.options,

                                                placeholder:
                                                    filter?.options?.[0].label,
                                                // value: filterValues[filter.name],
                                                onChange: (e) => {
                                                    handleFilterChange({
                                                        target: {
                                                            name: filter.name,
                                                            value: e.value,
                                                        },
                                                    } as any);
                                                },
                                            }}
                                        />
                                    </div>
                                ) : null;
                            })
                        )}
                    </Flex>
                </form>

                <Flex rowGap={3} mb={1}>
                    {selectedRows?.length ? (
                        <>
                            {renderActions ? renderActions(selectedRows) : null}
                            {hideClearBtn || (
                                <Button
                                    outline
                                    small
                                    onClick={() => {
                                        setSelectedRows([]);
                                    }}
                                >
                                    Clear
                                </Button>
                            )}
                        </>
                    ) : (
                        <>&nbsp;</>
                    )}
                </Flex>
            </Flex>
            <StyledTable {...{ ...getTableProps(), hasActionColumn, isMobile }}>
                <thead>
                    {
                        // Loop over the header rows
                        headerGroups.map((headerGroup) => (
                            // Apply the header row props
                            <tr
                                {...headerGroup.getHeaderGroupProps()}
                                key={headerGroup.getHeaderGroupProps().key}
                            >
                                {
                                    // Loop over the headers in each row
                                    headerGroup.headers.map((column) => (
                                        // Apply the header cell props
                                        <th
                                            {...column.getHeaderProps()}
                                            key={column.getHeaderProps().key}
                                        >
                                            {
                                                // Render the header
                                                column.render("Header")
                                            }
                                        </th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </thead>
                {/* Apply the table body props */}
                <tbody {...getTableBodyProps()}>
                    {
                        // Loop over the table rows
                        rows.map((row) => {
                            // Prepare the row for display
                            prepareRow(row);
                            return (
                                // Apply the row props
                                <DataTr
                                    onClick={() => {
                                        (selectedRows.length > 0 ||
                                            origin === "select-chips") &&
                                            rowClicked(row);
                                    }}
                                    {...row.getRowProps()}
                                    key={row.id}
                                    highlighted={
                                        uniqueRowSelector &&
                                        !!selectedRows.find(
                                            (r) =>
                                                uniqueRowSelector(r) ==
                                                uniqueRowSelector(row.original),
                                        )
                                    }
                                >
                                    {
                                        // Loop over the rows cells
                                        row.cells.map((cell) => {
                                            // Apply the cell props
                                            return (
                                                <td
                                                    {...cell.getCellProps()}
                                                    key={
                                                        cell.getCellProps().key
                                                    }
                                                >
                                                    {
                                                        // Render the cell contents
                                                        cell.render("Cell")
                                                    }
                                                </td>
                                            );
                                        })
                                    }
                                </DataTr>
                            );
                        })
                    }
                </tbody>
                <Spacer y size={isMobile && hasPagination ? 40 : 0} />
            </StyledTable>
            {hasPagination ? (
                !isMobile ? (
                    <Flex mr="20px" justifyContent={"end"} mt="30px">
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            total={total}
                            setPage={setPage}
                        />
                    </Flex>
                ) : (
                    <PaginationWrapper>
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            total={total}
                            setPage={setPage}
                        />
                    </PaginationWrapper>
                )
            ) : (
                <div></div>
            )}
        </div>
    );
};

const DataTr = styled.tr<{ highlighted?: boolean }>`
    background-color: ${({ highlighted, theme }) =>
        highlighted ? theme.colors.primaryLight30 : ""} !important;

    &:hover {
        background-color: #f3f3f3;
    }
`;

const StyledTable = styled.table<{
    hasActionColumn?: boolean;
    isMobile?: boolean;
}>`
    width: 100%;
    border-spacing: 0;
    margin-top: 15px;

    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    overflow: hidden;
    thead {
        font-size: 16px;
        tr {
            border-bottom: 1px solid #ddd;
            th {
                text-align: left;
                padding: ${({ isMobile }) =>
                    isMobile ? "0px 15px" : "10px 8px"};

                &:first-child {
                    padding-left: 16px;
                }

                &:last-child {
                    text-align: center;
                    display: flex;
                    justify-content: flex-end;
                    margin-right: 12px;
                }
            }
        }
    }

    tbody {
        font-size: 15px;
        overflow: hidden;
        tr {
            border-bottom: 1px solid #ddd;
            &:nth-child(even) {
                // background-color: #f0f4fd;
            }
            td {
                padding: 8px 8px;
                /* border-bottom: 1px solid black; */
                vertical-align: middle;

                &:first-child {
                    padding-left: 16px;
                }

                &:last-child {
                    padding-right: 16px;
                    display: flex;
                    justify-content: flex-end;
                }
            }

            &:last-child {
                td {
                    border-bottom: none;
                }
            }
        }
    }

    ${(props) =>
        props.isMobile &&
        `
        thead {
            
        }

        tbody {
            
            tr {
                td {
                    
                    padding: 1px 0px;
                    line-height: 1;
                }
            }
        }
       
    `}
`;
const PaginationWrapper = styled.div`
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    padding-right: 5rem;
    z-index: 1000;
    display: flex;
    justify-content: center;
`;

export default Table;
