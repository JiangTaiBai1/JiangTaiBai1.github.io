const USERS_KEY = 'notebook_demo_users';
const CATEGORIES_KEY = 'notebook_demo_categories';
const EVENTS_KEY = 'notebook_demo_events';
const SEQ_KEY = 'notebook_demo_seq';

class ApiClient {
    constructor() {
        this.token = localStorage.getItem('token');
        this.ensureSeedData();
    }

    ensureSeedData() {
        if (!localStorage.getItem(USERS_KEY)) {
            const users = [
                {
                    id: 1,
                    username: 'demo',
                    password: '123456',
                    name: '演示用户',
                    email: 'demo@example.com',
                },
            ];
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }

        if (!localStorage.getItem(CATEGORIES_KEY)) {
            const categories = [
                { id: 1, name: '学习' },
                { id: 2, name: '工作' },
                { id: 3, name: '生活' },
            ];
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
        }

        if (!localStorage.getItem(EVENTS_KEY)) {
            const events = [
                {
                    id: 1,
                    title: '完成个人网站作品整理',
                    content: '把三个课程项目整理成可展示的作品集。',
                    startDate: '2026-04-20T09:00',
                    endDate: '2026-04-20T12:00',
                    status: '进行中',
                    level: '高',
                    categoryId: 2,
                },
                {
                    id: 2,
                    title: '复习 JavaScript 模块化',
                    content: '回顾 import/export、模块拆分与本地存储。',
                    startDate: '2026-04-21T14:00',
                    endDate: '2026-04-21T16:00',
                    status: '未开始',
                    level: '中',
                    categoryId: 1,
                },
                {
                    id: 3,
                    title: '整理游戏开发素材',
                    content: '筛选坦克游戏地图、角色与音效资源。',
                    startDate: '2026-04-18T19:00',
                    endDate: '2026-04-18T21:00',
                    status: '已完成',
                    level: '中',
                    categoryId: 3,
                },
            ];
            localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
        }

        if (!localStorage.getItem(SEQ_KEY)) {
            localStorage.setItem(SEQ_KEY, JSON.stringify({ user: 2, category: 4, event: 4 }));
        }
    }

    read(key, fallback = []) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            console.error('读取本地数据失败:', error);
            return fallback;
        }
    }

    write(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    nextId(type) {
        const seq = this.read(SEQ_KEY, { user: 1, category: 1, event: 1 });
        const value = seq[type];
        seq[type] += 1;
        this.write(SEQ_KEY, seq);
        return value;
    }

    ok(data = {}, message = '操作成功') {
        return Promise.resolve({ code: 200, message, data });
    }

    fail(message) {
        return Promise.reject(new Error(message));
    }

    withCategoryName(event) {
        const categories = this.read(CATEGORIES_KEY, []);
        const category = categories.find((item) => String(item.id) === String(event.categoryId));
        return {
            ...event,
            categoryName: category?.name || '无分类',
        };
    }

    // 认证相关
    async register(user) {
        const users = this.read(USERS_KEY, []);
        const exists = users.some((item) => item.username === user.username);
        if (exists) {
            return this.fail('用户名已存在');
        }

        const newUser = {
            id: this.nextId('user'),
            username: user.username,
            password: user.password,
            name: user.name || user.username,
            email: user.email || '',
        };
        users.push(newUser);
        this.write(USERS_KEY, users);
        return this.ok({}, '注册成功');
    }

    async login(credentials) {
        const users = this.read(USERS_KEY, []);
        const user = users.find(
            (item) => item.username === credentials.username && item.password === credentials.password
        );
        if (!user) {
            return this.fail('用户名或密码错误');
        }

        this.token = `demo-token-${user.id}`;
        localStorage.setItem('token', this.token);
        localStorage.setItem('username', user.username);
        return this.ok({ token: this.token, user }, '登录成功');
    }

    async logout() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        return this.ok({}, '已退出登录');
    }

    // 分类相关
    async getCategories() {
        const categories = this.read(CATEGORIES_KEY, []);
        return this.ok({ list: categories, total: categories.length });
    }

    async createCategory(name) {
        const categoryName = String(name || '').trim();
        if (!categoryName) {
            return this.fail('分类名称不能为空');
        }

        const categories = this.read(CATEGORIES_KEY, []);
        categories.push({ id: this.nextId('category'), name: categoryName });
        this.write(CATEGORIES_KEY, categories);
        return this.ok({}, '分类创建成功');
    }

    async updateCategory(id, name) {
        const categories = this.read(CATEGORIES_KEY, []);
        const target = categories.find((item) => String(item.id) === String(id));
        if (!target) {
            return this.fail('分类不存在');
        }

        target.name = String(name || '').trim() || target.name;
        this.write(CATEGORIES_KEY, categories);

        const events = this.read(EVENTS_KEY, []);
        this.write(EVENTS_KEY, events);
        return this.ok({}, '分类更新成功');
    }

    async deleteCategory(id) {
        const categories = this.read(CATEGORIES_KEY, []);
        const nextCategories = categories.filter((item) => String(item.id) !== String(id));
        this.write(CATEGORIES_KEY, nextCategories);

        const events = this.read(EVENTS_KEY, []).map((item) => (
            String(item.categoryId) === String(id)
                ? { ...item, categoryId: null }
                : item
        ));
        this.write(EVENTS_KEY, events);
        return this.ok({}, '分类删除成功');
    }

    // 事件相关
    async getEvents(query = {}) {
        const pageNum = Number(query.pageNum || 1);
        const pageSize = Number(query.pageSize || 10);
        let events = this.read(EVENTS_KEY, []).map((item) => this.withCategoryName(item));

        if (query.title) {
            const keyword = String(query.title).toLowerCase();
            events = events.filter((item) => item.title.toLowerCase().includes(keyword));
        }
        if (query.categoryId) {
            events = events.filter((item) => String(item.categoryId) === String(query.categoryId));
        }
        if (query.status) {
            events = events.filter((item) => item.status === query.status);
        }
        if (query.startDateBegin) {
            events = events.filter((item) => item.startDate >= query.startDateBegin);
        }
        if (query.startDateEnd) {
            events = events.filter((item) => item.startDate <= `${query.startDateEnd}T23:59`);
        }

        events.sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
        const total = events.length;
        const start = (pageNum - 1) * pageSize;
        const list = events.slice(start, start + pageSize);
        return this.ok({ list, total, pageNum, pageSize });
    }

    async getEventById(id) {
        const event = this.read(EVENTS_KEY, []).find((item) => String(item.id) === String(id));
        if (!event) {
            return this.fail('事件不存在');
        }
        return Promise.resolve(event);
    }

    async createEvent(event) {
        if (!String(event.title || '').trim()) {
            return this.fail('事件标题不能为空');
        }

        const events = this.read(EVENTS_KEY, []);
        events.push({
            id: this.nextId('event'),
            title: event.title,
            content: event.content || '',
            startDate: event.startDate,
            endDate: event.endDate,
            status: event.status || '未开始',
            level: event.level || '中',
            categoryId: event.categoryId ? Number(event.categoryId) : null,
        });
        this.write(EVENTS_KEY, events);
        return this.ok({}, '事件创建成功');
    }

    async updateEvent(id, event) {
        const events = this.read(EVENTS_KEY, []);
        const target = events.find((item) => String(item.id) === String(id));
        if (!target) {
            return this.fail('事件不存在');
        }

        Object.assign(target, {
            title: event.title,
            content: event.content || '',
            startDate: event.startDate,
            endDate: event.endDate,
            status: event.status,
            level: event.level,
            categoryId: event.categoryId ? Number(event.categoryId) : null,
        });
        this.write(EVENTS_KEY, events);
        return this.ok({}, '事件更新成功');
    }

    async deleteEvent(id) {
        const events = this.read(EVENTS_KEY, []);
        const nextEvents = events.filter((item) => String(item.id) !== String(id));
        this.write(EVENTS_KEY, nextEvents);
        return this.ok({}, '事件删除成功');
    }

    async updateEventStatus(id, status) {
        const events = this.read(EVENTS_KEY, []);
        const target = events.find((item) => String(item.id) === String(id));
        if (!target) {
            return this.fail('事件不存在');
        }

        target.status = status;
        this.write(EVENTS_KEY, events);
        return this.ok({}, '状态更新成功');
    }
}

const api = new ApiClient();
export default api;