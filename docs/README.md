# Vue3 RBAC 管理后台文档

本文档目录用于说明当前项目的架构设计、路由机制、权限模型、Mock 接口以及扩展方式。

## 文档索引

- [01-项目架构](./01-项目架构.md)
- [02-路由使用](./02-路由使用.md)
- [03-RBAC与权限](./03-RBAC与权限.md)
- [04-Mock接口规范](./04-Mock接口规范.md)
- [05-开发与扩展](./05-开发与扩展.md)

## 快速启动

```bash
pnpm install
pnpm dev
```

## 打版

1. 测试服

```bash
pnpm run build:staging
```

2. 正式服

```bash
pnpm run build:production
```

## 技术栈

- Vue 3 + TypeScript + Vite
- Vue Router 4
- Pinia
- Element Plus
- TailwindCSS + SCSS
- vite-plugin-mock
