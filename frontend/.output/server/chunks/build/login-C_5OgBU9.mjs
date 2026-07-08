import { _ as __nuxt_component_0 } from './nuxt-link-Cn1q7te0.mjs';
import { defineComponent, reactive, ref, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAuthStore } from './auth.store-DubDldQf.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    useRouter();
    const form = reactive({ email: "", password: "" });
    const loading = ref(false);
    const errorMessage = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-semibold mb-1">Content de vous revoir</h1><p class="text-ink/60 text-sm mb-6">Connectez-vous à votre compte</p><form class="flex flex-col gap-4"><div><label class="block text-sm font-medium mb-1.5">Email</label><input${ssrRenderAttr("value", unref(form).email)} type="email" required class="input-field" placeholder="vous@exemple.com"></div><div><label class="block text-sm font-medium mb-1.5">Mot de passe</label><input${ssrRenderAttr("value", unref(form).password)} type="password" required class="input-field" placeholder="••••••••"></div>`);
      if (unref(errorMessage)) {
        _push(`<p class="text-clay text-sm bg-clay/10 rounded-lg px-3 py-2">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="btn-primary mt-2">${ssrInterpolate(unref(loading) ? "Connexion..." : "Se connecter")}</button><div class="flex justify-between text-sm pt-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/forgot-password",
        class: "text-sage hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Mot de passe oublié ? `);
          } else {
            return [
              createTextVNode(" Mot de passe oublié ? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/register",
        class: "text-sage hover:underline font-medium"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Créer un compte `);
          } else {
            return [
              createTextVNode(" Créer un compte ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-C_5OgBU9.mjs.map
