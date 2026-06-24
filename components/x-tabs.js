// ============================================================
// x-ui · <x-tabs> —— 轻交互范式代表
// 用法（Light DOM，作者直接写）：
//   <x-tabs>
//     <div class="x-tabs__nav">
//       <button class="x-tabs__tab" data-tab="a">页一</button>
//       <button class="x-tabs__tab" data-tab="b">页二</button>
//     </div>
//     <div class="x-tabs__panel" data-panel="a">…</div>
//     <div class="x-tabs__panel" data-panel="b" hidden>…</div>
//   </x-tabs>
// 对外事件：change { value }
// ============================================================
import { XElement } from '../core/x-element.js';

export class XTabs extends XElement {
  static tag = 'x-tabs';

  render() {
    // 初始激活态：第一个 tab（或已标记 .active 的）
    const tabs = this.$$('[data-tab]');
    if (tabs.length && !tabs.some(t => t.classList.contains('active'))) {
      this.activate(tabs[0].dataset.tab, false);
    }
  }

  bind() {
    this.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-tab]');
      if (!tab || !this.contains(tab)) return;
      this.activate(tab.dataset.tab, true);
    });
  }

  activate(value, fire) {
    this.$$('[data-tab]').forEach(t => t.classList.toggle('active', t.dataset.tab === value));
    this.$$('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== value; });
    if (fire) this.emit('change', { value });
  }
}
