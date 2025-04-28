import defaultValueIcon from "@/assets/default-value-icon.svg";
import ValueLogo from "@/assets/values.svg";
import Box from "@/components/common/Box";
import CircleButton from "@/components/common/CircleButton";
import Divider from "@/components/common/Divider";
import Flex from "@/components/common/Flex";
import Modal from "@/components/common/Modal";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import { ArrowDownIcon } from "@/components/templates_form/SelectedTemplatePreview";
import { theme } from "@/styles/theme";
import { useMediaQuery } from "@react-hook/media-query";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import useSWR from "swr";

interface ProductValuesProps {
    values: any;
    displayInModal?: boolean;
}

const ProductValues: React.FC<ProductValuesProps> = ({
    values,
    displayInModal = false,
}) => {
    const { data } = useSWR(
        `${process.env.NEXT_PUBLIC_BE_URL}/templates/values-types` as string,
        async (url) => await axios.get(url),
    );
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.m}`);
    const valuesTypes: Record<string, string> = {};
    data?.data?.forEach((type: Record<string, string>) => {
        valuesTypes[type.name] = type.iconUrl;
    });
    const [showValues, setShowValues] = useState(true);
    const [valueModalUrl, setValueModalUrl] = useState<string | null>(null);

    // Function to handle opening modal with URL
    const handleOpenModal = (url: string) => {
        setValueModalUrl(url);
    };

    // Function to handle closing modal
    const handleCloseModal = () => {
        setValueModalUrl(null);
    };

    return (
        <Box>
            <Divider />
            <Spacer y size={4} />
            <Flex rowGap={3} alignItems="center" mb={4}>
                <Image alt="Logo" src={ValueLogo} width={24} height={32} />
                <Text
                    ml={2}
                    fontSize={!displayInModal ? { _: 12, m: 28 } : 12}
                    lineHeight={1.2}
                    fontWeight={600}
                >
                    Values
                </Text>
                <CircleButton
                    smaller
                    outline
                    style={{
                        marginLeft: "auto",
                        marginRight: "0",
                    }}
                    onClick={() => setShowValues((prevState) => !prevState)}
                >
                    <ArrowDownIcon open={showValues} />
                </CircleButton>
            </Flex>
            {showValues && (
                <Flex flexWrap="wrap" pb="30px">
                    {values.map((value: any, idx: number) => (
                        <Flex
                            key={idx}
                            px={3}
                            py={1}
                            border={`1px solid ${theme.colors.accent}`}
                            borderRadius={30}
                            alignItems="center"
                            rowGap={2}
                            mr={2}
                            mt={2}
                            onClick={() => {
                                value.url || value.mediaUrl
                                    ? !isMobile
                                        ? handleOpenModal(
                                              value.url || value.mediaUrl,
                                          )
                                        : (window.location.href =
                                              value.url || value.mediaUrl)
                                    : null;
                            }}
                            style={{
                                cursor:
                                    value.url || value.mediaUrl
                                        ? "pointer"
                                        : "default",
                            }}
                        >
                            <Image
                                alt="Logo"
                                src={
                                    valuesTypes[value.name] || defaultValueIcon
                                }
                                width={20}
                                height={20}
                            />
                            <Text variant="caption1" whiteSpace="nowrap">
                                {value.name}
                            </Text>
                            {(value.url || value.mediaUrl) && (
                                <>
                                    {" "}
                                    <FaAngleRight
                                        style={{
                                            marginBottom: 1,
                                        }}
                                        size={17}
                                        color={theme.colors.accent}
                                    />
                                </>
                            )}
                        </Flex>
                    ))}
                </Flex>
            )}
            {valueModalUrl && (
                <Modal
                    hasCloseButton
                    isOpen={true}
                    setIsOpen={handleCloseModal}
                    contentPadding={"0%"}
                >
                    <iframe
                        src={valueModalUrl}
                        height="1000"
                        width="100%"
                    ></iframe>
                </Modal>
            )}
        </Box>
    );
};

export default ProductValues;
