/**
 * 博客管理系统脚本 - 优化版本
 * 处理博客文章的管理和编辑，优化性能
 */

// 常量定义
const STORAGE_KEY = 'blog_posts'; // 本地存储键名
const ADMIN_KEY = 'blog_admin'; // 管理员凭据键名
const DEFAULT_USERNAME = 'admin'; // 默认用户名
const DEFAULT_PASSWORD = 'admin123'; // 默认密码

// DOM 元素缓存
let domCache = {};

// 全局变量
let allPosts = [];
let currentPostId = null;
let lastActiveSection = null;
let tinyMCEInitialized = false;
let isLoading = false;

/**
 * 初始化DOM元素缓存
 */
function initDOMCache() {
    domCache = {
        // 登录相关
        loginContainer: document.getElementById('login-container'),
        loginForm: document.getElementById('login-form'),
        usernameInput: document.getElementById('username'),
        passwordInput: document.getElementById('password'),
        loginError: document.getElementById('login-error'),
        loginBtn: document.getElementById('login-btn'),
        loginText: document.getElementById('login-text'),
        loginSpinner: document.getElementById('login-spinner'),
        
        // 管理界面
        adminContainer: document.getElementById('admin-container'),
        logoutBtn: document.getElementById('logout-btn'),
        
        // 导航
        dashboardBtn: document.getElementById('dashboard-btn'),
        postsBtn: document.getElementById('posts-btn'),
        newPostBtn: document.getElementById('new-post-btn'),
        newPostBtn2: document.getElementById('new-post-btn2'),
        
        // 内容区域
        dashboardSection: document.getElementById('dashboard-section'),
        postsSection: document.getElementById('posts-section'),
        postEditorSection: document.getElementById('post-editor-section'),
        
        // 仪表盘
        totalPostsEl: document.getElementById('total-posts'),
        monthPostsEl: document.getElementById('month-posts'),
        draftPostsEl: document.getElementById('draft-posts'),
        recentPostsTable: document.getElementById('recent-posts-table'),
        
        // 文章列表
        postsTable: document.getElementById('posts-table'),
        searchPosts: document.getElementById('search-posts'),
        filterCategory: document.getElementById('filter-category'),
        filterStatus: document.getElementById('filter-status'),
        
        // 编辑器
        editorTitle: document.getElementById('editor-title'),
        postForm: document.getElementById('post-form'),
        postTitleInput: document.getElementById('post-title'),
        postContent: document.getElementById('post-content'),
        postCategoryInput: document.getElementById('post-category'),
        postImageInput: document.getElementById('post-image'),
        postSummaryInput: document.getElementById('post-summary'),
        backToPostsBtn: document.getElementById('back-to-posts'),
        cancelEditBtn: document.getElementById('cancel-edit'),
        saveText: document.getElementById('save-text'),
        saveSpinner: document.getElementById('save-spinner'),
        editorLoading: document.getElementById('editor-loading')
    };
}

/**
 * 初始化管理系统
 */
function initAdmin() {
    try {
        // 初始化DOM缓存
        initDOMCache();
        
        // 设置事件监听器
        setupEventListeners();
        
        // 检查登录状态
        checkLoginStatus();
    } catch (error) {
        console.error('初始化管理系统失败:', error);
        showErrorMessage('系统初始化失败，请刷新页面重试');
    }
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 登录表单提交
    if (domCache.loginForm) {
        domCache.loginForm.addEventListener('submit', handleLogin);
    }
    
    // 退出登录
    if (domCache.logoutBtn) {
        domCache.logoutBtn.addEventListener('click', handleLogout);
    }
    
    // 导航按钮
    if (domCache.dashboardBtn) {
        domCache.dashboardBtn.addEventListener('click', () => {
            showSection(domCache.dashboardSection);
            updateNavActive(domCache.dashboardBtn);
        });
    }
    
    if (domCache.postsBtn) {
        domCache.postsBtn.addEventListener('click', () => {
            showSection(domCache.postsSection);
            updateNavActive(domCache.postsBtn);
        });
    }
    
    if (domCache.newPostBtn) {
        domCache.newPostBtn.addEventListener('click', () => {
            showNewPostEditor();
            updateNavActive(domCache.newPostBtn);
        });
    }
    
    if (domCache.newPostBtn2) {
        domCache.newPostBtn2.addEventListener('click', showNewPostEditor);
    }
    
    // 返回按钮
    if (domCache.backToPostsBtn) {
        domCache.backToPostsBtn.addEventListener('click', () => {
            showSection(domCache.postsSection);
            updateNavActive(domCache.postsBtn);
        });
    }
    
    // 取消按钮
    if (domCache.cancelEditBtn) {
        domCache.cancelEditBtn.addEventListener('click', () => {
            if (confirm('确定要取消编辑吗？未保存的更改将丢失。')) {
                showSection(domCache.postsSection);
                updateNavActive(domCache.postsBtn);
            }
        });
    }
    
    // 文章表单提交
    if (domCache.postForm) {
        domCache.postForm.addEventListener('submit', handleSavePost);
    }
    
    // 搜索和筛选
    if (domCache.searchPosts) {
        domCache.searchPosts.addEventListener('input', debounce(filterAllPosts, 300));
    }
    
    if (domCache.filterCategory) {
        domCache.filterCategory.addEventListener('change', filterAllPosts);
    }
    
    if (domCache.filterStatus) {
        domCache.filterStatus.addEventListener('change', filterAllPosts);
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
async function handleLogin(e) {
    e.preventDefault();
    
    if (isLoading) return;
    isLoading = true;
    
    // 显示加载状态
    if (domCache.loginText) domCache.loginText.textContent = '登录中...';
    if (domCache.loginSpinner) domCache.loginSpinner.classList.remove('hidden');
    if (domCache.loginBtn) domCache.loginBtn.disabled = true;
    
    try {
        const username = domCache.usernameInput.value.trim();
        const password = domCache.passwordInput.value.trim();
        
        // 模拟登录延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
            sessionStorage.setItem('isLoggedIn', 'true');
            showAdminPanel();
            loadPosts();
            updateDashboard();
            hideLoginError();
        } else {
            showLoginError();
        }
    } catch (error) {
        console.error('登录错误:', error);
        showLoginError();
    } finally {
        // 恢复按钮状态
        if (domCache.loginText) domCache.loginText.textContent = '登录';
        if (domCache.loginSpinner) domCache.loginSpinner.classList.add('hidden');
        if (domCache.loginBtn) domCache.loginBtn.disabled = false;
        isLoading = false;
    }
}

/**
 * 显示登录错误
 */
function showLoginError() {
    if (domCache.loginError) {
        domCache.loginError.classList.remove('hidden');
        domCache.loginError.textContent = '用户名或密码错误';
    }
}

/**
 * 隐藏登录错误
 */
function hideLoginError() {
    if (domCache.loginError) {
        domCache.loginError.classList.add('hidden');
    }
}

/**
 * 处理退出登录
 */
function handleLogout() {
    sessionStorage.removeItem('isLoggedIn');
    showLoginForm();
    
    // 清理TinyMCE
    if (tinyMCEInitialized && typeof tinymce !== 'undefined') {
        tinymce.remove('#post-content');
        tinyMCEInitialized = false;
    }
}

/**
 * 显示登录表单
 */
function showLoginForm() {
    if (domCache.loginContainer) domCache.loginContainer.classList.remove('hidden');
    if (domCache.adminContainer) domCache.adminContainer.classList.add('hidden');
    
    // 清空表单
    if (domCache.usernameInput) domCache.usernameInput.value = '';
    if (domCache.passwordInput) domCache.passwordInput.value = '';
    hideLoginError();
}

/**
 * 显示管理面板
 */
function showAdminPanel() {
    if (domCache.loginContainer) domCache.loginContainer.classList.add('hidden');
    if (domCache.adminContainer) domCache.adminContainer.classList.remove('hidden');
    
    // 默认显示仪表盘
    showSection(domCache.dashboardSection);
    updateNavActive(domCache.dashboardBtn);
}

/**
 * 显示指定区域
 * @param {HTMLElement} section - 要显示的区域
 */
function showSection(section) {
    // 隐藏所有区域
    const sections = [domCache.dashboardSection, domCache.postsSection, domCache.postEditorSection];
    sections.forEach(s => {
        if (s) s.classList.add('hidden');
    });
    
    // 显示指定区域
    if (section) {
        section.classList.remove('hidden');
        lastActiveSection = section;
    }
}

/**
 * 更新导航按钮状态
 * @param {HTMLElement} activeBtn - 活动按钮
 */
function updateNavActive(activeBtn) {
    // 重置所有按钮样式
    const navBtns = [domCache.dashboardBtn, domCache.postsBtn, domCache.newPostBtn];
    navBtns.forEach(btn => {
        if (btn) {
            btn.classList.remove('bg-primary/10', 'text-primary');
            btn.classList.add('hover:bg-gray-100');
        }
    });
    
    // 设置活动按钮样式
    if (activeBtn) {
        activeBtn.classList.add('bg-primary/10', 'text-primary');
        activeBtn.classList.remove('hover:bg-gray-100');
    }
}

/**
 * 延迟初始化富文本编辑器
 */
async function initTinyMCE() {
    if (tinyMCEInitialized) return;
    
    try {
        // 显示加载指示器
        if (domCache.editorLoading) domCache.editorLoading.classList.remove('hidden');
        if (domCache.postContent) domCache.postContent.classList.add('hidden');
        
        // 加载TinyMCE
        await loadTinyMCE();
        
        // 初始化编辑器
        await new Promise((resolve, reject) => {
            tinymce.init({
                selector: '#post-content',
                height: 400,
                menubar: false,
                plugins: [
                    'lists', 'link', 'image', 'charmap', 'preview',
                    'searchreplace', 'visualblocks', 'code',
                    'insertdatetime', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist | ' +
                    'link image | removeformat | help',
                content_style: 'body { font-family: "Inter", sans-serif; font-size: 16px; }',
                setup: function(editor) {
                    editor.on('init', function() {
                        tinyMCEInitialized = true;
                        resolve();
                    });
                },
                branding: false,
                promotion: false
            });
        });
        
        // 隐藏加载指示器
        if (domCache.editorLoading) domCache.editorLoading.classList.add('hidden');
        if (domCache.postContent) domCache.postContent.classList.remove('hidden');
        
    } catch (error) {
        console.error('TinyMCE初始化失败:', error);
        showErrorMessage('编辑器加载失败，请刷新页面重试');
        
        // 降级处理：使用普通文本框
        if (domCache.editorLoading) domCache.editorLoading.classList.add('hidden');
        if (domCache.postContent) domCache.postContent.classList.remove('hidden');
    }
}

/**
 * 从本地存储加载博客文章
 */
function loadPosts() {
    try {
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
        
        // 更新分类选项
        updateCategoryOptions();
        
        // 更新文章列表
        renderPostsList();
    } catch (error) {
        console.error('加载文章失败:', error);
        showErrorMessage('加载文章失败，请刷新页面重试');
    }
}

/**
 * 更新分类选项
 */
function updateCategoryOptions() {
    if (!domCache.filterCategory) return;
    
    // 获取所有分类
    const categories = [...new Set(allPosts.map(post => post.category))];
    
    // 清空现有选项（保留"所有分类"）
    domCache.filterCategory.innerHTML = '<option value="">所有分类</option>';
    
    // 添加分类选项
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        domCache.filterCategory.appendChild(option);
    });
}

/**
 * 更新仪表盘数据
 */
function updateDashboard() {
    if (!domCache.totalPostsEl || !domCache.monthPostsEl || !domCache.draftPostsEl) return;
    
    try {
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
        domCache.totalPostsEl.textContent = totalPosts;
        domCache.monthPostsEl.textContent = monthPosts;
        domCache.draftPostsEl.textContent = draftPosts;
        
        // 渲染最近文章
        renderRecentPosts();
    } catch (error) {
        console.error('更新仪表盘失败:', error);
    }
}

/**
 * 渲染最近文章列表
 */
function renderRecentPosts() {
    if (!domCache.recentPostsTable) return;
    
    // 使用DocumentFragment优化DOM操作
    const fragment = document.createDocumentFragment();
    
    // 获取最近5篇文章
    const recentPosts = [...allPosts].slice(0, 5);
    
    if (recentPosts.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                暂无文章，点击"写新文章"开始创作
            </td>
        `;
        fragment.appendChild(emptyRow);
    } else {
        recentPosts.forEach(post => {
            const row = createPostRow(post);
            fragment.appendChild(row);
        });
    }
    
    // 一次性更新DOM
    domCache.recentPostsTable.innerHTML = '';
    domCache.recentPostsTable.appendChild(fragment);
}

/**
 * 渲染所有文章列表
 */
function renderPostsList() {
    if (!domCache.postsTable) return;
    
    // 使用DocumentFragment优化DOM操作
    const fragment = document.createDocumentFragment();
    
    // 应用过滤
    const filteredPosts = getFilteredPosts();
    
    if (filteredPosts.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                未找到符合条件的文章
            </td>
        `;
        fragment.appendChild(emptyRow);
    } else {
        filteredPosts.forEach(post => {
            const row = createPostRow(post);
            fragment.appendChild(row);
        });
    }
    
    // 一次性更新DOM
    domCache.postsTable.innerHTML = '';
    domCache.postsTable.appendChild(fragment);
}

/**
 * 获取过滤后的文章
 * @returns {Array} 过滤后的文章数组
 */
function getFilteredPosts() {
    let filteredPosts = [...allPosts];
    
    const searchQuery = domCache.searchPosts ? domCache.searchPosts.value.toLowerCase().trim() : '';
    const categoryFilter = domCache.filterCategory ? domCache.filterCategory.value : '';
    const statusFilter = domCache.filterStatus ? domCache.filterStatus.value : '';
    
    // 搜索过滤
    if (searchQuery) {
        filteredPosts = filteredPosts.filter(post => {
            const searchFields = [post.title, post.content, post.summary].join(' ').toLowerCase();
            return searchFields.includes(searchQuery);
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
    
    return filteredPosts;
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
            <div class="text-sm font-medium text-gray-900">${escapeHtml(post.title)}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-500">${escapeHtml(post.category)}</div>
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
    
    // 添加事件监听器
    const editBtn = row.querySelector('.edit-btn');
    const deleteBtn = row.querySelector('.delete-btn');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => editPost(post.id));
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => showDeleteConfirm(post.id));
    }
    
    return row;
}

/**
 * 显示新文章编辑器
 */
async function showNewPostEditor() {
    currentPostId = null;
    
    if (domCache.editorTitle) {
        domCache.editorTitle.textContent = '写新文章';
    }
    
    resetEditor();
    
    // 延迟初始化TinyMCE
    await initTinyMCE();
    
    showSection(domCache.postEditorSection);
}

/**
 * 编辑文章
 * @param {string} postId - 文章ID
 */
async function editPost(postId) {
    const post = allPosts.find(p => p.id === postId);
    if (!post) return;
    
    currentPostId = postId;
    
    if (domCache.editorTitle) {
        domCache.editorTitle.textContent = '编辑文章';
    }
    
    // 延迟初始化TinyMCE
    await initTinyMCE();
    
    // 填充表单数据
    if (domCache.postTitleInput) domCache.postTitleInput.value = post.title;
    if (domCache.postCategoryInput) domCache.postCategoryInput.value = post.category;
    if (domCache.postSummaryInput) domCache.postSummaryInput.value = post.summary;
    if (domCache.postImageInput) domCache.postImageInput.value = post.image || '';
    
    // 设置文章状态
    const statusRadio = document.querySelector(`input[name="post-status"][value="${post.status}"]`);
    if (statusRadio) statusRadio.checked = true;
    
    // 设置富文本内容
    if (tinyMCEInitialized && typeof tinymce !== 'undefined') {
        tinymce.get('post-content').setContent(post.content);
    } else if (domCache.postContent) {
        domCache.postContent.value = post.content;
    }
    
    showSection(domCache.postEditorSection);
}

/**
 * 重置编辑器
 */
function resetEditor() {
    if (domCache.postForm) {
        domCache.postForm.reset();
    }
    
    // 清空富文本编辑器
    if (tinyMCEInitialized && typeof tinymce !== 'undefined') {
        tinymce.get('post-content').setContent('');
    }
    
    // 默认选中"立即发布"
    const publishRadio = document.querySelector('input[name="post-status"][value="已发布"]');
    if (publishRadio) publishRadio.checked = true;
}

/**
 * 处理保存文章
 * @param {Event} e - 表单提交事件
 */
async function handleSavePost(e) {
    e.preventDefault();
    
    if (isLoading) return;
    isLoading = true;
    
    try {
        // 显示保存状态
        if (domCache.saveText) domCache.saveText.textContent = '保存中...';
        if (domCache.saveSpinner) domCache.saveSpinner.classList.remove('hidden');
        
        // 获取表单数据
        const title = domCache.postTitleInput ? domCache.postTitleInput.value.trim() : '';
        const category = domCache.postCategoryInput ? domCache.postCategoryInput.value.trim() : '';
        const summary = domCache.postSummaryInput ? domCache.postSummaryInput.value.trim() : '';
        const image = domCache.postImageInput ? domCache.postImageInput.value.trim() : '';
        const status = document.querySelector('input[name="post-status"]:checked')?.value || '已发布';
        
        // 获取富文本内容
        let content = '';
        if (tinyMCEInitialized && typeof tinymce !== 'undefined') {
            content = tinymce.get('post-content').getContent();
        } else if (domCache.postContent) {
            content = domCache.postContent.value;
        }
        
        // 验证必填字段
        if (!title || !category || !summary || !content) {
            showErrorMessage('请填写所有必填字段');
            return;
        }
        
        // 模拟保存延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const postData = {
            id: currentPostId || generateUniqueId(),
            title,
            category,
            summary: summary || generateSummary(content),
            content,
            image,
            status,
            date: currentPostId ? 
                (allPosts.find(p => p.id === currentPostId)?.date || new Date().toISOString().split('T')[0]) :
                new Date().toISOString().split('T')[0]
        };
        
        if (currentPostId) {
            // 编辑现有文章
            const index = allPosts.findIndex(p => p.id === currentPostId);
            if (index !== -1) {
                allPosts[index] = postData;
            }
        } else {
            // 添加新文章
            allPosts.unshift(postData);
        }
        
        // 保存到本地存储
        savePosts(allPosts);
        
        // 更新界面
        updateCategoryOptions();
        updateDashboard();
        renderPostsList();
        
        // 返回文章列表
        showSection(domCache.postsSection);
        updateNavActive(domCache.postsBtn);
        
        showSuccessMessage(currentPostId ? '文章更新成功！' : '文章发布成功！');
        
    } catch (error) {
        console.error('保存文章失败:', error);
        showErrorMessage('保存失败，请重试');
    } finally {
        // 恢复按钮状态
        if (domCache.saveText) domCache.saveText.textContent = '保存文章';
        if (domCache.saveSpinner) domCache.saveSpinner.classList.add('hidden');
        isLoading = false;
    }
}

/**
 * 显示删除确认
 * @param {string} postId - 文章ID
 */
function showDeleteConfirm(postId) {
    const post = allPosts.find(p => p.id === postId);
    if (!post) return;
    
    if (confirm(`确定要删除文章"${post.title}"吗？此操作不可撤销。`)) {
        deletePost(postId);
    }
}

/**
 * 删除文章
 * @param {string} postId - 文章ID
 */
function deletePost(postId) {
    try {
        const index = allPosts.findIndex(p => p.id === postId);
        if (index !== -1) {
            allPosts.splice(index, 1);
            savePosts(allPosts);
            
            // 更新界面
            updateCategoryOptions();
            updateDashboard();
            renderPostsList();
            
            showSuccessMessage('文章删除成功！');
        }
    } catch (error) {
        console.error('删除文章失败:', error);
        showErrorMessage('删除失败，请重试');
    }
}

/**
 * 保存文章到本地存储
 * @param {Array} posts - 文章数组
 */
function savePosts(posts) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
        console.error('保存文章失败:', error);
        throw new Error('保存失败，请检查浏览器存储空间');
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
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

/**
 * 生成唯一ID
 * @returns {string} - 唯一ID
 */
function generateUniqueId() {
    return 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * 从HTML内容生成摘要
 * @param {string} htmlContent - HTML内容
 * @returns {string} - 摘要文本
 */
function generateSummary(htmlContent) {
    try {
        // 创建临时div来提取文本
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        // 返回前150个字符作为摘要
        return textContent.slice(0, 150).trim() + (textContent.length > 150 ? '...' : '');
    } catch (error) {
        return '暂无摘要';
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
 * HTML转义
 * @param {string} text - 原始文本
 * @returns {string} - 转义后的文本
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 显示成功消息
 * @param {string} message - 成功消息
 */
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-20 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50';
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
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
    document.addEventListener('DOMContentLoaded', initAdmin);
} else {
    initAdmin();
}