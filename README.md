# 郑啸的个人主页

## 🌐 访问地址

由于网络限制，推荐以下访问方式：

### 主要访问方式
1. **自定义域名**（推荐）：待绑定自定义域名
2. **GitHub Pages**：`https://shawnzheng011019.github.io/iamshawn`
3. **Vercel**：海外用户可直接访问Vercel链接

## 📝 博客发布流程

### 新的GitHub-based博客系统
博客现已完全基于GitHub管理，取消了传统的管理员后台，改为程序员友好的Markdown文件管理方式。

### 📁 发布新文章步骤

#### 1. 创建文章目录
```bash
posts/YYYY-MM-DD-article-slug/
├── README.md          # 文章内容（Markdown）
└── cover.jpg          # 封面图片（可选）
```

#### 2. 编写文章内容
在 `README.md` 中按以下格式编写：

```markdown
# 文章标题

## 文章信息
- **发布日期**: YYYY-MM-DD
- **分类**: 技术分类
- **标签**: ["标签1", "标签2", "标签3"]
- **封面图片**: cover.jpg
- **摘要**: 文章简介，用于卡片展示

---

## 正文内容
这里是文章的正文内容...
```

#### 3. 更新文章索引
在 `posts/posts.json` 中添加新文章信息：

```json
{
  "id": "article-slug",
  "title": "文章标题",
  "date": "YYYY-MM-DD",
  "category": "技术分类",
  "tags": ["标签1", "标签2"],
  "summary": "文章摘要",
  "cover": "posts/YYYY-MM-DD-article-slug/cover.jpg",
  "readingTime": "X 分钟",
  "path": "posts/YYYY-MM-DD-article-slug/README.md",
  "status": "published"
}
```

#### 4. 提交到GitHub
```bash
git add .
git commit -m "新增文章: 文章标题"
git push origin main
```

### 🎯 博客系统特性

- ✅ **实时更新**：文章发布后立即在网站上可见
- ✅ **Markdown支持**：原生Markdown写作体验
- ✅ **版本控制**：完整的文章修改历史
- ✅ **离线支持**：网络问题时显示友好提示
- ✅ **响应式设计**：完美适配桌面和移动设备
- ✅ **搜索功能**：支持标题、摘要、分类、标签搜索
- ✅ **懒加载**：图片按需加载，提升性能
- ✅ **代码高亮**：自动语法高亮显示
- ✅ **SEO优化**：良好的搜索引擎优化

### 📂 项目结构

```
├── index.html          # 主页
├── blog.html           # 博客页面
├── posts/              # 博客文章目录
│   ├── posts.json      # 文章索引
│   ├── 2024-01-15-rag-system-deep-dive/
│   │   ├── README.md   # 文章内容
│   │   └── cover.jpg   # 封面图片
│   └── 2024-01-10-llm-fine-tuning-lora-qlora/
│       ├── README.md
│       └── cover.jpg
├── blog/
│   └── js/
│       └── blog.js     # 博客前端脚本
├── style.css           # 样式文件
├── script.js           # 主脚本
└── vercel.json         # 部署配置
```

## 🚀 技术栈

- **前端框架**：原生HTML5 + CSS3 + JavaScript
- **样式框架**：Tailwind CSS
- **图标库**：Font Awesome
- **内容管理**：GitHub + Markdown
- **部署平台**：Vercel + GitHub Pages
- **性能优化**：
  - DNS预取和资源预加载
  - 图片懒加载
  - 代码分割和异步加载
  - DOM缓存和防抖优化

## 🔧 本地开发

```bash
# 克隆仓库
git clone https://github.com/Shawnzheng011019/iamshawn.git
cd iamshawn

# 启动本地服务器
npx serve .
# 或
python -m http.server 8000

# 访问
open http://localhost:8000
```

## 📱 响应式设计

- **桌面端**：>=1024px，3列网格布局
- **平板端**：768px-1023px，2列网格布局  
- **移动端**：<768px，单列布局，汉堡菜单

## 🎨 设计系统

### 颜色方案
- **主色**：#165DFF (蓝色)
- **次色**：#0E2E91 (深蓝)
- **强调色**：#36BFFA (浅蓝)
- **文字**：#1D2939 (深灰)
- **背景**：#F9FAFB (浅灰)

### 字体系统
- **主字体**：Inter (无衬线)
- **后备字体**：system-ui, -apple-system, sans-serif

## 📞 联系方式

- 📧 **邮箱**：Shawnzheng2001@outlook.com
- 📱 **电话**：16678627572
- 💼 **GitHub**：https://github.com/Shawnzheng011019

## 📄 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

---

**注意**：博客系统现已完全基于GitHub管理，无需管理员后台。只需在GitHub仓库中添加Markdown文件即可发布新文章！ 