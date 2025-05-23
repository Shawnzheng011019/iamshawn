// posts.json的内容作为静态数据
const POSTS_DATA = [
  {
    "id": "vector-database-selection-guide",
    "title": "向量数据库选型指南：选择最适合您需求的解决方案",
    "date": "2025-01-20",
    "category": "数据库技术",
    "tags": ["向量数据库", "Milvus", "Pinecone", "Qdrant", "Weaviate", "RAG", "AI应用"],
    "summary": "深入对比主流向量数据库的性能、功能和成本，为不同规模的AI应用提供详细的选型建议和部署指南。涵盖Milvus、Pinecone、Qdrant、Weaviate等主流方案的优缺点分析。",
    "cover": "posts/2025-01-20-vector-database-selection-guide/cover.png",
    "readingTime": "25 分钟",
    "path": "posts/2025-01-20-vector-database-selection-guide/README.md",
    "status": "published"
  },
  {
    "id": "ai-content-humanization-guide",
    "title": "AI写作反检测终极指南：让你的内容人味儿十足",
    "date": "2025-01-16",
    "category": "AI工具技巧",
    "tags": ["AI写作", "AIGC检测", "提示词工程", "智能体配置", "内容创作", "反检测技巧"],
    "summary": "在AI内容泛滥的时代，如何让机器写出的文字具备人类的温度？本文将揭秘通过智能体配置和提示词工程，让AI生成内容巧妙规避检测的实战技巧。",
    "cover": "posts/2025-01-16-ai-content-humanization-guide/cover.png",
    "readingTime": "20 分钟",
    "path": "posts/2025-01-16-ai-content-humanization-guide/README.md",
    "status": "published"
  },
  {
    "id": "mcp-protocol-comprehensive-guide",
    "title": "MCP协议深度解析：构建AI Agent的新标准",
    "date": "2025-05-09",
    "category": "AI协议",
    "tags": ["MCP", "AI Agent", "协议", "通信标准", "Anthropic", "Model Context Protocol"],
    "summary": "Model Context Protocol (MCP) 作为新兴的AI Agent通信标准，正在重新定义AI应用与外部系统的集成方式。本文深入解析MCP的技术细节、架构设计和实际应用场景，涵盖从基础概念到高级实现的完整指南。",
    "cover": "posts/2025-05-09-mcp-protocol-comprehensive-guide/cover.png",
    "readingTime": "35 分钟",
    "path": "posts/2025-05-09-mcp-protocol-comprehensive-guide/README.md",
    "status": "published"
  }
];

export default async function handler(req, res) {
  // 设置CORS头部
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // 返回posts数据
    res.status(200).json(POSTS_DATA);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
} 