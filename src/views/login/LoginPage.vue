<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'
import { useMenuStore } from '@/stores/modules/menu'
import { usePermissionStore } from '@/stores/modules/permission'
import { ApiRequestError } from '@/types/http'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const menuStore = useMenuStore()
const permissionStore = usePermissionStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const formState = reactive({
  username: 'admin',
  password: 'admin123'
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async (): Promise<void> => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    loading.value = true
    try {
      await authStore.login(formState)
      menuStore.reset()
      permissionStore.reset()

      const redirect = (route.query.redirect as string) || '/'
      await router.replace(redirect)
      ElMessage.success('登录成功')
    } catch (error) {
      if (error instanceof ApiRequestError) {
        ElMessage.error(`${error.message} (HTTP ${error.httpStatus} / CODE ${error.businessCode})`)
        return
      }

      ElMessage.error(error instanceof Error ? error.message : '登录失败')
    } finally {
      loading.value = false
    }
  })
}

const loginTips = `测试账号：\nadmin / admin123（管理员）\nauditor / auditor123（审计员）`
</script>

<template>
  <div class="h-screen w-full flex items-center justify-center bg-[var(--app-bg)] p-4">
    <div class="w-full max-w-[420px] bg-[var(--app-surface)] rounded-xl shadow-sm border border-[var(--app-border)] p-8">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-[var(--app-text-primary)]">RBAC 管理后台</h1>
        <p class="text-sm text-[var(--app-text-secondary)] mt-1">Vue3 + Element Plus + Tailwind + SCSS</p>
      </div>

      <el-form ref="formRef" :model="formState" :rules="rules" label-position="top" @keyup.enter="handleLogin">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formState.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="formState.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>

        <el-button type="primary" class="w-full mt-2" :loading="loading" @click="handleLogin">登录</el-button>
      </el-form>

      <el-alert class="mt-5" type="info" :closable="false" :title="loginTips" />
    </div>
  </div>
</template>
