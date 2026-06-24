// ============================================================
// x-ui · Toast 轻提示（命令式 API）
// 用法：xui.toast({ type: 'success', message: '已保存', duration: 3200 })
//       xui.toast.success('已保存')  /  .danger / .warning / .info
// 返回：close() 手动关闭
// ============================================================
const ICONS = {
  success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
  danger: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>',
  warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
};
const X = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

function container() {
  let c = document.querySelector('.x-toast-container');
  if (!c) { c = document.createElement('div'); c.className = 'x-toast-container'; document.body.appendChild(c); }
  return c;
}

export function toast(opts) {
  const { type = 'info', message = '', duration = 3200 } = typeof opts === 'string' ? { message: opts } : opts;
  const el = document.createElement('div');
  el.className = `x-toast x-toast--${type}`;
  el.setAttribute('role', type === 'danger' || type === 'warning' ? 'alert' : 'status');
  el.innerHTML = `<span class="x-toast__dot"></span><span class="x-toast__msg">${message}</span><button class="x-toast__close" aria-label="关闭">${X}</button>`;
  container().appendChild(el);

  let timer;
  const close = () => {
    if (!el.isConnected) return;
    el.classList.add('is-leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
    clearTimeout(timer);
  };
  el.querySelector('.x-toast__close').addEventListener('click', close);
  if (duration > 0) timer = setTimeout(close, duration);
  return close;
}

['success', 'danger', 'warning', 'info'].forEach((t) => {
  toast[t] = (message, duration) => toast({ type: t, message, duration });
});
