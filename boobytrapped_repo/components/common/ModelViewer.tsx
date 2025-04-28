import Script from "next/script";
import React from "react";
import styled from "styled-components";

interface ModelViewerComponentProps {
    animation_url: string;
    alt: string;
    poster: string;
}

const ModelViewer: React.FC<ModelViewerComponentProps> = ({
    animation_url,
    alt,
    poster,
}) => {
    return (
        <>
            <Script
                async
                strategy="afterInteractive"
                type="module"
                src="https://unpkg.com/@google/model-viewer@^3.2.1/dist/model-viewer.min.js"
            />
            <StyledModelViewer>
                <model-viewer
                    camera-controls
                    auto-rotate
                    touch-action="pan-y"
                    shadow-intensity="1"
                    alt={`Model ${alt}`}
                    poster={poster}
                    src={animation_url}
                />
            </StyledModelViewer>
        </>
    );
};

const StyledModelViewer = styled.div`
    height: 600px;
    > model-viewer {
        width: 100%;
        height: 100%;
        #default-poster {
            background-size: cover !important;
        }
    }
`;

export default ModelViewer;
