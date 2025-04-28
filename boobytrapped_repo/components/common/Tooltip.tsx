import { colors } from "@/styles/theme";
import Tippy, { TippyProps } from "@tippyjs/react";
import styled from "styled-components";

interface TooltipCustomProps {
    bg?: keyof typeof colors;
    color?: keyof typeof colors;
    borderColor?: keyof typeof colors;
    width?: number;
}

const StyledTippy = styled(Tippy)<TooltipCustomProps>`
    background: ${({ theme, bg = "background" }) => theme.colors[bg]};
    min-width: ${({ width }) => (width != null ? `${width}px` : "auto")};
    border-radius: ${({ theme }) => theme.radii[5]}px;
    border: ${({ theme, borderColor = "muted" }) =>
        `1px solid ${theme.colors[borderColor]}`};
    font-family: ${({ theme }) => theme.fonts.DM_Sans};
    font-size: 15px;

    & > .tippy-content {
        color: ${({ theme, color = "text" }) => theme.colors[color]};
        padding: ${({ theme }) => `${theme.space[2]}px ${theme.space[3]}px`};
    }

    & > .tippy-arrow {
        color: ${({ theme }) => theme.colors.transparent};
    }

    &[data-placement^="bottom"] {
        &.tippy-tooltip {
            transform-origin: center top;
        }
        &.tippy-arrow {
            border-bottom-color: ${({ theme, borderColor = "muted" }) =>
                theme.colors[borderColor]};
        }
    }
`;

export interface TooltipProps
    extends TooltipCustomProps,
        Omit<TippyProps, "theme"> {}

export const Tooltip = (props: TooltipProps) => {
    const { placement = "top", ...restProps } = props;

    return (
        <StyledTippy
            {...restProps}
            trigger="mouseenter focus click"
            placement={placement}
        />
    );
};
