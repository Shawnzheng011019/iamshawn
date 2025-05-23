# 技术文档查看功能

## 功能说明

在个人主页的实习经历部分添加了"查看技术文档"按钮，用户可以通过该按钮查看相关的技术文档。

## 功能特性

### 1. 文档查看器 (`docs-viewer.html`)
- 响应式设计，支持桌面端和移动端
- 侧边栏导航，方便切换不同文档
- 使用 `marked.js` 渲染Markdown文档
- 使用 `Prism.js` 进行代码高亮
- 与主网站设计风格保持一致

### 2. 支持的文档
- **MCP PyMilvus代码生成器**: 基于RAG框架的代码生成工具
- **Deep Searcher**: 深度搜索引擎功能
- **MCP Server Milvus**: Milvus查询功能的MCP服务

### 3. 访问方式
1. 在主页实习经历部分点击"查看技术文档"按钮
2. 直接访问 `docs-viewer.html` 页面
3. 通过URL参数直接打开特定文档：`docs-viewer.html?doc=mcp-pymilvus-code-generate-helper`

## 技术实现

### 前端技术栈
- **Tailwind CSS**: 样式框架
- **Font Awesome**: 图标库
- **marked.js**: Markdown解析和渲染
- **Prism.js**: 代码语法高亮

### 文件结构
```
├── docs-viewer.html          # 文档查看器页面
├── docs/                     # 技术文档目录
│   ├── mcp-pymilvus-code-generate-helper.md
│   ├── deep-searcher.md
│   └── mcp-server-milvus.md
└── index.html               # 主页（已添加按钮）
```

### 核心功能
1. **异步文档加载**: 使用 `fetch API` 异步加载Markdown文件
2. **实时渲染**: 使用 `marked.js` 将Markdown转换为HTML
3. **代码高亮**: 使用 `Prism.js` 自动高亮代码块
4. **错误处理**: 文档加载失败时显示友好的错误信息

## 使用方法

### 本地开发
```bash
# 启动本地服务器
python3 -m http.server 8000

# 访问主页
open http://localhost:8000/index.html

# 直接访问文档查看器
open http://localhost:8000/docs-viewer.html
```

### 部署要求
- 需要HTTP服务器支持（不能直接用 `file://` 协议访问）
- 确保 `docs/` 文件夹中的 `.md` 文件可以被访问
- 支持现代浏览器（ES6+）

## 移动端优化

- 按钮在小屏幕上垂直堆叠显示
- 侧边栏在移动端可以折叠
- 文档内容响应式布局，适配各种屏幕尺寸
- 触摸友好的交互设计

## 扩展功能

如需添加新的技术文档：

1. 将 `.md` 文件放入 `docs/` 文件夹
2. 在 `docs-viewer.html` 的侧边栏导航中添加对应链接
3. 调用 `loadDoc('文档名')` 函数加载新文档

示例：
```html
<a href="#" onclick="loadDoc('new-doc')" class="block p-3 rounded-lg text-gray-700 hover:bg-primary hover:text-white transition-colors cursor-pointer">
    <i class="fa-solid fa-file mr-2"></i>
    新技术文档
</a>
``` 