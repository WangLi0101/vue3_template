<template>
  <div class="flex h-full flex-col">
    <div class="mb-4">
      <el-form ref="queryFormRef" :model="query" inline label-width="68px" class="flex flex-wrap">
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="query.name"
            placeholder="请输入角色名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input
            v-model="query.code"
            placeholder="请输入角色编码"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="query.status" placeholder="全部状态" clearable class="w-36">
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="flex min-h-0 flex-1 flex-col">
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <el-button type="primary" @click="handleCreate"> 新建角色 </el-button>
        <el-button type="danger" plain :disabled="!selectedIds.length" @click="handleBatchDelete">
          批量删除
        </el-button>
      </div>

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
          <el-table-column prop="name" label="角色名称" min-width="160" />
          <el-table-column prop="code" label="角色编码" min-width="180" />
          <el-table-column prop="userCount" label="关联用户" width="100" align="center" />
          <el-table-column prop="sort" label="排序" width="90" align="center" />
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'info'">
                {{ row.status === 1 ? "启用" : "停用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip />
          <el-table-column prop="createdAt" label="创建时间" min-width="180" />
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="handleEdit(row)"> 编辑 </el-button>
              <el-button type="danger" link @click="handleDelete(row)"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <RoleFormDialog
      v-model="dialogVisible"
      :is-edit="isEdit"
      :row="currentRow"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, useTemplateRef } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";
import {
  batchDeleteRolesApi,
  deleteRoleApi,
  getRoleListApi,
  type RoleItem,
  type RoleListQuery,
} from "@/api/system/role";
import RoleFormDialog from "./components/RoleFormDialog.vue";

defineOptions({
  name: "RolePage",
});

const queryFormRef = useTemplateRef<FormInstance>("queryFormRef");
const loading = ref(false);
const tableData = ref<RoleItem[]>([]);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentRow = ref<RoleItem | null>(null);
const query = reactive<RoleListQuery>({
  name: "",
  code: "",
  status: undefined,
});

const fetchList = async () => {
  loading.value = true;
  try {
    const response = await getRoleListApi({
      ...query,
      name: query.name?.trim(),
      code: query.code?.trim(),
    });

    if (response.code !== 0) {
      return;
    }

    tableData.value = response.data.list;
    selectedIds.value = [];
  } finally {
    loading.value = false;
  }
};

const handleSearch = async () => {
  await fetchList();
};

const handleReset = async () => {
  queryFormRef.value?.resetFields();
  await fetchList();
};

const handleSelectionChange = (rows: RoleItem[]) => {
  selectedIds.value = rows.map((item) => item.id);
};

const handleCreate = () => {
  isEdit.value = false;
  currentRow.value = null;
  dialogVisible.value = true;
};

const handleEdit = (row: RoleItem) => {
  isEdit.value = true;
  currentRow.value = { ...row };
  dialogVisible.value = true;
};

const handleDelete = async (row: RoleItem) => {
  try {
    await ElMessageBox.confirm(`确认删除角色「${row.name}」吗？`, "提示", {
      type: "warning",
    });
  } catch {
    return;
  }

  const response = await deleteRoleApi(row.id);
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
    await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 个角色吗？`, "提示", {
      type: "warning",
    });
  } catch {
    return;
  }

  const response = await batchDeleteRolesApi({
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
  void fetchList();
});
</script>
