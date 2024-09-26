import { jsx as _jsx } from "react/jsx-runtime";
function SSRLiveReload() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }
  return /* @__PURE__ */ _jsx("script", {
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: {
      __html: String.raw`
      if(${globalThis.shouldUpdate}){
        location.reload();
      }
   `
    }
  });
}
export {
  SSRLiveReload
};
