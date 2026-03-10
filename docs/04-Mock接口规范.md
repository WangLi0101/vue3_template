# Mock 接口规范

## 使用方式

项目使用 `vite-plugin-mock`：

- mock 目录：`mock`
- 启用配置：`vite.config.ts` 的 `viteMockServe({ mockPath: 'mock' })`

## 响应协议

统一结构：

```json
{
  "code": 0,
  "data": {},
  "message": "success"
}
```

语义约定：

- HTTP 状态码：请求层/鉴权层语义（如 400、401）
- 业务状态码 `code`：业务结果语义（`0` 成功，非 0 失败）

## 现有接口

文件：`mock/auth.ts`

- `POST /api/auth/login`
- `GET /api/auth/me`

数据源：`mock/data/rbac-data.ts`

## 前端解包逻辑

文件：`src/api/request.ts`

- 非 `code === 0`：抛出 `ApiRequestError`
- 保留 `httpStatus` 与 `businessCode` 便于 UI 提示

## 新增 Mock 接口示例

```ts
import type { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/api/example/list",
    method: "get",
    statusCode: 200,
    response: () => ({ code: 0, data: [], message: "success" }),
  },
] as MockMethod[];
```
