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
                    throw new Error('Usuário inativo');
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
            console.log('Iniciando processo de registro...');
            
            // Check if user already exists
            console.log('Verificando usuários existentes...');
            const existingUsers = await api.getUsuarios(1, 100);
            console.log('Usuários existentes:', existingUsers);
            
            if (existingUsers.data && existingUsers.data.some(u => u.email === email)) {
                throw new Error('Email já cadastrado');
            }
            
            const userData = {
                id: api.generateId(),
                nome,
                email,
                senha: this.hashPassword(senha),
                tipo,
                ativo: true,
                ultimo_login: null
            };
            
            console.log('Criando usuário com dados:', { ...userData, senha: '***' });
            
            const newUser = await api.createUsuario(userData);
            console.log('Usuário criado:', newUser);
            
            // Auto login after registration
            this.currentUser = newUser;
            this.isLoggedIn = true;
            
            localStorage.setItem('solarcrm_user', JSON.stringify(newUser));
            localStorage.setItem('solarcrm_logged_in', 'true');
            
            console.log('Registro concluído com sucesso');
            return true;
        } catch (error) {
            console.error('Erro detalhado no cadastro:', error);
            throw error;
        }
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem('solarcrm_user');
        localStorage.removeItem('solarcrm_logged_in');
        
        // Redirect to login
        this.showLogin();
    }

    checkAuth() {
        const storedUser = localStorage.getItem('solarcrm_user');
        const isLoggedIn = localStorage.getItem('solarcrm_logged_in');
        
        if (storedUser && isLoggedIn === 'true') {
            this.currentUser = JSON.parse(storedUser);
            this.isLoggedIn = true;
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
                await this.register(nome, email, tipo, senha);
                this.showSuccessMessage('Cadastro realizado com sucesso!');
                this.showApp();
                if (window.dashboardManager) {
                    window.dashboardManager.loadDashboard();
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
            'info': 'bg-blue-50 border-l-4 border-blue-400'
        };

        const textColors = {
            'success': 'text-green-800',
            'error': 'text-red-800',
            'info': 'text-blue-800'
        };

        const icons = {
            'success': 'fas fa-check-circle text-green-400',
            'error': 'fas fa-times-circle text-red-400',
            'info': 'fas fa-info-circle text-blue-400'
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
}

// Global auth instance
const auth = new Auth();
window.auth = auth;