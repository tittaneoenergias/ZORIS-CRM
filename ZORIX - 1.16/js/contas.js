/**
 * ZORIX CRM - Módulo de Contas a Pagar e Receber
 * Versão: 1.0
 */

class ContasManager {
    constructor() {
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.currentView = 'pagar';
        
        console.log('💰 ContasManager inicializado');
    }

    /**
     * Carrega a interface de contas
     */
    async loadContas() {
        try {
            const pageContent = document.getElementById('pageContent');
            
            pageContent.innerHTML = `
                <div class="max-w-7xl mx-auto">
                    <!-- Header -->
                    <div class="mb-6">
                        <h1 class="text-3xl font-bold text-gray-900">💰 Contas</h1>
                        <p class="text-gray-600 mt-2">Gerencie suas contas a pagar e a receber</p>
                    </div>

                    <!-- Navegação entre Pagar e Receber -->
                    <div class="mb-6">
                        <div class="border-b border-gray-200">
                            <nav class="-mb-px flex space-x-8">
                                <button id="btnContasPagar" class="tab-button py-2 px-1 border-b-2 font-medium text-sm active" 
                                    onclick="contasManager.switchView('pagar')">
                                    <i class="fas fa-credit-card mr-2"></i>
                                    Contas a Pagar
                                </button>
                                <button id="btnContasReceber" class="tab-button py-2 px-1 border-b-2 font-medium text-sm"
                                    onclick="contasManager.switchView('receber')">
                                    <i class="fas fa-money-bill mr-2"></i>
                                    Contas a Receber
                                </button>
                                <button id="btnCaixa" class="tab-button py-2 px-1 border-b-2 font-medium text-sm"
                                    onclick="contasManager.switchView('caixa')">
                                    <i class="fas fa-cash-register mr-2"></i>
                                    Relatório de Caixa
                                </button>
                                <button id="btnAjudaCusto" class="tab-button py-2 px-1 border-b-2 font-medium text-sm"
                                    onclick="contasManager.switchView('ajuda_custo')">
                                    <i class="fas fa-hand-holding-usd mr-2"></i>
                                    Ajuda de Custo
                                </button>
                            </nav>
                        </div>
                    </div>

                    <!-- Controle de Mês/Ano -->
                    <div class="mb-6 flex items-center justify-between flex-wrap gap-4">
                        <div class="flex items-center space-x-4">
                            <button onclick="contasManager.changeMonth(-1)" 
                                class="p-2 text-gray-400 hover:text-gray-600">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <div class="text-lg font-semibold text-gray-900" id="monthYearDisplay">
                                ${this.formatMonthYear(this.currentMonth, this.currentYear)}
                            </div>
                            <button onclick="contasManager.changeMonth(1)" 
                                class="p-2 text-gray-400 hover:text-gray-600">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        <div id="addButtonContainer">
                            <!-- Botão será inserido aqui baseado na aba ativa -->
                        </div>
                    </div>

                    <!-- Conteúdo das abas -->
                    <div id="contasContent">
                        <!-- Conteúdo será carregado dinamicamente -->
                    </div>
                </div>

                <!-- Modal para Adicionar/Editar Conta a Pagar -->
                <div id="modalContaPagar" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-4">
                                <h2 class="text-xl font-bold text-gray-900" id="modalContaPagarTitulo">Adicionar Conta a Pagar</h2>
                                <button onclick="contasManager.closeModal('modalContaPagar')" 
                                    class="text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <form id="formContaPagar" onsubmit="contasManager.saveContaPagar(event)">
                                <input type="hidden" id="contaPagarId" value="">
                                
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                                        <input type="text" id="contaPagarDescricao" required
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Ex: Aluguel, Energia, Internet">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                        <select id="contaPagarCategoria"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="Infraestrutura">Infraestrutura</option>
                                            <option value="Serviços">Serviços</option>
                                            <option value="Fornecedores">Fornecedores</option>
                                            <option value="Impostos">Impostos</option>
                                            <option value="Outros">Outros</option>
                                        </select>
                                    </div>
                                    
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Valor *</label>
                                            <input type="text" id="contaPagarValor" required
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="R$ 0,00"
                                                oninput="contasManager.formatCurrency(this)">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Vencimento *</label>
                                            <input type="date" id="contaPagarVencimento" required
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label class="flex items-center">
                                            <input type="checkbox" id="contaPagarRecorrente"
                                                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                            <span class="ml-2 text-sm text-gray-700">Conta recorrente (mensal)</span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div class="flex justify-end space-x-3 mt-6">
                                    <button type="button" onclick="contasManager.closeModal('modalContaPagar')"
                                        class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200">
                                        Cancelar
                                    </button>
                                    <button type="submit"
                                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Modal para Adicionar/Editar Conta a Receber -->
                <div id="modalContaReceber" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-4">
                                <h2 class="text-xl font-bold text-gray-900" id="modalContaReceberTitulo">Adicionar Conta a Receber</h2>
                                <button onclick="contasManager.closeModal('modalContaReceber')" 
                                    class="text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <form id="formContaReceber" onsubmit="contasManager.saveContaReceber(event)">
                                <input type="hidden" id="contaReceberId" value="">
                                
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Cliente/Descrição *</label>
                                        <input type="text" id="contaReceberDescricao" required
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="Ex: Pagamento Cliente João Silva">
                                    </div>
                                    
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Valor *</label>
                                            <input type="text" id="contaReceberValor" required
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="R$ 0,00"
                                                oninput="contasManager.formatCurrencyInput(this)">
                                        </div>
                                        
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Vencimento *</label>
                                            <input type="date" id="contaReceberVencimento" required
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="flex justify-end space-x-3 mt-6">
                                    <button type="button" onclick="contasManager.closeModal('modalContaReceber')"
                                        class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200">
                                        Cancelar
                                    </button>
                                    <button type="submit"
                                        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200">
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Modal para Marcar como Pago -->
                <div id="modalPagamento" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div class="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-4">
                                <h2 class="text-xl font-bold text-gray-900">Registrar Pagamento</h2>
                                <button onclick="contasManager.closeModal('modalPagamento')" 
                                    class="text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <form id="formPagamento" onsubmit="contasManager.registrarPagamento(event)">
                                <input type="hidden" id="pagamentoContaId" value="">
                                <input type="hidden" id="pagamentoTipo" value="">
                                
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Data do Pagamento/Recebimento</label>
                                        <input type="date" id="pagamentoData" required
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Método</label>
                                        <select id="pagamentoMetodo"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="Dinheiro">Dinheiro</option>
                                            <option value="Cartão de Débito">Cartão de Débito</option>
                                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                                            <option value="PIX">PIX</option>
                                            <option value="Transferência">Transferência</option>
                                            <option value="Boleto">Boleto</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="flex justify-end space-x-3 mt-6">
                                    <button type="button" onclick="contasManager.closeModal('modalPagamento')"
                                        class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200">
                                        Cancelar
                                    </button>
                                    <button type="submit"
                                        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200">
                                        Confirmar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <style>
                .tab-button {
                    color: #6b7280;
                    border-color: transparent;
                }
                
                .tab-button.active {
                    color: #2563eb;
                    border-color: #2563eb;
                }
                
                .conta-card {
                    transition: all 0.2s;
                }
                
                .conta-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                </style>
            `;

            // Definir data padrão para hoje no fuso brasileiro
            const today = window.getCurrentDateBR ? window.getCurrentDateBR() : new Date().toISOString().split('T')[0];
            document.getElementById('contaPagarVencimento').value = today;
            document.getElementById('pagamentoData').value = today;

            // Carregar dados da aba ativa
            await this.switchView(this.currentView);

        } catch (error) {
            console.error('Erro ao carregar contas:', error);
        }
    }

    /**
     * Troca entre as abas de contas a pagar e receber
     */
    async switchView(view) {
        this.currentView = view;

        // Atualizar abas
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        if (view === 'caixa') {
            document.getElementById('btnCaixa').classList.add('active');
        } else if (view === 'ajuda_custo') {
            document.getElementById('btnAjudaCusto').classList.add('active');
        } else {
            document.getElementById(`btnContas${view.charAt(0).toUpperCase() + view.slice(1)}`).classList.add('active');
        }

        // Restaurar controles de mês/ano se estavam escondidos
        const monthControls = document.querySelector('.mb-6.flex.items-center.justify-between.flex-wrap.gap-4');
        if (monthControls) {
            monthControls.style.display = 'flex';
        }

        // Atualizar botão de adicionar
        const addButtonContainer = document.getElementById('addButtonContainer');
        if (view === 'pagar') {
            addButtonContainer.innerHTML = `
                <button onclick="contasManager.openModalContaPagar()" 
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                    <i class="fas fa-plus mr-2"></i>
                    Adicionar Conta a Pagar
                </button>
            `;
        } else if (view === 'receber') {
            addButtonContainer.innerHTML = `
                <button onclick="contasManager.openModalContaReceber()" 
                    class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200">
                    <i class="fas fa-plus mr-2"></i>
                    Adicionar Conta a Receber
                </button>
            `;
        } else if (view === 'caixa') {
            // Esconder controles de mês/ano apenas na aba caixa
            if (monthControls) {
                monthControls.style.display = 'none';
            }
            addButtonContainer.innerHTML = `
                <div class="text-gray-600 text-sm">
                    <i class="fas fa-info-circle mr-2"></i>
                    Relatório baseado nas contas cadastradas
                </div>
            `;
        } else if (view === 'ajuda_custo') {
            addButtonContainer.innerHTML = `
                <button onclick="contasManager.openModalAjudaCusto()" 
                    class="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition duration-200">
                    <i class="fas fa-plus mr-2"></i>
                    Nova Ajuda de Custo
                </button>
            `;
        }

        // Carregar conteúdo
        await this.loadContasContent(view);
    }

    /**
     * Carrega o conteúdo das contas baseado na aba ativa
     */
    async loadContasContent(view) {
        const contasContent = document.getElementById('contasContent');

        if (view === 'pagar') {
            await this.loadContasPagar();
        } else if (view === 'receber') {
            await this.loadContasReceber();
        } else if (view === 'caixa') {
            await this.loadCaixa();
        } else if (view === 'ajuda_custo') {
            await this.loadAjudasCusto();
        }
    }

    /**
     * Carrega o relatório de caixa
     */
    async loadCaixa() {
        // Esconder controles de mês/ano quando estiver na aba caixa
        const monthControls = document.querySelector('.mb-6.flex.items-center.justify-between.flex-wrap.gap-4');
        if (monthControls) {
            monthControls.style.display = 'none';
        }

        const contasContent = document.getElementById('contasContent');
        
        // Versão simplificada - apenas redirecionar para a página de caixa
        contasContent.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-cash-register text-6xl text-blue-500 mb-4"></i>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Relatório de Caixa</h3>
                <p class="text-gray-600 mb-6">Para uma melhor experiência, o relatório de caixa foi movido para uma página dedicada.</p>
                <button onclick="app.navigateTo('caixa')" 
                    class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium">
                    <i class="fas fa-external-link-alt mr-2"></i>
                    Abrir Relatório de Caixa
                </button>
            </div>
        `;
    }

    /**
     * Carrega contas a pagar
     */
    async loadContasPagar() {
        try {
            const contas = await this.getContasPagar(this.currentMonth, this.currentYear);
            
            const contasContent = document.getElementById('contasContent');
            
            if (contas.length === 0) {
                contasContent.innerHTML = `
                    <div class="text-center py-12">
                        <i class="fas fa-file-invoice-dollar text-4xl text-gray-300 mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma conta a pagar</h3>
                        <p class="text-gray-500">Adicione suas contas para começar a organizar seus pagamentos.</p>
                    </div>
                `;
                return;
            }

            let html = '<div class="grid gap-4">';
            
            contas.forEach(conta => {
                const isVencida = new Date(conta.vencimento) < new Date() && conta.status === 'pendente';
                const statusColor = conta.status === 'pago' ? 'bg-green-100 text-green-800' : 
                                   isVencida ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
                const statusText = conta.status === 'pago' ? 'Pago' : 
                                  isVencida ? 'Vencida' : 'Pendente';

                html += `
                    <div class="conta-card bg-white p-4 rounded-lg shadow border hover:shadow-md">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <div class="flex items-center justify-between mb-2">
                                    <h3 class="text-lg font-semibold text-gray-900">${conta.descricao}</h3>
                                    <span class="px-2 py-1 text-xs font-medium rounded-full ${statusColor}">
                                        ${statusText}
                                    </span>
                                </div>
                                
                                <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                                    <div>
                                        <i class="fas fa-tag mr-1"></i>
                                        ${conta.categoria}
                                    </div>
                                    <div>
                                        <i class="fas fa-calendar mr-1"></i>
                                        ${this.formatDate(conta.vencimento)}
                                    </div>
                                </div>
                                
                                <div class="flex items-center justify-between">
                                    <div class="text-xl font-bold text-gray-900">
                                        ${this.formatCurrency(conta.valor)}
                                    </div>
                                    
                                    <div class="flex space-x-2">
                                        ${conta.status === 'pendente' ? `
                                            <button onclick="contasManager.openModalPagamento('${conta.id}', 'pagar')"
                                                class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition duration-200">
                                                <i class="fas fa-check mr-1"></i>
                                                Marcar como Pago
                                            </button>
                                        ` : `
                                            <button onclick="contasManager.estornarContaPagar('${conta.id}')"
                                                class="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition duration-200">
                                                <i class="fas fa-undo mr-1"></i>
                                                Estornar
                                            </button>
                                        `}
                                        
                                        <button onclick="contasManager.editContaPagar('${conta.id}')"
                                            class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition duration-200">
                                            <i class="fas fa-edit mr-1"></i>
                                            Editar
                                        </button>
                                        
                                        <button onclick="contasManager.deleteContaPagar('${conta.id}')"
                                            class="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition duration-200">
                                            <i class="fas fa-trash mr-1"></i>
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                                
                                ${conta.data_pagamento ? `
                                    <div class="mt-2 text-xs text-gray-500">
                                        <i class="fas fa-info-circle mr-1"></i>
                                        Pago em ${this.formatDate(conta.data_pagamento)} via ${conta.metodo_pagamento}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            
            contasContent.innerHTML = html;

        } catch (error) {
            console.error('Erro ao carregar contas a pagar:', error);
            document.getElementById('contasContent').innerHTML = `
                <div class="text-center py-12 text-red-600">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <p>Erro ao carregar contas a pagar</p>
                </div>
            `;
        }
    }

    /**
     * Carrega contas a receber
     */
    async loadContasReceber() {
        try {
            const contas = await this.getContasReceber(this.currentMonth, this.currentYear);
            
            const contasContent = document.getElementById('contasContent');
            
            if (contas.length === 0) {
                contasContent.innerHTML = `
                    <div class="text-center py-12">
                        <i class="fas fa-money-bill-wave text-4xl text-gray-300 mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma conta a receber</h3>
                        <p class="text-gray-500">Contas a receber são geradas automaticamente quando você adiciona pagamentos futuros nos clientes.</p>
                    </div>
                `;
                return;
            }

            let html = '<div class="grid gap-4">';
            
            contas.forEach(conta => {
                const isVencida = new Date(conta.vencimento) < new Date() && conta.status === 'pendente';
                const statusColor = conta.status === 'recebido' ? 'bg-green-100 text-green-800' : 
                                   isVencida ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
                const statusText = conta.status === 'recebido' ? 'Recebido' : 
                                  isVencida ? 'Em Atraso' : 'A Receber';

                html += `
                    <div class="conta-card bg-white p-4 rounded-lg shadow border hover:shadow-md">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <div class="flex items-center justify-between mb-2">
                                    <h3 class="text-lg font-semibold text-gray-900">${conta.cliente_nome}</h3>
                                    <span class="px-2 py-1 text-xs font-medium rounded-full ${statusColor}">
                                        ${statusText}
                                    </span>
                                </div>
                                
                                <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                                    <div>
                                        <i class="fas fa-file-invoice mr-1"></i>
                                        ${conta.descricao}
                                    </div>
                                    <div>
                                        <i class="fas fa-calendar mr-1"></i>
                                        ${this.formatDate(conta.vencimento)}
                                    </div>
                                </div>
                                
                                <div class="flex items-center justify-between">
                                    <div class="text-xl font-bold text-gray-900">
                                        ${this.formatCurrency(conta.valor)}
                                    </div>
                                    
                                    <div class="flex space-x-2">
                                        ${conta.status === 'pendente' ? `
                                            <button onclick="contasManager.openModalPagamento('${conta.id}', 'receber')"
                                                class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition duration-200">
                                                <i class="fas fa-check mr-1"></i>
                                                Marcar como Recebido
                                            </button>
                                        ` : `
                                            <button onclick="contasManager.estornarContaReceber('${conta.id}')"
                                                class="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition duration-200">
                                                <i class="fas fa-undo mr-1"></i>
                                                Estornar
                                            </button>
                                        `}
                                        
                                        <button onclick="contasManager.editContaReceber('${conta.id}')"
                                            class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition duration-200">
                                            <i class="fas fa-edit mr-1"></i>
                                            Editar
                                        </button>
                                        
                                        <button onclick="contasManager.deleteContaReceber('${conta.id}')"
                                            class="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition duration-200">
                                            <i class="fas fa-trash mr-1"></i>
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                                
                                ${conta.data_recebimento ? `
                                    <div class="mt-2 text-xs text-gray-500">
                                        <i class="fas fa-info-circle mr-1"></i>
                                        Recebido em ${this.formatDate(conta.data_recebimento)} via ${conta.metodo_recebimento}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            
            contasContent.innerHTML = html;

        } catch (error) {
            console.error('Erro ao carregar contas a receber:', error);
            document.getElementById('contasContent').innerHTML = `
                <div class="text-center py-12 text-red-600">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <p>Erro ao carregar contas a receber</p>
                </div>
            `;
        }
    }

    /**
     * Navega entre meses
     */
    changeMonth(delta) {
        this.currentMonth += delta;
        
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        
        document.getElementById('monthYearDisplay').textContent = 
            this.formatMonthYear(this.currentMonth, this.currentYear);
        
        this.loadContasContent(this.currentView);
    }

    /**
     * Formata mês/ano para exibição
     */
    formatMonthYear(month, year) {
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return `${months[month]} ${year}`;
    }

    /**
     * Formata data para exibição
     */
    formatDate(dateStr) {
        return window.formatDateBR ? window.formatDateBR(dateStr) : dateStr;
    }

    /**
     * Formata valor monetário
     */
    formatCurrency(value) {
        return window.formatCurrencyBR ? window.formatCurrencyBR(value) : `R$ ${value}`;
    }

    /**
     * Formata campo de moeda em tempo real
     */
    formatCurrencyInput(input) {
        if (window.formatCurrencyInputBR) {
            window.formatCurrencyInputBR(input);
        }
    }

    /**
     * Abre modal de conta a pagar
     */
    openModalContaPagar(contaId = null) {
        const modal = document.getElementById('modalContaPagar');
        const form = document.getElementById('formContaPagar');
        const titulo = document.getElementById('modalContaPagarTitulo');
        
        if (contaId) {
            titulo.textContent = 'Editar Conta a Pagar';
            this.loadContaPagarToForm(contaId);
        } else {
            titulo.textContent = 'Adicionar Conta a Pagar';
            form.reset();
            document.getElementById('contaPagarId').value = '';
            // Definir data padrão
            const today = window.getCurrentDateBR ? window.getCurrentDateBR() : new Date().toISOString().split('T')[0];
            document.getElementById('contaPagarVencimento').value = today;
        }
        
        modal.classList.remove('hidden');
    }

    /**
     * Abre modal de conta a receber
     */
    openModalContaReceber(contaId = null) {
        const modal = document.getElementById('modalContaReceber');
        const form = document.getElementById('formContaReceber');
        const titulo = document.getElementById('modalContaReceberTitulo');
        
        if (contaId) {
            titulo.textContent = 'Editar Conta a Receber';
            this.loadContaReceberToForm(contaId);
        } else {
            titulo.textContent = 'Adicionar Conta a Receber';
            form.reset();
            document.getElementById('contaReceberId').value = '';
            // Definir data padrão
            const today = window.getCurrentDateBR ? window.getCurrentDateBR() : new Date().toISOString().split('T')[0];
            document.getElementById('contaReceberVencimento').value = today;
        }
        
        modal.classList.remove('hidden');
    }

    /**
     * Abre modal de pagamento/recebimento
     */
    openModalPagamento(contaId, tipo) {
        document.getElementById('pagamentoContaId').value = contaId;
        document.getElementById('pagamentoTipo').value = tipo;
        document.getElementById('modalPagamento').classList.remove('hidden');
    }

    /**
     * Fecha modal
     */
    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    /**
     * Salva conta a pagar
     */
    async saveContaPagar(event) {
        event.preventDefault();
        
        try {
            const formData = new FormData(event.target);
            const contaId = document.getElementById('contaPagarId').value;
            
            const conta = {
                id: contaId || this.generateId(),
                descricao: document.getElementById('contaPagarDescricao').value,
                categoria: document.getElementById('contaPagarCategoria').value,
                valor: this.parseCurrency(document.getElementById('contaPagarValor').value),
                vencimento: document.getElementById('contaPagarVencimento').value,
                recorrente: document.getElementById('contaPagarRecorrente').checked,
                status: 'pendente',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            await this.saveContaPagarToStorage(conta);
            
            // Se for recorrente, criar para os próximos meses
            if (conta.recorrente && !contaId) {
                await this.createRecurrentContas(conta);
            }
            
            this.closeModal('modalContaPagar');
            await this.loadContasPagar();
            
            app.showNotification(
                contaId ? 'Conta atualizada com sucesso!' : 'Conta adicionada com sucesso!',
                'success'
            );
            
        } catch (error) {
            console.error('Erro ao salvar conta:', error);
            app.showNotification('Erro ao salvar conta', 'error');
        }
    }

    /**
     * Salva conta a receber
     */
    async saveContaReceber(event) {
        event.preventDefault();
        
        try {
            const contaId = document.getElementById('contaReceberId').value;
            
            const conta = {
                id: contaId || this.generateId(),
                cliente_id: 'manual',
                cliente_nome: 'Manual',
                descricao: document.getElementById('contaReceberDescricao').value,
                valor: this.parseCurrency(document.getElementById('contaReceberValor').value),
                vencimento: document.getElementById('contaReceberVencimento').value,
                origem: 'manual',
                status: 'pendente',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            await this.saveContaReceberToStorage(conta);
            
            this.closeModal('modalContaReceber');
            await this.loadContasReceber();
            
            app.showNotification(
                contaId ? 'Conta a receber atualizada com sucesso!' : 'Conta a receber adicionada com sucesso!',
                'success'
            );
            
        } catch (error) {
            console.error('Erro ao salvar conta a receber:', error);
            app.showNotification('Erro ao salvar conta a receber', 'error');
        }
    }

    /**
     * Registra pagamento/recebimento
     */
    async registrarPagamento(event) {
        event.preventDefault();
        
        try {
            const contaId = document.getElementById('pagamentoContaId').value;
            const tipo = document.getElementById('pagamentoTipo').value;
            const data = document.getElementById('pagamentoData').value;
            const metodo = document.getElementById('pagamentoMetodo').value;
            
            if (tipo === 'pagar') {
                await this.markContaPagarAsPaid(contaId, data, metodo);
            } else {
                await this.markContaReceberAsReceived(contaId, data, metodo);
            }
            
            this.closeModal('modalPagamento');
            await this.loadContasContent(this.currentView);
            
            app.showNotification(
                tipo === 'pagar' ? 'Pagamento registrado!' : 'Recebimento registrado!',
                'success'
            );
            
        } catch (error) {
            console.error('Erro ao registrar pagamento:', error);
            app.showNotification('Erro ao registrar pagamento', 'error');
        }
    }

    // ===============================
    // MÉTODOS DE ARMAZENAMENTO
    // ===============================

    /**
     * Busca contas a pagar por mês/ano
     */
    async getContasPagar(month, year) {
        const contas = JSON.parse(localStorage.getItem('zorix:contas_pagar') || '[]');
        return contas.filter(conta => {
            const contaDate = new Date(conta.vencimento + 'T00:00:00');
            return contaDate.getMonth() === month && contaDate.getFullYear() === year;
        }).sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento));
    }

    /**
     * Busca contas a receber por mês/ano
     */
    async getContasReceber(month, year) {
        const contas = JSON.parse(localStorage.getItem('zorix:contas_receber') || '[]');
        return contas.filter(conta => {
            const contaDate = new Date(conta.vencimento + 'T00:00:00');
            return contaDate.getMonth() === month && contaDate.getFullYear() === year;
        }).sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento));
    }

    /**
     * Salva conta a pagar no localStorage
     */
    async saveContaPagarToStorage(conta) {
        const contas = JSON.parse(localStorage.getItem('zorix:contas_pagar') || '[]');
        const index = contas.findIndex(c => c.id === conta.id);
        
        if (index >= 0) {
            contas[index] = conta;
        } else {
            contas.push(conta);
        }
        
        localStorage.setItem('zorix:contas_pagar', JSON.stringify(contas));
    }

    /**
     * Cria contas recorrentes para os próximos 12 meses
     */
    async createRecurrentContas(contaBase) {
        const contas = [];
        const baseDate = new Date(contaBase.vencimento + 'T00:00:00');
        
        // Criar para os próximos 11 meses (total 12 meses incluindo o atual)
        for (let i = 1; i < 12; i++) {
            const newDate = new Date(baseDate);
            newDate.setMonth(baseDate.getMonth() + i);
            
            const newConta = {
                ...contaBase,
                id: this.generateId(),
                vencimento: newDate.toISOString().split('T')[0]
            };
            
            contas.push(newConta);
        }
        
        // Salvar todas as contas recorrentes
        const existingContas = JSON.parse(localStorage.getItem('zorix:contas_pagar') || '[]');
        const allContas = [...existingContas, ...contas];
        localStorage.setItem('zorix:contas_pagar', JSON.stringify(allContas));
    }

    /**
     * Marca conta como paga
     */
    async markContaPagarAsPaid(contaId, dataPagamento, metodo) {
        const contas = JSON.parse(localStorage.getItem('zorix:contas_pagar') || '[]');
        const index = contas.findIndex(c => c.id === contaId);
        
        if (index >= 0) {
            contas[index].status = 'pago';
            contas[index].data_pagamento = dataPagamento;
            contas[index].metodo_pagamento = metodo;
            contas[index].updated_at = new Date().toISOString();
            
            localStorage.setItem('zorix:contas_pagar', JSON.stringify(contas));
        }
    }

    /**
     * Marca conta como recebida
     */
    async markContaReceberAsReceived(contaId, dataRecebimento, metodo) {
        const contas = JSON.parse(localStorage.getItem('zorix:contas_receber') || '[]');
        const index = contas.findIndex(c => c.id === contaId);
        
        if (index >= 0) {
            contas[index].status = 'recebido';
            contas[index].data_recebimento = dataRecebimento;
            contas[index].metodo_recebimento = metodo;
            contas[index].updated_at = new Date().toISOString();
            
            localStorage.setItem('zorix:contas_receber', JSON.stringify(contas));
        }
    }

    /**
     * Carrega dados da conta para o formulário
     */
    async loadContaPagarToForm(contaId) {
        const contas = JSON.parse(localStorage.getItem('zorix:contas_pagar') || '[]');
        const conta = contas.find(c => c.id === contaId);
        
        if (conta) {
            document.getElementById('contaPagarId').value = conta.id;
            document.getElementById('contaPagarDescricao').value = conta.descricao;
            document.getElementById('contaPagarCategoria').value = conta.categoria;
            document.getElementById('contaPagarValor').value = this.formatCurrency(conta.valor);
            document.getElementById('contaPagarVencimento').value = conta.vencimento;
            document.getElementById('contaPagarRecorrente').checked = conta.recorrente || false;
        }
    }

    /**
     * Edita conta a pagar
     */
    editContaPagar(contaId) {
        this.openModalContaPagar(contaId);
    }

    /**
     * Exclui conta a pagar
     */
    async deleteContaPagar(contaId) {
        if (confirm('Tem certeza que deseja excluir esta conta?')) {
            const contas = JSON.parse(localStorage.getItem('zorix:contas_pagar') || '[]');
            const filteredContas = contas.filter(c => c.id !== contaId);
            localStorage.setItem('zorix:contas_pagar', JSON.stringify(filteredContas));
            
            await this.loadContasPagar();
            app.showNotification('Conta excluída com sucesso!', 'success');
        }
    }

    /**
     * Salva conta a receber no localStorage
     */
    async saveContaReceberToStorage(conta) {
        const contas = JSON.parse(localStorage.getItem('zorix:contas_receber') || '[]');
        const index = contas.findIndex(c => c.id === conta.id);
        
        if (index >= 0) {
            contas[index] = conta;
        } else {
            contas.push(conta);
        }
        
        localStorage.setItem('zorix:contas_receber', JSON.stringify(contas));
    }

    /**
     * Carrega dados da conta a receber para o formulário
     */
    async loadContaReceberToForm(contaId) {
        const contas = JSON.parse(localStorage.getItem('zorix:contas_receber') || '[]');
        const conta = contas.find(c => c.id === contaId);
        
        if (conta) {
            document.getElementById('contaReceberId').value = conta.id;
            document.getElementById('contaReceberDescricao').value = conta.descricao;
            document.getElementById('contaReceberValor').value = this.formatCurrency(conta.valor);
            document.getElementById('contaReceberVencimento').value = conta.vencimento;
        }
    }

    /**
     * Adiciona conta a receber (usado pelos módulos de clientes)
     */
    async addContaReceber(contaReceber) {
        const contas = JSON.parse(localStorage.getItem('zorix:contas_receber') || '[]');
        contas.push(contaReceber);
        localStorage.setItem('zorix:contas_receber', JSON.stringify(contas));
    }

    /**
     * Converte string de moeda para número
     */
    parseCurrency(currencyStr) {
        if (!currencyStr) return 0;
        return parseFloat(currencyStr.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
    }

    /**
     * Edita conta a receber
     */
    editContaReceber(contaId) {
        this.openModalContaReceber(contaId);
    }

    /**
     * Exclui conta a receber
     */
    async deleteContaReceber(contaId) {
        if (confirm('Tem certeza que deseja excluir esta conta?')) {
            const contas = JSON.parse(localStorage.getItem('zorix:contas_receber') || '[]');
            const filteredContas = contas.filter(c => c.id !== contaId);
            localStorage.setItem('zorix:contas_receber', JSON.stringify(filteredContas));
            
            await this.loadContasReceber();
            app.showNotification('Conta excluída com sucesso!', 'success');
        }
    }

    /**
     * Gera ID único
     */
    generateId() {
        return 'conta_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Carrega a lista de ajudas de custo
     */
    async loadAjudasCusto() {
        const contasContent = document.getElementById('contasContent');
        
        contasContent.innerHTML = `
            <div class="space-y-6">
                <!-- Filtros -->
                <div class="bg-white p-4 rounded-lg shadow border">
                    <div class="flex flex-wrap gap-4">
                        <div class="flex-1 min-w-64">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
                            <select id="filtroVendedorAjuda" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Todos os vendedores</option>
                                ${this.getVendedoresOptions()}
                            </select>
                        </div>
                        <div class="flex-1 min-w-48">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Período</label>
                            <select id="filtroPeriodoAjuda" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="mes">Este mês</option>
                                <option value="trimestre">Últimos 3 meses</option>
                                <option value="semestre">Últimos 6 meses</option>
                                <option value="ano">Este ano</option>
                                <option value="todos">Todos</option>
                            </select>
                        </div>
                        <div class="flex items-end">
                            <button onclick="contasManager.filtrarAjudasCusto()" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                <i class="fas fa-search mr-2"></i>Filtrar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Lista de Ajudas -->
                <div id="ajudasCustoList" class="space-y-4">
                    <!-- Será populado via JavaScript -->
                </div>

                <!-- Resumo -->
                <div id="resumoAjudas" class="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border">
                    <!-- Será populado via JavaScript -->
                </div>
            </div>
        `;

        this.carregarAjudasCusto();
    }

    /**
     * Carrega as ajudas de custo baseado nos filtros
     */
    carregarAjudasCusto() {
        const vendedorFiltro = document.getElementById('filtroVendedorAjuda')?.value || '';
        const periodoFiltro = document.getElementById('filtroPeriodoAjuda')?.value || 'todos';
        
        let ajudas = configSistema.ajudasCusto;

        // Filtrar por vendedor
        if (vendedorFiltro) {
            ajudas = ajudas.filter(a => a.vendedor_id === vendedorFiltro);
        }

        // Filtrar por período
        if (periodoFiltro !== 'todos') {
            const agora = new Date();
            const filtroData = new Date();
            
            switch (periodoFiltro) {
                case 'mes':
                    filtroData.setMonth(agora.getMonth() - 1);
                    break;
                case 'trimestre':
                    filtroData.setMonth(agora.getMonth() - 3);
                    break;
                case 'semestre':
                    filtroData.setMonth(agora.getMonth() - 6);
                    break;
                case 'ano':
                    filtroData.setFullYear(agora.getFullYear() - 1);
                    break;
            }
            
            ajudas = ajudas.filter(a => new Date(a.data_ajuda) >= filtroData);
        }

        this.renderAjudasCusto(ajudas);
    }

    /**
     * Renderiza a lista de ajudas de custo
     */
    renderAjudasCusto(ajudas) {
        const lista = document.getElementById('ajudasCustoList');
        const resumo = document.getElementById('resumoAjudas');

        if (ajudas.length === 0) {
            lista.innerHTML = `
                <div class="text-center py-12 bg-white rounded-lg border">
                    <i class="fas fa-hand-holding-usd text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhuma ajuda de custo encontrada</h3>
                    <p class="text-gray-500">Comece adicionando uma nova ajuda de custo.</p>
                </div>
            `;
            resumo.innerHTML = `
                <div class="text-center">
                    <h3 class="text-lg font-semibold text-gray-900">Resumo</h3>
                    <p class="text-gray-600 mt-2">Nenhuma ajuda registrada no período selecionado</p>
                </div>
            `;
            return;
        }

        // Ordenar por data (mais recentes primeiro)
        ajudas.sort((a, b) => new Date(b.data_ajuda) - new Date(a.data_ajuda));

        // Renderizar lista
        lista.innerHTML = ajudas.map(ajuda => {
            const vendedor = configSistema.getVendedorById(ajuda.vendedor_id);
            const vendedorNome = vendedor ? vendedor.nome : 'Vendedor não encontrado';
            
            return `
                <div class="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center mb-2">
                                <i class="fas fa-user-tie text-blue-600 mr-2"></i>
                                <h3 class="text-lg font-semibold text-gray-900">${vendedorNome}</h3>
                            </div>
                            <p class="text-gray-600 mb-3">${ajuda.descricao}</p>
                            <div class="flex items-center text-sm text-gray-500 space-x-4">
                                <span><i class="fas fa-calendar mr-1"></i>${new Date(ajuda.data_ajuda).toLocaleDateString('pt-BR')}</span>
                                <span><i class="fas fa-user mr-1"></i>${ajuda.usuario_responsavel}</span>
                            </div>
                        </div>
                        <div class="flex items-center space-x-3">
                            <div class="text-right">
                                <div class="text-2xl font-bold text-yellow-600">
                                    ${window.formatCurrencyBR(ajuda.valor)}
                                </div>
                            </div>
                            <button onclick="contasManager.excluirAjudaCusto('${ajuda.id}')" 
                                class="text-red-600 hover:text-red-800 p-2" title="Excluir">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Calcular resumo
        const totalAjudas = ajudas.reduce((sum, ajuda) => sum + ajuda.valor, 0);
        const vendedoresUnicos = [...new Set(ajudas.map(a => a.vendedor_id))].length;
        const mediaAjuda = totalAjudas / (ajudas.length || 1);

        resumo.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                    <h4 class="text-sm font-medium text-gray-600">Total de Ajudas</h4>
                    <p class="text-2xl font-bold text-yellow-600">${ajudas.length}</p>
                </div>
                <div>
                    <h4 class="text-sm font-medium text-gray-600">Vendedores Beneficiados</h4>
                    <p class="text-2xl font-bold text-yellow-600">${vendedoresUnicos}</p>
                </div>
                <div>
                    <h4 class="text-sm font-medium text-gray-600">Valor Total</h4>
                    <p class="text-2xl font-bold text-yellow-600">${window.formatCurrencyBR(totalAjudas)}</p>
                </div>
                <div>
                    <h4 class="text-sm font-medium text-gray-600">Média por Ajuda</h4>
                    <p class="text-2xl font-bold text-yellow-600">${window.formatCurrencyBR(mediaAjuda)}</p>
                </div>
            </div>
        `;
    }

    /**
     * Filtrar ajudas de custo
     */
    filtrarAjudasCusto() {
        this.carregarAjudasCusto();
    }

    /**
     * Abrir modal para nova ajuda de custo
     */
    openModalAjudaCusto() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Nova Ajuda de Custo</h3>
                        <button class="text-gray-400 hover:text-gray-600" onclick="this.closest('.fixed').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <form id="formAjudaCusto" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Vendedor</label>
                            <select id="vendedorAjuda" class="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                                <option value="">Selecione um vendedor</option>
                                ${this.getVendedoresOptions()}
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Valor</label>
                            <input type="text" id="valorAjuda" class="w-full px-3 py-2 border border-gray-300 rounded-md" 
                                placeholder="R$ 0,00" required onkeyup="window.formatCurrencyInputBR(this)">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                            <textarea id="descricaoAjuda" class="w-full px-3 py-2 border border-gray-300 rounded-md h-20" 
                                placeholder="Descrição da ajuda de custo..." required></textarea>
                        </div>

                        <div class="flex space-x-3 pt-4">
                            <button type="submit" class="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700">
                                Registrar Ajuda
                            </button>
                            <button type="button" onclick="this.closest('.fixed').remove()" 
                                class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listener para o formulário
        document.getElementById('formAjudaCusto').addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarAjudaCusto();
            modal.remove();
        });
    }

    /**
     * Salvar nova ajuda de custo
     */
    salvarAjudaCusto() {
        const vendedorId = document.getElementById('vendedorAjuda').value;
        const valorStr = document.getElementById('valorAjuda').value;
        const descricao = document.getElementById('descricaoAjuda').value.trim();

        if (!vendedorId || !valorStr || !descricao) {
            app.showNotification('Todos os campos são obrigatórios', 'error');
            return;
        }

        // Converter valor
        const valor = parseFloat(valorStr.replace(/[^\d,]/g, '').replace(',', '.'));
        if (isNaN(valor) || valor <= 0) {
            app.showNotification('Valor inválido', 'error');
            return;
        }

        // Registrar ajuda de custo
        configSistema.adicionarAjudaCusto(vendedorId, valor, descricao);
        
        app.showNotification('Ajuda de custo registrada com sucesso!', 'success');
        this.carregarAjudasCusto();
    }

    /**
     * Excluir ajuda de custo
     */
    excluirAjudaCusto(ajudaId) {
        if (confirm('Tem certeza que deseja excluir esta ajuda de custo?')) {
            configSistema.ajudasCusto = configSistema.ajudasCusto.filter(a => a.id !== ajudaId);
            configSistema.saveAjudasCusto();
            app.showNotification('Ajuda de custo excluída com sucesso', 'success');
            this.carregarAjudasCusto();
        }
    }

    /**
     * Estornar conta recebida (requer senha do administrador)
     */
    async estornarContaReceber(contaId) {
        // Verificar se é administrador
        const currentUser = auth.getCurrentUser();
        if (!currentUser || currentUser.tipo !== 'administrador') {
            app.showNotification('Apenas administradores podem estornar contas', 'error');
            return;
        }

        // Solicitar senha do administrador
        const senha = prompt('Digite sua senha de administrador para confirmar o estorno:');
        if (!senha) {
            return; // Usuário cancelou
        }

        // Validar senha
        const senhaHash = auth.hashPassword(senha);
        if (senhaHash !== currentUser.senha) {
            app.showNotification('Senha incorreta!', 'error');
            return;
        }

        // Confirmar estorno
        const confirmacao = confirm('Tem certeza que deseja estornar esta conta recebida?\n\nEsta ação irá:\n- Marcar a conta como pendente novamente\n- Remover as informações de recebimento\n\nEsta operação pode ser auditada pelo sistema.');
        
        if (!confirmacao) {
            return;
        }

        try {
            // Buscar a conta
            const contas = JSON.parse(localStorage.getItem('zorix:contas_receber') || '[]');
            const index = contas.findIndex(c => c.id === contaId);
            
            if (index >= 0) {
                const contaOriginal = { ...contas[index] };
                
                // Reverter status para pendente
                contas[index].status = 'pendente';
                contas[index].data_recebimento = null;
                contas[index].metodo_recebimento = null;
                contas[index].updated_at = new Date().toISOString();
                
                // Adicionar log de auditoria
                if (!contas[index].historico_estornos) {
                    contas[index].historico_estornos = [];
                }
                contas[index].historico_estornos.push({
                    data_estorno: new Date().toISOString(),
                    usuario_estorno: currentUser.nome,
                    valor_estornado: contaOriginal.valor,
                    data_recebimento_original: contaOriginal.data_recebimento,
                    metodo_recebimento_original: contaOriginal.metodo_recebimento
                });
                
                // Salvar alterações
                localStorage.setItem('zorix:contas_receber', JSON.stringify(contas));
                
                // Mostrar notificação de sucesso
                app.showNotification(`Conta estornada com sucesso! Valor: ${this.formatCurrency(contaOriginal.valor)}`, 'success');
                
                // Recarregar lista
                await this.loadContasReceber();
                
                // Log para auditoria
                console.log(`🔄 ESTORNO REALIZADO - Conta: ${contaId}, Valor: ${contaOriginal.valor}, Admin: ${currentUser.nome}, Data: ${new Date().toISOString()}`);
                
            } else {
                app.showNotification('Conta não encontrada', 'error');
            }
            
        } catch (error) {
            console.error('Erro ao estornar conta:', error);
            app.showNotification('Erro ao processar estorno', 'error');
        }
    }

    /**
     * Estornar conta paga (requer senha do administrador)
     */
    async estornarContaPagar(contaId) {
        // Verificar se é administrador
        const currentUser = auth.getCurrentUser();
        if (!currentUser || currentUser.tipo !== 'administrador') {
            app.showNotification('Apenas administradores podem estornar contas', 'error');
            return;
        }

        // Solicitar senha do administrador
        const senha = prompt('Digite sua senha de administrador para confirmar o estorno:');
        if (!senha) {
            return; // Usuário cancelou
        }

        // Validar senha
        const senhaHash = auth.hashPassword(senha);
        if (senhaHash !== currentUser.senha) {
            app.showNotification('Senha incorreta!', 'error');
            return;
        }

        // Confirmar estorno
        const confirmacao = confirm('Tem certeza que deseja estornar esta conta paga?\n\nEsta ação irá:\n- Marcar a conta como pendente novamente\n- Remover as informações de pagamento\n\nEsta operação pode ser auditada pelo sistema.');
        
        if (!confirmacao) {
            return;
        }

        try {
            // Buscar a conta
            const contas = JSON.parse(localStorage.getItem('zorix:contas_pagar') || '[]');
            const index = contas.findIndex(c => c.id === contaId);
            
            if (index >= 0) {
                const contaOriginal = { ...contas[index] };
                
                // Reverter status para pendente
                contas[index].status = 'pendente';
                contas[index].data_pagamento = null;
                contas[index].metodo_pagamento = null;
                contas[index].updated_at = new Date().toISOString();
                
                // Adicionar log de auditoria
                if (!contas[index].historico_estornos) {
                    contas[index].historico_estornos = [];
                }
                contas[index].historico_estornos.push({
                    data_estorno: new Date().toISOString(),
                    usuario_estorno: currentUser.nome,
                    valor_estornado: contaOriginal.valor,
                    data_pagamento_original: contaOriginal.data_pagamento,
                    metodo_pagamento_original: contaOriginal.metodo_pagamento
                });
                
                // Salvar alterações
                localStorage.setItem('zorix:contas_pagar', JSON.stringify(contas));
                
                // Mostrar notificação de sucesso
                app.showNotification(`Conta estornada com sucesso! Valor: ${this.formatCurrency(contaOriginal.valor)}`, 'success');
                
                // Recarregar lista
                await this.loadContasPagar();
                
                // Log para auditoria
                console.log(`🔄 ESTORNO REALIZADO - Conta: ${contaId}, Valor: ${contaOriginal.valor}, Admin: ${currentUser.nome}, Data: ${new Date().toISOString()}`);
                
            } else {
                app.showNotification('Conta não encontrada', 'error');
            }
            
        } catch (error) {
            console.error('Erro ao estornar conta:', error);
            app.showNotification('Erro ao processar estorno', 'error');
        }
    }

    /**
     * Gerar opções de vendedores para selects
     */
    getVendedoresOptions() {
        if (!window.configSistema) return '<option value="">Nenhum vendedor cadastrado</option>';
        
        const vendedores = configSistema.getVendedores();
        if (vendedores.length === 0) {
            return '<option value="">Nenhum vendedor cadastrado</option>';
        }

        return vendedores.map(vendedor => 
            `<option value="${vendedor.id}">${vendedor.nome}</option>`
        ).join('');
    }
}

// Inicializar o gerenciador de contas
window.contasManager = new ContasManager();
console.log('✅ Módulo de Contas carregado com sucesso!');