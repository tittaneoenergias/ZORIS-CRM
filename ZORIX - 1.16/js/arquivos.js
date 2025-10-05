// Arquivos Management for LURIX CRM
class ArquivosManager {
    constructor() {
        this.currentArquivos = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.searchTerm = '';
        this.viewMode = 'grid'; // 'grid' or 'list'
    }

    async loadArquivos() {
        const content = `
            <div class="fade-in">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">Arquivos</h1>
                        <p class="text-gray-600 mt-2">Gerencie documentos e arquivos do sistema</p>
                    </div>
                    <button id="uploadArquivoBtn" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center">
                        <i class="fas fa-upload mr-2"></i>
                        Upload de Arquivo
                    </button>
                </div>

                <!-- Filters and Controls -->
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div class="flex flex-col md:flex-row gap-4 flex-1">
                            <div class="flex-1">
                                <input type="text" id="searchArquivos" placeholder="Buscar arquivos..." 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <select id="filterTipo" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Todos os tipos</option>
                                    <option value="fatura_energia">Fatura de Energia</option>
                                    <option value="projeto_pdf">Projeto PDF</option>
                                    <option value="projeto_dwg">Projeto DWG</option>
                                    <option value="proposta">Proposta</option>
                                    <option value="contrato">Contrato</option>
                                    <option value="documento_concessionaria">Documento Concessionária</option>
                                    <option value="foto_local">Foto do Local</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </div>
                            <div>
                                <select id="filterCliente" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Todos os clientes</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-2">
                            <button id="viewModeGrid" class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
                                <i class="fas fa-th text-gray-600"></i>
                            </button>
                            <button id="viewModeList" class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
                                <i class="fas fa-list text-gray-600"></i>
                            </button>
                            <button id="clearFilters" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200">
                                Limpar
                            </button>
                        </div>
                    </div>
                </div>

                <!-- File Storage Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div class="flex items-center">
                            <div class="p-3 bg-blue-100 rounded-lg mr-4">
                                <i class="fas fa-file text-blue-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm font-medium">Total de Arquivos</p>
                                <p class="text-2xl font-bold text-gray-900" id="totalArquivos">-</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div class="flex items-center">
                            <div class="p-3 bg-green-100 rounded-lg mr-4">
                                <i class="fas fa-hdd text-green-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm font-medium">Espaço Utilizado</p>
                                <p class="text-2xl font-bold text-gray-900" id="espacoUtilizado">-</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <div class="flex items-center">
                            <div class="p-3 bg-purple-100 rounded-lg mr-4">
                                <i class="fas fa-clock text-purple-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm font-medium">Uploads Recentes</p>
                                <p class="text-2xl font-bold text-gray-900" id="uploadsRecentes">-</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Files Grid/List -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div class="p-6 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold text-gray-900">Arquivos</h3>
                            <div class="text-sm text-gray-500">
                                <span id="showingFiles">-</span> arquivos
                            </div>
                        </div>
                    </div>
                    
                    <div id="filesContainer" class="p-6">
                        <!-- Files will be loaded here -->
                    </div>
                    
                    <!-- Pagination -->
                    <div class="px-6 py-4 border-t border-gray-200">
                        <div class="flex items-center justify-center">
                            <div class="flex items-center space-x-2" id="pagination">
                                <!-- Pagination buttons will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Upload Modal -->
            <div id="uploadModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <h2 class="text-2xl font-bold text-gray-900">Upload de Arquivo</h2>
                        <button id="closeUploadModal" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <form id="uploadForm" class="p-6">
                        <!-- File Upload Area -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Arquivo</label>
                            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                                <input type="file" id="fileInput" multiple class="hidden" 
                                    accept=".pdf,.dwg,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt">
                                <div id="dropZone" class="cursor-pointer">
                                    <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                                    <p class="text-gray-600 mb-2">Clique para selecionar arquivos ou arraste-os aqui</p>
                                    <p class="text-sm text-gray-500">PDF, DWG, JPG, PNG, DOC, XLS (máx. 10MB cada)</p>
                                </div>
                                <div id="selectedFiles" class="mt-4 space-y-2 hidden">
                                    <!-- Selected files will appear here -->
                                </div>
                            </div>
                        </div>

                        <!-- File Details -->
                        <div class="mb-6">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Detalhes do Arquivo</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                                    <select id="uploadCliente" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Selecione um cliente...</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Projeto (Opcional)</label>
                                    <select id="uploadProjeto" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Selecione um projeto...</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Arquivo</label>
                                    <select id="uploadTipo" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Selecione o tipo...</option>
                                        <option value="fatura_energia">Fatura de Energia</option>
                                        <option value="projeto_pdf">Projeto PDF</option>
                                        <option value="projeto_dwg">Projeto DWG</option>
                                        <option value="proposta">Proposta</option>
                                        <option value="contrato">Contrato</option>
                                        <option value="documento_concessionaria">Documento Concessionária</option>
                                        <option value="foto_local">Foto do Local</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>
                                
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                                    <textarea id="uploadDescricao" rows="3" 
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Descrição do arquivo..."></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Upload Progress -->
                        <div id="uploadProgress" class="mb-6 hidden">
                            <div class="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Enviando arquivos...</span>
                                <span id="progressPercent">0%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div id="progressBar" class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                            </div>
                        </div>

                        <!-- Modal Footer -->
                        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button type="button" id="cancelUpload" 
                                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200">
                                Cancelar
                            </button>
                            <button type="submit" 
                                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                                Fazer Upload
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- File Preview Modal -->
            <div id="previewModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                    <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                        <h2 id="previewTitle" class="text-xl font-bold text-gray-900">Visualização do Arquivo</h2>
                        <button id="closePreviewModal" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div id="previewContent" class="p-6 max-h-[80vh] overflow-y-auto">
                        <!-- Preview content will be loaded here -->
                    </div>
                </div>
            </div>
        `;

        document.getElementById('pageContent').innerHTML = content;
        this.initializeEventListeners();
        await this.loadClientesAndProjetos();
        await this.loadArquivosData();
    }

    initializeEventListeners() {
        // Upload button
        document.getElementById('uploadArquivoBtn').addEventListener('click', () => {
            this.openUploadModal();
        });

        // Search and filters
        document.getElementById('searchArquivos').addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.currentPage = 1;
            this.loadArquivosData();
        });

        ['filterTipo', 'filterCliente'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.currentPage = 1;
                this.loadArquivosData();
            });
        });

        document.getElementById('clearFilters').addEventListener('click', () => {
            document.getElementById('searchArquivos').value = '';
            document.getElementById('filterTipo').value = '';
            document.getElementById('filterCliente').value = '';
            this.searchTerm = '';
            this.currentPage = 1;
            this.loadArquivosData();
        });

        // View mode buttons
        document.getElementById('viewModeGrid').addEventListener('click', () => {
            this.viewMode = 'grid';
            this.updateViewModeButtons();
            this.renderArquivos();
        });

        document.getElementById('viewModeList').addEventListener('click', () => {
            this.viewMode = 'list';
            this.updateViewModeButtons();
            this.renderArquivos();
        });

        // Upload modal
        ['closeUploadModal', 'cancelUpload'].forEach(id => {
            document.getElementById(id).addEventListener('click', () => {
                this.closeUploadModal();
            });
        });

        // File input and drop zone
        document.getElementById('dropZone').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileSelection(e.target.files);
        });

        // Drag and drop
        const dropZone = document.getElementById('dropZone');
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-blue-400', 'bg-blue-50');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-blue-400', 'bg-blue-50');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-blue-400', 'bg-blue-50');
            this.handleFileSelection(e.dataTransfer.files);
        });

        // Upload form
        document.getElementById('uploadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.uploadFiles();
        });

        // Preview modal
        document.getElementById('closePreviewModal').addEventListener('click', () => {
            this.closePreviewModal();
        });

        // Set initial view mode
        this.updateViewModeButtons();
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
            ['uploadCliente', 'filterCliente'].forEach(selectId => {
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
            const projetoSelect = document.getElementById('uploadProjeto');
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

    async loadArquivosData() {
        try {
            let arquivos = [];
            
            // Tentar buscar via API primeiro
            try {
                const response = await api.getArquivos(this.currentPage, this.itemsPerPage);
                arquivos = response.data || [];
            } catch (apiError) {
                console.log('API não disponível, buscando no localStorage...');
                // Fallback: buscar no localStorage usando o storage atual
                arquivos = window.storage ? window.storage.getItem('arquivos') || [] : [];
            }

            // Apply filters
            const tipoFilter = document.getElementById('filterTipo')?.value;
            const clienteFilter = document.getElementById('filterCliente')?.value;

            if (tipoFilter) {
                arquivos = arquivos.filter(a => a.tipo_arquivo === tipoFilter);
            }
            if (clienteFilter) {
                arquivos = arquivos.filter(a => a.cliente_id === clienteFilter);
            }
            if (this.searchTerm) {
                arquivos = arquivos.filter(a => 
                    a.nome_arquivo?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    a.descricao?.toLowerCase().includes(this.searchTerm.toLowerCase())
                );
            }

            // Sort by upload date (most recent first)
            arquivos.sort((a, b) => new Date(b.data_upload) - new Date(a.data_upload));

            this.currentArquivos = arquivos;
            this.renderArquivos();
            this.updatePagination();
            this.updateStats();

        } catch (error) {
            console.error('Erro ao carregar arquivos:', error);
        }
    }

    renderArquivos() {
        const container = document.getElementById('filesContainer');
        const showingFiles = document.getElementById('showingFiles');
        
        showingFiles.textContent = this.currentArquivos.length;

        if (this.currentArquivos.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-medium text-gray-900 mb-2">Nenhum arquivo encontrado</h3>
                    <p class="text-gray-500">Faça upload de seus primeiros arquivos</p>
                </div>
            `;
            return;
        }

        if (this.viewMode === 'grid') {
            this.renderGridView(container);
        } else {
            this.renderListView(container);
        }
    }

    renderGridView(container) {
        const gridHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                ${this.currentArquivos.map(arquivo => this.createFileCard(arquivo)).join('')}
            </div>
        `;
        container.innerHTML = gridHTML;
    }

    renderListView(container) {
        const listHTML = `
            <div class="space-y-2">
                ${this.currentArquivos.map(arquivo => this.createFileRow(arquivo)).join('')}
            </div>
        `;
        container.innerHTML = listHTML;
    }

    createFileCard(arquivo) {
        const iconClass = this.getFileIcon(arquivo.nome_arquivo);
        const iconColor = this.getFileIconColor(arquivo.tipo_arquivo);
        const cliente = this.clientes?.find(c => c.id === arquivo.cliente_id);
        
        return `
            <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200 cursor-pointer" 
                onclick="arquivosManager.previewFile('${arquivo.id}')">
                <div class="text-center mb-3">
                    <i class="fas fa-${iconClass} text-4xl ${iconColor}"></i>
                </div>
                <div class="text-center">
                    <p class="font-medium text-gray-900 text-sm truncate" title="${arquivo.nome_arquivo}">
                        ${arquivo.nome_arquivo}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                        ${this.formatFileSize(arquivo.tamanho)}
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                        ${api.formatDate(arquivo.data_upload)}
                    </p>
                    ${cliente ? `
                        <p class="text-xs text-blue-600 mt-1 truncate" title="${cliente.nome}">
                            ${cliente.nome}
                        </p>
                    ` : ''}
                </div>
                <div class="flex justify-center space-x-2 mt-3">
                    <button onclick="event.stopPropagation(); arquivosManager.viewFile('${arquivo.id}')" 
                        class="text-green-600 hover:text-green-900 text-sm" title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="event.stopPropagation(); arquivosManager.downloadFile('${arquivo.id}')" 
                        class="text-blue-600 hover:text-blue-900" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button onclick="event.stopPropagation(); arquivosManager.deleteFile('${arquivo.id}')" 
                        class="text-red-600 hover:text-red-900" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    createFileRow(arquivo) {
        const iconClass = this.getFileIcon(arquivo.nome_arquivo);
        const iconColor = this.getFileIconColor(arquivo.tipo_arquivo);
        const cliente = this.clientes?.find(c => c.id === arquivo.cliente_id);
        
        return `
            <div class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition duration-200">
                <div class="flex items-center space-x-4 flex-1 cursor-pointer" onclick="arquivosManager.previewFile('${arquivo.id}')">
                    <i class="fas fa-${iconClass} text-2xl ${iconColor}"></i>
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-gray-900 truncate">${arquivo.nome_arquivo}</p>
                        <div class="flex items-center space-x-4 text-sm text-gray-500">
                            <span>${this.formatTipoArquivo(arquivo.tipo_arquivo)}</span>
                            <span>${this.formatFileSize(arquivo.tamanho)}</span>
                            <span>${api.formatDate(arquivo.data_upload)}</span>
                            ${cliente ? `<span class="text-blue-600">${cliente.nome}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="flex space-x-2 ml-4">
                    <button onclick="arquivosManager.viewFile('${arquivo.id}')" 
                        class="text-green-600 hover:text-green-900 text-sm" title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="arquivosManager.downloadFile('${arquivo.id}')" 
                        class="text-blue-600 hover:text-blue-900" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button onclick="arquivosManager.deleteFile('${arquivo.id}')" 
                        class="text-red-600 hover:text-red-900" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    updateViewModeButtons() {
        const gridBtn = document.getElementById('viewModeGrid');
        const listBtn = document.getElementById('viewModeList');
        
        if (this.viewMode === 'grid') {
            gridBtn.classList.add('bg-blue-100', 'text-blue-600');
            listBtn.classList.remove('bg-blue-100', 'text-blue-600');
        } else {
            listBtn.classList.add('bg-blue-100', 'text-blue-600');
            gridBtn.classList.remove('bg-blue-100', 'text-blue-600');
        }
    }

    updateStats() {
        const totalArquivos = this.currentArquivos.length;
        const espacoUtilizado = this.currentArquivos.reduce((total, arquivo) => total + (arquivo.tamanho || 0), 0);
        
        // Count recent uploads (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const uploadsRecentes = this.currentArquivos.filter(arquivo => 
            new Date(arquivo.data_upload) >= sevenDaysAgo
        ).length;

        document.getElementById('totalArquivos').textContent = totalArquivos;
        document.getElementById('espacoUtilizado').textContent = this.formatFileSize(espacoUtilizado);
        document.getElementById('uploadsRecentes').textContent = uploadsRecentes;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.currentArquivos.length / this.itemsPerPage);
        const paginationContainer = document.getElementById('pagination');
        
        let paginationHTML = '';
        
        if (this.currentPage > 1) {
            paginationHTML += `<button onclick="arquivosManager.changePage(${this.currentPage - 1})" class="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">Anterior</button>`;
        }
        
        for (let i = Math.max(1, this.currentPage - 2); i <= Math.min(totalPages, this.currentPage + 2); i++) {
            const isActive = i === this.currentPage;
            paginationHTML += `
                <button onclick="arquivosManager.changePage(${i})" 
                    class="px-3 py-1 border rounded ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}">
                    ${i}
                </button>
            `;
        }
        
        if (this.currentPage < totalPages) {
            paginationHTML += `<button onclick="arquivosManager.changePage(${this.currentPage + 1})" class="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">Próxima</button>`;
        }
        
        paginationContainer.innerHTML = paginationHTML || '<span class="text-gray-500">Sem páginas</span>';
    }

    changePage(page) {
        this.currentPage = page;
        this.loadArquivosData();
    }

    openUploadModal() {
        document.getElementById('uploadModal').classList.remove('hidden');
        this.clearUploadForm();
    }

    closeUploadModal() {
        document.getElementById('uploadModal').classList.add('hidden');
        this.clearUploadForm();
    }

    clearUploadForm() {
        document.getElementById('uploadForm').reset();
        document.getElementById('selectedFiles').classList.add('hidden');
        document.getElementById('uploadProgress').classList.add('hidden');
    }

    handleFileSelection(files) {
        const selectedFilesContainer = document.getElementById('selectedFiles');
        selectedFilesContainer.innerHTML = '';
        selectedFilesContainer.classList.remove('hidden');

        Array.from(files).forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
            fileElement.innerHTML = `
                <div class="flex items-center space-x-3">
                    <i class="fas fa-${this.getFileIcon(file.name)} text-gray-400"></i>
                    <div>
                        <p class="text-sm font-medium text-gray-900">${file.name}</p>
                        <p class="text-xs text-gray-500">${this.formatFileSize(file.size)}</p>
                    </div>
                </div>
                <button type="button" onclick="this.parentElement.remove()" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-times"></i>
                </button>
            `;
            selectedFilesContainer.appendChild(fileElement);
        });
    }

    // Helper function to read file as base64
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

    async uploadFiles() {
        const files = document.getElementById('fileInput').files;
        if (files.length === 0) {
            this.showNotification('Selecione pelo menos um arquivo', 'error');
            return;
        }

        const clienteId = document.getElementById('uploadCliente').value;
        const projetoId = document.getElementById('uploadProjeto').value;
        const tipoArquivo = document.getElementById('uploadTipo').value;
        const descricao = document.getElementById('uploadDescricao').value;

        if (!clienteId || !tipoArquivo) {
            this.showNotification('Cliente e tipo de arquivo são obrigatórios', 'error');
            return;
        }

        // Show progress
        const progressContainer = document.getElementById('uploadProgress');
        const progressBar = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');
        
        progressContainer.classList.remove('hidden');

        try {
            const currentUser = auth.getCurrentUser();
            let completed = 0;

            for (let file of files) {
                // Read file content as base64
                const base64Content = await this.readFileAsBase64(file);
                
                // Simulate upload progress
                for (let i = 0; i <= 100; i += 10) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    const totalProgress = ((completed * 100 + i) / files.length);
                    progressBar.style.width = `${totalProgress}%`;
                    progressPercent.textContent = `${Math.round(totalProgress)}%`;
                }

                // Create arquivo record with base64 content
                const arquivoData = {
                    id: api.generateId(),
                    cliente_id: clienteId,
                    projeto_id: projetoId || null,
                    nome_arquivo: file.name,
                    tipo_arquivo: tipoArquivo,
                    tipo_mime: file.type,
                    descricao: descricao || `Upload de ${file.name}`,
                    tamanho: file.size,
                    conteudo_base64: base64Content,
                    data_upload: new Date().toISOString(),
                    usuario_upload: currentUser ? currentUser.nome : 'Sistema'
                };

                await api.createArquivo(arquivoData);
                completed++;
            }

            this.closeUploadModal();
            await this.loadArquivosData();
            this.showNotification(`${files.length} arquivo(s) enviado(s) com sucesso!`, 'success');

        } catch (error) {
            console.error('Erro no upload:', error);
            this.showNotification('Erro ao fazer upload dos arquivos', 'error');
        }
    }

    previewFile(arquivoId) {
        const arquivo = this.currentArquivos.find(a => a.id === arquivoId);
        if (!arquivo) return;

        const modal = document.getElementById('previewModal');
        const title = document.getElementById('previewTitle');
        const content = document.getElementById('previewContent');

        title.textContent = arquivo.nome_arquivo;

        const fileExtension = arquivo.nome_arquivo.split('.').pop().toLowerCase();
        const cliente = this.clientes?.find(c => c.id === arquivo.cliente_id);
        const projeto = this.projetos?.find(p => p.id === arquivo.projeto_id);

        let previewHTML = `
            <div class="mb-6">
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm font-medium text-gray-700">Cliente:</p>
                            <p class="text-gray-900">${cliente ? cliente.nome : 'N/A'}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-700">Projeto:</p>
                            <p class="text-gray-900">${projeto ? projeto.nome : 'N/A'}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-700">Tipo:</p>
                            <p class="text-gray-900">${this.formatTipoArquivo(arquivo.tipo_arquivo)}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-700">Tamanho:</p>
                            <p class="text-gray-900">${this.formatFileSize(arquivo.tamanho)}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-700">Data de Upload:</p>
                            <p class="text-gray-900">${api.formatDateTime(arquivo.data_upload)}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-gray-700">Enviado por:</p>
                            <p class="text-gray-900">${arquivo.usuario_upload || 'N/A'}</p>
                        </div>
                    </div>
                    ${arquivo.descricao ? `
                        <div class="mt-4">
                            <p class="text-sm font-medium text-gray-700">Descrição:</p>
                            <p class="text-gray-900">${arquivo.descricao}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Add file preview based on type
        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            previewHTML += `
                <div class="text-center">
                    <div class="inline-block bg-gray-100 p-4 rounded-lg">
                        <i class="fas fa-image text-6xl text-gray-400"></i>
                        <p class="text-gray-600 mt-2">Visualização de imagem não disponível no modo demo</p>
                    </div>
                </div>
            `;
        } else if (fileExtension === 'pdf') {
            previewHTML += `
                <div class="text-center">
                    <div class="inline-block bg-red-100 p-4 rounded-lg">
                        <i class="fas fa-file-pdf text-6xl text-red-500"></i>
                        <p class="text-gray-600 mt-2">Visualização de PDF não disponível no modo demo</p>
                    </div>
                </div>
            `;
        } else {
            previewHTML += `
                <div class="text-center">
                    <div class="inline-block bg-gray-100 p-4 rounded-lg">
                        <i class="fas fa-${this.getFileIcon(arquivo.nome_arquivo)} text-6xl text-gray-400"></i>
                        <p class="text-gray-600 mt-2">Visualização não disponível para este tipo de arquivo</p>
                    </div>
                </div>
            `;
        }

        content.innerHTML = previewHTML;
        modal.classList.remove('hidden');
    }

    closePreviewModal() {
        document.getElementById('previewModal').classList.add('hidden');
    }

    downloadFile(arquivoId) {
        console.log('🔍 Tentando download do arquivo:', arquivoId);
        const arquivo = this.currentArquivos.find(a => a.id === arquivoId);
        console.log('📄 Arquivo encontrado:', arquivo);
        if (!arquivo) {
            console.error('❌ Arquivo não encontrado na lista atual');
            this.showNotification('Arquivo não encontrado', 'error');
            return;
        }

        try {
            // Download real do arquivo
            if (arquivo.conteudo_base64) {
                // Converte base64 para blob
                const byteCharacters = atob(arquivo.conteudo_base64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: arquivo.tipo_mime || 'application/octet-stream' });
                
                // Cria link de download
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = arquivo.nome_arquivo;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                this.showNotification(`Download de "${arquivo.nome_arquivo}" concluído!`, 'success');
            } else {
                this.showNotification(`Arquivo "${arquivo.nome_arquivo}" não possui conteúdo para download`, 'warning');
            }
        } catch (error) {
            console.error('Erro no download:', error);
            this.showNotification(`Erro ao fazer download de "${arquivo.nome_arquivo}"`, 'error');
        }
    }

    // Nova função para visualizar arquivo
    viewFile(arquivoId) {
        console.log('👁️ Tentando visualizar arquivo:', arquivoId);
        const arquivo = this.currentArquivos.find(a => a.id === arquivoId);
        console.log('📄 Arquivo para visualização:', arquivo);
        if (!arquivo) {
            console.error('❌ Arquivo não encontrado para visualização');
            this.showNotification('Arquivo não encontrado', 'error');
            return;
        }

        try {
            if (arquivo.conteudo_base64) {
                // Verifica se é um tipo visualizável
                const tiposVisualizaveis = ['image/', 'application/pdf', 'text/'];
                const isViewable = tiposVisualizaveis.some(tipo => arquivo.tipo_mime?.startsWith(tipo));
                
                if (isViewable) {
                    // Converte base64 para blob
                    const byteCharacters = atob(arquivo.conteudo_base64);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: arquivo.tipo_mime });
                    
                    // Abre em nova aba
                    const url = URL.createObjectURL(blob);
                    const newWindow = window.open(url, '_blank');
                    
                    // Limpa a URL após um tempo
                    setTimeout(() => URL.revokeObjectURL(url), 10000);
                    
                    if (!newWindow) {
                        this.showNotification('Pop-up bloqueado! Permita pop-ups para visualizar arquivos', 'warning');
                    }
                } else {
                    this.showNotification(`Tipo de arquivo "${arquivo.tipo_mime}" não pode ser visualizado no navegador`, 'info');
                }
            } else {
                this.showNotification(`Arquivo "${arquivo.nome_arquivo}" não possui conteúdo para visualização`, 'warning');
            }
        } catch (error) {
            console.error('Erro na visualização:', error);
            this.showNotification(`Erro ao visualizar "${arquivo.nome_arquivo}"`, 'error');
        }
    }

    async deleteFile(arquivoId) {
        const arquivo = this.currentArquivos.find(a => a.id === arquivoId);
        if (!arquivo) return;

        if (confirm(`Tem certeza que deseja excluir "${arquivo.nome_arquivo}"?`)) {
            try {
                await api.deleteArquivo(arquivoId);
                await this.loadArquivosData();
                this.showNotification('Arquivo excluído com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao excluir arquivo:', error);
                this.showNotification('Erro ao excluir arquivo', 'error');
            }
        }
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
            'gif': 'file-image',
            'dwg': 'file-alt',
            'txt': 'file-alt'
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
            'documento_concessionaria': 'text-indigo-500',
            'foto_local': 'text-pink-500',
            'outro': 'text-gray-500'
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
        }, 4000);
    }
}

// Global arquivos manager instance
window.arquivosManager = new ArquivosManager();