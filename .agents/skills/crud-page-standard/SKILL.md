---
name: crud-page-standard
description: Use this skill when creating, refactoring, reviewing, or standardizing a Vue 3 + Element Plus CRUD page in this repository, especially pages with search forms, table toolbars, tables, pagination, and create/edit dialogs. Trigger for requests about 列表页、CRUD 页面、查询区、表格区、筛选区、重置按钮位置, or aligning a page with the repository's management-page conventions.
---

# CRUD Page Standard

## Overview

Use this skill for repository CRUD pages such as user, role, menu, permission, or dictionary management.

Treat `docs/CRUD页面规范.md` as the canonical source for page layout, card usage, and search/toolbar separation. Use `src/views/system/role/index.vue` as the default baseline for lean management pages.

## Workflow

1. Confirm the page is a CRUD-style management page with search criteria, table content, and list-level actions.
2. Keep the page split into two regions: query area and content area.
3. Reuse the global `app-card` class for both regions instead of rebuilding rounded/border/background/padding in-page.
4. Keep `查询` and `重置` inside the query area. Make the action group the row-end operation and keep it right-aligned on desktop layouts.
5. Keep `新建`、`批量删除`、分页、表格等列表级操作 inside the content area.
6. For single-row query forms, remove the default `el-form-item` bottom margin locally so the card height stays compact.
7. Reuse nearby naming such as `isListLoading`, `getXxxList`, `handleSearch`, `handleReset`, `handleCreate`, `handleBatchDelete`, and `handleDialogSuccess`.

## Baseline

Read these files first:

- `docs/CRUD页面规范.md`
- `src/views/system/role/index.vue`
- `src/views/system/user/index.vue`
- `src/styles/index.scss`

## Focus Areas

- `no-bg-content` as the page outer container for split CRUD layouts
- `app-card` as the only default page card wrapper
- query/content separation with stable visual rhythm
- query/reset in the query region, toolbar actions in the content region
- minimal page-local CSS, only for layout corrections such as query-form alignment and `el-form-item` margin cleanup

## Output Expectation

When using this skill, produce:

- a CRUD page with split query and content regions
- shared `app-card` usage rather than duplicated card utility classes
- correct search/reset placement and alignment
- a page structure that stays consistent with the repository's management-page conventions
