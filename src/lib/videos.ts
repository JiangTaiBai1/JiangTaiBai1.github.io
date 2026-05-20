export interface Video {
    id: string;
    title: string;
    description: string;
    platform: "youtube" | "bilibili";
    videoId: string;
    cover: string;
    duration: string;
    date: string;
    tags: string[];
    timestamps?: { time: string; label: string }[];
    relatedPost?: string;
    resources?: { label: string; url: string }[];
}

export function getAllVideos(): Video[] {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data = require("../../content/videos.json") as { videos: Video[] };
    return data.videos.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getVideoById(id: string): Video | undefined {
    return getAllVideos().find((v) => v.id === id);
}

export function getYouTubeCover(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function getBilibiliEmbedUrl(videoId: string): string {
    return `https://player.bilibili.com/player.html?bvid=${videoId}&page=1&as_wide=1&high_quality=1&danmaku=0`;
}

export function getYouTubeEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}
