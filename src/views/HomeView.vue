<template>
  <!-- Contenedor principal de la landing page -->
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 dark:from-gray-900 dark:to-black text-white p-4"
  >
    <div class="max-w-4xl w-full text-center space-y-8 animate-fade-in">
      <!-- Sección de Imagen/Ilustración (Opcional) -->
      <!-- Puedes reemplazar esta imagen de placeholder con una tuya -->
      <img
        src="https://placehold.co/150x150/ffffff/000000?text=Tu+Foto"
        alt="Tu Foto de Perfil"
        class="rounded-full mx-auto shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-300"
      />
      <!--  -->

      <!-- Nombre, título y descripción breve -->
      <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight">
        Hola, soy <span class="text-yellow-300">José 👋</span>
      </h1>
      <p class="mt-4 text-xl md:text-2xl font-light leading-relaxed">
        Un apasionado <span class="font-bold text-yellow-300">Desarrollador Full-stack</span>
        creando experiencias web increíbles.
      </p>
      <p class="text-lg md:text-xl text-gray-200">
        Me encanta transformar ideas complejas en soluciones digitales elegantes y funcionales.
      </p>

      <!-- Botones de Call To Action -->
      <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <router-link to="/proyectos">
          <button
            class="bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-75"
          >
            Ver Proyectos
          </button>
        </router-link>
        <router-link to="/sobre-mi">
          <button
            class="bg-blue-400 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-500 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75"
          >
            Sobre Mí
          </button>
        </router-link>
        <router-link to="/contacto">
          <button
            class="bg-purple-400 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-500 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-75"
          >
            Contacto
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No se necesita lógica específica en el script para esta landing page estática.
</script>

<style scoped>
/* Animación simple de fade-in para una entrada suave */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}
</style>
