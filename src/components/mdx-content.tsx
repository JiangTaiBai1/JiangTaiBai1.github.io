import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { useMDXComponents } from "../../mdx-components";

interface MDXContentProps {
    source: string;
}

export function MDXContent({ source }: MDXContentProps) {
    const components = useMDXComponents({});
    return (
        <div className="max-w-none">
            <MDXRemote
                source={source}
                components={components}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
        </div>
    );
}
