"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="p-2 rounded-lg text-muted-foreground w-9 h-9" aria-label="切换主题" />
        );
    }

    const handleToggle = () => {
        if (theme === "system") setTheme("light");
        else if (theme === "light") setTheme("dark");
        else setTheme("system");
    };

    return (
        <button
            onClick={handleToggle}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            aria-label="切换主题"
            title={`当前：${theme === "system" ? "跟随系统" : theme === "light" ? "亮色" : "暗色"}`}
        >
            {theme === "system" ? (
                <FiMonitor size={18} />
            ) : theme === "light" ? (
                <FiSun size={18} />
            ) : (
                <FiMoon size={18} />
            )}
        </button>
    );
}
