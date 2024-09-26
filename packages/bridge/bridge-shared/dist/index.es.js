var a = Object.defineProperty;
var c = (s, e, t) => e in s ? a(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var i = (s, e, t) => (c(s, typeof e != "symbol" ? e + "" : e, t), t);
class g {
  constructor(e) {
    i(this, "name");
    i(this, "isDebugEnabled");
    i(this, "color");
    this.name = e, this.isDebugEnabled = !1, this.color = this.stringToColor(e), typeof window < "u" && typeof localStorage < "u" && (this.isDebugEnabled = localStorage.getItem("debug") === "true"), typeof process < "u" && process.env && (this.isDebugEnabled = process.env.DEBUG === "true");
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
export {
  g as Logger,
  f as dispatchPopstateEnv
};
