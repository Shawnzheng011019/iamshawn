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
        
        // 移动端支持
        this.isMobile = this.checkMobileDevice();
        this.joystickActive = false;
        this.joystickDirection = { x: 0, y: 0 };
        
        // 移动端视角控制
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isLookingAround = false;
        this.cameraRotationX = 0; // 上下旋转
        this.cameraRotationY = 0; // 左右旋转
        
        // 速度设置
        this.normalSpeed = 0.3;
        this.accelerateSpeed = 0.8;
        
        // Raycaster for interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // 纹理加载器
        this.textureLoader = new THREE.TextureLoader();
        this.loadedTextures = new Map(); // 缓存已加载的纹理
        
        this.init();
    }

    checkMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768;
    }

    async init() {
        await this.showLoadingScreen();
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.createSpaceEnvironment();
        await this.createPlanets();
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
                '加载银河系背景...',
                '加载星球纹理...',
                '创建星系...',
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
        if (!this.isMobile) {
            // 桌面端使用PointerLockControls
            this.controls = new THREE.PointerLockControls(this.camera, document.body);
            this.scene.add(this.controls.getObject());
            
            // 点击锁定鼠标的逻辑已移到setupEventListeners中
        } else {
            // 移动端使用简单的相机控制
            this.camera.position.set(0, 0, 10);
            
            // 移动端独立的相机控制系统
            this.cameraGroup = new THREE.Group();
            this.cameraPivot = new THREE.Group();
            this.cameraGroup.add(this.cameraPivot);
            this.cameraPivot.add(this.camera);
            this.scene.add(this.cameraGroup);
            
            // 创建一个虚拟controls对象用于移动端
            this.controls = {
                getObject: () => this.cameraGroup,
                getDirection: (vector) => {
                    this.camera.getWorldDirection(vector);
                    return vector;
                },
                moveForward: (distance) => {
                    const direction = new THREE.Vector3();
                    this.camera.getWorldDirection(direction);
                    this.cameraGroup.position.addScaledVector(direction, distance);
                },
                moveRight: (distance) => {
                    const direction = new THREE.Vector3();
                    this.camera.getWorldDirection(direction);
                    const right = new THREE.Vector3();
                    right.crossVectors(direction, this.camera.up).normalize();
                    this.cameraGroup.position.addScaledVector(right, distance);
                },
                unlock: () => {} // 空函数，移动端不需要
            };
            
            // 设置移动端触摸控制
            this.setupMobileLookControls();
        }
    }

    createSpaceEnvironment() {
        // 添加银河系背景
        this.createSpaceBackground();
        
        // 创建星空背景
        const starGeometry = new THREE.BufferGeometry();
        // 移动端减少星星数量以提升性能
        const starCount = this.isMobile ? 1500 : 3000;
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
            size: this.isMobile ? 1.5 : 2,
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

    async createSpaceBackground() {
        try {
            // 加载银河系背景纹理
            const milkyWayTexture = await this.loadTexture('textures/space/milky_way.jpg');
            
            if (milkyWayTexture) {
                // 创建球体几何体作为天空盒
                const skyboxGeometry = new THREE.SphereGeometry(15000, 32, 32);
                const skyboxMaterial = new THREE.MeshBasicMaterial({
                    map: milkyWayTexture,
                    side: THREE.BackSide, // 内表面渲染
                    transparent: true,
                    opacity: 0.8
                });
                
                const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
                skybox.rotation.y = Math.PI; // 调整方向
                this.scene.add(skybox);
                
                console.log('银河系背景纹理加载成功');
            } else {
                console.warn('银河系背景纹理加载失败，使用默认星空');
            }
        } catch (error) {
            console.warn('创建太空背景时出错:', error);
        }
    }

    async createPlanets() {
        const planetData = [
            {
                name: '关于我',
                description: '了解我的基本信息、教育背景和个人介绍',
                position: [30, 5, -20],
                color: 0x4fc3f7,
                size: 3,
                type: 'about',
                texture: 'textures/planets/earth.jpeg'
            },
            {
                name: '实习经历',
                description: '我的实习工作经验和职业发展历程',
                position: [-25, -10, -30],
                color: 0x81c784,
                size: 2.8,
                type: 'internship',
                texture: 'textures/planets/mars.jpg'
            },
            {
                name: '项目经历',
                description: '我参与和主导的各种技术项目',
                position: [15, -20, 40],
                color: 0xffb74d,
                size: 3.2,
                type: 'projects',
                texture: 'textures/planets/jupiter.jpg'
            },
            {
                name: '技能',
                description: '我掌握的技术栈和专业技能',
                position: [-40, 15, 25],
                color: 0xf06292,
                size: 2.5,
                type: 'skills',
                texture: 'textures/planets/mercury.jpg'
            },
            {
                name: '博客',
                description: '我的技术博客和文章分享',
                position: [35, -5, 60],
                color: 0xba68c8,
                size: 3.5,
                type: 'blog',
                texture: 'textures/planets/venus.jpg'
            }
        ];

        await this.createPlanetsWithTextures(planetData);
    }

    async createPlanetsWithTextures(planetData) {
        for (const data of planetData) {
            // 创建星球几何体
            const geometry = new THREE.SphereGeometry(data.size, 32, 32);
            
            let material;
            
            // 尝试加载纹理
            if (data.texture) {
                const texture = await this.loadTexture(data.texture);
                if (texture) {
                    // 如果纹理加载成功，使用纹理材质
                    material = new THREE.MeshPhongMaterial({
                        map: texture,
                        transparent: true,
                        opacity: 0.9,
                        shininess: 100
                    });
                } else {
                    // 纹理加载失败，使用纯色材质
                    console.warn(`星球 ${data.name} 的纹理加载失败，使用纯色`);
                    material = new THREE.MeshPhongMaterial({
                        color: data.color,
                        transparent: true,
                        opacity: 0.8,
                        shininess: 100
                    });
                }
            } else {
                // 没有纹理，使用纯色材质
                material = new THREE.MeshPhongMaterial({
                    color: data.color,
                    transparent: true,
                    opacity: 0.8,
                    shininess: 100
                });
            }
            
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
                opacity: 0.15, // 降低发光透明度，让纹理更突出
                side: THREE.BackSide
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            planet.add(glow);
            
            // 添加旋转动画
            planet.rotation.speed = (Math.random() - 0.5) * 0.02;
            
            this.scene.add(planet);
            this.planets.push(planet);
        }
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
            if (response.ok) {
                const posts = await response.json();
                blogPosts = posts.slice(0, 15); // 取前15篇文章
                console.log('成功加载博客数据:', blogPosts.length, '篇文章');
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to load blog posts:', error);
            // 使用默认数据
            blogPosts = [
                { 
                    id: 'milvus-practice', 
                    title: 'Milvus向量数据库实践', 
                    category: '数据库技术', 
                    date: '2024-01',
                    path: 'posts/milvus-practice/README.md',
                    summary: '深入探讨Milvus向量数据库的实践应用'
                },
                { 
                    id: 'react-optimization', 
                    title: 'React性能优化技巧', 
                    category: '前端开发', 
                    date: '2024-02',
                    path: 'posts/react-optimization/README.md',
                    summary: 'React应用性能优化的最佳实践'
                },
                { 
                    id: 'python-async', 
                    title: 'Python异步编程详解', 
                    category: '后端开发', 
                    date: '2024-03',
                    path: 'posts/python-async/README.md',
                    summary: 'Python异步编程的核心概念和实践'
                },
                { 
                    id: 'docker-deploy', 
                    title: 'Docker容器化部署', 
                    category: '运维技术', 
                    date: '2024-04',
                    path: 'posts/docker-deploy/README.md',
                    summary: 'Docker容器化部署的完整指南'
                },
                { 
                    id: 'ml-deployment', 
                    title: '机器学习模型部署', 
                    category: '人工智能', 
                    date: '2024-05',
                    path: 'posts/ml-deployment/README.md',
                    summary: '机器学习模型生产环境部署实践'
                },
                { 
                    id: 'typescript-advanced', 
                    title: 'TypeScript高级特性', 
                    category: '前端开发', 
                    date: '2024-06',
                    path: 'posts/typescript-advanced/README.md',
                    summary: 'TypeScript的高级特性和使用技巧'
                },
                { 
                    id: 'k8s-management', 
                    title: 'Kubernetes集群管理', 
                    category: '运维技术', 
                    date: '2024-07',
                    path: 'posts/k8s-management/README.md',
                    summary: 'Kubernetes集群管理最佳实践'
                },
                { 
                    id: 'data-visualization', 
                    title: '数据可视化最佳实践', 
                    category: '数据科学', 
                    date: '2024-08',
                    path: 'posts/data-visualization/README.md',
                    summary: '数据可视化的设计原则和实现方法'
                }
            ];
        }

        blogPosts.forEach((post, index) => {
            const angle = (index / blogPosts.length) * Math.PI * 2;
            const radius = 25 + Math.random() * 20;
            const height = (Math.random() - 0.5) * 30;
            
            const geometry = new THREE.SphereGeometry(0.8, 16, 16);
            
            // 为特殊文章使用月球纹理
            let material;
            const isSpecialPost = index === 0 || post.category === '人工智能' || post.category === 'AI协议'; // 第一篇或AI相关文章
            
            if (isSpecialPost) {
                // 异步加载月球纹理
                this.loadTexture('textures/planets/moon.jpg').then(texture => {
                    if (texture && star.material) {
                        star.material = new THREE.MeshPhongMaterial({
                            map: texture,
                            transparent: true,
                            opacity: 0.9
                        });
                    }
                }).catch(error => {
                    console.warn('月球纹理加载失败，使用默认材质:', error);
                });
                // 先使用特殊颜色材质
                material = new THREE.MeshPhongMaterial({
                    color: 0xc2c2c2, // 月球般的银灰色
                    transparent: true,
                    opacity: 0.9,
                    emissive: 0x111111 // 添加一点发光效果
                });
            } else {
                material = new THREE.MeshPhongMaterial({
                    color: this.getCategoryColor(post.category),
                    transparent: true,
                    opacity: 0.9
                });
            }
            
            const star = new THREE.Mesh(geometry, material);
            star.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            
            // 确保文章数据包含必要字段，统一使用ID格式
            star.userData = { 
                ...post, 
                type: 'article',
                // 确保有稳定的ID - 优先使用posts.json中的id字段
                id: post.id || `article-${index}`,  
                displayTitle: post.title,
                displayCategory: post.category,
                displayDate: post.date,
                summary: post.summary || `这是一篇关于${post.title}的技术文章。`,
                readingTime: post.readingTime || '5 分钟',
                // 保留slug和path作为备用信息，但不用于链接生成
                slug: post.slug,
                path: post.path,
                // 添加调试信息
                originalData: { ...post }
            };
            
            // 输出调试信息 - 重点关注ID
            console.log(`处理文章 ${index}:`, {
                title: star.userData.displayTitle,
                id: star.userData.id,
                hasValidId: !!star.userData.id && star.userData.id !== `article-${index}`,
                originalId: post.id
            });
            
            // 添加闪烁效果数据
            star.userData.originalOpacity = 0.9;
            star.userData.twinkleSpeed = 1.5 + Math.random() * 2;
            
            this.scene.add(star);
            this.blogStars.push(star);
        });
        
        this.currentMode = 'blog';
        this.isInBlogSpace = true;
        
        console.log(`博客空间创建完成，共加载 ${this.blogStars.length} 篇文章`);
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
        this.currentMode = 'main';
        
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
        // 键盘事件
        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'KeyW':
                    this.moveForward = true;
                    break;
                case 'KeyA':
                    this.moveLeft = true;
                    break;
                case 'KeyS':
                    this.moveBackward = true;
                    break;
                case 'KeyD':
                    this.moveRight = true;
                    break;
                case 'Space':
                    event.preventDefault();
                    this.moveUp = true;
                    break;
                case 'ControlLeft':
                    this.moveDown = true;
                    break;
                case 'ShiftLeft':
                    this.isAccelerating = true;
                    break;
            }
        });

        document.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'KeyW':
                    this.moveForward = false;
                    break;
                case 'KeyA':
                    this.moveLeft = false;
                    break;
                case 'KeyS':
                    this.moveBackward = false;
                    break;
                case 'KeyD':
                    this.moveRight = false;
                    break;
                case 'Space':
                    this.moveUp = false;
                    break;
                case 'ControlLeft':
                    this.moveDown = false;
                    break;
                case 'ShiftLeft':
                    this.isAccelerating = false;
                    break;
            }
        });

        // 移动端虚拟控制器事件
        if (this.isMobile) {
            this.setupMobileControls();
        }

        // 鼠标点击事件 - 点击星球直接进入
        document.addEventListener('click', (event) => {
            // 避免在模态窗口打开时触发
            const modal = document.getElementById('modal');
            if (modal.style.display === 'flex') return;
            
            // 避免点击UI元素时触发
            const target = event.target;
            if (target.closest('.planet-info') || target.closest('.controls-info') || 
                target.closest('.back-to-main') || target.closest('.mobile-controls')) {
                return;
            }
            
            // 如果是桌面端且鼠标未锁定，尝试锁定鼠标
            if (!this.isMobile && this.controls && this.controls.lock && !this.controls.isLocked) {
                try {
                    this.controls.lock();
                } catch (error) {
                    console.log('鼠标锁定失败，请再次点击');
                }
            }
            
            // 如果瞄准了星球，直接进入
            if (this.targetPlanet) {
                enterPlanet();
            }
        });

        // 移动端触摸事件 - 触摸星球直接进入
        document.addEventListener('touchstart', (event) => {
            // 避免在模态窗口打开时触发
            const modal = document.getElementById('modal');
            if (modal.style.display === 'flex') return;
            
            // 避免触摸UI元素时触发
            const target = event.target;
            if (target.closest('.planet-info') || target.closest('.controls-info') || 
                target.closest('.back-to-main') || target.closest('.mobile-controls')) {
                return;
            }
            
            // 如果瞄准了星球，直接进入
            if (this.targetPlanet) {
                event.preventDefault(); // 防止触发click事件
                enterPlanet();
            }
        });

        // 窗口大小调整
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // 模态框关闭事件
        document.addEventListener('click', (event) => {
            const modal = document.getElementById('modal');
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // ESC键关闭模态框
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Escape') {
                const modal = document.getElementById('modal');
                if (modal.style.display === 'flex') {
                    closeModal();
                }
            }
        });
        
        // 确保模态框关闭按钮有效 - 使用事件委托
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal-close') || 
                event.target.closest('.modal-close')) {
                closeModal();
            }
        });
    }

    setupMobileControls() {
        const joystick = document.getElementById('virtual-joystick');
        const knob = document.getElementById('joystick-knob');
        const upBtn = document.getElementById('mobile-up');
        const downBtn = document.getElementById('mobile-down');
        const boostBtn = document.getElementById('mobile-boost');

        // 虚拟摇杆事件
        let joystickCenter = { x: 0, y: 0 };
        let maxDistance = 40; // 摇杆最大距离

        const handleJoystickStart = (event) => {
            event.preventDefault();
            this.joystickActive = true;
            const rect = joystick.getBoundingClientRect();
            joystickCenter.x = rect.left + rect.width / 2;
            joystickCenter.y = rect.top + rect.height / 2;
        };

        const handleJoystickMove = (event) => {
            if (!this.joystickActive) return;
            event.preventDefault();

            const clientX = event.touches ? event.touches[0].clientX : event.clientX;
            const clientY = event.touches ? event.touches[0].clientY : event.clientY;

            const deltaX = clientX - joystickCenter.x;
            const deltaY = clientY - joystickCenter.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance <= maxDistance) {
                knob.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
                this.joystickDirection.x = deltaX / maxDistance;
                this.joystickDirection.y = deltaY / maxDistance;
            } else {
                const angle = Math.atan2(deltaY, deltaX);
                const x = Math.cos(angle) * maxDistance;
                const y = Math.sin(angle) * maxDistance;
                knob.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
                this.joystickDirection.x = x / maxDistance;
                this.joystickDirection.y = y / maxDistance;
            }

            // 根据摇杆方向设置移动状态
            this.moveForward = this.joystickDirection.y < -0.2;
            this.moveBackward = this.joystickDirection.y > 0.2;
            this.moveLeft = this.joystickDirection.x < -0.2;
            this.moveRight = this.joystickDirection.x > 0.2;
        };

        const handleJoystickEnd = (event) => {
            event.preventDefault();
            this.joystickActive = false;
            knob.style.transform = 'translate(-50%, -50%)';
            this.joystickDirection = { x: 0, y: 0 };
            this.moveForward = false;
            this.moveBackward = false;
            this.moveLeft = false;
            this.moveRight = false;
        };

        // 触摸事件
        joystick.addEventListener('touchstart', handleJoystickStart);
        joystick.addEventListener('touchmove', handleJoystickMove);
        joystick.addEventListener('touchend', handleJoystickEnd);

        // 鼠标事件（用于调试）
        joystick.addEventListener('mousedown', handleJoystickStart);
        document.addEventListener('mousemove', handleJoystickMove);
        document.addEventListener('mouseup', handleJoystickEnd);

        // 移动端按钮事件
        upBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.moveUp = true;
        });
        upBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.moveUp = false;
        });

        downBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.moveDown = true;
        });
        downBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.moveDown = false;
        });

        boostBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isAccelerating = true;
        });
        boostBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.isAccelerating = false;
        });
    }

    setupMobileLookControls() {
        if (!this.isMobile) return;
        
        let isFirstTouch = true;
        
        // 触摸视角控制
        document.addEventListener('touchstart', (event) => {
            // 如果是在UI元素上，不处理视角控制
            const target = event.target;
            if (target.closest('.virtual-joystick') || 
                target.closest('.mobile-btn') || 
                target.closest('.planet-info') || 
                target.closest('.modal') ||
                target.closest('.mobile-info')) {
                return;
            }
            
            if (event.touches.length === 1) {
                this.isLookingAround = true;
                this.touchStartX = event.touches[0].pageX;
                this.touchStartY = event.touches[0].pageY;
            }
        });
        
        document.addEventListener('touchmove', (event) => {
            if (!this.isLookingAround || event.touches.length !== 1) return;
            
            event.preventDefault();
            
            const deltaX = event.touches[0].pageX - this.touchStartX;
            const deltaY = event.touches[0].pageY - this.touchStartY;
            
            // 调整灵敏度
            const sensitivity = 0.002;
            
            this.cameraRotationY -= deltaX * sensitivity;
            this.cameraRotationX -= deltaY * sensitivity;
            
            // 限制垂直旋转角度
            this.cameraRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.cameraRotationX));
            
            // 应用旋转
            this.cameraGroup.rotation.y = this.cameraRotationY;
            this.cameraPivot.rotation.x = this.cameraRotationX;
            
            this.touchStartX = event.touches[0].pageX;
            this.touchStartY = event.touches[0].pageY;
        });
        
        document.addEventListener('touchend', (event) => {
            if (event.touches.length === 0) {
                this.isLookingAround = false;
            }
        });
    }

    updateMovement() {
        const speed = this.isAccelerating ? this.accelerateSpeed : this.normalSpeed;
        
        if (!this.isMobile && this.controls) {
            // 桌面端使用PointerLockControls - 直接使用正确的方向
            
            // 前后移动：W键向前（正数），S键向后（负数）
            if (this.moveForward) {
                this.controls.moveForward(speed);   // W键向前移动
            }
            if (this.moveBackward) {
                this.controls.moveForward(-speed);  // S键向后移动
            }
            
            // 左右移动：A键向左（负数），D键向右（正数）
            if (this.moveLeft) {
                this.controls.moveRight(-speed);    // A键向左移动
            }
            if (this.moveRight) {
                this.controls.moveRight(speed);     // D键向右移动
            }
            
            // 上下移动
            if (this.moveUp) {
                this.controls.getObject().position.y += speed;   // 空格键向上移动
            }
            if (this.moveDown) {
                this.controls.getObject().position.y -= speed;   // Ctrl键向下移动
            }
        } else if (this.isMobile) {
            // 移动端直接控制相机组位置
            const velocity = new THREE.Vector3();
            
            // 移动端的方向逻辑：保持一致性
            if (this.moveForward) velocity.z -= speed;  // 向前移动（负z方向）
            if (this.moveBackward) velocity.z += speed; // 向后移动（正z方向）
            if (this.moveLeft) velocity.x -= speed;     // 向左移动
            if (this.moveRight) velocity.x += speed;    // 向右移动
            if (this.moveUp) velocity.y += speed;       // 向上移动
            if (this.moveDown) velocity.y -= speed;     // 向下移动
            
            // 应用相机组的旋转到移动向量
            velocity.applyQuaternion(this.cameraGroup.quaternion);
            
            this.cameraGroup.position.add(velocity);
        }
    }

    checkPlanetIntersection() {
        let cameraPosition;
        let cameraDirection = new THREE.Vector3();
        
        if (!this.isMobile && this.controls) {
            cameraPosition = this.controls.getObject().position;
            this.controls.getDirection(cameraDirection);
        } else {
            // 移动端：获取相机的世界坐标位置和方向
            cameraPosition = new THREE.Vector3();
            this.camera.getWorldPosition(cameraPosition);
            this.camera.getWorldDirection(cameraDirection);
        }
        
        this.raycaster.set(cameraPosition, cameraDirection);
        
        let intersectableObjects = [];
        if (this.currentMode === 'main') {
            intersectableObjects = this.planets;
        } else if (this.currentMode === 'blog') {
            intersectableObjects = this.blogStars;
        }
        
        const intersects = this.raycaster.intersectObjects(intersectableObjects);
        
        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            let targetData = null;
            
            if (this.currentMode === 'main') {
                targetData = this.planets.find(p => p === intersectedObject);
            } else if (this.currentMode === 'blog') {
                targetData = this.blogStars.find(s => s === intersectedObject);
            }
            
            if (targetData && (!this.targetPlanet || this.targetPlanet !== targetData)) {
                this.targetPlanet = targetData;
                
                // 显示信息面板
                const planetInfo = document.querySelector('.planet-info');
                if (this.currentMode === 'main') {
                    document.querySelector('.planet-name').textContent = targetData.userData.name;
                    document.querySelector('.planet-description').textContent = targetData.userData.description;
                } else if (this.currentMode === 'blog') {
                    document.querySelector('.planet-name').textContent = targetData.userData.title;
                    document.querySelector('.planet-description').textContent = `分类: ${targetData.userData.category} | ${targetData.userData.date}`;
                }
                planetInfo.classList.add('show');
                
                // 显示瞄准状态
                document.querySelector('.crosshair').classList.add('targeting');
            }
        } else {
            if (this.targetPlanet) {
                this.targetPlanet = null;
                document.querySelector('.planet-info').classList.remove('show');
                document.querySelector('.crosshair').classList.remove('targeting');
            }
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

    async loadTexture(path) {
        // 如果纹理已经加载过，直接返回缓存的纹理
        if (this.loadedTextures.has(path)) {
            return this.loadedTextures.get(path);
        }
        
        console.log(`正在加载纹理: ${path}`);
        
        return new Promise((resolve, reject) => {
            // 优化路径顺序：确保绝对路径优先，兼容Vercel部署
            const possiblePaths = [
                `/${path}`,             // 绝对路径 - Vercel部署首选
                path,                   // 原始路径
                `./${path}`,           // 相对路径
                `/textures/planets/earth.jpeg`,  // 默认地球纹理作为备用
                `/textures/planets/mars.jpg`,    // 默认火星纹理作为备用
                `https://cdn.jsdelivr.net/gh/Shawnzheng011019/iamshawn@main/${path}`,
                `https://fastly.jsdelivr.net/gh/Shawnzheng011019/iamshawn@main/${path}`,
                `https://raw.githubusercontent.com/Shawnzheng011019/iamshawn/main/${path}`
            ];
            
            let currentPathIndex = 0;
            
            const tryLoadTexture = () => {
                if (currentPathIndex >= possiblePaths.length) {
                    console.warn(`所有路径都无法加载纹理: ${path}，使用程序生成的默认纹理`);
                    // 创建一个更美观的默认纹理
                    const canvas = document.createElement('canvas');
                    canvas.width = 512;
                    canvas.height = 512;
                    const ctx = canvas.getContext('2d');
                    
                    // 创建径向渐变背景
                    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
                    gradient.addColorStop(0, '#4fc3f7');
                    gradient.addColorStop(0.5, '#29b6f6');
                    gradient.addColorStop(1, '#0277bd');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, 512, 512);
                    
                    // 添加一些纹理效果
                    for (let i = 0; i < 50; i++) {
                        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
                        ctx.beginPath();
                        ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 20, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    const defaultTexture = new THREE.CanvasTexture(canvas);
                    defaultTexture.wrapS = THREE.RepeatWrapping;
                    defaultTexture.wrapT = THREE.RepeatWrapping;
                    this.loadedTextures.set(path, defaultTexture);
                    resolve(defaultTexture);
                    return;
                }
                
                const currentPath = possiblePaths[currentPathIndex];
                console.log(`尝试加载纹理路径: ${currentPath}`);
                
                this.textureLoader.load(
                    currentPath,
                    (texture) => {
                        // 设置纹理参数
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.magFilter = THREE.LinearFilter;
                        texture.minFilter = THREE.LinearMipMapLinearFilter;
                        texture.generateMipmaps = true;
                        
                        // 缓存纹理
                        this.loadedTextures.set(path, texture);
                        console.log(`纹理加载成功: ${currentPath}`);
                        resolve(texture);
                    },
                    (progress) => {
                        if (progress.total > 0) {
                            const percentage = (progress.loaded / progress.total * 100).toFixed(1);
                            console.log(`纹理加载进度: ${currentPath} - ${percentage}%`);
                        }
                    },
                    (error) => {
                        console.warn(`纹理加载失败 (${currentPath}):`, error);
                        currentPathIndex++;
                        // 添加延迟避免过快重试
                        setTimeout(tryLoadTexture, 100);
                    }
                );
            };
            
            tryLoadTexture();
        });
    }
}

// 全局函数
async function enterPlanet() {
    const voyage = window.spaceVoyage;
    if (!voyage.targetPlanet) {
        console.log('没有目标星球');
        return;
    }
    
    const planetData = voyage.targetPlanet.userData;
    console.log('进入星球，数据:', planetData);
    console.log('星球类型:', planetData.type);
    
    if (planetData.type === 'blog') {
        // 进入博客太空
        console.log('进入博客太空');
        await voyage.createBlogSpace();
        document.getElementById('planet-info').classList.remove('show');
    } else if (planetData.type === 'article') {
        // 显示文章内容
        console.log('显示文章内容');
        showArticleModal(planetData);
    } else {
        // 显示星球内容
        console.log('显示星球内容');
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
    
    // 输出调试信息
    console.log('showArticleModal 被调用，文章数据:', articleData);
    
    // 构造具体文章的URL - 统一使用ID格式
    let articleUrl = 'blog.html'; // 默认跳转到博客主页
    let linkText = '查看我的博客';
    
    // 确保文章数据存在
    if (!articleData) {
        console.error('文章数据为空');
        articleUrl = 'blog.html';
        linkText = '查看我的博客';
    } else {
        // 优先使用ID，这与博客系统的URL格式匹配
        if (articleData.id) {
            // 使用ID构造链接 - 这是博客系统期望的格式
            articleUrl = `blog/article.html?id=${encodeURIComponent(articleData.id)}`;
            linkText = '阅读完整文章';
            console.log('使用 id:', articleData.id);
        } else if (articleData.slug) {
            // 备选：使用slug作为ID
            articleUrl = `blog/article.html?id=${encodeURIComponent(articleData.slug)}`;
            linkText = '阅读完整文章';
            console.log('使用 slug 作为 id:', articleData.slug);
        } else if (articleData.displayTitle || articleData.title) {
            // 最后备选：基于标题生成ID
            const title = articleData.displayTitle || articleData.title;
            const generatedId = title.toLowerCase()
                .replace(/[^\w\s-]/g, '') // 移除特殊字符
                .replace(/\s+/g, '-')     // 空格替换为连字符
                .trim();
            articleUrl = `blog/article.html?id=${encodeURIComponent(generatedId)}`;
            linkText = '阅读完整文章';
            console.log('基于标题生成 id:', generatedId);
        } else {
            console.warn('文章数据缺少必要的标识符，使用默认博客页面');
        }
    }
    
    console.log('最终构造的URL:', articleUrl);
    
    // 获取文章信息，提供默认值
    const title = articleData?.displayTitle || articleData?.title || '未知文章';
    const category = articleData?.displayCategory || articleData?.category || '未分类';
    const date = articleData?.displayDate || articleData?.date || '未知时间';
    const summary = articleData?.summary || `这是一篇关于${title}的技术文章。`;
    const readingTime = articleData?.readingTime || '5 分钟';
    const tags = articleData?.tags || [];
    
    modalBody.innerHTML = `
        <div style="max-width: 800px;">
            <h1 style="color: #64b5f6; margin-bottom: 1rem; font-size: 2rem; line-height: 1.3;">
                ${title}
            </h1>
            <div style="margin-bottom: 1.5rem; color: #b0bec5; display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
                <span style="background: ${getCategoryColorHex(category)}; color: white; padding: 6px 12px; border-radius: 15px; font-size: 0.9rem;">
                    ${category}
                </span>
                <span style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fa-solid fa-calendar" style="color: #64b5f6;"></i>
                    ${date}
                </span>
                <span style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fa-solid fa-clock" style="color: #64b5f6;"></i>
                    ${readingTime}
                </span>
            </div>
            
            ${tags.length > 0 ? `
            <div style="margin-bottom: 1.5rem;">
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${tags.map(tag => `
                        <span style="background: rgba(100, 181, 246, 0.2); color: #64b5f6; padding: 4px 8px; border-radius: 10px; font-size: 0.8rem;">
                            #${tag}
                        </span>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <div style="line-height: 1.8; color: #e0e0e0;">
                <p style="margin-bottom: 1.5rem; font-size: 1.1rem; color: #b0bec5; font-style: italic;">
                    ${summary}
                </p>
                
                <div style="background: rgba(100, 181, 246, 0.1); padding: 1.5rem; border-radius: 10px; border-left: 4px solid #64b5f6; margin-bottom: 1.5rem;">
                    <h3 style="color: #64b5f6; margin-bottom: 1rem;">📖 文章预览</h3>
                    <p style="margin-bottom: 1rem;">这篇文章详细介绍了相关技术概念、实践经验和最佳实践。</p>
                    <p style="margin-bottom: 1rem;">通过实际案例和代码示例，帮助读者更好地理解和应用这些技术。</p>
                    ${articleData?.id ? 
                        '<p style="color: #4fc3f7;">点击下方链接阅读完整文章内容。</p>' : 
                        '<p style="color: #ff9800;">暂无完整文章内容，点击下方链接查看博客主页。</p>'
                    }
                </div>
                
                <div style="text-align: center; margin-top: 2rem;">
                    <a href="${articleUrl}" 
                       onclick="closeModal(); return true;" 
                       style="display: inline-flex; align-items: center; gap: 0.5rem; background: linear-gradient(45deg, #2196f3, #64b5f6); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: bold; transition: all 0.3s ease;">
                        <i class="fa-solid fa-book-open"></i>
                        ${linkText}
                    </a>
                </div>
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
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
        
        // 关闭模态框后，如果是桌面端且不是移动设备，延迟重新锁定鼠标控制
        if (window.spaceVoyage && !window.spaceVoyage.isMobile && window.spaceVoyage.controls && window.spaceVoyage.controls.lock) {
            // 添加短暂延迟，确保关闭动画完成后再锁定
            setTimeout(() => {
                // 只有当模态框确实已关闭时才锁定
                if (modal.style.display === 'none') {
                    try {
                        window.spaceVoyage.controls.lock();
                    } catch (error) {
                        console.log('自动重新锁定鼠标失败，请点击页面重新锁定');
                    }
                }
            }, 100);
        }
    }
}

function backToMainSpace() {
    const voyage = window.spaceVoyage;
    if (voyage && voyage.isInBlogSpace) {
        voyage.createMainSpace();
    }
}

function getAboutContent() {
    return `
        <div style="max-width: 700px;">
            <h1 style="color: #64b5f6; margin-bottom: 1.5rem;">关于我</h1>
            <div style="line-height: 1.8; color: #e0e0e0;">
                <p style="margin-bottom: 1rem;">你好，我是郑啸，目前是中国石油大学（华东）计算机科学与技术专业的硕士研究生，专注于自然语言处理和大语言模型领域的研究与开发。</p>
                <p style="margin-bottom: 1rem;">我对技术有着强烈的好奇心和热情，特别是在RAG系统开发、MCP系统开发以及大语言模型的微调和部署方面有丰富的实践经验。我善于将理论知识与实际应用相结合，解决复杂的技术挑战。</p>
                <p style="margin-bottom: 1rem;">在学术研究中，我致力于探索多模态大小模型融合架构和类脑脉冲大模型架构，以解决大模型推理成本高和能效比低的问题。</p>
                <p style="margin-bottom: 1rem;">作为一名后端开发工程师，我熟练掌握Django、PostgreSQL、FastAPI等技术栈，能够独立设计和实现高性能的后端系统。我注重代码质量和工程规范，善于团队协作和技术沟通。</p>
                
                <h3 style="color: #64b5f6; margin: 1.5rem 0 1rem 0;">教育背景</h3>
                <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <p style="font-weight: bold;">中国石油大学（华东）</p>
                    <p style="color: #64b5f6;">计算机科学与技术（硕士研究生） | 2024.09 - 2026.07（在读）</p>
                    <p style="margin-top: 0.5rem;">研究方向：自然语言处理、Transformer、大语言模型的部署及微调</p>
                </div>
                <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <p style="font-weight: bold;">中国石油大学（华东）</p>
                    <p style="color: #64b5f6;">计算机科学与技术（学士） | 2020.09 - 2024.07</p>
                    <p style="margin-top: 0.5rem;">相关课程：计算机组成原理、数据结构与算法、计算机网络原理、计算机操作系统原理等</p>
                </div>
                
                <h3 style="color: #64b5f6; margin: 1.5rem 0 1rem 0;">联系方式</h3>
                <p>• 邮箱：Shawnzheng2001@outlook.com</p>
                <p>• 电话：16678627572</p>
                <p>• GitHub：https://github.com/Shawnzheng011019</p>
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
                    <h3 style="color: #64b5f6; margin-bottom: 0.5rem;">Zilliz</h3>
                    <p style="color: #b0bec5; margin-bottom: 1rem;">专注于AI非结构化数据处理和分析 • 2025.05 - 2025.09（更新中）</p>
                    <p style="margin-bottom: 0.5rem;">Zilliz成立于2017年，致力于发掘非结构化数据价值，打造面向AI应用的新一代数据库技术。产品包括Milvus，Zilliz Cloud等。</p>
                    
                    <h4 style="color: #64b5f6; margin: 1rem 0 0.5rem 0;">技术栈</h4>
                    <p style="margin-bottom: 1rem;">Milvus • PyMilvus • RAG • Deep Searcher • Python</p>
                    
                    <h4 style="color: #64b5f6; margin: 1rem 0 0.5rem 0;">实习项目</h4>
                    <div style="margin-left: 1rem;">
                        <p style="margin-bottom: 0.5rem;"><strong>Milvus MCP Server</strong></p>
                        <p style="margin-bottom: 1rem; font-size: 0.9rem; color: #b0bec5;">实现了Milvus查询功能的MCP服务，为大语言模型提供向量数据库操作能力，支持向量检索、相似性搜索等核心功能。</p>
                        
                        <p style="margin-bottom: 0.5rem;"><strong>Milvus Code Generate Helper</strong></p>
                        <p style="margin-bottom: 1rem; font-size: 0.9rem; color: #b0bec5;">基于RAG框架开发的Milvus代码生成MCP服务，能够根据用户需求自动生成PyMilvus代码片段，提高开发效率。</p>
                        
                        <p style="margin-bottom: 0.5rem;"><strong>Deep Searcher</strong></p>
                        <p style="margin-bottom: 1rem; font-size: 0.9rem; color: #b0bec5;">基于Agentic RAG架构的智能搜索引擎，支持多种大语言模型和向量数据库，能够基于私有数据执行复杂推理和生成专业报告。</p>
                    </div>
                    
                    <div style="margin-top: 1rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                        <a href="https://zilliz.com.cn/about" target="_blank" style="color: #64b5f6; text-decoration: none; font-size: 0.9rem;">
                            了解更多 <i class="fa-solid fa-external-link-alt"></i>
                        </a>
                        <a href="docs-viewer.html" style="color: #64b5f6; text-decoration: none; font-size: 0.9rem;">
                            查看技术文档 <i class="fa-solid fa-file-alt"></i>
                        </a>
                    </div>
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
                    <h3 style="color: #64b5f6; margin-bottom: 0.5rem;">向量数据库文档翻译系统</h3>
                    <p style="color: #b0bec5; margin-bottom: 1rem;">Python/Django/PostgreSQL • 2024.11 - 2024.12</p>
                    <p>• 基于Django开发的向量数据库文档翻译系统，支持中英文互译，项目经理</p>
                    <p>• 使用GPT-4对接口进行深度定制，结合向量数据库实现上下文感知翻译</p>
                    <p>• 集成文档管理、版本控制、翻译历史追踪等功能模块</p>
                    <p>• 实现自动化工作流，支持批量翻译和实时协作</p>
                </div>
                <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 10px;">
                    <h3 style="color: #64b5f6; margin-bottom: 0.5rem;">联邦学习风电预测系统</h3>
                    <p style="color: #b0bec5; margin-bottom: 1rem;">Django/PySyft/PyEcharts • 2023.12 - 2024.02</p>
                    <p>• 实现基于Django的异步任务调度系统，支持多节点协同训练</p>
                    <p>• 使用PySyft框架构建联邦学习环境，保护数据隐私</p>
                    <p>• 集成PyEcharts实现风电数据可视化和预测结果展示</p>
                    <p>• 设计分布式训练架构，提高模型训练效率</p>
                </div>
                <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 10px;">
                    <h3 style="color: #64b5f6; margin-bottom: 0.5rem;">公安--工单信息抽取</h3>
                    <p style="color: #b0bec5; margin-bottom: 1rem;">Flask/FastAPI/PostgreSQL/高德地图API • 2024.01 - 2024.05</p>
                    <p>• 设计工单处理微服务架构，采用责任链模式对接多数据源，日均处理3000+工单</p>
                    <p>• 实现基于Flask的核心业务逻辑，使用FastAPI构建高性能API接口</p>
                    <p>• 集成高德地图API实现地理位置解析和路径规划功能</p>
                    <p>• 优化PostgreSQL数据库查询性能，支持大规模数据处理</p>
                </div>
                <div style="padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 10px;">
                    <h3 style="color: #64b5f6; margin-bottom: 0.5rem;">云网孪生系统--智能问答大模型</h3>
                    <p style="color: #b0bec5; margin-bottom: 1rem;">Django/PostgreSQL/Milvus/FastAPI • 2023.09 - 2023.12</p>
                    <p>• 搭建微服务架构，采用Django实现问答引擎核心模块，异步处理用户请求，支持200+并发问答</p>
                    <p>• 集成Milvus向量数据库，实现基于语义检索的智能问答</p>
                    <p>• 使用FastAPI构建RESTful API接口，支持多客户端接入</p>
                    <p>• 实现基于上下文的对话管理和知识图谱构建</p>
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
                        <span style="background: #2196f3; padding: 6px 12px; border-radius: 15px; text-align: center;">Python</span>
                        <span style="background: #4caf50; padding: 6px 12px; border-radius: 15px; text-align: center;">JavaScript</span>
                        <span style="background: #ff9800; padding: 6px 12px; border-radius: 15px; text-align: center;">TypeScript</span>
                        <span style="background: #9c27b0; padding: 6px 12px; border-radius: 15px; text-align: center;">Java</span>
                        <span style="background: #f44336; padding: 6px 12px; border-radius: 15px; text-align: center;">SQL</span>
                    </div>
                </div>
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #64b5f6; margin-bottom: 1rem;">框架与工具</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.5rem;">
                        <span style="background: #00bcd4; padding: 6px 12px; border-radius: 15px; text-align: center;">Django</span>
                        <span style="background: #009688; padding: 6px 12px; border-radius: 15px; text-align: center;">FastAPI</span>
                        <span style="background: #673ab7; padding: 6px 12px; border-radius: 15px; text-align: center;">LangChain</span>
                        <span style="background: #3f51b5; padding: 6px 12px; border-radius: 15px; text-align: center;">PyTorch</span>
                        <span style="background: #795548; padding: 6px 12px; border-radius: 15px; text-align: center;">Transformers</span>
                        <span style="background: #607d8b; padding: 6px 12px; border-radius: 15px; text-align: center;">Three.js</span>
                    </div>
                </div>
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #64b5f6; margin-bottom: 1rem;">数据库与存储</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem;">
                        <span style="background: #336791; padding: 6px 12px; border-radius: 15px; text-align: center;">PostgreSQL</span>
                        <span style="background: #4ea94b; padding: 6px 12px; border-radius: 15px; text-align: center;">MongoDB</span>
                        <span style="background: #dc382d; padding: 6px 12px; border-radius: 15px; text-align: center;">Redis</span>
                        <span style="background: #1976d2; padding: 6px 12px; border-radius: 15px; text-align: center;">Milvus</span>
                        <span style="background: #ff6f00; padding: 6px 12px; border-radius: 15px; text-align: center;">Elasticsearch</span>
                    </div>
                </div>
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #64b5f6; margin-bottom: 1rem;">专业技能</h3>
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px;">
                        <p>• <strong>RAG系统开发</strong>：检索增强生成、向量检索优化</p>
                        <p>• <strong>大语言模型</strong>：模型微调、推理优化、部署实践</p>
                        <p>• <strong>MCP系统</strong>：多模态数据处理、系统集成</p>
                        <p>• <strong>后端开发</strong>：API设计、数据库优化、系统架构</p>
                        <p>• <strong>自然语言处理</strong>：文本处理、语义理解、信息提取</p>
                        <p>• <strong>向量数据库</strong>：Milvus、Pinecone、Qdrant等向量检索系统</p>
                    </div>
                </div>
                <div>
                    <h3 style="color: #64b5f6; margin-bottom: 1rem;">开发工具</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.5rem;">
                        <span style="background: #f05032; padding: 6px 12px; border-radius: 15px; text-align: center;">Git</span>
                        <span style="background: #2496ed; padding: 6px 12px; border-radius: 15px; text-align: center;">Docker</span>
                        <span style="background: #326ce5; padding: 6px 12px; border-radius: 15px; text-align: center;">Kubernetes</span>
                        <span style="background: #ff9900; padding: 6px 12px; border-radius: 15px; text-align: center;">AWS</span>
                        <span style="background: #4285f4; padding: 6px 12px; border-radius: 15px; text-align: center;">GCP</span>
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