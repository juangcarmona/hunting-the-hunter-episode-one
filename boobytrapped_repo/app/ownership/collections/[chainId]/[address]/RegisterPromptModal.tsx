import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import Modal from "@/components/common/Modal";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import Link from "next/link";
import React from "react";

type RegisterPromptModalProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

const RegisterPromptModal: React.FC<RegisterPromptModalProps> = ({
    isOpen,
    setIsOpen,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            zIndex={100}
            hasCloseButton={true}
        >
            <Spacer y size={30} />
            <Flex
                p={4}
                flexDirection="column"
                columnGap={3}
                alignItems="center"
            >
                <Spacer size={2} y />
                <Text variant="h5" textAlign="center">
                    Please register your profile first
                </Text>
                <Flex
                    columnGap={4}
                    justifyContent="center"
                    flexDirection="column"
                >
                    {/* <Text textAlign="center">
                        Please register your profile first
                    </Text> */}

                    <Link href="/ownership/settings">
                        <Button fullWidth>Go to Settings</Button>
                    </Link>

                    <Spacer size={2} y />
                </Flex>
            </Flex>
        </Modal>
    );
};
export default RegisterPromptModal;
