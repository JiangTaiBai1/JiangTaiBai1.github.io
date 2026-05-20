import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-5 mb-2 text-foreground">{children}</h3>
        ),
        p: ({ children }) => (
            <p className="my-4 leading-7 text-muted-foreground">{children}</p>
        ),
        a: ({ href, children }) => (
            <a
                href={href}
                className="text-primary underline underline-offset-4 hover:text-primary/80"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
                {children}
            </a>
        ),
        ul: ({ children }) => (
            <ul className="my-4 ml-6 list-disc space-y-2 text-muted-foreground">{children}</ul>
        ),
        ol: ({ children }) => (
            <ol className="my-4 ml-6 list-decimal space-y-2 text-muted-foreground">{children}</ol>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                {children}
            </blockquote>
        ),
        code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
                return (
                    <code className={`${className} block overflow-x-auto`}>{children}</code>
                );
            }
            return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                    {children}
                </code>
            );
        },
        pre: ({ children }) => (
            <pre className="bg-muted rounded-lg p-4 overflow-x-auto my-4 text-sm font-mono border border-border">
                {children}
            </pre>
        ),
        img: (props) => (
            <Image
                className="rounded-lg my-4 w-full"
                {...(props as ImageProps)}
                alt={props.alt ?? ""}
                width={800}
                height={450}
            />
        ),
        table: ({ children }) => (
            <div className="overflow-x-auto rounded-xl border border-border my-4">
                <table className="w-full border-collapse text-sm">{children}</table>
            </div>
        ),
        thead: ({ children }) => (
            <thead className="border-b-2 border-border">{children}</thead>
        ),
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
            <tr className="border-b border-border last:border-b-0 hover:bg-surface-raised transition-colors">{children}</tr>
        ),
        th: ({ children }) => (
            <th className="px-4 py-3 text-left font-semibold text-foreground bg-surface-raised whitespace-nowrap">{children}</th>
        ),
        td: ({ children }) => (
            <td className="px-4 py-3 text-muted-foreground">{children}</td>
        ),
        ...components,
    };
}
