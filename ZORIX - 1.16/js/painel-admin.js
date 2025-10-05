/**
 * ZORIX CRM - Painel de Controle Administrativo
 * Sistema de gestão de usuários com controle de pagamento e datas de acesso
 * Apenas para administradores do sistema
 */

class PainelAdminManager {
    constructor() {
        this.users = [];
        this.subscriptions = [];
        console.log('🛡️ Painel Admin Manager inicializado');
        
        // Verificar bloqueios automaticamente a cada minuto
        setInterval(() => this.checkExpiredUsers(), 60000);
    }

    /**
     * Carrega a página principal do Painel Admin
     */
    async loadPainelAdmin() {
        console.log('🛡️ Carregando Painel Administrativo...');
        
        const content = `
            <div class="fade-in min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                <!-- Header -->
                <div class="bg-white shadow-sm border-b border-gray-200 mb-8">
                    <div class="max-w-7xl mx-auto px-6 py-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h1 class="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                                    🛡️ Painel de Controle Administrativo
                                </h1>
                                <p class="text-gray-600 mt-2">Gerencie usuários, controle de acesso e pagamentos</p>
                            </div>
                            <div class="flex space-x-3">
                                <button onclick="painelAdmin.checkExpiredUsers()" 
                                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
                                    <i class="fas fa-sync-alt mr-2"></i>Verificar Vencimentos
                                </button>
                                <button onclick="painelAdmin.addNewUser()" 
                                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200">
                                    <i class="fas fa-plus mr-2"></i>Novo Usuário
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="max-w-7xl mx-auto px-6">
                    <!-- Configurações de Pagamento -->
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">💰 Configurações de Pagamento</h3>
                            <button onclick="painelAdmin.togglePaymentConfig()" 
                                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
                                <i class="fas fa-cog mr-2"></i>Configurar
                            </button>
                        </div>
                        
                        <div id="paymentConfigPanel" class="hidden">
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Preço (R$)</label>
                                    <input type="number" id="configPreco" step="0.01" min="0"
                                        placeholder="349.99 (6 meses)"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Período (dias)</label>
                                    <input type="number" id="configPeriodo" min="1"
                                        placeholder="180 (6 meses)"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Gateway</label>
                                    <select id="configGateway"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                        <option value="mercadopago">MercadoPago (Recomendado)</option>
                                        <option value="custom">Personalizado</option>
                                        <option value="pagseguro">PagSeguro</option>
                                        <option value="pix">PIX</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Ação</label>
                                    <button onclick="painelAdmin.savePaymentConfig()" 
                                        class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200">
                                        <i class="fas fa-save mr-2"></i>Salvar
                                    </button>
                                </div>
                            </div>


                        </div>
                        
                        <div id="paymentConfigDisplay" class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div class="text-center p-3 bg-green-50 rounded-lg">
                                <div class="text-green-600 font-semibold">Preço Atual</div>
                                <div id="displayPreco" class="text-xl font-bold">R$ 349,99</div>
                            </div>
                            <div class="text-center p-3 bg-blue-50 rounded-lg">
                                <div class="text-blue-600 font-semibold">Período</div>
                                <div id="displayPeriodo" class="text-xl font-bold">180 dias (6 meses)</div>
                            </div>
                            <div class="text-center p-3 bg-purple-50 rounded-lg">
                                <div class="text-purple-600 font-semibold">Gateway</div>
                                <div id="displayGateway" class="text-xl font-bold">Personalizado</div>
                            </div>
                            <div class="text-center p-3 bg-yellow-50 rounded-lg">
                                <div class="text-yellow-600 font-semibold">Status</div>
                                <div id="displayStatus" class="text-xl font-bold">Ativo</div>
                            </div>
                        </div>
                    </div>

                    <!-- Cards de Estatísticas -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-users text-3xl text-green-500"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-500">Usuários Ativos</p>
                                    <p id="totalActiveUsers" class="text-2xl font-bold text-gray-900">0</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-exclamation-triangle text-3xl text-yellow-500"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-500">Vencendo em 7 dias</p>
                                    <p id="totalExpiringUsers" class="text-2xl font-bold text-gray-900">0</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-ban text-3xl text-red-500"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-500">Usuários Bloqueados</p>
                                    <p id="totalBlockedUsers" class="text-2xl font-bold text-gray-900">0</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-dollar-sign text-3xl text-blue-500"></i>
                                </div>
                                <div class="ml-4">
                                    <p class="text-sm font-medium text-gray-500">Receita Mensal</p>
                                    <p id="totalRevenue" class="text-2xl font-bold text-gray-900">R$ 0,00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Filtros -->
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">🔍 Filtros e Busca</h3>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Buscar Usuário</label>
                                <input type="text" id="searchUser" onkeyup="painelAdmin.filterUsers()" 
                                    placeholder="Nome ou email..." 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select id="filterStatus" onchange="painelAdmin.filterUsers()" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="">Todos</option>
                                    <option value="ativo">Ativos</option>
                                    <option value="vencendo">Vencendo (7 dias)</option>
                                    <option value="vencido">Vencidos</option>
                                    <option value="bloqueado">Bloqueados</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                                <select id="filterType" onchange="painelAdmin.filterUsers()" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="">Todos</option>
                                    <option value="administrador">Administrador</option>
                                    <option value="colaborador">Colaborador</option>
                                </select>
                            </div>
                            <div class="flex items-end">
                                <button onclick="painelAdmin.clearFilters()" 
                                    class="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200">
                                    <i class="fas fa-times mr-2"></i>Limpar Filtros
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Lista de Usuários -->
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900">👥 Gestão de Usuários</h3>
                        </div>
                        
                        <div id="usersList" class="overflow-x-auto">
                            ${this.renderUsersList()}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Novo/Editar Usuário -->
            <div id="modalUser" class="modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 hidden">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-90vh overflow-y-auto">
                    <div class="p-6 border-b border-gray-200">
                        <h3 class="text-xl font-semibold text-gray-900" id="modalUserTitle">Novo Usuário</h3>
                    </div>
                    
                    <form id="formUser" onsubmit="painelAdmin.saveUser(event)">
                        <div class="p-6 space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                                    <input type="text" id="userNome" required
                                        placeholder="Ex: João Silva"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                                    <input type="email" id="userEmail" required
                                        placeholder="Ex: joao@empresa.com"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Usuário *</label>
                                    <select id="userTipo" required
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="colaborador">Colaborador</option>
                                        <option value="administrador">Administrador</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Senha *</label>
                                    <input type="password" id="userSenha" required
                                        placeholder="Mínimo 6 caracteres"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                            </div>

                            <div class="border-t pt-4 mt-6">
                                <h4 class="text-md font-semibold text-gray-900 mb-4">📅 Controle de Acesso</h4>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Data de Início *</label>
                                        <input type="date" id="userDataInicio" required
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento *</label>
                                        <input type="date" id="userDataFim" required
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Valor Mensal (R$)</label>
                                        <input type="number" id="userValorMensal" step="0.01" min="0"
                                            placeholder="Ex: 99.90"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Status Pagamento</label>
                                        <select id="userStatusPagamento"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="em_dia">Em Dia</option>
                                            <option value="pendente">Pendente</option>
                                            <option value="atrasado">Atrasado</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="mt-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                                    <textarea id="userObservacoes" rows="3"
                                        placeholder="Anotações sobre o usuário, pagamento, etc..."
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex justify-end gap-3 p-6 border-t border-gray-200">
                            <button type="button" onclick="painelAdmin.closeModal()" 
                                class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200">
                                Cancelar
                            </button>
                            <button type="submit" 
                                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                                <i class="fas fa-save mr-2"></i>Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('pageContent').innerHTML = content;
        
        // Carregar dados
        await this.loadUsers();
        this.updateStats();
        this.updatePaymentConfigDisplay();
        
        console.log('✅ Painel Administrativo carregado');
    }

    /**
     * Carrega lista de usuários
     */
    async loadUsers() {
        try {
            // Carregar usuários do sistema principal
            const systemUsers = await window.api.getUsuarios(1, 100);
            
            // Carregar configurações de acesso (novo sistema)
            const accessConfig = JSON.parse(localStorage.getItem('zorix_admin_access_control') || '[]');
            
            // Combinar dados
            this.users = systemUsers.data.map(user => {
                const config = accessConfig.find(c => c.user_id === user.id) || {};
                return {
                    ...user,
                    data_inicio: config.data_inicio || new Date().toISOString().split('T')[0],
                    data_fim: config.data_fim || this.getDefaultEndDate(),
                    valor_mensal: config.valor_mensal || 0,
                    status_pagamento: config.status_pagamento || 'em_dia',
                    observacoes: config.observacoes || '',
                    bloqueado_por_vencimento: config.bloqueado_por_vencimento || false
                };
            });

            console.log(`📊 ${this.users.length} usuários carregados`);
            this.renderUsersList();
        } catch (error) {
            console.error('❌ Erro ao carregar usuários:', error);
        }
    }

    /**
     * Renderiza lista de usuários
     */
    renderUsersList() {
        const container = document.getElementById('usersList');
        if (!container) return '';

        if (this.users.length === 0) {
            const emptyHtml = `
                <div class="text-center py-12">
                    <i class="fas fa-users text-4xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
                    <p class="text-gray-500 mb-4">Adicione usuários para gerenciar o sistema</p>
                    <button onclick="painelAdmin.addNewUser()" 
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                        <i class="fas fa-plus mr-2"></i>Adicionar Primeiro Usuário
                    </button>
                </div>
            `;
            if (container) container.innerHTML = emptyHtml;
            return emptyHtml;
        }

        const html = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período de Acesso</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagamento</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${this.users.map(user => `
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span class="text-white font-semibold">${user.nome.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900">${user.nome}</div>
                                        <div class="text-sm text-gray-500">${user.email}</div>
                                        <div class="text-xs text-gray-400">${user.tipo}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">
                                    📅 ${this.formatDate(user.data_inicio)} até ${this.formatDate(user.data_fim)}
                                </div>
                                <div class="text-xs text-gray-500">
                                    ${this.getDaysRemaining(user.data_fim)} dias restantes
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">
                                    💰 R$ ${parseFloat(user.valor_mensal || 0).toFixed(2)}
                                </div>
                                <div class="text-xs ${this.getPaymentStatusColor(user.status_pagamento)}">
                                    ${this.getPaymentStatusText(user.status_pagamento)}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                ${this.getUserStatusBadge(user)}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div class="flex justify-end space-x-2">
                                    <button onclick="painelAdmin.editUser('${user.id}')" 
                                        class="text-blue-600 hover:text-blue-800 p-1 rounded"
                                        title="Editar usuário">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="painelAdmin.toggleUserBlock('${user.id}')" 
                                        class="text-yellow-600 hover:text-yellow-800 p-1 rounded"
                                        title="${user.bloqueado_por_vencimento || !user.ativo ? 'Desbloquear' : 'Bloquear'} usuário">
                                        <i class="fas fa-${user.bloqueado_por_vencimento || !user.ativo ? 'unlock' : 'lock'}"></i>
                                    </button>
                                    <button onclick="painelAdmin.extendAccess('${user.id}')" 
                                        class="text-green-600 hover:text-green-800 p-1 rounded"
                                        title="Estender acesso">
                                        <i class="fas fa-calendar-plus"></i>
                                    </button>
                                    <button onclick="painelAdmin.deleteUser('${user.id}', '${user.nome}')" 
                                        class="text-red-600 hover:text-red-800 p-1 rounded"
                                        title="Excluir usuário">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        if (container) container.innerHTML = html;
        return html;
    }

    /**
     * Funções auxiliares para renderização
     */
    formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    }

    getDaysRemaining(endDate) {
        if (!endDate) return 0;
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }

    getPaymentStatusColor(status) {
        switch (status) {
            case 'em_dia': return 'text-green-600';
            case 'pendente': return 'text-yellow-600';
            case 'atrasado': return 'text-red-600';
            default: return 'text-gray-600';
        }
    }

    getPaymentStatusText(status) {
        switch (status) {
            case 'em_dia': return '✅ Em Dia';
            case 'pendente': return '⏳ Pendente';
            case 'atrasado': return '❌ Atrasado';
            default: return '❓ Indefinido';
        }
    }

    getUserStatusBadge(user) {
        const daysRemaining = this.getDaysRemaining(user.data_fim);
        const isBlocked = user.bloqueado_por_vencimento || !user.ativo;
        
        if (isBlocked) {
            return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">🚫 Bloqueado</span>';
        }
        
        if (daysRemaining <= 0) {
            return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">⏰ Vencido</span>';
        }
        
        if (daysRemaining <= 7) {
            return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">⚠️ Vencendo</span>';
        }
        
        return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">✅ Ativo</span>';
    }

    getDefaultEndDate() {
        const date = new Date();
        date.setMonth(date.getMonth() + 1); // 1 mês a partir de hoje
        return date.toISOString().split('T')[0];
    }

    /**
     * Atualiza estatísticas do painel
     */
    updateStats() {
        const activeUsers = this.users.filter(u => u.ativo && !u.bloqueado_por_vencimento && this.getDaysRemaining(u.data_fim) > 0).length;
        const expiringUsers = this.users.filter(u => u.ativo && !u.bloqueado_por_vencimento && this.getDaysRemaining(u.data_fim) <= 7 && this.getDaysRemaining(u.data_fim) > 0).length;
        const blockedUsers = this.users.filter(u => !u.ativo || u.bloqueado_por_vencimento || this.getDaysRemaining(u.data_fim) <= 0).length;
        const totalRevenue = this.users.filter(u => u.status_pagamento === 'em_dia').reduce((sum, u) => sum + parseFloat(u.valor_mensal || 0), 0);

        document.getElementById('totalActiveUsers').textContent = activeUsers;
        document.getElementById('totalExpiringUsers').textContent = expiringUsers;
        document.getElementById('totalBlockedUsers').textContent = blockedUsers;
        document.getElementById('totalRevenue').textContent = `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`;
    }

    /**
     * Verifica usuários com acesso vencido e bloqueia automaticamente
     */
    async checkExpiredUsers() {
        let blockedCount = 0;
        const accessConfig = JSON.parse(localStorage.getItem('zorix_admin_access_control') || '[]');
        
        for (const user of this.users) {
            const daysRemaining = this.getDaysRemaining(user.data_fim);
            
            if (daysRemaining <= 0 && !user.bloqueado_por_vencimento) {
                // Bloquear usuário
                try {
                    await window.api.updateUsuario(user.id, {
                        ...user,
                        ativo: false
                    });
                    
                    // Atualizar configuração de acesso
                    const configIndex = accessConfig.findIndex(c => c.user_id === user.id);
                    if (configIndex !== -1) {
                        accessConfig[configIndex].bloqueado_por_vencimento = true;
                    } else {
                        accessConfig.push({
                            user_id: user.id,
                            bloqueado_por_vencimento: true,
                            data_bloqueio: new Date().toISOString()
                        });
                    }
                    
                    user.bloqueado_por_vencimento = true;
                    user.ativo = false;
                    blockedCount++;
                    
                    console.log(`🚫 Usuário ${user.nome} bloqueado por vencimento`);
                } catch (error) {
                    console.error(`❌ Erro ao bloquear usuário ${user.nome}:`, error);
                }
            }
        }
        
        if (blockedCount > 0) {
            localStorage.setItem('zorix_admin_access_control', JSON.stringify(accessConfig));
            this.showNotification(`${blockedCount} usuário(s) bloqueado(s) por vencimento`, 'warning');
            this.renderUsersList();
            this.updateStats();
        }
        
        return blockedCount;
    }

    /**
     * Abre modal para novo usuário
     */
    addNewUser() {
        const modal = document.getElementById('modalUser');
        const titulo = document.getElementById('modalUserTitle');
        const form = document.getElementById('formUser');
        
        // Limpar campos
        form.reset();
        delete form.dataset.editId;
        
        titulo.textContent = 'Novo Usuário';
        
        // Definir datas padrão
        const today = new Date().toISOString().split('T')[0];
        const endDate = this.getDefaultEndDate();
        
        document.getElementById('userDataInicio').value = today;
        document.getElementById('userDataFim').value = endDate;
        
        modal.classList.remove('hidden');
    }

    /**
     * Edita usuário existente
     */
    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) {
            this.showNotification('Usuário não encontrado', 'error');
            return;
        }

        const modal = document.getElementById('modalUser');
        const titulo = document.getElementById('modalUserTitle');
        const form = document.getElementById('formUser');
        
        titulo.textContent = 'Editar Usuário';
        form.dataset.editId = userId;
        
        // Preencher campos
        document.getElementById('userNome').value = user.nome;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userTipo').value = user.tipo;
        document.getElementById('userSenha').value = ''; // Não preencher senha por segurança
        document.getElementById('userDataInicio').value = user.data_inicio;
        document.getElementById('userDataFim').value = user.data_fim;
        document.getElementById('userValorMensal').value = user.valor_mensal || 0;
        document.getElementById('userStatusPagamento').value = user.status_pagamento;
        document.getElementById('userObservacoes').value = user.observacoes || '';
        
        modal.classList.remove('hidden');
    }

    /**
     * Salva usuário (novo ou editado)
     */
    async saveUser(event) {
        event.preventDefault();
        
        const form = event.target;
        const editId = form.dataset.editId;
        const isEdit = !!editId;
        
        const userData = {
            nome: document.getElementById('userNome').value.trim(),
            email: document.getElementById('userEmail').value.trim().toLowerCase(),
            tipo: document.getElementById('userTipo').value,
            senha: document.getElementById('userSenha').value,
            ativo: true
        };

        const accessData = {
            user_id: editId || null,
            data_inicio: document.getElementById('userDataInicio').value,
            data_fim: document.getElementById('userDataFim').value,
            valor_mensal: parseFloat(document.getElementById('userValorMensal').value) || 0,
            status_pagamento: document.getElementById('userStatusPagamento').value,
            observacoes: document.getElementById('userObservacoes').value.trim(),
            bloqueado_por_vencimento: false
        };

        // Validações
        if (!userData.nome || !userData.email || !userData.tipo) {
            this.showNotification('Preencha todos os campos obrigatórios', 'error');
            return;
        }

        if (!isEdit && (!userData.senha || userData.senha.length < 6)) {
            this.showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }

        if (new Date(accessData.data_inicio) >= new Date(accessData.data_fim)) {
            this.showNotification('A data de fim deve ser posterior à data de início', 'error');
            return;
        }

        try {
            let user;
            
            if (isEdit) {
                // Atualizar usuário existente
                const existingUser = this.users.find(u => u.id === editId);
                const updateData = { ...existingUser, ...userData };
                
                // Se senha não foi informada, manter a anterior
                if (!userData.senha) {
                    delete updateData.senha;
                } else {
                    updateData.senha = window.auth.hashPassword(userData.senha);
                }
                
                user = await window.api.updateUsuario(editId, updateData);
                accessData.user_id = editId;
                
                this.showNotification('Usuário atualizado com sucesso!', 'success');
            } else {
                // Criar novo usuário
                userData.id = window.api.generateId();
                userData.senha = window.auth.hashPassword(userData.senha);
                userData.created_at = new Date().toISOString();
                userData.updated_at = new Date().toISOString();
                
                user = await window.api.createUsuario(userData);
                accessData.user_id = user.id;
                
                this.showNotification('Usuário criado com sucesso!', 'success');
            }
            
            // Salvar configuração de acesso
            const accessConfig = JSON.parse(localStorage.getItem('zorix_admin_access_control') || '[]');
            const configIndex = accessConfig.findIndex(c => c.user_id === accessData.user_id);
            
            if (configIndex !== -1) {
                accessConfig[configIndex] = { ...accessConfig[configIndex], ...accessData };
            } else {
                accessConfig.push(accessData);
            }
            
            localStorage.setItem('zorix_admin_access_control', JSON.stringify(accessConfig));
            
            // Recarregar dados
            await this.loadUsers();
            this.updateStats();
            this.closeModal();
            
        } catch (error) {
            console.error('❌ Erro ao salvar usuário:', error);
            this.showNotification(`Erro ao salvar usuário: ${error.message}`, 'error');
        }
    }

    /**
     * Bloqueia/desbloqueia usuário
     */
    async toggleUserBlock(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        const isCurrentlyBlocked = user.bloqueado_por_vencimento || !user.ativo;
        const action = isCurrentlyBlocked ? 'desbloquear' : 'bloquear';
        
        if (!confirm(`Deseja ${action} o usuário "${user.nome}"?`)) return;
        
        try {
            // Atualizar usuário
            await window.api.updateUsuario(userId, {
                ...user,
                ativo: isCurrentlyBlocked ? true : false
            });
            
            // Atualizar configuração de acesso
            const accessConfig = JSON.parse(localStorage.getItem('zorix_admin_access_control') || '[]');
            const configIndex = accessConfig.findIndex(c => c.user_id === userId);
            
            if (configIndex !== -1) {
                accessConfig[configIndex].bloqueado_por_vencimento = !isCurrentlyBlocked;
            } else {
                accessConfig.push({
                    user_id: userId,
                    bloqueado_por_vencimento: !isCurrentlyBlocked
                });
            }
            
            localStorage.setItem('zorix_admin_access_control', JSON.stringify(accessConfig));
            
            this.showNotification(`Usuário ${action}ado com sucesso!`, 'success');
            await this.loadUsers();
            this.updateStats();
            
        } catch (error) {
            console.error(`❌ Erro ao ${action} usuário:`, error);
            this.showNotification(`Erro ao ${action} usuário`, 'error');
        }
    }

    /**
     * Estende acesso do usuário por 30 dias
     */
    async extendAccess(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        if (!confirm(`Estender acesso de "${user.nome}" por 30 dias?`)) return;
        
        try {
            const newEndDate = new Date(user.data_fim);
            newEndDate.setDate(newEndDate.getDate() + 30);
            
            // Atualizar configuração de acesso
            const accessConfig = JSON.parse(localStorage.getItem('zorix_admin_access_control') || '[]');
            const configIndex = accessConfig.findIndex(c => c.user_id === userId);
            
            if (configIndex !== -1) {
                accessConfig[configIndex].data_fim = newEndDate.toISOString().split('T')[0];
            } else {
                accessConfig.push({
                    user_id: userId,
                    data_fim: newEndDate.toISOString().split('T')[0]
                });
            }
            
            localStorage.setItem('zorix_admin_access_control', JSON.stringify(accessConfig));
            
            this.showNotification('Acesso estendido por 30 dias!', 'success');
            await this.loadUsers();
            this.updateStats();
            
        } catch (error) {
            console.error('❌ Erro ao estender acesso:', error);
            this.showNotification('Erro ao estender acesso', 'error');
        }
    }

    /**
     * Exclui usuário
     */
    async deleteUser(userId, userName) {
        if (!confirm(`Deseja excluir permanentemente o usuário "${userName}"?\n\nEsta ação não pode ser desfeita e removerá todos os dados do usuário.`)) {
            return;
        }
        
        if (!confirm(`⚠️ CONFIRMAÇÃO FINAL ⚠️\n\nTem certeza que deseja excluir "${userName}"?\n\nTodos os dados serão perdidos permanentemente.`)) {
            return;
        }
        
        try {
            // Remover do sistema principal
            await window.api.deleteUsuario(userId);
            
            // Remover configuração de acesso
            const accessConfig = JSON.parse(localStorage.getItem('zorix_admin_access_control') || '[]');
            const filteredConfig = accessConfig.filter(c => c.user_id !== userId);
            localStorage.setItem('zorix_admin_access_control', JSON.stringify(filteredConfig));
            
            this.showNotification(`Usuário "${userName}" excluído com sucesso!`, 'success');
            await this.loadUsers();
            this.updateStats();
            
        } catch (error) {
            console.error('❌ Erro ao excluir usuário:', error);
            this.showNotification(`Erro ao excluir usuário: ${error.message}`, 'error');
        }
    }

    /**
     * Filtros e busca
     */
    filterUsers() {
        const searchTerm = document.getElementById('searchUser').value.toLowerCase();
        const statusFilter = document.getElementById('filterStatus').value;
        const typeFilter = document.getElementById('filterType').value;
        
        // Implementar filtros aqui se necessário
        // Por simplicidade, manteremos a lista completa
        console.log('🔍 Filtros aplicados:', { searchTerm, statusFilter, typeFilter });
    }

    clearFilters() {
        document.getElementById('searchUser').value = '';
        document.getElementById('filterStatus').value = '';
        document.getElementById('filterType').value = '';
        this.filterUsers();
    }

    /**
     * Fecha modal
     */
    closeModal() {
        document.getElementById('modalUser').classList.add('hidden');
    }

    /**
     * Sistema de notificações
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-2xl shadow-2xl text-white font-medium transition-all duration-500 transform translate-x-full max-w-md`;

        const colors = {
            'success': 'bg-gradient-to-r from-green-500 to-green-600',
            'error': 'bg-gradient-to-r from-red-500 to-red-600',
            'warning': 'bg-gradient-to-r from-yellow-500 to-orange-500',
            'info': 'bg-gradient-to-r from-blue-500 to-blue-600'
        };

        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-triangle',
            'warning': 'fa-exclamation-circle',
            'info': 'fa-info-circle'
        };

        notification.className += ` ${colors[type] || colors.info}`;
        notification.innerHTML = `
            <div class="flex items-center space-x-4">
                <i class="fas ${icons[type] || icons.info} text-xl"></i>
                <span class="flex-1">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 hover:opacity-75 transition duration-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Auto remover após 5s
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 5000);
    }

    /**
     * CONFIGURAÇÕES DE PAGAMENTO
     */

    /**
     * Alterna painel de configuração de pagamento
     */
    togglePaymentConfig() {
        const panel = document.getElementById('paymentConfigPanel');
        const display = document.getElementById('paymentConfigDisplay');
        
        if (panel.classList.contains('hidden')) {
            // Mostrar painel de configuração
            panel.classList.remove('hidden');
            display.classList.add('hidden');
            
            // Carregar valores atuais
            this.loadPaymentConfigToForm();
        } else {
            // Esconder painel de configuração
            panel.classList.add('hidden');
            display.classList.remove('hidden');
        }
    }

    /**
     * Carrega configurações de pagamento para o formulário
     */
    loadPaymentConfigToForm() {
        const config = JSON.parse(localStorage.getItem('zorix_payment_config') || '{}');
        
        document.getElementById('configPreco').value = config.preco || 349.99;
        document.getElementById('configPeriodo').value = config.periodo || 180;
        document.getElementById('configGateway').value = config.gateway || 'custom';
    }

    /**
     * Salva configurações de pagamento
     */
    savePaymentConfig() {
        const config = {
            preco: parseFloat(document.getElementById('configPreco').value) || 349.99,
            periodo: parseInt(document.getElementById('configPeriodo').value) || 180,
            gateway: document.getElementById('configGateway').value || 'custom',
            plano: 'Semestral',
            moeda: 'BRL',
            updated_at: new Date().toISOString()
        };



        // Validações
        if (config.preco <= 0) {
            this.showNotification('Preço deve ser maior que zero', 'error');
            return;
        }

        if (config.periodo <= 0) {
            this.showNotification('Período deve ser maior que zero', 'error');
            return;
        }

        // Salvar configuração
        localStorage.setItem('zorix_payment_config', JSON.stringify(config));
        
        // Atualizar display
        this.updatePaymentConfigDisplay(config);
        
        // Esconder painel de configuração
        this.togglePaymentConfig();
        
        this.showNotification('Configurações de pagamento salvas com sucesso!', 'success');
    }

    /**
     * Atualiza display das configurações de pagamento
     */
    updatePaymentConfigDisplay(config = null) {
        if (!config) {
            config = JSON.parse(localStorage.getItem('zorix_payment_config') || '{}');
        }

        const preco = config.preco || 349.99;
        const periodo = config.periodo || 180;
        const gateway = config.gateway || 'custom';

        document.getElementById('displayPreco').textContent = `R$ ${preco.toFixed(2).replace('.', ',')}`;
        const displayPeriodo = periodo === 180 ? `${periodo} dias (6 meses)` : `${periodo} dias`;
        document.getElementById('displayPeriodo').textContent = displayPeriodo;
        document.getElementById('displayGateway').textContent = this.getGatewayName(gateway);
        document.getElementById('displayStatus').textContent = 'Ativo';
    }

    /**
     * Obtém nome amigável do gateway
     */


    getGatewayName(gateway) {
        const names = {
            'custom': 'Personalizado',
            'mercadopago': 'MercadoPago',
            'pagseguro': 'PagSeguro',
            'pix': 'PIX'
        };
        return names[gateway] || 'Personalizado';
    }



}

// Instância global
window.painelAdmin = new PainelAdminManager();

console.log('✅ Painel de Controle Administrativo carregado com sucesso!');