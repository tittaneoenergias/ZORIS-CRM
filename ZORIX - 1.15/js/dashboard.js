// Dashboard Management for LURIX CRM
class DashboardManager {
    constructor() {
        this.charts = {};
    }

    async loadDashboard() {
        const content = `
            <div class="fade-in">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p class="text-gray-600 mt-2">Visão geral do seu negócio de energia solar</p>
                    </div>
                    <div class="text-right">
                        <p class="text-sm text-gray-500">Último acesso</p>
                        <p class="font-medium">${new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>

                <!-- KPI Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-500 text-sm font-medium">Total Clientes</p>
                                <p class="text-2xl font-bold text-gray-900" id="totalClientes">-</p>
                                <p class="text-green-600 text-sm mt-1">
                                    <i class="fas fa-arrow-up"></i> +12% este mês
                                </p>
                            </div>
                            <div class="bg-blue-100 p-3 rounded-lg">
                                <i class="fas fa-users text-blue-600 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-500 text-sm font-medium">Projetos Ativos</p>
                                <p class="text-2xl font-bold text-gray-900" id="projetosAtivos">-</p>
                                <p class="text-blue-600 text-sm mt-1">
                                    <i class="fas fa-project-diagram"></i> Em andamento
                                </p>
                            </div>
                            <div class="bg-green-100 p-3 rounded-lg">
                                <i class="fas fa-solar-panel text-green-600 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-500 text-sm font-medium">A Receber (3 meses)</p>
                                <p class="text-2xl font-bold text-gray-900" id="aReceber3Meses">-</p>
                                <p class="text-green-600 text-sm mt-1">
                                    <i class="fas fa-calendar-check"></i> Próximos recebimentos
                                </p>
                            </div>
                            <div class="bg-green-100 p-3 rounded-lg">
                                <i class="fas fa-hand-holding-usd text-green-600 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-500 text-sm font-medium">Potência Total</p>
                                <p class="text-2xl font-bold text-gray-900" id="potenciaTotal">-</p>
                                <p class="text-blue-600 text-sm mt-1">
                                    <i class="fas fa-bolt"></i> kWp instalados
                                </p>
                            </div>
                            <div class="bg-yellow-100 p-3 rounded-lg">
                                <i class="fas fa-bolt text-yellow-600 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 card-hover">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-gray-500 text-sm font-medium">A Pagar (3 meses)</p>
                                <p class="text-2xl font-bold text-gray-900" id="aPagar3Meses">-</p>
                                <p class="text-red-600 text-sm mt-1">
                                    <i class="fas fa-calendar-times"></i> Próximos pagamentos
                                </p>
                            </div>
                            <div class="bg-red-100 p-3 rounded-lg">
                                <i class="fas fa-credit-card text-red-600 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <!-- Projetos por Status -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Projetos por Status</h3>
                        <div style="height: 300px;">
                            <canvas id="projetosChart"></canvas>
                        </div>
                    </div>

                    <!-- Receita Mensal -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Receita Mensal</h3>
                        <div style="height: 300px;">
                            <canvas id="receitaChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Recent Activities -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <!-- Agendamentos Próximos -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Próximos Agendamentos</h3>
                            <a href="#" class="text-blue-600 hover:underline text-sm">Ver todos</a>
                        </div>
                        <div id="proximosAgendamentos" class="space-y-3">
                            <!-- Agendamentos will be loaded here -->
                        </div>
                    </div>

                    <!-- Atividades Recentes -->
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900">Atividades Recentes</h3>
                            <a href="#" class="text-blue-600 hover:underline text-sm">Ver todas</a>
                        </div>
                        <div id="atividadesRecentes" class="space-y-3">
                            <!-- Atividades will be loaded here -->
                        </div>
                    </div>
                </div>

                <!-- Alerts Section -->
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Alertas e Pendências</h3>
                    <div id="alertas" class="space-y-3">
                        <!-- Alertas will be loaded here -->
                    </div>
                </div>
            </div>
        `;

        document.getElementById('pageContent').innerHTML = content;
        
        // Load data and update charts
        await this.loadDashboardData();
    }

    async loadDashboardData() {
        try {
            // Load all data in parallel
            const [clientes, projetos, agendamentos, interacoes] = await Promise.all([
                api.getClientes(1, 1000),
                api.getProjetos(1, 1000),
                api.getAgendamentos(1, 1000),
                api.getInteracoes(1, 100)
            ]);

            // Update KPI cards
            await this.updateKPIs(clientes.data, projetos.data);
            
            // Update charts
            this.updateCharts(projetos.data, clientes.data);
            
            // Update recent activities
            this.updateRecentActivities(agendamentos.data, interacoes.data);
            
            // Update alerts
            this.updateAlerts(projetos.data, agendamentos.data);
            
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
        }
    }

    async updateKPIs(clientes, projetos) {
        // Total Clientes
        document.getElementById('totalClientes').textContent = clientes.length;
        
        // Projetos Ativos
        const projetosAtivos = projetos.filter(p => 
            ['em_estudo', 'proposta_enviada', 'aprovado', 'em_instalacao'].includes(p.status)
        );
        document.getElementById('projetosAtivos').textContent = projetosAtivos.length;
        
        // A Receber nos próximos 3 meses
        const aReceber3Meses = await this.calcularValoresProximos3Meses('receber');
        document.getElementById('aReceber3Meses').textContent = api.formatCurrency(aReceber3Meses);
        
        // A Pagar nos próximos 3 meses
        const aPagar3Meses = await this.calcularValoresProximos3Meses('pagar');
        document.getElementById('aPagar3Meses').textContent = api.formatCurrency(aPagar3Meses);
        
        // Potência Total
        const potenciaTotal = projetos.reduce((total, p) => total + (p.potencia_kwp || 0), 0);
        document.getElementById('potenciaTotal').textContent = potenciaTotal.toFixed(2) + ' kWp';
    }

    async calcularValoresProximos3Meses(tipo) {
        try {
            // Calcular data limite (próximos 3 meses)
            const hoje = new Date();
            const dataLimite = new Date(hoje);
            dataLimite.setMonth(dataLimite.getMonth() + 3);
            
            let total = 0;
            
            if (window.contasManager) {
                // Buscar contas dos próximos 3 meses
                const mesAtual = hoje.getMonth() + 1;
                const anoAtual = hoje.getFullYear();
                
                // Array para armazenar todas as contas dos próximos 3 meses
                let todasContas = [];
                
                // Buscar contas dos próximos 3 meses
                for (let i = 0; i < 3; i++) {
                    const mes = ((mesAtual - 1 + i) % 12) + 1;
                    const ano = anoAtual + Math.floor((mesAtual - 1 + i) / 12);
                    
                    let contasMes = [];
                    if (tipo === 'receber') {
                        contasMes = await window.contasManager.getContasReceber(mes, ano);
                    } else if (tipo === 'pagar') {
                        contasMes = await window.contasManager.getContasPagar(mes, ano);
                    }
                    
                    todasContas = todasContas.concat(contasMes);
                }
                
                // Filtrar apenas contas não pagas e dentro do período
                total = todasContas
                    .filter(conta => {
                        const dataVencimento = new Date(conta.data_vencimento);
                        return dataVencimento >= hoje && dataVencimento <= dataLimite && !conta.pago;
                    })
                    .reduce((sum, conta) => sum + (parseFloat(conta.valor) || 0), 0);
            }
            
            return total;
        } catch (error) {
            console.error(`Erro ao calcular valores ${tipo} dos próximos 3 meses:`, error);
            return 0;
        }
    }

    updateCharts(projetos, clientes) {
        this.createProjectStatusChart(projetos);
        this.createRevenueChart(projetos);
    }

    createProjectStatusChart(projetos) {
        const statusCount = {
            'analise': 0,
            'perdida': 0,
            'ganha': 0
        };

        projetos.forEach(projeto => {
            statusCount[projeto.status] = (statusCount[projeto.status] || 0) + 1;
        });

        const ctx = document.getElementById('projetosChart').getContext('2d');
        
        if (this.charts.projetos) {
            this.charts.projetos.destroy();
        }
        
        this.charts.projetos = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Análise', 'Perdida', 'Ganha'],
                datasets: [{
                    data: Object.values(statusCount),
                    backgroundColor: [
                        '#E6FF28', // Análise - Amarelo Neon
                        '#064B59', // Perdida - Azul Petróleo  
                        '#00C851'  // Ganha - Verde
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
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    createRevenueChart(projetos) {
        // Simulate monthly revenue data
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const revenueData = [];
        
        // Generate sample data based on projects
        months.forEach((month, index) => {
            const monthlyRevenue = projetos
                .filter(p => p.status === 'concluido')
                .reduce((total, p) => total + (p.valor_investimento || 0), 0) / 6;
            revenueData.push(monthlyRevenue * (0.8 + Math.random() * 0.4));
        });

        const ctx = document.getElementById('receitaChart').getContext('2d');
        
        if (this.charts.receita) {
            this.charts.receita.destroy();
        }
        
        this.charts.receita = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Receita (R$)',
                    data: revenueData,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3B82F6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
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
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Receita: ' + api.formatCurrency(context.raw);
                            }
                        }
                    }
                }
            }
        });
    }

    updateRecentActivities(agendamentos, interacoes) {
        // Próximos Agendamentos
        const proximosAgendamentos = agendamentos
            .filter(a => new Date(a.data_inicio) >= new Date() && a.status === 'agendado')
            .sort((a, b) => new Date(a.data_inicio) - new Date(b.data_inicio))
            .slice(0, 5);

        const agendamentosHTML = proximosAgendamentos.map(agendamento => `
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div class="flex-1">
                    <p class="font-medium text-gray-900">${agendamento.titulo}</p>
                    <p class="text-sm text-gray-500">${api.formatDateTime(agendamento.data_inicio)}</p>
                </div>
                <i class="fas fa-calendar text-gray-400"></i>
            </div>
        `).join('');

        document.getElementById('proximosAgendamentos').innerHTML = agendamentosHTML || 
            '<p class="text-gray-500 text-center py-4">Nenhum agendamento próximo</p>';

        // Atividades Recentes
        const atividadesRecentes = interacoes
            .sort((a, b) => new Date(b.data_interacao) - new Date(a.data_interacao))
            .slice(0, 5);

        const atividadesHTML = atividadesRecentes.map(interacao => `
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-${this.getInteractionIcon(interacao.tipo)} text-blue-600 text-sm"></i>
                </div>
                <div class="flex-1">
                    <p class="font-medium text-gray-900">${interacao.titulo}</p>
                    <p class="text-sm text-gray-500">${api.formatDateTime(interacao.data_interacao)}</p>
                </div>
            </div>
        `).join('');

        document.getElementById('atividadesRecentes').innerHTML = atividadesHTML || 
            '<p class="text-gray-500 text-center py-4">Nenhuma atividade recente</p>';
    }

    updateAlerts(projetos, agendamentos) {
        const alerts = [];
        
        // Propostas pendentes há mais de 7 dias
        const propostas = projetos.filter(p => p.status === 'proposta_enviada');
        if (propostas.length > 0) {
            alerts.push({
                type: 'warning',
                icon: 'exclamation-triangle',
                message: `${propostas.length} proposta(s) pendente(s) de aprovação`,
                action: 'Ver propostas'
            });
        }
        
        // Agendamentos de hoje
        const today = new Date().toISOString().split('T')[0];
        const agendamentosHoje = agendamentos.filter(a => 
            a.data_inicio.split('T')[0] === today && a.status === 'agendado'
        );
        
        if (agendamentosHoje.length > 0) {
            alerts.push({
                type: 'info',
                icon: 'calendar',
                message: `${agendamentosHoje.length} agendamento(s) para hoje`,
                action: 'Ver agenda'
            });
        }
        
        // Projetos em instalação
        const instalacoes = projetos.filter(p => p.status === 'em_instalacao');
        if (instalacoes.length > 0) {
            alerts.push({
                type: 'success',
                icon: 'tools',
                message: `${instalacoes.length} projeto(s) em instalação`,
                action: 'Acompanhar'
            });
        }

        const alertsHTML = alerts.map(alert => {
            const colorClasses = {
                'warning': 'bg-yellow-50 border-yellow-200 text-yellow-800',
                'info': 'bg-blue-50 border-blue-200 text-blue-800',
                'success': 'bg-green-50 border-green-200 text-green-800'
            };
            
            return `
                <div class="flex items-center justify-between p-4 border rounded-lg ${colorClasses[alert.type]}">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-${alert.icon}"></i>
                        <span>${alert.message}</span>
                    </div>
                    <button class="text-sm font-medium hover:underline">${alert.action}</button>
                </div>
            `;
        }).join('');

        document.getElementById('alertas').innerHTML = alertsHTML || 
            '<p class="text-gray-500 text-center py-4">Nenhum alerta no momento</p>';
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
}

// Global dashboard manager instance
window.dashboardManager = new DashboardManager();