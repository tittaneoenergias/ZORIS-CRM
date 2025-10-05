// Interações Management for LURIX CRM
class InteracoesManager {
    constructor() {
        this.currentInteracoes = [];
        this.currentPage = 1;
        this.itemsPerPage = 15;
        this.viewMode = 'list'; // 'list' ou 'blocks'
    }

    async loadInteracoes() {
        const content = `
            <div class="fade-in">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Interações</h1>
                        <p class="text-gray-600 mt-2">Histórico de contatos e negociações</p>
                    </div>
                    <button id="addInteracaoBtn" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center">
                        <i class="fas fa-plus mr-2"></i>
                        Nova Interação
                    </button>
                </div>

                <!-- Filters -->
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                            <input type="text" id="searchInteracoes" placeholder="Título, cliente ou projeto..." 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                            <select id="filterTipo" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Todos</option>
                                <option value="ligacao">Ligação</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="email">E-mail</option>
                                <option value="reuniao">Reunião</option>
                                <option value="visita">Visita</option>
                                <option value="proposta">Proposta</option>
                                <option value="negociacao">Negociação</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                            <select id="filterCliente" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Todos os clientes</option>
                            </select>
                        </div>
                        <div class="flex items-end">
                            <button id="clearFilters" class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200">
                                Limpar Filtros
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Timeline -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div class="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h3 class="text-lg font-semibold text-gray-900">Linha do Tempo</h3>
                        <div class="flex rounded-lg border border-gray-300 overflow-hidden">
                            <button id="viewModeList" onclick="interacoesManager.setViewMode('list')" 
                                class="view-mode-btn px-3 py-1 text-sm bg-blue-600 text-white transition duration-200 hover:bg-blue-700">
                                <i class="fas fa-list mr-1"></i>Lista
                            </button>
                            <button id="viewModeBlocks" onclick="interacoesManager.setViewMode('blocks')" 
                                class="view-mode-btn px-3 py-1 text-sm bg-gray-100 text-gray-600 transition duration-200 hover:bg-gray-200">
                                <i class="fas fa-th-large mr-1"></i>Blocos
                            </button>
                        </div>
                        
                        <style>
                        .line-clamp-2 {
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        }
                        .line-clamp-3 {
                            display: -webkit-box;
                            -webkit-line-clamp: 3;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        }
                        .view-mode-btn:hover {
                            transform: translateY(-1px);
                        }
                        </style>
                    </div>
                    
                    <div class="p-6">
                        <div id="interacoesTimeline" class="relative">
                            <!-- Timeline items will be loaded here -->
                        </div>
                        
                        <!-- Load More Button -->
                        <div class="text-center mt-6">
                            <button id="loadMoreInteracoes" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200">
                                Carregar Mais
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Interação Modal -->
            <div id="interacaoModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <h2 id="interacaoModalTitle" class="text-2xl font-bold text-gray-900">Nova Interação</h2>
                        <button id="closeInteracaoModal" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <form id="interacaoForm" class="p-6">
                        <input type="hidden" id="interacaoId">
                        
                        <!-- Informações Básicas -->
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Informações da Interação</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                                    <input type="text" id="interacaoTitulo" required 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                                    <select id="interacaoTipo" required 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Selecione...</option>
                                        <option value="ligacao">Ligação</option>
                                        <option value="whatsapp">WhatsApp</option>
                                        <option value="email">E-mail</option>
                                        <option value="reuniao">Reunião</option>
                                        <option value="visita">Visita</option>
                                        <option value="proposta">Proposta</option>
                                        <option value="negociacao">Negociação</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Data e Hora *</label>
                                    <input type="datetime-local" id="interacaoDataHora" required 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
                                    <select id="interacaoCliente" required 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Selecione um cliente...</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Projeto (Opcional)</label>
                                    <select id="interacaoProjeto" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Selecione um projeto...</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Detalhes da Interação -->
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Detalhes</h3>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
                                <textarea id="interacaoDescricao" rows="5" required 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Descreva a interação com o cliente..."></textarea>
                            </div>
                        </div>

                        <!-- Informações Comerciais -->
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Informações Comerciais (Opcional)</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Valor Negociado (R$)</label>
                                    <input type="number" id="interacaoValorNegociado" step="0.01"
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: 25000.00">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                                    <input type="text" id="interacaoResponsavel" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Nome do responsável">
                                </div>
                            </div>
                        </div>

                        <!-- Próximos Passos -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Próximos Passos</label>
                            <textarea id="interacaoProximosPassos" rows="3" 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Defina os próximos passos definidos nesta interação..."></textarea>
                        </div>

                        <!-- Modal Footer -->
                        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button type="button" id="cancelInteracaoModal" 
                                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200">
                                Cancelar
                            </button>
                            <button type="submit" 
                                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                                Salvar Interação
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('pageContent').innerHTML = content;
        this.initializeEventListeners();
        await this.loadClientesAndProjetos();
        await this.loadInteracoesData();
    }

    initializeEventListeners() {
        // Add new interação button
        document.getElementById('addInteracaoBtn').addEventListener('click', () => {
            this.openInteracaoModal();
        });

        // Search and filters
        document.getElementById('searchInteracoes').addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.currentPage = 1; // Reset to first page
            this.loadInteracoesData();
        });

        ['filterTipo', 'filterCliente'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.currentPage = 1; // Reset to first page
                this.loadInteracoesData();
            });
        });

        document.getElementById('clearFilters').addEventListener('click', () => {
            document.getElementById('searchInteracoes').value = '';
            document.getElementById('filterTipo').value = '';
            document.getElementById('filterCliente').value = '';
            this.searchTerm = '';
            this.currentPage = 1;
            this.loadInteracoesData();
        });

        // Load more button
        document.getElementById('loadMoreInteracoes').addEventListener('click', () => {
            this.currentPage++;
            this.loadInteracoesData(true); // Append mode
        });

        // Modal handlers
        ['closeInteracaoModal', 'cancelInteracaoModal'].forEach(id => {
            document.getElementById(id).addEventListener('click', () => {
                this.closeInteracaoModal();
            });
        });

        // Form submission
        document.getElementById('interacaoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveInteracao();
        });

        // Set current date/time as default
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById('interacaoDataHora').value = now.toISOString().slice(0, 16);
    }

    async loadInteracoesData(append = false) {
        try {
            const response = await api.getInteracoes(this.currentPage, this.itemsPerPage);
            let interacoes = response.data || [];

            // Apply filters
            const tipoFilter = document.getElementById('filterTipo')?.value;
            const clienteFilter = document.getElementById('filterCliente')?.value;
            const searchTerm = document.getElementById('searchInteracoes')?.value || '';

            if (tipoFilter) {
                interacoes = interacoes.filter(i => i.tipo === tipoFilter);
            }
            if (clienteFilter) {
                interacoes = interacoes.filter(i => i.cliente_id === clienteFilter);
            }
            if (searchTerm) {
                interacoes = interacoes.filter(i => 
                    i.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    i.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Sort by date (most recent first)
            interacoes.sort((a, b) => new Date(b.data_interacao) - new Date(a.data_interacao));

            if (append) {
                this.currentInteracoes = [...this.currentInteracoes, ...interacoes];
            } else {
                this.currentInteracoes = interacoes;
            }

            await this.renderInteracoesTimeline(append);
            this.updateLoadMoreButton(interacoes.length);

        } catch (error) {
            console.error('Erro ao carregar interações:', error);
        }
    }

    async loadClientesAndProjetos() {
        try {
            const [clientesResponse, projetosResponse] = await Promise.all([
                api.getClientes(1, 1000),
                api.getProjetos(1, 1000)
            ]);

            const clientes = clientesResponse.data || [];
            const projetos = projetosResponse.data || [];

            // Populate cliente selects
            ['interacaoCliente', 'filterCliente'].forEach(selectId => {
                const select = document.getElementById(selectId);
                const defaultOption = selectId === 'filterCliente' ? 
                    '<option value="">Todos os clientes</option>' : 
                    '<option value="">Selecione um cliente...</option>';
                
                select.innerHTML = defaultOption;
                
                clientes.forEach(cliente => {
                    select.innerHTML += `<option value="${cliente.id}">${cliente.nome}</option>`;
                });
            });

            // Populate projeto select
            const projetoSelect = document.getElementById('interacaoProjeto');
            projetoSelect.innerHTML = '<option value="">Selecione um projeto...</option>';
            projetos.forEach(projeto => {
                projetoSelect.innerHTML += `<option value="${projeto.id}">${projeto.nome}</option>`;
            });

            // Store for later use
            this.clientes = clientes;
            this.projetos = projetos;

        } catch (error) {
            console.error('Erro ao carregar clientes e projetos:', error);
        }
    }

    async renderInteracoesTimeline(append = false) {
        const container = document.getElementById('interacoesTimeline');
        
        if (!append) {
            container.innerHTML = '';
        }

        if (this.currentInteracoes.length === 0 && !append) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-comments text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-medium text-gray-900 mb-2">Nenhuma interação encontrada</h3>
                    <p class="text-gray-500">Registre a primeira interação com seus clientes</p>
                </div>
            `;
            return;
        }

        // Load cliente names for interactions
        const clienteIds = [...new Set(this.currentInteracoes.map(i => i.cliente_id))];
        const clientesPromises = clienteIds.map(id => api.getCliente(id).catch(() => null));
        const clientes = await Promise.all(clientesPromises);
        const clientesMap = {};
        clientes.forEach(cliente => {
            if (cliente) clientesMap[cliente.id] = cliente;
        });

        // Load projeto names if needed
        const projetoIds = [...new Set(this.currentInteracoes.map(i => i.projeto_id).filter(Boolean))];
        const projetosPromises = projetoIds.map(id => api.getProjeto(id).catch(() => null));
        const projetos = await Promise.all(projetosPromises);
        const projetosMap = {};
        projetos.forEach(projeto => {
            if (projeto) projetosMap[projeto.id] = projeto;
        });

        const startIndex = append ? container.children.length : 0;
        const interacoesToRender = this.currentInteracoes.slice(startIndex);

        const timelineHTML = interacoesToRender.map((interacao, index) => {
            const cliente = clientesMap[interacao.cliente_id];
            const projeto = projetosMap[interacao.projeto_id];
            const isLast = (startIndex + index) === (this.currentInteracoes.length - 1);
            
            if (this.viewMode === 'blocks') {
                return this.renderInteracaoBlock(interacao, cliente, projeto);
            }
            
            return `
                <div class="relative ${!isLast ? 'pb-8' : ''}">
                    <!-- Timeline line -->
                    ${!isLast ? '<div class="absolute left-6 top-12 w-px h-full bg-gray-200"></div>' : ''}
                    
                    <!-- Timeline item -->
                    <div class="relative flex items-start space-x-4">
                        <!-- Icon -->
                        <div class="flex-shrink-0 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center ${this.getInteractionColor(interacao.tipo)}">
                            <i class="fas fa-${this.getInteractionIcon(interacao.tipo)} text-white"></i>
                        </div>
                        
                        <!-- Content -->
                        <div class="flex-1 min-w-0 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center space-x-2 mb-2">
                                        <h4 class="text-lg font-semibold text-gray-900">${interacao.titulo}</h4>
                                        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${this.getTipoColors(interacao.tipo)}">
                                            ${this.formatTipo(interacao.tipo)}
                                        </span>
                                    </div>
                                    
                                    <div class="text-sm text-gray-600 mb-3">
                                        <div class="flex items-center space-x-4 mb-1">
                                            <span><i class="fas fa-user mr-1"></i>${cliente ? cliente.nome : 'Cliente não encontrado'}</span>
                                            <span><i class="fas fa-calendar mr-1"></i>${api.formatDateTime(interacao.data_interacao)}</span>
                                        </div>
                                        ${projeto ? `<div><i class="fas fa-project-diagram mr-1"></i>Projeto: ${projeto.nome}</div>` : ''}
                                        ${interacao.usuario_responsavel ? `<div><i class="fas fa-user-tie mr-1"></i>Responsável: ${interacao.usuario_responsavel}</div>` : ''}
                                    </div>
                                    
                                    <div class="text-gray-800 mb-3">
                                        ${interacao.descricao}
                                    </div>
                                    
                                    ${interacao.valor_negociado ? `
                                        <div class="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-2">
                                            <i class="fas fa-dollar-sign mr-1"></i>
                                            ${api.formatCurrency(interacao.valor_negociado)}
                                        </div>
                                    ` : ''}
                                    
                                    ${interacao.proximos_passos ? `
                                        <div class="mt-3 p-3 bg-blue-50 rounded-lg">
                                            <div class="text-sm font-medium text-blue-900 mb-1">Próximos Passos:</div>
                                            <div class="text-sm text-blue-800">${interacao.proximos_passos}</div>
                                        </div>
                                    ` : ''}
                                </div>
                                
                                <!-- Actions -->
                                <div class="flex space-x-2 ml-4">
                                    <button onclick="interacoesManager.editInteracao('${interacao.id}')" 
                                        class="text-indigo-600 hover:text-indigo-900" title="Editar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="interacoesManager.deleteInteracao('${interacao.id}')" 
                                        class="text-red-600 hover:text-red-900" title="Excluir">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Alterar a classe do container baseado no modo de visualização
        if (this.viewMode === 'blocks') {
            container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
        } else {
            container.className = 'relative';
        }

        if (append) {
            container.insertAdjacentHTML('beforeend', timelineHTML);
        } else {
            container.innerHTML = timelineHTML;
        }
    }

    updateLoadMoreButton(currentBatchSize) {
        const loadMoreBtn = document.getElementById('loadMoreInteracoes');
        if (currentBatchSize < this.itemsPerPage) {
            loadMoreBtn.style.display = 'none'; // No more items to load
        } else {
            loadMoreBtn.style.display = 'inline-block';
        }
    }

    openInteracaoModal(interacao = null) {
        const modal = document.getElementById('interacaoModal');
        const title = document.getElementById('interacaoModalTitle');
        
        if (interacao) {
            title.textContent = 'Editar Interação';
            this.populateForm(interacao);
        } else {
            title.textContent = 'Nova Interação';
            this.clearForm();
            // Set current user as default responsible
            const currentUser = auth.getCurrentUser();
            if (currentUser) {
                document.getElementById('interacaoResponsavel').value = currentUser.nome;
            }
        }
        
        modal.classList.remove('hidden');
    }

    closeInteracaoModal() {
        document.getElementById('interacaoModal').classList.add('hidden');
        this.clearForm();
    }

    populateForm(interacao) {
        document.getElementById('interacaoId').value = interacao.id || '';
        document.getElementById('interacaoTitulo').value = interacao.titulo || '';
        document.getElementById('interacaoTipo').value = interacao.tipo || '';
        document.getElementById('interacaoCliente').value = interacao.cliente_id || '';
        document.getElementById('interacaoProjeto').value = interacao.projeto_id || '';
        document.getElementById('interacaoDescricao').value = interacao.descricao || '';
        document.getElementById('interacaoValorNegociado').value = interacao.valor_negociado || '';
        document.getElementById('interacaoResponsavel').value = interacao.usuario_responsavel || '';
        document.getElementById('interacaoProximosPassos').value = interacao.proximos_passos || '';
        
        if (interacao.data_interacao) {
            const dataInteracao = new Date(interacao.data_interacao);
            document.getElementById('interacaoDataHora').value = dataInteracao.toISOString().slice(0, 16);
        }
    }

    clearForm() {
        document.getElementById('interacaoForm').reset();
        document.getElementById('interacaoId').value = '';
        
        // Reset to current date/time
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById('interacaoDataHora').value = now.toISOString().slice(0, 16);
    }

    async saveInteracao() {
        try {
            const formData = {
                titulo: document.getElementById('interacaoTitulo').value,
                tipo: document.getElementById('interacaoTipo').value,
                cliente_id: document.getElementById('interacaoCliente').value,
                projeto_id: document.getElementById('interacaoProjeto').value,
                descricao: document.getElementById('interacaoDescricao').value,
                data_interacao: new Date(document.getElementById('interacaoDataHora').value).toISOString(),
                usuario_responsavel: document.getElementById('interacaoResponsavel').value,
                valor_negociado: parseFloat(document.getElementById('interacaoValorNegociado').value) || null,
                proximos_passos: document.getElementById('interacaoProximosPassos').value
            };

            const interacaoId = document.getElementById('interacaoId').value;

            if (interacaoId) {
                await api.updateInteracao(interacaoId, formData);
            } else {
                formData.id = api.generateId();
                await api.createInteracao(formData);
            }

            this.closeInteracaoModal();
            this.currentPage = 1; // Reset to first page to see the new/updated interaction
            await this.loadInteracoesData();
            
            this.showNotification('Interação salva com sucesso!', 'success');

        } catch (error) {
            console.error('Erro ao salvar interação:', error);
            this.showNotification('Erro ao salvar interação', 'error');
        }
    }

    async editInteracao(interacaoId) {
        try {
            const interacao = await api.getInteracao(interacaoId);
            this.openInteracaoModal(interacao);
        } catch (error) {
            console.error('Erro ao buscar interação:', error);
        }
    }

    async deleteInteracao(interacaoId) {
        if (confirm('Tem certeza que deseja excluir esta interação?')) {
            try {
                await api.deleteInteracao(interacaoId);
                this.currentPage = 1;
                await this.loadInteracoesData();
                this.showNotification('Interação excluída com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao excluir interação:', error);
                this.showNotification('Erro ao excluir interação', 'error');
            }
        }
    }

    getInteractionIcon(tipo) {
        const icons = {
            'ligacao': 'phone',
            'whatsapp': 'whatsapp',
            'email': 'envelope',
            'reuniao': 'handshake',
            'visita': 'map-marker-alt',
            'proposta': 'file-alt',
            'negociacao': 'dollar-sign'
        };
        return icons[tipo] || 'comment';
    }

    getInteractionColor(tipo) {
        const colors = {
            'ligacao': 'bg-blue-500',
            'whatsapp': 'bg-green-500',
            'email': 'bg-purple-500',
            'reuniao': 'bg-indigo-500',
            'visita': 'bg-orange-500',
            'proposta': 'bg-yellow-500',
            'negociacao': 'bg-emerald-500'
        };
        return colors[tipo] || 'bg-gray-500';
    }

    getTipoColors(tipo) {
        const colors = {
            'ligacao': 'bg-blue-100 text-blue-800',
            'whatsapp': 'bg-green-100 text-green-800',
            'email': 'bg-purple-100 text-purple-800',
            'reuniao': 'bg-indigo-100 text-indigo-800',
            'visita': 'bg-orange-100 text-orange-800',
            'proposta': 'bg-yellow-100 text-yellow-800',
            'negociacao': 'bg-emerald-100 text-emerald-800'
        };
        return colors[tipo] || 'bg-gray-100 text-gray-800';
    }

    formatTipo(tipo) {
        const tipos = {
            'ligacao': 'Ligação',
            'whatsapp': 'WhatsApp',
            'email': 'E-mail',
            'reuniao': 'Reunião',
            'visita': 'Visita',
            'proposta': 'Proposta',
            'negociacao': 'Negociação'
        };
        return tipos[tipo] || tipo;
    }

    /**
     * Renderiza interação no modo bloco
     */
    renderInteracaoBlock(interacao, cliente, projeto) {
        return `
            <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 ${this.getInteractionColor(interacao.tipo)} rounded-full flex items-center justify-center">
                            <i class="fas fa-${this.getInteractionIcon(interacao.tipo)} text-white text-sm"></i>
                        </div>
                        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${this.getTipoColors(interacao.tipo)}">
                            ${this.formatTipo(interacao.tipo)}
                        </span>
                    </div>
                    <div class="flex space-x-1">
                        <button onclick="interacoesManager.editInteracao('${interacao.id}')" 
                            class="text-indigo-600 hover:text-indigo-900 text-sm" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="interacoesManager.deleteInteracao('${interacao.id}')" 
                            class="text-red-600 hover:text-red-900 text-sm" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <h4 class="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">${interacao.titulo}</h4>
                
                <div class="text-xs text-gray-600 space-y-1 mb-3">
                    <div><i class="fas fa-user mr-1"></i>${cliente ? cliente.nome : 'Cliente não encontrado'}</div>
                    <div><i class="fas fa-calendar mr-1"></i>${api.formatDateTime(interacao.data_interacao)}</div>
                    ${projeto ? `<div><i class="fas fa-project-diagram mr-1"></i>${projeto.nome}</div>` : ''}
                </div>
                
                <div class="text-xs text-gray-800 mb-3 line-clamp-3">
                    ${interacao.descricao}
                </div>
                
                ${interacao.valor_negociado ? `
                    <div class="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        <i class="fas fa-dollar-sign mr-1"></i>
                        ${api.formatCurrency(interacao.valor_negociado)}
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Define o modo de visualização
     */
    setViewMode(mode) {
        this.viewMode = mode;
        
        // Atualizar aparência dos botões
        document.getElementById('viewModeList').className = mode === 'list' ? 
            'view-mode-btn px-3 py-1 text-sm bg-blue-600 text-white' :
            'view-mode-btn px-3 py-1 text-sm bg-gray-100 text-gray-600';
            
        document.getElementById('viewModeBlocks').className = mode === 'blocks' ? 
            'view-mode-btn px-3 py-1 text-sm bg-blue-600 text-white' :
            'view-mode-btn px-3 py-1 text-sm bg-gray-100 text-gray-600';
        
        // Recarregar as interações com o novo modo
        this.loadInteracoesData();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Global interações manager instance
window.interacoesManager = new InteracoesManager();