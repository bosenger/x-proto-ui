// ============================================================
// x-ui · <x-dropdown> 下拉菜单（light-dismiss）
// 用法：
//   <x-dropdown data-align="left">
//     <button class="x-btn x-btn--secondary" data-trigger>操作菜单 ▾</button>
//     <div class="x-dropdown__menu" hidden>
//       <div class="x-dropdown__item" data-value="edit">编辑</div>
//       <div class="x-dropdown__divider"></div>
//       <div class="x-dropdown__item x-dropdown__item--danger" data-value="del">删除</div>
//     </div>
//   </x-dropdown>
// 事件：select { value } / open / close
// ============================================================
import { XElement } from '../core/x-element.js';

export class XDropdown extends XElement {
  static tag = 'x-dropdown';

  render() {
    this.trigger = this.$('[data-trigger]') || this.$('button');
    this.menu = this.$('.x-dropdown__menu');
    this.open = false;
  }

  bind() {
    this.trigger?.addEventListener('click', (e) => { e.stopPropagation(); this.toggle(); });
    this.menu?.addEventListener('click', (e) => {
      const item = e.target.closest('.x-dropdown__item');
      if (!item || item.classList.contains('x-dropdown__item--disabled')) return;
      this.emit('select', { value: item.dataset.value });
      this.setOpen(false);
    });
    this._onDoc = (e) => { if (!this.contains(e.target)) this.setOpen(false); };
    this._onKey = (e) => { if (e.key === 'Escape') this.setOpen(false); };
  }

  toggle() { this.setOpen(!this.open); }
  setOpen(v) {
    if (v === this.open) return;
    this.open = v;
    if (this.menu) this.menu.hidden = !v;
    if (v) { document.addEventListener('click', this._onDoc); document.addEventListener('keydown', this._onKey); this.emit('open'); }
    else { document.removeEventListener('click', this._onDoc); document.removeEventListener('keydown', this._onKey); this.emit('close'); }
  }
}
