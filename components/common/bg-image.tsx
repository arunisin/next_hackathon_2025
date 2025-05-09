"use client";
import { bgImages } from "@/lib/constants/images";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export default function BgImage({ children }: { children: React.ReactNode }) {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const selectedImage = useRef(bgImages[Math.floor(Math.random() * bgImages.length)]);

    useEffect(() => {
        setMounted(true); // Ensures this only renders client-side
    }, []);

    if (!mounted || !theme || !systemTheme) {
        return (
            <div className="w-full flex flex-col gap-12 items-center justify-center h-screen-minus-header">
                {children}
            </div>
        );
    }

    const currentTheme = theme === "system" ? systemTheme : theme;
    const url = currentTheme === "dark" ? selectedImage.current.url.dark : selectedImage.current.url.light;

    return (
        <div
            className="w-full flex flex-col gap-12 items-center justify-center h-screen-minus-header"
            style={{
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {children}
        </div>
    );
}