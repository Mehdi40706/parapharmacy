import { _ as __nuxt_component_0 } from './nuxt-link-CBZ25J1v.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useCartStore } from './cart.store-BnWLT2g3.mjs';
import { u as useAuthStore } from './auth.store-BJcHULJo.mjs';
import { u as useApi } from './useApi-BHrVqC1i.mjs';
import { u as usePayments } from './usePayments-WV98gq0g.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@vue/shared';

const normalizeOrder = (o) => ({
  ...o,
  totalPrice: Number(o.totalPrice),
  items: o.items.map((item) => ({
    ...item,
    price: Number(item.price),
    product: { ...item.product, price: Number(item.product.price) }
  }))
});
const useOrders = () => {
  const api = useApi();
  const createOrder = async (payload) => {
    const order = await api("/orders", { method: "POST", body: payload });
    return normalizeOrder(order);
  };
  const fetchMyOrders = async (query) => {
    const result = await api("/orders/my", { params: query });
    return { ...result, data: result.data.map(normalizeOrder) };
  };
  const fetchOrderById = async (id) => {
    const order = await api(`/orders/${id}`);
    return normalizeOrder(order);
  };
  const cancelOrder = (id) => {
    return api(`/orders/${id}/cancel`, { method: "PATCH" });
  };
  return { createOrder, fetchMyOrders, fetchOrderById, cancelOrder };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    useOrders();
    usePayments();
    const processing = ref(false);
    const errorMessage = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-2xl mx-auto" }, _attrs))}><h1 class="text-3xl font-semibold mb-8">Finaliser la commande</h1>`);
      if (unref(cartStore).isEmpty) {
        _push(`<div class="text-center py-20"><p class="text-ink/60 mb-4">Votre panier est vide.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/produits",
          class: "btn-primary inline-block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Voir les produits`);
            } else {
              return [
                createTextVNode("Voir les produits")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="flex flex-col gap-6"><div class="bg-white rounded-2xl border border-mist p-6"><h2 class="font-medium mb-4">Récapitulatif</h2><div class="flex flex-col gap-3"><!--[-->`);
        ssrRenderList(unref(cartStore).items, (item) => {
          _push(`<div class="flex justify-between text-sm"><span>${ssrInterpolate(item.product.name)} × ${ssrInterpolate(item.quantity)}</span><span class="price">${ssrInterpolate((item.product.price * item.quantity).toFixed(2))} TND</span></div>`);
        });
        _push(`<!--]--></div><div class="border-t border-mist my-4"></div><div class="flex justify-between font-medium"><span>Total</span><span class="price text-lg">${ssrInterpolate(unref(cartStore).total.toFixed(2))} TND</span></div></div><div class="bg-white rounded-2xl border border-mist p-6"><h2 class="font-medium mb-4">Informations de livraison</h2><div class="text-sm text-ink/70 flex flex-col gap-1"><p>${ssrInterpolate(unref(authStore).user?.firstName)} ${ssrInterpolate(unref(authStore).user?.lastName)}</p><p>${ssrInterpolate(unref(authStore).user?.email)}</p><p>${ssrInterpolate(unref(authStore).user?.phone || "Aucun numéro renseigné")}</p></div></div>`);
        if (unref(errorMessage)) {
          _push(`<p class="text-clay text-sm bg-clay/10 rounded-lg px-4 py-3">${ssrInterpolate(unref(errorMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button${ssrIncludeBooleanAttr(unref(processing)) ? " disabled" : ""} class="btn-primary w-full py-3 text-base">${ssrInterpolate(unref(processing) ? "Redirection vers le paiement..." : `Payer ${unref(cartStore).total.toFixed(2)} TND`)}</button><p class="text-xs text-center text-ink/50"> Paiement sécurisé via Konnect — cartes bancaires, wallet, e-DINAR </p></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/checkout/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-cyog4shb.mjs.map
