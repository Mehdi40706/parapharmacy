import { _ as __nuxt_component_0 } from './nuxt-link-CBZ25J1v.mjs';
import { defineComponent, ref, reactive, watch, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { u as useCategories } from './useCategories-Bz1hFXAX.mjs';
import { u as useApi } from './useApi-BHrVqC1i.mjs';
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
import './auth.store-BJcHULJo.mjs';

const useStorage = () => {
  const api = useApi();
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api("/storage/upload", {
      method: "POST",
      body: formData
    });
  };
  return { uploadImage };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductForm",
  __ssrInlineRender: true,
  props: {
    initial: {},
    loading: { type: Boolean },
    error: {}
  },
  emits: ["submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useCategories();
    useStorage();
    const categories = ref([]);
    const isLoadingCategories = ref(true);
    ref(null);
    const uploading = ref(false);
    const uploadError = ref("");
    const form = reactive({
      name: props.initial?.name || "",
      description: props.initial?.description || "",
      price: props.initial?.price || 0,
      stock: props.initial?.stock || 0,
      categoryId: props.initial?.categoryId || props.initial?.category?.id || "",
      imageUrl: props.initial?.imageUrl || ""
    });
    watch(
      () => props.initial,
      (val) => {
        if (val) {
          Object.assign(form, {
            name: val.name || "",
            description: val.description || "",
            price: Number(val.price) || 0,
            stock: Number(val.stock) || 0,
            categoryId: val.categoryId || val.category?.id || "",
            imageUrl: val.imageUrl || ""
          });
        }
      },
      { deep: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "space-y-5 rounded-[2rem] border border-mist bg-white p-5 shadow-sm sm:p-6" }, _attrs))}><div class="space-y-2"><h2 class="text-xl font-semibold text-ink">Informations du produit</h2><p class="text-sm text-ink/70">Remplissez les informations essentielles pour publier ou mettre à jour un produit.</p></div><div class="grid gap-4 lg:grid-cols-2"><div class="lg:col-span-2"><label class="mb-1.5 block text-sm font-medium text-ink">Nom du produit</label><input${ssrRenderAttr("value", unref(form).name)} type="text" required minlength="2" class="input-field" placeholder="Ex. Soin visage doux"></div><div class="lg:col-span-2"><label class="mb-1.5 block text-sm font-medium text-ink">Description</label><textarea required rows="4" minlength="10" class="input-field" placeholder="Décrivez les bénéfices et l’utilisation du produit">${ssrInterpolate(unref(form).description)}</textarea></div><div><label class="mb-1.5 block text-sm font-medium text-ink">Prix (TND)</label><input${ssrRenderAttr("value", unref(form).price)} type="number" step="0.01" min="0" required class="input-field"></div><div><label class="mb-1.5 block text-sm font-medium text-ink">Stock</label><input${ssrRenderAttr("value", unref(form).stock)} type="number" min="0" required class="input-field"></div><div><label class="mb-1.5 block text-sm font-medium text-ink">Catégorie</label><select required class="input-field"${ssrIncludeBooleanAttr(unref(isLoadingCategories)) ? " disabled" : ""}><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).categoryId) ? ssrLooseContain(unref(form).categoryId, "") : ssrLooseEqual(unref(form).categoryId, "")) ? " selected" : ""}>Choisir une catégorie</option><!--[-->`);
      ssrRenderList(unref(categories), (cat) => {
        _push(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).categoryId) ? ssrLooseContain(unref(form).categoryId, cat.id) : ssrLooseEqual(unref(form).categoryId, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
      });
      _push(`<!--]--></select></div><div class="lg:col-span-2"><label class="mb-1.5 block text-sm font-medium text-ink">Image du produit</label><div class="rounded-[1.25rem] border border-dashed border-mist bg-mist/20 p-4"><input type="file" accept="image/*" class="block w-full text-sm text-ink/70 file:mr-4 file:rounded-full file:border-0 file:bg-sage file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-sage-dark"><p class="mt-2 text-sm text-ink/60">Formats acceptés : JPG, PNG, WebP. Taille maximale : 5 Mo.</p>`);
      if (unref(uploading)) {
        _push(`<div class="mt-3 text-sm text-sage">Téléchargement en cours…</div>`);
      } else if (unref(uploadError)) {
        _push(`<div class="mt-3 rounded-xl bg-clay/10 px-3 py-2 text-sm text-clay">${ssrInterpolate(unref(uploadError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="lg:col-span-2"><label class="mb-1.5 block text-sm font-medium text-ink">URL image (optionnel)</label><input${ssrRenderAttr("value", unref(form).imageUrl)} type="text" class="input-field" placeholder="https://..."></div></div>`);
      if (unref(form).imageUrl) {
        _push(`<div class="rounded-[1.25rem] border border-mist bg-mist/20 p-3"><p class="mb-2 text-sm font-medium text-ink">Aperçu</p><img${ssrRenderAttr("src", unref(form).imageUrl)}${ssrRenderAttr("alt", unref(form).name || "Image produit")} class="h-48 w-full rounded-[1rem] object-cover"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.error) {
        _push(`<p class="rounded-xl bg-clay/10 px-3 py-2 text-sm text-clay">${ssrInterpolate(__props.error)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col gap-3 border-t border-mist pt-4 sm:flex-row sm:justify-end">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/produits",
        class: "inline-flex items-center justify-center rounded-pill border border-mist bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-mist"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Annuler `);
          } else {
            return [
              createTextVNode(" Annuler ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="submit"${ssrIncludeBooleanAttr(__props.loading) ? " disabled" : ""} class="btn-primary">${ssrInterpolate(__props.loading ? "Enregistrement..." : "Enregistrer")}</button></div></form>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/ProductForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ProductForm-s_ZVFRq9.mjs.map
