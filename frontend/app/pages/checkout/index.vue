<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-semibold mb-8">Finaliser la commande</h1>

    <div v-if="cartStore.isEmpty" class="text-center py-20">
      <p class="text-ink/60 mb-4">Votre panier est vide.</p>
      <NuxtLink to="/produits" class="btn-primary inline-block">Voir les produits</NuxtLink>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Récapitulatif -->
      <div class="bg-white rounded-2xl border border-mist p-6">
        <h2 class="font-medium mb-4">Récapitulatif</h2>
        <div class="flex flex-col gap-3">
          <div
            v-for="item in cartStore.items"
            :key="item.product.id"
            class="flex justify-between text-sm"
          >
            <span>{{ item.product.name }} × {{ item.quantity }}</span>
            <span class="price">{{ (item.product.price * item.quantity).toFixed(2) }} TND</span>
          </div>
        </div>
        <div class="border-t border-mist my-4" />
        <div class="flex justify-between font-medium">
          <span>Total</span>
          <span class="price text-lg">{{ cartStore.total.toFixed(2) }} TND</span>
        </div>
      </div>

      <!-- Livraison -->
      <div class="bg-white rounded-2xl border border-mist p-6">
        <h2 class="font-medium mb-4">Informations de livraison</h2>

        <div class="text-sm text-ink/70 mb-4">
          <p>{{ authStore.user?.email }}</p>
        </div>

        <div class="flex flex-col gap-3">
          <div>
            <label class="text-xs text-ink/60 mb-1 block">Nom complet *</label>
            <input
              v-model="shipping.fullName"
              type="text"
              placeholder="Nom et prénom"
              class="w-full border border-mist rounded-lg px-3 py-2 text-sm"
              :class="{ 'border-clay': touched.fullName && errors.fullName }"
              @blur="touched.fullName = true"
            />
            <p v-if="touched.fullName && errors.fullName" class="text-clay text-xs mt-1">
              {{ errors.fullName }}
            </p>
          </div>

          <div>
            <label class="text-xs text-ink/60 mb-1 block">Numéro de téléphone *</label>
            <input
              v-model="shipping.phone"
              type="tel"
              placeholder="+216 XX XXX XXX"
              class="w-full border border-mist rounded-lg px-3 py-2 text-sm"
              :class="{ 'border-clay': touched.phone && errors.phone }"
              @blur="touched.phone = true"
            />
            <p v-if="touched.phone && errors.phone" class="text-clay text-xs mt-1">
              {{ errors.phone }}
            </p>
          </div>

          <div>
            <label class="text-xs text-ink/60 mb-1 block">Adresse *</label>
            <textarea
              v-model="shipping.address"
              rows="2"
              placeholder="Rue, numéro, complément"
              class="w-full border border-mist rounded-lg px-3 py-2 text-sm"
              :class="{ 'border-clay': touched.address && errors.address }"
              @blur="touched.address = true"
            />
            <p v-if="touched.address && errors.address" class="text-clay text-xs mt-1">
              {{ errors.address }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-ink/60 mb-1 block">Ville *</label>
              <input
                v-model="shipping.city"
                type="text"
                placeholder="Tunis"
                class="w-full border border-mist rounded-lg px-3 py-2 text-sm"
                :class="{ 'border-clay': touched.city && errors.city }"
                @blur="touched.city = true"
              />
              <p v-if="touched.city && errors.city" class="text-clay text-xs mt-1">
                {{ errors.city }}
              </p>
            </div>

            <div>
              <label class="text-xs text-ink/60 mb-1 block">Code postal</label>
              <input
                v-model="shipping.postalCode"
                type="text"
                inputmode="numeric"
                placeholder="1000"
                maxlength="4"
                class="w-full border border-mist rounded-lg px-3 py-2 text-sm"
                :class="{ 'border-clay': touched.postalCode && errors.postalCode }"
                @blur="touched.postalCode = true"
              />
              <p v-if="touched.postalCode && errors.postalCode" class="text-clay text-xs mt-1">
                {{ errors.postalCode }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Mode de paiement -->
      <div class="bg-white rounded-2xl border border-mist p-6">
        <h2 class="font-medium mb-4">Mode de paiement</h2>

        <div class="flex flex-col gap-3">
          <label
            class="flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition"
            :class="paymentMethod === 'ONLINE' ? 'border-sage bg-sage/5' : 'border-mist'"
          >
            <input
              type="radio"
              name="paymentMethod"
              value="ONLINE"
              v-model="paymentMethod"
              class="mt-1"
            />
            <div>
              <p class="text-sm font-medium">Paiement en ligne</p>
              <p class="text-xs text-ink/60 mt-0.5">
                Cartes bancaires, wallet, e-DINAR — via Konnect, paiement sécurisé.
              </p>
            </div>
          </label>

          <label
            class="flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition"
            :class="paymentMethod === 'COD' ? 'border-sage bg-sage/5' : 'border-mist'"
          >
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              v-model="paymentMethod"
              class="mt-1"
            />
            <div>
              <p class="text-sm font-medium">Paiement à la livraison</p>
              <p class="text-xs text-ink/60 mt-0.5">
                Payez en espèces directement au livreur à la réception de votre commande.
              </p>
            </div>
          </label>
        </div>
      </div>

      <button
        @click="handlePayment"
        :disabled="processing"
        class="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{
          processing
            ? 'Traitement en cours...'
            : paymentMethod === 'ONLINE'
              ? `Payer ${cartStore.total.toFixed(2)} TND`
              : `Confirmer la commande — ${cartStore.total.toFixed(2)} TND`
        }}
      </button>

      <p class="text-xs text-center text-ink/50">
        {{
          paymentMethod === 'ONLINE'
            ? 'Paiement sécurisé via Konnect — cartes bancaires, wallet, e-DINAR'
            : 'Vous réglerez en espèces à la réception de votre colis'
        }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast';

definePageMeta({ middleware: 'auth' });

const toast = useToast();
const cartStore = useCartStore();
const authStore = useAuthStore();
const { createOrder } = useOrders();
const { initiatePayment } = usePayments();
const router = useRouter();

const processing = ref(false);
const errorMessage = ref('');

const paymentMethod = ref<'ONLINE' | 'COD'>('ONLINE');

const shipping = reactive({
  fullName: `${authStore.user?.firstName ?? ''} ${authStore.user?.lastName ?? ''}`.trim(),
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  notes: '',
});

const touched = reactive({
  fullName: false,
  phone: false,
  address: false,
  city: false,
  postalCode: false,
});

const phoneRegex = /^(\+216|00216)?[2-9]\d{7}$/;

const errors = computed(() => {
  const e: Record<string, string> = {};

  const fullName = shipping.fullName.trim();
  if (!fullName) e.fullName = 'Le nom complet est requis.';
  else if (fullName.length < 3) e.fullName = 'Le nom est trop court.';

  const phone = shipping.phone.trim().replace(/\s/g, '');
  if (!phone) e.phone = 'Le numéro de téléphone est requis.';
  else if (!phoneRegex.test(phone)) e.phone = 'Numéro invalide (ex: +216 XX XXX XXX).';

  const address = shipping.address.trim();
  if (!address) e.address = "L'adresse est requise.";
  else if (address.length < 5) e.address = 'Merci de préciser une adresse complète.';

  const city = shipping.city.trim();
  if (!city) e.city = 'La ville est requise.';

  const postalCode = shipping.postalCode.trim();
  if (postalCode && !/^\d{4}$/.test(postalCode)) {
    e.postalCode = 'Code postal invalide (4 chiffres).';
  }

  return e;
});

const canPay = computed(() => Object.keys(errors.value).length === 0);

const touchAll = () => {
  touched.fullName = true;
  touched.phone = true;
  touched.address = true;
  touched.city = true;
  touched.postalCode = true;
};

const handlePayment = async () => {
  errorMessage.value = '';
  touchAll();

  if (!canPay.value) {
    toast.error('Merci de corriger les informations de livraison.');
    return;
  }

  processing.value = true;
  let createdOrder;

  try {
    createdOrder = await createOrder({
      items: cartStore.items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      paymentMethod: paymentMethod.value,
      shippingAddress: {
        fullName: shipping.fullName.trim(),
        phone: shipping.phone.trim().replace(/\s/g, ''),
        address: shipping.address.trim(),
        city: shipping.city.trim(),
        postalCode: shipping.postalCode.trim() || undefined,
      },
    });
      cartStore.clear();
    }
    catch (error: any) {
      errorMessage.value = error?.data?.message || 'Impossible de créer la commande';
      processing.value = false;
      return;
  }
      if (paymentMethod.value === 'COD') {
        router.push({ path: '/checkout/success', query: { order_id: createdOrder.id, method: 'COD' } });
        return;
      }
      try {
        const { payUrl } = await initiatePayment(createdOrder.id);
        if (import.meta.client) sessionStorage.setItem('pending_order_id', createdOrder.id);
        window.location.href = payUrl;
      } catch {
        processing.value = false;
        // Commande créée mais paiement non lancé -> on redirige vers une page dédiée
        // qui permet de relancer le paiement sur CETTE commande, pas d'en recréer une
        router.push({ path: '/checkout/retry', query: { order_id: createdOrder.id } });
      }
};




</script>