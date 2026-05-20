import api from './api.js';
import { showModal, hideModal, showLoading, hideLoading, showConfirm } from './utils.js';

class CategoryManager {
    constructor() {
        this.initElements();
        this.bindEvents();
        this.loadCategories();
    }

    initElements() {
        this.categoriesContainer = document.getElementById('categories-container');
        this.createCategoryBtn = document.getElementById('create-category-btn');
        
        // 分类模态框元素
        this.categoryModal = document.getElementById('category-modal');
        this.categoryForm = document.getElementById('category-form');
        this.categoryIdInput = document.getElementById('category-id');
        this.categoryNameInput = document.getElementById('category-name');
    }

    bindEvents() {
        this.createCategoryBtn.addEventListener('click', () => this.showCategoryForm());
        
        // 分类表单提交
        this.categoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCategory();
        });
        
        // 关闭模态框
        document.querySelectorAll('.close-btn, #cancel-category-btn').forEach(btn => {
            btn.addEventListener('click', () => hideModal(this.categoryModal));
        });
    }

    async loadCategories() {
        showLoading();
        
        try {
            const response = await api.getCategories();
            this.renderCategories(response.data.list || []);
        } catch (error) {
            console.error('加载分类失败:', error);
            alert('加载分类失败: ' + error.message);
        } finally {
            hideLoading();
        }
    }

    renderCategories(categories) {
        this.categoriesContainer.innerHTML = '';
        
        if (categories.length === 0) {
            const emptyRow = document.createElement('div');
            emptyRow.className = 'empty-row';
            emptyRow.textContent = '没有分类，请创建一个';
            this.categoriesContainer.appendChild(emptyRow);
            return;
        }
        
        categories.forEach(category => {
            const categoryRow = document.createElement('div');
            categoryRow.className = 'list-item';
            categoryRow.innerHTML = `
                <div class="item-col" style="width: 70%">
                    <span class="category-name">${category.name}</span>
                </div>
                <div class="item-col actions" style="width: 30%">
                    <button class="btn btn-sm btn-edit" data-id="${category.id}">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn btn-sm btn-delete" data-id="${category.id}">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            `;
            
            this.categoriesContainer.appendChild(categoryRow);
        });
        
        // 绑定操作按钮事件
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => this.editCategory(btn.dataset.id));
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => this.confirmDeleteCategory(btn.dataset.id));
        });
    }

    showCategoryForm(category = null) {
        this.categoryForm.reset();
        this.categoryIdInput.value = '';
        document.getElementById('category-modal-title').textContent = '创建新分类';
        
        if (category) {
            document.getElementById('category-modal-title').textContent = '编辑分类';
            this.categoryIdInput.value = category.id;
            this.categoryNameInput.value = category.name;
        }
        
        showModal(this.categoryModal);
    }

    async saveCategory() {
        showLoading();
        
        try {
            const categoryData = {
                name: this.categoryNameInput.value.trim()
            };
            
            if (this.categoryIdInput.value) {
                // 更新分类
                await api.updateCategory(this.categoryIdInput.value, categoryData.name);
            } else {
                // 创建分类
                await api.createCategory(categoryData.name);
            }
            
            hideModal(this.categoryModal);
            this.loadCategories();
        } catch (error) {
            console.error('保存分类失败:', error);
            alert('保存分类失败: ' + error.message);
        } finally {
            hideLoading();
        }
    }

    async editCategory(categoryId) {
        showLoading();
        
        try {
            // 这里简化处理，直接从列表获取数据
            const categoryName = document.querySelector(`.btn-edit[data-id="${categoryId}"]`)
                .closest('.list-item')
                .querySelector('.category-name').textContent;
            
            this.showCategoryForm({
                id: categoryId,
                name: categoryName
            });
        } catch (error) {
            console.error('获取分类详情失败:', error);
            alert('获取分类详情失败: ' + error.message);
        } finally {
            hideLoading();
        }
    }

    confirmDeleteCategory(categoryId) {
        showConfirm('确定要删除这个分类吗？删除后无法恢复！', async () => {
            showLoading();
            
            try {
                await api.deleteCategory(categoryId);
                this.loadCategories();
            } catch (error) {
                console.error('删除分类失败:', error);
                alert('删除分类失败: ' + error.message);
            } finally {
                hideLoading();
            }
        });
    }
}

export default CategoryManager;