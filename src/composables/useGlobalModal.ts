// src/composables/useGlobalModal.ts

import type { IModalService } from '@/types/modal.d.ts';

export const useGlobalModal = (): IModalService => {
  if (!window.__global_modal__) {
    throw new Error("Error: Modal service not found on window.__global_modal__. Ensure modalPlugin is installed correctly.");
  }
  return window.__global_modal__;
};
