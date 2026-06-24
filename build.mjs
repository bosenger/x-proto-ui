// ============================================================
// x-ui · 构建脚本 —— 作者侧用 esbuild 合并产物
// 输出：dist/x-ui.js（IIFE 单文件） + dist/x-ui.css（合并样式）
// 使用者拿到的 dist 仍是零构建、双击即用。
//   node build.mjs           一次构建
//   node build.mjs --watch   监听重建
// ============================================================
import * as esbuild from 'esbuild';
import { mkdir } from 'node:fs/promises';

await mkdir('dist', { recursive: true });

const banner = { js: '/* x-proto-ui v0.1.0 — 零运行时 Web Components UI 库 · MIT */' };
const common = { entryPoints: ['src/index.js'], bundle: true, minify: true, target: ['es2022'], legalComments: 'none', banner };

// IIFE：<script src> / CDN / 双击即用，自执行注册全部组件
const jsOpts = { ...common, format: 'iife', outfile: 'dist/x-ui.js' };
// ESM：bundler 用户 `import 'x-proto-ui'`
const esmOpts = { ...common, format: 'esm', outfile: 'dist/x-ui.esm.js' };

const cssOpts = {
  entryPoints: ['src/index.css'],
  bundle: true,
  outfile: 'dist/x-ui.css',
  minify: true,
  loader: { '.css': 'css' },
};

if (process.argv.includes('--watch')) {
  const ctxs = await Promise.all([jsOpts, esmOpts, cssOpts].map((o) => esbuild.context(o)));
  await Promise.all(ctxs.map((c) => c.watch()));
  console.log('👀 x-proto-ui watching… (Ctrl+C 退出)');
} else {
  await Promise.all([jsOpts, esmOpts, cssOpts].map((o) => esbuild.build(o)));
  console.log('✓ x-proto-ui built → dist/x-ui.js + dist/x-ui.esm.js + dist/x-ui.css');
}
