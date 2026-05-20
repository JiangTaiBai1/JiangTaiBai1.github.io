import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostMeta {
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
    cover?: string;
    readingTime: string;
    relatedProjects?: string[];
}

export interface Post extends PostMeta {
    content: string;
}

export function getAllPosts(): PostMeta[] {
    if (!fs.existsSync(postsDirectory)) return [];

    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames
        .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
        .map((fileName) => {
            const slug = fileName.replace(/\.(mdx|md)$/, "");
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { data, content } = matter(fileContents);
            const rt = readingTime(content);

            return {
                slug,
                title: data.title ?? "无标题",
                date: data.date ?? new Date().toISOString(),
                description: data.description ?? "",
                tags: data.tags ?? [],
                cover: data.cover,
                readingTime: `${Math.ceil(rt.minutes)} 分钟`,
                relatedProjects: data.relatedProjects ?? [],
            } as PostMeta;
        });

    return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): Post | null {
    const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
    const mdPath = path.join(postsDirectory, `${slug}.md`);
    const fullPath = fs.existsSync(mdxPath) ? mdxPath : mdPath;

    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const rt = readingTime(content);

    return {
        slug,
        title: data.title ?? "无标题",
        date: data.date ?? new Date().toISOString(),
        description: data.description ?? "",
        tags: data.tags ?? [],
        cover: data.cover,
        readingTime: `${Math.ceil(rt.minutes)} 分钟`,
        relatedProjects: data.relatedProjects ?? [],
        content,
    };
}
