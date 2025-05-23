/**
 * 博客管理系统脚本 - 处理博客文章的管理和编辑
 */

// 常量定义
const STORAGE_KEY = 'blog_posts'; // 本地存储键名
const ADMIN_KEY = 'blog_admin'; // 管理员凭据键名
const DEFAULT_USERNAME = 'admin'; // 默认用户名
const DEFAULT_PASSWORD = 'admin123'; // 默认密码

// DOM 元素 - 登录相关
const loginContainer = document.getElementById('login-container');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');

// DOM 元素 - 管理界面
const adminContainer = document.getElementById('admin-container');
const logoutBtn = document.getElementById('logout-btn');

// DOM 元素 - 导航
const dashboardBtn = document.getElementById('dashboard-btn');
const postsBtn = document.getElementById('posts-btn');
const newPostBtn = document.getElementById('new-post-btn');
const newPostBtn2 = document.getElementById('new-post-btn2');

// DOM 元素 - 内容区域
const dashboardSection = document.getElementById('dashboard-section');
const postsSection = document.getElementById('posts-section');
const editorSection = document.getElementById('editor-section');

// DOM 元素 - 仪表盘
const totalPostsEl = document.getElementById('total-posts');
const monthPostsEl = document.getElementById('month-posts');
const draftPostsEl = document.getElementById('draft-posts');
const recentPostsTable = document.getElementById('recent-posts-table');

// DOM 元素 - 文章列表
const allPostsTable = document.getElementById('all-posts-table');
const adminSearchInput = document.getElementById('admin-search-input');
const filterCategory = document.getElementById('filter-category');
const filterStatus = document.getElementById('filter-status');

// DOM 元素 - 编辑器
const editorTitle = document.getElementById('editor-title');
const postForm = document.getElementById('post-form');
const postIdInput = document.getElementById('post-id');
const postTitleInput = document.getElementById('post-title');
const postContent = document.getElementById('post-content');
const postStatusSelect = document.getElementById('post-status');
const postCategorySelect = document.getElementById('post-category');
const postDateInput = document.getElementById('post-date');
const postImageInput = document.getElementById('post-image');
const postSummaryInput = document.getElementById('post-summary');
const backBtn = document.getElementById('back-btn');
const cancelBtn = document.getElementById('cancel-btn');

// DOM 元素 - 删除确认
const deleteModal = document.getElementById('delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');

// 全局变量
let allPosts = [];
let currentPostId = null;
let lastActiveSection = null;

/**
 * 初始化管理系统
 */
function initAdmin() {
    // 设置事件监听器
    setupEventListeners();
    
    // 检查登录状态
    checkLoginStatus();
    
    // 初始化富文本编辑器
    initTinyMCE();
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 登录表单提交
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 退出登录
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // 导航按钮
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', () => showSection(dashboardSection));
    }
    
    if (postsBtn) {
        postsBtn.addEventListener('click', () => {
            showSection(postsSection);
            updateNavActive(postsBtn);
        });
    }
    
    if (newPostBtn) {
        newPostBtn.addEventListener('click', () => {
            showNewPostEditor();
            updateNavActive(newPostBtn);
        });
    }
    
    if (newPostBtn2) {
        newPostBtn2.addEventListener('click', showNewPostEditor);
    }
    
    // 返回按钮
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (lastActiveSection) {
                showSection(lastActiveSection);
            } else {
                showSection(dashboardSection);
                updateNavActive(dashboardBtn);
            }
        });
    }
    
    // 取消按钮
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm('确定要取消编辑吗？未保存的更改将丢失。')) {
                if (lastActiveSection) {
                    showSection(lastActiveSection);
                } else {
                    showSection(dashboardSection);
                    updateNavActive(dashboardBtn);
                }
            }
        });
    }
    
    // 文章表单提交
    if (postForm) {
        postForm.addEventListener('submit', handleSavePost);
    }
    
    // 搜索和筛选
    if (adminSearchInput) {
        adminSearchInput.addEventListener('input', debounce(filterAllPosts, 300));
    }
    
    if (filterCategory) {
        filterCategory.addEventListener('change', filterAllPosts);
    }
    
    if (filterStatus) {
        filterStatus.addEventListener('change', filterAllPosts);
    }
    
    // 删除确认对话框
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteModal.classList.add('hidden');
        });
    }
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            deletePost();
        });
    }
}

/**
 * 检查登录状态
 */
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        showAdminPanel();
        loadPosts();
        updateDashboard();
    } else {
        showLoginForm();
    }
}

/**
 * 处理登录请求
 * @param {Event} e - 表单提交事件
 */
function handleLogin(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // 获取保存的凭据或使用默认值
    const storedCredentials = localStorage.getItem(ADMIN_KEY);
    let adminUsername = DEFAULT_USERNAME;
    let adminPassword = DEFAULT_PASSWORD;
    
    if (storedCredentials) {
        const credentials = JSON.parse(storedCredentials);
        adminUsername = credentials.username;
        adminPassword = credentials.password;
    } else {
        // 保存默认凭据
        localStorage.setItem(ADMIN_KEY, JSON.stringify({
            username: adminUsername,
            password: adminPassword
        }));
    }
    
    // 验证凭据
    if (username === adminUsername && password === adminPassword) {
        // 登录成功
        sessionStorage.setItem('isLoggedIn', 'true');
        showAdminPanel();
        loadPosts();
        updateDashboard();
    } else {
        // 登录失败
        loginError.classList.remove('hidden');
        passwordInput.value = '';
    }
}

/**
 * 处理退出登录
 */
function handleLogout() {
    sessionStorage.removeItem('isLoggedIn');
    showLoginForm();
}

/**
 * 显示登录表单
 */
function showLoginForm() {
    if (loginContainer && adminContainer) {
        loginContainer.classList.remove('hidden');
        adminContainer.classList.add('hidden');
    }
}

/**
 * 显示管理面板
 */
function showAdminPanel() {
    if (loginContainer && adminContainer) {
        loginContainer.classList.add('hidden');
        adminContainer.classList.remove('hidden');
        showSection(dashboardSection);
        updateNavActive(dashboardBtn);
    }
}

/**
 * 显示指定的内容区域
 * @param {HTMLElement} section - 要显示的区域元素
 */
function showSection(section) {
    // 记住上一个活动的区域
    if (section !== editorSection) {
        lastActiveSection = section;
    }
    
    // 隐藏所有区域
    const sections = [dashboardSection, postsSection, editorSection];
    sections.forEach(s => {
        if (s) s.classList.add('hidden');
    });
    
    // 显示指定区域
    if (section) {
        section.classList.remove('hidden');
    }
}

/**
 * 更新导航栏活动状态
 * @param {HTMLElement} activeBtn - 当前活动的按钮
 */
function updateNavActive(activeBtn) {
    const navBtns = [dashboardBtn, postsBtn, newPostBtn];
    
    navBtns.forEach(btn => {
        if (btn) {
            btn.classList.remove('bg-primary/10', 'text-primary');
            btn.classList.add('hover:bg-gray-100');
        }
    });
    
    if (activeBtn) {
        activeBtn.classList.add('bg-primary/10', 'text-primary');
        activeBtn.classList.remove('hover:bg-gray-100');
    }
}

/**
 * 初始化富文本编辑器
 */
function initTinyMCE() {
    if (typeof tinymce !== 'undefined') {
        tinymce.init({
            selector: '#post-content',
            height: 500,
            menubar: true,
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
            content_style: 'body { font-family: "Inter", sans-serif; font-size: 16px; }'
        });
    }
}

/**
 * 从本地存储加载博客文章
 */
function loadPosts() {
    // 从 localStorage 获取文章数据
    const postsData = localStorage.getItem(STORAGE_KEY);
    
    if (postsData) {
        allPosts = JSON.parse(postsData);
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date)); // 按日期降序排序
    } else {
        // 示例文章
        allPosts = generateSamplePosts();
        savePosts(allPosts);
    }
    
    // 更新文章列表
    renderPostsList();
}

/**
 * 更新仪表盘数据
 */
function updateDashboard() {
    if (!totalPostsEl || !monthPostsEl || !draftPostsEl || !recentPostsTable) return;
    
    // 计算统计数据
    const totalPosts = allPosts.length;
    
    // 本月发布的文章
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthPosts = allPosts.filter(post => {
        const postDate = new Date(post.date);
        return postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear;
    }).length;
    
    // 草稿数
    const draftPosts = allPosts.filter(post => post.status === '草稿').length;
    
    // 更新统计数字
    totalPostsEl.textContent = totalPosts;
    monthPostsEl.textContent = monthPosts;
    draftPostsEl.textContent = draftPosts;
    
    // 渲染最近文章
    renderRecentPosts();
}

/**
 * 渲染最近文章列表
 */
function renderRecentPosts() {
    if (!recentPostsTable) return;
    
    recentPostsTable.innerHTML = '';
    
    // 获取最近5篇文章
    const recentPosts = [...allPosts].slice(0, 5);
    
    if (recentPosts.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                暂无文章，点击"写新文章"开始创作
            </td>
        `;
        recentPostsTable.appendChild(emptyRow);
    } else {
        recentPosts.forEach(post => {
            const row = createPostRow(post);
            recentPostsTable.appendChild(row);
        });
    }
}

/**
 * 渲染所有文章列表
 */
function renderPostsList() {
    if (!allPostsTable) return;
    
    allPostsTable.innerHTML = '';
    
    // 应用过滤
    let filteredPosts = [...allPosts];
    
    const searchQuery = adminSearchInput ? adminSearchInput.value.toLowerCase().trim() : '';
    const categoryFilter = filterCategory ? filterCategory.value : '';
    const statusFilter = filterStatus ? filterStatus.value : '';
    
    // 搜索过滤
    if (searchQuery) {
        filteredPosts = filteredPosts.filter(post => {
            return post.title.toLowerCase().includes(searchQuery) || 
                   post.content.toLowerCase().includes(searchQuery) || 
                   post.summary.toLowerCase().includes(searchQuery);
        });
    }
    
    // 分类过滤
    if (categoryFilter) {
        filteredPosts = filteredPosts.filter(post => post.category === categoryFilter);
    }
    
    // 状态过滤
    if (statusFilter) {
        filteredPosts = filteredPosts.filter(post => post.status === statusFilter);
    }
    
    if (filteredPosts.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                未找到符合条件的文章
            </td>
        `;
        allPostsTable.appendChild(emptyRow);
    } else {
        filteredPosts.forEach(post => {
            const row = createPostRow(post);
            allPostsTable.appendChild(row);
        });
    }
}

/**
 * 过滤所有文章列表
 */
function filterAllPosts() {
    renderPostsList();
}

/**
 * 创建文章行
 * @param {Object} post - 文章对象
 * @returns {HTMLElement} - 表格行元素
 */
function createPostRow(post) {
    const row = document.createElement('tr');
    
    // 状态标签样式
    let statusClass = 'bg-green-100 text-green-700';
    if (post.status === '草稿') {
        statusClass = 'bg-gray-100 text-gray-700';
    }
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">${post.title}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-500">${post.category}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-500">${formatDate(post.date)}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                ${post.status}
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-primary hover:text-primary/70 mr-3 edit-btn" data-id="${post.id}">
                <i class="fa-solid fa-edit"></i> 编辑
            </button>
            <button class="text-red-500 hover:text-red-700 delete-btn" data-id="${post.id}">
                <i class="fa-solid fa-trash-alt"></i> 删除
            </button>
        </td>
    `;
    
    // 添加编辑按钮事件
    const editBtn = row.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => editPost(post.id));
    }
    
    // 添加删除按钮事件
    const deleteBtn = row.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => showDeleteConfirm(post.id));
    }
    
    return row;
}

/**
 * 显示新文章编辑器
 */
function showNewPostEditor() {
    // 清空编辑器内容
    resetEditor();
    
    // 设置默认日期为今天
    const today = new Date().toISOString().substring(0, 10);
    if (postDateInput) {
        postDateInput.value = today;
    }
    
    // 显示编辑器
    showSection(editorSection);
    editorTitle.textContent = '写新文章';
    
    // 移除之前的文章ID
    currentPostId = null;
}

/**
 * 编辑文章
 * @param {string} postId - 文章ID
 */
function editPost(postId) {
    const post = allPosts.find(p => p.id === postId);
    
    if (!post) return;
    
    // 保存当前编辑的文章ID
    currentPostId = postId;
    
    // 重置编辑器
    resetEditor();
    
    // 填充数据
    if (postIdInput) postIdInput.value = post.id;
    if (postTitleInput) postTitleInput.value = post.title;
    if (tinymce && tinymce.activeEditor) {
        tinymce.activeEditor.setContent(post.content || '');
    }
    if (postStatusSelect) postStatusSelect.value = post.status;
    if (postCategorySelect) postCategorySelect.value = post.category;
    if (postDateInput) postDateInput.value = post.date;
    if (postImageInput) postImageInput.value = post.image || '';
    if (postSummaryInput) postSummaryInput.value = post.summary || '';
    
    // 显示编辑器
    showSection(editorSection);
    editorTitle.textContent = '编辑文章';
}

/**
 * 重置编辑器
 */
function resetEditor() {
    if (postForm) postForm.reset();
    if (tinymce && tinymce.activeEditor) {
        tinymce.activeEditor.setContent('');
    }
}

/**
 * 处理保存文章
 * @param {Event} e - 表单提交事件
 */
function handleSavePost(e) {
    e.preventDefault();
    
    // 获取表单数据
    const title = postTitleInput.value.trim();
    const content = tinymce.activeEditor.getContent();
    const status = postStatusSelect.value;
    const category = postCategorySelect.value;
    const date = postDateInput.value;
    const image = postImageInput.value.trim();
    const summary = postSummaryInput.value.trim();
    
    // 验证必填字段
    if (!title || !content || !date) {
        alert('请填写标题、内容和日期！');
        return;
    }
    
    // 生成摘要（如果没有提供）
    const finalSummary = summary || generateSummary(content);
    
    // 创建或更新文章
    if (currentPostId) {
        // 更新现有文章
        const index = allPosts.findIndex(post => post.id === currentPostId);
        
        if (index !== -1) {
            allPosts[index] = {
                ...allPosts[index],
                title,
                content,
                status,
                category,
                date,
                image,
                summary: finalSummary
            };
        }
    } else {
        // 创建新文章
        const newPost = {
            id: generateUniqueId(),
            title,
            content,
            status,
            category,
            date,
            image,
            summary: finalSummary
        };
        
        allPosts.unshift(newPost);
    }
    
    // 保存到本地存储
    savePosts(allPosts);
    
    // 更新UI
    updateDashboard();
    renderPostsList();
    
    // 返回上一个页面
    if (lastActiveSection) {
        showSection(lastActiveSection);
    } else {
        showSection(dashboardSection);
        updateNavActive(dashboardBtn);
    }
    
    // 显示成功提示
    alert(currentPostId ? '文章已更新！' : '文章已保存！');
}

/**
 * 显示删除确认对话框
 * @param {string} postId - 文章ID
 */
function showDeleteConfirm(postId) {
    currentPostId = postId;
    deleteModal.classList.remove('hidden');
}

/**
 * 删除文章
 */
function deletePost() {
    if (!currentPostId) return;
    
    // 查找文章索引
    const index = allPosts.findIndex(post => post.id === currentPostId);
    
    if (index !== -1) {
        // 从数组中删除
        allPosts.splice(index, 1);
        
        // 保存到本地存储
        savePosts(allPosts);
        
        // 更新UI
        updateDashboard();
        renderPostsList();
        
        // 关闭确认对话框
        deleteModal.classList.add('hidden');
        
        // 清除当前文章ID
        currentPostId = null;
        
        // 显示成功提示
        alert('文章已删除！');
    }
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
 * 生成唯一ID
 * @returns {string} - 唯一ID
 */
function generateUniqueId() {
    return 'post-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

/**
 * 从HTML内容生成摘要
 * @param {string} htmlContent - HTML内容
 * @returns {string} - 摘要文本
 */
function generateSummary(htmlContent) {
    // 创建临时元素以解析HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // 获取纯文本
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // 截取前100个字符作为摘要
    const summary = textContent.trim().substring(0, 150);
    
    return summary + (textContent.length > 150 ? '...' : '');
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
        },
        {
            id: 'sample-4',
            title: '向量数据库选型指南',
            summary: '深入比较Milvus、Pinecone、FAISS等主流向量数据库，帮助你为AI项目选择最合适的向量存储解决方案。',
            content: `<p>向量数据库已成为构建现代AI应用的关键基础设施。本文将帮助你在众多选择中找到最适合你项目的向量数据库。</p>
                      <h2>什么是向量数据库？</h2>
                      <p>向量数据库是专门设计用于存储、索引和检索高维向量数据的数据库系统。它们在以下AI应用中扮演着核心角色：</p>
                      <ul>
                          <li>语义搜索</li>
                          <li>推荐系统</li>
                          <li>图像识别</li>
                          <li>检索增强生成(RAG)</li>
                      </ul>
                      <h2>主流向量数据库比较</h2>
                      <h3>1. Milvus</h3>
                      <p><strong>优势</strong>：开源、可水平扩展、支持混合搜索、分区和多租户</p>
                      <p><strong>适用场景</strong>：企业级应用、需要高扩展性和混合查询的场景</p>
                      
                      <h3>2. Pinecone</h3>
                      <p><strong>优势</strong>：全托管服务、易于使用、高可用性</p>
                      <p><strong>适用场景</strong>：初创公司、快速原型开发、不想维护基础设施的团队</p>
                      
                      <h3>3. FAISS</h3>
                      <p><strong>优势</strong>：高性能、内存效率、丰富的索引类型</p>
                      <p><strong>适用场景</strong>：单机部署、研究环境、对性能要求极高的应用</p>
                      
                      <h2>技术选型考虑因素</h2>
                      <ol>
                          <li><strong>数据规模</strong>：预计向量数量和维度</li>
                          <li><strong>查询性能要求</strong>：QPS和延迟要求</li>
                          <li><strong>部署环境</strong>：云服务、本地部署或混合模式</li>
                          <li><strong>预算考量</strong>：开源vs商业、自管理vs托管服务</li>
                          <li><strong>特殊功能需求</strong>：混合查询、多字段过滤等</li>
                      </ol>
                      <p>在我的实践中，对于具有千万级向量和复杂查询需求的产品环境，Milvus是一个理想的选择；而对于快速验证概念或小型项目，Pinecone的易用性和零维护特性则非常有吸引力。</p>`,
            category: '技术分享',
            image: 'https://picsum.photos/600/400?random=4',
            date: '2024-06-10',
            status: '草稿'
        }
    ];
}

// 初始化博客管理系统
document.addEventListener('DOMContentLoaded', initAdmin);