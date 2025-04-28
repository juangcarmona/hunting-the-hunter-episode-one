import { colors } from "@/styles/theme";
import { FC } from "react";
import styled, {
    css,
    FlattenSimpleInterpolation,
    useTheme,
} from "styled-components";

interface DividerProps {
    /** x = left-to-right divider. Default is top-to-bottom */
    x?: boolean;
    /** Border color */
    color?: keyof typeof colors;
    /** Width */
    width?: number;
}

const Divider: FC<React.PropsWithChildren<DividerProps>> = ({
    x = false,
    color = "muted",
    width = 1,
}) => {
    const theme = useTheme();

    const style = css`
        border-bottom: ${x ? 0 : `${width}px`} solid ${theme.colors[color]};
        border-right: ${!x ? 0 : `${width}px`} solid ${theme.colors[color]};
        display: ${!x ? "block" : "inline"};
    `;

    return <StyledDiv styl={style} />;
};

const StyledDiv = styled.div<{ styl: FlattenSimpleInterpolation }>`
    ${(props) => props.styl}
`;

export default Divider;
