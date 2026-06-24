// ============================================================
// x-ui · <x-upload> 上传（拖拽区 + 文件项，原型用模拟进度）
// 用法：<x-upload hint="支持 PDF / PNG / JPG，单文件 ≤ 10MB"></x-upload>
// 事件：change { files }（文件名数组）
// ============================================================
import { XElement } from '../core/x-element.js';

const UP = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>';
const FILE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/></svg>';
const CHECK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 6 9 17l-5-5"/></svg>';
const X = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

export class XUpload extends XElement {
  static tag = 'x-upload';

  render() {
    const hint = this.getAttribute('hint') || '点击或拖拽文件到此处';
    this.files = [];
    this.innerHTML = `
      <div class="x-upload__drop" tabindex="0" role="button">
        <div class="x-upload__icon">${UP}</div>
        <div class="x-upload__title">点击或拖拽文件到此处</div>
        <div class="x-upload__hint">${hint}</div>
      </div>
      <input type="file" multiple hidden>
      <div class="x-upload__list"></div>`;
    this.drop = this.$('.x-upload__drop');
    this.fileInput = this.$('input[type=file]');
    this.list = this.$('.x-upload__list');
  }

  bind() {
    this.drop.addEventListener('click', () => this.fileInput.click());
    this.drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.fileInput.click(); } });
    this.fileInput.addEventListener('change', () => this.add([...this.fileInput.files].map(f => f.name)));
    ['dragenter', 'dragover'].forEach(ev => this.drop.addEventListener(ev, (e) => { e.preventDefault(); this.drop.classList.add('is-dragover'); }));
    ['dragleave', 'drop'].forEach(ev => this.drop.addEventListener(ev, (e) => { e.preventDefault(); this.drop.classList.remove('is-dragover'); }));
    this.drop.addEventListener('drop', (e) => this.add([...e.dataTransfer.files].map(f => f.name)));
    this.list.addEventListener('click', (e) => {
      const rm = e.target.closest('.x-upload__remove'); if (!rm) return;
      const item = rm.closest('.x-upload__file'); const id = +item.dataset.id;
      this.files = this.files.filter(f => f.id !== id); item.remove();
      this.emit('change', { files: this.files.map(f => f.name) });
    });
  }

  add(names) {
    for (const name of names) {
      const id = (this._seq = (this._seq || 0) + 1);
      const f = { id, name, progress: 0, done: false };
      this.files.push(f);
      this.renderItem(f);
      this.simulate(f);
    }
    this.emit('change', { files: this.files.map(f => f.name) });
  }

  renderItem(f) {
    const el = document.createElement('div');
    el.className = 'x-upload__file'; el.dataset.id = f.id;
    el.innerHTML = `
      <div class="x-upload__file-ico">${FILE}</div>
      <div class="x-upload__file-main">
        <div class="x-upload__file-name">${f.name}</div>
        <div class="x-upload__file-bar"><div style="width:${f.progress}%"></div></div>
      </div>
      <span class="x-upload__pct">${f.progress}%</span>
      <button class="x-upload__remove" aria-label="移除">${X}</button>`;
    this.list.appendChild(el); f.el = el;
  }

  simulate(f) {
    const tick = () => {
      f.progress = Math.min(100, f.progress + Math.round(12 + Math.random() * 22));
      const bar = f.el.querySelector('.x-upload__file-bar > div');
      const pct = f.el.querySelector('.x-upload__pct');
      bar.style.width = f.progress + '%';
      if (f.progress >= 100) {
        f.done = true; f.el.classList.add('x-upload__file--done');
        if (pct) { pct.outerHTML = `<span class="x-upload__done">${CHECK}</span>`; }
      } else { pct.textContent = f.progress + '%'; setTimeout(tick, 220 + Math.random() * 260); }
    };
    setTimeout(tick, 240);
  }
}
