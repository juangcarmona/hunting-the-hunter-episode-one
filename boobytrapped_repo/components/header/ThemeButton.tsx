"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { GoLightBulb } from "react-icons/go";
import CircleButton from "../common/CircleButton";

const ThemeButton = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    return (
        <CircleButton small outline onClick={toggleTheme}>
            <GoLightBulb />
        </CircleButton>
    );
};

export default ThemeButton;
