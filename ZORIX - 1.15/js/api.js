// API Helper Functions for LURIX CRM
class SolarAPI {
    constructor() {
        this.baseURL = 'tables';
        this.useLocalStorage = false;
        this.checkAPIAvailability();
    }

    async checkAPIAvailability() {
        // Force localStorage for now since external API is not available
        this.useLocalStorage = true;
        console.log('Using localStorage for data persistence');
    }

    // Generic API methods
    async get(endpoint, params = {}) {
        try {
            const queryString = Object.keys(params).length > 0 ? 
                '?' + Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&') : 
                '';
            
            const url = `${this.baseURL}/${endpoint}${queryString}`;
            // console.log('API GET Request:', url); // Debug only
            
            const response = await fetch(url);
            // console.log('API Response:', response.status, response.statusText); // Debug only
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }
            
            const data = await response.json();
            // console.log('API Data:', data); // Debug only
            return data;
        } catch (error) {
            console.error('API GET Error:', error);
            throw error;
        }
    }

    async post(endpoint, data) {
        try {
            const url = `${this.baseURL}/${endpoint}`;
            // console.log('API POST Request:', url, data); // Debug only
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            // console.log('API Response:', response.status, response.statusText); // Debug only
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }
            
            const result = await response.json();
            // console.log('API Result:', result); // Debug only
            return result;
        } catch (error) {
            console.error('API POST Error:', error);
            throw error;
        }
    }

    async put(endpoint, data) {
        const response = await fetch(`${this.baseURL}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    }

    async patch(endpoint, data) {
        const response = await fetch(`${this.baseURL}/${endpoint}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    }

    async delete(endpoint) {
        const response = await fetch(`${this.baseURL}/${endpoint}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return response.status === 204 ? null : await response.json();
    }

    // Usuarios
    async getUsuarios(page = 1, limit = 100, search = '') {
        if (this.useLocalStorage || typeof storage !== 'undefined') {
            return await storage.getTable('usuarios', page, limit, search);
        }
        
        const params = { page, limit };
        if (search) params.search = search;
        return await this.get('usuarios', params);
    }

    async getUsuario(id) {
        if (this.useLocalStorage || typeof storage !== 'undefined') {
            return await storage.getRecord('usuarios', id);
        }
        return await this.get(`usuarios/${id}`);
    }

    async createUsuario(data) {
        if (this.useLocalStorage || typeof storage !== 'undefined') {
            return await storage.createRecord('usuarios', data);
        }
        return await this.post('usuarios', data);
    }

    async updateUsuario(id, data) {
        if (this.useLocalStorage || typeof storage !== 'undefined') {
            return await storage.updateRecord('usuarios', id, data);
        }
        return await this.put(`usuarios/${id}`, data);
    }

    async deleteUsuario(id) {
        if (this.useLocalStorage || typeof storage !== 'undefined') {
            return await storage.deleteRecord('usuarios', id);
        }
        return await this.delete(`usuarios/${id}`);
    }

    // Clientes
    async getClientes(page = 1, limit = 100, search = '') {
        if (this.useLocalStorage || typeof storage !== 'undefined') {
            return await storage.getTable('clientes', page, limit, search);
        }
        
        const params = { page, limit };
        if (search) params.search = search;
        return await this.get('clientes', params);
    }

    async getCliente(id) {
        if (this.useLocalStorage || typeof storage !== 'undefined') {
            return await storage.getRecord('clientes', id);
        }
        return await this.get(`clientes/${id}`);
    }

    async createCliente(data) {
        if (this.useLocalStorage || typeof storage !== 'undefined') {
            return await storage.createRecord('clientes', data);
        }
        return await this.post('clientes', data);
    }

    async updateCliente(id, data) {
        if (this.useLocalStorage || typeof storage !== 'undefined') {
            return await storage.updateRecord('clientes', id, data);
        }
        return await this.put(`clientes/${id}`, data);
    }

    async deleteCliente(id) {
        if (this.useLocalStorage || typeof storage !== 'undefined') {
            return await storage.deleteRecord('clientes', id);
        }
        return await this.delete(`clientes/${id}`);
    }

    // Generic CRUD operations
    async getTableData(tableName, page = 1, limit = 100, search = '') {
        if (this.useLocalStorage || typeof storage !== 'undefined') {
            return await storage.getTable(tableName, page, limit, search);
        }
        
        const params = { page, limit };
        if (search) params.search = search;
        return await this.get(tableName, params);
    }

    async getRecord(tableName, id) {
        if (this.useLocalStorage || typeof storage !== 'undefined') {
            return await storage.getRecord(tableName, id);
        }
        return await this.get(`${tableName}/${id}`);
    }

    async createRecord(tableName, data) {
        if (this.useLocalStorage || typeof storage !== 'undefined') {
            return await storage.createRecord(tableName, data);
        }
        return await this.post(tableName, data);
    }

    async updateRecord(tableName, id, data) {
        if (this.useLocalStorage || typeof storage !== 'undefined') {
            return await storage.updateRecord(tableName, id, data);
        }
        return await this.put(`${tableName}/${id}`, data);
    }

    async deleteRecord(tableName, id) {
        if (this.useLocalStorage || typeof storage !== 'undefined') {
            return await storage.deleteRecord(tableName, id);
        }
        return await this.delete(`${tableName}/${id}`);
    }

    // Projetos
    async getProjetos(page = 1, limit = 100, search = '') {
        return await this.getTableData('projetos', page, limit, search);
    }

    async getProjeto(id) {
        return await this.getRecord('projetos', id);
    }

    async getProjetosByCliente(clienteId) {
        if (this.useLocalStorage || typeof storage !== 'undefined') {
            return await storage.getProjectsByClientId(clienteId);
        }
        return await this.getTableData('projetos', 1, 100, clienteId);
    }

    async createProjeto(data) {
        return await this.createRecord('projetos', data);
    }

    async updateProjeto(id, data) {
        return await this.updateRecord('projetos', id, data);
    }

    async deleteProjeto(id) {
        return await this.deleteRecord('projetos', id);
    }

    // Interações
    async getInteracoes(page = 1, limit = 100, search = '') {
        return await this.getTableData('interacoes', page, limit, search);
    }

    async getInteracao(id) {
        return await this.getRecord('interacoes', id);
    }

    async getInteracoesByCliente(clienteId) {
        return await this.getTableData('interacoes', 1, 100, clienteId);
    }

    async createInteracao(data) {
        return await this.createRecord('interacoes', data);
    }

    async updateInteracao(id, data) {
        return await this.updateRecord('interacoes', id, data);
    }

    async deleteInteracao(id) {
        return await this.deleteRecord('interacoes', id);
    }

    // Agendamentos
    async getAgendamentos(page = 1, limit = 100, search = '') {
        return await this.getTableData('agendamentos', page, limit, search);
    }

    async getAgendamento(id) {
        return await this.getRecord('agendamentos', id);
    }

    async createAgendamento(data) {
        return await this.createRecord('agendamentos', data);
    }

    async updateAgendamento(id, data) {
        return await this.updateRecord('agendamentos', id, data);
    }

    async deleteAgendamento(id) {
        return await this.deleteRecord('agendamentos', id);
    }

    // Arquivos
    async getArquivos(page = 1, limit = 100, search = '') {
        return await this.getTableData('arquivos', page, limit, search);
    }

    async getArquivo(id) {
        return await this.getRecord('arquivos', id);
    }

    async getArquivosByCliente(clienteId) {
        return await this.getTableData('arquivos', 1, 100, clienteId);
    }

    async createArquivo(data) {
        return await this.createRecord('arquivos', data);
    }

    async updateArquivo(id, data) {
        return await this.updateRecord('arquivos', id, data);
    }

    async deleteArquivo(id) {
        return await this.deleteRecord('arquivos', id);
    }

    // Utility methods
    generateId() {
        if (typeof storage !== 'undefined') {
            return storage.generateId();
        }
        return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
    }

    formatDateTime(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }

    calculateReturnOnInvestment(investimento, economiaMensal) {
        if (!investimento || !economiaMensal) return 0;
        return Math.round(investimento / economiaMensal);
    }

    calculatePotencia(consumoMensal) {
        // Cálculo aproximado: kWh mensal / 30 dias / 5 horas de sol / 0.8 eficiência
        if (!consumoMensal) return 0;
        return Math.round((consumoMensal / 30 / 5 / 0.8) * 100) / 100;
    }
}

// Global API instance
const api = new SolarAPI();
window.api = api;