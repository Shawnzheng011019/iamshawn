/**
 * 博客前端脚本 - GitHub版本
 * 从GitHub仓库读取markdown文章，支持实时更新
 */

// 常量定义
const POSTS_PER_PAGE = 6; // 每页显示的文章数
const GITHUB_API_BASE = 'https://api.github.com/repos/Shawnzheng011019/iamshawn/contents';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/Shawnzheng011019/iamshawn/main';

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
    loadPostsFromGitHub();
    
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
 * 从GitHub加载文章列表
 */
async function loadPostsFromGitHub() {
    try {
        showLoadingState();
        
        // 获取文章索引
        const response = await fetch(`${GITHUB_RAW_BASE}/posts/posts.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const postsData = await response.json();
        allPosts = postsData.filter(post => post.status === 'published');
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 初始化显示
        filteredPosts = [...allPosts];
        renderPosts();
        
        hideLoadingState();
        
    } catch (error) {
        console.error('加载文章失败:', error);
        showErrorMessage('加载文章失败，请检查网络连接或稍后重试');
        showOfflineMessage();
    }
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
                    <p class="text-gray-500">正在从GitHub加载文章...</p>
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
                <p class="text-gray-400 mb-4">无法从GitHub加载文章，请检查网络连接</p>
                <button onclick="loadPostsFromGitHub()" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    重新加载
                </button>
            </div>
        `;
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
    elements.image.dataset.src = `${GITHUB_RAW_BASE}/${coverImage}`;
    elements.image.alt = post.title;
    
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
    if (!domCache.articleModal) return;
    
    try {
        // 显示模态框加载状态
        showModalLoading(post);
        
        // 从GitHub获取markdown内容
        const response = await fetch(`${GITHUB_RAW_BASE}/${post.path}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const markdownContent = await response.text();
        
        // 解析markdown为HTML（简单解析）
        const htmlContent = parseMarkdownToHTML(markdownContent);
        
        // 更新模态框内容
        updateModalContent(post, htmlContent);
        
        // 显示模态框
        domCache.articleModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
    } catch (error) {
        console.error('加载文章内容失败:', error);
        showErrorMessage('加载文章内容失败，请稍后重试');
        closeModal();
    }
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
        domCache.modalImage.src = `${GITHUB_RAW_BASE}/${post.cover}`;
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

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlog);
} else {
    initBlog();
} 