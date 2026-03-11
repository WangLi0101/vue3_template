<template>
  <div class="login-page">
    <div class="login-shell">
      <section class="login-form-panel">
        <div class="brand">
          <span class="brand-dot" />
          <span class="brand-text">Finnger</span>
        </div>

        <h1 class="title">
          Hola,<br />
          Welcome Back
        </h1>
        <p class="subtitle">Hey, welcome back to your special place</p>

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

          <div class="options-row">
            <el-checkbox v-model="rememberMe">Remember me</el-checkbox>
            <button class="text-link" type="button">Forgot Password?</button>
          </div>

          <el-button type="primary" class="submit-btn" :loading="loading" @click="handleLogin">
            Sign In
          </el-button>
        </el-form>

        <el-alert class="tips-alert" type="info" :closable="false" :title="loginTips" />

        <p class="signup-row">
          Don't have an account?
          <button class="text-link" type="button">Sign Up</button>
        </p>
      </section>

      <section class="login-art-panel" aria-hidden="true">
        <div class="cloud cloud-1" />
        <div class="cloud cloud-2" />
        <div class="cloud cloud-3" />

        <div class="bubble bubble-check">✓</div>

        <div class="phone-wrap">
          <div class="phone-shadow" />
          <div class="phone">
            <div class="camera" />
            <div class="fingerprint" />
            <div class="hint">Place your finger</div>
          </div>
        </div>

        <div class="lock-card">
          <div class="lock-head" />
          <div class="lock-body" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";
import { ApiRequestError } from "@/types/http";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const formRef = ref<FormInstance>();
const loading = ref(false);
const rememberMe = ref(true);

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
    } catch (error) {
      if (error instanceof ApiRequestError) {
        ElMessage.error(`${error.message} (HTTP ${error.httpStatus} / CODE ${error.businessCode})`);
        return;
      }

      ElMessage.error(error instanceof Error ? error.message : "登录失败");
    } finally {
      loading.value = false;
    }
  });
};

const loginTips = "测试账号：admin / admin123，auditor / auditor123";
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(circle at 20% 20%, rgb(131 118 255 / 12%), transparent 45%),
    radial-gradient(circle at 80% 80%, rgb(65 213 255 / 10%), transparent 42%), var(--app-bg);
}

.login-shell {
  width: min(1120px, 100%);
  min-height: min(700px, calc(100vh - 64px));
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgb(13 23 41 / 14%);
  display: grid;
  grid-template-columns: 1fr minmax(360px, 46%);
}

.login-form-panel {
  padding: clamp(32px, 6vw, 68px);
  display: flex;
  flex-direction: column;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 44px;
}

.brand-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(145deg, #6f4bff, #8b6bff);
}

.brand-text {
  font-size: 13px;
  color: var(--app-text-primary);
  font-weight: 600;
  letter-spacing: 0.3px;
}

.title {
  margin: 0;
  color: var(--app-text-primary);
  font-size: clamp(34px, 4vw, 52px);
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.subtitle {
  margin: 16px 0 34px;
  color: var(--app-text-secondary);
  font-size: 15px;
}

.login-form {
  max-width: 400px;
}

.options-row {
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--app-text-secondary);
  font-size: 13px;
}

.text-link {
  border: 0;
  background: transparent;
  color: #6849f7;
  cursor: pointer;
  padding: 0;
  font-size: 13px;
}

.text-link:hover {
  color: #7f67ff;
}

.submit-btn {
  margin-top: 18px;
  width: 120px;
  height: 44px;
  border: 0;
  border-radius: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, #5f42f5 0%, #7b53ff 100%);
  box-shadow: 0 10px 24px rgb(104 73 247 / 32%);
}

.tips-alert {
  margin-top: 28px;
  max-width: 400px;
}

.signup-row {
  margin-top: auto;
  margin-bottom: 0;
  color: var(--app-text-secondary);
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.login-art-panel {
  position: relative;
  overflow: hidden;
  background: linear-gradient(138deg, #6f8ae7 0%, #8f6eea 42%, #ab54f3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-art-panel::before,
.login-art-panel::after {
  content: "";
  position: absolute;
  background: rgb(255 255 255 / 88%);
  filter: blur(0.4px);
}

.login-art-panel::before {
  top: -34px;
  left: -52px;
  width: 210px;
  height: 98px;
  border-radius: 999px;
}

.login-art-panel::after {
  right: -60px;
  bottom: -26px;
  width: 230px;
  height: 105px;
  border-radius: 999px;
}

.cloud {
  position: absolute;
  border-radius: 999px;
  background: rgb(255 255 255 / 90%);
}

.cloud-1 {
  top: 88px;
  left: -30px;
  width: 170px;
  height: 52px;
}

.cloud-2 {
  top: 118px;
  right: 24px;
  width: 140px;
  height: 44px;
}

.cloud-3 {
  bottom: 82px;
  left: 20px;
  width: 150px;
  height: 46px;
}

.bubble {
  position: absolute;
  display: grid;
  place-items: center;
  color: #9d5df7;
  font-size: 52px;
  font-weight: 700;
}

.bubble-check {
  top: 158px;
  left: 64px;
  width: 108px;
  height: 108px;
  border-radius: 50% 50% 50% 16px;
  background: #fff;
  box-shadow: 0 20px 24px rgb(42 24 92 / 22%);
}

.phone-wrap {
  position: relative;
  width: 290px;
  height: 500px;
  transform: rotate(-7deg);
}

.phone-shadow {
  position: absolute;
  inset: 14px 0 0 14px;
  border-radius: 38px;
  background: rgb(24 25 87 / 48%);
}

.phone {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 36px;
  border: 8px solid #151c3f;
  background: linear-gradient(164deg, #ff93dd 0%, #d06af8 52%, #bc69ff 100%);
  box-shadow: 0 26px 38px rgb(32 15 74 / 34%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.camera {
  position: absolute;
  top: 12px;
  left: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  transform: translateX(-50%);
  background: #242547;
}

.fingerprint {
  width: 126px;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgb(255 255 255 / 95%) 0 3px, transparent 3px 100%),
    repeating-radial-gradient(circle, transparent 0 8px, rgb(255 255 255 / 75%) 9px 11px);
  box-shadow: 0 0 0 14px rgb(255 255 255 / 15%);
}

.hint {
  margin-top: 42px;
  font-size: 13px;
  color: rgb(255 255 255 / 86%);
}

.lock-card {
  position: absolute;
  right: 38px;
  top: 290px;
  width: 116px;
  height: 134px;
}

.lock-head {
  width: 52px;
  height: 40px;
  border: 10px solid #fff;
  border-bottom: 0;
  border-radius: 30px 30px 0 0;
  margin: 0 auto;
}

.lock-body {
  margin-top: -2px;
  width: 100%;
  height: 94px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 12px 26px rgb(15 7 50 / 24%);
  position: relative;
}

.lock-body::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 34px;
  width: 16px;
  height: 20px;
  border-radius: 999px;
  transform: translateX(-50%);
  background: #9b63f7;
}

:deep(.el-form-item__label) {
  font-size: 13px;
  color: var(--app-text-secondary);
  margin-bottom: 6px;
}

:deep(.el-input__wrapper) {
  border-radius: 10px;
  box-shadow: 0 0 0 1px rgb(125 138 156 / 18%) inset;
  background-color: #fff;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #7b53ff inset;
}

:deep(.el-checkbox__label) {
  font-size: 13px;
  color: var(--app-text-secondary);
}

:deep(.el-alert) {
  border-radius: 10px;
  background: rgb(111 138 231 / 10%);
  border: 1px solid rgb(111 138 231 / 22%);
}

@media (width <= 1024px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .login-art-panel {
    min-height: 280px;
    order: -1;
  }

  .phone-wrap {
    width: 180px;
    height: 300px;
  }

  .bubble-check,
  .lock-card {
    transform: scale(0.8);
  }

  .bubble-check {
    left: 18px;
    top: 72px;
  }

  .lock-card {
    right: 20px;
    top: 124px;
  }
}

@media (width <= 640px) {
  .login-page {
    padding: 12px;
  }

  .login-shell {
    min-height: auto;
    border-radius: 18px;
  }

  .login-form-panel {
    padding: 24px;
  }

  .title {
    font-size: 36px;
  }

  .submit-btn {
    width: 100%;
  }

  .tips-alert {
    margin-top: 20px;
  }

  .signup-row {
    margin-top: 24px;
  }

  .login-art-panel {
    min-height: 220px;
  }

  .bubble,
  .lock-card,
  .cloud {
    display: none;
  }

  .phone-wrap {
    width: 148px;
    height: 240px;
  }

  .hint {
    margin-top: 20px;
  }
}
</style>
