export const SERVICE_URL_MAP = {
  auth: "/api",
} as const;

export type ServiceName = keyof typeof SERVICE_URL_MAP;
