# Personal Website

基于 Next.js 16、App Router 和 MDX 的个人网站，包含作品集、博客、视频页，以及静态演示项目入口。

## 本地开发

启动开发服务器：

```bash
npm run dev
```

默认访问地址：`http://localhost:3000`

## 构建命令

- `npm run build`
	生成普通 Next.js 构建产物，输出到 `.next`
- `npm run build:static`
	生成可直接部署的静态站点，输出到 `out`

## 静态部署

本项目已配置为静态导出模式。

执行下面命令后，会生成可直接部署的 HTML、CSS、JS 和静态资源：

```bash
npm run build:static
```

生成目录：`out`

这个目录可以直接部署到：

- GitHub Pages
- Nginx
- Apache
- Netlify 静态站点
- 对象存储静态网站托管

## GitHub Pages

仓库已包含自动发布工作流：[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)

首次启用步骤：

1. 打开 GitHub 仓库设置页面
2. 进入 Pages
3. Source 选择 GitHub Actions
4. 推送到 `main` 分支，等待工作流完成

当前仓库远端为用户主页仓库 `JiangTaiBai1.github.io`，因此部署地址默认是：

`https://jiangtaibai1.github.io`

## 导出说明

- 静态导出产物目录是 `out`
- `.nojekyll` 会在 `build:static` 时自动生成，避免 GitHub Pages 忽略 `_next`
- `robots.txt`、`sitemap.xml` 和 `rss.xml` 都会在静态构建时导出
- 当前资源路径适配 GitHub Pages 根域名部署，不需要额外设置 `basePath`
