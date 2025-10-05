/**
 * ZORIX CRM - Gerenciador de Clientes v5.0
 * Formulário simplificado com concessionária automática
 * Interface compacta otimizada
 */

class ClientesManagerV5 {
    constructor() {
        this.currentClienteId = null;
        this.currentProjeto = null;
        console.log('🏢 Clientes Manager v5.0 inicializado');
        
        // Sistema de limpeza desativado - manter dados como estão
        // Converter clientes existentes para maiúscula se necessário
        this.converterClientesParaMaiuscula();
    }

    /**
     * Converte todos os clientes existentes para maiúscula
     */
    converterClientesParaMaiuscula() {
        try {
            const clientes = window.zorixStorage.listClientes();
            let clientesAtualizados = false;
            
            clientes.forEach(cliente => {
                const nomeOriginal = cliente.nome;
                const nomeUpper = nomeOriginal.toUpperCase();
                
                if (nomeOriginal !== nomeUpper) {
                    cliente.nome = nomeUpper;
                    window.zorixStorage.saveCliente(cliente);
                    clientesAtualizados = true;
                }
            });
            
            if (clientesAtualizados) {
                console.log('📝 Nomes de clientes convertidos para maiúscula');
            }
        } catch (error) {
            console.error('Erro ao converter nomes para maiúscula:', error);
        }
    }

    /**
     * Limpa todos os dados de teste do sistema
     */
    limparDadosTeste() {
        try {
            console.log('🧹 Iniciando limpeza de dados de teste...');
            
            // Limpar todos os clientes
            const clientes = window.zorixStorage.listClientes();
            console.log(`🗑️ Removendo ${clientes.length} cliente(s) de teste...`);
            clientes.forEach(cliente => {
                window.zorixStorage.deleteCliente(cliente.id);
                console.log(`  - Removido: ${cliente.nome}`);
            });
            
            // Limpar todos os projetos (caso sobraram alguns)
            const projetos = window.zorixStorage.listProjetos();
            console.log(`🗑️ Removendo ${projetos.length} projeto(s) de teste...`);
            projetos.forEach(projeto => {
                window.zorixStorage.deleteProjeto(projeto.id);
                console.log(`  - Removido: ${projeto.titulo || 'Projeto sem título'}`);
            });
            
            // Limpar propostas
            if (window.zorixStorage.cache && window.zorixStorage.cache.propostas) {
                const propostas = window.zorixStorage.cache.propostas.length;
                window.zorixStorage.cache.propostas = [];
                console.log(`🗑️ Removidas ${propostas} proposta(s) de teste`);
            }
            
            // Limpar interações de teste
            const interacoes = JSON.parse(localStorage.getItem('interacoes') || '[]');
            if (interacoes.length > 0) {
                localStorage.setItem('interacoes', '[]');
                console.log(`🗑️ Removidas ${interacoes.length} interação(ões) de teste`);
            }
            
            // Limpar agendamentos de teste
            const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
            if (agendamentos.length > 0) {
                localStorage.setItem('agendamentos', '[]');
                console.log(`🗑️ Removidos ${agendamentos.length} agendamento(s) de teste`);
            }
            
            // Salvar alterações
            window.zorixStorage.salvarTodos();
            
            console.log('✅ Limpeza concluída! Sistema pronto para dados reais.');
            
            // Atualizar interface
            this.renderizar();
            
            // Notificação removida conforme solicitado
            
        } catch (error) {
            console.error('❌ Erro ao limpar dados de teste:', error);
            if (window.app && app.showNotification) {
                app.showNotification('Erro ao limpar dados: ' + error.message, 'error');
            } else {
                alert('Erro ao limpar dados: ' + error.message);
            }
        }
    }

    /**
     * Exclui cliente com autenticação de administrador
     */
    excluirCliente(clienteId) {
        try {
            console.log('🗑️ Iniciando exclusão do cliente:', clienteId);
            
            const cliente = window.zorixStorage.getCliente(clienteId);
            if (!cliente) {
                if (window.app && app.showNotification) {
                    app.showNotification('Cliente não encontrado', 'error');
                } else {
                    alert('Cliente não encontrado');
                }
                return;
            }

            console.log('✅ Cliente encontrado:', cliente.nome);

            // Verificar se há projetos associados ao cliente
            const projetos = window.zorixStorage.listProjetosByCliente(clienteId);
            console.log('📋 Projetos associados:', projetos.length);
            
            if (projetos.length > 0) {
                const confirmarExclusao = confirm(
                    `ATENÇÃO: Este cliente possui ${projetos.length} projeto(s) associado(s).\n\n` +
                    `Ao excluir o cliente, TODOS os projetos também serão excluídos permanentemente.\n\n` +
                    `Deseja continuar com a exclusão?`
                );
                
                if (!confirmarExclusao) {
                    console.log('❌ Usuário cancelou - projetos associados');
                    return;
                }
            }

            // Solicitar senha do administrador
            const senha = prompt('Digite sua senha de administrador para confirmar a exclusão:');
            if (!senha) {
                console.log('❌ Usuário cancelou - sem senha');
                return; // Usuário cancelou
            }

            console.log('🔐 Validando senha...');

            // Verificar se a senha é admin123 (senha padrão)
            if (senha !== 'admin123') {
                // Tentar validação com hash também para compatibilidade
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                if (currentUser && currentUser.senha) {
                    const senhaHash = window.auth ? auth.hashPassword(senha) : senha;
                    if (senhaHash !== currentUser.senha) {
                        if (window.app && app.showNotification) {
                    app.showNotification('Senha incorreta!', 'error');
                } else {
                    alert('Senha incorreta!');
                }
                        console.log('❌ Senha incorreta');
                        return;
                    }
                } else {
                    if (window.app && app.showNotification) {
                    app.showNotification('Senha incorreta!', 'error');
                } else {
                    alert('Senha incorreta!');
                }
                    console.log('❌ Senha incorreta - não é admin123');
                    return;
                }
            }

            console.log('✅ Senha validada com sucesso');

            // Confirmação final
            const confirmacaoFinal = confirm(
                `CONFIRMAÇÃO FINAL:\n\n` +
                `Tem absoluta certeza que deseja excluir permanentemente o cliente "${cliente.nome}"?\n\n` +
                `Esta ação NÃO PODE ser desfeita!\n\n` +
                `- Cliente: ${cliente.nome}\n` +
                `- Email: ${cliente.email || 'N/A'}\n` +
                `- Projetos associados: ${projetos.length}`
            );

            if (!confirmacaoFinal) {
                console.log('❌ Usuário cancelou - confirmação final');
                return;
            }

            console.log('🗑️ Iniciando exclusão...');

            // Excluir projetos associados primeiro
            if (projetos.length > 0) {
                console.log(`🗑️ Excluindo ${projetos.length} projeto(s)...`);
                projetos.forEach(projeto => {
                    console.log(`  - Excluindo projeto: ${projeto.titulo} (${projeto.id})`);
                    window.zorixStorage.deleteProjeto(projeto.id);
                });
                console.log('✅ Projetos excluídos');
            }

            // Excluir o cliente
            console.log(`🗑️ Excluindo cliente: ${cliente.nome} (${clienteId})`);
            const resultadoExclusao = window.zorixStorage.deleteCliente(clienteId);
            console.log('✅ Cliente excluído do storage');

            // Log da ação para auditoria
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            console.log(`🗑️ AUDITORIA: Cliente excluído por ${currentUser.nome || 'Admin'}: ${cliente.nome} (ID: ${clienteId})`);
            
            // Atualizar interface
            console.log('🔄 Atualizando interface...');
            this.renderizar();
            console.log('✅ Interface atualizada');
            
            if (window.app && app.showNotification) {
                app.showNotification(
                    `Cliente "${cliente.nome}" excluído com sucesso${projetos.length > 0 ? ` (${projetos.length} projeto(s) também excluído(s))` : ''}`, 
                    'success'
                );
            } else {
                alert(`Cliente "${cliente.nome}" excluído com sucesso`);
            }

            console.log('🎉 Exclusão concluída com sucesso');

        } catch (error) {
            console.error('❌ Erro ao excluir cliente:', error);
            if (window.app && app.showNotification) {
                app.showNotification('Erro ao excluir cliente: ' + error.message, 'error');
            } else {
                alert('Erro ao excluir cliente: ' + error.message);
            }
        }
    }

    /**
     * Renderiza interface principal compacta
     */
    async renderizar() {
        const pageContent = document.getElementById('pageContent');
        if (!pageContent) return;

        const clientes = window.zorixStorage.listClientes();
        const projetos = window.zorixStorage.listProjetos();

        pageContent.innerHTML = `
            <div class="max-w-6xl mx-auto">
                <!-- Header compacto -->
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 mb-1">Clientes</h1>
                        <p class="text-sm text-gray-600" id="clientesCount">${clientes.length} cliente(s) • ${projetos.length} projeto(s)</p>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="clientesV5.abrirModalCliente()" 
                            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition duration-200">
                            <i class="fas fa-plus mr-1"></i>Novo Cliente
                        </button>
                    </div>
                </div>

                <!-- Campo de busca -->
                <div class="mb-4">
                    <div class="relative max-w-md">
                        <input type="text" 
                            id="buscaClientes" 
                            placeholder="Buscar por nome, email ou telefone..."
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            onkeyup="clientesV5.filtrarClientes(this.value)">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i class="fas fa-search text-gray-400 text-sm"></i>
                        </div>
                        <button id="limparBusca" 
                            onclick="clientesV5.limparBusca()" 
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 hidden">
                            <i class="fas fa-times text-sm"></i>
                        </button>
                    </div>
                </div>

                <!-- Lista compacta de clientes -->
                <div class="space-y-2">
                    ${this.renderizarListaCompacta()}
                </div>

                <!-- Modais -->
                ${this.renderizarModals()}
            </div>
        `;

        this.configurarEventos();
    }

    /**
     * Lista compacta de clientes
     */
    renderizarListaCompacta(clientesFiltrados = null) {
        const clientes = clientesFiltrados || window.zorixStorage.listClientes();
        
        if (clientes.length === 0) {
            return `
                <div class="text-center py-12 bg-white rounded-lg shadow">
                    <i class="fas fa-users text-4xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum cliente cadastrado</h3>
                    <p class="text-gray-500 mb-4">Comece criando seu primeiro cliente</p>
                    <button onclick="clientesV5.abrirModalCliente()" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition duration-200">
                        Criar Primeiro Cliente
                    </button>
                </div>
            `;
        }

        return clientes.map(cliente => this.renderizarCardCompacto(cliente)).join('');
    }

    /**
     * Card compacto do cliente - só nome e dados básicos
     */
    renderizarCardCompacto(cliente) {
        const projetos = window.zorixStorage.listProjetosByCliente(cliente.id);
        const projetosFinalizados = projetos.filter(p => p.status === 'FINALIZADO').length;

        // Truncar email para ficar compacto
        const emailCompacto = cliente.email.length > 25 ? 
            cliente.email.substring(0, 22) + '...' : cliente.email;

        return `
            <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 border border-gray-200">
                <!-- Linha compacta - sempre visível -->
                <div class="p-3 cursor-pointer" onclick="clientesV5.toggleDetalhes('${cliente.id}')">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3 flex-1">
                            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-user text-blue-600 text-sm"></i>
                            </div>
                            <div class="min-w-0 flex-1">
                                <h3 class="font-medium text-gray-900 text-sm truncate">${cliente.nome}</h3>
                                <div class="flex items-center gap-4 text-xs text-gray-500">
                                    <span class="truncate">${emailCompacto}</span>
                                    <span class="whitespace-nowrap">${cliente.telefone}</span>
                                    ${this.getVendedorInfo(cliente.vendedor_id)}
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-4 flex-shrink-0">
                            <div class="text-center">
                                <div class="text-sm font-bold text-blue-600">${projetos.length}</div>
                                <div class="text-xs text-gray-500">proj.</div>
                            </div>
                            <div class="text-center">
                                <div class="text-sm font-bold text-green-600">${projetosFinalizados}</div>
                                <div class="text-xs text-gray-500">final.</div>
                            </div>
                            <i class="fas fa-chevron-down text-gray-400 transform transition-transform text-xs" id="chevron-${cliente.id}"></i>
                        </div>
                    </div>
                </div>

                <!-- Detalhes expandíveis - inicialmente ocultos -->
                <div class="hidden border-t border-gray-200" id="detalhes-${cliente.id}">
                    <div class="p-4 space-y-4">
                        <!-- Dados completos do cliente -->
                        <div class="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <label class="block text-xs font-medium text-gray-700">E-mail Completo</label>
                                <p class="text-gray-900">${cliente.email}</p>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700">Telefone</label>
                                <p class="text-gray-900">${cliente.telefone}</p>
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700">Cadastrado em</label>
                                <p class="text-gray-900">${new Date(cliente.createdAt).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>

                        <!-- Ações do cliente -->
                        <div class="flex gap-2">
                            <button onclick="clientesV5.abrirModalCliente('${cliente.id}')" 
                                class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs transition duration-200">
                                <i class="fas fa-edit mr-1"></i>Editar
                            </button>
                            <button onclick="clientesV5.abrirModalProjeto('${cliente.id}')" 
                                class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition duration-200">
                                <i class="fas fa-plus mr-1"></i>Novo Projeto
                            </button>
                            <button onclick="clientesV5.excluirCliente('${cliente.id}')" 
                                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition duration-200">
                                <i class="fas fa-trash mr-1"></i>Excluir
                            </button>
                            <button onclick="clientesV5.abrirUploadArquivos('${cliente.id}')" 
                                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition duration-200">
                                <i class="fas fa-upload mr-1"></i>Arquivos
                            </button>
                        </div>

                        <!-- Lista de projetos -->
                        <div>
                            <h4 class="text-sm font-medium text-gray-900 mb-2">Projetos (${projetos.length})</h4>
                            ${this.renderizarProjetosCompactos(projetos)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Lista compacta de projetos
     */
    renderizarProjetosCompactos(projetos) {
        if (projetos.length === 0) {
            return `
                <div class="text-center py-6 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                    <i class="fas fa-solar-panel text-2xl text-gray-400 mb-2"></i>
                    <p class="text-gray-500 text-sm mb-2">Nenhum projeto cadastrado</p>
                </div>
            `;
        }

        return `
            <div class="space-y-2">
                ${projetos.map(projeto => this.renderizarProjetoCompacto(projeto)).join('')}
            </div>
        `;
    }

    /**
     * Card compacto de projeto
     */
    renderizarProjetoCompacto(projeto) {
        const statusColors = {
            'RASCUNHO': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'EM_ANDAMENTO': 'bg-blue-100 text-blue-800 border-blue-200',
            'FINALIZADO': 'bg-green-100 text-green-800 border-green-200'
        };

        const kWp = projeto.kWp || 0;
        const precoVenda = projeto.preco_venda_total || 0;

        return `
            <div class="bg-gray-50 border border-gray-200 rounded p-3">
                <div class="flex items-center justify-between mb-2">
                    <h5 class="font-medium text-gray-900 text-sm truncate flex-1 mr-2">${projeto.titulo}</h5>
                    <span class="px-2 py-1 text-xs font-medium rounded border ${statusColors[projeto.status] || statusColors['RASCUNHO']}">
                        ${projeto.status}
                    </span>
                </div>
                
                <div class="grid grid-cols-3 gap-2 text-xs mb-2">
                    <div>
                        <span class="text-gray-500">kWp:</span>
                        <div class="font-medium">${kWp.toFixed(1)}</div>
                    </div>
                    <div>
                        <span class="text-gray-500">Cidade:</span>
                        <div class="font-medium truncate">${projeto.cidade || 'N/A'}</div>
                    </div>
                    <div>
                        <span class="text-gray-500">Valor:</span>
                        <div class="font-medium">R$ ${(precoVenda/1000).toFixed(0)}k</div>
                    </div>
                </div>

                <div class="flex gap-1">
                    <button onclick="clientesV5.visualizarProjeto('${projeto.id}')" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs rounded transition duration-200 flex-1">
                        Ver
                    </button>
                    <button onclick="clientesV5.editarProjeto('${projeto.id}')" 
                        class="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 text-xs rounded transition duration-200 flex-1">
                        Editar
                    </button>
                    <button onclick="clientesV5.gerarProposta('${projeto.id}')" 
                        class="bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-xs rounded transition duration-200 flex-1">
                        Proposta
                    </button>
                    <button onclick="clientesV5.excluirProjeto('${projeto.id}')" 
                        class="bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded transition duration-200 flex items-center justify-center"
                        title="Excluir projeto">
                        <i class="fas fa-trash text-xs"></i>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Gera opções de vendedores para o select
     */
    getVendedoresOptions(selectedId = '') {
        try {
            if (window.configSistema) {
                const vendedores = window.configSistema.getVendedores();
                if (vendedores && vendedores.length > 0) {
                    return vendedores.map(vendedor => 
                        `<option value="${vendedor.id}" ${vendedor.id === selectedId ? 'selected' : ''}>
                            ${vendedor.nome}
                        </option>`
                    ).join('');
                }
            }
            return '<option value="">Nenhum vendedor cadastrado</option>';
        } catch (error) {
            console.error('Erro ao buscar vendedores:', error);
            return '<option value="">Erro ao carregar vendedores</option>';
        }
    }

    /**
     * Obtém informações do vendedor para exibição
     */
    getVendedorInfo(vendedorId) {
        if (!vendedorId) {
            return '<span class="text-orange-600"><i class="fas fa-user-slash mr-1"></i>Sem vendedor</span>';
        }
        
        try {
            if (window.configSistema) {
                const vendedor = window.configSistema.getVendedorById(vendedorId);
                if (vendedor) {
                    return `<span class="text-blue-600"><i class="fas fa-user-tie mr-1"></i>${vendedor.nome}</span>`;
                }
            }
            return '<span class="text-red-600"><i class="fas fa-user-times mr-1"></i>Vendedor inválido</span>';
        } catch (error) {
            console.error('Erro ao buscar vendedor:', error);
            return '<span class="text-gray-500">Erro</span>';
        }
    }

    /**
     * Toggle detalhes do cliente
     */
    toggleDetalhes(clienteId) {
        const detalhes = document.getElementById(`detalhes-${clienteId}`);
        const chevron = document.getElementById(`chevron-${clienteId}`);
        
        if (detalhes.classList.contains('hidden')) {
            // Fechar outros detalhes abertos
            document.querySelectorAll('[id^="detalhes-"]').forEach(el => {
                if (el.id !== `detalhes-${clienteId}`) {
                    el.classList.add('hidden');
                }
            });
            document.querySelectorAll('[id^="chevron-"]').forEach(el => {
                if (el.id !== `chevron-${clienteId}`) {
                    el.classList.remove('rotate-180');
                }
            });
            
            // Abrir este
            detalhes.classList.remove('hidden');
            chevron.classList.add('rotate-180');
        } else {
            // Fechar este
            detalhes.classList.add('hidden');
            chevron.classList.remove('rotate-180');
        }
    }

    /**
     * Modal de cliente (igual V4)
     */
    abrirModalCliente(clienteId = null) {
        const isEdicao = !!clienteId;
        let cliente = { nome: '', email: '', telefone: '' };
        
        if (isEdicao) {
            cliente = window.zorixStorage.getCliente(clienteId);
            if (!cliente) {
                if (window.app && app.showNotification) {
                    app.showNotification('Cliente não encontrado', 'error');
                } else {
                    alert('Cliente não encontrado');
                }
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
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Vendedor Responsável</label>
                    <select id="clienteVendedor" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Selecione um vendedor</option>
                        ${this.getVendedoresOptions(cliente.vendedor_id)}
                    </select>
                </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-6">
                <button onclick="clientesV5.fecharModal('modalCliente')" 
                    class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200">
                    Cancelar
                </button>
                <button onclick="clientesV5.salvarCliente('${clienteId || ''}')" 
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                    ${isEdicao ? 'Salvar' : 'Criar'}
                </button>
            </div>
        `;
    }

    /**
     * Modal de projeto SIMPLIFICADO
     */
    async abrirModalProjeto(clienteId, projetoId = null) {
        const isEdicao = !!projetoId;
        
        const cliente = window.zorixStorage.getCliente(clienteId);
        if (!cliente) {
            this.showNotification('Cliente não encontrado', 'error');
            return;
        }

        let projeto = {
            titulo: cliente.nome || '',
            cidade: '',
            estado: 'SP',
            endereco: '',
            modulos: [{ quantidade: 1, descricao: 'MÓDULOS FOTOVOLTAICOS DE 700 kW', potencia_wp: 700 }],
            inversores: [{ quantidade: 1, descricao: 'INVERSOR STRING 10KW', potencia_kw: 10.0 }],
            outros_materiais: 'ESTRUTURA DE FIXAÇÃO\nCABEAMENTO CC e CA\nPROTEÇÕES ELÉTRICAS\nMÃO DE OBRA\nHOMOLOGAÇÃO NA CONCESSIONÁRIA\nMONITORAMENTO WIFI',
            preco_venda_total: '',
            consumo_medio_kwh_mes: 800,
            fator_perdas: 0.82,
            status: 'analise'
        };
        
        if (isEdicao) {
            const projetoExistente = window.zorixStorage.getProjeto(projetoId);
            if (!projetoExistente) {
                this.showNotification('Projeto não encontrado', 'error');
                return;
            }
            projeto = { ...projeto, ...projetoExistente };
        }

        const modal = document.getElementById('modalProjeto');
        modal.classList.remove('hidden');

        document.getElementById('modalProjetoTitle').textContent = 
            isEdicao ? 'Editar Projeto' : 'Novo Projeto';

        document.getElementById('projetoForm').innerHTML = `
            <div class="space-y-6">
                <!-- Identificação Básica -->
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-blue-900 mb-3">📋 Identificação</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Título do Projeto *</label>
                            <input type="text" id="projetoTitulo" value="${projeto.titulo || ''}" 
                                onkeyup="this.value = this.value.toUpperCase()"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                            <input type="text" id="projetoCidade" value="${projeto.cidade || ''}" 
                                onchange="clientesV5.buscarIrradiacaoPorCidade()" onkeyup="this.value = this.value.toUpperCase()"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                            <select id="projetoEstado" 
                                onchange="clientesV5.buscarIrradiacaoPorCidade()"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                ${this.gerarOpcoesEstados(projeto.estado)}
                            </select>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Endereço (opcional)</label>
                            <input type="text" id="projetoEndereco" value="${projeto.endereco || ''}" 
                                onkeyup="this.value = this.value.toUpperCase()"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Concessionária</label>
                            <input type="text" id="projetoConcessionaria" value="${projeto.concessionaria || ''}"
                                placeholder="Digite o nome da concessionária" onkeyup="this.value = this.value.toUpperCase()"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Irradiação Solar (HSP/dia)</label>
                            <input type="number" id="projetoIrradiacao" value="${projeto.irradiacao || 5.5}" 
                                step="0.1" min="0" max="10"
                                placeholder="5.5" onchange="clientesV5.calcularKwpSugerido(); clientesV5.calcularGeracaoMedia(); this.setAttribute('data-editado-manual', 'true')"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <p class="text-xs text-gray-500 mt-1">Média de horas de sol pleno por dia</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Média Consumo (kWh/mês) *</label>
                            <input type="number" id="mediaConsumo" value="${projeto.media_consumo || ''}" 
                                step="1" min="0" required
                                placeholder="450" onchange="clientesV5.calcularKwpSugerido()"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <p class="text-xs text-gray-500 mt-1">Consumo médio mensal em kWh</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">kWp Sugerido</label>
                            <div id="kwpSugerido" class="w-full px-3 py-2 bg-green-50 border border-green-300 rounded-md text-green-800 font-semibold text-center">
                                ${projeto.media_consumo && projeto.media_consumo > 0 ? ((projeto.media_consumo / ((projeto.irradiacao || 5.5) * 30 * 0.82)).toFixed(2) + ' kWp') : '0.0 kWp'}
                            </div>
                            <p class="text-xs text-gray-500 mt-1">Baseado no consumo e irradiação</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Instalação</label>
                            <select id="tipoInstalacao" onchange="clientesV5.toggleTipoTelhado()"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="telhado" ${(projeto.tipo_instalacao === 'telhado' || !projeto.tipo_instalacao) ? 'selected' : ''}>Telhado</option>
                                <option value="solo" ${projeto.tipo_instalacao === 'solo' ? 'selected' : ''}>Solo</option>
                                <option value="carport" ${projeto.tipo_instalacao === 'carport' ? 'selected' : ''}>Carport</option>
                            </select>
                        </div>
                        <div id="tipoTelhadoContainer" class="${projeto.tipo_instalacao === 'telhado' || !projeto.tipo_instalacao ? '' : 'hidden'}">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Telhado</label>
                            <select id="tipoTelhado"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="metalico" ${projeto.tipo_telhado === 'metalico' ? 'selected' : ''}>Metálico</option>
                                <option value="fibrocimento" ${projeto.tipo_telhado === 'fibrocimento' ? 'selected' : ''}>Fibrocimento</option>
                                <option value="colonial" ${projeto.tipo_telhado === 'colonial' ? 'selected' : ''}>Colonial</option>
                                <option value="shingle" ${projeto.tipo_telhado === 'shingle' ? 'selected' : ''}>Shingle</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Módulos Simplificado -->
                <div class="bg-green-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-green-900 mb-3">📱 Módulos Fotovoltaicos</h3>
                    <div id="modulosList">
                        ${this.renderizarModulosSimples(projeto.modulos || [])}
                    </div>
                    <button type="button" onclick="clientesV5.adicionarModulo()" 
                        class="mt-2 text-green-600 hover:text-green-700 text-sm font-medium">
                        + Adicionar Linha de Módulos
                    </button>
                </div>

                <!-- Inversores Simplificado -->
                <div class="bg-purple-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-purple-900 mb-3">🔌 Inversores</h3>
                    <div id="inversoresList">
                        ${this.renderizarInversoresSimples(projeto.inversores || [])}
                    </div>
                    <button type="button" onclick="clientesV5.adicionarInversor()" 
                        class="mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium">
                        + Adicionar Inversor
                    </button>
                    
                    <!-- kWp Calculado -->
                    <div class="mt-4 p-3 bg-white rounded border">
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-medium text-gray-700">Potência Total:</span>
                            <span id="kWpCalculado" class="text-xl font-bold text-purple-600">0.0 kWp</span>
                        </div>
                    </div>
                </div>

                <!-- Campo Único para Outros Materiais -->
                <div class="bg-yellow-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-yellow-900 mb-3">📦 Outros Materiais</h3>
                    <textarea id="outrosMateriais" rows="4" 
                        placeholder="Lista dos demais materiais do projeto..."
                        onkeyup="this.value = this.value.toUpperCase()"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500">${projeto.outros_materiais || ''}</textarea>
                    <p class="text-sm text-yellow-700 mt-2">
                        <i class="fas fa-info-circle mr-1"></i>
                        Liste estrutura, cabeamento, proteções e demais itens (um por linha)
                    </p>
                </div>

                <!-- Preço Final Único -->
                <div class="bg-orange-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-orange-900 mb-3">💰 Valor Final do Sistema</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Preço de Venda Total (R$) *</label>
                            <input type="number" id="precoVendaTotal" value="${projeto.preco_venda_total || ''}" 
                                step="100" min="0" onchange="clientesV5.calcularPayback()"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                        </div>

                    </div>
                </div>

                <!-- Forma de Pagamento -->
                <div class="bg-indigo-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-indigo-900 mb-3">💳 Forma de Pagamento</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Pagamento</label>
                            <select id="tipoPagamento" onchange="clientesV5.toggleParcelamento()"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="avista" ${(projeto.tipo_pagamento === 'avista' || !projeto.tipo_pagamento) ? 'selected' : ''}>À Vista</option>
                                <option value="parcelado" ${projeto.tipo_pagamento === 'parcelado' ? 'selected' : ''}>Parcelado</option>
                                <option value="entrada_parcelado" ${projeto.tipo_pagamento === 'entrada_parcelado' ? 'selected' : ''}>Entrada + Restante Parcelado</option>
                            </select>
                        </div>
                        
                        <div id="parcelamentoContainer" class="${(projeto.tipo_pagamento === 'parcelado' || projeto.tipo_pagamento === 'entrada_parcelado') ? '' : 'hidden'}">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Número de Parcelas</label>
                            <select id="numeroParcelas" onchange="clientesV5.calcularParcelas()"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                ${this.gerarOpcoesParcelas(projeto.numero_parcelas || 1)}
                            </select>
                        </div>
                    </div>
                    
                    <!-- Campo para valor da entrada (apenas entrada + parcelado) -->
                    <div id="entradaContainer" class="${projeto.tipo_pagamento === 'entrada_parcelado' ? 'mt-4' : 'hidden mt-4'}">
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Valor da Entrada (R$)</label>
                                <input type="number" id="valorEntrada" value="${projeto.valor_entrada || 0}" 
                                    step="100" min="0" onchange="clientesV5.calcularParcelas()"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <p class="text-xs text-gray-500 mt-1">Valor pago na entrada</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Saldo a Parcelar</label>
                                <div id="saldoParcelar" class="w-full px-3 py-2 bg-blue-50 border border-blue-300 rounded-md text-blue-800 font-semibold text-center">
                                    R$ 0,00
                                </div>
                                <p class="text-xs text-gray-500 mt-1">Valor total - entrada</p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="parcelamentoDetalhes" class="${(projeto.tipo_pagamento === 'parcelado' || projeto.tipo_pagamento === 'entrada_parcelado') ? 'mt-4' : 'hidden mt-4'}">
                        <div class="grid md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Valor por Parcela</label>
                                <input type="text" id="valorParcela" readonly 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Data Primeira Parcela</label>
                                <input type="date" id="dataPrimeiraParcela" value="${projeto.data_primeira_parcela || ''}"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Periodicidade</label>
                                <select id="periodicidadeParcelas" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="mensal" ${(projeto.periodicidade_parcelas === 'mensal' || !projeto.periodicidade_parcelas) ? 'selected' : ''}>Mensal</option>
                                    <option value="quinzenal" ${projeto.periodicidade_parcelas === 'quinzenal' ? 'selected' : ''}>Quinzenal</option>
                                    <option value="semanal" ${projeto.periodicidade_parcelas === 'semanal' ? 'selected' : ''}>Semanal</option>
                                </select>
                            </div>
                        </div>
                        
                        <div id="cronogramaParcelas" class="mt-4 p-3 bg-white rounded border">
                            <h4 class="font-medium text-gray-900 mb-2">Cronograma de Parcelas</h4>
                            <div id="listaParcelas" class="text-sm text-gray-600">
                                <!-- Será preenchido dinamicamente -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Resultados Automáticos -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-gray-900 mb-3">📊 Cálculos e Resultados</h3>
                    
                    <!-- Geração Mensal Editável -->
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Geração Média Mensal (kWh)</label>
                        <input type="number" id="geracaoMediaMensal" value="${projeto.geracao_media_mensal || 0}" 
                            step="1" min="0" onchange="clientesV5.calcularPayback()"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <p class="text-xs text-gray-500 mt-1">Calculado automaticamente: kWp × Irradiação × 30 dias × 0.82 (fator de perdas)</p>
                    </div>
                    
                    <div class="grid md:grid-cols-3 gap-4 text-center">
                        <div class="bg-white p-3 rounded">
                            <div id="geracaoAnual" class="text-lg font-bold text-blue-600">0 kWh</div>
                            <div class="text-xs text-gray-600">Geração/ano</div>
                        </div>
                        <div class="bg-white p-3 rounded">
                            <div id="economiaAnual" class="text-lg font-bold text-green-600">R$ 0</div>
                            <div class="text-xs text-gray-600">Economia/ano</div>
                        </div>
                        <div class="bg-white p-3 rounded">
                            <div id="paybackAnos" class="text-lg font-bold text-orange-600">0 anos</div>
                            <div class="text-xs text-gray-600">Payback</div>
                        </div>
                    </div>
                </div>

                <!-- Status -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-semibold text-gray-900 mb-3">🏷️ Status</h3>
                    <select id="projetoStatus" onchange="clientesV5.handleStatusChange(this)" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                        <option value="analise" ${projeto.status === 'analise' ? 'selected' : ''}>🔍 ANÁLISE</option>
                        <option value="perdida" ${projeto.status === 'perdida' ? 'selected' : ''}>❌ PERDIDA</option>
                        <option value="ganha" ${projeto.status === 'ganha' ? 'selected' : ''}>🎉 GANHA</option>
                    </select>
                    <p class="text-sm text-gray-600 mt-2">
                        <i class="fas fa-info-circle mr-1"></i>
                        Proposta disponível em qualquer status
                    </p>
                </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-6">
                <button onclick="clientesV5.fecharModal('modalProjeto')" 
                    class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200">
                    Cancelar
                </button>
                <button onclick="clientesV5.salvarProjeto('${clienteId}', '${projetoId || ''}')" 
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                    ${isEdicao ? 'Salvar' : 'Criar Projeto'}
                </button>
            </div>
        `;

        // Calcular valores iniciais
        setTimeout(() => {
            this.calcularKWp();
            this.calcularPayback();
        }, 100);
    }

    /**
     * Gera opções de estados
     */
    gerarOpcoesEstados(estadoSelecionado = '') {
        const estados = [
            'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
            'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
            'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
        ];
        
        return estados.map(estado => 
            `<option value="${estado}" ${estado === estadoSelecionado ? 'selected' : ''}>${estado}</option>`
        ).join('');
    }

    /**
     * Renderiza módulos de forma simples
     */
    renderizarModulosSimples(modulos) {
        return modulos.map((modulo, index) => `
            <div class="grid grid-cols-12 gap-2 items-center mb-2">
                <div class="col-span-2">
                    <input type="number" placeholder="Qtd" value="${modulo.quantidade}" 
                        onchange="clientesV5.calcularKWp()" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                </div>
                <div class="col-span-6">
                    <input type="text" placeholder="Descrição do módulo" value="${modulo.descricao || modulo.descricao_modulo || ''}" 
                        onkeyup="this.value = this.value.toUpperCase()"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                </div>
                <div class="col-span-3">
                    <input type="number" placeholder="Potência (Wp)" value="${modulo.potencia_wp || modulo.potencia_modulo_Wp || 0}" 
                        step="1" onchange="clientesV5.calcularKWp()" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                </div>
                <div class="col-span-1 text-center">
                    <button onclick="clientesV5.removerModulo(${index})" 
                        class="text-red-600 hover:text-red-700 p-1">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Renderiza inversores de forma simples
     */
    renderizarInversoresSimples(inversores) {
        return inversores.map((inversor, index) => `
            <div class="grid grid-cols-12 gap-2 items-center mb-2">
                <div class="col-span-2">
                    <input type="number" placeholder="Qtd" value="${inversor.quantidade}" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                </div>
                <div class="col-span-6">
                    <input type="text" placeholder="Descrição do inversor" value="${inversor.descricao || inversor.descricao_inversor || ''}" 
                        onkeyup="this.value = this.value.toUpperCase()"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                </div>
                <div class="col-span-3">
                    <input type="number" placeholder="Potência (kW)" value="${inversor.potencia_kw || inversor.potencia_inversor_kW || 0}" 
                        step="0.1" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                </div>
                <div class="col-span-1 text-center">
                    <button onclick="clientesV5.removerInversor(${index})" 
                        class="text-red-600 hover:text-red-700 p-1">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Atualiza dados automáticos (concessionária, irradiação, tarifa)
     */
    async atualizarDados() {
        const cidade = document.getElementById('projetoCidade')?.value;
        const estado = document.getElementById('projetoEstado')?.value;
        
        if (estado) {
            try {
                // Buscar concessionária por estado
                const concessionariaData = await window.zorixStorage.getConcessionariaPorEstado(estado);
                const concessionariaInput = document.getElementById('projetoConcessionaria');
                
                if (concessionariaInput) {
                    concessionariaInput.value = concessionariaData.nome;
                    this.currentTarifa = concessionariaData.tarifa;
                }
                
                // Buscar irradiação se tiver cidade
                if (cidade) {
                    this.currentIrradiacao = await window.zorixStorage.getIrradiacao(cidade, estado);
                }
                
                // Recalcular com novos dados
                this.calcularPayback();
                
            } catch (error) {
                console.warn('Erro ao atualizar dados automáticos:', error);
            }
        }
    }

    /**
     * Adiciona nova linha de módulos
     */
    adicionarModulo() {
        const container = document.getElementById('modulosList');
        const novaLinha = document.createElement('div');
        novaLinha.innerHTML = `
            <div class="grid grid-cols-12 gap-2 items-center mb-2">
                <div class="col-span-2">
                    <input type="number" placeholder="Qtd" value="10" 
                        onchange="clientesV5.calcularKWp()" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                </div>
                <div class="col-span-6">
                    <input type="text" placeholder="Descrição do módulo" value="Painel 550W Monocristalino" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                </div>
                <div class="col-span-3">
                    <input type="number" placeholder="Potência (Wp)" value="550" 
                        step="1" onchange="clientesV5.calcularKWp()" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                </div>
                <div class="col-span-1 text-center">
                    <button onclick="clientesV5.removerModulo(${container.children.length})" 
                        class="text-red-600 hover:text-red-700 p-1">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(novaLinha.firstElementChild);
        this.calcularKWp();
    }

    /**
     * Remove linha de módulos
     */
    removerModulo(index) {
        const container = document.getElementById('modulosList');
        if (container.children.length > 1) {
            container.removeChild(container.children[index]);
            this.calcularKWp();
        }
    }

    /**
     * Adiciona nova linha de inversores
     */
    adicionarInversor() {
        const container = document.getElementById('inversoresList');
        const novaLinha = document.createElement('div');
        novaLinha.innerHTML = `
            <div class="grid grid-cols-12 gap-2 items-center mb-2">
                <div class="col-span-2">
                    <input type="number" placeholder="Qtd" value="1" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                </div>
                <div class="col-span-6">
                    <input type="text" placeholder="Descrição do inversor" value="Inversor String 5kW" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                </div>
                <div class="col-span-3">
                    <input type="number" placeholder="Potência (kW)" value="5.0" 
                        step="0.1" 
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                </div>
                <div class="col-span-1 text-center">
                    <button onclick="clientesV5.removerInversor(${container.children.length})" 
                        class="text-red-600 hover:text-red-700 p-1">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(novaLinha.firstElementChild);
    }

    /**
     * Remove linha de inversores
     */
    removerInversor(index) {
        const container = document.getElementById('inversoresList');
        if (container.children.length > 1) {
            container.removeChild(container.children[index]);
        }
    }

    /**
     * Calcula a geração média mensal automaticamente
     */
    calcularGeracaoMedia() {
        const kWp = this.calcularKWpDireto();
        const irradiacao = parseFloat(document.getElementById('projetoIrradiacao')?.value) || 5.5;
        
        // Fórmula: kWp × Irradiação × 30 dias × Fator de perdas (0.82)
        const geracaoMensal = kWp * irradiacao * 30 * 0.82;
        
        const geracaoInput = document.getElementById('geracaoMediaMensal');
        if (geracaoInput) {
            geracaoInput.value = Math.round(geracaoMensal);
        }
        
        return geracaoMensal;
    }

    /**
     * Calcula kWp total dos módulos (versão direta sem side effects)
     */
    calcularKWpDireto() {
        const container = document.getElementById('modulosList');
        if (!container) return 0;

        let kWpTotal = 0;
        
        Array.from(container.children).forEach(row => {
            const inputs = row.querySelectorAll('input');
            if (inputs.length >= 3) {
                const quantidade = parseFloat(inputs[0].value) || 0;
                const potencia = parseFloat(inputs[2].value) || 0;
                kWpTotal += (quantidade * potencia / 1000);
            }
        });

        return kWpTotal;
    }

    /**
     * Calcula kWp total dos módulos
     */
    calcularKWp() {
        const container = document.getElementById('modulosList');
        if (!container) return 0;

        let kWpTotal = 0;
        
        Array.from(container.children).forEach(row => {
            const inputs = row.querySelectorAll('input');
            if (inputs.length >= 3) {
                const quantidade = parseFloat(inputs[0].value) || 0;
                const potencia = parseFloat(inputs[2].value) || 0;
                kWpTotal += (quantidade * potencia / 1000);
            }
        });

        const display = document.getElementById('kWpCalculado');
        if (display) {
            display.textContent = `${kWpTotal.toFixed(1)} kWp`;
        }

        // Calcular geração média mensal
        this.calcularGeracaoMedia();
        
        // Recalcular payback com novo kWp
        this.calcularPayback();

        return kWpTotal;
    }

    /**
     * Calcula payback e outros valores automáticos
     */
    async calcularPayback() {
        try {
            const kWp = this.calcularKWp();
            const precoVenda = parseFloat(document.getElementById('precoVendaTotal')?.value) || 0;
            const consumoMensal = parseFloat(document.getElementById('mediaConsumo')?.value) || 0;
            
            if (kWp === 0 || precoVenda === 0) {
                this.atualizarResultados(0, 0, 0);
                return;
            }
            
            // Usar irradiação e tarifa já carregadas ou padrão
            const irradiacao = this.currentIrradiacao || {
                jan: 4.5, fev: 4.6, mar: 4.3, abr: 4.0, mai: 3.5, jun: 3.2,
                jul: 3.4, ago: 4.0, set: 4.4, out: 4.7, nov: 4.8, dez: 4.6
            };
            
            const tarifa = this.currentTarifa || 0.80;
            const fatorPerdas = 0.82; // 18% de perdas
            
            // Usar geração mensal do campo editável
            const geracaoMensalEditavel = parseFloat(document.getElementById('geracaoMediaMensal')?.value) || 0;
            const geracaoAnual = geracaoMensalEditavel * 12;
            
            // Calcular economia anual
            const consumoAnual = consumoMensal * 12;
            const energiaUtilizada = Math.min(consumoAnual, geracaoAnual);
            const economiaAnual = energiaUtilizada * tarifa;
            
            // Calcular payback
            const payback = economiaAnual > 0 ? precoVenda / economiaAnual : 0;
            
            this.atualizarResultados(geracaoAnual, economiaAnual, payback);
            
        } catch (error) {
            console.error('Erro ao calcular payback:', error);
            this.atualizarResultados(0, 0, 0);
        }
    }

    /**
     * Atualiza displays de resultados
     */
    atualizarResultados(geracaoAnual, economiaAnual, payback) {
        const geracaoDisplay = document.getElementById('geracaoAnual');
        const economiaDisplay = document.getElementById('economiaAnual');
        const paybackDisplay = document.getElementById('paybackAnos');
        
        if (geracaoDisplay) {
            geracaoDisplay.textContent = `${Math.round(geracaoAnual).toLocaleString('pt-BR')} kWh`;
        }
        
        if (economiaDisplay) {
            economiaDisplay.textContent = `R$ ${Math.round(economiaAnual).toLocaleString('pt-BR')}`;
        }
        
        if (paybackDisplay) {
            paybackDisplay.textContent = `${payback.toFixed(1)} anos`;
        }
    }

    /**
     * Salva cliente
     */
    salvarCliente(clienteId = '') {
        try {
            const nome = document.getElementById('clienteNome').value.trim();
            const email = document.getElementById('clienteEmail').value.trim();
            const telefone = document.getElementById('clienteTelefone').value.trim();
            const vendedorId = document.getElementById('clienteVendedor').value;

            if (!nome || !email || !telefone) {
                this.showNotification('Todos os campos são obrigatórios', 'error');
                return;
            }

            const clienteData = { nome, email, telefone, vendedor_id: vendedorId };
            if (clienteId) clienteData.id = clienteId;

            const savedId = window.zorixStorage.saveCliente(clienteData);
            
            if (savedId) {
                this.showNotification('Cliente salvo com sucesso', 'success');
                this.fecharModal('modalCliente');
                this.renderizar();
            } else {
                this.showNotification('Não foi possível salvar. Tente novamente.', 'error');
            }

        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            this.showNotification('Não foi possível salvar. Tente novamente.', 'error');
        }
    }

    /**
     * Salva projeto
     */
    async salvarProjeto(clienteId, projetoId = '') {
        try {
            console.log('🔍 Iniciando salvamento do projeto...');
            
            // Verificar se elementos existem antes de acessar
            const tituloEl = document.getElementById('projetoTitulo');
            const cidadeEl = document.getElementById('projetoCidade');
            const estadoEl = document.getElementById('projetoEstado');
            const enderecoEl = document.getElementById('projetoEndereco');
            const concessionariaEl = document.getElementById('projetoConcessionaria');
            const outrosMateriaisEl = document.getElementById('outrosMateriais');
            const precoVendaEl = document.getElementById('precoVendaTotal');
            const consumoMedioEl = document.getElementById('mediaConsumo');
            const statusEl = document.getElementById('projetoStatus');

            if (!tituloEl || !cidadeEl || !estadoEl || !precoVendaEl || !consumoMedioEl || !statusEl) {
                console.error('❌ Elementos obrigatórios não encontrados:', {
                    titulo: !!tituloEl, cidade: !!cidadeEl, estado: !!estadoEl,
                    precoVenda: !!precoVendaEl, consumoMedio: !!consumoMedioEl, status: !!statusEl
                });
                this.showNotification('Erro no formulário. Recarregue a página e tente novamente.', 'error');
                return;
            }

            const titulo = tituloEl.value.trim();
            const cidade = cidadeEl.value.trim();
            const estado = estadoEl.value;
            const endereco = enderecoEl ? enderecoEl.value.trim() : '';
            const concessionaria = concessionariaEl ? concessionariaEl.value.trim() : '';
            const outrosMateriais = outrosMateriaisEl ? outrosMateriaisEl.value.trim() : '';
            const precoVenda = parseFloat(precoVendaEl.value) || 0;
            const consumoMedio = parseFloat(consumoMedioEl.value) || 0;
            const status = statusEl.value;

            console.log('📋 Dados coletados:', { titulo, cidade, estado, precoVenda, consumoMedio, status });

            if (!titulo || !cidade || !estado || precoVenda <= 0 || consumoMedio <= 0) {
                this.showNotification('Preencha todos os campos obrigatórios (incluindo Média de Consumo)', 'error');
                return;
            }

            // Coletar módulos
            const modulosContainer = document.getElementById('modulosList');
            const modulos = [];
            if (modulosContainer) {
                Array.from(modulosContainer.children).forEach(row => {
                    const inputs = row.querySelectorAll('input');
                    if (inputs.length >= 3) {
                        modulos.push({
                            quantidade: parseFloat(inputs[0].value) || 0,
                            descricao: inputs[1].value ? inputs[1].value.trim() : '',
                            potencia_wp: parseFloat(inputs[2].value) || 0
                        });
                    }
                });
            }
            console.log('🔧 Módulos coletados:', modulos);

            // Coletar inversores
            const inversoresContainer = document.getElementById('inversoresList');
            const inversores = [];
            if (inversoresContainer) {
                Array.from(inversoresContainer.children).forEach(row => {
                    const inputs = row.querySelectorAll('input');
                    if (inputs.length >= 3) {
                        inversores.push({
                            quantidade: parseFloat(inputs[0].value) || 0,
                            descricao: inputs[1].value ? inputs[1].value.trim() : '',
                            potencia_kw: parseFloat(inputs[2].value) || 0
                        });
                    }
                });
            }
            console.log('⚡ Inversores coletados:', inversores);

            // Coletar dados editáveis
            const kWp = this.calcularKWpDireto();
            const irradiacaoEl = document.getElementById('projetoIrradiacao');
            const geracaoEl = document.getElementById('geracaoMediaMensal');
            
            const irradiacaoManual = irradiacaoEl ? parseFloat(irradiacaoEl.value) || 5.5 : 5.5;
            const geracaoMediaMensal = geracaoEl ? parseFloat(geracaoEl.value) || 0 : 0;
            
            console.log('⚡ Dados técnicos:', { kWp, irradiacaoManual, geracaoMediaMensal });
            
            // Calcular valores automáticos
            const geracaoAnual = geracaoMediaMensal * 12;
            const economiaAnual = Math.min(consumoMedio * 12, geracaoAnual) * 0.80; // Tarifa padrão
            const payback = precoVenda > 0 && economiaAnual > 0 ? precoVenda / economiaAnual : 0;

            // Coletar novos campos
            const mediaConsumoEl = document.getElementById('mediaConsumo');
            const tipoInstalacaoEl = document.getElementById('tipoInstalacao');
            const tipoTelhadoEl = document.getElementById('tipoTelhado');
            
            const mediaConsumoNovo = mediaConsumoEl ? parseFloat(mediaConsumoEl.value) || 0 : consumoMedio;
            const tipoInstalacao = tipoInstalacaoEl ? tipoInstalacaoEl.value || 'telhado' : 'telhado';
            const tipoTelhado = tipoTelhadoEl ? tipoTelhadoEl.value || 'metalico' : 'metalico';
            
            console.log('🆕 Novos campos:', { mediaConsumoNovo, tipoInstalacao, tipoTelhado });

            // Coletar dados de pagamento
            const tipoPagamentoEl = document.getElementById('tipoPagamento');
            const numeroParcelasEl = document.getElementById('numeroParcelas');
            const dataPrimeiraParcelaEl = document.getElementById('dataPrimeiraParcela');
            const periodicidadeParcelasEl = document.getElementById('periodicidadeParcelas');
            
            const tipoPagamento = tipoPagamentoEl ? tipoPagamentoEl.value || 'avista' : 'avista';
            const numeroParcelas = numeroParcelasEl ? parseInt(numeroParcelasEl.value) || 1 : 1;
            const dataPrimeiraParcela = dataPrimeiraParcelaEl ? dataPrimeiraParcelaEl.value || '' : '';
            const periodicidadeParcelas = periodicidadeParcelasEl ? periodicidadeParcelasEl.value || 'mensal' : 'mensal';
            
            console.log('💳 Dados de pagamento:', { tipoPagamento, numeroParcelas, dataPrimeiraParcela, periodicidadeParcelas });

            const projetoData = {
                clienteId,
                titulo,
                cidade,
                estado,
                endereco,
                concessionaria,
                modulos,
                inversores,
                outros_materiais: outrosMateriais,
                kWp,
                preco_venda_total: precoVenda,
                consumo_medio_kwh_mes: consumoMedio,
                media_consumo: mediaConsumoNovo,
                valor_entrada: parseFloat(document.getElementById('valorEntrada')?.value) || 0,
                tipo_instalacao: tipoInstalacao,
                tipo_telhado: tipoTelhado,
                fator_perdas: 0.82,
                status,
                irradiacao: irradiacaoManual,
                geracao_media_mensal: geracaoMediaMensal,
                economia_anual: economiaAnual,
                payback_anos: payback,
                tipo_pagamento: tipoPagamento,
                numero_parcelas: numeroParcelas,
                data_primeira_parcela: dataPrimeiraParcela,
                periodicidade_parcelas: periodicidadeParcelas
            };

            if (projetoId) projetoData.id = projetoId;

            console.log('💾 Tentando salvar projeto:', projetoData);
            const savedId = window.zorixStorage.saveProjeto(projetoData);
            console.log('📝 Resultado do salvamento:', savedId);
            
            if (savedId) {
                console.log('✅ Projeto salvo com ID:', savedId);
                
                // Criar contas a receber se for parcelado e data futura
                await this.criarContasReceber(savedId, projetoData);
                
                this.showNotification('Projeto salvo com sucesso', 'success');
                this.fecharModal('modalProjeto');
                this.renderizar();
            } else {
                console.error('❌ Falha no salvamento - savedId é falsy:', savedId);
                this.showNotification('Não foi possível salvar. Tente novamente.', 'error');
            }

        } catch (error) {
            console.error('Erro ao salvar projeto:', error);
            this.showNotification('Não foi possível salvar. Tente novamente.', 'error');
        }
    }

    /**
     * Cria contas a receber baseado no projeto
     */
    async criarContasReceber(projetoId, projetoData) {
        try {
            // Só criar contas se for parcelado ou entrada+parcelado e com data futura
            if ((projetoData.tipo_pagamento !== 'parcelado' && projetoData.tipo_pagamento !== 'entrada_parcelado') || !projetoData.data_primeira_parcela) {
                return;
            }

            const cliente = window.zorixStorage.getCliente(projetoData.clienteId);
            if (!cliente) return;

            const valorParcela = projetoData.preco_venda_total / projetoData.numero_parcelas;
            const hoje = new Date();

            // Limpar contas anteriores deste projeto
            await this.removerContasReceberProjeto(projetoId);

            // Criar parcelas futuras
            for (let i = 0; i < projetoData.numero_parcelas; i++) {
                const dataParcela = this.calcularDataParcela(
                    projetoData.data_primeira_parcela, 
                    i, 
                    projetoData.periodicidade_parcelas
                );
                
                const dataVencimento = new Date(dataParcela + 'T00:00:00');
                
                // Só criar conta se a data for futura
                if (dataVencimento > hoje) {
                    const contaReceber = {
                        id: this.generateId(),
                        cliente_id: projetoData.clienteId,
                        cliente_nome: cliente.nome,
                        projeto_id: projetoId,
                        descricao: `${projetoData.titulo} - Parcela ${i + 1}/${projetoData.numero_parcelas}`,
                        valor: valorParcela,
                        vencimento: dataParcela,
                        origem: 'projeto_parcelado',
                        status: 'pendente',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };

                    if (window.contasManager) {
                        await window.contasManager.addContaReceber(contaReceber);
                    }
                }
            }

        } catch (error) {
            console.error('Erro ao criar contas a receber:', error);
        }
    }

    /**
     * Remove contas a receber de um projeto
     */
    async removerContasReceberProjeto(projetoId) {
        try {
            const contas = JSON.parse(localStorage.getItem('zorix:contas_receber') || '[]');
            const contasFiltered = contas.filter(conta => conta.projeto_id !== projetoId);
            localStorage.setItem('zorix:contas_receber', JSON.stringify(contasFiltered));
        } catch (error) {
            console.error('Erro ao remover contas a receber:', error);
        }
    }

    /**
     * Gera ID único
     */
    generateId() {
        return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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

        const modal = document.getElementById('modalVisualizar');
        modal.classList.remove('hidden');

        document.getElementById('visualizarContent').innerHTML = `
            <div class="space-y-4">
                <div class="text-center border-b pb-4">
                    <h2 class="text-xl font-bold text-gray-900">${projeto.titulo}</h2>
                    <p class="text-gray-600">Cliente: ${cliente.nome}</p>
                    <span class="inline-block px-3 py-1 text-sm font-medium rounded-full 
                        ${projeto.status === 'FINALIZADO' ? 'bg-green-100 text-green-800' : 
                          projeto.status === 'EM_ANDAMENTO' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}">
                        ${projeto.status}
                    </span>
                </div>

                <div class="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong>Localização:</strong> ${projeto.cidade}, ${projeto.estado}<br>
                        <strong>Concessionária:</strong> ${projeto.concessionaria}<br>
                        <strong>Potência:</strong> ${projeto.kWp?.toFixed(1) || 0} kWp
                    </div>
                    <div>
                        <strong>Consumo Médio:</strong> ${projeto.consumo_medio_kwh_mes || 0} kWh/mês<br>
                        <strong>Valor do Sistema:</strong> R$ ${(projeto.preco_venda_total || 0).toLocaleString('pt-BR')}<br>
                        <strong>Payback:</strong> ${(projeto.payback_anos || 0).toFixed(1)} anos
                    </div>
                </div>

                <div>
                    <h4 class="font-semibold mb-2">Módulos:</h4>
                    ${(projeto.modulos || []).map(m => 
                        `<div class="text-sm">${m.quantidade}x ${m.descricao} - ${m.potencia_wp}Wp</div>`
                    ).join('')}
                </div>

                <div>
                    <h4 class="font-semibold mb-2">Inversores:</h4>
                    ${(projeto.inversores || []).map(i => 
                        `<div class="text-sm">${i.quantidade}x ${i.descricao} - ${i.potencia_kw}kW</div>`
                    ).join('')}
                </div>

                ${projeto.outros_materiais ? `
                    <div>
                        <h4 class="font-semibold mb-2">Outros Materiais:</h4>
                        <div class="text-sm whitespace-pre-line bg-gray-50 p-3 rounded">${projeto.outros_materiais}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Gera proposta
     */
    async gerarProposta(projetoId) {
        const projeto = window.zorixStorage.getProjeto(projetoId);
        const cliente = window.zorixStorage.getCliente(projeto.clienteId);
        
        if (!projeto || !cliente) {
            this.showNotification('Projeto ou cliente não encontrado', 'error');
            return;
        }

        // Permitir gerar proposta em qualquer status
        // if (projeto.status !== 'FINALIZADO') {
        //     this.showNotification('Finalize o projeto para gerar a proposta.', 'error');
        //     return;
        // }

        try {
            if (window.propostaV5Generator) {
                const numeroProposta = await window.propostaV5Generator.gerarPropostaPremium(projeto, cliente);
                const proposta = window.zorixStorage.gerarProposta(projetoId);
                
                this.showNotification(`Proposta ${numeroProposta} gerada com sucesso!`, 'success');
            } else {
                this.showNotification('Gerador de proposta não encontrado', 'error');
            }
        } catch (error) {
            console.error('Erro ao gerar proposta:', error);
            this.showNotification('Não foi possível gerar a proposta. Tente novamente.', 'error');
        }
    }

    /**
     * Exclui projeto com confirmação
     */
    async excluirProjeto(projetoId) {
        try {
            const projeto = window.zorixStorage.getProjeto(projetoId);
            if (!projeto) {
                this.showNotification('Projeto não encontrado', 'error');
                return;
            }

            // Confirmação de exclusão
            const confirmacao = confirm(
                `⚠️ ATENÇÃO: Deseja realmente excluir o projeto?\n\n` +
                `📋 Projeto: ${projeto.titulo || 'Sem título'}\n` +
                `💰 Valor: R$ ${(projeto.preco_venda_total || 0).toLocaleString('pt-BR')}\n\n` +
                `Esta ação não pode ser desfeita!`
            );

            if (!confirmacao) {
                return;
            }

            // Excluir o projeto
            const sucesso = window.zorixStorage.deleteProjeto(projetoId);
            
            if (sucesso) {
                this.showNotification('Projeto excluído com sucesso!', 'success');
                this.renderizar(); // Atualizar a lista
            } else {
                this.showNotification('Erro ao excluir projeto', 'error');
            }

        } catch (error) {
            console.error('Erro ao excluir projeto:', error);
            this.showNotification('Erro ao excluir projeto', 'error');
        }
    }

    /**
     * Reset do portfólio
     */
    resetPortfolio() {
        if (confirm('⚠️ Tem certeza que deseja zerar todos os projetos?\n\nOs clientes serão preservados e um backup será criado.')) {
            const sucesso = window.zorixStorage.resetPortfolio(true);
            
            if (sucesso) {
                this.showNotification('Projetos zerados com sucesso.', 'success');
                this.renderizar();
            } else {
                this.showNotification('Não foi possível zerar os projetos. Tente novamente.', 'error');
            }
        }
    }

    /**
     * Renderiza modais
     */
    renderizarModals() {
        return `
            <!-- Modal Cliente -->
            <div id="modalCliente" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-lg max-w-lg w-full">
                    <div class="flex justify-between items-center p-4 border-b">
                        <h2 id="modalClienteTitle" class="text-lg font-semibold">Novo Cliente</h2>
                        <button onclick="clientesV5.fecharModal('modalCliente')" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="p-4" id="clienteForm"></div>
                </div>
            </div>

            <!-- Modal Projeto -->
            <div id="modalProjeto" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
                        <h2 id="modalProjetoTitle" class="text-lg font-semibold">Novo Projeto</h2>
                        <button onclick="clientesV5.fecharModal('modalProjeto')" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="p-4" id="projetoForm"></div>
                </div>
            </div>

            <!-- Modal Visualizar -->
            <div id="modalVisualizar" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-center p-4 border-b">
                        <h2 class="text-lg font-semibold">Detalhes do Projeto</h2>
                        <button onclick="clientesV5.fecharModal('modalVisualizar')" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="p-4" id="visualizarContent"></div>
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
     * Gera opções de parcelas
     */
    gerarOpcoesParcelas(selectedParcelas = 1) {
        let options = '';
        for (let i = 1; i <= 24; i++) {
            options += `<option value="${i}" ${i === selectedParcelas ? 'selected' : ''}>${i}x</option>`;
        }
        return options;
    }

    /**
     * Alterna exibição do parcelamento
     */
    toggleParcelamento() {
        const tipoPagamento = document.getElementById('tipoPagamento').value;
        const parcelamentoContainer = document.getElementById('parcelamentoContainer');
        const parcelamentoDetalhes = document.getElementById('parcelamentoDetalhes');
        
        if (tipoPagamento === 'parcelado' || tipoPagamento === 'entrada_parcelado') {
            parcelamentoContainer.classList.remove('hidden');
            parcelamentoDetalhes.classList.remove('hidden');
            
            // Mostrar/ocultar campo de entrada baseado no tipo
            if (tipoPagamento === 'entrada_parcelado') {
                entradaContainer.classList.remove('hidden');
            } else {
                entradaContainer.classList.add('hidden');
            }
            
            this.calcularParcelas();
            
            // Definir data padrão se não estiver preenchida
            const dataPrimeiraParcela = document.getElementById('dataPrimeiraParcela');
            if (!dataPrimeiraParcela.value) {
                const hoje = window.getCurrentDateBR ? window.getCurrentDateBR() : new Date().toISOString().split('T')[0];
                dataPrimeiraParcela.value = hoje;
            }
        } else {
            parcelamentoContainer.classList.add('hidden');
            parcelamentoDetalhes.classList.add('hidden');
            entradaContainer.classList.add('hidden');
        }
    }

    /**
     * Calcula parcelas
     */
    calcularParcelas() {
        const precoTotal = parseFloat(document.getElementById('precoVendaTotal').value) || 0;
        const numeroParcelas = parseInt(document.getElementById('numeroParcelas').value) || 1;
        const tipoPagamento = document.getElementById('tipoPagamento').value;
        const valorEntrada = parseFloat(document.getElementById('valorEntrada')?.value) || 0;
        
        let valorParcela;
        
        if (tipoPagamento === 'entrada_parcelado') {
            // Entrada + Restante Parcelado: só parcelar o saldo após a entrada
            const saldoParcelado = precoTotal - valorEntrada;
            valorParcela = saldoParcelado / numeroParcelas;
        } else {
            // Parcelado normal: valor total dividido pelas parcelas
            valorParcela = precoTotal / numeroParcelas;
        }
        
        // Atualizar campo de valor da parcela
        const valorParcelaInput = document.getElementById('valorParcela');
        if (valorParcelaInput) {
            valorParcelaInput.value = window.formatCurrencyBR ? 
                window.formatCurrencyBR(valorParcela) : 
                `R$ ${valorParcela.toFixed(2)}`;
        }
        
        // Atualizar saldo a parcelar (se entrada + parcelado)
        if (tipoPagamento === 'entrada_parcelado') {
            const saldoParcelarDiv = document.getElementById('saldoParcelar');
            const saldoParcelado = precoTotal - valorEntrada;
            if (saldoParcelarDiv) {
                saldoParcelarDiv.textContent = window.formatCurrencyBR ? 
                    window.formatCurrencyBR(saldoParcelado) : 
                    `R$ ${saldoParcelado.toFixed(2)}`;
            }
        }
        
        // Gerar cronograma
        this.gerarCronogramaParcelas();
    }

    /**
     * Calcula kWp sugerido baseado no consumo e irradiação solar
     */
    calcularKwpSugerido() {
        try {
            const mediaConsumo = parseFloat(document.getElementById('mediaConsumo')?.value) || 0;
            const irradiacao = parseFloat(document.getElementById('projetoIrradiacao')?.value) || 5.5;
            
            if (mediaConsumo > 0) {
                // Fórmula mais precisa: Consumo mensal ÷ (Irradiação × 30 dias × Fator de perdas 82%)
                const kwpSugerido = mediaConsumo / (irradiacao * 30 * 0.82);
                
                // Atualizar display do kWp sugerido
                const kwpSugeridoDisplay = document.getElementById('kwpSugerido');
                if (kwpSugeridoDisplay) {
                    kwpSugeridoDisplay.textContent = `${kwpSugerido.toFixed(2)} kWp`;
                }
                
                // Buscar irradiação solar automaticamente baseado na cidade
                this.buscarIrradiacaoPorCidade();
                
                // Recalcular geração média e payback
                this.calcularGeracaoMedia();
                this.calcularPayback();
                
                console.log(`Consumo: ${mediaConsumo} kWh/mês + Irradiação: ${irradiacao} HSP/dia → kWp sugerido: ${kwpSugerido.toFixed(2)} kWp`);
            } else {
                // Limpar display se não houver consumo
                const kwpSugeridoDisplay = document.getElementById('kwpSugerido');
                if (kwpSugeridoDisplay) {
                    kwpSugeridoDisplay.textContent = '0.0 kWp';
                }
            }
        } catch (error) {
            console.error('Erro ao calcular kWp sugerido:', error);
        }
    }

    /**
     * Controla exibição do campo Tipo de Telhado baseado no tipo de instalação
     */
    toggleTipoTelhado() {
        try {
            const tipoInstalacao = document.getElementById('tipoInstalacao')?.value;
            const tipoTelhadoContainer = document.getElementById('tipoTelhadoContainer');
            
            if (tipoTelhadoContainer) {
                if (tipoInstalacao === 'telhado') {
                    tipoTelhadoContainer.classList.remove('hidden');
                } else {
                    tipoTelhadoContainer.classList.add('hidden');
                }
            }
        } catch (error) {
            console.error('Erro ao alternar tipo de telhado:', error);
        }
    }

    /**
     * Busca irradiação solar automaticamente baseado na cidade
     */
    async buscarIrradiacaoPorCidade() {
        try {
            const cidade = document.getElementById('projetoCidade')?.value?.trim();
            const estado = document.getElementById('projetoEstado')?.value;
            
            if (!cidade || !estado) return;
            
            // Base de dados expandida de irradiação por região/estado (HSP/dia)
            const irradiacaoPorEstado = {
                'AC': 4.8, 'AL': 5.2, 'AP': 5.0, 'AM': 4.5, 'BA': 5.5,
                'CE': 5.8, 'DF': 5.3, 'ES': 5.0, 'GO': 5.4, 'MA': 5.3,
                'MT': 5.5, 'MS': 5.2, 'MG': 5.2, 'PA': 4.8, 'PB': 5.7,
                'PR': 4.8, 'PE': 5.6, 'PI': 5.5, 'RJ': 4.9, 'RN': 5.9,
                'RS': 4.5, 'RO': 4.6, 'RR': 4.9, 'SC': 4.4, 'SP': 4.9,
                'SE': 5.4, 'TO': 5.3
            };
            
            // Ajustes específicos para grandes cidades
            const ajustesPorCidade = {
                'São Paulo': 4.8, 'Rio de Janeiro': 4.7, 'Brasília': 5.3,
                'Salvador': 5.6, 'Fortaleza': 5.9, 'Belo Horizonte': 5.1,
                'Manaus': 4.3, 'Curitiba': 4.6, 'Recife': 5.5, 'Porto Alegre': 4.3,
                'Goiânia': 5.4, 'Belém': 4.7, 'Guarulhos': 4.8, 'Campinas': 4.9,
                'São Luís': 5.4, 'São Gonçalo': 4.7, 'Maceió': 5.3, 'Duque de Caxias': 4.7,
                'Natal': 6.0, 'Teresina': 5.6, 'Campo Grande': 5.3, 'Nova Iguaçu': 4.7,
                'São Bernardo do Campo': 4.8, 'João Pessoa': 5.8, 'Santo André': 4.8,
                'Osasco': 4.8, 'Jaboatão dos Guararapes': 5.5, 'Contagem': 5.1,
                'Aracaju': 5.5, 'Cuiabá': 5.6, 'Sorocaba': 4.9, 'Feira de Santana': 5.4,
                'Joinville': 4.3, 'Juiz de Fora': 5.0, 'Londrina': 4.9, 'Aparecida de Goiânia': 5.4,
                'Niterói': 4.8, 'Belford Roxo': 4.7, 'Caxias do Sul': 4.2, 'Campos dos Goytacazes': 5.1,
                'Vila Velha': 5.1, 'Florianópolis': 4.5, 'Serra': 5.1, 'Diadema': 4.8,
                'Mauá': 4.8, 'Ribeirão Preto': 5.2, 'São José dos Campos': 4.7, 'Carapicuíba': 4.8,
                'Olinda': 5.5, 'Campina Grande': 5.8, 'São Vicente': 4.6, 'Montes Claros': 5.4,
                'Mogi das Cruzes': 4.7, 'Betim': 5.1, 'Piracicaba': 5.0, 'Cariacica': 5.1,
                'Jundiaí': 4.9, 'Anápolis': 5.4, 'Bauru': 5.1, 'Santos': 4.6,
                'Caucaia': 5.9, 'Franca': 5.3, 'São Carlos': 5.1, 'Canoas': 4.3,
                'Caruaru': 5.7, 'Alagoinhas': 5.4, 'Araraquara': 5.1, 'Volta Redonda': 4.8,
                'Petrolina': 6.1, 'Passo Fundo': 4.4, 'Praia Grande': 4.6, 'Dourados': 5.4,
                'Santa Maria': 4.6, 'Suzano': 4.8, 'Pelotas': 4.2, 'Governador Valadares': 5.3
            };
            
            // Primeiro tentar ajuste específico da cidade, senão usar do estado
            const irradiacaoEstimada = ajustesPorCidade[cidade] || irradiacaoPorEstado[estado] || 5.0;
            
            // Atualizar campo de irradiação apenas se não foi editado manualmente
            const irradiacaoInput = document.getElementById('projetoIrradiacao');
            if (irradiacaoInput && !irradiacaoInput.hasAttribute('data-editado-manual')) {
                const valorAnterior = irradiacaoInput.value;
                irradiacaoInput.value = irradiacaoEstimada;
                
                // Recalcular kWp sugerido se o valor mudou
                if (valorAnterior !== irradiacaoEstimada.toString()) {
                    this.calcularKwpSugerido();
                }
                
                console.log(`Irradiação automática para ${cidade}/${estado}: ${irradiacaoEstimada} HSP/dia`);
            }
            
        } catch (error) {
            console.error('Erro ao buscar irradiação por cidade:', error);
        }
    }

    /**
     * Gera cronograma de parcelas
     */
    gerarCronogramaParcelas() {
        const numeroParcelas = parseInt(document.getElementById('numeroParcelas').value) || 1;
        const valorTotal = parseFloat(document.getElementById('precoVendaTotal').value) || 0;
        const dataPrimeiraParcela = document.getElementById('dataPrimeiraParcela').value;
        const periodicidade = document.getElementById('periodicidadeParcelas').value;
        const tipoPagamento = document.getElementById('tipoPagamento').value;
        const valorEntrada = parseFloat(document.getElementById('valorEntrada')?.value) || 0;
        
        if (!dataPrimeiraParcela || valorTotal <= 0) {
            return;
        }
        
        let valorParcela;
        if (tipoPagamento === 'entrada_parcelado') {
            const saldoParcelado = valorTotal - valorEntrada;
            valorParcela = saldoParcelado / numeroParcelas;
        } else {
            valorParcela = valorTotal / numeroParcelas;
        }
        const listaParcelas = document.getElementById('listaParcelas');
        
        let html = '<div class="space-y-1">';
        
        for (let i = 0; i < numeroParcelas; i++) {
            const dataParcela = this.calcularDataParcela(dataPrimeiraParcela, i, periodicidade);
            const dataFormatada = window.formatDateBR ? 
                window.formatDateBR(dataParcela) : 
                dataParcela;
            const valorFormatado = window.formatCurrencyBR ? 
                window.formatCurrencyBR(valorParcela) : 
                `R$ ${valorParcela.toFixed(2)}`;
                
            html += `
                <div class="flex justify-between items-center py-1 ${i % 2 === 0 ? 'bg-gray-50' : ''} px-2 rounded">
                    <span>${i + 1}ª parcela</span>
                    <span>${dataFormatada}</span>
                    <span class="font-medium">${valorFormatado}</span>
                </div>
            `;
        }
        
        html += '</div>';
        listaParcelas.innerHTML = html;
    }

    /**
     * Calcula data da parcela baseada na periodicidade
     */
    calcularDataParcela(dataInicial, indiceParcela, periodicidade) {
        const data = new Date(dataInicial + 'T00:00:00');
        
        switch (periodicidade) {
            case 'semanal':
                data.setDate(data.getDate() + (indiceParcela * 7));
                break;
            case 'quinzenal':
                data.setDate(data.getDate() + (indiceParcela * 15));
                break;
            case 'mensal':
            default:
                data.setMonth(data.getMonth() + indiceParcela);
                break;
        }
        
        return data.toISOString().split('T')[0];
    }

    /**
     * Configura eventos da interface
     */
    configurarEventos() {
        // Eventos de modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.fecharModal('modalCliente');
                this.fecharModal('modalProjeto');
                this.fecharModal('modalVisualizar');
            }
        });

        // Configurar busca em tempo real
        const campoBusca = document.getElementById('buscaClientes');
        if (campoBusca) {
            campoBusca.addEventListener('input', (e) => {
                this.filtrarClientes(e.target.value);
            });
            
            // Limpar busca com ESC
            campoBusca.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.limparBusca();
                }
            });
        }
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
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-4 py-2 rounded shadow-lg z-50 text-sm`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 4000);
    }

    /**
     * Filtra clientes baseado no texto de busca
     */
    filtrarClientes(texto) {
        const termoBusca = texto.toLowerCase().trim();
        const clientesContainer = document.querySelector('.space-y-2');
        const limparBtn = document.getElementById('limparBusca');
        const clientesCount = document.getElementById('clientesCount');
        
        if (!clientesContainer) return;
        
        // Mostrar/esconder botão limpar
        if (termoBusca) {
            limparBtn.classList.remove('hidden');
        } else {
            limparBtn.classList.add('hidden');
        }
        
        // Obter todos os clientes
        const todosClientes = window.zorixStorage.listClientes();
        let clientesFiltrados = todosClientes;
        
        // Filtrar se há termo de busca
        if (termoBusca) {
            clientesFiltrados = todosClientes.filter(cliente => {
                return cliente.nome.toLowerCase().includes(termoBusca) ||
                       cliente.email.toLowerCase().includes(termoBusca) ||
                       cliente.telefone.toLowerCase().includes(termoBusca);
            });
        }
        
        // Atualizar contagem
        const totalProjetos = window.zorixStorage.listProjetos().length;
        if (termoBusca) {
            clientesCount.innerHTML = `${clientesFiltrados.length} de ${todosClientes.length} cliente(s) • ${totalProjetos} projeto(s)`;
        } else {
            clientesCount.innerHTML = `${todosClientes.length} cliente(s) • ${totalProjetos} projeto(s)`;
        }
        
        // Renderizar clientes filtrados
        if (clientesFiltrados.length === 0) {
            clientesContainer.innerHTML = `
                <div class="text-center py-12 bg-white rounded-lg shadow">
                    <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum cliente encontrado</h3>
                    <p class="text-gray-500 mb-4">Tente buscar por outro termo</p>
                    <button onclick="clientesV5.limparBusca()" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition duration-200">
                        Limpar Busca
                    </button>
                </div>
            `;
        } else {
            clientesContainer.innerHTML = clientesFiltrados
                .map(cliente => this.renderizarCardCompacto(cliente))
                .join('');
        }
    }

    /**
     * Limpa a busca de clientes
     */
    limparBusca() {
        const campoBusca = document.getElementById('buscaClientes');
        const limparBtn = document.getElementById('limparBusca');
        
        if (campoBusca) {
            campoBusca.value = '';
            campoBusca.focus();
        }
        
        if (limparBtn) {
            limparBtn.classList.add('hidden');
        }
        
        // Recarregar lista completa
        this.filtrarClientes('');
    }

    /**
     * Lida com mudança de status do projeto
     */
    async handleStatusChange(selectElement) {
        const novoStatus = selectElement.value;
        const projetoId = document.getElementById('projetoId')?.value;
        
        if (!projetoId) return;
        
        const projeto = window.zorixStorage.getProjeto(projetoId);
        const cliente = window.zorixStorage.getCliente(projeto.clienteId);
        
        if (!projeto || !cliente) return;
        
        const statusAnterior = projeto.status;
        
        // Atualizar status do projeto
        projeto.status = novoStatus;
        
        // Salvar projeto com novo status
        try {
            await api.updateProjeto(projetoId, projeto);
            console.log(`✅ Status do projeto ${projetoId} alterado para: ${novoStatus}`);
        } catch (error) {
            console.error('Erro ao salvar projeto:', error);
            app.showNotification('Erro ao atualizar status do projeto', 'error');
            return;
        }
        
        // Se mudou para "ganha", criar animação e conta a receber
        if (novoStatus === 'ganha' && statusAnterior !== 'ganha') {
            // Animação de sucesso
            this.mostrarAnimacaoGanha();
            
            // Criar conta a receber automaticamente
            await this.criarContaReceber(projeto, cliente);
            
            // Atualizar estatísticas do vendedor se houver vendedor
            await this.atualizarEstatisticasVendedor(projeto);
        }
        
        // Atualizar a interface
        this.renderizar();
    }

    /**
     * Atualiza as estatísticas do vendedor quando um projeto é ganho
     */
    async atualizarEstatisticasVendedor(projeto) {
        if (!projeto.vendedor_id || !window.configSistema) return;
        
        try {
            const vendedor = window.configSistema.getVendedorById(projeto.vendedor_id);
            if (!vendedor) {
                console.log('Vendedor não encontrado:', projeto.vendedor_id);
                return;
            }
            
            // Atualizar estatísticas do vendedor
            const valorProjeto = projeto.valor_total || projeto.valor_investimento || 0;
            const comissao = (valorProjeto * vendedor.comissao_percentual) / 100;
            
            // Adicionar à lista de projetos vendidos se não estiver já
            if (!vendedor.projetos_vendidos) {
                vendedor.projetos_vendidos = [];
            }
            
            const jaExiste = vendedor.projetos_vendidos.find(p => p.projeto_id === projeto.id);
            if (!jaExiste) {
                vendedor.projetos_vendidos.push({
                    projeto_id: projeto.id,
                    cliente_nome: projeto.cliente_nome,
                    valor: valorProjeto,
                    comissao: comissao,
                    data_venda: new Date().toISOString()
                });
                
                // Atualizar totais
                vendedor.total_vendas = (vendedor.total_vendas || 0) + valorProjeto;
                vendedor.total_comissoes = (vendedor.total_comissoes || 0) + comissao;
                
                // Salvar vendedor atualizado
                window.configSistema.saveVendedores();
                
                console.log(`✅ Estatísticas do vendedor ${vendedor.nome} atualizadas:`, {
                    valorVenda: valorProjeto,
                    comissao: comissao,
                    totalVendas: vendedor.total_vendas,
                    totalComissoes: vendedor.total_comissoes
                });
                
                app.showNotification(`Venda registrada para ${vendedor.nome}! Comissão: ${window.formatCurrencyBR(comissao)}`, 'success');
            }
            
        } catch (error) {
            console.error('Erro ao atualizar estatísticas do vendedor:', error);
        }
    }

    /**
     * Mostra animação quando projeto é ganho
     */
    mostrarAnimacaoGanha() {
        // Criar elemento de animação
        const animacao = document.createElement('div');
        animacao.innerHTML = `
            <div class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div class="bg-green-500 text-white rounded-full p-8 animate-bounce shadow-2xl">
                    <div class="text-4xl animate-pulse">🎉</div>
                </div>
            </div>
            <div class="fixed inset-0 z-40 bg-green-100 bg-opacity-50 animate-pulse"></div>
        `;
        
        document.body.appendChild(animacao);
        
        // Remover após 2 segundos
        setTimeout(() => {
            document.body.removeChild(animacao);
        }, 2000);
        
        // Mostrar notificação
        this.showNotification('🎉 Parabéns! Projeto ganho com sucesso!', 'success');
    }

    /**
     * Cria conta a receber automaticamente quando projeto é ganho
     */
    async criarContaReceber(projeto, cliente) {
        try {
            const valorProjeto = projeto.preco_venda_total || projeto.valor_investimento || 0;
            
            if (valorProjeto <= 0) {
                console.log('Valor do projeto é zero, não criando conta a receber');
                return;
            }
            
            // Criar conta a receber
            const contaReceber = {
                id: 'conta_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                cliente_id: cliente.id,
                cliente_nome: cliente.nome,
                descricao: 'Pagamento Energia Solar',
                valor: valorProjeto,
                vencimento: this.getDataVencimento(),
                status: 'pendente',
                projeto_id: projeto.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            // Salvar no localStorage
            const contas = JSON.parse(localStorage.getItem('zorix:contas_receber') || '[]');
            contas.push(contaReceber);
            localStorage.setItem('zorix:contas_receber', JSON.stringify(contas));
            
            console.log('Conta a receber criada:', contaReceber);
            this.showNotification(`Conta a receber criada: R$ ${valorProjeto.toLocaleString('pt-BR')}`, 'success');
            
        } catch (error) {
            console.error('Erro ao criar conta a receber:', error);
        }
    }

    /**
     * Gera data de vencimento (30 dias a partir de hoje)
     */
    getDataVencimento() {
        const hoje = new Date();
        hoje.setDate(hoje.getDate() + 30);
        return hoje.toISOString().split('T')[0];
    }

    /**
     * Lê arquivo como base64
     */
    readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Remove data URL prefix (data:mime/type;base64,)
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Abre modal de upload de arquivos para o cliente
     */
    abrirUploadArquivos(clienteId) {
        const cliente = window.zorixStorage.getCliente(clienteId);
        if (!cliente) {
            this.showNotification('Cliente não encontrado', 'error');
            return;
        }

        // Criar modal de upload
        const modal = document.createElement('div');
        modal.id = 'modalUploadArquivos';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-md w-full">
                <div class="flex justify-between items-center p-4 border-b">
                    <h2 class="text-lg font-semibold">📁 Arquivos - ${cliente.nome}</h2>
                    <button onclick="this.closest('#modalUploadArquivos').remove()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="p-4">
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <i class="fas fa-cloud-upload text-4xl text-gray-400 mb-4"></i>
                        <p class="text-gray-600 mb-4">Arraste arquivos aqui ou clique para selecionar</p>
                        <input type="file" id="fileInput" multiple 
                            class="hidden" 
                            onchange="clientesV5.handleFileUpload(event, '${clienteId}')"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx">
                        <button onclick="document.getElementById('fileInput').click()" 
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200">
                            <i class="fas fa-upload mr-2"></i>Selecionar Arquivos
                        </button>
                    </div>
                    
                    <!-- Lista de arquivos existentes -->
                    <div class="mt-4">
                        <h3 class="text-sm font-semibold text-gray-700 mb-2">Arquivos Existentes</h3>
                        <div id="listaArquivos" class="space-y-2 max-h-40 overflow-y-auto">
                            ${this.renderizarListaArquivos(clienteId)}
                        </div>
                    </div>
                </div>
                <div class="flex justify-between items-center p-4 border-t">
                    <button onclick="clientesV5.sincronizarArquivos('${clienteId}')" 
                        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition duration-200 flex items-center">
                        <i class="fas fa-sync-alt mr-2"></i>Sincronizar
                    </button>
                    <button onclick="this.closest('#modalUploadArquivos').remove()" 
                        class="px-4 py-2 text-gray-600 hover:text-gray-800">
                        Fechar
                    </button>
                </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Renderiza lista de arquivos do cliente
     */
    renderizarListaArquivos(clienteId) {
        // Por enquanto retorna uma mensagem, mas pode ser integrado com sistema de arquivos
        const arquivos = JSON.parse(localStorage.getItem(`zorix:arquivos_${clienteId}`) || '[]');
        
        if (arquivos.length === 0) {
            return '<p class="text-gray-500 text-sm">Nenhum arquivo enviado</p>';
        }

        return arquivos.map(arquivo => `
            <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div class="flex items-center">
                    <i class="fas fa-file text-gray-400 mr-2"></i>
                    <span class="text-sm">${arquivo.nome}</span>
                </div>
                <button onclick="clientesV5.removerArquivo('${clienteId}', '${arquivo.id}')" 
                    class="text-red-600 hover:text-red-800 text-xs">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    /**
     * Lida com upload de arquivos
     */
    async handleFileUpload(event, clienteId) {
        const files = event.target.files;
        if (files.length === 0) return;

        const cliente = window.zorixStorage.getCliente(clienteId);
        const arquivosCliente = JSON.parse(localStorage.getItem(`zorix:arquivos_${clienteId}`) || '[]');

        // Para cada arquivo, ler conteúdo e salvar
        for (const file of Array.from(files)) {
            // Ler arquivo como base64
            const base64Content = await this.readFileAsBase64(file);
            const arquivoId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            // Arquivo para lista do cliente (formato antigo)
            const arquivoCliente = {
                id: arquivoId,
                nome: file.name,
                tamanho: file.size,
                tipo: file.type,
                conteudo_base64: base64Content,
                dataUpload: new Date().toISOString()
            };
            
            arquivosCliente.push(arquivoCliente);

            // Arquivo para o sistema geral (formato da API)
            const arquivoSistema = {
                id: arquivoId,
                nome_arquivo: file.name,
                tamanho: file.size,
                tipo_arquivo: this.getTipoArquivo(file.type),
                tipo_mime: file.type,
                cliente_id: clienteId,
                cliente_nome: cliente?.nome || 'Cliente não identificado',
                descricao: `Arquivo enviado pelo cliente ${cliente?.nome || 'desconhecido'}`,
                conteudo_base64: base64Content,
                data_upload: new Date().toISOString(),
                usuario_upload: 'Cliente via Sistema'
            };

            // Salvar no sistema geral de arquivos
            try {
                if (window.api) {
                    await window.api.createArquivo(arquivoSistema);
                } else {
                    // Fallback: salvar diretamente no storage do sistema
                    if (window.storage) {
                        const arquivosSistema = window.storage.getItem('arquivos') || [];
                        arquivosSistema.push(arquivoSistema);
                        window.storage.setItem('arquivos', arquivosSistema);
                    }
                }
                console.log('✅ Arquivo salvo no sistema:', file.name);
            } catch (error) {
                console.error('❌ Erro ao salvar arquivo no sistema:', error);
            }
        }

        // Salvar lista do cliente
        localStorage.setItem(`zorix:arquivos_${clienteId}`, JSON.stringify(arquivosCliente));
        
        // Atualizar lista do cliente
        const listaArquivos = document.getElementById('listaArquivos');
        if (listaArquivos) {
            listaArquivos.innerHTML = this.renderizarListaArquivos(clienteId);
        }

        this.showNotification('Arquivos enviados com sucesso!', 'success');

        this.showNotification(`${files.length} arquivo(s) enviado(s) com sucesso!`, 'success');
    }

    /**
     * Sincroniza arquivos do cliente com o sistema principal
     */
    async sincronizarArquivos(clienteId) {
        try {
            const cliente = window.zorixStorage.getCliente(clienteId);
            if (!cliente) {
                this.showNotification('Cliente não encontrado', 'error');
                return;
            }

            // Buscar arquivos salvos localmente para este cliente
            const arquivosCliente = JSON.parse(localStorage.getItem(`zorix:arquivos_${clienteId}`) || '[]');
            
            if (arquivosCliente.length === 0) {
                this.showNotification('Nenhum arquivo encontrado para sincronizar', 'info');
                return;
            }

            let sincronizados = 0;
            
            // Sincronizar cada arquivo
            for (const arquivo of arquivosCliente) {
                // Verificar se já existe no sistema principal
                try {
                    const existeNoSistema = await window.api.getArquivo(arquivo.id);
                    if (existeNoSistema) {
                        console.log(`📄 Arquivo já existe no sistema: ${arquivo.nome}`);
                        continue;
                    }
                } catch (error) {
                    // Arquivo não existe, vamos sincronizar
                }

                // Criar registro no sistema principal
                const arquivoSistema = {
                    id: arquivo.id,
                    cliente_id: clienteId,
                    projeto_id: null,
                    nome_arquivo: arquivo.nome,
                    tipo_arquivo: this.getTipoArquivo(arquivo.tipo),
                    tipo_mime: arquivo.tipo,
                    descricao: `Arquivo sincronizado do cliente ${cliente.nome}`,
                    tamanho: arquivo.tamanho,
                    conteudo_base64: arquivo.conteudo_base64 || '', // Se tiver conteúdo
                    data_upload: arquivo.dataUpload,
                    usuario_upload: 'Cliente via Sistema'
                };

                try {
                    await window.api.createArquivo(arquivoSistema);
                    sincronizados++;
                    console.log(`✅ Arquivo sincronizado: ${arquivo.nome}`);
                } catch (error) {
                    console.error(`❌ Erro ao sincronizar ${arquivo.nome}:`, error);
                }
            }

            if (sincronizados > 0) {
                this.showNotification(`${sincronizados} arquivo(s) sincronizado(s) com sucesso!`, 'success');
                
                // Atualizar lista de arquivos se estiver na página de arquivos
                if (window.arquivosManager && typeof window.arquivosManager.loadArquivosData === 'function') {
                    await window.arquivosManager.loadArquivosData();
                }
            } else {
                this.showNotification('Todos os arquivos já estavam sincronizados', 'info');
            }

        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
            this.showNotification('Erro ao sincronizar arquivos', 'error');
        }
    }

    /**
     * Remove arquivo do cliente
     */
    removerArquivo(clienteId, arquivoId) {
        if (!confirm('Tem certeza que deseja remover este arquivo?')) return;

        const arquivos = JSON.parse(localStorage.getItem(`zorix:arquivos_${clienteId}`) || '[]');
        const arquivosFiltrados = arquivos.filter(arquivo => arquivo.id !== arquivoId);
        
        localStorage.setItem(`zorix:arquivos_${clienteId}`, JSON.stringify(arquivosFiltrados));
        
        // Atualizar lista
        const listaArquivos = document.getElementById('listaArquivos');
        if (listaArquivos) {
            listaArquivos.innerHTML = this.renderizarListaArquivos(clienteId);
        }

        this.showNotification('Arquivo removido com sucesso!', 'success');
    }

    /**
     * Determina o tipo de arquivo baseado no MIME type
     */
    getTipoArquivo(mimeType) {
        if (!mimeType) return 'outro';
        
        if (mimeType.startsWith('image/')) return 'imagem';
        if (mimeType === 'application/pdf') return 'pdf';
        if (mimeType.includes('word') || mimeType.includes('document')) return 'documento';
        if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'planilha';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType.startsWith('audio/')) return 'audio';
        if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed')) return 'compactado';
        
        return 'outro';
    }

}

// Instância global
window.clientesV5 = new ClientesManagerV5();

console.log('✅ Clientes Manager v5.0 carregado com sucesso!');