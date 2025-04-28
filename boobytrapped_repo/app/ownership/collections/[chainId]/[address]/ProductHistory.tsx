import HistoryLogo from "@/assets/history.png";
import Box from "@/components/common/Box";
import CircleButton from "@/components/common/CircleButton";
import Divider from "@/components/common/Divider";
import Flex from "@/components/common/Flex";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import { Tooltip } from "@/components/common/Tooltip";
import { ArrowDownIcon } from "@/components/templates_form/SelectedTemplatePreview";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { IoIosArrowForward } from "react-icons/io";
import styled from "styled-components";
interface ProductHistoryProps {
    histories: Record<string, any>[];
    displayInModal?: boolean;
}

const ProductHistory: React.FC<ProductHistoryProps> = ({
    histories,
    displayInModal = false,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const getCurrentDimension = () => {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    };
    const [isBiggerThenScreen, setIsBigggerThenScreen] = useState(false);
    const [screenSize, setScreenSize] = useState(getCurrentDimension());
    const [historyExtended, setHistoryExtended] = useState(false);
    const [historyShow, setHistoryShow] = useState(true);

    const historiesFiltered = useMemo(() => {
        if (screenSize.width < 767 && !historyExtended) {
            return histories.slice(0, 3);
        }
        return histories;
    }, [screenSize, historyExtended]);

    useEffect(() => {
        const updateDimension = () => {
            setScreenSize(getCurrentDimension());
        };
        window.addEventListener("resize", updateDimension);
        return () => {
            window.removeEventListener("resize", updateDimension);
        };
    }, [screenSize]);
    useEffect(() => {
        if (
            ref.current?.scrollWidth &&
            ref.current?.scrollWidth > screenSize.width
        ) {
            setIsBigggerThenScreen(true);
        } else {
            setIsBigggerThenScreen(false);
        }
    }, [ref.current, screenSize]);

    return (
        <Box>
            <Divider />
            <Spacer y size={4} />
            {isBiggerThenScreen &&
                screenSize.width > 767 &&
                !displayInModal && (
                    <Flex
                        position="absolute"
                        right={0}
                        top={60}
                        style={{
                            background:
                                "linear-gradient(90deg, rgba(255,255,255,0) , rgba(255,255,255,0.8785714969581583) , rgba(255,255,255,1) )",
                            zIndex: 1,
                        }}
                        width={30}
                        height={90}
                        justifyContent="end"
                        alignItems="center"
                    >
                        <IoIosArrowForward color="blue" size={25} />
                    </Flex>
                )}
            <Flex rowGap={3} alignItems="center" mb={4}>
                <Image alt="Logo" src={HistoryLogo} width={24} height={32} />
                <Text
                    ml={2}
                    fontSize={!displayInModal ? { _: 12, m: 28 } : 12}
                    lineHeight={1.2}
                    fontWeight={600}
                >
                    History
                </Text>
                <CircleButton
                    smaller
                    outline
                    style={{
                        marginLeft: "auto",
                        marginRight: "0",
                    }}
                    onClick={() => setHistoryShow((prevState) => !prevState)}
                >
                    <ArrowDownIcon open={historyShow} />
                </CircleButton>
            </Flex>
            {historyShow && (
                <Flex
                    height={!displayInModal ? { _: "unset", m: 150 } : "unset"}
                    flexDirection={
                        !displayInModal ? { _: "column", m: "row" } : "column"
                    }
                    pb="30px"
                >
                    {historiesFiltered?.map((historyElement, idx) => (
                        <Flex
                            key={idx}
                            mt={3}
                            width={
                                !displayInModal
                                    ? { _: "100%", m: "200" }
                                    : "100%"
                            }
                            minWidth={200}
                            flexDirection={
                                !displayInModal
                                    ? { _: "row", m: "column" }
                                    : "row"
                            }
                            position="relative"
                        >
                            <Flex
                                alignItems="center"
                                rowGap={!displayInModal ? { _: 0, m: 3 } : 0}
                                columnGap={!displayInModal ? { _: 2, m: 0 } : 2}
                                flexDirection={
                                    !displayInModal
                                        ? { _: "column", m: "row" }
                                        : "column"
                                }
                            >
                                <GoDotFill />
                                <Box
                                    borderTop={
                                        !displayInModal
                                            ? {
                                                  _: "none",
                                                  m: `1px solid ${theme.colors.accent}`,
                                              }
                                            : "none"
                                    }
                                    width={
                                        !displayInModal ? { _: 0, m: "75%" } : 0
                                    }
                                    height={
                                        !displayInModal ? { _: 60, m: 0 } : 60
                                    }
                                    borderLeft={
                                        !displayInModal
                                            ? {
                                                  _: `1px solid ${theme.colors.accent}`,
                                                  m: "none",
                                              }
                                            : `1px solid ${theme.colors.accent}`
                                    }
                                />
                            </Flex>
                            <Spacer
                                y={
                                    screenSize.width > 767 && !displayInModal
                                        ? true
                                        : false
                                }
                                size={
                                    screenSize.width > 767 && !displayInModal
                                        ? 3
                                        : 2
                                }
                            />
                            <Flex
                                rowGap={5}
                                mt={!displayInModal ? { _: 0, m: 0 } : 0}
                            >
                                <Box flexGrow={1}>
                                    <Text color={theme.colors.accent}>
                                        {new Date(
                                            historyElement.date,
                                        ).toDateString()}
                                    </Text>
                                    <Text
                                        variant="captionBold3"
                                        whiteSpace="nowrap"
                                    >
                                        {historyElement.name.toUpperCase()}
                                    </Text>
                                </Box>

                                {historyElement.description && (
                                    <Box>
                                        <Tooltip
                                            content={historyElement.description}
                                        >
                                            <Box
                                                position="absolute"
                                                right={
                                                    !displayInModal
                                                        ? { _: 0, m: "unset" }
                                                        : 0
                                                }
                                            >
                                                <AiOutlineInfoCircle
                                                    color={theme.colors.accent}
                                                    size={25}
                                                />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                )}
                            </Flex>
                            <Spacer y size={2} />
                            {screenSize.width > 767 && !displayInModal && (
                                <Text variant="captionBold2">
                                    {historyElement.companyName} -{" "}
                                    {historyElement.city}
                                </Text>
                            )}
                            {screenSize.width > 767 && displayInModal && (
                                <Box position="absolute" bottom={2} left={4}>
                                    <Text variant="captionBold2">
                                        {historyElement.companyName} -{" "}
                                        {historyElement.city}
                                    </Text>
                                </Box>
                            )}

                            {screenSize.width < 767 && (
                                <Box position="absolute" bottom={2} left={4}>
                                    <Text variant="captionBold2">
                                        {historyElement.companyName} -{" "}
                                        {historyElement.city}
                                    </Text>
                                </Box>
                            )}
                        </Flex>
                    ))}
                    {screenSize.width < 767 && histories.length > 3 && (
                        <Flex
                            alignItems="center"
                            justifyContent="center"
                            style={{ cursor: "pointer" }}
                            height={20}
                            rowGap={1}
                        >
                            <Text
                                mt={10}
                                onClick={() =>
                                    setHistoryExtended(!historyExtended)
                                }
                                color="text"
                                fontSize={12}
                            >
                                {historyExtended ? "Show Less" : "Show More"}
                            </Text>

                            {historyExtended ? (
                                <FaAngleUp
                                    color={theme.colors.text}
                                    style={{ marginTop: "12px" }}
                                />
                            ) : (
                                <FaAngleDown
                                    color={theme.colors.text}
                                    style={{ marginTop: "12px" }}
                                />
                            )}
                        </Flex>
                    )}
                </Flex>
            )}
        </Box>
    );
};

interface StyledDivProps {
    displayInModal?: boolean;
}

const StyledDiv = styled.div<StyledDivProps>`
    overflow: ${(props) => (props.displayInModal ? "hidden" : "scroll")};
`;

export default ProductHistory;
