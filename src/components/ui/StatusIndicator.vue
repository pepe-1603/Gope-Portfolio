<script setup lang="ts">
import { computed, withDefaults } from 'vue';
import { indicatorColors, sizeMap } from '@/utils/StatusIndicatorStyle.ts';

// Definición de las props
interface Props {
  color?: keyof typeof indicatorColors;
  size?: keyof typeof sizeMap;
  text?: string;
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'green',
  size: 'md',
  text: undefined,
  animated: false
});

// Clases computadas para el indicador
const indicatorClasses = computed(() => {
  const color = indicatorColors[props.color] || indicatorColors.green;
  return `${color.background} inline-flex items-center justify-center rounded-full p-1`;
});

// Clases computadas para la bolita del indicador
const dotClasses = computed(() => {
  const color = indicatorColors[props.color] || indicatorColors.green;
  const animation = props.animated ? 'animate-spin' : '';
  return `${color.dot} size-1.5 rounded-full ${animation}`;
});

// Clases computadas para el texto
const textClasses = computed(() => {
  const textSize = sizeMap[props.size] || sizeMap.md;
  return `text-gray-600 ${textSize} self-end`;
});
</script>

<template>
  <div class="inline-flex items-center justify-center gap-1">
    <div :class="indicatorClasses">
      <div :class="dotClasses"></div>
    </div>
    <p v-if="props.text" :class="textClasses">{{ props.text }}</p>
  </div>
</template>
