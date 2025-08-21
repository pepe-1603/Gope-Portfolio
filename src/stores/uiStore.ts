// src/stores/uiStore.ts
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    isLoading: false,
  }),
  actions: {
    setLoading(status: boolean) {
      this.isLoading = status
    },
  },
})
