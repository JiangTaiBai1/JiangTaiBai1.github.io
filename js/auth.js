import api from './api.js';
import { showLoading, hideLoading } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('error-message');

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((item) => item.classList.remove('active'));
            forms.forEach((form) => form.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await handleLogin();
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            await handleRegister();
        });
    }

    async function handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            showMessage('用户名和密码不能为空');
            return;
        }

        showLoading();
        try {
            await api.login({ username, password });
            showMessage('登录成功，正在进入控制台...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 400);
        } catch (error) {
            showMessage(error.message || '登录失败');
        } finally {
            hideLoading();
        }
    }

    async function handleRegister() {
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();

        if (!username || !password) {
            showMessage('用户名和密码不能为空');
            return;
        }

        showLoading();
        try {
            await api.register({ username, password, name, email });
            showMessage('注册成功，请直接登录', 'success');
            document.querySelector('.auth-tab[data-tab="login-form"]').click();
            registerForm.reset();
            document.getElementById('username').value = username;
        } catch (error) {
            showMessage(error.message || '注册失败');
        } finally {
            hideLoading();
        }
    }

    function showMessage(message, type = 'error') {
        errorMessage.textContent = message;
        errorMessage.className = `error-message ${type}`;
        errorMessage.style.display = 'block';

        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 4000);
    }
});