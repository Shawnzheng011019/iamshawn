/**
 * 网络状态监控脚本
 * 监控网络连接状态，提供实时反馈
 */

class NetworkMonitor {
    constructor() {
        this.isOnline = navigator.onLine;
        this.statusIndicator = null;
        this.init();
    }

    init() {
        this.createStatusIndicator();
        this.setupEventListeners();
        this.updateStatus();
    }

    createStatusIndicator() {
        this.statusIndicator = document.createElement('div');
        this.statusIndicator.id = 'network-status';
        this.statusIndicator.className = 'fixed bottom-4 right-4 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 z-50';
        this.statusIndicator.style.transform = 'translateY(100px)';
        document.body.appendChild(this.statusIndicator);
    }

    setupEventListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateStatus();
            this.showTemporaryMessage('网络连接已恢复', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateStatus();
            this.showTemporaryMessage('网络连接已断开', 'warning');
        });
    }

    updateStatus() {
        if (!this.statusIndicator) return;

        if (this.isOnline) {
            this.statusIndicator.className = 'fixed bottom-4 right-4 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 z-50 bg-green-500 text-white';
            this.statusIndicator.innerHTML = '<i class="fa-solid fa-wifi mr-2"></i>网络正常';
        } else {
            this.statusIndicator.className = 'fixed bottom-4 right-4 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 z-50 bg-red-500 text-white';
            this.statusIndicator.innerHTML = '<i class="fa-solid fa-wifi-slash mr-2"></i>离线模式';
        }

        // 自动隐藏在线状态指示器
        if (this.isOnline) {
            setTimeout(() => {
                if (this.statusIndicator) {
                    this.statusIndicator.style.transform = 'translateY(100px)';
                }
            }, 3000);
        } else {
            this.statusIndicator.style.transform = 'translateY(0)';
        }
    }

    showTemporaryMessage(message, type = 'info') {
        const colors = {
            success: 'bg-green-500',
            warning: 'bg-yellow-500',
            error: 'bg-red-500',
            info: 'bg-blue-500'
        };

        if (this.statusIndicator) {
            this.statusIndicator.className = `fixed bottom-4 right-4 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 z-50 ${colors[type]} text-white`;
            this.statusIndicator.innerHTML = `<i class="fa-solid fa-info-circle mr-2"></i>${message}`;
            this.statusIndicator.style.transform = 'translateY(0)';

            setTimeout(() => {
                this.updateStatus();
            }, 3000);
        }
    }

    testConnectivity() {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = 'https://cdn.jsdelivr.net/gh/Shawnzheng011019/iamshawn@main/posts/posts.json?' + Math.random();
        });
    }

    async checkNetworkQuality() {
        if (!this.isOnline) return false;

        try {
            const startTime = Date.now();
            const canConnect = await this.testConnectivity();
            const endTime = Date.now();
            const latency = endTime - startTime;

            if (canConnect) {
                if (latency < 1000) {
                    this.showTemporaryMessage('网络连接优秀', 'success');
                } else if (latency < 3000) {
                    this.showTemporaryMessage('网络连接良好', 'info');
                } else {
                    this.showTemporaryMessage('网络连接较慢', 'warning');
                }
                return true;
            } else {
                this.showTemporaryMessage('数据源不可达', 'error');
                return false;
            }
        } catch (error) {
            this.showTemporaryMessage('网络检测失败', 'error');
            return false;
        }
    }
}

// 初始化网络监控
if (typeof window !== 'undefined') {
    const networkMonitor = new NetworkMonitor();
    
    // 全局暴露网络监控实例
    window.networkMonitor = networkMonitor;
    
    // 每5分钟检查一次网络质量
    setInterval(() => {
        networkMonitor.checkNetworkQuality();
    }, 5 * 60 * 1000);
} 