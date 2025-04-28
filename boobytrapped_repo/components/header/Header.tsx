"use client";

import Image from "next/legacy/image";
import { useTheme } from "styled-components";
import Spacer from "../../components/common/Spacer";
import Box from "../common/Box";
import Divider from "../common/Divider";
import Flex from "../common/Flex";
import Link from "../common/Link";
import Text from "../common/Text";
import ThemeButton from "./ThemeButton";

const Header = () => {
    const theme = useTheme();
    return (
        <Box borderBottom={`1px solid ${theme.colors.muted}`}>
            <Flex
                height={81}
                justifyContent="space-between"
                px={{ _: 16, a: 24, m: 32, t: 40 }}
                alignItems="center"
            >
                <Flex width={900}>
                    <Link href="/" passHref>
                        <Flex alignItems="center">
                            <Image
                                src="/images/wov-logo.svg"
                                alt="World of V"
                                width={50.5}
                                height={50.5}
                            />

                            <Flex>
                                <Text
                                    display={{ _: "none", s: "block" }}
                                    fontSize={18}
                                    fontWeight="bold"
                                    color="text"
                                    as="span"
                                    ml={2}
                                    mr={4}
                                >
                                    World of V
                                </Text>
                                <Divider x />
                            </Flex>
                        </Flex>
                    </Link>

                    <Spacer size={3} />
                </Flex>
                <Flex justifyContent="flex-end">
                    <ThemeButton />
                    <Spacer size={3} />
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;
