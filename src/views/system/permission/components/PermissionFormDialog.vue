<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑权限' : '添加权限'"
    width="640px"
    :close-on-click-modal="false"
    @open="open"
    @closed="closed"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="88px" class="permission-form">
      <el-form-item label="权限名称" prop="name">
        <el-input
          v-model.trim="form.name"
          maxlength="20"
          placeholder="请输入权限名称"
          style="width: 320px"
        />
      </el-form-item>
      <el-form-item label="权限编码" prop="code">
        <el-input
          v-model="form.code"
          maxlength="50"
          placeholder="请输入权限编码，如 sys:user:create"
          style="width: 320px"
        />
      </el-form-item>
      <el-form-item label="权限类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择权限类型" style="width: 320px">
          <el-option
            v-for="item in PERMISSION_TYPE_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0" :max="999" style="width: 180px" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="form.status"
          :active-value="PERMISSION_STATUS.ENABLED"
          :inactive-value="PERMISSION_STATUS.DISABLED"
          active-text="启用"
          inactive-text="停用"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          maxlength="200"
          show-word-limit
          placeholder="请输入备注"
        />
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
import { reactive, ref, useTemplateRef } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { PermissionItem } from "@/api/management/permission";
import { ElMessage } from "element-plus";
import {
  createPermissionApi,
  PERMISSION_STATUS,
  PERMISSION_TYPE_OPTIONS,
  updatePermissionApi,
} from "@/api/management/permission";
import { removeAllSpace } from "@/utils/tool";
import { PERMISSION_CODE_REGEXP } from "@/utils/validators";

interface Props {
  isEdit: boolean;
  permission: PermissionItem | null;
}

interface Emits {
  (e: "success"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const dialogVisible = defineModel<boolean>();
const formRef = useTemplateRef<FormInstance>("formRef");

const form = ref({
  name: "",
  code: "",
  type: 1,
  sort: 0,
  status: PERMISSION_STATUS.ENABLED,
  remark: "",
});
type FormKey = keyof typeof form.value;

const assignFormFromPermission = (permission: PermissionItem) => {
  for (const key of Object.keys(form.value) as FormKey[]) {
    if (key in permission) {
      form.value[key] = permission[key as keyof PermissionItem] as never;
    }
  }
};

const open = () => {
  if (props.isEdit && props.permission) {
    assignFormFromPermission(props.permission);
  }
};

const closed = () => {
  formRef.value?.resetFields();
};

const rules = reactive<FormRules<typeof form.value>>({
  name: [
    { required: true, message: "请输入权限名称", trigger: "blur" },
    { min: 2, max: 20, message: "权限名称长度为 2-20 位", trigger: "blur" },
  ],
  code: [
    { required: true, message: "请输入权限编码", trigger: "blur" },
    {
      pattern: PERMISSION_CODE_REGEXP,
      message: "权限编码需以小写字母开头，可包含小写字母、数字、冒号和下划线",
      trigger: "blur",
    },
  ],
  type: [{ required: true, message: "请选择权限类型", trigger: "change" }],
});

const getFormData = () => ({
  ...form.value,
  code: removeAllSpace(form.value.code),
});

const add = () => {
  return createPermissionApi({
    ...getFormData(),
    parentId: null,
  });
};

const edit = () => {
  return updatePermissionApi({
    id: props.permission!.id,
    ...getFormData(),
    parentId: null,
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
