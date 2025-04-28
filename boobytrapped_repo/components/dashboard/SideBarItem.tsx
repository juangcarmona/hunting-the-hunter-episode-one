import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import Flex from "../common/Flex";
import Spacer from "../common/Spacer";

export class SideBarItemProps {
    icon: string;
    route: string;
    level?: number;
    onClick?: any;
    canBeClicked?: boolean;
    externalWindow?: boolean;
}

const SideBarItem: React.FC<React.PropsWithChildren<SideBarItemProps>> = ({
    children,
    icon,
    route = "#",
    level = 0,
    onClick,
    canBeClicked = true,
    externalWindow = false,
}) => {
    const pathname = usePathname();

    return (
        <Link
            href={route}
            onClick={onClick}
            target={externalWindow === true ? "_blank" : "_self"}
        >
            <ItemContainer
                alignItems={"center"}
                rowGap={2}
                enabled={canBeClicked && pathname === route}
            >
                {level > 0 && <Spacer size={level} />}
                {/* <Icon icon={icon} /> */}
                <img
                    src={`/images/sidebar/${icon}.svg`}
                    width={20}
                    height={20}
                />
                <span>{children}</span>
            </ItemContainer>
        </Link>
    );
};

const ItemContainer = styled(Flex)<{ enabled?: boolean }>`
    cursor: pointer;

    font-size: ${({ theme }) => theme.fontSizes[4]}px;
    padding: 8px 16px;

    background-color: ${(props) =>
        props.enabled ? "rgba(93, 135, 255, 0.08)" : "transparent"};

    border-radius: 10px;
`;

export default SideBarItem;
