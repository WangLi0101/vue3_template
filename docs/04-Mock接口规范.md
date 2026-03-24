# Mock 接口规范

## 使用方式

项目使用 `vite-plugin-mock` 提供本地接口模拟：

- mock 目录：`mock`
- 启用位置：`vite.config.ts`
- 当前启用条件：开发服务模式下，且 `VITE_ENABLE_MOCK !== "false"`

配置摘要：

```ts
viteMockServe({
  mockPath: "mock",
  enable: enableMock,
  logger: enableMock,
});
```

说明：

- `pnpm dev` 默认启用 Mock
- 若需要对接真实后端，可通过环境变量关闭 Mock

## 响应协议

所有业务接口统一返回：

```json
{
  "code": 0,
  "data": {},
  "message": "success"
}
```

语义约定：

- HTTP 状态码：网络层、鉴权层、参数层语义
- 业务状态码 `code`：业务成功或失败语义
- `code = 0`：成功
- `code != 0`：业务失败

## 当前 Mock 接口

定义文件：`mock/auth.ts`

当前包含：

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/roles`
- `GET /api/auth/permissions`
- `GET /api/auth/menus`

数据源：

- `mock/data/rbac-data.ts`

## 认证规则

登录成功后，Mock 会返回：

```json
{
  "code": 0,
  "data": {
    "accessToken": "token-admin"
  },
  "message": "success"
}
```

后续读取用户、角色、权限、菜单时：

- 通过请求头 `Authorization: Bearer <token>` 解析当前用户
- token 规则为 `token-<username>`
- 缺少 token 时返回 `401 + code=40101`
- token 无效或登录过期时返回 `401 + code=40102`

## 当前内置账号

定义文件：`mock/data/rbac-data.ts`

- `admin / admin123`
- `auditor / auditor123`

每个账号都预置：

- 用户信息
- 角色列表
- 权限码列表
- 菜单树

## 前端解包逻辑

当前前端请求入口不是 `src/api/request.ts`，而是：

- `src/utils/http/request.ts`
- `src/utils/http/interceptors.ts`

当前行为：

- 请求拦截器自动附加 `Authorization`
- 响应拦截器校验 `code/data/message` 包络
- `code !== 0` 时调用 `handlerError()` 并抛出错误
- HTTP 异常时调用 `handlerHttpError()` 并抛出 `ApiRequestError`

## 新增 Mock 接口建议

新增接口时建议保持以下约定：

- 返回结构统一为 `{ code, data, message }`
- 能区分业务失败和 HTTP 失败
- 与真实后端路径、方法和字段名保持一致
- 涉及权限时尽量同步补齐角色、权限码和菜单数据

示例：

```ts
import type { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/api/example/list",
    method: "get",
    rawResponse(_req, res) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          code: 0,
          data: [],
          message: "success",
        }),
      );
    },
  },
] as MockMethod[];
```

## 维护建议

- 如果拆分了真实后端接口，Mock 也同步拆分，避免前后端契约不一致
- 菜单返回和权限返回要一起维护，否则容易出现导航可见但页面不可访问
- 新增演示账号时，建议同时补充用户、角色、权限和菜单四类数据，便于完整联调
