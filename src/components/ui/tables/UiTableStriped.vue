<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <caption
        class="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800"
      >
        <slot name="caption-title">
          {{ captionTitle }}
        </slot>
        <slot name="caption-description">
          <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            {{ captionDescription }}
          </p>
        </slot>
      </caption>
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th
            v-for="(header, index) in normalizedHeaders"
            :key="index"
            scope="col"
            class="px-6 py-3"
            @click="handleSort(header.key)"
            :class="{ 'cursor-pointer select-none': sortableHeaders }"
          >
            <div class="flex items-center" :class="{ 'justify-end': header.key === 'Acciones' }">
              {{ header.label }}
              <template v-if="sortableHeaders && sortColumn === header.key">
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
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
        >
          <td
            v-for="(header, colIndex) in normalizedHeaders"
            :key="colIndex"
            :class="{
              'px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white':
                colIndex === 0, // Estilo para la primera columna
              'px-6 py-4': colIndex !== 0 && header.key !== 'Acciones', // Estilo para otras columnas de datos
              'px-6 py-4 text-right': header.key === 'Acciones', // Estilo para la columna de acciones
            }"
            :scope="colIndex === 0 ? 'row' : undefined"
          >
            <slot :name="header.key" :item="item">
              {{ item[header.key] }}
            </slot>
          </td>
        </tr>
        <tr v-if="showFilter && !filteredAndSortedData.length && globalFilter">
          <td
            :colspan="normalizedHeaders.length"
            class="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
          >
            No se encontraron resultados para "{{ globalFilter }}".
          </td>
        </tr>
        <tr v-if="!data.length && !cargando && !error && !globalFilter">
          <td
            :colspan="normalizedHeaders.length"
            class="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
          >
            No hay datos disponibles.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowUpIcon as IconArrowUp, ArrowDownIcon as IconArrowDown } from '@heroicons/vue/20/solid' // Asegúrate de tener Heroicons instalado
// Si tienes un componente UiInputSearch y quieres incluirlo aquí, puedes hacerlo
// import UiInputSearch from './UiInputSearch.vue';

const props = defineProps({
  headers: {
    type: Array,
    required: true,
    // La validación se relaja para aceptar ambos tipos de headers
    validator: (value) => Array.isArray(value) && value.length > 0,
  },
  data: {
    type: Array,
    default: () => [],
  },
  // Opciones para el caption
  captionTitle: {
    type: String,
    default: 'Nuestros Datos',
  },
  captionDescription: {
    type: String,
    default: 'Explora la información mostrada en esta tabla.',
  },
  // Opciones para el filtro y ordenamiento
  showFilter: {
    // Controla si se muestra el input de búsqueda
    type: Boolean,
    default: false,
  },
  filterPlaceholder: {
    // Placeholder del input de búsqueda
    type: String,
    default: 'Buscar en la tabla...',
  },
  sortableHeaders: {
    // Controla si los headers son cliqueables para ordenar
    type: Boolean,
    default: true,
  },
  // Props para manejar el estado de carga y error desde el componente padre
  cargando: {
    type: Boolean,
    default: false,
  },
  error: {
    type: [String, Object],
    default: null,
  },
})

const sortColumn = ref(null)
const sortDirection = ref('asc')
const globalFilter = ref('') // Si incluyes UiInputSearch, necesitarás esto

// Computada para normalizar los headers (misma lógica que antes)
const normalizedHeaders = computed(() => {
  return props.headers.map((header) => {
    if (typeof header === 'string') {
      return { label: header, key: header }
    } else if (typeof header === 'object' && header.label && header.key) {
      return header
    } else {
      console.warn('Formato de header no válido:', header)
      return { label: 'N/A', key: 'N/A' }
    }
  })
})

const sortedData = computed(() => {
  if (!props.sortableHeaders || !sortColumn.value) {
    // Considera sortableHeaders para el ordenamiento
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
  if (!props.sortableHeaders) return // Si no es sortable, no hacer nada

  if (sortColumn.value === columnKey) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = columnKey
    sortDirection.value = 'asc'
  }
}
</script>

<style scoped>
/* No se necesitan estilos específicos de `style` aquí si todo es Tailwind */
/* Pero si tuvieras algún estilo que no se pueda expresar con Tailwind, iría aquí */
</style>
