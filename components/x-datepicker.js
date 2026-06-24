// ============================================================
// x-ui · <x-datepicker> 日期选择（周一为首列）
// 用法：<x-datepicker value="2026-06-23" placeholder="选择日期"></x-datepicker>
// 取值：el.value（'YYYY-MM-DD'）   事件：change { value }
// ============================================================
import { XElement } from '../core/x-element.js';

const CAL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>';
const PREV = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg>';
const NEXT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg>';
const WEEK = ['一', '二', '三', '四', '五', '六', '日'];
const pad = (n) => (n < 10 ? '0' + n : '' + n);

export class XDatepicker extends XElement {
  static tag = 'x-datepicker';

  render() {
    this.placeholder = this.getAttribute('placeholder') || '选择日期';
    const v = this.getAttribute('value');
    const now = new Date();
    this.selected = v ? this.parse(v) : null;
    const base = this.selected || { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
    this.view = { y: base.y, m: base.m };
    this.today = { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
    this.open = false;
    this.innerHTML = `<div class="x-datepicker__input">${CAL}<span class="x-datepicker__text"></span></div><div class="x-datepicker__panel" hidden></div>`;
    this.input = this.$('.x-datepicker__input');
    this.panel = this.$('.x-datepicker__panel');
    this.text = this.$('.x-datepicker__text');
    this.renderText(); this.renderPanel();
  }

  bind() {
    this.input.addEventListener('click', () => this.setOpen(!this.open));
    this.panel.addEventListener('click', (e) => {
      const nav = e.target.closest('[data-nav]');
      if (nav) { this.shift(+nav.dataset.nav); return; }
      const day = e.target.closest('.x-datepicker__day:not(.x-datepicker__day--blank)');
      if (day) this.pick(+day.dataset.day);
    });
    this._onDoc = (e) => { if (!this.contains(e.target)) this.setOpen(false); };
  }

  get value() { return this.selected ? `${this.selected.y}-${pad(this.selected.m + 1)}-${pad(this.selected.d)}` : null; }
  parse(s) { const [y, m, d] = s.split('-').map(Number); return { y, m: m - 1, d }; }

  setOpen(v) {
    this.open = v; this.panel.hidden = !v; this.input.classList.toggle('is-open', v);
    if (v) { this.renderPanel(); document.addEventListener('click', this._onDoc, true); }
    else document.removeEventListener('click', this._onDoc, true);
  }
  shift(delta) {
    let m = this.view.m + delta, y = this.view.y;
    if (m < 0) { m = 11; y--; } else if (m > 11) { m = 0; y++; }
    this.view = { y, m }; this.renderPanel();
  }
  pick(d) {
    this.selected = { y: this.view.y, m: this.view.m, d };
    this.renderText(); this.renderPanel(); this.setOpen(false);
    this.emit('change', { value: this.value });
  }

  renderText() {
    this.text.textContent = this.value || this.placeholder;
    this.text.className = 'x-datepicker__text' + (this.value ? '' : ' x-datepicker__placeholder');
    this.text.style.color = this.value ? 'var(--fg-base)' : 'var(--fg-subtle)';
  }

  renderPanel() {
    const { y, m } = this.view;
    const firstDow = (new Date(y, m, 1).getDay() + 6) % 7;   // 周一=0
    const days = new Date(y, m + 1, 0).getDate();
    let cells = '';
    for (let i = 0; i < firstDow; i++) cells += `<div class="x-datepicker__day x-datepicker__day--blank"></div>`;
    for (let d = 1; d <= days; d++) {
      const isToday = y === this.today.y && m === this.today.m && d === this.today.d;
      const isSel = this.selected && y === this.selected.y && m === this.selected.m && d === this.selected.d;
      const cls = ['x-datepicker__day', isToday && 'x-datepicker__day--today', isSel && 'x-datepicker__day--selected'].filter(Boolean).join(' ');
      cells += `<div class="${cls}" data-day="${d}">${d}</div>`;
    }
    this.panel.innerHTML = `
      <div class="x-datepicker__head">
        <span class="x-datepicker__nav" data-nav="-1">${PREV}</span>
        <span class="x-datepicker__title">${y} 年 ${m + 1} 月</span>
        <span class="x-datepicker__nav" data-nav="1">${NEXT}</span>
      </div>
      <div class="x-datepicker__weekdays">${WEEK.map(w => `<div class="x-datepicker__weekday">${w}</div>`).join('')}</div>
      <div class="x-datepicker__grid">${cells}</div>`;
  }
}
