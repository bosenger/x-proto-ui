// ============================================================
// x-ui · <x-select> —— 选择器（单选 / 多选）
// 用法：<x-select placeholder="请选择" multiple>
//         <option value="a">选项一</option> ...
//       </x-select>
// 取值：el.value（单选 string / 多选 string[]）
// 事件：change { value }
// ============================================================
import { XElement } from '../core/x-element.js';

const CHEV = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>';
const X = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

export class XSelect extends XElement {
  static tag = 'x-select';

  render() {
    this.multiple = this.hasAttribute('multiple');
    this.placeholder = this.getAttribute('placeholder') || '请选择';
    this.options = this.$$('option').map(o => ({ value: o.value || o.textContent, label: o.textContent, disabled: o.disabled }));
    this.selected = this.multiple ? this.$$('option[selected]').map(o => o.value || o.textContent)
                                  : (this.$('option[selected]')?.value ?? null);
    this.open = false;
    this.innerHTML = `<div class="x-select__trigger"><span class="x-select__value"></span><span class="x-select__chev">${CHEV}</span></div><div class="x-select__panel" hidden></div>`;
    this.trigger = this.$('.x-select__trigger');
    this.panel = this.$('.x-select__panel');
    this.valueEl = this.$('.x-select__value');
    this.renderValue();
    this.renderPanel();
  }

  bind() {
    this.trigger.addEventListener('click', () => this.toggle());
    this.panel.addEventListener('click', (e) => {
      const opt = e.target.closest('.x-select__option'); if (!opt || opt.classList.contains('is-disabled')) return;
      this.pick(opt.dataset.value);
    });
    this.valueEl.addEventListener('click', (e) => {
      const close = e.target.closest('.x-tag__close'); if (!close) return;
      e.stopPropagation(); this.remove_(close.parentElement.dataset.value);
    });
    this._onDoc = (e) => { if (!this.contains(e.target)) this.setOpen(false); };
  }

  get value() { return this.selected; }

  toggle() { this.setOpen(!this.open); }
  setOpen(v) {
    this.open = v;
    this.panel.hidden = !v;
    this.trigger.classList.toggle('is-open', v);
    if (v) document.addEventListener('click', this._onDoc, true);
    else document.removeEventListener('click', this._onDoc, true);
  }

  pick(value) {
    if (this.multiple) {
      const i = this.selected.indexOf(value);
      if (i >= 0) this.selected.splice(i, 1); else this.selected.push(value);
    } else {
      this.selected = value; this.setOpen(false);
    }
    this.renderValue(); this.renderPanel(); this.emit('change', { value: this.selected });
  }

  remove_(value) {
    this.selected = this.selected.filter(v => v !== value);
    this.renderValue(); this.renderPanel(); this.emit('change', { value: this.selected });
  }

  labelOf(v) { return this.options.find(o => o.value === v)?.label ?? v; }

  renderValue() {
    if (this.multiple) {
      this.valueEl.innerHTML = this.selected.length
        ? this.selected.map(v => `<span class="x-tag" data-value="${v}">${this.labelOf(v)}<span class="x-tag__close">${X}</span></span>`).join('')
        : `<span class="x-select__placeholder">${this.placeholder}</span>`;
    } else {
      this.valueEl.innerHTML = (this.selected != null && this.selected !== '')
        ? this.labelOf(this.selected)
        : `<span class="x-select__placeholder">${this.placeholder}</span>`;
    }
  }

  renderPanel() {
    if (!this.options.length) { this.panel.innerHTML = `<div class="x-select__empty">暂无选项</div>`; return; }
    const isSel = (v) => this.multiple ? this.selected.includes(v) : this.selected === v;
    this.panel.innerHTML = this.options.map(o =>
      `<div class="x-select__option${isSel(o.value) ? ' is-selected' : ''}${o.disabled ? ' is-disabled' : ''}" data-value="${o.value}">${o.label}</div>`
    ).join('');
  }
}
