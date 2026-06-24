// ============================================================
// x-ui · JS 入口（作者侧）—— esbuild 打包成 dist/x-ui.js（IIFE）
// 自执行：注册全部交互组件 + 初始化主题 + 暴露 window.xui
// ============================================================
import { XElement, define } from '../core/x-element.js';
import { initTheme, setTheme, setBrand, getTheme, getBrand, toggleTheme } from '../core/theme.js';
import { initDismiss } from '../core/dismiss.js';
import { toast } from '../components/toast.js';

// 交互型组件（需注册自定义元素）
import { XTabs } from '../components/x-tabs.js';
import { XAccordion } from '../components/x-accordion.js';
import { XDropdown } from '../components/x-dropdown.js';
import { XModal } from '../components/x-modal.js';
import { XDrawer } from '../components/x-drawer.js';
import { XSelect } from '../components/x-select.js';
import { XPagination } from '../components/x-pagination.js';
import { XDatepicker } from '../components/x-datepicker.js';
import { XUpload } from '../components/x-upload.js';
import { XCascader } from '../components/x-cascader.js';
import { XInputNumber } from '../components/x-input-number.js';

const COMPONENTS = [
  XTabs, XAccordion, XDropdown, XModal, XDrawer, XSelect,
  XPagination, XDatepicker, XUpload, XCascader, XInputNumber,
];

define(COMPONENTS);
initTheme();
initDismiss();

window.xui = Object.assign(window.xui || {}, {
  version: '0.1.0',
  XElement, define,
  setTheme, setBrand, getTheme, getBrand, toggleTheme,
  toast,
  components: Object.fromEntries(COMPONENTS.map((C) => [C.name, C])),
});
