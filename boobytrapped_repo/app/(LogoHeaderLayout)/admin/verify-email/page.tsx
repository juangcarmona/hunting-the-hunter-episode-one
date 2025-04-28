"use client";

import Flex from "@/components/common/Flex";
import Spacer from "@/components/common/Spacer";
import AuthService from "@/services/AuthService";
import { useRouter, useSearchParams } from "next/navigation";

import React, { useRef } from "react";
import { toast } from "react-toastify";

const VerifyEmailPage: React.FC = () => {
    const isSubmitting = useRef(false);
    const router = useRouter();
    const params = useSearchParams();

    const [error, setError] = React.useState<string>();

    React.useEffect(() => {
        const code = params.get("code");
        if (!isSubmitting.current && code) {
            isSubmitting.current = true;

            AuthService.verifyEmail(code)
                .then((res) => {
                    if (res.data?.type == "success" && res.data?.json.success) {
                        toast.success("Email verified, redirecting to login!");
                        setTimeout(() => {
                            router.replace("/admin/login");
                        }, 1000);
                    } else {
                        toast.error(
                            `Can't verify email: ${res.data?.json.message}`,
                        );
                        setError(res.data?.json.message);
                    }
                })
                .catch((err) => {
                    console.log({ err });
                });
        }
    }, [params]);

    return (
        <div>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Spacer y size={3} />
                <h1>Verifying your account...</h1>

                {!error ? (
                    <p>This will take a few seconds, please wait.</p>
                ) : (
                    <p>{error}</p>
                )}
            </Flex>
        </div>
    );
};

export default VerifyEmailPage;
