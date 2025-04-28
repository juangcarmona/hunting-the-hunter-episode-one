import "@/styles/index.scss";
import { Metadata, Viewport } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProvidersWrapper from "./providersWrapper";

export const metadata: Metadata = {
    title: "WoV Labs - Tokenization Solutions",
    description: "Mint your phygital on World of V ",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1.0,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ToastContainer position="top-center" />
                <ProvidersWrapper>{children}</ProvidersWrapper>
            </body>
        </html>
    );
}
