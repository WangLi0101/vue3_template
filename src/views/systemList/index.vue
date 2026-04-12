<template>
  <div
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-app-bg px-4 py-8 transition-colors duration-300 sm:px-6 sm:py-12"
  >
    <!-- Abstract Ambient Background using static blobs -->
    <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        class="absolute left-[-10%] top-[-10%] h-[50vw] w-[50vw] rounded-full bg-blue-500/10 blur-[80px]"
      ></div>
      <div
        class="absolute bottom-[-20%] right-[-10%] h-[60vw] w-[60vw] rounded-full bg-purple-500/10 blur-[80px]"
      ></div>
      <div
        class="absolute left-[60%] top-[40%] h-[40vw] w-[40vw] rounded-full bg-sky-500/10 blur-[80px]"
      ></div>
      <div
        class="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noiseFilter%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.65%22%20numOctaves=%223%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-40 mix-blend-overlay"
      ></div>
    </div>

    <section
      class="perspective-[1000px] relative z-10 mx-auto w-full max-w-[1080px] text-left sm:text-center"
    >
      <header class="mb-12">
        <p class="mb-3 text-[13px] font-bold uppercase tracking-[0.16em] text-primary">
          System Portal
        </p>
        <h1
          class="m-0 mb-4 text-[clamp(28px,5vw,40px)] font-extrabold leading-tight tracking-tight text-app-text-primary"
        >
          请选择要进入的系统
        </h1>
      </header>

      <el-empty v-if="systemItems.length === 0" description="暂无可进入的系统" />

      <ul
        v-else
        class="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 p-0"
      >
        <li v-for="item in systemItems" :key="item.url" class="min-w-0">
          <button
            class="group flex w-full cursor-pointer flex-col rounded-[24px] border border-app-border bg-app-surface p-7 text-left shadow-[0_20px_40px_rgb(0_0_0/0.05),inset_0_0_0_1px_rgb(255_255_255/0.2)] backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_30px_60px_rgb(0_0_0/0.1),inset_0_0_0_1px_rgb(255_255_255/0.3)] sm:min-h-[200px] dark:shadow-[0_20px_40px_rgb(0_0_0/0.3),inset_0_0_0_1px_rgb(255_255_255/0.05)] dark:hover:border-primary/50 dark:hover:shadow-[0_30px_60px_rgb(0_0_0/0.4),inset_0_0_0_1px_rgb(var(--app-primary-rgb)/0.3)]"
            type="button"
            @click="handleNavigate(item)"
          >
            <div class="mb-5 flex w-full items-center justify-between">
              <span
                class="inline-flex min-h-[28px] items-center justify-center rounded-full bg-primary/10 px-3 text-[12px] font-bold text-primary transition-colors"
              >
                可进入系统
              </span>
              <span
                class="text-2xl leading-none text-app-text-secondary transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
                >→</span
              >
            </div>

            <h2
              class="m-0 mb-5 text-[22px] font-bold leading-snug tracking-tight text-app-text-primary"
            >
              {{ item.name }}
            </h2>

            <div
              class="border-app-border/40 mt-auto flex w-full flex-col gap-2 border-t pt-4 text-[13px] text-app-text-secondary"
            >
              <div class="flex items-center">
                <span class="font-mono text-[12px] opacity-80">{{ item.url }}</span>
              </div>
            </div>
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import type { SystemItem } from "@/config/api";
import { useSystemNavigation } from "@/composables/useSystemNavigation";

const { accessibleSystemList, navigateBySystemTarget } = useSystemNavigation();
const systemItems = accessibleSystemList;

const handleNavigate = async (item: SystemItem): Promise<void> => {
  const result = await navigateBySystemTarget(item.url);
  if (result.status === "forbidden") {
    ElMessage.warning("当前账号无权访问该系统");
  }
};
</script>
