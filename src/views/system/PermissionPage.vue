<template>
  <el-space direction="vertical" :size="16" fill>
    <el-card shadow="never">
      <template #header>
        <div class="font-semibold">当前登录信息</div>
      </template>

      <div class="mb-3 text-sm text-gray-500">用户：{{ authStore.user?.displayName || "-" }}</div>
      <div class="mb-2 text-sm">角色：</div>
      <el-space wrap>
        <el-tag v-for="role in roleList" :key="role" type="info">{{ role }}</el-tag>
      </el-space>
      <div class="mb-2 mt-4 text-sm">权限：</div>
      <el-space wrap>
        <el-tag v-for="permission in permissionList" :key="permission" effect="plain">
          {{ permission }}
        </el-tag>
      </el-space>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="font-semibold">v-role 示例</div>
      </template>

      <el-alert
        class="mb-4"
        title="无匹配角色的元素会在 mounted 阶段直接移除"
        type="warning"
        :closable="false"
      />
      <el-space wrap>
        <el-button v-role="['super_admin']" type="primary"> 仅 super_admin 可见 </el-button>
        <el-button v-role="['auditor']" type="success"> 仅 auditor 可见 </el-button>
        <el-button v-role="['super_admin', 'auditor']" type="info">
          super_admin 或 auditor 可见
        </el-button>
      </el-space>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="font-semibold">v-permission 示例</div>
      </template>

      <el-space wrap>
        <el-button v-permission="'sys:user:create'" type="primary">
          需要 sys:user:create
        </el-button>
        <el-button v-permission="['sys:role:create', 'sys:user:delete']" type="warning">
          sys:role:create 或 sys:user:delete
        </el-button>
        <el-button v-permission="'sys:menu:create'" type="danger"> 需要 sys:menu:create </el-button>
      </el-space>
    </el-card>
  </el-space>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores/modules/auth";
import { usePermissionStore } from "@/stores/modules/permission";

const authStore = useAuthStore();
const permissionStore = usePermissionStore();

const roleList = computed(() => permissionStore.roles);
const permissionList = computed(() => Array.from(permissionStore.permissions));
</script>
