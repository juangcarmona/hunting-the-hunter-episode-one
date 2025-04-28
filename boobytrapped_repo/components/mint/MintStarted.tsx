import animationProgress from "@/assets/lottie/progress-animation.json";
import { ImportStatusResponse } from "@/services/MetadataService";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import Button from "../common/Button";
import Flex from "../common/Flex";
import Spacer from "../common/Spacer";

interface MintStartedProps {
    isMetadataUploaded: boolean;
    metadataUploadStatus?: ImportStatusResponse | null;
    mintingLoadingEth: boolean;
    isSigned: boolean;
    setIsMinting: (bool: boolean) => void;
    mintCount: number;
}

const MintStarted: React.FC<MintStartedProps> = ({
    isMetadataUploaded,
    metadataUploadStatus,
    mintingLoadingEth,
    isSigned,
    setIsMinting,
    mintCount,
}) => {
    const [showRetry, setShowRetry] = useState(false);

    useEffect(() => {
        if (isMetadataUploaded) {
            setTimeout(() => {
                if (!isSigned) setShowRetry(true);
                else setShowRetry(false);
            }, 20000);
            if (isSigned) setShowRetry(false);
        }
    }, [isMetadataUploaded, isSigned]);

    return (
        <Flex
            justifyContent={"center"}
            flexDirection={"column"}
            alignItems={"center"}
        >
            <Lottie
                animationData={animationProgress}
                loop={true}
                style={{ width: 150 }}
            />

            <h2>Tokenization started...</h2>

            {isMetadataUploaded ? (
                <p>
                    Metadata uploaded (
                    {metadataUploadStatus?.completedJobs || 0} / {mintCount},
                    failed: {metadataUploadStatus?.failedJobs || 0})
                </p>
            ) : (
                <p>
                    Uploading... ({metadataUploadStatus?.completedJobs || 0} /{" "}
                    {mintCount}, failed: {metadataUploadStatus?.failedJobs || 0}
                    )
                </p>
            )}

            {mintingLoadingEth && <p>Tokenizing selected smart tags...</p>}
            <Spacer y size={3} />
            {showRetry && (
                <Button onClick={() => setIsMinting(false)}>Retry</Button>
            )}
        </Flex>
    );
};

export default MintStarted;
