"use client";
import Button from "@/components/common/Button";
import { Input } from "@/components/common/FormInputs/Input";
import Modal from "@/components/common/Modal";
import PageContentTitle from "@/components/common/PageContentTitle";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import UserService from "@/services/UsersService.ts";
import { userRole } from "@/state/user";
import { theme } from "@/styles/theme";
import { useMediaQuery } from "@react-hook/media-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AxisOptions } from "react-charts";
import {
    Area,
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import useSWR from "swr";

type DailyScans = {
    date: Date;
    scans: number;
};

type Series = {
    label: string;
    data: DailyScans[];
};

class DateCountPair {
    date: Date;
    count: number;
}

class ChipInfo {
    name?: string;
    hash?: string;
    imageUrl?: string;
}
class HomeAnalyticsDto {
    chipsAvailable: number;
    chipsAssigned: number;
    chipsUsed: number;
    clients: number;
    totalChipScans: number;
    lastRegisteredClient: string;
    lastUsedChip?: ChipInfo;
    chipScansByDay: DateCountPair[];
    chipUsedByDay: DateCountPair[];
}

const Home: React.FC = () => {
    const router = useRouter();
    const currentUserRole = useRecoilValue(userRole);
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);

    const [startDate, setStartDate] = React.useState<Date>(
        new Date(new Date().setDate(new Date().getDate() - 7)),
    );
    const [endDate, setEndDate] = React.useState<Date>(new Date());

    const { data: analyticsReq } = useSWR(
        `/analytics/home?${new URLSearchParams({
            from: startDate.toISOString(),
            to: endDate.toISOString(),
        })}`,
    );

    const [welcomeMessage, setWelcomeMessage] = useState(false);

    useEffect(() => {
        if (!welcomeMessage) {
            const fetchData = async () => {
                try {
                    const result = await UserService.getNewUser();
                    const newUserObj: any = result.data?.json;
                    if (newUserObj.newUser) {
                        setWelcomeMessage(true);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };

            fetchData();
        }
    }, []);

    const analytics = React.useMemo(() => {
        if (!analyticsReq?.ok) return {} as HomeAnalyticsDto;
        return analyticsReq?.data.json as HomeAnalyticsDto;
    }, [analyticsReq]);

    const primaryAxis = React.useMemo(
        (): AxisOptions<DailyScans> => ({
            getValue: (datum) => datum.date,
        }),
        [],
    );

    const secondaryAxes = React.useMemo(
        (): AxisOptions<DailyScans>[] => [
            {
                getValue: (datum) => datum.scans,
            },
        ],
        [],
    );

    const data2: any = React.useMemo(() => {
        const scansData =
            analytics.chipScansByDay?.map((x) => ({
                date: new Date(x.date),
                scans: x.count,
            })) || [];

        const scans2Data =
            analytics.chipUsedByDay?.map((x) => ({
                date: new Date(x.date),
                scans2: x.count,
            })) || [];

        const mergedData = scansData.map((item) => {
            const matchingScans2Item = scans2Data.find(
                (x) => x.date.getTime() === item.date.getTime(),
            );
            return {
                date: item.date.toDateString(),
                scans: item.scans,
                scans2: matchingScans2Item ? matchingScans2Item.scans2 : 0,
            };
        });

        return mergedData;
    }, [analytics]);

    return (
        <div>
            <Modal
                isOpen={welcomeMessage}
                setIsOpen={setWelcomeMessage}
                zIndex={0}
            >
                <>
                    <Container
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: ".5rem",
                            paddingTop: "0rem",
                            alignItems: "center",
                        }}
                    >
                        <Text variant="h5" mt={50} mb={30} textAlign="center">
                            Welcome to WoV Labs Tokenization Solutions
                        </Text>

                        <Text variant="body2" textAlign="center">
                            We&apos;re thrilled to have you with us. To get
                            started, please select your preferred blockchain
                            platform for tokenization. Additionally, don&apos;t
                            forget to customize your Digital Passport page with
                            your logo and social details to create a
                            personalized experience for your users.
                        </Text>
                        <Spacer y size={4} />
                        <Text variant="body2" textAlign="center">
                            <strong>Thank you for choosing us!</strong>
                        </Text>
                        <Spacer y size={4} />
                        <Button
                            style={{ width: "50%" }}
                            onClick={() => {
                                setWelcomeMessage(false);
                                router.replace("/admin/profile");
                            }}
                        >
                            Let&apos;s start
                        </Button>
                    </Container>
                </>
            </Modal>
            <PageContentTitle>Analytics</PageContentTitle>

            <Container>
                <AnalyticsContainer>
                    <div>
                        <Input
                            inputProps={{
                                type: "date",
                                defaultValue: startDate
                                    .toISOString()
                                    .split("T")[0],
                                onChange: (e) => {
                                    setStartDate(new Date(e.target.value));
                                },
                            }}
                            label="From"
                        />
                    </div>
                    <div>
                        <Input
                            inputProps={{
                                type: "date",
                                defaultValue: endDate
                                    .toISOString()
                                    .split("T")[0],
                                onChange: (e) => {
                                    setEndDate(new Date(e.target.value));
                                },
                            }}
                            label="To"
                        />
                    </div>
                    {/* 
                    <div>
                        <Select
                            label="Client"
                            inputProps={{ name: "Clients" }}
                        ></Select>
                    </div> */}
                </AnalyticsContainer>

                <Card>
                    <CardTitle>Available</CardTitle>
                    <CardValue>{analytics.chipsAvailable}</CardValue>
                </Card>

                {currentUserRole == "ADMIN" && (
                    <Card>
                        <CardTitle>Assigned</CardTitle>
                        <CardValue>{analytics.chipsAssigned}</CardValue>
                    </Card>
                )}

                <Card>
                    <CardTitle>Tokenized</CardTitle>
                    <CardValue>{analytics.chipsUsed}</CardValue>
                </Card>

                {currentUserRole == "ADMIN" && (
                    <Card>
                        <CardTitle>Clients</CardTitle>
                        <CardValue>{analytics.clients}</CardValue>
                    </Card>
                )}

                <Card>
                    <CardTitle>Scanned</CardTitle>
                    <CardValue>{analytics.totalChipScans}</CardValue>
                </Card>

                {currentUserRole == "ADMIN" && (
                    <Card>
                        <CardTitle>Latest Client</CardTitle>
                        <CardValue>{analytics.lastRegisteredClient}</CardValue>
                    </Card>
                )}

                <Card>
                    <CardTitle>Last Used</CardTitle>
                    <CardValue>
                        <p style={{ textAlign: "center" }}>
                            {analytics.lastUsedChip?.name &&
                            analytics.lastUsedChip?.name.length > 40
                                ? `${analytics.lastUsedChip?.name.slice(0, 40)}...`
                                : analytics.lastUsedChip?.name}
                        </p>
                        {/* <div style={{ textAlign: "center" }}>
                            <img
                                src={analytics.lastUsedChip?.imageUrl}
                                style={{ maxWidth: 100 }}
                            />
                        </div> */}
                    </CardValue>
                </Card>

                {!isMobile && (
                    <GraphCard>
                        <CardTitle>
                            <strong>Smart Tags</strong>
                        </CardTitle>
                        <ResponsiveContainer width="100%" height={400}>
                            {data2.length === 0 ||
                            data2[0].data?.length === 0 ||
                            data2[1].data?.length === 0 ? (
                                <p>Not enough data to show graphs</p>
                            ) : (
                                <ComposedChart
                                    width={800}
                                    height={400}
                                    data={data2}
                                >
                                    <CartesianGrid stroke="#f5f5f5" />
                                    <XAxis
                                        tick={{ fontWeight: "bold" }}
                                        dataKey="date"
                                    />
                                    <YAxis tick={{ fontWeight: "bold" }} />
                                    <Tooltip
                                        wrapperStyle={{
                                            fontWeight: "bold",
                                        }}
                                    />
                                    <Legend
                                        wrapperStyle={{
                                            fontWeight: "bold",
                                        }}
                                    />
                                    <Area
                                        tooltipType="none"
                                        legendType="none"
                                        type="monotone"
                                        dataKey="scans"
                                        name="Scanneds"
                                        fill={`${theme.colors.muted}`}
                                        stroke={`${theme.colors.grayLight400}`}
                                    />
                                    <Bar
                                        dataKey="scans"
                                        name="Scanned"
                                        barSize={20}
                                        fill={`${theme.colors.primary}`}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="scans2"
                                        name="Tokenized"
                                        stroke="#ff7300"
                                        strokeWidth={2}
                                    />
                                </ComposedChart>
                            )}
                        </ResponsiveContainer>
                    </GraphCard>
                )}
            </Container>
        </div>
    );
};

const Container = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const AnalyticsContainer = styled.div`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
    padding: 16px;
    gap: 16px;
`;

const Card = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;

    margin: 16px;
    /* min-width: 150px; */

    flex: 1;

    border-radius: 20px;
    background: #fcfcfd;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
`;

const GraphCard = styled.div`
    min-height: 300px;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    margin: 16px;
`;

const ChartWrapper = styled.div`
    width: 100%;
    height: 100%;
`;

const CardTitle = styled.div`
    font-size: 14px;
    color: #757575;
`;

const CardValue = styled.div`
    font-size: 24px;
    color: #212121;
`;

export default Home;
