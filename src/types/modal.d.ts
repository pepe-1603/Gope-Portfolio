// src/types/modal.d.ts

import type { Component, Ref } from 'vue';

export interface ModalOptions {
  title?: string;
  closeOnClickOutside?: boolean;
}

export interface ActiveModal {
  id: number;
  component: Component;
  props: Record<string, any>;
  options: ModalOptions;
  show: boolean;
  _resolver: (value: any) => void;
  _actionResult: any;
}

export interface ModalResult {
  id: number;
  action: 'confirm' | 'cancel' | 'close' | 'duplicate' | 'programmatic_close' | 'connection_lost_preempt' | 'connection_restored_preempt' | 'backend_down_preempt' | 'backend_up_preempt';
  payload?: any;
}

export interface IModalService {
  activeModals: Ref<Record<number, ActiveModal>>;
  showModal: (component: Component | string, props?: Record<string, any>, options?: ModalOptions) => Promise<ModalResult>;
  hideModal: (id: number, result?: ModalResult) => void;
  forceHideModal: (id: number, action?: ModalResult['action'], payload?: any) => void;
  hideAllModals: () => void;
  currentOfflineModalId: Ref<number | null>;
  currentOnlineModalId: Ref<number | null>;
  currentBackendDownModalId: Ref<number | null>;
  currentBackendUpModalId: Ref<number | null>;
}
