// Main Application Controller for ZORIX CRM
class ZorixCRMApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            // Initialize authentication system
            auth.init();

            // Initialize navigation handlers
            this.initializeNavigation();

            // Initialize sidebar toggle
            this.initializeSidebarToggle();

            // Initialize notification system
            this.initializeNotifications();

            // Apply custom configurations
            this.applyCustomConfigurations();

            // Initialize default data (async, don't block)
            this.initializeDefaultData().catch(console.error);

            // Set initialized flag
            this.isInitialized = true;

            console.log('ZORIX CRM App initialized successfully');

        } catch (error) {
            console.error('Error initializing ZORIX CRM App:', error);
        }
    }

    initializeNavigation() {
        // Navigation click handlers
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                if (page && page !== this.currentPage) {
                    this.navigateTo(page);
                }
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateTo(e.state.page, false);
            }
        });
    }

    initializeSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');

        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('sidebar-active');
                sidebar.classList.toggle('sidebar-inactive');
            });

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth < 1024) { // lg breakpoint
                    if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                        sidebar.classList.remove('sidebar-active');
                        sidebar.classList.add('sidebar-inactive');
                    }
                }
            });
        }
    }

    initializeNotifications() {
        // Create notification container
        if (!document.getElementById('notificationContainer')) {
            const container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'fixed top-4 right-4 z-50 space-y-2';
            document.body.appendChild(container);
        }

        // Initialize service worker for notifications (if supported)
        if ('serviceWorker' in navigator && 'Notification' in window) {
            this.initializeServiceWorker();
        }
    }

    async initializeServiceWorker() {
        try {
            // Register service worker for background notifications
            // This would be implemented in a real production environment
            console.log('Service worker support available');
        } catch (error) {
            console.log('Service worker registration failed:', error);
        }
    }

    applyCustomConfigurations() {
        try {
            // Carregar configurações salvas do localStorage
            const configuracoes = localStorage.getItem('zorix_configuracoes');
            if (!configuracoes) return;

            const config = JSON.parse(configuracoes);

            // Aplicar nome do sistema na tela de login
            if (config.nomeSistema) {
                const loginTitle = document.querySelector('#loginScreen h1');
                if (loginTitle) {
                    loginTitle.textContent = config.nomeSistema;
                }
            }

            // Aplicar cor de fundo na tela de login
            if (config.corFundoLogin) {
                const loginScreen = document.getElementById('loginScreen');
                if (loginScreen) {
                    const corClara = this.lightenColor(config.corFundoLogin, 20);
                    loginScreen.style.background = `linear-gradient(135deg, ${config.corFundoLogin}, ${corClara})`;
                    // Remover classe de background padrão
                    loginScreen.classList.remove('login-background');
                }

                // Também aplicar ao registerScreen se existir
                const registerScreen = document.getElementById('registerScreen');
                if (registerScreen) {
                    const corClara = this.lightenColor(config.corFundoLogin, 20);
                    registerScreen.style.background = `linear-gradient(135deg, ${config.corFundoLogin}, ${corClara})`;
                    registerScreen.classList.remove('login-background');
                }
            }

            console.log('Configurações customizadas aplicadas:', config);

        } catch (error) {
            console.error('Erro ao aplicar configurações customizadas:', error);
        }
    }

    lightenColor(color, percent) {
        // Função para clarear uma cor hexadecimal
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const B = (num >> 8 & 0x00FF) + amt;
        const G = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
               (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + 
               (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
    }

    async navigateTo(page, updateHistory = true) {
        // Check authentication
        if (!auth.isLoggedIn) {
            console.error('User not authenticated');
            return;
        }

        // Check permissions
        if (!auth.hasPermission(page)) {
            this.showNotification('Você não tem permissão para acessar esta página', 'error');
            return;
        }

        // Update active navigation
        this.updateActiveNavigation(page);

        // Update page history
        if (updateHistory) {
            history.pushState({ page }, '', `#${page}`);
        }

        // Load page content
        await this.loadPageContent(page);

        // Update current page
        this.currentPage = page;

        // Close sidebar on mobile after navigation
        if (window.innerWidth < 1024) {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('sidebar-active');
            sidebar.classList.add('sidebar-inactive');
        }
    }

    updateActiveNavigation(page) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('bg-gray-700', 'text-white');
            item.classList.add('text-gray-300');
        });

        // Add active class to current nav item
        const activeItem = document.querySelector(`.nav-item[data-page="${page}"]`);
        if (activeItem) {
            activeItem.classList.add('bg-gray-700', 'text-white');
            activeItem.classList.remove('text-gray-300');
        }
    }

    async loadPageContent(page) {
        try {
            // Show loading state
            this.showLoadingState();

            switch (page) {
                case 'dashboard':
                    if (window.dashboardManager) {
                        window.dashboardManager.loadDashboard();
                    }
                    break;

                case 'contas':
                    if (window.contasManager) {
                        await window.contasManager.loadContas();
                    }
                    break;

                case 'caixa':
                    if (window.caixaManager) {
                        window.caixaManager.loadCaixa();
                    }
                    break;

                case 'clientes':
                    if (window.clientesV5) {
                        await window.clientesV5.renderizar();
                    }
                    break;

                case 'projetos':
                    if (window.projetosManager) {
                        await window.projetosManager.loadProjetos();
                    }
                    break;

                case 'agenda':
                    if (window.agendaManager) {
                        await window.agendaManager.loadAgenda();
                    }
                    break;

                case 'interacoes':
                    if (window.interacoesManager) {
                        await window.interacoesManager.loadInteracoes();
                    }
                    break;

                case 'relatorios':
                    if (window.relatoriosManager) {
                        await window.relatoriosManager.loadRelatorios();
                    }
                    break;

                case 'arquivos':
                    if (window.arquivosManager) {
                        await window.arquivosManager.loadArquivos();
                    }
                    break;

                case 'painel-admin':
                    if (window.painelAdmin) {
                        await window.painelAdmin.loadPainelAdmin();
                    }
                    break;

                default:
                    this.showNotFoundPage();
                    break;
            }

            // Hide loading state
            this.hideLoadingState();

        } catch (error) {
            console.error(`Error loading page ${page}:`, error);
            this.hideLoadingState();
            this.showErrorPage(error);
        }
    }

    showLoadingState() {
        const pageContent = document.getElementById('pageContent');
        if (pageContent) {
            pageContent.innerHTML = `
                <div class="flex items-center justify-center min-h-96">
                    <div class="text-center">
                        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p class="text-gray-600">Carregando...</p>
                    </div>
                </div>
            `;
        }
    }

    hideLoadingState() {
        // Loading state will be replaced by actual content
    }

    showNotFoundPage() {
        const pageContent = document.getElementById('pageContent');
        if (pageContent) {
            pageContent.innerHTML = `
                <div class="text-center py-16">
                    <div class="mb-8">
                        <i class="fas fa-exclamation-triangle text-6xl text-yellow-400"></i>
                    </div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-4">Página não encontrada</h1>
                    <p class="text-gray-600 mb-8">A página que você está procurando não existe.</p>
                    <button onclick="app.navigateTo('dashboard')" 
                        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                        Voltar ao Dashboard
                    </button>
                </div>
            `;
        }
    }

    showErrorPage(error) {
        const pageContent = document.getElementById('pageContent');
        if (pageContent) {
            pageContent.innerHTML = `
                <div class="text-center py-16">
                    <div class="mb-8">
                        <i class="fas fa-exclamation-circle text-6xl text-red-400"></i>
                    </div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-4">Erro no Sistema</h1>
                    <p class="text-gray-600 mb-4">Ocorreu um erro ao carregar a página.</p>
                    <p class="text-sm text-gray-500 mb-8">Erro: ${error.message}</p>
                    <div class="space-x-4">
                        <button onclick="location.reload()" 
                            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                            Recarregar Página
                        </button>
                        <button onclick="app.navigateTo('dashboard')" 
                            class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200">
                            Ir ao Dashboard
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // Global notification system
    showNotification(message, type = 'info', duration = 4000) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `
            transform transition-all duration-300 ease-in-out translate-x-full opacity-0
            max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5
        `;

        const bgColors = {
            'success': 'bg-green-50 border-green-200',
            'error': 'bg-red-50 border-red-200',
            'warning': 'bg-yellow-50 border-yellow-200',
            'info': 'bg-blue-50 border-blue-200'
        };

        const textColors = {
            'success': 'text-green-800',
            'error': 'text-red-800',
            'warning': 'text-yellow-800',
            'info': 'text-blue-800'
        };

        const icons = {
            'success': 'fas fa-check-circle text-green-400',
            'error': 'fas fa-times-circle text-red-400',
            'warning': 'fas fa-exclamation-triangle text-yellow-400',
            'info': 'fas fa-info-circle text-blue-400'
        };

        notification.innerHTML = `
            <div class="p-4 border-l-4 ${bgColors[type]}">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="${icons[type]}"></i>
                    </div>
                    <div class="ml-3 flex-1">
                        <p class="text-sm font-medium ${textColors[type]}">
                            ${message}
                        </p>
                    </div>
                    <div class="ml-4 flex-shrink-0 flex">
                        <button onclick="this.parentElement.parentElement.parentElement.parentElement.remove()" 
                            class="inline-flex ${textColors[type]} hover:opacity-75 focus:outline-none">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full', 'opacity-0');
            notification.classList.add('translate-x-0', 'opacity-100');
        }, 100);

        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('translate-x-full', 'opacity-0');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, duration);
    }

    // Utility methods
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
    }

    formatDateTime(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }

    // Data management helpers
    async initializeDefaultData() {
        try {
            // Check if we have any users, if not create default admin
            const users = await api.getUsuarios();
            if (users.data.length === 0) {
                await this.createDefaultAdmin();
            }

            // Add some sample data if needed
            await this.addSampleDataIfNeeded();

        } catch (error) {
            console.error('Error initializing default data:', error);
        }
    }

    async createDefaultAdmin() {
        try {
            const defaultAdmin = {
                id: api.generateId(),
                nome: 'Administrador',
                email: 'admin@solarcrm.com',
                senha: auth.hashPassword('admin123'),
                tipo: 'administrador',
                ativo: true,
                ultimo_login: null
            };

            await api.createUsuario(defaultAdmin);
            console.log('Default admin user created');

        } catch (error) {
            console.error('Error creating default admin:', error);
        }
    }

    async addSampleDataIfNeeded() {
        try {
            // Check if we have any clients, if not add samples
            const clientes = await api.getClientes();
            if (clientes.data.length === 0) {
                await this.addSampleClients();
            }

        } catch (error) {
            console.error('Error adding sample data:', error);
        }
    }

    async addSampleClients() {
        const sampleClients = [
            {
                id: api.generateId(),
                nome: 'João Silva Residencial',
                tipo_pessoa: 'fisica',
                cpf_cnpj: '123.456.789-01',
                endereco: 'Rua das Flores, 123, Centro',
                cep: '01234-567',
                cidade: 'São Paulo',
                estado: 'SP',
                telefone: '(11) 99999-1234',
                whatsapp: '(11) 99999-1234',
                email: 'joao@email.com',
                tipo_cliente: 'residencial',
                consumo_mensal: 350,
                valor_conta: 280.50,
                status: 'cliente'
            },
            {
                id: api.generateId(),
                nome: 'Empresa ABC Ltda',
                tipo_pessoa: 'juridica',
                cpf_cnpj: '12.345.678/0001-90',
                endereco: 'Av. Industrial, 456, Distrito Industrial',
                cep: '12345-678',
                cidade: 'São Paulo',
                estado: 'SP',
                telefone: '(11) 3333-4567',
                whatsapp: '(11) 99999-5678',
                email: 'contato@empresaabc.com',
                tipo_cliente: 'comercial',
                consumo_mensal: 1200,
                valor_conta: 850.00,
                status: 'cliente'
            }
        ];

        for (const cliente of sampleClients) {
            await api.createCliente(cliente);
        }

        console.log('Sample clients added');
    }

    // Performance monitoring
    trackPageLoad(page, loadTime) {
        console.log(`Page '${page}' loaded in ${loadTime}ms`);
        
        // In a real application, you would send this to an analytics service
        if (window.gtag) {
            gtag('event', 'page_load_time', {
                page_name: page,
                load_time: loadTime
            });
        }
    }

    // Error reporting
    reportError(error, context = 'unknown') {
        console.error(`Error in ${context}:`, error);
        
        // In a real application, you would send this to an error tracking service
        if (window.Sentry) {
            Sentry.captureException(error, {
                tags: {
                    context: context
                }
            });
        }
    }
}

// Global app instance
const app = new ZorixCRMApp();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Handle page visibility change for performance optimization
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause animations or heavy operations
        console.log('Page hidden - pausing operations');
    } else {
        // Page is visible, resume operations
        console.log('Page visible - resuming operations');
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    app.showNotification('Conexão restabelecida', 'success');
});

window.addEventListener('offline', () => {
    app.showNotification('Sem conexão com a internet', 'warning');
});

// Global error handler
window.addEventListener('error', (event) => {
    app.reportError(event.error, 'global_error_handler');
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    app.reportError(event.reason, 'unhandled_promise_rejection');
});

// Performance observer for monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                app.trackPageLoad('initial', entry.loadEventEnd - entry.loadEventStart);
            }
        }
    });
    
    observer.observe({ entryTypes: ['navigation'] });
}

// Export for global access
window.ZorixCRMApp = app;