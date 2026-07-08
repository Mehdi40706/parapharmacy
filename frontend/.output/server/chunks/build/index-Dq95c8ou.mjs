import { defineComponent, ref, reactive, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
import { useDebounceFn } from '@vueuse/core';
import { _ as __nuxt_component_1 } from './ProductCard-C3uJetVq.mjs';
import { u as useProducts } from './useProducts-BDwdTviH.mjs';
import { u as useCategories } from './useCategories-Bz1hFXAX.mjs';
import './nuxt-link-CBZ25J1v.mjs';
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
    const { fetchProducts } = useProducts();
    useCategories();
    const products = ref([]);
    const categories = ref([]);
    const pagination = ref(null);
    const loading = ref(true);
    const filters = reactive({
      search: "",
      categoryId: "",
      sortBy: "createdAt",
      page: 1,
      limit: 12
    });
    const fetchData = async () => {
      loading.value = true;
      try {
        const result = await fetchProducts({
          search: filters.search || void 0,
          categoryId: filters.categoryId || void 0,
          sortBy: filters.sortBy,
          page: filters.page,
          limit: filters.limit
        });
        products.value = result.data;
        pagination.value = result.meta;
      } finally {
        loading.value = false;
      }
    };
    useDebounceFn(() => {
      filters.page = 1;
      fetchData();
    }, 400);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="mb-8"><h1 class="text-3xl font-semibold mb-2">Nos produits</h1><p class="text-ink/60">${ssrInterpolate(unref(pagination)?.total || 0)} produits disponibles</p></div><div class="flex flex-col lg:flex-row gap-6"><aside class="lg:w-64 flex-shrink-0"><div class="bg-white rounded-2xl border border-mist p-5 lg:sticky lg:top-24"><h2 class="font-medium mb-4">Filtrer</h2><div class="mb-5"><label class="block text-sm font-medium mb-2">Recherche</label><input${ssrRenderAttr("value", unref(filters).search)} type="text" placeholder="Rechercher un produit..." class="input-field text-sm"></div><div class="mb-5"><label class="block text-sm font-medium mb-2">Catégorie</label><select class="input-field text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filters).categoryId) ? ssrLooseContain(unref(filters).categoryId, "") : ssrLooseEqual(unref(filters).categoryId, "")) ? " selected" : ""}>Toutes</option><!--[-->`);
      ssrRenderList(unref(categories), (cat) => {
        _push(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(filters).categoryId) ? ssrLooseContain(unref(filters).categoryId, cat.id) : ssrLooseEqual(unref(filters).categoryId, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
      });
      _push(`<!--]--></select></div><div class="mb-5"><label class="block text-sm font-medium mb-2">Trier par</label><select class="input-field text-sm"><option value="createdAt"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).sortBy) ? ssrLooseContain(unref(filters).sortBy, "createdAt") : ssrLooseEqual(unref(filters).sortBy, "createdAt")) ? " selected" : ""}>Plus récents</option><option value="price"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).sortBy) ? ssrLooseContain(unref(filters).sortBy, "price") : ssrLooseEqual(unref(filters).sortBy, "price")) ? " selected" : ""}>Prix</option><option value="name"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).sortBy) ? ssrLooseContain(unref(filters).sortBy, "name") : ssrLooseEqual(unref(filters).sortBy, "name")) ? " selected" : ""}>Nom</option></select></div><button class="text-sm text-sage hover:underline"> Réinitialiser les filtres </button></div></aside><div class="flex-1">`);
      if (unref(loading)) {
        _push(`<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"><!--[-->`);
        ssrRenderList(8, (n) => {
          _push(`<div class="aspect-[3/4] bg-mist rounded-2xl animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(products).length === 0) {
        _push(`<div class="text-center py-20"><p class="text-ink/60">Aucun produit ne correspond à votre recherche.</p></div>`);
      } else {
        _push(`<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"><!--[-->`);
        ssrRenderList(unref(products), (product) => {
          _push(ssrRenderComponent(__nuxt_component_1, {
            key: product.id,
            product
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      if (unref(pagination) && unref(pagination).totalPages > 1) {
        _push(`<div class="flex justify-center gap-2 mt-8"><!--[-->`);
        ssrRenderList(unref(pagination).totalPages, (page) => {
          _push(`<button class="${ssrRenderClass([page === unref(filters).page ? "bg-sage text-white" : "hover:bg-mist", "w-9 h-9 rounded-pill text-sm font-medium transition-colors"])}">${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/produits/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Dq95c8ou.mjs.map
