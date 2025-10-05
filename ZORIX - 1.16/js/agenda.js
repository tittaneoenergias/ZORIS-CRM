// Agenda Management for LURIX CRM
class AgendaManager {
    constructor() {
        this.calendar = null;
        this.currentAgendamentos = [];
    }

    async loadAgenda() {
        const content = `
            <div class="fade-in">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Agenda</h1>
                        <p class="text-gray-600 mt-2">Gerencie agendamentos e manutenções</p>
                    </div>
                    <button id="addAgendamentoBtn" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center">
                        <i class="fas fa-plus mr-2"></i>
                        Novo Agendamento
                    </button>
                </div>

                <!-- Calendar and Sidebar Layout -->
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <!-- Calendar -->
                    <div class="lg:col-span-3">
                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div id="calendar" style="height: 600px;"></div>
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div class="lg:col-span-1 space-y-6">
                        <!-- Quick Stats -->
                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumo</h3>
                            <div class="space-y-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-600">Hoje</span>
                                    <span id="agendamentosHoje" class="font-semibold text-blue-600">-</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-600">Esta Semana</span>
                                    <span id="agendamentosSemana" class="font-semibold text-green-600">-</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-600">Próximo Mês</span>
                                    <span id="agendamentosMes" class="font-semibold text-purple-600">-</span>
                                </div>
                            </div>
                        </div>

                        <!-- Today's Appointments -->
                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Hoje</h3>
                            <div id="agendamentosHojeList" class="space-y-3">
                                <!-- Today's appointments will be loaded here -->
                            </div>
                        </div>

                        <!-- Filters -->
                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                                    <select id="filterTipo" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Todos</option>
                                        <optgroup label="📅 Agendamentos">
                                            <option value="visita_tecnica">Visita Técnica</option>
                                            <option value="reuniao">Reunião</option>
                                            <option value="instalacao">Instalação</option>
                                            <option value="manutencao">Manutenção</option>
                                            <option value="inspecao">Inspeção</option>
                                            <option value="follow_up">Follow-up</option>
                                        </optgroup>
                                        <optgroup label="💬 Interações">
                                            <option value="ligacao">📞 Ligação</option>
                                            <option value="whatsapp">💬 WhatsApp</option>
                                            <option value="email">📧 E-mail</option>
                                            <option value="apresentacao">📊 Apresentação</option>
                                            <option value="negociacao">💰 Negociação</option>
                                            <option value="outro">📝 Outro</option>
                                        </optgroup>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select id="filterStatus" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Todos</option>
                                        <optgroup label="📅 Status Agendamentos">
                                            <option value="agendado">Agendado</option>
                                            <option value="em_andamento">Em Andamento</option>
                                            <option value="concluido">Concluído</option>
                                            <option value="cancelado">Cancelado</option>
                                        </optgroup>
                                        <optgroup label="💬 Status Interações">
                                            <option value="positivo">✅ Positivo</option>
                                            <option value="neutro">⚪ Neutro</option>
                                            <option value="negativo">❌ Negativo</option>
                                            <option value="aguardando">⏳ Aguardando Retorno</option>
                                            <option value="realizado">✔️ Realizado</option>
                                        </optgroup>
                                    </select>
                                </div>
                                
                                <button id="clearFilters" class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200">
                                    Limpar Filtros
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Agendamento Modal -->
            <div id="agendamentoModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <h2 id="agendamentoModalTitle" class="text-2xl font-bold text-gray-900">Novo Agendamento</h2>
                        <button id="closeAgendamentoModal" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <form id="agendamentoForm" class="p-6">
                        <input type="hidden" id="agendamentoId">
                        
                        <!-- Informações Básicas -->
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Informações do Agendamento</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                                    <input type="text" id="agendamentoTitulo" required 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                                    <select id="agendamentoTipo" required 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Selecione...</option>
                                        <option value="visita_tecnica">Visita Técnica</option>
                                        <option value="reuniao">Reunião</option>
                                        <option value="instalacao">Instalação</option>
                                        <option value="manutencao">Manutenção</option>
                                        <option value="inspecao">Inspeção</option>
                                        <option value="follow_up">Follow-up</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select id="agendamentoStatus" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="agendado">Agendado</option>
                                        <option value="em_andamento">Em Andamento</option>
                                        <option value="concluido">Concluído</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                                    <select id="agendamentoCliente" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Selecione um cliente...</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Projeto</label>
                                    <select id="agendamentoProjeto" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Selecione um projeto...</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                                    <input type="text" id="agendamentoResponsavel" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                            </div>
                        </div>

                        <!-- Data e Hora -->
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Data e Hora</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Data e Hora *</label>
                                    <input type="datetime-local" id="agendamentoDataInicio" required 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                            </div>
                        </div>

                        <!-- Endereço -->
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Local</h3>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                                <input type="text" id="agendamentoEndereco" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Endereço completo do agendamento">
                            </div>
                        </div>

                        <!-- Descrição -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                            <textarea id="agendamentoDescricao" rows="4" 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Detalhes do agendamento..."></textarea>
                        </div>

                        <!-- Observações -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                            <textarea id="agendamentoObservacoes" rows="3" 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Observações adicionais..."></textarea>
                        </div>

                        <!-- Modal Footer -->
                        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button type="button" id="cancelAgendamentoModal" 
                                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200">
                                Cancelar
                            </button>
                            <button type="submit" 
                                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                                Salvar Agendamento
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const pageContentElement = document.getElementById('pageContent');
        if (!pageContentElement) {
            console.error('Elemento pageContent não encontrado');
            return;
        }
        pageContentElement.innerHTML = content;
        this.initializeEventListeners();
        await this.loadClientesAndProjetos();
        await this.loadAgendamentosData();
        this.initializeCalendar();
    }

    initializeEventListeners() {
        // Add new agendamento button
        document.getElementById('addAgendamentoBtn').addEventListener('click', () => {
            this.openAgendamentoModal();
        });

        // Filters
        ['filterTipo', 'filterStatus'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.updateCalendarEvents();
            });
        });

        document.getElementById('clearFilters').addEventListener('click', () => {
            document.getElementById('filterTipo').value = '';
            document.getElementById('filterStatus').value = '';
            this.updateCalendarEvents();
        });

        // Modal handlers
        ['closeAgendamentoModal', 'cancelAgendamentoModal'].forEach(id => {
            document.getElementById(id).addEventListener('click', () => {
                this.closeAgendamentoModal();
            });
        });

        // Form submission
        document.getElementById('agendamentoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAgendamento();
        });


    }

    initializeCalendar() {
        const calendarEl = document.getElementById('calendar');
        
        if (!calendarEl) {
            console.error('Elemento calendar não encontrado');
            return;
        }
        
        console.log('Inicializando FullCalendar...');
        
        this.calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            initialDate: '2025-10-02', // Data inicial para mostrar outubro de 2025
            locale: 'pt-br',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            buttonText: {
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia',
                list: 'Lista'
            },
            height: 600,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            weekends: true,
            
            select: (selectInfo) => {
                // Show appointments for the selected date
                this.showDateAppointments(selectInfo);
            },
            
            eventClick: (clickInfo) => {
                // Edit existing event
                const agendamentoId = clickInfo.event.id;
                this.editAgendamento(agendamentoId);
            },
            
            eventDrop: async (dropInfo) => {
                // Update event when dragged (only start date)
                await this.updateAgendamentoDate(dropInfo.event.id, dropInfo.event.start);
            },
            
            dayCellContent: (dayInfo) => {
                return this.customizeDayCell(dayInfo);
            }
        });
        
        this.calendar.render();
        console.log('FullCalendar renderizado com sucesso');
    }

    customizeDayCell(dayInfo) {
        const dateStr = dayInfo.date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        
        // Contar eventos para esta data
        const dayEvents = this.allEvents.filter(evento => {
            const eventoDate = evento.data_inicio.split('T')[0];
            return eventoDate === dateStr;
        });
        
        if (dayEvents.length === 0) {
            // Data sem compromissos - retorna conteúdo padrão
            return { html: dayInfo.dayNumberText };
        }
        
        // Contar tipos de eventos
        const agendamentos = dayEvents.filter(e => !e.isInteracao);
        const interacoes = dayEvents.filter(e => e.isInteracao);
        
        // Criar indicadores visuais
        let indicators = '';
        
        // Indicador para agendamentos (círculo azul)
        if (agendamentos.length > 0) {
            const agendamentoTipos = [...new Set(agendamentos.map(a => a.tipo))].join(', ');
            indicators += `<div class="event-indicator agendamento-indicator" title="${agendamentos.length} agendamento(s): ${agendamentoTipos}"></div>`;
        }
        
        // Indicador para interações (círculo verde)
        if (interacoes.length > 0) {
            const interacaoTipos = [...new Set(interacoes.map(i => i.subtipo))].join(', ');
            indicators += `<div class="event-indicator interacao-indicator" title="${interacoes.length} interação(ões): ${interacaoTipos}"></div>`;
        }
        
        // Adicionar classe para muitos eventos
        const hasMany = dayEvents.length > 2;
        const cellClass = hasMany ? 'custom-day-cell has-many-events' : 'custom-day-cell';
        
        // HTML customizado para a célula da data
        const customHTML = `
            <div class="${cellClass}">
                <div class="day-number">${dayInfo.dayNumberText}</div>
                <div class="day-indicators">${indicators}</div>
                ${dayEvents.length > 2 ? `<div class="event-count">${dayEvents.length}</div>` : ''}
            </div>
        `;
        
        return { html: customHTML };
    }

    async loadAgendamentosData() {
        try {
            console.log('Carregando dados de agendamentos e interações...');
            // Load both agendamentos and interacoes
            const [agendamentosResponse, interacoesResponse] = await Promise.all([
                api.getAgendamentos(1, 1000),
                api.getInteracoes(1, 1000)
            ]);
            
            console.log('Agendamentos carregados:', agendamentosResponse?.data?.length || 0);
            console.log('Interações carregadas:', interacoesResponse?.data?.length || 0);
            
            this.currentAgendamentos = agendamentosResponse.data || [];
            this.currentInteracoes = interacoesResponse.data || [];
            
            // Se não houver dados, criar alguns de demonstração
            if (this.currentAgendamentos.length === 0 && this.currentInteracoes.length === 0) {
                console.log('Agenda vazia, criando dados de demonstração na agenda...');
                await this.createDemoData();
                
                // Recarregar dados após criação
                const [newAgendamentosResponse, newInteracoesResponse] = await Promise.all([
                    api.getAgendamentos(1, 1000),
                    api.getInteracoes(1, 1000)
                ]);
                
                this.currentAgendamentos = newAgendamentosResponse.data || [];
                this.currentInteracoes = newInteracoesResponse.data || [];
                
                console.log('Dados de demonstração criados - Agendamentos:', this.currentAgendamentos.length);
                console.log('Dados de demonstração criados - Interações:', this.currentInteracoes.length);
            }
            
            // Combine agendamentos and interacoes for calendar display
            await this.combineEventsForCalendar();
            
            this.updateCalendarEvents();
            this.updateSidebarStats();
            this.updateTodaysAppointments();
            
        } catch (error) {
            console.error('Erro ao carregar agendamentos e interações:', error);
        }
    }

    // Combine agendamentos and interacoes into a single events array
    async combineEventsForCalendar() {
        // Convert interacoes to calendar events format
        const interacaoEvents = await Promise.all(this.currentInteracoes.map(async (interacao) => {
            // Get client name if not available in interacao
            let clienteNome = interacao.cliente_nome;
            if (!clienteNome && interacao.cliente_id) {
                try {
                    const cliente = await api.getCliente(interacao.cliente_id);
                    clienteNome = cliente?.nome || 'Cliente não identificado';
                } catch (error) {
                    clienteNome = 'Cliente não identificado';
                }
            }
            
            return {
                id: `interacao_${interacao.id}`,
                titulo: interacao.titulo || `${this.formatTipoInteracao(interacao.tipo)} - ${clienteNome}`,
                data_inicio: interacao.data_interacao,
                tipo: 'interacao',
                subtipo: interacao.tipo,
                status: 'realizado', // Interações são sempre consideradas realizadas
                cliente_id: interacao.cliente_id,
                cliente_nome: clienteNome,
                descricao: interacao.descricao,
                responsavel: interacao.usuario_responsavel,
                valor_negociado: interacao.valor_negociado,
                observacoes: interacao.proximos_passos,
                isInteracao: true // Flag to identify interaction events
            };
        }));
        
        // Combine with regular agendamentos
        this.allEvents = [...this.currentAgendamentos, ...interacaoEvents];
    }

    // Format interaction type for display
    formatTipoInteracao(tipo) {
        const tipos = {
            'ligacao': '📞 Ligação',
            'whatsapp': '💬 WhatsApp',
            'email': '📧 E-mail',
            'reuniao': '🤝 Reunião',
            'visita_tecnica': '🔧 Visita Técnica',
            'apresentacao': '📊 Apresentação',
            'negociacao': '💰 Negociação',
            'follow_up': '📅 Follow-up',
            'outro': '📝 Outro'
        };
        return tipos[tipo] || '📝 ' + (tipo || 'Interação');
    }

    async loadClientesAndProjetos() {
        try {
            const [clientesResponse, projetosResponse] = await Promise.all([
                api.getClientes(1, 1000),
                api.getProjetos(1, 1000)
            ]);

            const clientes = clientesResponse.data || [];
            const projetos = projetosResponse.data || [];

            // Populate cliente select
            const clienteSelect = document.getElementById('agendamentoCliente');
            clienteSelect.innerHTML = '<option value="">Selecione um cliente...</option>';
            clientes.forEach(cliente => {
                clienteSelect.innerHTML += `<option value="${cliente.id}">${cliente.nome}</option>`;
            });

            // Populate projeto select
            const projetoSelect = document.getElementById('agendamentoProjeto');
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

    updateCalendarEvents() {
        if (!this.calendar) return;

        const tipoFilter = document.getElementById('filterTipo')?.value;
        const statusFilter = document.getElementById('filterStatus')?.value;

        let filteredEvents = this.allEvents || [];

        if (tipoFilter) {
            filteredEvents = filteredEvents.filter(event => {
                // Handle both regular agendamentos and interacoes
                return event.tipo === tipoFilter || event.subtipo === tipoFilter;
            });
        }
        if (statusFilter) {
            filteredEvents = filteredEvents.filter(event => event.status === statusFilter);
        }

        const events = filteredEvents.map(evento => {
            const event = {
                id: evento.id,
                title: evento.titulo,
                start: evento.data_inicio,
                backgroundColor: this.getEventColor(evento.tipo, evento.status, evento.subtipo),
                borderColor: this.getEventColor(evento.tipo, evento.status, evento.subtipo),
                extendedProps: {
                    tipo: evento.tipo,
                    subtipo: evento.subtipo,
                    status: evento.status,
                    responsavel: evento.responsavel,
                    endereco: evento.endereco,
                    cliente_nome: evento.cliente_nome,
                    descricao: evento.descricao,
                    valor_negociado: evento.valor_negociado,
                    isInteracao: evento.isInteracao
                }
            };
            
            // Only add end time if it exists
            if (evento.data_fim) {
                event.end = evento.data_fim;
            }
            
            return event;
        });

        this.calendar.removeAllEvents();
        
        // Adicionar eventos individualmente para garantir que apareçam
        events.forEach(event => {
            this.calendar.addEvent(event);
        });
        
        // Re-render the calendar to update date cell indicators
        this.calendar.render();
        
        console.log(`✅ Adicionados ${events.length} eventos ao calendário`);
    }

    updateSidebarStats() {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        // Week range
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        // Month range  
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const agendamentosHoje = this.currentAgendamentos.filter(a => 
            a.data_inicio.split('T')[0] === todayStr && a.status !== 'cancelado'
        ).length;

        const agendamentosSemana = this.currentAgendamentos.filter(a => {
            const agendamentoDate = new Date(a.data_inicio);
            return agendamentoDate >= weekStart && agendamentoDate <= weekEnd && a.status !== 'cancelado';
        }).length;

        const agendamentosMes = this.currentAgendamentos.filter(a => {
            const agendamentoDate = new Date(a.data_inicio);
            return agendamentoDate >= monthStart && agendamentoDate <= monthEnd && a.status !== 'cancelado';
        }).length;

        document.getElementById('agendamentosHoje').textContent = agendamentosHoje;
        document.getElementById('agendamentosSemana').textContent = agendamentosSemana;
        document.getElementById('agendamentosMes').textContent = agendamentosMes;
    }

    updateTodaysAppointments() {
        const today = new Date().toISOString().split('T')[0];
        const todaysAgendamentos = this.currentAgendamentos
            .filter(a => a.data_inicio.split('T')[0] === today && a.status !== 'cancelado')
            .sort((a, b) => new Date(a.data_inicio) - new Date(b.data_inicio));

        const container = document.getElementById('agendamentosHojeList');
        
        if (todaysAgendamentos.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-sm">Nenhum agendamento para hoje</p>';
            return;
        }

        const html = todaysAgendamentos.map(agendamento => {
            const startTime = new Date(agendamento.data_inicio).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const statusColors = this.getStatusColors(agendamento.status);
            
            return `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex-1">
                        <div class="font-medium text-gray-900 text-sm">${agendamento.titulo}</div>
                        <div class="text-xs text-gray-500">${startTime} - ${this.formatTipo(agendamento.tipo)}</div>
                    </div>
                    <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors}">
                        ${this.formatStatus(agendamento.status)}
                    </span>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    showDateAppointments(selectInfo) {
        const selectedDate = selectInfo.startStr.split('T')[0]; // Formato YYYY-MM-DD
        
        // Filtrar todos os eventos (agendamentos + interações) para a data selecionada
        const dateEvents = this.allEvents.filter(evento => {
            const eventoDate = evento.data_inicio.split('T')[0];
            return eventoDate === selectedDate;
        });
        
        // Ordenar por horário
        dateEvents.sort((a, b) => new Date(a.data_inicio) - new Date(b.data_inicio));
        
        // Criar modal de visualização
        this.showDateViewModal(selectedDate, dateEvents);
    }

    showDateViewModal(selectedDate, events) {
        // Criar modal dinamicamente se não existir
        let modal = document.getElementById('dateViewModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'dateViewModal';
            modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 hidden';
            modal.innerHTML = `
                <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                    <div class="flex items-center justify-between pb-4 border-b">
                        <h3 id="dateViewModalTitle" class="text-lg font-semibold text-gray-900"></h3>
                        <button id="closeDateViewModal" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                    </div>
                    <div class="mt-4">
                        <div id="dateViewContent" class="max-h-96 overflow-y-auto">
                            <!-- Conteúdo será preenchido dinamicamente -->
                        </div>
                        <div class="flex justify-end mt-6 pt-4 border-t">
                            <button id="newEventFromDate" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 mr-2 flex items-center">
                                <span class="mr-2">➕</span> Novo Agendamento
                            </button>
                            <button id="closeDateViewModalBtn" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200">
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Event listeners
            document.getElementById('closeDateViewModal').addEventListener('click', () => {
                modal.classList.add('hidden');
            });
            
            document.getElementById('closeDateViewModalBtn').addEventListener('click', () => {
                modal.classList.add('hidden');
            });
            
            document.getElementById('newEventFromDate').addEventListener('click', () => {
                modal.classList.add('hidden');
                // Criar novo agendamento para a data selecionada
                const selectInfo = {
                    startStr: selectedDate + 'T09:00:00',
                    endStr: selectedDate + 'T10:00:00'
                };
                this.openAgendamentoModal(null, selectInfo);
            });
            
            // Fechar ao clicar fora do modal
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }
        
        // Formatar data para exibição
        const date = new Date(selectedDate + 'T00:00:00');
        const formattedDate = date.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Atualizar título
        document.getElementById('dateViewModalTitle').textContent = `Compromissos - ${formattedDate}`;
        
        // Atualizar conteúdo
        const content = document.getElementById('dateViewContent');
        
        if (events.length === 0) {
            content.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-gray-400 text-4xl mb-4">📅</div>
                    <p class="text-gray-500">Nenhum compromisso para esta data</p>
                </div>
            `;
        } else {
            content.innerHTML = events.map(evento => {
                const startTime = new Date(evento.data_inicio).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                const endTime = evento.data_fim ? new Date(evento.data_fim).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                }) : null;
                
                const isInteracao = evento.isInteracao;
                const icon = isInteracao ? '💬' : '📅';
                const typeLabel = isInteracao ? 'Interação' : 'Agendamento';
                
                return `
                    <div class="mb-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center mb-2">
                                    <span class="text-lg mr-2">${icon}</span>
                                    <h4 class="font-semibold text-gray-900">${evento.titulo}</h4>
                                    <span class="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">${typeLabel}</span>
                                </div>
                                <div class="text-sm text-gray-600 mb-2">
                                    <span class="font-medium">⏰ ${startTime}${endTime ? ' - ' + endTime : ''}</span>
                                </div>
                                ${evento.responsavel ? `<div class="text-sm text-gray-500 mb-1">👤 ${evento.responsavel}</div>` : ''}
                                ${evento.endereco ? `<div class="text-sm text-gray-500 mb-1">📍 ${evento.endereco}</div>` : ''}
                                ${evento.descricao ? `<div class="text-sm text-gray-700 mt-2">${evento.descricao}</div>` : ''}
                            </div>
                            <div class="ml-4">
                                <button onclick="window.agendaManager.${isInteracao ? 'editInteracao' : 'editAgendamento'}('${isInteracao ? evento.id.replace('interacao_', '') : evento.id}')" 
                                        class="text-blue-600 hover:text-blue-800 text-sm">
                                    ✏️ Editar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        // Mostrar modal
        modal.classList.remove('hidden');
    }

    editInteracao(interacaoId) {
        // Redirecionar para a página de interações com o ID específico
        if (window.interacoesManager && window.interacoesManager.editInteracao) {
            // Se estiver na mesma página, usar o manager de interações
            window.interacoesManager.editInteracao(interacaoId);
        } else {
            // Senão, mostrar informações da interação
            const interacao = this.currentInteracoes.find(i => i.id === interacaoId);
            if (interacao) {
                alert(`Interação: ${interacao.titulo}\nTipo: ${interacao.tipo}\nData: ${new Date(interacao.data_interacao).toLocaleString('pt-BR')}\n\nPara editar esta interação, acesse o menu Interações.`);
            }
        }
    }

    openAgendamentoModal(agendamento = null, selectInfo = null) {
        const modal = document.getElementById('agendamentoModal');
        const title = document.getElementById('agendamentoModalTitle');
        
        if (agendamento) {
            title.textContent = 'Editar Agendamento';
            this.populateForm(agendamento);
        } else {
            title.textContent = 'Novo Agendamento';
            this.clearForm();
            
            // If called from calendar selection, set the date
            if (selectInfo) {
                document.getElementById('agendamentoDataInicio').value = selectInfo.startStr.slice(0, 16);
            }
        }
        
        modal.classList.remove('hidden');
    }

    closeAgendamentoModal() {
        document.getElementById('agendamentoModal').classList.add('hidden');
        this.clearForm();
    }

    populateForm(agendamento) {
        document.getElementById('agendamentoId').value = agendamento.id || '';
        document.getElementById('agendamentoTitulo').value = agendamento.titulo || '';
        document.getElementById('agendamentoTipo').value = agendamento.tipo || '';
        document.getElementById('agendamentoStatus').value = agendamento.status || 'agendado';
        document.getElementById('agendamentoCliente').value = agendamento.cliente_id || '';
        document.getElementById('agendamentoProjeto').value = agendamento.projeto_id || '';
        document.getElementById('agendamentoResponsavel').value = agendamento.responsavel || '';
        document.getElementById('agendamentoEndereco').value = agendamento.endereco || '';
        document.getElementById('agendamentoDescricao').value = agendamento.descricao || '';
        document.getElementById('agendamentoObservacoes').value = agendamento.observacoes || '';
        
        if (agendamento.data_inicio) {
            const dataInicio = new Date(agendamento.data_inicio);
            document.getElementById('agendamentoDataInicio').value = dataInicio.toISOString().slice(0, 16);
        }
    }

    clearForm() {
        document.getElementById('agendamentoForm').reset();
        document.getElementById('agendamentoId').value = '';
    }

    async saveAgendamento() {
        try {
            const formData = {
                titulo: document.getElementById('agendamentoTitulo').value,
                tipo: document.getElementById('agendamentoTipo').value,
                status: document.getElementById('agendamentoStatus').value,
                cliente_id: document.getElementById('agendamentoCliente').value,
                projeto_id: document.getElementById('agendamentoProjeto').value,
                responsavel: document.getElementById('agendamentoResponsavel').value,
                endereco: document.getElementById('agendamentoEndereco').value,
                descricao: document.getElementById('agendamentoDescricao').value,
                observacoes: document.getElementById('agendamentoObservacoes').value,
                data_inicio: new Date(document.getElementById('agendamentoDataInicio').value).toISOString()
            };

            const agendamentoId = document.getElementById('agendamentoId').value;

            if (agendamentoId) {
                await api.updateAgendamento(agendamentoId, formData);
            } else {
                formData.id = api.generateId();
                await api.createAgendamento(formData);
            }

            this.closeAgendamentoModal();
            await this.loadAgendamentosData();
            
            this.showNotification('Agendamento salvo com sucesso!', 'success');

        } catch (error) {
            console.error('Erro ao salvar agendamento:', error);
            this.showNotification('Erro ao salvar agendamento', 'error');
        }
    }

    async editAgendamento(agendamentoId) {
        try {
            const agendamento = await api.getAgendamento(agendamentoId);
            this.openAgendamentoModal(agendamento);
        } catch (error) {
            console.error('Erro ao buscar agendamento:', error);
        }
    }

    async updateAgendamentoDate(agendamentoId, start) {
        try {
            const agendamento = await api.getAgendamento(agendamentoId);
            
            const updatedData = {
                ...agendamento,
                data_inicio: start.toISOString()
            };
            
            await api.updateAgendamento(agendamentoId, updatedData);
            await this.loadAgendamentosData();
            
        } catch (error) {
            console.error('Erro ao atualizar agendamento:', error);
            // Revert the calendar change
            this.calendar.refetchEvents();
        }
    }

    getEventColor(tipo, status, subtipo = null) {
        if (status === 'cancelado') return '#EF4444'; // Red
        if (status === 'concluido') return '#10B981'; // Emerald
        
        // Interação colors (more muted to distinguish from agendamentos)
        if (tipo === 'interacao') {
            const interacaoColors = {
                'ligacao': '#94A3B8',        // Slate
                'whatsapp': '#22C55E',       // Green  
                'email': '#3B82F6',          // Blue
                'reuniao': '#8B5CF6',        // Purple
                'visita_tecnica': '#0EA5E9', // Sky
                'apresentacao': '#F59E0B',   // Amber
                'negociacao': '#EF4444',     // Red
                'follow_up': '#10B981',      // Emerald
                'outro': '#6B7280'           // Gray
            };
            return interacaoColors[subtipo] || '#64748B'; // Slate default for interactions
        }
        
        // Regular agendamento colors (brighter)
        const agendamentoColors = {
            'visita_tecnica': '#3B82F6', // Blue
            'reuniao': '#8B5CF6',        // Purple
            'instalacao': '#F59E0B',     // Amber
            'manutencao': '#EF4444',     // Red
            'inspecao': '#06B6D4',       // Cyan
            'follow_up': '#10B981'       // Green
        };
        
        return agendamentoColors[tipo] || '#6B7280'; // Gray default
    }

    getStatusColors(status) {
        const colors = {
            'agendado': 'bg-blue-100 text-blue-800',
            'em_andamento': 'bg-yellow-100 text-yellow-800',
            'concluido': 'bg-green-100 text-green-800',
            'cancelado': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    formatTipo(tipo) {
        const tipos = {
            'visita_tecnica': 'Visita Técnica',
            'reuniao': 'Reunião',
            'instalacao': 'Instalação',
            'manutencao': 'Manutenção',
            'inspecao': 'Inspeção'
        };
        return tipos[tipo] || tipo;
    }

    formatStatus(status) {
        const statuses = {
            'agendado': 'Agendado',
            'em_andamento': 'Em Andamento',
            'concluido': 'Concluído',
            'cancelado': 'Cancelado'
        };
        return statuses[status] || status;
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

    async createDemoData() {
        try {
            console.log('📋 Dados de demonstração desabilitados - sistema limpo');
            return; // Função desabilitada para manter sistema limpo
            
            // console.log('Criando dados de demonstração para agenda...');
            
            // Agendamentos de demonstração
            const agendamentosDemo = [
                {
                    id: 'agenda_demo_001',
                    cliente_id: 'cli001',
                    projeto_id: 'proj001',
                    tipo: 'visita_tecnica',
                    titulo: 'Vistoria Solar - Residencial',
                    descricao: 'Avaliação técnica para instalação de sistema fotovoltaico residencial 5kWp',
                    data_inicio: '2025-10-02T09:00:00',
                    data_fim: '2025-10-02T11:00:00',
                    responsavel: 'João Silva',
                    status: 'agendado',
                    endereco: 'Rua das Flores, 123 - São Paulo/SP',
                    observacoes: 'Verificar estrutura do telhado e sombreamento'
                },
                {
                    id: 'agenda_demo_002',
                    cliente_id: 'cli002',
                    projeto_id: 'proj002',
                    tipo: 'reuniao',
                    titulo: 'Apresentação de Proposta Comercial',
                    descricao: 'Apresentação da proposta técnica e comercial para sistema empresarial',
                    data_inicio: '2025-10-02T14:30:00',
                    data_fim: '2025-10-02T16:00:00',
                    responsavel: 'Maria Santos',
                    status: 'agendado',
                    endereco: 'Av. Paulista, 500 - São Paulo/SP',
                    observacoes: 'Levar simulação de ROI e economia mensal'
                },
                {
                    id: 'agenda_demo_003',
                    cliente_id: 'cli003',
                    projeto_id: null,
                    tipo: 'inspecao',
                    titulo: 'Avaliação Noturna de Consumo',
                    descricao: 'Análise detalhada do consumo energético no período noturno',
                    data_inicio: '2025-10-02T19:00:00',
                    data_fim: '2025-10-02T20:30:00',
                    responsavel: 'Carlos Oliveira',
                    status: 'agendado',
                    endereco: 'Rua Verde, 789 - Osasco/SP',
                    observacoes: 'Medição com equipamento especializado'
                }
            ];

            // Interações de demonstração
            const interacoesDemo = [
                {
                    id: 'inter_demo_001',
                    cliente_id: 'cli001',
                    projeto_id: 'proj001',
                    tipo: 'ligacao',
                    titulo: 'Follow-up Comercial - Cliente Interessado',
                    descricao: 'Cliente demonstrou forte interesse no projeto. Confirmou viabilidade financeira e solicita visita técnica.',
                    data_interacao: '2025-10-02T11:30:00',
                    usuario_responsavel: 'Maria Santos',
                    valor_negociado: 85000,
                    proximos_passos: 'Agendar visita técnica para próxima semana'
                },
                {
                    id: 'inter_demo_002',
                    cliente_id: 'cli002',
                    projeto_id: 'proj002',
                    tipo: 'whatsapp',
                    titulo: 'Negociação via WhatsApp',
                    descricao: 'Cliente interessado em condições especiais de pagamento. Negociou parcelamento em 24x sem juros.',
                    data_interacao: '2025-10-02T16:45:00',
                    usuario_responsavel: 'João Silva',
                    valor_negociado: 120000,
                    proximos_passos: 'Enviar proposta formal via WhatsApp'
                },
                {
                    id: 'inter_demo_003',
                    cliente_id: 'cli004',
                    projeto_id: null,
                    tipo: 'reuniao',
                    titulo: 'Primeira Reunião - Projeto Industrial',
                    descricao: 'Reunião inicial para apresentação dos serviços. Cliente demonstrou interesse em sistema para indústria de 10kWp.',
                    data_interacao: '2025-10-07T09:15:00',
                    usuario_responsavel: 'Ana Costa',
                    valor_negociado: 180000,
                    proximos_passos: 'Preparar apresentação técnica personalizada'
                }
            ];

            // Criar agendamentos
            for (const agendamento of agendamentosDemo) {
                await api.createAgendamento(agendamento);
            }

            // Criar interações
            for (const interacao of interacoesDemo) {
                await api.createInteracao(interacao);
            }

            console.log(`Criados ${agendamentosDemo.length} agendamentos e ${interacoesDemo.length} interações de demonstração`);
            
        } catch (error) {
            console.error('Erro ao criar dados de demonstração:', error);
        }
    }
}

// Global agenda manager instance
window.agendaManager = new AgendaManager();