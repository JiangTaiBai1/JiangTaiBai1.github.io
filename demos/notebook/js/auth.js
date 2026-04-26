import api from './api.js';
import { showLoading, hideLoading } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化标签页切换
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // 2. 表单提交逻辑（保持原有代码不变）
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleLogin();
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleRegister();
        });
    }

    async function handleRegister() {
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        
        if (!username || !password) {
            showError('用户名和密码不能为空');
            return;
        }

        showLoading();
        
         try {
            await api.register({ username, password, name, email });
            showError('注册成功，请登录', 'success');
            // 修正选择器为 .auth-tab
            document.querySelector('.auth-tab[data-tab="login-form"]').click();
            registerForm.reset();
        } catch (error) {
            showError(error.message || '注册失败');
        } finally {
            hideLoading();
        }
    }

    function showError(message, type = 'error') {
        errorMessage.textContent = message;
        errorMessage.className = `message ${type}`;
        errorMessage.style.display = 'block';
        
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
});