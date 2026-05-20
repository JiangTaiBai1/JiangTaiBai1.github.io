import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { BlogClient } from "./blog-client";

export const metadata: Metadata = {
    title: "技术文章",
    description: "技术实践与思考，分享前后端开发、架构设计、游戏开发的经验与心得。",
};

export default function BlogPage() {
    const posts = getAllPosts();
    return <BlogClient posts={posts} />;
}
