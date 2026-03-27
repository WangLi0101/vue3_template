<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑角色' : '添加角色'"
    width="560px"
    :close-on-click-modal="false"
    @open="open"
    @closed="closed"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="88px">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="角色名称" prop="name">
            <el-input
              v-model.trim="form.name"
              maxlength="20"
              placeholder="请输入角色名称"
              style="width: 220px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色编码" prop="code">
            <el-input
              v-model.trim="form.code"
              maxlength="30"
              placeholder="请输入角色编码"
              style="width: 220px"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="form.sort" :min="0" :max="999" style="width: 220px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-switch
              v-model="form.status"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="停用"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model.trim="form.remark"
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
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { createRoleApi, updateRoleApi, type RoleItem, type RoleStatus } from "@/api/system/role";

interface Props {
  isEdit: boolean;
  row: RoleItem | null;
}

interface Emits {
  (e: "success"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const dialogVisible = defineModel<boolean>();
const formRef = useTemplateRef<FormInstance>("formRef");

const createDefaultForm = () => ({
  name: "",
  code: "",
  sort: 0,
  status: 1 as RoleStatus,
  remark: "",
});

const form = ref(createDefaultForm());
type FormKey = keyof typeof form.value;

const open = () => {
  if (props.isEdit && props.row) {
    for (const key of Object.keys(form.value) as FormKey[]) {
      if (key in props.row) {
        form.value[key] = props.row[key as keyof RoleItem] as never;
      }
    }
  }
};

const closed = () => {
  formRef.value?.resetFields();
  form.value = createDefaultForm();
};

const rules = reactive<FormRules<typeof form.value>>({
  name: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    { min: 2, max: 20, message: "角色名称长度为 2-20 位", trigger: "blur" },
  ],
  code: [
    { required: true, message: "请输入角色编码", trigger: "blur" },
    {
      pattern: /^[a-z][a-z0-9_]{1,29}$/,
      message: "角色编码需以小写字母开头，可包含小写字母、数字和下划线",
      trigger: "blur",
    },
  ],
});

const getFormData = () => ({
  ...form.value,
});

const add = () => {
  return createRoleApi({
    ...getFormData(),
  });
};

const edit = () => {
  return updateRoleApi({
    id: props.row!.id,
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
      isSubmitLoading.value = false;
      if (res.code === 0) {
        emit("success");
        ElMessage.success(`${props.isEdit ? "编辑" : "添加"}成功`);
        dialogVisible.value = false;
      }
    } catch {
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
