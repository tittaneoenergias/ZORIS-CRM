/**
 * LURIX CRM - Gerenciador de Clientes v4.0
 * Sistema completo com projetos avançados, BOM editável, cálculos automáticos
 * Inclui reset de portfólio e interface compacta
 */

class ClientesManagerV4 {
    constructor() {
        this.currentClienteId = null;
        this.currentProjeto = null;
        this.concessionarias = [];
        this.loadConcessionarias();
    }

    /**
     * Carrega lista de concessionárias
     */
    async loadConcessionarias() {
        try {
            this.concessionarias = await window.zorixStorage.getConcessionarias();
        } catch (error) {
            console.error('Erro ao carregar concessionárias:', error);
        }
    }

    /**
     * Renderiza interface principal
     */
    async renderizar() {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        const clientes = window.zorixStorage.listClientes();
        const projetos = window.zorixStorage.listProjetos();

        pageContent.innerHTML = `
            <div class="max-w-7xl mx-auto">
                <!-- Header com controles -->
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestão de Clientes</h1>
                        <p class="text-gray-600">${clientes.length} cliente(s) • ${projetos.length} projeto(s)</p>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="clientesV4.resetPortfolio()" 
                            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2">
                            <i class="fas fa-trash"></i>
                            Zerar Projetos
                        </button>
                        <button onclick="clientesV4.abrirModalCliente()" 
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2">
                            <i class="fas fa-plus"></i>
                            Novo Cliente
                        </button>
                    </div>
                </div>

                <!-- Lista de clientes compacta -->
                <div class="grid gap-4">
                    ${this.renderizarListaClientes()}
                </div>

                <!-- Modais -->
                ${this.renderizarModals()}
            </div>
        `;

        // Configurar eventos
        this.configurarEventos();
    }

    /**
     * Lista clientes de forma compacta
     */
    renderizarListaClientes() {
        const clientes = window.zorixStorage.listClientes();
        
        if (clientes.length === 0) {
            return `
                <div class="text-center py-12 bg-white rounded-lg shadow">
                    <i class="fas fa-users text-4xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum cliente cadastrado</h3>
                    <p class="text-gray-500 mb-4">Comece criando seu primeiro cliente</p>
                    <button onclick="clientesV4.abrirModalCliente()" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200">
                        Criar Primeiro Cliente
                    </button>
                </div>
            `;
        }

        return clientes.map(cliente => this.renderizarCardCliente(cliente)).join('');
    }

    /**
     * Card compacto do cliente
     */
    renderizarCardCliente(cliente) {
        const projetos = window.zorixStorage.listProjetosByCliente(cliente.id);
        const projetosFinalizados = projetos.filter(p => p.status === 'FINALIZADO').length;

        return `
            <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                <!-- Header compacto -->
                <div class="p-4 border-b border-gray-200 cursor-pointer" onclick="clientesV4.toggleClienteDetalhes('${cliente.id}')">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-user text-blue-600"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">${cliente.nome}</h3>
                                <p class="text-sm text-gray-500">${cliente.email} • ${cliente.telefone}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-center">
                                <div class="text-lg font-bold text-blue-600">${projetos.length}</div>
                                <div class="text-xs text-gray-500">Projetos</div>
                            </div>
                            <div class="text-center">
                                <div class="text-lg font-bold text-green-600">${projetosFinalizados}</div>
                                <div class="text-xs text-gray-500">Finalizados</div>
                            </div>
                            <i class="fas fa-chevron-down text-gray-400 transform transition-transform" id="chevron-${cliente.id}"></i>
                        </div>
                    </div>
                </div>

                <!-- Detalhes (inicialmente oculto) -->
                <div class="hidden" id="detalhes-${cliente.id}">
                    <div class="p-4">
                        <!-- Informações do cliente -->
                        <div class="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="text-sm font-medium text-gray-700">Nome Completo</label>
                                <p class="text-gray-900">${cliente.nome}</p>
                            </div>
                            <div>
                                <label class="text-sm font-medium text-gray-700">E-mail</label>
                                <p class="text-gray-900">${cliente.email}</p>
                            </div>
                            <div>
                                <label class="text-sm font-medium text-gray-700">Telefone</label>
                                <p class="text-gray-900">${cliente.telefone}</p>
                            </div>
                            <div>
                                <label class="text-sm font-medium text-gray-700">Data de Cadastro</label>
                                <p class="text-gray-900">${new Date(cliente.createdAt).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>

                        <!-- Ações do cliente -->
                        <div class="flex gap-2 mb-4">
                            <button onclick="clientesV4.abrirModalCliente('${cliente.id}')" 
                                class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition duration-200">
                                <i class="fas fa-edit mr-1"></i>Editar Cliente
                            </button>
                            <button onclick="clientesV4.abrirModalProjeto('${cliente.id}')" 
                                class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition duration-200">
                                <i class="fas fa-plus mr-1"></i>Novo Projeto
                            </button>
                        </div>

                        <!-- Lista de projetos -->
                        <div class="border-t pt-4">
                            <h4 class="font-medium text-gray-900 mb-3">Projetos (${projetos.length})</h4>
                            ${this.renderizarProjetosCliente(projetos, cliente.id)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Lista projetos do cliente
     */
    renderizarProjetosCliente(projetos, clienteId) {
        if (projetos.length === 0) {
            return `
                <div class="text-center py-8 bg-gray-50 rounded-lg">
                    <i class="fas fa-solar-panel text-3xl text-gray-300 mb-3"></i>
                    <p class="text-gray-500 mb-3">Nenhum projeto cadastrado</p>
                    <button onclick="clientesV4.abrirModalProjeto('${clienteId}')" 
                        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition duration-200">
                        Criar Primeiro Projeto
                    </button>
                </div>
            `;
        }

        return `
            <div class="grid gap-3">
                ${projetos.map(projeto => this.renderizarCardProjeto(projeto)).join('')}
            </div>
        `;
    }

    /**
     * Card do projeto
     */
    renderizarCardProjeto(projeto) {
        const statusColors = {
            'RASCUNHO': 'bg-yellow-100 text-yellow-800',
            'EM_ANDAMENTO': 'bg-blue-100 text-blue-800',
            'FINALIZADO': 'bg-green-100 text-green-800'
        };

        const kWp = projeto.kWp || 0;
        const precoVenda = projeto.preco_venda_total || 0;

        return `
            <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                    <h5 class="font-medium text-gray-900">${projeto.titulo}</h5>
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${statusColors[projeto.status] || statusColors['RASCUNHO']}">
                        ${projeto.status}
                    </span>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                    <div>
                        <span class="text-gray-500">Potência:</span>
                        <div class="font-medium">${kWp.toFixed(2)} kWp</div>
                    </div>
                    <div>
                        <span class="text-gray-500">Cidade:</span>
                        <div class="font-medium">${projeto.cidade || 'N/A'}</div>
                    </div>
                    <div>
                        <span class="text-gray-500">Preço:</span>
                        <div class="font-medium">R$ ${precoVenda.toLocaleString('pt-BR')}</div>
                    </div>
                    <div>
                        <span class="text-gray-500">Atualizado:</span>
                        <div class="font-medium">${new Date(projeto.updatedAt || projeto.createdAt).toLocaleDateString('pt-BR')}</div>
                    </div>
                </div>

                <div class="flex gap-2">
                    <button onclick="clientesV4.visualizarProjeto('${projeto.id}')" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded transition duration-200">
                        <i class="fas fa-eye mr-1"></i>Ver
                    </button>
                    <button onclick="clientesV4.editarProjeto('${projeto.id}')" 
                        class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 text-xs rounded transition duration-200">
                        <i class="fas fa-edit mr-1"></i>Editar
                    </button>
                    <button onclick="clientesV4.imprimirProjeto('${projeto.id}')" 
                        class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-xs rounded transition duration-200">
                        <i class="fas fa-print mr-1"></i>Imprimir
                    </button>
                    ${projeto.status === 'FINALIZADO' ? `
                        <button onclick="clientesV4.gerarProposta('${projeto.id}')" 
                            class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded transition duration-200">
                            <i class="fas fa-file-pdf mr-1"></i>Gerar Proposta
                        </button>
                    ` : `
                        <button disabled 
                            class="bg-gray-300 text-gray-500 px-3 py-1 text-xs rounded cursor-not-allowed"
                            title="Finalize o projeto para gerar a proposta">
                            <i class="fas fa-lock mr-1"></i>Gerar Proposta
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    /**
     * Toggle detalhes do cliente
     */
    toggleClienteDetalhes(clienteId) {
        const detalhes = document.getElementById(`detalhes-${clienteId}`);
        const chevron = document.getElementById(`chevron-${clienteId}`);
        
        if (detalhes.classList.contains('hidden')) {
            detalhes.classList.remove('hidden');
            chevron.classList.add('rotate-180');
        } else {
            detalhes.classList.add('hidden');
            chevron.classList.remove('rotate-180');
        }
    }

    /**
     * Abre modal do cliente
     */
    abrirModalCliente(clienteId = null) {
        const isEdicao = !!clienteId;
        let cliente = { nome: '', email: '', telefone: '' };
        
        if (isEdicao) {
            cliente = window.zorixStorage.getCliente(clienteId);
            if (!cliente) {
                this.showNotification('Cliente não encontrado', 'error');
                return;
            }
        }

        const modal = document.getElementById('modalCliente');
        modal.classList.remove('hidden');

        document.getElementById('modalClienteTitle').textContent = 
            isEdicao ? 'Editar Cliente' : 'Novo Cliente';
        
        document.getElementById('clienteForm').innerHTML = `
            <div class="grid gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                    <input type="text" id="clienteNome" value="${cliente.nome}" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                    <input type="email" id="clienteEmail" value="${cliente.email}" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                    <input type="tel" id="clienteTelefone" value="${cliente.telefone}" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-6">
                <button onclick="clientesV4.fecharModal('modalCliente')" 
                    class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200">
                    Cancelar
                </button>
                <button onclick="clientesV4.salvarCliente('${clienteId || ''}')" 
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                    ${isEdicao ? 'Salvar Alterações' : 'Criar Cliente'}
                </button>
            </div>
        `;
    }

    /**
     * Salva cliente
     */
    salvarCliente(clienteId = '') {
        try {
            const nome = document.getElementById('clienteNome').value.trim();
            const email = document.getElementById('clienteEmail').value.trim();
            const telefone = document.getElementById('clienteTelefone').value.trim();

            // Validações
            if (!nome || !email || !telefone) {
                this.showNotification('Todos os campos são obrigatórios', 'error');
                return;
            }

            if (!this.validarEmail(email)) {
                this.showNotification('E-mail inválido', 'error');
                return;
            }

            const clienteData = {
                nome,
                email,
                telefone
            };

            // Se é edição, adicionar ID
            if (clienteId) {
                clienteData.id = clienteId;
            }

            const savedId = window.zorixStorage.saveCliente(clienteData);
            
            if (savedId) {
                this.showNotification(
                    clienteId ? 'Cliente atualizado com sucesso' : 'Cliente criado com sucesso',
                    'success'
                );
                this.fecharModal('modalCliente');
                this.renderizar(); // Recarregar interface
            } else {
                this.showNotification('Não foi possível salvar. Tente novamente.', 'error');
            }

        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            this.showNotification('Não foi possível salvar. Tente novamente.', 'error');
        }
    }

    /**
     * Validador de email simples
     */
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Abre modal de projeto
     */
    async abrirModalProjeto(clienteId, projetoId = null) {
        const isEdicao = !!projetoId;
        
        // Verificar se cliente existe
        const cliente = window.zorixStorage.getCliente(clienteId);
        if (!cliente) {
            this.showNotification('Cliente não encontrado', 'error');
            return;
        }

        let projeto = {
            titulo: '',
            cidade: '',
            estado: 'SP',
            concessionaria: '',
            endereco: '',
            modulos: [{ quantidade: 1, descricao_modulo: 'Painel 550W Monocristalino', potencia_modulo_Wp: 550 }],
            inversores: [{ quantidade: 1, descricao_inversor: 'Inversor String 5kW', potencia_inversor_kW: 5.0 }],
            bom: [
                { item: 'Painéis Solares', quantidade: 20, unidade: 'und', preco_unitario: 300, preco_total: 6000 },
                { item: 'Inversor String', quantidade: 1, unidade: 'und', preco_unitario: 2500, preco_total: 2500 },
                { item: 'Estrutura de Fixação', quantidade: 1, unidade: 'kit', preco_unitario: 1200, preco_total: 1200 },
                { item: 'Cabeamento CC', quantidade: 100, unidade: 'm', preco_unitario: 12, preco_total: 1200 },
                { item: 'Proteções e Acessórios', quantidade: 1, unidade: 'kit', preco_unitario: 800, preco_total: 800 }
            ],
            preco_venda_total: 0,
            consumo_medio_kWh_mes: 500,
            fator_sombra_perdas: 0.82,
            status: 'RASCUNHO'
        };
        
        if (isEdicao) {
            const projetoExistente = window.zorixStorage.getProjeto(projetoId);
            if (!projetoExistente) {
                this.showNotification('Projeto não encontrado', 'error');
                return;
            }
            projeto = { ...projeto, ...projetoExistente };
        }

        // Carregar concessionárias se necessário
        if (this.concessionarias.length === 0) {
            await this.loadConcessionarias();
        }

        const modal = document.getElementById('modalProjeto');
        modal.classList.remove('hidden');

        document.getElementById('modalProjetoTitle').textContent = 
            isEdicao ? 'Editar Projeto' : 'Novo Projeto';

        document.getElementById('projetoForm').innerHTML = `
            <div class="grid gap-6">
                <!-- Identificação -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-gray-900 mb-3">📋 Identificação</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Título do Projeto *</label>
                            <input type="text" id="projetoTitulo" value="${projeto.titulo}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                            <input type="text" id="projetoCidade" value="${projeto.cidade}" 
                                onchange="clientesV4.buscarIrradiacao()" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Estado (UF) *</label>
                            <select id="projetoEstado" onchange="clientesV4.buscarIrradiacao()" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="AC" ${projeto.estado === 'AC' ? 'selected' : ''}>AC</option>
                                <option value="AL" ${projeto.estado === 'AL' ? 'selected' : ''}>AL</option>
                                <option value="AP" ${projeto.estado === 'AP' ? 'selected' : ''}>AP</option>
                                <option value="AM" ${projeto.estado === 'AM' ? 'selected' : ''}>AM</option>
                                <option value="BA" ${projeto.estado === 'BA' ? 'selected' : ''}>BA</option>
                                <option value="CE" ${projeto.estado === 'CE' ? 'selected' : ''}>CE</option>
                                <option value="DF" ${projeto.estado === 'DF' ? 'selected' : ''}>DF</option>
                                <option value="ES" ${projeto.estado === 'ES' ? 'selected' : ''}>ES</option>
                                <option value="GO" ${projeto.estado === 'GO' ? 'selected' : ''}>GO</option>
                                <option value="MA" ${projeto.estado === 'MA' ? 'selected' : ''}>MA</option>
                                <option value="MT" ${projeto.estado === 'MT' ? 'selected' : ''}>MT</option>
                                <option value="MS" ${projeto.estado === 'MS' ? 'selected' : ''}>MS</option>
                                <option value="MG" ${projeto.estado === 'MG' ? 'selected' : ''}>MG</option>
                                <option value="PA" ${projeto.estado === 'PA' ? 'selected' : ''}>PA</option>
                                <option value="PB" ${projeto.estado === 'PB' ? 'selected' : ''}>PB</option>
                                <option value="PR" ${projeto.estado === 'PR' ? 'selected' : ''}>PR</option>
                                <option value="PE" ${projeto.estado === 'PE' ? 'selected' : ''}>PE</option>
                                <option value="PI" ${projeto.estado === 'PI' ? 'selected' : ''}>PI</option>
                                <option value="RJ" ${projeto.estado === 'RJ' ? 'selected' : ''}>RJ</option>
                                <option value="RN" ${projeto.estado === 'RN' ? 'selected' : ''}>RN</option>
                                <option value="RS" ${projeto.estado === 'RS' ? 'selected' : ''}>RS</option>
                                <option value="RO" ${projeto.estado === 'RO' ? 'selected' : ''}>RO</option>
                                <option value="RR" ${projeto.estado === 'RR' ? 'selected' : ''}>RR</option>
                                <option value="SC" ${projeto.estado === 'SC' ? 'selected' : ''}>SC</option>
                                <option value="SP" ${projeto.estado === 'SP' ? 'selected' : ''}>SP</option>
                                <option value="SE" ${projeto.estado === 'SE' ? 'selected' : ''}>SE</option>
                                <option value="TO" ${projeto.estado === 'TO' ? 'selected' : ''}>TO</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Concessionária *</label>
                            <select id="projetoConcessionaria" onchange="clientesV4.buscarTarifa()" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Selecione...</option>
                                ${this.concessionarias.map(conc => 
                                    `<option value="${conc}" ${projeto.concessionaria === conc ? 'selected' : ''}>${conc}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Endereço (opcional)</label>
                            <input type="text" id="projetoEndereco" value="${projeto.endereco || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                </div>

                <!-- Dimensionamento -->
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-gray-900 mb-3">⚡ Dimensionamento</h3>
                    
                    <!-- Módulos -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Módulos Fotovoltaicos</label>
                        <div id="modulosList">
                            ${this.renderizarModulos(projeto.modulos || [])}
                        </div>
                        <button type="button" onclick="clientesV4.adicionarModulo()" 
                            class="mt-2 text-blue-600 hover:text-blue-700 text-sm">
                            + Adicionar Módulo
                        </button>
                    </div>

                    <!-- Inversores -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Inversores</label>
                        <div id="inversoresList">
                            ${this.renderizarInversores(projeto.inversores || [])}
                        </div>
                        <button type="button" onclick="clientesV4.adicionarInversor()" 
                            class="mt-2 text-blue-600 hover:text-blue-700 text-sm">
                            + Adicionar Inversor
                        </button>
                    </div>

                    <!-- kWp Calculado -->
                    <div class="bg-white p-3 rounded border">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Potência Total (kWp)</label>
                        <div id="kWpCalculado" class="text-2xl font-bold text-blue-600">0.00 kWp</div>
                    </div>
                </div>

                <!-- BOM Editável -->
                <div class="bg-green-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-gray-900 mb-3">📦 Lista de Materiais (BOM)</h3>
                    <div id="bomTable">
                        ${this.renderizarBOM(projeto.bom || [])}
                    </div>
                    <button type="button" onclick="clientesV4.adicionarItemBOM()" 
                        class="mt-2 text-green-600 hover:text-green-700 text-sm">
                        + Adicionar Item
                    </button>
                </div>

                <!-- Preço de Venda -->
                <div class="bg-yellow-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-gray-900 mb-3">💰 Preço de Venda</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Preço de Venda Total (R$)</label>
                            <input type="number" id="precoVendaTotal" value="${projeto.preco_venda_total || 0}" step="0.01" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500">
                            <p class="text-sm text-gray-500 mt-1">Se deixar em branco, usará a soma da BOM</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Total da BOM</label>
                            <div id="totalBOM" class="text-xl font-bold text-green-600 py-2">R$ 0,00</div>
                        </div>
                    </div>
                </div>

                <!-- Consumo -->
                <div class="bg-purple-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-gray-900 mb-3">📊 Consumo e Performance</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Consumo Médio Mensal (kWh)</label>
                            <input type="number" id="consumoMedio" value="${projeto.consumo_medio_kWh_mes || ''}" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Fator Sombra/Perdas</label>
                            <input type="number" id="fatorSombra" value="${projeto.fator_sombra_perdas || 0.82}" step="0.01" min="0" max="1" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <p class="text-sm text-gray-500 mt-1">Padrão: 0.82 (18% de perdas)</p>
                        </div>
                    </div>
                </div>

                <!-- Status -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-gray-900 mb-3">🏷️ Status do Projeto</h3>
                    <select id="projetoStatus" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                        <option value="RASCUNHO" ${projeto.status === 'RASCUNHO' ? 'selected' : ''}>RASCUNHO</option>
                        <option value="EM_ANDAMENTO" ${projeto.status === 'EM_ANDAMENTO' ? 'selected' : ''}>EM_ANDAMENTO</option>
                        <option value="FINALIZADO" ${projeto.status === 'FINALIZADO' ? 'selected' : ''}>FINALIZADO</option>
                    </select>
                    <p class="text-sm text-gray-500 mt-2">
                        <i class="fas fa-info-circle mr-1"></i>
                        Só é possível gerar proposta quando o status for FINALIZADO
                    </p>
                </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-6">
                <button onclick="clientesV4.fecharModal('modalProjeto')" 
                    class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200">
                    Cancelar
                </button>
                <button onclick="clientesV4.salvarProjeto('${clienteId}', '${projetoId || ''}')" 
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                    ${isEdicao ? 'Salvar Alterações' : 'Criar Projeto'}
                </button>
            </div>
        `;

        // Calcular valores iniciais
        setTimeout(() => {
            this.calcularKWp();
            this.calcularTotalBOM();
        }, 100);
    }

    /**
     * Renderiza lista de módulos
     */
    renderizarModulos(modulos) {
        return modulos.map((modulo, index) => `
            <div class="flex gap-2 items-center mb-2">
                <input type="number" placeholder="Qtd" value="${modulo.quantidade}" 
                    onchange="clientesV4.calcularKWp()" 
                    class="w-20 px-2 py-1 border border-gray-300 rounded text-sm">
                <input type="text" placeholder="Descrição do módulo" value="${modulo.descricao_modulo}" 
                    class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm">
                <input type="number" placeholder="Potência (Wp)" value="${modulo.potencia_modulo_Wp}" step="1" 
                    onchange="clientesV4.calcularKWp()" 
                    class="w-24 px-2 py-1 border border-gray-300 rounded text-sm">
                <button onclick="clientesV4.removerModulo(${index})" 
                    class="text-red-600 hover:text-red-700 p-1">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    /**
     * Renderiza lista de inversores
     */
    renderizarInversores(inversores) {
        return inversores.map((inversor, index) => `
            <div class="flex gap-2 items-center mb-2">
                <input type="number" placeholder="Qtd" value="${inversor.quantidade}" 
                    class="w-20 px-2 py-1 border border-gray-300 rounded text-sm">
                <input type="text" placeholder="Descrição do inversor" value="${inversor.descricao_inversor}" 
                    class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm">
                <input type="number" placeholder="Potência (kW)" value="${inversor.potencia_inversor_kW}" step="0.1" 
                    class="w-24 px-2 py-1 border border-gray-300 rounded text-sm">
                <button onclick="clientesV4.removerInversor(${index})" 
                    class="text-red-600 hover:text-red-700 p-1">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    /**
     * Renderiza BOM
     */
    renderizarBOM(bom) {
        const header = `
            <div class="grid grid-cols-6 gap-2 mb-2 text-sm font-medium text-gray-700">
                <div>Item</div>
                <div>Qtd</div>
                <div>Unidade</div>
                <div>Preço Unit. (R$)</div>
                <div>Total (R$)</div>
                <div>Ação</div>
            </div>
        `;

        const rows = bom.map((item, index) => `
            <div class="grid grid-cols-6 gap-2 mb-2">
                <input type="text" value="${item.item}" 
                    class="px-2 py-1 border border-gray-300 rounded text-sm">
                <input type="number" value="${item.quantidade}" 
                    onchange="clientesV4.calcularTotalBOM()" 
                    class="px-2 py-1 border border-gray-300 rounded text-sm">
                <input type="text" value="${item.unidade}" 
                    class="px-2 py-1 border border-gray-300 rounded text-sm">
                <input type="number" value="${item.preco_unitario}" step="0.01" 
                    onchange="clientesV4.calcularTotalBOM()" 
                    class="px-2 py-1 border border-gray-300 rounded text-sm">
                <div class="px-2 py-1 font-medium text-green-600" id="bomTotal${index}">
                    R$ ${(item.quantidade * item.preco_unitario).toLocaleString('pt-BR')}
                </div>
                <button onclick="clientesV4.removerItemBOM(${index})" 
                    class="text-red-600 hover:text-red-700 p-1">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        return header + rows;
    }

    /**
     * Adiciona novo módulo
     */
    adicionarModulo() {
        const container = document.getElementById('modulosList');
        const index = container.children.length;
        
        const novoModulo = document.createElement('div');
        novoModulo.innerHTML = `
            <div class="flex gap-2 items-center mb-2">
                <input type="number" placeholder="Qtd" value="1" 
                    onchange="clientesV4.calcularKWp()" 
                    class="w-20 px-2 py-1 border border-gray-300 rounded text-sm">
                <input type="text" placeholder="Descrição do módulo" value="Painel 550W Monocristalino" 
                    class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm">
                <input type="number" placeholder="Potência (Wp)" value="550" step="1" 
                    onchange="clientesV4.calcularKWp()" 
                    class="w-24 px-2 py-1 border border-gray-300 rounded text-sm">
                <button onclick="clientesV4.removerModulo(${index})" 
                    class="text-red-600 hover:text-red-700 p-1">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        container.appendChild(novoModulo.firstElementChild);
        this.calcularKWp();
    }

    /**
     * Remove módulo
     */
    removerModulo(index) {
        const container = document.getElementById('modulosList');
        if (container.children.length > 1) {
            container.removeChild(container.children[index]);
            this.calcularKWp();
        }
    }

    /**
     * Adiciona novo inversor
     */
    adicionarInversor() {
        const container = document.getElementById('inversoresList');
        const index = container.children.length;
        
        const novoInversor = document.createElement('div');
        novoInversor.innerHTML = `
            <div class="flex gap-2 items-center mb-2">
                <input type="number" placeholder="Qtd" value="1" 
                    class="w-20 px-2 py-1 border border-gray-300 rounded text-sm">
                <input type="text" placeholder="Descrição do inversor" value="Inversor String 5kW" 
                    class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm">
                <input type="number" placeholder="Potência (kW)" value="5.0" step="0.1" 
                    class="w-24 px-2 py-1 border border-gray-300 rounded text-sm">
                <button onclick="clientesV4.removerInversor(${index})" 
                    class="text-red-600 hover:text-red-700 p-1">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        container.appendChild(novoInversor.firstElementChild);
    }

    /**
     * Remove inversor
     */
    removerInversor(index) {
        const container = document.getElementById('inversoresList');
        if (container.children.length > 1) {
            container.removeChild(container.children[index]);
        }
    }

    /**
     * Adiciona item à BOM
     */
    adicionarItemBOM() {
        const container = document.getElementById('bomTable');
        const index = container.children.length - 1; // -1 porque o header é o primeiro
        
        const novoItem = document.createElement('div');
        novoItem.innerHTML = `
            <div class="grid grid-cols-6 gap-2 mb-2">
                <input type="text" value="Novo Item" 
                    class="px-2 py-1 border border-gray-300 rounded text-sm">
                <input type="number" value="1" 
                    onchange="clientesV4.calcularTotalBOM()" 
                    class="px-2 py-1 border border-gray-300 rounded text-sm">
                <input type="text" value="und" 
                    class="px-2 py-1 border border-gray-300 rounded text-sm">
                <input type="number" value="100" step="0.01" 
                    onchange="clientesV4.calcularTotalBOM()" 
                    class="px-2 py-1 border border-gray-300 rounded text-sm">
                <div class="px-2 py-1 font-medium text-green-600" id="bomTotal${index}">
                    R$ 100,00
                </div>
                <button onclick="clientesV4.removerItemBOM(${index})" 
                    class="text-red-600 hover:text-red-700 p-1">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        container.appendChild(novoItem.firstElementChild);
        this.calcularTotalBOM();
    }

    /**
     * Remove item da BOM
     */
    removerItemBOM(index) {
        const container = document.getElementById('bomTable');
        const actualIndex = index + 1; // +1 porque o header é o primeiro
        if (container.children.length > 2) { // Pelo menos header + 1 item
            container.removeChild(container.children[actualIndex]);
            this.calcularTotalBOM();
        }
    }

    /**
     * Calcula kWp total
     */
    calcularKWp() {
        const modulosContainer = document.getElementById('modulosList');
        if (!modulosContainer) return;

        let kWpTotal = 0;
        
        Array.from(modulosContainer.children).forEach(row => {
            const inputs = row.querySelectorAll('input');
            if (inputs.length >= 3) {
                const quantidade = parseFloat(inputs[0].value) || 0;
                const potencia = parseFloat(inputs[2].value) || 0;
                kWpTotal += (quantidade * potencia / 1000);
            }
        });

        const display = document.getElementById('kWpCalculado');
        if (display) {
            display.textContent = `${kWpTotal.toFixed(2)} kWp`;
        }

        return kWpTotal;
    }

    /**
     * Calcula total da BOM
     */
    calcularTotalBOM() {
        const bomContainer = document.getElementById('bomTable');
        if (!bomContainer) return;

        let totalBOM = 0;
        
        // Pular o header (primeiro child)
        Array.from(bomContainer.children).slice(1).forEach((row, index) => {
            const inputs = row.querySelectorAll('input');
            if (inputs.length >= 4) {
                const quantidade = parseFloat(inputs[1].value) || 0;
                const precoUnit = parseFloat(inputs[3].value) || 0;
                const total = quantidade * precoUnit;
                
                // Atualizar display do total da linha
                const totalDisplay = row.querySelector(`#bomTotal${index}`);
                if (totalDisplay) {
                    totalDisplay.textContent = `R$ ${total.toLocaleString('pt-BR')}`;
                }
                
                totalBOM += total;
            }
        });

        const display = document.getElementById('totalBOM');
        if (display) {
            display.textContent = `R$ ${totalBOM.toLocaleString('pt-BR')}`;
        }

        return totalBOM;
    }

    /**
     * Busca irradiação automaticamente
     */
    async buscarIrradiacao() {
        const cidade = document.getElementById('projetoCidade')?.value;
        const estado = document.getElementById('projetoEstado')?.value;
        
        if (cidade && estado) {
            try {
                const irradiacao = await window.zorixStorage.getIrradiacao(cidade, estado);
                console.log('Irradiação encontrada:', irradiacao);
                // Armazenar para uso posterior nos cálculos
                this.currentIrradiacao = irradiacao;
            } catch (error) {
                console.warn('Erro ao buscar irradiação:', error);
                this.showNotification('Usando valores internos padrão.', 'warning');
            }
        }
    }

    /**
     * Busca tarifa automaticamente
     */
    async buscarTarifa() {
        const concessionaria = document.getElementById('projetoConcessionaria')?.value;
        
        if (concessionaria) {
            try {
                const tarifa = await window.zorixStorage.getTarifa(concessionaria, 'residencial');
                console.log('Tarifa encontrada:', tarifa);
                // Armazenar para uso posterior nos cálculos
                this.currentTarifa = tarifa;
            } catch (error) {
                console.warn('Erro ao buscar tarifa:', error);
                this.showNotification('Usando valores internos padrão.', 'warning');
            }
        }
    }

    /**
     * Salva projeto
     */
    async salvarProjeto(clienteId, projetoId = '') {
        try {
            const titulo = document.getElementById('projetoTitulo').value.trim();
            const cidade = document.getElementById('projetoCidade').value.trim();
            const estado = document.getElementById('projetoEstado').value;
            const concessionaria = document.getElementById('projetoConcessionaria').value;
            const endereco = document.getElementById('projetoEndereco').value.trim();
            const consumoMedio = parseFloat(document.getElementById('consumoMedio').value) || 0;
            const fatorSombra = parseFloat(document.getElementById('fatorSombra').value) || 0.82;
            const precoVendaTotal = parseFloat(document.getElementById('precoVendaTotal').value) || 0;
            const status = document.getElementById('projetoStatus').value;

            // Validações obrigatórias
            if (!titulo || !cidade || !estado || !concessionaria) {
                this.showNotification('Preencha todos os campos obrigatórios', 'error');
                return;
            }

            // Coletar módulos
            const modulosContainer = document.getElementById('modulosList');
            const modulos = [];
            Array.from(modulosContainer.children).forEach(row => {
                const inputs = row.querySelectorAll('input');
                if (inputs.length >= 3) {
                    modulos.push({
                        quantidade: parseFloat(inputs[0].value) || 0,
                        descricao_modulo: inputs[1].value.trim(),
                        potencia_modulo_Wp: parseFloat(inputs[2].value) || 0
                    });
                }
            });

            // Coletar inversores
            const inversoresContainer = document.getElementById('inversoresList');
            const inversores = [];
            Array.from(inversoresContainer.children).forEach(row => {
                const inputs = row.querySelectorAll('input');
                if (inputs.length >= 3) {
                    inversores.push({
                        quantidade: parseFloat(inputs[0].value) || 0,
                        descricao_inversor: inputs[1].value.trim(),
                        potencia_inversor_kW: parseFloat(inputs[2].value) || 0
                    });
                }
            });

            // Coletar BOM
            const bomContainer = document.getElementById('bomTable');
            const bom = [];
            Array.from(bomContainer.children).slice(1).forEach(row => {
                const inputs = row.querySelectorAll('input');
                if (inputs.length >= 4) {
                    const quantidade = parseFloat(inputs[1].value) || 0;
                    const precoUnitario = parseFloat(inputs[3].value) || 0;
                    bom.push({
                        item: inputs[0].value.trim(),
                        quantidade: quantidade,
                        unidade: inputs[2].value.trim(),
                        preco_unitario: precoUnitario,
                        preco_total: quantidade * precoUnitario
                    });
                }
            });

            // Calcular kWp
            const kWp = window.zorixStorage.calcularKWp(modulos);

            // Buscar irradiação e tarifa se necessário
            let irradiacao = this.currentIrradiacao;
            if (!irradiacao) {
                irradiacao = await window.zorixStorage.getIrradiacao(cidade, estado);
            }

            let tarifa = this.currentTarifa;
            if (!tarifa) {
                tarifa = await window.zorixStorage.getTarifa(concessionaria, 'residencial');
            }

            // Calcular geração mensal
            const geracaoMensal = window.zorixStorage.calcularGeracaoMensal(kWp, irradiacao, fatorSombra);
            
            // Calcular economia e payback
            const geracaoAnual = Object.values(geracaoMensal).reduce((sum, val) => sum + val, 0);
            const economiaAnual = Math.min(consumoMedio * 12, geracaoAnual) * tarifa;
            const paybackAnos = window.zorixStorage.calcularPayback(precoVendaTotal || this.calcularTotalBOM(), economiaAnual);

            // Montar dados do projeto
            const projetoData = {
                clienteId,
                titulo,
                cidade,
                estado,
                concessionaria,
                endereco,
                modulos,
                inversores,
                kWp,
                bom,
                preco_venda_total: precoVendaTotal || this.calcularTotalBOM(),
                consumo_medio_kWh_mes: consumoMedio,
                fator_sombra_perdas: fatorSombra,
                status,
                irradiacao,
                tarifa_kWh: tarifa,
                geracao_mensal: geracaoMensal,
                economia_anual: economiaAnual,
                payback_anos: paybackAnos
            };

            // Se é edição, adicionar ID
            if (projetoId) {
                projetoData.id = projetoId;
            }

            const savedId = window.zorixStorage.saveProjeto(projetoData);
            
            if (savedId) {
                this.showNotification(
                    projetoId ? 'Projeto atualizado com sucesso' : 'Projeto criado com sucesso',
                    'success'
                );
                this.fecharModal('modalProjeto');
                this.renderizar(); // Recarregar interface
            } else {
                this.showNotification('Não foi possível salvar. Tente novamente.', 'error');
            }

        } catch (error) {
            console.error('Erro ao salvar projeto:', error);
            this.showNotification('Não foi possível salvar. Tente novamente.', 'error');
        }
    }

    /**
     * Edita projeto existente
     */
    editarProjeto(projetoId) {
        const projeto = window.zorixStorage.getProjeto(projetoId);
        if (!projeto) {
            this.showNotification('Projeto não encontrado', 'error');
            return;
        }
        
        this.abrirModalProjeto(projeto.clienteId, projetoId);
    }

    /**
     * Visualiza projeto
     */
    visualizarProjeto(projetoId) {
        const projeto = window.zorixStorage.getProjeto(projetoId);
        const cliente = window.zorixStorage.getCliente(projeto.clienteId);
        
        if (!projeto || !cliente) {
            this.showNotification('Projeto ou cliente não encontrado', 'error');
            return;
        }

        const modal = document.getElementById('modalVisualizarProjeto');
        modal.classList.remove('hidden');

        document.getElementById('visualizarProjetoContent').innerHTML = `
            <div class="space-y-6">
                <!-- Header -->
                <div class="text-center border-b pb-4">
                    <h2 class="text-2xl font-bold text-gray-900">${projeto.titulo}</h2>
                    <p class="text-gray-600">Cliente: ${cliente.nome}</p>
                    <span class="inline-block px-3 py-1 text-sm font-medium rounded-full 
                        ${projeto.status === 'FINALIZADO' ? 'bg-green-100 text-green-800' : 
                          projeto.status === 'EM_ANDAMENTO' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}">
                        ${projeto.status}
                    </span>
                </div>

                <!-- Informações Gerais -->
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <h3 class="font-semibold text-gray-900 mb-2">📍 Localização</h3>
                        <p><strong>Cidade:</strong> ${projeto.cidade}, ${projeto.estado}</p>
                        <p><strong>Concessionária:</strong> ${projeto.concessionaria}</p>
                        ${projeto.endereco ? `<p><strong>Endereço:</strong> ${projeto.endereco}</p>` : ''}
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900 mb-2">⚡ Dimensionamento</h3>
                        <p><strong>Potência Total:</strong> ${projeto.kWp?.toFixed(2) || 0} kWp</p>
                        <p><strong>Consumo Médio:</strong> ${projeto.consumo_medio_kWh_mes || 0} kWh/mês</p>
                        <p><strong>Fator de Perdas:</strong> ${((1 - (projeto.fator_sombra_perdas || 0.82)) * 100).toFixed(1)}%</p>
                    </div>
                </div>

                <!-- Módulos -->
                <div>
                    <h3 class="font-semibold text-gray-900 mb-2">📱 Módulos Fotovoltaicos</h3>
                    <div class="bg-gray-50 rounded p-3">
                        ${(projeto.modulos || []).map(m => 
                            `<p>${m.quantidade}x ${m.descricao_modulo} - ${m.potencia_modulo_Wp}Wp</p>`
                        ).join('')}
                    </div>
                </div>

                <!-- Inversores -->
                <div>
                    <h3 class="font-semibold text-gray-900 mb-2">🔌 Inversores</h3>
                    <div class="bg-gray-50 rounded p-3">
                        ${(projeto.inversores || []).map(i => 
                            `<p>${i.quantidade}x ${i.descricao_inversor} - ${i.potencia_inversor_kW}kW</p>`
                        ).join('')}
                    </div>
                </div>

                <!-- BOM -->
                <div>
                    <h3 class="font-semibold text-gray-900 mb-2">📦 Lista de Materiais</h3>
                    <div class="bg-gray-50 rounded p-3">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b">
                                    <th class="text-left">Item</th>
                                    <th class="text-center">Qtd</th>
                                    <th class="text-center">Un.</th>
                                    <th class="text-right">Preço Unit.</th>
                                    <th class="text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(projeto.bom || []).map(item => `
                                    <tr>
                                        <td>${item.item}</td>
                                        <td class="text-center">${item.quantidade}</td>
                                        <td class="text-center">${item.unidade}</td>
                                        <td class="text-right">R$ ${item.preco_unitario.toLocaleString('pt-BR')}</td>
                                        <td class="text-right font-medium">R$ ${item.preco_total.toLocaleString('pt-BR')}</td>
                                    </tr>
                                `).join('')}
                                <tr class="border-t font-bold">
                                    <td colspan="4" class="text-right">TOTAL:</td>
                                    <td class="text-right">R$ ${(projeto.preco_venda_total || 0).toLocaleString('pt-BR')}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Cálculos -->
                ${projeto.geracao_mensal ? `
                    <div>
                        <h3 class="font-semibold text-gray-900 mb-2">📊 Projeções Energéticas</h3>
                        <div class="grid md:grid-cols-3 gap-4 text-center">
                            <div class="bg-blue-50 p-3 rounded">
                                <div class="text-2xl font-bold text-blue-600">
                                    ${Object.values(projeto.geracao_mensal).reduce((sum, val) => sum + val, 0).toFixed(0)}
                                </div>
                                <div class="text-sm text-gray-600">kWh/ano</div>
                            </div>
                            <div class="bg-green-50 p-3 rounded">
                                <div class="text-2xl font-bold text-green-600">
                                    R$ ${(projeto.economia_anual || 0).toLocaleString('pt-BR')}
                                </div>
                                <div class="text-sm text-gray-600">Economia/ano</div>
                            </div>
                            <div class="bg-purple-50 p-3 rounded">
                                <div class="text-2xl font-bold text-purple-600">
                                    ${(projeto.payback_anos || 0).toFixed(1)}
                                </div>
                                <div class="text-sm text-gray-600">Anos (payback)</div>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Imprime projeto
     */
    imprimirProjeto(projetoId) {
        // Abrir visualização e depois imprimir
        this.visualizarProjeto(projetoId);
        
        setTimeout(() => {
            const content = document.getElementById('visualizarProjetoContent').innerHTML;
            const printWindow = window.open('', '_blank');
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Projeto - Impressão</title>
                    <style>
                        @page { size: A4; margin: 12mm; }
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        body { font-family: Arial, sans-serif; font-size: 12px; }
                        .bg-gray-50 { background-color: #f9fafb !important; }
                        .bg-blue-50 { background-color: #eff6ff !important; }
                        .bg-green-50 { background-color: #f0fdf4 !important; }
                        .bg-purple-50 { background-color: #faf5ff !important; }
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #d1d5db; padding: 4px; }
                    </style>
                </head>
                <body>${content}</body>
                </html>
            `);
            
            printWindow.document.close();
            printWindow.print();
        }, 500);
    }

    /**
     * Gera proposta para projeto finalizado
     */
    async gerarProposta(projetoId) {
        const projeto = window.zorixStorage.getProjeto(projetoId);
        const cliente = window.zorixStorage.getCliente(projeto.clienteId);
        
        if (!projeto || !cliente) {
            this.showNotification('Projeto ou cliente não encontrado', 'error');
            return;
        }

        if (projeto.status !== 'FINALIZADO') {
            this.showNotification('Finalize o projeto para gerar a proposta.', 'error');
            return;
        }

        try {
            // Usar o novo gerador de proposta V5 com gráficos e assinatura
            if (window.propostaV5Generator) {
                const numeroProposta = await window.propostaV5Generator.gerarPropostaPremium(projeto, cliente);
                
                // Salvar proposta no sistema
                const proposta = window.zorixStorage.gerarProposta(projetoId);
                
                if (proposta) {
                    this.showNotification(`Proposta ${numeroProposta} gerada com sucesso!`, 'success');
                } else {
                    this.showNotification('Proposta criada, mas não foi salva no sistema', 'warning');
                }
            } else {
                this.showNotification('Gerador de proposta não encontrado', 'error');
            }

        } catch (error) {
            console.error('Erro ao gerar proposta:', error);
            this.showNotification('Não foi possível gerar a proposta. Tente novamente.', 'error');
        }
    }

    /**
     * Reset do portfólio de projetos
     */
    resetPortfolio() {
        if (confirm('⚠️ Tem certeza que deseja zerar todos os projetos?\n\n' +
                   '• Os clientes serão preservados\n' +
                   '• Um backup será criado automaticamente\n' +
                   '• Esta ação não pode ser desfeita')) {
            
            const sucesso = window.zorixStorage.resetPortfolio(true);
            
            if (sucesso) {
                this.showNotification('Projetos zerados com sucesso.', 'success');
                this.renderizar(); // Recarregar interface
            } else {
                this.showNotification('Não foi possível zerar os projetos. Tente novamente.', 'error');
            }
        }
    }

    /**
     * Renderiza todos os modais
     */
    renderizarModals() {
        return `
            <!-- Modal Cliente -->
            <div id="modalCliente" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-lg max-w-lg w-full max-h-96 overflow-y-auto">
                    <div class="flex justify-between items-center p-6 border-b">
                        <h2 id="modalClienteTitle" class="text-xl font-semibold text-gray-900">Novo Cliente</h2>
                        <button onclick="clientesV4.fecharModal('modalCliente')" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div class="p-6" id="clienteForm">
                        <!-- Conteúdo inserido dinamicamente -->
                    </div>
                </div>
            </div>

            <!-- Modal Projeto -->
            <div id="modalProjeto" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
                        <h2 id="modalProjetoTitle" class="text-xl font-semibold text-gray-900">Novo Projeto</h2>
                        <button onclick="clientesV4.fecharModal('modalProjeto')" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div class="p-6" id="projetoForm">
                        <!-- Conteúdo inserido dinamicamente -->
                    </div>
                </div>
            </div>

            <!-- Modal Visualizar Projeto -->
            <div id="modalVisualizarProjeto" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
                        <h2 class="text-xl font-semibold text-gray-900">Visualizar Projeto</h2>
                        <div class="flex gap-2">
                            <button onclick="clientesV4.imprimirProjeto(clientesV4.currentProjeto?.id)" 
                                class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm">
                                <i class="fas fa-print mr-1"></i>Imprimir
                            </button>
                            <button onclick="clientesV4.fecharModal('modalVisualizarProjeto')" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-6" id="visualizarProjetoContent">
                        <!-- Conteúdo inserido dinamicamente -->
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Fecha modal
     */
    fecharModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Configura eventos globais
     */
    configurarEventos() {
        // Fechar modais com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.fecharModal('modalCliente');
                this.fecharModal('modalProjeto');
                this.fecharModal('modalVisualizarProjeto');
            }
        });

        // Fechar modais clicando fora
        ['modalCliente', 'modalProjeto', 'modalVisualizarProjeto'].forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.fecharModal(modalId);
                    }
                });
            }
        });
    }

    /**
     * Sistema de notificações
     */
    showNotification(message, type = 'info') {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Remover após 4 segundos
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Instâncias globais
window.clientesV4 = new ClientesManagerV4();
window.clientesManagerV3 = window.clientesV4; // Alias para compatibilidade

console.log('✅ Clientes Manager v4.0 carregado com sucesso!');