// ============================================================
// x-ui · <x-cascader> 级联选择（两级联动）
// 数据：默认内置示例；可用 el.data = { 华东:['上海',...], ... } 覆盖
// 取值：el.value（['华东','上海']）   事件：change { value, path }
// ============================================================
import { XElement } from '../core/x-element.js';

const CHEV_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg>';
const CHEV_D = '<svg class="x-cascader__chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>';

const DEFAULT_DATA = { '华东': ['上海', '江苏', '浙江'], '华北': ['北京', '天津', '河北'], '华南': ['广东', '广西', '海南'] };

export class XCascader extends XElement {
  static tag = 'x-cascader';

  render() {
    this._data = this._data || DEFAULT_DATA;
    this.placeholder = this.getAttribute('placeholder') || '请选择';
    this.col1 = Object.keys(this._data)[0];
    this.col2 = null;
    this.open = false;
    this.innerHTML = `<div class="x-cascader__trigger"><span class="x-cascader__value"></span>${CHEV_D}</div><div class="x-cascader__panel" hidden></div>`;
    this.trigger = this.$('.x-cascader__trigger');
    this.panel = this.$('.x-cascader__panel');
    this.valueEl = this.$('.x-cascader__value');
    this.renderValue(); this.renderPanel();
  }

  set data(d) { this._data = d; if (this._init) this.render(); }
  get value() { return this.col2 ? [this.col1, this.col2] : null; }

  bind() {
    this.trigger.addEventListener('click', () => this.setOpen(!this.open));
    this.panel.addEventListener('click', (e) => {
      const o = e.target.closest('.x-cascader__option'); if (!o) return;
      if (o.dataset.col === '1') { this.col1 = o.dataset.key; this.col2 = null; this.renderPanel(); }
      else { this.col2 = o.dataset.key; this.renderValue(); this.renderPanel(); this.setOpen(false); this.emit('change', { value: this.value, path: this.value.join(' / ') }); }
    });
    this._onDoc = (e) => { if (!this.contains(e.target)) this.setOpen(false); };
  }

  setOpen(v) {
    this.open = v; this.panel.hidden = !v; this.trigger.classList.toggle('is-open', v);
    if (v) document.addEventListener('click', this._onDoc, true);
    else document.removeEventListener('click', this._onDoc, true);
  }

  renderValue() {
    this.valueEl.innerHTML = this.value ? this.value.join(' / ') : `<span class="x-cascader__placeholder">${this.placeholder}</span>`;
  }

  renderPanel() {
    const col1 = Object.keys(this._data).map(k =>
      `<div class="x-cascader__option${k === this.col1 ? ' is-active' : ''}" data-col="1" data-key="${k}">${k}${CHEV_R}</div>`).join('');
    const col2 = (this._data[this.col1] || []).map(v =>
      `<div class="x-cascader__option${v === this.col2 ? ' is-active' : ''}" data-col="2" data-key="${v}">${v}</div>`).join('');
    this.panel.innerHTML = `<div class="x-cascader__col">${col1}</div><div class="x-cascader__col">${col2}</div>`;
    this.panel.querySelectorAll('.x-cascader__option[data-col="1"] svg').forEach(s => { s.setAttribute('width', '13'); s.setAttribute('height', '13'); });
  }
}
