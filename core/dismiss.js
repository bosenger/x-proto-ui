// ============================================================
// x-ui · core/dismiss.js —— 通用关闭（Alert 等常驻元素）
// 任意元素加 [data-x-close]，点击即淡出并移除其最近的 .x-alert
// （或 data-x-close="选择器" 指定要移除的祖先）
// ============================================================
export function initDismiss() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-x-close]');
    if (!btn) return;
    const sel = btn.getAttribute('data-x-close');
    const target = sel ? btn.closest(sel) : btn.closest('.x-alert');
    if (!target) return;
    target.style.transition = 'opacity var(--duration-base)';
    target.style.opacity = '0';
    setTimeout(() => target.remove(), 200);
  });
}
