<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑用户' : '添加用户'"
    width="640px"
    :close-on-click-modal="false"
    @open="open"
    @closed="closed"
  >
    <div class="dialog-content">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="88px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="form.username"
                :disabled="isEdit"
                placeholder="请输入用户名"
                style="width: 260px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickname">
              <el-input
                v-model.trim="form.nickname"
                placeholder="请输入昵称"
                style="width: 260px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="!isEdit">
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="form.password"
                  type="password"
                  show-password
                  placeholder="请输入密码"
                  style="width: 260px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="form.confirmPassword"
                  type="password"
                  show-password
                  placeholder="请再次输入密码"
                  style="width: 260px"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号" style="width: 260px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" style="width: 260px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="角色" prop="roleIds">
              <el-select
                v-model="form.roleIds"
                multiple
                collapse-tags
                collapse-tags-tooltip
                placeholder="请选择角色"
                style="width: 260px"
              >
                <el-option
                  v-for="item in props.roleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-switch
                v-model="form.status"
                :active-value="USER_STATUS.ENABLED"
                :inactive-value="USER_STATUS.DISABLED"
                active-text="启用"
                inactive-text="停用"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            maxlength="200"
            show-word-limit
            placeholder="请输入备注"
            style="width: 536px"
          />
        </el-form-item>
      </el-form>
    </div>
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
import type { RoleOption, UserItem } from "@/api/system/user";
import { ElMessage } from "element-plus";
import { createUserApi, updateUserApi, USER_STATUS } from "@/api/system/user";
import { removeAllSpace } from "@/utils/tool";
import { isValidPhone } from "@/utils/validators";

interface Props {
  isEdit: boolean;
  user: UserItem | null;
  roleOptions: RoleOption[];
}

interface Emits {
  (e: "success"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const dialogVisible = defineModel<boolean>();
const formRef = useTemplateRef<FormInstance>("formRef");

const form = ref({
  username: "",
  nickname: "",
  password: "",
  confirmPassword: "",
  phone: "",
  email: "",
  roleIds: [] as number[],
  status: USER_STATUS.ENABLED,
  remark: "",
});
type FormKey = keyof typeof form.value;

const assignFormFromUser = (user: UserItem) => {
  for (const key of Object.keys(form.value) as FormKey[]) {
    if (key in user) {
      form.value[key] = user[key as keyof UserItem] as never;
    }
  }
};

const open = () => {
  if (props.isEdit && props.user) {
    assignFormFromUser(props.user);
  }
};

const closed = () => {
  formRef.value?.resetFields();
};

const rules = reactive<FormRules<typeof form.value>>({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "用户名长度为 3-20 位", trigger: "blur" },
  ],
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  password: [
    {
      validator: (_rule, value, callback) => {
        if (!props.isEdit && !value) {
          callback(new Error("请输入密码"));
          return;
        }
        if (!props.isEdit && value.length < 6) {
          callback(new Error("密码至少 6 位"));
          return;
        }
        callback();
      },
      trigger: "blur",
    },
  ],
  confirmPassword: [
    {
      validator: (_rule, value, callback) => {
        if (!props.isEdit && !value) {
          callback(new Error("请再次输入密码"));
          return;
        }
        if (!props.isEdit && value !== form.value.password) {
          callback(new Error("两次输入的密码不一致"));
          return;
        }
        callback();
      },
      trigger: "blur",
    },
  ],
  phone: [
    {
      validator: (_rule, value, callback) => {
        if (value && !isValidPhone(value)) {
          callback(new Error("请输入正确的手机号"));
          return;
        }
        callback();
      },
      trigger: "blur",
    },
  ],
  email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }],
  roleIds: [{ required: true, message: "请至少选择一个角色", trigger: "change" }],
});

const getFormData = () => ({
  ...form.value,
  username: removeAllSpace(form.value.username),
  phone: removeAllSpace(form.value.phone),
  email: removeAllSpace(form.value.email),
  roleIds: [...form.value.roleIds],
});

const add = () => {
  const { confirmPassword: _confirmPassword, ...payload } = getFormData();
  return createUserApi({
    ...payload,
  });
};

const edit = () => {
  const {
    username: _username,
    password: _password,
    confirmPassword: _confirmPassword,
    ...payload
  } = getFormData();
  return updateUserApi({
    id: props.user!.id,
    ...payload,
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
