document.addEventListener('DOMContentLoaded', function() {
    // 平滑滾動效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 技能進度條動畫
    function animateSkills() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
        });
    }

    // 當元素進入視圖時觸發動畫
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('skill-progress')) {
                    animateSkills();
                }
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.5 });

    // 觀察技能進度條
    document.querySelectorAll('.skill-progress').forEach(bar => {
        observer.observe(bar);
    });

    // 導航欄滾動效果
    let lastScrollTop = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            // 向下滾動
            header.style.transform = 'translateY(-100%)';
        } else {
            // 向上滾動
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // 初始化動畫
    animateSkills();

    // 創建粒子
    createParticles();

    // 確保所有專案詳細內容初始狀態正確
    document.querySelectorAll('.project-details').forEach(details => {
        details.style.display = '';  // 移除可能存在的 display 樣式
    });
});

function toggleProject(projectId) {
    const card = document.getElementById(projectId).closest('.project-card');
    const details = document.getElementById(projectId);
    const icon = card.querySelector('.expand-icon');
    
    // 切換活動狀態
    card.classList.toggle('active');
    
    // 更新展開圖標
    icon.textContent = card.classList.contains('active') ? '▼' : '▶';
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // 簡化遮罩層點擊事件
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            const visibleDetails = document.querySelector('.project-details[style*="display: block"]');
            if (visibleDetails) {
                closeProject(visibleDetails.id);
            }
        }
    });
    
    document.body.appendChild(overlay);
    return overlay;
}

// 添加 ESC 鍵關閉功能
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const visibleDetails = document.querySelector('.project-details[style*="display: block"]');
        if (visibleDetails) {
            closeProject(visibleDetails.id);
        }
    }
});

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 隨機位置和動畫延遲
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// 添加浮動動畫
const floatKeyframes = `
@keyframes float {
    0% {
        transform: translate(0, 0);
    }
    25% {
        transform: translate(100px, 100px);
    }
    50% {
        transform: translate(200px, 0);
    }
    75% {
        transform: translate(100px, -100px);
    }
    100% {
        transform: translate(0, 0);
    }
}`;

const styleSheet = document.createElement('style');
styleSheet.textContent = floatKeyframes;
document.head.appendChild(styleSheet);
