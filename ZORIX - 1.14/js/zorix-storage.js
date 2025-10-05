/**
 * ZORIX CRM - Sistema de Persistência
 * Gerencia clientes e projetos com relacionamento correto
 * Versão: 3.0 - Reestruturado
 */

class ZorixStorage {
    constructor() {
        this.baseKeys = {
            clientes: 'zorix:clientes',
            projetos: 'zorix:projetos',
            propostas: 'zorix:propostas'
        };
        this.keys = { ...this.baseKeys };
        
        // Cache em memória para performance
        this.cache = {
            clientes: null,
            projetos: null,
            propostas: null
        };
        
        console.log('🗄️ ZORIX Storage inicializado');
        this.inicializar();
    }

    /**
     * Configura contexto do usuário para isolamento de dados
     */
    setUserContext(userId) {
        if (userId) {
            this.keys = {
                clientes: `zorix:user_${userId}:clientes`,
                projetos: `zorix:user_${userId}:projetos`,
                propostas: `zorix:user_${userId}:propostas`
            };
            console.log(`📁 ZORIX Storage configurado para usuário: ${userId}`);
            
            // Reinicializar cache para o novo usuário
            this.carregarCache();
            
            // Se não tem dados, criar dados iniciais limpos
            if (!this.cache.clientes || this.cache.clientes.length === 0) {
                console.log('🆕 Criando ambiente limpo para nova empresa...');
                this.cache.clientes = [];
                this.cache.projetos = [];
                this.cache.propostas = [];
                this.salvarTodos();
            }
        } else {
            this.keys = { ...this.baseKeys };
        }
    }

    /**
     * Inicializa o storage e carrega dados existentes
     */
    inicializar() {
        try {
            // Carrega dados do localStorage para cache
            this.carregarCache();
            
            // Se não existir dados, cria estrutura inicial
            if (!this.cache.clientes || this.cache.clientes.length === 0) {
                this.criarDadosIniciais();
            }
            
            console.log('✅ Storage inicializado com sucesso');
            console.log(`📊 Clientes: ${this.cache.clientes.length}, Projetos: ${this.cache.projetos.length}`);
            
        } catch (error) {
            console.error('❌ Erro ao inicializar storage:', error);
            this.criarDadosIniciais();
        }
    }

    /**
     * Carrega dados do localStorage para cache
     */
    carregarCache() {
        this.cache.clientes = this.getFromStorage(this.keys.clientes) || [];
        this.cache.projetos = this.getFromStorage(this.keys.projetos) || [];
        this.cache.propostas = this.getFromStorage(this.keys.propostas) || [];
    }

    /**
     * Cria dados iniciais de demonstração
     */
    criarDadosIniciais() {
        console.log('🔧 Criando dados iniciais...');
        
        const clientesIniciais = [];

        const projetosIniciais = [];

        // Salvar no cache e storage
        this.cache.clientes = [];
        this.cache.projetos = projetosIniciais;
        this.cache.propostas = [];

        this.salvarTodos();
        console.log('✅ Dados iniciais criados');
    }

    /**
     * CLIENTES - Operações CRUD
     */

    /**
     * Lista todos os clientes
     */
    listClientes() {
        return [...this.cache.clientes];
    }

    /**
     * Busca cliente por ID
     */
    getCliente(id) {
        return this.cache.clientes.find(cliente => cliente.id === id);
    }

    /**
     * Salva cliente (cria ou atualiza)
     */
    saveCliente(clienteData) {
        try {
            // Validação mínima
            if (!clienteData.nome || clienteData.nome.trim() === '') {
                throw new Error('Nome do cliente é obrigatório');
            }

            // Se não tem ID, gera um novo
            if (!clienteData.id) {
                clienteData.id = this.gerarId('cli');
                clienteData.createdAt = new Date().toISOString();
            }

            // Busca cliente existente
            const index = this.cache.clientes.findIndex(c => c.id === clienteData.id);
            
            const cliente = {
                ...clienteData,
                updatedAt: new Date().toISOString()
            };

            if (index >= 0) {
                // Atualizar existente
                this.cache.clientes[index] = cliente;
                console.log(`✅ Cliente atualizado: ${cliente.nome}`);
            } else {
                // Criar novo
                this.cache.clientes.push(cliente);
                console.log(`✅ Cliente criado: ${cliente.nome}`);
            }

            this.salvarClientes();
            return cliente;

        } catch (error) {
            console.error('❌ Erro ao salvar cliente:', error);
            throw error;
        }
    }

    /**
     * Remove cliente (e seus projetos)
     */
    deleteCliente(id) {
        try {
            // Remove cliente
            const clienteIndex = this.cache.clientes.findIndex(c => c.id === id);
            if (clienteIndex === -1) {
                throw new Error('Cliente não encontrado');
            }

            const cliente = this.cache.clientes[clienteIndex];
            this.cache.clientes.splice(clienteIndex, 1);

            // Remove projetos do cliente
            this.cache.projetos = this.cache.projetos.filter(p => p.clienteId !== id);

            this.salvarTodos();
            console.log(`✅ Cliente removido: ${cliente.nome}`);
            return true;

        } catch (error) {
            console.error('❌ Erro ao remover cliente:', error);
            throw error;
        }
    }

    /**
     * PROJETOS - Operações CRUD
     */

    /**
     * Lista projetos de um cliente
     */
    listProjetosByCliente(clienteId) {
        return this.cache.projetos.filter(projeto => projeto.clienteId === clienteId);
    }

    /**
     * Lista todos os projetos
     */
    listProjetos() {
        return [...this.cache.projetos];
    }

    /**
     * Busca projeto por ID
     */
    getProjeto(id) {
        return this.cache.projetos.find(projeto => projeto.id === id);
    }

    /**
     * Salva projeto (cria ou atualiza)
     */
    saveProjeto(projetoData) {
        try {
            // Validação mínima
            if (!projetoData.titulo || projetoData.titulo.trim() === '') {
                throw new Error('Título do projeto é obrigatório');
            }
            
            const potencia = projetoData.potenciaKWp || projetoData.kWp || 0;
            if (!potencia || potencia <= 0) {
                throw new Error('Potência do projeto é obrigatória');
            }

            if (!projetoData.clienteId) {
                throw new Error('Cliente do projeto é obrigatório');
            }

            // Validar se cliente existe
            const clienteExiste = this.cache.clientes.some(c => c.id === projetoData.clienteId);
            if (!clienteExiste) {
                throw new Error('Cliente não encontrado');
            }

            // Se não tem ID, gera um novo
            if (!projetoData.id) {
                projetoData.id = this.gerarId('proj');
                projetoData.createdAt = new Date().toISOString();
            }

            // Se não tem status, define como analise
            if (!projetoData.status) {
                projetoData.status = 'analise';
            }

            // Valida status
            const statusValidos = ['RASCUNHO', 'EM_ANDAMENTO', 'FINALIZADO', 'analise', 'perdida', 'ganha'];
            if (!statusValidos.includes(projetoData.status)) {
                throw new Error('Status inválido');
            }

            // Busca projeto existente
            const index = this.cache.projetos.findIndex(p => p.id === projetoData.id);
            
            const projeto = {
                ...projetoData,
                anexos: projetoData.anexos || [],
                updatedAt: new Date().toISOString()
            };

            if (index >= 0) {
                // Atualizar existente
                this.cache.projetos[index] = projeto;
                console.log(`✅ Projeto atualizado: ${projeto.titulo}`);
            } else {
                // Criar novo
                this.cache.projetos.push(projeto);
                console.log(`✅ Projeto criado: ${projeto.titulo}`);
            }

            this.salvarProjetos();
            return projeto;

        } catch (error) {
            console.error('❌ Erro ao salvar projeto:', error);
            throw error;
        }
    }

    /**
     * Remove projeto
     */
    deleteProjeto(id) {
        try {
            const projetoIndex = this.cache.projetos.findIndex(p => p.id === id);
            if (projetoIndex === -1) {
                throw new Error('Projeto não encontrado');
            }

            const projeto = this.cache.projetos[projetoIndex];
            this.cache.projetos.splice(projetoIndex, 1);

            // Remove propostas do projeto
            this.cache.propostas = this.cache.propostas.filter(p => p.projetoId !== id);

            this.salvarTodos();
            console.log(`✅ Projeto removido: ${projeto.titulo}`);
            return true;

        } catch (error) {
            console.error('❌ Erro ao remover projeto:', error);
            throw error;
        }
    }

    /**
     * PROPOSTAS - Operações CRUD
     */

    /**
     * Gera proposta para projeto finalizado
     */
    gerarProposta(projetoId) {
        try {
            const projeto = this.getProjeto(projetoId);
            if (!projeto) {
                throw new Error('Projeto não encontrado');
            }

            if (projeto.status !== 'FINALIZADO') {
                throw new Error('Projeto deve estar FINALIZADO para gerar proposta');
            }

            // Verifica se já existe proposta
            const propostaExistente = this.cache.propostas.find(p => p.projetoId === projetoId);
            if (propostaExistente) {
                return propostaExistente;
            }

            // Gera nova proposta
            const hoje = new Date();
            const ano = hoje.getFullYear();
            const mes = String(hoje.getMonth() + 1).padStart(2, '0');
            const dia = String(hoje.getDate()).padStart(2, '0');
            const seq = String(this.cache.propostas.length + 1).padStart(3, '0');

            const proposta = {
                id: this.gerarId('prop'),
                projetoId: projetoId,
                numero: `PROP-${ano}${mes}${dia}-${seq}`,
                data: hoje.toISOString(),
                valorTotal: projeto.potenciaKWp * 5000, // R$ 5.000 por kWp
                pdfUrl: null,
                createdAt: hoje.toISOString()
            };

            this.cache.propostas.push(proposta);
            this.salvarPropostas();

            console.log(`✅ Proposta gerada: ${proposta.numero}`);
            return proposta;

        } catch (error) {
            console.error('❌ Erro ao gerar proposta:', error);
            throw error;
        }
    }

    /**
     * Lista propostas de um projeto
     */
    getPropostaPorProjeto(projetoId) {
        return this.cache.propostas.find(p => p.projetoId === projetoId);
    }

    /**
     * UTILITÁRIOS
     */

    /**
     * Gera ID único
     */
    gerarId(prefixo = 'id') {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 5);
        return `${prefixo}_${timestamp}_${random}`;
    }

    /**
     * Salva dados no localStorage
     */
    salvarTodos() {
        this.salvarClientes();
        this.salvarProjetos();
        this.salvarPropostas();
    }

    salvarClientes() {
        this.setToStorage(this.keys.clientes, this.cache.clientes);
    }

    salvarProjetos() {
        this.setToStorage(this.keys.projetos, this.cache.projetos);
    }

    salvarPropostas() {
        this.setToStorage(this.keys.propostas, this.cache.propostas);
    }

    /**
     * Helpers para localStorage
     */
    getFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Erro ao ler ${key}:`, error);
            return null;
        }
    }

    setToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Erro ao salvar ${key}:`, error);
            throw error;
        }
    }

    /**
     * Limpa todos os dados (para testes)
     */
    limparTodos() {
        this.cache.clientes = [];
        this.cache.projetos = [];
        this.cache.propostas = [];
        
        localStorage.removeItem(this.keys.clientes);
        localStorage.removeItem(this.keys.projetos);
        localStorage.removeItem(this.keys.propostas);
        
        console.log('🗑️ Todos os dados foram limpos');
    }

    /**
     * RESET DE PORTFÓLIO
     */

    /**
     * Faz backup dos projetos e propostas antes de zerar
     */
    backupPortfolio() {
        try {
            const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            
            // Backup projetos
            const projetos = localStorage.getItem(this.keys.projetos);
            if (projetos) {
                localStorage.setItem(`zorix:projetos_backup_${timestamp}`, projetos);
            }
            
            // Backup propostas
            const propostas = localStorage.getItem(this.keys.propostas);
            if (propostas) {
                localStorage.setItem(`zorix:propostas_backup_${timestamp}`, propostas);
            }
            
            console.log(`✅ Backup criado: projetos_backup_${timestamp}, propostas_backup_${timestamp}`);
            return true;
            
        } catch (error) {
            console.error('Erro ao criar backup:', error);
            return false;
        }
    }

    /**
     * Zera apenas projetos e propostas (mantém clientes)
     */
    resetPortfolio(createBackup = true) {
        try {
            // Criar backup se solicitado
            if (createBackup) {
                this.backupPortfolio();
            }
            
            // Zerar projetos
            this.cache.projetos = [];
            localStorage.setItem(this.keys.projetos, '[]');
            
            // Zerar propostas
            this.cache.propostas = [];
            localStorage.setItem(this.keys.propostas, '[]');
            
            console.log('🗑️ Portfólio zerado com sucesso (clientes preservados)');
            return true;
            
        } catch (error) {
            console.error('Erro ao zerar portfólio:', error);
            return false;
        }
    }

    /**
     * DADOS EXTERNOS - IRRADIAÇÃO E TARIFAS
     */

    /**
     * Busca irradiação por cidade/estado
     */
    async getIrradiacao(cidade, estado) {
        try {
            // Tentar carregar arquivo local primeiro
            const response = await fetch('data/irradiacao.json');
            const data = await response.json();
            
            if (data.cidades[estado] && data.cidades[estado][cidade]) {
                return data.cidades[estado][cidade];
            }
            
            // Se não encontrar, usar média nacional
            return {
                jan: 4.5, fev: 4.6, mar: 4.3, abr: 4.0, mai: 3.5, jun: 3.2,
                jul: 3.4, ago: 4.0, set: 4.4, out: 4.7, nov: 4.8, dez: 4.6
            };
            
        } catch (error) {
            console.warn('Falha ao carregar irradiação, usando valores padrão:', error);
            return {
                jan: 4.5, fev: 4.6, mar: 4.3, abr: 4.0, mai: 3.5, jun: 3.2,
                jul: 3.4, ago: 4.0, set: 4.4, out: 4.7, nov: 4.8, dez: 4.6
            };
        }
    }

    /**
     * Busca tarifa por concessionária
     */
    async getTarifa(concessionaria, tipo = 'residencial') {
        try {
            // Tentar carregar arquivo local primeiro
            const response = await fetch('data/tarifas.json');
            const data = await response.json();
            
            if (data.concessionarias[concessionaria]) {
                const campo = `tarifa_${tipo}`;
                return data.concessionarias[concessionaria][campo] || data.default[campo];
            }
            
            // Se não encontrar, usar tarifa padrão
            return data.default[`tarifa_${tipo}`];
            
        } catch (error) {
            console.warn('Falha ao carregar tarifa, usando valores padrão:', error);
            // Valores padrão em caso de erro
            return tipo === 'residencial' ? 0.80 : tipo === 'comercial' ? 0.76 : 0.66;
        }
    }

    /**
     * Lista concessionárias disponíveis
     */
    async getConcessionarias() {
        try {
            const response = await fetch('data/tarifas.json');
            const data = await response.json();
            
            return Object.keys(data.concessionarias).sort();
            
        } catch (error) {
            console.warn('Falha ao carregar concessionárias, usando lista padrão:', error);
            return [
                'CPFL Energia', 'Enel São Paulo', 'Elektro', 'Enel Rio', 'Light',
                'Cemig', 'Copel', 'CEEE', 'Celesc', 'Energisa Bahia'
            ].sort();
        }
    }

    /**
     * Busca concessionária principal por estado
     */
    async getConcessionariaPorEstado(estado) {
        try {
            const response = await fetch('data/tarifas.json');
            const data = await response.json();
            
            // Mapeamento Estado → Concessionária Principal
            const mapeamentoEstados = {
                'AC': 'Energisa Acre',
                'AL': 'Ceal', 
                'AP': 'CEA',
                'AM': 'Energisa Amazonas',
                'BA': 'Energisa Bahia',
                'CE': 'Enel Ceará',
                'DF': 'Neoenergia Brasília',
                'ES': 'EDP Espírito Santo',
                'GO': 'Energisa Goiás',
                'MA': 'Cemar',
                'MT': 'Energisa Mato Grosso',
                'MS': 'Energisa Mato Grosso do Sul',
                'MG': 'Cemig',
                'PA': 'Equatorial Pará',
                'PB': 'Energisa Paraíba',
                'PR': 'Copel',
                'PE': 'Neoenergia Pernambuco',
                'PI': 'Cepisa',
                'RJ': 'Light',
                'RN': 'Cosern',
                'RS': 'CEEE',
                'RO': 'Energisa Rondônia',
                'RR': 'Boa Vista Energia',
                'SC': 'Celesc',
                'SP': 'Enel São Paulo',
                'SE': 'Energisa Sergipe',
                'TO': 'Energisa Tocantins'
            };
            
            const concessionaria = mapeamentoEstados[estado];
            
            // Verificar se existe nos dados
            if (concessionaria && data.concessionarias[concessionaria]) {
                return {
                    nome: concessionaria,
                    tarifa: data.concessionarias[concessionaria].tarifa_residencial
                };
            }
            
            // Fallback: primeira concessionária do estado
            for (const [nome, dados] of Object.entries(data.concessionarias)) {
                if (dados.estados && dados.estados.includes(estado)) {
                    return {
                        nome: nome,
                        tarifa: dados.tarifa_residencial
                    };
                }
            }
            
            // Fallback final: valores padrão
            return {
                nome: mapeamentoEstados[estado] || 'Concessionária Local',
                tarifa: 0.80
            };
            
        } catch (error) {
            console.warn('Erro ao buscar concessionária por estado:', error);
            return {
                nome: 'Concessionária Local',
                tarifa: 0.80
            };
        }
    }

    /**
     * CÁLCULOS AUTOMÁTICOS
     */

    /**
     * Calcula kWp total do sistema
     */
    calcularKWp(modulos) {
        try {
            if (!modulos || !Array.isArray(modulos)) return 0;
            
            return modulos.reduce((total, modulo) => {
                const quantidade = parseFloat(modulo.quantidade) || 0;
                const potencia = parseFloat(modulo.potencia_modulo_Wp) || 0;
                return total + (quantidade * potencia / 1000);
            }, 0);
            
        } catch (error) {
            console.error('Erro ao calcular kWp:', error);
            return 0;
        }
    }

    /**
     * Calcula geração mensal em kWh
     */
    calcularGeracaoMensal(kWp, irradiacao, fatorSombra = 0.82) {
        try {
            const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun',
                          'jul', 'ago', 'set', 'out', 'nov', 'dez'];
            
            const geracao = {};
            
            meses.forEach(mes => {
                const hsp = irradiacao[mes] || 4.0;
                const diasMes = mes === 'fev' ? 28 : 
                               ['abr', 'jun', 'set', 'nov'].includes(mes) ? 30 : 31;
                
                geracao[mes] = kWp * hsp * fatorSombra * diasMes;
            });
            
            return geracao;
            
        } catch (error) {
            console.error('Erro ao calcular geração mensal:', error);
            return {};
        }
    }

    /**
     * Calcula payback em anos
     */
    calcularPayback(precoVenda, economiaAnual) {
        try {
            if (!precoVenda || !economiaAnual || economiaAnual <= 0) return 0;
            return precoVenda / economiaAnual;
            
        } catch (error) {
            console.error('Erro ao calcular payback:', error);
            return 0;
        }
    }

    /**
     * Status do sistema
     */
    getStatus() {
        return {
            clientes: this.cache.clientes.length,
            projetos: this.cache.projetos.length,
            propostas: this.cache.propostas.length,
            storage: {
                clientes: this.keys.clientes,
                projetos: this.keys.projetos,
                propostas: this.keys.propostas
            }
        };
    }
}

// Instância global
window.zorixStorage = new ZorixStorage();

console.log('✅ ZORIX Storage carregado com sucesso!');