"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
    { href: "/projects", label: "作品" },
    { href: "/blog", label: "文章" },
    { href: "/videos", label: "视频" },
    { href: "/about", label: "关于" },
];

export function Header() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Floating pill nav */}
                <div className="mt-4 flex h-11 items-center justify-between rounded-2xl glass-nav px-4">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 group"
                    >
                        <span
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
                        >
                            D
                        </span>
                        <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                            JiangTaibai
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-0.5">
                        {navLinks.map(({ href, label }) => {
                            const isActive = pathname === href || pathname.startsWith(href + "/");
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive
                                        ? "text-foreground bg-surface-raised"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right */}
                    <div className="flex items-center gap-1">
                        <ThemeToggle />
                        <button
                            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
                        >
                            {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {mobileOpen && (
                    <div className="mt-2 rounded-2xl glass-nav p-2">
                        {navLinks.map(({ href, label }) => {
                            const isActive = pathname === href || pathname.startsWith(href + "/");
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`block px-4 py-2.5 rounded-xl text-sm transition-colors ${isActive
                                        ? "text-foreground bg-surface-raised"
                                        : "text-muted-foreground hover:text-foreground hover:bg-surface-raised"
                                        }`}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </header>
    );
}

