export const PHONE_REGEXP = /^1\d{10}$/;
export const isValidPhone = (value: string) => {
  return PHONE_REGEXP.test(value);
};

export const ROLE_CODE_REGEXP = /^[a-z][a-z0-9_]{1,29}$/;
export const isValidRoleCode = (value: string) => {
  return ROLE_CODE_REGEXP.test(value);
};

export const PERMISSION_CODE_REGEXP = /^[a-z][a-z0-9_]{0,}(:[a-z][a-z0-9_]{0,})*$/;
export const isValidPermissionCode = (value: string) => {
  return PERMISSION_CODE_REGEXP.test(value);
};
