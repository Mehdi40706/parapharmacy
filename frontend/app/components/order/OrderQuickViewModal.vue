<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="order"
        class="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
        >
          <div class="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto relative">
            <button
              @click="$emit('close')"
              class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-mist flex items-center justify-center hover:bg-mist/70 transition-colors"
              aria-label="Fermer"
            >
              <Icon name="lucide:x" class="w-4 h-4" />
            </button>

            <div class="p-6">
              <div class="flex items-center gap-2 mb-1">
                <OrderStatusBadge :status="order.status" />
                <span class="text-xs text-ink/40">#{{ order.id.slice(0, 8) }}</span>
              </div>
              <h2 class="text-lg font-display font-semibold">
                {{ order.user.firstName }} {{ order.user.lastName }}
              </h2>
              <p class="text-xs text-ink/50 mt-0.5">
                Commande passée le {{ new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }}
              </p>

              <!-- Articles -->
              <div class="mt-5">
                <p class="text-xs font-medium uppercase tracking-wide text-ink/40 mb-2">Articles</p>
                <div class="flex flex-col gap-2">
                  <button
                    v-for="item in order.items"
                    :key="item.id"
                    :disabled="!item.product"
                    @click="item.product && $emit('view-product', item.product)"
                    class="flex items-center justify-between gap-3 bg-mist/40 rounded-xl p-3 text-left transition-colors"
                    :class="item.product ? 'hover:bg-mist/70 cursor-pointer' : 'cursor-default'"
                  >
                    <div class="min-w-0">
                      <p class="text-sm font-medium truncate">
                        {{ item.product?.name ?? 'Produit supprimé' }}
                      </p>
                      <p class="text-xs text-ink/50">Qté : {{ item.quantity }}</p>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      <span class="price text-sm">{{ Number(item.price).toFixed(2) }} TND</span>
                      <Icon
                        v-if="item.product"
                        name="lucide:chevron-right"
                        class="w-4 h-4 text-ink/30"
                      />
                    </div>
                  </button>
                </div>
              </div>

              <div class="border-t border-mist my-4" />

              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">Total</span>
                <span class="price text-lg">{{ Number(order.totalPrice).toFixed(2) }} TND</span>
              </div>

              <!-- Livraison -->
              <div class="mt-5 bg-mist/40 rounded-xl p-4">
                <p class="text-xs font-medium uppercase tracking-wide text-ink/40 mb-2 flex items-center gap-1.5">
                  <Icon name="lucide:map-pin" class="w-3.5 h-3.5" />
                  Livraison
                </p>
                <p class="text-sm font-medium">{{ order.shippingFullName }}</p>
                <p class="text-sm text-ink/70">{{ order.shippingPhone }}</p>
                <p class="text-sm text-ink/70">
                  {{ order.shippingAddress }}, {{ order.shippingCity }}
                  <span v-if="order.shippingPostalCode"> {{ order.shippingPostalCode }}</span>
                </p>
              </div>

              <!-- Paiement -->
              <div class="mt-3 flex items-center justify-between text-sm bg-mist/40 rounded-xl p-4">
                <div class="flex items-center gap-2 text-ink/70">
                  <Icon name="lucide:credit-card" class="w-4 h-4" />
                  {{ order.paymentMethod === 'ONLINE' ? 'Paiement en ligne' : 'Paiement à la livraison' }}
                </div>
                <span
                  class="badge-pill text-xs"
                  :class="paymentStatusStyles[order.paymentStatus]"
                >
                  {{ paymentStatusLabels[order.paymentStatus] }}
                </span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Order } from '~/types/order';
import type { Product } from '~/types/product';

defineProps<{ order: Order | null }>();
defineEmits<{ close: []; 'view-product': [product: Product] }>();

const paymentStatusLabels: Record<string, string> = {
  PENDING: 'En attente',
  PAID: 'Payé',
  FAILED: 'Échoué',
  REFUNDED: 'Remboursé',
};

const paymentStatusStyles: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-clay/10 text-clay',
  REFUNDED: 'bg-slate-100 text-slate-600',
};
</script>