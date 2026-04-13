import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { DictionaryItem, DictionaryListQuery } from "@/api/management/dictionary";
import { getDictionaryListApi } from "@/api/management/dictionary";
import { arrayToTree } from "@/utils/tree";

export const useDictionaryStore = defineStore(
  "dictionary",
  () => {
    const dictionaryList = ref<DictionaryItem[]>([]);
    const isLoading = ref(false);

    const dictionaryTree = computed(() => {
      return arrayToTree(dictionaryList.value, {
        idKey: "dictionaryId",
        parentKey: "parentUuid",
      });
    });

    const loadDictionaryList = async (params: DictionaryListQuery = { dictKey: "", info: "" }) => {
      isLoading.value = true;
      try {
        const response = await getDictionaryListApi(params);
        if (response.code === 0) {
          dictionaryList.value = response.data.list;
        }
      } finally {
        isLoading.value = false;
      }
    };

    const clearDictionaryList = () => {
      dictionaryList.value = [];
    };

    return {
      dictionaryList,
      dictionaryTree,
      isLoading,
      loadDictionaryList,
      clearDictionaryList,
    };
  },
  {
    persist: {
      storage: sessionStorage,
      key: "rbac-admin-dictionary",
      pick: ["dictionaryList"],
    },
  },
);
