// Authentication System for LURIX CRM
class Auth {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
    }

    async login(email, senha) {
        try {
            console.log('Tentando login com email:', email);
            
            // Get all users from API and Configuration System
            const usuariosAPI = await api.getUsuarios(1, 100);
            const usuariosConfig = window.configSistema ? configSistema.usuarios : [];
            
            // Combine both user sources - include all from config system (active and inactive)
            const todosUsuarios = [...usuariosAPI.data, ...usuariosConfig];
            console.log('Usuários disponíveis:', todosUsuarios.length);
            
            const usuario = todosUsuarios.find(u => u.email === email);
            console.log('Usuário encontrado:', usuario ? { ...usuario, senha: '***' } : 'Não encontrado');
            
            const senhaHash = this.hashPassword(senha);
            console.log('Hash da senha informada:', senhaHash);
            
            if (usuario && usuario.senha === senhaHash) {
                if (!usuario.ativo) {
                    throw new Error('Usuário inativo ou ainda não aprovado pelo administrador');
                }
                
                if (usuario.pendente) {
                    throw new Error('Cadastro ainda aguardando aprovação do administrador');
                }
                
                console.log('Login válido para usuário:', usuario.nome);
                
                this.currentUser = usuario;
                this.isLoggedIn = true;
                
                // Update last login
                try {
                    await api.updateUsuario(usuario.id, {
                        ...usuario,
                        ultimo_login: new Date().toISOString()
                    });
                } catch (updateError) {
                    console.warn('Erro ao atualizar último login:', updateError);
                }
                
                // Store in localStorage
                localStorage.setItem('solarcrm_user', JSON.stringify(usuario));
                localStorage.setItem('solarcrm_logged_in', 'true');
                
                // Verificar vencimento de acesso
                await this.checkUserAccess(usuario);
                
                // Configurar contexto do usuário no storage para isolamento de dados
                if (window.storage && window.storage.setUserContext) {
                    window.storage.setUserContext(usuario.id);
                }
                if (window.zorixStorage && window.zorixStorage.setUserContext) {
                    window.zorixStorage.setUserContext(usuario.id);
                }
                
                // Configurar menu baseado no tipo de usuário
                this.setupUserInterface(usuario);
                
                return true;
            } else {
                console.log('Login inválido - senha incorreta ou usuário não encontrado');
                throw new Error('Email ou senha inválidos');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }

    async register(nome, email, tipo, senha) {
        try {
            console.log('Iniciando processo de registro com aprovação...');
            
            // Check if user already exists (including pending users)
            console.log('Verificando usuários existentes...');
            const existingUsers = await api.getUsuarios(1, 100);
            const pendingUsers = JSON.parse(localStorage.getItem('zorix_usuarios_pendentes') || '[]');
            console.log('Usuários existentes:', existingUsers);
            console.log('Usuários pendentes:', pendingUsers);
            
            if (existingUsers.data && existingUsers.data.some(u => u.email === email)) {
                throw new Error('Email já cadastrado');
            }
            
            if (pendingUsers.some(u => u.email === email)) {
                throw new Error('Cadastro já solicitado. Aguarde aprovação do administrador.');
            }
            
            const pendingUserData = {
                id: api.generateId(),
                nome,
                email,
                senha: this.hashPassword(senha),
                tipo,
                ativo: false, // Inativo até aprovação
                pendente: true,
                data_cadastro: new Date().toISOString(),
                ultimo_login: null
            };
            
            console.log('Criando usuário pendente:', { ...pendingUserData, senha: '***' });
            
            // Salvar na lista de usuários pendentes
            pendingUsers.push(pendingUserData);
            localStorage.setItem('zorix_usuarios_pendentes', JSON.stringify(pendingUsers));
            
            // Enviar notificação por email
            await this.sendEmailNotification(pendingUserData);
            
            console.log('Cadastro solicitado. Redirecionando para pagamento...');
            return { 
                pendente: true, 
                pagamento: true,
                userId: pendingUserData.id,
                message: 'Cadastro realizado com sucesso! Você será redirecionado para o pagamento semestral. Após a confirmação do pagamento, sua conta será ativada em até 12 horas úteis.' 
            };
        } catch (error) {
            console.error('Erro detalhado no cadastro:', error);
            throw error;
        }
    }

    async sendEmailNotification(userData) {
        try {
            console.log('📧 Enviando notificação de email para novo cadastro...');
            
            // Simulate email sending (in production, this would call a real email service)
            const emailData = {
                to: 'tittaneoenergias@gmail.com',
                subject: '🔔 ZORIX CRM - Novo Cadastro Pendente de Aprovação',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                        <h2 style="color: #FFD700; text-align: center; margin-bottom: 30px;">🔔 NOVO CADASTRO ZORIX CRM</h2>
                        
                        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h3 style="color: #FFD700; margin-top: 0;">📋 Dados do Usuário:</h3>
                            <p><strong>👤 Nome:</strong> ${userData.nome}</p>
                            <p><strong>📧 Email:</strong> ${userData.email}</p>
                            <p><strong>🏢 Tipo:</strong> ${userData.tipo}</p>
                            <p><strong>🕐 Data/Hora:</strong> ${new Date(userData.data_cadastro).toLocaleString('pt-BR')}</p>
                            <p><strong>🆔 ID:</strong> ${userData.id}</p>
                        </div>
                        
                        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; text-align: center;">
                            <h3 style="color: #FFD700; margin-top: 0;">⚡ Ação Necessária</h3>
                            <p>Um novo usuário solicitou acesso ao sistema ZORIX CRM.</p>
                            <p>Acesse o painel administrativo para <strong style="color: #FFD700;">APROVAR</strong> ou <strong style="color: #FF6B6B;">REJEITAR</strong> este cadastro.</p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.3);">
                            <p style="font-size: 12px; opacity: 0.8;">📊 Sistema ZORIX CRM - Gestão Empresarial</p>
                            <p style="font-size: 12px; opacity: 0.8;">🔗 Notificação automática do sistema</p>
                        </div>
                    </div>
                `
            };
            
            // In a real implementation, you would use a service like EmailJS or a backend API
            // For now, we'll simulate the email by logging and storing locally
            console.log('📧 Email simulado enviado:', emailData);
            
            // Store email log for admin reference
            const emailLogs = JSON.parse(localStorage.getItem('zorix_email_logs') || '[]');
            emailLogs.push({
                id: api.generateId(),
                timestamp: new Date().toISOString(),
                type: 'novo_cadastro',
                recipient: 'tittaneoenergias@gmail.com',
                userData: userData,
                status: 'enviado'
            });
            localStorage.setItem('zorix_email_logs', JSON.stringify(emailLogs));
            
            console.log('✅ Notificação registrada com sucesso');
            
            // Show notification to user about email being sent
            if (typeof showNotification === 'function') {
                showNotification('📧 Notificação enviada para o administrador!', 'info');
            }
            
            return true;
        } catch (error) {
            console.error('❌ Erro ao enviar notificação:', error);
            // Don't block registration if email fails
            return false;
        }
    }

    async approvePendingUser(userId) {
        try {
            const pendingUsers = JSON.parse(localStorage.getItem('zorix_usuarios_pendentes') || '[]');
            const userIndex = pendingUsers.findIndex(u => u.id === userId);
            
            if (userIndex === -1) {
                throw new Error('Usuário pendente não encontrado');
            }
            
            const user = pendingUsers[userIndex];
            
            // Create user in main system
            const userData = {
                ...user,
                ativo: true,
                pendente: false,
                data_aprovacao: new Date().toISOString()
            };
            
            const newUser = await api.createUsuario(userData);
            
            // Remove from pending list
            pendingUsers.splice(userIndex, 1);
            localStorage.setItem('zorix_usuarios_pendentes', JSON.stringify(pendingUsers));
            
            console.log('✅ Usuário aprovado:', newUser.nome);
            return newUser;
        } catch (error) {
            console.error('❌ Erro ao aprovar usuário:', error);
            throw error;
        }
    }

    async rejectPendingUser(userId, reason = '') {
        try {
            const pendingUsers = JSON.parse(localStorage.getItem('zorix_usuarios_pendentes') || '[]');
            const userIndex = pendingUsers.findIndex(u => u.id === userId);
            
            if (userIndex === -1) {
                throw new Error('Usuário pendente não encontrado');
            }
            
            const user = pendingUsers[userIndex];
            
            // Log rejection
            const rejectionLogs = JSON.parse(localStorage.getItem('zorix_rejection_logs') || '[]');
            rejectionLogs.push({
                id: api.generateId(),
                timestamp: new Date().toISOString(),
                user: user,
                reason: reason,
                rejected_by: this.currentUser?.id || 'admin'
            });
            localStorage.setItem('zorix_rejection_logs', JSON.stringify(rejectionLogs));
            
            // Remove from pending list
            pendingUsers.splice(userIndex, 1);
            localStorage.setItem('zorix_usuarios_pendentes', JSON.stringify(pendingUsers));
            
            console.log('❌ Usuário rejeitado:', user.nome);
            return true;
        } catch (error) {
            console.error('❌ Erro ao rejeitar usuário:', error);
            throw error;
        }
    }

    getPendingUsers() {
        return JSON.parse(localStorage.getItem('zorix_usuarios_pendentes') || '[]');
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem('solarcrm_user');
        localStorage.removeItem('solarcrm_logged_in');
        
        // Limpar contexto do usuário
        if (window.storage && window.storage.setUserContext) {
            window.storage.setUserContext(null);
        }
        if (window.zorixStorage && window.zorixStorage.setUserContext) {
            window.zorixStorage.setUserContext(null);
        }
        
        // Redirect to login
        this.showLogin();
    }

    checkAuth() {
        const storedUser = localStorage.getItem('solarcrm_user');
        const isLoggedIn = localStorage.getItem('solarcrm_logged_in');
        
        if (storedUser && isLoggedIn === 'true') {
            this.currentUser = JSON.parse(storedUser);
            this.isLoggedIn = true;
            
            // Configurar contexto do usuário no storage
            if (window.storage && window.storage.setUserContext) {
                window.storage.setUserContext(this.currentUser.id);
            }
            if (window.zorixStorage && window.zorixStorage.setUserContext) {
                window.zorixStorage.setUserContext(this.currentUser.id);
            }
            
            // Configurar interface baseada no tipo de usuário
            this.setupUserInterface(this.currentUser);
            
            return true;
        }
        
        return false;
    }

    hashPassword(password) {
        // Simple hash for demo purposes - in production use proper hashing
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    getCurrentUser() {
        return this.currentUser;
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;
        
        const permissions = {
            'administrador': ['all'],
            'colaborador': ['clientes', 'projetos', 'agenda', 'interacoes', 'arquivos', 'dashboard'],
            'engenheiro': ['projetos', 'clientes', 'arquivos', 'dashboard'],
            'comercial': ['clientes', 'interacoes', 'projetos', 'dashboard'],
            'tecnico': ['agendamentos', 'projetos', 'dashboard']
        };
        
        const userPermissions = permissions[this.currentUser.tipo] || [];
        return userPermissions.includes('all') || userPermissions.includes(permission);
    }

    showLogin() {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('registerScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        document.getElementById('loading').classList.add('hidden');
    }

    showRegister() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('registerScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        document.getElementById('loading').classList.add('hidden');
    }

    showApp() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('registerScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        document.getElementById('loading').classList.add('hidden');
        
        // Update UI with user info
        this.updateUserInfo();
    }

    updateUserInfo() {
        if (this.currentUser) {
            const initials = this.currentUser.nome.split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .substr(0, 2);
            
            document.getElementById('userInitials').textContent = initials;
            document.getElementById('userName').textContent = this.currentUser.nome;
            document.getElementById('userType').textContent = this.formatUserType(this.currentUser.tipo);
            document.getElementById('headerUserName').textContent = this.currentUser.nome;
            document.getElementById('headerUserType').textContent = this.formatUserType(this.currentUser.tipo);
        }
    }

    formatUserType(tipo) {
        const types = {
            'administrador': 'Administrador',
            'engenheiro': 'Engenheiro/Projetista',
            'comercial': 'Comercial',
            'tecnico': 'Técnico de Campo'
        };
        return types[tipo] || tipo;
    }

    // Initialize authentication system
    init() {
        // Show loading initially
        document.getElementById('loading').classList.remove('hidden');
        
        // Check if user is already logged in
        setTimeout(() => {
            if (this.checkAuth()) {
                this.showApp();
                // Load dashboard
                if (window.dashboardManager) {
                    window.dashboardManager.loadDashboard();
                }
            } else {
                this.showLogin();
            }
        }, 1000);

        // Login form handler
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const senha = document.getElementById('loginSenha').value;
            
            try {
                // Show loading state
                const loginBtn = document.getElementById('loginBtn');
                const loginBtnText = document.getElementById('loginBtnText');
                const loginBtnSpinner = document.getElementById('loginBtnSpinner');
                
                if (loginBtn) {
                    loginBtn.disabled = true;
                    loginBtnText.textContent = 'Entrando...';
                    loginBtnSpinner.classList.remove('hidden');
                }
                
                await this.login(email, senha);
                this.showApp();
                if (window.dashboardManager) {
                    window.dashboardManager.loadDashboard();
                }
            } catch (error) {
                this.showErrorMessage('Erro no login: ' + error.message);
            } finally {
                // Reset button state
                const loginBtn = document.getElementById('loginBtn');
                const loginBtnText = document.getElementById('loginBtnText');
                const loginBtnSpinner = document.getElementById('loginBtnSpinner');
                
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtnText.textContent = 'Entrar';
                    loginBtnSpinner.classList.add('hidden');
                }
            }
        });

        // Register form handler
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('registerNome').value.trim();
            const email = document.getElementById('registerEmail').value.trim().toLowerCase();
            const tipo = document.getElementById('registerTipo').value;
            const senha = document.getElementById('registerSenha').value;
            const senhaConfirm = document.getElementById('registerSenhaConfirm').value;
            
            // Validações
            if (!nome || !email || !tipo || !senha) {
                this.showErrorMessage('Todos os campos são obrigatórios');
                return;
            }
            
            if (senha.length < 6) {
                this.showErrorMessage('A senha deve ter pelo menos 6 caracteres');
                return;
            }
            
            if (senha !== senhaConfirm) {
                this.showErrorMessage('As senhas não coincidem');
                return;
            }
            
            // Validar formato do email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                this.showErrorMessage('Email inválido');
                return;
            }
            
            try {
                // Show loading state
                const registerBtn = document.getElementById('registerBtn');
                const registerBtnText = document.getElementById('registerBtnText');
                const registerBtnSpinner = document.getElementById('registerBtnSpinner');
                
                if (registerBtn) {
                    registerBtn.disabled = true;
                    registerBtnText.textContent = 'Cadastrando...';
                    registerBtnSpinner.classList.remove('hidden');
                }
                
                console.log('Tentando cadastrar usuário:', { nome, email, tipo });
                const result = await this.register(nome, email, tipo, senha);
                
                if (result && result.pendente) {
                    if (result.pagamento) {
                        // Cadastro com pagamento - redirecionar para pagamento
                        this.showSuccessMessage(result.message);
                        
                        // Limpar formulário
                        document.getElementById('registerForm').reset();
                        
                        // Abrir sistema de pagamento após 2 segundos
                        setTimeout(() => {
                            this.openPaymentSystem(result.userId, nome, email);
                        }, 2000);
                    } else {
                        // Cadastro pendente de aprovação (fluxo antigo)
                        this.showPendingMessage(result.message);
                        
                        // Limpar formulário
                        document.getElementById('registerForm').reset();
                        
                        // Voltar para tela de login após 3 segundos
                        setTimeout(() => {
                            this.showLogin();
                        }, 3000);
                    }
                } else {
                    // Cadastro aprovado (caso antigo - não deveria acontecer mais)
                    this.showSuccessMessage('Cadastro realizado com sucesso!');
                    this.showApp();
                    if (window.dashboardManager) {
                        window.dashboardManager.loadDashboard();
                    }
                }
            } catch (error) {
                console.error('Erro detalhado no cadastro:', error);
                this.showErrorMessage('Erro no cadastro: ' + error.message);
            } finally {
                // Reset button state
                const registerBtn = document.getElementById('registerBtn');
                const registerBtnText = document.getElementById('registerBtnText');
                const registerBtnSpinner = document.getElementById('registerBtnSpinner');
                
                if (registerBtn) {
                    registerBtn.disabled = false;
                    registerBtnText.textContent = 'Cadastrar';
                    registerBtnSpinner.classList.add('hidden');
                }
            }
        });

        // Toggle between login and register
        document.getElementById('showRegister').addEventListener('click', () => {
            this.showRegister();
        });

        document.getElementById('showLogin').addEventListener('click', () => {
            this.showLogin();
        });

        // Logout handler
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showPendingMessage(message) {
        this.showNotification(message, 'warning');
    }

    showNotification(message, type = 'info') {
        // Create notification container if it doesn't exist
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'fixed top-4 right-4 z-50 space-y-2';
            document.body.appendChild(container);
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `
            transform transition-all duration-300 ease-in-out translate-x-full opacity-0
            max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden
        `;

        const bgColors = {
            'success': 'bg-green-50 border-l-4 border-green-400',
            'error': 'bg-red-50 border-l-4 border-red-400',
            'info': 'bg-blue-50 border-l-4 border-blue-400',
            'warning': 'bg-yellow-50 border-l-4 border-yellow-400'
        };

        const textColors = {
            'success': 'text-green-800',
            'error': 'text-red-800',
            'info': 'text-blue-800',
            'warning': 'text-yellow-800'
        };

        const icons = {
            'success': 'fas fa-check-circle text-green-400',
            'error': 'fas fa-times-circle text-red-400',
            'info': 'fas fa-info-circle text-blue-400',
            'warning': 'fas fa-exclamation-triangle text-yellow-400'
        };

        notification.innerHTML = `
            <div class="${bgColors[type]} p-4">
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
                        <button onclick="this.closest('.max-w-sm').remove()" 
                            class="inline-flex ${textColors[type]} hover:opacity-75 focus:outline-none">
                            <i class="fas fa-times text-sm"></i>
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

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('translate-x-full', 'opacity-0');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 4000);
    }

    /**
     * Verifica se o usuário tem acesso válido (não vencido)
     */
    async checkUserAccess(user) {
        // Carregar configuração de acesso
        const accessConfig = JSON.parse(localStorage.getItem('zorix_admin_access_control') || '[]');
        const userConfig = accessConfig.find(c => c.user_id === user.id);
        
        if (userConfig) {
            const today = new Date();
            const endDate = new Date(userConfig.data_fim);
            
            // Se vencido, bloquear
            if (today > endDate) {
                // Atualizar status no sistema
                userConfig.bloqueado_por_vencimento = true;
                localStorage.setItem('zorix_admin_access_control', JSON.stringify(accessConfig));
                
                throw new Error(`Acesso expirado em ${endDate.toLocaleDateString('pt-BR')}. Entre em contato com o administrador.`);
            }
            
            // Se bloqueado manualmente
            if (userConfig.bloqueado_por_vencimento) {
                throw new Error('Usuário bloqueado pelo administrador. Entre em contato para reativar o acesso.');
            }
        }
        
        return true;
    }

    /**
     * Configura interface baseada no tipo de usuário
     */
    setupUserInterface(user) {
        // Configurar interface baseada no usuário após login
        setTimeout(() => {
            // Mostrar/ocultar menu do painel admin apenas para administradores
            const painelAdminMenuItem = document.getElementById('painelAdminMenuItem');
            if (painelAdminMenuItem) {
                if (user.tipo === 'administrador') {
                    painelAdminMenuItem.classList.remove('hidden');
                } else {
                    painelAdminMenuItem.classList.add('hidden');
                }
            }
            
            console.log(`🛡️ Interface configurada para usuário tipo: ${user.tipo}`);
        }, 500); // Aguardar DOM estar pronto
    }

    /**
     * SISTEMA DE PAGAMENTO AUTOMÁTICO
     */

    /**
     * Abre sistema de pagamento após cadastro
     */
    async openPaymentSystem(userId, userName, userEmail) {
        console.log('💳 Abrindo sistema de pagamento para:', userName);
        
        try {
            // Carregar configurações de pagamento
            const paymentConfig = this.getPaymentConfig();
            
            // Criar link de pagamento
            const paymentLink = await this.generatePaymentLink(userId, userName, userEmail, paymentConfig);
            
            // Mostrar modal de pagamento
            this.showPaymentModal(paymentLink, userName, paymentConfig);
            
        } catch (error) {
            console.error('❌ Erro ao abrir sistema de pagamento:', error);
            this.showErrorMessage('Erro ao processar pagamento. Tente novamente.');
        }
    }

    /**
     * Gera link de pagamento (pode ser integrado com MercadoPago, PagSeguro, etc.)
     */
    async generatePaymentLink(userId, userName, userEmail, config) {
        // Aqui você pode integrar com qualquer gateway de pagamento
        // Por enquanto, vou simular com diferentes opções
        
        const paymentData = {
            userId: userId,
            userName: userName,
            userEmail: userEmail,
            amount: config.preco,
            plan: config.plano,
            description: `Acesso ao ZORIX CRM - ${config.plano}`,
            returnUrl: window.location.origin + '/payment-success.html',
            cancelUrl: window.location.origin + '/payment-cancel.html'
        };

        // Simular diferentes gateways (você pode escolher um ou integrar vários)
        const gateways = {
            mercadopago: this.generateMercadoPagoLink(paymentData),
            pagseguro: this.generatePagSeguroLink(paymentData),
            pix: this.generatePixPayment(paymentData),
            custom: this.generateCustomPaymentLink(paymentData)
        };

        return gateways[config.gateway] || gateways.custom;
    }



    /**
     * Simulação de integração MercadoPago
     */
    generateMercadoPagoLink(data) {
        // Link fixo do MercadoPago para pagamento semestral
        // Pagamento a cada 6 meses - experiência profissional
        const mercadoPagoUrl = 'https://mpago.la/2p1ZuVD';
        
        console.log('🔗 Redirecionando para pagamento MercadoPago:', {
            userId: data.userId,
            userName: data.userName,
            userEmail: data.userEmail,
            plano: 'Semestral (6 meses)',
            url: mercadoPagoUrl
        });
        
        return mercadoPagoUrl;
    }

    /**
     * Simulação de integração PagSeguro
     */
    generatePagSeguroLink(data) {
        // Em produção, você faria uma chamada real para a API do PagSeguro
        const baseUrl = 'https://pagseguro.uol.com.br/v2/checkout/payment.html';
        const params = new URLSearchParams({
            'code': `ps_${data.userId}_${Date.now()}` // Código da transação
        });
        
        return `${baseUrl}?${params.toString()}`;
    }

    /**
     * Gera pagamento PIX (simulado)
     */
    generatePixPayment(data) {
        // Aqui você geraria um PIX real através de uma API bancária
        const pixKey = 'tittaneoenergias@gmail.com'; // Sua chave PIX
        const pixCode = `00020126580014br.gov.bcb.pix0136${pixKey}520400005303986540${data.amount}5802BR5925ZORIX CRM6008BRASILIA62070503***6304`;
        
        return {
            type: 'pix',
            pixCode: pixCode,
            pixKey: pixKey,
            amount: data.amount,
            qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==` // QR Code seria gerado aqui
        };
    }

    /**
     * Link personalizado (para seu próprio sistema de pagamento)
     */
    generateCustomPaymentLink(data) {
        // Link para seu próprio sistema de pagamento
        const baseUrl = 'https://pagamento.seusite.com.br/checkout';
        const params = new URLSearchParams({
            'user_id': data.userId,
            'amount': data.amount,
            'plan': data.plan,
            'return_url': data.returnUrl,
            'cancel_url': data.cancelUrl
        });
        
        return `${baseUrl}?${params.toString()}`;
    }

    /**
     * Configurações de pagamento (pode ser configurado pelo admin)
     */
    getPaymentConfig() {
        const config = JSON.parse(localStorage.getItem('zorix_payment_config') || '{}');
        
        // Configurações padrão
        return {
            preco: config.preco || 349.99, // Preço em reais (6 meses)
            plano: config.plano || 'Semestral',
            gateway: config.gateway || 'mercadopago', // mercadopago, pagseguro, pix, custom
            moeda: 'BRL',
            periodo: config.periodo || 180, // dias (6 meses)
            descricao: config.descricao || 'Acesso completo ao ZORIX CRM por 6 meses'
        };
    }

    /**
     * Mostra modal de pagamento
     */
    showPaymentModal(paymentLink, userName, config) {
        const modal = document.createElement('div');
        modal.id = 'paymentModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        
        const isPix = typeof paymentLink === 'object' && paymentLink.type === 'pix';
        
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-90vh overflow-y-auto">
                <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-2xl">
                    <h3 class="text-xl font-semibold">💳 Finalizar Pagamento</h3>
                    <p class="text-green-100 mt-1">Olá, ${userName}!</p>
                </div>
                
                <div class="p-6 space-y-6">
                    <!-- Detalhes do Plano -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h4 class="font-semibold text-gray-900 mb-2">📋 Detalhes do Plano</h4>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Plano:</span>
                                <span class="font-medium">${config.plano}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Período:</span>
                                <span class="font-medium">${config.periodo} dias</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Valor:</span>
                                <span class="font-bold text-green-600">R$ ${config.preco.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                    </div>

                    ${isPix ? this.renderPixPayment(paymentLink) : this.renderLinkPayment(paymentLink, config)}

                    <!-- Informações Importantes -->
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 class="font-semibold text-blue-900 mb-2">ℹ️ Informações Importantes</h4>
                        <ul class="text-sm text-blue-800 space-y-1">
                            <li>• Seu acesso será liberado em até 12 horas úteis após confirmação do pagamento</li>
                            <li>• Você receberá um email de confirmação quando sua conta for ativada</li>
                            <li>• Aguarde nossa equipe verificar e aprovar seu pagamento</li>
                            <li>• O pagamento é processado de forma 100% segura via MercadoPago</li>
                        </ul>
                    </div>
                </div>
                
                <div class="flex justify-center items-center p-6 border-t border-gray-200">
                    <button onclick="this.closest('#paymentModal').remove(); auth.showLogin();" 
                        class="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200">
                        Fechar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Log do pagamento iniciado
        this.logPaymentAction('iniciado', userName, config.preco);
    }

    /**
     * Renderiza pagamento PIX
     */
    renderPixPayment(pixData) {
        return `
            <div class="text-center space-y-4">
                <h4 class="font-semibold text-gray-900">💰 Pagamento via PIX</h4>
                
                <!-- QR Code (simulado) -->
                <div class="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <div class="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                        <div class="text-center">
                            <i class="fas fa-qrcode text-4xl text-gray-400 mb-2"></i>
                            <p class="text-sm text-gray-600">QR Code PIX</p>
                        </div>
                    </div>
                </div>

                <!-- Chave PIX -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <p class="text-sm text-gray-600 mb-2">Ou use a chave PIX:</p>
                    <div class="flex items-center justify-between bg-white border rounded px-3 py-2">
                        <span class="text-sm font-mono text-gray-900">${pixData.pixKey}</span>
                        <button onclick="navigator.clipboard.writeText('${pixData.pixKey}'); this.innerHTML='<i class=\\"fas fa-check text-green-600\\"></i>'" 
                            class="text-blue-600 hover:text-blue-800" title="Copiar chave PIX">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>

                <p class="text-sm text-gray-600">
                    Valor: <strong>R$ ${pixData.amount.toFixed(2).replace('.', ',')}</strong>
                </p>
            </div>
        `;
    }

    /**
     * Renderiza pagamento por link
     */
    renderLinkPayment(paymentLink, config) {
        return `
            <div class="text-center space-y-4">
                <h4 class="font-semibold text-gray-900">💳 Finalizar Pagamento - Plano Semestral</h4>
                <p class="text-gray-600">Clique no botão abaixo para pagar via MercadoPago de forma segura:</p>
                
                <div class="bg-blue-50 p-4 rounded-lg mb-4">
                    <p class="text-sm text-blue-800">
                        <i class="fas fa-info-circle mr-1"></i>
                        <strong>Plano Semestral:</strong> 6 meses de acesso completo
                    </p>
                </div>
                
                <a href="${paymentLink}" target="_blank" 
                   onclick="auth.logPaymentAction('link_clicado', '${config.plano}', ${config.preco})"
                   class="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-medium text-lg">
                    <i class="fas fa-credit-card mr-2"></i>
                    Pagar via MercadoPago
                </a>
                
                <div class="bg-yellow-50 p-3 rounded-lg">
                    <p class="text-sm text-yellow-800">
                        <i class="fas fa-clock mr-1"></i>
                        <strong>Ativação:</strong> Sua conta será ativada em até 12 horas úteis após confirmação do pagamento
                    </p>
                </div>
                
                <p class="text-xs text-gray-500">
                    Pagamento 100% seguro via MercadoPago
                </p>
            </div>
        `;
    }



    /**
     * Processa pagamento bem-sucedido
     */
    async processSuccessfulPayment(userName) {
        try {
            // Remover modal de pagamento
            const modal = document.getElementById('paymentModal');
            if (modal) modal.remove();
            
            // Buscar usuário pendente
            const pendingUsers = JSON.parse(localStorage.getItem('zorix_usuarios_pendentes') || '[]');
            const userIndex = pendingUsers.findIndex(u => u.nome === userName);
            
            if (userIndex !== -1) {
                const user = pendingUsers[userIndex];
                
                // Aprovar usuário automaticamente
                await this.approvePendingUser(user.id);
                
                // Log do pagamento confirmado
                this.logPaymentAction('confirmado', userName, this.getPaymentConfig().preco);
                
                // Configurar acesso automático
                await this.setupAutomaticAccess(user.id);
                
                this.showSuccessMessage(`🎉 Pagamento confirmado! Seu acesso foi liberado, ${userName}!`);
                
                // Redirecionar para login após 3 segundos
                setTimeout(() => {
                    this.showLogin();
                    this.showNotification('Você já pode fazer login no sistema!', 'success');
                }, 3000);
                
            } else {
                throw new Error('Usuário não encontrado');
            }
            
        } catch (error) {
            console.error('❌ Erro ao processar pagamento:', error);
            this.showErrorMessage('Erro ao processar pagamento aprovado. Entre em contato conosco.');
        }
    }

    /**
     * Configura acesso automático após pagamento
     */
    async setupAutomaticAccess(userId) {
        const config = this.getPaymentConfig();
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + config.periodo);
        
        // Configurar acesso no sistema administrativo
        const accessConfig = JSON.parse(localStorage.getItem('zorix_admin_access_control') || '[]');
        
        accessConfig.push({
            user_id: userId,
            data_inicio: today.toISOString().split('T')[0],
            data_fim: endDate.toISOString().split('T')[0],
            valor_mensal: config.preco,
            status_pagamento: 'em_dia',
            observacoes: 'Acesso liberado automaticamente após pagamento confirmado',
            bloqueado_por_vencimento: false,
            created_at: new Date().toISOString()
        });
        
        localStorage.setItem('zorix_admin_access_control', JSON.stringify(accessConfig));
        
        console.log(`✅ Acesso configurado para usuário ${userId} até ${endDate.toLocaleDateString('pt-BR')}`);
    }

    /**
     * Log de ações de pagamento
     */
    logPaymentAction(action, userName, amount = 0) {
        const paymentLogs = JSON.parse(localStorage.getItem('zorix_payment_logs') || '[]');
        
        paymentLogs.push({
            id: window.api?.generateId() || Date.now(),
            timestamp: new Date().toISOString(),
            action: action, // iniciado, link_clicado, confirmado, cancelado
            user_name: userName,
            amount: amount,
            ip: 'localhost', // Em produção, pegar IP real
            user_agent: navigator.userAgent
        });
        
        localStorage.setItem('zorix_payment_logs', JSON.stringify(paymentLogs));
        console.log(`💰 Payment log: ${action} - ${userName} - R$ ${amount}`);
    }
}

// Global auth instance
const auth = new Auth();
window.auth = auth;