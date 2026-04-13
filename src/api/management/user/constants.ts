export const USER_STATUS = {
  DISABLED: 0,
  ENABLED: 1,
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const USER_STATUS_LABEL_MAP: Record<UserStatus, string> = {
  [USER_STATUS.DISABLED]: "停用",
  [USER_STATUS.ENABLED]: "启用",
};

export const USER_STATUS_OPTIONS = [
  {
    label: USER_STATUS_LABEL_MAP[USER_STATUS.ENABLED],
    value: USER_STATUS.ENABLED,
  },
  {
    label: USER_STATUS_LABEL_MAP[USER_STATUS.DISABLED],
    value: USER_STATUS.DISABLED,
  },
] as const;
