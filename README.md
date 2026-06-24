# x-proto-ui

> 零运行时 · 纯 HTML 引入 · 主题化 Web Components UI 库。面向原型设计与中后台界面。
> npm 包名为 `x-proto-ui`;组件标签与类名统一用 `x-` 前缀(`<x-tabs>`、`.x-btn`)。

依据组件库技术方案(工程方案)与设计说明书(设计定稿)落地。

## 安装与引入

**A. CDN —— jsDelivr 直取 GitHub(当前分发方式,无需发 npm)**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/bosenger/x-proto-ui@v0.1.0/dist/x-ui.css">
<script src="https://cdn.jsdelivr.net/gh/bosenger/x-proto-ui@v0.1.0/dist/x-ui.js"></script>
```

- `@v0.1.0` 锁 tag,URL 不可变、长期缓存(升级换成新 tag 即可);测试可用 `@main`(可变,缓存约 12h,刷新走 `purge.jsdelivr.net/gh/...`),或 `@<commit>` 钉死某次提交。
- ⚠️ **jsDelivr 国内访问不稳定**;面向国内正式分发建议改用国内对象存储 + CDN(如阿里云 OSS+CDN,需备案)或 Gitee Pages,后续会补一个可同步的国内镜像。

**B. 本地内嵌(零网络,原型离线 / 内部用首选)**

把 `dist/` 拷进项目,两行本地引入,不依赖任何远端:

```html
<link rel="stylesheet" href="dist/x-ui.css">
<script src="dist/x-ui.js"></script>
```

**C. npm + 打包器(若日后发布到 npm)**

```bash
npm i x-proto-ui
```

```js
import 'x-proto-ui';        // 自执行,注册全部组件 + 初始化主题
import 'x-proto-ui/css';    // 样式(= dist/x-ui.css)
```

直接双击打开:

- [`gallery.html`](gallery.html) —— **全部 P0–P4 组件总览**,可切 **纸面/蓝图** 底纹与 **中性/蓝/青/紫** 主色,全库联动。
- [`demo.html`](demo.html) —— 范式验证最小示例(Button/Input/Tabs/Modal)。
- [`patterns/`](patterns/) —— 4 个真实中后台示例页(列表/表单/详情/仪表盘),互相链接演示 **R6 跨页平滑跳转**。

## 作者侧:开发与构建

```bash
npm install      # 仅一个 devDependency: esbuild
npm run build    # 源码 → dist/x-ui.js (IIFE) + dist/x-ui.esm.js (ESM) + dist/x-ui.css
npm run watch    # 监听重建
```

> 构建是「作者侧」的事;使用者拿到的 `dist` 仍是零构建、双击即用。

## 发布到 npm

### 手动发布

```bash
npm login --registry https://registry.npmjs.org/   # 仅首次
npm version patch        # 或 minor / major,会改 package.json 并打 tag
npm publish              # publishConfig 已锁定公共 registry + access public
```

### 自动发布(GitHub Actions)

> 当前走 jsDelivr/CDN 分发,**`v*` 标签只用于 CDN 版本化、不再自动发 npm**;`.github/workflows/publish.yml` 已改为**仅手动触发**(Actions 页 → Run workflow)。要恢复「推 v 标签即自动发布」,取消该文件 `on:` 里 `push.tags` 三行注释。

启用 npm 发布时:

1. 在 npm 生成一个 **Automation 令牌**(npmjs.com → Access Tokens),它能绕过 2FA OTP,专供 CI。
2. 在 GitHub 仓库 **Settings → Secrets and variables → Actions** 添加 secret:`NPM_TOKEN`。
3. 发版:`npm version patch` 改版本打 tag → 在 Actions 页手动 Run(或恢复 tag 自动触发后 `git push --follow-tags`)。

工作流会校验 **tag 与 package.json 版本一致**,并带 `--provenance`(供应链溯源,需公开仓库)。
若 x-ui 作为 monorepo 子目录推到 GitHub,把该文件移到仓库根 `.github/workflows/` 并按文件内 `# monorepo:` 注释改两处路径。

## 目录结构(技术方案 §7.1)

```
x-ui/
├─ tokens/            # L1+L2 CSS 变量(令牌 / 主题)
│  ├─ palette.css     #   L1 原始 token(间距/圆角/字号/动效/灰阶,主题无关)
│  └─ themes.css      #   L2 语义 token(纸面/蓝图 × 中性/蓝/青/紫,换肤开关)
├─ styles/            # L3 组件样式,每组件一个 .css
│  ├─ base.css        #   reset / 焦点环 / View Transitions / 关键帧
│  ├─ button.css  input.css  tabs.css  modal.css
├─ core/
│  ├─ x-element.js    # XElement 基类 + 批量注册器(全库唯一运行时,gzip ≈1.4KB)
│  └─ theme.js        # 主题持久化(localStorage,跨页保持)
├─ components/        # 每个交互组件一个 .js
│  ├─ x-tabs.js       #   轻交互范式
│  └─ x-modal.js      #   弹层范式(原生 <dialog>)
├─ src/               # 打包入口(index.js / index.css)
├─ build.mjs          # esbuild 合并脚本
└─ dist/              # 最终产物(使用者引入这个)
```

## 三层令牌

`L1 调色板/刻度` → `L2 语义(主题在此切换)` → `L3 组件(只消费语义层)`。组件**从不**直接引用原始值;换肤只改 `data-theme` / `data-brand` 两个根节点属性:

```js
xui.setTheme('dark');     // 纸面 light / 蓝图 dark
xui.setBrand('teal');     // neutral / blue / teal / violet
```

## 实现范式(三种,混合使用)

| 类型 | 实现 | 是否需 JS | 本期代表 |
| --- | --- | --- | --- |
| 纯展示型 | 纯 CSS 类 | 否 | `.x-btn` 按钮、`.x-input` 输入框 |
| 轻交互型 | Custom Element | 极薄 | `<x-tabs>` |
| 弹层型 | Custom Element + 原生 `<dialog>` / Popover | 极薄 | `<x-modal>` |

## 进度

- [x] **阶段一 地基**:三层令牌 + 纸面/蓝图 + 4 主色切换。
- [x] **阶段二 链路**:XElement 基类 + esbuild 构建 + 「源码 → 单文件 dist → 双击 demo」全链路。
- [x] **阶段三 范式验证**:纯 CSS / 轻交互 / 原生弹层 三种范式跑通。
- [x] **阶段四 铺量**:P0–P4 全部组件 + Patterns 4 个示例页落地。
- [~] **阶段五 完善**:响应式 + 焦点环 + reduced-motion 已内建;跨浏览器回归待手测。

### 组件清单(全部已实现)

| 档 | 组件 |
| --- | --- |
| **P0** | Button、Icon(约定)、Input、Select、Checkbox、Radio、Switch、Card、Badge、Tag、Avatar、Divider、Grid |
| **P1** | Tabs、Accordion、Dropdown、Modal、Drawer、Toast、Tooltip、Pagination、Breadcrumb、Steps |
| **P2** | Table、Progress、Skeleton、Empty、Tree、Timeline、Stat |
| **P3** | DatePicker、Upload、Form、Cascader |
| **P4** | Alert、InputNumber、Slider、Menu、Spin(其余 antd 对标件复用 P0–P2 组件) |

交互型(Custom Element):`x-tabs / x-accordion / x-dropdown / x-modal / x-drawer / x-select / x-pagination / x-datepicker / x-upload / x-cascader / x-input-number`;Toast 为命令式 `xui.toast()`;其余均纯 CSS。各组件规格见设计说明书。
