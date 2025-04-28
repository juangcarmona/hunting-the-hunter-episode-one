import picasso from "@vechain/picasso";
import Image from "next/image";
import React, { useMemo } from "react";
import styled from "styled-components";

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
    T,
    Exclude<keyof T, Keys>
> &
    {
        [K in Keys]-?: Required<Pick<T, K>> &
            Partial<Pick<T, Exclude<Keys, K>>>;
    }[Keys];

interface UserAvatarProps {
    src?: string | null;
    address?: string | null;
    size?: string | number;
    style?: React.CSSProperties;
    altText?: string | undefined;
}

type UserAvatarAtLeastOneProps = RequireAtLeastOne<
    UserAvatarProps,
    "src" | "address"
>;

const UserAvatar = React.forwardRef<HTMLDivElement, UserAvatarAtLeastOneProps>(
    function UserAvatar(
        { src, address, size, style, altText = "User Avatar" },
        ref,
    ) {
        const svg = useMemo(() => {
            const svg = picasso(address ?? "");
            return `data:image/svg+xml;utf8,${svg}`;
        }, [address]);

        const isNotOptimized = useMemo(() => {
            return src?.includes("/original");
        }, [src]);

        return (
            <Container
                {...{
                    size,
                    style,
                    ref,
                }}
            >
                {src ? (
                    <Image
                        {...{ src }}
                        alt={altText}
                        width={(size as number | `${number}`) || 98}
                        height={(size as number | `${number}`) || 98}
                        unoptimized={!isNotOptimized}
                        style={{
                            maxWidth: "100%",
                            height: "auto",
                        }}
                    />
                ) : (
                    <ThumbnailSvg src={svg} size={size} />
                )}
            </Container>
        );
    },
);
const Container = styled.div<{
    size?: string | number;
}>`
    position: relative;
    width: ${({ size }) => size || 98}px;
    height: ${({ size }) => size || 98}px;
    min-width: ${({ size }) => size || 98}px;
    min-height: ${({ size }) => size || 98}px;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        vertical-align: top;
    }
`;

const ThumbnailSvg = styled.img<{ size?: string | number }>`
    height: ${({ size }) => size || 98}px;
    width: ${({ size }) => size || 98}px;
    min-width: ${({ size }) => size || 98}px;
    min-height: ${({ size }) => size || 98}px;
    border-radius: 50%;
`;

export default UserAvatar;
