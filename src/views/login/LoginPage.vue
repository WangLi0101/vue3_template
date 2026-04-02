<template>
  <div class="login-wrapper">
    <!-- Abstract Animated Background -->
    <div class="ambient-background">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="noise-overlay"></div>
    </div>

    <div class="login-container">
      <div class="login-card">
        <!-- Left Side: Brand & Hero (Hidden on small screens) -->
        <div class="login-showcase hidden md:flex">
          <div class="showcase-content">
            <div class="brand-logo">
              <span class="logo-icon">R</span>
              <span class="logo-text">RBAC Admin</span>
            </div>
            <div class="showcase-text">
              <h2 class="title">欢迎使用控制后台</h2>
              <p class="subtitle">高效、安全、现代化的权限管理系统，助您轻松掌控全局。</p>
            </div>
          </div>
          <div class="glass-decoration"></div>
        </div>

        <!-- Right Side: Login Form -->
        <div class="login-form-wrapper">
          <div class="mobile-brand flex md:hidden">
            <span class="logo-icon">R</span>
            <span class="logo-text">RBAC Admin</span>
          </div>

          <div class="form-header">
            <h1 class="form-title">登录系统</h1>
            <p class="form-subtitle">请输入您的账号密码</p>
          </div>

          <el-form
            ref="formRef"
            class="login-form"
            :model="formState"
            :rules="rules"
            label-position="top"
            size="large"
            @keyup.enter="handleLogin"
          >
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="formState.username"
                placeholder="请输入用户名"
                class="custom-input"
              />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="formState.password"
                type="password"
                show-password
                placeholder="请输入密码"
                class="custom-input"
              />
            </el-form-item>

            <el-button type="primary" class="submit-btn" :loading="loading" @click="handleLogin">
              {{ loading ? "登录中..." : "立即登录" }}
            </el-button>
          </el-form>

          <div class="account-hint">
            <div class="hint-title">测试账号</div>
            <div class="hint-list">
              <div class="hint-item"><span>管理员:</span> <code>admin / admin123</code></div>
              <div class="hint-item"><span>审计员:</span> <code>auditor / auditor123</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { reactive, ref, useTemplateRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";
import { removeAllSpace } from "@/utils/tool";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const formRef = useTemplateRef<FormInstance>("formRef");
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
      const loginSuccess = await authStore.login({
        username: removeAllSpace(formState.username),
        password: formState.password,
      });
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
@keyframes blob-bounce {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  33% {
    transform: translate(30px, -50px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.login-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  overflow: hidden;
  background-color: var(--app-bg);
  box-sizing: border-box;
}

.ambient-background {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: var(--app-bg);
}

.blob {
  position: absolute;
  filter: blur(80px);
  opacity: 0.7;
  animation: blob-bounce 15s infinite alternate ease-in-out;
  border-radius: 50%;
}

.blob-1 {
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgb(59 130 246 / 40%) 0%, transparent 70%);
  animation-delay: 0s;
}

.blob-2 {
  bottom: -20%;
  right: -10%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, rgb(139 92 246 / 30%) 0%, transparent 70%);
  animation-delay: -5s;
}

.blob-3 {
  top: 40%;
  left: 60%;
  width: 40vw;
  height: 40vw;
  background: radial-gradient(circle, rgb(14 165 233 / 35%) 0%, transparent 70%);
  animation-delay: -10s;
}

.noise-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
  pointer-events: none;
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1000px;
  margin: 20px;
  padding: 0 20px;
  perspective: 1000px;
}

.login-card {
  display: flex;
  overflow: hidden;
  border: 1px solid var(--app-border);
  border-radius: 24px;
  background: var(--app-surface);
  box-shadow:
    0 40px 80px rgb(0 0 0 / 10%),
    inset 0 0 0 1px rgb(255 255 255 / 20%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transform: translateY(0);
  transition:
    transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.4s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow:
      0 50px 100px rgb(0 0 0 / 15%),
      inset 0 0 0 1px rgb(255 255 255 / 30%);
  }
}

html.dark .login-card {
  background: rgb(30 41 59 / 70%);
  box-shadow:
    0 40px 80px rgb(0 0 0 / 40%),
    inset 0 0 0 1px rgb(255 255 255 / 5%);

  &:hover {
    box-shadow:
      0 50px 100px rgb(0 0 0 / 50%),
      inset 0 0 0 1px rgb(255 255 255 / 10%);
  }
}

.login-showcase {
  position: relative;
  flex: 1.2;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(
    135deg,
    rgb(var(--app-primary-rgb) / 10%) 0%,
    rgb(var(--app-primary-rgb) / 2%) 100%
  );
  border-right: 1px solid var(--app-border);
  overflow: hidden;
}

.showcase-content {
  z-index: 2;
}

.brand-logo,
.mobile-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.mobile-brand {
  margin-bottom: 32px;
}

.logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, rgb(var(--app-primary-rgb)), #6366f1);
  box-shadow: 0 8px 16px rgb(var(--app-primary-rgb) / 30%);
}

.logo-text {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--app-text-primary);
}

.showcase-text {
  margin-top: auto;
  margin-bottom: 40px;
}

.title {
  font-size: 36px;
  font-weight: 800;
  line-height: 1.2;
  color: var(--app-text-primary);
  margin-bottom: 16px;
  letter-spacing: -1px;
}

.subtitle {
  font-size: 16px;
  line-height: 1.6;
  color: var(--app-text-secondary);
  max-width: 80%;
}

.glass-decoration {
  position: absolute;
  right: -20%;
  bottom: -10%;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgb(255 255 255 / 40%), transparent);
  backdrop-filter: blur(10px);
  border: 1px solid rgb(255 255 255 / 20%);
  transform: rotate(-15deg);
  pointer-events: none;
}

html.dark .glass-decoration {
  background: linear-gradient(135deg, rgb(255 255 255 / 5%), transparent);
  border: 1px solid rgb(255 255 255 / 2%);
}

.login-form-wrapper {
  flex: 1;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: transparent;
}

.form-header {
  margin-bottom: 40px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--app-text-primary);
  margin: 0 0 8px;
  letter-spacing: -0.5px;
}

.form-subtitle {
  font-size: 15px;
  color: var(--app-text-secondary);
  margin: 0;
}

.login-form {
  margin-bottom: 32px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__label) {
  padding-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--app-text-primary);
}

:deep(.custom-input.el-input .el-input__wrapper) {
  background-color: var(--app-bg);
  border-radius: 12px;
  box-shadow:
    0 0 0 1px transparent inset,
    0 2px 4px rgb(0 0 0 / 2%);
  border: 1px solid var(--app-border);
  transition: all 0.3s ease;
  padding: 0 16px;
}

html.dark :deep(.custom-input.el-input .el-input__wrapper) {
  background-color: rgb(0 0 0 / 20%);
  border: 1px solid rgb(255 255 255 / 10%);
}

:deep(.custom-input.el-input .el-input__wrapper:hover) {
  border-color: rgb(var(--app-primary-rgb) / 40%);
}

:deep(.custom-input.el-input .el-input__wrapper.is-focus) {
  background-color: var(--app-surface);
  border-color: rgb(var(--app-primary-rgb));
  box-shadow: 0 0 0 4px rgb(var(--app-primary-rgb) / 10%);
}

html.dark :deep(.custom-input.el-input .el-input__wrapper.is-focus) {
  background-color: rgb(0 0 0 / 40%);
}

:deep(.custom-input.el-input .el-input__inner) {
  height: 48px;
  font-size: 15px;
  color: var(--app-text-primary);
}

:deep(.custom-input.el-input .el-input__inner::placeholder) {
  color: var(--app-text-secondary);
}

.submit-btn {
  width: 100%;
  height: 44px;
  margin-top: 12px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
}

.account-hint {
  padding: 20px;
  border-radius: 16px;
  background-color: var(--app-bg);
  border: 1px dashed var(--app-border);

  html.dark & {
    background-color: rgb(0 0 0 / 20%);
    border-color: rgb(255 255 255 / 10%);
  }
}

.hint-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--app-text-secondary);
  margin-bottom: 12px;
}

.hint-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hint-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--app-text-primary);

  span {
    color: var(--app-text-secondary);
  }

  code {
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
      monospace;
    padding: 4px 8px;
    border-radius: 6px;
    background-color: var(--app-surface);
    color: var(--app-text-primary);
    border: 1px solid var(--app-border);

    html.dark & {
      background-color: rgb(0 0 0 / 30%);
      border-color: rgb(255 255 255 / 10%);
    }
  }
}

@media (width <= 1024px) {
  .login-showcase {
    padding: 32px;
  }

  .login-form-wrapper {
    padding: 32px;
  }
}

@media (width <= 768px) {
  .login-card {
    flex-direction: column;
    max-width: 440px;
    margin: 0 auto;
  }

  .login-form-wrapper {
    padding: 32px 24px;
    background: var(--app-surface);
  }

  .glass-decoration {
    display: none;
  }
}
</style>
