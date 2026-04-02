export const SERVICE_URL_MAP = {
  MOCK: "/api",
} as const;

export type ServiceName = keyof typeof SERVICE_URL_MAP;
