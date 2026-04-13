# Form Dialog Guidelines

Use this reference when the task is about reviewing standards, choosing an implementation baseline, or checking whether a form dialog matches the repository's conventions.

Do not treat this file as a replacement for `docs/08-弹窗组件规范.md`. The doc remains the authoritative source for dialog categories, shared naming, and common lifecycle constraints; this reference only keeps the extra execution notes that are useful during implementation and review.

By default, this repository prefers `BusinessFormDialog` for standard CRUD create/edit work. Only introduce `CommonForm` or `CommonForm + ContainerDialog` when the same form really needs to be reused across containers or submission flows.

## Baseline Selection

### Prefer `RoleFormDialog.vue`

Use `src/views/system/role/components/RoleFormDialog.vue` as the first baseline when the dialog:

- has a fixed field set
- only distinguishes create vs edit
- can reuse the same form layout in both modes
- only needs light payload cleanup such as `removeAllSpace(form.value.code)`

This is the project's leanest create/edit dialog example.

### Prefer `UserFormDialog.vue`

Use `src/views/system/user/components/UserFormDialog.vue` when the dialog:

- shows mode-specific fields such as create-only password inputs
- disables fields during edit
- needs richer validators
- needs different payload omission rules between add and edit

## Standard Structure

Keep the component organized in this order:

1. `Props` and `Emits`
2. `defineProps`, `defineEmits`, `defineModel`
3. `formRef`
4. `form`
5. supporting types such as `FormKey`
6. `open`
7. `closed`
8. `rules`
9. `getFormData`
10. `add`
11. `edit`
12. `isSubmitLoading`
13. `submitForm`

Keep Vue SFC block order as `template` → `script` → `style`.

## Implementation Checklist

- Bind dialog visibility with `v-model="dialogVisible"`.
- Bind `@open="open"` and `@closed="closed"` on `el-dialog`.
- Declare `const dialogVisible = defineModel<boolean>();`.
- Declare `const formRef = useTemplateRef<FormInstance>("formRef");`.
- Keep `form` as a `ref` so `resetFields()` can reset to the declared defaults.
- Use `type FormKey = keyof typeof form.value` when replaying row data by key iteration.
- Build a shared `getFormData()` and let `add` / `edit` handle only field differences.
- Copy arrays in `getFormData()` to avoid reference reuse.
- Use `removeAllSpace()` for identifier-like fields instead of relying only on `trim`.
- Guard validation with `if (!formRef.value) return;`.
- Reset submit loading in `finally`.

## Review Checklist

- Is the dialog really a `FormDialog`, not an `ActionDialog` or `DetailDialog`?
- Is this truly a reuse-driven split, or would a single `BusinessFormDialog` be simpler?
- Are `isEdit` and `row` sufficient, or does the task really require a typed `scene`?
- Does `open` only handle replay or initialization work?
- Does `closed` rely on `resetFields()` before adding extra cleanup?
- Are API parameters assembled in `getFormData`, `add`, and `edit` instead of being scattered in `submitForm`?
- Are naming and file placement aligned with `src/views/<module>/<page>/components/XxxFormDialog.vue`?

## Subtle Repository Notes

- The current role and user dialogs emit `success`, then show `ElMessage.success(...)`, then close the dialog.
- `docs/08-弹窗组件规范.md` documents a slightly different success order.
- If the request is to follow the existing nearby implementation, preserve the local component pattern.
- If the request is explicitly to normalize standards, align the dialog to the docs and update the nearby code consistently instead of mixing orders.
