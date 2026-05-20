"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/project-card";
import type { ProjectMeta } from "@/lib/projects";

const categoryFilters = [
    { value: "all", label: "全部" },
    { value: "website", label: "全栈网站" },
    { value: "tool", label: "系统工具" },
    { value: "game", label: "游戏开发" },
    { value: "opensource", label: "开源贡献" },
];

interface ProjectsClientProps {
    projects: ProjectMeta[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
    const [activeCategory, setActiveCategory] = useState("all");

    const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));
    const [activeTags, setActiveTags] = useState<string[]>([]);

    const filtered = projects.filter((p) => {
        const categoryMatch = activeCategory === "all" || p.category === activeCategory;
        const tagMatch = activeTags.length === 0 || activeTags.some((t) => p.tags.includes(t));
        return categoryMatch && tagMatch;
    });

    const toggleTag = (tag: string) => {
        setActiveTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
            {/* Page Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-foreground mb-3">作品集</h1>
                <p className="text-muted-foreground text-lg">
                    涵盖全栈网站、系统工具、游戏开发与开源项目，共 {projects.length} 个项目。
                </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                {categoryFilters.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => setActiveCategory(value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === value
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent text-accent-foreground hover:bg-accent/70"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Tag Filter */}
            {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                    {allTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${activeTags.includes(tag)
                                    ? "bg-primary/20 text-primary border border-primary/30"
                                    : "bg-muted text-muted-foreground hover:text-foreground border border-transparent"
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
                    {filtered.map((project) => (
                        <ProjectCard key={project.slug} project={project} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-muted-foreground">
                    <p className="text-lg">没有找到匹配的项目</p>
                    <button
                        onClick={() => { setActiveCategory("all"); setActiveTags([]); }}
                        className="mt-4 text-primary hover:underline text-sm"
                    >
                        清除筛选条件
                    </button>
                </div>
            )}
        </div>
    );
}
