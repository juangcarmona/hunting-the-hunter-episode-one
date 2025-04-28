import { useTheme } from "next-themes";
import Image from "next/image";

interface ThemeImageProps {
    customLogo?: string;
}

const ThemeImage: React.FC<ThemeImageProps> = ({ customLogo }) => {
    const { theme } = useTheme();
    return (
        <div style={{ position: "relative", width: 175, height: 50 }}>
            <Image
                src={
                    customLogo ||
                    (theme === "dark"
                        ? "/images/wov-labs-white-logo.png"
                        : "/images/wov-labs-black-logo.png")
                }
                alt={"WOV logo"}
                layout={"fill"}
                objectFit={"contain"}
            />
        </div>
    );
};

export default ThemeImage;
