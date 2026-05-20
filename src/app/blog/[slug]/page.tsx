import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiCalendar, FiClock, FiTag } from "react-icons/fi";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MDXContent } from "@/components/mdx-content";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return {};
    return {
        title: post.title,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            publishedTime: post.date,
            images: post.cover ? [post.cover] : [],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) notFound();

    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
            {/* Back */}
            <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
                <FiArrowLeft size={14} />
                返回文章列表
            </Link>

            {/* Cover */}
            {post.cover && (
                <div className="relative w-full h-56 md:h-72 rounded-xl overflow-hidden mb-8 border border-border">
                    <Image src={post.cover} alt={post.title} fill className="object-contain" priority />
                </div>
            )}

            {/* Header */}
            <header className="mb-8">
                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        <FiTag size={14} className="text-primary" />
                        {post.tags.map((tag) => (
                            <span key={tag} className="text-sm text-primary font-medium">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    {post.title}
                </h1>
                <p className="text-muted-foreground text-lg mb-4">{post.description}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground pb-6 border-b border-border">
                    <div className="flex items-center gap-1.5">
                        <FiCalendar size={14} />
                        <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString("zh-CN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </time>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <FiClock size={14} />
                        <span>{post.readingTime}阅读</span>
                    </div>
                </div>
            </header>

            {/* Content */}
            <MDXContent source={post.content} />

            {/* Copyright */}
            <div className="mt-12 p-4 bg-muted rounded-lg border border-border text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">版权声明</p>
                <p>
                    本文发布于 JiangTaibai，遵循{" "}
                    <a
                        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        CC BY-NC-SA 4.0
                    </a>{" "}
                    协议，转载请注明来源。
                </p>
            </div>
        </div>
    );
}
