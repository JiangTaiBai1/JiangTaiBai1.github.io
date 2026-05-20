import fs from "fs";
import path from "path";
import matter from "gray-matter";

const projectsDirectory = path.join(process.cwd(), "content/projects");

export interface ProjectMeta {
    slug: string;
    title: string;
    description: string;
    category: "website" | "tool" | "game" | "opensource";
    tags: string[];
    cover?: string;
    demoUrl?: string;
    repoUrl?: string;
    date: string;
    featured: boolean;
}

export interface Project extends ProjectMeta {
    content: string;
}

const categoryMap: Record<string, ProjectMeta["category"]> = {
    website: "website",
    tool: "tool",
    game: "game",
    opensource: "opensource",
};

export function getAllProjects(): ProjectMeta[] {
    if (!fs.existsSync(projectsDirectory)) return [];

    const fileNames = fs.readdirSync(projectsDirectory);
    const projects = fileNames
        .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
        .map((fileName) => {
            const slug = fileName.replace(/\.(mdx|md)$/, "");
            const fullPath = path.join(projectsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { data } = matter(fileContents);

            return {
                slug,
                title: data.title ?? "无标题",
                description: data.description ?? "",
                category: categoryMap[data.category] ?? "website",
                tags: data.tags ?? [],
                cover: data.cover,
                demoUrl: data.demoUrl,
                repoUrl: data.repoUrl,
                date: data.date ?? new Date().toISOString(),
                featured: data.featured ?? false,
            } as ProjectMeta;
        });

    return projects.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getProjectBySlug(slug: string): Project | null {
    const mdxPath = path.join(projectsDirectory, `${slug}.mdx`);
    const mdPath = path.join(projectsDirectory, `${slug}.md`);
    const fullPath = fs.existsSync(mdxPath) ? mdxPath : mdPath;

    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
        slug,
        title: data.title ?? "无标题",
        description: data.description ?? "",
        category: categoryMap[data.category] ?? "website",
        tags: data.tags ?? [],
        cover: data.cover,
        demoUrl: data.demoUrl,
        repoUrl: data.repoUrl,
        date: data.date ?? new Date().toISOString(),
        featured: data.featured ?? false,
        content,
    };
}

export function getFeaturedProjects(): ProjectMeta[] {
    return getAllProjects().filter((p) => p.featured).slice(0, 6);
}
