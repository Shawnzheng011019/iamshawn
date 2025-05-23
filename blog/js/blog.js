/**
 * 博客前端脚本 - 多源版本
 * 支持多数据源和智能降级，适配中国网络环境
 */

// 内嵌博客数据 - 避免网络请求问题
const EMBEDDED_POSTS_DATA = [
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
    "id": "milvus-integration-deepseacher",
    "title": "深度集成：Milvus与DeepSearcher结合实现高性能向量检索与智能分析",
    "date": "2025-05-15",
    "category": "技术实践",
    "tags": ["Milvus", "DeepSearcher", "向量数据库", "RAG", "大语言模型", "性能优化"],
    "summary": "本文深入探讨Milvus向量数据库与DeepSearcher的集成方案，包括架构设计、性能优化和实际应用案例，帮助开发者构建高性能的智能搜索系统。",
    "cover": "posts/2024-05-15-milvus-integration-deepseacher/cover.png",
    "readingTime": "22 分钟",
    "path": "posts/2024-05-15-milvus-integration-deepseacher/README.md",
    "status": "published"
  },
  {
    "id": "deepseacher-model-comparison",
    "title": "大模型对决：DeepSearcher中的GPT-4.1、o3-mini与DeepSeek R1性能评测",
    "date": "2025-05-10",
    "category": "人工智能",
    "tags": ["大语言模型", "DeepSearcher", "GPT-4.1", "o3-mini", "DeepSeek R1", "性能评测"],
    "summary": "通过实际测试对比分析GPT-4.1、o3-mini与DeepSeek R1三款大模型在DeepSearcher框架下的表现，为企业和开发者提供模型选择参考。",
    "cover": "posts/2024-05-10-deepseacher-model-comparison/cover.png",
    "readingTime": "15 分钟",
    "path": "posts/2024-05-10-deepseacher-model-comparison/README.md",
    "status": "published"
  },
  {
    "id": "deepseek-langchain-milvus",
    "title": "本地部署实战：DeepSeek R1结合LangChain与Milvus打造私有AI助手",
    "date": "2025-05-05",
    "category": "技术教程",
    "tags": ["DeepSeek R1", "LangChain", "Milvus", "本地部署", "私有化部署", "向量数据库"],
    "summary": "详细介绍如何在本地环境中部署DeepSeek R1模型，并结合LangChain与Milvus向量数据库构建一个功能完整的私有AI助手系统。",
    "cover": "posts/2024-05-05-deepseek-langchain-milvus/cover.png",
    "readingTime": "18 分钟",
    "path": "posts/2024-05-05-deepseek-langchain-milvus/README.md",
    "status": "published"
  },
  {
    "id": "deepseacher-open-source",
    "title": "重磅开源：DeepSearcher——告别传统RAG，打造本地版私有数据智能助手",
    "date": "2025-04-30",
    "category": "开源项目",
    "tags": ["DeepSearcher", "开源", "RAG", "向量数据库", "私有数据", "大语言模型"],
    "summary": "DeepSearcher正式开源！这是一款基于Agentic RAG架构的智能搜索与报告生成工具，能够基于私有数据执行复杂推理和生成专业报告，支持多种大语言模型和向量数据库。",
    "cover": "posts/2024-04-30-deepseacher-open-source/cover.png",
    "readingTime": "12 分钟",
    "path": "posts/2024-04-30-deepseacher-open-source/README.md",
    "status": "published"
  },
  {
    "id": "deepseek-tesla-analysis",
    "title": "AI智能分析：DeepSeek如何评估特斯拉的市场底部与投资价值",
    "date": "2025-04-25",
    "category": "人工智能应用",
    "tags": ["DeepSeek", "特斯拉", "市场分析", "AI投资", "大语言模型", "智能分析"],
    "summary": "本文探讨如何利用DeepSeek大模型分析特斯拉的市场状况和投资价值，展示AI在金融分析领域的应用潜力和实际效果。",
    "cover": "posts/2024-04-25-deepseek-tesla-analysis/cover.png",
    "readingTime": "14 分钟",
    "path": "posts/2024-04-25-deepseek-tesla-analysis/README.md",
    "status": "published"
  },
  {
    "id": "deepseacher-silicon-flow",
    "title": "开源实践：DeepSearcher结合Silicon Flow构建企业级私有化DeepResearch",
    "date": "2025-04-20",
    "category": "技术实践",
    "tags": ["DeepSearcher", "Silicon Flow", "私有化部署", "企业应用", "大语言模型", "工作流自动化"],
    "summary": "详细介绍如何结合DeepSearcher与Silicon Flow工作流引擎，构建一个功能完整的企业级私有化DeepResearch系统，实现智能数据分析、报告生成和工作流自动化。",
    "cover": "posts/2024-04-20-deepseacher-silicon-flow/cover.png",
    "readingTime": "20 分钟",
    "path": "posts/2024-04-20-deepseacher-silicon-flow/README.md",
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

// 常量定义
const POSTS_PER_PAGE = 6; // 每页显示的文章数

// 多数据源配置 - 按优先级排序
const DATA_SOURCES = [
    {
        name: 'Vercel Static',
        baseUrl: '',
        priority: 1,
        description: 'Vercel 静态文件',
        isStaticAPI: true
    },
    {
        name: 'Local Vercel',
        baseUrl: '',
        priority: 2,
        description: 'Vercel 本地部署'
    },
    {
        name: 'jsDelivr CDN',
        baseUrl: 'https://cdn.jsdelivr.net/gh/Shawnzheng011019/iamshawn@main',
        priority: 3,
        description: '国内 CDN 加速'
    },
    {
        name: 'GitHub Raw',
        baseUrl: 'https://raw.githubusercontent.com/Shawnzheng011019/iamshawn/main',
        priority: 4,
        description: '官方 GitHub'
    },
    {
        name: 'jsDelivr Backup',
        baseUrl: 'https://fastly.jsdelivr.net/gh/Shawnzheng011019/iamshawn@main',
        priority: 5,
        description: 'CDN 备用节点'
    },
    {
        name: 'Gitee Mirror',
        baseUrl: 'https://gitee.com/Shawnzheng011019/iamshawn/raw/master',
        priority: 6,
        description: 'Gitee 国内镜像'
    },
    {
        name: 'GitHub Proxy',
        baseUrl: 'https://ghproxy.com/https://raw.githubusercontent.com/Shawnzheng011019/iamshawn/main',
        priority: 7,
        description: 'GitHub 代理'
    }
];

// 图片CDN优化配置
const IMAGE_CDN_SOURCES = [
    {
        name: 'jsDelivr CDN',
        transform: (url) => url.replace('https://gitee.com/Shawnzheng011019/iamshawn/raw/master/', 'https://cdn.jsdelivr.net/gh/Shawnzheng011019/iamshawn@main/'),
        priority: 1
    },
    {
        name: 'Fastly CDN',
        transform: (url) => url.replace('https://gitee.com/Shawnzheng011019/iamshawn/raw/master/', 'https://fastly.jsdelivr.net/gh/Shawnzheng011019/iamshawn@main/'),
        priority: 2
    },
    {
        name: 'Gitee Raw',
        transform: (url) => url,
        priority: 3
    },
    {
        name: 'GitHub Raw',
        transform: (url) => url.replace('https://gitee.com/Shawnzheng011019/iamshawn/raw/master/', 'https://raw.githubusercontent.com/Shawnzheng011019/iamshawn/main/'),
        priority: 4
    }
];

// DOM 元素缓存
let domCache = {};

// 全局变量
let allPosts = [];
let currentPage = 1;
let filteredPosts = [];
let isLoading = false;
let currentDataSource = null;

// 图片懒加载Observer
let imageObserver = null;

// 缓存配置
const CACHE_KEYS = {
    POSTS: 'blog_posts_cache',
    POSTS_TIMESTAMP: 'blog_posts_timestamp',
    DATA_SOURCE: 'preferred_data_source'
};
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 图片缓存
const imageCache = new Map();
const imageLoadingPromises = new Map();

/**
 * 智能图片加载器
 */
class SmartImageLoader {
    constructor() {
        this.preloadQueue = new Set();
        this.isPreloading = false;
    }

    /**
     * 优化图片URL
     * @param {string} originalUrl - 原始图片URL
     * @returns {string} - 优化后的URL
     */
    optimizeImageUrl(originalUrl) {
        if (!originalUrl || originalUrl.startsWith('http://') || originalUrl.startsWith('https://picsum.photos')) {
            return originalUrl;
        }

        // 使用最优CDN
        const bestCDN = IMAGE_CDN_SOURCES[0];
        return bestCDN.transform(originalUrl);
    }

    /**
     * 预加载图片
     * @param {string} url - 图片URL
     * @returns {Promise<HTMLImageElement>}
     */
    async preloadImage(url) {
        if (!url) return null;

        const optimizedUrl = this.optimizeImageUrl(url);
        
        // 检查缓存
        if (imageCache.has(optimizedUrl)) {
            return imageCache.get(optimizedUrl);
        }

        // 检查是否正在加载
        if (imageLoadingPromises.has(optimizedUrl)) {
            return imageLoadingPromises.get(optimizedUrl);
        }

        // 创建加载Promise
        const loadingPromise = this.loadImageWithFallback(optimizedUrl);
        imageLoadingPromises.set(optimizedUrl, loadingPromise);

        try {
            const img = await loadingPromise;
            imageCache.set(optimizedUrl, img);
            return img;
        } finally {
            imageLoadingPromises.delete(optimizedUrl);
        }
    }

    /**
     * 带降级的图片加载
     * @param {string} url - 图片URL
     * @returns {Promise<HTMLImageElement>}
     */
    async loadImageWithFallback(url) {
        for (const cdn of IMAGE_CDN_SOURCES) {
            try {
                const cdnUrl = cdn.transform(url);
                const img = await this.loadSingleImage(cdnUrl);
                console.log(`图片从 ${cdn.name} 加载成功:`, cdnUrl);
                return img;
            } catch (error) {
                console.warn(`图片从 ${cdn.name} 加载失败:`, error.message);
                continue;
            }
        }
        
        // 所有CDN都失败，返回占位图片
        return this.createPlaceholderImage();
    }

    /**
     * 加载单个图片
     * @param {string} url - 图片URL
     * @returns {Promise<HTMLImageElement>}
     */
    loadSingleImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            const timeout = setTimeout(() => {
                reject(new Error('图片加载超时'));
            }, 8000); // 8秒超时

            img.onload = () => {
                clearTimeout(timeout);
                resolve(img);
            };

            img.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('图片加载失败'));
            };

            // 添加图片优化参数
            img.crossOrigin = 'anonymous';
            img.src = url;
        });
    }

    /**
     * 创建占位图片
     * @returns {HTMLImageElement}
     */
    createPlaceholderImage() {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // 绘制渐变背景
        const gradient = ctx.createLinearGradient(0, 0, 600, 400);
        gradient.addColorStop(0, '#f3f4f6');
        gradient.addColorStop(1, '#e5e7eb');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 600, 400);
        
        // 绘制图标
        ctx.fillStyle = '#9ca3af';
        ctx.font = '48px FontAwesome';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📷', 300, 200);
        
        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }

    /**
     * 批量预加载图片
     * @param {Array} urls - 图片URL数组
     */
    async batchPreload(urls) {
        if (this.isPreloading) return;
        
        this.isPreloading = true;
        const validUrls = urls.filter(url => url && !imageCache.has(this.optimizeImageUrl(url)));
        
        console.log(`开始预加载 ${validUrls.length} 张图片...`);
        
        // 分批加载，避免过载
        const batchSize = 3;
        for (let i = 0; i < validUrls.length; i += batchSize) {
            const batch = validUrls.slice(i, i + batchSize);
            await Promise.allSettled(batch.map(url => this.preloadImage(url)));
            
            // 短暂延迟，避免网络堵塞
            if (i + batchSize < validUrls.length) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        
        console.log('图片预加载完成');
        this.isPreloading = false;
    }
}

// 创建全局图片加载器实例
const smartImageLoader = new SmartImageLoader();

/**
 * 初始化DOM元素缓存
 */
function initDOMCache() {
    domCache = {
        blogPostsContainer: document.getElementById('blog-posts'),
        paginationContainer: document.getElementById('pagination'),
        searchInput: document.getElementById('search-input'),
        articleModal: document.getElementById('article-modal'),
        closeModalBtn: document.getElementById('close-modal'),
        modalTitle: document.getElementById('modal-title'),
        modalDate: document.getElementById('modal-date'),
        modalCategory: document.getElementById('modal-category'),
        modalImage: document.getElementById('modal-image'),
        modalContent: document.getElementById('modal-content'),
        postTemplate: document.getElementById('blog-post-template')
    };
}

/**
 * 初始化图片懒加载
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        // 使用智能图片加载器
                        smartImageLoader.preloadImage(img.dataset.src).then(loadedImg => {
                            if (loadedImg && img.isConnected) {
                                img.src = loadedImg.src;
                                img.classList.add('loaded');
                                img.removeAttribute('data-src');
                                
                                // 添加加载完成动画
                                img.style.opacity = '0';
                                img.style.transition = 'opacity 0.3s ease-in-out';
                                requestAnimationFrame(() => {
                                    img.style.opacity = '1';
                                });
                            }
                        }).catch(error => {
                            console.warn('图片加载失败:', error);
                            // 显示占位图片
                            img.src = smartImageLoader.createPlaceholderImage().src;
                            img.classList.add('error');
                        }).finally(() => {
                            imageObserver.unobserve(img);
                        });
                    }
                }
            });
        }, {
            rootMargin: '100px 0px', // 提前100px开始加载
            threshold: 0.01
        });
    }
}

/**
 * 初始化博客页面
 */
function initBlog() {
    if (isLoading) return;
    isLoading = true;
    
    // 初始化缓存和懒加载
    initDOMCache();
    initLazyLoading();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 加载博客文章
    loadPostsWithFallback();
    
    isLoading = false;
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 搜索输入框监听 - 使用防抖
    if (domCache.searchInput) {
        domCache.searchInput.addEventListener('input', debounce(function() {
            filterPosts(this.value);
        }, 300));
    }
    
    // 关闭模态框按钮
    if (domCache.closeModalBtn) {
        domCache.closeModalBtn.addEventListener('click', closeModal);
    }
    
    // 事件委托处理模态框外部点击
    document.addEventListener('click', function(e) {
        if (e.target === domCache.articleModal) {
            closeModal();
        }
    });
    
    // 键盘事件优化
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && domCache.articleModal && !domCache.articleModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

/**
 * 检测数据源可达性
 * @param {Object} source - 数据源配置
 * @returns {Promise<boolean>} - 是否可达
 */
async function testDataSource(source) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒超时
        
        const response = await fetch(`${source.baseUrl}/posts/posts.json`, {
            method: 'HEAD',
            signal: controller.signal,
            cache: 'no-cache'
        });
        
        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        console.warn(`数据源 ${source.name} 不可达:`, error.message);
        return false;
    }
}

/**
 * 获取最佳数据源
 * @returns {Promise<Object>} - 最佳数据源
 */
async function getBestDataSource() {
    // 检查是否有缓存的首选数据源
    const cachedSource = localStorage.getItem(CACHE_KEYS.DATA_SOURCE);
    if (cachedSource) {
        const source = DATA_SOURCES.find(s => s.name === cachedSource);
        if (source && await testDataSource(source)) {
            console.log(`使用缓存的数据源: ${source.name}`);
            return source;
        }
    }
    
    // 并行测试所有数据源
    console.log('正在测试数据源可达性...');
    const testPromises = DATA_SOURCES.map(async (source) => ({
        source,
        available: await testDataSource(source)
    }));
    
    const results = await Promise.all(testPromises);
    const availableSources = results
        .filter(r => r.available)
        .map(r => r.source)
        .sort((a, b) => a.priority - b.priority);
    
    if (availableSources.length === 0) {
        throw new Error('所有数据源都不可达');
    }
    
    const bestSource = availableSources[0];
    console.log(`选择最佳数据源: ${bestSource.name} (${bestSource.description})`);
    
    // 缓存首选数据源
    localStorage.setItem(CACHE_KEYS.DATA_SOURCE, bestSource.name);
    
    return bestSource;
}

/**
 * 从缓存加载数据
 * @returns {Array|null} - 缓存的文章数据
 */
function loadFromCache() {
    try {
        const cachedPosts = localStorage.getItem(CACHE_KEYS.POSTS);
        const cachedTimestamp = localStorage.getItem(CACHE_KEYS.POSTS_TIMESTAMP);
        
        if (cachedPosts && cachedTimestamp) {
            const timestamp = parseInt(cachedTimestamp);
            const now = Date.now();
            
            if (now - timestamp < CACHE_DURATION) {
                console.log('使用缓存数据');
                return JSON.parse(cachedPosts);
            }
        }
    } catch (error) {
        console.warn('缓存加载失败:', error);
    }
    
    return null;
}

/**
 * 保存数据到缓存
 * @param {Array} posts - 文章数据
 */
function saveToCache(posts) {
    try {
        localStorage.setItem(CACHE_KEYS.POSTS, JSON.stringify(posts));
        localStorage.setItem(CACHE_KEYS.POSTS_TIMESTAMP, Date.now().toString());
        console.log('数据已缓存');
    } catch (error) {
        console.warn('缓存保存失败:', error);
    }
}

/**
 * 带降级策略的文章加载
 */
async function loadPostsWithFallback() {
    try {
        showLoadingState();
        
        // 优先使用内嵌数据
        if (EMBEDDED_POSTS_DATA && EMBEDDED_POSTS_DATA.length > 0) {
            console.log('使用内嵌博客数据');
            allPosts = EMBEDDED_POSTS_DATA.filter(post => post.status === 'published');
            allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            filteredPosts = [...allPosts];
            renderPosts();
            hideLoadingState();
            showSuccessMessage('博客数据加载完成');
            return;
        }
        
        // 尝试从缓存加载
        const cachedPosts = loadFromCache();
        if (cachedPosts) {
            allPosts = cachedPosts.filter(post => post.status === 'published');
            allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            filteredPosts = [...allPosts];
            renderPosts();
            hideLoadingState();
            
            // 预加载当前页面的图片
            preloadCurrentPageImages();
            
            // 后台更新数据
            updatePostsInBackground();
            return;
        }
        
        // 获取最佳数据源
        currentDataSource = await getBestDataSource();
        
        // 从最佳数据源加载
        const postsData = await fetchPostsData(currentDataSource);
        
        allPosts = postsData.filter(post => post.status === 'published');
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 优化图片URL为当前数据源
        allPosts.forEach(post => {
            if (post.cover && !post.cover.startsWith('http')) {
                post.cover = smartImageLoader.optimizeImageUrl(`${currentDataSource.baseUrl}/${post.cover}`);
            }
            if (post.path && !post.path.startsWith('http')) {
                post.path = `${currentDataSource.baseUrl}/${post.path}`;
            }
        });
        
        // 缓存数据
        saveToCache(allPosts);
        
        // 初始化显示
        filteredPosts = [...allPosts];
        renderPosts();
        hideLoadingState();
        
        // 预加载当前页面的图片
        preloadCurrentPageImages();
        
        // 智能预加载下一页图片
        setTimeout(() => preloadNextPageImages(), 2000);
        
        showSuccessMessage(`已连接到数据源: ${currentDataSource.name}`);
        
    } catch (error) {
        console.error('加载文章失败:', error);
        handleLoadingError();
    }
}

/**
 * 后台更新数据
 */
async function updatePostsInBackground() {
    try {
        console.log('后台更新数据中...');
        const source = await getBestDataSource();
        const postsData = await fetchPostsData(source);
        
        // 静默更新缓存
        const updatedPosts = postsData.filter(post => post.status === 'published');
        updatedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        updatedPosts.forEach(post => {
            if (post.cover && !post.cover.startsWith('http')) {
                post.cover = `${source.baseUrl}/${post.cover}`;
            }
            if (post.path && !post.path.startsWith('http')) {
                post.path = `${source.baseUrl}/${post.path}`;
            }
        });
        
        saveToCache(updatedPosts);
        console.log('后台数据更新完成');
        
    } catch (error) {
        console.warn('后台更新失败:', error);
    }
}

/**
 * 从指定数据源获取文章数据
 * @param {Object} source - 数据源配置
 * @returns {Promise<Array>} - 文章数据
 */
async function fetchPostsData(source) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
    
    try {
        let url;
        if (source.isApi) {
            // API端点直接返回数据
            url = `${source.baseUrl}/posts`;
        } else if (source.isStaticAPI) {
            // 静态API文件
            url = `${source.baseUrl}/api-posts.json`;
        } else {
            // 静态文件端点
            url = `${source.baseUrl}/posts/posts.json`;
        }
        
        const response = await fetch(url, {
            signal: controller.signal,
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * 处理加载错误
 */
function handleLoadingError() {
    // 尝试从本地存储加载任何可用的缓存数据
    try {
        const lastCachedPosts = localStorage.getItem(CACHE_KEYS.POSTS);
        if (lastCachedPosts) {
            console.log('使用过期缓存数据');
            const posts = JSON.parse(lastCachedPosts);
            allPosts = posts.filter(post => post.status === 'published');
            allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            filteredPosts = [...allPosts];
            renderPosts();
            hideLoadingState();
            showWarningMessage('网络连接问题，显示缓存内容');
            return;
        }
    } catch (error) {
        console.warn('缓存数据加载失败:', error);
    }
    
    // 显示离线消息
    showOfflineMessage();
    hideLoadingState();
}

/**
 * 显示加载状态
 */
function showLoadingState() {
    if (domCache.blogPostsContainer) {
        domCache.blogPostsContainer.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-12">
                <div class="text-center">
                    <div class="loading-spinner mx-auto mb-4"></div>
                    <p class="text-gray-500">正在智能选择最佳数据源...</p>
                    <p class="text-sm text-gray-400 mt-2">支持多CDN加速，确保稳定访问</p>
                </div>
            </div>
        `;
    }
}

/**
 * 隐藏加载状态
 */
function hideLoadingState() {
    // 加载完成，移除加载指示器
    const loadingElement = document.querySelector('.loading-spinner');
    if (loadingElement) {
        loadingElement.parentElement.parentElement.remove();
    }
}

/**
 * 显示离线消息
 */
function showOfflineMessage() {
    if (domCache.blogPostsContainer) {
        domCache.blogPostsContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-5xl text-gray-300 mb-4"><i class="fa-solid fa-wifi-slash"></i></div>
                <h3 class="text-xl font-bold text-gray-500 mb-2">网络连接问题</h3>
                <p class="text-gray-400 mb-4">无法从任何数据源加载文章</p>
                <div class="text-sm text-gray-500 mb-4">
                    <p>已尝试以下数据源：</p>
                    <ul class="mt-2 space-y-1">
                        ${DATA_SOURCES.map(source => `<li>• ${source.name} (${source.description})</li>`).join('')}
                    </ul>
                </div>
                <button onclick="retryLoading()" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    重新加载
                </button>
            </div>
        `;
    }
}

/**
 * 重试加载
 */
window.retryLoading = function() {
    // 清除缓存的数据源偏好
    localStorage.removeItem(CACHE_KEYS.DATA_SOURCE);
    loadPostsWithFallback();
};

/**
 * 过滤文章
 * @param {string} query - 搜索关键词
 */
function filterPosts(query) {
    if (!query || query.trim() === '') {
        filteredPosts = [...allPosts];
    } else {
        query = query.toLowerCase().trim();
        filteredPosts = allPosts.filter(post => {
            const searchFields = [
                post.title,
                post.summary,
                post.category,
                ...(post.tags || [])
            ].join(' ').toLowerCase();
            
            return searchFields.includes(query);
        });
    }
    
    currentPage = 1; // 重置到第一页
    renderPosts();
}

/**
 * 渲染文章列表
 */
function renderPosts() {
    if (!domCache.blogPostsContainer) return;
    
    // 使用DocumentFragment优化DOM操作
    const fragment = document.createDocumentFragment();
    
    if (filteredPosts.length === 0) {
        // 没有文章时显示提示信息
        const noPostsMessage = createNoPostsMessage();
        fragment.appendChild(noPostsMessage);
    } else {
        // 计算当前页的文章
        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        const currentPagePosts = filteredPosts.slice(startIndex, endIndex);
        
        // 渲染文章卡片
        currentPagePosts.forEach(post => {
            const postElement = renderPostCard(post);
            fragment.appendChild(postElement);
        });
    }
    
    // 一次性更新DOM
    domCache.blogPostsContainer.innerHTML = '';
    domCache.blogPostsContainer.appendChild(fragment);
    
    // 渲染分页
    renderPagination();
    
    // 延迟预加载当前页图片（DOM更新后）
    requestAnimationFrame(() => {
        preloadCurrentPageImages();
        // 延迟预加载下一页
        setTimeout(() => preloadNextPageImages(), 1000);
    });
}

/**
 * 创建无文章提示
 * @returns {HTMLElement}
 */
function createNoPostsMessage() {
    const noPostsMessage = document.createElement('div');
    noPostsMessage.className = 'col-span-full text-center py-12';
    noPostsMessage.innerHTML = `
        <div class="text-5xl text-gray-300 mb-4"><i class="fa-regular fa-file-lines"></i></div>
        <h3 class="text-xl font-bold text-gray-500 mb-2">暂无文章</h3>
        <p class="text-gray-400">没有找到符合条件的文章，请尝试其他搜索关键词</p>
    `;
    return noPostsMessage;
}

/**
 * 渲染单个文章卡片
 * @param {Object} post - 文章对象
 * @returns {HTMLElement} - 文章卡片元素
 */
function renderPostCard(post) {
    if (!domCache.postTemplate) return document.createElement('div');
    
    const template = domCache.postTemplate.content.cloneNode(true);
    
    // 批量获取元素以减少DOM查询
    const elements = {
        image: template.querySelector('.post-image'),
        title: template.querySelector('.post-title'),
        date: template.querySelector('.post-date'),
        category: template.querySelector('.post-category'),
        summary: template.querySelector('.post-summary'),
        link: template.querySelector('.post-link'),
        article: template.querySelector('article')
    };
    
    // 优化图片加载
    const coverImage = post.cover || `https://picsum.photos/600/400?random=${post.id}`;
    const optimizedImageUrl = smartImageLoader.optimizeImageUrl(coverImage);
    
    elements.image.dataset.src = optimizedImageUrl;
    elements.image.alt = post.title;
    elements.image.style.backgroundColor = '#f3f4f6'; // 加载时的背景色
    
    // 添加加载状态指示器
    elements.image.style.position = 'relative';
    elements.image.style.minHeight = '192px'; // 12rem = 192px
    
    // 添加到懒加载观察器
    if (imageObserver) {
        imageObserver.observe(elements.image);
    } else {
        // 降级处理：直接使用智能加载器
        smartImageLoader.preloadImage(optimizedImageUrl).then(loadedImg => {
            if (loadedImg && elements.image.isConnected) {
                elements.image.src = loadedImg.src;
            }
        }).catch(() => {
            elements.image.src = smartImageLoader.createPlaceholderImage().src;
        });
    }
    
    // 设置其他数据
    elements.title.textContent = post.title;
    elements.date.textContent = formatDate(post.date);
    elements.category.textContent = post.category;
    elements.summary.textContent = post.summary;
    
    // 添加阅读时间
    if (post.readingTime) {
        const readingTime = document.createElement('span');
        readingTime.className = 'text-sm text-gray-400 ml-2';
        readingTime.textContent = `· ${post.readingTime}`;
        elements.date.parentNode.appendChild(readingTime);
    }
    
    // 使用事件委托优化事件处理
    elements.article.addEventListener('click', (e) => {
        e.preventDefault();
        openArticle(post);
    });
    
    elements.link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openArticle(post);
    });
    
    return template;
}

/**
 * 打开文章详情
 * @param {Object} post - 文章对象
 */
async function openArticle(post) {
    // 导航到文章详情页，使用查询参数传递文章ID
    window.open(`blog/article.html?id=${post.id}`, '_blank');
}

/**
 * 从多数据源获取文章内容
 * @param {Object} post - 文章对象
 * @returns {Promise<string>} - Markdown内容
 */
async function fetchArticleContent(post) {
    const sources = currentDataSource ? [currentDataSource, ...DATA_SOURCES.filter(s => s !== currentDataSource)] : DATA_SOURCES;
    
    for (const source of sources) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8秒超时
            
            let url;
            if (post.path.startsWith('http')) {
                url = post.path;
            } else {
                url = `${source.baseUrl}/${post.path}`;
            }
            
            const response = await fetch(url, {
                signal: controller.signal,
                cache: 'default'
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                console.log(`从 ${source.name} 加载文章成功`);
                return await response.text();
            }
        } catch (error) {
            console.warn(`从 ${source.name} 加载文章失败:`, error.message);
            continue;
        }
    }
    
    throw new Error('所有数据源都无法加载文章内容');
}

/**
 * 显示模态框加载状态
 * @param {Object} post - 文章对象
 */
function showModalLoading(post) {
    const updates = [
        [domCache.modalTitle, 'textContent', post.title],
        [domCache.modalDate, 'textContent', formatDate(post.date)],
        [domCache.modalCategory, 'textContent', post.category],
        [domCache.modalContent, 'innerHTML', '<div class="flex justify-center items-center py-8"><div class="loading-spinner"></div><span class="ml-2">正在加载文章内容...</span></div>']
    ];
    
    updates.forEach(([element, property, value]) => {
        if (element) element[property] = value;
    });
    
    // 设置封面图片
    if (domCache.modalImage && post.cover) {
        domCache.modalImage.src = post.cover;
        domCache.modalImage.alt = post.title;
        domCache.modalImage.style.display = 'block';
    } else if (domCache.modalImage) {
        domCache.modalImage.style.display = 'none';
    }
}

/**
 * 更新模态框内容
 * @param {Object} post - 文章对象
 * @param {string} htmlContent - HTML内容
 */
function updateModalContent(post, htmlContent) {
    if (domCache.modalContent) {
        domCache.modalContent.innerHTML = htmlContent;
        
        // 添加代码高亮
        highlightCode();
        
        // 添加文章元信息
        addArticleMetadata(post);
    }
}

/**
 * 简单的Markdown到HTML转换
 * @param {string} markdown - Markdown内容
 * @returns {string} - HTML内容
 */
function parseMarkdownToHTML(markdown) {
    // 移除文章信息部分（## 文章信息 到 --- 之间的内容）
    markdown = markdown.replace(/## 文章信息[\s\S]*?---\s*\n/, '');
    
    // 基本的markdown转换
    let html = markdown
        // 标题
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // 粗体和斜体
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        // 代码块
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        // 行内代码
        .replace(/`([^`]+)`/gim, '<code>$1</code>')
        // 链接
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        // 引用
        .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
        // 列表
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
        // 段落
        .replace(/\n\n/gim, '</p><p>')
        .replace(/\n/gim, '<br>');
    
    // 包装段落
    html = '<p>' + html + '</p>';
    
    // 清理多余的段落标签
    html = html
        .replace(/<p><\/p>/gim, '')
        .replace(/<p>(<h[1-6]>)/gim, '$1')
        .replace(/(<\/h[1-6]>)<\/p>/gim, '$1')
        .replace(/<p>(<pre>)/gim, '$1')
        .replace(/(<\/pre>)<\/p>/gim, '$1')
        .replace(/<p>(<blockquote>)/gim, '$1')
        .replace(/(<\/blockquote>)<\/p>/gim, '$1');
    
    // 处理列表
    html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
    
    return html;
}

/**
 * 代码高亮（简单实现）
 */
function highlightCode() {
    const codeBlocks = domCache.modalContent.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        block.classList.add('language-javascript'); // 默认为JavaScript高亮
        // 这里可以集成Prism.js或highlight.js进行语法高亮
    });
}

/**
 * 添加文章元信息
 * @param {Object} post - 文章对象
 */
function addArticleMetadata(post) {
    if (!domCache.modalContent) return;
    
    const metadata = document.createElement('div');
    metadata.className = 'mt-8 pt-6 border-t border-gray-200';
    metadata.innerHTML = `
        <div class="flex flex-wrap gap-2 mb-4">
            ${post.tags ? post.tags.map(tag => `<span class="px-2 py-1 bg-primary/10 text-primary text-sm rounded">${tag}</span>`).join('') : ''}
        </div>
        <p class="text-sm text-gray-500">
            发布于 ${formatDate(post.date)} · ${post.readingTime || '预计阅读时间未知'}
        </p>
        ${currentDataSource ? `<p class="text-xs text-gray-400 mt-2">数据源: ${currentDataSource.name}</p>` : ''}
    `;
    
    domCache.modalContent.appendChild(metadata);
}

/**
 * 关闭模态框
 */
function closeModal() {
    if (domCache.articleModal) {
        domCache.articleModal.classList.add('hidden');
        document.body.style.overflow = ''; // 恢复滚动
    }
}

// 将closeModal函数添加到全局作用域，以便在模态框内容中可以调用
window.closeModal = closeModal;

/**
 * 渲染分页
 */
function renderPagination() {
    if (!domCache.paginationContainer) return;
    
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    
    if (totalPages <= 1) {
        domCache.paginationContainer.innerHTML = '';
        return;
    }
    
    const fragment = document.createDocumentFragment();
    
    // 上一页按钮
    if (currentPage > 1) {
        const prevBtn = createPaginationButton('上一页', () => {
            currentPage--;
            renderPosts();
            scrollToTop();
        });
        fragment.appendChild(prevBtn);
    }
    
    // 页码按钮逻辑优化
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    // 首页
    if (startPage > 1) {
        const firstBtn = createPaginationButton('1', () => {
            currentPage = 1;
            renderPosts();
            scrollToTop();
        });
        fragment.appendChild(firstBtn);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'px-4 py-2 text-gray-500';
            fragment.appendChild(ellipsis);
        }
    }
    
    // 中间页码
    for (let i = startPage; i <= endPage; i++) {
        const btn = createPaginationButton(i.toString(), () => {
            currentPage = i;
            renderPosts();
            scrollToTop();
        });
        
        if (i === currentPage) {
            btn.classList.add('bg-primary', 'text-white');
            btn.classList.remove('bg-white', 'text-dark');
        }
        
        fragment.appendChild(btn);
    }
    
    // 末页
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'px-4 py-2 text-gray-500';
            fragment.appendChild(ellipsis);
        }
        
        const lastBtn = createPaginationButton(totalPages.toString(), () => {
            currentPage = totalPages;
            renderPosts();
            scrollToTop();
        });
        fragment.appendChild(lastBtn);
    }
    
    // 下一页按钮
    if (currentPage < totalPages) {
        const nextBtn = createPaginationButton('下一页', () => {
            currentPage++;
            renderPosts();
            scrollToTop();
        });
        fragment.appendChild(nextBtn);
    }
    
    // 一次性更新DOM
    domCache.paginationContainer.innerHTML = '';
    domCache.paginationContainer.appendChild(fragment);
}

/**
 * 创建分页按钮
 * @param {string} text - 按钮文本
 * @param {Function} onClick - 点击事件处理函数
 * @returns {HTMLElement} - 按钮元素
 */
function createPaginationButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'px-4 py-2 mx-1 bg-white border border-gray-300 text-dark hover:bg-primary hover:text-white transition-colors rounded-lg';
    button.addEventListener('click', onClick);
    return button;
}

/**
 * 平滑滚动到顶部
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * 格式化日期
 * @param {string} dateString - 日期字符串
 * @returns {string} - 格式化后的日期
 */
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return '今天';
        } else if (diffDays === 1) {
            return '昨天';
        } else if (diffDays < 7) {
            return `${diffDays}天前`;
        } else {
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    } catch (error) {
        console.error('日期格式化错误:', error);
        return dateString;
    }
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} - 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 显示成功消息
 * @param {string} message - 成功消息
 */
function showSuccessMessage(message) {
    showNotification(message, 'success');
}

/**
 * 显示警告消息
 * @param {string} message - 警告消息
 */
function showWarningMessage(message) {
    showNotification(message, 'warning');
}

/**
 * 显示错误消息
 * @param {string} message - 错误消息
 */
function showErrorMessage(message) {
    showNotification(message, 'error');
}

/**
 * 显示通知
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型
 */
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };
    
    const icons = {
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle',
        info: 'fa-info-circle'
    };
    
    const notificationDiv = document.createElement('div');
    notificationDiv.className = `fixed top-20 right-4 ${colors[type]} text-white p-4 rounded-lg shadow-lg z-50 flex items-center`;
    notificationDiv.innerHTML = `
        <i class="fa-solid ${icons[type]} mr-2"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notificationDiv);
    
    setTimeout(() => {
        notificationDiv.remove();
    }, 5000);
}

/**
 * 预加载当前页面图片
 */
function preloadCurrentPageImages() {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const currentPagePosts = filteredPosts.slice(startIndex, endIndex);
    
    const imageUrls = currentPagePosts
        .map(post => post.cover)
        .filter(cover => cover && !cover.startsWith('https://picsum.photos'));
    
    if (imageUrls.length > 0) {
        smartImageLoader.batchPreload(imageUrls);
    }
}

/**
 * 预加载下一页图片
 */
function preloadNextPageImages() {
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    if (currentPage >= totalPages) return;
    
    const nextPageStartIndex = currentPage * POSTS_PER_PAGE;
    const nextPageEndIndex = nextPageStartIndex + POSTS_PER_PAGE;
    const nextPagePosts = filteredPosts.slice(nextPageStartIndex, nextPageEndIndex);
    
    const imageUrls = nextPagePosts
        .map(post => post.cover)
        .filter(cover => cover && !cover.startsWith('https://picsum.photos'));
    
    if (imageUrls.length > 0) {
        console.log(`预加载下一页 ${imageUrls.length} 张图片`);
        smartImageLoader.batchPreload(imageUrls);
    }
}

/**
 * 预加载文章内图片
 * @param {string} content - 文章内容
 */
function preloadArticleImages(content) {
    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    const imageUrls = [];
    let match;
    
    while ((match = imageRegex.exec(content)) !== null) {
        const imageUrl = match[1];
        if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://picsum.photos')) {
            // 转换相对路径为绝对路径
            const fullUrl = imageUrl.startsWith('http') ? imageUrl : 
                           currentDataSource ? `${currentDataSource.baseUrl}/${imageUrl}` : imageUrl;
            imageUrls.push(fullUrl);
        }
    }
    
    if (imageUrls.length > 0) {
        console.log(`预加载文章内 ${imageUrls.length} 张图片`);
        smartImageLoader.batchPreload(imageUrls);
    }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlog);
} else {
    initBlog();
} 