"use client";
import Spacer from "@/components/common/Spacer";
import { getCurrentUser } from "@/helpers/getCurrentUser";
import useConnectedChain from "@/hooks/useConnectedChain";
import { avatarSrc } from "@/state/avatarSrc";
import { userStatus } from "@/state/userStatus";
import axios from "axios";
import { useEffect, useState } from "react";
import { CountryDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import PageContentTitle from "../common/PageContentTitle";
import Avatar from "./Avatar";

const OwnershipSettingsContent = () => {
    const handleFileSelect = (file: File | null) => {
        if (file) {
        }
    };

    const handleCountryChange = (val: any) => {
        setCountry(val);
    };

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState<string>("");
    const [avatarUrl, setAvatarUrl] = useRecoilState(avatarSrc);
    const [status, setStatus] = useRecoilState(userStatus);

    const [emailError, setEmailError] = useState("");
    const [user, setUser] = useState(false);
    const [phoneError, setPhoneError] = useState("");
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [country, setCountry] = useState("");
    const { address } = useConnectedChain();

    useEffect(() => {
        (async () => {
            const userCheck = await getCurrentUser(address);
            if (userCheck) {
                setUser(true);
                setEmail(userCheck.email);
                setPhone(userCheck.phone);
                setName(userCheck.name);
                setCountry(userCheck.country);
                setAvatarUrl(userCheck.avatar);
            } else {
                setUser(false);
            }
        })();
    }, [address, user, setAvatarUrl]);

    function handleSave(event: any) {
        if (name === "") {
            setNameError("Input Name");
            return;
        } else {
            setNameError("");
        }

        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Error! Invalid email.");
            return;
        } else {
            setEmailError("");
        }

        const data = {
            name: name,
            email: email,
            country: country,
            phone: phone,
            avatar: avatarUrl,
            wallet: address,
        };

        if (
            user === false &&
            nameError === "" &&
            emailError === "" &&
            phoneError === ""
        ) {
            const userInfo = axios
                .post(`${process.env.NEXT_PUBLIC_BE_URL}/users/register`, data)
                .then((res) => {
                    if (res.status === 201) {
                        toast.success("Successfully saved!");
                        setUser(true);
                        setStatus(status + 1);
                    } else {
                        toast.error("Something went wrong!");
                    }
                })
                .catch((err) => {
                    toast.error("Already exist same user!");
                });
        } else if (
            user === true &&
            nameError === "" &&
            emailError === "" &&
            phoneError === ""
        ) {
            const userUpdate = axios
                .post(`${process.env.NEXT_PUBLIC_BE_URL}/users/update`, data)
                .then((res) => {
                    if (res.status === 201) {
                        toast.success("Successfully updated!");
                        setStatus(status + 1);
                    } else {
                        toast.error("Something went wrong!");
                    }
                })
                .catch((err) => {
                    toast.error("Already exist same user!");
                });
        }
    }

    const getEmail = (e: any) => {
        setEmail(e.target.value);
    };

    const getName = (e: any) => {
        setName(e.target.value);
    };

    return (
        <>
            <Main>
                <PageContentTitle>Account Details</PageContentTitle>
                <Spacer y size={5} />
                <div className="setting">
                    <div className="avatar_setting">
                        <div className="avatar_wrap">
                            <div className="avatar">
                                <Avatar onSelectFile={handleFileSelect} />
                            </div>
                        </div>
                        <div className="upload">
                            <div className="title">Profile Photo</div>
                            <p>
                                We recommend an image of at least
                                <br />
                                400x400
                            </p>
                            <p className="description">
                                May take up to a minute to update
                            </p>
                            <div className="upload_save_btn">
                                <button
                                    className="btn"
                                    type="button"
                                    onClick={handleSave}
                                >
                                    {user === false ? "Save" : "Update"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="setting-box">
                        <div className="name">
                            <div className="label">NAME*</div>
                            {nameError && (
                                <div className="error">{nameError}</div>
                            )}
                            <input
                                type="text"
                                className="input-box"
                                value={name}
                                onChange={getName}
                            />

                            <div className="label">EMAIL*</div>
                            {emailError && (
                                <div className="error">Invalid email</div>
                            )}
                            <input
                                type="text"
                                className="input-box"
                                value={email}
                                onChange={getEmail}
                                placeholder="www@gmail.com"
                            />

                            <div className="label">PHONE</div>
                            {phoneError && (
                                <div className="error">Invalid Phone</div>
                            )}
                            <PhoneInput
                                country={"us"}
                                value={phone}
                                onChange={setPhone}
                            />
                        </div>
                        <div className="country">
                            <div className="label">COUNTRY</div>
                            <StyledCountryDropdown
                                value={country}
                                onChange={handleCountryChange}
                                valueType="short"
                            />
                        </div>
                    </div>
                </div>
            </Main>
        </>
    );
};

const Main = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    padding-right: 20px;

    .setting {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 0 30px 30px 30px;
    }

    .react-tel-input {
        width: auto;
        height: 50px;
        border: none;

        .form-control {
            height: 50px;
            color: black;
        }
    }

    .error {
        color: red;
    }

    .head {
        font-size: 30px;
        font-weight: bold;
        margin: 20px 0 30px 0;

        @media (max-width: 600px) {
            font-size: 25px;
        }
    }

    .upload_save_btn {
        display: flex;
        flex-direction: row;

        .btn {
            margin: 30px 0 0 10px;
            cursor: pointer;
            width: 100px;
            height: 40px;
            border-radius: 20px;
            border: 1px solid rgb(190, 190, 190);
            font-size: 20px;
            color: grey;
            display: flex;
            justify-content: center;
            align-items: center;

            &:hover {
                background-color: rgb(231, 232, 236);
            }

            @media (max-width: 600px) {
                width: 80px;
                height: 30px;
                margin: 10px 0 0 5px;
                font-size: 16px;
            }
        }
    }

    .avatar_setting {
        display: flex;
        flex-direction: row;
    }

    .avatar_wrap {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        @media (max-width: 600px) {
            flex: 1;
        }
    }

    .upload {
        flex: 2;
        display: flex;
        flex-direction: column;
        padding: 0 20px 20px 20px;

        @media (max-width: 600px) {
            flex: 1;
        }
    }

    .description {
        font-size: 17px;

        @media (max-width: 600px) {
            font-size: 12px;
        }
    }

    .title {
        font-size: 30px;
        font-weight: bold;
        padding: 0 0 20px 0;

        @media (max-width: 600px) {
            font-size: 25px;
        }
    }

    p {
        font-size: 20px;
        color: grey;

        @media (max-width: 600px) {
            font-size: 18px;
        }
    }

    .setting-box {
        display: flex;
        flex-direction: column;
        padding: 20px;
    }

    .label {
        font-size: 20px;
        font-weight: bold;
        color: rgb(190, 190, 190);
        padding: 20px 0 10px 0;

        @media (max-width: 600px) {
            font-size: 15px;
        }
    }

    .input-box {
        border: 1px solid rgb(190, 190, 190);
        border-radius: 10px;
        width: 300px;
        height: 50px;
        padding: 0 0 10px 0;
        padding: 5px 10px 5px 10px;
        font-size: 18px;

        @media (max-width: 600px) {
            width: 100%;
            height: 35px;
        }
    }
`;

const StyledCountryDropdown = styled(CountryDropdown)`
    /* Styles for the CountryDropdown */
    font-size: 14px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 300px;
    height: 50px;
    background-color: #f9f9f9;

    @media (max-width: 600px) {
        width: 100%;
        height: 35px;
    }
`;

export default OwnershipSettingsContent;
