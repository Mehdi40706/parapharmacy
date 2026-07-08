import { u as useAdminOrders, _ as __nuxt_component_0 } from './useAdminOrders-BfKYx_06.mjs';
import { defineComponent, ref, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
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
    useAdminOrders();
    const orders = ref([]);
    const activeFilter = ref(void 0);
    const statusFilters = [
      { label: "Toutes", value: void 0 },
      { label: "En attente", value: "PENDING" },
      { label: "Confirmées", value: "CONFIRMED" },
      { label: "Expédiées", value: "SHIPPED" },
      { label: "Livrées", value: "DELIVERED" },
      { label: "Annulées", value: "CANCELLED" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_OrderStatusBadge = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-semibold mb-6">Commandes</h1><div class="flex gap-2 mb-6"><!--[-->`);
      ssrRenderList(statusFilters, (s) => {
        _push(`<button class="${ssrRenderClass([unref(activeFilter) === s.value ? "bg-sage text-white" : "bg-mist text-ink/70", "badge-pill"])}">${ssrInterpolate(s.label)}</button>`);
      });
      _push(`<!--]--></div><div class="bg-white rounded-2xl border border-mist overflow-hidden"><table class="w-full text-sm"><thead class="bg-mist/50"><tr class="text-left"><th class="p-4">Client</th><th class="p-4">Articles</th><th class="p-4">Total</th><th class="p-4">Statut</th><th class="p-4">Date</th><th class="p-4"></th></tr></thead><tbody><!--[-->`);
      ssrRenderList(unref(orders), (order) => {
        _push(`<tr class="border-t border-mist"><td class="p-4">${ssrInterpolate(order.user?.firstName)} ${ssrInterpolate(order.user?.lastName)}</td><td class="p-4 text-ink/60">${ssrInterpolate(order.items.length)} article(s)</td><td class="p-4 price">${ssrInterpolate(order.totalPrice.toFixed(2))} TND</td><td class="p-4">`);
        _push(ssrRenderComponent(_component_OrderStatusBadge, {
          status: order.status
        }, null, _parent));
        _push(`</td><td class="p-4 text-ink/60">${ssrInterpolate(new Date(order.createdAt).toLocaleDateString("fr-FR"))}</td><td class="p-4"><select${ssrRenderAttr("value", order.status)} class="input-field text-xs py-1"><option value="PENDING">En attente</option><option value="CONFIRMED">Confirmée</option><option value="PROCESSING">En préparation</option><option value="SHIPPED">Expédiée</option><option value="DELIVERED">Livrée</option><option value="CANCELLED">Annulée</option></select></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/commandes/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C55b3-xD.mjs.map
