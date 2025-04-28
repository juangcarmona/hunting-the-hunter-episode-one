import UserService from "@/services/UsersService.ts";
import { logoState } from "@/state/logo";
import { theme } from "@/styles/theme";
import { useMediaQuery } from "@react-hook/media-query";
import React from "react";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import Button from "../common/Button";
import Spacer from "../common/Spacer";
import { UserProps } from "./ProfileContent";

interface GeneralSettingsProps {
    userData: UserProps;
    reloadUserProps: () => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
    userData,
    reloadUserProps,
}) => {
    const [currentLogo, setCurrentLogo] = useRecoilState(logoState);
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const onUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        await UserService.uploadLogo(formData)
            .then((res) => {
                if (res.ok) {
                    setCurrentLogo(res.data?.json.customLogo);
                    toast.success("Logo uploaded successfully");
                } else {
                    toast.error("Failed to upload logo");
                }
            })
            .catch((err) => {
                toast.error("Failed to upload logo");
            })
            .finally(() => {
                reloadUserProps();

                // Reset the input
                e.target.value = "";
            });
    };

    const deleteLogo = async () => {
        await UserService.deleteLogo()
            .then((res) => {
                if (res.ok) {
                    setCurrentLogo(null);
                    toast.success("Logo deleted successfully");
                } else {
                    toast.error("Failed to delete logo");
                }
            })
            .catch((err) => {
                toast.error("Failed to delete logo");
            })
            .finally(() => {
                reloadUserProps();
            });
    };

    return (
        <div
            style={{
                minWidth: isMobile ? 0 : 400,
                maxWidth: 500,
                padding: isMobile ? 0 : 20,
                flex: 1,
                width: "inherit",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", rowGap: 3 }}>
                <ImgWrapper
                    style={{
                        marginRight: isMobile ? 0 : "20px",
                        width: isMobile ? "150px" : "200px",
                        minWidth: isMobile ? "150px" : "200px",
                    }}
                >
                    <img
                        src={
                            (userData.customLogo ??
                                currentLogo ??
                                "/images/logo.png") +
                            "?t=" +
                            Date.now()
                        }
                        width="100%"
                        height="auto"
                    />
                </ImgWrapper>

                <div>
                    <h3>Logo</h3>

                    <p>
                        We recommend an image of at least 175x50.
                        <br />
                        <small>May take up to a minute to update.</small>
                    </p>

                    <Spacer y size={2} />

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onUploadFile}
                        hidden
                    />

                    <Button
                        small
                        outline
                        onClick={() => {
                            fileInputRef.current?.click();
                        }}
                    >
                        Upload
                    </Button>

                    {userData.customLogo && (
                        <>
                            <Spacer size={2} />

                            <Button small outline onClick={deleteLogo} error>
                                Delete
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const ImgWrapper = styled.div`
    height: 200px;
    overflow: hidden;
    display: flex;
    align-items: center;
`;

export const SectionLabel = styled.h3`
    font-size: 12px;
    line-height: 1;
    font-weight: 700;
    text-transform: uppercase;
    color: #b1b5c3;
    margin-bottom: 12px;
`;

export default GeneralSettings;
