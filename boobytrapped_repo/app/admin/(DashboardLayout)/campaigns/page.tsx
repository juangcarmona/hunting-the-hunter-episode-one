"use client";
import { Title } from "@/app/templates/common";
import Box from "@/components/common/Box";
import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import { Input } from "@/components/common/FormInputs/Input";
import { Select } from "@/components/common/FormInputs/Select";
import PageContentTitle from "@/components/common/PageContentTitle";
import Table from "@/components/common/Table";
import { OptionItemProps } from "@/components/templates/TemplatesContent";
import { Campaign, CampaignsService } from "@/services/CampaignsService";
import { theme } from "@/styles/theme";
import GenericModal from "@/utils/GenericModal";
import { useMediaQuery } from "@react-hook/media-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Column } from "react-table";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";
import useSWR from "swr";

const CampaignsPage = () => {
    const router = useRouter();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    const [page, setPage] = useState(1);
    const [deleteCampaignData, setDeleteCampaignData] = useState({
        show: false,
        id: "",
    });
    const [pageSize, setPageSize] = useState(10);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [searchName, setSearchName] = useState<string>("");

    const { data: campaignsData, mutate: reloadCampaigns } = useSWR(
        `/campaigns?${new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        }).toString()}`,
    );

    const deleteCampaign = async (id: string) => {
        await CampaignsService.delete(id)
            .then((res) => {
                if (res.ok) toast.success("Campaign deleted successfully");
                else toast.error("Failed to delete campaign");
            })
            .catch(() => {
                toast.error("Failed to delete campaign");
            })
            .finally(() => {
                reloadCampaigns();
            });
    };

    const columns = useMemo<Column<Campaign>[]>(
        () => [
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Type",
                accessor: "campaignType",
                Cell: ({ value }) => {
                    switch (value) {
                        case "LOST":
                            return "Lost";
                        case "STOLE":
                            return "Stolen";
                        default:
                            return "Message";
                    }
                },
            },
            {
                Header: "Created At",
                accessor: "createdAt",
                Cell: ({ value }) => {
                    return new Date(value).toLocaleString();
                },
            },
            {
                Header: "Actions",
                accessor: "id",
                Cell: ({ value }) => {
                    return (
                        <Flex>
                            <Button
                                onClick={() => {
                                    setDeleteCampaignData({
                                        show: true,
                                        id: value,
                                    });
                                }}
                            >
                                Delete
                            </Button>
                        </Flex>
                    );
                },
            },
        ],
        [],
    );

    const campaigns = useMemo(() => {
        if (!campaignsData?.ok) return [];
        return (campaignsData?.data?.json as Campaign[]) || [];
    }, [campaignsData]);

    const total = useMemo(() => {
        return campaignsData?.headers?.["x-total-count"] || 0;
    }, [campaignsData]);

    const campaignOptions: OptionItemProps<string>[] = useMemo(() => {
        const options: OptionItemProps<string>[] = [
            { label: "All", value: "" },
            { label: "Stolen", value: "STOLE" },
            { label: "Lost", value: "LOST" },
            { label: "Message", value: "MESSAGE" },
        ];

        return options;
    }, [campaigns]);

    const filterCampaigns = (campaign: Campaign) => {
        const typeFilterPassed =
            selectedType === null ||
            selectedType === "" ||
            campaign.campaignType === selectedType;
        const nameFilterPassed = campaign.name
            .toLowerCase()
            .includes(searchName.toLowerCase());
        return typeFilterPassed && nameFilterPassed;
    };

    const filteredCampaigns = useMemo(() => {
        if (!campaignsData?.ok) return [];
        return (campaignsData?.data?.json as Campaign[]).filter(
            filterCampaigns,
        );
    }, [campaignsData, selectedType, searchName]);

    return (
        <>
            {deleteCampaignData.show && (
                <GenericModal
                    title={`Delete this campaign?`}
                    onAnswer={(shouldDelete) => {
                        if (shouldDelete) {
                            deleteCampaign(deleteCampaignData.id);
                        } else {
                        }
                        setDeleteCampaignData({ show: false, id: "" });
                    }}
                    additionalProps={{ isError: "true" }}
                />
            )}
            <Container blurBackground={deleteCampaignData.show}>
                {!isMobile && <PageContentTitle>Campaigns</PageContentTitle>}

                {!isMobile ? (
                    <>
                        <Flex rowGap={2} padding={2}>
                            <Button
                                style={{ width: 300 }}
                                onClick={() => {
                                    router.push("/templates/campaign");
                                }}
                            >
                                Create Campaign
                            </Button>

                            <Input
                                inputProps={{
                                    placeholder: "Search by name",
                                    name: "search",
                                    onChange: (e) => {
                                        setSearchName(e.target.value);
                                    },
                                }}
                            />

                            <FixedWidthSelect
                                inputProps={{
                                    options: campaignOptions,
                                    placeholder: "Select campaign",
                                    onChange: (
                                        selectedOption: OptionItemProps<string> | null,
                                    ) => {
                                        setSelectedType(
                                            selectedOption
                                                ? selectedOption.value
                                                : null,
                                        );
                                    },
                                }}
                            />
                        </Flex>
                    </>
                ) : (
                    <>
                        {" "}
                        <Flex
                            style={{
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Title
                                style={{
                                    fontWeight: 600,
                                    fontSize: "18px",
                                    fontFamily: "Poppins, sans-serif",
                                    padding: "20px 16px",
                                }}
                            >
                                Campaigns
                            </Title>

                            <Button
                                style={{ height: "2.5rem" }}
                                onClick={() => {
                                    router.push("/templates/campaign");
                                }}
                            >
                                Create Campaign
                            </Button>
                        </Flex>
                        <Flex justifyContent="space-between" rowGap={2}>
                            <Box flex={3}>
                                <Select
                                    inputProps={{
                                        options: campaignOptions,
                                        placeholder: "Select campaign",
                                        onChange: (
                                            selectedOption: OptionItemProps<string> | null,
                                        ) => {
                                            setSelectedType(
                                                selectedOption
                                                    ? selectedOption.value
                                                    : null,
                                            );
                                        },
                                    }}
                                />
                            </Box>
                            <Box flex={1}>
                                <Input
                                    inputProps={{
                                        placeholder: "Search",
                                        name: "search",
                                        onChange: (e) => {
                                            setSearchName(e.target.value);
                                        },
                                    }}
                                />
                            </Box>
                        </Flex>
                    </>
                )}

                <Table
                    {...{
                        data: filteredCampaigns,
                        columns,
                        page,
                        pageSize,
                        setPage,
                        setPageSize,
                        total,
                    }}
                    hasActionColumn
                    hasPagination
                />
            </Container>
        </>
    );
};

const Container = styled.div<{ blurBackground: boolean }>`
    padding: 10px;
    width: 100%;
    ${(props) =>
        props.blurBackground &&
        css`
            filter: blur(4px);
        `}
`;

const FixedWidthSelect = styled(Select)`
    width: 30rem;
`;

export default CampaignsPage;
