import QRCode from "react-qr-code";
import Spacer from "../common/Spacer";

interface ChipQRProps {
    qrCode: string;
    size: number;
    showDownloadIcon?: boolean;
}

export const downloadQR = (qrCode: string) => {
    alert(qrCode);
};

const ChipQR = ({ qrCode, size, showDownloadIcon }: ChipQRProps) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
            }}
        >
            <QRCode value={qrCode} size={256} />

            {showDownloadIcon && (
                <>
                    <Spacer size={2} />

                    <img
                        alt="download"
                        src={"/images/download.svg"}
                        width={24}
                        height={24}
                    />
                </>
            )}
        </div>
    );
};

export default ChipQR;
