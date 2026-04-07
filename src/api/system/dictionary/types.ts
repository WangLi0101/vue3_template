export interface DictionaryItem {
  dictionaryId: string;
  dictKey: string;
  value: string;
  info: string;
  level: number;
  parentUuid: string | null;
  children?: DictionaryItem[];
}

export interface DictionaryListQuery {
  dictKey: string;
  info: string;
}

export interface DictionaryListResponse {
  list: DictionaryItem[];
}

export interface CreateDictionaryPayload {
  dictKey: string;
  value: string;
  info: string;
  level: number;
  parentUuid: string | null;
}

export interface UpdateDictionaryPayload {
  dictionaryId: string;
  dictKey: string;
  value: string;
  info: string;
  level: number;
  parentUuid: string | null;
}

export interface DeleteDictionaryPayload {
  dictionaryId: string;
}

export interface DictionaryMutationResponse {
  success: boolean;
}
