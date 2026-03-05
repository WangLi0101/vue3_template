<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { id: 1, username: 'admin', role: 'super_admin', status: '启用' },
  { id: 2, username: 'auditor', role: 'auditor', status: '启用' }
])
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="font-semibold">用户管理</span>
        <div class="space-x-2">
          <el-button v-permission="'sys:user:create'" type="primary">新建用户</el-button>
          <el-button v-permission="'sys:user:delete'" type="danger" plain>批量删除</el-button>
        </div>
      </div>
    </template>

    <el-table :data="tableData" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" min-width="180" />
      <el-table-column prop="role" label="角色" min-width="180" />
      <el-table-column prop="status" label="状态" min-width="120" />
      <el-table-column label="操作" width="220">
        <template #default>
          <el-button v-permission="'sys:user:edit'" size="small" type="primary" link>编辑</el-button>
          <el-button v-permission="'sys:user:delete'" size="small" type="danger" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
