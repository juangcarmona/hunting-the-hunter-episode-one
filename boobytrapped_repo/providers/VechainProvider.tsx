"use client";

import type { WalletConnectOptions } from "@vechain/dapp-kit";
import dynamic from "next/dynamic";

const DAppKitProvider = dynamic(
    async () => {
        const { DAppKitProvider: _DAppKitProvider } = await import(
            "@vechain/dapp-kit-react"
        );
        return _DAppKitProvider;
    },
    {
        ssr: false,
    },
);

const walletConnectOptions: WalletConnectOptions = {
    projectId: "495a39b74a82610c5313e76f33e22918",
    metadata: {
        name: "Sample VeChain dApp",
        description: "A sample VeChain dApp",
        url: typeof window !== "undefined" ? window.location.origin : "",
        icons: [
            typeof window !== "undefined"
                ? `${window.location.origin}/images/logo/my-dapp.png`
                : "",
        ],
    },
};

const VechainProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <DAppKitProvider
            nodeUrl="https://node.vechain.energy"
            walletConnectOptions={walletConnectOptions}
            usePersistence
            useFirstDetectedSource
            requireCertificate
        >
            {children}
        </DAppKitProvider>
    );
};

// eslint-disable-next-line import/no-default-export
export default VechainProvider;
