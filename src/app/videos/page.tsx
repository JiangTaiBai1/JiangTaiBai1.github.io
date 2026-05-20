import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FiPlay, FiCalendar, FiClock } from "react-icons/fi";
import { SiBilibili, SiYoutube } from "react-icons/si";
import { getAllVideos, getYouTubeCover } from "@/lib/videos";

export const metadata: Metadata = {
    title: "视频教程",
    description: "技术视频教程、开发分享与直播录屏，汇聚 Bilibili 和 YouTube 的全部内容。",
};

export default function VideosPage() {
    const videos = getAllVideos();

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-foreground mb-3">视频教程</h1>
                <p className="text-muted-foreground text-lg">
                    技术分享、开发过程录屏与深度教程，共 {videos.length} 个视频。
                </p>
            </div>

            {/* Grid */}
            {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => {
                        const coverUrl =
                            video.cover ||
                            (video.platform === "youtube" ? getYouTubeCover(video.videoId) : "");

                        return (
                            <Link
                                key={video.id}
                                href={`/videos/${video.id}`}
                                className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-full aspect-video bg-muted overflow-hidden">
                                    {coverUrl ? (
                                        <Image
                                            src={coverUrl}
                                            alt={video.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-accent">
                                            <FiPlay size={36} className="text-muted-foreground/40" />
                                        </div>
                                    )}
                                    {/* Play overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <FiPlay size={18} className="text-gray-900 ml-0.5" />
                                        </div>
                                    </div>
                                    {/* Platform badge */}
                                    <div className="absolute bottom-2 right-2">
                                        <span
                                            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${video.platform === "youtube"
                                                    ? "bg-red-600 text-white"
                                                    : "bg-[#00A1D6] text-white"
                                                }`}
                                        >
                                            {video.platform === "youtube" ? (
                                                <SiYoutube size={12} />
                                            ) : (
                                                <SiBilibili size={12} />
                                            )}
                                            {video.duration}
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                        {video.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {video.description}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <FiCalendar size={11} />
                                            <span>
                                                {new Date(video.date).toLocaleDateString("zh-CN", {
                                                    year: "numeric",
                                                    month: "short",
                                                })}
                                            </span>
                                        </div>
                                        {video.tags.slice(0, 2).map((tag) => (
                                            <span key={tag} className="text-primary/80">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-16">视频内容即将上线...</p>
            )}
        </div>
    );
}
