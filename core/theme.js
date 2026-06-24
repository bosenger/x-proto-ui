// ============================================================
// x-ui · core/theme.js —— 主题持久化（R5 / R6）
// 维度正交：theme（light 纸面 / dark 蓝图） × brand（neutral/blue/teal/violet）
// 初始化时从 localStorage 回填到根节点；跨页面保持状态。
// ============================================================
const THEME_KEY = 'x-ui:theme';
const BRAND_KEY = 'x-ui:brand';

function read(key) { try { return localStorage.getItem(key); } catch { return null; } }
function write(key, val) { try { localStorage.setItem(key, val); } catch { /* file:// 下可能受限 */ } }

/** 库加载即调用：把持久化的 theme/brand 写回根节点 */
export function initTheme() {
  const root = document.documentElement;
  const t = read(THEME_KEY) || root.dataset.theme || 'light';
  const b = read(BRAND_KEY) || root.dataset.brand || 'neutral';
  root.dataset.theme = t;
  root.dataset.brand = b;
}

export function setTheme(t) { document.documentElement.dataset.theme = t; write(THEME_KEY, t); }
export function setBrand(b) { document.documentElement.dataset.brand = b; write(BRAND_KEY, b); }
export function getTheme() { return document.documentElement.dataset.theme || 'light'; }
export function getBrand() { return document.documentElement.dataset.brand || 'neutral'; }
export function toggleTheme() { setTheme(getTheme() === 'dark' ? 'light' : 'dark'); }
