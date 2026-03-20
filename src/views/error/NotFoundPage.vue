<template>
  <div class="flex h-[640px] items-center justify-center">
    <NoExist />
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
        404
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
        抱歉，你访问的页面不存在
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import NoExist from "@/assets/status/404.svg?component";

defineOptions({
  name: "NOTFOUND",
});
</script>
