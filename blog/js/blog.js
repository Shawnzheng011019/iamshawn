/**
 * 博客前端脚本 - 优化版本
 * 处理博客文章的显示和交互，优化性能
 */

// 常量定义
const POSTS_PER_PAGE = 6; // 每页显示的文章数
const STORAGE_KEY = 'blog_posts'; // 本地存储键名

// DOM 元素缓存
let domCache = {};

// 全局变量
let allPosts = [];
let currentPage = 1;
let filteredPosts = [];
let isLoading = false;

// 图片懒加载Observer
let imageObserver = null;

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
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
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
    loadPosts();
    
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
 * 从本地存储加载博客文章
 */
function loadPosts() {
    try {
        // 从 localStorage 获取文章数据
        const postsData = localStorage.getItem(STORAGE_KEY);
        
        if (postsData) {
            const parsedData = JSON.parse(postsData);
            allPosts = parsedData.filter(post => post.status === '已发布');
            allPosts.sort((a, b) => new Date(b.date) - new Date(a.date)); // 按日期降序排序
        } else {
            // 示例文章（如果没有存储的文章）
            allPosts = generateSamplePosts();
            savePosts(allPosts);
        }
        
        // 初始化显示
        filteredPosts = [...allPosts];
        renderPosts();
    } catch (error) {
        console.error('加载文章时出错:', error);
        showErrorMessage('加载文章失败，请刷新页面重试');
    }
}

/**
 * 过滤文章
 * @param {string} query - 搜索关键词
 */
function filterPosts(query) {
    if (!query || query.trim() === '') {
        filteredPosts = [...allPosts];
    } else {
        query = query.toLowerCase().trim();
        // 使用更高效的过滤方法
        filteredPosts = allPosts.filter(post => {
            const searchFields = [
                post.title,
                post.content,
                post.summary,
                post.category
            ].join(' ').toLowerCase();
            
            return searchFields.includes(query);
        });
    }
    
    currentPage = 1; // 重置到第一页
    renderPosts();
}

/**
 * 渲染文章列表 - 优化版本
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
 * 渲染单个文章卡片 - 优化版本
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
    if (post.image) {
        elements.image.dataset.src = post.image;
        elements.image.alt = post.title;
    } else {
        // 使用高质量占位图
        const placeholderUrl = `https://picsum.photos/600/400?random=${post.id || Math.floor(Math.random() * 100)}`;
        elements.image.dataset.src = placeholderUrl;
        elements.image.alt = '文章配图';
    }
    
    // 添加到懒加载观察器
    if (imageObserver) {
        imageObserver.observe(elements.image);
    } else {
        // 降级处理：直接加载图片
        elements.image.src = elements.image.dataset.src;
    }
    
    // 设置其他数据
    elements.title.textContent = post.title;
    elements.date.textContent = formatDate(post.date);
    elements.category.textContent = post.category;
    elements.summary.textContent = post.summary;
    
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
 * 打开文章详情 - 优化版本
 * @param {Object} post - 文章对象 
 */
function openArticle(post) {
    if (!domCache.articleModal) return;
    
    // 批量更新模态框内容
    const updates = [
        [domCache.modalTitle, 'textContent', post.title],
        [domCache.modalDate, 'textContent', formatDate(post.date)],
        [domCache.modalCategory, 'textContent', post.category],
        [domCache.modalContent, 'innerHTML', post.content]
    ];
    
    updates.forEach(([element, property, value]) => {
        if (element) element[property] = value;
    });
    
    // 优化模态框图片加载
    if (domCache.modalImage && post.image) {
        domCache.modalImage.src = post.image;
        domCache.modalImage.alt = post.title;
        domCache.modalImage.style.display = 'block';
    } else if (domCache.modalImage) {
        domCache.modalImage.style.display = 'none';
    }
    
    // 显示模态框
    domCache.articleModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
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

/**
 * 渲染分页 - 优化版本
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
 * 保存文章到本地存储
 * @param {Array} posts - 文章数组
 */
function savePosts(posts) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
        console.error('保存文章时出错:', error);
        showErrorMessage('保存失败，请检查浏览器存储空间');
    }
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
 * 显示错误消息
 * @param {string} message - 错误消息
 */
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-20 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * 生成示例文章
 * @returns {Array} - 示例文章数组
 */
function generateSamplePosts() {
    return [
        {
            id: 1,
            title: "深入理解RAG系统：检索增强生成在实际应用中的实现",
            summary: "详细探讨RAG（Retrieval-Augmented Generation）系统的核心原理，从向量数据库到检索策略，再到生成模型的融合，分享在构建企业级RAG应用中的实践经验。",
            content: `
                <h2>什么是RAG系统</h2>
                <p>RAG（Retrieval-Augmented Generation）是一种结合了检索和生成的AI架构，它通过从大型文档库中检索相关信息来增强语言模型的生成能力。</p>
                
                <h2>核心组件</h2>
                <ul>
                    <li><strong>向量数据库</strong>：存储文档的向量表示</li>
                    <li><strong>检索器</strong>：根据查询检索相关文档</li>
                    <li><strong>生成器</strong>：基于检索结果生成回答</li>
                </ul>
                
                <h2>实现细节</h2>
                <p>在实际项目中，我们使用了Milvus作为向量数据库，BGE模型进行文档嵌入，ChatGLM作为生成模型。这套架构在企业文档问答场景中取得了显著效果。</p>
                
                <blockquote>
                    <p>"RAG系统的关键在于平衡检索精度和生成质量，需要在多个维度进行优化。"</p>
                </blockquote>
            `,
            category: "人工智能",
            date: "2024-01-15",
            image: "https://picsum.photos/600/400?random=1",
            status: "已发布"
        },
        {
            id: 2,
            title: "大语言模型微调实战：从LoRA到QLoRA的演进",
            summary: "分享在大语言模型微调过程中的技术选型和优化策略，重点对比LoRA和QLoRA两种参数高效微调方法的实际效果。",
            content: `
                <h2>微调的必要性</h2>
                <p>虽然通用大语言模型已经具备强大的能力，但在特定领域应用时，微调仍是提升性能的重要手段。</p>
                
                <h2>LoRA vs QLoRA</h2>
                <p>LoRA (Low-Rank Adaptation) 通过在原始权重矩阵旁边添加低秩矩阵来实现参数高效微调。QLoRA则进一步引入了量化技术，显著降低了显存需求。</p>
                
                <h2>实验结果</h2>
                <p>在我们的金融文本分类任务中，QLoRA相比LoRA节省了约40%的显存，同时保持了相似的性能表现。</p>
            `,
            category: "机器学习",
            date: "2024-01-10",
            image: "https://picsum.photos/600/400?random=2",
            status: "已发布"
        },
        {
            id: 3,
            title: "MCP协议深度解析：构建AI Agent的新标准",
            summary: "Model Context Protocol (MCP) 作为新兴的AI Agent通信标准，为构建更加智能和互联的AI系统提供了新的可能性。本文深入分析MCP的技术细节。",
            content: `
                <h2>MCP协议概述</h2>
                <p>Model Context Protocol (MCP) 是一种新的通信协议，旨在标准化AI模型之间的上下文共享和协作。</p>
                
                <h2>核心特性</h2>
                <ul>
                    <li>标准化的消息格式</li>
                    <li>高效的上下文传递</li>
                    <li>可扩展的插件系统</li>
                    <li>安全的通信机制</li>
                </ul>
                
                <h2>应用场景</h2>
                <p>MCP在多Agent协作、工具调用、知识共享等场景中展现出巨大潜力，特别是在构建复杂AI工作流时。</p>
            `,
            category: "AI协议",
            date: "2024-01-05",
            image: "https://picsum.photos/600/400?random=3",
            status: "已发布"
        },
        {
            id: 4,
            title: "向量数据库选型指南：Milvus vs Pinecone vs Weaviate",
            summary: "全面对比主流向量数据库的性能、功能和成本，为不同规模的AI应用提供选型建议。",
            content: `
                <h2>向量数据库的重要性</h2>
                <p>随着AI应用的普及，向量数据库成为了连接传统数据与AI模型的重要桥梁。选择合适的向量数据库对项目成功至关重要。</p>
                
                <h2>对比维度</h2>
                <table>
                    <tr>
                        <th>特性</th>
                        <th>Milvus</th>
                        <th>Pinecone</th>
                        <th>Weaviate</th>
                    </tr>
                    <tr>
                        <td>部署方式</td>
                        <td>开源/云服务</td>
                        <td>云服务</td>
                        <td>开源/云服务</td>
                    </tr>
                    <tr>
                        <td>性能</td>
                        <td>优秀</td>
                        <td>良好</td>
                        <td>良好</td>
                    </tr>
                </table>
                
                <h2>选型建议</h2>
                <p>对于需要本地部署的企业应用，Milvus是首选；对于快速原型开发，Pinecone提供了便捷的云服务；Weaviate则在GraphQL支持方面具有优势。</p>
            `,
            category: "数据库",
            date: "2023-12-28",
            image: "https://picsum.photos/600/400?random=4",
            status: "已发布"
        }
    ];
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlog);
} else {
    initBlog();
} 