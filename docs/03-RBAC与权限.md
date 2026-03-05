# RBAC 与权限

## 权限模型

项目采用 RBAC（Role-Based Access Control）：

- 用户（User）
- 角色（Role）
- 权限码（Permission Code）
- 菜单（Menu）

## 登录初始化流程

1. 登录接口返回 `accessToken`
2. 前端保存 token（`localStorage`）
3. 首次进入受保护路由时，请求 `/api/auth/me`
4. 回填用户、角色、权限码、菜单树
5. 基于菜单树注入动态路由

## 权限校验类型

### 1. 路由级权限

在路由守卫里校验 `to.meta.permission`，无权限跳转 `403`。

### 2. 按钮级权限

指令：`v-permission`

示例：

```vue
<el-button v-permission="'sys:user:create'">新建用户</el-button>
```

指令文件：`src/directives/modules/permission.ts`

## Store 职责划分

- `auth store`：账号与权限原始状态（token/user/roles/permissions/menus）
- `menu store`：菜单视图模型（sidebar/breadcrumb/dynamicRoutes）
- `permission store`：路由注册生命周期（mount/reset）

## 推荐实践

- 页面按钮与接口权限码保持一致
- 前端权限仅用于体验控制，后端接口必须做最终鉴权
- 菜单 path 与路由 name 保持稳定，避免动态注册冲突
