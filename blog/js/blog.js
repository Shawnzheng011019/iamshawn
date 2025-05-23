/**
 * 博客前端脚本 - 处理博客文章的显示和交互
 */

// 常量定义
const POSTS_PER_PAGE = 6; // 每页显示的文章数
const STORAGE_KEY = 'blog_posts'; // 本地存储键名

// DOM 元素
const blogPostsContainer = document.getElementById('blog-posts');
const paginationContainer = document.getElementById('pagination');
const searchInput = document.getElementById('search-input');
const articleModal = document.getElementById('article-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalCategory = document.getElementById('modal-category');
const modalImage = document.getElementById('modal-image');
const modalContent = document.getElementById('modal-content');
const postTemplate = document.getElementById('blog-post-template');

// 全局变量
let allPosts = [];
let currentPage = 1;
let filteredPosts = [];

/**
 * 初始化博客页面
 */
function initBlog() {
    // 加载博客文章
    loadPosts();
    
    // 设置事件监听器
    setupEventListeners();
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 搜索输入框监听
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            filterPosts(this.value);
        }, 300));
    }
    
    // 关闭模态框按钮
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // 点击模态框外部关闭模态框
    window.addEventListener('click', function(e) {
        if (e.target === articleModal) {
            closeModal();
        }
    });
    
    // 键盘按下 Escape 键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !articleModal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

/**
 * 从本地存储加载博客文章
 */
function loadPosts() {
    // 从 localStorage 获取文章数据
    const postsData = localStorage.getItem(STORAGE_KEY);
    
    if (postsData) {
        allPosts = JSON.parse(postsData).filter(post => post.status === '已发布');
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date)); // 按日期降序排序
    } else {
        // 示例文章（如果没有存储的文章）
        allPosts = generateSamplePosts();
        savePosts(allPosts);
    }
    
    // 初始化显示
    filteredPosts = [...allPosts];
    renderPosts();
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
        filteredPosts = allPosts.filter(post => {
            return post.title.toLowerCase().includes(query) || 
                   post.content.toLowerCase().includes(query) || 
                   post.summary.toLowerCase().includes(query) ||
                   post.category.toLowerCase().includes(query);
        });
    }
    
    currentPage = 1; // 重置到第一页
    renderPosts();
}

/**
 * 渲染文章列表
 */
function renderPosts() {
    // 清空容器
    if (blogPostsContainer) {
        blogPostsContainer.innerHTML = '';
    }
    
    if (filteredPosts.length === 0) {
        // 没有文章时显示提示信息
        const noPostsMessage = document.createElement('div');
        noPostsMessage.className = 'col-span-full text-center py-12';
        noPostsMessage.innerHTML = `
            <div class="text-5xl text-gray-300 mb-4"><i class="fa-regular fa-file-lines"></i></div>
            <h3 class="text-xl font-bold text-gray-500 mb-2">暂无文章</h3>
            <p class="text-gray-400">没有找到符合条件的文章，请尝试其他搜索关键词</p>
        `;
        blogPostsContainer.appendChild(noPostsMessage);
    } else {
        // 计算当前页的文章
        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        const currentPagePosts = filteredPosts.slice(startIndex, endIndex);
        
        // 渲染文章卡片
        currentPagePosts.forEach(post => {
            const postElement = renderPostCard(post);
            blogPostsContainer.appendChild(postElement);
        });
    }
    
    // 渲染分页
    renderPagination();
}

/**
 * 渲染单个文章卡片
 * @param {Object} post - 文章对象
 * @returns {HTMLElement} - 文章卡片元素
 */
function renderPostCard(post) {
    const template = postTemplate.content.cloneNode(true);
    
    // 填充数据
    const image = template.querySelector('.post-image');
    const title = template.querySelector('.post-title');
    const date = template.querySelector('.post-date');
    const category = template.querySelector('.post-category');
    const summary = template.querySelector('.post-summary');
    const link = template.querySelector('.post-link');
    
    // 设置图片
    if (post.image) {
        image.src = post.image;
        image.alt = post.title;
    } else {
        // 默认图片
        image.src = `https://picsum.photos/600/400?random=${Math.floor(Math.random() * 100)}`;
        image.alt = '文章配图';
    }
    
    // 设置其他数据
    title.textContent = post.title;
    date.textContent = formatDate(post.date);
    category.textContent = post.category;
    summary.textContent = post.summary;
    
    // 设置点击事件
    const article = template.querySelector('article');
    article.addEventListener('click', () => openArticle(post));
    
    link.addEventListener('click', (e) => {
        e.preventDefault();
        openArticle(post);
    });
    
    return template;
}

/**
 * 打开文章详情
 * @param {Object} post - 文章对象 
 */
function openArticle(post) {
    modalTitle.textContent = post.title;
    modalDate.textContent = formatDate(post.date);
    modalCategory.textContent = post.category;
    
    if (post.image) {
        modalImage.src = post.image;
        modalImage.alt = post.title;
        modalImage.classList.remove('hidden');
    } else {
        modalImage.src = `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 100)}`;
        modalImage.alt = '文章配图';
    }
    
    modalContent.innerHTML = post.content;
    
    // 打开模态框
    articleModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

/**
 * 关闭文章详情模态框
 */
function closeModal() {
    articleModal.classList.add('hidden');
    document.body.style.overflow = ''; // 恢复背景滚动
}

/**
 * 渲染分页控件
 */
function renderPagination() {
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    
    if (totalPages <= 1) {
        return; // 只有一页，不显示分页
    }
    
    const paginationList = document.createElement('ul');
    paginationList.className = 'flex space-x-2';
    
    // 上一页按钮
    if (currentPage > 1) {
        const prevBtn = createPaginationButton('上一页', () => {
            currentPage--;
            renderPosts();
        });
        prevBtn.classList.add('flex', 'items-center');
        prevBtn.innerHTML = `<i class="fa-solid fa-chevron-left mr-2"></i> 上一页`;
        paginationList.appendChild(prevBtn);
    }
    
    // 页码按钮
    for (let i = 1; i <= totalPages; i++) {
        // 只显示当前页附近的页码
        if (
            i === 1 || // 第一页
            i === totalPages || // 最后一页
            (i >= currentPage - 1 && i <= currentPage + 1) // 当前页及其前后
        ) {
            const pageBtn = createPaginationButton(i.toString(), () => {
                currentPage = i;
                renderPosts();
            });
            
            // 当前页高亮
            if (i === currentPage) {
                pageBtn.classList.remove('bg-white', 'hover:bg-gray-50');
                pageBtn.classList.add('bg-primary', 'text-white', 'hover:bg-primary/90');
            }
            
            paginationList.appendChild(pageBtn);
        } else if (
            (i === currentPage - 2 && currentPage > 3) || 
            (i === currentPage + 2 && currentPage < totalPages - 2)
        ) {
            // 显示省略号
            const ellipsis = document.createElement('li');
            ellipsis.className = 'flex items-center px-3 py-2 text-gray-500';
            ellipsis.textContent = '...';
            paginationList.appendChild(ellipsis);
        }
    }
    
    // 下一页按钮
    if (currentPage < totalPages) {
        const nextBtn = createPaginationButton('下一页', () => {
            currentPage++;
            renderPosts();
        });
        nextBtn.classList.add('flex', 'items-center');
        nextBtn.innerHTML = `下一页 <i class="fa-solid fa-chevron-right ml-2"></i>`;
        paginationList.appendChild(nextBtn);
    }
    
    paginationContainer.appendChild(paginationList);
}

/**
 * 创建分页按钮
 * @param {string} text - 按钮文本
 * @param {Function} onClick - 点击回调
 * @returns {HTMLElement} - 按钮元素
 */
function createPaginationButton(text, onClick) {
    const button = document.createElement('li');
    button.className = 'bg-white border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors';
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

/**
 * 保存文章到本地存储
 * @param {Array} posts - 文章数组
 */
function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

/**
 * 格式化日期
 * @param {string} dateString - 日期字符串
 * @returns {string} - 格式化后的日期
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} - 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * 生成示例文章（当没有文章时用于展示）
 * @returns {Array} - 示例文章数组
 */
function generateSamplePosts() {
    return [
        {
            id: 'sample-1',
            title: 'RAG系统构建：从原理到实践',
            summary: '这篇文章详细介绍了检索增强生成(RAG)系统的构建，包括嵌入模型选择、向量数据库和大语言模型的集成等关键技术点。',
            content: `<p>随着大语言模型(LLM)的发展，检索增强生成(RAG)技术已经成为解决专业领域知识和最新信息需求的关键方法。</p>
                      <h2>什么是RAG?</h2>
                      <p>RAG结合了检索系统和生成式AI的优势，通过从知识库检索相关信息，然后将这些信息作为上下文提供给LLM，生成更准确、更相关的回答。</p>
                      <h2>RAG系统的核心组件</h2>
                      <ol>
                          <li><strong>文档处理与分块</strong>：将长文档切分成合适大小的块，便于检索</li>
                          <li><strong>嵌入模型</strong>：将文本转换为向量表示，用于语义搜索</li>
                          <li><strong>向量数据库</strong>：高效存储和检索文本向量</li>
                          <li><strong>大语言模型</strong>：基于检索到的上下文生成回答</li>
                      </ol>
                      <h2>实践案例</h2>
                      <p>在我的一个项目中，我们使用了以下技术栈构建了一个高效的RAG系统：</p>
                      <ul>
                          <li>文档处理：使用LangChain的文本分割器</li>
                          <li>嵌入模型：采用OpenAI的text-embedding-3-small</li>
                          <li>向量数据库：Milvus提供高性能向量搜索</li>
                          <li>LLM：GLM-4结合检索信息生成最终回答</li>
                      </ul>
                      <p>这种架构不仅提高了回答的准确性，还大大减少了幻觉现象的出现。</p>`,
            category: '技术分享',
            image: 'https://picsum.photos/600/400?random=1',
            date: '2024-07-15',
            status: '已发布'
        },
        {
            id: 'sample-2',
            title: '大语言模型微调最佳实践',
            summary: '本文分享了大语言模型微调的实用技巧，从数据准备到模型评估的完整流程，帮助你以最少的资源获得最好的效果。',
            content: `<p>大语言模型的微调对于特定领域的应用至关重要，本文将分享我在实践中总结的一些经验。</p>
                      <h2>数据准备的关键点</h2>
                      <p>高质量的训练数据是成功微调的基础。以下是几个关键考虑因素：</p>
                      <ul>
                          <li>数据多样性：确保覆盖目标任务的各种情况</li>
                          <li>数据质量：宁缺毋滥，低质量数据可能导致模型性能下降</li>
                          <li>指令格式一致性：保持提示词格式统一</li>
                      </ul>
                      <h2>微调策略选择</h2>
                      <p>根据资源和需求选择合适的微调方法：</p>
                      <ol>
                          <li><strong>LoRA微调</strong>：资源受限时的首选，仅训练少量参数</li>
                          <li><strong>QLoRA</strong>：在消费级GPU上微调大型模型的有效方法</li>
                          <li><strong>全参数微调</strong>：资源充足时可获得最佳性能</li>
                      </ol>
                      <h2>微调效果评估</h2>
                      <p>客观评估微调效果至关重要：</p>
                      <ul>
                          <li>设置明确的评估指标</li>
                          <li>准备独立的测试集</li>
                          <li>与基线模型进行对比</li>
                          <li>考虑人工评估与自动评估相结合</li>
                      </ul>
                      <p>在我的项目中，通过精心设计的200条训练数据，使用QLoRA方法在RTX 4090上微调了Qwen-14B模型，显著提升了特定领域任务的性能。</p>`,
            category: '经验总结',
            image: 'https://picsum.photos/600/400?random=2',
            date: '2024-07-08',
            status: '已发布'
        },
        {
            id: 'sample-3',
            title: 'MCP系统：定制化AI助手开发实践',
            summary: '基于LangChain和FastAPI构建一个灵活的多功能对话助手(MCP)系统，实现工具调用、知识库查询等高级功能。',
            content: `<p>随着AI技术的发展，构建定制化的AI助手(MCP系统)已成为企业和开发者的重要需求。</p>
                     <h2>什么是MCP系统？</h2>
                     <p>MCP(Multi-functional Conversational Platform)系统是一种能够整合多种功能的对话式AI平台，可以执行工具调用、知识库查询、数据分析等任务。</p>
                     <h2>系统架构设计</h2>
                     <p>一个完整的MCP系统通常包含以下组件：</p>
                     <ol>
                         <li><strong>对话管理</strong>：处理用户输入，维护对话历史</li>
                         <li><strong>工具调用框架</strong>：允许AI使用外部工具和API</li>
                         <li><strong>知识库集成</strong>：连接各种数据源提供信息支持</li>
                         <li><strong>大语言模型</strong>：核心推理引擎，生成回复和决策</li>
                         <li><strong>安全与监控</strong>：确保系统安全可靠运行</li>
                     </ol>
                     <h2>技术实现要点</h2>
                     <p>在我的项目中，我们使用了以下技术栈：</p>
                     <ul>
                         <li>后端框架：FastAPI提供高性能API服务</li>
                         <li>工具调用：LangChain的Tool框架封装各种功能</li>
                         <li>向量存储：Milvus用于高效知识检索</li>
                         <li>LLM集成：支持多种模型，包括本地部署的Qwen和OpenAI的API</li>
                         <li>前端界面：Vue.js构建响应式用户界面</li>
                     </ul>
                     <h2>关键挑战与解决方案</h2>
                     <p>在开发过程中，我们遇到并解决了几个关键挑战：</p>
                     <ul>
                         <li>工具调用的鲁棒性：通过结构化输出和错误重试机制提高</li>
                         <li>上下文长度限制：实现智能上下文压缩算法</li>
                         <li>多轮对话连贯性：优化提示工程和对话管理</li>
                     </ul>
                     <p>这个MCP系统成功应用于企业内部知识管理和客户服务，大幅提升了工作效率。</p>`,
            category: '项目心得',
            image: 'https://picsum.photos/600/400?random=3',
            date: '2024-06-25',
            status: '已发布'
        }
    ];
}

// 初始化博客
document.addEventListener('DOMContentLoaded', initBlog); 