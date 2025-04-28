import Button from "@/components/common/Button";
import Flex from "@/components/common/Flex";
import Modal from "@/components/common/Modal";
import Spacer from "@/components/common/Spacer";
import { createReportData } from "@/helpers/createReportData";
import { CampaignType } from "@/services/CampaignsService";
import { accessTokenState } from "@/state/accessToken";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import styled from "styled-components";

interface TransferModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    address: string;
    tokenId: string;
    chainId: number;
    label: string;
    currentUser: any;
    chipId: string;
    onReload?: (chipId: string) => void;
}

const LostModal: React.FC<TransferModalProps> = ({
    isOpen,
    setIsOpen,
    address: contractAddress,
    tokenId,
    chainId,
    label,
    currentUser,
    chipId,
    onReload,
}) => {
    const [status, setStatus] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [accessToken, setAccesToken] = useRecoilState(accessTokenState);

    const onSubmit = async () => {
        await sendRequest();
    };

    const sendRequest = async () => {
        const type = CampaignType.LOST;
        const result = await createReportData(
            label,
            currentUser,
            accessToken,
            type,
            contractAddress,
            tokenId,
            chainId,
            chipId,
        );
        if (result) {
            setEmail(result?.campaignData?.contact);
            setPhone(result?.campaignData?.contact1);
            setStatus(true);
            setDescription(result?.campaignData?.campaignDescription);
            toast.success("Successfully Saved!");
            onReload?.(chipId);
            // setTimeout(() => window.location.reload(), 5000);
            return true;
        } else {
            setStatus(false);
            toast.error("Something went wrong!");
            return false;
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
                        <div className="img-wrapper">
                            <Image
                                src="/images/campaigns/lost.svg"
                                width={50}
                                height={50}
                                alt={""}
                            />
                        </div>
                        <Spacer y size={3} />
                        <div className="text">
                            Would you like to report it as lost?
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
                        <Image
                            src="/images/campaigns/lost.svg"
                            width={50}
                            height={50}
                            alt={""}
                        />
                        <Spacer y size={3} />
                        <div className="text">
                            Your item has been reported as lost.
                        </div>
                        <Spacer y size={2} />
                        The &quot;Lost&quot; label will be displayed in your
                        Digital Passport
                        <Spacer y size={5} />
                    </Header>
                </>
            )}
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

export default LostModal;
