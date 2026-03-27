# AGENTS.md

本文件作用于当前仓库根目录及其全部子目录。

## 通用要求

- 修改代码时，优先遵守 `docs/README.md` 中登记的项目文档。
- 涉及接口、类型、Mock、代码风格时，同时参考对应文档：
  - `docs/06.代码规范.md`
  - `docs/07.接口和类型规范.md`
  - `docs/04-Mock接口规范.md`

## 弹窗组件规范

- 所有弹窗组件统一遵守 `docs/08-弹窗组件规范.md`
- 不要把所有弹窗都设计成 CRUD 的 `FormDialog`
- 先判断弹窗类型，再决定实现方式：
  - 新增 / 编辑 / 带输入项提交：`XxxFormDialog.vue`
  - 审批 / 分配 / 发布 / 重置 / 同步等业务动作：`XxxActionDialog.vue`
  - 查看详情 / 日志 / 只读预览：`XxxDetailDialog.vue`

### 状态与事件约束

- 弹窗显隐统一使用 `defineModel<boolean>()`
- 弹窗统一实现 `open` 与 `closed`
- 成功后统一通过 `success` 事件通知父组件
- 页面层只负责开关、传上下文、成功后刷新
- 弹窗内部负责表单、校验、详情拉取、提交逻辑

### Props 约束

- 只有“新增 / 编辑”两种状态时，优先使用 `isEdit: boolean`
- 超过两种业务场景时，使用 `scene` 联合类型
- 传入当前对象时，统一优先命名为 `row`

### 命名约束

- 弹窗可见性统一命名为 `dialogVisible`
- 表单引用统一命名为 `formRef`
- 表单数据统一命名为 `form`
- 表单规则统一命名为 `rules`
- 表单提交 loading 优先命名为 `isSubmitLoading`
- 业务动作提交 loading 优先命名为 `isSubmitting`

## CRUD 页面补充

- 标准 CRUD 页面同时遵守 `docs/CRUD页面规范.md`
- CRUD 页面中的私有表单弹窗，优先参考：
  - `src/views/system/user/components/UserFormDialog.vue`
  - `src/views/system/role/components/RoleFormDialog.vue`
