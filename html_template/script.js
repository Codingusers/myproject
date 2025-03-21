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
        details.style.display = 'none';
        details.style.opacity = '0';
    });

// Chatbox 相關功能 (在 document.addEventListener('DOMContentLoaded', function() { 內部)
    
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

// 發送訊息到 Ollama
async function sendMessage(message) {
    try {
        // 添加用戶訊息到聊天框
        addMessage(message, 'user');
        
        // 添加思考中的提示
        const thinkingId = addThinkingMessage();
        
        // 呼叫 Flask API
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message
            })
        });
        
        if (!response.ok) {
            throw new Error('API 請求失敗: ' + response.status);
        }
        
        const data = await response.json();
        
        // 移除思考中的提示
        removeThinkingMessage(thinkingId);
        
        // 檢查是否有錯誤
        if (data.error) {
            addMessage('錯誤: ' + data.error, 'system');
        } else {
            // 添加 AI 回答
            addMessage(data.response, 'bot');
        }
        
    } catch (error) {
        console.error('錯誤:', error);
        // 移除思考中的提示（如果有）
        document.querySelector('.message.thinking')?.remove();
        // 顯示錯誤訊息
        addMessage('抱歉，無法連接到 AI 服務。請確認您的 Flask 與 Ollama 服務已啟動。', 'system');
    }
}

// 添加訊息到聊天框
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv.id;
}

// 添加思考中的提示
function addThinkingMessage() {
    const thinkingDiv = document.createElement('div');
    thinkingDiv.classList.add('message', 'system', 'thinking');
    thinkingDiv.textContent = '思考中...';
    chatMessages.appendChild(thinkingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return Date.now().toString();  // 返回一個唯一 ID
}

// 移除思考中的提示
function removeThinkingMessage(id) {
    document.querySelector('.message.thinking')?.remove();
}

// 發送按鈕點擊事件
sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        sendMessage(message);
        chatInput.value = '';
        chatInput.style.height = 'auto'; // 重設輸入框高度
    }
});

// 按 Enter 發送訊息（Shift+Enter 換行）
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendButton.click();
    }
});

    // 調整輸入框高度
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
});

function toggleProject(projectId) {
    const card = document.getElementById(projectId).closest('.project-card');
    const details = document.getElementById(projectId);
    const icon = card.querySelector('.expand-icon');
    
    // 切換活動狀態
    const isActive = card.classList.toggle('active');
    
    // 更新展開圖標
    icon.textContent = isActive ? '▼' : '▶';
    
    // 直接控制顯示/隱藏
    if (isActive) {
        details.style.display = 'block';
        // 使用 setTimeout 確保 display: block 生效後再添加 opacity
        setTimeout(() => {
            details.style.opacity = '1';
        }, 10);
    } else {
        details.style.opacity = '0';
        // 等待淡出動畫完成後隱藏元素
        setTimeout(() => {
            details.style.display = 'none';
        }, 300);
    }
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