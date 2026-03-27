<template>
  <div class="flex h-full flex-col">
    <div class="mb-4">
      <el-form ref="queryFormRef" :model="query" inline label-width="68px" class="flex flex-wrap">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="query.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="query.nickname"
            placeholder="请输入昵称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="query.status" placeholder="全部状态" clearable class="w-36">
            <el-option
              v-for="item in USER_STATUS_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="query.roleId" placeholder="全部角色" clearable class="w-40">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作与列表内容区域 -->
    <div class="flex min-h-0 flex-1 flex-col">
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <el-button type="primary" @click="handleCreate"> 新建用户 </el-button>
        <el-button type="danger" plain :disabled="!selectedIds.length" @click="handleBatchDelete">
          批量删除
        </el-button>
      </div>

      <!-- 表格容器自适应高度 -->
      <div class="min-h-0 flex-1">
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          stripe
          height="100%"
          row-key="id"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="52" align="center" />
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="username" label="用户名" min-width="140" />
          <el-table-column prop="nickname" label="昵称" min-width="140" />
          <el-table-column label="角色" min-width="180">
            <template #default="{ row }">
              <div class="flex flex-wrap gap-2">
                <el-tag v-for="roleName in row.roleNames" :key="roleName" type="info">
                  {{ roleName }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" min-width="140" />
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === USER_STATUS.ENABLED ? 'success' : 'info'">
                {{ USER_STATUS_LABEL_MAP[row.status as UserStatus] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" min-width="180" />
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleEdit(row)"> 编辑 </el-button>
              <el-button type="danger" link @click="handleDelete(row)"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="mt-4 flex flex-shrink-0 justify-end">
        <el-pagination
          v-model:current-page="query.pageNum"
          v-model:page-size="query.pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          @current-change="fetchList"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

    <UserFormDialog
      v-model="dialogVisible"
      :is-edit="isEdit"
      :row="currentRow"
      :role-options="roleOptions"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, useTemplateRef } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";
import {
  batchDeleteUsersApi,
  deleteUserApi,
  getRoleOptionsApi,
  getUserListApi,
  type RoleOption,
  USER_STATUS,
  USER_STATUS_LABEL_MAP,
  USER_STATUS_OPTIONS,
  type UserItem,
  type UserListQuery,
  type UserStatus,
} from "@/api/system/user";
import { removeAllSpace } from "@/utils/tool";
import UserFormDialog from "./components/UserFormDialog.vue";

defineOptions({
  name: "UserPage",
});

const queryFormRef = useTemplateRef<FormInstance>("queryFormRef");
const loading = ref(false);
const total = ref(0);
const tableData = ref<UserItem[]>([]);
const roleOptions = ref<RoleOption[]>([]);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentRow = ref<UserItem | null>(null);
const query = reactive<UserListQuery>({
  pageNum: 1,
  pageSize: 10,
  username: "",
  nickname: "",
  status: undefined,
  roleId: undefined,
});

const fetchRoleOptions = async () => {
  const response = await getRoleOptionsApi();
  if (response.code !== 0) {
    return;
  }
  roleOptions.value = response.data;
};

const fetchList = async () => {
  loading.value = true;
  try {
    const response = await getUserListApi({
      ...query,
      username: removeAllSpace(query.username || ""),
      nickname: query.nickname?.trim(),
    });

    if (response.code !== 0) {
      return;
    }

    tableData.value = response.data.list;
    total.value = response.data.total;
  } finally {
    loading.value = false;
  }
};

const handleSearch = async () => {
  query.pageNum = 1;
  await fetchList();
};

const handleSizeChange = async () => {
  query.pageNum = 1;
  await fetchList();
};

const handleSelectionChange = (rows: UserItem[]) => {
  selectedIds.value = rows.map((item) => item.id);
};

const handleCreate = () => {
  isEdit.value = false;
  currentRow.value = null;
  dialogVisible.value = true;
};

const handleEdit = (row: UserItem) => {
  isEdit.value = true;
  currentRow.value = {
    ...row,
    roleIds: [...row.roleIds],
    roleNames: [...row.roleNames],
  };
  dialogVisible.value = true;
};

const handleDelete = async (row: UserItem) => {
  try {
    await ElMessageBox.confirm(`确认删除用户「${row.nickname}」吗？`, "提示", {
      type: "warning",
    });
  } catch {
    return;
  }

  const response = await deleteUserApi(row.id);
  if (response.code !== 0) {
    return;
  }

  ElMessage.success("删除成功");
  await fetchList();
};

const handleBatchDelete = async () => {
  if (!selectedIds.value.length) {
    return;
  }

  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 个用户吗？`, "提示", {
      type: "warning",
    });
  } catch {
    return;
  }

  const response = await batchDeleteUsersApi({
    ids: [...selectedIds.value],
  });

  if (response.code !== 0) {
    return;
  }

  ElMessage.success("批量删除成功");
  await fetchList();
};

const handleDialogSuccess = async () => {
  await fetchList();
};

onMounted(() => {
  fetchRoleOptions();
  fetchList();
});
</script>
