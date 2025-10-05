// Sistema de Configurações ZORIX CRM
class ConfiguracoesSistema {
    constructor() {
        this.usuarios = JSON.parse(localStorage.getItem('zorix_usuarios')) || [];
        this.vendedores = JSON.parse(localStorage.getItem('zorix_vendedores')) || [];
        this.ajudasCusto = JSON.parse(localStorage.getItem('zorix_ajudas_custo')) || [];
        this.init();
    }

    init() {
        this.initEventListeners();
        this.initTabSystem();
        console.log('⚙️ Sistema de Configurações inicializado');
    }

    initEventListeners() {
        // Botão para abrir configurações
        document.getElementById('configuracoesBtn')?.addEventListener('click', () => {
            this.abrirModal();
        });

        // Botão para fechar configurações
        document.getElementById('fecharConfiguracoesModal')?.addEventListener('click', () => {
            this.fecharModal();
        });

        // Formulário de usuários
        document.getElementById('formNovoUsuario')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.cadastrarUsuario();
        });

        // Formulário de vendedores
        document.getElementById('formNovoVendedor')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.cadastrarVendedor();
        });

        // Fechar modal ao clicar fora
        document.getElementById('configuracoesModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'configuracoesModal') {
                this.fecharModal();
            }
        });
    }

    initTabSystem() {
        const tabButtons = document.querySelectorAll('.config-tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                this.mudarAba(tabId);
            });
        });
    }

    mudarAba(tabId) {
        // Remover active de todas as abas
        document.querySelectorAll('.config-tab-btn').forEach(btn => {
            btn.classList.remove('border-blue-500', 'text-blue-600');
            btn.classList.add('border-transparent', 'text-gray-500');
        });

        // Ocultar todo conteúdo
        document.querySelectorAll('.config-tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // Ativar aba selecionada
        const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeButton) {
            activeButton.classList.add('border-blue-500', 'text-blue-600');
            activeButton.classList.remove('border-transparent', 'text-gray-500');
        }

        // Mostrar conteúdo da aba
        const activeContent = document.getElementById(`tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }

        // Carregar dados da aba
        if (tabId === 'usuarios') {
            this.carregarListaUsuarios();
        } else if (tabId === 'vendedores') {
            this.carregarListaVendedores();
        }
    }

    abrirModal() {
        document.getElementById('configuracoesModal').classList.remove('hidden');
        this.mudarAba('usuarios'); // Começar na aba usuários
    }

    fecharModal() {
        document.getElementById('configuracoesModal').classList.add('hidden');
    }

    // SISTEMA DE USUÁRIOS
    cadastrarUsuario() {
        const nome = document.getElementById('nomeUsuario').value.trim();
        const email = document.getElementById('emailUsuario').value.trim();
        const senha = document.getElementById('senhaUsuario').value;
        const tipo = document.getElementById('tipoUsuario').value;

        if (!nome || !email || !senha || !tipo) {
            app.showNotification('Todos os campos são obrigatórios', 'error');
            return;
        }

        // Verificar se email já existe
        if (this.usuarios.find(u => u.email === email)) {
            app.showNotification('Este email já está cadastrado', 'error');
            return;
        }

        const novoUsuario = {
            id: this.generateId(),
            nome,
            email,
            senha: this.hashPassword(senha),
            tipo,
            ativo: true,
            data_cadastro: new Date().toISOString(),
            ultimo_login: null
        };

        this.usuarios.push(novoUsuario);
        this.saveUsuarios();
        
        app.showNotification('Usuário cadastrado com sucesso!', 'success');
        document.getElementById('formNovoUsuario').reset();
        this.carregarListaUsuarios();
    }

    carregarListaUsuarios() {
        const lista = document.getElementById('listaUsuarios');
        if (!lista) return;

        if (this.usuarios.length === 0) {
            lista.innerHTML = '<p class="text-gray-500 text-center py-4">Nenhum usuário cadastrado</p>';
            return;
        }

        lista.innerHTML = this.usuarios.map(usuario => `
            <div class="border-b border-gray-200 pb-3 mb-3 last:border-b-0">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-medium text-gray-900">${usuario.nome}</h4>
                        <p class="text-sm text-gray-600">${usuario.email}</p>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${usuario.tipo === 'administrador' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                            ${usuario.tipo === 'administrador' ? 'Administrador' : 'Colaborador'}
                        </span>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="configSistema.toggleUsuarioAtivo('${usuario.id}')" 
                            class="text-sm px-3 py-1 rounded ${usuario.ativo ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}">
                            ${usuario.ativo ? 'Desativar' : 'Ativar'}
                        </button>
                        <button onclick="configSistema.excluirUsuario('${usuario.id}')" 
                            class="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    toggleUsuarioAtivo(id) {
        const usuario = this.usuarios.find(u => u.id === id);
        if (usuario) {
            usuario.ativo = !usuario.ativo;
            this.saveUsuarios();
            app.showNotification(`Usuário ${usuario.ativo ? 'ativado' : 'desativado'} com sucesso`, 'success');
            this.carregarListaUsuarios();
        }
    }

    excluirUsuario(id) {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            this.usuarios = this.usuarios.filter(u => u.id !== id);
            this.saveUsuarios();
            app.showNotification('Usuário excluído com sucesso', 'success');
            this.carregarListaUsuarios();
        }
    }

    // SISTEMA DE VENDEDORES
    cadastrarVendedor() {
        const nome = document.getElementById('nomeVendedor').value.trim();
        const email = document.getElementById('emailVendedor').value.trim();
        const telefone = document.getElementById('telefoneVendedor').value.trim();
        const comissao = parseFloat(document.getElementById('comissaoVendedor').value);

        if (!nome || !email || !telefone || isNaN(comissao) || comissao < 0) {
            app.showNotification('Todos os campos são obrigatórios e comissão deve ser válida', 'error');
            return;
        }

        // Verificar se email já existe
        if (this.vendedores.find(v => v.email === email)) {
            app.showNotification('Este email já está cadastrado para outro vendedor', 'error');
            return;
        }

        const novoVendedor = {
            id: this.generateId(),
            nome,
            email,
            telefone,
            comissao_percentual: comissao,
            ativo: true,
            data_cadastro: new Date().toISOString(),
            total_vendas: 0,
            total_comissoes: 0,
            projetos_vendidos: []
        };

        this.vendedores.push(novoVendedor);
        this.saveVendedores();
        
        app.showNotification('Vendedor cadastrado com sucesso!', 'success');
        document.getElementById('formNovoVendedor').reset();
        this.carregarListaVendedores();
    }

    carregarListaVendedores() {
        const lista = document.getElementById('listaVendedores');
        if (!lista) return;

        if (this.vendedores.length === 0) {
            lista.innerHTML = '<p class="text-gray-500 text-center py-4">Nenhum vendedor cadastrado</p>';
            return;
        }

        lista.innerHTML = this.vendedores.map(vendedor => `
            <div class="border-b border-gray-200 pb-3 mb-3 last:border-b-0">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-medium text-gray-900">${vendedor.nome}</h4>
                        <p class="text-sm text-gray-600">${vendedor.email}</p>
                        <p class="text-sm text-gray-600">${vendedor.telefone}</p>
                        <div class="flex items-center space-x-4 mt-1">
                            <span class="text-xs text-blue-600 font-medium">Comissão: ${vendedor.comissao_percentual}%</span>
                            <span class="text-xs text-green-600">Vendas: ${window.formatCurrencyBR(vendedor.total_vendas)}</span>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="configSistema.verRelatorioVendedor('${vendedor.id}')" 
                            class="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                            Relatório
                        </button>
                        <button onclick="configSistema.editarVendedor('${vendedor.id}')" 
                            class="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                            Editar
                        </button>
                        <button onclick="configSistema.excluirVendedor('${vendedor.id}')" 
                            class="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    editarVendedor(id) {
        const vendedor = this.vendedores.find(v => v.id === id);
        if (!vendedor) return;

        const novoNome = prompt('Nome do vendedor:', vendedor.nome);
        if (novoNome && novoNome.trim()) {
            vendedor.nome = novoNome.trim();
        }

        const novoEmail = prompt('Email do vendedor:', vendedor.email);
        if (novoEmail && novoEmail.trim()) {
            vendedor.email = novoEmail.trim();
        }

        const novoTelefone = prompt('Telefone do vendedor:', vendedor.telefone);
        if (novoTelefone && novoTelefone.trim()) {
            vendedor.telefone = novoTelefone.trim();
        }

        const novaComissao = prompt('Comissão (%):', vendedor.comissao_percentual);
        if (novaComissao && !isNaN(parseFloat(novaComissao))) {
            vendedor.comissao_percentual = parseFloat(novaComissao);
        }

        this.saveVendedores();
        app.showNotification('Vendedor atualizado com sucesso!', 'success');
        this.carregarListaVendedores();
    }

    excluirVendedor(id) {
        if (confirm('Tem certeza que deseja excluir este vendedor?')) {
            this.vendedores = this.vendedores.filter(v => v.id !== id);
            this.saveVendedores();
            app.showNotification('Vendedor excluído com sucesso', 'success');
            this.carregarListaVendedores();
        }
    }

    verRelatorioVendedor(id) {
        const vendedor = this.vendedores.find(v => v.id === id);
        if (!vendedor) return;

        // Calcular estatísticas do vendedor
        const projetos = JSON.parse(localStorage.getItem('zorix:projetos')) || [];
        const projetosVendedor = projetos.filter(p => p.vendedor_id === id);
        const ajudasCusto = this.ajudasCusto.filter(a => a.vendedor_id === id);
        
        const totalAjudas = ajudasCusto.reduce((sum, ajuda) => sum + ajuda.valor, 0);
        const totalVendas = projetosVendedor.reduce((sum, proj) => sum + (proj.valor_total || 0), 0);
        const totalComissoes = totalVendas * (vendedor.comissao_percentual / 100);

        const relatorio = `
RELATÓRIO COMPLETO DO VENDEDOR
================================

👤 DADOS PESSOAIS
Nome: ${vendedor.nome}
Email: ${vendedor.email}
Telefone: ${vendedor.telefone}
Comissão: ${vendedor.comissao_percentual}%
Status: ${vendedor.ativo ? 'Ativo' : 'Inativo'}
Cadastrado em: ${new Date(vendedor.data_cadastro).toLocaleDateString('pt-BR')}

📊 ESTATÍSTICAS DE VENDAS
Projetos Vendidos: ${projetosVendedor.length}
Valor Total em Vendas: ${window.formatCurrencyBR(totalVendas)}
Comissões Geradas: ${window.formatCurrencyBR(totalComissoes)}
Ticket Médio: ${window.formatCurrencyBR(totalVendas / (projetosVendedor.length || 1))}

💰 AJUDAS DE CUSTO
Total de Ajudas: ${ajudasCusto.length}
Valor Total: ${window.formatCurrencyBR(totalAjudas)}

🎯 SALDO FINAL
Comissões: ${window.formatCurrencyBR(totalComissoes)}
Ajudas Recebidas: ${window.formatCurrencyBR(totalAjudas)}
Saldo Líquido: ${window.formatCurrencyBR(totalComissoes - totalAjudas)}

📋 PROJETOS DETALHADOS
${projetosVendedor.map((proj, i) => `
${i + 1}. ${proj.nome_projeto || 'Projeto ' + proj.id}
   Cliente: ${proj.cliente_nome || 'N/A'}
   Valor: ${window.formatCurrencyBR(proj.valor_total || 0)}
   Status: ${proj.status || 'N/A'}
   Data: ${proj.data_criacao ? new Date(proj.data_criacao).toLocaleDateString('pt-BR') : 'N/A'}
`).join('')}
        `;

        // Criar modal para o relatório
        const modalRelatorio = document.createElement('div');
        modalRelatorio.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
        modalRelatorio.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-90vh overflow-y-auto">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-bold text-gray-900">Relatório - ${vendedor.nome}</h3>
                        <button class="text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.parentElement.parentElement.remove()">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <pre class="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap font-mono overflow-x-auto">${relatorio}</pre>
                    <div class="mt-4 flex justify-end space-x-2">
                        <button onclick="navigator.clipboard.writeText(\`${relatorio.replace(/`/g, '\\`')}\`); app.showNotification('Relatório copiado!', 'success')" 
                            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Copiar Relatório
                        </button>
                        <button onclick="this.parentElement.parentElement.parentElement.parentElement.remove()" 
                            class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalRelatorio);
    }

    // SISTEMA DE AJUDAS DE CUSTO
    adicionarAjudaCusto(vendedor_id, valor, descricao) {
        const ajuda = {
            id: this.generateId(),
            vendedor_id,
            valor,
            descricao,
            data_ajuda: new Date().toISOString(),
            usuario_responsavel: auth.getCurrentUser()?.nome || 'Sistema'
        };

        this.ajudasCusto.push(ajuda);
        this.saveAjudasCusto();
        
        return ajuda;
    }

    getAjudasCustoVendedor(vendedor_id) {
        return this.ajudasCusto.filter(a => a.vendedor_id === vendedor_id);
    }

    getTotalAjudasVendedor(vendedor_id) {
        return this.getAjudasCustoVendedor(vendedor_id)
            .reduce((total, ajuda) => total + ajuda.valor, 0);
    }

    // MÉTODOS PARA INTEGRAÇÃO COM OUTROS MÓDULOS
    getVendedores() {
        return this.vendedores.filter(v => v.ativo);
    }

    getVendedorById(id) {
        return this.vendedores.find(v => v.id === id);
    }

    getUsuarios() {
        return this.usuarios.filter(u => u.ativo);
    }

    getUsuarioById(id) {
        return this.usuarios.find(u => u.id === id);
    }

    // UTILITÁRIOS
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    hashPassword(password) {
        // Implementação simples de hash - em produção usar bcrypt ou similar
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }

    // PERSISTÊNCIA
    saveUsuarios() {
        localStorage.setItem('zorix_usuarios', JSON.stringify(this.usuarios));
    }

    saveVendedores() {
        localStorage.setItem('zorix_vendedores', JSON.stringify(this.vendedores));
    }

    saveAjudasCusto() {
        localStorage.setItem('zorix_ajudas_custo', JSON.stringify(this.ajudasCusto));
    }
}

// Inicializar sistema
const configSistema = new ConfiguracoesSistema();

// Exportar para uso global
window.configSistema = configSistema;

console.log('✅ Sistema de Configurações carregado com sucesso!');