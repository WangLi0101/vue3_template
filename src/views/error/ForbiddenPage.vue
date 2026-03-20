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
    </div>
  </div>
</template>

<script setup lang="ts">
import NoAccess from "@/assets/status/403.svg?component";

defineOptions({
  name: "FORBIDDEN",
});
</script>
