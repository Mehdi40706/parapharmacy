<template>
  <div class="flex gap-2 justify-start">
    <div class="w-7 h-7 rounded-full bg-gradient-to-br from-sage/20 to-honey/20 flex items-center justify-center shrink-0 mt-0.5 ring-1 ring-sage/10">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-sage-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 2a4 4 0 00-4 4v2H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-2V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2h-4z" />
      </svg>
    </div>

    <div class="bg-white border border-mist/70 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm text-sage-dark" role="status" aria-label="L'assistant écrit">
      <span class="typing-dot" />
      <span class="typing-dot" />
      <span class="typing-dot" />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0.5;
  animation: typing-bounce 1.1s infinite ease-in-out;
}
.typing-dot:nth-child(1) {
  animation-delay: 0s;
}
.typing-dot:nth-child(2) {
  animation-delay: 0.15s;
}
.typing-dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes typing-bounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .typing-dot {
    animation: none;
    opacity: 0.7;
  }
}
</style>