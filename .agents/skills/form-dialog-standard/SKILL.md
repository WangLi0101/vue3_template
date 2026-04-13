---
name: form-dialog-standard
description: Use this skill when creating, refactoring, reviewing, or standardizing a Vue 3 + Element Plus `XxxFormDialog.vue` component in this repository, especially create/edit dialogs that should follow `src/views/system/role/components/RoleFormDialog.vue`, `src/views/system/user/components/UserFormDialog.vue`, and `docs/08-弹窗组件规范.md`. Trigger for requests about "表单弹窗", "FormDialog", "新增/编辑弹窗", "弹窗规范", "业务弹窗", "通用表单", or aligning dialog code with the project's conventions.
---

# Form Dialog Standard

## Overview

Use this skill for create/edit dialog work built with `el-dialog` + `el-form` in this repository.

Prefer `BusinessFormDialog` as the default path for standard CRUD pages. Use `src/views/system/role/components/RoleFormDialog.vue` as the lean baseline, and switch to `src/views/system/user/components/UserFormDialog.vue` only when the dialog needs conditional fields, richer validation, or create/edit payload differences.

Treat `docs/08-弹窗组件规范.md` as the canonical rule source for dialog classification, shared naming, and lifecycle constraints. Use this skill to accelerate execution and choose the right local baseline instead of repeating the full document.

## Workflow

1. Confirm the component is a create/edit dialog. If the task is a business action or read-only detail popup, follow `ActionDialog` or `DetailDialog` rules from `docs/08-弹窗组件规范.md` instead.
2. Decide the dialog type first: use `BusinessFormDialog` for normal CRUD, and only split into `CommonForm` or `CommonForm + ContainerDialog` when there is a real reuse or orchestration need.
3. Keep the page/dialog boundary stable. In `BusinessFormDialog`, the page opens the dialog and refreshes after success, while the dialog owns form state, validation, submission, and cleanup.
4. Implement the standard `BusinessFormDialog` lifecycle with `defineModel<boolean>()`, `open`, `closed`, `getFormData`, `add`, `edit`, and `submitForm`.
5. For edit-mode form backfill, prefer reusing the existing loop-based assignment pattern and extract it into a small method such as `assignFormFromRole` or `assignFormFromUser`, so `open` stays focused on flow control.
6. Keep project naming unchanged: `dialogVisible`, `formRef`, `form`, `rules`, `isSubmitLoading`, and `isEdit`. Prefer domain-specific props such as `role` or `user` instead of generic `row`. When coordinating with the page, prefer page-side boolean loading names such as `isListLoading`.
7. Reuse nearby implementation patterns before inventing new abstractions.
8. When the page refreshes table data after dialog success, prefer page-side names such as `getRoleList` or `getUserList` instead of generic `fetchList`.

## Baseline

Read these files first:

- `src/views/system/role/components/RoleFormDialog.vue`
- `src/views/system/user/components/UserFormDialog.vue`
- `docs/08-弹窗组件规范.md`
- `docs/CRUD页面规范.md`

Read `references/form-dialog-guidelines.md` when the request is about standards, review checklists, or choosing between the role-style and user-style dialog variants.

## Focus Areas

- Reuse the repository's standard `FormDialog` lifecycle and naming from `docs/08-弹窗组件规范.md`.
- Default to `BusinessFormDialog` for standard CRUD create/edit dialogs.
- Split out `XxxForm.vue` only when the same form must be reused across containers or submission flows.
- When the task also touches the hosting CRUD page, keep the page layout aligned with `docs/CRUD页面规范.md`: use split query/content regions, reuse `app-card`, and keep query/reset inside the query area instead of the table toolbar.
- Use `RoleFormDialog.vue` as the default baseline for lean create/edit dialogs.
- Switch to `UserFormDialog.vue` when the dialog needs mode-specific fields, richer validators, or different create/edit payload omission.
- For lean CRUD dialogs whose form fields largely mirror the incoming entity data, prefer loop-based backfill over verbose field-by-field mapping, and keep that logic inside a dedicated helper such as `assignFormFromRole` or `assignFormFromUser`.
- Keep payload normalization in `getFormData()`. Clean identifier-like fields such as code, username, phone, email, or path with `removeAllSpace()` there.
- Keep `add` and `edit` as separate small methods that directly return API calls.
- Preserve nearby behavior when the codebase and docs differ, unless the user explicitly asks to normalize to the docs.

## Output Expectation

When using this skill, produce:

- a dialog component that matches the repository's `RoleFormDialog` / `UserFormDialog` split
- a clear choice between `BusinessFormDialog` and `CommonForm`-based composition
- stable dialog lifecycle methods and naming
- edit-mode backfill that keeps `open` concise, ideally through an `assignFormFromRole` / `assignFormFromUser` helper
- concise add/edit payload handling with `getFormData()`
- cleanup behavior that avoids stale form state on reopen
- code that remains aligned with the repository's Vue 3 + Element Plus conventions
