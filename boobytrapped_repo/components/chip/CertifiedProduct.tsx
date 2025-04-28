import { Chain } from "@/types/Chains";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { IoIosArrowForward } from "react-icons/io";
import ConditionalWrapper from "../ConditionalWrapper";
import Box from "../common/Box";
import Flex from "../common/Flex";
import Spacer from "../common/Spacer";
import Text from "../common/Text";

const CertifiedProduct: React.FC<{
    verificationLabel?: string;
    mintTxId?: string | null;
    chain?: Chain;
}> = ({ verificationLabel, mintTxId, chain }) => {
    const url = useMemo(() => {
        if (mintTxId) {
            switch (chain) {
                case Chain.VECHAIN:
                    return `https://vechainstats.com/transaction/${mintTxId}`;
                case Chain.ETHEREUM:
                    return `https://etherscan.io/tx/${mintTxId}`;
                case Chain.MATIC:
                    return `https://polygonscan.com/tx/${mintTxId}`;
                default:
                    return "";
            }
        }
        return null;
    }, [chain, mintTxId]);

    if (!verificationLabel) return null;
    return (
        <Box
            border="1px solid"
            borderColor="muted"
            borderRadius={2}
            px={2}
            mb={{ _: "35px", m: "25px" }}
            py={2}
            mt={"0px !important"}
        >
            <ConditionalWrapper
                isRendered={!!url}
                wrapper={(children) => (
                    <Link href={url!} target="_blank">
                        {children}
                    </Link>
                )}
            >
                <Flex alignItems="center" justifyContent="center">
                    <Flex alignItems="center">
                        <Box width={25} height={25} position="relative">
                            <Image
                                src={"/images/verify_9918694.png"}
                                alt={"WOV logo"}
                                fill
                            />
                        </Box>
                        <Spacer size={3} />
                        <Text fontSize={12} fontWeight={600}>
                            {verificationLabel}
                        </Text>
                        <Spacer size={3} />
                        <IoIosArrowForward size={18} />
                    </Flex>
                </Flex>
            </ConditionalWrapper>
        </Box>
    );
};

export default CertifiedProduct;
