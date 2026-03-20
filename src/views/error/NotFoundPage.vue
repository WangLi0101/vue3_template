<template>
  <div class="flex h-[640px] items-center justify-center">
    <NoExist />
    <div class="ml-12">
      <p class="mb-4 text-4xl font-medium dark:text-white">404</p>
      <p class="mb-4 text-gray-500">抱歉，你访问的页面不存在</p>
      <router-link to="/" class="home-link"> 返回首页 </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import NoExist from "@/assets/status/404.svg?component";

defineOptions({
  name: "NOTFOUND",
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
