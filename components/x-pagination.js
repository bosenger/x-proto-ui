// ============================================================
// x-ui · <x-pagination> 分页
// 用法：<x-pagination total="128" page-size="10" page="1"></x-pagination>
// 属性：total / page-size(默认10) / page(默认1)
// 事件：change { page }
// ============================================================
import { XElement } from '../core/x-element.js';

const PREV = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg>';
const NEXT = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg>';

export class XPagination extends XElement {
  static tag = 'x-pagination';

  render() {
    this.total = +this.getAttribute('total') || 0;
    this.pageSize = +this.getAttribute('page-size') || 10;
    this.page = +this.getAttribute('page') || 1;
    this.wrap = document.createElement('div');
    this.wrap.className = 'x-pagination';
    this.appendChild(this.wrap);
    this.paint();
  }

  bind() {
    this.wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('button'); if (!btn || btn.disabled) return;
      const to = btn.dataset.page; if (to == null) return;
      this.go(+to);
    });
  }

  get pageCount() { return Math.max(1, Math.ceil(this.total / this.pageSize)); }

  go(p) {
    p = Math.min(this.pageCount, Math.max(1, p));
    if (p === this.page) return;
    this.page = p; this.paint(); this.emit('change', { page: p });
  }

  pages() {
    const n = this.pageCount, c = this.page, out = [];
    const add = (x) => out.push(x);
    if (n <= 7) { for (let i = 1; i <= n; i++) add(i); return out; }
    add(1);
    if (c > 4) add('…');
    for (let i = Math.max(2, c - 1); i <= Math.min(n - 1, c + 1); i++) add(i);
    if (c < n - 3) add('…');
    add(n);
    return out;
  }

  paint() {
    const btn = (label, page, { active, disabled } = {}) =>
      `<button class="x-pagination__btn${active ? ' is-active' : ''}"${page != null ? ` data-page="${page}"` : ''}${disabled ? ' disabled' : ''}>${label}</button>`;
    const parts = [btn(PREV, this.page - 1, { disabled: this.page <= 1 })];
    for (const p of this.pages()) {
      parts.push(p === '…' ? '<span class="x-pagination__ellipsis">…</span>' : btn(p, p, { active: p === this.page }));
    }
    parts.push(btn(NEXT, this.page + 1, { disabled: this.page >= this.pageCount }));
    this.wrap.innerHTML = parts.join('');
  }
}
