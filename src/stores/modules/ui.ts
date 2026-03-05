import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const isSidebarCollapsed = ref(false)

  const toggleSidebar = (): void => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }

  const setSidebarCollapsed = (collapsed: boolean): void => {
    isSidebarCollapsed.value = collapsed
  }

  return {
    isSidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed
  }
})
