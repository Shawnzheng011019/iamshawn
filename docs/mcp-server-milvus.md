# MCP Server for Milvus 技术文档

## 项目概述

**MCP Server for Milvus** 是基于Model Context Protocol (MCP)的向量数据库服务器，为LLM应用提供标准化的Milvus数据库操作接口。该项目由Zilliz开源，旨在让大语言模型能够无缝集成和操作Milvus向量数据库。

### 核心特性

- **标准化协议支持**：基于MCP开放协议，提供统一的LLM-数据库交互标准
- **多运行模式**：支持stdio和SSE两种通信模式，适应不同部署场景
- **广泛应用兼容**：支持Claude Desktop、Cursor、自定义MCP客户端等
- **全面数据库操作**：涵盖集合管理、数据操作、搜索查询等完整功能
- **灵活配置选项**：支持本地和远程Milvus实例，可配置认证和数据库选择

## 技术架构

### MCP协议架构
```
LLM应用 (Host) → MCP客户端 (Client) → MCP服务器 (Server) → Milvus数据库
```

### 运行模式对比

| 特性 | Stdio模式 | SSE模式 |
|------|-----------|---------|
| 适用场景 | 本地开发 | 远程服务/多客户端 |
| 通信方式 | 标准输入输出 | HTTP服务器发送事件 |
| 性能 | 低延迟 | 网络延迟 |
| 可扩展性 | 单客户端 | 多客户端 |
| 部署复杂性 | 简单 | 需要HTTP服务器 |

## 核心功能

### 搜索和查询操作

#### 1. 向量相似性搜索 (`milvus_vector_search`)
- **功能**：基于向量相似度进行语义搜索
- **参数**：
  - `collection_name`: 目标集合名称
  - `vector`: 查询向量
  - `vector_field`: 向量字段名称（默认：vector）
  - `limit`: 返回结果数量限制（默认：5）
  - `output_fields`: 输出字段列表
  - `filter_expr`: 过滤表达式
  - `metric_type`: 距离度量类型（COSINE, L2, IP，默认：COSINE）

#### 2. 全文搜索 (`milvus_text_search`)
- **功能**：基于文本内容进行全文检索
- **参数**：
  - `collection_name`: 目标集合名称
  - `query_text`: 搜索文本
  - `limit`: 返回结果数量限制（默认：5）
  - `output_fields`: 输出字段列表
  - `drop_ratio`: 低频词忽略比例（0.0-1.0）

#### 3. 混合搜索 (`milvus_hybrid_search`)
- **功能**：结合文本和向量的混合搜索
- **参数**：
  - `collection_name`: 目标集合名称
  - `query_text`: 文本查询
  - `text_field`: 文本搜索字段
  - `vector`: 查询向量
  - `vector_field`: 向量搜索字段
  - `limit`: 返回结果数量限制
  - `output_fields`: 输出字段列表
  - `filter_expr`: 过滤表达式

#### 4. 条件查询 (`milvus_query`)
- **功能**：基于过滤条件的精确查询
- **参数**：
  - `collection_name`: 目标集合名称
  - `filter_expr`: 过滤表达式（如：'age > 20'）
  - `output_fields`: 输出字段列表
  - `limit`: 返回结果数量限制（默认：10）

### 集合管理

#### 1. 列出集合 (`milvus_list_collections`)
- **功能**：获取数据库中所有集合列表

#### 2. 创建集合 (`milvus_create_collection`)
- **功能**：创建新的向量集合
- **参数**：
  - `collection_name`: 新集合名称
  - `collection_schema`: 集合架构定义
  - `index_params`: 可选的索引参数

#### 3. 加载集合 (`milvus_load_collection`)
- **功能**：将集合加载到内存以支持搜索和查询
- **参数**：
  - `collection_name`: 目标集合名称
  - `replica_number`: 副本数量（默认：1）

#### 4. 释放集合 (`milvus_release_collection`)
- **功能**：从内存中释放集合
- **参数**：
  - `collection_name`: 目标集合名称

#### 5. 获取集合信息 (`milvus_get_collection_info`)
- **功能**：获取集合的详细信息，包括架构、属性、ID等元数据
- **参数**：
  - `collection_name`: 目标集合名称

### 数据操作

#### 1. 插入数据 (`milvus_insert_data`)
- **功能**：向集合中插入数据
- **参数**：
  - `collection_name`: 目标集合名称
  - `data`: 字段名到值列表的映射字典

#### 2. 删除实体 (`milvus_delete_entities`)
- **功能**：基于过滤条件删除实体
- **参数**：
  - `collection_name`: 目标集合名称
  - `filter_expr`: 选择删除实体的过滤表达式

## 环境配置

### 必需环境变量
- `MILVUS_URI`: Milvus服务器URI（可替代--milvus-uri参数）
- `MILVUS_TOKEN`: 可选的认证令牌
- `MILVUS_DB`: 数据库名称（默认：default）

### Milvus连接配置示例

#### 本地Milvus Lite
```bash
MILVUS_URI=./milvus.db
```

#### 远程Milvus服务器
```bash
MILVUS_URI=http://localhost:19530
MILVUS_TOKEN=your_auth_token
```

#### Zilliz Cloud
```bash
MILVUS_URI=https://your-endpoint.zillizcloud.com
MILVUS_TOKEN=your_api_key
```

## 部署指南

### 1. Stdio模式部署

#### 系统要求
- Python 3.10 或更高版本
- 运行中的Milvus实例
- uv包管理器（推荐）

#### 启动服务器
```bash
# 克隆项目
git clone https://github.com/zilliztech/mcp-server-milvus.git
cd mcp-server-milvus

# 直接运行
uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530

# 或使用环境变量
uv run src/mcp_server_milvus/server.py
```

### 2. SSE模式部署

#### 启动SSE服务器
```bash
uv run src/mcp_server_milvus/server.py --sse --milvus-uri http://localhost:19530 --port 8000
```

#### 调试模式
```bash
mcp dev src/mcp_server_milvus/server.py
```

## 客户端集成

### Claude Desktop配置

#### Stdio模式配置
```json
{
  "mcpServers": {
    "milvus": {
      "command": "/PATH/TO/uv",
      "args": [
        "--directory",
        "/path/to/mcp-server-milvus/src/mcp_server_milvus",
        "run",
        "server.py",
        "--milvus-uri",
        "http://localhost:19530"
      ]
    }
  }
}
```

#### SSE模式配置
```json
{
  "mcpServers": {
    "milvus-sse": {
      "url": "http://your_sse_host:port/sse",
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### Cursor IDE配置

#### Stdio模式配置
```json
{
  "mcpServers": {
    "milvus": {
      "command": "/PATH/TO/uv",
      "args": [
        "--directory",
        "/path/to/mcp-server-milvus/src/mcp_server_milvus",
        "run",
        "server.py",
        "--milvus-uri",
        "http://127.0.0.1:19530"
      ]
    }
  }
}
```

#### SSE模式配置
```json
{
  "mcpServers": {
    "milvus-sse": {
      "url": "http://your_sse_host:port/sse",
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

## 使用示例

### Claude Desktop使用示例

#### 示例1：列出集合
```
What are the collections I have in my Milvus DB?
```

#### 示例2：搜索文档
```
Find documents in my text_collection that mention "machine learning"
```

### Cursor使用示例

#### 示例：创建集合
```
Create a new collection called 'articles' in Milvus with fields for title (string), content (string), and a vector field (128 dimensions)
```

## 故障排除

### 常见问题及解决方案

#### 连接错误
**症状**：出现"Failed to connect to Milvus server"错误

**解决方案**：
1. 验证Milvus实例运行状态：`docker ps`（使用Docker时）
2. 检查URI配置是否正确
3. 确保没有防火墙阻止连接
4. 尝试使用`127.0.0.1`替代`localhost`

#### 认证问题
**症状**：出现认证错误

**解决方案**：
1. 验证`MILVUS_TOKEN`配置正确
2. 检查Milvus实例是否需要认证
3. 确保拥有操作所需的权限

#### 工具未找到
**症状**：MCP工具未在Claude Desktop或Cursor中显示

**解决方案**：
1. 重启应用程序
2. 检查服务器日志是否有错误
3. 验证MCP服务器正确运行
4. 在Cursor中按刷新按钮

### 日志诊断

#### 开启详细日志
```bash
export LOG_LEVEL=DEBUG
uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530
```

#### 检查连接状态
```python
from pymilvus import connections

# 测试连接
connections.connect(
    alias="default",
    host="localhost",
    port="19530"
)
```

## 性能优化

### 最佳实践

#### 1. 索引优化
- 为高频查询字段创建适当索引
- 选择合适的索引类型（IVF_FLAT, IVF_SQ8, HNSW等）
- 根据数据规模调整索引参数

#### 2. 搜索优化
- 合理设置`limit`参数避免过量结果
- 使用`filter_expr`减少搜索范围
- 选择适当的`metric_type`

#### 3. 内存管理
- 及时释放不需要的集合
- 监控内存使用情况
- 设置合适的`replica_number`

#### 4. 网络优化
- 在网络条件允许时选择Stdio模式
- 使用连接池管理数据库连接
- 配置适当的超时参数

## 项目信息

- **开源协议**：Apache-2.0
- **开发语言**：Python
- **GitHub地址**：https://github.com/zilliztech/mcp-server-milvus
- **维护组织**：Zilliz
- **当前状态**：活跃开发中
- **Stars数量**：118+
- **Forks数量**：26+

## 相关资源

- [MCP官方文档](https://modelcontextprotocol.io)
- [Milvus官方文档](https://milvus.io/docs)
- [Zilliz Cloud](https://zilliz.com/cloud)
- [PyMilvus文档](https://pymilvus.readthedocs.io)

## 贡献指南

欢迎为项目做出贡献！请遵循以下步骤：

1. Fork项目到个人账户
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 创建Pull Request

### 开发环境设置
```bash
# 克隆项目
git clone https://github.com/zilliztech/mcp-server-milvus.git
cd mcp-server-milvus

# 安装依赖
uv sync

# 运行测试
uv run pytest

# 代码格式化
uv run black src/
uv run isort src/
```

## 版本历史

- **v0.1.x**：初始版本，基础MCP功能实现
- **v0.2.x**：新增SSE模式支持，扩展搜索功能
- **当前开发版**：持续优化性能和稳定性 