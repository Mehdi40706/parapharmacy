import { _ as __nuxt_component_0 } from './nuxt-link-CBZ25J1v.mjs';
import { defineComponent, ref, watch, mergeProps, withCtx, createTextVNode, unref, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { u as useAuthStore } from './auth.store-BJcHULJo.mjs';
import { u as useCartStore } from './cart.store-BnWLT2g3.mjs';
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
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    useRouter();
    const mobileMenuOpen = ref(false);
    watch(mobileMenuOpen, () => {
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col bg-background" }, _attrs))}><header class="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-mist"><nav class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "font-display text-xl font-semibold text-sage-dark"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Parapharmacie `);
          } else {
            return [
              createTextVNode(" Parapharmacie ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="hidden md:flex items-center gap-6 text-sm font-medium">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/produits",
        class: "hover:text-sage transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Produits`);
          } else {
            return [
              createTextVNode("Produits")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/panier",
        class: "relative hover:text-sage transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Panier `);
            if (unref(cartStore).itemCount > 0) {
              _push2(`<span class="absolute -top-2 -right-3 bg-honey text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"${_scopeId}>${ssrInterpolate(unref(cartStore).itemCount)}</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createTextVNode(" Panier "),
              unref(cartStore).itemCount > 0 ? (openBlock(), createBlock("span", {
                key: 0,
                class: "absolute -top-2 -right-3 bg-honey text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
              }, toDisplayString(unref(cartStore).itemCount), 1)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(authStore).isAuthenticated) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/compte",
          class: "hover:text-sage transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(authStore).user?.firstName)}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(authStore).user?.firstName), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<button class="text-clay hover:underline"> Déconnexion </button><!--]-->`);
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/auth/login",
          class: "btn-primary text-sm py-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Connexion `);
            } else {
              return [
                createTextVNode(" Connexion ")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div><button class="md:hidden p-2 -mr-2" aria-label="Ouvrir le menu">`);
      if (!unref(mobileMenuOpen)) {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>`);
      } else {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`);
      }
      _push(`</button></nav>`);
      if (unref(mobileMenuOpen)) {
        _push(`<div class="md:hidden border-t border-mist bg-background px-4 py-4 flex flex-col gap-3">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/produits",
          onClick: ($event) => mobileMenuOpen.value = false,
          class: "py-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Produits`);
            } else {
              return [
                createTextVNode("Produits")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/panier",
          onClick: ($event) => mobileMenuOpen.value = false,
          class: "py-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Panier `);
              if (unref(cartStore).itemCount > 0) {
                _push2(`<span class="text-honey-dark font-semibold"${_scopeId}>(${ssrInterpolate(unref(cartStore).itemCount)})</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createTextVNode(" Panier "),
                unref(cartStore).itemCount > 0 ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "text-honey-dark font-semibold"
                }, "(" + toDisplayString(unref(cartStore).itemCount) + ")", 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(authStore).isAuthenticated) {
          _push(`<!--[-->`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/compte",
            onClick: ($event) => mobileMenuOpen.value = false,
            class: "py-2"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(authStore).user?.firstName)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(authStore).user?.firstName), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<button class="text-clay text-left py-2">Déconnexion</button><!--]-->`);
        } else {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/auth/login",
            onClick: ($event) => mobileMenuOpen.value = false,
            class: "btn-primary text-center"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Connexion `);
              } else {
                return [
                  createTextVNode(" Connexion ")
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><main class="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="border-t border-mist py-8 text-center text-sm text-ink/60"> © 2026 Parapharmacie — Votre santé, notre priorité </footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-DCmmcsbu.mjs.map
