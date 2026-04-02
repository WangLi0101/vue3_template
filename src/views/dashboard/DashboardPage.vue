<template>
  <div class="space-y-4">
    <el-card shadow="never">
      <template #header>
        <div class="font-semibold">欢迎使用 RBAC 管理后台</div>
      </template>
      <div class="space-y-3 text-sm leading-6 text-slate-600">
        <p>
          这里增加了一个用于验证请求封装的小面板，专门测试“下载接口遇到 token
          过期时的自动刷新与重放”。
        </p>
        <p>当前 Mock 配置中，accessToken 5 秒过期，refreshToken 30 分钟过期。</p>
      </div>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="font-semibold">下载与刷新验证</div>
            <div class="mt-1 text-sm text-slate-500">
              点击按钮后会先等待 accessToken 过期，再发起文件下载请求。
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <el-button type="primary" :loading="isDownloading" @click="handleProbeDownload">
              等待过期后下载验证
            </el-button>
            <el-button
              type="danger"
              plain
              :loading="isDownloadingError"
              @click="handleProbeErrorDownload"
            >
              下载失败接口验证
            </el-button>
            <el-button :disabled="isDownloading" @click="syncCurrentTokens"
              >刷新当前 token 摘要</el-button
            >
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <el-alert
          :closable="false"
          type="info"
          title="预期结果"
          description="第一次命中下载接口时，Mock 会先返回 JSON 业务错误体 code=40102；请求封装应自动刷新 accessToken 和 refreshToken，再重放下载请求，最终拿到文件。"
        />
        <el-alert
          :closable="false"
          type="warning"
          title="失败接口预期"
          description="点击“下载失败接口验证”后，Mock 会直接返回 JSON 业务错误体 code=50031；页面应提示错误，且不会落地文件。"
        />

        <el-descriptions :column="1" border>
          <el-descriptions-item label="当前 accessToken">
            <span class="font-mono text-xs">{{
              formatTokenSummary(currentTokens.accessToken)
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="当前 refreshToken">
            <span class="font-mono text-xs">{{
              formatTokenSummary(currentTokens.refreshToken)
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="最近一次结果">
            {{ probeResult?.summary || "尚未执行验证" }}
          </el-descriptions-item>
          <el-descriptions-item label="最近一次说明">
            {{ probeResult?.detail || "点击上方按钮开始验证。" }}
          </el-descriptions-item>
          <el-descriptions-item label="执行时间">
            {{ probeResult?.finishedAt || "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="刷新前 accessToken">
            <span class="font-mono text-xs">
              {{ formatTokenSummary(probeResult?.beforeAccessToken || "") }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="刷新后 accessToken">
            <span class="font-mono text-xs">
              {{ formatTokenSummary(probeResult?.afterAccessToken || "") }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="刷新前 refreshToken">
            <span class="font-mono text-xs">
              {{ formatTokenSummary(probeResult?.beforeRefreshToken || "") }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="刷新后 refreshToken">
            <span class="font-mono text-xs">
              {{ formatTokenSummary(probeResult?.afterRefreshToken || "") }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="是否轮换 accessToken">
            {{ probeResult ? (probeResult.accessTokenChanged ? "是" : "否") : "-" }}
          </el-descriptions-item>
          <el-descriptions-item label="是否轮换 refreshToken">
            {{ probeResult ? (probeResult.refreshTokenChanged ? "是" : "否") : "-" }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { downloadTokenProbeApi, downloadTokenProbeErrorApi } from "@/api/auth";
import { getAuthTokens } from "@/utils/token";
import { downloadFileByBlob } from "@/utils/tool";

defineOptions({
  name: "DashboardPage",
});

interface TokenSnapshot {
  accessToken: string;
  refreshToken: string;
}

interface ProbeResult extends TokenSnapshot {
  beforeAccessToken: string;
  beforeRefreshToken: string;
  afterAccessToken: string;
  afterRefreshToken: string;
  accessTokenChanged: boolean;
  refreshTokenChanged: boolean;
  summary: string;
  detail: string;
  finishedAt: string;
}

const ACCESS_TOKEN_WAIT_MS = 5_500;
const PROBE_FILE_NAME = "dashboard-token-probe.txt";

const isDownloading = ref(false);
const isDownloadingError = ref(false);
const currentTokens = ref<TokenSnapshot>(readCurrentTokens());
const probeResult = ref<ProbeResult | null>(null);

function readCurrentTokens(): TokenSnapshot {
  return getAuthTokens();
}

function syncCurrentTokens(): void {
  currentTokens.value = readCurrentTokens();
}

function formatTokenSummary(token: string): string {
  if (!token) {
    return "空";
  }

  if (token.length <= 24) {
    return token;
  }

  return `${token.slice(0, 12)}...${token.slice(-8)}`;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function formatFinishedAt(): string {
  return new Date().toLocaleString("zh-CN", {
    hour12: false,
  });
}

async function handleProbeDownload(): Promise<void> {
  if (isDownloading.value || isDownloadingError.value) {
    return;
  }

  isDownloading.value = true;
  const beforeTokens = readCurrentTokens();
  currentTokens.value = beforeTokens;

  probeResult.value = {
    ...beforeTokens,
    beforeAccessToken: beforeTokens.accessToken,
    beforeRefreshToken: beforeTokens.refreshToken,
    afterAccessToken: "",
    afterRefreshToken: "",
    accessTokenChanged: false,
    refreshTokenChanged: false,
    summary: "等待 accessToken 过期后发起下载请求",
    detail: `已开始等待 ${ACCESS_TOKEN_WAIT_MS / 1000} 秒，用于稳定触发下载接口的 token 刷新逻辑。`,
    finishedAt: formatFinishedAt(),
  };

  try {
    await wait(ACCESS_TOKEN_WAIT_MS);

    const blob = await downloadTokenProbeApi();
    downloadFileByBlob(blob, PROBE_FILE_NAME);

    const afterTokens = readCurrentTokens();
    currentTokens.value = afterTokens;

    const accessTokenChanged = beforeTokens.accessToken !== afterTokens.accessToken;
    const refreshTokenChanged = beforeTokens.refreshToken !== afterTokens.refreshToken;

    probeResult.value = {
      ...afterTokens,
      beforeAccessToken: beforeTokens.accessToken,
      beforeRefreshToken: beforeTokens.refreshToken,
      afterAccessToken: afterTokens.accessToken,
      afterRefreshToken: afterTokens.refreshToken,
      accessTokenChanged,
      refreshTokenChanged,
      summary: accessTokenChanged
        ? "下载成功，并在过程中自动刷新了 token"
        : "下载成功，但本次未观察到 token 轮换",
      detail: refreshTokenChanged
        ? "refreshToken 也已一起更新，说明刷新接口返回的新 token 对已经写回本地。"
        : "refreshToken 未变化；如果这次是在 token 仍有效时执行，属于正常现象。",
      finishedAt: formatFinishedAt(),
    };

    ElMessage.success(
      accessTokenChanged
        ? "下载成功，已触发 token 自动刷新"
        : "下载成功，请查看页面上的 token 变化",
    );
  } catch (error) {
    const afterTokens = readCurrentTokens();
    currentTokens.value = afterTokens;

    probeResult.value = {
      ...afterTokens,
      beforeAccessToken: beforeTokens.accessToken,
      beforeRefreshToken: beforeTokens.refreshToken,
      afterAccessToken: afterTokens.accessToken,
      afterRefreshToken: afterTokens.refreshToken,
      accessTokenChanged: beforeTokens.accessToken !== afterTokens.accessToken,
      refreshTokenChanged: beforeTokens.refreshToken !== afterTokens.refreshToken,
      summary: "下载验证失败",
      detail: error instanceof Error ? error.message : "未知错误",
      finishedAt: formatFinishedAt(),
    };

    ElMessage.error(error instanceof Error ? error.message : "下载验证失败");
  } finally {
    isDownloading.value = false;
  }
}

async function handleProbeErrorDownload(): Promise<void> {
  if (isDownloading.value || isDownloadingError.value) {
    return;
  }

  isDownloadingError.value = true;
  const beforeTokens = readCurrentTokens();
  currentTokens.value = beforeTokens;

  probeResult.value = {
    ...beforeTokens,
    beforeAccessToken: beforeTokens.accessToken,
    beforeRefreshToken: beforeTokens.refreshToken,
    afterAccessToken: "",
    afterRefreshToken: "",
    accessTokenChanged: false,
    refreshTokenChanged: false,
    summary: "准备请求模拟下载失败接口",
    detail: "该接口会直接返回 JSON 业务错误体 code=50031，用于验证下载失败提示链路。",
    finishedAt: formatFinishedAt(),
  };

  try {
    await downloadTokenProbeErrorApi();

    const afterTokens = readCurrentTokens();
    currentTokens.value = afterTokens;
    probeResult.value = {
      ...afterTokens,
      beforeAccessToken: beforeTokens.accessToken,
      beforeRefreshToken: beforeTokens.refreshToken,
      afterAccessToken: afterTokens.accessToken,
      afterRefreshToken: afterTokens.refreshToken,
      accessTokenChanged: beforeTokens.accessToken !== afterTokens.accessToken,
      refreshTokenChanged: beforeTokens.refreshToken !== afterTokens.refreshToken,
      summary: "异常：失败接口竟然返回成功",
      detail: "按预期这里不应该成功，如果出现该状态，说明下载错误处理链路需要再检查。",
      finishedAt: formatFinishedAt(),
    };
  } catch (error) {
    const afterTokens = readCurrentTokens();
    currentTokens.value = afterTokens;

    probeResult.value = {
      ...afterTokens,
      beforeAccessToken: beforeTokens.accessToken,
      beforeRefreshToken: beforeTokens.refreshToken,
      afterAccessToken: afterTokens.accessToken,
      afterRefreshToken: afterTokens.refreshToken,
      accessTokenChanged: beforeTokens.accessToken !== afterTokens.accessToken,
      refreshTokenChanged: beforeTokens.refreshToken !== afterTokens.refreshToken,
      summary: "失败接口已按预期返回错误",
      detail:
        error instanceof Error
          ? `下载错误已被识别并抛出：${error.message}`
          : "下载错误已被识别并抛出未知异常",
      finishedAt: formatFinishedAt(),
    };

    ElMessage.warning(error instanceof Error ? error.message : "下载失败接口已按预期返回错误");
  } finally {
    isDownloadingError.value = false;
  }
}
</script>
