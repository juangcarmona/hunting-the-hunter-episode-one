import { useCallback } from "react";
import { toast as toastify } from "react-toastify";

const useBlockchainRequests = () => {
    const onSignatureRequest = useCallback(() => {
        // We set a timeout for the toast since the transaction
        // promise will remain pending indefinitely if the user does
        // not explicitly decline the transaction.
        const timeout = setTimeout(
            () => toastify.dismiss("INTERFACING_WITH_WALLET"),
            20000,
        );

        toastify.loading("Interfacing with wallet...", {
            closeButton: true,
            closeOnClick: true,
            toastId: "INTERFACING_WITH_WALLET",
            onClose: () => clearTimeout(timeout),
        });
    }, []);

    const onSignatureResponse = useCallback(() => {
        toastify.dismiss("INTERFACING_WITH_WALLET");
    }, []);

    const onSignatureError = useCallback(() => {
        toastify.dismiss("INTERFACING_WITH_WALLET");
    }, []);

    const onCheckTxRequest = useCallback((txID: string) => {
        toastify.loading("Transaction in progress...", {
            closeButton: true,
            closeOnClick: true,
            toastId: `CHECK_TRANSACTION_${txID}`,
        });
    }, []);

    const onCheckTxResponse = useCallback((txID: string) => {
        toastify.update(`CHECK_TRANSACTION_${txID}`, {
            render: "Transaction confirmed!",
            type: toastify.TYPE.SUCCESS,
            autoClose: 5000,
            isLoading: false,
            closeButton: true,
            closeOnClick: true,
        });
    }, []);

    const onCheckTxError = useCallback((txID: string, error: any) => {
        toastify.update(`CHECK_TRANSACTION_${txID}`, {
            render: error?.message || "Unknown error.",
            type: toastify.TYPE.ERROR,
            autoClose: 5000,
            isLoading: false,
            closeButton: true,
            closeOnClick: true,
        });
    }, []);

    return {
        onSignatureRequest,
        onSignatureResponse,
        onSignatureError,
        onCheckTxRequest,
        onCheckTxResponse,
        onCheckTxError,
    };
};

export default useBlockchainRequests;
