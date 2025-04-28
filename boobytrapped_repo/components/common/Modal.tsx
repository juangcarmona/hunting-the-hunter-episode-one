import mixins from "@/styles/_mixins";
import variables from "@/styles/_variables";
import { theme } from "@/styles/theme";
import { useMediaQuery } from "@react-hook/media-query";
import dynamic from "next/dynamic";
import { rgba } from "polished";
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const { media, dark } = mixins;
const {
    colors: { neutrals },
} = variables;

export interface ModalProps {
    isOpen: boolean;
    setIsOpen: (newState: boolean) => void; // Why using an imperative prop instead of a declarative one like onClose? :(
    className?: string;
    style?: React.CSSProperties;
    small?: boolean;
    zIndex?: number;
    contentPadding?: string | number;
    hasCloseButton?: boolean;
    additionalProperties?: any;
}

const Modal: React.FC<
    React.PropsWithChildren<React.PropsWithChildren<ModalProps>>
> = ({
    isOpen,
    setIsOpen,
    children,
    className,
    style,
    small,
    zIndex = 1000,
    contentPadding: bodyPadding = "16px",
    hasCloseButton,
    additionalProperties,
}) => {
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    const handleClose = () => {
        setIsOpen(false);
    };

    if (process.browser && isOpen) {
        return ReactDOM.createPortal(
            <div {...{ style, className }}>
                <ModalBackdrop
                    zIndex={zIndex}
                    className="Modal__Backdrop"
                    onClick={handleClose}
                />

                <ModalWrap zIndex={zIndex + 10} className="Modal__Wrap">
                    <ModalContainer className="Modal__Container">
                        <ModalContent
                            zIndex={zIndex + 20}
                            className="Modal__Content"
                        >
                            <ModalWrapper
                                className="Modal__Wrapper"
                                {...{ small, isMobile }}
                            >
                                {hasCloseButton && (
                                    <ModalCloseButton onClick={handleClose}>
                                        ×
                                    </ModalCloseButton>
                                )}
                                <ModalBody
                                    style={{
                                        height:
                                            additionalProperties?.height ||
                                            "auto",
                                    }}
                                    padding={
                                        typeof bodyPadding === "number"
                                            ? bodyPadding + "px"
                                            : bodyPadding
                                    }
                                    className="Modal__Body"
                                >
                                    {children}
                                </ModalBody>
                            </ModalWrapper>
                        </ModalContent>
                    </ModalContainer>
                </ModalWrap>
            </div>,
            document.body,
        );
    }

    return null;
};

const ModalBody = styled.div<{ padding: string }>`
    padding-right: ${({ padding }) => `${padding}`};
    padding-left: ${({ padding }) => `${padding}`};
    padding-bottom: ${({ padding }) => `${padding}`};
`;

const ModalBackdrop = styled.div<{ zIndex: number }>`
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: ${(props) => props.zIndex};
    overflow: hidden;
    position: fixed;
    opacity: 0.8;
    background: ${rgba(neutrals[1], 0.7)};

    ${dark`
        background: ${rgba(neutrals[2], 0.9)};
    `}
`;

const ModalWrap = styled.div<{ zIndex: number }>`
    pointer-events: none;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: ${(props) => props.zIndex};
    position: fixed;
    outline: none !important;
`;

const ModalContainer = styled.div<{ isSuccessModal?: boolean }>`
    text-align: center;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    padding: 20px;
    box-sizing: border-box;

    ${media.m`
      padding: 0;
    `}

    @media (max-width: 900px) {
        padding: ${(props) => (props.isSuccessModal ? "0 30px" : "0 16px")};
    }
`;

const ModalContent = styled.div<{ zIndex: number }>`
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin: 0 auto;
    text-align: left;
    z-index: ${(props) => props.zIndex};
    width: 100%;
    cursor: auto;
    height: 100%;
    display: flex;
    align-items: center;
`;

const ModalWrapper = styled.div<{ small?: boolean; isMobile?: boolean }>`
    pointer-events: all;
    position: relative;
    max-width: ${({ small }) => (small ? "448px" : "680px")};
    margin: 16px auto;
    background: ${neutrals[8]};
    border-radius: 30px;
    max-height: calc(100% - 32px);
    overflow: hidden;
    width: ${({ isMobile }) => (isMobile ? "75%" : "100%")};
    max-width: 450px;
    ${dark`
        background: ${neutrals[1]};
        box-shadow: inset 0 0 0 1px ${neutrals[2]};
    `};
`;

const ModalCloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    border: 2px solid ${neutrals[6]};
    border-radius: 50%;
    line-height: normal;
    opacity: 1;
    background: ${neutrals[8]}
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='15' fill='none' viewBox='0 0 14 15'%3E%3Cpath fill-rule='evenodd' d='M.293 1.289a1 1 0 0 1 1.414 0L7 6.582l5.293-5.293a1 1 0 0 1 1.414 1.414L8.414 7.996l5.293 5.293a1 1 0 0 1-1.414 1.414L7 9.41l-5.293 5.293a1 1 0 0 1-1.414 0 1 1 0 0 1 0-1.414l5.293-5.293L.293 2.703a1 1 0 0 1 0-1.414z' fill='%2323262F'/%3E%3C/svg%3E")
        no-repeat 50% 50% / 14px;
    font-size: 0;
    transition: all 0.2s;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    z-index: 1;
    ${dark`
        border-color: ${neutrals[3]};
        background-color: ${neutrals[1]};
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23FCFCFD' d='M1.613.2l.094.083L5 3.585 8.293.293a1 1 0 0 1 1.414 0 1 1 0 0 1 .083 1.32l-.083.094L6.415 5l3.292 3.293a1 1 0 0 1-1.32 1.497l-.094-.083L5 6.415 1.707 9.707A1 1 0 0 1 .21 8.387l.083-.094L3.585 5 .293 1.707a1 1 0 0 1 0-1.414A1 1 0 0 1 1.613.21z'/%3E%3C/svg%3E");
    `}

    &:hover {
        border-color: ${neutrals[2]};

        ${dark`
            border-color: ${neutrals[8]};
        `}
    }
`;

export default dynamic(() => Promise.resolve(Modal), { ssr: false });
