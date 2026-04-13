<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="640px"
    :close-on-click-modal="false"
    @open="open"
    @closed="closed"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="88px" class="dictionary-form">
      <el-form-item label="字典键" prop="dictKey">
        <el-input
          v-model.trim="form.dictKey"
          maxlength="50"
          placeholder="请输入字典键"
          style="width: 320px"
        />
      </el-form-item>
      <el-form-item label="字典值" prop="value">
        <el-input
          v-model.trim="form.value"
          maxlength="100"
          placeholder="请输入字典值"
          style="width: 320px"
        />
      </el-form-item>
      <el-form-item label="字典说明" prop="info">
        <el-input
          v-model.trim="form.info"
          maxlength="100"
          placeholder="请输入字典说明"
          style="width: 320px"
        />
      </el-form-item>
      <el-form-item label="层级" prop="level">
        <el-input-number v-model="form.level" :min="1" :max="2" disabled style="width: 180px" />
      </el-form-item>
      <el-form-item label="父级字典" prop="parentUuid">
        <el-input v-model="parentDisplay" disabled placeholder="无父级" style="width: 320px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="isSubmitLoading" @click="submitForm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, useTemplateRef } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { DictionaryItem } from "@/api/management/dictionary";
import { ElMessage } from "element-plus";
import { createDictionaryApi, updateDictionaryApi } from "@/api/management/dictionary";

interface Props {
  isEdit: boolean;
  dictionary: DictionaryItem | null;
  parentDictionary: DictionaryItem | null;
}

interface Emits {
  (e: "success"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const dialogVisible = defineModel<boolean>();
const formRef = useTemplateRef<FormInstance>("formRef");

const dialogTitle = computed(() => {
  if (props.isEdit) {
    return "编辑字典";
  }
  return props.parentDictionary ? "新增子字典" : "新增字典";
});

const parentDisplay = computed(() => {
  return props.parentDictionary?.info || "";
});

const form = ref<{
  dictKey: string;
  value: string;
  info: string;
  level: number;
  parentUuid: string | null;
}>({
  dictKey: "",
  value: "",
  info: "",
  level: 1,
  parentUuid: null,
});

type FormKey = keyof typeof form.value;

const assignFormFromDictionary = (dictionary: DictionaryItem) => {
  for (const key of Object.keys(form.value) as FormKey[]) {
    if (key in dictionary) {
      form.value[key] = dictionary[key as keyof DictionaryItem] as never;
    }
  }
};

const open = () => {
  if (props.isEdit && props.dictionary) {
    assignFormFromDictionary(props.dictionary);
  } else if (props.parentDictionary) {
    form.value.level = props.parentDictionary.level + 1;
    form.value.parentUuid = props.parentDictionary.dictionaryId;
  } else {
    form.value.level = 1;
    form.value.parentUuid = null;
  }
};

const closed = () => {
  formRef.value?.resetFields();
};

const rules = reactive<FormRules<typeof form.value>>({
  dictKey: [
    { required: true, message: "请输入字典键", trigger: "blur" },
    { min: 2, max: 50, message: "字典键长度为 2-50 位", trigger: "blur" },
  ],
  info: [
    { required: true, message: "请输入字典说明", trigger: "blur" },
    { min: 2, max: 100, message: "字典说明长度为 2-100 位", trigger: "blur" },
  ],
});

const getFormData = () => ({
  ...form.value,
});

const add = () => {
  return createDictionaryApi({
    ...getFormData(),
  });
};

const edit = () => {
  return updateDictionaryApi({
    dictionaryId: props.dictionary!.dictionaryId,
    ...getFormData(),
  });
};

const isSubmitLoading = ref(false);

const submitForm = () => {
  if (!formRef.value) return;
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    isSubmitLoading.value = true;
    try {
      const res = props.isEdit ? await edit() : await add();
      if (res.code === 0) {
        emit("success");
        ElMessage.success(`${props.isEdit ? "编辑" : "添加"}成功`);
        dialogVisible.value = false;
      }
    } finally {
      isSubmitLoading.value = false;
    }
  });
};
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  font-weight: 700;
}
</style>
