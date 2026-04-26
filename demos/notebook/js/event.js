import api from './api.js';
import { showModal, hideModal, showLoading, hideLoading, showConfirm } from './utils.js';

class EventManager {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalEvents = 0;
        this.initElements();
        this.bindEvents();
        this.loadEvents();
        this.loadCategoriesForFilter();
    }

    initElements() {
        this.eventsContainer = document.getElementById('events-container');
        this.createEventBtn = document.getElementById('create-event-btn');
        this.eventSearch = document.getElementById('event-search');
        this.searchEventBtn = document.getElementById('search-event-btn');
        this.categoryFilter = document.getElementById('category-filter');
        this.statusFilter = document.getElementById('status-filter');
        this.startDateFilter = document.getElementById('start-date-filter');
        this.endDateFilter = document.getElementById('end-date-filter');
        this.prevPageBtn = document.getElementById('prev-page');
        this.nextPageBtn = document.getElementById('next-page');
        this.pageInfo = document.getElementById('page-info');
        
        // 事件模态框元素
        this.eventModal = document.getElementById('event-modal');
        this.eventForm = document.getElementById('event-form');
        this.eventIdInput = document.getElementById('event-id');
        this.eventTitleInput = document.getElementById('event-title');
        this.eventCategorySelect = document.getElementById('event-category');
        this.eventContentInput = document.getElementById('event-content');
        this.eventStartDateInput = document.getElementById('event-start-date');
        this.eventEndDateInput = document.getElementById('event-end-date');
        this.eventStatusSelect = document.getElementById('event-status');
        this.eventLevelSelect = document.getElementById('event-level');
    }

    bindEvents() {
        this.createEventBtn.addEventListener('click', () => this.showEventForm());
        this.searchEventBtn.addEventListener('click', () => this.searchEvents());
        this.eventSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchEvents();
        });
        
        this.categoryFilter.addEventListener('change', () => this.loadEvents());
        this.statusFilter.addEventListener('change', () => this.loadEvents());
        this.startDateFilter.addEventListener('change', () => this.loadEvents());
        this.endDateFilter.addEventListener('change', () => this.loadEvents());
        
        this.prevPageBtn.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadEvents();
            }
        });
        
        this.nextPageBtn.addEventListener('click', () => {
            if (this.currentPage * this.pageSize < this.totalEvents) {
                this.currentPage++;
                this.loadEvents();
            }
        });
        
        // 事件表单提交
        this.eventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent();
        });
        
        // 关闭模态框
        document.querySelectorAll('.close-btn, #cancel-event-btn').forEach(btn => {
            btn.addEventListener('click', () => hideModal(this.eventModal));
        });
    }

    async loadEvents() {
        showLoading();
        
        try {
            const query = {
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                title: this.eventSearch.value.trim(),
                categoryId: this.categoryFilter.value || undefined,
                status: this.statusFilter.value || undefined,
                startDateBegin: this.startDateFilter.value || undefined,
                startDateEnd: this.endDateFilter.value || undefined
            };
            
            const response = await api.getEvents(query);
            this.totalEvents = response.data.total || 0;
            this.renderEvents(response.data.list || []);
            this.updatePagination();
        } catch (error) {
            console.error('加载事件失败:', error);
            alert('加载事件失败: ' + error.message);
        } finally {
            hideLoading();
        }
    }

    async loadCategoriesForFilter() {
        try {
            const response = await api.getCategories();
            const categories = response.data.list || [];
            
            // 填充事件表单的分类下拉框
            this.eventCategorySelect.innerHTML = '<option value="">无分类</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                this.eventCategorySelect.appendChild(option);
            });
            
            // 填充筛选器的分类下拉框
            this.categoryFilter.innerHTML = '<option value="">全部</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                this.categoryFilter.appendChild(option);
            });
        } catch (error) {
            console.error('加载分类失败:', error);
        }
    }

    renderEvents(events) {
        this.eventsContainer.innerHTML = '';
        
        if (events.length === 0) {
            const emptyRow = document.createElement('div');
            emptyRow.className = 'empty-row';
            emptyRow.textContent = '没有找到事件';
            this.eventsContainer.appendChild(emptyRow);
            return;
        }
        
        events.forEach(event => {
            const eventRow = document.createElement('div');
            eventRow.className = 'list-item';
            eventRow.innerHTML = `
                <div class="item-col" style="width: 25%">
                    <strong>${event.title}</strong>
                    ${event.content ? `<p class="event-content">${event.content}</p>` : ''}
                </div>
                <div class="item-col" style="width: 15%">${event.categoryName || '无分类'}</div>
                <div class="item-col" style="width: 15%">${this.formatDateTime(event.startDate)}</div>
                <div class="item-col" style="width: 15%">${this.formatDateTime(event.endDate)}</div>
                <div class="item-col" style="width: 10%">
                    <span class="status-badge ${this.getStatusClass(event.status)}">${event.status}</span>
                </div>
                <div class="item-col actions" style="width: 20%">
                    <button class="btn btn-sm btn-edit" data-id="${event.id}">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn btn-sm btn-delete" data-id="${event.id}">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                    ${event.status !== '已完成' ? `
                    <button class="btn btn-sm btn-complete" data-id="${event.id}">
                        <i class="fas fa-check"></i> 完成
                    </button>` : ''}
                </div>
            `;
            
            this.eventsContainer.appendChild(eventRow);
        });
        
        // 绑定操作按钮事件
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => this.editEvent(btn.dataset.id));
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => this.confirmDeleteEvent(btn.dataset.id));
        });
        
        document.querySelectorAll('.btn-complete').forEach(btn => {
            btn.addEventListener('click', () => this.completeEvent(btn.dataset.id));
        });
    }

    updatePagination() {
        this.pageInfo.textContent = `第 ${this.currentPage} 页`;
        this.prevPageBtn.disabled = this.currentPage <= 1;
        this.nextPageBtn.disabled = this.currentPage * this.pageSize >= this.totalEvents;
    }

    searchEvents() {
        this.currentPage = 1;
        this.loadEvents();
    }

    showEventForm(event = null) {
        this.eventForm.reset();
        this.eventIdInput.value = '';
        document.getElementById('event-modal-title').textContent = '创建新事件';
        
        if (event) {
            document.getElementById('event-modal-title').textContent = '编辑事件';
            this.eventIdInput.value = event.id;
            this.eventTitleInput.value = event.title;
            this.eventContentInput.value = event.content || '';
            this.eventStartDateInput.value = this.formatDateTimeForInput(event.startDate);
            this.eventEndDateInput.value = this.formatDateTimeForInput(event.endDate);
            this.eventStatusSelect.value = event.status || '未开始';
            this.eventLevelSelect.value = event.level || '中';
            
            if (event.categoryId) {
                this.eventCategorySelect.value = event.categoryId;
            }
        }
        
        showModal(this.eventModal);
    }

    async saveEvent() {
        showLoading();
        
        try {
            const eventData = {
                title: this.eventTitleInput.value.trim(),
                content: this.eventContentInput.value.trim(),
                startDate: this.eventStartDateInput.value,
                endDate: this.eventEndDateInput.value,
                status: this.eventStatusSelect.value,
                level: this.eventLevelSelect.value,
                categoryId: this.eventCategorySelect.value || null
            };
            
            if (this.eventIdInput.value) {
                // 更新事件
                eventData.id = this.eventIdInput.value;
                await api.updateEvent(this.eventIdInput.value, eventData);
            } else {
                // 创建事件
                await api.createEvent(eventData);
            }
            
            hideModal(this.eventModal);
            this.loadEvents();
        } catch (error) {
            console.error('保存事件失败:', error);
            alert('保存事件失败: ' + error.message);
        } finally {
            hideLoading();
        }
    }

    async editEvent(eventId) {
        showLoading();
        
        try {
            const event = await api.getEventById(eventId);
            this.showEventForm(event);
        } catch (error) {
            console.error('获取事件详情失败:', error);
            alert('获取事件详情失败: ' + error.message);
        } finally {
            hideLoading();
        }
    }

    confirmDeleteEvent(eventId) {
        showConfirm('确定要删除这个事件吗？', async () => {
            showLoading();
            
            try {
                await api.deleteEvent(eventId);
                this.loadEvents();
            } catch (error) {
                console.error('删除事件失败:', error);
                alert('删除事件失败: ' + error.message);
            } finally {
                hideLoading();
            }
        });
    }

    async completeEvent(eventId) {
        showLoading();
        
        try {
            await api.updateEventStatus(eventId, '已完成');
            this.loadEvents();
        } catch (error) {
            console.error('完成事件失败:', error);
            alert('完成事件失败: ' + error.message);
        } finally {
            hideLoading();
        }
    }

    formatDateTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN');
    }

    formatDateTimeForInput(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    }

    getStatusClass(status) {
        switch (status) {
            case '未开始': return 'status-pending';
            case '进行中': return 'status-in-progress';
            case '已完成': return 'status-completed';
            default: return '';
        }
    }
}

export default EventManager;