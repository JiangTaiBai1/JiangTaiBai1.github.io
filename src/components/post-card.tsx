import Link from "next/link";
import Image from "next/image";
import { FiCalendar, FiClock, FiArrowUpRight } from "react-icons/fi";
import type { PostMeta } from "@/lib/posts";
import { SpotlightCard } from "@/components/spotlight-card";

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <SpotlightCard className="group">
      {/* Cover */}
      {post.cover && (
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="relative w-full h-40 overflow-hidden rounded-t-[11px]">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-70" />
          </div>
        </Link>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs font-mono text-primary/70">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <Link href={`/blog/${post.slug}`} className="block group/title">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 leading-snug group-hover/title:text-primary transition-colors flex items-start gap-1">
            <span className="flex-1">{post.title}</span>
            <FiArrowUpRight size={13} className="flex-shrink-0 mt-0.5 opacity-0 group-hover/title:opacity-60 transition-opacity" />
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {post.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <FiCalendar size={11} />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <FiClock size={11} />
            <span>{post.readingTime}</span>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
