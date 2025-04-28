import { useMediaQuery } from "@react-hook/media-query";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Box from "../common/Box";
import Flex from "../common/Flex";
import ModelViewer from "../common/ModelViewer";

interface VideoOptions {
    height?: number;
    maxWidth?: number;
    maxHeight?: number;
}

interface ImageOptions {
    width?: number;
    height?: number;
    maxHeight?: number;
    respectRatio?: boolean;
    sizes?: string;
}
interface MediaDisplayerProps {
    image: string;
    image_mime_type?: string | null;
    animation_url?: string;
    alt: string;
    videoOptions?: VideoOptions;
    imageOptions?: ImageOptions;
}

const MediaDisplayer: React.FC<MediaDisplayerProps> = ({
    image,
    image_mime_type,
    animation_url,
    alt,
    videoOptions,
    imageOptions,
}) => {
    const isMobile = useMediaQuery(`(max-width: 766px`);
    const [showControl, setShowControl] = useState(false);
    const [placeholder, setPlaceholder] = useState<string | undefined>();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [ratio, setRatio] = useState(1);

    useEffect(() => {
        const getPlaceholder = async () => {
            if (image_mime_type?.startsWith("image")) {
                const { data } = await axios.post("/api/getBase64", {
                    url: image,
                });
                setPlaceholder(data?.data);
            }
        };
        getPlaceholder();
    }, [image, image_mime_type]);

    if (animation_url)
        return (
            <Box width="70%">
                <ModelViewer
                    animation_url={animation_url}
                    alt={alt}
                    poster={image}
                />
            </Box>
        );

    if (image_mime_type?.startsWith("video"))
        return (
            <Box
                maxWidth={videoOptions?.maxWidth}
                maxHeight={videoOptions?.maxHeight}
                onMouseEnter={() => setShowControl(true)}
                onMouseLeave={() => setShowControl(false)}
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    height={videoOptions?.height}
                    controls={showControl}
                    src={image}
                    width="100%"
                />
            </Box>
        );

    return (
        <Flex
            alignItems="center"
            position="relative"
            width="100%"
            height="inherit"
        >
            <Image
                src={image}
                alt={alt || "Nft Image"}
                width={imageOptions?.width}
                height={
                    imageOptions?.height
                        ? imageOptions.respectRatio
                            ? imageOptions.height / ratio
                            : imageOptions.height
                        : undefined
                }
                fill={imageOptions?.width && imageOptions.height ? false : true}
                style={{
                    borderRadius: isMobile ? "30px" : "0",
                    margin: "0 auto",
                    objectFit:
                        imageOptions?.width && imageOptions.height
                            ? "contain"
                            : isMobile
                              ? "cover"
                              : "contain",
                    userSelect: "none",
                    maxHeight: imageOptions?.maxHeight,
                }}
                sizes={
                    imageOptions?.width && imageOptions.height
                        ? imageOptions.sizes
                        : undefined
                }
                placeholder={placeholder && !imageLoaded ? "blur" : "empty"}
                blurDataURL={placeholder}
                onLoad={({ target }: any) => {
                    setRatio(target.naturalWidth / target.naturalHeight);
                    setImageLoaded(true);
                }}
            />
        </Flex>
    );
};

export default MediaDisplayer;
