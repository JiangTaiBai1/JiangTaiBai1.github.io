"use client";

import { useState, useMemo } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { PostCard } from "@/components/post-card";
import type { PostMeta } from "@/lib/posts";

interface BlogClientProps {
    posts: PostMeta[];
}

export function BlogClient({ posts }: BlogClientProps) {
    const [query, setQuery] = useState("");
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const allTags = useMemo(
        () => Array.from(new Set(posts.flatMap((p) => p.tags))),
        [posts]
    );

    const filtered = useMemo(() => {
        return posts.filter((post) => {
            const matchQuery =
                !query ||
                post.title.toLowerCase().includes(query.toLowerCase()) ||
                post.description.toLowerCase().includes(query.toLowerCase()) ||
                post.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
            const matchTag = !activeTag || post.tags.includes(activeTag);
            return matchQuery && matchTag;
        });
    }, [posts, query, activeTag]);

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-foreground mb-3">技术文章</h1>
                <p className="text-muted-foreground text-lg">
                    记录技术成长，分享实践经验。共 {posts.length} 篇文章。
                </p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <FiSearch
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                    type="search"
                    placeholder="搜索文章标题、标签..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-accent border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <FiX size={16} />
                    </button>
                )}
            </div>

            {/* Tag Filters */}
            {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                    <button
                        onClick={() => setActiveTag(null)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!activeTag
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        全部
                    </button>
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTag === tag
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-accent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            )}

            {/* Results */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((post) => (
                        <PostCard key={post.slug} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-muted-foreground">
                    <p className="text-lg">没有找到匹配的文章</p>
                    <button
                        onClick={() => { setQuery(""); setActiveTag(null); }}
                        className="mt-4 text-primary hover:underline text-sm"
                    >
                        清除搜索条件
                    </button>
                </div>
            )}
        </div>
    );
}
