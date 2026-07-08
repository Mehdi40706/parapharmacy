import { defineComponent, ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useCategories } from './useCategories-Bz1hFXAX.mjs';
import { u as useApi } from './useApi-BHrVqC1i.mjs';
import './auth.store-BJcHULJo.mjs';
import 'pinia';
import './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@vue/shared';

const useAdminCategories = () => {
  const api = useApi();
  const createCategory = (name) => api("/categories", { method: "POST", body: { name } });
  const updateCategory = (id, name) => api(`/categories/${id}`, { method: "PATCH", body: { name } });
  const deleteCategory = (id) => api(`/categories/${id}`, { method: "DELETE" });
  return { createCategory, updateCategory, deleteCategory };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useCategories();
    useAdminCategories();
    const categories = ref([]);
    const newName = ref("");
    const editingId = ref(null);
    const editName = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-semibold mb-6">Catégories</h1><div class="bg-white rounded-2xl border border-mist p-6 mb-6"><form class="flex gap-3"><input${ssrRenderAttr("value", unref(newName))} type="text" placeholder="Nom de la catégorie" required class="input-field"><button type="submit" class="btn-primary whitespace-nowrap">Ajouter</button></form></div><div class="bg-white rounded-2xl border border-mist divide-y divide-mist"><!--[-->`);
      ssrRenderList(unref(categories), (cat) => {
        _push(`<div class="p-4 flex items-center justify-between">`);
        if (unref(editingId) !== cat.id) {
          _push(`<div><span class="font-medium">${ssrInterpolate(cat.name)}</span></div>`);
        } else {
          _push(`<input${ssrRenderAttr("value", unref(editName))} class="input-field text-sm max-w-xs">`);
        }
        _push(`<div class="flex gap-3 text-sm">`);
        if (unref(editingId) === cat.id) {
          _push(`<!--[--><button class="text-sage hover:underline">Sauvegarder</button><button class="text-ink/50 hover:underline">Annuler</button><!--]-->`);
        } else {
          _push(`<!--[--><button class="text-sage hover:underline">Modifier</button><button class="text-clay hover:underline">Supprimer</button><!--]-->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/categories/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BdymK4yR.mjs.map
