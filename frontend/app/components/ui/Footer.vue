<template>
  <footer class="relative mt-8">
    <div class="bg-sage-dark text-white/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-6">
          <div>
            <p class="text-sm font-semibold text-white mb-3">Aide</p>
            <ul class="flex flex-col gap-2 text-sm">
              <li><NuxtLink to="/commandes" class="hover:text-honey transition-colors">Suivre ma commande</NuxtLink></li>
              <li><NuxtLink to="/compte" class="hover:text-honey transition-colors">Mon compte</NuxtLink></li>
              <li><NuxtLink to="/livraison" class="hover:text-honey transition-colors">Livraison et retours</NuxtLink></li>
              <li><NuxtLink to="/contact" class="hover:text-honey transition-colors">Nous contacter</NuxtLink></li>
            </ul>
          </div>
          <!-- Contact -->
          <div>
            <p class="text-sm font-semibold text-white mb-3">Contact</p>
            <ul class="flex flex-col gap-2 text-sm">
              <li class="flex items-center gap-2">
                <Icon name="heroicons:map-pin" class="w-4 h-4 text-honey shrink-0" />
                <span>Tunis, Tunisie</span>
              </li>
              <li class="flex items-center gap-2"> 
                <Icon name="heroicons:phone" class="w-4 h-4 text-honey shrink-0" />
                <span>+216 XX XXX XXX</span>
              </li>
              <li class="flex items-center gap-2">
                <Icon name="heroicons:envelope" class="w-4 h-4 text-honey shrink-0" />
                <span>contact@parapharmacie.tn</span>
              </li>
            </ul>
          </div>
          <div class="flex flex-col gap-2 text-sm">
            <div class="flex items-center gap-2">
              <Icon name="heroicons:truck" class="w-4 h-4 text-honey shrink-0" />
              <span>Livraison partout en Tunisie</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="heroicons:banknotes" class="w-4 h-4 text-honey shrink-0" />
              <span>Paiement à la livraison ou en ligne</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="heroicons:shield-check" class="w-4 h-4 text-honey shrink-0" />
              <span>Conseil pharmacien</span>
            </div>
          </div>
        </div>
        <div class="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© {{ currentYear }} Parapharmacie — Votre santé, notre priorité</p>
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5">
              <Icon name="heroicons:lock-closed" class="w-3.5 h-3.5" />
              Paiement sécurisé
            </span>
            <span>COD & en ligne</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>