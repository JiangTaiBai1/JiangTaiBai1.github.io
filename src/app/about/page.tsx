import type { Metadata } from "next";
import Image from "next/image";
import { FiGithub, FiMail, FiTwitter, FiLinkedin, FiYoutube } from "react-icons/fi";
import { SiBilibili } from "react-icons/si";

export const metadata: Metadata = {
    title: "关于我",
    description: "全栈开发者(偏前端) / 独立网站/小程序创作者，热爱构建有趣的产品和分享技术经验。",
};

const skills = [
    { category: "前端", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js"] },
    { category: "后端", items: ["Node.js", "Python", "SpringBoot", "PostgreSQL", "Redis"] },
    { category: "小程序开发", items: ["微信小程序", "UniApp", "TypeScript", "React", "Taro"] },
    { category: "工具链", items: ["Docker", "Git", "Vercel", "GitHub Actions", "Linux"] },
];

const experiences = [
    {
        role: "前端开发工程师",
        company: "重庆库田科技有限公司",
        companyUrl: "https://aiqicha.baidu.com/company_detail_18053281043925",
        period: "2026.3.2 - 至今",
        desc: "前端全端开发：采用Taro + React + TypeScript 架构开发小程序全端，封装网络层与异步任务轮询。前后端对接：对接 RESTful API，设计 TypeScript 类型，解决跨域与鉴权，实现数据交互。上线与运维：完成微信小程序上线全流程包括域名配置、SSL证书、白名单及自动化预览上传。",
        
    },
    {
        role: "独立开发者",
        company: "自由职业",
        period: "2023 - 2026",
        desc: "独立完成一个 SaaS 产品的全流程开发，包括需求分析、设计、开发、上线和运营；独立开发3D植被科普网站，使用Next.js和Three.js，支持PC和移动端访问。",
    },
];

const tools = [
    { name: "编辑器", value: "VS Code" },
    { name: "终端", value: "Windows Terminal + PowerShell" },
    { name: "设计", value: "Figma" },
    { name: "笔记", value: "OneNode" },
    { name: "主力机", value: "Windows 11 自组装" },
    { name: "部署", value: "Vercel + Railway" },
];

export default function AboutPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
            {/* Intro */}
            <section className="flex flex-col md:flex-row items-start gap-10 mb-16">
                <div className="flex-shrink-0">
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden ring-2 ring-border">
                        <Image
                            src="/images/avatar.svg"
                            alt="头像"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">关于我</h1>
                    <p className="text-primary font-medium mb-4">全栈开发者(偏前端) / 独立网站/小程序创作者</p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        你好！我是一名热爱技术、热爱创作的开发者。白天写代码，晚上做看视频，周末录视频。
                        我相信技术应该服务于创造力，工具应该让人更自由。
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                        这个网站是我的数字花园——记录学到的东西，分享做过的项目，思考有意思的问题。
                        如果你对合作或交流感兴趣，随时可以联系我。
                    </p>
                    {/* Contact */}
                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            <FiGithub size={15} /> GitHub
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-accent text-foreground border border-border rounded-lg text-sm font-medium hover:bg-accent/70 transition-colors"
                        >
                            <FiTwitter size={15} /> Twitter
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-accent text-foreground border border-border rounded-lg text-sm font-medium hover:bg-accent/70 transition-colors"
                        >
                            <FiLinkedin size={15} /> LinkedIn
                        </a>
                        <a
                            href="https://bilibili.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-accent text-foreground border border-border rounded-lg text-sm font-medium hover:bg-accent/70 transition-colors"
                        >
                            <SiBilibili size={15} /> B站
                        </a>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-accent text-foreground border border-border rounded-lg text-sm font-medium hover:bg-accent/70 transition-colors"
                        >
                            <FiYoutube size={15} /> YouTube
                        </a>
                        {/* Email */}
                        <a
                            href="mailto:jiang_taibai@foxmail.com"
                            className="flex items-center gap-2 px-4 py-2 bg-accent text-foreground border border-border rounded-lg text-sm font-medium hover:bg-accent/70 transition-colors"
                        >
                            <FiMail size={15} /> 邮件联系
                        </a>
                    </div>
                </div>
            </section>

            {/* Skills */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-foreground mb-6">技术栈</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {skills.map(({ category, items }) => (
                        <div
                            key={category}
                            className="bg-card border border-border rounded-xl p-5"
                        >
                            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                                {category}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {items.map((item) => (
                                    <span
                                        key={item}
                                        className="bg-accent text-accent-foreground text-sm px-3 py-1 rounded-lg"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Experience */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-foreground mb-6">工作经历</h2>
                <div className="space-y-6">
                    {experiences.map((exp, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                {i < experiences.length - 1 && (
                                    <div className="flex-1 w-px bg-border mt-2" />
                                )}
                            </div>
                            <div className="pb-6">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="font-semibold text-foreground">{exp.role}</span>
                                    <span className="text-muted-foreground">@</span>
                                    {exp.companyUrl ? (
                                        <a
                                            href={exp.companyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary font-medium hover:underline"
                                        >
                                            {exp.company}
                                        </a>
                                    ) : (
                                        <span className="text-primary font-medium">{exp.company}</span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{exp.period}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{exp.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tools */}
            <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">我的工具箱</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tools.map(({ name, value }) => (
                        <div
                            key={name}
                            className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3"
                        >
                            <span className="text-sm text-muted-foreground">{name}</span>
                            <span className="text-sm font-medium text-foreground">{value}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
