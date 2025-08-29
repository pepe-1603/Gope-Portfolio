// src/plugins/modalPlugin.ts

import type { App } from 'vue';
import { useModalService } from '@/services/modalService';
import type { IModalService } from '@/types/modal.d.ts';

declare global {
  interface Window {
    __global_modal__?: IModalService;
  }
}

export default {
  install(app: App) {
    const modalService: IModalService = useModalService();
    // 🚀 Usa window.__global_modal__ para el acceso global
    window.__global_modal__ = modalService;
    // Opcionalmente, para compatibilidad con el estilo de Vue
    app.config.globalProperties.$modal = modalService;
  },
};
