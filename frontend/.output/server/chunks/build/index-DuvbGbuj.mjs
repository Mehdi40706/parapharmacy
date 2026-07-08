import { _ as __nuxt_component_0 } from './nuxt-link-CBZ25J1v.mjs';
import { defineComponent, ref, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { u as useProducts } from './useProducts-BDwdTviH.mjs';
import { u as useAdminProducts } from './useAdminProducts-D3GZdgBR.mjs';
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
import './useApi-BHrVqC1i.mjs';
import './auth.store-BJcHULJo.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useProducts();
    useAdminProducts();
    const products = ref([]);
    const pagination = ref(null);
    const currentPage = ref(1);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-semibold">Produits</h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/produits/nouveau",
        class: "btn-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`+ Nouveau produit`);
          } else {
            return [
              createTextVNode("+ Nouveau produit")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="bg-white rounded-2xl border border-mist overflow-hidden"><table class="w-full text-sm"><thead class="bg-mist/50"><tr class="text-left"><th class="p-4">Nom</th><th class="p-4">Catégorie</th><th class="p-4">Prix</th><th class="p-4">Stock</th><th class="p-4"></th></tr></thead><tbody><!--[-->`);
      ssrRenderList(unref(products), (product) => {
        _push(`<tr class="border-t border-mist"><td class="p-4 font-medium">${ssrInterpolate(product.name)}</td><td class="p-4 text-ink/60">${ssrInterpolate(product.category.name)}</td><td class="p-4 price">${ssrInterpolate(product.price.toFixed(2))} TND</td><td class="p-4"><span class="${ssrRenderClass(product.stock === 0 ? "text-clay" : "text-ink/70")}">${ssrInterpolate(product.stock)}</span></td><td class="p-4 text-right">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/admin/produits/${product.id}/edit`,
          class: "text-sage hover:underline mr-3"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Modifier `);
            } else {
              return [
                createTextVNode(" Modifier ")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<button class="text-clay hover:underline"> Supprimer </button></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
      if (unref(pagination) && unref(pagination).totalPages > 1) {
        _push(`<div class="flex justify-center gap-2 mt-6"><!--[-->`);
        ssrRenderList(unref(pagination).totalPages, (page) => {
          _push(`<button class="${ssrRenderClass([page === unref(currentPage) ? "bg-sage text-white" : "hover:bg-mist", "w-9 h-9 rounded-pill text-sm font-medium"])}">${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/produits/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DuvbGbuj.mjs.map
