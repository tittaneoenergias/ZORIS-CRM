// Relatórios Management for LURIX CRM
class RelatoriosManager {
    constructor() {
        this.charts = {};
        this.currentData = {};
    }

    async loadRelatorios() {
        const content = `
            <div class="fade-in">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Relatórios</h1>
                        <p class="text-gray-600 mt-2">Análises e métricas do seu negócio</p>
                    </div>
                    <div class="flex space-x-3">
                        <button id="exportPdfBtn" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200 flex items-center">
                            <i class="fas fa-file-pdf mr-2"></i>
                            Exportar PDF
                        </button>
                        <button id="exportExcelBtn" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center">
                            <i class="fas fa-file-excel mr-2"></i>
                            Exportar Excel
                        </button>
                    </div>
                </div>

                <!-- Filters -->
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Período</label>
                            <select id="filterPeriodo" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="30">Últimos 30 dias</option>
                                <option value="90">Últimos 3 meses</option>
                                <option value="180">Últimos 6 meses</option>
                                <option value="365">Último ano</option>
                                <option value="all">Todo o período</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Data de Início</label>
                            <input type="date" id="filterDataInicio" 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Data de Fim</label>
                            <input type="date" id="filterDataFim" 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        
                        <div class="flex items-end">
                            <button id="updateFilters" class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                                Atualizar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- KPI Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-500 text-sm font-medium">Receita Total</p>
                                <p class="text-2xl font-bold text-gray-900" id="receitaTotal">-</p>
                                <p class="text-green-600 text-sm mt-1" id="receitaTendencia">
                                    <i class="fas fa-arrow-up"></i> <span>-</span>
                                </p>
                            </div>
                            <div class="bg-green-100 p-3 rounded-lg">
                                <i class="fas fa-dollar-sign text-green-600 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-500 text-sm font-medium">Projetos Concluídos</p>
                                <p class="text-2xl font-bold text-gray-900" id="projetosConcluidos">-</p>
                                <p class="text-blue-600 text-sm mt-1" id="projetosTendencia">
                                    <i class="fas fa-chart-line"></i> <span>-</span>
                                </p>
                            </div>
                            <div class="bg-blue-100 p-3 rounded-lg">
                                <i class="fas fa-check-circle text-blue-600 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-500 text-sm font-medium">Clientes Ativos</p>
                                <p class="text-2xl font-bold text-gray-900" id="clientesAtivos">-</p>
                                <p class="text-blue-600 text-sm mt-1" id="clientesTendencia">
                                    <i class="fas fa-users"></i> <span>-</span>
                                </p>
                            </div>
                            <div class="bg-blue-100 p-3 rounded-lg">
                                <i class="fas fa-users text-blue-600 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-500 text-sm font-medium">Potência Instalada</p>
                                <p class="text-2xl font-bold text-gray-900" id="potenciaInstalada">-</p>
                                <p class="text-yellow-600 text-sm mt-1" id="potenciaTendencia">
                                    <i class="fas fa-bolt"></i> <span>kWp</span>
                                </p>
                            </div>
                            <div class="bg-yellow-100 p-3 rounded-lg">
                                <i class="fas fa-solar-panel text-yellow-600 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <!-- Revenue Chart -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Receita Mensal</h3>
                        <div style="height: 300px;">
                            <canvas id="receitaMensalChart"></canvas>
                        </div>
                    </div>

                    <!-- Projects by Status -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Projetos por Status</h3>
                        <div style="height: 300px;">
                            <canvas id="projetosStatusChart"></canvas>
                        </div>
                    </div>

                    <!-- Customer Growth -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Crescimento de Clientes</h3>
                        <div style="height: 300px;">
                            <canvas id="crescimentoClientesChart"></canvas>
                        </div>
                    </div>

                    <!-- Sales Funnel -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Funil de Vendas</h3>
                        <div style="height: 300px;">
                            <canvas id="funilVendasChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Tables Section -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <!-- Top Clients -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div class="p-6 border-b border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900">Top Clientes por Receita</h3>
                        </div>
                        <div class="p-6">
                            <div id="topClientesTable" class="space-y-3">
                                <!-- Top clients will be loaded here -->
                            </div>
                        </div>
                    </div>

                    <!-- Performance by User -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div class="p-6 border-b border-gray-200">
                            <h3 class="text-lg font-semibold text-gray-900">Performance por Usuário</h3>
                        </div>
                        <div class="p-6">
                            <div id="performanceUsuariosTable" class="space-y-3">
                                <!-- User performance will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Detailed Reports -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div class="p-6 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">Relatório Detalhado</h3>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="text-left py-3 px-6 font-medium text-gray-900">Cliente</th>
                                    <th class="text-left py-3 px-6 font-medium text-gray-900">Projeto</th>
                                    <th class="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                                    <th class="text-left py-3 px-6 font-medium text-gray-900">Potência</th>
                                    <th class="text-left py-3 px-6 font-medium text-gray-900">Valor</th>
                                    <th class="text-left py-3 px-6 font-medium text-gray-900">Data</th>
                                </tr>
                            </thead>
                            <tbody id="detailedReportTable" class="divide-y divide-gray-200">
                                <!-- Detailed report data will be loaded here -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Relatório de Movimentações de Contas -->
                <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div class="p-6 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">Relatório de Movimentações de Contas</h3>
                            <p class="text-sm text-gray-600 mt-1">Histórico completo de contas a pagar, receber, ajudas de custo e estornos</p>
                        </div>
                        <div class="flex space-x-2">
                            <button id="filtrarMovimentacoes" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm">
                                <i class="fas fa-filter mr-1"></i>
                                Filtrar
                            </button>
                            <button id="exportMovimentacoes" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 text-sm">
                                <i class="fas fa-file-excel mr-1"></i>
                                Exportar
                            </button>
                        </div>
                    </div>
                    
                    <!-- Filtros específicos do relatório -->
                    <div id="filtrosMovimentacoes" class="p-6 border-b border-gray-200 bg-gray-50 hidden">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Movimentação</label>
                                <select id="filterTipoMovimentacao" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                    <option value="">Todas</option>
                                    <option value="conta_receber">Contas a Receber</option>
                                    <option value="conta_pagar">Contas a Pagar</option>
                                    <option value="ajuda_custo">Ajudas de Custo</option>
                                    <option value="estorno">Estornos</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select id="filterStatusMovimentacao" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                    <option value="">Todos</option>
                                    <option value="pendente">Pendente</option>
                                    <option value="pago">Pago</option>
                                    <option value="recebido">Recebido</option>
                                    <option value="estornado">Estornado</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Valor Mínimo</label>
                                <input type="text" id="filterValorMin" placeholder="R$ 0,00" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    onkeyup="window.formatCurrencyInputBR(this)">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Valor Máximo</label>
                                <input type="text" id="filterValorMax" placeholder="R$ 0,00" 
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    onkeyup="window.formatCurrencyInputBR(this)">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Resumo das movimentações -->
                    <div id="resumoMovimentacoes" class="p-6 border-b border-gray-200">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-green-600" id="totalRecebido">R$ 0,00</div>
                                <div class="text-sm text-gray-600">Total Recebido</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-red-600" id="totalPago">R$ 0,00</div>
                                <div class="text-sm text-gray-600">Total Pago</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-yellow-600" id="totalAjudas">R$ 0,00</div>
                                <div class="text-sm text-gray-600">Total Ajudas</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-blue-600" id="saldoLiquido">R$ 0,00</div>
                                <div class="text-sm text-gray-600">Saldo Líquido</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Tabela de movimentações -->
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="text-left py-3 px-4 font-medium text-gray-900">Data</th>
                                    <th class="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
                                    <th class="text-left py-3 px-4 font-medium text-gray-900">Descrição</th>
                                    <th class="text-left py-3 px-4 font-medium text-gray-900">Valor</th>
                                    <th class="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                    <th class="text-left py-3 px-4 font-medium text-gray-900">Cliente/Vendedor</th>
                                    <th class="text-left py-3 px-4 font-medium text-gray-900">Observações</th>
                                </tr>
                            </thead>
                            <tbody id="movimentacoesTable" class="divide-y divide-gray-200">
                                <!-- Movimentações serão carregadas aqui -->
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Paginação -->
                    <div id="paginacaoMovimentacoes" class="p-4 border-t border-gray-200 flex items-center justify-between">
                        <div class="text-sm text-gray-600">
                            Mostrando <span id="movimentacoesInfo">0 de 0</span> movimentações
                        </div>
                        <div class="flex space-x-2" id="botoesPaginacao">
                            <!-- Botões de paginação serão gerados dinamicamente -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('pageContent').innerHTML = content;
        this.initializeEventListeners();
        await this.loadReportData();
    }

    initializeEventListeners() {
        // Filter change handlers
        document.getElementById('updateFilters').addEventListener('click', () => {
            this.loadReportData();
        });

        document.getElementById('filterPeriodo').addEventListener('change', () => {
            this.updateDateFilters();
        });

        // Export handlers
        document.getElementById('exportPdfBtn').addEventListener('click', () => {
            this.exportToPDF();
        });

        document.getElementById('exportExcelBtn').addEventListener('click', () => {
            this.exportToExcel();
        });

        // Set default dates
        this.updateDateFilters();

        // Event listeners para relatório de movimentações
        document.getElementById('filtrarMovimentacoes').addEventListener('click', () => {
            const filtros = document.getElementById('filtrosMovimentacoes');
            filtros.classList.toggle('hidden');
        });

        document.getElementById('exportMovimentacoes').addEventListener('click', () => {
            this.exportMovimentacoes();
        });

        // Aplicar filtros quando houver mudança
        ['filterTipoMovimentacao', 'filterStatusMovimentacao', 'filterValorMin', 'filterValorMax'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.carregarMovimentacoes();
                });
            }
        });

        // Carregar movimentações inicialmente
        this.carregarMovimentacoes();
    }

    updateDateFilters() {
        const periodo = document.getElementById('filterPeriodo').value;
        const hoje = new Date();
        const dataFim = hoje.toISOString().split('T')[0];
        
        let dataInicio;
        if (periodo === 'all') {
            dataInicio = '';
        } else {
            const diasAtras = parseInt(periodo);
            const dataInicioObj = new Date(hoje.getTime() - diasAtras * 24 * 60 * 60 * 1000);
            dataInicio = dataInicioObj.toISOString().split('T')[0];
        }
        
        document.getElementById('filterDataInicio').value = dataInicio;
        document.getElementById('filterDataFim').value = dataFim;
    }

    async loadReportData() {
        try {
            // Load all data
            const [clientes, projetos, interacoes, agendamentos] = await Promise.all([
                api.getClientes(1, 1000),
                api.getProjetos(1, 1000),
                api.getInteracoes(1, 1000),
                api.getAgendamentos(1, 1000)
            ]);

            this.currentData = {
                clientes: clientes.data || [],
                projetos: projetos.data || [],
                interacoes: interacoes.data || [],
                agendamentos: agendamentos.data || []
            };

            // Apply date filters
            this.applyDateFilters();

            // Update all sections
            this.updateKPIs();
            this.updateCharts();
            this.updateTopClients();
            this.updateUserPerformance();
            this.updateDetailedReport();

        } catch (error) {
            console.error('Erro ao carregar dados dos relatórios:', error);
        }
    }

    applyDateFilters() {
        const dataInicio = document.getElementById('filterDataInicio').value;
        const dataFim = document.getElementById('filterDataFim').value;

        if (!dataInicio || !dataFim) return;

        const startDate = new Date(dataInicio);
        const endDate = new Date(dataFim);
        endDate.setHours(23, 59, 59, 999); // End of day

        // Filter projects by creation date
        this.currentData.projetos = this.currentData.projetos.filter(projeto => {
            const projetoDate = new Date(projeto.created_at || projeto.data_inicio);
            return projetoDate >= startDate && projetoDate <= endDate;
        });

        // Filter interactions by date
        this.currentData.interacoes = this.currentData.interacoes.filter(interacao => {
            const interacaoDate = new Date(interacao.data_interacao);
            return interacaoDate >= startDate && interacaoDate <= endDate;
        });
    }

    updateKPIs() {
        const { projetos, clientes, interacoes } = this.currentData;

        // Receita Total
        const receitaTotal = projetos
            .filter(p => p.status === 'concluido')
            .reduce((total, p) => total + (p.valor_investimento || 0), 0);
        document.getElementById('receitaTotal').textContent = api.formatCurrency(receitaTotal);

        // Projetos Concluídos
        const projetosConcluidos = projetos.filter(p => p.status === 'concluido').length;
        document.getElementById('projetosConcluidos').textContent = projetosConcluidos;

        // Clientes Ativos
        const clientesAtivos = clientes.filter(c => c.status === 'cliente').length;
        document.getElementById('clientesAtivos').textContent = clientesAtivos;

        // Potência Instalada
        const potenciaInstalada = projetos
            .filter(p => p.status === 'concluido')
            .reduce((total, p) => total + (p.potencia_kwp || 0), 0);
        document.getElementById('potenciaInstalada').textContent = `${potenciaInstalada.toFixed(2)} kWp`;

        // Update trends (simplified)
        document.getElementById('receitaTendencia').innerHTML = `<i class="fas fa-arrow-up"></i> +12% vs período anterior`;
        document.getElementById('projetosTendencia').innerHTML = `<i class="fas fa-chart-line"></i> ${projetosConcluidos} concluídos`;
        document.getElementById('clientesTendencia').innerHTML = `<i class="fas fa-users"></i> ${clientesAtivos} ativos`;
        document.getElementById('potenciaTendencia').innerHTML = `<i class="fas fa-bolt"></i> ${potenciaInstalada.toFixed(2)} kWp`;
    }

    updateCharts() {
        this.createReceitaMensalChart();
        this.createProjetosStatusChart();
        this.createCrescimentoClientesChart();
        this.createFunilVendasChart();
    }

    createReceitaMensalChart() {
        const ctx = document.getElementById('receitaMensalChart').getContext('2d');
        
        if (this.charts.receita) {
            this.charts.receita.destroy();
        }

        // Generate monthly data for the last 6 months
        const months = [];
        const revenues = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStr = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
            months.push(monthStr);
            
            // Calculate revenue for this month (simplified simulation)
            const monthlyRevenue = this.currentData.projetos
                .filter(p => p.status === 'concluido')
                .reduce((total, p) => total + (p.valor_investimento || 0), 0) / 6 * (0.7 + Math.random() * 0.6);
            revenues.push(monthlyRevenue);
        }

        this.charts.receita = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Receita (R$)',
                    data: revenues,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return api.formatCurrency(value);
                            }
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    createProjetosStatusChart() {
        const ctx = document.getElementById('projetosStatusChart').getContext('2d');
        
        if (this.charts.projetosStatus) {
            this.charts.projetosStatus.destroy();
        }

        const statusCount = {};
        this.currentData.projetos.forEach(projeto => {
            statusCount[projeto.status] = (statusCount[projeto.status] || 0) + 1;
        });

        const labels = Object.keys(statusCount).map(status => this.formatStatus(status));
        const data = Object.values(statusCount);
        
        this.charts.projetosStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#E6FF28', '#064B59', '#00C851', 
                        '#FF4444', '#898A90', '#007AFF'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 15 }
                    }
                }
            }
        });
    }

    createCrescimentoClientesChart() {
        const ctx = document.getElementById('crescimentoClientesChart').getContext('2d');
        
        if (this.charts.crescimentoClientes) {
            this.charts.crescimentoClientes.destroy();
        }

        // Generate client growth data
        const months = [];
        const clientCount = [];
        let totalClients = 0;
        
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStr = date.toLocaleDateString('pt-BR', { month: 'short' });
            months.push(monthStr);
            
            // Simulate growth
            totalClients += Math.floor(Math.random() * 5) + 2;
            clientCount.push(totalClients);
        }

        this.charts.crescimentoClientes = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Novos Clientes',
                    data: clientCount.map((current, index) => 
                        index === 0 ? current : current - clientCount[index - 1]
                    ),
                    backgroundColor: '#007AFF',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    createFunilVendasChart() {
        const ctx = document.getElementById('funilVendasChart').getContext('2d');
        
        if (this.charts.funilVendas) {
            this.charts.funilVendas.destroy();
        }

        const statusOrder = ['em_estudo', 'proposta_enviada', 'aprovado', 'em_instalacao', 'concluido'];
        const funnelData = statusOrder.map(status => 
            this.currentData.projetos.filter(p => p.status === status).length
        );

        this.charts.funilVendas = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: statusOrder.map(status => this.formatStatus(status)),
                datasets: [{
                    data: funnelData,
                    backgroundColor: [
                        '#FCD34D', '#60A5FA', '#34D399', 
                        '#FF4444', '#10B981'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { beginAtZero: true }
                }
            }
        });
    }

    async updateTopClients() {
        const container = document.getElementById('topClientesTable');
        
        // Calculate revenue per client
        const clientRevenue = {};
        
        this.currentData.projetos.forEach(projeto => {
            if (projeto.status === 'concluido' && projeto.cliente_id) {
                clientRevenue[projeto.cliente_id] = 
                    (clientRevenue[projeto.cliente_id] || 0) + (projeto.valor_investimento || 0);
            }
        });

        // Get client names and sort by revenue
        const clientPromises = Object.keys(clientRevenue).map(async (clienteId) => {
            try {
                const cliente = await api.getCliente(clienteId);
                return {
                    nome: cliente ? cliente.nome : 'Cliente não encontrado',
                    receita: clientRevenue[clienteId]
                };
            } catch {
                return null;
            }
        });

        const clients = (await Promise.all(clientPromises))
            .filter(Boolean)
            .sort((a, b) => b.receita - a.receita)
            .slice(0, 5);

        if (clients.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center">Nenhum dado disponível</p>';
            return;
        }

        const html = clients.map((cliente, index) => `
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold text-sm">
                        ${index + 1}
                    </div>
                    <div>
                        <p class="font-medium text-gray-900">${cliente.nome}</p>
                    </div>
                </div>
                <div class="font-semibold text-green-600">
                    ${api.formatCurrency(cliente.receita)}
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    updateUserPerformance() {
        const container = document.getElementById('performanceUsuariosTable');
        
        // Simulate user performance data
        const users = [
            { nome: 'João Silva', projetos: 8, receita: 150000 },
            { nome: 'Maria Santos', projetos: 6, receita: 120000 },
            { nome: 'Pedro Costa', projetos: 4, receita: 85000 },
            { nome: 'Ana Oliveira', projetos: 5, receita: 95000 }
        ];

        const html = users.map((user, index) => `
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center font-semibold text-sm">
                        ${index + 1}
                    </div>
                    <div>
                        <p class="font-medium text-gray-900">${user.nome}</p>
                        <p class="text-sm text-gray-500">${user.projetos} projetos</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-gray-900">${api.formatCurrency(user.receita)}</p>
                    <p class="text-xs text-gray-500">Receita gerada</p>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    async updateDetailedReport() {
        const tbody = document.getElementById('detailedReportTable');
        
        if (this.currentData.projetos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-8 text-gray-500">
                        Nenhum projeto encontrado no período selecionado
                    </td>
                </tr>
            `;
            return;
        }

        // Get client names for projects
        const clienteIds = [...new Set(this.currentData.projetos.map(p => p.cliente_id))];
        const clientesPromises = clienteIds.map(id => api.getCliente(id).catch(() => null));
        const clientes = await Promise.all(clientesPromises);
        const clientesMap = {};
        clientes.forEach(cliente => {
            if (cliente) clientesMap[cliente.id] = cliente;
        });

        const rows = this.currentData.projetos.map(projeto => {
            const cliente = clientesMap[projeto.cliente_id];
            
            return `
                <tr class="hover:bg-gray-50">
                    <td class="py-3 px-6">${cliente ? cliente.nome : 'N/A'}</td>
                    <td class="py-3 px-6">${projeto.nome}</td>
                    <td class="py-3 px-6">
                        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${this.getStatusColors(projeto.status)}">
                            ${this.formatStatus(projeto.status)}
                        </span>
                    </td>
                    <td class="py-3 px-6">${projeto.potencia_kwp ? `${projeto.potencia_kwp} kWp` : 'N/A'}</td>
                    <td class="py-3 px-6">${projeto.valor_investimento ? api.formatCurrency(projeto.valor_investimento) : 'N/A'}</td>
                    <td class="py-3 px-6">${projeto.data_inicio ? api.formatDate(projeto.data_inicio) : 'N/A'}</td>
                </tr>
            `;
        }).join('');

        tbody.innerHTML = rows;
    }

    formatStatus(status) {
        const statuses = {
            'analise': 'Análise',
            'perdida': 'Perdida',
            'ganha': 'Ganha'
        };
        return statuses[status] || status;
    }

    getStatusColors(status) {
        const colors = {
            'analise': 'bg-yellow-100 text-yellow-800',
            'perdida': 'bg-gray-100 text-gray-800',
            'ganha': 'bg-green-100 text-green-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    exportToPDF() {
        // Simulate PDF export
        this.showNotification('Funcionalidade de exportação PDF será implementada com biblioteca específica', 'info');
        
        // In a real implementation, you would use libraries like jsPDF or generate server-side
        console.log('PDF export would be implemented here');
    }

    exportToExcel() {
        // Simulate Excel export
        this.showNotification('Funcionalidade de exportação Excel será implementada com biblioteca específica', 'info');
        
        // In a real implementation, you would use libraries like SheetJS
        console.log('Excel export would be implemented here');
    }

    // Novo método para carregar todas as movimentações de contas
    carregarMovimentacoes() {
        try {
            const movimentacoes = this.obterTodasMovimentacoes();
            const movimentacoesFiltradas = this.filtrarMovimentacoes(movimentacoes);
            
            this.atualizarResumoMovimentacoes(movimentacoesFiltradas);
            this.renderizarTabelaMovimentacoes(movimentacoesFiltradas);
            this.atualizarPaginacao(movimentacoesFiltradas);
            
        } catch (error) {
            console.error('Erro ao carregar movimentações:', error);
            this.showNotification('Erro ao carregar movimentações de contas', 'error');
        }
    }

    // Obter todas as movimentações do localStorage
    obterTodasMovimentacoes() {
        const movimentacoes = [];
        
        try {
            // 1. Contas a Receber
            const contasReceber = JSON.parse(localStorage.getItem('contasReceber')) || [];
            contasReceber.forEach(conta => {
                movimentacoes.push({
                    id: conta.id,
                    data: conta.data_vencimento || conta.created_at,
                    tipo: 'conta_receber',
                    descricao: conta.descricao || `Conta a Receber - ${conta.cliente_nome || 'N/A'}`,
                    valor: conta.valor || 0,
                    status: conta.status || 'pendente',
                    cliente_vendedor: conta.cliente_nome || 'N/A',
                    observacoes: conta.observacoes || '',
                    projeto_id: conta.projeto_id || null,
                    parcela: conta.parcela || null,
                    total_parcelas: conta.total_parcelas || null,
                    forma_recebimento: conta.forma_recebimento || null,
                    data_recebimento: conta.data_recebimento || null,
                    valor_recebido: conta.valor_recebido || null,
                    historico_estornos: conta.historico_estornos || []
                });
            });

            // 2. Contas a Pagar
            const contasPagar = JSON.parse(localStorage.getItem('contasPagar')) || [];
            contasPagar.forEach(conta => {
                movimentacoes.push({
                    id: conta.id,
                    data: conta.data_vencimento || conta.created_at,
                    tipo: 'conta_pagar',
                    descricao: conta.descricao || `Conta a Pagar - ${conta.fornecedor || 'N/A'}`,
                    valor: conta.valor || 0,
                    status: conta.status || 'pendente',
                    cliente_vendedor: conta.fornecedor || 'N/A',
                    observacoes: conta.observacoes || '',
                    categoria: conta.categoria || null,
                    data_pagamento: conta.data_pagamento || null,
                    valor_pago: conta.valor_pago || null,
                    forma_pagamento: conta.forma_pagamento || null,
                    historico_estornos: conta.historico_estornos || []
                });
            });

            // 3. Ajudas de Custo
            const ajudasCusto = JSON.parse(localStorage.getItem('ajudasCusto')) || [];
            ajudasCusto.forEach(ajuda => {
                movimentacoes.push({
                    id: ajuda.id,
                    data: ajuda.data || ajuda.created_at,
                    tipo: 'ajuda_custo',
                    descricao: `Ajuda de Custo - ${ajuda.vendedor_nome || 'N/A'}`,
                    valor: ajuda.valor || 0,
                    status: ajuda.status || 'pendente',
                    cliente_vendedor: ajuda.vendedor_nome || 'N/A',
                    observacoes: ajuda.observacoes || ajuda.descricao || '',
                    projeto_relacionado: ajuda.projeto_relacionado || null,
                    tipo_ajuda: ajuda.tipo || null,
                    data_pagamento: ajuda.data_pagamento || null
                });
            });

            // 4. Estornos (das contas a receber)
            contasReceber.forEach(conta => {
                if (conta.historico_estornos && conta.historico_estornos.length > 0) {
                    conta.historico_estornos.forEach(estorno => {
                        movimentacoes.push({
                            id: `estorno_receber_${estorno.id || Date.now()}_${conta.id}`,
                            data: estorno.data_estorno,
                            tipo: 'estorno',
                            descricao: `Estorno - ${conta.descricao || 'Conta a Receber'}`,
                            valor: -(estorno.valor_estornado || 0), // Valor negativo para estornos
                            status: 'estornado',
                            cliente_vendedor: conta.cliente_nome || 'N/A',
                            observacoes: estorno.motivo || 'Estorno realizado',
                            conta_original_id: conta.id,
                            conta_original_tipo: 'conta_receber',
                            administrador: estorno.administrador || 'N/A'
                        });
                    });
                }
            });

            // 5. Estornos (das contas a pagar)
            contasPagar.forEach(conta => {
                if (conta.historico_estornos && conta.historico_estornos.length > 0) {
                    conta.historico_estornos.forEach(estorno => {
                        movimentacoes.push({
                            id: `estorno_pagar_${estorno.id || Date.now()}_${conta.id}`,
                            data: estorno.data_estorno,
                            tipo: 'estorno',
                            descricao: `Estorno - ${conta.descricao || 'Conta a Pagar'}`,
                            valor: estorno.valor_estornado || 0, // Valor positivo para estornos de contas a pagar
                            status: 'estornado',
                            cliente_vendedor: conta.fornecedor || 'N/A',
                            observacoes: estorno.motivo || 'Estorno realizado',
                            conta_original_id: conta.id,
                            conta_original_tipo: 'conta_pagar',
                            administrador: estorno.administrador || 'N/A'
                        });
                    });
                }
            });

        } catch (error) {
            console.error('Erro ao obter movimentações do localStorage:', error);
        }
        
        // Ordenar por data (mais recente primeiro)
        return movimentacoes.sort((a, b) => new Date(b.data) - new Date(a.data));
    }

    // Filtrar movimentações conforme os filtros aplicados
    filtrarMovimentacoes(movimentacoes) {
        const tipoFiltro = document.getElementById('filterTipoMovimentacao')?.value || '';
        const statusFiltro = document.getElementById('filterStatusMovimentacao')?.value || '';
        const valorMinFiltro = this.parseCurrencyBR(document.getElementById('filterValorMin')?.value || '0');
        const valorMaxFiltro = this.parseCurrencyBR(document.getElementById('filterValorMax')?.value || '999999999');
        
        return movimentacoes.filter(mov => {
            // Filtro por tipo
            if (tipoFiltro && mov.tipo !== tipoFiltro) return false;
            
            // Filtro por status
            if (statusFiltro && mov.status !== statusFiltro) return false;
            
            // Filtro por valor
            const valorAbs = Math.abs(mov.valor);
            if (valorAbs < valorMinFiltro || valorAbs > valorMaxFiltro) return false;
            
            return true;
        });
    }

    // Atualizar o resumo das movimentações
    atualizarResumoMovimentacoes(movimentacoes) {
        let totalRecebido = 0;
        let totalPago = 0;
        let totalAjudas = 0;
        
        movimentacoes.forEach(mov => {
            switch (mov.tipo) {
                case 'conta_receber':
                    if (mov.status === 'recebido') {
                        totalRecebido += mov.valor;
                    }
                    break;
                case 'conta_pagar':
                    if (mov.status === 'pago') {
                        totalPago += mov.valor;
                    }
                    break;
                case 'ajuda_custo':
                    if (mov.status === 'pago') {
                        totalAjudas += mov.valor;
                    }
                    break;
                case 'estorno':
                    // Estornos já são contabilizados com valores negativos/positivos apropriados
                    if (mov.conta_original_tipo === 'conta_receber') {
                        totalRecebido += mov.valor; // Valor negativo
                    } else if (mov.conta_original_tipo === 'conta_pagar') {
                        totalPago -= mov.valor; // Subtrai o valor estornado
                    }
                    break;
            }
        });
        
        const saldoLiquido = totalRecebido - totalPago - totalAjudas;
        
        // Atualizar elementos na interface
        document.getElementById('totalRecebido').textContent = api.formatCurrency(totalRecebido);
        document.getElementById('totalPago').textContent = api.formatCurrency(totalPago);
        document.getElementById('totalAjudas').textContent = api.formatCurrency(totalAjudas);
        document.getElementById('saldoLiquido').textContent = api.formatCurrency(saldoLiquido);
        
        // Alterar cor do saldo líquido conforme positivo/negativo
        const saldoElement = document.getElementById('saldoLiquido');
        if (saldoLiquido >= 0) {
            saldoElement.className = 'text-2xl font-bold text-green-600';
        } else {
            saldoElement.className = 'text-2xl font-bold text-red-600';
        }
    }

    // Renderizar tabela de movimentações
    renderizarTabelaMovimentacoes(movimentacoes, pagina = 1, itensPorPagina = 20) {
        const tbody = document.getElementById('movimentacoesTable');
        
        // Calcular paginação
        const inicio = (pagina - 1) * itensPorPagina;
        const fim = inicio + itensPorPagina;
        const movimentacoesPagina = movimentacoes.slice(inicio, fim);
        
        if (movimentacoesPagina.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-8 text-gray-500">
                        Nenhuma movimentação encontrada
                    </td>
                </tr>
            `;
            return;
        }
        
        const rows = movimentacoesPagina.map(mov => {
            const valorFormatado = mov.valor >= 0 ? 
                `<span class="text-green-600">+${api.formatCurrency(mov.valor)}</span>` : 
                `<span class="text-red-600">${api.formatCurrency(mov.valor)}</span>`;
            
            return `
                <tr class="hover:bg-gray-50">
                    <td class="py-3 px-4 text-sm">${this.formatDate(mov.data)}</td>
                    <td class="py-3 px-4">
                        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${this.getTipoMovimentacaoColors(mov.tipo)}">
                            ${this.formatTipoMovimentacao(mov.tipo)}
                        </span>
                    </td>
                    <td class="py-3 px-4 text-sm">${mov.descricao}</td>
                    <td class="py-3 px-4 text-sm font-medium">${valorFormatado}</td>
                    <td class="py-3 px-4">
                        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${this.getStatusMovimentacaoColors(mov.status)}">
                            ${this.formatStatusMovimentacao(mov.status)}
                        </span>
                    </td>
                    <td class="py-3 px-4 text-sm">${mov.cliente_vendedor}</td>
                    <td class="py-3 px-4 text-sm text-gray-600">${mov.observacoes}</td>
                </tr>
            `;
        }).join('');
        
        tbody.innerHTML = rows;
        
        // Armazenar dados para paginação
        this.movimentacoesData = {
            todas: movimentacoes,
            pagina: pagina,
            itensPorPagina: itensPorPagina
        };
    }

    // Atualizar paginação
    atualizarPaginacao(movimentacoes) {
        const total = movimentacoes.length;
        const pagina = this.movimentacoesData?.pagina || 1;
        const itensPorPagina = this.movimentacoesData?.itensPorPagina || 20;
        const totalPaginas = Math.ceil(total / itensPorPagina);
        
        const inicio = ((pagina - 1) * itensPorPagina) + 1;
        const fim = Math.min(pagina * itensPorPagina, total);
        
        // Atualizar informações
        document.getElementById('movimentacoesInfo').textContent = `${inicio}-${fim} de ${total}`;
        
        // Gerar botões de paginação
        const botoesPaginacao = document.getElementById('botoesPaginacao');
        let botoesHtml = '';
        
        if (totalPaginas > 1) {
            // Botão anterior
            if (pagina > 1) {
                botoesHtml += `
                    <button class="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100" 
                            onclick="relatoriosManager.mudarPaginaMovimentacoes(${pagina - 1})">
                        Anterior
                    </button>
                `;
            }
            
            // Números das páginas
            for (let i = Math.max(1, pagina - 2); i <= Math.min(totalPaginas, pagina + 2); i++) {
                const ativo = i === pagina ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-100';
                botoesHtml += `
                    <button class="px-3 py-1 rounded-lg text-sm ${ativo}" 
                            onclick="relatoriosManager.mudarPaginaMovimentacoes(${i})">
                        ${i}
                    </button>
                `;
            }
            
            // Botão próximo
            if (pagina < totalPaginas) {
                botoesHtml += `
                    <button class="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100" 
                            onclick="relatoriosManager.mudarPaginaMovimentacoes(${pagina + 1})">
                        Próximo
                    </button>
                `;
            }
        }
        
        botoesPaginacao.innerHTML = botoesHtml;
    }

    // Mudar página das movimentações
    mudarPaginaMovimentacoes(novaPagina) {
        if (this.movimentacoesData && this.movimentacoesData.todas) {
            this.renderizarTabelaMovimentacoes(this.movimentacoesData.todas, novaPagina, this.movimentacoesData.itensPorPagina);
            this.atualizarPaginacao(this.movimentacoesData.todas);
        }
    }

    // Exportar movimentações para Excel
    exportMovimentacoes() {
        try {
            const movimentacoes = this.obterTodasMovimentacoes();
            const movimentacoesFiltradas = this.filtrarMovimentacoes(movimentacoes);
            
            if (movimentacoesFiltradas.length === 0) {
                this.showNotification('Nenhuma movimentação para exportar', 'error');
                return;
            }
            
            // Preparar dados para exportação
            const dadosExport = movimentacoesFiltradas.map(mov => ({
                'Data': this.formatDate(mov.data),
                'Tipo': this.formatTipoMovimentacao(mov.tipo),
                'Descrição': mov.descricao,
                'Valor': mov.valor,
                'Status': this.formatStatusMovimentacao(mov.status),
                'Cliente/Vendedor': mov.cliente_vendedor,
                'Observações': mov.observacoes
            }));
            
            // Converter para CSV
            const csv = this.converterParaCSV(dadosExport);
            
            // Download do arquivo
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `movimentacoes_contas_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Relatório de movimentações exportado com sucesso!', 'success');
            
        } catch (error) {
            console.error('Erro ao exportar movimentações:', error);
            this.showNotification('Erro ao exportar movimentações', 'error');
        }
    }

    // Converter dados para formato CSV
    converterParaCSV(dados) {
        const headers = Object.keys(dados[0]);
        const csvContent = [
            headers.join(','),
            ...dados.map(row => 
                headers.map(header => {
                    const value = row[header];
                    // Escapar aspas e vírgulas
                    return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
                        ? `"${value.replace(/"/g, '""')}"` 
                        : value;
                }).join(',')
            )
        ].join('\n');
        
        return csvContent;
    }

    // Utilitários para formatação
    formatTipoMovimentacao(tipo) {
        const tipos = {
            'conta_receber': 'Conta a Receber',
            'conta_pagar': 'Conta a Pagar',
            'ajuda_custo': 'Ajuda de Custo',
            'estorno': 'Estorno'
        };
        return tipos[tipo] || tipo;
    }

    formatStatusMovimentacao(status) {
        const statuses = {
            'pendente': 'Pendente',
            'pago': 'Pago',
            'recebido': 'Recebido',
            'estornado': 'Estornado'
        };
        return statuses[status] || status;
    }

    getTipoMovimentacaoColors(tipo) {
        const colors = {
            'conta_receber': 'bg-green-100 text-green-800',
            'conta_pagar': 'bg-red-100 text-red-800',
            'ajuda_custo': 'bg-yellow-100 text-yellow-800',
            'estorno': 'bg-gray-100 text-gray-800'
        };
        return colors[tipo] || 'bg-gray-100 text-gray-800';
    }

    getStatusMovimentacaoColors(status) {
        const colors = {
            'pendente': 'bg-yellow-100 text-yellow-800',
            'pago': 'bg-blue-100 text-blue-800',
            'recebido': 'bg-green-100 text-green-800',
            'estornado': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    // Remove formatCurrency method since we're using api.formatCurrency

    formatDate(data) {
        if (!data) return 'N/A';
        try {
            // Use api.formatDate if available, otherwise use local implementation
            if (typeof api !== 'undefined' && api.formatDate) {
                return api.formatDate(data);
            }
            const date = new Date(data);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return 'N/A';
        }
    }

    parseCurrencyBR(value) {
        if (!value || value === '') return 0;
        // Remove todos os caracteres exceto números e vírgula/ponto
        const cleanValue = value.replace(/[^\d,.-]/g, '').replace(',', '.');
        return parseFloat(cleanValue) || 0;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white max-w-md`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Global relatórios manager instance
window.relatoriosManager = new RelatoriosManager();