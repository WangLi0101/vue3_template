# AGENTS.md

本文件为仓库根目录级别的协作说明，作用域覆盖整个项目。

## 1. 项目概览

- 项目定位：`Vue 3 + TypeScript + Vite` 的 RBAC 管理后台模板。
- 当前技术栈：`Vue 3`、`Vue Router 4`、`Pinia`、`Element Plus`、`Tailwind CSS`、`SCSS`、`Axios`、`vite-plugin-mock`。
- 包管理器：仅使用 `pnpm`。
- 语言风格：界面文案、文档说明、代码注释以中文为主，保持与现有项目一致。

## 2. 环境与常用命令

- Node.js：`^20.19.0 || >=22.12.0`
- pnpm：`>=10 <11`

常用命令：

```bash
pnpm install
pnpm dev
pnpm run typecheck
pnpm run lint
pnpm run check
pnpm run format
pnpm run format:check
pnpm run build:dev
pnpm run build:staging
pnpm run build:prod
```

## 3. 修改前必须了解的约束

- 优先做“小而准”的改动，不要随意重构既有目录结构。
- 不要无故新增依赖；能复用现有工具链时优先复用。
- 所有导入优先使用 `@/` 别名，不要新增深层相对路径风格。
- 必须保持 TypeScript 严格模式可通过，避免引入 `any`。
- 仅类型导入必须使用 `import type`。
- 不要在 API 层混入页面逻辑，不要在 Store 中堆叠与本模块无关的职责。
- 如果功能变更会影响文档、Mock、类型或权限配置，必须同步更新。

## 4. 目录职责

### 启动与布局

- `src/main.ts`：应用初始化入口。
- `src/App.vue`：应用根组件。
- `src/layout/*`：后台布局壳、头部、侧边栏、标签栏、设置抽屉等。
- `src/components/AppRouterView.vue`：嵌套路由容器与页面承载。

### 路由

- `src/router/static-routes.ts`：登录页、403、404、根布局等静态入口路由。
- `src/router/module-routes.ts`：聚合静态模块路由。
- `src/router/modules/*.ts`：新增固定页面时优先在这里加模块路由。
- `src/router/dynamic-routes.ts`：后端菜单转动态路由。
- `src/router/guard.ts`：登录校验、会话初始化、动态路由挂载、权限兜底。

### 状态管理

- `src/stores/modules/auth.ts`：登录态、用户信息、会话初始化。
- `src/stores/modules/permission.ts`：角色、权限、动态路由生命周期。
- `src/stores/modules/menu.ts`：菜单树、侧边栏、面包屑、首页跳转目标。
- `src/stores/modules/tabs.ts`：标签页状态。
- `src/stores/modules/ui.ts`：界面状态，如侧边栏折叠。
- `src/stores/modules/theme.ts`：主题模式、主题色、CSS 变量同步。

新增状态逻辑时，先判断应落在哪个 store，避免跨模块职责漂移。

### 接口与类型

- `src/api/<domain>/api.ts`：接口函数。
- `src/api/<domain>/types.ts`：领域类型。
- `src/api/<domain>/constants.ts`：领域常量。
- `src/api/<domain>/index.ts`：统一导出。
- `src/utils/http/*`：请求封装、拦截器、服务地址配置。
- `src/types/*`：跨领域通用类型。

### 视图与组合逻辑

- `src/views/*`：业务页面。
- `src/composables/*`：组合式逻辑，适合抽离页面或布局复用行为。
- `src/directives/modules/*`：按钮级权限指令。

## 5. 代码风格与实现习惯

### Vue 组件

- 统一使用 Vue 3 Composition API 与 `<script setup lang="ts">`。
- 组件命名遵循现有约定：
  - 页面组件优先使用 `XxxPage.vue`
  - 弹窗表单组件优先使用 `XxxFormDialog.vue`
  - 非页面公共组件使用多单词命名
- 遵循现有 ESLint 规则，尤其注意：
  - 必须使用大括号
  - 严格相等
  - 不保留 `debugger`
  - 未使用变量需清理，保留时使用 `_` 前缀
- 块顺序、模板与脚本分隔、空行风格交给 ESLint/Prettier 保持一致，不要手工对抗格式化结果。

### 表单弹窗

- 参考现有实现：
  - `src/views/system/role/components/RoleFormDialog.vue`
  - `src/views/system/user/components/UserFormDialog.vue`
- 推荐保持以下模式一致：
  - `defineProps` + `defineEmits` + `defineModel`
  - 使用 `useTemplateRef` 获取 `FormInstance`
  - 在 `open` 时回填编辑数据
  - 在 `closed` 时 `resetFields`
  - 使用独立的 `isSubmitLoading`
  - 成功后关闭弹窗并触发 `success`

### API 与类型

- 接口函数命名统一为 `XxxApi`。
- 请求与响应类型按现有约定命名：
  - 请求体：`XxxPayload`
  - 查询参数：`XxxQuery`
  - 列表项：`XxxItem`
  - 响应体：`XxxResponse`
- 统一通过 `request<T>()` 发请求，不要在业务 API 中直接散落 Axios 调用。
- 服务地址通过 `ServiceName` 选择，不要在 API 层写死 `baseURL`。
- 保持现有响应壳结构：`{ code, data, message }`。
- 数据字段类型以现有领域定义为准；如果某个模块当前使用 `number` 类型 ID，不要单独改成 `string`，除非连同接口、Mock、表格和表单一起做完整一致性改造。

### Store 与权限

- `auth` 只处理登录态与用户会话。
- `permission` 只处理角色、权限集合和动态路由挂载。
- `menu` 只处理菜单衍生结构与导航体验。
- 页面级权限走路由 `meta.permission` 与守卫。
- 按钮级权限走 `v-permission` 或 `v-role`。

## 6. 功能开发落点规则

### 新增页面

1. 在 `src/views/...` 新建页面组件。
2. 根据需求选择路由接入方式：
   - 固定页面：加到 `src/router/modules/*.ts`
   - 动态页面：由后端或 Mock 的 `menus` 返回菜单节点
3. 页面需要出现在导航中时，补齐 `meta.title`，按需配置 `icon`、`rank`、`hidden`。
4. 需要权限控制时，补 `meta.permission`。
5. 页面内按钮权限使用 `v-permission` 或 `v-role`。

### 新增接口域

目录结构保持为：

```text
src/api/example/
  api.ts
  types.ts
  constants.ts   # 仅在确有领域常量时添加
  index.ts
```

同时关注：

- 必要时同步补 `mock/`。
- 如果接口接入新服务地址，先改 `src/utils/http` 相关配置。
- 不要把字段转换、表单回填、消息提示等页面逻辑塞进 `api.ts`。

### 新增权限点

- 页面级：路由增加 `meta.permission`。
- 按钮级：模板增加 `v-permission` 或 `v-role`。
- 同步更新权限来源：
  - Mock 或后端返回的 `permissions`
  - 如需出现在菜单中，还要同步 `menus`

### 新增动态菜单页面

- 菜单节点的 `component` 字段必须相对 `src/views`，且不带 `.vue`。
- `name` 必须稳定且唯一。
- 容器路由使用 `router-view` 语义时，优先保持与现有动态路由转换逻辑兼容。

## 7. 变更同步原则

以下改动通常需要联动更新，不要只改一处：

- 改接口字段：同步改 `types`、页面消费代码、Mock、必要文档。
- 改权限：同步改路由、按钮指令、权限数据、菜单数据。
- 改动态路由：同步验证侧边栏、面包屑、标签页、首页跳转逻辑。
- 改主题/UI 状态：同步检查持久化逻辑与默认值兼容性。
- 改登录/初始化链路：同步检查守卫、动态路由挂载、退出登录清理。

## 8. 提交前检查

至少根据改动范围执行对应检查：

- 类型相关改动后执行：`pnpm run typecheck`
- 代码改动后执行：`pnpm run lint`
- 提交前建议执行：`pnpm run check`
- 批量改动或样式调整后执行：`pnpm run format` 与 `pnpm run format:check`

如果改动涉及以下关键链路，建议手工验证：

- 登录
- 首次进入受保护页面
- 动态路由注入
- 标签页联动
- 权限按钮显示/隐藏
- 退出登录后的路由清理

## 9. 参考文档

以下文档是本仓库的重要补充说明，修改相关模块前建议先看：

- `docs/01-项目架构.md`
- `docs/05-开发与扩展.md`
- `docs/06.代码规范.md`
- `docs/07.接口和类型规范.md`

如果实际代码与文档不一致，以当前仓库代码实现为准；完成修复或重构后再补齐文档。
