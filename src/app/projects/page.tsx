import type { Metadata } from "next";
import { getAllProjects } from "@/lib/projects";
import { ProjectsClient } from "./projects-client";

export const metadata: Metadata = {
    title: "作品集",
    description: "全栈网站、系统工具、游戏开发、开源贡献——所有项目的完整展示。",
};

export default function ProjectsPage() {
    const projects = getAllProjects();
    return <ProjectsClient projects={projects} />;
}
