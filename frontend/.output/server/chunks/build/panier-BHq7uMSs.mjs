import { _ as __nuxt_component_0 } from './nuxt-link-CBZ25J1v.mjs';
import { defineComponent, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useCartStore } from './cart.store-BnWLT2g3.mjs';
import { u as useAuthStore } from './auth.store-BJcHULJo.mjs';
import { a as useRouter } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@vue/shared';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "panier",
  __ssrInlineRender: true,
  setup(__props) {
    const cartStore = useCartStore();
    useAuthStore();
    useRouter();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-3xl font-semibold mb-8">Mon panier</h1>`);
      if (unref(cartStore).isEmpty) {
        _push(`<div class="text-center py-20"><p class="text-ink/60 mb-4">Votre panier est vide.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/produits",
          class: "btn-primary inline-block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Découvrir nos produits `);
            } else {
              return [
                createTextVNode(" Découvrir nos produits ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="grid lg:grid-cols-3 gap-8"><div class="lg:col-span-2 flex flex-col gap-3"><!--[-->`);
        ssrRenderList(unref(cartStore).items, (item) => {
          _push(`<div class="flex gap-4 bg-white rounded-2xl border border-mist p-4"><div class="w-20 h-20 bg-mist rounded-xl flex-shrink-0 overflow-hidden">`);
          if (item.product.imageUrl) {
            _push(`<img${ssrRenderAttr("src", item.product.imageUrl)}${ssrRenderAttr("alt", item.product.name)} class="w-full h-full object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="flex-1 min-w-0"><h3 class="font-medium truncate">${ssrInterpolate(item.product.name)}</h3><p class="price text-sm mb-2">${ssrInterpolate(item.product.price.toFixed(2))} TND</p><div class="flex items-center gap-3"><div class="flex items-center border border-mist rounded-pill"><button class="w-8 h-8 flex items-center justify-center">−</button><span class="w-8 text-center text-sm font-medium">${ssrInterpolate(item.quantity)}</span><button class="w-8 h-8 flex items-center justify-center">+</button></div><button class="text-clay text-sm hover:underline"> Retirer </button></div></div><p class="price flex-shrink-0">${ssrInterpolate((item.product.price * item.quantity).toFixed(2))} TND </p></div>`);
        });
        _push(`<!--]--></div><div class="lg:col-span-1"><div class="bg-white rounded-2xl border border-mist p-6 lg:sticky lg:top-24"><h2 class="font-medium mb-4">Résumé</h2><div class="flex justify-between text-sm mb-2"><span class="text-ink/60">Sous-total</span><span class="price">${ssrInterpolate(unref(cartStore).total.toFixed(2))} TND</span></div><div class="border-t border-mist my-4"></div><div class="flex justify-between font-medium mb-6"><span>Total</span><span class="price text-lg">${ssrInterpolate(unref(cartStore).total.toFixed(2))} TND</span></div><button class="btn-primary w-full"> Passer la commande </button></div></div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/panier.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=panier-BHq7uMSs.mjs.map
