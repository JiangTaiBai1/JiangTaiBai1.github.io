import Link from "next/link";
import { FiGithub, FiArrowUpRight, FiYoutube } from "react-icons/fi";
import { SiBilibili } from "react-icons/si";
import { getFeaturedProjects, getAllProjects } from "@/lib/projects";
import { getAllPosts } from "@/lib/posts";
import { getAllVideos } from "@/lib/videos";
import { ProjectCard } from "@/components/project-card";
import { PostCard } from "@/components/post-card";

export default function HomePage() {
  const allProjects = getAllProjects();
  const featuredProjects = getFeaturedProjects();
  const allPosts = getAllPosts();
  const latestPosts = allPosts.slice(0, 3);
  const allVideos = getAllVideos();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0 bg-dots" />

        {/* Ambient glow orbs */}
        <div
          className="glow-orb w-[800px] h-[800px] -top-72 -left-56 animate-pulse-glow"
          style={{ background: "var(--glow-purple)" }}
        />
        <div
          className="glow-orb w-[700px] h-[700px] top-8 -right-48 animate-pulse-glow"
          style={{ background: "var(--glow-blue)", animationDelay: "2s" }}
        />
        <div
          className="glow-orb w-[500px] h-[500px] bottom-0 left-1/3 animate-pulse-glow"
          style={{ background: "var(--glow-green)", animationDelay: "3.5s" }}
        />

        {/* Aurora bar — hero bottom colorful glow */}
        <div className="aurora-bar" />

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-24 text-center">
          {/* Status badge */}
          <div className="animate-fade-up delay-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface/60 backdrop-blur-sm text-xs text-muted-foreground mb-10 hover:border-border-hover transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            开放合作机会
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[1.06] mb-6">
            <span className="gradient-heading block animate-fade-up delay-100">构建令人惊叹的</span>
            <span className="animate-shimmer block animate-fade-up delay-200">数字体验</span>
          </h1>

          {/* Sub text */}
          <p className="animate-fade-up delay-300 text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-3 leading-relaxed">
            全栈开发者(偏前端) · 独立网站/小程序创作者 · 技术内容创作者
          </p>
          <p className="animate-fade-up delay-400 text-sm text-muted-foreground/60 max-w-lg mx-auto mb-12">
            热爱将创意转化为现实——从 Web 应用到微信小程序，从开源工具到技术分享
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-up delay-500 flex flex-wrap items-center gap-3 justify-center mb-16">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              查看作品集
              <FiArrowUpRight size={15} />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border bg-surface/60 backdrop-blur-sm text-foreground text-sm font-medium hover:border-border-hover transition-colors"
            >
              <FiGithub size={15} />
              GitHub
            </a>
            <a
              href="https://bilibili.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border bg-surface/60 backdrop-blur-sm text-foreground text-sm font-medium hover:border-border-hover transition-colors"
            >
              <SiBilibili size={15} />
              B站
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border bg-surface/60 backdrop-blur-sm text-foreground text-sm font-medium hover:border-border-hover transition-colors"
            >
              <FiYoutube size={15} />
              YouTube
            </a>
          </div>

          {/* Stats grid */}
          <div className="animate-scale-in delay-600 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border rounded-2xl overflow-hidden border border-border">
            {[
              { label: "开源项目", value: allProjects.length },
              { label: "技术文章", value: allPosts.length },
              { label: "视频教程", value: allVideos.length },
              { label: "GitHub Stars", value: "1k+" },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface/80 backdrop-blur-sm py-7 px-4 text-center">
                <p className="text-3xl font-bold gradient-text mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="relative py-24 border-t border-border overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-2">Projects</p>
              <h2 className="text-3xl md:text-4xl font-bold gradient-heading">精选作品</h2>
            </div>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              查看全部
              <FiArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">作品内容加载中...</p>
          )}
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-24 border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-2">Writing</p>
              <h2 className="text-3xl md:text-4xl font-bold gradient-heading">最新文章</h2>
            </div>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              查看全部
              <FiArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {latestPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">文章内容加载中...</p>
          )}
        </div>
      </section>
    </div>
  );
}
