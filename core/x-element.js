// ============================================================
// x-ui · core/x-element.js —— 整库唯一运行时（压缩后 < 2KB）
// 所有交互组件继承同一极小基类；无 vdom / 无调度器 / 无框架依赖。
// ============================================================

export class XElement extends HTMLElement {
  static tag = '';

  connectedCallback() {
    if (!this._init) {
      this.render();      // 子类可选实现：写 innerHTML
      this._init = true;
      this.bind?.();      // 子类可选实现：绑定事件
    }
  }

  /** 子类覆盖：构建内部结构（Light DOM）。默认不动 DOM。 */
  render() {}

  /** querySelector 简写 */
  $(sel) { return this.querySelector(sel); }
  /** querySelectorAll → 数组 */
  $$(sel) { return Array.from(this.querySelectorAll(sel)); }

  /** 派发原生 CustomEvent（冒泡），使用者用标准 addEventListener 监听 */
  emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
  }
}

/** 批量注册器：幂等，重复注册同名标签自动跳过 */
export function define(comps) {
  for (const C of comps) {
    if (C.tag && !customElements.get(C.tag)) customElements.define(C.tag, C);
  }
}
