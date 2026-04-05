# AGENTS.md

本文件是仓库根目录级别的协作说明，作用域覆盖整个项目。

## 1. 项目概览

- 项目定位：基于 `Vue 3 + TypeScript + Vite` 的 RBAC 管理后台模板。
- 当前技术栈：`Vue 3`、`Vue Router 4`、`Pinia`、`Element Plus`、`Tailwind CSS`、`SCSS`、`Axios`、`vite-plugin-mock`。
- 包管理器：仅使用 `pnpm`。
- 语言风格：界面文案、代码注释、协作文档以中文为主。

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

## 3. 修改前必须遵守的约束

- 优先做“小而准”的改动，不要无故重构目录结构。
- 不要随意新增依赖；能复用现有工具链时优先复用。
- 导入优先使用 `@/` 别名，不新增深层相对路径风格。
- 必须保持 TypeScript 严格模式可通过，避免引入 `any`。
- 仅类型导入必须使用 `import type`。
- 不要在 API 层混入页面逻辑，不要在 Store 中堆叠跨模块职责。
- 变更如果影响 Mock、类型、权限、文档或路由配置，必须同步更新。
- 实际代码与文档不一致时，以当前仓库代码实现为准；必要时补齐文档。

## 4. 目录职责

### 4.1 启动与布局

- `src/main.ts`：应用初始化入口。
- `src/App.vue`：应用根组件。
- `src/layout/*`：后台布局壳、头部、侧边栏、标签栏、设置抽屉等。
- `src/components/AppRouterView.vue`：嵌套路由页面承载容器。

### 4.2 路由

- `src/router/static-routes.ts`：登录、403、404、根布局等静态入口路由。
- `src/router/module-routes.ts`：聚合固定模块路由。
- `src/router/dynamic-routes.ts`：后端菜单转动态路由。
- `src/router/guard.ts`：登录校验、会话初始化、动态路由挂载、权限兜底。
- 新增固定页面优先落到 `src/router/modules/*.ts`；动态业务页面遵循菜单驱动模式。

### 4.3 状态管理

- `src/stores/modules/auth.ts`：登录态、用户信息、会话初始化。
- `src/stores/modules/permission.ts`：角色、权限集合、动态路由生命周期。
- `src/stores/modules/menu.ts`：菜单树、侧边栏、面包屑、首页跳转目标。
- `src/stores/modules/tabs.ts`：标签页状态。
- `src/stores/modules/ui.ts`：界面状态，如侧边栏折叠。
- `src/stores/modules/theme.ts`：主题模式、主题色、CSS 变量同步。

新增状态逻辑前，先判断应该归属哪个 store，避免职责漂移。

### 4.4 接口与类型

- `src/api/<domain>/api.ts`：接口函数。
- `src/api/<domain>/types.ts`：领域类型。
- `src/api/<domain>/constants.ts`：领域常量。
- `src/api/<domain>/index.ts`：统一导出。
- `src/utils/http/*`：请求封装、拦截器、服务地址配置。
- `src/types/*`：跨领域通用类型。

### 4.5 视图与组合逻辑

- `src/views/*`：业务页面。
- `src/composables/*`：组合式逻辑，适合抽离页面或布局复用行为。
- `src/directives/modules/*`：按钮级权限指令。

## 5. 代码风格与实现习惯

### 5.1 Vue 组件

- 统一使用 Vue 3 Composition API 与 `<script setup lang="ts">`。
- 页面入口文件优先沿用模块目录下的 `index.vue` 形式；独立页面可使用 `XxxPage.vue`。
- 页面组件名建议使用 `XxxPage`；弹窗表单组件优先使用 `XxxFormDialog.vue`。
- 非页面公共组件使用多单词命名。
- 遵循现有 ESLint/Prettier 结果，不手工对抗格式化。
- 重点关注以下规则：
  - 必须使用大括号。
  - 必须使用严格相等。
  - 不保留 `debugger`。
  - 未使用变量应清理；保留时使用 `_` 前缀。

### 5.2 CRUD 页面

- 页面层负责：查询条件、列表、分页、选择态、打开弹窗、删除、刷新数据。
- 弹窗层负责：表单状态、校验、回填、提交、关闭清理。
- 页面层建议统一命名：
  - `isListLoading`、`tableData`、`total`、`selectedIds`
  - `query`、`dialogVisible`、`isEdit`、`currentItem`
  - `getXxxList`、`handleSearch`、`handleReset`
  - `handleCreate`、`handleEdit`、`handleDelete`、`handleBatchDelete`
  - `handleDialogSuccess`
- 优先复用现有实现风格：
  - `src/views/system/role/index.vue`
  - `src/views/system/user/index.vue`

### 5.3 表单弹窗

- 推荐统一模式：
  - `defineProps` + `defineEmits` + `defineModel<boolean>()`
  - 使用 `useTemplateRef<FormInstance>()` 获取表单实例
  - `open` 时回填编辑数据
  - `closed` 时执行 `resetFields()`
  - `getFormData()` 统一做字段清洗与提交前归一化
  - `add` 与 `edit` 拆分为两个小方法
  - 使用独立的 `isSubmitLoading`
  - 成功后关闭弹窗并触发 `success`
- 布局约定：
  - 弹窗宽度优先使用 `640px`
  - 字段较少、以录入准确性为主的表单，优先使用单列布局
  - 仅当两个字段语义接近、长度接近、并排后不会造成拥挤时，才使用一行两个
  - 普通输入类控件宽度建议控制在 `320px` 左右，不必占满整行
  - 数值类控件如 `el-input-number` 宽度应明显小于普通输入框，按内容取值范围设置，一般控制在 `160px-200px`
  - `el-switch`、单选、短选择器等轻量控件按内容自然宽度展示，不为了对齐强行拉满
  - 备注、描述等长文本字段保持单独一行
- 弹窗层建议统一命名：
  - `dialogVisible`、`formRef`、`form`、`rules`
  - `isSubmitLoading`、`isEdit`、`role` / `user` / `dept` 等领域对象名
  - `open`、`closed`、`getFormData`、`add`、`edit`、`submitForm`
- 参考实现：
  - `src/views/system/role/components/RoleFormDialog.vue`
  - `src/views/system/user/components/UserFormDialog.vue`

### 5.4 API 与类型

- 接口函数命名统一为 `XxxApi`。
- 请求与响应类型命名约定：
  - 请求体：`XxxPayload`
  - 查询参数：`XxxQuery`
  - 列表项：`XxxItem`
  - 响应体：`XxxResponse`
- 统一通过 `request<T>()` 发请求，不在业务 API 中直接散落 Axios 调用。
- 服务地址通过 `ServiceName` 选择，不在 API 层写死 `baseURL`。
- 保持现有响应结构：`{ code, data, message }`。
- 现有模块如果字段类型已确定，不要只改单点；需要联动类型、Mock、表格和表单一起调整。

### 5.5 Store 与权限

- `auth` 只处理登录态与会话。
- `permission` 只处理角色、权限集合和动态路由挂载。
- `menu` 只处理菜单衍生结构与导航体验。
- 页面级权限走路由 `meta.permission` 与守卫。
- 按钮级权限走 `v-permission` 或 `v-role`。

## 6. 功能开发落点规则

### 6.1 新增页面

1. 在 `src/views/...` 新建页面组件。
2. 根据需求选择路由接入方式：
   - 固定页面：接入 `src/router/modules/*.ts`
   - 动态页面：由后端或 Mock 菜单数据驱动
3. 需要出现在导航中时，补齐 `meta.title`，按需配置 `icon`、`rank`、`hidden`。
4. 需要权限控制时，补 `meta.permission`。
5. 页面内按钮权限使用 `v-permission` 或 `v-role`。

### 6.2 新增接口域

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
- 如果接入新服务地址，先改 `src/utils/http` 相关配置。
- 不要把字段转换、消息提示、表单回填等页面逻辑塞进 `api.ts`。

### 6.3 新增权限点

- 页面级：路由增加 `meta.permission`。
- 按钮级：模板增加 `v-permission` 或 `v-role`。
- 同步更新权限来源：
  - Mock 或后端返回的 `permissions`
  - 如需展示在菜单中，还要同步 `menus`

### 6.4 新增动态菜单页面

- 菜单节点的 `component` 字段必须相对 `src/views`，且不带 `.vue`。
- `name` 必须稳定且唯一。
- 目录型节点可使用 `router-view` 或空组件配置，需与现有动态路由转换逻辑兼容。

## 7. 变更同步原则

以下改动通常需要联动更新，不要只改一处：

- 改接口字段：同步改 `types`、页面消费代码、Mock、必要文档。
- 改权限：同步改路由、按钮指令、权限数据、菜单数据。
- 改动态路由：同步验证侧边栏、面包屑、标签页、首页跳转逻辑。
- 改主题或 UI 状态：同步检查持久化逻辑与默认值兼容性。
- 改登录或初始化链路：同步检查守卫、动态路由挂载、退出登录清理。

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

修改相关模块前，建议先看：

- `docs/01-项目架构.md`
- `docs/03-RBAC与权限.md`
- `docs/05-开发与扩展.md`
- `docs/06.代码规范.md`
- `docs/07.接口和类型规范.md`
- `docs/04-Mock接口规范.md`
