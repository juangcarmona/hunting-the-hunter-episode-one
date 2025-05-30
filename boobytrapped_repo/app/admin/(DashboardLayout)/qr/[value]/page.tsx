"use client";

import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import PageContentTitle from "@/components/common/PageContentTitle";
import Spacer from "@/components/common/Spacer";
import { useSearchParams } from "next/navigation";
import React, { useRef } from "react";
import QRCode from "react-qr-code";

interface QrPageProps {
    value: string;
    download: string;
}

export default function QrPage({
    params: { value, download },
}: {
    params: QrPageProps;
}) {
    const downloadStarted = useRef<boolean>(false);
    const params = useSearchParams();
    const finalUrl = `${window.location.protocol}//${window.location.hostname}${
        window.location.hostname == "localhost"
            ? `:${window.location.port}`
            : ""
    }/a/${value}`;

    const onImageDownload = () => {
        const svg = document.getElementById("QRCode");
        if (!svg) {
            console.error("QRCode not found");
            return;
        }

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            if (!ctx) {
                console.error("Canvas not found");
                return;
            }
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `QRCode-${value}`;
            downloadLink.href = `${pngFile}`;
            downloadLink.click();
        };
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    };

    React.useEffect(() => {
        if (params.get("download") === "true") {
            if (downloadStarted.current) return;

            downloadStarted.current = true;
            setTimeout(() => {
                onImageDownload();
            }, 500);
        }
    }, [params]);

    return (
        <div>
            <PageContentTitle>QR</PageContentTitle>

            <Spacer y size={4} />

            <div style={{ maxWidth: 512, margin: "auto", padding: 16 }}>
                <QRCode
                    id="QRCode"
                    value={finalUrl}
                    size={512}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
            </div>
            <Flex justifyContent={"center"}>
                <Button onClick={onImageDownload}>Download</Button>
            </Flex>
        </div>
    );
}
