/**
 * LURIX CRM - Gerenciador de Clientes v3.0
 * Inclui gestão integrada de projetos
 * Persistência correta com relacionamentos
 */

class ClientesManagerV3 {
    constructor() {
        this.currentClienteId = null;
        this.currentProjeto = null;
        
        console.log('🏢 Clientes Manager v3.0 inicializado');
    }

    /**
     * Renderiza a página de clientes
     */
    async renderizar() {
        const content = document.getElementById('pageContent');
        if (!content) return;

        content.innerHTML = `
            <div class="fade-in">
                <!-- Cabeçalho -->
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">
                            <i class="fas fa-users mr-3 text-blue-600"></i>
                            Clientes
                        </h1>
                        <p class="text-gray-600 mt-2">Gerencie clientes e seus projetos</p>
                    </div>
                    <button onclick="clientesV3.abrirModalCliente()" 
                            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 shadow-lg hover:shadow-xl">
                        <i class="fas fa-plus mr-2"></i>
                        Novo Cliente
                    </button>
                </div>

                <!-- Lista de Clientes -->
                <div id="clientesList" class="space-y-4">
                    ${this.renderizarListaClientes()}
                </div>

                <!-- Modal Cliente -->
                <div id="modalCliente" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
                    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <!-- Conteúdo será inserido dinamicamente -->
                    </div>
                </div>

                <!-- Modal Projeto -->
                <div id="modalProjeto" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
                    <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <!-- Conteúdo será inserido dinamicamente -->
                    </div>
                </div>

                <!-- Modal Visualização Projeto -->
                <div id="modalVisualizarProjeto" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
                    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <!-- Conteúdo será inserido dinamicamente -->
                    </div>
                </div>
            </div>
        `;

        // Configurar eventos de teclado para fechar modais
        this.configurarEventos();
    }

    /**
     * Renderiza a lista de clientes
     */
    renderizarListaClientes() {
        const clientes = window.zorixStorage.listClientes();
        
        if (clientes.length === 0) {
            return `
                <div class="text-center py-16">
                    <i class="fas fa-users text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Nenhum cliente encontrado</h3>
                    <p class="text-gray-500 mb-6">Comece adicionando seu primeiro cliente</p>
                    <button onclick="clientesV3.abrirModalCliente()" 
                            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
                        <i class="fas fa-plus mr-2"></i>
                        Adicionar Cliente
                    </button>
                </div>
            `;
        }

        return clientes.map(cliente => this.renderizarCardCliente(cliente)).join('');
    }

    /**
     * Renderiza um card de cliente com seus projetos
     */
    renderizarCardCliente(cliente) {
        const projetos = window.zorixStorage.listProjetosByCliente(cliente.id);
        
        return `
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                <!-- Cabeçalho do Cliente -->
                <div class="flex justify-between items-start mb-6">
                    <div class="flex-1">
                        <h3 class="text-xl font-bold text-gray-900 mb-2">${cliente.nome}</h3>
                        <div class="space-y-1 text-sm text-gray-600">
                            <div><i class="fas fa-envelope mr-2"></i>${cliente.email}</div>
                            <div><i class="fas fa-phone mr-2"></i>${cliente.telefone}</div>
                            <div><i class="fas fa-calendar mr-2"></i>Cliente desde ${new Date(cliente.createdAt).toLocaleDateString('pt-BR')}</div>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="clientesV3.abrirModalCliente('${cliente.id}')" 
                                class="text-blue-600 hover:text-blue-800 p-2" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="clientesV3.confirmarRemocaoCliente('${cliente.id}')" 
                                class="text-red-600 hover:text-red-800 p-2" title="Remover">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                <!-- Projetos do Cliente -->
                <div class="border-t pt-6">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="text-lg font-semibold text-gray-800">
                            <i class="fas fa-project-diagram mr-2 text-green-600"></i>
                            Projetos (${projetos.length})
                        </h4>
                        <button onclick="clientesV3.abrirModalProjeto('${cliente.id}')" 
                                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                            <i class="fas fa-plus mr-1"></i>
                            Novo Projeto
                        </button>
                    </div>

                    ${this.renderizarProjetosCliente(projetos, cliente.id)}
                </div>
            </div>
        `;
    }

    /**
     * Renderiza projetos de um cliente
     */
    renderizarProjetosCliente(projetos, clienteId) {
        if (projetos.length === 0) {
            return `
                <div class="text-center py-8 bg-gray-50 rounded-lg">
                    <i class="fas fa-project-diagram text-4xl text-gray-300 mb-3"></i>
                    <p class="text-gray-500 mb-4">Nenhum projeto encontrado</p>
                    <button onclick="clientesV3.abrirModalProjeto('${clienteId}')" 
                            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                        <i class="fas fa-plus mr-1"></i>
                        Criar Primeiro Projeto
                    </button>
                </div>
            `;
        }

        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${projetos.map(projeto => this.renderizarCardProjeto(projeto)).join('')}
            </div>
        `;
    }

    /**
     * Renderiza um card de projeto
     */
    renderizarCardProjeto(projeto) {
        const statusConfig = this.getStatusConfig(projeto.status);
        const proposta = window.zorixStorage.getPropostaPorProjeto(projeto.id);
        
        return `
            <div class="bg-gray-50 rounded-lg p-4 border-l-4 ${statusConfig.borderColor}">
                <div class="flex justify-between items-start mb-3">
                    <h5 class="font-semibold text-gray-900 text-sm">${projeto.titulo}</h5>
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}">
                        ${statusConfig.label}
                    </span>
                </div>
                
                <div class="text-sm text-gray-600 mb-4">
                    <div><i class="fas fa-bolt mr-1"></i>${projeto.potenciaKWp} kWp</div>
                    <div><i class="fas fa-calendar mr-1"></i>${new Date(projeto.updatedAt).toLocaleDateString('pt-BR')}</div>
                </div>

                <!-- Ações do Projeto -->
                <div class="flex flex-wrap gap-2">
                    <button onclick="clientesV3.visualizarProjeto('${projeto.id}')" 
                            class="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded text-xs font-medium transition duration-200">
                        <i class="fas fa-eye mr-1"></i>Ver
                    </button>
                    
                    <button onclick="clientesV3.abrirModalProjeto('${projeto.clienteId}', '${projeto.id}')" 
                            class="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-xs font-medium transition duration-200">
                        <i class="fas fa-edit mr-1"></i>Editar
                    </button>
                    
                    <button onclick="clientesV3.imprimirProjeto('${projeto.id}')" 
                            class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-xs font-medium transition duration-200">
                        <i class="fas fa-print mr-1"></i>Imprimir
                    </button>

                    ${projeto.status === 'FINALIZADO' ? `
                        <button onclick="clientesV3.gerarProposta('${projeto.id}')" 
                                class="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded text-xs font-medium transition duration-200">
                            <i class="fas fa-file-pdf mr-1"></i>
                            ${proposta ? 'Ver Proposta' : 'Gerar Proposta'}
                        </button>
                    ` : `
                        <button disabled class="bg-gray-100 text-gray-400 px-3 py-1 rounded text-xs cursor-not-allowed" 
                                title="Finalize o projeto para gerar proposta">
                            <i class="fas fa-lock mr-1"></i>Proposta
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    /**
     * Configuração de status dos projetos
     */
    getStatusConfig(status) {
        const configs = {
            'RASCUNHO': {
                label: 'Rascunho',
                bgColor: 'bg-gray-100',
                textColor: 'text-gray-800',
                borderColor: 'border-gray-400'
            },
            'EM_ANDAMENTO': {
                label: 'Em Andamento',
                bgColor: 'bg-blue-100',
                textColor: 'text-blue-800',
                borderColor: 'border-blue-400'
            },
            'FINALIZADO': {
                label: 'Finalizado',
                bgColor: 'bg-green-100',
                textColor: 'text-green-800',
                borderColor: 'border-green-400'
            }
        };
        return configs[status] || configs['RASCUNHO'];
    }

    /**
     * Abre modal para criar/editar cliente
     */
    abrirModalCliente(clienteId = null) {
        const cliente = clienteId ? window.zorixStorage.getCliente(clienteId) : null;
        const isEdicao = !!cliente;

        const modal = document.getElementById('modalCliente');
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div class="border-b px-6 py-4">
                    <h3 class="text-lg font-semibold text-gray-900">
                        ${isEdicao ? 'Editar Cliente' : 'Novo Cliente'}
                    </h3>
                </div>
                
                <form id="formCliente" class="p-6">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                            <input type="text" id="clienteNome" required
                                   value="${cliente?.nome || ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                            <input type="email" id="clienteEmail" required
                                   value="${cliente?.email || ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                            <input type="tel" id="clienteTelefone" required
                                   value="${cliente?.telefone || ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
                        <button type="button" onclick="clientesV3.fecharModal('modalCliente')" 
                                class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
                            Cancelar
                        </button>
                        <button type="submit" 
                                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
                            ${isEdicao ? 'Salvar' : 'Criar'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Configurar submit do formulário
        document.getElementById('formCliente').addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarCliente(clienteId);
        });

        modal.classList.remove('hidden');
        document.getElementById('clienteNome').focus();
    }

    /**
     * Salva cliente (criar ou editar)
     */
    async salvarCliente(clienteId = null) {
        try {
            const nome = document.getElementById('clienteNome').value.trim();
            const email = document.getElementById('clienteEmail').value.trim();
            const telefone = document.getElementById('clienteTelefone').value.trim();

            if (!nome || !email || !telefone) {
                this.showNotification('Preencha todos os campos obrigatórios', 'error');
                return;
            }

            const clienteData = {
                nome,
                email,
                telefone
            };

            if (clienteId) {
                clienteData.id = clienteId;
            }

            const clienteSalvo = window.zorixStorage.saveCliente(clienteData);
            
            this.fecharModal('modalCliente');
            this.showNotification('Salvo com sucesso.', 'success');
            this.renderizar(); // Atualizar lista

        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            this.showNotification('Não foi possível salvar. Tente novamente.', 'error');
        }
    }

    /**
     * Confirma remoção de cliente
     */
    confirmarRemocaoCliente(clienteId) {
        const cliente = window.zorixStorage.getCliente(clienteId);
        const projetos = window.zorixStorage.listProjetosByCliente(clienteId);
        
        const mensagem = projetos.length > 0 
            ? `Tem certeza que deseja remover "${cliente.nome}"? Isso também removerá ${projetos.length} projeto(s) associado(s).`
            : `Tem certeza que deseja remover "${cliente.nome}"?`;

        if (confirm(mensagem)) {
            try {
                window.zorixStorage.deleteCliente(clienteId);
                this.showNotification('Cliente removido com sucesso', 'success');
                this.renderizar();
            } catch (error) {
                this.showNotification('Não foi possível remover. Tente novamente.', 'error');
            }
        }
    }

    /**
     * Abre modal para criar/editar projeto
     */
    abrirModalProjeto(clienteId, projetoId = null) {
        const cliente = window.zorixStorage.getCliente(clienteId);
        const projeto = projetoId ? window.zorixStorage.getProjeto(projetoId) : null;
        const isEdicao = !!projeto;

        if (!cliente) {
            this.showNotification('Cliente não encontrado', 'error');
            return;
        }

        const modal = document.getElementById('modalProjeto');
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                <div class="border-b px-6 py-4">
                    <h3 class="text-lg font-semibold text-gray-900">
                        ${isEdicao ? 'Editar Projeto' : 'Novo Projeto'} - ${cliente.nome}
                    </h3>
                </div>
                
                <form id="formProjeto" class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Título do Projeto *</label>
                            <input type="text" id="projetoTitulo" required
                                   value="${projeto?.titulo || ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Potência (kWp) *</label>
                            <input type="number" id="projetoPotencia" required min="0.1" step="0.1"
                                   value="${projeto?.potenciaKWp || ''}"
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select id="projetoStatus" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="RASCUNHO" ${projeto?.status === 'RASCUNHO' ? 'selected' : ''}>Rascunho</option>
                                <option value="EM_ANDAMENTO" ${projeto?.status === 'EM_ANDAMENTO' ? 'selected' : ''}>Em Andamento</option>
                                <option value="FINALIZADO" ${projeto?.status === 'FINALIZADO' ? 'selected' : ''}>Finalizado</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
                        <button type="button" onclick="clientesV3.fecharModal('modalProjeto')" 
                                class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
                            Cancelar
                        </button>
                        <button type="submit" 
                                class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200">
                            ${isEdicao ? 'Salvar' : 'Criar'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Configurar submit do formulário
        document.getElementById('formProjeto').addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarProjeto(clienteId, projetoId);
        });

        modal.classList.remove('hidden');
        document.getElementById('projetoTitulo').focus();
    }

    /**
     * Salva projeto (criar ou editar)
     */
    async salvarProjeto(clienteId, projetoId = null) {
        try {
            const titulo = document.getElementById('projetoTitulo').value.trim();
            const potenciaKWp = parseFloat(document.getElementById('projetoPotencia').value);
            const status = document.getElementById('projetoStatus').value;

            if (!titulo || !potenciaKWp || potenciaKWp <= 0) {
                this.showNotification('Preencha todos os campos obrigatórios', 'error');
                return;
            }

            const projetoData = {
                clienteId,
                titulo,
                potenciaKWp,
                status
            };

            if (projetoId) {
                projetoData.id = projetoId;
            }

            const projetoSalvo = window.zorixStorage.saveProjeto(projetoData);
            
            this.fecharModal('modalProjeto');
            this.showNotification('Salvo com sucesso.', 'success');
            this.renderizar(); // Atualizar lista

        } catch (error) {
            console.error('Erro ao salvar projeto:', error);
            this.showNotification('Não foi possível salvar. Tente novamente.', 'error');
        }
    }

    /**
     * Visualiza projeto em modal
     */
    visualizarProjeto(projetoId) {
        const projeto = window.zorixStorage.getProjeto(projetoId);
        const cliente = window.zorixStorage.getCliente(projeto.clienteId);
        
        if (!projeto || !cliente) {
            this.showNotification('Projeto não encontrado', 'error');
            return;
        }

        const statusConfig = this.getStatusConfig(projeto.status);
        const proposta = window.zorixStorage.getPropostaPorProjeto(projeto.id);

        const modal = document.getElementById('modalVisualizarProjeto');
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl">
                <div class="border-b px-6 py-4 bg-gray-50 rounded-t-xl">
                    <div class="flex justify-between items-center">
                        <h3 class="text-xl font-bold text-gray-900">${projeto.titulo}</h3>
                        <button onclick="clientesV3.fecharModal('modalVisualizarProjeto')" 
                                class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Dados do Projeto -->
                        <div>
                            <h4 class="text-lg font-semibold text-gray-900 mb-4">
                                <i class="fas fa-project-diagram mr-2 text-green-600"></i>
                                Dados do Projeto
                            </h4>
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Status:</span>
                                    <span class="px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}">
                                        ${statusConfig.label}
                                    </span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Potência:</span>
                                    <span class="font-medium">${projeto.potenciaKWp} kWp</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Criado em:</span>
                                    <span class="font-medium">${new Date(projeto.createdAt).toLocaleDateString('pt-BR')}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Atualizado em:</span>
                                    <span class="font-medium">${new Date(projeto.updatedAt).toLocaleDateString('pt-BR')}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Dados do Cliente -->
                        <div>
                            <h4 class="text-lg font-semibold text-gray-900 mb-4">
                                <i class="fas fa-user mr-2 text-blue-600"></i>
                                Cliente
                            </h4>
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Nome:</span>
                                    <span class="font-medium">${cliente.nome}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">E-mail:</span>
                                    <span class="font-medium">${cliente.email}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Telefone:</span>
                                    <span class="font-medium">${cliente.telefone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${proposta ? `
                        <div class="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 class="text-lg font-semibold text-green-800 mb-3">
                                <i class="fas fa-file-contract mr-2"></i>
                                Proposta Gerada
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span class="text-green-700">Número:</span>
                                    <div class="font-medium">${proposta.numero}</div>
                                </div>
                                <div>
                                    <span class="text-green-700">Data:</span>
                                    <div class="font-medium">${new Date(proposta.data).toLocaleDateString('pt-BR')}</div>
                                </div>
                                <div>
                                    <span class="text-green-700">Valor:</span>
                                    <div class="font-medium">R$ ${proposta.valorTotal.toLocaleString('pt-BR')}</div>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- Ações -->
                    <div class="flex justify-end space-x-3 mt-8 pt-4 border-t">
                        <button onclick="clientesV3.imprimirProjeto('${projeto.id}')" 
                                class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition duration-200">
                            <i class="fas fa-print mr-2"></i>Imprimir
                        </button>
                        
                        ${projeto.status === 'FINALIZADO' ? `
                            <button onclick="clientesV3.gerarProposta('${projeto.id}')" 
                                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200">
                                <i class="fas fa-file-contract mr-2"></i>
                                ${proposta ? 'Baixar Proposta' : 'Gerar Proposta'}
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    /**
     * Imprime projeto
     */
    imprimirProjeto(projetoId) {
        const projeto = window.zorixStorage.getProjeto(projetoId);
        const cliente = window.zorixStorage.getCliente(projeto.clienteId);
        
        if (!projeto || !cliente) {
            this.showNotification('Projeto não encontrado', 'error');
            return;
        }

        const statusConfig = this.getStatusConfig(projeto.status);
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Projeto ${projeto.titulo} - Impressão</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                    .header { border-bottom: 3px solid #064B59; padding-bottom: 20px; margin-bottom: 30px; }
                    .logo { font-size: 24px; font-weight: bold; color: #064B59; }
                    .status { display: inline-block; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; }
                    .status-rascunho { background: #f3f4f6; color: #374151; }
                    .status-andamento { background: #dbeafe; color: #1e40af; }
                    .status-finalizado { background: #dcfce7; color: #166534; }
                    .section { margin-bottom: 30px; }
                    .section h3 { border-left: 4px solid #E6FF28; padding-left: 10px; color: #064B59; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                    .info-item { margin-bottom: 10px; }
                    .label { font-weight: bold; color: #666; }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">LURIX ENERGIA SOLAR</div>
                    <h1>${projeto.titulo}</h1>
                    <span class="status status-${projeto.status.toLowerCase().replace('_', '')}">${statusConfig.label}</span>
                </div>

                <div class="info-grid">
                    <div class="section">
                        <h3>Dados do Projeto</h3>
                        <div class="info-item">
                            <span class="label">Título:</span> ${projeto.titulo}
                        </div>
                        <div class="info-item">
                            <span class="label">Potência:</span> ${projeto.potenciaKWp} kWp
                        </div>
                        <div class="info-item">
                            <span class="label">Status:</span> ${statusConfig.label}
                        </div>
                        <div class="info-item">
                            <span class="label">Criado em:</span> ${new Date(projeto.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                        <div class="info-item">
                            <span class="label">Atualizado em:</span> ${new Date(projeto.updatedAt).toLocaleDateString('pt-BR')}
                        </div>
                    </div>

                    <div class="section">
                        <h3>Dados do Cliente</h3>
                        <div class="info-item">
                            <span class="label">Nome:</span> ${cliente.nome}
                        </div>
                        <div class="info-item">
                            <span class="label">E-mail:</span> ${cliente.email}
                        </div>
                        <div class="info-item">
                            <span class="label">Telefone:</span> ${cliente.telefone}
                        </div>
                        <div class="info-item">
                            <span class="label">Cliente desde:</span> ${new Date(cliente.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3>Informações Técnicas</h3>
                    <div class="info-item">
                        <span class="label">Potência Instalada:</span> ${projeto.potenciaKWp} kWp
                    </div>
                    <div class="info-item">
                        <span class="label">Geração Estimada Mensal:</span> ${Math.round(projeto.potenciaKWp * 150)} kWh
                    </div>
                    <div class="info-item">
                        <span class="label">Investimento Estimado:</span> R$ ${(projeto.potenciaKWp * 5000).toLocaleString('pt-BR')}
                    </div>
                </div>

                <div class="section no-print" style="text-align: center; margin-top: 50px;">
                    <button onclick="window.print()" style="background: #064B59; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
                        Imprimir
                    </button>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    /**
     * Gera proposta (só para projetos FINALIZADOS)
     */
    async gerarProposta(projetoId) {
        try {
            const projeto = window.zorixStorage.getProjeto(projetoId);
            if (!projeto) {
                this.showNotification('Projeto não encontrado', 'error');
                return;
            }

            if (projeto.status !== 'FINALIZADO') {
                this.showNotification('Finalize o projeto para gerar a proposta.', 'warning');
                return;
            }

            // Verifica se já existe proposta
            let proposta = window.zorixStorage.getPropostaPorProjeto(projetoId);
            
            if (!proposta) {
                // Gera nova proposta
                proposta = window.zorixStorage.gerarProposta(projetoId);
                this.showNotification(`Proposta ${proposta.numero} gerada com sucesso!`, 'success');
            }

            // Gerar PDF da proposta usando o sistema existente
            const cliente = window.zorixStorage.getCliente(projeto.clienteId);
            
            if (window.propostaPremiumGenerator) {
                await window.propostaPremiumGenerator.gerarPropostaPremium(projeto, cliente);
            } else {
                this.showNotification('Gerador de proposta não disponível', 'error');
            }

        } catch (error) {
            console.error('Erro ao gerar proposta:', error);
            this.showNotification('Não foi possível gerar a proposta. Tente novamente.', 'error');
        }
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
     * Mostra notificação
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

        // Remover após 3 segundos
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Instâncias globais
window.clientesV3 = new ClientesManagerV3();
window.clientesManagerV3 = window.clientesV3; // Alias para compatibilidade com main.js

console.log('✅ Clientes Manager v3.0 carregado com sucesso!');