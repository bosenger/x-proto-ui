// ============================================================
// x-ui · <x-input-number> 数字输入框
// 用法：<x-input-number value="3" min="0" max="99" step="1" unit="个"></x-input-number>
// 取值：el.value（number）   事件：change { value }
// ============================================================
import { XElement } from '../core/x-element.js';

const UP = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
const DOWN = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

export class XInputNumber extends XElement {
  static tag = 'x-input-number';

  render() {
    this.min = this.hasAttribute('min') ? +this.getAttribute('min') : -Infinity;
    this.max = this.hasAttribute('max') ? +this.getAttribute('max') : Infinity;
    this.step = +this.getAttribute('step') || 1;
    this.disabled = this.hasAttribute('disabled');
    this._val = this.clamp(+this.getAttribute('value') || 0);
    const unit = this.getAttribute('unit');
    this.innerHTML = `
      <div class="x-input-number${this.disabled ? ' is-disabled' : ''}">
        <input class="x-input-number__field" inputmode="numeric" value="${this._val}" ${this.disabled ? 'disabled' : ''}>
        ${unit ? `<span class="x-input-number__unit">${unit}</span>` : ''}
        <div class="x-input-number__steppers">
          <button class="x-input-number__step x-input-number__step--up" data-step="1" tabindex="-1" aria-label="增加" ${this.disabled ? 'disabled' : ''}>${UP}</button>
          <button class="x-input-number__step x-input-number__step--down" data-step="-1" tabindex="-1" aria-label="减少" ${this.disabled ? 'disabled' : ''}>${DOWN}</button>
        </div>
      </div>`;
    this.field = this.$('.x-input-number__field');
  }

  bind() {
    if (this.disabled) return;
    this.$$('[data-step]').forEach(b => b.addEventListener('click', () => this.bump(+b.dataset.step)));
    this.field.addEventListener('change', () => this.set(+this.field.value || 0));
  }

  get value() { return this._val; }
  clamp(v) { return Math.min(this.max, Math.max(this.min, v)); }
  bump(dir) { this.set(this._val + dir * this.step); }
  set(v) {
    this._val = this.clamp(v);
    this.field.value = this._val;
    this.emit('change', { value: this._val });
  }
}
