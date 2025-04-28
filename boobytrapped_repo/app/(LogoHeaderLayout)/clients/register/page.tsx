"use client";

import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import { Input } from "@/components/common/FormInputs/Input";
import Spacer from "@/components/common/Spacer";
import AuthService, { RegisterClientRequestDto } from "@/services/AuthService";
import { theme } from "@/styles/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import styled from "styled-components";
import useSWR from "swr";
import * as yup from "yup";

const validationSchema = yup.object().shape({
    name: yup.string().required().min(2),
    email: yup.string().email().required(),
    password: yup
        .string()
        .required()
        .matches(
            // todo add other special characters
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Password must contain at least 8 Characters, one uppercase, one lowercase, one number and one special character.",
        ),
    password2: yup
        .string()
        .required("This field is required")
        .oneOf([yup.ref("password"), null], "Passwords must match"),
    companyName: yup.string(),
}) as any;

const Register = () => {
    const [loading, setLoading] = React.useState(false);
    const [invitationCode, setInvitationCode] = React.useState<string>("");
    const router = useRouter();

    const params = useSearchParams();
    const { data: invitationData } = useSWR(
        invitationCode ? `/invitations/${invitationCode}` : null,
    );

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RegisterClientRequestDto>({
        mode: "all",
        resolver: yupResolver(validationSchema),
    });

    const handleCodeSubmit = (data: RegisterClientRequestDto) => {
        setLoading(true);

        AuthService.registerClient(data)
            .then((res) => {
                if (res.ok && res.data?.type == "success") {
                    toast.success(
                        "You have successfully registered! Please check your email",
                    );
                    setTimeout(() => {
                        router.replace("/admin/login?registered=true");
                    }, 2000);
                } else {
                    toast.error(
                        `Registration failed: ${res.data?.json.message}`,
                    );
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log({ err });
                setLoading(false);
            });
    };

    const resetForm = () => {
        reset();
    };

    React.useEffect(() => {
        const code = params.get("code");
        if (code) setInvitationCode(code);
    }, [params]);

    React.useEffect(() => {
        if (invitationData?.data?.json) {
            reset({
                email: invitationData.data.json.email,
            });
        }
    }, [invitationData, reset]);

    const isValid = Object.keys(errors).length == 0;

    const styles = {
        passwordIconContainer: {
            position: "relative" as const,
            width: "-webkit-fill-available",
        },
        passwordIcon: {
            position: "absolute" as const,
            top: errors.password ? "38%" : "65%",
            right: "10px",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: theme.colors.blackLight20,
            borderRadius: "2px",
        },
        passwordIcon2: {
            position: "absolute" as const,
            top: errors.password2 ? "48%" : "65%",
            right: "10px",
            transform: "translateY(-50%)",
            cursor: "pointer",
            color: theme.colors.blackLight20,
            borderRadius: "2px",
        },
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowPassword2 = () => {
        setShowPassword2(!showPassword2);
    };

    return (
        <Container>
            <h2>Register a new account</h2>

            <Spacer y size={5} />

            <FormContainer>
                <form onSubmit={handleSubmit(handleCodeSubmit)}>
                    <Spacer y size={4} />

                    <Input
                        label="Full Name *"
                        inputProps={{
                            type: "text",
                            required: true,
                            name: "name",
                        }}
                        register={register}
                        errors={errors}
                    />

                    <Spacer y size={2} />

                    <Input
                        label="Email *"
                        inputProps={{
                            type: "email",
                            required: true,
                            name: "email",
                        }}
                        register={register}
                        errors={errors}
                    />

                    <Spacer y size={2} />

                    <div style={styles.passwordIconContainer}>
                        <Input
                            label="Password"
                            errors={errors}
                            inputProps={{
                                type: showPassword ? "text" : "password",
                                name: "password",
                            }}
                            register={register}
                        />
                        <i
                            onClick={toggleShowPassword}
                            style={styles.passwordIcon}
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </i>
                    </div>

                    <Spacer y size={2} />

                    <div style={styles.passwordIconContainer}>
                        <Input
                            label="Confirm password *"
                            errors={errors}
                            inputProps={{
                                type: showPassword2 ? "text" : "password",
                                name: "password2",
                            }}
                            register={register}
                        />
                        <i
                            onClick={toggleShowPassword2}
                            style={styles.passwordIcon2}
                        >
                            {showPassword2 ? <FaEye /> : <FaEyeSlash />}
                        </i>
                    </div>

                    <Spacer y size={2} />

                    <Input
                        label="Company Name"
                        inputProps={{
                            type: "text",
                            required: false,
                            name: "companyName",
                        }}
                        register={register}
                        errors={errors}
                    />

                    <Spacer y size={2} />

                    <Flex justifyContent="space-between">
                        <Button
                            outline
                            type="button"
                            disabled={loading}
                            onClick={resetForm}
                        >
                            Reset
                        </Button>
                        <Button type="submit" disabled={loading || !isValid}>
                            Register
                        </Button>
                    </Flex>
                </form>
            </FormContainer>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    text-align: center;
`;

const FormContainer = styled.div`
    margin: auto;
    max-width: 400px;
`;

export default Register;
