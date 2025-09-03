<template>
  <span :class="badgeClasses">
    <div v-if="pointer && size=='xs'" class="rounded-full p-0.5 border-none shadow-none outline-none relative -top-1 -left-0.5 bg-current opacity-75"></div>
    <div v-if="icon" :class="iconContainerClasses">
      <img v-if="typeof icon === 'string'" :src="icon" alt="" class="w-7 h-7 object-contain" />
      <component v-else :is="icon" :class="iconSizeClasses" />
    </div>

    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue'
import { badgeStyles, type BadgeVariants } from '@/utils/badgeStyles'

interface UiBadgeProps {
  text: string
  color?: BadgeVariants['color']
  size?: BadgeVariants['size']
  pointer?: boolean
  // La prop 'icon' ahora acepta un string (URL) o un componente de Vue
  icon?: string | object | Function | null
}

const props = withDefaults(defineProps<UiBadgeProps>(), {
  color: 'gray',
  size: 'sm',
  pointer: false,
  icon: null,
})

const iconContainerClasses = computed<string>(() => {
  switch (props.size) {
    case 'xs':
      return 'mr-0.5'
    case 'sm':
      return 'mr-1'
    case 'md':
      return 'mr-1.5'
    case 'lg':
      return 'mr-2'
    case 'xl':
      return 'mr-2.5'
    default:
      return 'mr-1'
  }
})

const iconSizeClasses = computed<string>(() => {
  switch (props.size) {
    case 'xs':
    case 'sm':
      return 'w-3 h-3'
    case 'md':
      return 'w-4 h-4'
    case 'lg':
    case 'xl':
      return 'w-5 h-5'
    default:
      return 'w-4 h-4'
  }
})

const badgeClasses = computed<string>(() => {
  return badgeStyles({
    color: props.color,
    size: props.size,
  })
})
</script>
