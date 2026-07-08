import { _ as __nuxt_component_0 } from './nuxt-link-CBZ25J1v.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductCard",
  __ssrInlineRender: true,
  props: {
    product: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/produits/${__props.product.slug}`,
        class: "group flex flex-col bg-white rounded-2xl border border-mist overflow-hidden hover:shadow-md transition-shadow duration-200"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="aspect-square bg-mist relative overflow-hidden"${_scopeId}>`);
            if (__props.product.imageUrl) {
              _push2(`<img${ssrRenderAttr("src", __props.product.imageUrl)}${ssrRenderAttr("alt", __props.product.name)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"${_scopeId}>`);
            } else {
              _push2(`<div class="w-full h-full flex items-center justify-center text-ink/20"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76ZM16 8l-6 6"${_scopeId}></path></svg></div>`);
            }
            if (__props.product.stock === 0) {
              _push2(`<span class="badge-pill absolute top-3 left-3 bg-clay/90 text-white"${_scopeId}> Rupture de stock </span>`);
            } else if (__props.product.stock <= 5) {
              _push2(`<span class="badge-pill absolute top-3 left-3 bg-honey/90 text-ink"${_scopeId}> Stock limité </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="p-4 flex flex-col gap-1 flex-1"${_scopeId}><span class="text-xs text-sage font-medium"${_scopeId}>${ssrInterpolate(__props.product.category.name)}</span><h3 class="font-medium leading-snug line-clamp-2"${_scopeId}>${ssrInterpolate(__props.product.name)}</h3><div class="mt-auto pt-2 flex items-center justify-between"${_scopeId}><span class="price text-lg"${_scopeId}>${ssrInterpolate(Number(__props.product.price).toFixed(2))} TND</span></div></div>`);
          } else {
            return [
              createVNode("div", { class: "aspect-square bg-mist relative overflow-hidden" }, [
                __props.product.imageUrl ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: __props.product.imageUrl,
                  alt: __props.product.name,
                  class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "w-full h-full flex items-center justify-center text-ink/20"
                }, [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    class: "w-12 h-12",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "1.5",
                      d: "M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76ZM16 8l-6 6"
                    })
                  ]))
                ])),
                __props.product.stock === 0 ? (openBlock(), createBlock("span", {
                  key: 2,
                  class: "badge-pill absolute top-3 left-3 bg-clay/90 text-white"
                }, " Rupture de stock ")) : __props.product.stock <= 5 ? (openBlock(), createBlock("span", {
                  key: 3,
                  class: "badge-pill absolute top-3 left-3 bg-honey/90 text-ink"
                }, " Stock limité ")) : createCommentVNode("", true)
              ]),
              createVNode("div", { class: "p-4 flex flex-col gap-1 flex-1" }, [
                createVNode("span", { class: "text-xs text-sage font-medium" }, toDisplayString(__props.product.category.name), 1),
                createVNode("h3", { class: "font-medium leading-snug line-clamp-2" }, toDisplayString(__props.product.name), 1),
                createVNode("div", { class: "mt-auto pt-2 flex items-center justify-between" }, [
                  createVNode("span", { class: "price text-lg" }, toDisplayString(Number(__props.product.price).toFixed(2)) + " TND", 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/product/ProductCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "ProductCard" });

export { __nuxt_component_1 as _ };
//# sourceMappingURL=ProductCard-C3uJetVq.mjs.map
