<template>
  <div class="content flex h-full flex-col">
    <div class="mb-4">
      <el-form ref="queryFormRef" :model="query" inline label-width="68px" class="flex flex-wrap">
        <el-form-item label="字典键" prop="dictKey">
          <el-input
            v-model="query.dictKey"
            placeholder="请输入字典键"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="字典说明" prop="info">
          <el-input
            v-model="query.info"
            placeholder="请输入字典说明"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="flex min-h-0 flex-1 flex-col">
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <el-button type="primary" @click="handleCreate"> 新建字典 </el-button>
      </div>

      <div class="min-h-0 flex-1">
        <el-table
          v-loading="dictionaryStore.isLoading"
          :data="dictionaryStore.dictionaryTree"
          border
          stripe
          height="100%"
          row-key="dictionaryId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          default-expand-all
        >
          <el-table-column prop="dictKey" label="字典键" min-width="180" fixed="left" />
          <el-table-column prop="value" label="字典值" min-width="160" />
          <el-table-column prop="info" label="字典说明" min-width="220" show-overflow-tooltip />
          <el-table-column prop="level" label="层级" width="100" align="center">
            <template #default="{ row }: { row: DictionaryItem }">
              <el-tag>第{{ row.level }}级</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template #default="{ row }">
              <el-button type="success" link @click="handleCreateChild(row)"> 新增子项 </el-button>
              <el-button type="primary" link @click="handleEdit(row)"> 编辑 </el-button>
              <el-button type="danger" link @click="handleDelete(row)"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <DictionaryFormDialog
      v-model="dialogVisible"
      :is-edit="isEdit"
      :dictionary="currentDictionary"
      :parent-dictionary="parentDictionary"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, useTemplateRef } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";
import type { DictionaryItem, DictionaryListQuery } from "@/api/management/dictionary";
import { deleteDictionaryApi } from "@/api/management/dictionary";
import { useDictionaryStore } from "@/stores/modules/dictionary";
import DictionaryFormDialog from "./components/DictionaryFormDialog.vue";

defineOptions({
  name: "DictionaryPage",
});

const dictionaryStore = useDictionaryStore();

onMounted(() => {
  void loadDictionaryList();
});

const queryFormRef = useTemplateRef<FormInstance>("queryFormRef");
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentDictionary = ref<DictionaryItem | null>(null);
const parentDictionary = ref<DictionaryItem | null>(null);
const query = reactive<DictionaryListQuery>({
  dictKey: "",
  info: "",
});

const loadDictionaryList = async () => {
  await dictionaryStore.loadDictionaryList({
    dictKey: query.dictKey?.trim(),
    info: query.info?.trim(),
  });
};

const handleSearch = async () => {
  await loadDictionaryList();
};

const handleReset = async () => {
  queryFormRef.value?.resetFields();
  await loadDictionaryList();
};

const handleCreate = () => {
  isEdit.value = false;
  currentDictionary.value = null;
  parentDictionary.value = null;
  dialogVisible.value = true;
};

const handleCreateChild = (row: DictionaryItem) => {
  isEdit.value = false;
  currentDictionary.value = null;
  parentDictionary.value = { ...row };
  dialogVisible.value = true;
};

const handleEdit = (row: DictionaryItem) => {
  isEdit.value = true;
  currentDictionary.value = { ...row };
  parentDictionary.value = null;
  dialogVisible.value = true;
};

const handleDelete = async (row: DictionaryItem) => {
  try {
    await ElMessageBox.confirm(`确认删除字典「${row.info}」吗？`, "提示", {
      type: "warning",
    });
  } catch {
    return;
  }

  const response = await deleteDictionaryApi({
    dictionaryId: row.dictionaryId,
  });
  if (response.code !== 0) {
    return;
  }

  ElMessage.success("删除成功");
  await loadDictionaryList();
};

const handleDialogSuccess = async () => {
  await loadDictionaryList();
};
</script>
