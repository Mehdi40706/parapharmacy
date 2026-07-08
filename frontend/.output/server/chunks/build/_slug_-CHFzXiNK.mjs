import { _ as __nuxt_component_0 } from './nuxt-link-CBZ25J1v.mjs';
import { defineComponent, ref, unref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useProducts } from './useProducts-BDwdTviH.mjs';
import { b as useRoute } from './server.mjs';
import { u as useCartStore } from './cart.store-BnWLT2g3.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './useApi-BHrVqC1i.mjs';
import './auth.store-BJcHULJo.mjs';
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@vue/shared';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useProducts();
    useCartStore();
    const product = ref(null);
    const loading = ref(true);
    const quantity = ref(1);
    const added = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (unref(product)) {
        _push(`<div${ssrRenderAttrs(_attrs)}><div class="grid md:grid-cols-2 gap-8 lg:gap-12"><div class="aspect-square bg-mist rounded-2xl overflow-hidden">`);
        if (unref(product).imageUrl) {
          _push(`<img${ssrRenderAttr("src", unref(product).imageUrl)}${ssrRenderAttr("alt", unref(product).name)} class="w-full h-full object-cover">`);
        } else {
          _push(`<div class="w-full h-full flex items-center justify-center text-ink/20"><svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76ZM16 8l-6 6"></path></svg></div>`);
        }
        _push(`</div><div><span class="badge-pill bg-mist text-sage-dark mb-3">${ssrInterpolate(unref(product).category.name)}</span><h1 class="text-2xl sm:text-3xl font-semibold mb-3">${ssrInterpolate(unref(product).name)}</h1><p class="price text-2xl mb-5">${ssrInterpolate(Number(unref(product).price).toFixed(2))} TND</p><p class="text-ink/70 leading-relaxed mb-6">${ssrInterpolate(unref(product).description)}</p><div class="mb-6">`);
        if (unref(product).stock > 5) {
          _push(`<span class="badge-pill bg-sage/10 text-sage-dark"> ● En stock </span>`);
        } else if (unref(product).stock > 0) {
          _push(`<span class="badge-pill bg-honey/10 text-honey-dark"> ● Plus que ${ssrInterpolate(unref(product).stock)} en stock </span>`);
        } else {
          _push(`<span class="badge-pill bg-clay/10 text-clay"> ● Rupture de stock </span>`);
        }
        _push(`</div>`);
        if (unref(product).stock > 0) {
          _push(`<div class="flex items-center gap-4 mb-6"><div class="flex items-center border border-mist rounded-pill"><button class="w-10 h-10 flex items-center justify-center text-lg">−</button><span class="w-10 text-center font-medium">${ssrInterpolate(unref(quantity))}</span><button class="w-10 h-10 flex items-center justify-center text-lg">+</button></div><button class="btn-primary flex-1">${ssrInterpolate(unref(added) ? "Ajouté ✓" : "Ajouter au panier")}</button></div>`);
        } else {
          _push(`<button disabled class="btn-primary w-full opacity-50 cursor-not-allowed"> Indisponible </button>`);
        }
        _push(`</div></div></div>`);
      } else if (unref(loading)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "animate-pulse grid md:grid-cols-2 gap-8" }, _attrs))}><div class="aspect-square bg-mist rounded-2xl"></div><div class="space-y-4"><div class="h-6 bg-mist rounded w-1/3"></div><div class="h-8 bg-mist rounded w-2/3"></div><div class="h-24 bg-mist rounded"></div></div></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-center py-20" }, _attrs))}><p class="text-ink/60">Produit introuvable.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/produits",
          class: "text-sage hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Retour au catalogue`);
            } else {
              return [
                createTextVNode("Retour au catalogue")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/produits/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-CHFzXiNK.mjs.map
