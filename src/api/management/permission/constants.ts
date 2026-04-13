export const PERMISSION_STATUS = {
  DISABLED: 0,
  ENABLED: 1,
} as const;

export type PermissionStatus = (typeof PERMISSION_STATUS)[keyof typeof PERMISSION_STATUS];

export const PERMISSION_STATUS_LABEL_MAP: Record<PermissionStatus, string> = {
  [PERMISSION_STATUS.DISABLED]: "停用",
  [PERMISSION_STATUS.ENABLED]: "启用",
};

export const PERMISSION_STATUS_OPTIONS = [
  {
    label: PERMISSION_STATUS_LABEL_MAP[PERMISSION_STATUS.ENABLED],
    value: PERMISSION_STATUS.ENABLED,
  },
  {
    label: PERMISSION_STATUS_LABEL_MAP[PERMISSION_STATUS.DISABLED],
    value: PERMISSION_STATUS.DISABLED,
  },
] as const;

export const PERMISSION_TYPE = {
  MENU: 1,
  BUTTON: 2,
} as const;

export type PermissionType = (typeof PERMISSION_TYPE)[keyof typeof PERMISSION_TYPE];

export const PERMISSION_TYPE_LABEL_MAP: Record<PermissionType, string> = {
  [PERMISSION_TYPE.MENU]: "菜单",
  [PERMISSION_TYPE.BUTTON]: "按钮",
};

export const PERMISSION_TYPE_OPTIONS = [
  {
    label: PERMISSION_TYPE_LABEL_MAP[PERMISSION_TYPE.MENU],
    value: PERMISSION_TYPE.MENU,
  },
  {
    label: PERMISSION_TYPE_LABEL_MAP[PERMISSION_TYPE.BUTTON],
    value: PERMISSION_TYPE.BUTTON,
  },
] as const;
