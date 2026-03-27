# CRUD Guidelines

## Scope

This reference captures the standard CRUD page pattern used in the current Vue 3 + Element Plus project.

For generic dialog rules in this repository, also follow `docs/08-弹窗组件规范.md`.

## Directory Pattern

```text
src/views/system/<module>/index.vue
src/views/system/<module>/components/<XxxFormDialog>.vue
src/api/system/<module>/api.ts
src/api/system/<module>/types.ts
src/api/system/<module>/index.ts
mock/<module>.ts
```

## Page Responsibilities

### `index.vue`

- query form
- table
- pagination
- delete and batch delete
- dialog open state
- current row state
- list refresh

### `FormDialog.vue`

- form fields
- form validation
- `open`
- `closed`
- `getFormData`
- `add`
- `edit`
- `submitForm`

For non-CRUD business dialogs:

- use `XxxActionDialog.vue` for business actions
- use `XxxDetailDialog.vue` for read-only details
- keep concrete naming and responsibilities aligned with `docs/08-弹窗组件规范.md`

## Naming Baseline

### List page state

- `query`
- `queryFormRef`
- `tableData`
- `total`
- `loading`
- `selectedIds`
- `dialogVisible`
- `isEdit`
- `currentRow`

### List page methods

- `fetchList`
- `handleSearch`
- `handleReset`
- `handleSizeChange`
- `handleSelectionChange`
- `handleCreate`
- `handleEdit`
- `handleDelete`
- `handleBatchDelete`
- `handleDialogSuccess`

### Dialog state and methods

- `dialogVisible`
- `formRef`
- `form`
- `rules`
- `isSubmitLoading`
- `open`
- `closed`
- `getFormData`
- `add`
- `edit`
- `submitForm`

## Search Area Pattern

- use `el-form`
- use `el-form-item`
- reset with `resetFields()`
- set page number to `1` before a new search

## Dialog Pattern

- use `defineModel<boolean>()` for visibility
- use `useTemplateRef<FormInstance>("formRef")`
- populate edit data in `open`
- reset with `formRef.value?.resetFields()` in `closed`
- emit `success` after a successful submit

## Form Pattern

- use `ref({ ... })` for `form`
- use `reactive<FormRules<typeof form.value>>` for rules
- prefer `v-model.trim` for text input fields

Recommended payload helper:

```ts
const getFormData = () => ({
  ...form.value,
  roleIds: [...form.value.roleIds],
});
```

## Submit Pattern

Keep `add` and `edit` separate, but avoid duplicating all field extraction:

```ts
const add = () => {
  const { confirmPassword, ...payload } = getFormData();
  return createXxxApi(payload);
};

const edit = () => {
  const { username, password, confirmPassword, ...payload } = getFormData();
  return updateXxxApi({
    id: props.row!.id,
    ...payload,
  });
};
```

## Review Checklist

- Is the search area an `el-form`?
- Is dialog state handled with `defineModel<boolean>()`?
- Are `open` and `closed` present?
- Is `success` emitted after a successful submit?
- Are `add/edit/submitForm` separated?
- Do `add/edit` use concise direct returns?
- Does `getFormData()` reduce duplication?
- Are API and types split out by module?
- If mock is used, are list/create/update/delete endpoints present?
- Does the page pass `pnpm run typecheck`?
