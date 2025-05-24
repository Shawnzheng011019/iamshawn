// 太空漫游 JavaScript 主文件
class SpaceVoyage {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.planets = [];
        this.stars = [];
        this.blogStars = [];
        this.currentMode = 'main'; // 'main' or 'blog'
        this.targetPlanet = null;
        this.isInBlogSpace = false;
        
        // 控制状态
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.isAccelerating = false;
        
        // 速度设置
        this.normalSpeed = 0.3;
        this.accelerateSpeed = 0.8;
        
        // Raycaster for interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.init();
    }

    async init() {
        await this.showLoadingScreen();
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.createSpaceEnvironment();
        this.createPlanets();
        this.setupEventListeners();
        this.animate();
        this.hideLoadingScreen();
    }

    async showLoadingScreen() {
        return new Promise((resolve) => {
            let progress = 0;
            const progressFill = document.getElementById('progress-fill');
            const progressText = document.getElementById('loading-percentage');
            
            const loadingSteps = [
                '初始化3D引擎...',
                '生成太空环境...',
                '创建星系...',
                '加载星球数据...',
                '设置物理系统...',
                '优化渲染...',
                '准备就绪！'
            ];
            
            let stepIndex = 0;
            const loadingText = document.querySelector('.loading-text');
            
            const interval = setInterval(() => {
                progress += Math.random() * 15 + 5;
                if (progress > 100) progress = 100;
                
                progressFill.style.width = progress + '%';
                progressText.textContent = Math.round(progress) + '%';
                
                // 更新加载文本
                if (stepIndex < loadingSteps.length - 1 && progress > (stepIndex + 1) * 14) {
                    stepIndex++;
                    loadingText.innerHTML = `探索宇宙深处，发现未知的星球和故事...<br>${loadingSteps[stepIndex]}`;
                }
                
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        resolve();
                    }, 800);
                }
            }, 150);
        });
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transform = 'scale(1.1)';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000011, 1, 15000);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            20000
        );
        this.camera.position.set(0, 0, 10);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
    }

    setupControls() {
        this.controls = new THREE.PointerLockControls(this.camera, document.body);
        this.scene.add(this.controls.getObject());
        
        // 点击锁定鼠标
        document.addEventListener('click', () => {
            if (!document.getElementById('modal').style.display || 
                document.getElementById('modal').style.display === 'none') {
                this.controls.lock();
            }
        });
    }

    createSpaceEnvironment() {
        // 创建星空背景
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 3000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            // 随机位置
            positions[i * 3] = (Math.random() - 0.5) * 10000;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10000;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10000;
            
            // 随机颜色 (蓝白色调)
            const colorChoice = Math.random();
            if (colorChoice < 0.3) {
                colors[i * 3] = 0.8 + Math.random() * 0.2;     // R
                colors[i * 3 + 1] = 0.9 + Math.random() * 0.1; // G  
                colors[i * 3 + 2] = 1.0;                        // B
            } else if (colorChoice < 0.6) {
                colors[i * 3] = 0.6 + Math.random() * 0.4;     // R
                colors[i * 3 + 1] = 0.8 + Math.random() * 0.2; // G
                colors[i * 3 + 2] = 1.0;                        // B
            } else {
                colors[i * 3] = 1.0;                            // R
                colors[i * 3 + 1] = 1.0;                        // G
                colors[i * 3 + 2] = 1.0;                        // B
            }
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 2,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
        
        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // 添加方向光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    createPlanets() {
        const planetData = [
            {
                name: '关于我',
                description: '了解我的基本信息、教育背景和个人介绍',
                position: [30, 5, -20],
                color: 0x4fc3f7,
                size: 3,
                type: 'about'
            },
            {
                name: '实习经历',
                description: '我的实习工作经验和职业发展历程',
                position: [-25, -10, -30],
                color: 0x81c784,
                size: 2.8,
                type: 'internship'
            },
            {
                name: '项目经历',
                description: '我参与和主导的各种技术项目',
                position: [15, -20, 40],
                color: 0xffb74d,
                size: 3.2,
                type: 'projects'
            },
            {
                name: '技能',
                description: '我掌握的技术栈和专业技能',
                position: [-40, 15, 25],
                color: 0xf06292,
                size: 2.5,
                type: 'skills'
            },
            {
                name: '博客',
                description: '我的技术博客和文章分享',
                position: [35, -5, 60],
                color: 0xba68c8,
                size: 3.5,
                type: 'blog'
            }
        ];

        planetData.forEach((data, index) => {
            // 创建星球几何体
            const geometry = new THREE.SphereGeometry(data.size, 32, 32);
            
            // 创建材质
            const material = new THREE.MeshPhongMaterial({
                color: data.color,
                transparent: true,
                opacity: 0.8,
                shininess: 100
            });
            
            const planet = new THREE.Mesh(geometry, material);
            planet.position.set(...data.position);
            planet.userData = data;
            planet.castShadow = true;
            planet.receiveShadow = true;
            
            // 添加发光效果
            const glowGeometry = new THREE.SphereGeometry(data.size * 1.2, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: data.color,
                transparent: true,
                opacity: 0.2,
                side: THREE.BackSide
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            planet.add(glow);
            
            // 添加旋转动画
            planet.rotation.speed = (Math.random() - 0.5) * 0.02;
            
            this.scene.add(planet);
            this.planets.push(planet);
        });
    }

    async createBlogSpace() {
        // 清除主星球
        this.planets.forEach(planet => {
            this.scene.remove(planet);
        });
        this.planets = [];
        
        // 加载真实博客数据
        let blogPosts = [];
        try {
            const response = await fetch('posts/posts.json');
            const posts = await response.json();
            blogPosts = posts.slice(0, 15); // 取前15篇文章
        } catch (error) {
            console.error('Failed to load blog posts:', error);
            // 使用默认数据
            blogPosts = [
                { title: 'Milvus向量数据库实践', category: '数据库技术', date: '2024-01', id: 'milvus-practice' },
                { title: 'React性能优化技巧', category: '前端开发', date: '2024-02', id: 'react-optimization' },
                { title: 'Python异步编程详解', category: '后端开发', date: '2024-03', id: 'python-async' },
                { title: 'Docker容器化部署', category: '运维技术', date: '2024-04', id: 'docker-deploy' },
                { title: '机器学习模型部署', category: '人工智能', date: '2024-05', id: 'ml-deployment' },
                { title: 'TypeScript高级特性', category: '前端开发', date: '2024-06', id: 'typescript-advanced' },
                { title: 'Kubernetes集群管理', category: '运维技术', date: '2024-07', id: 'k8s-management' },
                { title: '数据可视化最佳实践', category: '数据科学', date: '2024-08', id: 'data-visualization' }
            ];
        }

        blogPosts.forEach((post, index) => {
            const angle = (index / blogPosts.length) * Math.PI * 2;
            const radius = 25 + Math.random() * 20;
            const height = (Math.random() - 0.5) * 30;
            
            const geometry = new THREE.SphereGeometry(0.8, 16, 16);
            const material = new THREE.MeshPhongMaterial({
                color: this.getCategoryColor(post.category),
                transparent: true,
                opacity: 0.9
            });
            
            const star = new THREE.Mesh(geometry, material);
            star.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            star.userData = { 
                ...post, 
                type: 'article',
                // 格式化显示数据
                displayTitle: post.title,
                displayCategory: post.category,
                displayDate: post.date,
                summary: post.summary || `这是一篇关于${post.title}的技术文章。`,
                readingTime: post.readingTime || '5 分钟'
            };
            
            // 添加闪烁效果
            star.userData.originalOpacity = 0.9;
            star.userData.twinkleSpeed = Math.random() * 0.05 + 0.02;
            
            this.scene.add(star);
            this.blogStars.push(star);
        });
        
        this.isInBlogSpace = true;
        
        // 显示返回主太空按钮
        document.getElementById('back-to-main-space').style.display = 'flex';
    }

    createMainSpace() {
        // 清除博客星星
        this.blogStars.forEach(star => {
            this.scene.remove(star);
        });
        this.blogStars = [];
        
        // 重新创建主星球
        this.createPlanets();
        
        this.isInBlogSpace = false;
        
        // 隐藏返回主太空按钮
        document.getElementById('back-to-main-space').style.display = 'none';
        
        // 隐藏星球信息
        document.getElementById('planet-info').classList.remove('show');
    }

    getCategoryColor(category) {
        const colors = {
            '数据库技术': 0x2196f3,
            '前端开发': 0x4caf50,
            '后端开发': 0xff9800,
            '运维技术': 0x9c27b0,
            '人工智能': 0xf44336,
            '数据科学': 0x00bcd4,
            'AI工具技巧': 0xe91e63,
            '技术实践': 0x795548,
            '技术教程': 0x607d8b,
            '开源项目': 0x8bc34a,
            '人工智能应用': 0x9c27b0,
            '技术原理': 0x673ab7,
            '技术趋势': 0x3f51b5,
            '开源社区': 0x009688,
            'AI协议': 0xff5722,
            // 兼容旧的英文分类
            'Database': 0x2196f3,
            'Frontend': 0x4caf50,
            'Backend': 0xff9800,
            'DevOps': 0x9c27b0,
            'AI/ML': 0xf44336,
            'Data': 0x00bcd4
        };
        return colors[category] || 0xffffff;
    }

    setupEventListeners() {
        // 键盘控制
        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'KeyW': this.moveForward = true; break;
                case 'KeyS': this.moveBackward = true; break;
                case 'KeyA': this.moveLeft = true; break;
                case 'KeyD': this.moveRight = true; break;
                case 'Space': 
                    event.preventDefault();
                    this.moveUp = true; 
                    break;
                case 'ControlLeft':
                case 'ControlRight':
                    event.preventDefault();
                    this.moveDown = true;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    this.isAccelerating = true;
                    break;
                case 'Escape':
                    this.controls.unlock();
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'KeyW': this.moveForward = false; break;
                case 'KeyS': this.moveBackward = false; break;
                case 'KeyA': this.moveLeft = false; break;
                case 'KeyD': this.moveRight = false; break;
                case 'Space': this.moveUp = false; break;
                case 'ControlLeft':
                case 'ControlRight':
                    this.moveDown = false;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    this.isAccelerating = false;
                    break;
            }
        });

        // 鼠标交互
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // 窗口大小调整
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    updateMovement() {
        if (!this.controls.isLocked) return;

        const speed = this.isAccelerating ? this.accelerateSpeed : this.normalSpeed;
        const direction = new THREE.Vector3();
        
        this.camera.getWorldDirection(direction);
        const right = new THREE.Vector3();
        right.crossVectors(direction, this.camera.up).normalize();
        
        if (this.moveForward) {
            this.controls.getObject().position.addScaledVector(direction, speed);
        }
        if (this.moveBackward) {
            this.controls.getObject().position.addScaledVector(direction, -speed);
        }
        if (this.moveLeft) {
            this.controls.getObject().position.addScaledVector(right, -speed);
        }
        if (this.moveRight) {
            this.controls.getObject().position.addScaledVector(right, speed);
        }
        if (this.moveUp) {
            this.controls.getObject().position.y += speed;
        }
        if (this.moveDown) {
            this.controls.getObject().position.y -= speed;
        }
    }

    checkPlanetIntersection() {
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        
        const targets = this.isInBlogSpace ? this.blogStars : this.planets;
        const intersects = this.raycaster.intersectObjects(targets);
        
        const crosshair = document.getElementById('crosshair');
        const planetInfo = document.getElementById('planet-info');
        
        if (intersects.length > 0) {
            const target = intersects[0].object;
            
            // 更新准星样式
            crosshair.classList.add('targeting');
            
            // 显示星球信息
            const data = target.userData;
            if (data.type === 'article') {
                // 文章信息
                document.getElementById('planet-name').textContent = data.displayTitle || data.title;
                document.getElementById('planet-description').innerHTML = `
                    <div style="line-height: 1.4;">
                        <div style="margin-bottom: 0.5rem; color: #64b5f6; font-weight: bold;">
                            ${data.displayCategory || data.category}
                        </div>
                        <div style="margin-bottom: 0.5rem; font-size: 0.9rem; color: #b0bec5;">
                            📅 ${data.displayDate || data.date}
                            ${data.readingTime ? ` • ⏱️ ${data.readingTime}` : ''}
                        </div>
                        <div style="font-size: 0.9rem; line-height: 1.3;">
                            ${data.summary ? data.summary.substring(0, 100) + '...' : '点击查看详细内容'}
                        </div>
                    </div>
                `;
                document.getElementById('enter-btn').textContent = '📖 阅读文章';
            } else {
                // 星球信息
                document.getElementById('planet-name').textContent = data.name;
                document.getElementById('planet-description').textContent = data.description;
                document.getElementById('enter-btn').textContent = data.type === 'blog' ? '🌌 进入博客太空' : '🌍 进入星球';
            }
            
            planetInfo.classList.add('show');
            this.targetPlanet = target;
        } else {
            crosshair.classList.remove('targeting');
            planetInfo.classList.remove('show');
            this.targetPlanet = null;
        }
    }

    animatePlanets() {
        this.planets.forEach(planet => {
            planet.rotation.y += planet.rotation.speed;
            
            // 添加轻微的上下浮动
            planet.position.y += Math.sin(Date.now() * 0.001 + planet.userData.name.length) * 0.01;
        });
        
        // 博客星星闪烁效果
        this.blogStars.forEach(star => {
            const material = star.material;
            const time = Date.now() * 0.001;
            material.opacity = star.userData.originalOpacity + 
                Math.sin(time * star.userData.twinkleSpeed) * 0.3;
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.updateMovement();
        this.checkPlanetIntersection();
        this.animatePlanets();
        
        // 星空旋转
        if (this.stars) {
            this.stars.rotation.y += 0.0002;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// 全局函数
async function enterPlanet() {
    const voyage = window.spaceVoyage;
    if (!voyage.targetPlanet) return;
    
    const planetData = voyage.targetPlanet.userData;
    
    if (planetData.type === 'blog') {
        // 进入博客太空
        await voyage.createBlogSpace();
        document.getElementById('planet-info').classList.remove('show');
    } else if (planetData.type === 'article') {
        // 显示文章内容
        showArticleModal(planetData);
    } else {
        // 显示星球内容
        showPlanetModal(planetData);
    }
}

function showPlanetModal(planetData) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    let content = '';
    
    switch (planetData.type) {
        case 'about':
            content = getAboutContent();
            break;
        case 'internship':
            content = getInternshipContent();
            break;
        case 'projects':
            content = getProjectsContent();
            break;
        case 'skills':
            content = getSkillsContent();
            break;
    }
    
    modalBody.innerHTML = content;
    modal.style.display = 'flex';
    
    // 释放鼠标控制
    window.spaceVoyage.controls.unlock();
}

function showArticleModal(articleData) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <div style="max-width: 800px;">
            <h1 style="color: #64b5f6; margin-bottom: 1rem; font-size: 2rem; line-height: 1.3;">
                ${articleData.displayTitle || articleData.title}
            </h1>
            <div style="margin-bottom: 1.5rem; color: #b0bec5; display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
                <span style="background: ${getCategoryColorHex(articleData.displayCategory || articleData.category)}; color: white; padding: 6px 12px; border-radius: 15px; font-size: 0.9rem;">
                    ${articleData.displayCategory || articleData.category}
                </span>
                <span style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fa-solid fa-calendar" style="color: #64b5f6;"></i>
                    ${articleData.displayDate || articleData.date}
                </span>
                ${articleData.readingTime ? `
                <span style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fa-solid fa-clock" style="color: #64b5f6;"></i>
                    ${articleData.readingTime}
                </span>
                ` : ''}
            </div>
            
            ${articleData.tags ? `
            <div style="margin-bottom: 1.5rem;">
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${articleData.tags.map(tag => `
                        <span style="background: rgba(100, 181, 246, 0.2); color: #64b5f6; padding: 4px 8px; border-radius: 10px; font-size: 0.8rem;">
                            #${tag}
                        </span>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <div style="line-height: 1.8; color: #e0e0e0;">
                <p style="margin-bottom: 1.5rem; font-size: 1.1rem; color: #b0bec5; font-style: italic;">
                    ${articleData.summary || `这是一篇关于${articleData.title}的技术文章。`}
                </p>
                
                <div style="background: rgba(100, 181, 246, 0.1); padding: 1.5rem; border-radius: 10px; border-left: 4px solid #64b5f6; margin-bottom: 1.5rem;">
                    <h3 style="color: #64b5f6; margin-bottom: 1rem;">📖 文章预览</h3>
                    <p style="margin-bottom: 1rem;">这篇文章详细介绍了相关技术概念、实践经验和最佳实践。</p>
                    <p style="margin-bottom: 1rem;">通过实际案例和代码示例，帮助读者更好地理解和应用这些技术。</p>
                </div>
                
                ${articleData.path ? `
                <div style="text-align: center; margin-top: 2rem;">
                    <a href="${articleData.path}" target="_blank" 
                       style="display: inline-flex; align-items: center; gap: 0.5rem; background: linear-gradient(45deg, #2196f3, #64b5f6); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold; transition: all 0.3s ease;">
                        <i class="fa-solid fa-book-open"></i>
                        阅读完整文章
                    </a>
                </div>
                ` : `
                <p style="text-align: center; color: #888; font-style: italic; margin-top: 2rem;">
                    <em>注：这是示例内容，完整文章正在准备中...</em>
                </p>
                `}
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    window.spaceVoyage.controls.unlock();
}

function getCategoryColorHex(category) {
    const colors = {
        '数据库技术': '#2196f3',
        '前端开发': '#4caf50',
        '后端开发': '#ff9800',
        '运维技术': '#9c27b0',
        '人工智能': '#f44336',
        '数据科学': '#00bcd4',
        'AI工具技巧': '#e91e63',
        '技术实践': '#795548',
        '技术教程': '#607d8b',
        '开源项目': '#8bc34a',
        '人工智能应用': '#9c27b0',
        '技术原理': '#673ab7',
        '技术趋势': '#3f51b5',
        '开源社区': '#009688',
        'AI协议': '#ff5722',
        // 兼容旧的英文分类
        'Database': '#2196f3',
        'Frontend': '#4caf50',
        'Backend': '#ff9800',
        'DevOps': '#9c27b0',
        'AI/ML': '#f44336',
        'Data': '#00bcd4'
    };
    return colors[category] || '#ffffff';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function backToMainSpace() {
    const voyage = window.spaceVoyage;
    if (voyage && voyage.isInBlogSpace) {
        voyage.createMainSpace();
    }
}

function getAboutContent() {
    return `
        <div style="max-width: 600px;">
            <h1 style="color: #64b5f6; margin-bottom: 1.5rem;">关于我</h1>
            <div style="line-height: 1.8; color: #e0e0e0;">
                <p style="margin-bottom: 1rem;">你好！我是郑啸，一名充满热情的技术开发者。</p>
                <p style="margin-bottom: 1rem;">我专注于全栈开发、数据科学和人工智能领域，喜欢探索新技术并将其应用到实际项目中。</p>
                <p style="margin-bottom: 1rem;">通过不断学习和实践，我希望能够创造出有价值的技术解决方案。</p>
                <h3 style="color: #64b5f6; margin: 1.5rem 0 1rem 0;">教育背景</h3>
                <p>• 计算机科学相关专业</p>
                <p>• 持续学习新技术和最佳实践</p>
            </div>
        </div>
    `;
}

function getInternshipContent() {
    return `
        <div style="max-width: 700px;">
            <h1 style="color: #64b5f6; margin-bottom: 1.5rem;">实习经历</h1>
            <div style="line-height: 1.8; color: #e0e0e0;">
                <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 10px;">
                    <h3 style="color: #64b5f6; margin-bottom: 0.5rem;">软件开发实习生</h3>
                    <p style="color: #b0bec5; margin-bottom: 1rem;">某科技公司 • 2024年</p>
                    <p>• 参与前端和后端开发项目</p>
                    <p>• 学习现代开发工具和流程</p>
                    <p>• 与团队协作完成产品功能</p>
                </div>
                <div style="padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 10px;">
                    <h3 style="color: #64b5f6; margin-bottom: 0.5rem;">技术助理</h3>
                    <p style="color: #b0bec5; margin-bottom: 1rem;">研究机构 • 2023年</p>
                    <p>• 协助数据分析和处理</p>
                    <p>• 参与机器学习项目</p>
                    <p>• 编写技术文档和报告</p>
                </div>
            </div>
        </div>
    `;
}

function getProjectsContent() {
    return `
        <div style="max-width: 800px;">
            <h1 style="color: #64b5f6; margin-bottom: 1.5rem;">项目经历</h1>
            <div style="line-height: 1.8; color: #e0e0e0;">
                <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 10px;">
                    <h3 style="color: #64b5f6; margin-bottom: 0.5rem;">个人主页与博客系统</h3>
                    <p style="color: #b0bec5; margin-bottom: 1rem;">HTML/CSS/JavaScript • 2024年</p>
                    <p>• 响应式设计的个人主页</p>
                    <p>• 集成博客系统和文章管理</p>
                    <p>• 3D太空漫游交互界面</p>
                </div>
                <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 10px;">
                    <h3 style="color: #64b5f6; margin-bottom: 0.5rem;">数据可视化平台</h3>
                    <p style="color: #b0bec5; margin-bottom: 1rem;">React/D3.js/Python • 2024年</p>
                    <p>• 交互式数据可视化图表</p>
                    <p>• 实时数据处理和分析</p>
                    <p>• 用户友好的界面设计</p>
                </div>
                <div style="padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 10px;">
                    <h3 style="color: #64b5f6; margin-bottom: 0.5rem;">机器学习应用</h3>
                    <p style="color: #b0bec5; margin-bottom: 1rem;">Python/TensorFlow • 2023年</p>
                    <p>• 图像识别模型开发</p>
                    <p>• 模型训练和优化</p>
                    <p>• API接口设计和部署</p>
                </div>
            </div>
        </div>
    `;
}

function getSkillsContent() {
    return `
        <div style="max-width: 700px;">
            <h1 style="color: #64b5f6; margin-bottom: 1.5rem;">技能</h1>
            <div style="line-height: 1.8; color: #e0e0e0;">
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #64b5f6; margin-bottom: 1rem;">编程语言</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem;">
                        <span style="background: #2196f3; padding: 6px 12px; border-radius: 15px; text-align: center;">JavaScript</span>
                        <span style="background: #4caf50; padding: 6px 12px; border-radius: 15px; text-align: center;">Python</span>
                        <span style="background: #ff9800; padding: 6px 12px; border-radius: 15px; text-align: center;">TypeScript</span>
                        <span style="background: #9c27b0; padding: 6px 12px; border-radius: 15px; text-align: center;">Java</span>
                    </div>
                </div>
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #64b5f6; margin-bottom: 1rem;">框架与库</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem;">
                        <span style="background: #2196f3; padding: 6px 12px; border-radius: 15px; text-align: center;">React</span>
                        <span style="background: #4caf50; padding: 6px 12px; border-radius: 15px; text-align: center;">Vue.js</span>
                        <span style="background: #ff9800; padding: 6px 12px; border-radius: 15px; text-align: center;">Node.js</span>
                        <span style="background: #9c27b0; padding: 6px 12px; border-radius: 15px; text-align: center;">Django</span>
                    </div>
                </div>
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #64b5f6; margin-bottom: 1rem;">数据库</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem;">
                        <span style="background: #2196f3; padding: 6px 12px; border-radius: 15px; text-align: center;">MySQL</span>
                        <span style="background: #4caf50; padding: 6px 12px; border-radius: 15px; text-align: center;">MongoDB</span>
                        <span style="background: #ff9800; padding: 6px 12px; border-radius: 15px; text-align: center;">Redis</span>
                        <span style="background: #9c27b0; padding: 6px 12px; border-radius: 15px; text-align: center;">Milvus</span>
                    </div>
                </div>
                <div>
                    <h3 style="color: #64b5f6; margin-bottom: 1rem;">工具与平台</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem;">
                        <span style="background: #2196f3; padding: 6px 12px; border-radius: 15px; text-align: center;">Git</span>
                        <span style="background: #4caf50; padding: 6px 12px; border-radius: 15px; text-align: center;">Docker</span>
                        <span style="background: #ff9800; padding: 6px 12px; border-radius: 15px; text-align: center;">AWS</span>
                        <span style="background: #9c27b0; padding: 6px 12px; border-radius: 15px; text-align: center;">Kubernetes</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.spaceVoyage = new SpaceVoyage();
}); 