"use client";
import { bgImages } from "@/lib/constants/images";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function BgImage() {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const selectedImage = useRef(bgImages[Math.floor(Math.random() * bgImages.length)]);

    useEffect(() => {
        setMounted(true); // Ensures this only renders client-side
    }, []);

    if (!mounted || !theme || !systemTheme) {
        return (
            <div className="w-full flex flex-col gap-12 items-center justify-center h-screen-minus-header">
                
            </div>
        );
    }

    const currentTheme = theme === "system" ? systemTheme : theme;
    const mob_url = currentTheme === "dark" ? selectedImage.current.mob_url.dark : selectedImage.current.mob_url.light;
    const desk_url = currentTheme === "dark" ? selectedImage.current.desk_url.dark : selectedImage.current.desk_url.light;

    return (
        <div className="absolute w-full h-screen-minus-header -z-10 overflow-hidden">
            <Image fill src={mob_url} className=" flex md:hidden -z-10 absolute object-cover" alt="background image" />
            <Image fill src={desk_url} className=" hidden md:flex -z-10 absolute object-cover" alt="background image" />
        </div>
    );
}
