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
});

function toggleProject(projectId) {
    const details = document.getElementById(projectId);
    const overlay = document.querySelector('.modal-overlay') || createOverlay();
    
    if (details.style.display === 'none' || !details.style.display) {
        // 顯示模態視窗
        overlay.style.display = 'block';
        details.style.display = 'block';
        
        // 添加活動狀態
        overlay.classList.add('active');
        details.classList.add('active');
        document.body.classList.add('modal-active');
        
        // 添加關閉按鈕
        if (!details.querySelector('.close-button')) {
            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.innerHTML = '×';
            closeButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeProject(projectId);
            };
            details.insertBefore(closeButton, details.firstChild);
        }
        
        document.body.style.overflow = 'hidden';
    }
}

function closeProject(projectId) {
    const details = document.getElementById(projectId);
    const overlay = document.querySelector('.modal-overlay');
    
    // 移除活動狀態
    overlay.classList.remove('active');
    details.classList.remove('active');
    document.body.classList.remove('modal-active');
    
    // 隱藏元素
    details.style.display = 'none';
    overlay.style.display = 'none';
    
    document.body.style.overflow = '';
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
