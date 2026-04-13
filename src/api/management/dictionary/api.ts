import { request } from "@/utils/http";
import type {
  CreateDictionaryPayload,
  DeleteDictionaryPayload,
  DictionaryListQuery,
  DictionaryListResponse,
  DictionaryMutationResponse,
  UpdateDictionaryPayload,
} from "./types";

export const getDictionaryListApi = (params: DictionaryListQuery) => {
  return request<DictionaryListResponse>("/management/dictionary/list", "MOCK", {
    method: "post",
    data: params,
  });
};

export const createDictionaryApi = (payload: CreateDictionaryPayload) => {
  return request<DictionaryMutationResponse>("/management/dictionary", "MOCK", {
    method: "post",
    data: payload,
  });
};

export const updateDictionaryApi = (payload: UpdateDictionaryPayload) => {
  return request<DictionaryMutationResponse>("/management/dictionary", "MOCK", {
    method: "put",
    data: payload,
  });
};

export const deleteDictionaryApi = (payload: DeleteDictionaryPayload) => {
  return request<DictionaryMutationResponse>("/management/dictionary", "MOCK", {
    method: "delete",
    data: payload,
  });
};
