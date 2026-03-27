# AGENTS.md

本文件为 AI 编码代理提供项目上下文、实现约束与交付准则，适用于当前仓库根目录及其所有子目录。

## 1. 使用目标

代理在本项目中工作时，应优先做到以下几点：

1. **遵循现有模式**：优先复用项目中已有实现，避免引入新的风格分支。
2. **小步且精确**：仅修改与任务直接相关的文件，不顺手重构无关代码。
3. **修复根因**：能从源头解决的问题，不做表层补丁式修改。
4. **保持可通过检查**：修改后尽量保证类型、Lint、格式化规则可通过。
5. **文档同步更新**：若改动影响约定、结构、命名或用法，应同步更新相关文档。

## 2. 项目概览

- 项目类型：Vue 3 RBAC 管理后台
- 技术核心：Vue 3 + TypeScript + Vite 8 + Element Plus + Pinia
- UI 方案：Element Plus + Tailwind CSS + SCSS
- 状态管理：Pinia + persistedstate plugin
- 路由方案：Vue Router 4
- 网络请求：Axios
- Mock 方案：vite-plugin-mock
- 包管理器：`pnpm`

## 3. 环境要求

- Node.js：`^20.19.0 || >=22.12.0`
- pnpm：`>=10 <11`

代理执行命令时默认使用 `pnpm`，不要混用 `npm`、`yarn` 或其他包管理器。

## 4. 常用命令

```bash
# 开发
pnpm dev

# 构建
pnpm run build:dev
pnpm run build:staging
pnpm run build:prod
pnpm run preview

# 检查
pnpm run typecheck
pnpm run lint
pnpm run lint:fix
pnpm run format
pnpm run format:check
pnpm run check
```

说明：

- `pnpm run check` = `typecheck + lint`
- 提交前会执行 `pnpm run check` 与 `pnpm run format:check`

## 5. 目录结构

```text
src/
├── api/              # API 模块，按业务域组织
├── assets/           # 静态资源
├── components/       # 公共组件
├── composables/      # 组合式函数
├── config/           # 配置文件
├── directives/       # 自定义指令
├── layout/           # 布局组件
├── router/           # 路由配置
├── stores/           # Pinia 状态管理
├── styles/           # 全局样式
├── types/            # 全局类型定义
├── utils/            # 工具函数
└── views/            # 页面组件
mock/                 # Mock 数据
docs/                 # 项目文档
```

## 6. 代理实现原则

### 6.1 修改策略

- 优先查找相邻模块、同类页面、同业务域实现后再动手。
- 若用户要求新增页面、表单、弹窗、接口，优先参考已有同类目录结构。
- 不主动修改无关命名、排序、文件位置、导出方式。
- 除非任务明确要求，否则不要引入新依赖。
- 除非任务明确要求，否则不要大规模格式化整个仓库。

### 6.2 输出质量

- 保持 TypeScript 严格模式兼容。
- 避免使用 `any`，未知结构使用 `unknown`。
- 类型导入必须使用 `import type`。
- 代码应与现有风格保持一致，避免“看起来像另一套模板”。

### 6.3 优先参考

以下内容优先作为实现基准：

- CRUD 页面：参考 `src/views/system/user/`
- API 模块：参考 `src/api/system/user/`
- 详细规范：参考 `docs/` 目录对应文档

## 7. 代码规范

### 7.1 Prettier

- 行宽：100
- 缩进：2 空格
- 引号：双引号
- 分号：必须保留
- 尾随逗号：全部保留
- 箭头函数参数括号：始终保留
- 换行符：LF
- 使用 `prettier-plugin-tailwindcss` 自动排序 Tailwind 类名

### 7.2 ESLint 关键规则

- `curly: ["error", "all"]`：所有控制语句必须使用花括号
- `eqeqeq: ["error", "always"]`：必须使用严格相等
- `no-debugger: "error"`：禁止 `debugger`
- `no-console: "warn"`：仅允许 `console.warn` / `console.error`
- `@typescript-eslint/consistent-type-imports: "error"`：类型导入必须使用 `import type`
- `@typescript-eslint/no-unused-vars: "error"`：未使用变量会报错，`_` 前缀例外
- `vue/block-order`：Vue SFC 块顺序必须为 `template` → `script` → `style`
- `vue/padding-line-between-blocks: ["error", "always"]`：SFC 块之间必须保留空行
- `vue/multi-word-component-names: "error"`：组件名必须为多词，`Index` 例外
- `vue/prefer-use-template-ref: "error"`：优先使用 `useTemplateRef`

### 7.3 TypeScript 约定

- 开启严格模式
- 路径别名：`@/*` → `src/*`
- 对象结构优先使用 `interface`
- 联合类型、映射类型、工具类型优先使用 `type`

## 8. 命名约定

| 类型        | 命名格式          | 示例                       |
| ----------- | ----------------- | -------------------------- |
| 组件文件    | PascalCase        | `UserFormDialog.vue`       |
| 组合式函数  | `use` + camelCase | `useBreadcrumbs.ts`        |
| Store 模块  | camelCase         | `useAuthStore`             |
| API 函数    | camelCase + `Api` | `getUserListApi`           |
| 类型 / 接口 | PascalCase        | `UserItem`、`LoginPayload` |
| 常量        | UPPER_SNAKE_CASE  | `USER_STATUS`              |

## 9. Vue 组件约定

### 9.1 推荐结构

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { FormInstance } from "element-plus";

defineOptions({ name: "ComponentName" });

const props = defineProps<{
  /* ... */
}>();

const emit = defineEmits<{
  /* ... */
}>();

const loading = ref(false);
const formData = reactive({
  /* ... */
});

const handleSubmit = async () => {
  /* ... */
};

onMounted(() => {
  /* ... */
});
</script>

<style scoped lang="scss">
/* 样式 */
</style>
```

### 9.2 编写要求

- 使用 Vue 3 Composition API 与 `<script setup>`
- 组件名应与文件职责一致，且使用多词命名
- Props、Emits、状态、方法、生命周期建议按固定顺序组织
- 模板引用优先使用 `useTemplateRef`
- 关键标识字段（如用户名、编码、路径、手机号、邮箱）不要只依赖 `trim`，优先在 `getFormData()`、查询请求参数或提交载荷中使用 `removeAllSpace()` 去除所有空白字符

## 10. API 模块规范

### 10.1 推荐目录结构

```text
src/api/system/user/
├── api.ts
├── types.ts
├── constants.ts
└── index.ts
```

### 10.2 编写规范

```ts
import { request } from "@/utils/http";
import type { UserListQuery, UserListResponse } from "./types";

export const getUserListApi = (params: UserListQuery) => {
  return request<UserListResponse>("/system/users/list", "MOCK", {
    method: "post",
    data: params,
  });
};
```

### 10.3 类型命名

- 请求体：`XxxPayload`
- 查询参数：`XxxQuery`
- 列表项：`XxxItem`
- 响应体：`XxxResponse`

### 10.4 响应结构

```ts
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}
```

约定：`code === 0` 表示成功。

## 11. CRUD 页面规范

新增或改造 CRUD 页面时，优先对齐 `src/views/system/user/` 的组织方式。

### 11.1 列表页推荐命名

- `query`：查询参数
- `queryFormRef`：查询表单引用
- `tableData`：表格数据
- `loading`：加载状态
- `selectedIds`：选中 ID 集合
- `dialogVisible`：弹窗显示状态
- `isEdit`：是否编辑模式
- `currentRow`：当前编辑行

### 11.2 方法命名

- `fetchList`：获取列表
- `handleSearch`：执行查询
- `handleCreate`：新增
- `handleEdit`：编辑
- `handleDelete`：删除
- `handleBatchDelete`：批量删除

### 11.3 弹窗组件要求

- 使用 `defineModel<boolean>()` 管理显隐
- 在 `open` 回调中处理数据回显
- 在 `closed` 回调中重置表单状态
- 关闭弹窗时，表单重置优先使用 `formRef.value?.resetFields()`
- 除非存在 `resetFields()` 无法覆盖的额外本地状态，否则不要额外引入 `createDefaultForm` 一类初始化函数

## 12. 错误处理约定

### 12.1 API 调用

```ts
const response = await someApi(params);
if (response.code !== 0) {
  return;
}
```

### 12.2 删除确认

```ts
try {
  await ElMessageBox.confirm("确认删除？", "提示", { type: "warning" });
} catch {
  return;
}
```

要求：

- 业务失败时直接返回，不继续执行后续逻辑
- 用户取消确认时直接返回，不提示错误

## 13. 提交前检查

Husky 会在提交前执行以下命令：

- `pnpm run check`
- `pnpm run format:check`

代理在可行时应确保改动不会破坏以上检查。

## 14. 文档索引

如需更详细规范，请优先查看 `docs/` 目录：

- `docs/01-项目架构.md`：架构设计
- `docs/02-路由使用.md`：路由规范
- `docs/03-RBAC与权限.md`：权限模型
- `docs/04-Mock接口规范.md`：Mock 规范
- `docs/06.代码规范.md`：详细代码规范
- `docs/07.接口和类型规范.md`：API 与类型规范
- `docs/08-弹窗组件规范.md`：弹窗规范
- `docs/CRUD页面规范.md`：CRUD 页面规范

## 15. 给代理的最终提醒

在开始实现前，先判断“是否已有相似实现”；在提交修改前，再检查以下四项：

1. 命名是否与本仓库一致
2. 类型是否完整且无 `any`
3. 结构是否沿用现有模式
4. 是否需要同步更新文档或导出
