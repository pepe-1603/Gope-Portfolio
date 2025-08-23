<template>
  <section class="min-h-screen flex items-center justify-center text-center px-6 py-12">
    <div class="max-w-3xl">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Hola, soy José 👋
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
        Desarrollador web especializado en construir aplicaciones modernas con Vue y Supabase.
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <router-link
          to="/proyectos"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Ver Proyectos
        </router-link>
        <router-link
          to="/about"
          class="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition"
        >
          Sobre mí
        </router-link>
      </div>
    </div>
  </section>
</template>
