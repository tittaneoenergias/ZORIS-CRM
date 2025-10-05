/**
 * LURIX CRM - Sistema de Projetos Fotovoltaicos v2.0
 * Reformulação Completa - Design Profissional
 * Autor: Sistema LURIX
 * Data: Outubro 2024
 */

class ProjetosManager {
    constructor() {
        this.currentProjetos = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.searchTerm = '';
        this.sortBy = 'created_at';
        this.sortOrder = 'desc';
        this.filterStatus = '';
        this.currentViewMode = 'grid';
        
        console.log('🚀 ProjetosManager v2.0 inicializado');
        
        // Sistema de limpeza desativado - manter projetos como estão
    }

    /**
     * Limpa todos os projetos de teste do sistema
     */
    limparProjetosTeste() {
        try {
            console.log('🧹 Iniciando limpeza de projetos de teste...');
            
            // Obter todos os projetos
            const projetos = window.zorixStorage.listProjetos();
            console.log(`🗑️ Removendo ${projetos.length} projeto(s) de teste...`);
            
            // Remover cada projeto
            projetos.forEach(projeto => {
                window.zorixStorage.deleteProjeto(projeto.id);
                console.log(`  - Removido: ${projeto.titulo || projeto.nome || 'Projeto sem título'}`);
            });
            
            // Limpar propostas relacionadas se existirem
            if (window.zorixStorage.cache && window.zorixStorage.cache.propostas) {
                const propostas = window.zorixStorage.cache.propostas.length;
                window.zorixStorage.cache.propostas = [];
                console.log(`🗑️ Removidas ${propostas} proposta(s) relacionadas`);
            }
            
            // Salvar alterações
            window.zorixStorage.salvarTodos();
            
            console.log('✅ Limpeza de projetos concluída! Sistema pronto para projetos reais.');
            
        } catch (error) {
            console.error('❌ Erro ao limpar projetos de teste:', error);
        }
    }

    /**
     * Carrega a página principal de projetos (apenas consulta)
     */
    async loadProjetos() {
        console.log('📊 Carregando página de projetos...');
        
        const content = `
            <div class="fade-in min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                <!-- Header Moderno -->
                <div class="bg-white shadow-sm border-b border-gray-200 mb-8">
                    <div class="max-w-7xl mx-auto px-6 py-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                    📊 Projetos Fotovoltaicos
                                </h1>
                                <p class="text-gray-600 mt-2">Visualize e consulte todos os projetos do sistema</p>
                            </div>
                            <div class="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                                <div class="flex items-center text-blue-800 text-sm">
                                    <i class="fas fa-info-circle mr-2"></i>
                                    <span class="font-medium">Apenas consulta - Crie projetos através do perfil do cliente</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="max-w-7xl mx-auto px-6">
                    <!-- Filtros Modernos -->
                    <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 mb-8">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">🔍 Buscar Projeto</label>
                                <input type="text" id="searchProjetos" placeholder="Nome, cliente ou localização..." 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">🏷️ Status</label>
                                <select id="filterStatusProjetos" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200">
                                    <option value="">Todos os Status</option>
                                    <option value="analise">🔍 Análise</option>
                                    <option value="perdida">❌ Perdida</option>
                                    <option value="ganha">🎉 Ganha</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">📊 Ordenar Por</label>
                                <select id="sortProjetos" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200">
                                    <option value="created_at">Data de Criação</option>
                                    <option value="nome_projeto">Nome do Projeto</option>
                                    <option value="potencia_kwp">Potência (kWp)</option>
                                    <option value="valor_investimento">Valor do Investimento</option>
                                    <option value="status">Status</option>
                                    <option value="cliente_nome">Nome do Cliente</option>
                                </select>
                            </div>
                            <div class="flex items-end">
                                <button id="clearFiltersProjetos" class="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-3 rounded-xl transition duration-200 font-medium shadow-sm">
                                    <i class="fas fa-eraser mr-2"></i>
                                    Limpar Filtros
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Estatísticas Rápidas -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" id="statsCards">
                        <!-- Cards de estatística serão carregados aqui -->
                    </div>

                    <!-- Grid de Projetos -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                        <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-xl font-bold text-gray-900">Portfólio de Projetos</h3>
                                    <p class="text-gray-600 text-sm mt-1">Total: <span id="totalProjetosCount" class="font-semibold text-blue-600">0</span> projetos encontrados</p>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button id="viewModeGrid" class="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition duration-200">
                                        <i class="fas fa-th-large"></i>
                                    </button>
                                    <button id="viewModeList" class="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition duration-200">
                                        <i class="fas fa-list"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div id="projetosContainer" class="p-6">
                            <!-- Projetos serão carregados aqui -->
                        </div>

                        <!-- Paginação -->
                        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div class="flex items-center justify-between">
                                <div class="text-sm text-gray-700">
                                    Mostrando <span id="showingFromProjetos">0</span> a <span id="showingToProjetos">0</span> de <span id="totalProjetos">0</span> projetos
                                </div>
                                <div class="flex items-center space-x-2" id="paginationProjetos">
                                    <!-- Paginação será carregada aqui -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('pageContent').innerHTML = content;
        await this.setupEventListeners();
        await this.loadProjetosData();
    }

    /**
     * Configura todos os event listeners
     */
    async setupEventListeners() {
        console.log('⚙️ Configurando event listeners...');

        // Busca
        const searchInput = document.getElementById('searchProjetos');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.searchTerm = e.target.value;
                this.currentPage = 1;
                this.loadProjetosData();
            }, 300));
        }

        // Filtro de status
        const statusFilter = document.getElementById('filterStatusProjetos');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterStatus = e.target.value;
                this.currentPage = 1;
                this.loadProjetosData();
            });
        }

        // Ordenação
        const sortSelect = document.getElementById('sortProjetos');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.currentPage = 1;
                this.loadProjetosData();
            });
        }

        // Limpar filtros
        const clearBtn = document.getElementById('clearFiltersProjetos');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Modos de visualização
        const gridBtn = document.getElementById('viewModeGrid');
        const listBtn = document.getElementById('viewModeList');
        
        if (gridBtn) {
            gridBtn.addEventListener('click', () => {
                this.setViewMode('grid');
            });
        }
        
        if (listBtn) {
            listBtn.addEventListener('click', () => {
                this.setViewMode('list');
            });
        }
    }

    /**
     * Carrega os dados dos projetos
     */
    async loadProjetosData() {
        try {
            console.log('📊 Carregando dados dos projetos...');
            
            const response = await api.getProjetos(this.currentPage, this.itemsPerPage, this.searchTerm);
            let projetos = response.data || [];

            // Aplicar filtro de status
            if (this.filterStatus) {
                projetos = projetos.filter(projeto => projeto.status === this.filterStatus);
            }

            // Aplicar ordenação
            projetos = await this.sortProjetos(projetos);

            this.currentProjetos = projetos;
            await this.renderProjetos(projetos);
            await this.renderStats(projetos);
            this.updatePagination(projetos.length);

            console.log(`✅ ${projetos.length} projetos carregados`);

        } catch (error) {
            console.error('❌ Erro ao carregar projetos:', error);
            this.showNotification('Erro ao carregar projetos', 'error');
        }
    }

    /**
     * Renderiza as estatísticas
     */
    async renderStats(projetos) {
        const statsContainer = document.getElementById('statsCards');
        if (!statsContainer) return;

        const stats = {
            total: projetos.length,
            aprovados: projetos.filter(p => p.status === 'aprovado').length,
            potenciaTotal: projetos.reduce((sum, p) => sum + (parseFloat(p.potencia_kwp) || 0), 0).toFixed(1),
            valorTotal: projetos.reduce((sum, p) => sum + (parseFloat(p.valor_investimento) || 0), 0)
        };

        statsContainer.innerHTML = `
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-blue-100 text-sm font-medium">Total de Projetos</p>
                        <p class="text-3xl font-bold">${stats.total}</p>
                    </div>
                    <i class="fas fa-project-diagram text-4xl text-blue-200"></i>
                </div>
            </div>
            
            <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-green-100 text-sm font-medium">Projetos Aprovados</p>
                        <p class="text-3xl font-bold">${stats.aprovados}</p>
                    </div>
                    <i class="fas fa-check-circle text-4xl text-green-200"></i>
                </div>
            </div>
            
            <div class="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-yellow-100 text-sm font-medium">Potência Total</p>
                        <p class="text-3xl font-bold">${stats.potenciaTotal} <span class="text-lg">kWp</span></p>
                    </div>
                    <i class="fas fa-bolt text-4xl text-yellow-200"></i>
                </div>
            </div>
            
            <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-green-100 text-sm font-medium">Valor Total</p>
                        <p class="text-2xl font-bold">R$ ${stats.valorTotal.toLocaleString('pt-BR')}</p>
                    </div>
                    <i class="fas fa-dollar-sign text-4xl text-green-200"></i>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza a lista de projetos
     */
    async renderProjetos(projetos) {
        const container = document.getElementById('projetosContainer');
        const totalCount = document.getElementById('totalProjetosCount');

        if (!container) return;

        totalCount.textContent = projetos.length;

        if (projetos.length === 0) {
            container.innerHTML = `
                <div class="text-center py-16">
                    <div class="mb-6">
                        <i class="fas fa-solar-panel text-8xl text-gray-300"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-3">Sem projetos. Crie o primeiro.</h3>
                    <p class="text-gray-500 mb-6 max-w-md mx-auto">
                        Vá até a seção "Clientes" e crie projetos dentro do perfil de cada cliente.
                    </p>
                    <div class="flex gap-3 justify-center">
                        <button onclick="app.navigateTo('clientes')" class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition duration-200 font-medium shadow-lg">
                            <i class="fas fa-users mr-2"></i>Ir para Clientes
                        </button>
                        <button onclick="projetosManager.clearFilters()" class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition duration-200 font-medium shadow-lg">
                            <i class="fas fa-eraser mr-2"></i>Limpar Filtros
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        const projetosHtml = await Promise.all(projetos.map(async (projeto) => {
            const cliente = await api.getCliente(projeto.cliente_id);
            const clienteNome = cliente?.nome || 'Cliente não encontrado';

            return `
                <div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-400 mx-auto max-w-sm">
                    <!-- Header Centralizado -->
                    <div class="text-center mb-4">
                        <h3 class="font-bold text-lg text-gray-900 mb-2">
                            ${projeto.nome_projeto || 'Projeto sem nome'}
                        </h3>
                        <div class="text-gray-600 text-sm mb-1">
                            <i class="fas fa-user mr-1 text-blue-600"></i>
                            ${clienteNome}
                        </div>
                        <div class="text-gray-500 text-xs">
                            <i class="fas fa-map-marker-alt mr-1"></i>
                            ${projeto.cidade || 'N/A'}, ${projeto.estado || 'N/A'}
                        </div>
                        <div class="mt-3">
                            ${this.getStatusBadge(projeto.status)}
                        </div>
                    </div>

                    <!-- Dados Importantes Centralizados -->
                    <div class="space-y-3 mb-4">
                        <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 text-center border border-blue-200">
                            <div class="text-xs font-semibold text-blue-700 mb-1">⚡ POTÊNCIA</div>
                            <div class="text-xl font-bold text-blue-900">
                                ${projeto.potencia_kwp ? projeto.potencia_kwp + ' kWp' : 'N/A'}
                            </div>
                        </div>
                        
                        <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 text-center border border-green-200">
                            <div class="text-xs font-semibold text-green-700 mb-1">💰 INVESTIMENTO</div>
                            <div class="text-lg font-bold text-green-900">
                                ${projeto.valor_investimento ? 'R$ ' + projeto.valor_investimento.toLocaleString('pt-BR') : 'N/A'}
                            </div>
                        </div>
                        
                        <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-3 text-center border border-yellow-200">
                            <div class="text-xs font-semibold text-yellow-700 mb-1">🌱 ECONOMIA/MÊS</div>
                            <div class="text-lg font-bold text-yellow-900">
                                R$ ${(projeto.economia_mensal || 0).toLocaleString('pt-BR')}
                            </div>
                        </div>
                    </div>

                    <!-- Ações Centralizadas -->
                    <div class="flex gap-2 justify-center">
                        <button onclick="projetosManager.viewProjectDetails('${projeto.id}')" 
                                class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 text-sm font-medium text-center">
                            <i class="fas fa-eye mr-1"></i>
                            Detalhes
                        </button>
                        <button onclick="projetosManager.generateProjectPDF('${projeto.id}')" 
                                class="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg transition duration-200 text-sm font-medium text-center">
                            <i class="fas fa-file-pdf mr-1"></i>
                            PDF
                        </button>
                    </div>
                </div>
            `;
        }));

        const isListMode = this.currentViewMode === 'list';
        
        if (isListMode) {
            container.innerHTML = `
                <div class="space-y-4">
                    ${projetosHtml.join('')}
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                    ${projetosHtml.join('')}
                </div>
            `;
        }
    }

    /**
     * Gera badge de status com cores modernas
     */
    getStatusBadge(status) {
        const statusConfig = {
            'analise': { 
                color: 'bg-gradient-to-r from-blue-500 to-blue-600', 
                icon: 'fas fa-search', 
                text: 'Análise',
                textColor: 'text-white'
            },
            'perdida': { 
                color: 'bg-gradient-to-r from-gray-500 to-gray-600', 
                icon: 'fas fa-times-circle', 
                text: 'Perdida',
                textColor: 'text-white'
            },
            'ganha': { 
                color: 'bg-gradient-to-r from-green-500 to-green-600', 
                icon: 'fas fa-trophy', 
                text: 'Ganha',
                textColor: 'text-white'
            }
        };

        const config = statusConfig[status] || statusConfig['analise'];
        return `
            <span class="px-4 py-2 rounded-full text-xs font-bold ${config.color} ${config.textColor} flex items-center shadow-sm">
                <i class="${config.icon} mr-2"></i>
                ${config.text}
            </span>
        `;
    }

    /**
     * Ordena os projetos
     */
    async sortProjetos(projetos) {
        return projetos.sort((a, b) => {
            let valueA = a[this.sortBy];
            let valueB = b[this.sortBy];

            // Tratamento especial para cliente_nome
            if (this.sortBy === 'cliente_nome') {
                // Precisaríamos buscar os nomes dos clientes, por simplicidade vamos usar cliente_id
                valueA = a.cliente_id;
                valueB = b.cliente_id;
            }

            // Tratamento para datas
            if (this.sortBy === 'created_at' || this.sortBy === 'updated_at') {
                valueA = new Date(valueA || 0);
                valueB = new Date(valueB || 0);
            }

            // Tratamento para números
            if (this.sortBy === 'potencia_kwp' || this.sortBy === 'valor_investimento') {
                valueA = parseFloat(valueA) || 0;
                valueB = parseFloat(valueB) || 0;
            }

            // Tratamento para strings
            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            if (this.sortOrder === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
    }

    /**
     * Visualiza detalhes completos do projeto
     */
    async viewProjectDetails(projetoId) {
        try {
            console.log('👁️ Visualizando projeto:', projetoId);
            
            const projeto = await api.getProjeto(projetoId);
            if (!projeto) {
                this.showNotification('Projeto não encontrado', 'error');
                return;
            }

            const cliente = await api.getCliente(projeto.cliente_id);
            this.showProjectModal(projeto, cliente);

        } catch (error) {
            console.error('❌ Erro ao carregar projeto:', error);
            this.showNotification('Erro ao carregar projeto', 'error');
        }
    }

    /**
     * Exibe modal moderno com detalhes do projeto
     */
    showProjectModal(projeto, cliente) {
        const modal = document.createElement('div');
        modal.id = 'modernProjectModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm';
        
        modal.innerHTML = `
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
                <!-- Header Moderno -->
                <div class="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-6">
                    <div class="absolute inset-0 bg-black opacity-10"></div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 class="text-2xl font-bold mb-2">${projeto.nome_projeto || 'Projeto'}</h2>
                                <div class="flex items-center space-x-4 text-blue-100">
                                    <div class="flex items-center">
                                        <i class="fas fa-user mr-2"></i>
                                        <span>${cliente?.nome || 'Cliente não encontrado'}</span>
                                    </div>
                                    <div class="flex items-center">
                                        <i class="fas fa-map-marker-alt mr-2"></i>
                                        <span>${projeto.cidade || 'N/A'}, ${projeto.estado || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                            <button onclick="document.getElementById('modernProjectModal').remove()" 
                                    class="text-white hover:text-blue-200 transition duration-200 p-2 rounded-full hover:bg-white hover:bg-opacity-10">
                                <i class="fas fa-times text-2xl"></i>
                            </button>
                        </div>
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500"></div>
                </div>
                
                <div class="overflow-y-auto max-h-[calc(95vh-120px)] p-8">
                    ${this.renderProjectDetails(projeto, cliente)}
                </div>
                
                <!-- Footer com Ações -->
                <div class="bg-gray-50 px-8 py-6 border-t border-gray-200 flex justify-end space-x-4">
                    <button onclick="projetosManager.generateProjectPDF('${projeto.id}')" 
                            class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-2xl transition duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        <i class="fas fa-file-pdf mr-3"></i>
                        Gerar PDF Profissional
                    </button>
                    <button onclick="document.getElementById('modernProjectModal').remove()" 
                            class="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-8 py-3 rounded-2xl transition duration-200 font-semibold">
                        <i class="fas fa-times mr-3"></i>
                        Fechar
                    </button>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);
        console.log('✅ Modal de projeto exibido');
    }

    /**
     * Renderiza detalhes completos do projeto
     */
    renderProjectDetails(projeto, cliente) {
        return `
            <!-- Métricas Principais -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-blue-100 text-sm font-medium uppercase tracking-wide">Status</p>
                            <p class="text-2xl font-bold mt-1">${this.getStatusText(projeto.status)}</p>
                        </div>
                        <i class="fas fa-flag text-4xl text-blue-200"></i>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-green-100 text-sm font-medium uppercase tracking-wide">Potência</p>
                            <p class="text-2xl font-bold mt-1">${projeto.potencia_kwp || 'N/A'} kWp</p>
                        </div>
                        <i class="fas fa-bolt text-4xl text-green-200"></i>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-green-100 text-sm font-medium uppercase tracking-wide">Investimento</p>
                            <p class="text-xl font-bold mt-1">R$ ${(projeto.valor_investimento || 0).toLocaleString('pt-BR')}</p>
                        </div>
                        <i class="fas fa-dollar-sign text-4xl text-green-200"></i>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-orange-100 text-sm font-medium uppercase tracking-wide">Economia</p>
                            <p class="text-xl font-bold mt-1">R$ ${(projeto.economia_mensal || 0).toLocaleString('pt-BR')}</p>
                        </div>
                        <i class="fas fa-piggy-bank text-4xl text-orange-200"></i>
                    </div>
                </div>
            </div>

            <!-- Informações Detalhadas -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <!-- Dados do Cliente -->
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <i class="fas fa-user text-blue-600 mr-3"></i>
                        Informações do Cliente
                    </h3>
                    <div class="space-y-4">
                        ${this.renderInfoItem('Nome', cliente?.nome || 'N/A')}
                        ${this.renderInfoItem('E-mail', cliente?.email || 'N/A')}
                        ${this.renderInfoItem('Telefone', cliente?.telefone || 'N/A')}
                        ${this.renderInfoItem('Cidade', `${cliente?.cidade || 'N/A'}, ${cliente?.estado || 'N/A'}`)}
                        ${this.renderInfoItem('Tipo', this.formatTipoCliente(cliente?.tipo_cliente))}
                        ${this.renderInfoItem('Consumo Médio', `${cliente?.consumo_mensal || 'N/A'} kWh/mês`)}
                    </div>
                </div>

                <!-- Dados Técnicos -->
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <i class="fas fa-cog text-green-600 mr-3"></i>
                        Especificações Técnicas
                    </h3>
                    <div class="space-y-4">
                        ${this.renderInfoItem('Potência Instalada', `${projeto.potencia_kwp || 'N/A'} kWp`)}
                        ${this.renderInfoItem('Geração Estimada', `${projeto.geracao_estimada || 'N/A'} kWh/mês`)}
                        ${this.renderInfoItem('Economia Mensal', `R$ ${(projeto.economia_mensal || 0).toLocaleString('pt-BR')}`)}
                        ${this.renderInfoItem('Payback', `${projeto.payback_meses || 'N/A'} meses`)}
                        ${this.renderInfoItem('Tipo de Instalação', projeto.tipo_instalacao || 'N/A')}
                        ${this.renderInfoItem('Responsável', projeto.responsavel || 'N/A')}
                    </div>
                </div>
            </div>

            ${projeto.lista_materiais ? `
            <!-- Lista de Materiais -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 mb-8">
                <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <i class="fas fa-list text-orange-600 mr-3"></i>
                    Lista de Materiais
                </h3>
                <div class="bg-white rounded-xl p-6 border border-blue-200">
                    <pre class="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">${projeto.lista_materiais}</pre>
                </div>
            </div>
            ` : ''}

            ${projeto.observacoes ? `
            <!-- Observações -->
            <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 mb-8">
                <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <i class="fas fa-sticky-note text-yellow-600 mr-3"></i>
                    Observações do Projeto
                </h3>
                <div class="bg-white rounded-xl p-6 border border-yellow-200">
                    <p class="text-gray-700 leading-relaxed">${projeto.observacoes}</p>
                </div>
            </div>
            ` : ''}

            <!-- Cronograma -->
            ${projeto.data_prevista_instalacao ? `
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <i class="fas fa-calendar-alt text-blue-600 mr-3"></i>
                    Cronograma
                </h3>
                <div class="bg-white rounded-xl p-6 border border-blue-200">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${this.renderInfoItem('Data de Criação', projeto.created_at ? new Date(projeto.created_at).toLocaleDateString('pt-BR') : 'N/A')}
                        ${this.renderInfoItem('Instalação Prevista', new Date(projeto.data_prevista_instalacao).toLocaleDateString('pt-BR'))}
                    </div>
                </div>
            </div>
            ` : ''}
        `;
    }

    /**
     * Renderiza item de informação
     */
    renderInfoItem(label, value) {
        return `
            <div class="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                <span class="text-gray-600 font-medium">${label}:</span>
                <span class="font-semibold text-gray-900">${value}</span>
            </div>
        `;
    }

    /**
     * Gera PDF do projeto
     */
    async generateProjectPDF(projetoId) {
        try {
            console.log('📄 Iniciando geração de PDF para projeto:', projetoId);
            
            this.showNotification('Gerando PDF profissional...', 'info');
            
            const projeto = await api.getProjeto(projetoId);
            if (!projeto) {
                throw new Error('Projeto não encontrado');
            }

            const cliente = await api.getCliente(projeto.cliente_id);
            
            // Chama o novo gerador de PDF V5
            if (window.PropostaGeneratorV5) {
                const generator = new PropostaGeneratorV5();
                await generator.gerarPropostaPremium(projeto, cliente);
                this.showNotification('PDF gerado com sucesso!', 'success');
            } else {
                throw new Error('Gerador de PDF V5 não está disponível');
            }

        } catch (error) {
            console.error('❌ Erro ao gerar PDF:', error);
            this.showNotification(`Erro ao gerar PDF: ${error.message}`, 'error');
        }
    }

    /**
     * Métodos auxiliares
     */
    getStatusText(status) {
        const statusMap = {
            'analise': 'Análise',
            'perdida': 'Perdida', 
            'ganha': 'Ganha'
        };
        return statusMap[status] || 'Status Desconhecido';
    }

    formatTipoCliente(tipo) {
        const tipos = {
            'residencial': 'Residencial',
            'comercial': 'Comercial',
            'industrial': 'Industrial',
            'rural': 'Rural'
        };
        return tipos[tipo] || 'Não informado';
    }

    setViewMode(mode) {
        console.log('📊 Modo de visualização:', mode);
        
        // Atualizar botões ativos
        const gridBtn = document.getElementById('viewModeGrid');
        const listBtn = document.getElementById('viewModeList');
        
        if (mode === 'grid') {
            gridBtn?.classList.add('bg-blue-100', 'text-blue-600');
            gridBtn?.classList.remove('bg-gray-100', 'text-gray-600');
            listBtn?.classList.add('bg-gray-100', 'text-gray-600');
            listBtn?.classList.remove('bg-blue-100', 'text-blue-600');
        } else {
            listBtn?.classList.add('bg-blue-100', 'text-blue-600');
            listBtn?.classList.remove('bg-gray-100', 'text-gray-600');
            gridBtn?.classList.add('bg-gray-100', 'text-gray-600');
            gridBtn?.classList.remove('bg-blue-100', 'text-blue-600');
        }
        
        // Recarregar projetos com o novo modo
        this.currentViewMode = mode;
        this.loadProjetosData();
    }

    clearFilters() {
        this.searchTerm = '';
        this.filterStatus = '';
        this.sortBy = 'created_at';
        this.sortOrder = 'desc';
        this.currentPage = 1;

        // Reset form values
        const searchInput = document.getElementById('searchProjetos');
        const statusFilter = document.getElementById('filterStatusProjetos');
        const sortSelect = document.getElementById('sortProjetos');

        if (searchInput) searchInput.value = '';
        if (statusFilter) statusFilter.value = '';
        if (sortSelect) sortSelect.value = 'created_at';

        this.loadProjetosData();
        this.showNotification('Filtros limpos', 'info');
    }

    updatePagination(totalItems) {
        const showingFrom = document.getElementById('showingFromProjetos');
        const showingTo = document.getElementById('showingToProjetos');
        const totalElement = document.getElementById('totalProjetos');

        if (showingFrom) showingFrom.textContent = totalItems > 0 ? 1 : 0;
        if (showingTo) showingTo.textContent = Math.min(this.itemsPerPage, totalItems);
        if (totalElement) totalElement.textContent = totalItems;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Sistema de notificações moderno
     */
    showNotification(message, type = 'info') {
        // Remove notificação existente
        const existing = document.getElementById('modernNotification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'modernNotification';
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
}

// Inicializar o sistema
const projetosManager = new ProjetosManager();
window.projetosManager = projetosManager;

console.log('✅ Sistema de Projetos v2.0 carregado com sucesso');