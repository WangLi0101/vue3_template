<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="h-full min-h-[420px] flex items-center justify-center">
    <el-result icon="warning" title="403" sub-title="当前账号无此页面访问权限">
      <template #extra>
        <el-button type="primary" @click="router.push('/')">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>
