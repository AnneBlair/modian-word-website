# 墨典单词官网

这是「**墨典单词**」iOS/iPadOS App 的官方网站，基于 **GitHub Pages Project Site** 构建，使用纯 HTML + CSS + 少量 JS，无需构建工具，原生可运行。

## 🌐 最终访问地址

**https://anneblair.github.io/modian-word-website/**

## 📁 目录结构

```text
/
  index.html          # 首页
  privacy.html        # 隐私政策
  support.html        # 用户支持
  faq.html            # 常见问题
  assets/
    css/styles.css    # 样式（移动端优先，支持深色模式）
    js/main.js        # 轻量交互脚本
    images/           # 图片资源（当前为占位目录）
  robots.txt          # SEO 爬虫配置
  sitemap.xml         # 站点地图
  site.webmanifest    # Web App 清单
  README.md           # 本文件
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
4. 等待约 1–2 分钟，访问 `https://anneblair.github.io/modian-word-website/` 即可看到网站

## ✅ TODOs（需要后续替换的内容）

| 内容 | 当前状态 | 说明 |
|------|----------|------|
| **App 图标** | 占位 | 将 `favicon.png`、`apple-touch-icon.png`、`icon-192.png`、`icon-512.png` 放入 `assets/images/` |
| **App 截图** | 占位卡片 | 将真实截图放入 `assets/images/`，并更新各 HTML 中的截图区域 |
| **支持邮箱** | `support@example.com` | 替换为真实的反馈邮箱地址（出现在 `support.html` 和 `privacy.html`） |
| **自定义域名** | 无 | 如配置自定义域名，需更新所有 `canonical`、`sitemap.xml`、`robots.txt` 中的 URL |
| **版权年份** | 2024 | 每年更新页脚版权年份 |

## 📱 App 信息

- **App 名称**：墨典单词 - 高效学英语锁屏背单词的必备神器
- **支持平台**：iPhone · iPad
- **App Store 链接**：[点击下载](https://apps.apple.com/cn/app/%E5%A2%A8%E5%85%B8%E5%8D%95%E8%AF%8D-%E9%AB%98%E6%95%88%E5%AD%A6%E8%8B%B1%E8%AF%AD%E9%94%81%E5%B1%8F%E8%83%8C%E5%8D%95%E8%AF%8D%E7%9A%84%E5%BF%85%E5%A4%87%E7%A5%9E%E5%99%A8/id1373544809)

## 🛠️ 技术说明

- **技术栈**：纯 HTML5 + CSS3 + 原生 JS（无框架，无构建工具）
- **设计**：移动端优先，卡片式布局，柔和渐变背景
- **深色模式**：通过 `prefers-color-scheme` CSS 媒体查询自动适配
- **SEO**：每页包含 `canonical`、Open Graph、Twitter Card；首页包含 `MobileApplication` JSON-LD 结构化数据
- **可访问性**：使用语义化 HTML，ARIA 属性，`:focus-visible` 样式
