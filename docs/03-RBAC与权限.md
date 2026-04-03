# RBAC 与权限

## 当前实现概览

项目采用 RBAC（Role-Based Access Control）模型，核心对象包括：

- 用户：`user`
- 角色：`roles`
- 权限码：`permissions`
- 菜单树：`menus`

其中：

- 用户信息由 `auth store` 管理
- 角色与权限集合由 `permission store` 管理
- 菜单树及其衍生导航由 `menu store` 管理

## 权限数据契约

认证接口位于 `src/api/auth/api.ts`，当前使用 `MOCK` 服务（`baseURL = /api`）：

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/roles`
- `GET /api/auth/permissions`
- `GET /api/auth/menus`

当前会话初始化不是单接口返回全量权限画像，而是拆成 4 个读取接口：

```ts
interface CurrentUserResponse {
  user: AuthUser;
}

interface RolesResponse {
  roles: string[];
}

interface PermissionsResponse {
  permissions: string[];
}

interface MenusResponse {
  menus: AppMenu[];
}
```

## 登录与初始化时序

1. 登录页调用 `authStore.login()`。
2. 登录成功后保存 `accessToken` 和 `refreshToken` 到本地存储。
3. 进入未声明 `meta.skipAuth` 的路由时，守卫检查 `accessToken`；无 token 则跳到 `/login?redirect=...`。
4. 当 `accessToken` 过期且 `refreshToken` 仍有效时，请求拦截器会自动刷新 token 并重试当前请求。
5. 首次有 token 且 `!authStore.isInitialized` 时，调用 `authStore.initializeSession()`。
6. `initializeSession()` 内部并行请求：
   - `getCurrentUserApi()`
   - `getRolesApi()`
   - `getPermissionsApi()`
   - `getMenusApi()`
7. 若任一接口 `code !== 0`，初始化失败，守卫会清理本地登录态并回到登录页。
8. 初始化成功后：
   - `authStore.user = 当前用户`
   - `permissionStore.setRoles(roles)`
   - `permissionStore.setPermissions(permissions)`
   - `menuStore.setMenus(menus)`
   - `tabsStore.syncHomeTag()`
9. 守卫随后挂载动态路由，并重新进入当前目标路由。

## 权限校验策略

### 1. 路由级校验

守卫读取 `to.meta.permission`，通过 `permissionStore.hasAll()` 校验。

这意味着：

- 传单个权限码：要求必须拥有该权限
- 传数组：要求全部命中

示例：

```ts
meta: {
  title: "用户管理",
  permission: "sys:user:view",
}
```

## 2. 元素级：`v-permission`

`v-permission` 使用 `permissionStore.hasAny()`，属于 OR 语义：

- 传字符串：要求拥有该权限
- 传数组：命中任一权限即可显示

```vue
<el-button v-permission="'sys:user:create'">新建用户</el-button>
<el-button v-permission="['sys:role:create', 'sys:user:delete']">批量操作</el-button>
```

实现文件：`src/directives/modules/permission.ts`

## 3. 元素级：`v-role`

`v-role` 使用 `permissionStore.hasRole()`，属于角色 OR 语义：

```vue
<el-button v-role="['super_admin', 'auditor']">审计操作</el-button>
```

实现文件：`src/directives/modules/role.ts`

## 4. 指令的当前行为

两个权限指令都在 `mounted` 阶段直接移除无权限元素。

这意味着：

- 更适合静态按钮和局部区域控制
- 不会在权限集合后续变化时自动“恢复”节点
- 仍然应该由路由守卫和后端接口做主鉴权

## 动态路由与菜单处理

- `buildRoutesFromMenus()` 负责将后端菜单树转换为 `RouteRecordRaw`
- `permissionStore.mountDynamicRoutes()` 负责挂载动态路由
- `permissionStore.reset()` 会真实卸载动态路由

当前菜单和权限是两条并行数据：

- 菜单决定导航中“出现什么”
- 权限码决定页面和按钮“能否访问/显示”

因此开发时必须确保：

- `menus` 中暴露的页面，和 `permissions` 中允许访问的页面保持一致
- 避免出现“侧边栏能看到，但进入后 403”的不一致体验

## Store 职责划分

- `auth store`
  - 管当前用户、初始化状态
  - 不直接承担角色/权限集合判断
- `permission store`
  - 管角色、权限和动态路由生命周期
  - 提供 `hasAny`、`hasAll`、`hasRole`
- `menu store`
  - 管菜单原始数据和导航衍生结果
  - 不负责权限真假判断

这种拆分的好处是：

- 登录态、访问控制、导航体验解耦
- 会话初始化可以按职责分别写入 store
- 退出登录时可以按模块清理状态

## 当前内置账号

Mock 数据位于 `mock/data/rbac-data.ts`，当前内置账号如下：

- `admin / admin123`
- `auditor / auditor123`

`admin` 拥有更完整的角色、权限和菜单；
`auditor` 用于验证受限导航和权限控制场景。

## 开发约束建议

- 前端权限只负责导航体验和可见性控制，后端接口必须做最终鉴权
- `meta.permission` 要与后端权限码保持一致，避免页面和接口权限漂移
- 动态菜单的 `name/path/component` 需要稳定且唯一，避免 `addRoute` 冲突
- 如果某个页面需要在侧边栏显示，就同时检查菜单返回和权限码返回是否一致
