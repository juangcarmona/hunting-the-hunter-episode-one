"use client";

import Button from "@/components/common/Button";
import Divider from "@/components/common/Divider";
import Flex from "@/components/common/Flex";
import { Select } from "@/components/common/FormInputs/Select";
import Icon from "@/components/common/Icon";
import Spacer from "@/components/common/Spacer";
import Table from "@/components/common/Table";
import FileSelector from "@/components/dashboard/FileSelector";
import GenerateQRCodes from "@/components/import/GenerateQRCodes";
import { ClientProps } from "@/dtos/clients.dto";
import ImportService from "@/services/ImportService";
import Papa from "papaparse";
import React from "react";
import { useForm } from "react-hook-form";
import { Column } from "react-table";
import useSWR from "swr";

interface ChipRow {
    serial: string;
    uid: string;
    website: string;
    chipType: string;
    batch: string;
}

async function digestMessage(message: string) {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""); // convert bytes to hex string
    return hashHex;
}

const checkCsvFile = async (data: ChipRow[]): Promise<string[]> => {
    const errors: string[] = [];
    for (let i = 0; i < data.length; i++) {
        const row = data[i];

        const hash = await digestMessage(row.uid);

        // Check if hash is contained in website
        if (
            !row.website.toUpperCase().includes(hash.toUpperCase().toString())
        ) {
            errors.push(
                `UID "${
                    row.uid
                }": website field does not contain the (correct) hash of the uid, expected: ${hash.toString()}`,
            );
            continue;
        }
    }

    return errors;
};

const Import = () => {
    const [importedData, setImportedData] = React.useState<ChipRow[]>([]);
    const [selectedFileName, setSelectedFileName] = React.useState<string>("");
    const [selectedAssignee, setSelectedAssignee] = React.useState<string>("");

    const [isFileValid, setIsFileValid] = React.useState<boolean>(false);
    const [fileErrors, setFileErrors] = React.useState<string[]>([]);

    const { data: clientsData, isValidating } = useSWR(`/clients`);

    const clients = React.useMemo(
        () => (clientsData?.data?.json as ClientProps[]) || [],
        [clientsData],
    );

    const { register, handleSubmit, setValue } = useForm();

    const handleCsv = (files: File[]) => {
        if (files.length <= 0) return;
        setSelectedFileName(files[0].name);

        Papa.parse(files[0], {
            header: true,
            skipEmptyLines: true,
            complete: async function (results) {
                if (results.data.length == 0) {
                    alert("The uploaded file is empty.");
                    return;
                }

                const errors = await checkCsvFile(results.data as ChipRow[]);
                setFileErrors(errors);
                setIsFileValid(errors.length == 0);

                setImportedData(results.data as ChipRow[]);
                setValue("file", files);
            },
        });
    };

    const columns = React.useMemo<Column<ChipRow>[]>(
        () => [
            {
                Header: "Serial",
                accessor: "serial",
            },
            {
                Header: "UID",
                accessor: "uid",
            },
            {
                Header: "Website",
                accessor: "website",
                Cell: ({ value }) => (
                    <a href={value} target="_blank">
                        <Icon icon="link" size={16} />
                        &nbsp;
                        {value}
                    </a>
                ),
            },
            {
                Header: "Type",
                accessor: "chipType",
            },
            {
                Header: "Batch",
                accessor: "batch",
            },
        ],
        [],
    );

    const startImport = async (data: any) => {
        if (!selectedAssignee && !confirm("No client selected. Continue?"))
            return;

        const formData = new FormData();
        formData.append("file", data.file[0]);
        if (selectedAssignee) formData.append("clientId", selectedAssignee);
        ImportService.import(formData)
            .then((res) => {
                if (res.ok && res.data?.type == "success") {
                    alert(`Imported successfully ${res.data.json.added}.`);
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    return (
        <div
            style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <h2>Import smart tags</h2>
            <Spacer y size={2} />

            <form onSubmit={handleSubmit(startImport)}>
                {importedData.length == 0 ? (
                    <FileSelector
                        accept={{
                            "text/csv": [".csv"],
                        }}
                        onFileChange={handleCsv}
                        register={register}
                    />
                ) : (
                    <Flex
                        justifyContent={"center"}
                        rowGap={2}
                        alignItems={"center"}
                    >
                        <Button
                            outline
                            small
                            onClick={() => {
                                setFileErrors([]);
                                setIsFileValid(false);
                                setImportedData([]);
                            }}
                            type="reset"
                        >
                            Reset
                        </Button>

                        <Button small type="submit" disabled={!isFileValid}>
                            Proceed
                        </Button>

                        <Select
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
                    </Flex>
                )}
            </form>
            <Spacer y size={4} />

            {fileErrors.length > 0 && (
                <div style={{ textAlign: "left", padding: "0 24px" }}>
                    <h3>Errors found in the file (only top 20 shown):</h3>
                    <ul>
                        {fileErrors.slice(0, 20).map((error, i) => (
                            <li key={i}>
                                {i} - {error}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {importedData.length > 0 ? (
                <>
                    <p>
                        Loaded a total of {importedData.length} smart tags, file{" "}
                        <span>{selectedFileName}</span>
                    </p>
                    <Table
                        columns={columns}
                        data={importedData}
                        page={1}
                        setPage={() => {}}
                        pageSize={100}
                        setPageSize={undefined}
                        total={0}
                    />
                </>
            ) : (
                <h3>Upload a file to see its content.</h3>
            )}

            <Spacer y size={4} />

            <Divider />

            <GenerateQRCodes clients={clients} />
        </div>
    );
};

export default Import;
