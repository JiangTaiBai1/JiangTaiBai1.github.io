import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <p className="text-6xl font-bold text-primary mb-4">404</p>
            <h1 className="text-2xl font-semibold text-foreground mb-3">页面不存在</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
                你访问的页面可能已被移动、删除或从未存在过。
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
                返回首页
            </Link>
        </div>
    );
}
