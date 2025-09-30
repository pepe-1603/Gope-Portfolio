<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { computed } from 'vue'
import type { TechDistribution } from '@/services/statsService'

// 1. Registrar los elementos necesarios de Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps<{
  data: TechDistribution[] // Recibimos los datos del servicio
}>()

// 2. Opciones de la gráfica
const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false, // Permitir que el contenedor maneje el tamaño
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: 'rgb(156, 163, 175)', // Gris 400 (para tema oscuro)
      },
    },
    title: {
      display: false,
    },
  },
}

// 3. Generación de datos y colores dinámicos
const chartData = computed<ChartData<'doughnut'>>(() => {
  // Definir una paleta de colores para las gráficas
  const colors = [
    '#4f46e5', // Indigo-600
    '#10b981', // Emerald-500
    '#f59e0b', // Amber-500
    '#ef4444', // Red-500
    '#3b82f6', // Blue-500
    '#8b5cf6', // Violet-500
    '#ec4899', // Pink-500
  ]

  const labels = props.data.map((item) => item.name)
  const counts = props.data.map((item) => item.project_count)

  return {
    labels: labels,
    datasets: [
      {
        backgroundColor: labels.map((_, index) => colors[index % colors.length]),
        data: counts,
      },
    ],
  }
})
</script>

<template>
  <div class="h-full w-full">
    <Doughnut :data="chartData" :options="chartOptions" class="max-h-[400px]" />
  </div>
</template>
