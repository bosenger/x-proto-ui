// ============================================================
// x-ui · <x-drawer> 抽屉（原生 <dialog> 贴边）
// 用法：<x-drawer title="筛选" placement="right" size="md">…</x-drawer>
//       document.querySelector('x-drawer').open()
// 属性：title / placement(right|left|top|bottom) / size(sm|md|lg) / no-footer
// 事件：open / confirm / close
// ============================================================
import { XElement } from '../core/x-element.js';

const CLOSE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

export class XDrawer extends XElement {
  static tag = 'x-drawer';

  render() {
    const title = this.getAttribute('title') || '';
    const placement = this.getAttribute('placement') || 'right';
    const size = this.getAttribute('size') || 'md';
    const noFooter = this.hasAttribute('no-footer');
    const body = this.innerHTML;
    this.innerHTML = `
      <dialog class="x-drawer-dialog" data-placement="${placement}" data-size="${size}">
        <div class="x-drawer__head">
          <h3 class="x-drawer__title">${title}</h3>
          <button class="x-drawer__close" data-close aria-label="关闭">${CLOSE}</button>
        </div>
        <div class="x-drawer__body">${body}</div>
        ${noFooter ? '' : `<div class="x-drawer__foot">
          <button class="x-btn x-btn--secondary" data-close>取消</button>
          <button class="x-btn x-btn--primary" data-confirm>确定</button>
        </div>`}
      </dialog>`;
  }

  bind() {
    this._dialog = this.$('dialog');
    this.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) this.close();
      else if (e.target.closest('[data-confirm]')) { this.emit('confirm'); this.close(); }
    });
    this._dialog.addEventListener('click', (e) => { if (e.target === this._dialog) this.close(); });
    this._dialog.addEventListener('close', () => this.emit('close'));
  }

  open() { this._dialog.showModal(); this.emit('open'); }
  close() { this._dialog.close(); }
}
