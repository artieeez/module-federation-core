"use strict";
const React = require("react");
var a = Object.defineProperty;
var c = (s, e, t) => e in s ? a(s, e, { enumerable: true, configurable: true, writable: true, value: t }) : s[e] = t;
var i = (s, e, t) => (c(s, typeof e != "symbol" ? e + "" : e, t), t);
class g {
  constructor(e) {
    i(this, "name");
    i(this, "isDebugEnabled");
    i(this, "color");
    this.name = e, this.isDebugEnabled = false, this.color = this.stringToColor(e), typeof window < "u" && typeof localStorage < "u" && (this.isDebugEnabled = localStorage.getItem("debug") === "true"), typeof process < "u" && process.env && (this.isDebugEnabled = process.env.DEBUG === "true");
  }
  log(...e) {
    var t, n;
    if (this.isDebugEnabled) {
      const o = `color: ${this.color}; font-weight: bold`, l = `%c[${this.name}]`, r = ((n = (t = new Error().stack) == null ? void 0 : t.split(`
`)[2]) == null ? void 0 : n.trim()) || "Stack information not available";
      typeof console < "u" && console.debug && console.debug(l, o, ...e, `
 (${r})`);
    }
  }
  stringToColor(e) {
    let t = 0;
    for (let o = 0; o < e.length; o++)
      t = e.charCodeAt(o) + ((t << 5) - t);
    let n = "#";
    for (let o = 0; o < 3; o++) {
      const l = t >> o * 8 & 255;
      n += ("00" + l.toString(16)).substr(-2);
    }
    return n;
  }
}
function f() {
  const s = new PopStateEvent("popstate", { state: window.history.state });
  window.dispatchEvent(s);
}
const LoggerInstance = new g("bridge-react");
function atLeastReact18(React2) {
  if (React2 && typeof React2.version === "string" && React2.version.indexOf(".") >= 0) {
    const majorVersionString = React2.version.split(".")[0];
    try {
      return Number(majorVersionString) >= 18;
    } catch (err) {
      return false;
    }
  } else {
    return false;
  }
}
function pathJoin(...args) {
  const res = args.reduce((res2, path) => {
    let nPath = path;
    if (!nPath || typeof nPath !== "string") {
      return res2;
    }
    if (nPath[0] !== "/") {
      nPath = `/${nPath}`;
    }
    const lastIndex = nPath.length - 1;
    if (nPath[lastIndex] === "/") {
      nPath = nPath.substring(0, lastIndex);
    }
    return res2 + nPath;
  }, "");
  return res || "/";
}
const RouterContext = React.createContext(null);
exports.LoggerInstance = LoggerInstance;
exports.RouterContext = RouterContext;
exports.atLeastReact18 = atLeastReact18;
exports.f = f;
exports.pathJoin = pathJoin;
