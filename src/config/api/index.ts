export interface SystemItem {
  name: string;
  url: string;
  type: "this" | "external";
  roles?: string[];
}

const mode = import.meta.env.MODE;
type SystemKey = "admin" | "purchase";
type ServiceUrlMap = {
  MOCK: string;
};

interface SystemDefinition extends Omit<SystemItem, "url"> {
  key: SystemKey;
}

interface EnvConfig {
  serviceUrlMap: ServiceUrlMap;
  systemUrlMap: Record<SystemKey, string>;
}

const SYSTEM_DEFINITIONS: SystemDefinition[] = [
  {
    key: "admin",
    name: "管理系统",
    type: "this",
  },
  {
    key: "purchase",
    name: "采购平台",
    type: "external",
  },
];

const resolveEnvConfig = (): EnvConfig => {
  switch (mode) {
    case "production":
      return {
        serviceUrlMap: {
          MOCK: "/api",
        },
        systemUrlMap: {
          admin: "/",
          purchase: "http://localhost:5174",
        },
      };
    case "staging":
      return {
        serviceUrlMap: {
          MOCK: "/api",
        },
        systemUrlMap: {
          admin: "/",
          purchase: "http://localhost:5174",
        },
      };
    case "development":
      return {
        serviceUrlMap: {
          MOCK: "/api",
        },
        systemUrlMap: {
          admin: "/",
          purchase: "http://localhost:5174",
        },
      };
    default:
      return {
        serviceUrlMap: {
          MOCK: "/api",
        },
        systemUrlMap: {
          admin: "/",
          purchase: "http://localhost:5174",
        },
      };
  }
};

const envConfig = resolveEnvConfig();

const resolveSystemList = (): SystemItem[] => {
  return SYSTEM_DEFINITIONS.map(({ key, ...item }) => ({
    ...item,
    url: envConfig.systemUrlMap[key],
  }));
};

export const SERVICE_URL_MAP = envConfig.serviceUrlMap;

export type ServiceName = keyof typeof SERVICE_URL_MAP;

export const systemList: SystemItem[] = resolveSystemList();
