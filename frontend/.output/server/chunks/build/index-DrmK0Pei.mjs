import { _ as __nuxt_component_0 } from './nuxt-link-CBZ25J1v.mjs';
import { _ as __nuxt_component_1 } from './ProductCard-C3uJetVq.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useCategories } from './useCategories-Bz1hFXAX.mjs';
import { u as useProducts } from './useProducts-BDwdTviH.mjs';
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
    useCategories();
    useProducts();
    const categories = ref([]);
    const featuredProducts = ref([]);
    const isLoading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ProductCard = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8" }, _attrs))}><section class="relative overflow-hidden rounded-[2rem] border border-mist bg-gradient-to-br from-sage-dark via-sage to-sage-light p-8 shadow-[0_24px_60px_-24px_rgba(45,74,62,0.45)] md:p-10 lg:p-12"><div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_35%)]"></div><div class="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"><div class="space-y-6 text-white"><span class="badge-pill bg-white/15 text-white/90 backdrop-blur-sm">Nouveautés • soins naturels • bien-être</span><div class="space-y-3"><h1 class="text-4xl font-display leading-tight sm:text-5xl lg:text-6xl"> Votre pharmacie de confort, beauté et équilibre. </h1><p class="max-w-2xl text-lg text-white/85"> Découvrez une sélection soignée de produits de parapharmacie, de soins visage et de routines quotidiennes pensées pour votre bien-être. </p></div><div class="flex flex-wrap gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/produits",
        class: "btn-primary bg-white text-sage hover:bg-mist"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Explorer nos produits `);
          } else {
            return [
              createTextVNode(" Explorer nos produits ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/panier",
        class: "rounded-pill border border-white/35 px-6 py-2.5 font-medium text-white transition-colors hover:bg-white/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Voir mon panier `);
          } else {
            return [
              createTextVNode(" Voir mon panier ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex flex-wrap gap-6 text-sm text-white/85"><div class="flex items-center gap-2"><span class="text-base">✦</span><span>Livraison rapide</span></div><div class="flex items-center gap-2"><span class="text-base">✦</span><span>Produits sélectionnés</span></div><div class="flex items-center gap-2"><span class="text-base">✦</span><span>Conseils personnalisés</span></div></div></div><div class="relative"><div class="rounded-[1.75rem] border border-white/20 bg-white/10 p-4 backdrop-blur-sm"><div class="rounded-[1.25rem] bg-background p-5 shadow-xl"><div class="flex items-center justify-between"><div><p class="text-xs uppercase tracking-[0.25em] text-sage">Sélection du mois</p><h2 class="font-display text-2xl text-ink">Routine douceur</h2></div><span class="rounded-pill bg-honey px-3 py-1 text-sm font-medium text-ink">-20%</span></div><div class="mt-5 space-y-3"><div class="rounded-2xl border border-mist bg-white p-4"><div class="flex items-center justify-between gap-4"><div><p class="font-semibold text-ink">Soin visage calmant</p><p class="text-sm text-ink/70">Hydratation naturelle</p></div><div class="price text-lg">34,90 TND</div></div></div><div class="rounded-2xl border border-mist bg-white p-4"><div class="flex items-center justify-between gap-4"><div><p class="font-semibold text-ink">Gel nettoyant doux</p><p class="text-sm text-ink/70">Peau sensible</p></div><div class="price text-lg">22,50 TND</div></div></div></div></div></div></div></div></section><section class="grid gap-4 md:grid-cols-3"><div class="rounded-[1.5rem] border border-mist bg-white p-5 shadow-sm"><p class="text-sm font-semibold text-sage">Qualité certifiée</p><h3 class="mt-2 font-display text-xl text-ink">Des produits choisis avec soin</h3><p class="mt-2 text-sm text-ink/70">Une sélection pensée pour allier efficacité, naturel et confort d’usage.</p></div><div class="rounded-[1.5rem] border border-mist bg-white p-5 shadow-sm"><p class="text-sm font-semibold text-sage">Conseils experts</p><h3 class="mt-2 font-display text-xl text-ink">Des recommandations adaptées</h3><p class="mt-2 text-sm text-ink/70">Trouvez rapidement les soins qui correspondent à votre routine et vos besoins.</p></div><div class="rounded-[1.5rem] border border-mist bg-white p-5 shadow-sm"><p class="text-sm font-semibold text-sage">Expérience simplifiée</p><h3 class="mt-2 font-display text-xl text-ink">Commande en quelques clics</h3><p class="mt-2 text-sm text-ink/70">Ajoutez vos produits au panier, passez votre commande et profitez du suivi.</p></div></section>`);
      if (categories.value.length) {
        _push(`<section class="rounded-[2rem] border border-mist bg-white p-6 md:p-8"><div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><p class="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Catégories</p><h2 class="mt-1 font-display text-3xl text-ink">Parcourez nos univers</h2></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/produits",
          class: "text-sm font-medium text-sage transition-colors hover:text-sage-dark"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Voir tous les produits `);
            } else {
              return [
                createTextVNode(" Voir tous les produits ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="mt-6 grid gap-4 md:grid-cols-3"><!--[-->`);
        ssrRenderList(categories.value.slice(0, 6), (category) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: category.id,
            to: { path: "/produits", query: { category: category.slug } },
            class: "group rounded-[1.25rem] border border-mist bg-mist/40 p-5 transition-all hover:-translate-y-1 hover:shadow-md"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="font-semibold text-ink"${_scopeId}>${ssrInterpolate(category.name)}</p><p class="mt-1 text-sm text-ink/70"${_scopeId}>Découvrez la sélection dédiée</p></div><span class="text-2xl text-sage transition-transform group-hover:translate-x-1"${_scopeId}>→</span></div>`);
              } else {
                return [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "font-semibold text-ink" }, toDisplayString(category.name), 1),
                      createVNode("p", { class: "mt-1 text-sm text-ink/70" }, "Découvrez la sélection dédiée")
                    ]),
                    createVNode("span", { class: "text-2xl text-sage transition-transform group-hover:translate-x-1" }, "→")
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="rounded-[2rem] border border-mist bg-white p-6 md:p-8"><div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><p class="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Produits phares</p><h2 class="mt-1 font-display text-3xl text-ink">Les best-sellers de la semaine</h2></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/produits",
        class: "text-sm font-medium text-sage transition-colors hover:text-sage-dark"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Explorer la boutique `);
          } else {
            return [
              createTextVNode(" Explorer la boutique ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (isLoading.value) {
        _push(`<div class="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
        ssrRenderList(3, (item) => {
          _push(`<div class="animate-pulse rounded-[1.5rem] border border-mist bg-mist/40 p-4"><div class="h-40 rounded-[1rem] bg-white/70"></div><div class="mt-4 h-4 w-24 rounded bg-white/70"></div><div class="mt-3 h-6 w-3/4 rounded bg-white/70"></div><div class="mt-3 h-4 w-1/2 rounded bg-white/70"></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (featuredProducts.value.length) {
        _push(`<div class="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
        ssrRenderList(featuredProducts.value, (product) => {
          _push(ssrRenderComponent(_component_ProductCard, {
            key: product.id,
            product
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="mt-6 rounded-[1.25rem] border border-dashed border-mist bg-mist/30 p-6 text-center text-ink/70"> Aucun produit disponible pour le moment. </div>`);
      }
      _push(`</section><section class="rounded-[2rem] border border-mist bg-sage/5 p-6 md:p-8"><div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p class="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Une expérience simple</p><h2 class="mt-1 font-display text-3xl text-ink">Faites de votre quotidien un moment de douceur</h2></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/produits",
        class: "btn-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Découvrir la collection `);
          } else {
            return [
              createTextVNode(" Découvrir la collection ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DrmK0Pei.mjs.map
