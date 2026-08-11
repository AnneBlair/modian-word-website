# 墨典单词官网 SEO 全量审计报告

- **审计对象**：https://modian.aiyinyu.com/（GitHub Pages 静态站，仓库 `AnneBlair/modian-word-website`）
- **审计日期**：2026-08-11
- **审计范围**：站点结构、HTML、内容、Schema、性能、国际化、图片、AI 搜索（GEO）、ASO、竞品
- **本次已直接修改的文件**：见文末「变更清单」

> **一句话结论**：站点在本次审计前存在一个**致命级问题**——所有 canonical、Open Graph URL、sitemap 与 robots 指向的都是旧的 `anneblair.github.io/modian-word-website/`，而实际域名是 `modian.aiyinyu.com`。这等于主动告诉 Google「请索引另一个域名」，几乎会让全站的自然流量归零。该问题已修复。除此之外，站点原本只有 4 个页面、无结构化数据体系、无博客、无内链层次、图片总量 4.7 MB，抓取与内容覆盖都严重不足。

---

## 0. 审计结论速览

| 维度 | 审计前 | 审计后 | 状态 |
|---|---|---|---|
| Canonical / OG / sitemap 域名 | ❌ 全部指向 github.io | ✅ 全部指向 modian.aiyinyu.com | 已修复 |
| 页面总数（可索引） | 4 | 13 | 已扩充 |
| 结构化数据类型 | 1（MobileApplication） | 10（见 schema.md） | 已补齐 |
| FAQ 结构化数据 | ❌ 无 | ✅ FAQPage（中英各一） | 已补齐 |
| H2/H3 层级 | ❌ FAQ 页只有 1 个 H1，问题不是标题 | ✅ 全站层级合规，无跳级 | 已修复 |
| 图片总量 | 4.72 MB | 1.31 MB | −72% |
| OG 图片 | 2732×2048 截图（410 KB，比例错误） | 1200×630 品牌卡（59 KB） | 已重做 |
| hreflang | ❌ 无 | ✅ zh-Hans / en / x-default 双向互指 | 已补齐 |
| RSS / feed | ❌ 无 | ✅ /feed.xml | 已补齐 |
| 404 页 | ❌ 无（GitHub Pages 默认页） | ✅ 自定义 404 + noindex | 已补齐 |
| llms.txt（AI 检索） | ❌ 无 | ✅ /llms.txt | 已补齐 |
| 博客 / 内容中心 | ❌ 无 | ✅ /blog/ + 3 篇种子文章 | 已补齐 |
| 术语表（实体锚点） | ❌ 无 | ✅ /glossary.html（24 词条 + DefinedTermSet） | 已补齐 |
| 支柱长文 | ❌ 无 | ✅ 艾宾浩斯遗忘曲线完全指南 | 已补齐 |

---

## 一、网站结构审计

### 1.1 致命问题：Canonical 指向错误域名（已修复）

审计前，全部 4 个页面的 `<link rel="canonical">`、`og:url`、`twitter` 图片地址、`sitemap.xml` 中的 `<loc>` 以及 `robots.txt` 的 `Sitemap:` 行，都写的是：

```
https://anneblair.github.io/modian-word-website/
```

而仓库根目录的 `CNAME` 文件内容是 `modian.aiyinyu.com`。GitHub Pages 在配置自定义域名后，会把 `*.github.io` 的请求 301 到自定义域名。**结果是 canonical 指向了一个 301 跳转目标**，属于 Google Search Console 会直接报 “Alternate page with proper canonical tag / 重定向错误” 的情形。

- **影响**：全站页面可能不进入索引，或索引到错误 URL；所有外链权重被指向一个跳转域名；社交分享抓取到的也是旧域名。
- **严重级别**：P0（此前站点几乎不可能获得任何自然流量）
- **已修复**：全站 URL 统一替换为 `https://modian.aiyinyu.com/`。

### 1.2 基础文件检查

| 项目 | 审计前 | 处理 |
|---|---|---|
| `robots.txt` | 存在但只有 3 行，Sitemap 指向错误域名 | ✅ 重写：显式允许主流搜索引擎与 AI 爬虫，修正 Sitemap |
| `sitemap.xml` | 4 条 URL，域名错误，`lastmod` 是 2026-05-01（过期） | ✅ 重写：13 条 URL，含 `xhtml:link` hreflang 声明 |
| `site.webmanifest` | 引用了已不存在的 icon 文件名，缺 `id` / `scope` | ✅ 重写 |
| `favicon` | ✅ 存在（64×64 PNG） | 保留；建议补 SVG favicon（见 action-plan P2） |
| `apple-touch-icon` | ✅ 存在（180×180） | 保留 |
| RSS / feed | ❌ 缺失 | ✅ 新建 `/feed.xml`，并在各页 `<link rel="alternate">` 声明 |
| 404 页 | ❌ 缺失 | ✅ 新建 `/404.html`（`noindex, follow`） |
| `llms.txt` | ❌ 缺失 | ✅ 新建（见 geo-optimization.md） |

### 1.3 站点结构（审计后）

```
/                                        首页（zh-Hans）
├── /download.html                       下载与价格
├── /guide/ebbinghaus-forgetting-curve.html   支柱长文
├── /glossary.html                       术语表（24 词条）
├── /faq.html                            常见问题（28 问，7 组）
├── /blog/                               内容中心
│   ├── how-many-words-per-day.html
│   ├── why-you-forget-words.html
│   └── offline-vocabulary-learning.html
├── /en/                                 English overview
│   └── /en/faq.html                     English FAQ
├── /support.html
├── /privacy.html
├── /404.html                            noindex
├── /feed.xml  /sitemap.xml  /robots.txt  /llms.txt
```

**抓取深度**：所有页面距首页 ≤ 2 跳。导航与页脚在全部页面统一，形成稳定的内链骨架。

---

## 二、HTML 审计

### 2.1 标题层级

| 页面 | 审计前 | 审计后 |
|---|---|---|
| `index.html` | ✅ 1×H1，H2/H3 合理 | 保持，新增 1 个功能卡 H3 |
| `faq.html` | ❌ **只有 1 个 H1，9 个问题全部是 `<button>`，没有任何 H2/H3** | ✅ 7 个 H2（分组）+ 28 个 H3（问题），`<h3><button>` 嵌套模式 |
| `support.html` | ✅ H1 + H2 + H3 | 保持 |
| `privacy.html` | ✅ H1 + H2 | 保持 |

FAQ 页原本的问题文本对搜索引擎而言只是按钮标签，**没有任何标题语义**——这是内容型 FAQ 页最常见也最可惜的失误。修复后每个问题都是可被抓取、可被 AI 摘录的 H3。

**自动化校验结果**（`docs/seo/` 附带的检查逻辑，13 个可索引页 + 404）：

```
checked 14 HTML pages
✅ 每页恰好 1 个 H1
✅ 无空标题
✅ 无标题层级跳跃（h2 → h4 之类）
✅ 无重复 meta description
✅ 全部 img 带 alt
✅ 全部内链可解析（0 死链）
✅ hreflang 双向互指完整，含 x-default
✅ sitemap 与实际文件一一对应
```

### 2.2 Title / Description

| 页面 | 审计前 Title | 问题 | 审计后 |
|---|---|---|---|
| 首页 | `墨典单词 - 依艾宾浩斯遗忘曲线，在你忘记之前复习 \| iPhone & iPad` | 缺核心搜索词「离线」「背单词 App」；偏品牌叙事 | `墨典单词 - 离线背单词 App｜按艾宾浩斯遗忘曲线复习` |
| FAQ | `常见问题 FAQ - 墨典单词` | 过短（12 字），无任何差异化信息 | `常见问题 - 墨典单词｜离线背单词 App 使用答疑` |
| 支持 | `用户支持 - 墨典单词` | 可接受 | 保留 |
| 隐私 | `隐私政策 - 墨典单词` | 可接受 | 保留 |

首页 description 原为 138 个中文字符，Google 中文摘要通常在 ~120 字截断，尾部的「iPhone 与 iPad 通用」会被切掉。已压缩到 ~95 字，并把「离线」提前。

### 2.3 语义与可访问性修正

- `<header class="page-header" role="banner">` → `<div class="page-header">`：`role="banner"` 在页面中只应出现一次且属于站点级页头，此处误用；同时 `<header>` 位于 `<main>` 之外又不含导航，语义不成立。
- 移除冗余 ARIA：`<nav role="navigation">`、`<footer role="contentinfo">`——原生元素已隐含这些 role，重复声明是 W3C 明确不推荐的写法。
- 页脚链接组由 `<div>` 升级为带 `aria-label` 的 `<nav>`。
- 分享按钮补 `aria-describedby` 指向状态提示区。

### 2.4 Anchor Text

审计前页脚使用「App Store」「联系我们」等泛化锚文本，导航为「下载」。已改为语义明确的锚文本：

- 「下载」→「下载墨典单词」
- 「常见问题」→ 保留（页面主题即为此）
- 新增描述性内链锚文本，例如「艾宾浩斯遗忘曲线完全指南」「背单词术语表」——这些同时是目标关键词。

---

## 三、内容 SEO 审计

### 3.1 审计前的覆盖缺口

原站 4 个页面全部是**产品叙述型**内容，没有任何**信息型**内容。这意味着：

- 只能命中品牌词（「墨典单词」）和极少量产品词；
- 无法命中占搜索量 90% 以上的信息型长尾（「艾宾浩斯遗忘曲线怎么用」「每天背多少单词」「背了就忘怎么办」）；
- 没有可被 AI 搜索引用的知识性内容。

同时，产品定位中的几个核心卖点在页面上**几乎没有文字承载**：

| 定位要点 | 审计前站内覆盖 | 处理 |
|---|---|---|
| 离线词典 / 无网络可学习 | 仅 1 张卡片 + 1 个 trust badge，正文未展开 | ✅ Hero 正文、功能卡改写、FAQ 独立分组（3 问）、专文一篇 |
| 发音 | ❌ 完全没有提及 | ✅ 新增功能卡「发音与四种记忆检测」、FAQ 2 问、术语表音标词条 |
| 真题词汇 / 考试词库 | 有词库网格，但无文字说明 | ✅ FAQ 词库分组（4 问）、术语表「考试词库」词条、下载页说明 |
| 长期记忆 | 有曲线可视化，无文字论证 | ✅ 支柱长文 + 3 篇博客 |
| 学习效率 | 有 360% 数字，无解释 | ✅ 长文解释来源与边界（见「诚实性」一节） |

### 3.2 审计后的关键词覆盖

自然覆盖（非堆砌）的核心词族：

- **离线族**：离线背单词、离线英语词典、没网络背单词、飞行模式学习、本地词库
- **方法族**：艾宾浩斯遗忘曲线、间隔重复、主动回忆、复习节点、记忆留存率
- **考试族**：四级 / 六级 / 考研英语 / 托福 / 雅思 / GRE / 中考 / 高考 单词
- **问题族**：背了就忘、每天背多少、坚持不下来、复习漏了怎么办
- **英文族**：offline vocabulary app、spaced repetition、Ebbinghaus forgetting curve、vocabulary builder、offline English dictionary

完整关键词地图见 `keyword-research.md`。

### 3.3 内容诚实性（E-E-A-T）

审计中发现两处需要谨慎处理的表述，**均已在新内容中标注边界**，而非放大：

1. **「不复习只记得 5 个，坚持复习记得 18 个 / 记忆留存提升 360%」**
   首页将其标注为「App 内实测」。新增的支柱长文**没有**把它当作科学结论引用，`llms.txt` 中也明确注明这是产品内的示例性对比而非同行评议研究结果。这样做是为了避免 AI 搜索把它当作可引用的研究数据传播。

2. **「第 1、2、4、7、15 天」复习表**
   这是间隔重复的常见实践方案，**不是艾宾浩斯 1885 年论文的内容**。长文中用独立段落说明了这一点，并交代了 Leitner 系统与 SM-2 的谱系关系。对比之下，中文互联网上大量内容把这张表直接归给艾宾浩斯——主动澄清反而构成了差异化的内容价值和 E-E-A-T 信号。

3. **未添加 AggregateRating / Review 结构化数据**
   这是**有意为之**。我无法在本次环境中访问 App Store 核实真实评分与评分数量，而 Google 对虚构评分标记有明确的人工处罚政策。补充方式见 `schema.md`「待补充」一节——拿到真实数据后填入即可。

---

## 四、Schema.org 审计

审计前：仅首页一个 `MobileApplication` 节点，无 `@id`、无实体互链、`sameAs` 只有 App Store 链接。

审计后：以 `@graph` 组织的实体图谱，跨页面通过 `@id` 互相引用。完整清单、代码与校验方式见 **`schema.md`**。

| 类型 | 状态 | 位置 |
|---|---|---|
| Organization | ✅ 新增 | 首页（全站通过 `@id` 引用） |
| WebSite | ✅ 新增 | 首页 |
| WebPage | ✅ 新增 | 首页、下载、隐私 |
| SoftwareApplication + MobileApplication | ✅ 重写（含 featureList、screenshot、offers） | 首页 |
| FAQPage | ✅ 新增 | `/faq.html`（28 问）、`/en/faq.html`（12 问） |
| BreadcrumbList | ✅ 新增 | 全部内页 |
| Article | ✅ 新增 | 支柱长文 |
| BlogPosting | ✅ 新增 | 3 篇博客 |
| Blog + ItemList | ✅ 新增 | `/blog/` |
| DefinedTermSet + DefinedTerm | ✅ 新增 | `/glossary.html`（24 词条） |
| ContactPage | ✅ 新增 | `/support.html` |
| **SearchAction** | ⚠️ **有意省略** | 站内无搜索功能，声明 SearchAction 属于虚假标记 |
| **AggregateRating / Review** | ⚠️ **待真实数据** | 见 schema.md |

---

## 五、性能与 Core Web Vitals

详见 **`technical-seo.md`**。要点：

- **图片是唯一的重量级问题，已解决**：9 张截图原始总量 4.16 MB（单张最大 `screenshot-04.png` 为 5464×4096、1.09 MB），而实际展示宽度只有 300 CSS px。已全部重编码为 640/1280 双尺寸 WebP + JPEG 兜底，通过 `<picture>` + `srcset` + `sizes` 投放。**移动端首屏实际图片负载从约 4 MB 降至约 100 KB**（且全部 `loading="lazy"`）。
- **字体零风险**：全站使用系统字体栈（`-apple-system` / `PingFang SC` / `Songti SC`），无 Web Font 下载，无 FOIT/FOUT，无 `font-display` 隐患。这是原站做得很好的一点，予以保留。
- **零外部依赖**：无 CDN、无第三方脚本、无分析代码。LCP 与 INP 的外部阻塞因素为零。
- **CLS**：所有 `<img>` 均带 `width`/`height`（本次为新图重新计算了真实尺寸，`vocabulary-libraries` 为 1280×959 而非 960，已按实际值写入）。
- **LCP 元素**：首屏为纯文字 + 内联 SVG 曲线，无需图片预加载。
- **JS**：单文件 12 KB，无框架，滚动监听已用 `requestAnimationFrame` + `passive` 节流，动效全部遵循 `prefers-reduced-motion`。

**未做且需说明**：GitHub Pages 无法自定义 `Cache-Control`、无法配置 Brotli 之外的压缩策略、无法做服务端重定向。这是托管平台的硬约束，缓解方案见 `technical-seo.md`「托管约束」一节。

---

## 六、国际化审计

审计前：**完全没有 hreflang**，站点仅有中文。

审计后：

- 建立 `zh-Hans` / `en` / `x-default` 三值集群，覆盖首页与 FAQ 两组对照页；
- 所有 hreflang **双向互指**并包含 `x-default`（已自动校验通过）；
- `sitemap.xml` 中同步声明 `xhtml:link` 备用语言；
- 语言切换入口放在导航右侧（`EN` / `中文`），且带 `hreflang`、`lang` 属性；
- **`hreflang` 使用 `zh-Hans` 而非 `zh-CN`**：前者是脚本代码，覆盖所有简中地区，比国家代码更适合本站场景。

**重要的诚实性决策**：英文页明确标注「本 App 面向中文母语学习者，单词释义为中文」。这会降低英文页的转化率，但避免了把不匹配的用户导入 App Store 后产生差评——**差评对 ASO 的伤害远大于多几次下载的收益**。同理，`download.html` 原本被赋予了 `hreflang="en" → /en/` 的声明，但 `/en/` 并不回指它，构成无效集群，已移除该声明。

---

## 七、图片 SEO 审计

| 项目 | 审计前 | 审计后 |
|---|---|---|
| 文件名 | `screenshot-01.webp` … `screenshot-09.jpg`（零语义） | `modian-ebbinghaus-review-1280.webp` 等语义化命名 |
| Alt | 存在但笼统（「墨典单词 · 海量词汇资源」） | 逐张核对实际画面后重写，描述具体界面内容 |
| 尺寸投放 | 单一超大原图 | `<picture>` + WebP/JPEG + 640/1280 `srcset` + `sizes` |
| `decoding` | ❌ 无 | ✅ `decoding="async"` |
| OG 图片 | `screenshot-02.jpg`（2732×2048，比例 4:3，410 KB，且该图未在页面任何位置展示） | ✅ 专门绘制的 1200×630 品牌卡（59 KB），中英各一张 |
| 未使用资源 | `screenshot-02` 仅作 OG；`app-icon.png` 1024×1024 / 424 KB 仅用于 72px 展示位 | ✅ `screenshot-02` 已作为「iPad 分屏背诵」正式展示；图标改用 192px 版本（16 KB） |

**Alt 文案的核对方式**：逐张打开截图确认画面内容后撰写，例如 `screenshot-04` 原 alt 为「护眼夜间模式，夜间舒适阅读」，实际画面是深色模式下的 ISSUE 反馈列表，已改为「深色护眼模式下的界面，夜间背单词时降低屏幕亮度刺激」——描述真实可见的内容，而不是想当然的功能名。

---

## 八、AI 搜索优化（GEO）

详见 **`geo-optimization.md`**。核心动作：

1. **答案前置**：支柱长文、博客文章、英文页均以 `.key-answer` 区块开头，用一段自足的文字回答页面主问题——这是 LLM 摘录时最常抓取的结构。
2. **FAQPage 结构化数据**：Google 已在 2023 年收窄 FAQ 富媒体结果的展示范围，但该标记对 **Bing、Perplexity、ChatGPT Search 的检索与引用仍然有效**，且成本极低。
3. **术语表 + DefinedTermSet**：为「间隔重复」「主动回忆」「合意困难」等实体建立可被引用的定义锚点，每个词条带稳定 `#id`。
4. **实体关系**：JSON-LD 中通过 `about`、`mentions`、`sameAs`（指向维基百科条目）把产品与「艾宾浩斯遗忘曲线」「间隔重复」两个已知实体关联。
5. **`llms.txt`**：按 llmstxt.org 规范提供结构化事实清单，并**显式写出引用注意事项**（哪些数字是产品示例而非研究结论）。
6. **robots.txt 显式放行 AI 爬虫**：GPTBot、OAI-SearchBot、ClaudeBot、Claude-SearchBot、PerplexityBot、Google-Extended、Applebot-Extended 等。

---

## 九、ASO

详见 **`aso-report.md`**（含中国区 / 美国区 / 日本区的分别建议、30/30/100 字段草案、截图文案与评分引导策略）。

**关键限制说明**：本次执行环境的网络出口被限制，无法访问 `apps.apple.com` 核实当前的 App 名称、副标题、关键词、评分与截图。因此 ASO 报告中的现状部分基于：仓库内记录的 App 全名「墨典单词 - 高效学英语锁屏背单词的必备神器」、App Store 链接（id1373544809）、以及 9 张 App Store 规格截图的实际画面。**所有建议在实施前请对照 App Store Connect 的当前实际值**。

---

## 十、竞争分析

详见 **`competitors.md`**（墨墨背单词、百词斩、不背单词、欧路词典、扇贝、Anki、Google Dictionary、Oxford、Cambridge）。

---

## 变更清单

### 修改的文件

| 文件 | 变更摘要 |
|---|---|
| `index.html` | 域名修正、Title/Description 重写、hreflang、`@graph` 结构化数据、`<picture>` 响应式图片、新增功能卡与内链段落、导航与页脚重构、Smart App Banner |
| `faq.html` | 完全重写：9 问 → 28 问分 7 组、H2/H3 语义化、FAQPage 结构化数据、面包屑、相关阅读 |
| `support.html` | 域名修正、hreflang、ContactPage + Breadcrumb 结构化数据、面包屑、导航/页脚重构、ARIA 修正 |
| `privacy.html` | 同上（WebPage + Breadcrumb） |
| `robots.txt` | 重写：主流搜索引擎 + AI 爬虫显式放行，修正 Sitemap 地址 |
| `sitemap.xml` | 重写：13 条 URL + hreflang 声明 + 更新 lastmod |
| `site.webmanifest` | 重写：修正失效图标引用，补 `id` / `scope` / `categories` |
| `assets/css/styles.css` | 新增内容页组件样式（面包屑、prose、术语表、博客卡、下载页、TOC、callout、语言切换等）约 200 行 |
| `README.md` | 域名修正 |

### 新增的文件

| 文件 | 说明 |
|---|---|
| `download.html` | 下载与价格页 |
| `guide/ebbinghaus-forgetting-curve.html` | 支柱长文（约 3400 字） |
| `glossary.html` | 术语表，24 词条 + DefinedTermSet |
| `blog/index.html` | 内容中心 |
| `blog/how-many-words-per-day.html` | 博客文章 |
| `blog/why-you-forget-words.html` | 博客文章 |
| `blog/offline-vocabulary-learning.html` | 博客文章 |
| `en/index.html` | English overview |
| `en/faq.html` | English FAQ（12 问） |
| `404.html` | 自定义 404（noindex） |
| `feed.xml` | RSS 2.0 |
| `llms.txt` | AI 检索事实清单 |
| `assets/images/modian-*.webp / .jpg / .png` | 27 个优化后的图片资源 |
| `docs/seo/*.md` | 本套文档 |

### 删除的文件

`assets/images/screenshot-0[1-9].*`、`app-icon.png`、`icon-192.png`、`icon-512.png` —— 已被语义化命名的优化版本取代。**注意**：旧图片 URL 将返回 404。因站点为新站、图片未进入 Google 图片索引，此风险可忽略；若日后发现有外部站点热链旧文件名，可再补一份同名副本。

---

## 下一步

优先级排序、预计收益、实施成本与风险评估见 **`action-plan.md`**，其中包含未来 6 个月的 SEO + ASO 执行路线图。
