/**
 * 本地存储管理工具
 * 提供对 localStorage 的封装，支持JSON序列化和安全访问
 */
class StorageManager {
    /**
     * 设置存储项
     * @param {string} key 键名
     * @param {any} value 值（会自动JSON序列化）
     */
    static set(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error('LocalStorage set error:', error);
        }
    }

    /**
     * 获取存储项
     * @param {string} key 键名
     * @param {any} defaultValue 默认值（可选）
     * @return {any} 解析后的值或默认值
     */
    static get(key, defaultValue = null) {
        try {
            const serializedValue = localStorage.getItem(key);
            if (serializedValue === null) {
                return defaultValue;
            }
            return JSON.parse(serializedValue);
        } catch (error) {
            console.error('LocalStorage get error:', error);
            return defaultValue;
        }
    }

    /**
     * 移除存储项
     * @param {string} key 键名
     */
    static remove(key) {
        localStorage.removeItem(key);
    }

    /**
     * 清空所有存储项
     */
    static clear() {
        localStorage.clear();
    }

    /**
     * 检查是否支持localStorage
     * @return {boolean}
     */
    static isSupported() {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    // 用户相关快捷方法
    static setUser(user) {
        this.set('user', user);
        this.set('token', user.token || '');
    }

    static getUser() {
        return this.get('user', {});
    }

    static clearUser() {
        this.remove('user');
        this.remove('token');
    }

    // 分类数据缓存
    static cacheCategories(categories) {
        this.set('cached_categories', categories);
        this.set('categories_last_updated', Date.now());
    }

    static getCachedCategories() {
        // 检查缓存是否过期（5分钟）
        const lastUpdated = this.get('categories_last_updated', 0);
        if (Date.now() - lastUpdated > 5 * 60 * 1000) {
            this.remove('cached_categories');
            return null;
        }
        return this.get('cached_categories');
    }
}

export default StorageManager;