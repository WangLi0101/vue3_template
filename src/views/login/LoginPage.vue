<template>
  <div class="login-page">
    <section class="login-card">
      <header class="login-card__header">
        <div class="brand">
          <span class="brand__mark">R</span>
          <div class="brand__copy">
            <strong class="brand__name">RBAC Admin</strong>
            <span class="brand__subtitle">后台管理系统</span>
          </div>
        </div>

        <div class="hero">
          <h1 class="hero__title">登录系统</h1>
          <p class="hero__subtitle">请输入账号密码，进入后台管理工作区。</p>
        </div>
      </header>

      <el-form
        ref="formRef"
        class="login-form"
        :model="formState"
        :rules="rules"
        label-position="top"
        @keyup.enter="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formState.username" size="large" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formState.password"
            size="large"
            type="password"
            show-password
            placeholder="请输入密码"
          />
        </el-form-item>

        <el-button type="primary" class="submit-btn" :loading="loading" @click="handleLogin">
          登录
        </el-button>
      </el-form>

      <div class="account-panel">
        <span class="account-panel__label">测试账号</span>
        <p class="account-panel__item">管理员：admin / admin123</p>
        <p class="account-panel__item">审计员：auditor / auditor123</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const formRef = ref<FormInstance>();
const loading = ref(false);

const formState = reactive({
  username: "admin",
  password: "admin123",
});

const rules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const handleLogin = async (): Promise<void> => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    loading.value = true;
    try {
      const loginSuccess = await authStore.login(formState);
      if (!loginSuccess) {
        return;
      }

      const redirect = (route.query.redirect as string) || "/";
      await router.replace(redirect);
      ElMessage.success("登录成功");
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style scoped lang="scss">
.login-page {
  display: grid;
  min-height: 100vh;
  padding: 24px;
  place-items: center;
  background: linear-gradient(180deg, rgb(255 255 255 / 0.5), transparent), var(--app-bg);
}

.login-card {
  width: min(420px, 100%);
  padding: 32px;
  border: 1px solid var(--app-border);
  border-radius: 18px;
  background-color: var(--app-surface);
  box-shadow: 0 18px 40px rgb(15 23 42 / 0.08);
}

.login-card__header {
  margin-bottom: 28px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.brand__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background-color: rgb(var(--app-primary-rgb) / 0.92);
}

.brand__copy {
  display: flex;
  flex-direction: column;
}

.brand__name {
  font-size: 15px;
  font-weight: 700;
  color: var(--app-text-primary);
}

.brand__subtitle {
  font-size: 12px;
  color: var(--app-text-secondary);
}

.hero {
  margin-top: 28px;
}

.hero__title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--app-text-primary);
}

.hero__subtitle {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--app-text-secondary);
}

.login-form {
  width: 100%;
}

.submit-btn {
  width: 100%;
  height: 44px;
  margin-top: 8px;
  border: 0;
  border-radius: 10px;
  font-weight: 600;
}

.account-panel {
  margin-top: 20px;
  padding: 14px 16px;
  border: 1px solid var(--app-border);
  border-radius: 12px;
  background-color: var(--app-bg);
}

.account-panel__label {
  display: inline-flex;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--app-text-secondary);
}

.account-panel__item {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--app-text-primary);
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-form-item__label) {
  margin-bottom: 6px;
  font-size: 13px;
  color: var(--app-text-secondary);
}

:deep(.el-input__wrapper) {
  min-height: 44px;
  border-radius: 10px;
  box-shadow: 0 0 0 1px var(--app-border) inset;
  background-color: var(--app-surface);
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px rgb(var(--app-primary-rgb) / 0.9) inset;
}

@media (width <= 640px) {
  .login-page {
    padding: 16px;
  }

  .login-card {
    padding: 24px;
    border-radius: 16px;
  }

  .hero {
    margin-top: 24px;
  }

  .hero__title {
    font-size: 24px;
  }
}
</style>
