interface ServiceUrlMap {
  MOCK: string;
}
const SERVICE_URL_MAP = {
  MOCK: "/api",
};

export type ServiceName = keyof ServiceUrlMap;

export { SERVICE_URL_MAP };
