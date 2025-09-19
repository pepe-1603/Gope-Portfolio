<template>
  <div class="p-6">
    <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
      Confirmar Cambios del Perfil
    </h3>
    <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
      Revisa los cambios que se aplicarán a tu perfil.
    </p>

    <div class="space-y-4 text-sm text-gray-700 dark:text-gray-300">
      <div
        v-for="(value, key) in changes"
        :key="key"
        class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
      >
        <dt class="font-medium capitalize">{{ formatLabel(key) }}:</dt>
        <dd class="text-gray-900 dark:text-white">
          <span class="text-gray-500 dark:text-gray-400">Original:</span>
          {{ formatValue(originalData[key]) }}
        </dd>
        <dd class="text-green-600 dark:text-green-400">
          <span class="font-semibold">Nuevo:</span> {{ formatValue(value) }}
        </dd>
      </div>
      <div v-if="Object.keys(changes).length === 0" class="p-3 text-center text-gray-500">
        No se detectaron cambios en el perfil.
      </div>
    </div>

    <div class="flex justify-end space-x-2 mt-6">
      <UiButton @click="handleCancel" intent="secondary">Cancelar</UiButton>
      <UiButton @click="handleConfirm" intent="primary">Confirmar y Guardar</UiButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import type { ModalResult } from '@/types/modal'

export default defineComponent({
  name: 'ConfirmProfileChangesModal',
  components: {
    UiButton,
  },
  props: {
    modalId: { type: Number, required: true },
    __onConfirm: { type: Function as PropType<(result: ModalResult) => void>, required: true },
    __onCancel: { type: Function as PropType<(result: ModalResult) => void>, required: true },
    __onClose: { type: Function as PropType<(result: ModalResult) => void>, required: true },
    originalData: { type: Object, required: true },
    newData: { type: Object, required: true },
  },
  computed: {
    changes(): { [key: string]: any } {
      const diff: { [key: string]: any } = {}
      for (const key in this.newData) {
        if (Object.prototype.hasOwnProperty.call(this.newData, key)) {
          if (this.newData[key] !== this.originalData[key]) {
            diff[key] = this.newData[key]
          }
        }
      }
      return diff
    },
  },
  methods: {
    // Métodos para manejar los botones de acción
    handleConfirm() {
      this.__onConfirm({ action: 'confirm', payload: null } as ModalResult)
    },
    handleCancel() {
      this.__onCancel({ action: 'cancel', payload: null } as ModalResult)
    },
    // Métodos utilitarios para formatear la visualización
    formatLabel(key: string): string {
      const labels: { [key: string]: string } = {
        name: 'Nombre Completo',
        bio: 'Biografía',
        avatar: 'Foto de Perfil',
        cv_url: 'Curriculum Vitae',
        github_url: 'GitHub URL',
        linkedin_url: 'LinkedIn URL',
      }
      return labels[key] || key
    },
    formatValue(value: any): string {
      if (value === null || value === '' || typeof value === 'undefined') {
        return 'Sin dato'
      }
      if (typeof value === 'string' && value.startsWith('http')) {
        const parts = value.split('/')
        return parts.pop() || ''
      }
      return value
    },
  },
})
</script>
