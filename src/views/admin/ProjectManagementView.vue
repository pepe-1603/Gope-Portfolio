<!-- src/views/admin/ProjectManagementView.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalModal } from '@/composables/useGlobalModal';
import { useToastStore } from '@/stores/toast';
import { projectService } from '@/services/projectService';
import UiButton from '@/components/ui/UiButton.vue';
import UiAlert from '@/components/ui/UiAlert.vue';
import SkeletonList from '@/components/ui/skeletons/SkeletonList.vue'; // Nuevo componente
import ConfirmDeleteModal from '@/components/ui/modals/ConfirmDeleteModal.vue'; // Modal de confirmación

const router = useRouter();
const modal = useGlobalModal();
const toastStore = useToastStore();

const projects = ref([]);
const loading = ref(true);
const hasError = ref(false);

const fetchProjects = async () => {
  try {
    loading.value = true;
    hasError.value = false;
    projects.value = await projectService.getAllProjects();
  } catch (error) {
    hasError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProjects();
});

const handleCreateProject = () => {
  router.push({ name: 'project-create' });
};

const handleEditProject = (slug: string) => {
  router.push({ name: 'project-edit', params: { slug } });
};

const handleDeleteProject = async (id: string, title: string) => {
  const result = await modal.showModal(
    ConfirmDeleteModal,
    { itemId: id, title },
    {
      title: 'Confirmar Eliminación',
      closeOnClickOutside: false,
    }
  );

  if (result?.action === 'confirm') {
    try {
      await projectService.deleteProject(id);
      await fetchProjects();
      toastStore.addToast({
        message: 'Proyecto eliminado con éxito.',
        type: 'success',
      });
    } catch (error) {
      toastStore.addToast({
        message: 'Error al eliminar el proyecto. Por favor, revisa tus permisos.',
        type: 'error',
      });
    }
  }
};
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold dark:text-gray-100">Gestión de Proyectos</h2>
      <UiButton @click="handleCreateProject" intent="primary">
        Crear Nuevo Proyecto
      </UiButton>
    </div>

    <!-- Muestra el esqueleto mientras los datos están cargando -->
    <div v-if="loading">
      <SkeletonList :count="5" />
    </div>

    <!-- Muestra el alerta si hubo un error en la carga -->
    <div v-else-if="hasError" class="p-4">
      <UiAlert intent="danger">
        No se pudieron cargar los proyectos. Por favor, inténtalo de nuevo más tarde.
      </UiAlert>
    </div>

    <!-- Muestra el mensaje de 'sin proyectos' -->
    <div v-else-if="projects.length === 0" class="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
      <p class="text-gray-500 dark:text-gray-400">No hay proyectos para mostrar.</p>
    </div>

    <!-- Muestra la lista de proyectos -->
    <div v-else class="space-y-4">
      <div v-for="project in projects" :key="project.id" class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex justify-between items-center">
        <span class="font-semibold text-gray-900 dark:text-white">{{ project.title }}</span>
        <div class="flex space-x-2">
          <UiButton @click="handleEditProject(project.slug)" intent="link">
            Editar
          </UiButton>
          <UiButton @click="handleDeleteProject(project.id, project.title)" intent="danger">
            Eliminar
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
