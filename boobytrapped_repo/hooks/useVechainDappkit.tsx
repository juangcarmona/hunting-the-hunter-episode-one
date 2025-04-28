"use client";

import { useConnex, useWallet } from "@vechain/dapp-kit-react";
import { useCallback } from "react";
import { Transaction } from "thor-devkit";
import useBlockchainRequests from "./useBlockchainRequests";

const useVechainDappkit = () => {
    const { account: address } = useWallet();
    const { onSignatureRequest, onSignatureResponse, onSignatureError } =
        useBlockchainRequests();

    const { thor, vendor } = useConnex();

    const estimateGas = useCallback(
        async (clauses: any) => {
            let explainer = thor.explain(clauses);

            if (address) {
                explainer = explainer.caller(address);
            }

            const output = await explainer.execute();
            const executionGas = output.reduce(
                (sum: any, out: any) => sum + out.gasUsed,
                0,
            );

            const intrinsicGas = Transaction.intrinsicGas(
                clauses as Transaction.Clause[],
            );

            const leeway = executionGas > 0 ? 400000 : 0;

            return intrinsicGas + executionGas + leeway;
        },
        [address, thor],
    );

    //pass proper type
    const sign = useCallback(
        async (clauses: any[], comment: string) => {
            try {
                const gasEstimate = await estimateGas(clauses);
                onSignatureRequest();
                const tx = await vendor
                    .sign("tx", clauses)
                    .gas(gasEstimate)
                    .delegate("https://sponsor.vechain.energy/by/15")
                    .comment(comment)
                    .request();
                onSignatureResponse();
                return tx.txid;
            } catch (error) {
                onSignatureError();
            }
        },
        [
            estimateGas,
            onSignatureError,
            onSignatureRequest,
            onSignatureResponse,
            vendor,
        ],
    );

    return {
        address,
        sign,
    };
};

export default useVechainDappkit;
