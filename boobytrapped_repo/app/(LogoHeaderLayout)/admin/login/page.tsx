"use client";

import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import { Input } from "@/components/common/FormInputs/Input";
import Spacer from "@/components/common/Spacer";
import { LoginRequestDto } from "@/dtos/login.dto";
import AuthService from "@/services/AuthService";
import UserService from "@/services/UsersService.ts";
import { logoState } from "@/state/logo";
import { userRole } from "@/state/user";
import { theme } from "@/styles/theme";
import { parseJWT } from "@/utils/parseJWT";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import * as yup from "yup";

const validationSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
}) as any;

const LoginPage: React.FC = () => {
    const params = useSearchParams();
    const router = useRouter();

    const isJustRegistered = React.useMemo(() => {
        return params.get("registered") === "true";
    }, [params]);

    const [loginError, setLoginError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const [_, setCustomLogo] = useRecoilState(logoState);

    const setUserRole = useSetRecoilState(userRole);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequestDto>({
        mode: "all",
        resolver: yupResolver(validationSchema),
    });

    const handleFormSubmit = (data: LoginRequestDto) => {
        setCustomLogo(null);

        setLoading(true);
        setLoginError(null);
        AuthService.login(data)
            .then(async (res) => {
                if (res.data?.type === "success") {
                    const parsedJWT = parseJWT(res.data?.json.access_token);
                    setUserRole(parsedJWT.role);

                    const settings = await UserService.getSettings();
                    if (settings?.ok && settings?.data?.type == "success") {
                        setCustomLogo(settings.data.json.customLogo);
                    }

                    router.replace("/admin/home");
                } else {
                    if (res.status == 401)
                        setLoginError("Invalid email or password");
                    else setLoginError("An error occurred");
                }
            })
            .catch((err) => {
                setLoginError("An unknown error occurred");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const isValid = Object.keys(errors).length === 0;

    const styles = {
        passwordIconContainer: {
            position: "relative" as const,
            width: "-webkit-fill-available",
        },
        passwordIcon: {
            position: "absolute" as const,
            top: errors.password ? "48%" : "65%",
            right: "10px",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: theme.colors.blackLight20,
            borderRadius: "2px",
        },
    };

    return (
        <div>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Spacer size={4} y />

                {isJustRegistered ? (
                    <JustRegistered>
                        <p>
                            Please validate your account by clicking the link
                            we&apos;ve sent to your inbox before logging in.
                        </p>
                    </JustRegistered>
                ) : (
                    <>
                        <h1>Login</h1>

                        <Spacer size={4} y />

                        <div style={{ maxWidth: 400, width: "100%" }}>
                            <form
                                onSubmit={handleSubmit(handleFormSubmit)}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Input
                                    label="Email"
                                    errors={errors}
                                    inputProps={{
                                        type: "email",
                                        name: "email",
                                    }}
                                    register={register}
                                />

                                <Spacer size={3} y />

                                <div style={styles.passwordIconContainer}>
                                    <Input
                                        label="Password"
                                        errors={errors}
                                        inputProps={{
                                            type: showPassword
                                                ? "text"
                                                : "password",
                                            name: "password",
                                        }}
                                        register={register}
                                    />
                                    <i
                                        onClick={toggleShowPassword}
                                        style={styles.passwordIcon}
                                    >
                                        {showPassword ? (
                                            <FaEye />
                                        ) : (
                                            <FaEyeSlash />
                                        )}
                                    </i>
                                </div>

                                <Spacer size={3} y />

                                {loginError && (
                                    <LoginError>
                                        {loginError} <Spacer y size={3} />
                                    </LoginError>
                                )}

                                <Button
                                    type="submit"
                                    disabled={!isValid || loading}
                                >
                                    Login
                                </Button>
                            </form>
                        </div>
                    </>
                )}
            </Flex>
        </div>
    );
};

const LoginError = styled.div`
    color: red;
    text-align: center;
`;

const JustRegistered = styled.div`
    background-color: #92f1ab;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    text-align: center;
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export default LoginPage;
