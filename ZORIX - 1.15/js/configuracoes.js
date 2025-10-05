/**
 * LURIX CRM - Sistema de Configurações Simplificado
 * Mudança de Cores, Nome do Sistema e Gestão de Vendedores
 * Autor: Sistema LURIX
 * Data: Outubro 2024
 */

class ConfiguracoesManager {
    constructor() {
        this.vendedores = this.loadVendedores();
        this.configuracoes = this.loadConfiguracoes();
        
        console.log('⚙️ ConfiguracoesManager inicializado');
    }

    /**
     * Carrega a página principal de Configurações
     */
    async loadConfiguracoes() {
        console.log('⚙️ Carregando configurações...');
        
        const content = `
            <div class="fade-in min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                <!-- Header -->
                <div class="bg-white shadow-sm border-b border-gray-200 mb-8">
                    <div class="max-w-7xl mx-auto px-6 py-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                    ⚙️ Configurações do Sistema
                                </h1>
                                <p class="text-gray-600 mt-2">Personalize cores, nome do sistema e gerencie vendedores</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="max-w-4xl mx-auto px-6">
                    <!-- Configurações da Tela Inicial -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                        <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                            <h3 class="text-xl font-semibold flex items-center">
                                <i class="fas fa-desktop mr-3"></i>
                                Personalização da Tela Inicial
                            </h3>
                            <p class="text-blue-100 mt-2">Configure a aparência da tela de login</p>
                        </div>
                        
                        <div class="p-6 space-y-6">
                            <!-- Nome do Sistema -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nome do Sistema</label>
                                <input type="text" id="nomeSistema" value="${this.configuracoes.nomeSistema || 'ZORIX CRM'}"
                                    onchange="configuracoesManager.atualizarNomeSistema(this.value)"
                                    placeholder="Ex: ZORIX CRM, Minha Empresa CRM"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <p class="text-xs text-gray-500 mt-1">Este nome aparecerá na tela de login</p>
                            </div>
                            
                            <!-- Cor de Fundo da Tela Inicial -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Cor de Fundo da Tela Inicial</label>
                                <div class="flex items-center space-x-4">
                                    <div class="flex items-center space-x-2">
                                        <input type="color" id="corFundoLogin" value="${this.configuracoes.corFundoLogin || '#1F2937'}"
                                            onchange="configuracoesManager.atualizarCorFundo(this.value)"
                                            class="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer">
                                        <div>
                                            <div class="text-sm font-medium text-gray-900">Cor Principal</div>
                                            <div class="text-xs text-gray-500" id="corFundoHex">${this.configuracoes.corFundoLogin || '#1F2937'}</div>
                                        </div>
                                    </div>
                                    <button onclick="configuracoesManager.resetarCores()" 
                                        class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200 text-sm">
                                        <i class="fas fa-undo mr-1"></i>
                                        Restaurar Padrão
                                    </button>
                                </div>
                                <p class="text-xs text-gray-500 mt-1">Cor do fundo da tela de login (será aplicada como gradiente)</p>
                            </div>

                            <!-- Preview -->
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="text-sm font-medium text-gray-700 mb-3">Preview da Tela Inicial</h4>
                                <div class="relative rounded-lg overflow-hidden border-2 border-gray-200" style="height: 200px;">
                                    <div id="previewBackground" class="absolute inset-0" style="background: linear-gradient(135deg, ${this.configuracoes.corFundoLogin || '#1F2937'}, ${this.lightenColor(this.configuracoes.corFundoLogin || '#1F2937', 20)});">
                                        <div class="flex items-center justify-center h-full">
                                            <div class="bg-white rounded-lg p-6 shadow-lg">
                                                <h2 id="previewNome" class="text-2xl font-bold text-center text-gray-900 mb-2">${this.configuracoes.nomeSistema || 'ZORIX CRM'}</h2>
                                                <div class="text-center text-gray-600 text-sm">Sistema de Gestão</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Gestão de Vendedores -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-xl font-semibold flex items-center">
                                        <i class="fas fa-users mr-3"></i>
                                        Gestão de Vendedores
                                    </h3>
                                    <p class="text-green-100 mt-2">Cadastre e gerencie vendedores para associar aos clientes</p>
                                </div>
                                <button onclick="configuracoesManager.abrirModalVendedor()" 
                                    class="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition duration-200 font-medium">
                                    <i class="fas fa-plus mr-2"></i>
                                    Novo Vendedor
                                </button>
                            </div>
                        </div>
                        
                        <div class="p-6">
                            <div id="vendedoresList">
                                ${this.renderListaVendedores()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Vendedor -->
            <div id="modalVendedor" class="modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 hidden">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                    <div class="p-6 border-b border-gray-200">
                        <h3 class="text-xl font-semibold text-gray-900" id="modalVendedorTitulo">Novo Vendedor</h3>
                    </div>
                    
                    <form id="formVendedor" onsubmit="configuracoesManager.salvarVendedor(event)">
                        <div class="p-6 space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                                <input type="text" id="vendedorNome" required
                                    placeholder="Ex: João Silva"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                <input type="email" id="vendedorEmail"
                                    placeholder="Ex: joao@empresa.com"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                <input type="tel" id="vendedorTelefone"
                                    placeholder="Ex: (11) 99999-9999"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                            </div>
                        </div>
                        
                        <div class="flex justify-end gap-3 p-6 border-t border-gray-200">
                            <button type="button" onclick="configuracoesManager.fecharModal()" 
                                class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200">
                                Cancelar
                            </button>
                            <button type="submit" 
                                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200">
                                <i class="fas fa-save mr-2"></i>
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('pageContent').innerHTML = content;
        console.log('✅ Configurações carregadas');
    }

    /**
     * Atualiza o nome do sistema
     */
    atualizarNomeSistema(novoNome) {
        this.configuracoes.nomeSistema = novoNome;
        this.saveConfiguracoes();
        
        // Atualizar preview
        document.getElementById('previewNome').textContent = novoNome;
        
        // Atualizar na tela de login se estiver visível
        const loginTitle = document.querySelector('.login-container h1');
        if (loginTitle) {
            loginTitle.textContent = novoNome;
        }
        
        this.showNotification('Nome do sistema atualizado!', 'success');
    }

    /**
     * Atualiza a cor de fundo da tela inicial
     */
    atualizarCorFundo(novaCor) {
        this.configuracoes.corFundoLogin = novaCor;
        this.saveConfiguracoes();
        
        // Atualizar preview
        const preview = document.getElementById('previewBackground');
        const corClara = this.lightenColor(novaCor, 20);
        preview.style.background = `linear-gradient(135deg, ${novaCor}, ${corClara})`;
        
        // Atualizar hex exibido
        document.getElementById('corFundoHex').textContent = novaCor;
        
        // Aplicar na tela de login se estiver visível
        const loginContainer = document.querySelector('.min-h-screen');
        if (loginContainer && loginContainer.classList.contains('bg-gradient-to-br')) {
            loginContainer.style.background = `linear-gradient(135deg, ${novaCor}, ${corClara})`;
        }
        
        this.showNotification('Cor de fundo atualizada!', 'success');
    }

    /**
     * Clareia uma cor em hexadecimal
     */
    lightenColor(hex, percent) {
        // Remove # se presente
        hex = hex.replace('#', '');
        
        // Converte para RGB
        const num = parseInt(hex, 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = ((num >> 8) & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        // Garante que não ultrapasse 255
        const newR = (R < 255) ? R : 255;
        const newG = (G < 255) ? G : 255;
        const newB = (B < 255) ? B : 255;
        
        return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`;
    }

    /**
     * Restaura as cores padrão
     */
    resetarCores() {
        const corPadrao = '#1F2937';
        document.getElementById('corFundoLogin').value = corPadrao;
        this.atualizarCorFundo(corPadrao);
        this.showNotification('Cores restauradas para o padrão!', 'success');
    }

    /**
     * Renderiza a lista de vendedores
     */
    renderListaVendedores() {
        if (this.vendedores.length === 0) {
            return `
                <div class="text-center py-12">
                    <i class="fas fa-user-plus text-4xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum vendedor cadastrado</h3>
                    <p class="text-gray-500 mb-4">Cadastre vendedores para associar aos seus clientes</p>
                    <button onclick="configuracoesManager.abrirModalVendedor()" 
                        class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200">
                        <i class="fas fa-plus mr-2"></i>
                        Cadastrar Primeiro Vendedor
                    </button>
                </div>
            `;
        }

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${this.vendedores.map(vendedor => `
                    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                        <div class="flex items-start justify-between">
                            <div class="flex items-center flex-1">
                                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                    <span class="text-green-600 font-bold text-lg">${vendedor.nome.charAt(0).toUpperCase()}</span>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-semibold text-gray-900">${vendedor.nome}</h4>
                                    ${vendedor.email ? `<p class="text-sm text-gray-600"><i class="fas fa-envelope mr-1"></i> ${vendedor.email}</p>` : ''}
                                    ${vendedor.telefone ? `<p class="text-sm text-gray-600"><i class="fas fa-phone mr-1"></i> ${vendedor.telefone}</p>` : ''}
                                </div>
                            </div>
                            <div class="flex space-x-2 ml-4">
                                <button onclick="configuracoesManager.editarVendedor('${vendedor.id}')" 
                                    class="text-blue-600 hover:text-blue-700 p-2 rounded-md hover:bg-blue-50"
                                    title="Editar vendedor">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="configuracoesManager.excluirVendedor('${vendedor.id}', '${vendedor.nome}')" 
                                    class="text-red-600 hover:text-red-700 p-2 rounded-md hover:bg-red-50"
                                    title="Excluir vendedor">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Abre modal para novo vendedor ou edição
     */
    abrirModalVendedor(vendedorId = null) {
        const modal = document.getElementById('modalVendedor');
        const titulo = document.getElementById('modalVendedorTitulo');
        const form = document.getElementById('formVendedor');
        
        // Limpar campos
        form.reset();
        delete form.dataset.editId;
        
        if (vendedorId) {
            // Modo edição
            const vendedor = this.vendedores.find(v => v.id === vendedorId);
            if (vendedor) {
                titulo.textContent = 'Editar Vendedor';
                document.getElementById('vendedorNome').value = vendedor.nome;
                document.getElementById('vendedorEmail').value = vendedor.email || '';
                document.getElementById('vendedorTelefone').value = vendedor.telefone || '';
                form.dataset.editId = vendedorId;
            }
        } else {
            // Modo novo
            titulo.textContent = 'Novo Vendedor';
        }
        
        modal.classList.remove('hidden');
    }

    /**
     * Salva vendedor (novo ou editado)
     */
    salvarVendedor(event) {
        event.preventDefault();
        
        const form = event.target;
        const editId = form.dataset.editId;
        const nome = document.getElementById('vendedorNome').value.trim();
        const email = document.getElementById('vendedorEmail').value.trim();
        const telefone = document.getElementById('vendedorTelefone').value.trim();
        
        if (!nome) {
            this.showNotification('Nome é obrigatório!', 'error');
            return;
        }
        
        const vendedor = {
            id: editId || this.gerarId('vend'),
            nome,
            email,
            telefone,
            status: 'ativo',
            criadoEm: editId ? this.vendedores.find(v => v.id === editId).criadoEm : new Date().toISOString()
        };
        
        if (editId) {
            // Editar existente
            const index = this.vendedores.findIndex(v => v.id === editId);
            this.vendedores[index] = vendedor;
            this.showNotification('Vendedor atualizado com sucesso!', 'success');
        } else {
            // Adicionar novo
            this.vendedores.push(vendedor);
            this.showNotification('Vendedor cadastrado com sucesso!', 'success');
        }
        
        this.saveVendedores();
        this.atualizarListaVendedores();
        this.fecharModal();
    }

    /**
     * Edita um vendedor
     */
    editarVendedor(vendedorId) {
        this.abrirModalVendedor(vendedorId);
    }

    /**
     * Exclui um vendedor
     */
    excluirVendedor(vendedorId, nomeVendedor) {
        if (confirm(`Deseja realmente excluir o vendedor "${nomeVendedor}"?\n\nEsta ação não pode ser desfeita.`)) {
            this.vendedores = this.vendedores.filter(v => v.id !== vendedorId);
            this.saveVendedores();
            this.atualizarListaVendedores();
            this.showNotification('Vendedor excluído com sucesso!', 'success');
        }
    }

    /**
     * Atualiza a lista de vendedores na tela
     */
    atualizarListaVendedores() {
        const container = document.getElementById('vendedoresList');
        if (container) {
            container.innerHTML = this.renderListaVendedores();
        }
    }

    /**
     * Fecha o modal
     */
    fecharModal() {
        document.getElementById('modalVendedor').classList.add('hidden');
    }

    /**
     * Métodos públicos para acesso aos dados
     */
    getVendedores() {
        return this.vendedores.filter(v => v.status === 'ativo');
    }

    getVendedorById(id) {
        return this.vendedores.find(v => v.id === id);
    }

    getConfiguracoes() {
        return this.configuracoes;
    }

    /**
     * Gera ID único
     */
    gerarId(prefixo = 'id') {
        return `${prefixo}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    }

    /**
     * Persistência de dados
     */
    loadVendedores() {
        try {
            const data = localStorage.getItem('lurix_vendedores');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Erro ao carregar vendedores:', error);
            return [];
        }
    }

    saveVendedores() {
        try {
            localStorage.setItem('lurix_vendedores', JSON.stringify(this.vendedores));
        } catch (error) {
            console.error('Erro ao salvar vendedores:', error);
        }
    }

    loadConfiguracoes() {
        try {
            const data = localStorage.getItem('lurix_configuracoes');
            return data ? JSON.parse(data) : {
                nomeSistema: 'ZORIX CRM',
                corFundoLogin: '#1F2937'
            };
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            return {
                nomeSistema: 'ZORIX CRM',
                corFundoLogin: '#1F2937'
            };
        }
    }

    saveConfiguracoes() {
        try {
            localStorage.setItem('lurix_configuracoes', JSON.stringify(this.configuracoes));
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
        }
    }

    /**
     * Sistema de notificações
     */
    showNotification(message, type = 'info') {
        // Remove notificação existente
        const existing = document.getElementById('configNotification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'configNotification';
        notification.className = `fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl text-white font-medium transition-all duration-500 transform translate-x-full max-w-md`;

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

        // Auto remover após 3s
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 3000);
    }
}

// Instância global
window.configuracoesManager = new ConfiguracoesManager();

console.log('✅ Sistema de Configurações Simplificado carregado com sucesso!');