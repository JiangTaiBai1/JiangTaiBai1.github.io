// 显示模态框
export function showModal(modalElement) {
    modalElement.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 隐藏模态框
export function hideModal(modalElement) {
    modalElement.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 显示加载中模态框
export function showLoading() {
    const loadingModal = document.getElementById('loading-modal');
    loadingModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 隐藏加载中模态框
export function hideLoading() {
    const loadingModal = document.getElementById('loading-modal');
    loadingModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 显示确认对话框
export function showConfirm(message, confirmCallback) {
    const confirmModal = document.getElementById('confirm-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');
    
    confirmMessage.textContent = message;
    showModal(confirmModal);
    
    // 移除旧的事件监听器
    const oldYes = confirmYes.cloneNode(true);
    const oldNo = confirmNo.cloneNode(true);
    confirmYes.parentNode.replaceChild(oldYes, confirmYes);
    confirmNo.parentNode.replaceChild(oldNo, confirmNo);
    
    // 添加新的事件监听器
    document.getElementById('confirm-yes').addEventListener('click', () => {
        hideModal(confirmModal);
        confirmCallback();
    });
    
    document.getElementById('confirm-no').addEventListener('click', () => {
        hideModal(confirmModal);
    });
}

// 格式化日期
export function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
}

// 格式化日期时间
export function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
}

// 检查用户是否登录
export function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && !window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
    }
}

// 初始化标签页切换
export function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.form-container');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
        });
    });
}