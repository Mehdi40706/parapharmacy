import { defineComponent, ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { useDebounceFn } from '@vueuse/core';
import { u as useAdminUsers } from './useAdminUsers-_IkvQ1u1.mjs';
import './useApi-BHrVqC1i.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { fetchUsers } = useAdminUsers();
    const users = ref([]);
    const search = ref("");
    const load = async () => {
      const result = await fetchUsers({ search: search.value || void 0 });
      users.value = result.data;
    };
    useDebounceFn(load, 400);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-semibold mb-6">Utilisateurs</h1><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Rechercher par nom ou email..." class="input-field max-w-sm mb-6"><div class="bg-white rounded-2xl border border-mist overflow-hidden"><table class="w-full text-sm"><thead class="bg-mist/50"><tr class="text-left"><th class="p-4">Nom</th><th class="p-4">Email</th><th class="p-4">Rôle</th><th class="p-4">Inscrit le</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(unref(users), (user) => {
        _push(`<tr class="border-t border-mist"><td class="p-4 font-medium">${ssrInterpolate(user.firstName)} ${ssrInterpolate(user.lastName)}</td><td class="p-4 text-ink/60">${ssrInterpolate(user.email)}</td><td class="p-4"><select${ssrRenderAttr("value", user.role)} class="input-field text-xs py-1"><option value="CLIENT">Client</option><option value="ADMIN">Admin</option></select></td><td class="p-4 text-ink/60">${ssrInterpolate(new Date(user.createdAt).toLocaleDateString("fr-FR"))}</td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/utilisateurs/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CbJonXDA.mjs.map
