import NextLink from "next/link";
import { FC, Fragment, ReactElement } from "react";
import styled from "styled-components";
import Divider from "./Divider";
import Flex from "./Flex";
import Spacer from "./Spacer";
import Text from "./Text";

export interface PopupLinkItem {
    label?: string;
    Icon?: () => ReactElement;
    href?: string;
    passHref?: boolean;
    target?: any;
    Comp?: FC<React.PropsWithChildren<any>>;
    onClick?: () => void;
}

interface PopupLinkItemsProps {
    items: PopupLinkItem[];
}

const PopupLinkItems: FC<React.PropsWithChildren<PopupLinkItemsProps>> = ({
    items,
}) => (
    <Flex flexDirection="column" bg="highlight" px={3} borderRadius={3}>
        {items.map(
            ({ label, Icon, href, passHref, target, Comp, onClick }, index) => {
                const Wrapper = href
                    ? (p: any) => <NextLink {...p} />
                    : (p: any) => <div {...p} />;

                const props = { onClick, href, passHref, target };

                return (
                    <Fragment key={index}>
                        <Wrapper {...props}>
                            <StyledFlex py={3}>
                                {Icon && (
                                    <>
                                        <Icon />
                                        <Spacer size={2} />
                                    </>
                                )}
                                {label && (
                                    <Text
                                        variant="h3"
                                        fontSize={3}
                                        style={{ flexGrow: 1 }}
                                    >
                                        {label}
                                    </Text>
                                )}
                                {Comp && <Comp />}
                            </StyledFlex>
                        </Wrapper>
                        {index != items.length - 1 && <Divider />}
                    </Fragment>
                );
            },
        )}
    </Flex>
);

const StyledFlex = styled(Flex)`
    color: ${({ theme }) => theme.colors.accent};
    cursor: pointer;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

export default PopupLinkItems;
