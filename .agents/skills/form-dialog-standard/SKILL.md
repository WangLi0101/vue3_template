---
name: form-dialog-standard
description: Use this skill when creating, refactoring, reviewing, or standardizing a Vue 3 + Element Plus `XxxFormDialog.vue` component in this repository, especially create/edit dialogs that should follow `src/views/system/role/components/RoleFormDialog.vue`, `src/views/system/user/components/UserFormDialog.vue`, and `docs/08-弹窗组件规范.md`. Trigger for requests about "表单弹窗", "FormDialog", "新增/编辑弹窗", "弹窗规范", or aligning dialog code with the project's conventions.
---

# Form Dialog Standard

## Overview

Use this skill for private create/edit dialogs built with `el-dialog` + `el-form` in this repository.

Prefer `src/views/system/role/components/RoleFormDialog.vue` as the lean baseline. Switch to `src/views/system/user/components/UserFormDialog.vue` only when the dialog needs conditional fields, richer validation, or create/edit payload differences.

Treat `docs/08-弹窗组件规范.md` as the canonical rule source for dialog classification, shared naming, and lifecycle constraints. Use this skill to accelerate execution and choose the right local baseline instead of repeating the full document.

## Workflow

1. Confirm the component is a create/edit dialog. If the task is a business action or read-only detail popup, follow `ActionDialog` or `DetailDialog` rules from `docs/08-弹窗组件规范.md` instead.
2. Keep the page/dialog boundary stable: the page opens the dialog and refreshes data after success; the dialog owns form state, validation, submission, and cleanup.
3. Implement the standard dialog lifecycle with `defineModel<boolean>()`, `open`, `closed`, `getFormData`, `add`, `edit`, and `submitForm`.
4. For edit-mode form backfill, prefer reusing the existing loop-based assignment pattern and extract it into a small method such as `assignFormFromRole` or `assignFormFromUser`, so `open` stays focused on flow control.
5. Keep project naming unchanged: `dialogVisible`, `formRef`, `form`, `rules`, `isSubmitLoading`, and `isEdit`. Prefer domain-specific props such as `role` or `user` instead of generic `row`. When coordinating with the page, prefer page-side boolean loading names such as `isListLoading`.
6. Reuse nearby implementation patterns before inventing new abstractions.
7. When the page refreshes table data after dialog success, prefer page-side names such as `getRoleList` or `getUserList` instead of generic `fetchList`.

## Baseline

Read these files first:

- `src/views/system/role/components/RoleFormDialog.vue`
- `src/views/system/user/components/UserFormDialog.vue`
- `docs/08-弹窗组件规范.md`
- `docs/CRUD页面规范.md`

Read `references/form-dialog-guidelines.md` when the request is about standards, review checklists, or choosing between the role-style and user-style dialog variants.

## Focus Areas

- Reuse the repository's standard `FormDialog` lifecycle and naming from `docs/08-弹窗组件规范.md`.
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
- stable dialog lifecycle methods and naming
- edit-mode backfill that keeps `open` concise, ideally through an `assignFormFromRole` / `assignFormFromUser` helper
- concise add/edit payload handling with `getFormData()`
- cleanup behavior that avoids stale form state on reopen
- code that remains aligned with the repository's Vue 3 + Element Plus conventions
