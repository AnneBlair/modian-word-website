# 技术 SEO 与性能 · 墨典单词

**更新日期**：2026-08-11
**托管**：GitHub Pages（`AnneBlair/modian-word-website`，自定义域名 `modian.aiyinyu.com`）
**技术栈**：纯 HTML + CSS + 原生 JS，无构建工具，零外部依赖

---

## 一、抓取与索引

### 1.1 已修复的致命问题

| 问题 | 修复 |
|---|---|
| 全站 canonical / og:url / sitemap / robots 指向 `anneblair.github.io/modian-word-website/`，而实际域名是 `modian.aiyinyu.com` | 全部替换为正式域名 |
| sitemap 只有 4 条 URL，`lastmod` 停留在 2026-05-01 | 重写为 13 条 + 更新日期 + hreflang 声明 |
| robots.txt 的 Sitemap 行指向错误域名 | 修正 |

**为什么这是 P0**：canonical 指向一个 301 跳转的 URL，等于向 Google 声明「正式版本在别处」。Search Console 会把这些页面归入「替代网页（有适当的规范标记）」而不予索引。在修复前，这个站几乎不可能获得任何自然流量。

### 1.2 robots.txt

已重写，包含三类声明：

- **通用**：`User-agent: * / Allow: /`
- **主流搜索引擎**：Googlebot、Googlebot-Image、Bingbot、Baiduspider、Applebot、DuckDuckBot、YandexBot
- **AI 爬虫显式放行**：Google-Extended、Applebot-Extended、GPTBot、OAI-SearchBot、ChatGPT-User、ClaudeBot、Claude-SearchBot、Claude-User、PerplexityBot、Perplexity-User、CCBot、meta-externalagent

> 显式列出 AI 爬虫在技术上是冗余的（默认即允许），但它明确表达了意图，也便于日后需要收紧时集中管理。**`Applebot-Extended` 尤其值得注意**——它影响 Apple 智能与 Siri 的内容使用，对一个 iOS App 的官网是相关的。

### 1.3 索引控制

| 页面 | robots meta |
|---|---|
| 全部内容页（13 个） | `index, follow, max-image-preview:large, max-snippet:-1` |
| `/404.html` | `noindex, follow` |

`max-image-preview:large` 允许 Google 在搜索结果中展示大图预览；`max-snippet:-1` 解除摘要长度限制——两者都对 AI 摘要与富摘要有利，且没有副作用。

### 1.4 校验结果

```
checked 14 HTML pages
✅ 每页 canonical 自指且与实际 URL 一致
✅ 0 处死链（全部内链可解析到实际文件）
✅ sitemap 中每条 URL 都有对应文件
✅ 每个可索引页都在 sitemap 中
✅ hreflang 双向互指完整
```

---

## 二、Core Web Vitals

### 2.1 LCP（Largest Contentful Paint）

**现状评估：良好，且本次进一步改善。**

- **首屏 LCP 元素是文字与内联 SVG**，不是图片。Hero 区的遗忘曲线是内联 SVG，随 HTML 一起到达，无额外请求。
- **无 Web Font**：全站使用系统字体栈（`-apple-system` / `BlinkMacSystemFont` / `PingFang SC` / `Songti SC` / `ui-monospace`）。没有字体下载 = 没有 FOIT/FOUT = 没有字体导致的 LCP 延迟。**这是原站做得最好的技术决策，予以保留。**
- **无外部资源**：没有 CDN、没有第三方脚本、没有分析代码。渲染路径上只有 1 个 CSS（44 KB）+ 1 个 JS（12 KB，位于 `</body>` 前）。
- **首屏无图片**，因此不需要 `fetchpriority="high"` 或 `<link rel="preload">`。**主动不加**——对非 LCP 图片加 preload 反而会挤占带宽。

### 2.2 CLS（Cumulative Layout Shift）

**现状：良好。**

- 所有 `<img>` 均带 `width` / `height` 属性，浏览器可预留空间。
- 本次为新生成的图片**重新计算了真实尺寸**而非沿用假设值——例如 `modian-vocabulary-libraries` 的实际尺寸是 1280×959（源图 626×469，非严格 4:3），已按真实值写入而不是取整成 960。这类 1px 误差虽小，但正是 CLS 的典型来源。
- 主题切换脚本是 `<head>` 中的内联同步脚本，在首次绘制前就设定 `data-theme`，**避免了深浅色闪烁造成的视觉跳动**。
- 滚动进度条使用 `position: fixed` + 独立图层，不参与文档流。
- 揭示动画（`.reveal`）只改变 `opacity` 与 `transform`，不触发布局。

**唯一潜在风险**：`.reveal` 元素初始 `opacity: 0`。若 JS 加载失败，这些内容将不可见。缓解措施已存在（`IntersectionObserver` 不可用时直接加 `.in` 类），但若 JS 完全未执行则仍会隐藏。**建议改进**（见 action-plan P2）：改用 `@media (scripting: none)` 或在 CSS 中默认可见、由 JS 主动添加隐藏类。

### 2.3 INP（Interaction to Next Paint）

**现状：良好。**

- 滚动监听已用 `requestAnimationFrame` 节流 + `{ passive: true }`。
- FAQ 手风琴是纯 class 切换，无布局抖动。
- 磁性按钮与光标聚光效果**仅在 `(hover: hover) and (pointer: fine)` 时启用**——移动端完全不绑定这些 mousemove 监听，这是很好的设计。
- 全部动效遵循 `prefers-reduced-motion: reduce`。

**注意**：`.btn-magnetic` 的 mousemove 处理器直接写 `style.transform`，没有 rAF 节流。在桌面端高频移动时可能产生少量长任务。当前影响很小（元素少、计算简单），但如果日后按钮数量增加，应加 rAF 包装。

---

## 三、图片优化（本次重点）

### 3.1 优化前的问题

| 文件 | 尺寸 | 体积 | 实际展示宽度 | 浪费倍数 |
|---|---|---|---|---|
| `screenshot-04.png` | 5464×4096 | 1.09 MB | 300 CSS px | **18×** |
| `screenshot-03.jpg` | 2732×2048 | 714 KB | 300 CSS px | 9× |
| `screenshot-06.jpg` | 2732×2048 | 501 KB | 300 CSS px | 9× |
| `app-icon.png` | 1024×1024 | 424 KB | 72 CSS px | **14×** |
| `screenshot-02.jpg` | 2732×2048 | 410 KB | 仅作 OG 图，页面上不展示 | — |

**图片总量 4.72 MB**，其中 9 张截图 4.16 MB。全部 `loading="lazy"`，所以不影响 LCP，但对移动数据用户是实打实的浪费，也是 Lighthouse「适当尺寸的图片」与「新一代格式」两项失分的来源。

### 3.2 优化方案与结果

```
每张截图 → 640w WebP + 1280w WebP + 1280w JPEG（兜底）
投放方式：<picture><source type="image/webp" srcset="… 640w, … 1280w" sizes="(max-width: 480px) 78vw, 300px"><img …></picture>
```

| 指标 | 优化前 | 优化后 |
|---|---|---|
| `assets/images/` 总量 | 4.72 MB | **1.31 MB**（−72%） |
| 移动端首页实际图片传输 | ~4 MB | **~100 KB**（8 张 640w WebP，且懒加载） |
| App 图标（72px 位） | 424 KB | 16 KB |
| OG 图片 | 410 KB / 2732×2048（比例 4:3，不符合 1.91:1） | 59 KB / 1200×630 |

`sizes` 属性经过实测校准：`.shot` 的 CSS 宽度是 `min(78vw, 300px)`，因此断点写为 `(max-width: 480px) 78vw, 300px`。**写错 `sizes` 会让浏览器选错档位，是响应式图片最常见的失误。**

### 3.3 语义化文件名

| 原文件名 | 新文件名 |
|---|---|
| `screenshot-01.webp` | `modian-vocabulary-libraries-{640,1280}.webp` |
| `screenshot-07.jpg` | `modian-ebbinghaus-review-{640,1280}.webp` |
| `screenshot-03.jpg` | `modian-study-modes-{640,1280}.webp` |
| `screenshot-05.jpg` | `modian-image-word-capture-{640,1280}.webp` |
| `screenshot-06.jpg` | `modian-reading-lookup-{640,1280}.webp` |
| `screenshot-08.jpg` | `modian-icloud-sync-{640,1280}.webp` |
| `screenshot-09.jpg` | `modian-memory-quiz-{640,1280}.webp` |
| `screenshot-02.jpg` | `modian-split-view-recite-{640,1280}.webp` |
| `screenshot-04.png` | `modian-dark-mode-{640,1280}.webp` |

**风险提示**：旧文件名已删除，对应 URL 将返回 404。因站点为新站、图片未进入 Google 图片索引，此风险可忽略。若日后发现外部热链，补一份同名副本即可。

### 3.4 OG 图片

新绘制两张 1200×630 品牌卡（中文 + 英文），内容为：品牌标识、主标题、副标题、遗忘曲线对比图、域名。

- 符合 Open Graph 推荐的 1.91:1 比例；
- 体积 59 KB / 53 KB，远低于各平台抓取上限；
- 带 `og:image:width` / `height` / `type` / `alt`；
- 英文版的图表说明文字已本地化为英文（首版误用了中文，已修正）。

---

## 四、字体与 CSS

| 项目 | 状态 |
|---|---|
| Web Font | **无**（系统字体栈），零下载、零 FOIT/FOUT |
| CSS 体积 | 44 KB → 本次新增约 200 行内容页样式，约 51 KB（未压缩） |
| CSS 阻塞 | 单个 `<link>`，渲染阻塞但体积可接受 |
| 内联 critical CSS | 未做 |
| `content-visibility` | 未使用 |

**关于 critical CSS**：在 51 KB 未压缩（GitHub Pages 会自动 gzip 到约 10 KB）的规模下，提取关键 CSS 的收益很小，却会引入维护负担（无构建工具的站点需要手动同步）。**建议不做**——这是典型的过度优化。

---

## 五、JavaScript

| 项目 | 状态 |
|---|---|
| 体积 | 12 KB，单文件，无框架 |
| 位置 | `</body>` 前，非阻塞 |
| 主题防闪烁脚本 | `<head>` 内联，必要且正确 |
| 错误 | 实测 8 个页面，**0 个控制台错误、0 个页面异常** |
| 降级 | `IntersectionObserver` 不可用时有回退路径 |

**建议**：给 `<script src="./assets/js/main.js">` 加 `defer`。当前它已在 body 末尾，效果接近，但加上 `defer` 语义更明确，且允许日后把脚本移到 `<head>` 而不改变行为。

---

## 六、托管平台约束（GitHub Pages）

这些是**无法通过修改代码解决**的限制，需要明确知晓：

| 能力 | GitHub Pages | 影响 | 缓解 |
|---|---|---|---|
| 自定义 `Cache-Control` | ❌ 不支持 | 静态资源缓存策略不可控（默认 10 分钟） | 文件名已含尺寸标识，可支持未来加 hash 做长缓存；若缓存成为瓶颈，考虑迁移到 Cloudflare Pages / Netlify |
| 服务端 301 重定向 | ❌ 不支持 | 无法做 URL 迁移重定向 | 保持 URL 稳定；必要时用 HTML `<meta refresh>` + canonical（次优） |
| Brotli 压缩 | ✅ 自动 | — | — |
| HTTP/2 | ✅ | — | — |
| 自定义 HTTP 头（HSTS、CSP） | ❌ | 无法加安全头 | 静态站风险有限；若需要，迁移到 Cloudflare Pages |
| 自定义 404 | ✅ 支持 `/404.html` | 已实现 | — |
| 服务端渲染 / 边缘函数 | ❌ | 无法做地理定向语言跳转 | **这反而是好事**——自动语言跳转对 SEO 有害，hreflang 才是正确方案 |

**结论**：GitHub Pages 对当前规模完全够用。唯一值得考虑迁移的理由是缓存控制，但在流量起来之前这不是瓶颈。**不建议现在迁移。**

---

## 七、上线后待办清单

按顺序执行：

1. **Google Search Console**
   - 添加并验证 `modian.aiyinyu.com` 资源（DNS TXT 验证）
   - 提交 `https://modian.aiyinyu.com/sitemap.xml`
   - 用「网址检查」对首页、支柱长文、FAQ 三个页面请求编入索引
   - 1 周后检查「网页」报告，确认没有「替代网页（有适当的规范标记）」——这是验证 canonical 修复生效的关键指标

2. **Bing Webmaster Tools**
   - 可直接从 GSC 导入
   - 提交 sitemap

3. **富媒体结果测试**：逐个跑 13 个 URL

4. **PageSpeed Insights**：跑首页 + 支柱长文，记录基线（移动端与桌面端）

5. **百度站长平台**（若面向国内用户）：提交站点与 sitemap

6. **不要做的事**
   - 不要提交到低质目录站或买外链
   - 不要为了「更新频率」而修改 `lastmod` ——虚假的 lastmod 会降低 Google 对 sitemap 的信任
