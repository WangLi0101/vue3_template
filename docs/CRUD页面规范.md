# CRUD页面规范

## 1. 目标

本规范用于统一后台标准 CRUD 页面写法，减少不同页面之间的结构漂移、命名差异和维护成本。

当前基准页面：

- `src/views/system/user/index.vue`
- `src/views/system/user/components/UserFormDialog.vue`

适用场景：

- 标准后台列表页
- 包含查询、新增、编辑、删除、批量删除的管理页面
- 分页按页面实际需要决定，可选

## 2. 推荐目录结构

```text
src/
  views/
    system/
      xxx/
        index.vue
        components/
          XxxFormDialog.vue
  api/
    system/
      xxx.ts
mock/
  xxx.ts
```

要求：

- 列表页使用 `index.vue`
- 页面私有弹窗放在同级 `components/`
- 接口与类型优先收敛在 `api/模块名.ts`
- 本地联调时同步补 `mock/`

## 3. 页面职责拆分

### 3.1 `index.vue`

负责：

- 查询表单
- 表格展示
- 分页状态与分页交互（仅在页面需要分页时）
- 单删与批量删除
- 弹窗开关
- 当前编辑行数据
- 列表刷新

不负责：

- 弹窗内部表单提交细节
- 新增/编辑表单校验细节

### 3.2 `FormDialog.vue`

负责：

- 表单展示
- 新增/编辑表单校验
- 弹窗打开时表单回显
- 弹窗关闭时重置表单
- `add / edit / submitForm`

不负责：

- 列表分页状态与分页交互
- 表格数据刷新
- 删除逻辑

## 4. 推荐命名

### 4.1 列表页

- `query`
- `queryFormRef`
- `tableData`
- `loading`
- `selectedIds`
- `dialogVisible`
- `isEdit`
- `currentRow`
- `roleOptions`

按需补充：

- `total`
- `pageNum / pageSize`

方法命名：

- `fetchList`
- `fetchRoleOptions`
- `handleSearch`
- `handleReset`
- `handleSelectionChange`
- `handleCreate`
- `handleEdit`
- `handleDelete`
- `handleBatchDelete`
- `handleDialogSuccess`

有分页时再补：

- `handleSizeChange`

### 4.2 弹窗

- `dialogVisible`
- `formRef`
- `form`
- `rules`
- `isSubmitLoading`

方法命名：

- `open`
- `closed`
- `getFormData`
- `add`
- `edit`
- `submitForm`

说明：

- `fetchXxx` 用于“请求数据”
- `handleXxx` 用于“处理页面交互事件”
- `open / closed` 用于和 `el-dialog` 事件保持一致

## 5. 查询区规范

查询区统一使用 `el-form`，不要直接堆输入框。

原因：

- 便于使用 `el-form-item` 统一布局
- 便于 `resetFields()`
- 后续扩展更多筛选项更稳定

推荐结构：

```vue
<el-form ref="queryFormRef" :model="query" inline>
  <el-form-item label="用户名" prop="username">
    <el-input v-model.trim="query.username" />
  </el-form-item>
  <el-form-item label="状态" prop="status">
    <el-select v-model="query.status" clearable />
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="handleSearch">查询</el-button>
    <el-button @click="handleReset">重置</el-button>
  </el-form-item>
</el-form>
```

约定：

- 有分页时，查询前重置页码到第 1 页
- 重置时调用 `resetFields()`，再刷新列表

## 6. 列表区规范

列表区建议包含：

- 工具栏
- 表格
- 分页（可选）

默认能力：

- 单选/多选
- 单删
- 批量删除
- 刷新
- 新增/编辑入口

推荐：

- 使用 `row-key`
- 删除前统一二次确认
- 删除成功后直接刷新列表

## 7. 弹窗规范

弹窗显隐统一使用 `defineModel<boolean>()`：

```ts
const dialogVisible = defineModel<boolean>();
```

打开与关闭：

```ts
const open = () => {
  if (props.isEdit && props.row) {
    for (const key of Object.keys(form.value) as FormKey[]) {
      if (key in props.row) {
        form.value[key] = props.row[key as keyof UserItem] as never;
      }
    }
  }
};

const closed = () => {
  formRef.value?.resetFields();
};
```

说明：

- 编辑时在 `open` 中回显
- 关闭时在 `closed` 中重置
- 私有弹窗允许直接调用新增/编辑接口

## 8. 表单规范

推荐：

- `form` 使用 `ref({})`
- `rules` 使用 `reactive<FormRules<typeof form.value>>`
- 文本输入优先使用 `v-model.trim`

示例：

```vue
<el-input v-model.trim="form.username" />
```

公共数据提取：

```ts
const getFormData = () => ({
  ...form.value,
  roleIds: [...form.value.roleIds],
});
```

说明：

- 使用 `...form.value` 降低后续新增字段的维护成本
- 数组字段单独拷贝，避免引用污染

## 9. 新增与编辑提交规范

弹窗内部保留独立的 `add` 和 `edit` 方法，不要把所有逻辑直接塞进 `submitForm`。

推荐结构：

```ts
const add = async () => {
  const { confirmPassword, ...payload } = getFormData();
  return await createXxxApi(payload);
};

const edit = async () => {
  const { password, confirmPassword, ...payload } = getFormData();
  return await updateXxxApi({
    id: props.row!.id,
    ...payload,
  });
};

const submitForm = () => {
  if (!formRef.value) return;

  formRef.value.validate(async (valid) => {
    if (!valid) return;

    isSubmitLoading.value = true;
    const res = props.isEdit ? await edit() : await add();
    isSubmitLoading.value = false;

    if (res.code === 0) {
      emit("success");
      dialogVisible.value = false;
    }
  });
};
```

## 10. API 与类型规范

每个 CRUD 模块默认使用单文件：

- `src/api/system/xxx.ts`

推荐做法：

- 在一个文件中同时维护接口方法和相关类型
- 模块变复杂后，再拆分为文件夹结构，不要过早分层

推荐接口：

- `getXxxListApi`
- `createXxxApi`
- `updateXxxApi`
- `deleteXxxApi`
- `batchDeleteXxxApi`
- `getXxxOptionsApi`

推荐类型：

- `XxxItem`
- `XxxListQuery`
- `XxxListResponse`
- `CreateXxxPayload`
- `UpdateXxxPayload`

说明：

- 如果页面没有分页，可不定义 `pageNum / pageSize / total`
- 如果页面没有选项型依赖，可不定义 `getXxxOptionsApi`

## 11. Mock规范

开发环境若使用 `vite-plugin-mock`，新增 CRUD 页面时同步补充：

- 列表查询
- 新增
- 编辑
- 删除
- 批量删除
- 下拉选项

要求：

- 返回结构统一 `{ code, data, message }`
- 字段命名与真实接口保持一致

## 12. 验收要求

新增一个 CRUD 页面后，至少确认：

1. 查询、重置可用；有分页时再确认分页可用
2. 新增成功后列表可刷新
3. 编辑时弹窗能正确回显
4. 关闭弹窗后再次打开无脏数据
5. 单删和批量删除可用
6. `pnpm run typecheck` 通过

## 13. 落地建议

后续新增标准 CRUD 页面时，优先直接参照以下文件实现：

- `src/views/system/user/index.vue`
- `src/views/system/user/components/UserFormDialog.vue`
- `src/api/system/user.ts`
- `mock/user.ts`

不建议一开始就做过度抽象。先在 2 到 3 个页面中复用这套结构，等模式稳定后，再考虑抽公共 `composable` 或模板。
