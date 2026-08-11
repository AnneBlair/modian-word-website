# 墨典单词官网

这是「**墨典单词**」iOS/iPadOS App 的官方网站，基于 **GitHub Pages Project Site** 构建，使用纯 HTML + CSS + 少量 JS，无需构建工具，原生可运行。

## 🌐 最终访问地址

**https://modian.aiyinyu.com/**

## 📁 目录结构

```text
/
  index.html                    # 首页
  download.html                 # 下载与价格
  glossary.html                 # 背单词术语表（24 词条）
  faq.html                      # 常见问题（28 问）
  support.html                  # 用户支持
  privacy.html                  # 隐私政策
  404.html                      # 自定义 404（noindex）
  guide/
    ebbinghaus-forgetting-curve.html   # 支柱长文：艾宾浩斯遗忘曲线完全指南
  blog/
    index.html                  # 内容中心
    how-many-words-per-day.html
    why-you-forget-words.html
    offline-vocabulary-learning.html
  en/
    index.html                  # English overview
    faq.html                    # English FAQ
  assets/
    css/styles.css              # 样式（移动端优先，支持深色模式）
    js/main.js                  # 轻量交互脚本
    images/                     # 响应式图片（WebP + JPEG 兜底）
  docs/seo/                     # SEO + ASO 审计与规划文档
  robots.txt                    # 爬虫配置（含 AI 爬虫显式放行）
  sitemap.xml                   # 站点地图（含 hreflang）
  feed.xml                      # RSS 2.0
  llms.txt                      # AI 检索事实清单
  site.webmanifest              # Web App 清单
  CNAME                         # 自定义域名
  README.md                     # 本文件
```

## 🖥️ 本地预览

无需任何构建工具，直接双击 `index.html` 在浏览器中打开即可预览。

推荐使用 VS Code + [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 插件，右键 `index.html` 选择"Open with Live Server"，实时预览效果更佳。

## 🚀 GitHub Pages 部署说明

本站点使用仓库根目录作为发布源，部署极简：

1. 打开仓库页面，进入 **Settings** 选项卡
2. 在左侧边栏点击 **Pages**
3. 在 **Build and deployment** 下：
   - **Source** 选择 `Deploy from a branch`
   - **Branch** 选择 `main`，目录选择 `/ (root)`
   - 点击 **Save**
4. 等待约 1–2 分钟，访问 `https://modian.aiyinyu.com/` 即可看到网站

## ✅ TODOs（需要后续替换的内容）

| 内容 | 当前状态 | 说明 |
|------|----------|------|
| **App 图标** | ✅ 已生成 | 品牌色渐变图标，如有真实图标可替换 `assets/images/` 中的文件 |
| **App 截图** | ✅ 已内置 | 9 张界面截图，已优化为 640/1280 双尺寸 WebP + JPEG 兜底，语义化命名 `modian-*` |
| **支持邮箱** | ✅ 已配置 | 已配置真实邮箱（内容已脱敏，见 support.html） |
| **自定义域名** | ✅ modian.aiyinyu.com | 全站 `canonical`、`sitemap.xml`、`robots.txt` 已统一使用该域名 |
| **App Store 评分** | ⏳ 待补 | 拿到真实评分后补 `AggregateRating` 结构化数据，见 `docs/seo/schema.md` |
| **锁屏功能** | ⏳ 待确认 | App 名称提到「锁屏背单词」但官网无对应说明，见 `docs/seo/action-plan.md` P0-3 |
| **版权年份** | 2026 | 每年更新页脚版权年份 |

## 📱 App 信息

- **App 名称**：墨典单词 - 高效学英语锁屏背单词的必备神器
- **支持平台**：iPhone · iPad
- **App Store 链接**：[点击下载](https://apps.apple.com/cn/app/%E5%A2%A8%E5%85%B8%E5%8D%95%E8%AF%8D-%E9%AB%98%E6%95%88%E5%AD%A6%E8%8B%B1%E8%AF%AD%E9%94%81%E5%B1%8F%E8%83%8C%E5%8D%95%E8%AF%8D%E7%9A%84%E5%BF%85%E5%A4%87%E7%A5%9E%E5%99%A8/id1373544809)

## 🛠️ 技术说明

- **技术栈**：纯 HTML5 + CSS3 + 原生 JS（无框架，无构建工具，零外部依赖）
- **设计语言**：「墨 · 记忆的科学」——文人衬线中文标题 × 等宽数据字，暖纸/墨夜双色板；招牌视觉是一条交互式艾宾浩斯遗忘曲线
- **动效**：曲线绘制、数字滚动、复习开关、磁性按钮、光标聚光、滚动揭示与进度条；全部遵循 `prefers-reduced-motion`
- **深色模式**：`data-theme` 属性 + 导航栏一键切换，记忆到 `localStorage`，并回退到系统 `prefers-color-scheme`（含防闪烁内联脚本）
- **SEO**：每页包含自指 `canonical`、Open Graph（1200×630 品牌卡）、Twitter Card、hreflang 集群；13 种 Schema.org 类型以 `@graph` 组织；含 `sitemap.xml`、`feed.xml`、`llms.txt`
- **响应式图片**：`<picture>` + WebP/JPEG + `srcset`/`sizes`，图片总量较优化前减少 72%
- **文档**：完整的 SEO + ASO 审计与执行规划见 [`docs/seo/`](./docs/seo/)
- **可访问性**：语义化 HTML、ARIA 属性、跳转链接、`:focus-visible` 样式
