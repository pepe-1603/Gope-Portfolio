<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/theme';
import { useGlobalModal } from '@/composables/useGlobalModal';
import ThemeSwitch from '@/components/common/ThemeSwitch.vue';
import UiButton from '@/components/ui/UiButton.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGear, faGears, faReply, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { storeToRefs } from 'pinia';
import ConfirmLogoutModal from '@/components/ui/modals/ConfirmLogoutModal.vue'; // Usaremos este modal

library.add(faGear, faGears, faReply, faRightFromBracket);

const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const modal = useGlobalModal(); // 👈 Importa y usa el composable

const { isAuthenticated } = storeToRefs(authStore);
const { isDarkMode } = storeToRefs(themeStore);

const isOpen = ref(false);

const dropdownButtonRef = ref<HTMLElement | null>(null);
const dropdownMenuRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Modificamos la función para que use el modal global
const handleLogoutConfirmation = async () => {
  isOpen.value = false; // Cierra el dropdown al abrir el modal

  // Muestra el modal de confirmación. Le pasamos el componente y los datos.
  const result = await modal.showModal(
    ConfirmLogoutModal,
    {},
    {
      title: 'Confirmar Cierre de Sesión',
      closeOnClickOutside: false,
    }
  );

  // Si el usuario confirma, procedemos con el cierre de sesión
  if (result?.action === 'confirm') {
    await authStore.logout();
    router.push({ name: 'home' });
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    isOpen.value &&
    dropdownButtonRef.value &&
    !dropdownButtonRef.value.contains(event.target as Node) &&
    dropdownMenuRef.value &&
    !dropdownMenuRef.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

const currentThemeText = computed(() => (isDarkMode.value ? 'Oscuro' : 'Claro'));

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="relative inline-block text-left">
    <button
      @click="toggleDropdown"
      ref="dropdownButtonRef"
      class="relative flex items-center p-2 rounded-full border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-colors duration-300 text-gray-800 dark:text-white"
      aria-label="Abrir menú de configuración"
    >
      <font-awesome-icon :icon="['fas', 'gear']" class="text-gray-400 h-5 w-5 hover:animate-spin" />
    </button>

    <transition name="fade">
      <div
        v-if="isOpen"
        ref="dropdownMenuRef"
        class="absolute right-0 mt-2 w-64 sm:w-72 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-50 transition-colors duration-500 p-4"
        @click.stop
      >
        <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          <font-awesome-icon :icon="['fas', 'gears']" class="text-purple-400 mr-2" /> Configuración
        </h3>

        <ul class="space-y-2 text-sm">
          <li>
            <div
              class="flex items-center justify-between w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <span>Tema</span>
              <div class="flex items-center space-x-2">
                <span
                  class="text-xs font-semibold px-2 py-1 rounded-full"
                  :class="{ 'bg-gray-200 dark:bg-gray-700': !isDarkMode, 'bg-gray-300 dark:bg-gray-600': isDarkMode }"
                >
                  {{ currentThemeText }}
                </span>
                <ThemeSwitch size="sm" />
              </div>
            </div>
          </li>
          <li v-if="isAuthenticated">
            <UiButton
              intent="danger"
              full-width
              @click="handleLogoutConfirmation"
              class="w-full flex items-center gap-2 text-left px-3 py-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition text-red-500 hover:text-red-600 dark:hover:text-red-400"
            >
              <font-awesome-icon :icon="['fas', 'right-from-bracket']" /> Cerrar Sesión
            </UiButton>
          </li>
          <li>
            <button
              @click="router.push('/')"
              class="w-full flex items-center justify-center px-3 py-2 text-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <font-awesome-icon :icon="['fas', 'reply']" class="size-4 mr-2" /> Ir al inicio
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
