<template>
  <div class="flex h-[640px] items-center justify-center">
    <NoAccess />
    <div class="ml-12">
      <p
        v-motion
        class="mb-4 text-4xl font-medium dark:text-white"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 100,
          },
        }"
      >
        403
      </p>
      <p
        v-motion
        class="mb-4 text-gray-500"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 300,
          },
        }"
      >
        抱歉，你无权访问该页面
      </p>
      <router-link
        v-motion
        to="/"
        class="home-link"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 500,
          },
        }"
      >
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import NoAccess from "@/assets/status/403.svg?component";

defineOptions({
  name: "FORBIDDEN",
});
</script>

<style scoped lang="scss">
.home-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  color: #fff;
  background: var(--el-color-primary);
  border-radius: 10px;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
  box-shadow: 0 10px 24px rgb(64 158 255 / 24%);
}

.home-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgb(64 158 255 / 30%);
}
</style>
