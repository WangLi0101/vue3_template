<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="font-semibold">角色管理</span>
        <el-button v-permission="'sys:role:create'" type="primary">新增角色</el-button>
      </div>
    </template>

    <el-empty description="此页面用于维护角色与权限码关系" />
  </el-card>
</template>
