export const ROLE_STATUS = {
  DISABLED: 0,
  ENABLED: 1,
} as const;

export type RoleStatus = (typeof ROLE_STATUS)[keyof typeof ROLE_STATUS];

export const ROLE_STATUS_LABEL_MAP: Record<RoleStatus, string> = {
  [ROLE_STATUS.DISABLED]: "停用",
  [ROLE_STATUS.ENABLED]: "启用",
};

export const ROLE_STATUS_OPTIONS = [
  {
    label: ROLE_STATUS_LABEL_MAP[ROLE_STATUS.ENABLED],
    value: ROLE_STATUS.ENABLED,
  },
  {
    label: ROLE_STATUS_LABEL_MAP[ROLE_STATUS.DISABLED],
    value: ROLE_STATUS.DISABLED,
  },
] as const;
