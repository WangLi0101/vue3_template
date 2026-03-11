# RBAC 与权限

## 当前实现概览

项目采用 RBAC（Role-Based Access Control），核心对象：

- 用户（`user`）
- 角色（`roles`）
- 权限码（`permissions`）
- 菜单树（`menus`）

路由由三部分共同组成：

- 静态路由：`/login`、`/403`、`Root`、`404`
- 模块路由：`src/router/modules/*.ts` 自动聚合到 `Root.children`
- 动态菜单路由：登录后由后端 `menus` 转换并挂载到 `Root.children`

## 权限数据契约

认证接口位于 `src/api/auth/api.ts`，使用 `MOCK` 服务（`baseURL = /api`）：

- `POST /api/auth/login`：返回 `accessToken`
- `GET /api/auth/me`：返回用户权限画像

`/api/auth/me` 返回结构：

```ts
interface ProfileResponse {
  user: { id: string; username: string; displayName: string };
  roles: string[];
  permissions: string[];
  menus: AppMenu[];
}
```

## 登录与初始化时序

1. 登录页调用 `authStore.login()`，成功后写入 `localStorage(rbac_access_token)`。
2. 进入非公开路由时，`router.beforeEach` 检查 token；无 token 跳转 `/login?redirect=...`。
3. 首次有 token 且 `!authStore.isInitialized` 时，调用 `authStore.fetchProfile()`。
4. `fetchProfile()` 内部完成：
   - `authStore.user = profile.user`
   - `permissionStore.setAccess(profile.roles, profile.permissions)`
   - `menuStore.setMenus(profile.menus)`
5. 守卫调用 `permissionStore.mountDynamicRoutes(router, menuStore.dynamicRoutes)` 注入动态路由（仅一次）。
6. 若当前是 `/`，通过 `menuStore.resolveRootRedirectTarget()` 重定向到首个可访问菜单。
7. 初始化完成后重新进入目标地址（`replace: true`）。

## 权限校验策略

### 1. 路由级（AND 语义）

守卫读取 `to.meta.permission`，使用 `permissionStore.hasAll()` 校验。
只要有一个权限码缺失，就跳转 `Forbidden(403)`。

```ts
meta: {
  permission: "sys:user:view",
}
```

### 2. 元素级：`v-permission`（OR 语义）

`v-permission` 使用 `permissionStore.hasAny()`：

- 传字符串：要求该权限
- 传数组：命中任一权限即显示

```vue
<el-button v-permission="'sys:user:create'">新建用户</el-button>
<el-button v-permission="['sys:role:create', 'sys:user:delete']">批量操作</el-button>
```

实现文件：`src/directives/modules/permission.ts`

### 3. 元素级：`v-role`（OR 语义）

`v-role` 使用 `permissionStore.hasRole()`，命中任一角色即可显示。

```vue
<el-button v-role="['super_admin', 'auditor']">角色按钮</el-button>
```

实现文件：`src/directives/modules/role.ts`

说明：当前两个指令都在 `mounted` 阶段直接移除无权限元素，默认不做后续响应式回填。

## 动态路由与菜单处理

- `buildRoutesFromMenus()` 负责将后端菜单树转换为 `RouteRecordRaw`。
- 菜单和子菜单按 `meta.rank` 升序排序；无 rank 时排在末尾。
- 支持 `component: "router-view"` 或“有 children 但未配置 component”的容器节点（自动使用 `AppRouterView`）。
- 叶子节点组件路径缺失或无效时，降级到 `NotFoundPage` 并输出警告日志。
- `permissionStore` 保存 `router.addRoute()` 的移除回调，`reset()` 时会真实卸载动态路由。

## Store 职责划分（现状）

- `auth store`：仅负责 token、用户信息、初始化状态（`token/user/isInitialized`）和登录流程。
- `permission store`：负责角色/权限集合能力（`hasAny/hasAll/hasRole`）与动态路由挂载生命周期。
- `menu store`：负责菜单原始数据和衍生能力（`sidebarMenus`、`dynamicRoutes`、面包屑、根路径重定向）。

## 开发约束建议

- 前端权限只用于可见性与导航体验，后端接口必须做最终鉴权。
- `meta.permission` 与后端权限码保持一致，避免“页面可见但接口 403”。
- 动态菜单的 `name/path/component` 需稳定且唯一，避免 `addRoute` 冲突。
- 本地联调可使用：`admin/admin123`、`auditor/auditor123`（见 `mock/data/rbac-data.ts`）。
