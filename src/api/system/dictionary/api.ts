import { request } from "@/utils/http";
import type {
  CreateDictionaryPayload,
  DictionaryListResponse,
  DictionaryMutationResponse,
  DictionaryListQuery,
  UpdateDictionaryPayload,
  DeleteDictionaryPayload,
} from "@/api/system/dictionary/types";

export const getDictionaryListApi = (params: DictionaryListQuery) => {
  return request<DictionaryListResponse>("/system/dictionary/list", "MOCK", {
    method: "post",
    data: params,
  });
};

export const createDictionaryApi = (payload: CreateDictionaryPayload) => {
  return request<DictionaryMutationResponse>("/system/dictionary", "MOCK", {
    method: "post",
    data: payload,
  });
};

export const updateDictionaryApi = (payload: UpdateDictionaryPayload) => {
  return request<DictionaryMutationResponse>("/system/dictionary", "MOCK", {
    method: "put",
    data: payload,
  });
};

export const deleteDictionaryApi = (payload: DeleteDictionaryPayload) => {
  return request<DictionaryMutationResponse>("/system/dictionary", "MOCK", {
    method: "delete",
    data: payload,
  });
};
