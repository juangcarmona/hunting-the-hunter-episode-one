import { useWalletModal } from "@vechain/dapp-kit-react";
import Image from "next/image";
import Button from "./common/Button";
import Flex from "./common/Flex";
import Text from "./common/Text";

interface VechainConnectProps {
    setIsClaiming?: (bool: boolean) => void;
}

const VechainConnect: React.FC<VechainConnectProps> = ({ setIsClaiming }) => {
    const { open } = useWalletModal();

    return (
        <Button
            fullWidth
            onClick={() => {
                open();
                if (setIsClaiming) setIsClaiming(true);
            }}
        >
            <Flex justifyContent="center" rowGap={2} alignItems="center" px={3}>
                <Image
                    src="/images/wallet.png"
                    alt="wallet"
                    width={24}
                    height={24}
                />
                <Text>Wallet</Text>
            </Flex>
        </Button>
    );
};

export default VechainConnect;
