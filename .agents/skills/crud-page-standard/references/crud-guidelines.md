# CRUD Guidelines

## Scope

This reference captures the standard CRUD page pattern used in the current Vue 3 + Element Plus project.

## Directory Pattern

```text
src/views/<module>/index.vue
src/views/<module>/components/<XxxFormDialog>.vue
src/api/<module>/api.ts
src/api/<module>/types.ts
src/api/<module>/index.ts
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
const add = async () => {
  const { confirmPassword, ...payload } = getFormData();
  return await createXxxApi(payload);
};

const edit = async () => {
  const { username, password, confirmPassword, ...payload } = getFormData();
  return await updateXxxApi({
    id: props.row!.id,
    ...payload,
  });
};
```

## Review Checklist

- Is the search area an `el-form`?
- Is dialog state handled with `defineModel<boolean>()`?
- Are `open` and `closed` present?
- Are `add/edit/submitForm` separated?
- Does `getFormData()` reduce duplication?
- Are API and types split out by module?
- If mock is used, are list/create/update/delete endpoints present?
- Does the page pass `pnpm run typecheck`?
