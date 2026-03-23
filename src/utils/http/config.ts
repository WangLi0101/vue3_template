interface ServiceUrlMap {
  MOCK: string;
}
const SERVICE_URL_MAP = {
  MOCK: "/api",
};

export type ServiceName = keyof ServiceUrlMap;

const env = import.meta.env.MODE;
switch (env) {
  case "development":
    SERVICE_URL_MAP.MOCK = "/api";
    break;
  case "production":
    SERVICE_URL_MAP.MOCK = "/api";
    break;
  case "staging":
    SERVICE_URL_MAP.MOCK = "/api";
    break;
}

export { SERVICE_URL_MAP };
