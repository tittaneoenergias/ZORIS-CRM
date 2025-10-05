// Local Storage Management for LURIX CRM
class LocalStorage {
    constructor() {
        this.basePrefix = 'solarcrm_';
        this.userPrefix = '';
        this.prefix = this.basePrefix;
        this.initializeData();
    }

    // Configura o prefixo baseado no usuário logado
    setUserContext(userId) {
        if (userId) {
            this.userPrefix = `user_${userId}_`;
            this.prefix = this.basePrefix + this.userPrefix;
            console.log(`📁 Storage configurado para usuário: ${userId}`);
            
            // Inicializar dados para o novo usuário se necessário
            this.initializeUserData();
        } else {
            this.userPrefix = '';
            this.prefix = this.basePrefix;
        }
    }

    // Inicializa dados específicos do usuário
    initializeUserData() {
        if (!this.getItem('initialized')) {
            console.log('🆕 Criando ambiente novo para empresa...');
            this.setupDefaultData();
            this.setItem('initialized', true);
        }
    }

    // Limpa dados do usuário atual (para reset de empresa)
    clearUserData() {
        if (this.userPrefix) {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            console.log('🧹 Dados da empresa limpos');
        }
    }

    initializeData() {
        // Initialize with default data if not exists
        if (!this.getItem('initialized')) {
            this.setupDefaultData();
            this.setItem('initialized', true);
        }
        
        // Não criar projetos de exemplo para novos usuários (sistema isolado por empresa)
        if (!this.userPrefix) {
            // Apenas para o sistema principal (admin)
            const projetos = this.getItem('projetos') || [];
            if (projetos.length === 0) {
                this.addDefaultProjects();
            }
        }

        // Fix for ID consistency - force refresh if needed (October 2024 fix)
        this.fixIdConsistency();
    }

    fixIdConsistency() {
        const projetos = this.getItem('projetos') || [];
        let needsUpdate = false;

        // Check if any project has the old "client_" format
        const hasOldIds = projetos.some(projeto => 
            projeto.cliente_id && projeto.cliente_id.startsWith('client_')
        );

        if (hasOldIds) {
            console.log('🔧 Corrigindo inconsistência de IDs...');
            
            // Map old IDs to new IDs
            const idMap = {
                'client_001': 'cli_001',
                'client_002': 'cli_002', 
                'client_003': 'cli_003'
            };

            // Update all projects
            const updatedProjetos = projetos.map(projeto => {
                if (projeto.cliente_id && idMap[projeto.cliente_id]) {
                    return {
                        ...projeto,
                        cliente_id: idMap[projeto.cliente_id]
                    };
                }
                return projeto;
            });

            this.setItem('projetos', updatedProjetos);
            console.log('✅ IDs corrigidos com sucesso!');
            needsUpdate = true;
        }

        return needsUpdate;
    }
    
    addDefaultProjects() {
        // Lista vazia de projetos - sistema limpo
        const defaultProjetos = [];

        this.setItem('projetos', defaultProjetos);
        console.log('✅ Projetos de exemplo criados:', defaultProjetos.length);
    }

    setupDefaultData() {
        // Para novos usuários, começar com sistema completamente limpo
        if (this.userPrefix) {
            console.log('🏢 Criando ambiente limpo para nova empresa...');
            
            // Apenas dados essenciais vazios
            this.setItem('usuarios', []); // Será gerenciado pelo sistema principal
            this.setItem('clientes', []);
            this.setItem('projetos', []);
            this.setItem('propostas', []);
            this.setItem('agendamentos', []);
            this.setItem('interacoes', []);
            this.setItem('arquivos', []);
            this.setItem('contas_pagar', []);
            this.setItem('contas_receber', []);
            this.setItem('ajudas_custo', []);
            this.setItem('vendedores', []);
            this.setItem('configuracoes_empresa', {
                nome_empresa: '',
                telefone: '',
                email: '',
                endereco: '',
                cnpj: ''
            });
            
            console.log('✅ Empresa criada com dados zerados - pronta para uso!');
            return;
        }

        // Para o sistema principal (quando não há usuário específico)
        const defaultUsers = [
            {
                id: "user_admin_001",
                nome: "Administrador do Sistema", 
                email: "admin@solarcrm.com",
                senha: "-969161597", // admin123
                tipo: "administrador",
                ativo: true,
                ultimo_login: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];

        this.setItem('usuarios', defaultUsers);

        // Default clients
        const defaultClientes = [
            {
                id: "cli_001",
                nome: "João Silva",
                tipo_pessoa: "fisica",
                cpf_cnpj: "123.456.789-01", 
                endereco: "Rua das Flores, 123, Centro",
                cep: "01234-567",
                cidade: "São Paulo",
                estado: "SP",
                telefone: "(11) 99999-1234",
                whatsapp: "(11) 99999-1234",
                email: "joao.silva@email.com",
                tipo_cliente: "residencial",
                consumo_mensal: 350,
                valor_conta: 280.5,
                observacoes: "Cliente interessado em sistema residencial",
                status: "cliente",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: "cli_002", 
                nome: "Empresa ABC Ltda",
                tipo_pessoa: "juridica",
                cpf_cnpj: "12.345.678/0001-90",
                endereco: "Av. Industrial, 456, Distrito Industrial",
                cep: "12345-678",
                cidade: "São Paulo", 
                estado: "SP",
                telefone: "(11) 3333-4567",
                whatsapp: "(11) 99999-5678",
                email: "contato@empresaabc.com",
                tipo_cliente: "comercial",
                consumo_mensal: 1200,
                valor_conta: 850,
                observacoes: "Empresa do setor metal-mecânico",
                status: "cliente",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: "cli_003",
                nome: "Maria Santos", 
                tipo_pessoa: "fisica",
                cpf_cnpj: "987.654.321-01",
                endereco: "Rua dos Girassóis, 789, Jardim Botânico",
                cep: "54321-098",
                cidade: "Rio de Janeiro",
                estado: "RJ", 
                telefone: "(21) 88888-9999",
                whatsapp: "(21) 88888-9999",
                email: "maria.santos@email.com",
                tipo_cliente: "residencial",
                consumo_mensal: 420,
                valor_conta: 320,
                observacoes: "Interessada em financiamento",
                status: "prospecto",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: "cli_004",
                nome: "Fazenda Solar Rural Ltda",
                tipo_pessoa: "juridica", 
                cpf_cnpj: "98.765.432/0001-10",
                endereco: "Estrada Rural, Km 15, Zona Rural",
                cep: "98765-432",
                cidade: "Ribeirão Preto",
                estado: "SP",
                telefone: "(16) 7777-8888",
                whatsapp: "(16) 99999-7777", 
                email: "contato@fazendasolar.com",
                tipo_cliente: "rural",
                consumo_mensal: 2500,
                valor_conta: 1800,
                observacoes: "Grande consumidor rural",
                status: "cliente",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: "cli_005",
                nome: "Alessandro Silva",
                tipo_pessoa: "fisica",
                cpf_cnpj: "456.789.123-45",
                endereco: "Av. Paulista, 1000, Bela Vista",
                cep: "01310-100",
                cidade: "São Paulo",
                estado: "SP",
                telefone: "(11) 91234-5678",
                whatsapp: "(11) 91234-5678",
                email: "alessandro.silva@email.com",
                tipo_cliente: "residencial",
                consumo_mensal: 450,
                valor_conta: 380,
                observacoes: "Cliente interessado em sistema premium",
                status: "prospecto",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];

        this.setItem('clientes', defaultClientes);

        // Projetos v2.0 - Sistema Reformulado 
        // Os projetos serão criados pelo método addDefaultProjects() para evitar duplicação
        this.setItem('projetos', []);

        // Initialize other tables as empty arrays  
        this.setItem('interacoes', []);
        this.setItem('agendamentos', []);
        this.setItem('arquivos', []);
    }

    getItem(key) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error getting item from localStorage:', error);
            return null;
        }
    }

    setItem(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error setting item to localStorage:', error);
            return false;
        }
    }

    // Table-like operations
    async getTable(tableName, page = 1, limit = 100, search = '') {
        const data = this.getItem(tableName) || [];
        let filteredData = data;

        // Apply search filter
        if (search) {
            filteredData = data.filter(item => {
                return Object.values(item).some(value => 
                    String(value).toLowerCase().includes(search.toLowerCase())
                );
            });
        }

        // Calculate pagination
        const total = filteredData.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        return {
            data: paginatedData,
            total: total,
            page: page,
            limit: limit,
            table: tableName
        };
    }

    async getProjectsByClientId(clienteId) {
        const projetos = this.getItem('projetos') || [];
        const projetosDoCliente = projetos.filter(projeto => projeto.cliente_id === clienteId);
        
        console.log(`🔍 Buscando projetos para cliente ${clienteId}: encontrados ${projetosDoCliente.length}`);
        
        return {
            data: projetosDoCliente,
            total: projetosDoCliente.length,
            page: 1,
            limit: 100,
            table: 'projetos'
        };
    }

    async getRecord(tableName, id) {
        const data = this.getItem(tableName) || [];
        return data.find(item => item.id === id);
    }

    async createRecord(tableName, record) {
        const data = this.getItem(tableName) || [];
        
        // Add system fields
        const newRecord = {
            ...record,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        data.push(newRecord);
        this.setItem(tableName, data);
        
        return newRecord;
    }

    async updateRecord(tableName, id, updates) {
        const data = this.getItem(tableName) || [];
        const index = data.findIndex(item => item.id === id);
        
        if (index !== -1) {
            data[index] = {
                ...data[index],
                ...updates,
                updated_at: new Date().toISOString()
            };
            this.setItem(tableName, data);
            return data[index];
        }
        
        throw new Error('Record not found');
    }

    async deleteRecord(tableName, id) {
        const data = this.getItem(tableName) || [];
        const index = data.findIndex(item => item.id === id);
        
        if (index !== -1) {
            data.splice(index, 1);
            this.setItem(tableName, data);
            return true;
        }
        
        throw new Error('Record not found');
    }

    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
}

// Global storage instance
const storage = new LocalStorage();
window.storage = storage;