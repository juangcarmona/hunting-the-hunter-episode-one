import Modal from "@/components/common/Modal";
import Spacer from "@/components/common/Spacer";
import Text from "@/components/common/Text";
import useConnect from "@/hooks/useConnect";
import { chainState } from "@/state/minting";
import { Chain } from "@/types/Chains";
import Image from "next/image";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

type ViewModalProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

const ModalComponent: React.FC<ViewModalProps> = ({ isOpen, setIsOpen }) => {
    const { isConnected, disconnectWallet, connectTo } = useConnect();
    const setChain = useSetRecoilState(chainState);

    const handleChooseWallet = async (chain: Chain) => {
        // await disconnectWallet();
        setChain(chain);
        setIsOpen(false);
        connectTo(chain);
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} zIndex={0}>
            <Spacer size={4} y />
            <Text variant="h5" textAlign="center">
                Choose how to connect your wallet
            </Text>
            <Spacer size={5} y />
            <div className="options">
                <Flex onClick={() => handleChooseWallet(Chain.ETHEREUM)}>
                    <div className="option">
                        <Image
                            src="/images/ethereum-eth-icon.webp"
                            alt="images"
                            width={20}
                            height={20}
                        />
                        <div className="text">Ethereum</div>
                    </div>
                </Flex>
                <Spacer size={2} y />
                <Flex onClick={() => handleChooseWallet(Chain.MATIC)}>
                    <div className="option">
                        <Image
                            src="/images/polygon-matic-icon.webp"
                            alt="images"
                            width={20}
                            height={20}
                        />
                        <div className="text">Polygon</div>
                    </div>
                </Flex>
                <Spacer size={2} y />
                <Flex onClick={() => handleChooseWallet(Chain.VECHAIN)}>
                    <div className="option">
                        <Image
                            src="/images/vechain-vet-logo.png"
                            alt="images"
                            width={20}
                            height={20}
                        />
                        <div className="text">VeChain</div>
                    </div>
                </Flex>
                <Spacer size={2} y />
            </div>
        </Modal>
    );
};
const Flex = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
    border: 2px solid white;
    border-radius: 10px;
    transition: border-color 0.7s ease;

    &:hover {
        border-color: rgb(49, 115, 248);
    }

    .option {
        display: flex;
        flex-direction: row;
        font-weight: bold;
        font-size: 19px;
        align-items: center;
        justify-content: center;
        height: 50px;

        .text {
            margin: 0 0 0 20px;
            width: 100px;
        }
    }
`;

export default ModalComponent;
