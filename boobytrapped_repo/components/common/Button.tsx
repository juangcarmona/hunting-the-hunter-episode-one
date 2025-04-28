import clsx from "clsx";
import styled, { css } from "styled-components";
import Loader from "./Loader";
import WhiteLoader from "./WhiteLoader";

interface ButtonProps {
    small?: boolean;
    outline?: boolean;
    image?: boolean;
    error?: boolean;
    warning?: boolean;
    impact?: boolean;
    loader?: boolean;
    fullWidth?: boolean;
    black?: boolean;
    yellow?: boolean;
    mintButton?: boolean;
    gray?: boolean;
}

export const Button_Style1 = css`
    font-family: ${({ theme }) => theme.fonts.DM_Sans};
    font-size: 16px;
    line-height: 1;
    font-weight: 700;
`;

export const Button_Style2 = css`
    font-family: ${({ theme }) => theme.fonts.DM_Sans};
    font-size: 14px;
    line-height: ${16 / 14};
    font-weight: 700;
`;

export const ButtonOutline = css`
    background: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.muted} inset;
    color: ${({ theme }) => theme.colors.accent};

    .icon {
        color: ${({ theme }) => theme.colors.accent};
        transition: color 0.2s;
    }

    &:hover {
        background: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary} inset;
        color: ${({ theme }) => theme.colors.white};

        .icon {
            color: ${({ theme }) => theme.colors.white};
        }
    }
`;

export const ButtonImage = css`
    background: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.muted} inset;
    color: ${({ theme }) => theme.colors.accent};

    height: 60px;
    border-radius: 50px;

    .icon {
        color: ${({ theme }) => theme.colors.accent};
        transition: color 0.2s;
    }

    &:hover {
        background: none;
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary} inset;
    }
`;

const ButtonSmall = css`
    height: 36px;
    border-radius: 16px;
    padding: 0 8px;
    font-size: 11px;

    @media screen and (min-width: ${({ theme }) => theme.breakpoints.t}) {
        height: 40px;
        border-radius: 20px;
        padding: 0 16px;
        font-size: 14px;
    }
`;

const Button = styled.button.attrs<ButtonProps>(
    ({
        type,
        small,
        outline,
        image,
        error,
        warning,
        impact,
        black,
        yellow,
        loader,
        fullWidth,
        children,
        mintButton,
        gray,
    }) => ({
        type: type || "button",
        className: clsx({
            small,
            outline,
            image,
            error,
            warning,
            impact,
            black,
            yellow,
            gray,
            loader,
            fullWidth,
        }),
        children: loader ? mintButton ? <WhiteLoader /> : <Loader /> : children,
    }),
)<ButtonProps>`
    appearance: none !important;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    padding: 0 24px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 24px;
    ${Button_Style1};
    text-align: center;
    color: ${({ theme }) => theme.colors.white};
    transition: all 0.2s;

    &:hover {
        background: ${({ theme }) => theme.colors.primaryDark10};
    }

    &:disabled,
    &.disabled,
    &.loader {
        opacity: 0.5;
        pointer-events: none;
    }

    &.done {
        background: ${({ theme }) => theme.colors.neutral};
    }

    &.loader {
        ${Loader} {
            margin: -4px;
        }
    }

    &.fullWidth {
        width: 100%;
    }

    &.small {
        ${ButtonSmall};
    }

    &.outline {
        ${ButtonOutline}
    }

    &.image {
        ${ButtonImage}
    }

    &.error {
        background: none !important;
        color: ${({ theme }) => theme.colors.error} !important;
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.error} inset !important;

        &:hover {
            color: ${({ theme }) => theme.colors.white} !important;
            background-color: ${({ theme }) => theme.colors.error} !important;
        }
    }

    &.warning {
        background: none !important;
        color: ${({ theme }) => theme.colors.warningDark15} !important;
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.warningDark15} inset !important;

        &:hover {
            color: ${({ theme }) => theme.colors.white} !important;
            background-color: ${({ theme }) =>
                theme.colors.warningDark15} !important;
        }
    }

    &.impact {
        background: ${({ theme }) => theme.colors.text} !important;
        color: ${({ theme }) => theme.colors.background} !important;
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.text} inset !important;
    }
    &.black {
        background: ${({ theme }) => theme.colors.black} !important;
        color: ${({ theme }) => theme.colors.white} !important;
        &:hover {
            background-color: ${({ theme }) =>
                theme.colors.blackLight20} !important;
        }
    }

    &.yellow {
        background: #f5aa0c !important;
        color: ${({ theme }) => theme.colors.white} !important;
        &:hover {
            background-color: ${({ theme }) => theme.colors.primary} !important;
        }
    }

    &.gray {
        background: ${({ theme }) => theme.colors.accent} !important;
        color: ${({ theme }) => theme.colors.white} !important;
        &:hover {
            background-color: ${({ theme }) => theme.colors.primary} !important;
        }
    }

    .icon {
        color: ${({ theme }) => theme.colors.white};

        &:first-child {
            margin-right: 15px;
        }

        &:last-child {
            margin-left: 15px;
        }
    }
`;

export default Button;
