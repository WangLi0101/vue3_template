# Vue3 RBAC 管理后台文档

本文档目录用于说明当前项目的实际架构、权限模型、路由组织、Mock 约定和开发规范。内容以当前仓库代码为准，适合作为接手项目和后续扩展时的快速参考。

## 文档索引

- [01-项目架构](./01-项目架构.md)
- [02-路由使用](./02-路由使用.md)
- [03-RBAC与权限](./03-RBAC与权限.md)
- [04-Mock接口规范](./04-Mock接口规范.md)
- [05-开发与扩展](./05-开发与扩展.md)
- [06-代码规范](./06.代码规范.md)
- [07-接口和类型规范](./07.接口和类型规范.md)
- [08-弹窗组件规范](./08-弹窗组件规范.md)

## 环境要求

- `Node.js`: `^20.19.0 || >=22.12.0`
- `pnpm`: `>=10 <11`

## 常用命令

```bash
pnpm install # 安装项目依赖
pnpm dev # 启动本地开发服务
pnpm run typecheck # 执行 TypeScript 类型检查
pnpm run lint # 执行 ESLint 检查
pnpm run check # 执行综合检查（typecheck + lint）
```

## 构建命令

```bash
pnpm run build:dev # 构建开发环境产物
pnpm run build:staging # 构建测试环境产物
pnpm run build:prod # 构建生产环境产物
pnpm run preview # 本地预览构建结果
```

## 技术栈

- Vue 3 + TypeScript + Vite 8
- Vue Router 4
- Pinia
- Element Plus
- Tailwind CSS + SCSS
- Axios
- vite-plugin-mock

## 当前内置能力

- 登录鉴权与本地 token 持久化
- 静态路由、模块路由、后端菜单动态路由并存
- 基于角色、权限码和菜单树的访问控制
- 侧边栏、面包屑、标签页联动
- 主题模式与主题色切换
- Mock 鉴权与 RBAC 演示数据
