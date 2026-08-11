# 结构化数据（Schema.org）· 墨典单词

**更新日期**：2026-08-11
**格式**：JSON-LD（Google 推荐格式）
**组织方式**：`@graph` + 跨页 `@id` 引用

---

## 一、设计原则

原站只有一个孤立的 `MobileApplication` 节点。重做时遵循三条原则：

1. **实体图谱而非孤立标记。** 用稳定的 `@id`（如 `https://modian.aiyinyu.com/#organization`）在页面之间互相引用，让搜索引擎把「墨典单词这个组织」「墨典单词这个 App」「官网这个站点」理解成互相关联的实体，而不是每页各说各话。
2. **标记的内容必须在页面上可见。** 这是 Google 结构化数据政策的硬性要求。FAQPage 里的每一条问答都与 `/faq.html` 上的可见文本逐字对应。
3. **宁缺毋滥。** 不为了「类型多」而添加无法兑现或无法核实的标记——违规标记的代价是人工处罚，远高于收益。

---

## 二、实体图谱

```
Organization  (#organization) ──┬── publisher of ── WebSite (#website)
                                ├── publisher of ── Article / BlogPosting
                                ├── publisher of ── DefinedTermSet
                                └── author/publisher of ── SoftwareApplication (#app)

WebSite (#website) ──── isPartOf ──── 每个 WebPage / FAQPage / Blog

SoftwareApplication + MobileApplication (#app)
   ├── offers ── Offer (¥30 CNY, InStock)
   ├── featureList[9]
   ├── screenshot[3]
   └── 被各页 about 引用

BreadcrumbList  每个内页一份
```

---

## 三、已实现清单

| 类型 | 页面 | `@id` | 说明 |
|---|---|---|---|
| `Organization` | `/` | `#organization` | logo、email、sameAs → App Store |
| `WebSite` | `/` | `#website` | 全站根实体 |
| `WebPage` | `/`、`/download.html`、`/privacy.html`、`/en/` | `#webpage` | 带 `primaryImageOfPage` |
| `SoftwareApplication` + `MobileApplication` | `/` | `#app` | 双类型数组，含 `featureList`、`offers`、`screenshot`、`isAccessibleForFree: false` |
| `FAQPage` | `/faq.html` | `#faq` | 28 组 Question / Answer |
| `FAQPage` | `/en/faq.html` | `#faq` | 12 组，`inLanguage: en` |
| `BreadcrumbList` | 全部内页（10 页） | `#breadcrumb` | 2–3 级 |
| `Article` | `/guide/ebbinghaus-forgetting-curve.html` | `#article` | 含 `about` / `mentions` → 维基百科实体 |
| `BlogPosting` | 3 篇博客 | `#article` | `articleSection`、`isPartOf` → Blog |
| `Blog` | `/blog/` | `#blog` | |
| `ItemList` | `/blog/` | `#list` | 文章列表，降序 |
| `DefinedTermSet` + `DefinedTerm` | `/glossary.html` | `#glossary` + 24 个词条 `@id` | 每个词条有独立锚点 |
| `ContactPage` | `/support.html` | `#webpage` | |

**类型总数：13**（原为 1）

---

## 四、关键代码片段

### 4.1 首页 `@graph` 骨架

```jsonc
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://modian.aiyinyu.com/#organization", … },
    { "@type": "WebSite",      "@id": "https://modian.aiyinyu.com/#website",
      "publisher": { "@id": "https://modian.aiyinyu.com/#organization" } },
    { "@type": "WebPage",      "@id": "https://modian.aiyinyu.com/#webpage",
      "isPartOf": { "@id": "https://modian.aiyinyu.com/#website" },
      "about":    { "@id": "https://modian.aiyinyu.com/#app" } },
    { "@type": ["SoftwareApplication", "MobileApplication"],
      "@id": "https://modian.aiyinyu.com/#app",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "iOS 13.0 或更高版本, iPadOS 13.0 或更高版本",
      "isAccessibleForFree": false,
      "offers": { "@type": "Offer", "price": "30", "priceCurrency": "CNY",
                  "availability": "https://schema.org/InStock" },
      "featureList": [ … 9 项 … ] }
  ]
}
```

> **注意 `operatingSystem` 中的版本号是占位值**。请对照 App Store Connect 的实际最低系统版本修改；如果不确定，改为 `"iOS, iPadOS"` 更安全。

### 4.2 内页引用首页实体

内页不重复定义 Organization / WebSite，只用 `@id` 引用：

```jsonc
{
  "@type": "FAQPage",
  "isPartOf": { "@id": "https://modian.aiyinyu.com/#website" },
  "about":    { "@id": "https://modian.aiyinyu.com/#app" }
}
```

这样即使某页被单独抓取，也能通过 `@id` 关联到主实体。

### 4.3 实体消歧（AI 搜索关键）

支柱长文通过 `about` / `mentions` 把内容锚定到已知实体：

```jsonc
"about": [
  { "@type": "Thing", "name": "艾宾浩斯遗忘曲线",
    "sameAs": "https://zh.wikipedia.org/wiki/遗忘曲线" },
  { "@type": "Thing", "name": "间隔重复",
    "sameAs": "https://zh.wikipedia.org/wiki/間隔重複" }
],
"mentions": [
  { "@type": "Person", "name": "赫尔曼·艾宾浩斯",
    "sameAs": "https://zh.wikipedia.org/wiki/赫尔曼·艾宾浩斯" }
]
```

`sameAs` 指向维基百科是让搜索引擎与 LLM 确认「你说的是哪个艾宾浩斯」的标准做法。

---

## 五、有意未添加的标记

这一节和「已实现」同样重要。

### 5.1 `SearchAction`（potentialAction）— 不添加

`WebSite` 上的 `SearchAction` 声明站点具有搜索功能，Google 会据此尝试展示 Sitelinks Search Box。**本站没有站内搜索功能**，声明它属于虚假标记。

**何时可以加**：如果日后为博客/术语表加上站内搜索（纯前端的 JSON 索引即可实现），届时同步添加：

```jsonc
"potentialAction": {
  "@type": "SearchAction",
  "target": { "@type": "EntryPoint",
              "urlTemplate": "https://modian.aiyinyu.com/search.html?q={search_term_string}" },
  "query-input": "required name=search_term_string"
}
```

### 5.2 `AggregateRating` / `Review` — 暂缺，需真实数据

**这是当前最有价值的缺口。** App Store 评分若能标记出来，会在搜索结果中显示星级，显著提升点击率。

未添加的原因：本次审计的执行环境无法访问 `apps.apple.com` 核实真实评分与评分数量。**Google 对虚构或不可核实的评分标记有明确的人工处罚政策**，风险远大于收益。

**补充方法**：从 App Store Connect 取到真实数据后，在首页 `#app` 节点中加入：

```jsonc
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.8",        // ← 换成真实平均分
  "reviewCount": "1234",       // ← 换成真实评价数
  "bestRating": "5",
  "worstRating": "1"
}
```

**三条硬性要求**：
1. 数值必须真实，且与 App Store 上可核实的数字一致；
2. **评分必须在页面上以可见形式呈现**（例如首页加一行「App Store 评分 4.8 / 5，来自 1,234 位用户」）——只写在 JSON-LD 里不显示，同样违规；
3. 数值变化后要同步更新，不能长期滞留旧数据。

如果决定引用真实用户评价（`Review`），同样必须是真实、可追溯的评价原文，且需获得授权。**不要编造好评。**

### 5.3 `HowTo` — 暂不添加

Google 已于 2023 年基本停止展示 HowTo 富媒体结果（桌面端也已移除）。支柱长文与博客中的步骤内容用普通有序列表呈现即可，对 AI 搜索的可读性并不逊色。

### 5.4 `Course` / `LearningResource` — 不适用

本产品是工具类 App，不是课程。误用会造成实体类型混淆。

### 5.5 `VideoObject` — 待有视频后添加

若日后制作 App 演示视频（也是 App Store Preview Video 的复用），可在下载页添加 `VideoObject`，这是目前少数仍能稳定获得富媒体展示的类型之一。

---

## 六、校验方法

### 自动校验（已执行）

本次已用脚本校验全部 14 个 HTML 页面的 JSON-LD：

```
✅ 所有 JSON-LD 区块均为合法 JSON（无语法错误）
✅ 所有节点均带 @type
✅ 无重复 meta description
✅ 所有 hreflang 双向互指且含 x-default
```

### 上线后必须做的人工校验

| 工具 | 地址 | 检查什么 |
|---|---|---|
| Google 富媒体结果测试 | https://search.google.com/test/rich-results | 是否被识别为有效类型，有无警告 |
| Schema Markup Validator | https://validator.schema.org/ | 语法与词汇表合规性 |
| Google Search Console → 增强功能 | GSC 后台 | 上线 1–2 周后看实际识别情况与错误报告 |
| Bing Webmaster Tools → 站点扫描 | Bing 后台 | Bing 对 FAQPage 的识别 |

**建议顺序**：先用富媒体结果测试逐页跑一遍（13 个 URL），修完警告再提交 sitemap。

---

## 七、维护规则

1. **新增博客文章**必须带 `BlogPosting` + `BreadcrumbList`，并加入 `/blog/` 的 `ItemList`、`sitemap.xml`、`feed.xml`。
2. **价格变动**时同步更新 `#app` 节点的 `offers.price` 与下载页可见文案——两者不一致会触发 Google 的价格不匹配警告。
3. **`@id` 一旦确定不要修改**，它是实体的稳定标识；改了等于换了一个实体。
4. **新增术语**时同步更新 `DefinedTermSet.hasDefinedTerm` 数组与页面锚点。
5. 每次结构化数据改动后，重跑一次 JSON 合法性检查（可复用本次的校验脚本逻辑）。
