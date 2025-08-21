<template>
  <div class="w-full">
    <UiInputSearch
      v-if="showFilter"
      :modelValue="globalFilter"
      @update:modelValue="globalFilter = $event"
      :placeholder="filterPlaceholder"
      class="mb-4"
    />
    <div
      class="overflow-auto sm:overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div class="relative">
        <table class="w-full min-w-fit table-auto">
          <thead
            class="sticky top-0 bg-gray-100 dark:bg-gray-900 z-10 border-b border-gray-100 dark:border-gray-800"
          >
            <tr>
              <th
                v-for="(header, index) in normalizedHeaders"
                :key="index"
                class="px-4 py-3 text-left font-medium text-gray-500 text-xs dark:text-gray-400 cursor-pointer select-none"
                @click="handleSort(header.key)"
              >
                <div class="flex items-center">
                  {{ header.label }}
                  <template v-if="sortColumn === header.key">
                    <IconArrowUp
                      v-if="sortDirection === 'asc'"
                      class="ml-1 h-4 w-4 text-gray-500 dark:text-gray-400"
                    />
                    <IconArrowDown v-else class="ml-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </template>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, rowIndex) in filteredAndSortedData"
              :key="rowIndex"
              class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              <td
                v-for="(header, colIndex) in normalizedHeaders"
                :key="colIndex"
                class="px-4 py-3 text-gray-800 text-sm dark:text-white/90"
              >
                <slot :name="header.key" :item="item">
                  {{ item[header.key] }}
                </slot>
              </td>
            </tr>
            <tr v-if="showFilter && !filteredAndSortedData.length && globalFilter">
              <td
                :colspan="headers.length"
                class="px-4 py-3 text-center text-gray-500 dark:text-gray-400"
              >
                No se encontraron resultados para "{{ globalFilter }}".
              </td>
            </tr>
            <tr v-if="!data.length && !globalFilter">
              <td
                :colspan="headers.length"
                class="px-4 py-3 text-center text-gray-500 dark:text-gray-400"
              >
                No hay datos disponibles.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowUpIcon as IconArrowUp, ArrowDownIcon as IconArrowDown } from '@heroicons/vue/20/solid'
// Make sure the file exists at this path, or update the path if needed
import UiInputSearch from './UiInputSearch.vue'

const props = defineProps({
  headers: {
    type: Array,
    required: true,
    // La validaciÃ³n se relaja para aceptar ambos tipos, o se hace mÃ¡s compleja si necesitas ser estricto
    // Para este caso, solo verificamos que sea un array y confiamos en normalizedHeaders para el formato.
    validator: (value) => Array.isArray(value) && value.length > 0,
  },
  data: {
    type: Array,
    default: () => [],
  },
  showFilter: {
    type: Boolean,
    default: false,
  },
  filterPlaceholder: {
    type: String,
    default: 'Buscar en la tabla...',
  },
})

const sortColumn = ref(null)
const sortDirection = ref('asc')
const globalFilter = ref('')

// Nuevo computed property para normalizar los headers
const normalizedHeaders = computed(() => {
  return props.headers.map((header) => {
    if (typeof header === 'string') {
      // Si el header es un string, lo convertimos a un objeto { label, key }
      // El label y el key serÃ¡n el mismo string.
      return { label: header, key: header }
    } else if (typeof header === 'object' && header.label && header.key) {
      // Si ya es un objeto con label y key, lo usamos tal cual
      return header
    } else {
      // Manejar casos inesperados, quizÃ¡s lanzar un error o retornar un default
      console.warn('Formato de header no vÃ¡lido:', header)
      return { label: 'N/A', key: 'N/A' } // Fallback
    }
  })
})

const sortedData = computed(() => {
  if (!sortColumn.value) {
    return [...props.data]
  }

  return [...props.data].sort((a, b) => {
    const valueA = a[sortColumn.value]
    const valueB = b[sortColumn.value]

    if (valueA === null || valueA === undefined) return sortDirection.value === 'asc' ? 1 : -1
    if (valueB === null || valueB === undefined) return sortDirection.value === 'asc' ? -1 : 1

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection.value === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA)
    } else if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection.value === 'asc' ? valueA - valueB : valueB - valueA
    } else {
      if (valueA < valueB) return sortDirection.value === 'asc' ? -1 : 1
      if (valueA > valueB) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    }
  })
})

const filteredData = computed(() => {
  if (!props.showFilter || !globalFilter.value) {
    return sortedData.value
  }

  const lowerCaseFilter = globalFilter.value.toLowerCase()
  return sortedData.value.filter((item) => {
    // AquÃ­ puedes decidir si filtrar sobre todas las propiedades del item,
    // o solo sobre las propiedades definidas en normalizedHeaders para ser mÃ¡s preciso.
    // El enfoque actual de Object.values(item) filtra sobre todas las propiedades,
    // lo cual estÃ¡ bien para una bÃºsqueda global.
    return Object.values(item).some((value) => {
      if (value !== null && value !== undefined) {
        return String(value).toLowerCase().includes(lowerCaseFilter)
      }
      return false
    })
  })
})

const filteredAndSortedData = filteredData

const handleSort = (columnKey) => {
  if (sortColumn.value === columnKey) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = columnKey
    sortDirection.value = 'asc'
  }
}
</script>

<style scoped>
/* Tus estilos existentes */
.overflow-auto {
  max-height: 520px;
  overflow-y: auto;
}

.min-w-full {
  min-width: 100%;
}
</style>
