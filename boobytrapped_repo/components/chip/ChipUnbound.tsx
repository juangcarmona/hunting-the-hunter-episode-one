import { theme } from "@/styles/theme";
import { useParams } from "next/navigation";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import styled from "styled-components";
import Button from "../common/Button";
import Flex from "../common/Flex";
import Link from "../common/Link";
import Modal from "../common/Modal";
import Text from "../common/Text";

interface ChipUnboundProps {
    error?: string;
    serial?: string;
}

const ChipUnbound: React.FC<ChipUnboundProps> = ({ error, serial }) => {
    const params = useParams();
    const handleClick = async () => {
        try {
            await navigator.clipboard.writeText(
                (params.hash ?? serial) as string,
            );
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <ChipUnboundContent>
            <video
                src={
                    error === "Chip authentication failed"
                        ? "https://arweave.net/OQMS189xOsAajgx1rNIH5S5_JPGL2_H613huaSPQjRk"
                        : "https://arweave.net/SsoWIQBgBLvGol8jMn_0C6HzNoaUWJmIUBxUZ92ujrs"
                }
                autoPlay
                loop
                muted
                playsInline
                width={"100%"}
                style={
                    error === "Chip authentication failed"
                        ? {
                              maxHeight: "100%",
                              maxWidth: "100%",
                          }
                        : {
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              minWidth: "100%",
                              minHeight: "100%",
                              width: "auto",
                              height: "auto",
                              transform: "translate(-50%,-50%)",
                          }
                }
            />
            <Modal
                isOpen={error !== "Chip authentication failed"}
                setIsOpen={() => null}
            >
                <Text
                    fontSize={96}
                    color={!error ? "#40c057" : "#ff6b6b"}
                    textAlign={"center"}
                    marginTop={{ _: "-16px", a: "0px" }}
                >
                    {!error ? <BsCheckCircle /> : <BsXCircle />}
                </Text>
                <Text
                    textAlign="center"
                    fontSize={32}
                    fontWeight={700}
                    lineHeight={1.25}
                    marginBottom={5}
                    color={theme.colors.accent}
                >
                    {error ? <span>{error}</span> : "Chip Available"}
                </Text>
                <Text
                    textAlign="center"
                    pb={5}
                    width={"100%"}
                    wordBreak="break-word"
                    lineHeight={"18px"}
                    color={theme.colors.accent}
                    fontSize={15}
                >
                    {params.hash ?? serial}
                </Text>
                <Flex justifyContent="center">
                    <Button onClick={handleClick} disabled={!!error}>
                        <Link
                            href={`https://worldofv.art/phygital-get-started?nfc_chip=${params.hash}`}
                        >
                            Copy serial and create
                        </Link>
                    </Button>
                </Flex>
            </Modal>
        </ChipUnboundContent>
    );
};

const ChipUnboundContent = styled.div`
    background: black;
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
`;

export default ChipUnbound;
