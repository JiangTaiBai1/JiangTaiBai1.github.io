import api from './api.js';
import EventManager from './event.js';
import CategoryManager from './category.js';
import { checkAuth, initTabs } from './utils.js';

class NotebookApp {
    constructor() {
        checkAuth();
        this.initAuth();
        this.initUI();
        this.loadUserInfo();
        
        // 初始化各个模块
        this.eventManager = new EventManager();
        this.categoryManager = new CategoryManager();
    }

    initAuth() {
        // 登出按钮
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    await api.logout();
                    localStorage.removeItem('token');
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error('登出失败:', error);
                }
            });
        }
    }

    initUI() {
        // 侧边栏导航
        const navItems = document.querySelectorAll('.sidebar-nav li');
        const sections = document.querySelectorAll('.content-section');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(i => i.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                item.classList.add('active');
                document.getElementById(`${item.dataset.section}-section`).classList.add('active');
            });
        });
    }

    async loadUserInfo() {
        try {
            // 这里简化处理，实际应从API获取用户信息
            const usernameDisplay = document.getElementById('username-display');
            if (usernameDisplay) {
                usernameDisplay.textContent = localStorage.getItem('username') || '用户';
            }
        } catch (error) {
            console.error('加载用户信息失败:', error);
        }
    }
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('login-form')) {
        initTabs();
    } else {
        new NotebookApp();
    }
});