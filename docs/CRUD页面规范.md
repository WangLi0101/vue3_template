# CRUD 页面规范

## 1. 适用范围

适用于后台常见的查询筛选 + 表格列表 + 分页/操作类页面，例如：

- 用户管理
- 角色管理
- 菜单管理
- 权限管理
- 字典管理

## 2. 页面结构

CRUD 页面统一拆为两个区域：

1. 查询区
2. 内容区

两个区域都应使用统一卡片容器类：

```html
<div class="app-card">...</div>
```

约定：

- 查询区与内容区的圆角、边框、背景、内边距保持一致
- 页面外层使用 `no-bg-content`，由页面自己控制分区，不再额外包一层大白底
- 查询区与内容区之间统一使用 `16px` 左右的垂直间距，优先使用 `gap-4`

## 3. 卡片样式

全局公共类定义在：

- `src/styles/index.scss`

当前统一使用：

```scss
.app-card {
  @apply rounded-lg border border-app-border bg-app-surface p-5;
}
```

约束：

- 不要在页面里重复手写 `rounded + border + bg + padding`
- 不要为查询区单独使用另一套圆角或边距
- 只有出现明确的新视觉规范时，才允许扩展新的公共容器类

## 4. 查询区规范

查询区负责：

- 查询条件输入
- 查询
- 重置

建议结构：

```html
<div class="app-card">
  <el-form class="xxx-query-form">
    <!-- 查询字段 -->
    <el-form-item class="xxx-query-form__actions">
      <el-button type="primary">查询</el-button>
      <el-button>重置</el-button>
    </el-form-item>
  </el-form>
</div>
```

约定：

- 查询按钮与重置按钮必须放在查询区内部，不放到内容区工具栏
- 查询按钮在前，重置按钮在后
- 按钮组作为查询区的行尾操作，桌面端默认右对齐
- 查询区只有一行时，应去掉 `el-form-item` 默认的底部间距，避免卡片底部显空
- 查询条件较少时，优先保持单行布局；空间不足时允许自动换行

## 5. 内容区规范

内容区负责：

- 新建
- 批量删除
- 表格
- 分页

约定：

- 工具栏放在内容区顶部
- 新建、批量删除等列表级操作归内容区，不混入查询区
- 表格容器优先使用 `min-h-0 flex-1` 以适配剩余高度
- 分页放在内容区底部，和表格保持同一张卡片

## 6. 命名建议

- 页面外层：`no-bg-content`
- 查询表单：`xxx-query-form`
- 查询按钮组：`xxx-query-form__actions`
- 列表加载态：`isListLoading`
- 列表方法：`getXxxList`

## 7. 参考实现

- `src/views/system/role/index.vue`
- `src/views/system/user/index.vue`
