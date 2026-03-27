---
name: crud-page-standard
description: Use this skill when creating, refactoring, reviewing, or standardizing a Vue 3 + Element Plus CRUD page with a list page, search form, optional pagination, private form dialog, flattened API module, and optional mock endpoints. Trigger for requests about "增删改查", management pages, standard CRUD structure, or aligning a page with the project's CRUD conventions.
---

# CRUD Page Standard

## Overview

Use this skill for standard backend CRUD pages in Vue 3 + Element Plus projects, especially when the page should follow the same structure as the current user management page in this repository.

## Workflow

1. Identify whether the page is a standard CRUD page.
2. Build or review the page with the same split:
   - `index.vue` for search, table, optional pagination, delete flows, and dialog state
   - private `FormDialog.vue` for form rendering, `open/closed`, `add/edit/submitForm`
   - `src/api/system/<module>.ts` for module contracts
   - `mock/*.ts` when local mock endpoints are needed
3. Keep naming aligned with the project baseline.
4. Prefer the current user page as the implementation baseline.

## Baseline

When working in this repository, use these files as the first reference:

- `src/views/system/user/index.vue`
- `src/views/system/user/components/UserFormDialog.vue`
- `src/api/system/user.ts`
- `mock/user.ts`
- `docs/CRUD页面规范.md`

If the request is about standards or consistency, read `references/crud-guidelines.md`.

## Key Rules

- Search areas should use `el-form`.
- Dialog visibility should use `defineModel<boolean>()`.
- Private dialogs may own `add`, `edit`, and `submitForm`.
- Prefer `isEdit` over string mode flags when the dialog only has create/edit states.
- Prefer `v-model.trim` for text inputs instead of trimming repeatedly in payload builders.
- Keep payload extraction in a shared `getFormData()` and let `add/edit` handle only field differences.
- Keep list-page methods event-oriented: `fetchList`, `handleSearch`, `handleReset`, `handleCreate`, `handleEdit`, `handleDelete`, `handleBatchDelete`.

## Output Expectation

When implementing a CRUD page with this skill, produce:

- a standard list page structure
- optional pagination only when the page really needs it
- a private form dialog if the form is page-specific
- a matching flattened API module under `src/api/system/`
- matching mock endpoints when local mock is in use
- code that passes typecheck
