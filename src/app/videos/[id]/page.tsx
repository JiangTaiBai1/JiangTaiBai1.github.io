import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiCalendar, FiClock, FiDownload, FiExternalLink } from "react-icons/fi";
import { getAllVideos, getVideoById, getBilibiliEmbedUrl, getYouTubeEmbedUrl } from "@/lib/videos";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    const videos = getAllVideos();
    return videos.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const video = getVideoById(id);
    if (!video) return {};
    return {
        title: video.title,
        description: video.description,
    };
}

export default async function VideoDetailPage({ params }: Props) {
    const { id } = await params;
    const video = getVideoById(id);
    if (!video) notFound();

    const embedUrl =
        video.platform === "youtube"
            ? getYouTubeEmbedUrl(video.videoId)
            : getBilibiliEmbedUrl(video.videoId);

    const allPosts = getAllPosts();
    const relatedPost = video.relatedPost
        ? allPosts.find((p) => p.slug === video.relatedPost)
        : undefined;

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
            {/* Back */}
            <Link
                href="/videos"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
                <FiArrowLeft size={14} />
                返回视频列表
            </Link>

            {/* Video Player - lazy loaded */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-black mb-8">
                <iframe
                    src={embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    loading="lazy"
                />
            </div>

            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-2 mb-3">
                    {video.tags.map((tag) => (
                        <span key={tag} className="text-xs font-medium text-primary">
                            #{tag}
                        </span>
                    ))}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                    {video.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                        <FiCalendar size={14} />
                        <time dateTime={video.date}>
                            {new Date(video.date).toLocaleDateString("zh-CN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </time>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <FiClock size={14} />
                        <span>{video.duration}</span>
                    </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{video.description}</p>
            </div>

            {/* Timestamps */}
            {video.timestamps && video.timestamps.length > 0 && (
                <div className="mb-8 bg-card border border-border rounded-xl p-5">
                    <h2 className="font-semibold text-foreground mb-4">时间节点</h2>
                    <div className="space-y-2">
                        {video.timestamps.map(({ time, label }) => (
                            <div key={time} className="flex items-center gap-3 text-sm">
                                <span className="font-mono text-primary font-medium min-w-[3.5rem]">
                                    {time}
                                </span>
                                <span className="text-muted-foreground">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Resources */}
            {video.resources && video.resources.length > 0 && (
                <div className="mb-8">
                    <h2 className="font-semibold text-foreground mb-4">相关资源</h2>
                    <div className="flex flex-wrap gap-3">
                        {video.resources.map(({ label, url }) => (
                            <a
                                key={label}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-accent border border-border rounded-lg text-sm text-foreground hover:bg-accent/70 transition-colors"
                            >
                                {url.includes("github") ? (
                                    <FiExternalLink size={14} />
                                ) : (
                                    <FiDownload size={14} />
                                )}
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Related Post */}
            {relatedPost && (
                <div className="border-t border-border pt-8">
                    <h2 className="font-semibold text-foreground mb-4">关联文章</h2>
                    <div className="max-w-sm">
                        <PostCard post={relatedPost} />
                    </div>
                </div>
            )}
        </div>
    );
}
