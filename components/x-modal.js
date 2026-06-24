// ============================================================
// x-ui · <x-modal> —— 弹层范式代表（原生 <dialog> 封装）
// 原生底座负责：顶层渲染、遮罩、Esc 关闭、焦点陷阱。
// 用法：
//   <x-modal title="标题" size="md">正文……</x-modal>
//   document.querySelector('x-modal').open()
// 属性：title / size(sm|md|lg) / confirm(危险确认形态) / ok-text / cancel-text
// 对外事件：open / confirm / close
// ============================================================
import { XElement } from '../core/x-element.js';

const CLOSE_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

export class XModal extends XElement {
  static tag = 'x-modal';

  render() {
    const title = this.getAttribute('title') || '';
    const size = this.getAttribute('size') || 'md';
    const confirm = this.hasAttribute('confirm');
    const okText = this.getAttribute('ok-text') || (confirm ? '删除' : '确定');
    const cancelText = this.getAttribute('cancel-text') || '取消';
    const body = this.innerHTML;

    this.innerHTML = `
      <dialog class="x-dialog${confirm ? ' x-dialog--confirm' : ''}" data-size="${size}">
        <div class="x-dialog__head">
          <h3 class="x-dialog__title">${title}</h3>
          <button class="x-dialog__close" data-close aria-label="关闭">${CLOSE_ICON}</button>
        </div>
        <div class="x-dialog__body">${body}</div>
        <div class="x-dialog__foot">
          <button class="x-btn x-btn--secondary" data-close>${cancelText}</button>
          <button class="x-btn ${confirm ? 'x-btn--danger' : 'x-btn--primary'}" data-confirm>${okText}</button>
        </div>
      </dialog>`;
  }

  bind() {
    this._dialog = this.$('dialog');
    this.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) this.close();
      else if (e.target.closest('[data-confirm]')) { this.emit('confirm'); this.close(); }
    });
    // 点击遮罩（native dialog 的点击落在 dialog 自身）关闭
    this._dialog.addEventListener('click', (e) => { if (e.target === this._dialog) this.close(); });
    this._dialog.addEventListener('close', () => this.emit('close'));
  }

  open() { this._dialog.showModal(); this.emit('open'); }
  close() { this._dialog.close(); }
}
