import type { Metadata } from "next";
import Link from "next/link";
import { FiFileText, FiFolder, FiVideo, FiUser, FiHome } from "react-icons/fi";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import { getAllVideos } from "@/lib/videos";

export const metadata: Metadata = {
    title: "网站地图",
    description: "JiangTaibai 全站页面索引，快速找到你感兴趣的内容。",
};

export default function SitemapPage() {
    const posts = getAllPosts();
    const projects = getAllProjects();
    const videos = getAllVideos();

    const sections = [
        {
            icon: <FiHome size={18} />,
            title: "主要页面",
            links: [
                { href: "/", label: "首页" },
                { href: "/projects", label: "作品集" },
                { href: "/blog", label: "技术文章" },
                { href: "/videos", label: "视频教程" },
                { href: "/about", label: "关于我" },
            ],
        },
        {
            icon: <FiFolder size={18} />,
            title: "作品集",
            links: projects.map((p) => ({
                href: `/projects/${p.slug}`,
                label: p.title,
                meta: new Date(p.date).toLocaleDateString("zh-CN", { year: "numeric", month: "short" }),
            })),
        },
        {
            icon: <FiFileText size={18} />,
            title: "技术文章",
            links: posts.map((p) => ({
                href: `/blog/${p.slug}`,
                label: p.title,
                meta: new Date(p.date).toLocaleDateString("zh-CN", { year: "numeric", month: "short", day: "numeric" }),
            })),
        },
        {
            icon: <FiVideo size={18} />,
            title: "视频教程",
            links: videos.map((v) => ({
                href: `/videos/${v.id}`,
                label: v.title,
                meta: new Date(v.date).toLocaleDateString("zh-CN", { year: "numeric", month: "short" }),
            })),
        },
        {
            icon: <FiUser size={18} />,
            title: "其他",
            links: [
                { href: "/sitemap.xml", label: "XML 站点地图（供搜索引擎使用）", external: true },
                { href: "/robots.txt", label: "robots.txt", external: true },
                { href: "/rss.xml", label: "RSS 订阅源" },
            ],
        },
    ];

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-foreground mb-2">网站地图</h1>
                <p className="text-muted-foreground">全站页面索引，共收录 {posts.length + projects.length + videos.length + 5} 个页面。</p>
            </div>

            <div className="space-y-10">
                {sections.map((section) => (
                    <section key={section.title}>
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                            <span className="text-primary">{section.icon}</span>
                            <h2 className="font-semibold text-foreground">{section.title}</h2>
                            <span className="text-xs text-muted-foreground ml-1">({section.links.length})</span>
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                            {section.links.map(({ href, label, ...rest }) => {
                                const meta = 'meta' in rest ? rest.meta : undefined;
                                const external = 'external' in rest ? rest.external : false;
                                return (
                                    <li key={href} className="flex items-center justify-between gap-4 py-1">
                                        <Link
                                            href={href}
                                            target={external ? "_blank" : undefined}
                                            rel={external ? "noopener noreferrer" : undefined}
                                            className="text-sm text-foreground hover:text-primary transition-colors truncate"
                                        >
                                            {label}
                                        </Link>
                                        {meta && (
                                            <span className="text-xs text-muted-foreground flex-shrink-0">{meta}</span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
}
