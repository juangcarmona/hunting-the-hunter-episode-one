import { theme } from "@/styles/theme";
import React from "react";
import Flex from "../common/Flex";
import Text from "../common/Text";
import { Attribute } from "./ChipBound";

interface AttributeListProps {
    attributes: Attribute[];
    displayInModal?: boolean;
}

const AttributeList: React.FC<AttributeListProps> = ({
    attributes,
    displayInModal = false,
}) => {
    return (
        <Flex
            flexWrap="wrap"
            mb={35}
            mt={!displayInModal ? { _: 10, m: 29 } : 10}
        >
            {attributes.map((attribute) => (
                <Flex
                    key={attribute.trait_type}
                    alignItems="stretch"
                    width={!displayInModal ? { _: "100%", m: "48%" } : "100%"}
                    mb={!displayInModal ? { _: 0, m: 10 } : 0}
                    rowGap={3}
                >
                    <Text
                        color={theme.colors.grayLight400}
                        className="work-sans-fontFamily"
                        width="30%"
                        fontSize={!displayInModal ? { _: 12, m: 16 } : 12}
                        lineHeight={"21px"}
                        style={{
                            overflowWrap: "break-word",
                        }}
                    >
                        {attribute.trait_type === "Creationdate"
                            ? "Creation Date"
                            : attribute.trait_type}
                        {""}:
                    </Text>
                    <Text
                        width="70%"
                        fontSize={!displayInModal ? { _: 12, m: 16 } : 12}
                        className="work-sans-fontFamily"
                        color={theme.colors.blackLight20}
                        lineHeight={"21px"}
                    >
                        {attribute.value}
                    </Text>
                </Flex>
            ))}
        </Flex>
    );
};

export default AttributeList;
