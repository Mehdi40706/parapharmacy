import { _ as __nuxt_component_0 } from './nuxt-link-CBZ25J1v.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { b as useRoute } from './server.mjs';
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
  __name: "success",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    usePayments();
    const loading = ref(true);
    const status = ref("PENDING");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-lg mx-auto text-center py-12" }, _attrs))}>`);
      if (unref(loading)) {
        _push(`<div class="flex flex-col items-center gap-4"><div class="w-10 h-10 border-4 border-mist border-t-sage rounded-full animate-spin"></div><p class="text-ink/60">Vérification du paiement...</p></div>`);
      } else if (unref(status) === "PAID") {
        _push(`<div class="flex flex-col items-center gap-4"><div class="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div><h1 class="text-2xl font-semibold">Paiement confirmé !</h1><p class="text-ink/60">Votre commande a bien été enregistrée. Un email de confirmation vous a été envoyé.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/compte/commandes",
          class: "btn-primary mt-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Voir mes commandes`);
            } else {
              return [
                createTextVNode("Voir mes commandes")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="flex flex-col items-center gap-4"><div class="w-16 h-16 rounded-full bg-honey/10 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-honey-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><h1 class="text-2xl font-semibold">Paiement en cours de traitement</h1><p class="text-ink/60"> Nous n&#39;avons pas encore reçu la confirmation finale. Vérifiez le statut de votre commande dans quelques instants. </p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/compte/commandes",
          class: "btn-secondary mt-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Voir mes commandes`);
            } else {
              return [
                createTextVNode("Voir mes commandes")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/checkout/success.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=success-GWiW0LhK.mjs.map
