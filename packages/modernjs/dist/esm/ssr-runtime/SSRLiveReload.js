import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
function _templateObject() {
  var data = _tagged_template_literal([
    "\n      if(",
    "){\n        location.reload();\n      }\n   "
  ]);
  _templateObject = function _templateObject2() {
    return data;
  };
  return data;
}
import { jsx as _jsx } from "react/jsx-runtime";
function SSRLiveReload() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }
  return /* @__PURE__ */ _jsx("script", {
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: {
      __html: String.raw(_templateObject(), globalThis.shouldUpdate)
    }
  });
}
export {
  SSRLiveReload
};
