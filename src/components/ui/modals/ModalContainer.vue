<script setup lang="ts">
import { computed } from 'vue';
import { useGlobalModal } from '@/composables/useGlobalModal';
import type { ActiveModal } from '@/types/modal.d.ts';
import UiModal from './UiModal.vue';

const modalService = useGlobalModal();

const modalsToRender = computed<ActiveModal[]>(() => Object.values(modalService.activeModals.value));

const handleUiModalClose = (id: number) => {
  const activeModal = modalService.activeModals.value[id];
  if (activeModal) {
    // Si el modal permite el cierre fuera, lo ocultamos. De lo contrario, no hacemos nada.
    if (activeModal.options.closeOnClickOutside) {
      modalService.hideModal(id, { id, action: 'closed_by_ui' });
    }
  }
};
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-50">
    <UiModal
      v-for="modal in modalsToRender"
      :key="modal.id"
      :show="modal.show"
      :title="modal.options.title"
      :close-on-click-outside="modal.options.closeOnClickOutside"
      @close="() => handleUiModalClose(modal.id)"
    >
      <component
        :is="modal.component"
        v-bind="modal.props"
      />
    </UiModal>
  </div>
</template>
