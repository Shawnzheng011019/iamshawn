# 技术文档查看功能

## 功能说明

在个人主页的实习经历部分添加了"查看技术文档"按钮，用户可以通过该按钮查看相关的技术文档。

## 功能特性

### 1. 文档查看器 (`docs-viewer.html`)
- **横版导航栏设计**：导航栏位于页面顶部，采用水平布局，支持移动端横向滚动
- **响应式设计**：支持桌面端和移动端，适配各种屏幕尺寸
- **Markdown渲染**：使用 `marked.js v9.1.6` 渲染Markdown文档
- **代码高亮**：使用 `Prism.js` 进行语法高亮
- **设计一致性**：与主网站设计风格保持一致
- **错误处理增强**：详细的错误信息和重新加载按钮

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
- **marked.js v9.1.6**: Markdown解析和渲染（已修复API兼容性）
- **Prism.js**: 代码语法高亮

### 文件结构
```
├── docs-viewer.html          # 文档查看器页面（横版导航栏）
├── docs/                     # 技术文档目录
│   ├── mcp-pymilvus-code-generate-helper.md
│   ├── deep-searcher.md
│   └── mcp-server-milvus.md
└── index.html               # 主页（已添加按钮）
```

### 核心功能
1. **异步文档加载**: 使用 `fetch API` 异步加载Markdown文件
2. **实时渲染**: 使用 `marked.js` 将Markdown转换为HTML，支持新旧API
3. **代码高亮**: 使用 `Prism.js` 自动高亮代码块
4. **错误处理**: 文档加载失败时显示详细错误信息和重新加载选项
5. **导航状态管理**: 横版导航栏支持活跃状态显示
6. **调试支持**: 添加了详细的控制台日志输出

## 最近更新 (v2.0)

### 🔧 Bug修复
- **修复文档加载失败问题**: 
  - 更新marked.js到v9.1.6版本
  - 添加API兼容性处理，支持新旧版本API
  - 增强错误处理和调试信息
  - 添加依赖库加载状态检测

### 🎨 设计改进
- **横版导航栏**: 
  - 将侧边栏改为顶部横版导航栏
  - 支持移动端横向滚动
  - 优化按钮布局和间距
  - 添加活跃状态显示
  
### ✨ 用户体验提升
- **改进加载状态**: 更友好的初始状态显示
- **错误页面优化**: 提供重新加载按钮和详细错误信息
- **自动滚动**: 文档加载后自动滚动到顶部
- **调试模式**: 添加控制台日志便于问题排查

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
- 需要网络连接以加载CDN资源

## 移动端优化

- **横版导航栏**: 在移动端支持横向滚动，避免按钮拥挤
- **触摸友好**: 按钮大小和间距适合触摸操作
- **响应式布局**: 文档内容在各种屏幕尺寸下都能良好显示
- **性能优化**: 减少不必要的重绘和回流

## 故障排除

### 常见问题
1. **文档加载失败**
   - 检查网络连接
   - 确认HTTP服务器正在运行
   - 查看浏览器控制台错误信息
   - 使用重新加载按钮重试

2. **代码高亮不工作**
   - 确认Prism.js库正确加载
   - 检查网络连接到CDN
   - 查看控制台是否有JavaScript错误

3. **导航栏显示异常**
   - 清除浏览器缓存
   - 确认CSS文件正确加载
   - 检查Tailwind CSS CDN连接

## 扩展功能

如需添加新的技术文档：

1. 将 `.md` 文件放入 `docs/` 文件夹
2. 在 `docs-viewer.html` 的横版导航栏中添加对应按钮
3. 调用 `loadDoc('文档名')` 函数加载新文档

示例：
```html
<button onclick="loadDoc('new-doc')" 
        class="nav-item flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-primary hover:text-white transition-colors whitespace-nowrap">
    <i class="fa-solid fa-file mr-2"></i>
    新技术文档
</button>
```

## 版本历史

- **v2.0** (当前): 横版导航栏 + Bug修复
- **v1.0**: 初始版本，侧边栏导航 