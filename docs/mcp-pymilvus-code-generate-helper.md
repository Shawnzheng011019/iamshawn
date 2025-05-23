# MCP PyMilvus Code Generate Helper 技术文档

## 项目概述

**MCP PyMilvus Code Generate Helper** 是基于RAG框架开发的Milvus代码生成MCP服务，能够根据用户需求自动生成PyMilvus代码片段，显著提高开发效率。该项目结合了Model Context Protocol (MCP)和Retrieval-Augmented Generation (RAG)技术，为开发者提供智能化的代码生成体验。

### 核心特性

- **智能代码生成**：基于自然语言描述自动生成PyMilvus代码
- **RAG增强**：利用向量数据库检索相关代码示例和文档
- **MCP协议支持**：与Claude Desktop、Cursor等AI开发工具无缝集成
- **多场景覆盖**：支持集合操作、数据插入、向量搜索等常见用例
- **代码优化**：生成的代码符合最佳实践和性能标准

## 技术架构

### 整体架构图

```
用户请求 → MCP Client → Code Generate Helper → RAG系统 → PyMilvus代码
    ↑                                              ↓
自然语言描述                                    向量知识库
    ↑                                              ↓
AI工具集成                                    代码模板库
```

### 核心组件

1. **MCP服务器**：处理来自AI工具的代码生成请求
2. **RAG检索系统**：从向量知识库检索相关代码示例
3. **代码生成引擎**：基于检索结果和用户需求生成代码
4. **知识库管理**：维护PyMilvus文档、示例和最佳实践

## 功能特性

### 支持的代码生成场景

#### 1. 连接管理
```python
# 示例输入："连接到本地Milvus实例"
# 生成代码：
from pymilvus import connections

connections.connect(
    alias="default",
    host="localhost",
    port="19530"
)
```

#### 2. 集合操作
```python
# 示例输入："创建一个包含文本和向量字段的集合"
# 生成代码：
from pymilvus import Collection, FieldSchema, CollectionSchema, DataType

fields = [
    FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
    FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=512),
    FieldSchema(name="vector", dtype=DataType.FLOAT_VECTOR, dim=768)
]

schema = CollectionSchema(fields, "Text and vector collection")
collection = Collection("text_collection", schema)
```

#### 3. 数据插入
```python
# 示例输入："批量插入文本和向量数据"
# 生成代码：
import random

data = [
    ["sample text 1", "sample text 2", "sample text 3"],
    [[random.random() for _ in range(768)] for _ in range(3)]
]

collection.insert(data)
collection.flush()
```

#### 4. 索引创建
```python
# 示例输入："为向量字段创建HNSW索引"
# 生成代码：
index_params = {
    "index_type": "HNSW",
    "metric_type": "COSINE",
    "params": {
        "M": 16,
        "efConstruction": 256
    }
}

collection.create_index(
    field_name="vector",
    index_params=index_params
)
```

#### 5. 向量搜索
```python
# 示例输入："执行向量相似性搜索并返回前5个结果"
# 生成代码：
import random

search_params = {
    "metric_type": "COSINE",
    "params": {"ef": 128}
}

query_vector = [random.random() for _ in range(768)]

results = collection.search(
    data=[query_vector],
    anns_field="vector",
    param=search_params,
    limit=5,
    output_fields=["text"]
)
```

### 高级功能

#### 1. 混合搜索
```python
# 示例输入："实现文本和向量的混合搜索"
# 生成代码：
from pymilvus import AnnSearchRequest, RRFRanker

# 向量搜索请求
vector_search_req = AnnSearchRequest(
    data=[query_vector],
    anns_field="vector",
    param=search_params,
    limit=20
)

# 文本搜索请求
text_search_req = AnnSearchRequest(
    data=["search text"],
    anns_field="text",
    param={"metric_type": "BM25"},
    limit=20
)

# 混合搜索
results = collection.hybrid_search(
    reqs=[vector_search_req, text_search_req],
    ranker=RRFRanker(),
    limit=5,
    output_fields=["text"]
)
```

#### 2. 分区管理
```python
# 示例输入："创建分区并在特定分区中搜索"
# 生成代码：
# 创建分区
collection.create_partition("category_1")

# 在分区中插入数据
collection.insert(data, partition_name="category_1")

# 在特定分区搜索
results = collection.search(
    data=[query_vector],
    anns_field="vector",
    param=search_params,
    limit=5,
    partition_names=["category_1"],
    output_fields=["text"]
)
```

#### 3. 过滤搜索
```python
# 示例输入："基于标量字段过滤的向量搜索"
# 生成代码：
filter_expr = "id > 100 and category == 'document'"

results = collection.search(
    data=[query_vector],
    anns_field="vector",
    param=search_params,
    limit=5,
    expr=filter_expr,
    output_fields=["text", "category"]
)
```

## MCP集成配置

### Claude Desktop配置

#### JSON配置文件
```json
{
  "mcpServers": {
    "pymilvus-helper": {
      "command": "python",
      "args": [
        "/path/to/mcp-pymilvus-code-generate-helper/server.py"
      ],
      "env": {
        "OPENAI_API_KEY": "your-openai-key",
        "MILVUS_URI": "http://localhost:19530"
      }
    }
  }
}
```

### Cursor IDE配置

#### MCP配置
```json
{
  "mcpServers": {
    "pymilvus-helper": {
      "command": "python",
      "args": ["/path/to/server.py"],
      "env": {
        "OPENAI_API_KEY": "your-api-key"
      }
    }
  }
}
```

## 安装部署

### 系统要求

- Python 3.8+
- PyMilvus 2.3+
- OpenAI API访问（用于代码生成）
- 向量数据库（存储知识库）

### 安装步骤

#### 1. 克隆项目
```bash
git clone https://github.com/Shawnzheng011019/mcp-pymilvus-code-generate-helper.git
cd mcp-pymilvus-code-generate-helper
```

#### 2. 安装依赖
```bash
pip install -r requirements.txt
```

#### 3. 配置环境变量
```bash
export OPENAI_API_KEY="your-openai-api-key"
export MILVUS_URI="http://localhost:19530"
export KNOWLEDGE_BASE_PATH="./knowledge_base"
```

#### 4. 初始化知识库
```bash
python init_knowledge_base.py
```

#### 5. 启动MCP服务器
```bash
python server.py
```

## 知识库管理

### 知识库结构

```
knowledge_base/
├── documentation/          # PyMilvus官方文档
├── examples/              # 代码示例
├── best_practices/        # 最佳实践
├── troubleshooting/       # 故障排除指南
└── api_reference/         # API参考
```

### 知识库更新

#### 添加新文档
```python
from knowledge_manager import KnowledgeManager

km = KnowledgeManager()

# 添加新的代码示例
km.add_example({
    "title": "高性能批量插入",
    "description": "优化大规模数据插入的方法",
    "code": code_content,
    "tags": ["performance", "insert", "batch"]
})
```

#### 更新现有内容
```python
# 更新文档
km.update_documentation(
    doc_id="connection_guide",
    content=updated_content
)
```

### 向量索引优化

#### 嵌入模型配置
```python
from sentence_transformers import SentenceTransformer

# 使用代码专用嵌入模型
model = SentenceTransformer('microsoft/codebert-base')

# 或使用通用嵌入模型
model = SentenceTransformer('all-MiniLM-L6-v2')
```

#### 索引参数优化
```python
index_params = {
    "index_type": "HNSW",
    "metric_type": "COSINE",
    "params": {
        "M": 32,
        "efConstruction": 512
    }
}
```

## 使用示例

### 基础使用

#### 在Claude Desktop中使用
```
请生成一个PyMilvus代码，实现以下功能：
1. 连接到Milvus数据库
2. 创建一个名为"documents"的集合，包含id、title、content和embedding字段
3. 插入一些示例数据
4. 创建HNSW索引
5. 执行向量搜索
```

#### 在Cursor中使用
```
@pymilvus-helper 帮我生成一个完整的Milvus应用，实现文档检索功能，包括数据加载、索引创建和搜索接口
```

### 高级使用

#### 性能优化场景
```
生成一个高性能的PyMilvus代码，要求：
- 支持百万级数据插入
- 使用批处理优化
- 包含连接池管理
- 添加错误重试机制
```

#### 分布式部署场景
```
创建一个PyMilvus集群连接代码，支持：
- 多节点负载均衡
- 故障转移
- 连接健康检查
```

## 代码生成算法

### RAG检索流程

```python
def retrieve_relevant_examples(query: str, top_k: int = 5) -> List[Dict]:
    """
    根据查询检索相关的代码示例
    
    Args:
        query: 用户查询描述
        top_k: 返回相关示例数量
        
    Returns:
        List[Dict]: 相关代码示例列表
    """
    # 1. 查询向量化
    query_embedding = embedding_model.encode(query)
    
    # 2. 向量搜索
    search_results = knowledge_collection.search(
        data=[query_embedding],
        anns_field="embedding",
        param=search_params,
        limit=top_k,
        output_fields=["title", "code", "description", "tags"]
    )
    
    # 3. 返回结果
    return [hit.entity for hit in search_results[0]]
```

### 代码生成流程

```python
def generate_pymilvus_code(
    user_request: str,
    retrieved_examples: List[Dict]
) -> str:
    """
    基于用户请求和检索示例生成PyMilvus代码
    
    Args:
        user_request: 用户请求描述
        retrieved_examples: 检索到的相关示例
        
    Returns:
        str: 生成的PyMilvus代码
    """
    # 1. 构建提示词
    prompt = build_generation_prompt(user_request, retrieved_examples)
    
    # 2. 调用LLM生成代码
    generated_code = llm.generate(prompt)
    
    # 3. 代码验证和优化
    validated_code = validate_and_optimize(generated_code)
    
    return validated_code
```

### 提示词模板

```python
GENERATION_PROMPT_TEMPLATE = """
你是一个PyMilvus代码生成专家。根据用户需求和相关示例，生成高质量的PyMilvus代码。

用户需求：
{user_request}

相关示例：
{retrieved_examples}

请生成符合以下要求的PyMilvus代码：
1. 代码应该是完整可运行的
2. 包含必要的导入语句
3. 添加适当的注释
4. 遵循PyMilvus最佳实践
5. 包含错误处理机制

生成的代码：
```python
{generated_code}
```

代码说明：
{code_explanation}
"""
```

## 性能优化

### 检索性能优化

#### 1. 向量索引优化
```python
# 针对代码检索优化的索引参数
code_index_params = {
    "index_type": "HNSW",
    "metric_type": "COSINE",
    "params": {
        "M": 48,
        "efConstruction": 1024
    }
}
```

#### 2. 搜索参数调优
```python
# 平衡精度和性能的搜索参数
search_params = {
    "metric_type": "COSINE",
    "params": {
        "ef": 256,
        "search_k": -1
    }
}
```

### 代码生成优化

#### 1. 缓存机制
```python
from functools import lru_cache

@lru_cache(maxsize=1000)
def cached_code_generation(request_hash: str) -> str:
    """缓存常见的代码生成请求"""
    return generate_code_uncached(request_hash)
```

#### 2. 批量处理
```python
def batch_generate_codes(requests: List[str]) -> List[str]:
    """批量处理多个代码生成请求"""
    # 批量检索
    all_embeddings = embedding_model.encode(requests)
    batch_results = knowledge_collection.search(
        data=all_embeddings,
        anns_field="embedding",
        param=search_params,
        limit=5
    )
    
    # 批量生成
    return [generate_code(req, results) 
            for req, results in zip(requests, batch_results)]
```

## 扩展功能

### 自定义代码模板

#### 模板定义
```python
TEMPLATE_COLLECTION_CRUD = """
from pymilvus import Collection, FieldSchema, CollectionSchema, DataType, connections

# 连接到Milvus
connections.connect(host="{host}", port="{port}")

# 定义集合schema
fields = [
    {field_definitions}
]

schema = CollectionSchema(fields, "{collection_description}")
collection = Collection("{collection_name}", schema)

# 创建索引
{index_creation}

# 数据操作示例
{data_operations}
"""
```

#### 模板使用
```python
def fill_template(template: str, params: Dict) -> str:
    """填充代码模板"""
    return template.format(**params)
```

### 多语言支持

#### 支持的输出格式
```python
OUTPUT_FORMATS = {
    "python": generate_python_code,
    "go": generate_go_code,
    "java": generate_java_code,
    "nodejs": generate_nodejs_code
}
```

### API扩展

#### RESTful API接口
```python
from fastapi import FastAPI

app = FastAPI()

@app.post("/generate")
async def generate_code_api(request: CodeGenRequest):
    """代码生成API接口"""
    result = await generate_pymilvus_code(
        request.description,
        request.requirements
    )
    return {"code": result.code, "explanation": result.explanation}
```

## 项目信息

- **开源协议**：MIT
- **开发语言**：Python
- **GitHub地址**：https://github.com/Shawnzheng011019/mcp-pymilvus-code-generate-helper
- **维护者**：Shawn Zheng
- **当前状态**：开发中
- **依赖框架**：PyMilvus, OpenAI API, MCP SDK

## 相关资源

- [PyMilvus官方文档](https://pymilvus.readthedocs.io)
- [Milvus官方文档](https://milvus.io/docs)
- [MCP协议文档](https://modelcontextprotocol.io)
- [RAG技术指南](https://python.langchain.com/docs/use_cases/question_answering)

## 贡献指南

### 贡献方式

1. **代码贡献**：提交新功能或Bug修复
2. **知识库扩展**：添加更多PyMilvus示例和文档
3. **模板优化**：改进代码生成模板
4. **测试用例**：增加测试覆盖率
5. **文档完善**：改进使用文档和API文档

### 开发流程

#### 1. 设置开发环境
```bash
# 克隆仓库
git clone https://github.com/Shawnzheng011019/mcp-pymilvus-code-generate-helper.git
cd mcp-pymilvus-code-generate-helper

# 创建开发环境
python -m venv dev_env
source dev_env/bin/activate

# 安装开发依赖
pip install -r requirements-dev.txt
```

#### 2. 运行测试
```bash
# 单元测试
pytest tests/unit/

# 集成测试
pytest tests/integration/

# 代码覆盖率
pytest --cov=src tests/
```

#### 3. 代码质量检查
```bash
# 代码格式化
black src/
isort src/

# 静态分析
pylint src/
mypy src/
```

### 版本发布

- **v0.1.x**：基础代码生成功能
- **v0.2.x**：RAG检索优化
- **v0.3.x**：多语言支持
- **v1.0.x**：生产就绪版本

## 未来规划

### 短期目标
- [ ] 完善PyMilvus 2.4+新特性支持
- [ ] 优化代码生成质量和准确性
- [ ] 添加更多使用场景模板
- [ ] 改进MCP集成体验

### 中期目标
- [ ] 支持多种编程语言输出
- [ ] 集成更多向量数据库
- [ ] 添加可视化界面
- [ ] 支持自定义LLM模型

### 长期目标
- [ ] 构建完整的向量数据库开发助手生态
- [ ] 支持复杂应用架构生成
- [ ] 集成CI/CD工具链
- [ ] 提供企业级部署方案 