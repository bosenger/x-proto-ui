// ============================================================
// x-ui · <x-accordion> 折叠面板
// 用法：
//   <x-accordion>            （加 multiple 允许多开）
//     <x-accordion-item title="问题一" open>答案……</x-accordion-item>
//   </x-accordion>
// 事件：toggle { index, open }
// ============================================================
import { XElement } from '../core/x-element.js';

const CHEV = '<svg class="x-accordion__chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>';

export class XAccordion extends XElement {
  static tag = 'x-accordion';

  render() {
    this.multiple = this.hasAttribute('multiple');
    this.items = this.$$('x-accordion-item').map((el) => {
      const title = el.getAttribute('title') || '';
      const open = el.hasAttribute('open');
      const body = el.innerHTML;
      el.classList.add('x-accordion__item');
      el.innerHTML = `<div class="x-accordion__head"><span style="flex:1">${title}</span>${CHEV}</div><div class="x-accordion__body"><div class="x-accordion__inner">${body}</div></div>`;
      return el;
    });
    this.items.forEach((el, i) => { if (el.hasAttribute('open')) this.setOpen(i, true, false); });
  }

  bind() {
    this.addEventListener('click', (e) => {
      const head = e.target.closest('.x-accordion__head'); if (!head) return;
      const item = head.parentElement;
      const i = this.items.indexOf(item);
      this.setOpen(i, !item.classList.contains('is-open'), true);
    });
  }

  setOpen(i, open, fire) {
    const item = this.items[i]; if (!item) return;
    if (open && !this.multiple) this.items.forEach((el, j) => { if (j !== i) this.collapse(el); });
    if (open) this.expand(item); else this.collapse(item);
    if (fire) this.emit('toggle', { index: i, open });
  }
  expand(item) {
    item.classList.add('is-open');
    const body = item.querySelector('.x-accordion__body');
    body.style.maxHeight = body.scrollHeight + 'px';
  }
  collapse(item) {
    item.classList.remove('is-open');
    const body = item.querySelector('.x-accordion__body');
    body.style.maxHeight = '0px';
  }
}
