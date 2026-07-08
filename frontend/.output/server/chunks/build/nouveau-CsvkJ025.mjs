import { _ as __nuxt_component_0 } from './nuxt-link-CBZ25J1v.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import _sfc_main$1 from './ProductForm-s_ZVFRq9.mjs';
import { u as useAdminProducts } from './useAdminProducts-D3GZdgBR.mjs';
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
import './useCategories-Bz1hFXAX.mjs';
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
  __name: "nouveau",
  __ssrInlineRender: true,
  setup(__props) {
    const { createProduct } = useAdminProducts();
    const router = useRouter();
    const loading = ref(false);
    const errorMessage = ref("");
    const handleSubmit = async (payload) => {
      loading.value = true;
      errorMessage.value = "";
      try {
        await createProduct(payload);
        router.push("/admin/produits");
      } catch (error) {
        errorMessage.value = error?.data?.message || "Erreur lors de la création";
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-4xl space-y-5" }, _attrs))}><div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-sm font-semibold uppercase tracking-[0.25em] text-sage">Administration</p><h1 class="mt-1 text-2xl font-semibold text-ink">Nouveau produit</h1></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/produits",
        class: "text-sm font-medium text-sage transition hover:text-sage-dark"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ← Retour à la liste `);
          } else {
            return [
              createTextVNode(" ← Retour à la liste ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        onSubmit: handleSubmit,
        loading: unref(loading),
        error: unref(errorMessage)
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/produits/nouveau.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=nouveau-CsvkJ025.mjs.map
