import type { ReactNode } from "react";
import Link from "next/link";
import { FiGithub, FiTwitter, FiYoutube, FiRss, FiLinkedin } from "react-icons/fi";
import { SiBilibili } from "react-icons/si";

export function Footer() {
    const currentYear = new Date().getFullYear();

    const socials = [
        { href: "https://github.com", icon: "github", label: "GitHub" },
        { href: "https://twitter.com", icon: "twitter", label: "Twitter" },
        { href: "https://linkedin.com", icon: "linkedin", label: "LinkedIn" },
        { href: "https://youtube.com", icon: "youtube", label: "YouTube" },
        { href: "https://bilibili.com", icon: "bilibili", label: "Bilibili" },
        { href: "/rss.xml", icon: "rss", label: "RSS" },
    ];

    const iconMap: Record<string, ReactNode> = {
        github: <FiGithub size={15} />,
        twitter: <FiTwitter size={15} />,
        linkedin: <FiLinkedin size={15} />,
        youtube: <FiYoutube size={15} />,
        bilibili: <SiBilibili size={15} />,
        rss: <FiRss size={15} />,
    };

    return (
        <footer className="border-t border-border bg-surface mt-auto">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between gap-10">
                    {/* Brand */}
                    <div className="max-w-xs">
                        <div className="flex items-center gap-2 mb-3">
                            <span
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black text-white"
                                style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
                            >
                                D
                            </span>
                            <span className="font-semibold text-sm text-foreground">JiangTaibai</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            全栈开发者(偏前端) · 独立网站/小程序创作者。<br />
                            构建有趣的产品，分享技术经验。
                        </p>
                        <div className="flex items-center gap-3 mt-5">
                            {socials.map(({ href, icon, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target={href.startsWith("http") ? "_blank" : undefined}
                                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={label}
                                >
                                    {iconMap[icon]}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Nav links */}
                    <div className="flex gap-12 sm:gap-16">
                        <div>
                            <p className="text-xs font-semibold text-foreground uppercase tracking-[0.12em] mb-4">内容</p>
                            <ul className="space-y-2.5">
                                {[
                                    { href: "/projects", label: "作品集" },
                                    { href: "/blog", label: "技术文章" },
                                    { href: "/videos", label: "视频教程" },
                                    { href: "/about", label: "关于我" },
                                ].map(({ href, label }) => (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-foreground uppercase tracking-[0.12em] mb-4">其他</p>
                            <ul className="space-y-2.5">
                                {[
                                    { href: "/sitemap-page", label: "网站地图" },
                                    { href: "/rss.xml", label: "RSS 订阅" },
                                ].map(({ href, label }) => (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                        © {currentYear} JiangTaibai
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Built with Next.js &amp; Tailwind CSS
                    </p>
                </div>
            </div>
        </footer>
    );
}
