import { avatarSrc } from "@/state/avatarSrc";
import React, { ChangeEvent, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import blobToBase64 from "./convertBlob";

interface AvatarProps {
    onSelectFile: (file: File | null) => void;
}

const Avatar: React.FC<AvatarProps> = ({ onSelectFile }) => {
    const [avatarUrl, setAvatarUrl] = useRecoilState(avatarSrc);

    const [error, setError] = useState<string>("");

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0];

        onSelectFile(selectedFile);

        if (selectedFile) {
            setAvatarUrl(await blobToBase64(selectedFile));
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();

                img.onload = () => {
                    if (img.width >= 400 && img.height >= 400) {
                        onSelectFile(selectedFile);
                    } else {
                        setError("The image you provided is too small");
                    }
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    return (
        <Main>
            <div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="fileInput"
                />

                <div
                    className="avatar"
                    onClick={() =>
                        document.getElementById("fileInput")?.click()
                    }
                >
                    <img
                        src={avatarUrl || "/images/avatar_search.png"}
                        alt=""
                        className="image"
                    />
                </div>

                {avatarSrc !== null ? (
                    <></>
                ) : (
                    <div className="error">{error}</div>
                )}
            </div>
        </Main>
    );
};

const Main = styled.div`
    .avatar {
        width: 200px;
        height: 200px;
        border-radius: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid rgb(190, 190, 190);
        overflow: hidden;
        cursor: pointer;

        @media (max-width: 600px) {
            width: 150px;
            height: 150px;
        }
    }

    .image {
        width: 200px;
        height: 200px;
    }

    .error {
        text-align: center;
        color: red;
        font-size: 13px;
        font-weight: bold;
    }

    .select_icon {
        width: 60px;
        height: 60px;
    }
`;

export default Avatar;
