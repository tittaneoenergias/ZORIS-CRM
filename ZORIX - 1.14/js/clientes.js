// Dados de irradiação solar por estado (kWh/kWp/dia)
const IRRADIACAO_SOLAR_ESTADOS = {
    'AC': 4.8, 'AL': 5.4, 'AP': 5.1, 'AM': 4.9, 'BA': 5.8,
    'CE': 6.1, 'DF': 5.6, 'ES': 5.3, 'GO': 5.7, 'MA': 5.3,
    'MT': 5.8, 'MS': 5.6, 'MG': 5.4, 'PA': 5.0, 'PB': 5.9,
    'PR': 4.9, 'PE': 5.7, 'PI': 5.8, 'RJ': 5.0, 'RN': 6.0,
    'RS': 4.6, 'RO': 5.2, 'RR': 5.3, 'SC': 4.8, 'SP': 5.1,
    'SE': 5.6, 'TO': 5.5
};

// Dados das principais concessionárias
const CONCESSIONARIAS = {
    // São Paulo
    'CPFL Energia': { estado: 'SP', tarifa: 0.89, impostos: 0.35 },
    'Eletropaulo (Enel)': { estado: 'SP', tarifa: 0.84, impostos: 0.32 },
    'Elektro': { estado: 'SP', tarifa: 0.87, impostos: 0.34 },
    'Bandeirante': { estado: 'SP', tarifa: 0.85, impostos: 0.33 },
    
    // Rio de Janeiro
    'Light': { estado: 'RJ', tarifa: 0.92, impostos: 0.38 },
    'Ampla (Enel)': { estado: 'RJ', tarifa: 0.88, impostos: 0.36 },
    
    // Minas Gerais
    'CEMIG': { estado: 'MG', tarifa: 0.86, impostos: 0.34 },
    'CEMIG D': { estado: 'MG', tarifa: 0.85, impostos: 0.33 },
    
    // Paraná
    'Copel': { estado: 'PR', tarifa: 0.79, impostos: 0.31 },
    
    // Rio Grande do Sul
    'RGE': { estado: 'RS', tarifa: 0.82, impostos: 0.32 },
    'CEEE': { estado: 'RS', tarifa: 0.81, impostos: 0.31 },
    
    // Santa Catarina
    'Celesc': { estado: 'SC', tarifa: 0.78, impostos: 0.30 },
    
    // Bahia
    'Coelba': { estado: 'BA', tarifa: 0.91, impostos: 0.37 },
    
    // Ceará
    'Enel CE': { estado: 'CE', tarifa: 0.88, impostos: 0.35 },
    
    // Pernambuco
    'Celpe': { estado: 'PE', tarifa: 0.89, impostos: 0.36 },
    
    // Goiás
    'Enel GO': { estado: 'GO', tarifa: 0.85, impostos: 0.33 },
    
    // Distrito Federal
    'CEB': { estado: 'DF', tarifa: 0.87, impostos: 0.34 },
    
    // Outras concessionárias relevantes
    'Energisa': { estado: 'MT', tarifa: 0.83, impostos: 0.32 },
    'CPFL Piratininga': { estado: 'SP', tarifa: 0.86, impostos: 0.33 }
};

// Clientes Management for LURIX CRM
class ClientesManager {
    constructor() {
        this.currentClientes = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.searchTerm = '';
        this.sortBy = 'nome';
        this.sortOrder = 'asc';
    }

    async loadClientes() {
        const content = `
            <div class="fade-in">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Clientes</h1>
                        <p class="text-gray-600 mt-2">Gerencie seus clientes e prospects</p>
                    </div>
                    <button id="addClienteBtn" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center">
                        <i class="fas fa-plus mr-2"></i>
                        Novo Cliente
                    </button>
                </div>

                <!-- Filters and Search -->
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                            <input type="text" id="searchClientes" placeholder="Nome, email ou telefone..." 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Cliente</label>
                            <select id="filterTipo" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Todos</option>
                                <option value="residencial">Residencial</option>
                                <option value="comercial">Comercial</option>
                                <option value="rural">Rural</option>
                                <option value="industrial">Industrial</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select id="filterStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Todos</option>
                                <option value="prospecto">Prospecto</option>
                                <option value="cliente">Cliente</option>
                                <option value="inativo">Inativo</option>
                            </select>
                        </div>
                        <div class="flex items-end">
                            <button id="clearFilters" class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200">
                                Limpar Filtros
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Clientes Table -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="text-left py-4 px-6 font-medium text-gray-900 cursor-pointer hover:bg-gray-100" data-sort="nome">
                                        Nome <i class="fas fa-sort ml-1"></i>
                                    </th>
                                    <th class="text-left py-4 px-6 font-medium text-gray-900 cursor-pointer hover:bg-gray-100" data-sort="tipo_cliente">
                                        Tipo <i class="fas fa-sort ml-1"></i>
                                    </th>
                                    <th class="text-left py-4 px-6 font-medium text-gray-900">Contato</th>
                                    <th class="text-left py-4 px-6 font-medium text-gray-900 cursor-pointer hover:bg-gray-100" data-sort="status">
                                        Status <i class="fas fa-sort ml-1"></i>
                                    </th>
                                    <th class="text-left py-4 px-6 font-medium text-gray-900">Consumo</th>
                                    <th class="text-left py-4 px-6 font-medium text-gray-900">Ações</th>
                                </tr>
                            </thead>
                            <tbody id="clientesTableBody" class="divide-y divide-gray-200">
                                <!-- Clientes will be loaded here -->
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Pagination -->
                    <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div class="flex items-center justify-between">
                            <div class="text-sm text-gray-700">
                                Mostrando <span id="showingFrom">1</span> a <span id="showingTo">10</span> de <span id="totalClientes">0</span> clientes
                            </div>
                            <div class="flex items-center space-x-2" id="pagination">
                                <!-- Pagination buttons will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cliente Modal -->
            <div id="clienteModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <h2 id="clienteModalTitle" class="text-2xl font-bold text-gray-900">Novo Cliente</h2>
                        <button id="closeClienteModal" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <form id="clienteForm" class="p-6">
                        <input type="hidden" id="clienteId">
                        
                        <!-- Informações Básicas -->
                        <div class="mb-8">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Nome / Razão Social *</label>
                                    <input type="text" id="clienteNome" required 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Pessoa *</label>
                                    <select id="clienteTipoPessoa" required 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Selecione...</option>
                                        <option value="fisica">Pessoa Física</option>
                                        <option value="juridica">Pessoa Jurídica</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2" id="cpfCnpjLabel">CPF / CNPJ *</label>
                                    <input type="text" id="clienteCpfCnpj" required 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Cliente *</label>
                                    <select id="clienteTipoCliente" required 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Selecione...</option>
                                        <option value="residencial">Residencial</option>
                                        <option value="comercial">Comercial</option>
                                        <option value="rural">Rural</option>
                                        <option value="industrial">Industrial</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select id="clienteStatus" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="prospecto">Prospecto</option>
                                        <option value="cliente">Cliente</option>
                                        <option value="inativo">Inativo</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Endereço -->
                        <div class="mb-8">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                                    <input type="text" id="clienteCep" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="00000-000">
                                </div>
                                
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Endereço Completo</label>
                                    <input type="text" id="clienteEndereco" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Rua, número, bairro">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                                    <input type="text" id="clienteCidade" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                    <select id="clienteEstado" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Selecione...</option>
                                        <option value="AC">Acre</option>
                                        <option value="AL">Alagoas</option>
                                        <option value="AP">Amapá</option>
                                        <option value="AM">Amazonas</option>
                                        <option value="BA">Bahia</option>
                                        <option value="CE">Ceará</option>
                                        <option value="DF">Distrito Federal</option>
                                        <option value="ES">Espírito Santo</option>
                                        <option value="GO">Goiás</option>
                                        <option value="MA">Maranhão</option>
                                        <option value="MT">Mato Grosso</option>
                                        <option value="MS">Mato Grosso do Sul</option>
                                        <option value="MG">Minas Gerais</option>
                                        <option value="PA">Pará</option>
                                        <option value="PB">Paraíba</option>
                                        <option value="PR">Paraná</option>
                                        <option value="PE">Pernambuco</option>
                                        <option value="PI">Piauí</option>
                                        <option value="RJ">Rio de Janeiro</option>
                                        <option value="RN">Rio Grande do Norte</option>
                                        <option value="RS">Rio Grande do Sul</option>
                                        <option value="RO">Rondônia</option>
                                        <option value="RR">Roraima</option>
                                        <option value="SC">Santa Catarina</option>
                                        <option value="SP">São Paulo</option>
                                        <option value="SE">Sergipe</option>
                                        <option value="TO">Tocantins</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Contato -->
                        <div class="mb-8">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Contato</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                                    <input type="tel" id="clienteTelefone" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="(11) 9999-9999">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                                    <input type="tel" id="clienteWhatsapp" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="(11) 9999-9999">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input type="email" id="clienteEmail" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="cliente@email.com">
                                </div>
                            </div>
                        </div>



                        <!-- Observações -->
                        <div class="mb-8">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Observações</h3>
                            <textarea id="clienteObservacoes" rows="4" 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Observações sobre o cliente..."></textarea>
                        </div>

                        <!-- Modal Footer -->
                        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button type="button" id="cancelClienteModal" 
                                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200">
                                Cancelar
                            </button>
                            <button type="submit" 
                                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                                Salvar Cliente
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Modal de proposta removido - funcionalidade movida para projetos.js -->
        `;

        document.getElementById('pageContent').innerHTML = content;
        this.initializeEventListeners();
        await this.loadClientesData();
    }

    initializeEventListeners() {
        // Add new cliente button
        document.getElementById('addClienteBtn').addEventListener('click', () => {
            this.openClienteModal();
        });

        // Search and filters
        document.getElementById('searchClientes').addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.loadClientesData();
        });

        ['filterTipo', 'filterStatus'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.loadClientesData();
            });
        });

        document.getElementById('clearFilters').addEventListener('click', () => {
            document.getElementById('searchClientes').value = '';
            document.getElementById('filterTipo').value = '';
            document.getElementById('filterStatus').value = '';
            this.searchTerm = '';
            this.loadClientesData();
        });

        // Table sorting
        document.querySelectorAll('th[data-sort]').forEach(th => {
            th.addEventListener('click', () => {
                const field = th.dataset.sort;
                if (this.sortBy === field) {
                    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortBy = field;
                    this.sortOrder = 'asc';
                }
                this.loadClientesData();
            });
        });

        // Modal handlers
        ['closeClienteModal', 'cancelClienteModal'].forEach(id => {
            document.getElementById(id).addEventListener('click', () => {
                this.closeClienteModal();
            });
        });

        // Modal de proposta removido - funcionalidade movida para projetos.js

        // Form submissions
        document.getElementById('clienteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCliente();
        });

        // Form de proposta removido - funcionalidade movida para projetos.js

        // Botão de material removido - funcionalidade movida para projetos.js

        // CPF/CNPJ type change
        document.getElementById('clienteTipoPessoa').addEventListener('change', (e) => {
            const label = document.getElementById('cpfCnpjLabel');
            if (e.target.value === 'fisica') {
                label.textContent = 'CPF *';
            } else if (e.target.value === 'juridica') {
                label.textContent = 'CNPJ *';
            } else {
                label.textContent = 'CPF / CNPJ *';
            }
        });
    }

    async loadClientesData() {
        try {
            const response = await api.getClientes(this.currentPage, this.itemsPerPage, this.searchTerm);
            let clientes = response.data || [];

            // Apply filters
            const tipoFilter = document.getElementById('filterTipo')?.value;
            const statusFilter = document.getElementById('filterStatus')?.value;

            if (tipoFilter) {
                clientes = clientes.filter(c => c.tipo_cliente === tipoFilter);
            }
            if (statusFilter) {
                clientes = clientes.filter(c => c.status === statusFilter);
            }

            // Apply sorting
            clientes.sort((a, b) => {
                const aValue = a[this.sortBy] || '';
                const bValue = b[this.sortBy] || '';
                const result = aValue.localeCompare(bValue);
                return this.sortOrder === 'asc' ? result : -result;
            });

            this.currentClientes = clientes;
            this.renderClientesTable(clientes);
            this.updatePagination(clientes.length);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        }
    }

    renderClientesTable(clientes) {
        const tbody = document.getElementById('clientesTableBody');
        
        if (clientes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-8 text-gray-500">
                        Nenhum cliente encontrado
                    </td>
                </tr>
            `;
            return;
        }

        const rows = clientes.map(cliente => {
            const statusColors = {
                'prospecto': 'bg-yellow-100 text-yellow-800',
                'cliente': 'bg-green-100 text-green-800',
                'inativo': 'bg-red-100 text-red-800'
            };

            return `
                <tr class="hover:bg-gray-50">
                    <td class="py-4 px-6">
                        <div>
                            <div class="font-medium text-gray-900">${cliente.nome}</div>
                            <div class="text-sm text-gray-500">${this.formatTipoCliente(cliente.tipo_cliente)}</div>
                        </div>
                    </td>
                    <td class="py-4 px-6">
                        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[cliente.tipo_cliente] || 'bg-gray-100 text-gray-800'}">
                            ${this.formatTipoCliente(cliente.tipo_cliente)}
                        </span>
                    </td>
                    <td class="py-4 px-6">
                        <div class="text-sm">
                            ${cliente.telefone ? '<div><i class="fas fa-phone text-gray-400 mr-2"></i>' + cliente.telefone + '</div>' : ''}
                            ${cliente.email ? '<div><i class="fas fa-envelope text-gray-400 mr-2"></i>' + cliente.email + '</div>' : ''}
                        </div>
                    </td>
                    <td class="py-4 px-6">
                        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[cliente.status] || 'bg-gray-100 text-gray-800'}">
                            ${this.formatStatus(cliente.status)}
                        </span>
                    </td>
                    <td class="py-4 px-6">
                        <div class="text-sm">
                            ${cliente.consumo_mensal ? cliente.consumo_mensal + ' kWh/mês' : 'N/A'}
                        </div>
                        <div class="text-xs text-gray-500">
                            ${cliente.valor_conta ? api.formatCurrency(cliente.valor_conta) : ''}
                        </div>
                    </td>
                    <td class="py-4 px-6">
                        <div class="flex space-x-2">
                            <button onclick="clientesManager.viewCliente('${cliente.id}')" 
                                class="text-blue-600 hover:text-blue-900" title="Ver detalhes">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button onclick="clientesManager.editCliente('${cliente.id}')" 
                                class="text-indigo-600 hover:text-indigo-900" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="clientesManager.deleteCliente('${cliente.id}')" 
                                class="text-red-600 hover:text-red-900" title="Excluir">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        tbody.innerHTML = rows;
    }

    updatePagination(totalItems) {
        document.getElementById('showingFrom').textContent = ((this.currentPage - 1) * this.itemsPerPage) + 1;
        document.getElementById('showingTo').textContent = Math.min(this.currentPage * this.itemsPerPage, totalItems);
        document.getElementById('totalClientes').textContent = totalItems;

        // Update pagination buttons
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const paginationContainer = document.getElementById('pagination');
        
        let paginationHTML = '';
        
        if (this.currentPage > 1) {
            paginationHTML += `<button onclick="clientesManager.changePage(${this.currentPage - 1})" class="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">Anterior</button>`;
        }
        
        for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(totalPages, this.currentPage + 2); i++) {
            const isActive = i === this.currentPage;
            paginationHTML += `
                <button onclick="clientesManager.changePage(${i})" 
                    class="px-3 py-1 border rounded ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}">
                    ${i}
                </button>
            `;
        }
        
        if (this.currentPage < totalPages) {
            paginationHTML += `<button onclick="clientesManager.changePage(${this.currentPage + 1})" class="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">Próxima</button>`;
        }
        
        paginationContainer.innerHTML = paginationHTML;
    }

    changePage(page) {
        this.currentPage = page;
        this.loadClientesData();
    }

    openClienteModal(cliente = null) {
        const modal = document.getElementById('clienteModal');
        const title = document.getElementById('clienteModalTitle');
        
        if (cliente) {
            title.textContent = 'Editar Cliente';
            this.populateForm(cliente);
        } else {
            title.textContent = 'Novo Cliente';
            this.clearForm();
        }
        
        modal.classList.remove('hidden');
    }

    closeClienteModal() {
        document.getElementById('clienteModal').classList.add('hidden');
        this.clearForm();
    }

    populateForm(cliente) {
        document.getElementById('clienteId').value = cliente.id || '';
        document.getElementById('clienteNome').value = cliente.nome || '';
        document.getElementById('clienteTipoPessoa').value = cliente.tipo_pessoa || '';
        document.getElementById('clienteCpfCnpj').value = cliente.cpf_cnpj || '';
        document.getElementById('clienteTipoCliente').value = cliente.tipo_cliente || '';
        document.getElementById('clienteStatus').value = cliente.status || 'prospecto';
        document.getElementById('clienteCep').value = cliente.cep || '';
        document.getElementById('clienteEndereco').value = cliente.endereco || '';
        document.getElementById('clienteCidade').value = cliente.cidade || '';
        document.getElementById('clienteEstado').value = cliente.estado || '';
        document.getElementById('clienteTelefone').value = cliente.telefone || '';
        document.getElementById('clienteWhatsapp').value = cliente.whatsapp || '';
        document.getElementById('clienteEmail').value = cliente.email || '';

        document.getElementById('clienteObservacoes').value = cliente.observacoes || '';
    }

    clearForm() {
        document.getElementById('clienteForm').reset();
        document.getElementById('clienteId').value = '';
    }

    async saveCliente() {
        try {
            const formData = {
                nome: document.getElementById('clienteNome').value,
                tipo_pessoa: document.getElementById('clienteTipoPessoa').value,
                cpf_cnpj: document.getElementById('clienteCpfCnpj').value,
                tipo_cliente: document.getElementById('clienteTipoCliente').value,
                status: document.getElementById('clienteStatus').value,
                cep: document.getElementById('clienteCep').value,
                endereco: document.getElementById('clienteEndereco').value,
                cidade: document.getElementById('clienteCidade').value,
                estado: document.getElementById('clienteEstado').value,
                telefone: document.getElementById('clienteTelefone').value,
                whatsapp: document.getElementById('clienteWhatsapp').value,
                email: document.getElementById('clienteEmail').value,

                observacoes: document.getElementById('clienteObservacoes').value
            };

            const clienteId = document.getElementById('clienteId').value;

            if (clienteId) {
                await api.updateCliente(clienteId, formData);
            } else {
                formData.id = api.generateId();
                await api.createCliente(formData);
            }

            this.closeClienteModal();
            await this.loadClientesData();
            
            // Show success message
            this.showNotification('Cliente salvo com sucesso!', 'success');

        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            this.showNotification('Erro ao salvar cliente', 'error');
        }
    }

    async editCliente(clienteId) {
        try {
            const cliente = await api.getCliente(clienteId);
            this.openClienteModal(cliente);
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
        }
    }

    async viewCliente(clienteId) {
        // Navigate to detailed cliente profile
        await this.openClienteProfile(clienteId);
    }

    async openClienteProfile(clienteId) {
        try {
            // Load cliente data
            const cliente = await api.getCliente(clienteId);
            if (!cliente) {
                this.showNotification('Cliente não encontrado', 'error');
                return;
            }

            // Load related data
            const [projetos, interacoes, arquivos] = await Promise.all([
                api.getProjetosByCliente(clienteId),
                api.getTableData('interacoes', 1, 100, clienteId), 
                api.getTableData('arquivos', 1, 100, clienteId)
            ]);

            await this.renderClienteProfile(cliente, projetos.data, interacoes.data, arquivos.data);

        } catch (error) {
            console.error('Erro ao carregar perfil do cliente:', error);
            this.showNotification('Erro ao carregar perfil do cliente', 'error');
        }
    }

    async renderClienteProfile(cliente, projetos, interacoes, arquivos) {
        const content = `
            <div class="fade-in">
                <!-- Header do Perfil -->
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center space-x-4">
                        <button onclick="clientesManager.loadClientes()" class="btn-secondary px-4 py-2 rounded-lg">
                            <i class="fas fa-arrow-left mr-2"></i>Voltar
                        </button>
                        <div>
                            <h1 class="text-3xl font-bold text-gradient">${cliente.nome}</h1>
                            <p class="text-gray-600">${this.formatTipoCliente(cliente.tipo_cliente)} - ${this.formatStatus(cliente.status)}</p>
                        </div>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="clientesManager.editCliente('${cliente.id}')" class="btn-secondary px-4 py-2 rounded-lg">
                            <i class="fas fa-edit mr-2"></i>Editar
                        </button>
                        <button onclick="clientesManager.addInteracao('${cliente.id}')" class="btn-primary px-4 py-2 rounded-lg">
                            <i class="fas fa-plus mr-2"></i>Nova Interação
                        </button>
                        <button onclick="clientesManager.uploadArchivo('${cliente.id}')" class="btn-primary px-4 py-2 rounded-lg">
                            <i class="fas fa-upload mr-2"></i>Upload Arquivo
                        </button>
                    </div>
                </div>

                <!-- Grid de Informações -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    
                    <!-- Informações do Cliente -->
                    <div class="lg:col-span-1">
                        <div class="card-lurix rounded-xl p-6 mb-6">
                            <h3 class="text-xl font-semibold text-azul-petroleo mb-4 border-b-2 border-amarelo-neon pb-2">
                                <i class="fas fa-user mr-2"></i>Informações Pessoais
                            </h3>
                            <div class="space-y-3 text-sm">
                                <div><strong>Tipo:</strong> ${cliente.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</div>
                                <div><strong>CPF/CNPJ:</strong> ${cliente.cpf_cnpj || 'N/A'}</div>
                                <div><strong>Email:</strong> ${cliente.email || 'N/A'}</div>
                                <div><strong>Telefone:</strong> ${cliente.telefone || 'N/A'}</div>
                                <div><strong>WhatsApp:</strong> ${cliente.whatsapp || 'N/A'}</div>
                                <div><strong>Endereço:</strong> ${cliente.endereco || 'N/A'}</div>
                                <div><strong>Cidade:</strong> ${cliente.cidade || 'N/A'} - ${cliente.estado || 'N/A'}</div>
                                <div><strong>CEP:</strong> ${cliente.cep || 'N/A'}</div>
                            </div>
                        </div>

                        <!-- Dados Energéticos -->
                        <div class="card-lurix rounded-xl p-6">
                            <h3 class="text-xl font-semibold text-azul-petroleo mb-4 border-b-2 border-amarelo-neon pb-2">
                                <i class="fas fa-bolt mr-2"></i>Dados Energéticos
                            </h3>
                            <div class="space-y-3 text-sm">

                            </div>
                            ${cliente.observacoes ? `
                                <div class="mt-4 pt-4 border-t border-gray-200">
                                    <strong class="block mb-2">Observações:</strong>
                                    <p class="text-gray-700 text-sm">${cliente.observacoes}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Conteúdo Principal -->
                    <div class="lg:col-span-2">
                        
                        <!-- Tabs de navegação -->
                        <div class="bg-white rounded-t-xl border-b-2 border-amarelo-neon">
                            <nav class="flex space-x-1">
                                <button onclick="clientesManager.showTab('projetos')" 
                                    class="tab-btn active px-6 py-4 font-medium text-sm rounded-t-lg transition-colors" 
                                    data-tab="projetos">
                                    <i class="fas fa-project-diagram mr-2"></i>Projetos (${projetos.length})
                                </button>
                                <button onclick="clientesManager.showTab('interacoes')" 
                                    class="tab-btn px-6 py-4 font-medium text-sm rounded-t-lg transition-colors" 
                                    data-tab="interacoes">
                                    <i class="fas fa-comments mr-2"></i>Interações (${interacoes.length})
                                </button>
                                <button onclick="clientesManager.showTab('arquivos')" 
                                    class="tab-btn px-6 py-4 font-medium text-sm rounded-t-lg transition-colors" 
                                    data-tab="arquivos">
                                    <i class="fas fa-folder mr-2"></i>Arquivos (${arquivos.length})
                                </button>
                            </nav>
                        </div>

                        <!-- Conteúdo das Tabs -->
                        <div class="card-lurix rounded-b-xl rounded-tr-xl p-6">
                            
                            <!-- Tab Projetos -->
                            <div id="tab-projetos" class="tab-content">
                                ${await this.renderProjetosTab(projetos, cliente.id)}
                            </div>

                            <!-- Tab Interações -->
                            <div id="tab-interacoes" class="tab-content hidden">
                                ${await this.renderInteracoesTab(interacoes, cliente.id)}
                            </div>

                            <!-- Tab Arquivos -->
                            <div id="tab-arquivos" class="tab-content hidden">
                                ${await this.renderArquivosTab(arquivos, cliente.id)}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de Edição de Projeto -->
            <div id="clienteProjetoModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <h2 id="clienteProjetoModalTitle" class="text-2xl font-bold text-gray-900">Editar Projeto</h2>
                        <button id="closeClienteProjetoModal" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <form id="clienteProjetoForm" class="p-6">
                        <input type="hidden" id="clienteProjetoId">
                        
                        <!-- Informações Básicas -->
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nome do Projeto *</label>
                                <input type="text" id="clienteProjetoNome" required 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select id="clienteProjetoStatus" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="em_estudo">Em Estudo</option>
                                    <option value="proposta_enviada">Proposta Enviada</option>
                                    <option value="aprovado">Aprovado</option>
                                    <option value="em_instalacao">Em Instalação</option>
                                    <option value="concluido">Concluído</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Potência (kWp)</label>
                                <input type="number" id="clienteProjetoPotencia" step="0.01"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Valor do Investimento</label>
                                <input type="number" id="clienteProjetoValor" step="0.01"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                                <textarea id="clienteProjetoObservacoes" rows="4"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                            </div>
                        </div>

                        <div class="mt-6 flex justify-end space-x-3">
                            <button type="button" id="cancelClienteProjetoEdit" class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                Cancelar
                            </button>
                            <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('pageContent').innerHTML = content;
        this.initializeProfileTabs();
    }

    async deleteCliente(clienteId) {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            try {
                await api.deleteCliente(clienteId);
                await this.loadClientesData();
                this.showNotification('Cliente excluído com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao excluir cliente:', error);
                this.showNotification('Erro ao excluir cliente', 'error');
            }
        }
    }

    formatTipoCliente(tipo) {
        const types = {
            'residencial': 'Residencial',
            'comercial': 'Comercial',
            'rural': 'Rural',
            'industrial': 'Industrial'
        };
        return types[tipo] || tipo;
    }

    formatStatus(status) {
        const statuses = {
            'prospecto': 'Prospecto',
            'cliente': 'Cliente',
            'inativo': 'Inativo'
        };
        return statuses[status] || status;
    }

    async renderProjetosTab(projetos, clienteId) {
        if (projetos.length === 0) {
            return `
                <div class="text-center py-12">
                    <i class="fas fa-project-diagram text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-medium text-gray-900 mb-2">Nenhum projeto</h3>
                    <p class="text-gray-500 mb-4">Este cliente ainda não possui projetos cadastrados</p>
                    <button onclick="clientesManager.createProjetoForCliente('${clienteId}')" class="btn-primary px-6 py-2 rounded-lg">
                        <i class="fas fa-plus mr-2"></i>Criar Primeiro Projeto
                    </button>
                </div>
            `;
        }

        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-semibold text-lg">Projetos do Cliente</h4>
                    <button onclick="clientesManager.createProjetoForCliente('${clienteId}')" class="btn-primary px-4 py-2 rounded-lg">
                        <i class="fas fa-plus mr-2"></i>Novo Projeto
                    </button>
                </div>
                ${projetos.map(projeto => `
                    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-start mb-4">
                            <div class="flex-1">
                                <h5 class="font-medium text-lg text-azul-petroleo">${projeto.nome_projeto || projeto.nome || 'Projeto sem nome'}</h5>
                                <div class="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                    <span class="badge-${projeto.status} px-2 py-1 rounded-full text-xs font-medium">
                                        ${this.formatStatusProjeto(projeto.status)}
                                    </span>
                                    ${projeto.potencia_kwp ? '<span><i class="fas fa-bolt mr-1"></i>' + projeto.potencia_kwp + ' kWp</span>' : ''}
                                    ${projeto.valor_investimento ? '<span><i class="fas fa-dollar-sign mr-1"></i>' + api.formatCurrency(projeto.valor_investimento) + '</span>' : ''}
                                </div>
                                ${projeto.observacoes ? '<p class="text-sm text-gray-700 mt-2">' + projeto.observacoes.substring(0, 100) + (projeto.observacoes.length > 100 ? '...' : '') + '</p>' : ''}
                            </div>
                            <div class="flex space-x-2 ml-4">
                                <button onclick="clientesManager.openEditProjectModal('${projeto.id}')" class="btn-secondary px-3 py-1 rounded text-sm">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                                <button onclick="clientesManager.viewProjectDetails('${projeto.id}')" class="btn-outline px-3 py-1 rounded text-sm">
                                    <i class="fas fa-eye"></i> Ver
                                </button>
                            </div>
                        </div>
                        
                        <!-- Seção de Múltiplas Propostas -->
                        <div class="bg-gray-50 rounded-lg p-4 border-t border-gray-200">
                            <h6 class="font-semibold text-gray-900 mb-3 flex items-center">
                                <i class="fas fa-file-pdf text-red-600 mr-2"></i>
                                Propostas Comerciais
                            </h6>
                            <div class="grid grid-cols-5 gap-2">
                                ${this.generatePdfButtons(projeto)}
                            </div>
                            <p class="text-xs text-gray-500 mt-2">
                                <i class="fas fa-info-circle mr-1"></i>
                                Clique em qualquer botão para gerar uma proposta comercial em PDF
                            </p>
                        </div>
                        
                        <!-- Proposta Premium -->
                        <div class="mt-6 p-4 rounded-xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-yellow-100">
                            <h6 class="font-bold text-yellow-800 mb-3 flex items-center">
                                <i class="fas fa-crown text-yellow-600 mr-2"></i>
                                Proposta Premium - Nova Aba
                            </h6>
                            <button onclick="clientesManager.gerarPropostaPremium('${projeto.id}')"
                                    class="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 
                                           text-yellow-900 font-bold py-3 px-6 rounded-xl transition duration-300 
                                           shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center mb-2">
                                <i class="fas fa-rocket mr-2"></i>
                                Gerar Proposta Premium
                                <i class="fas fa-external-link-alt ml-2"></i>
                            </button>
                            <!-- Botão adicional para proposta genérica -->
                            <button onclick="clientesManager.gerarPropostaPremiumGenerica('${cliente.id}')"
                                    class="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 
                                           text-white font-semibold py-2 px-4 rounded-lg transition duration-300 
                                           flex items-center justify-center text-sm">
                                <i class="fas fa-file-alt mr-2"></i>
                                Proposta Genérica (Sem Projeto)
                            </button>
                            <p class="text-xs text-yellow-700 mt-2 text-center">
                                <i class="fas fa-star mr-1"></i>
                                Design profissional e inovador • Abre em nova aba • Sem PDF
                            </p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async renderInteracoesTab(interacoes, clienteId) {
        if (interacoes.length === 0) {
            return `
                <div class="text-center py-12">
                    <i class="fas fa-comments text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-medium text-gray-900 mb-2">Nenhuma interação</h3>
                    <p class="text-gray-500 mb-4">Nenhum histórico de contato registrado para este cliente</p>
                    <button onclick="clientesManager.addInteracao('${clienteId}')" class="btn-primary px-6 py-2 rounded-lg">
                        <i class="fas fa-plus mr-2"></i>Registrar Primeira Interação
                    </button>
                </div>
            `;
        }

        // Sort interactions by date (most recent first)
        const sortedInteracoes = interacoes.sort((a, b) => new Date(b.data_interacao) - new Date(a.data_interacao));

        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-semibold text-lg">Histórico de Interações</h4>
                    <button onclick="clientesManager.addInteracao('${clienteId}')" class="btn-primary px-4 py-2 rounded-lg">
                        <i class="fas fa-plus mr-2"></i>Nova Interação
                    </button>
                </div>
                <div class="relative">
                    ${sortedInteracoes.map((interacao, index) => `
                        <div class="relative flex items-start space-x-4 ${index < sortedInteracoes.length - 1 ? 'pb-6' : ''}">
                            ${index < sortedInteracoes.length - 1 ? '<div class="absolute left-6 top-12 w-px h-full bg-gray-200"></div>' : ''}
                            
                            <div class="flex-shrink-0 w-12 h-12 bg-white border-2 border-amarelo-neon rounded-full flex items-center justify-center">
                                <i class="fas fa-${this.getInteractionIcon(interacao.tipo)} text-azul-petroleo"></i>
                            </div>
                            
                            <div class="flex-1 min-w-0 bg-white border border-gray-200 rounded-lg p-4">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <h5 class="font-medium text-azul-petroleo">${interacao.titulo}</h5>
                                        <div class="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                                            <span>${this.formatTipoInteracao(interacao.tipo)}</span>
                                            <span>${api.formatDateTime(interacao.data_interacao)}</span>
                                            ${interacao.usuario_responsavel ? '<span>por ' + interacao.usuario_responsavel + '</span>' : ''}
                                        </div>
                                        <p class="text-gray-700 text-sm mt-2">${interacao.descricao}</p>
                                        ${interacao.valor_negociado ? `
                                            <div class="mt-2">
                                                <span class="inline-flex items-center px-2 py-1 bg-amarelo-neon text-azul-petroleo text-xs font-medium rounded-full">
                                                    <i class="fas fa-dollar-sign mr-1"></i>${api.formatCurrency(interacao.valor_negociado)}
                                                </span>
                                            </div>
                                        ` : ''}
                                        ${interacao.proximos_passos ? `
                                            <div class="mt-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                                                <p class="text-sm text-blue-700"><strong>Próximos passos:</strong> ${interacao.proximos_passos}</p>
                                            </div>
                                        ` : ''}
                                    </div>
                                    <button onclick="interacoesManager.editInteracao('${interacao.id}')" class="btn-secondary px-2 py-1 rounded text-sm ml-2">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    async renderArquivosTab(arquivos, clienteId) {
        if (arquivos.length === 0) {
            return `
                <div class="text-center py-12">
                    <i class="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-medium text-gray-900 mb-2">Nenhum arquivo</h3>
                    <p class="text-gray-500 mb-4">Nenhum arquivo foi enviado para este cliente</p>
                    <button onclick="clientesManager.uploadArchivo('${clienteId}')" class="btn-primary px-6 py-2 rounded-lg">
                        <i class="fas fa-upload mr-2"></i>Enviar Primeiro Arquivo
                    </button>
                </div>
            `;
        }

        return `
            <div class="space-y-4">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-semibold text-lg">Arquivos do Cliente</h4>
                    <button onclick="clientesManager.uploadArchivo('${clienteId}')" class="btn-primary px-4 py-2 rounded-lg">
                        <i class="fas fa-upload mr-2"></i>Novo Arquivo
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${arquivos.map(arquivo => `
                        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div class="flex items-center space-x-3 mb-3">
                                <i class="fas fa-${this.getFileIcon(arquivo.nome_arquivo)} text-2xl ${this.getFileIconColor(arquivo.tipo_arquivo)}"></i>
                                <div class="flex-1 min-w-0">
                                    <p class="font-medium text-sm text-gray-900 truncate">${arquivo.nome_arquivo}</p>
                                    <p class="text-xs text-gray-500">${this.formatTipoArquivo(arquivo.tipo_arquivo)}</p>
                                </div>
                            </div>
                            <div class="text-xs text-gray-500 space-y-1">
                                <div>Tamanho: ${this.formatFileSize(arquivo.tamanho)}</div>
                                <div>Upload: ${api.formatDate(arquivo.data_upload)}</div>
                                ${arquivo.usuario_upload ? "<div>Por: " + arquivo.usuario_upload + "</div>" : ""}
                            </div>
                            ${arquivo.descricao ? "<p class=\"text-sm text-gray-700 mt-2\">" + arquivo.descricao + "</p>" : ""}
                            <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                                <button onclick="arquivosManager.previewFile('${arquivo.id}')" class="btn-secondary px-2 py-1 rounded text-xs">
                                    <i class="fas fa-eye mr-1"></i>Ver
                                </button>
                                <button onclick="arquivosManager.downloadFile('${arquivo.id}')" class="text-blue-600 hover:text-blue-800 text-xs">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    initializeProfileTabs() {
        // Initialize tabs - styles are now in lurix-theme.css
        // Set default active tab if needed
        const firstTab = document.querySelector('.tab-btn[data-tab="projetos"]');
        if (firstTab && !firstTab.classList.contains('active')) {
            this.showTab('projetos');
        }

        // Add event listeners for PDF buttons (fallback for onclick)
        this.setupPdfButtonListeners();
        
        // Setup project modal event listeners
        this.setupProjectModalListeners();
    }

    setupProjectModalListeners() {
        // Close modal buttons
        const closeBtn = document.getElementById('closeClienteProjetoModal');
        const cancelBtn = document.getElementById('cancelClienteProjetoEdit');
        
        [closeBtn, cancelBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    this.closeProjectModal();
                });
            }
        });

        // Form submission
        const form = document.getElementById('clienteProjetoForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.saveProjectEdit();
            });
        }

        // Close modal when clicking outside
        const modal = document.getElementById('clienteProjetoModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeProjectModal();
                }
            });
        }
    }

    closeProjectModal() {
        const modal = document.getElementById('clienteProjetoModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    generatePdfButtons(projeto) {
        if (!projeto || !projeto.id) {
            console.error('❌ Projeto inválido:', projeto);
            return '<p class="text-red-500">Erro: Dados do projeto inválidos</p>';
        }

        console.log(`🔍 Gerando botões PDF para projeto:`, {
            id: projeto.id,
            nome: projeto.nome_projeto || projeto.nome,
            cliente_id: projeto.cliente_id
        });

        const buttons = [];
        for (let i = 1; i <= 5; i++) {
            buttons.push(`
                <button onclick="clientesManager.handlePdfGeneration('${projeto.id}', ${i})" 
                        class="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                        data-projeto-id="${projeto.id}" data-proposta-num="${i}">
                    <i class="fas fa-file-pdf mr-1"></i>
                    PDF ${i}
                </button>
            `);
        }

        return buttons.join('');
    }

    handlePdfGeneration(projetoId, propostaNum) {
        console.log(`🎯 handlePdfGeneration chamado - Projeto: ${projetoId}, Proposta: ${propostaNum}`);
        
        if (!projetoId || projetoId === 'undefined' || projetoId === 'null') {
            console.error('❌ ID de projeto inválido:', projetoId);
            this.showNotification('Erro: ID do projeto inválido', 'error');
            return;
        }

        this.gerarPropostaPDF(projetoId, propostaNum);
    }

    setupPdfButtonListeners() {
        // Add event listeners for all PDF buttons (as fallback)
        document.querySelectorAll('button[data-projeto-id][data-proposta-num]').forEach(button => {
            // Remove existing listeners to prevent duplicates
            button.replaceWith(button.cloneNode(true));
            
            // Get the new button reference
            const newButton = document.querySelector(`button[data-projeto-id="${button.getAttribute('data-projeto-id')}"][data-proposta-num="${button.getAttribute('data-proposta-num')}"]`);
            
            if (newButton) {
                newButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const projetoId = newButton.getAttribute('data-projeto-id');
                    const propostaNum = parseInt(newButton.getAttribute('data-proposta-num'));
                    
                    console.log(`🔄 Fallback event listener ativado: Projeto ${projetoId}, Proposta ${propostaNum}`);
                    this.handlePdfGeneration(projetoId, propostaNum);
                });
            }
        });
        
        const totalButtons = document.querySelectorAll('button[data-projeto-id][data-proposta-num]').length;
        console.log(`✅ ${totalButtons} botões PDF configurados com event listeners de fallback`);
    }

    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.add('hidden');
        });
        
        // Remove active class from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(`tab-${tabName}`).classList.remove('hidden');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    // Utility functions for the profile
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

    formatTipoInteracao(tipo) {
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

    formatStatusProjeto(status) {
        const statuses = {
            'em_estudo': 'Em Estudo',
            'proposta_enviada': 'Proposta Enviada', 
            'aprovado': 'Aprovado',
            'em_instalacao': 'Em Instalação',
            'concluido': 'Concluído',
            'manutencao': 'Manutenção'
        };
        return statuses[status] || status;
    }

    getFileIcon(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        const icons = {
            'pdf': 'file-pdf',
            'doc': 'file-word', 
            'docx': 'file-word',
            'xls': 'file-excel',
            'xlsx': 'file-excel',
            'jpg': 'file-image',
            'jpeg': 'file-image',
            'png': 'file-image',
            'dwg': 'file-alt'
        };
        return icons[extension] || 'file';
    }

    getFileIconColor(tipoArquivo) {
        const colors = {
            'fatura_energia': 'text-yellow-500',
            'projeto_pdf': 'text-red-500',
            'projeto_dwg': 'text-blue-500',
            'proposta': 'text-green-500',
            'contrato': 'text-purple-500',
            'foto_local': 'text-pink-500'
        };
        return colors[tipoArquivo] || 'text-gray-400';
    }

    formatTipoArquivo(tipo) {
        const tipos = {
            'fatura_energia': 'Fatura de Energia',
            'projeto_pdf': 'Projeto PDF',
            'projeto_dwg': 'Projeto DWG', 
            'proposta': 'Proposta',
            'contrato': 'Contrato',
            'documento_concessionaria': 'Documento Concessionária',
            'foto_local': 'Foto do Local',
            'outro': 'Outro'
        };
        return tipos[tipo] || tipo;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Quick actions from profile
    async addInteracao(clienteId) {
        try {
            // Get client data for the modal
            const cliente = await api.getCliente(clienteId);
            if (!cliente) {
                this.showNotification('Cliente não encontrado', 'error');
                return;
            }
            
            // Open custom interaction modal for this specific client
            this.openClientInteractionModal(cliente);
            
        } catch (error) {
            console.error('Erro ao abrir modal de interação:', error);
            this.showNotification('Erro ao abrir modal de interação', 'error');
        }
    }

    async uploadArchivo(clienteId) {
        try {
            // Get client data for the modal
            const cliente = await api.getCliente(clienteId);
            if (!cliente) {
                this.showNotification('Cliente não encontrado', 'error');
                return;
            }
            
            // Open custom upload modal for this specific client
            this.openClientUploadModal(cliente);
            
        } catch (error) {
            console.error('Erro ao abrir modal de upload:', error);
            this.showNotification('Erro ao abrir modal de upload', 'error');
        }
    }

    // Create project for specific client
    async createProjetoForCliente(clienteId) {
        try {
            // Get client data for the modal
            const cliente = await api.getCliente(clienteId);
            if (!cliente) {
                this.showNotification('Cliente não encontrado', 'error');
                return;
            }
            
            // Open custom project modal for this specific client
            this.openClientProjectModal(cliente);
            
        } catch (error) {
            console.error('Erro ao abrir modal de projeto:', error);
            this.showNotification('Erro ao abrir modal de projeto: ' + error.message, 'error');
        }
    }

    // Redirect to projects for proposal generation
    async redirectToProjects(clienteId) {
        try {
            console.log('📍 Redirecionando para Projetos para gerar proposta para cliente:', clienteId);
            
            // Get client data for context
            const cliente = await api.getCliente(clienteId);
            if (!cliente) {
                this.showNotification('Cliente não encontrado', 'error');
                return;
            }
            
            // Mostrar notificação informativa
            this.showNotification(
                `📋 Para gerar propostas para ${cliente.nome}, vá para "Projetos" → Selecione ou crie um projeto → Clique em "Gerar Proposta"`,
                'info'
            );
            
            // Redirecionar automaticamente para projetos após 2 segundos
            setTimeout(() => {
                if (window.app && typeof window.app.navigateTo === 'function') {
                    window.app.navigateTo('projetos');
                } else {
                    // Fallback: click on nav item
                    const navItem = document.querySelector('[data-page="projetos"]');
                    if (navItem) {
                        navItem.click();
                    }
                }
            }, 2000);
            
        } catch (error) {
            console.error('Erro ao redirecionar para projetos:', error);
            this.showNotification('Erro ao acessar projetos', 'error');
        }
    }

    // Helper method to dynamically load scripts
    loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve(); // Script already loaded
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Método removido - funcionalidade movida para projetos.js

    // Proposta modal functions
    openPropostaModal(cliente) {
        // Redirecionar para projetos
        console.log('📍 Redirecionando para Projetos para gerar proposta');
        
        // Mostrar notificação informativa
        this.showNotification(
            '📋 Para gerar propostas, vá para a aba "Projetos" → Selecione um projeto → Clique em "Gerar Proposta"',
            'info'
        );
        
        // Redirecionar automaticamente para projetos após 2 segundos
        setTimeout(() => {
            if (window.app && typeof window.app.navigateTo === 'function') {
                window.app.navigateTo('projetos');
            }
        }, 2000);
    }

    // closePropostaModal removido - funcionalidade movida para projetos.js

    // initializeMateriais removido - funcionalidade movida para projetos.js

    // addMaterialRow removido - funcionalidade movida para projetos.js

    // processarProposta removido - funcionalidade movida para projetos.js

    // collectMateriais removido - funcionalidade movida para projetos.js

    // gerarNumeroProposta removido - funcionalidade movida para projetos.js

    async mostrarPropostaHTML(dados) {
        // Calcular dados necessários
        const economia = this.calcularEconomiaMensal(dados);
        const payback = this.calcularPayback(dados);
        const geracaoMensal = this.calcularGeracaoMensal(dados.potenciaKwp);
        const economiaAnual = economia * 12;
        const economia25Anos = economiaAnual * 25;
        
        const content = `
            <div class="fade-in">
                <!-- Header da Proposta -->
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center space-x-4">
                        <button onclick="clientesManager.voltarParaCliente('${dados.cliente.id}')" class="btn-secondary px-4 py-2 rounded-lg">
                            <i class="fas fa-arrow-left mr-2"></i>Voltar
                        </button>
                        <div>
                            <h1 class="text-3xl font-bold text-gradient">Proposta Comercial</h1>
                            <p class="text-gray-600">Proposta Nº: ${dados.numeroProposta}</p>
                        </div>
                    </div>
                    <div class="flex space-x-3">
                        <button onclick="clientesManager.gerarPDF()" class="btn-primary px-6 py-3 rounded-lg text-lg">
                            <i class="fas fa-file-pdf mr-2"></i>Gerar PDF
                        </button>
                        <button onclick="clientesManager.editarProposta()" class="btn-secondary px-4 py-2 rounded-lg">
                            <i class="fas fa-edit mr-2"></i>Editar
                        </button>
                    </div>
                </div>

                <!-- Capa da Proposta -->
                <div class="card-lurix rounded-xl p-8 mb-8" style="background: linear-gradient(135deg, var(--azul-petroleo) 0%, var(--azul-petroleo-light) 100%); color: var(--branco-sujo);">
                    <div class="text-center">
                        <div class="mb-6">
                            <h2 class="text-4xl font-bold" style="color: var(--amarelo-neon);">LURIX CRM</h2>
                            <p class="text-xl mt-2">ENERGIA SOLAR</p>
                        </div>
                        
                        <div class="mb-8">
                            <h3 class="text-3xl font-bold mb-4" style="color: var(--amarelo-neon);">PROPOSTA COMERCIAL</h3>
                            <p class="text-lg">Proposta Nº: ${dados.numeroProposta}</p>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            <div>
                                <h4 class="text-2xl font-bold mb-4" style="color: var(--amarelo-neon);">CLIENTE:</h4>
                                <p class="text-xl font-semibold">${dados.cliente.nome}</p>
                                ${dados.cliente.endereco ? `<p class="mt-2">${dados.cliente.endereco}</p>` : ''}
                                ${dados.cliente.cidade ? `<p>${dados.cliente.cidade} - ${dados.cliente.estado || ''}</p>` : ''}
                            </div>
                            
                            <div>
                                <h4 class="text-2xl font-bold mb-4" style="color: var(--amarelo-neon);">SISTEMA PROPOSTO:</h4>
                                <p class="text-3xl font-bold">${dados.potenciaKwp} kWp</p>
                                <p class="mt-2">Geração estimada: ${geracaoMensal} kWh/mês</p>
                                <p class="text-2xl font-bold mt-4">${this.formatCurrency(dados.valorInvestimento)}</p>
                            </div>
                        </div>
                        
                        <p class="mt-8 text-sm opacity-75">Data: ${new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>

                <!-- Informações Detalhadas -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    
                    <!-- Dados do Cliente -->
                    <div class="card-lurix rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-azul-petroleo mb-4 border-b-2 border-amarelo-neon pb-2">
                            <i class="fas fa-user mr-2"></i>Informações do Cliente
                        </h3>
                        <div class="space-y-3 text-sm">
                            <div><strong>Tipo:</strong> ${dados.cliente.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</div>
                            <div><strong>CPF/CNPJ:</strong> ${dados.cliente.cpf_cnpj || 'N/A'}</div>
                            <div><strong>Email:</strong> ${dados.cliente.email || 'N/A'}</div>
                            <div><strong>Telefone:</strong> ${dados.cliente.telefone || 'N/A'}</div>
                            <div><strong>WhatsApp:</strong> ${dados.cliente.whatsapp || 'N/A'}</div>
                            <div><strong>Endereço:</strong> ${dados.cliente.endereco || 'N/A'}</div>
                            <div><strong>Cidade:</strong> ${dados.cliente.cidade || 'N/A'} - ${dados.cliente.estado || 'N/A'}</div>
                            <div><strong>CEP:</strong> ${dados.cliente.cep || 'N/A'}</div>
                        </div>
                    </div>

                    <!-- Análise Energética -->
                    <div class="card-lurix rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-azul-petroleo mb-4 border-b-2 border-amarelo-neon pb-2">
                            <i class="fas fa-bolt mr-2"></i>Análise Energética
                        </h3>
                        <div class="space-y-3 text-sm">
                            <div><strong>Consumo mensal atual:</strong> ${dados.cliente.consumo_mensal || 0} kWh</div>
                            <div><strong>Valor atual da conta:</strong> ${this.formatCurrency(dados.cliente.valor_conta || 0)}</div>
                            <div><strong>Potência do sistema:</strong> ${dados.potenciaKwp} kWp</div>
                            <div><strong>Geração mensal estimada:</strong> ${geracaoMensal} kWh</div>
                            <div><strong>Economia mensal estimada:</strong> ${this.formatCurrency(economia)}</div>
                        </div>
                        ${dados.observacoes ? `
                            <div class="mt-4 pt-4 border-t border-gray-200">
                                <strong class="block mb-2">Observações:</strong>
                                <p class="text-gray-700 text-sm">${dados.observacoes}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Análise Financeira -->
                <div class="card-lurix rounded-xl p-6 mb-8">
                    <h3 class="text-xl font-semibold text-azul-petroleo mb-6 border-b-2 border-amarelo-neon pb-2">
                        <i class="fas fa-calculator mr-2"></i>Análise Financeira Detalhada
                    </h3>
                    
                    <!-- Resumo Financeiro -->
                    <div class="bg-gradient-to-r from-amarelo-neon to-yellow-300 rounded-lg p-6 mb-6">
                        <h4 class="text-xl font-bold text-azul-petroleo mb-4">RESUMO DO INVESTIMENTO</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-azul-petroleo">
                            <div class="text-center">
                                <p class="text-sm font-medium">Investimento Inicial</p>
                                <p class="text-2xl font-bold">${this.formatCurrency(dados.valorInvestimento)}</p>
                            </div>
                            <div class="text-center">
                                <p class="text-sm font-medium">Economia Mensal</p>
                                <p class="text-2xl font-bold">${this.formatCurrency(economia)}</p>
                            </div>
                            <div class="text-center">
                                <p class="text-sm font-medium">Tempo de Retorno</p>
                                <p class="text-2xl font-bold">${payback.toFixed(1)} anos</p>
                            </div>
                        </div>
                    </div>

                    <!-- Projeção de Economia -->
                    <div class="overflow-x-auto">
                        <table class="w-full table-auto">
                            <thead>
                                <tr class="bg-azul-petroleo text-branco-sujo">
                                    <th class="px-4 py-3 text-left">Anos</th>
                                    <th class="px-4 py-3 text-left">Economia Acumulada</th>
                                    <th class="px-4 py-3 text-left">Retorno do Investimento</th>
                                    <th class="px-4 py-3 text-left">Economia vs Conta Tradicional</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${[5, 10, 15, 20, 25].map((ano, index) => {
                                    const economiaAcum = economiaAnual * ano;
                                    const retorno = (economiaAcum / dados.valorInvestimento) * 100;
                                    const gastoTradicional = (dados.cliente.valor_conta || 300) * 12 * ano * Math.pow(1.05, ano);
                                    const diferencaTotal = gastoTradicional - economiaAcum;
                                    
                                    return `
                                        <tr class="${index % 2 === 0 ? 'bg-branco-sujo' : 'bg-white'}">
                                            <td class="px-4 py-3 font-medium">${ano}</td>
                                            <td class="px-4 py-3">${this.formatCurrency(economiaAcum)}</td>
                                            <td class="px-4 py-3">${retorno.toFixed(1)}%</td>
                                            <td class="px-4 py-3 text-green-600 font-medium">${this.formatCurrency(diferencaTotal)}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Materiais e Equipamentos -->
                <div class="card-lurix rounded-xl p-6 mb-8">
                    <h3 class="text-xl font-semibold text-azul-petroleo mb-4 border-b-2 border-amarelo-neon pb-2">
                        <i class="fas fa-tools mr-2"></i>Materiais e Equipamentos
                    </h3>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full table-auto">
                            <thead>
                                <tr class="bg-amarelo-neon text-azul-petroleo">
                                    <th class="px-4 py-3 text-left">Item</th>
                                    <th class="px-4 py-3 text-left">Especificação</th>
                                    <th class="px-4 py-3 text-center">Qtd</th>
                                    <th class="px-4 py-3 text-right">Valor Unit.</th>
                                    <th class="px-4 py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dados.materiais.map((material, index) => {
                                    const total = material.quantidade * material.valorUnitario;
                                    return `
                                        <tr class="${index % 2 === 0 ? 'bg-branco-sujo' : 'bg-white'}">
                                            <td class="px-4 py-3 font-medium">${material.nome}</td>
                                            <td class="px-4 py-3">${material.especificacao}</td>
                                            <td class="px-4 py-3 text-center">${material.quantidade}</td>
                                            <td class="px-4 py-3 text-right">${this.formatCurrency(material.valorUnitario)}</td>
                                            <td class="px-4 py-3 text-right font-medium">${this.formatCurrency(total)}</td>
                                        </tr>
                                    `;
                                }).join('')}
                                <tr class="bg-azul-petroleo text-branco-sujo font-bold">
                                    <td colspan="4" class="px-4 py-3 text-right">TOTAL DOS MATERIAIS:</td>
                                    <td class="px-4 py-3 text-right">${this.formatCurrency(dados.materiais.reduce((sum, m) => sum + (m.quantidade * m.valorUnitario), 0))}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Benefícios e Garantias -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="card-lurix rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-azul-petroleo mb-4 border-b-2 border-amarelo-neon pb-2">
                            <i class="fas fa-star mr-2"></i>Benefícios do Sistema Solar
                        </h3>
                        <div class="space-y-3 text-sm">
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-check-circle text-green-500 mt-1"></i>
                                <span>Redução de até 95% na conta de energia elétrica</span>
                            </div>
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-check-circle text-green-500 mt-1"></i>
                                <span>Valorização do imóvel em até 8%</span>
                            </div>
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-check-circle text-green-500 mt-1"></i>
                                <span>Energia limpa e sustentável</span>
                            </div>
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-check-circle text-green-500 mt-1"></i>
                                <span>Vida útil de mais de 25 anos</span>
                            </div>
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-check-circle text-green-500 mt-1"></i>
                                <span>Baixa manutenção</span>
                            </div>
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-check-circle text-green-500 mt-1"></i>
                                <span>Proteção contra aumentos na tarifa de energia</span>
                            </div>
                        </div>
                    </div>

                    <div class="card-lurix rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-azul-petroleo mb-4 border-b-2 border-amarelo-neon pb-2">
                            <i class="fas fa-shield-alt mr-2"></i>Garantias Oferecidas
                        </h3>
                        <div class="space-y-3 text-sm">
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-certificate text-blue-500 mt-1"></i>
                                <span><strong>Painéis solares:</strong> 25 anos de garantia de potência</span>
                            </div>
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-certificate text-blue-500 mt-1"></i>
                                <span><strong>Inversor:</strong> 10-12 anos de garantia do fabricante</span>
                            </div>
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-certificate text-blue-500 mt-1"></i>
                                <span><strong>Estrutura de fixação:</strong> 10 anos contra corrosão</span>
                            </div>
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-certificate text-blue-500 mt-1"></i>
                                <span><strong>Instalação:</strong> 5 anos de garantia de mão de obra</span>
                            </div>
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-certificate text-blue-500 mt-1"></i>
                                <span><strong>Projeto:</strong> Responsabilidade técnica (ART)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('pageContent').innerHTML = content;
        
        // Salvar dados da proposta para uso posterior
        this.currentProposta = dados;
    }

    // Métodos de cálculo
    calcularGeracaoMensal(potenciaKwp) {
        // Média de 4.5 horas de sol por dia no Brasil
        const horasSolDia = 4.5;
        const diasMes = 30;
        return Math.round(potenciaKwp * horasSolDia * diasMes);
    }

    calcularEconomiaMensal(dados) {
        const geracaoMensal = this.calcularGeracaoMensal(dados.potenciaKwp);
        const tarifaKwh = (dados.cliente.valor_conta || 300) / (dados.cliente.consumo_mensal || 350);
        const disponibilidade = 100; // Taxa mínima da concessionária
        return Math.max(0, (geracaoMensal * tarifaKwh) - disponibilidade);
    }

    calcularPayback(dados) {
        const economia = this.calcularEconomiaMensal(dados) * 12;
        return dados.valorInvestimento / economia;
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    async voltarParaCliente(clienteId) {
        await this.openClienteProfile(clienteId);
    }

    editarProposta() {
        // Reabrir modal com dados atuais
        if (this.currentProposta) {
            this.openPropostaModal(this.currentProposta.cliente);
            // Pré-popular com dados salvos
            setTimeout(() => {
                document.getElementById('propostaPotencia').value = this.currentProposta.potenciaKwp;
                document.getElementById('propostaValor').value = this.currentProposta.valorInvestimento;
                document.getElementById('propostaTipoInstalacao').value = this.currentProposta.tipoInstalacao;
                document.getElementById('propostaTaxaJuros').value = this.currentProposta.taxaJuros;
                document.getElementById('propostaInflacao').value = this.currentProposta.inflacao;
                document.getElementById('propostaVidaUtil').value = this.currentProposta.vidaUtil;
                document.getElementById('propostaObservacoes').value = this.currentProposta.observacoes;
                this.initializeMateriais();
            }, 100);
        }
    }

    async gerarPDF() {
        let pdfNotificationId = null;
        const botaoGerar = document.querySelector('button[onclick="clientesManager.gerarPDF()"]');
        
        try {
            console.log('🔄 Iniciando geração de PDF...');
            
            if (!this.currentProposta) {
                throw new Error('Dados da proposta não encontrados');
            }

            // Add loading state to button
            if (botaoGerar) {
                botaoGerar.classList.add('btn-loading');
                botaoGerar.innerHTML = '<span class="loading-text">Gerando PDF...</span>';
            }
            
            // Show progress notification
            pdfNotificationId = this.showNotification('Preparando geração do PDF...', 'info', false, true);
            
            // Load proposta generator if not loaded
            if (!window.propostaGenerator) {
                console.log('📦 Carregando gerador de proposta para PDF...');
                this.updateNotification(pdfNotificationId, 'Carregando bibliotecas PDF...', 'info', true);
                
                await this.loadScript('js/proposta-generator.js');
                await new Promise(resolve => setTimeout(resolve, 500));
                
                if (!window.propostaGenerator) {
                    throw new Error('PropostaGenerator não foi inicializado após carregamento');
                }
            }
            
            console.log('✅ PropostaGenerator disponível para PDF');
            this.updateNotification(pdfNotificationId, 'Gerando PDF... Aguarde, isso pode levar alguns segundos.', 'info', true);
            
            // Generate PDF
            console.log('📄 Chamando gerarProposta com dados:', this.currentProposta);
            const result = await window.propostaGenerator.gerarProposta(this.currentProposta);
            
            console.log('📋 Resultado da geração:', result);
            
            if (result && result.success) {
                // Hide progress notification
                this.hideNotification(pdfNotificationId);
                
                // Show success
                this.showNotification(`🎉 PDF gerado com sucesso!<br><strong>Proposta:</strong> ${result.numeroProposta}<br><strong>Arquivo:</strong> ${result.nomeArquivo}`, 'success');
            } else {
                throw new Error(`Falha na geração do PDF: ${result ? JSON.stringify(result) : 'Resultado indefinido'}`);
            }
            
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            
            // Hide progress notification
            if (pdfNotificationId) {
                this.hideNotification(pdfNotificationId);
            }
            
            this.showNotification(`Erro ao gerar PDF: ${error.message}`, 'error');
        } finally {
            // Remove loading state from button
            if (botaoGerar) {
                botaoGerar.classList.remove('btn-loading');
                botaoGerar.innerHTML = '<i class="fas fa-file-pdf mr-2"></i>Gerar PDF';
            }
        }
    }

    showNotification(message, type = 'info', autoClose = true, showSpinner = false) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification-enhanced ${type}`;
        
        const iconMap = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-triangle',
            'warning': 'fa-exclamation-circle',
            'info': 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                ${showSpinner ? '<div class="loading-spinner"></div>' : `<i class="fas ${iconMap[type] || iconMap.info} text-lg"></i>`}
                <span class="flex-1">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="text-current hover:opacity-75 transition-opacity">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Set unique ID for potential updates
        notification.id = `notification-${Date.now()}`;
        
        document.body.appendChild(notification);
        
        // Auto remove based on type and autoClose setting
        if (autoClose) {
            const duration = type === 'error' ? 8000 : 5000;
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }, duration);
        }
        
        return notification.id;
    }
    
    updateNotification(notificationId, message, type, showSpinner = false) {
        const notification = document.getElementById(notificationId);
        if (notification) {
            notification.className = `notification-enhanced ${type}`;
            const iconMap = {
                'success': 'fa-check-circle',
                'error': 'fa-exclamation-triangle', 
                'warning': 'fa-exclamation-circle',
                'info': 'fa-info-circle'
            };
            
            notification.innerHTML = `
                <div class="flex items-center space-x-3">
                    ${showSpinner ? '<div class="loading-spinner"></div>' : `<i class="fas ${iconMap[type] || iconMap.info} text-lg"></i>`}
                    <span class="flex-1">${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" class="text-current hover:opacity-75 transition-opacity">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }
    }
    
    hideNotification(notificationId) {
        const notification = document.getElementById(notificationId);
        if (notification) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }

    // Open edit project modal from client view
    async openEditProjectModal(projetoId) {
        try {
            console.log('🔧 Abrindo modal de edição para projeto:', projetoId);
            
            // Get project data
            const projeto = await api.getProjeto(projetoId);
            if (!projeto) {
                this.showNotification('Projeto não encontrado', 'error');
                return;
            }
            
            console.log('📋 Dados do projeto:', projeto);
            
            // Populate the modal form
            document.getElementById('clienteProjetoId').value = projeto.id || '';
            document.getElementById('clienteProjetoNome').value = projeto.nome_projeto || projeto.nome || '';
            document.getElementById('clienteProjetoStatus').value = projeto.status || 'em_estudo';
            document.getElementById('clienteProjetoPotencia').value = projeto.potencia_kwp || '';
            document.getElementById('clienteProjetoValor').value = projeto.valor_investimento || '';
            document.getElementById('clienteProjetoObservacoes').value = projeto.observacoes || '';
            
            // Show the modal
            const modal = document.getElementById('clienteProjetoModal');
            if (modal) {
                modal.classList.remove('hidden');
                console.log('✅ Modal de edição aberto');
            } else {
                throw new Error('Modal não encontrado');
            }
            
        } catch (error) {
            console.error('❌ Erro ao abrir modal de edição:', error);
            this.showNotification('Erro ao abrir editor de projeto: ' + error.message, 'error');
        }
    }

    async saveProjectEdit() {
        try {
            const projetoId = document.getElementById('clienteProjetoId').value;
            const formData = {
                nome_projeto: document.getElementById('clienteProjetoNome').value,
                status: document.getElementById('clienteProjetoStatus').value,
                potencia_kwp: parseFloat(document.getElementById('clienteProjetoPotencia').value) || null,
                valor_investimento: parseFloat(document.getElementById('clienteProjetoValor').value) || null,
                observacoes: document.getElementById('clienteProjetoObservacoes').value
            };

            console.log('💾 Salvando projeto:', projetoId, formData);

            const resultado = await api.updateProjeto(projetoId, formData);
            
            if (resultado) {
                this.showNotification('Projeto atualizado com sucesso!', 'success');
                this.closeProjectModal();
                
                // Refresh the current client view
                const currentClientId = resultado.cliente_id;
                if (currentClientId) {
                    await this.openClienteProfile(currentClientId);
                }
            } else {
                throw new Error('Falha ao salvar o projeto');
            }

        } catch (error) {
            console.error('❌ Erro ao salvar projeto:', error);
            this.showNotification('Erro ao salvar projeto: ' + error.message, 'error');
        }
    }

    // Go to project page and show details
    async viewProjectDetails(projetoId) {
        try {
            console.log('👁️ Visualizando detalhes do projeto:', projetoId);
            
            // Buscar dados do projeto
            const projeto = await api.getProjeto(projetoId);
            if (!projeto) {
                this.showNotification('Projeto não encontrado', 'error');
                return;
            }

            // Buscar dados do cliente
            const cliente = await api.getCliente(projeto.cliente_id);
            
            console.log('📋 Exibindo detalhes:', projeto);

            // Criar modal de detalhes do projeto
            this.showProjectDetailsModal(projeto, cliente);
            
        } catch (error) {
            console.error('❌ Erro ao carregar detalhes do projeto:', error);
            this.showNotification('Erro ao carregar detalhes do projeto', 'error');
        }
    }

    showProjectDetailsModal(projeto, cliente) {
        // Criar modal de detalhes
        const modal = document.createElement('div');
        modal.id = 'projectDetailsModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">📋 Detalhes do Projeto</h2>
                    <button onclick="this.closest('#projectDetailsModal').remove()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="p-6">
                    <!-- Cabeçalho do Projeto -->
                    <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 mb-6 border border-blue-200">
                        <h3 class="text-xl font-bold text-blue-900 mb-2">${projeto.nome_projeto || projeto.nome}</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div class="flex items-center">
                                <i class="fas fa-user text-blue-600 mr-2"></i>
                                <span><strong>Cliente:</strong> ${cliente?.nome || 'N/A'}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-flag text-green-600 mr-2"></i>
                                <span><strong>Status:</strong> ${this.formatStatusProjeto(projeto.status)}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-bolt text-yellow-600 mr-2"></i>
                                <span><strong>Potência:</strong> ${projeto.potencia_kwp || 'N/A'} kWp</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-dollar-sign text-green-600 mr-2"></i>
                                <span><strong>Investimento:</strong> ${projeto.valor_investimento ? 'R$ ' + projeto.valor_investimento.toLocaleString('pt-BR') : 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Informações Técnicas -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <!-- Dados Técnicos -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                                <i class="fas fa-cog text-gray-600 mr-2"></i>
                                Dados Técnicos
                            </h4>
                            <div class="space-y-2 text-sm">
                                <div><strong>Cidade:</strong> ${projeto.cidade || 'N/A'}</div>
                                <div><strong>Estado:</strong> ${projeto.estado || 'N/A'}</div>
                                <div><strong>Irradiação Solar:</strong> ${projeto.irradiacao_solar || 'N/A'} kWh/m²/dia</div>
                                <div><strong>Concessionária:</strong> ${projeto.concessionaria || 'N/A'}</div>
                                <div><strong>Tarifa kWh:</strong> R$ ${projeto.tarifa_kwh || 'N/A'}</div>
                                <div><strong>Tipo de Instalação:</strong> ${projeto.tipo_instalacao || 'N/A'}</div>
                            </div>
                        </div>

                        <!-- Dados Econômicos -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                                <i class="fas fa-chart-line text-green-600 mr-2"></i>
                                Dados Econômicos
                            </h4>
                            <div class="space-y-2 text-sm">
                                <div><strong>Geração Estimada:</strong> ${projeto.geracao_estimada || 'N/A'} kWh/mês</div>
                                <div><strong>Economia Mensal:</strong> R$ ${projeto.economia_mensal ? projeto.economia_mensal.toLocaleString('pt-BR') : 'N/A'}</div>
                                <div><strong>Payback:</strong> ${projeto.payback_meses || 'N/A'} meses</div>
                                <div><strong>Forma de Pagamento:</strong> ${projeto.forma_pagamento || 'N/A'}</div>
                                <div><strong>Responsável:</strong> ${projeto.responsavel || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Lista de Materiais -->
                    ${projeto.lista_materiais ? `
                    <div class="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                            <i class="fas fa-list text-blue-600 mr-2"></i>
                            Lista de Materiais
                        </h4>
                        <pre class="text-sm text-gray-700 whitespace-pre-wrap font-sans">${projeto.lista_materiais}</pre>
                    </div>
                    ` : ''}

                    <!-- Endereço da Instalação -->
                    ${projeto.endereco_instalacao ? `
                    <div class="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                            <i class="fas fa-map-marker-alt text-red-600 mr-2"></i>
                            Endereço da Instalação
                        </h4>
                        <p class="text-sm text-gray-700">${projeto.endereco_instalacao}</p>
                        ${projeto.data_prevista_instalacao ? `
                        <p class="text-sm text-gray-600 mt-2">
                            <strong>Data Prevista:</strong> ${new Date(projeto.data_prevista_instalacao).toLocaleDateString('pt-BR')}
                        </p>
                        ` : ''}
                    </div>
                    ` : ''}

                    <!-- Observações -->
                    ${projeto.observacoes ? `
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                            <i class="fas fa-sticky-note text-yellow-600 mr-2"></i>
                            Observações
                        </h4>
                        <p class="text-sm text-gray-700">${projeto.observacoes}</p>
                    </div>
                    ` : ''}

                    <!-- Ações -->
                    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button onclick="clientesManager.openEditProjectModal('${projeto.id}')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                            <i class="fas fa-edit mr-2"></i>
                            Editar Projeto
                        </button>
                        <button onclick="this.closest('#projectDetailsModal').remove()" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200">
                            <i class="fas fa-times mr-2"></i>
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Fechar modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Adicionar ao DOM
        document.body.appendChild(modal);
        
        console.log('✅ Modal de detalhes do projeto exibido');
    }

    /**
     * Gera Proposta Premium em nova aba
     */
    async gerarPropostaPremium(projetoId) {
        try {
            console.log(`🎯 Gerando Proposta Premium para projeto ${projetoId}`);
            
            // Mostrar indicador de carregamento
            this.showNotification('Gerando Proposta Premium...', 'info');
            
            // Verificar se o gerador premium está disponível PRIMEIRO
            if (!window.propostaPremiumGenerator) {
                throw new Error('Gerador de Proposta Premium não está carregado');
            }
            
            // Buscar dados do projeto (pode ser nulo)
            const projetos = storage.getItem('projetos') || [];
            const projeto = projetos.find(p => p.id === projetoId);
            
            // Buscar dados do cliente (pode ser nulo)
            let cliente = null;
            if (projeto && projeto.cliente_id) {
                const clientes = storage.getItem('clientes') || [];
                cliente = clientes.find(c => c.id === projeto.cliente_id);
            }
            
            // LOG para debug
            if (!projeto) {
                console.warn(`⚠️ Projeto não encontrado (ID: ${projetoId}), gerando com dados padrão`);
            }
            if (!cliente) {
                console.warn(`⚠️ Cliente não encontrado, gerando com dados padrão`);
            }
            
            console.log('📊 Dados para proposta premium:', { projeto, cliente });
            
            // SEMPRE GERAR A PROPOSTA - mesmo com dados nulos/inválidos
            const resultado = await window.propostaPremiumGenerator.gerarPropostaPremium(projeto, cliente);
            
            if (resultado && resultado.success) {
                if (resultado.type === 'emergency') {
                    this.showNotification('Proposta de Emergência gerada! (dados padrão)', 'warning');
                } else {
                    this.showNotification('Proposta Premium gerada com sucesso!', 'success');
                }
                console.log(`✅ Proposta gerada: ${resultado.numeroProposta}`);
            } else if (resultado && resultado.error === 'Pop-up bloqueado') {
                this.showNotification('Pop-up bloqueado! Permita pop-ups e tente novamente.', 'warning');
            } else {
                // Mesmo se houve erro, não impedir a experiência do usuário
                this.showNotification('Proposta processada. Verifique se uma nova aba foi aberta.', 'info');
            }
            
        } catch (error) {
            console.error(`❌ Erro ao gerar Proposta Premium:`, error);
            
            // ÚLTIMA TENTATIVA: gerar proposta básica de emergência
            try {
                console.log('🔄 Tentando gerar proposta básica...');
                if (window.propostaPremiumGenerator) {
                    const emergencia = await window.propostaPremiumGenerator.gerarPropostaEmergencia();
                    if (emergencia.success) {
                        this.showNotification('Proposta básica gerada!', 'info');
                        return;
                    }
                }
            } catch (emergencyError) {
                console.error('❌ Erro na proposta de emergência:', emergencyError);
            }
            
            // Se mesmo a emergência falhou, informar o usuário mas não quebrar o sistema
            this.showNotification(`Não foi possível gerar a proposta. Tente novamente ou contate o suporte.`, 'error');
        }
    }

    /**
     * Gera Proposta Premium Genérica (sem projeto específico)
     */
    async gerarPropostaPremiumGenerica(clienteId) {
        try {
            console.log(`🎯 Gerando Proposta Premium Genérica para cliente ${clienteId}`);
            
            this.showNotification('Gerando Proposta Genérica...', 'info');
            
            if (!window.propostaPremiumGenerator) {
                throw new Error('Gerador de Proposta Premium não está carregado');
            }
            
            // Buscar dados do cliente
            let cliente = null;
            if (clienteId) {
                const clientes = storage.getItem('clientes') || [];
                cliente = clientes.find(c => c.id === clienteId);
            }
            
            // Criar projeto genérico baseado no cliente
            const projetoGenerico = cliente ? {
                id: 'proj_generico_' + clienteId,
                nome_projeto: `Sistema Solar para ${cliente.nome}`,
                potencia_kwp: cliente.consumo_mensal ? Math.ceil(cliente.consumo_mensal / 150) : 5.5,
                economia_mensal: cliente.valor_conta ? cliente.valor_conta * 0.9 : 380,
                tipo_instalacao: 'telhado'
            } : null;
            
            console.log('📊 Gerando proposta genérica:', { cliente, projetoGenerico });
            
            // Gerar proposta
            const resultado = await window.propostaPremiumGenerator.gerarPropostaPremium(projetoGenerico, cliente);
            
            if (resultado && resultado.success) {
                this.showNotification('Proposta Genérica gerada com sucesso!', 'success');
            } else {
                this.showNotification('Proposta processada. Verifique se uma nova aba foi aberta.', 'info');
            }
            
        } catch (error) {
            console.error(`❌ Erro ao gerar Proposta Genérica:`, error);
            this.showNotification('Gerando proposta básica...', 'info');
            
            // Tentar gerar proposta de emergência
            if (window.propostaPremiumGenerator) {
                window.propostaPremiumGenerator.gerarPropostaEmergencia();
            }
        }
    }

    async gerarPropostaPDF(projetoId, propostaNumero) {
        try {
            console.log(`🎯 Gerando proposta ${propostaNumero} para projeto ${projetoId}`);
            
            // Mostrar indicador de carregamento
            this.showNotification(`Gerando Proposta ${propostaNumero}...`, 'info');
            
            // Buscar dados do projeto
            const projetos = storage.getItem('projetos') || [];
            const projeto = projetos.find(p => p.id === projetoId);
            
            if (!projeto) {
                console.error(`❌ Projeto não encontrado (ID: ${projetoId}). Existem ${projetos.length} projetos disponíveis.`);
                throw new Error(`Projeto não encontrado (ID: ${projetoId}). Existem ${projetos.length} projetos disponíveis.`);
            }
            
            console.log(`✅ Gerando proposta ${propostaNumero} para: ${projeto.nome_projeto}`);
            
            // Buscar dados do cliente
            const clientes = storage.getItem('clientes') || [];
            const cliente = clientes.find(c => c.id === projeto.cliente_id);
            
            if (!cliente) {
                throw new Error(`Cliente não encontrado para o projeto: ${projeto.cliente_id}`);
            }
            
            // Preparar dados para a proposta com número específico
            const dadosProposta = {
                cliente: cliente,
                projeto: {
                    potencia_kwp: projeto.potencia_kwp,
                    tipo_instalacao: projeto.tipo_instalacao || 'telhado',
                    geracao_estimada: projeto.geracao_estimada,
                    economia_mensal: projeto.economia_mensal
                },
                potenciaKwp: projeto.potencia_kwp,
                valorInvestimento: projeto.valor_investimento,
                tipoInstalacao: projeto.tipo_instalacao || 'telhado',
                propostaNumero: propostaNumero,
                dataGeracao: new Date().toISOString(),
                versao: `v${propostaNumero}.0`
            };
            
            console.log(`📊 Dados da proposta ${propostaNumero}:`, dadosProposta);
            
            // Verificar se o gerador de propostas está disponível
            if (!window.propostaGenerator) {
                throw new Error('Gerador de propostas não está carregado');
            }
            
            // Gerar a proposta em PDF
            const resultado = await window.propostaGenerator.gerarProposta(dadosProposta);
            
            if (resultado && resultado.success) {
                this.showNotification(`Proposta ${propostaNumero} gerada com sucesso!`, 'success');
                console.log(`✅ Proposta ${propostaNumero} gerada com sucesso`);
            } else {
                throw new Error(resultado?.message || 'Erro desconhecido na geração da proposta');
            }
            
        } catch (error) {
            console.error(`❌ Erro ao gerar proposta ${propostaNumero}:`, error);
            console.error('🔍 Debug info:', {
                projetoId,
                propostaNumero,
                typeof: typeof projetoId,
                windowGenerator: !!window.propostaGenerator,
                storageAvailable: !!storage
            });
            this.showNotification(`Erro ao gerar proposta ${propostaNumero}: ${error.message}`, 'error');
        }
    }

    // Open custom upload modal for specific client
    openClientUploadModal(cliente) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('clientUploadModal');
        if (!modal) {
            modal = this.createClientUploadModal(cliente);
            document.body.appendChild(modal);
        } else {
            // Update modal for current client
            this.updateClientUploadModal(modal, cliente);
        }
        
        // Show modal
        modal.classList.remove('hidden');
        
        // Focus on file input
        setTimeout(() => {
            const fileInput = modal.querySelector('#clientFileInput');
            if (fileInput) fileInput.click();
        }, 100);
    }

    // Create the custom upload modal
    createClientUploadModal(cliente) {
        const modal = document.createElement('div');
        modal.id = 'clientUploadModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4';
        
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">Upload para ${cliente.nome}</h2>
                    <button onclick="clientesManager.closeClientUploadModal()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <form id="clientUploadForm" class="p-6">
                    <!-- File Upload Area -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Arquivo</label>
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                            <input type="file" id="clientFileInput" multiple class="hidden" 
                                accept=".pdf,.dwg,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt">
                            <div onclick="document.getElementById('clientFileInput').click()" class="cursor-pointer">
                                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                                <p class="text-gray-600 mb-2">Clique para selecionar arquivos</p>
                                <p class="text-sm text-gray-500">PDF, DWG, JPG, PNG, DOC, XLS (máx. 10MB cada)</p>
                            </div>
                            <div id="clientSelectedFiles" class="mt-4 space-y-2 hidden">
                                <!-- Selected files will appear here -->
                            </div>
                        </div>
                    </div>

                    <!-- File Details -->
                    <div class="mb-6">
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <div class="flex items-center">
                                <i class="fas fa-user text-blue-500 mr-2"></i>
                                <span class="text-sm text-blue-700">Enviando arquivo para: <strong>${cliente.nome}</strong></span>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Arquivo</label>
                                <select id="clientTipoArquivo" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="projeto">Projeto/Desenho</option>
                                    <option value="documento">Documento</option>
                                    <option value="foto">Foto/Imagem</option>
                                    <option value="contrato">Contrato</option>
                                    <option value="laudo">Laudo Técnico</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Descrição (Opcional)</label>
                                <textarea id="clientDescricaoArquivo" rows="3" 
                                    placeholder="Descreva o conteúdo do arquivo..."
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Upload Progress -->
                    <div id="clientUploadProgress" class="mb-6 hidden">
                        <div class="bg-gray-200 rounded-full h-2">
                            <div id="clientProgressBar" class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                        </div>
                        <p id="clientProgressText" class="text-sm text-gray-600 mt-2">Preparando upload...</p>
                    </div>

                    <!-- Buttons -->
                    <div class="flex justify-end space-x-3">
                        <button type="button" onclick="clientesManager.closeClientUploadModal()" 
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="button" onclick="clientesManager.uploadSelectedFiles('${cliente.id}')" 
                            id="clientUploadBtn"
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                            disabled>
                            <i class="fas fa-upload mr-2"></i>
                            Enviar Arquivos
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        // Add event listeners
        const fileInput = modal.querySelector('#clientFileInput');
        fileInput.addEventListener('change', (e) => this.handleClientFileSelection(e.target.files));
        
        return modal;
    }

    // Update modal for different client
    updateClientUploadModal(modal, cliente) {
        modal.querySelector('h2').textContent = `Upload para ${cliente.nome}`;
        modal.querySelector('.text-blue-700 strong').textContent = cliente.nome;
        modal.querySelector('#clientUploadBtn').setAttribute('onclick', `clientesManager.uploadSelectedFiles('${cliente.id}')`);
    }

    // Handle file selection in client modal
    handleClientFileSelection(files) {
        const selectedFilesContainer = document.getElementById('clientSelectedFiles');
        const uploadBtn = document.getElementById('clientUploadBtn');
        
        selectedFilesContainer.innerHTML = '';
        
        if (files.length > 0) {
            selectedFilesContainer.classList.remove('hidden');
            uploadBtn.disabled = false;
            
            Array.from(files).forEach(file => {
                const fileElement = document.createElement('div');
                fileElement.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
                fileElement.innerHTML = `
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-file text-gray-400"></i>
                        <div>
                            <p class="text-sm font-medium text-gray-900">${file.name}</p>
                            <p class="text-xs text-gray-500">${(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                `;
                selectedFilesContainer.appendChild(fileElement);
            });
        } else {
            selectedFilesContainer.classList.add('hidden');
            uploadBtn.disabled = true;
        }
    }

    // Close client upload modal
    closeClientUploadModal() {
        const modal = document.getElementById('clientUploadModal');
        if (modal) {
            modal.classList.add('hidden');
            // Reset form
            modal.querySelector('#clientUploadForm').reset();
            document.getElementById('clientSelectedFiles').classList.add('hidden');
            document.getElementById('clientUploadProgress').classList.add('hidden');
            document.getElementById('clientUploadBtn').disabled = true;
        }
    }

    // Upload selected files for specific client
    async uploadSelectedFiles(clienteId) {
        try {
            const fileInput = document.getElementById('clientFileInput');
            const files = fileInput.files;
            
            if (files.length === 0) {
                this.showNotification('Selecione pelo menos um arquivo', 'error');
                return;
            }

            const tipoArquivo = document.getElementById('clientTipoArquivo').value;
            const descricao = document.getElementById('clientDescricaoArquivo').value;
            
            // Show progress
            const progressContainer = document.getElementById('clientUploadProgress');
            const progressBar = document.getElementById('clientProgressBar');
            const progressText = document.getElementById('clientProgressText');
            const uploadBtn = document.getElementById('clientUploadBtn');
            
            progressContainer.classList.remove('hidden');
            uploadBtn.disabled = true;
            progressText.textContent = 'Enviando arquivos...';
            
            // Simulate upload progress
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress > 90) progress = 90;
                progressBar.style.width = progress + '%';
            }, 200);

            // Process each file
            const uploadPromises = Array.from(files).map(async (file, index) => {
                // Simulate file processing
                await new Promise(resolve => setTimeout(resolve, 500 + index * 200));
                
                const arquivo = {
                    nome_arquivo: file.name,
                    tipo_arquivo: tipoArquivo,
                    tamanho: file.size,
                    cliente_id: clienteId,
                    projeto_id: null, // Could be enhanced to select project
                    descricao: descricao || null,
                    data_upload: new Date().toISOString(),
                    usuario_upload: this.getCurrentUser()?.nome || 'Usuário'
                };
                
                return await api.createArquivo(arquivo);
            });

            await Promise.all(uploadPromises);
            
            // Complete progress
            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            progressText.textContent = 'Upload concluído!';
            
            setTimeout(() => {
                this.closeClientUploadModal();
                this.showNotification('Arquivos enviados com sucesso!', 'success');
                
                // Refresh the client view to show new files
                const currentViewedClient = document.querySelector('[data-cliente-id]');
                if (currentViewedClient) {
                    this.viewCliente(clienteId);
                }
            }, 1000);
            
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            this.showNotification('Erro ao enviar arquivos: ' + error.message, 'error');
            document.getElementById('clientUploadBtn').disabled = false;
            document.getElementById('clientUploadProgress').classList.add('hidden');
        }
    }

    // Get current user helper
    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    // Open custom interaction modal for specific client
    openClientInteractionModal(cliente) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('clientInteractionModal');
        if (!modal) {
            modal = this.createClientInteractionModal(cliente);
            document.body.appendChild(modal);
        } else {
            // Update modal for current client
            this.updateClientInteractionModal(modal, cliente);
        }
        
        // Show modal
        modal.classList.remove('hidden');
        
        // Focus on description field
        setTimeout(() => {
            const descricaoInput = modal.querySelector('#clientInteracaoDescricao');
            if (descricaoInput) descricaoInput.focus();
        }, 100);
    }

    // Create the custom interaction modal
    createClientInteractionModal(cliente) {
        const modal = document.createElement('div');
        modal.id = 'clientInteractionModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4';
        
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">Nova Interação - ${cliente.nome}</h2>
                    <button onclick="clientesManager.closeClientInteractionModal()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <form id="clientInteractionForm" class="p-6">
                    <!-- Client Info Banner -->
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <i class="fas fa-user text-blue-500 mr-2"></i>
                                <span class="text-sm text-blue-700">Registrando interação para: <strong>${cliente.nome}</strong></span>
                            </div>
                            <div class="text-xs text-blue-600">
                                ${cliente.email} ${cliente.telefone ? '• ' + cliente.telefone : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Basic Information -->
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Informações da Interação</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Interação *</label>
                                <select id="clientInteracaoTipo" required 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="ligacao">📞 Ligação</option>
                                    <option value="whatsapp">💬 WhatsApp</option>
                                    <option value="email">📧 E-mail</option>
                                    <option value="reuniao">🤝 Reunião</option>
                                    <option value="visita_tecnica">🔧 Visita Técnica</option>
                                    <option value="apresentacao">📊 Apresentação</option>
                                    <option value="negociacao">💰 Negociação</option>
                                    <option value="follow_up">📅 Follow-up</option>
                                    <option value="outro">📝 Outro</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Data da Interação *</label>
                                <input type="datetime-local" id="clientInteracaoData" required 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Status do Resultado</label>
                                <select id="clientInteracaoStatus" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="positivo">✅ Positivo</option>
                                    <option value="neutro">⚪ Neutro</option>
                                    <option value="negativo">❌ Negativo</option>
                                    <option value="aguardando">⏳ Aguardando Retorno</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Interaction Details -->
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Detalhes da Interação</h3>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
                            <textarea id="clientInteracaoDescricao" rows="5" required 
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Descreva detalhadamente a interação: o que foi discutido, decisões tomadas, dúvidas esclarecidas, etc."></textarea>
                        </div>
                    </div>

                    <!-- Commercial Information -->
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Informações Comerciais (Opcional)</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Valor Negociado (R$)</label>
                                <input type="number" id="clientInteracaoValor" step="0.01"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: 25000.00">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                                <input type="text" id="clientInteracaoResponsavel" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Nome do responsável">
                            </div>
                        </div>
                    </div>

                    <!-- Next Steps -->
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Próximos Passos</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Próxima Ação</label>
                                <textarea id="clientInteracaoProximaAcao" rows="3" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Descreva a próxima ação a ser tomada..."></textarea>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Observações Internas</label>
                                <textarea id="clientInteracaoObservacoes" rows="3" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Anotações internas sobre o cliente..."></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Buttons -->
                    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button type="button" onclick="clientesManager.closeClientInteractionModal()" 
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="button" onclick="clientesManager.saveClientInteraction('${cliente.id}')" 
                            id="clientInteractionSaveBtn"
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <i class="fas fa-save mr-2"></i>
                            Salvar Interação
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        // Set current date/time as default
        const now = new Date();
        const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
        const dateInput = modal.querySelector('#clientInteracaoData');
        if (dateInput) {
            dateInput.value = localDate.toISOString().slice(0, 16);
        }
        
        // Set current user as default responsible
        const currentUser = this.getCurrentUser();
        const responsavelInput = modal.querySelector('#clientInteracaoResponsavel');
        if (responsavelInput && currentUser) {
            responsavelInput.value = currentUser.nome;
        }
        
        return modal;
    }

    // Update modal for different client
    updateClientInteractionModal(modal, cliente) {
        modal.querySelector('h2').textContent = `Nova Interação - ${cliente.nome}`;
        modal.querySelector('.text-blue-700 strong').textContent = cliente.nome;
        modal.querySelector('.text-xs.text-blue-600').textContent = 
            `${cliente.email} ${cliente.telefone ? '• ' + cliente.telefone : ''}`;
        modal.querySelector('#clientInteractionSaveBtn').setAttribute('onclick', 
            `clientesManager.saveClientInteraction('${cliente.id}')`);
    }

    // Close client interaction modal
    closeClientInteractionModal() {
        const modal = document.getElementById('clientInteractionModal');
        if (modal) {
            modal.classList.add('hidden');
            // Reset form
            modal.querySelector('#clientInteractionForm').reset();
            
            // Set defaults again
            const now = new Date();
            const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
            const dateInput = modal.querySelector('#clientInteracaoData');
            if (dateInput) {
                dateInput.value = localDate.toISOString().slice(0, 16);
            }
            
            const currentUser = this.getCurrentUser();
            const responsavelInput = modal.querySelector('#clientInteracaoResponsavel');
            if (responsavelInput && currentUser) {
                responsavelInput.value = currentUser.nome;
            }
        }
    }

    // Save client interaction
    async saveClientInteraction(clienteId) {
        try {
            const form = document.getElementById('clientInteractionForm');
            const saveBtn = document.getElementById('clientInteractionSaveBtn');
            
            // Validate required fields
            const tipo = document.getElementById('clientInteracaoTipo').value;
            const data = document.getElementById('clientInteracaoData').value;
            const descricao = document.getElementById('clientInteracaoDescricao').value.trim();
            
            if (!tipo || !data || !descricao) {
                this.showNotification('Preencha todos os campos obrigatórios', 'error');
                return;
            }
            
            // Disable save button
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Salvando...';
            
            // Prepare interaction data
            const interacao = {
                cliente_id: clienteId,
                tipo_interacao: tipo,
                data_interacao: data,
                descricao: descricao,
                valor_negociado: document.getElementById('clientInteracaoValor').value || null,
                responsavel: document.getElementById('clientInteracaoResponsavel').value || null,
                status_resultado: document.getElementById('clientInteracaoStatus').value,
                proxima_acao: document.getElementById('clientInteracaoProximaAcao').value || null,
                observacoes: document.getElementById('clientInteracaoObservacoes').value || null,
                usuario_criacao: this.getCurrentUser()?.nome || 'Usuário'
            };
            
            // Save to API
            const result = await api.createInteracao(interacao);
            
            if (result) {
                this.closeClientInteractionModal();
                this.showNotification('Interação registrada com sucesso!', 'success');
                
                // Refresh the client view to show new interaction
                setTimeout(() => {
                    this.viewCliente(clienteId);
                }, 500);
                
                // Interaction saved successfully - no automatic follow-up creation
            }
            
        } catch (error) {
            console.error('Erro ao salvar interação:', error);
            this.showNotification('Erro ao salvar interação: ' + error.message, 'error');
        } finally {
            // Re-enable save button
            const saveBtn = document.getElementById('clientInteractionSaveBtn');
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Salvar Interação';
            }
        }
    }

    // Open custom project modal for specific client
    openClientProjectModal(cliente) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('clientProjectModal');
        if (!modal) {
            modal = this.createClientProjectModal(cliente);
            document.body.appendChild(modal);
        } else {
            // Update modal for current client
            this.updateClientProjectModal(modal, cliente);
        }
        
        // Show modal
        modal.classList.remove('hidden');
        
        // Focus on project name field
        setTimeout(() => {
            const nomeInput = modal.querySelector('#clientProjetoNome');
            if (nomeInput) nomeInput.focus();
        }, 100);
    }

    // Create the custom project modal
    createClientProjectModal(cliente) {
        const modal = document.createElement('div');
        modal.id = 'clientProjectModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4';
        
        // Generate suggested project name
        const currentDate = new Date().getFullYear();
        const suggestedName = `Sistema Fotovoltaico - ${cliente.nome} - ${currentDate}`;
        
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 class="text-2xl font-bold text-gray-900">Novo Projeto - ${cliente.nome}</h2>
                    <button onclick="clientesManager.closeClientProjectModal()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <form id="clientProjectForm" class="p-6">
                    <!-- Client Info Banner -->
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <i class="fas fa-solar-panel text-green-500 mr-2"></i>
                                <span class="text-sm text-green-700">Criando projeto para: <strong>${cliente.nome}</strong></span>
                            </div>
                            <div class="text-xs text-green-600">
                                ${cliente.email} ${cliente.telefone ? '• ' + cliente.telefone : ''}
                                ${cliente.consumo_mensal ? '• Consumo: ' + cliente.consumo_mensal + ' kWh/mês' : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Informações Básicas -->
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nome do Projeto *</label>
                                <input type="text" id="clientProjetoNome" required 
                                    value="${suggestedName}"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select id="clientProjetoStatus" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                    <option value="em_estudo">📋 Em Estudo</option>
                                    <option value="proposta_enviada">📤 Proposta Enviada</option>
                                    <option value="aprovado">✅ Aprovado</option>
                                    <option value="em_instalacao">🔧 Em Instalação</option>
                                    <option value="concluido">🏁 Concluído</option>
                                    <option value="manutencao">⚙️ Manutenção</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                                <input type="text" id="clientProjetoResponsavel" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Nome do responsável técnico">
                            </div>
                        </div>
                    </div>

                    <!-- Dados Técnicos -->
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">⚡ Dados Técnicos</h3>
                        
                        <!-- Localização e Concessionária -->
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <div class="text-xs text-blue-600 mb-2">
                                <i class="fas fa-info-circle mr-1"></i>
                                Dados preenchidos automaticamente do cadastro do cliente (editável)
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-blue-700 mb-2">Cidade</label>
                                    <input type="text" id="clientProjetoCidade" 
                                        class="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: São Paulo">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-blue-700 mb-2">Estado (UF)</label>
                                    <input type="text" id="clientProjetoEstado" maxlength="2"
                                        class="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: SP" style="text-transform: uppercase;">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-blue-700 mb-2">Irradiação Solar (kWh/kWp/dia)</label>
                                    <input type="number" id="clientProjetoIrradiacao" step="0.1" min="3" max="7"
                                        class="w-full px-3 py-2 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: 5.2">
                                </div>
                            </div>
                        </div>

                        <!-- Concessionária e Tarifa -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Concessionária de Energia</label>
                                <select id="clientProjetoConcessionaria" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                    <option value="">Selecione a concessionária...</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tarifa kWh (R$ com impostos)</label>
                                <input type="number" id="clientProjetoTarifa" step="0.001"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Ex: 0.89">
                            </div>
                        </div>

                        <!-- Cálculos Técnicos -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Potência do Sistema (kWp) *</label>
                                <input type="number" id="clientProjetoPotencia" step="0.01"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Ex: 10.5">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Instalação</label>
                                <select id="clientProjetoTipoInstalacao" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                    <option value="telhado">🏠 Telhado</option>
                                    <option value="solo">🌱 Solo</option>
                                    <option value="carport">🚗 Carport</option>
                                </select>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Geração Estimada (kWh/mês)</label>
                                <input type="number" id="clientProjetoGeracao" step="0.01"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Calculado automaticamente" readonly>
                                <div class="text-xs text-gray-500 mt-1">Baseado na irradiação solar local</div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Economia Mensal (R$)</label>
                                <input type="number" id="clientProjetoEconomia" step="0.01"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Calculado automaticamente" readonly>
                                <div class="text-xs text-gray-500 mt-1">Baseado no consumo e geração</div>
                            </div>
                        </div>
                    </div>

                    <!-- Dados Financeiros -->
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">💰 Dados Financeiros</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Valor do Investimento (R$)</label>
                                <input type="number" id="clientProjetoValorInvestimento" step="0.01"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Ex: 45000.00">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Payback (meses)</label>
                                <input type="number" id="clientProjetoPayback" step="0.1"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Calculado automaticamente" readonly>
                                <div class="text-xs text-gray-500 mt-1">Investimento ÷ Economia mensal</div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento</label>
                                <select id="clientProjetoFormaPagamento" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                    <option value="a_vista">💰 À Vista</option>
                                    <option value="parcelado">💳 Parcelado</option>
                                    <option value="financiado">🏦 Financiado</option>
                                    <option value="leasing">📄 Leasing</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Lista de Materiais -->
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">🔧 Lista de Materiais</h3>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Materiais e Equipamentos</label>
                            <textarea id="clientProjetoMateriais" rows="6"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Liste todos os materiais necessários para o projeto:

Exemplo:
• 24x Painel Solar 550W Monocristalino
• 1x Inversor String 15kW Trifásico
• 48x Microinversor 550W
• 1x String Box DC 4 entradas
• 200m Cabo Solar 4mm² preto
• 200m Cabo Solar 4mm² vermelho
• 24x Conector MC4 macho/fêmea
• Estrutura de fixação para telha cerâmica
• Materiais elétricos diversos (disjuntores, DPS, etc.)
• Mão de obra especializada"></textarea>
                        </div>
                    </div>

                    <!-- Localização e Instalação -->
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">📍 Localização e Instalação</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Endereço de Instalação</label>
                                <textarea id="clientProjetoEndereco" rows="2"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Endereço completo da instalação...">${cliente.endereco || ''}</textarea>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Data Prevista de Instalação</label>
                                <input type="date" id="clientProjetoDataInstalacao" 
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                            </div>
                        </div>
                    </div>

                    <!-- Observações -->
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">📝 Observações e Detalhes</h3>
                        <textarea id="clientProjetoObservacoes" rows="4"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Observações técnicas, particularidades da instalação, requisitos especiais, etc."></textarea>
                    </div>

                    <!-- Buttons -->
                    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button type="button" onclick="clientesManager.closeClientProjectModal()" 
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="button" onclick="clientesManager.saveClientProject('${cliente.id}')" 
                            id="clientProjectSaveBtn"
                            class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <i class="fas fa-solar-panel mr-2"></i>
                            Criar Projeto
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        // Set current user as default responsible
        const currentUser = this.getCurrentUser();
        const responsavelInput = modal.querySelector('#clientProjetoResponsavel');
        if (responsavelInput && currentUser) {
            responsavelInput.value = currentUser.nome;
        }
        
        // Populate location data from client
        this.populateClientLocationData(modal, cliente);
        
        // Add event listeners for calculations
        this.addProjectCalculationListeners(modal);
        
        return modal;
    }

    // Populate client location data
    populateClientLocationData(modal, cliente) {
        // Extract city and state from client address or other fields
        let cidade = '';
        let estado = '';
        
        if (cliente.endereco) {
            // Try to extract city and state from address
            const enderecoParts = cliente.endereco.split(',');
            if (enderecoParts.length >= 2) {
                cidade = enderecoParts[enderecoParts.length - 2]?.trim() || '';
                estado = enderecoParts[enderecoParts.length - 1]?.trim() || '';
            }
        }
        
        // Set city and state (editable)
        modal.querySelector('#clientProjetoCidade').value = cidade || cliente.cidade || '';
        modal.querySelector('#clientProjetoEstado').value = (estado || cliente.estado || '').toUpperCase();
        
        // Set solar irradiation based on state (editable)
        const estadoCode = (estado || cliente.estado || '').toUpperCase();
        const irradiacao = IRRADIACAO_SOLAR_ESTADOS[estadoCode] || 5.2; // Default value
        modal.querySelector('#clientProjetoIrradiacao').value = irradiacao;
        
        // Populate concessionária select
        this.populateConcessionariaSelect(modal, estadoCode);
        
        // Add listener to update irradiation when state changes
        modal.querySelector('#clientProjetoEstado').addEventListener('input', (e) => {
            const newEstado = e.target.value.toUpperCase();
            const newIrradiacao = IRRADIACAO_SOLAR_ESTADOS[newEstado] || 5.2;
            modal.querySelector('#clientProjetoIrradiacao').value = newIrradiacao;
            
            // Update concessionárias list
            this.populateConcessionariaSelect(modal, newEstado);
            
            // Recalculate generation if power is set
            const potenciaInput = modal.querySelector('#clientProjetoPotencia');
            if (potenciaInput.value) {
                potenciaInput.dispatchEvent(new Event('input'));
            }
        });
    }

    // Populate concessionária select based on state
    populateConcessionariaSelect(modal, estado) {
        const select = modal.querySelector('#clientProjetoConcessionaria');
        select.innerHTML = '<option value="">Selecione a concessionária...</option>';
        
        // Add concessionárias for the specific state
        Object.entries(CONCESSIONARIAS).forEach(([nome, dados]) => {
            if (!estado || dados.estado === estado) {
                const option = document.createElement('option');
                option.value = nome;
                option.textContent = `${nome} (${dados.estado})`;
                option.dataset.tarifa = (dados.tarifa + dados.impostos).toFixed(3);
                select.appendChild(option);
            }
        });
        
        // If no state match, show all concessionárias
        if (select.options.length === 1) {
            Object.entries(CONCESSIONARIAS).forEach(([nome, dados]) => {
                const option = document.createElement('option');
                option.value = nome;
                option.textContent = `${nome} (${dados.estado})`;
                option.dataset.tarifa = (dados.tarifa + dados.impostos).toFixed(3);
                select.appendChild(option);
            });
        }
    }

    // Add calculation listeners for project fields
    addProjectCalculationListeners(modal) {
        const potenciaInput = modal.querySelector('#clientProjetoPotencia');
        const geracaoInput = modal.querySelector('#clientProjetoGeracao');
        const economiaInput = modal.querySelector('#clientProjetoEconomia');
        const valorInput = modal.querySelector('#clientProjetoValorInvestimento');
        const paybackInput = modal.querySelector('#clientProjetoPayback');
        const concessionariaSelect = modal.querySelector('#clientProjetoConcessionaria');
        const tarifaInput = modal.querySelector('#clientProjetoTarifa');
        const irradiacaoInput = modal.querySelector('#clientProjetoIrradiacao');
        
        // Calculate generation when power changes
        const calculateGeneration = () => {
            const potencia = parseFloat(potenciaInput.value) || 0;
            const irradiacao = parseFloat(irradiacaoInput.value) || 5.2;
            
            if (potencia > 0) {
                // Generation = Power × Solar irradiation × 30 days × 0.8 (efficiency factor)
                const geracao = potencia * irradiacao * 30 * 0.8;
                geracaoInput.value = Math.round(geracao);
                calculateEconomy();
            } else {
                geracaoInput.value = '';
                economiaInput.value = '';
            }
        };
        
        // Calculate economy when generation or tariff changes
        const calculateEconomy = () => {
            const geracao = parseFloat(geracaoInput.value) || 0;
            const tarifa = parseFloat(tarifaInput.value) || 0;
            
            if (geracao > 0 && tarifa > 0) {
                // Assume generation covers most of consumption (90% to account for minimum fee)
                const economia = geracao * tarifa * 0.9;
                economiaInput.value = economia.toFixed(2);
                calculatePayback();
            } else {
                economiaInput.value = '';
                paybackInput.value = '';
            }
        };
        
        // Calculate payback
        const calculatePayback = () => {
            const valor = parseFloat(valorInput.value) || 0;
            const economia = parseFloat(economiaInput.value) || 0;
            
            if (valor > 0 && economia > 0) {
                const payback = (valor / economia).toFixed(1);
                paybackInput.value = payback;
            } else {
                paybackInput.value = '';
            }
        };
        
        // Handle concessionária selection
        const handleConcessionariaChange = () => {
            const selectedOption = concessionariaSelect.selectedOptions[0];
            if (selectedOption && selectedOption.dataset.tarifa) {
                tarifaInput.value = selectedOption.dataset.tarifa;
                calculateEconomy();
            }
        };
        
        // Handle state change to update irradiation and concessionárias
        const estadoInput = modal.querySelector('#clientProjetoEstado');
        const handleEstadoChange = () => {
            const selectedEstado = estadoInput.value.toUpperCase();
            if (selectedEstado && IRRADIACAO_SOLAR_ESTADOS[selectedEstado]) {
                irradiacaoInput.value = IRRADIACAO_SOLAR_ESTADOS[selectedEstado];
                calculateGeneration(); // Recalculate when irradiation changes
            }
            // Update concessionárias based on selected state
            this.populateConcessionariaSelect(modal, selectedEstado);
        };

        // Add event listeners
        potenciaInput.addEventListener('input', calculateGeneration);
        irradiacaoInput.addEventListener('input', calculateGeneration);
        valorInput.addEventListener('input', calculatePayback);
        tarifaInput.addEventListener('input', calculateEconomy);
        concessionariaSelect.addEventListener('change', handleConcessionariaChange);
        estadoInput.addEventListener('input', handleEstadoChange);
        
        // Allow manual editing of generation and economy
        geracaoInput.addEventListener('input', calculateEconomy);
        geracaoInput.removeAttribute('readonly');
        economiaInput.addEventListener('input', calculatePayback);
        economiaInput.removeAttribute('readonly');
    }

    // Update modal for different client
    updateClientProjectModal(modal, cliente) {
        modal.querySelector('h2').textContent = `Novo Projeto - ${cliente.nome}`;
        modal.querySelector('.text-green-700 strong').textContent = cliente.nome;
        modal.querySelector('.text-xs.text-green-600').textContent = 
            `${cliente.email} ${cliente.telefone ? '• ' + cliente.telefone : ''}${cliente.consumo_mensal ? '• Consumo: ' + cliente.consumo_mensal + ' kWh/mês' : ''}`;
        
        const currentDate = new Date().getFullYear();
        const suggestedName = `Sistema Fotovoltaico - ${cliente.nome} - ${currentDate}`;
        modal.querySelector('#clientProjetoNome').value = suggestedName;
        modal.querySelector('#clientProjetoEndereco').value = cliente.endereco || '';
        
        // Update location data
        this.populateClientLocationData(modal, cliente);
        
        modal.querySelector('#clientProjectSaveBtn').setAttribute('onclick', 
            `clientesManager.saveClientProject('${cliente.id}')`);
    }

    // Close client project modal
    closeClientProjectModal() {
        const modal = document.getElementById('clientProjectModal');
        if (modal) {
            modal.classList.add('hidden');
            // Reset form
            modal.querySelector('#clientProjectForm').reset();
            
            // Set defaults again
            const currentUser = this.getCurrentUser();
            const responsavelInput = modal.querySelector('#clientProjetoResponsavel');
            if (responsavelInput && currentUser) {
                responsavelInput.value = currentUser.nome;
            }
        }
    }

    // Save client project
    async saveClientProject(clienteId) {
        try {
            const form = document.getElementById('clientProjectForm');
            const saveBtn = document.getElementById('clientProjectSaveBtn');
            
            // Validate required fields
            const nome = document.getElementById('clientProjetoNome').value.trim();
            
            if (!nome) {
                this.showNotification('O nome do projeto é obrigatório', 'error');
                return;
            }
            
            // Disable save button
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Criando...';
            
            // Prepare project data
            const projeto = {
                nome_projeto: nome,
                cliente_id: clienteId,
                status: document.getElementById('clientProjetoStatus').value,
                responsavel: document.getElementById('clientProjetoResponsavel').value || null,
                
                // Location data
                cidade: document.getElementById('clientProjetoCidade').value || null,
                estado: document.getElementById('clientProjetoEstado').value || null,
                irradiacao_solar: document.getElementById('clientProjetoIrradiacao').value || null,
                concessionaria: document.getElementById('clientProjetoConcessionaria').value || null,
                tarifa_kwh: parseFloat(document.getElementById('clientProjetoTarifa').value) || null,
                
                // Technical data
                potencia_kwp: parseFloat(document.getElementById('clientProjetoPotencia').value) || null,
                geracao_estimada: parseFloat(document.getElementById('clientProjetoGeracao').value) || null,
                economia_mensal: parseFloat(document.getElementById('clientProjetoEconomia').value) || null,
                tipo_instalacao: document.getElementById('clientProjetoTipoInstalacao').value,
                
                // Financial data
                valor_investimento: parseFloat(document.getElementById('clientProjetoValorInvestimento').value) || null,
                payback_meses: parseFloat(document.getElementById('clientProjetoPayback').value) || null,
                forma_pagamento: document.getElementById('clientProjetoFormaPagamento').value,
                
                // Materials and installation
                lista_materiais: document.getElementById('clientProjetoMateriais').value || null,
                endereco_instalacao: document.getElementById('clientProjetoEndereco').value || null,
                data_prevista_instalacao: document.getElementById('clientProjetoDataInstalacao').value || null,
                observacoes: document.getElementById('clientProjetoObservacoes').value || null,
                
                // Metadata
                data_criacao: new Date().toISOString(),
                usuario_criacao: this.getCurrentUser()?.nome || 'Usuário'
            };
            
            // Save to API
            const result = await api.createProjeto(projeto);
            
            if (result) {
                this.closeClientProjectModal();
                this.showNotification('Projeto criado com sucesso!', 'success');
                
                // Refresh the client view to show new project
                setTimeout(() => {
                    this.viewCliente(clienteId);
                }, 500);
                
                // Ask if user wants to go to projects to create a proposal
                setTimeout(() => {
                    if (confirm('Projeto criado! Deseja ir para a página de Projetos para gerar uma proposta comercial?')) {
                        this.redirectToProjects(clienteId);
                    }
                }, 1000);
            }
            
        } catch (error) {
            console.error('Erro ao salvar projeto:', error);
            this.showNotification('Erro ao criar projeto: ' + error.message, 'error');
        } finally {
            // Re-enable save button
            const saveBtn = document.getElementById('clientProjectSaveBtn');
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="fas fa-solar-panel mr-2"></i>Criar Projeto';
            }
        }
    }
}

// Global clientes manager instance
window.clientesManager = new ClientesManager();