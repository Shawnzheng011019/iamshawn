// 导航栏滚动效果
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
        navbar.classList.add('bg-white', 'shadow-md');
        navbar.classList.remove('py-3');
        navbar.classList.add('py-2');
        
        backToTop.classList.remove('opacity-0', 'invisible');
        backToTop.classList.add('opacity-100', 'visible');
    } else {
        navbar.classList.remove('bg-white', 'shadow-md');
        navbar.classList.remove('py-2');
        navbar.classList.add('py-3');
        
        backToTop.classList.add('opacity-0', 'invisible');
        backToTop.classList.remove('opacity-100', 'visible');
    }
});

// 移动端菜单
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', function() {
    mobileMenu.classList.toggle('hidden');
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // 关闭移动菜单（如果打开）
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// 返回顶部
backToTop.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 联系表单提交
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 这里可以添加表单验证和提交逻辑
    alert('消息发送成功！我会尽快回复您。');
    contactForm.reset();
});

// 元素进入视口时的动画
const animateOnScroll = function() {
    const elements = document.querySelectorAll('.grid > div, section > div > h2');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.classList.add('animate-fadeIn');
        }
    });
};

// 初始检查
animateOnScroll();

// 滚动时检查
window.addEventListener('scroll', animateOnScroll);

// 项目卡片悬停效果
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.querySelector('.card-overlay').style.opacity = '1';
        this.querySelector('.card-title').style.transform = 'translateY(0)';
        this.querySelector('.card-description').style.transform = 'translateY(0)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.querySelector('.card-overlay').style.opacity = '0';
        this.querySelector('.card-title').style.transform = 'translateY(10px)';
        this.querySelector('.card-description').style.transform = 'translateY(10px)';
    });
});
    