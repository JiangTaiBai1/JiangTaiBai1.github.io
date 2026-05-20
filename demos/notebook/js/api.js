class ApiClient {
    constructor() {
        this.baseUrl = 'http://localhost:8080/api';
        this.token = localStorage.getItem('token');
    }

    async request(method, endpoint, data = null) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            method,
            headers,
            credentials: 'include' // 支持session
        };

        if (data) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, config);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || '请求失败');
            }

            return result;
        } catch (error) {
            console.error('API请求错误:', error);
            throw error;
        }
    }

    // 认证相关
    async register(user) {
        return this.request('POST', '/auth/register', user);
    }

    async login(credentials) {
        return this.request('POST', '/auth/login', credentials);
    }

    async logout() {
        return this.request('POST', '/auth/logout');
    }

    // 分类相关
    async getCategories() {
        return this.request('GET', '/categories');
    }

    async createCategory(name) {
        return this.request('POST', '/categories', { name });
    }

    async updateCategory(id, name) {
        return this.request('PUT', `/categories/${id}`, { name });
    }

    async deleteCategory(id) {
        return this.request('DELETE', `/categories/${id}`);
    }

    // 事件相关
    async getEvents(query = {}) {
        const queryString = new URLSearchParams(query).toString();
        return this.request('GET', `/events?${queryString}`);
    }

    async createEvent(event) {
        return this.request('POST', '/events', event);
    }

    async updateEvent(id, event) {
        return this.request('PUT', `/events/${id}`, event);
    }

    async deleteEvent(id) {
        return this.request('DELETE', `/events/${id}`);
    }

    async updateEventStatus(id, status) {
        return this.request('PATCH', `/events/${id}/status`, { status });
    }
}

const api = new ApiClient();
export default api;