# 郑啸的个人主页

## 🌐 访问地址

### 主要访问方式
1. **自定义域名**（推荐）：待绑定自定义域名
2. **GitHub Pages**：`https://shawnzheng011019.github.io/iamshawn`
3. **Vercel**：海外用户可直接访问Vercel链接

## 🚀 博客系统特色

### 🎯 智能多源加载系统
博客采用创新的多数据源架构，确保在任何网络环境下都能稳定访问：

#### 数据源配置（按优先级）
1. **jsDelivr CDN** - 国内主力CDN，速度最快
2. **GitHub Raw** - 官方数据源，最新内容
3. **jsDelivr备用节点** - Fastly节点备份
4. **GitHub代理** - 代理服务器访问

#### 智能降级策略
- ✅ **自动检测**: 并行测试所有数据源可达性
- ✅ **智能选择**: 自动选择最快可用的数据源
- ✅ **缓存优先**: 优先使用本地缓存，后台更新
- ✅ **故障切换**: 实时切换到可用数据源
- ✅ **离线支持**: 网络问题时显示缓存内容

### 🌐 国内网络优化
专门针对中国网络环境优化：
- **jsDelivr CDN**: 首选国内高速CDN
- **多节点备份**: 4个不同的数据源确保可用性
- **智能路由**: 自动选择最优访问路径
- **本地缓存**: 5分钟智能缓存减少网络依赖

## 📝 博客发布流程

### 新的GitHub-based博客系统
博客完全基于GitHub管理，支持程序员工作流：

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

**⚡ 发布后立即生效！**多数据源系统会自动同步更新。

### 🎯 博客系统特性

- ✅ **多源智能加载**：4个数据源确保全球可访问
- ✅ **国内网络优化**：jsDelivr CDN国内加速
- ✅ **智能缓存系统**：本地缓存 + 后台更新
- ✅ **离线支持增强**：网络问题时显示缓存内容
- ✅ **实时网络监控**：显示连接状态和数据源信息
- ✅ **Markdown支持**：原生Markdown写作体验
- ✅ **版本控制**：完整的文章修改历史
- ✅ **响应式设计**：完美适配桌面和移动设备
- ✅ **搜索功能**：支持标题、摘要、分类、标签搜索
- ✅ **懒加载优化**：图片按需加载，提升性能
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
│       ├── blog.js           # 博客前端脚本（多源版本）
│       └── network-status.js # 网络状态监控
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
- **CDN加速**：jsDelivr (国内) + GitHub Raw (国际)
- **性能优化**：
  - 多数据源智能切换
  - DNS预取和资源预加载
  - 图片懒加载
  - 代码分割和异步加载
  - DOM缓存和防抖优化
  - 智能本地缓存系统

## 🌐 数据源架构

### 主要数据源
1. **jsDelivr CDN**: `https://cdn.jsdelivr.net/gh/Shawnzheng011019/iamshawn@main`
   - 优点：国内访问速度快，稳定性高
   - 适用：中国大陆用户首选

2. **GitHub Raw**: `https://raw.githubusercontent.com/Shawnzheng011019/iamshawn/main`
   - 优点：官方数据源，内容最新
   - 适用：海外用户，内容实时性要求高

3. **备用节点**: `https://fastly.jsdelivr.net/gh/Shawnzheng011019/iamshawn@main`
   - 优点：Fastly加速，覆盖面广
   - 适用：主CDN故障时的备用方案

4. **代理服务**: `https://ghproxy.com/https://raw.githubusercontent.com/...`
   - 优点：绕过访问限制
   - 适用：特殊网络环境

### 智能选择机制
```javascript
// 系统会自动：
1. 并行测试所有数据源的可达性
2. 选择响应最快的可用数据源
3. 缓存首选数据源到本地存储
4. 在数据源故障时自动切换
5. 后台更新缓存保持内容同步
```

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

## 📊 性能监控

### 网络状态监控
- 实时显示网络连接状态
- 监控数据源可达性
- 显示当前使用的数据源
- 网络质量评估和反馈

### 缓存策略
- **文章数据**：5分钟智能缓存
- **首选数据源**：永久缓存（可重置）
- **离线模式**：显示最后缓存的内容

## 🛡️ 可靠性保障

### 多重备份
- 4个独立的数据源
- 本地存储缓存
- 降级显示机制

### 故障恢复
- 自动检测数据源故障
- 无缝切换到备用数据源
- 用户友好的错误提示

### 国内访问优化
- jsDelivr CDN 优先级最高
- 智能路由选择最优路径
- 专门针对中国网络环境优化

## 📞 联系方式

- 📧 **邮箱**：Shawnzheng2001@outlook.com
- 📱 **电话**：16678627572
- 💼 **GitHub**：https://github.com/Shawnzheng011019

## 📄 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

---

**🌟 特色亮点**：全球首个支持多数据源智能切换的GitHub驱动博客系统，确保在任何网络环境下都能稳定访问！ 