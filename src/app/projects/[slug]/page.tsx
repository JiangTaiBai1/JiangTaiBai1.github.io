import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiGithub, FiExternalLink, FiArrowLeft, FiCalendar, FiTag } from "react-icons/fi";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { MDXContent } from "@/components/mdx-content";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const projects = getAllProjects();
    return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) return {};
    return {
        title: project.title,
        description: project.description,
        openGraph: {
            title: project.title,
            description: project.description,
            images: project.cover ? [project.cover] : [],
        },
    };
}

const categoryLabels: Record<string, string> = {
    website: "全栈网站",
    tool: "系统工具",
    game: "游戏开发",
    opensource: "开源贡献",
};

export default async function ProjectDetailPage({ params }: Props) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) notFound();

    const allPosts = getAllPosts();
    const relatedPosts = allPosts.filter((p) =>
        p.relatedProjects?.includes(slug)
    );

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
            {/* Back */}
            <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
                <FiArrowLeft size={14} />
                返回作品集
            </Link>

            {/* Cover */}
            {project.cover && (
                <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8 border border-border">
                    <Image src={project.cover} alt={project.title} fill className="object-cover" priority />
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
                        {categoryLabels[project.category]}
                    </span>
                    {project.featured && (
                        <span className="text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-md">
                            精选
                        </span>
                    )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{project.title}</h1>
                <p className="text-lg text-muted-foreground mb-4">{project.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        <span>{new Date(project.date).toLocaleDateString("zh-CN")}</span>
                    </div>
                    {project.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                            <FiTag size={14} />
                            <span>{project.tags.join(" · ")}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                    {project.demoUrl && (
                        <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                            <FiExternalLink size={15} />
                            在线演示
                        </a>
                    )}
                    {project.repoUrl && (
                        <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-foreground border border-border rounded-lg text-sm font-medium hover:bg-accent/70 transition-colors"
                        >
                            <FiGithub size={15} />
                            查看代码
                        </a>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="prose-container border-t border-border pt-8">
                <MDXContent source={project.content} />
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border">
                    <h2 className="text-xl font-bold text-foreground mb-6">相关文章</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {relatedPosts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
