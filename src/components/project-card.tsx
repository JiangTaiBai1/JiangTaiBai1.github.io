import Link from "next/link";
import Image from "next/image";
import { FiGithub, FiExternalLink, FiArrowUpRight } from "react-icons/fi";
import type { ProjectMeta } from "@/lib/projects";
import { SpotlightCard } from "@/components/spotlight-card";

const categoryColors: Record<string, string> = {
  website: "text-blue-400 border-blue-400/20 bg-blue-400/5",
  tool: "text-violet-400 border-violet-400/20 bg-violet-400/5",
  game: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
  opensource: "text-orange-400 border-orange-400/20 bg-orange-400/5",
};

const categoryLabels: Record<string, string> = {
  website: "Website",
  tool: "Tool",
  game: "Game",
  opensource: "Open Source",
};

interface ProjectCardProps {
  project: ProjectMeta;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <SpotlightCard className="group">
      {/* Cover */}
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative w-full h-44 overflow-hidden rounded-t-[11px] bg-surface-raised">
          {project.cover ? (
            <Image
              src={project.cover}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900/20 to-blue-900/20">
              <span className="text-5xl opacity-20">📁</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-70" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${categoryColors[project.category] ?? "text-muted-foreground border-border"}`}>
            {categoryLabels[project.category] ?? project.category}
          </span>
          <div className="flex items-center gap-2.5">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub 仓库"
              >
                <FiGithub size={14} />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="在线演示"
              >
                <FiExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        <Link href={`/projects/${project.slug}`} className="block group/title">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-1 group-hover/title:text-primary transition-colors flex items-center gap-1">
            <span className="flex-1">{project.title}</span>
            <FiArrowUpRight size={13} className="flex-shrink-0 opacity-0 group-hover/title:opacity-60 transition-opacity" />
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono text-muted-foreground bg-surface-raised px-2 py-0.5 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </SpotlightCard>
  );
}
