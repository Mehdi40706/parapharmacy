<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4 py-10">
    <div class="w-full max-w-md">
      <NuxtLink to="/" class="block text-center font-display text-2xl font-semibold text-sage-dark mb-8">
        Parapharmacie
      </NuxtLink>
      <div class="bg-white rounded-2xl shadow-sm border border-mist p-6 sm:p-8">
        <slot />
      </div>
    </div>
  </div>
</template>