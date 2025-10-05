/**
 * LURIX CRM - Sistema de Caixa
 * Relatório de Entradas e Saídas
 * Autor: Sistema LURIX
 * Data: Outubro 2024
 */

class CaixaManager {
    constructor() {
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.chartInstance = null;
        
        console.log('💰 CaixaManager inicializado');
    }

    /**
     * Carrega a página principal do Caixa
     */
    async loadCaixa() {
        console.log('📊 Carregando página do Caixa...');
        
        const content = `
            <div class="fade-in min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                <!-- Header Moderno -->
                <div class="bg-white shadow-sm border-b border-gray-200 mb-8">
                    <div class="max-w-7xl mx-auto px-6 py-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h1 class="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                                    💰 Caixa - Fluxo Financeiro
                                </h1>
                                <p class="text-gray-600 mt-2">Relatório de entradas e saídas baseado nas contas</p>
                            </div>
                            <div class="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                <div class="flex items-center text-green-800 text-sm">
                                    <i class="fas fa-info-circle mr-2"></i>
                                    <span class="font-medium">Relatório baseado nas contas a pagar e receber</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="max-w-7xl mx-auto px-6">
                    <!-- Controles de Período -->
                    <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 mb-8">
                        <div class="flex items-center justify-between">
                            <h3 class="text-xl font-semibold text-gray-900">Período de Análise</h3>
                            <div class="flex items-center space-x-4">
                                <button onclick="caixaManager.changeMonth(-1)" 
                                    class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200">
                                    <i class="fas fa-chevron-left mr-2"></i>Anterior
                                </button>
                                <div class="text-lg font-semibold text-gray-900" id="currentPeriod">
                                    ${this.getMonthName(this.currentMonth + 1)} ${this.currentYear}
                                </div>
                                <button onclick="caixaManager.changeMonth(1)" 
                                    class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200">
                                    Próximo<i class="fas fa-chevron-right ml-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Cards de Resumo -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" id="resumoCards">
                        <!-- Cards serão carregados aqui -->
                    </div>

                    <!-- Gráfico de Fluxo -->
                    <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 mb-8">
                        <h3 class="text-xl font-semibold text-gray-900 mb-6">📈 Fluxo Diário do Mês</h3>
                        <div style="height: 400px;">
                            <canvas id="fluxoCaixaChart"></canvas>
                        </div>
                    </div>

                    <!-- Relatório Detalhado -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <!-- Entradas -->
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
                                <h3 class="text-xl font-semibold flex items-center">
                                    <i class="fas fa-arrow-up mr-3"></i>
                                    Entradas (Contas a Receber)
                                </h3>
                            </div>
                            <div class="p-6">
                                <div id="entradasList" class="space-y-3">
                                    <!-- Entradas serão carregadas aqui -->
                                </div>
                            </div>
                        </div>

                        <!-- Saídas -->
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div class="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
                                <h3 class="text-xl font-semibold flex items-center">
                                    <i class="fas fa-arrow-down mr-3"></i>
                                    Saídas (Contas a Pagar)
                                </h3>
                            </div>
                            <div class="p-6">
                                <div id="saidasList" class="space-y-3">
                                    <!-- Saídas serão carregadas aqui -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('pageContent').innerHTML = content;
        await this.carregarDados();
    }

    /**
     * Carrega todos os dados do período selecionado
     */
    async carregarDados() {
        try {
            console.log(`📊 Carregando dados do caixa para ${this.currentMonth}/${this.currentYear}`);
            
            // Buscar contas do período
            const contasReceber = await this.getContasReceber();
            const contasPagar = await this.getContasPagar();
            const ajudasCusto = await this.getAjudasCusto();
            
            // Combinar contas a pagar com ajudas de custo
            const todasSaidas = [...contasPagar, ...ajudasCusto.map(ajuda => ({
                id: ajuda.id,
                descricao: `Ajuda de Custo - ${ajuda.descricao}`,
                valor: ajuda.valor,
                vencimento: ajuda.data_ajuda.split('T')[0],
                categoria: 'Ajuda de Custo',
                status: 'pago',
                tipo: 'ajuda_custo',
                vendedor_nome: window.configSistema.getVendedorById(ajuda.vendedor_id)?.nome || 'Vendedor não encontrado'
            }))];
            
            // Renderizar componentes
            this.renderResumoCards(contasReceber, todasSaidas);
            this.renderListas(contasReceber, todasSaidas);
            this.renderGraficoFluxo(contasReceber, todasSaidas);
            
            console.log(`✅ Dados carregados - Entradas: ${contasReceber.length}, Saídas: ${todasSaidas.length} (${contasPagar.length} contas + ${ajudasCusto.length} ajudas)`);
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados do caixa:', error);
            this.showNotification('Erro ao carregar dados do caixa', 'error');
        }
    }

    /**
     * Busca contas a receber do período
     */
    async getContasReceber() {
        try {
            if (window.contasManager && window.contasManager.getContasReceber) {
                return await window.contasManager.getContasReceber(this.currentMonth, this.currentYear);
            }
            return [];
        } catch (error) {
            console.error('Erro ao buscar contas a receber:', error);
            return [];
        }
    }

    /**
     * Busca contas a pagar do período
     */
    async getContasPagar() {
        try {
            if (window.contasManager && window.contasManager.getContasPagar) {
                return await window.contasManager.getContasPagar(this.currentMonth, this.currentYear);
            }
            return [];
        } catch (error) {
            console.error('Erro ao buscar contas a pagar:', error);
            return [];
        }
    }

    /**
     * Busca ajudas de custo do período
     */
    async getAjudasCusto() {
        try {
            if (!window.configSistema) return [];
            
            const ajudas = window.configSistema.ajudasCusto || [];
            return ajudas.filter(ajuda => {
                const ajudaDate = new Date(ajuda.data_ajuda);
                return ajudaDate.getMonth() === this.currentMonth && ajudaDate.getFullYear() === this.currentYear;
            }).sort((a, b) => new Date(a.data_ajuda) - new Date(b.data_ajuda));
        } catch (error) {
            console.error('Erro ao buscar ajudas de custo:', error);
            return [];
        }
    }

    /**
     * Renderiza os cards de resumo
     */
    renderResumoCards(contasReceber, contasPagar) {
        const totalEntradas = contasReceber.reduce((sum, conta) => sum + parseFloat(conta.valor || 0), 0);
        const totalSaidas = contasPagar.reduce((sum, conta) => sum + parseFloat(conta.valor || 0), 0);
        const saldo = totalEntradas - totalSaidas;
        
        const entradasPagas = contasReceber.filter(c => c.status === 'recebido').reduce((sum, conta) => sum + parseFloat(conta.valor || 0), 0);
        const saidasPagas = contasPagar.filter(c => c.status === 'pago').reduce((sum, conta) => sum + parseFloat(conta.valor || 0), 0);
        const saldoRealizado = entradasPagas - saidasPagas;

        const resumoContainer = document.getElementById('resumoCards');
        if (!resumoContainer) return;

        resumoContainer.innerHTML = `
            <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-green-100 text-sm font-medium">Total de Entradas</p>
                        <p class="text-3xl font-bold">R$ ${totalEntradas.toLocaleString('pt-BR')}</p>
                        <p class="text-green-100 text-sm mt-1">${contasReceber.length} contas</p>
                    </div>
                    <i class="fas fa-arrow-up text-4xl text-green-200"></i>
                </div>
            </div>
            
            <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-red-100 text-sm font-medium">Total de Saídas</p>
                        <p class="text-3xl font-bold">R$ ${totalSaidas.toLocaleString('pt-BR')}</p>
                        <p class="text-red-100 text-sm mt-1">${contasPagar.length} contas</p>
                    </div>
                    <i class="fas fa-arrow-down text-4xl text-red-200"></i>
                </div>
            </div>
            
            <div class="bg-gradient-to-r ${saldo >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-${saldo >= 0 ? 'blue' : 'orange'}-100 text-sm font-medium">Saldo Previsto</p>
                        <p class="text-3xl font-bold">R$ ${saldo.toLocaleString('pt-BR')}</p>
                        <p class="text-${saldo >= 0 ? 'blue' : 'orange'}-100 text-sm mt-1">${saldo >= 0 ? 'Positivo' : 'Negativo'}</p>
                    </div>
                    <i class="fas fa-balance-scale text-4xl text-${saldo >= 0 ? 'blue' : 'orange'}-200"></i>
                </div>
            </div>
            
            <div class="bg-gradient-to-r ${saldoRealizado >= 0 ? 'from-purple-500 to-purple-600' : 'from-yellow-500 to-yellow-600'} rounded-xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-${saldoRealizado >= 0 ? 'purple' : 'yellow'}-100 text-sm font-medium">Saldo Realizado</p>
                        <p class="text-3xl font-bold">R$ ${saldoRealizado.toLocaleString('pt-BR')}</p>
                        <p class="text-${saldoRealizado >= 0 ? 'purple' : 'yellow'}-100 text-sm mt-1">Contas pagas</p>
                    </div>
                    <i class="fas fa-check-circle text-4xl text-${saldoRealizado >= 0 ? 'purple' : 'yellow'}-200"></i>
                </div>
            </div>
        `;
    }

    /**
     * Renderiza as listas de entradas e saídas
     */
    renderListas(contasReceber, contasPagar) {
        this.renderListaEntradas(contasReceber);
        this.renderListaSaidas(contasPagar);
    }

    /**
     * Renderiza lista de entradas
     */
    renderListaEntradas(contas) {
        const container = document.getElementById('entradasList');
        if (!container) return;

        if (contas.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-inbox text-4xl mb-4"></i>
                    <p>Nenhuma conta a receber neste período</p>
                </div>
            `;
            return;
        }

        container.innerHTML = contas.map(conta => `
            <div class="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition duration-200">
                <div class="flex-1">
                    <div class="font-semibold text-gray-900">${conta.descricao || 'Conta a receber'}</div>
                    <div class="text-sm text-gray-600">
                        Vencimento: ${new Date(conta.vencimento || conta.data_vencimento).toLocaleDateString('pt-BR')}
                    </div>
                    ${conta.cliente_nome ? `<div class="text-sm text-blue-600">Cliente: ${conta.cliente_nome}</div>` : ''}
                </div>
                <div class="text-right">
                    <div class="text-lg font-bold text-green-700">R$ ${parseFloat(conta.valor || 0).toLocaleString('pt-BR')}</div>
                    <div class="text-sm ${conta.status === 'recebido' ? 'text-green-600' : 'text-orange-600'}">
                        <i class="fas ${conta.status === 'recebido' ? 'fa-check-circle' : 'fa-clock'} mr-1"></i>
                        ${conta.status === 'recebido' ? 'Recebida' : 'Pendente'}
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Renderiza lista de saídas
     */
    renderListaSaidas(contas) {
        const container = document.getElementById('saidasList');
        if (!container) return;

        if (contas.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-inbox text-4xl mb-4"></i>
                    <p>Nenhuma conta a pagar neste período</p>
                </div>
            `;
            return;
        }

        container.innerHTML = contas.map(conta => `
            <div class="flex items-center justify-between p-4 ${conta.tipo === 'ajuda_custo' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'} border rounded-lg hover:${conta.tipo === 'ajuda_custo' ? 'bg-yellow-100' : 'bg-red-100'} transition duration-200">
                <div class="flex-1">
                    <div class="font-semibold text-gray-900">${conta.descricao || 'Conta a pagar'}</div>
                    <div class="text-sm text-gray-600">
                        ${conta.tipo === 'ajuda_custo' ? 'Data:' : 'Vencimento:'} ${new Date(conta.vencimento || conta.data_vencimento).toLocaleDateString('pt-BR')}
                    </div>
                    ${conta.categoria ? `<div class="text-sm ${conta.tipo === 'ajuda_custo' ? 'text-yellow-600' : 'text-blue-600'}">
                        ${conta.tipo === 'ajuda_custo' ? 'Vendedor:' : 'Categoria:'} ${conta.tipo === 'ajuda_custo' ? conta.vendedor_nome : conta.categoria}
                    </div>` : ''}
                </div>
                <div class="text-right">
                    <div class="text-lg font-bold ${conta.tipo === 'ajuda_custo' ? 'text-yellow-700' : 'text-red-700'}">R$ ${parseFloat(conta.valor || 0).toLocaleString('pt-BR')}</div>
                    <div class="text-sm ${conta.status === 'pago' ? 'text-green-600' : 'text-orange-600'}">
                        <i class="fas ${conta.status === 'pago' ? 'fa-check-circle' : 'fa-clock'} mr-1"></i>
                        ${conta.status === 'pago' ? (conta.tipo === 'ajuda_custo' ? 'Realizada' : 'Paga') : 'Pendente'}
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Renderiza gráfico de fluxo diário
     */
    renderGraficoFluxo(contasReceber, contasPagar) {
        const canvas = document.getElementById('fluxoCaixaChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Destruir gráfico anterior se existir
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        // Preparar dados por dia do mês
        const diasDoMes = new Date(this.currentYear, this.currentMonth, 0).getDate();
        const labels = [];
        const entradas = [];
        const saidas = [];
        const saldoDiario = [];

        for (let dia = 1; dia <= diasDoMes; dia++) {
            labels.push(dia.toString().padStart(2, '0'));
            
            // Calcular entradas do dia
            const entradasDia = contasReceber
                .filter(c => new Date(c.data_vencimento).getDate() === dia)
                .reduce((sum, c) => sum + parseFloat(c.valor || 0), 0);
            entradas.push(entradasDia);
            
            // Calcular saídas do dia
            const saidasDia = contasPagar
                .filter(c => new Date(c.data_vencimento).getDate() === dia)
                .reduce((sum, c) => sum + parseFloat(c.valor || 0), 0);
            saidas.push(saidasDia);
            
            // Saldo do dia
            saldoDiario.push(entradasDia - saidasDia);
        }

        this.chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Entradas',
                        data: entradas,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Saídas',
                        data: saidas,
                        borderColor: '#EF4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Saldo Diário',
                        data: saldoDiario,
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: `Fluxo de Caixa Diário - ${this.getMonthName(this.currentMonth + 1)} ${this.currentYear}`
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Dias do Mês'
                        }
                    }
                },
                tooltips: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': R$ ' + context.parsed.y.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        });
    }

    /**
     * Muda o mês de visualização
     */
    async changeMonth(delta) {
        this.currentMonth += delta;
        
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        
        // Atualizar período na tela
        const periodElement = document.getElementById('currentPeriod');
        if (periodElement) {
            periodElement.textContent = `${this.getMonthName(this.currentMonth + 1)} ${this.currentYear}`;
        }
        
        // Recarregar dados
        await this.carregarDados();
    }

    /**
     * Retorna nome do mês
     */
    getMonthName(month) {
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return months[month - 1];
    }

    /**
     * Sistema de notificações
     */
    showNotification(message, type = 'info') {
        // Remove notificação existente
        const existing = document.getElementById('caixaNotification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.id = 'caixaNotification';
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

// Instância global
window.caixaManager = new CaixaManager();

console.log('✅ Sistema de Caixa carregado com sucesso!');