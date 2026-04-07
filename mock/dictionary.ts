import type { ServerResponse } from "node:http";
import type { MockMethod } from "vite-plugin-mock";
import type { ApiResponse } from "../src/types/http";
import { resolveProfileFromAccessToken, resolveRequestToken } from "./token-session";

interface MockDictionaryRecord {
  dictionaryId: string;
  dictKey: string;
  value: string;
  info: string;
  level: number;
  parentUuid: string | null;
}

interface DictionaryListQuery {
  dictKey?: string;
  info?: string;
}

interface CreateDictionaryPayload {
  dictKey?: string;
  value?: string;
  info?: string;
  level?: number;
  parentUuid?: string | null;
}

interface UpdateDictionaryPayload extends CreateDictionaryPayload {
  dictionaryId?: string;
}

interface DeleteDictionaryPayload {
  dictionaryId?: string;
}

const generateId = () => {
  const timestamp = Date.now().toString(16);
  const randomPart = Math.random().toString(16).slice(2, 10);
  return `${timestamp}${randomPart}`;
};

const initialDictionaries: MockDictionaryRecord[] = [
  // 一级：订单状态
  {
    dictionaryId: "dict_order_status",
    dictKey: "order_status",
    value: "",
    info: "订单状态",
    level: 1,
    parentUuid: null,
  },
  // 二级：订单状态子项
  {
    dictionaryId: "dict_order_pending",
    dictKey: "pending",
    value: "10",
    info: "待支付",
    level: 2,
    parentUuid: "dict_order_status",
  },
  {
    dictionaryId: "dict_order_paid",
    dictKey: "paid",
    value: "20",
    info: "已支付",
    level: 2,
    parentUuid: "dict_order_status",
  },
  // 三级：支付方式
  {
    dictionaryId: "dict_payment_method",
    dictKey: "payment_method",
    value: "",
    info: "支付方式",
    level: 3,
    parentUuid: "dict_order_paid",
  },
  // 四级：具体支付方式
  {
    dictionaryId: "dict_payment_wechat",
    dictKey: "wechat",
    value: "wechat_pay",
    info: "微信支付",
    level: 4,
    parentUuid: "dict_payment_method",
  },
  {
    dictionaryId: "dict_payment_alipay",
    dictKey: "alipay",
    value: "alipay",
    info: "支付宝支付",
    level: 4,
    parentUuid: "dict_payment_method",
  },
  {
    dictionaryId: "dict_order_shipped",
    dictKey: "shipped",
    value: "30",
    info: "已发货",
    level: 2,
    parentUuid: "dict_order_status",
  },
  {
    dictionaryId: "dict_order_completed",
    dictKey: "completed",
    value: "40",
    info: "已完成",
    level: 2,
    parentUuid: "dict_order_status",
  },
  // 一级：用户类型
  {
    dictionaryId: "dict_user_type",
    dictKey: "user_type",
    value: "",
    info: "用户类型",
    level: 1,
    parentUuid: null,
  },
  // 二级：用户类型子项
  {
    dictionaryId: "dict_user_normal",
    dictKey: "normal",
    value: "1",
    info: "普通用户",
    level: 2,
    parentUuid: "dict_user_type",
  },
  {
    dictionaryId: "dict_user_vip",
    dictKey: "vip",
    value: "2",
    info: "VIP用户",
    level: 2,
    parentUuid: "dict_user_type",
  },
  // 三级：VIP等级
  {
    dictionaryId: "dict_vip_level",
    dictKey: "vip_level",
    value: "",
    info: "VIP等级",
    level: 3,
    parentUuid: "dict_user_vip",
  },
  // 四级：具体VIP等级
  {
    dictionaryId: "dict_vip_1",
    dictKey: "vip1",
    value: "1",
    info: "VIP1",
    level: 4,
    parentUuid: "dict_vip_level",
  },
  {
    dictionaryId: "dict_vip_2",
    dictKey: "vip2",
    value: "2",
    info: "VIP2",
    level: 4,
    parentUuid: "dict_vip_level",
  },
  {
    dictionaryId: "dict_vip_3",
    dictKey: "vip3",
    value: "3",
    info: "VIP3",
    level: 4,
    parentUuid: "dict_vip_level",
  },
  // 一级：报名客服（原有数据）
  {
    dictionaryId: "682ef8b7d348792198d8e158",
    dictKey: "registration_chat",
    value: "",
    info: "报名客服",
    level: 1,
    parentUuid: null,
  },
];

let mockDictionaries = initialDictionaries.map((item) => ({ ...item }));

const success = <T>(data: T, message = "success"): ApiResponse<T> => ({
  code: 0,
  data,
  message,
});

const fail = (code: number, message: string, data: unknown = null): ApiResponse<unknown> => ({
  code,
  data,
  message,
});

const sendJson = (res: ServerResponse, status: number, payload: ApiResponse<unknown>): void => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const ensureAuthorized = (req: Parameters<NonNullable<MockMethod["rawResponse"]>>[0]) => {
  const result = resolveProfileFromAccessToken(resolveRequestToken(req));
  if ("error" in result) {
    return fail(result.error.code, result.error.message);
  }

  return null;
};

const serializeDictionary = (dict: MockDictionaryRecord): MockDictionaryRecord => ({
  dictionaryId: dict.dictionaryId,
  dictKey: dict.dictKey,
  value: dict.value,
  info: dict.info,
  level: dict.level,
  parentUuid: dict.parentUuid,
});

const listDictionaries = (query: DictionaryListQuery) => {
  const dictKey = query.dictKey?.trim().toLowerCase() || "";
  const info = query.info?.trim().toLowerCase() || "";

  const filtered = mockDictionaries.filter((item) => {
    const matchDictKey = !dictKey || item.dictKey.toLowerCase().includes(dictKey);
    const matchInfo = !info || item.info.toLowerCase().includes(info);
    return matchDictKey && matchInfo;
  });

  return {
    list: filtered.map(serializeDictionary),
  };
};

const mocks: MockMethod[] = [
  {
    url: "/api/system/dictionary/list",
    method: "post",
    rawResponse: async function (req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 200, authError);
        return;
      }

      const query = (await this.parseJson()) as DictionaryListQuery;
      sendJson(res, 200, success(listDictionaries(query)));
    },
  },
  {
    url: "/api/system/dictionary",
    method: "post",
    rawResponse: async function (req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 200, authError);
        return;
      }

      const body = (await this.parseJson()) as CreateDictionaryPayload;
      const dictKey = body.dictKey?.trim();
      const info = body.info?.trim();

      if (!dictKey || !info) {
        sendJson(res, 200, fail(40001, "请求参数不完整"));
        return;
      }

      const newDictionary: MockDictionaryRecord = {
        dictionaryId: generateId(),
        dictKey,
        value: body.value?.trim() || "",
        info,
        level: body.level ?? 1,
        parentUuid: body.parentUuid ?? null,
      };

      mockDictionaries = [newDictionary, ...mockDictionaries];

      sendJson(res, 200, success({ success: true }, "新增成功"));
    },
  },
  {
    url: "/api/system/dictionary",
    method: "put",
    rawResponse: async function (req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 200, authError);
        return;
      }

      const body = (await this.parseJson()) as UpdateDictionaryPayload;
      const dictionaryId = body.dictionaryId;
      const target = mockDictionaries.find((item) => item.dictionaryId === dictionaryId);

      if (!target) {
        sendJson(res, 200, fail(40401, "字典不存在"));
        return;
      }

      const dictKey = body.dictKey?.trim();
      const info = body.info?.trim();

      if (!dictKey || !info) {
        sendJson(res, 200, fail(40001, "请求参数不完整"));
        return;
      }

      target.dictKey = dictKey;
      target.value = body.value?.trim() || "";
      target.info = info;

      sendJson(res, 200, success({ success: true }, "编辑成功"));
    },
  },
  {
    url: "/api/system/dictionary",
    method: "delete",
    rawResponse: async function (req, res) {
      const authError = ensureAuthorized(req);
      if (authError) {
        sendJson(res, 200, authError);
        return;
      }

      const body = (await this.parseJson()) as DeleteDictionaryPayload;
      const dictionaryId = body.dictionaryId;
      const target = mockDictionaries.find((item) => item.dictionaryId === dictionaryId);

      if (!target) {
        sendJson(res, 200, fail(40401, "字典不存在"));
        return;
      }

      // 删除字典时，同时删除所有子级字典（递归）
      const getAllChildIds = (parentId: string): string[] => {
        const children = mockDictionaries.filter((item) => item.parentUuid === parentId);
        const childIds = children.map((item) => item.dictionaryId);
        for (const childId of childIds) {
          childIds.push(...getAllChildIds(childId));
        }
        return childIds;
      };

      const allIdsToDelete = [target.dictionaryId, ...getAllChildIds(target.dictionaryId)];
      mockDictionaries = mockDictionaries.filter(
        (item) => !allIdsToDelete.includes(item.dictionaryId),
      );

      sendJson(res, 200, success({ success: true }, "删除成功"));
    },
  },
];

export default mocks;
