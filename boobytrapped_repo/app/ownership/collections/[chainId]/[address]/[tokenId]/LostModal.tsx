import Modal from "@/components/common/Modal";
import { MdEmail, MdPhone } from "react-icons/md";
import { PiWarningOctagonLight } from "react-icons/pi";
import { VscQuestion } from "react-icons/vsc";
import styled from "styled-components";

interface LostModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    receiveReport: any;
}

const LostModal: React.FC<LostModalProps> = ({
    isOpen,
    setIsOpen,
    receiveReport,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            zIndex={1000}
            hasCloseButton={true}
        >
            {receiveReport?.campaignType === "LOST" ? (
                <Header>
                    <div className="img-wrapper">
                        <VscQuestion color="yellow" size="40px" />
                    </div>
                    <div className="text">Lost</div>
                </Header>
            ) : (
                <Header>
                    <div className="img-wrapper">
                        <PiWarningOctagonLight color="red" size="40px" />
                    </div>
                    <div className="stolen-text">Stolen</div>
                </Header>
            )}
            <Main>
                <div className="text">
                    {receiveReport?.campaignData?.campaignDescription}
                </div>
                <div className="link">
                    <div className="img-wrapper">
                        <MdEmail size={30} />
                    </div>
                    <a href="" className="text">
                        {receiveReport?.campaignData?.contact}
                    </a>
                </div>
                {receiveReport?.campaignData?.contact1 && (
                    <div className="link">
                        <div className="img-wrapper">
                            <MdPhone size={30} />
                        </div>
                        <a href="" className="text">
                            {receiveReport?.campaignData?.contact1}
                        </a>
                    </div>
                )}
            </Main>
        </Modal>
    );
};

const Header = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px 0 0 0;
    .image-wrapper {
        width: 20px;
        height: 20px;
    }
    .text,
    .stolen-text {
        line-height: 1.71429;
        white-space: normal;
        word-break: normal;
        text-overflow: clip;
        overflow: visible;
        font-weight: 700;
        font-size: 20px;
        display: inline;
        color: rgb(255, 199, 0);
    }

    .stolen-text {
        color: red;
    }
`;

const Main = styled.div`
    .text {
        font-size: 14px;
        line-height: 1.71429;
        white-space: normal;
        word-break: normal;
        text-overflow: clip;
        overflow: visible;
        text-align: center;
        margin: 8px 0 16px 10px;
    }
    .link {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 0 0 20px 0;

        .img-wrapper {
            width: 30px;
            height: 30px;
        }

        .text {
            margin: 0 0 0 16px;
        }
    }
`;

const Accept = styled.div`
    display: flex;
    flex-direction: row;
    padding: 15px;
    width: 100%;
    justify-content: center;
    margin: 0 0 20px 0;

    .accept,
    .cancel {
        padding: 10px;
        width: 100px;
        height: 100%;
        background-color: #044eff;
        border-radius: 30px;
        font-size: 18px;
        color: white;
    }

    .cancel {
        margin: 0 0 0 20px;
    }
`;

export default LostModal;
