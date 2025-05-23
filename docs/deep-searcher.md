# DeepSearcher 技术文档

## 项目概述

**DeepSearcher** 是Zilliz开源的Deep Research替代方案，专注于基于私有数据的推理和搜索。它结合了先进的大语言模型（OpenAI o3、Qwen3、DeepSeek、Grok 3、Claude 4 Sonnet、Llama 4等）和向量数据库（Milvus、Zilliz Cloud等）来执行搜索、评估和推理，提供高度准确的答案和综合报告。

### 核心特性

- **私有数据搜索**：最大化利用企业内部数据，确保数据安全，必要时集成在线内容获得更准确答案
- **向量数据库管理**：支持Milvus等向量数据库，允许数据分区以实现高效检索
- **灵活嵌入选项**：兼容多种嵌入模型，优化选择
- **多LLM支持**：支持DeepSeek、OpenAI等大模型进行智能问答和内容生成
- **文档加载器**：支持本地文件加载，网络爬虫功能开发中

## 技术架构

### Agentic RAG架构

DeepSearcher采用四步流程架构：

```
定义/细化问题 → 研究 → 分析 → 综合
     ↓           ↓       ↓      ↓
  查询分解    →  路由  →  搜索  → 报告生成
     ↑           ↓       ↓      ↑
  问题精炼    ←  反思  ←  分析  ← 条件重复
```

### 核心组件

1. **查询路由器**：智能决定从哪些数据集合中检索信息
2. **搜索引擎**：基于Milvus的向量相似性搜索
3. **反思机制**：分析信息gaps，决定是否需要额外搜索
4. **条件执行流**：基于LLM输出的动态流程控制

## 安装部署

### 系统要求

- Python 3.10+（推荐）
- 充足的内存和存储空间
- 网络连接（用于在线模型API）

### 安装方式

#### 方式1：使用pip安装

```bash
# 创建虚拟环境
python -m venv .venv
source .venv/bin/activate

# 安装DeepSearcher
pip install deepsearcher

# 可选依赖（如ollama）
pip install "deepsearcher[ollama]"
```

#### 方式2：开发模式安装

```bash
# 使用uv（推荐）
git clone https://github.com/zilliztech/deep-searcher.git && cd deep-searcher
uv sync
source .venv/bin/activate
```

### 快速开始

```python
from deepsearcher.configuration import Configuration, init_config
from deepsearcher.online_query import query

# 配置系统
config = Configuration()
config.set_provider_config("llm", "OpenAI", {"model": "o1-mini"})
config.set_provider_config("embedding", "OpenAIEmbedding", {"model": "text-embedding-ada-002"})
init_config(config=config)

# 加载本地数据
from deepsearcher.offline_loading import load_from_local_files
load_from_local_files(paths_or_directory=your_local_path)

# （可选）从网站加载数据
from deepsearcher.offline_loading import load_from_website
load_from_website(urls=website_url)

# 执行查询
result = query("Write a report about xxx.")
```

## 配置详解

### LLM配置

#### 支持的LLM提供商
- **DeepSeek**：官方和第三方服务
- **OpenAI**：GPT系列模型
- **XAI**：Grok系列模型
- **SiliconFlow**：推理服务
- **Aliyun**：阿里云百炼
- **PPIO**：推理服务
- **TogetherAI**：推理服务
- **Gemini**：Google Gemini
- **Ollama**：本地推理
- **Novita**：AI推理服务

#### 配置示例

##### OpenAI配置
```python
config.set_provider_config("llm", "OpenAI", {"model": "o1-mini"})
# 环境变量：OPENAI_API_KEY
```

##### DeepSeek配置
```python
config.set_provider_config("llm", "DeepSeek", {"model": "deepseek-reasoner"})
# 环境变量：DEEPSEEK_API_KEY
```

##### Qwen3配置（阿里云百炼）
```python
config.set_provider_config("llm", "Aliyun", {"model": "qwen-plus-latest"})
# 环境变量：DASHSCOPE_API_KEY
```

##### Grok配置
```python
config.set_provider_config("llm", "XAI", {"model": "grok-2-latest"})
# 环境变量：XAI_API_KEY
```

##### Ollama配置（本地）
```python
config.set_provider_config("llm", "Ollama", {"model": "qwen3"})
# 需要本地运行：ollama pull qwen3
```

### 嵌入模型配置

#### 支持的嵌入提供商
- **OpenAIEmbedding**：OpenAI嵌入模型
- **MilvusEmbedding**：Pymilvus内置嵌入模型
- **VoyageEmbedding**：VoyageAI嵌入模型
- **SiliconflowEmbedding**：Siliconflow嵌入服务
- **PPIOEmbedding**：PPIO嵌入服务
- **NovitaEmbedding**：Novita AI嵌入服务

#### 配置示例

##### OpenAI嵌入
```python
config.set_provider_config("embedding", "OpenAIEmbedding", {"model": "text-embedding-3-small"})
# 环境变量：OPENAI_API_KEY
```

##### Milvus内置嵌入
```python
config.set_provider_config("embedding", "MilvusEmbedding", {"model": "BAAI/bge-base-en-v1.5"})
config.set_provider_config("embedding", "MilvusEmbedding", {"model": "jina-embeddings-v3"})
# Jina需要：JINAAI_API_KEY
```

##### VoyageAI嵌入
```python
config.set_provider_config("embedding", "VoyageEmbedding", {"model": "voyage-3"})
# 环境变量：VOYAGE_API_KEY
```

### 向量数据库配置

#### Milvus配置
```python
# 本地Milvus Lite
config.set_provider_config("vector_db", "Milvus", {"uri": "./milvus.db", "token": ""})

# 远程Milvus服务器
config.set_provider_config("vector_db", "Milvus", {"uri": "http://localhost:19530", "token": ""})

# Zilliz Cloud
config.set_provider_config("vector_db", "Milvus", {
    "uri": "https://your-endpoint.zillizcloud.com",
    "token": "your-api-key"
})
```

#### Azure AI Search配置
```python
config.set_provider_config("vector_db", "AzureSearch", {
    "endpoint": "https://your-service.search.windows.net",
    "index_name": "your-index",
    "api_key": "your-key",
    "vector_field": "vector"
})
```

### 文档加载器配置

#### 支持的加载器
- **PDFLoader**：PDF文档加载
- **TextLoader**：文本文件加载
- **UnstructuredLoader**：非结构化文档加载
- **DoclingLoader**：Docling文档加载

#### 配置示例

##### Unstructured加载器
```python
config.set_provider_config("file_loader", "UnstructuredLoader", {})
# 环境变量：UNSTRUCTURED_API_KEY, UNSTRUCTURED_API_URL（可选）
```

##### Docling加载器
```python
config.set_provider_config("file_loader", "DoclingLoader", {})
# 需要安装：pip install docling
```

### 网络爬虫配置

#### 支持的爬虫
- **FireCrawlCrawler**：FireCrawl网络爬虫
- **Crawl4AICrawler**：Crawl4AI爬虫
- **JinaCrawler**：Jina Reader爬虫

#### 配置示例

##### FireCrawl爬虫
```python
config.set_provider_config("web_crawler", "FireCrawlCrawler", {})
# 环境变量：FIRECRAWL_API_KEY
```

##### Crawl4AI爬虫
```python
config.set_provider_config("web_crawler", "Crawl4AICrawler", {
    "browser_config": {"headless": True, "verbose": True}
})
# 需要运行：crawl4ai-setup
```

##### Jina Reader爬虫
```python
config.set_provider_config("web_crawler", "JinaCrawler", {})
# 环境变量：JINA_API_TOKEN 或 JINAAI_API_KEY
```

## 使用指南

### 命令行模式

#### 数据加载
```bash
# 加载本地文件
deepsearcher load "/path/to/your/file.pdf"

# 加载多个文件
deepsearcher load "/path/to/file1.pdf" "/path/to/file2.md"

# 加载到特定集合
deepsearcher load "your_path" --collection_name "your_collection" --collection_desc "description"

# 从URL加载（需要FIRECRAWL_API_KEY）
deepsearcher load "https://www.example.com/article"
```

#### 执行查询
```bash
deepsearcher query "Write a report about xxx."
```

#### 帮助信息
```bash
deepsearcher --help
deepsearcher load --help
deepsearcher query --help
```

### Web服务部署

#### 启动服务
```bash
# 修改config.yaml配置文件
python main.py
```

#### 访问服务
- 服务地址：http://localhost:8000
- API文档：http://localhost:8000/docs

### Python API使用

#### 基础查询流程
```python
from deepsearcher.configuration import Configuration, init_config
from deepsearcher.online_query import query
from deepsearcher.offline_loading import load_from_local_files

# 1. 配置系统
config = Configuration()
config.set_provider_config("llm", "OpenAI", {"model": "gpt-4"})
config.set_provider_config("embedding", "OpenAIEmbedding", {"model": "text-embedding-ada-002"})
config.set_provider_config("vector_db", "Milvus", {"uri": "./milvus.db", "token": ""})
init_config(config=config)

# 2. 加载数据
load_from_local_files(paths_or_directory="/path/to/documents")

# 3. 执行搜索
result = query("Analyze the financial performance trends")
print(result)
```

#### 高级配置示例
```python
from deepsearcher.configuration import Configuration

config = Configuration()

# 使用DeepSeek推理模型
config.set_provider_config("llm", "DeepSeek", {
    "model": "deepseek-reasoner",
    "temperature": 0.1,
    "max_tokens": 4000
})

# 使用BGE嵌入模型
config.set_provider_config("embedding", "MilvusEmbedding", {
    "model": "BAAI/bge-large-en-v1.5"
})

# 配置远程Milvus
config.set_provider_config("vector_db", "Milvus", {
    "uri": "http://your-milvus-server:19530",
    "token": "your-token",
    "db_name": "deepsearcher"
})

# 配置文档加载器
config.set_provider_config("file_loader", "UnstructuredLoader", {
    "strategy": "fast",
    "languages": ["en", "zh"]
})
```

## 核心算法

### 查询分解算法

```python
def decompose_query(original_query: str) -> List[str]:
    """
    将原始查询分解为多个子查询
    
    Args:
        original_query: 用户输入的原始查询
        
    Returns:
        List[str]: 分解后的子查询列表
    """
    prompt = f"""
    Break down the following query into specific sub-queries:
    
    Original Query: {original_query}
    
    Generate 3-5 focused sub-queries that together will help answer the original question.
    """
    
    # LLM处理并返回子查询列表
    return llm.generate(prompt)
```

### 查询路由算法

```python
def route_queries(
    sub_queries: List[str], 
    collections: List[str], 
    descriptions: List[str]
) -> Dict[str, str]:
    """
    将子查询路由到最相关的数据集合
    
    Args:
        sub_queries: 子查询列表
        collections: 可用集合名称列表
        descriptions: 集合描述列表
        
    Returns:
        Dict[str, str]: 集合名称到查询的映射
    """
    routing_prompt = f"""
    Based on the sub-queries and available collections, 
    route each query to the most relevant collection.
    
    Sub-queries: {sub_queries}
    Collections: {list(zip(collections, descriptions))}
    
    Return JSON mapping: {{"collection_name": "relevant_query"}}
    """
    
    return llm.generate_structured(routing_prompt)
```

### 反思机制

```python
def reflect_and_expand(
    original_query: str,
    processed_queries: List[str], 
    retrieved_chunks: List[str]
) -> List[str]:
    """
    反思已处理的信息，确定是否需要额外搜索
    
    Args:
        original_query: 原始查询
        processed_queries: 已处理的查询
        retrieved_chunks: 检索到的文档块
        
    Returns:
        List[str]: 新的搜索查询列表（如果需要）
    """
    reflection_prompt = f"""
    Analyze the original query, processed sub-queries, and retrieved information.
    Determine if additional searches are needed to fully answer the question.
    
    Original Query: {original_query}
    Processed Queries: {processed_queries}
    Retrieved Information: {retrieved_chunks[:3]}  # 显示前3个块
    
    If more information is needed, provide up to 3 new search queries.
    If sufficient, return empty list.
    """
    
    return llm.generate_list(reflection_prompt)
```

### 报告合成算法

```python
def synthesize_report(
    original_query: str,
    all_queries: List[str],
    all_chunks: List[str]
) -> str:
    """
    将所有检索到的信息合成为最终报告
    
    Args:
        original_query: 原始查询
        all_queries: 所有子查询
        all_chunks: 所有检索到的文档块
        
    Returns:
        str: 最终合成的报告
    """
    synthesis_prompt = f"""
    Create a comprehensive report based on the original query and all retrieved information.
    
    Original Query: {original_query}
    Research Queries: {all_queries}
    Source Information: {all_chunks}
    
    Generate a well-structured, accurate, and detailed report that:
    1. Directly answers the original question
    2. Includes relevant details from the sources
    3. Maintains consistency across all sections
    4. Provides actionable insights where appropriate
    """
    
    return llm.generate(synthesis_prompt)
```

## 性能优化

### 推理优化

#### 1. 模型选择建议
- **推理任务**：使用大型推理模型（DeepSeek-R1 671B、OpenAI o系列、Claude 4 Sonnet）
- **快速响应**：使用较小模型（GPT-4o mini、Qwen2.5-32B）
- **本地部署**：使用Ollama + 量化模型

#### 2. 推理加速
```python
# 使用SambaNova高速推理服务
config.set_provider_config("llm", "SambaNova", {
    "model": "deepseek-r1-671b",
    "optimization": "speed"
})

# 批量处理优化
config.set_batch_size(4)
config.set_concurrent_requests(2)
```

### 向量搜索优化

#### 1. 索引优化
```python
# Milvus索引配置
index_params = {
    "index_type": "HNSW",
    "metric_type": "COSINE", 
    "params": {
        "M": 16,
        "efConstruction": 256
    }
}

config.set_index_params(index_params)
```

#### 2. 搜索参数调优
```python
# 搜索参数优化
search_params = {
    "metric_type": "COSINE",
    "params": {
        "ef": 128,
        "search_k": -1
    }
}

config.set_search_params(search_params)
```

### 内存管理

#### 1. 数据分块策略
```python
# 文档分块配置
chunking_config = {
    "chunk_size": 1000,
    "chunk_overlap": 200,
    "separators": ["\n\n", "\n", ". ", " "]
}

config.set_chunking_config(chunking_config)
```

#### 2. 缓存策略
```python
# 启用结果缓存
config.enable_caching(
    cache_type="redis",
    cache_size="1GB",
    ttl=3600  # 1小时
)
```

## 故障排除

### 常见问题

#### Q1: LLM输出格式解析失败
**问题**：小模型难以遵循提示生成所需格式的响应

**解决方案**：
1. 使用大型推理模型（deepseek-r1 671b、OpenAI o系列、Claude 4 sonnet）
2. 优化提示词格式
3. 增加输出验证和重试机制

#### Q2: HuggingFace连接问题
**问题**：无法连接到HuggingFace下载模型

**解决方案**：
```bash
# 网络问题：设置镜像
export HF_ENDPOINT=https://hf-mirror.com

# 权限问题：设置token
export HUGGING_FACE_HUB_TOKEN=your_token
```

#### Q3: Jupyter Notebook运行问题
**问题**：DeepSearcher在Jupyter中无法运行

**解决方案**：
```python
# 安装并配置nest_asyncio
pip install nest_asyncio

import nest_asyncio
nest_asyncio.apply()
```

### 性能调试

#### 1. 启用详细日志
```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("deepsearcher")
logger.setLevel(logging.DEBUG)
```

#### 2. 性能监控
```python
from deepsearcher.monitoring import PerformanceMonitor

monitor = PerformanceMonitor()
monitor.start()

# 执行查询
result = query("your question")

# 查看性能报告
monitor.report()
```

#### 3. 资源使用监控
```python
import psutil
import time

def monitor_resources():
    cpu = psutil.cpu_percent()
    memory = psutil.virtual_memory().percent
    print(f"CPU: {cpu}%, Memory: {memory}%")

# 在查询前后监控
monitor_resources()
result = query("complex question")
monitor_resources()
```

## 扩展开发

### 自定义LLM提供商

```python
from deepsearcher.llm.base import BaseLLM

class CustomLLM(BaseLLM):
    def __init__(self, model: str, api_key: str, **kwargs):
        self.model = model
        self.api_key = api_key
        
    def generate(self, prompt: str, **kwargs) -> str:
        # 实现自定义LLM调用逻辑
        pass
        
    def generate_structured(self, prompt: str, schema: dict) -> dict:
        # 实现结构化输出生成
        pass

# 注册自定义提供商
from deepsearcher.configuration import register_provider
register_provider("llm", "CustomLLM", CustomLLM)
```

### 自定义嵌入模型

```python
from deepsearcher.embedding.base import BaseEmbedding

class CustomEmbedding(BaseEmbedding):
    def __init__(self, model: str, **kwargs):
        self.model = model
        
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        # 实现文档嵌入逻辑
        pass
        
    def embed_query(self, text: str) -> List[float]:
        # 实现查询嵌入逻辑
        pass

# 注册自定义嵌入模型
register_provider("embedding", "CustomEmbedding", CustomEmbedding)
```

### 自定义数据加载器

```python
from deepsearcher.file_loader.base import BaseFileLoader

class CustomLoader(BaseFileLoader):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
    def load(self, file_path: str) -> List[Document]:
        # 实现自定义文件加载逻辑
        pass
        
    def supported_extensions(self) -> List[str]:
        return [".custom", ".special"]

# 注册自定义加载器
register_provider("file_loader", "CustomLoader", CustomLoader)
```

## 项目信息

- **开源协议**：Apache-2.0
- **开发语言**：Python
- **GitHub地址**：https://github.com/zilliztech/deep-searcher
- **维护组织**：Zilliz
- **当前状态**：活跃开发中
- **Stars数量**：6k+
- **Forks数量**：592+

## 相关资源

- [项目官网](https://zilliztech.github.io/deep-searcher/)
- [GitHub仓库](https://github.com/zilliztech/deep-searcher)
- [Milvus文档](https://milvus.io/docs)
- [Zilliz Cloud](https://zilliz.com/cloud)
- [社区Discord](https://discord.gg/zilliz)

## 社区贡献

DeepSearcher欢迎社区贡献！参与方式：

1. **Star项目**：给项目点星支持
2. **报告问题**：在GitHub Issues中报告bug
3. **功能建议**：提出新功能想法
4. **代码贡献**：提交Pull Request
5. **文档改进**：完善项目文档
6. **社区讨论**：加入Discord讨论

### 开发路线图

- [x] 基础Agentic RAG功能
- [x] 多LLM提供商支持
- [x] 向量数据库集成
- [x] Web爬虫功能
- [x] RESTful API接口
- [ ] 更多向量数据库支持（FAISS等）
- [ ] 增强web爬虫功能
- [ ] 多模态搜索支持
- [ ] 企业级安全特性
- [ ] 可视化分析界面 