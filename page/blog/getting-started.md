# 博客搭建笔记

记录一下搭建这个博客的过程。

## 技术选型

| 功能 | 工具 |
|------|------|
| Markdown 渲染 | marked.js |
| 样式 | GitHub Markdown CSS |
| 图标 | Material Icons |
| 路由 | URL 参数 (SPA) |

## 目录结构

```
/
├── index.html        # 主页面
├── articles.json     # 文章索引
├── assets/
│   ├── style/
│   │   └── global.css
│   └── script/
│       └── global.js
└── page/
    ├── index.md
    ├── about.md
    ├── blog.md
    └── blog/
        ├── hello-world.md
        └── ...
```

## 核心原理

1. 通过 `?p=` URL 参数控制页面路由
2. 使用 `fetch` 加载对应的 `.md` 文件
3. 用 `marked.parse()` 将 Markdown 渲染为 HTML
4. 通过 `articles.json` 生成文章列表时间线

整个过程全部在浏览器端完成，无需后端服务。