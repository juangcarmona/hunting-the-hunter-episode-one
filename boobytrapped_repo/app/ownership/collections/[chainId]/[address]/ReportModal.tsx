import animationSuccess from "@/assets/lottie/success-animation.json";
import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import Modal from "@/components/common/Modal";
import Spacer from "@/components/common/Spacer";
import { deleteReportedData } from "@/helpers/deleteReportedData";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

interface TransferModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    accessToken: string;
    chipId: string;
    campaign: any;
    onReload?: (chipId: string) => void;
}

const ReportModal: React.FC<TransferModalProps> = ({
    isOpen,
    setIsOpen,
    campaign,
    chipId,
    accessToken,
    onReload,
}) => {
    const [status, setStatus] = useState<boolean>(false);

    const onSubmit = async () => {
        await sendRequest();
    };

    const sendRequest = async () => {
        const campaignId = campaign?.id;

        try {
            if (campaignId) {
                const result = await deleteReportedData(
                    campaignId,
                    accessToken,
                    chipId,
                );
                setStatus(true);
                toast.success("Ended the campaign");
                // loadData(chipId);
                onReload?.(chipId);
                return true;
            }
        } catch (ex) {
            toast.error("Can not find the campaign");
        }
    };

    useEffect(() => {
        if (isOpen === false) {
            setStatus(false);
        }
    }, [isOpen]);
    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            zIndex={1000}
            hasCloseButton={status === true ? true : false}
        >
            {status === false && (
                <>
                    <Header>
                        {/* <BsQuestionCircle size="40" /> */}

                        <Spacer y size={3} />
                        <div className="text">
                            Are you sure you want to remove the{" "}
                            {campaign?.campaignType === "LOST"
                                ? "Lost"
                                : campaign?.campaignType === "STOLE" &&
                                  "Stolen"}{" "}
                            label from this item?
                        </div>
                        <Spacer y size={3} />
                    </Header>
                    <Accept>
                        <Flex
                            flexDirection="row"
                            justifyContent="space-evenly"
                            style={{ width: "100%" }}
                        >
                            <Button
                                outline
                                style={{ width: "100%" }}
                                onClick={() => {
                                    setIsOpen(false), setStatus(false);
                                }}
                            >
                                No
                            </Button>
                            <Spacer size={3} />
                            <Button
                                outline
                                style={{ width: "100%" }}
                                onClick={() => onSubmit()}
                            >
                                Yes
                            </Button>
                        </Flex>
                    </Accept>
                </>
            )}
            {status === true && (
                <>
                    <Header>
                        <Lottie
                            animationData={animationSuccess}
                            loop={false}
                            style={{ width: 150, height: 150 }}
                        />
                        <Spacer y size={3} />
                        <div className="text">
                            The label has now removed from this item.
                        </div>
                        <Spacer y size={5} />
                    </Header>
                </>
            )}
        </Modal>
    );
};

const Header = styled.div`
    display: flex;
    padding: 0 50px;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px 0 0 0;
    .image-wrapper {
        width: 20px;
        height: 20px;
    }

    @media (max-width: 600px) {
        margin: 250px 0 0 0;
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
    }

    .text {
        @media (max-width: 600px) {
            text-align: center;
        }
    }

    .stolen-text {
        color: red;
    }
`;

const Main = styled.div`
    padding: 0 20px;
    .text {
        font-size: 14px;
        line-height: 1.71429;
        white-space: normal;
        word-break: normal;
        text-overflow: clip;
        overflow: visible;
        margin: 8px 0 16px 10px;
        text-align: center;
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

export default ReportModal;
