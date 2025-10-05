/**
 * LURIX CRM - Gerador de PDF Moderno Estilo Apple
 * Versão: 2.0 - Design Profissional 8 Páginas
 * Autor: Sistema LURIX
 * Data: Outubro 2024
 */

class ModernPDFGenerator {
    constructor() {
        this.colors = {
            primary: '#064B59',     // Azul petróleo LURIX
            accent: '#E6FF28',      // Amarelo vibrante LURIX
            light: '#F7FAFC',       // Cinza claro
            dark: '#1A202C',        // Cinza escuro
            gray: '#898A90',        // Cinza médio
            white: '#FFFFFF',
            success: '#10B981',     // Verde
            warning: '#F59E0B',     // Amarelo
            danger: '#EF4444'       // Vermelho
        };
        
        this.fonts = {
            title: 'helvetica',
            body: 'helvetica',
            mono: 'courier'
        };
    }

    /**
     * Gera PDF principal com 8 páginas profissionais
     */
    async generateProfessionalPDF(projeto, cliente) {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');

            // Página 1: Capa
            await this.generateCoverPage(doc, projeto, cliente);

            // Página 2: Resumo Executivo
            doc.addPage();
            await this.generateExecutiveSummary(doc, projeto, cliente);

            // Página 3: Análise do Cliente
            doc.addPage();
            await this.generateClientAnalysis(doc, projeto, cliente);

            // Página 4: Solução Técnica
            doc.addPage();
            await this.generateTechnicalSolution(doc, projeto);

            // Página 5: Análise Financeira
            doc.addPage();
            await this.generateFinancialAnalysis(doc, projeto);

            // Página 6: Cronograma e Implementação
            doc.addPage();
            await this.generateImplementationSchedule(doc, projeto);

            // Página 7: Garantias e Suporte
            doc.addPage();
            await this.generateWarrantySupport(doc, projeto);

            // Página 8: Próximos Passos
            doc.addPage();
            await this.generateNextSteps(doc, projeto, cliente);

            // Salvar PDF
            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `LURIX_Proposta_${cliente?.nome?.replace(/\s+/g, '_') || 'Cliente'}_${timestamp}.pdf`;
            
            doc.save(filename);
            
            console.log('✅ PDF moderno gerado:', filename);
            return { success: true, filename };

        } catch (error) {
            console.error('❌ Erro na geração do PDF:', error);
            throw error;
        }
    }

    /**
     * Página 1: Capa Profissional
     */
    async generateCoverPage(doc, projeto, cliente) {
        const pageWidth = 210;
        const pageHeight = 297;

        // Background gradiente
        doc.setFillColor(6, 75, 89); // Azul petróleo
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Faixa diagonal decorativa
        doc.setFillColor(230, 255, 40, 0.1); // Amarelo transparente
        doc.triangle(180, 0, pageWidth, 0, pageWidth, 60, 'F');

        // Logo e empresa (simulado)
        doc.setFillColor(255, 255, 255);
        doc.circle(105, 60, 25, 'F');
        
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('LURIX', 105, 57, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('ENERGIA SOLAR', 105, 65, { align: 'center' });

        // Título principal
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(36);
        doc.setFont('helvetica', 'bold');
        doc.text('PROPOSTA', 105, 120, { align: 'center' });
        doc.text('COMERCIAL', 105, 135, { align: 'center' });

        // Subtítulo
        doc.setFontSize(18);
        doc.setFont('helvetica', 'light');
        doc.text('Sistema Fotovoltaico', 105, 150, { align: 'center' });

        // Box com informações principais
        doc.setFillColor(255, 255, 255, 0.9);
        doc.roundedRect(30, 170, 150, 60, 5, 5, 'F');

        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('CLIENTE', 40, 185);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(cliente?.nome || 'Nome do Cliente', 40, 195);

        doc.setFont('helvetica', 'bold');
        doc.text('PROJETO', 40, 210);
        
        doc.setFont('helvetica', 'normal');
        const nomeProjetoWrapped = doc.splitTextToSize(projeto.nome_projeto || 'Sistema Fotovoltaico', 130);
        doc.text(nomeProjetoWrapped, 40, 220);

        // Rodapé com data
        doc.setTextColor(255, 255, 255, 0.8);
        doc.setFontSize(10);
        doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 105, 280, { align: 'center' });

        // Elementos decorativos
        this.addDecorativeElements(doc);
    }

    /**
     * Página 2: Resumo Executivo
     */
    async generateExecutiveSummary(doc, projeto, cliente) {
        this.addHeader(doc, 'RESUMO EXECUTIVO');

        let yPos = 50;

        // Introdução
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Visão Geral do Projeto', 20, yPos);

        yPos += 15;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        
        const introducao = `A LURIX Energia Solar apresenta esta proposta personalizada para instalação de um sistema fotovoltaico de ${projeto.potencia_kwp || 'X'} kWp, projetado especificamente para atender às necessidades energéticas de ${cliente?.nome || 'seu estabelecimento'}.`;
        const introLines = doc.splitTextToSize(introducao, 170);
        doc.text(introLines, 20, yPos);

        yPos += (introLines.length * 5) + 15;

        // Cards com destaques
        this.addHighlightCard(doc, 20, yPos, 80, 40, 'POTÊNCIA INSTALADA', `${projeto.potencia_kwp || 'N/A'} kWp`, 'fas fa-bolt');
        this.addHighlightCard(doc, 110, yPos, 80, 40, 'INVESTIMENTO', `R$ ${(projeto.valor_investimento || 0).toLocaleString('pt-BR')}`, 'fas fa-dollar-sign');

        yPos += 50;

        this.addHighlightCard(doc, 20, yPos, 80, 40, 'ECONOMIA MENSAL', `R$ ${(projeto.economia_mensal || 0).toLocaleString('pt-BR')}`, 'fas fa-piggy-bank');
        this.addHighlightCard(doc, 110, yPos, 80, 40, 'PAYBACK', `${projeto.payback_meses || 'N/A'} meses`, 'fas fa-chart-line');

        yPos += 60;

        // Benefícios principais
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(6, 75, 89);
        doc.text('Principais Benefícios', 20, yPos);

        yPos += 10;

        const beneficios = [
            '✓ Redução imediata na conta de energia elétrica',
            '✓ Proteção contra aumentos tarifários',
            '✓ Valorização do imóvel em até 15%',
            '✓ Tecnologia sustentável e renovável',
            '✓ Baixa manutenção e alta durabilidade',
            '✓ Monitoramento em tempo real via aplicativo'
        ];

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);

        beneficios.forEach(beneficio => {
            yPos += 8;
            doc.text(beneficio, 25, yPos);
        });

        this.addFooter(doc, 2);
    }

    /**
     * Página 3: Análise do Cliente
     */
    async generateClientAnalysis(doc, projeto, cliente) {
        this.addHeader(doc, 'ANÁLISE DO CLIENTE');

        let yPos = 50;

        // Informações do cliente
        doc.setFillColor(247, 250, 252);
        doc.roundedRect(15, yPos - 5, 180, 60, 3, 3, 'F');

        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Informações do Cliente', 20, yPos + 5);

        yPos += 15;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);

        const clienteInfo = [
            ['Nome:', cliente?.nome || 'N/A'],
            ['E-mail:', cliente?.email || 'N/A'],
            ['Telefone:', cliente?.telefone || 'N/A'],
            ['Endereço:', `${cliente?.endereco || 'N/A'}, ${cliente?.cidade || 'N/A'} - ${cliente?.estado || 'N/A'}`],
            ['Tipo de Cliente:', this.formatTipoCliente(cliente?.tipo_cliente)],
            ['Consumo Médio:', `${cliente?.consumo_mensal || 'N/A'} kWh/mês`]
        ];

        clienteInfo.forEach(([label, value]) => {
            doc.setFont('helvetica', 'bold');
            doc.text(label, 20, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(value, 70, yPos);
            yPos += 7;
        });

        yPos += 20;

        // Perfil de consumo
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Perfil de Consumo Energético', 20, yPos);

        yPos += 15;

        // Gráfico simulado de consumo
        this.drawConsumptionChart(doc, 20, yPos, 170, 80, cliente?.consumo_mensal || 400);

        this.addFooter(doc, 3);
    }

    /**
     * Página 4: Solução Técnica
     */
    async generateTechnicalSolution(doc, projeto) {
        this.addHeader(doc, 'SOLUÇÃO TÉCNICA');

        let yPos = 50;

        // Especificações técnicas
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Especificações do Sistema', 20, yPos);

        yPos += 15;

        // Tabela de especificações
        const specs = [
            ['Potência Total', `${projeto.potencia_kwp || 'N/A'} kWp`],
            ['Geração Estimada', `${projeto.geracao_estimada || 'N/A'} kWh/mês`],
            ['Tipo de Instalação', projeto.tipo_instalacao || 'Telhado'],
            ['Área Necessária', `${((projeto.potencia_kwp || 0) * 6).toFixed(0)} m²`],
            ['Quantidade de Painéis', `${Math.ceil((projeto.potencia_kwp || 0) / 0.55)} unidades`],
            ['Irradiação Solar Local', `${projeto.irradiacao_solar || 'N/A'} kWh/m²/dia`]
        ];

        this.drawSpecTable(doc, 20, yPos, 170, specs);

        yPos += (specs.length * 8) + 20;

        // Componentes principais
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Componentes do Sistema', 20, yPos);

        yPos += 15;

        if (projeto.lista_materiais) {
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);
            
            const materiais = projeto.lista_materiais.split('\n');
            materiais.forEach(material => {
                if (material.trim()) {
                    doc.text(material.trim(), 20, yPos);
                    yPos += 6;
                }
            });
        } else {
            // Lista padrão se não houver materiais específicos
            const materiaisDefault = [
                '• Painéis Solares Monocristalinos 550W',
                '• Inversor String de alta eficiência',
                '• Estruturas de fixação em alumínio',
                '• Cabos solares CC e CA',
                '• Sistema de proteção e monitoramento',
                '• Conectores MC4 e string box'
            ];

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);

            materiaisDefault.forEach(material => {
                doc.text(material, 20, yPos);
                yPos += 6;
            });
        }

        this.addFooter(doc, 4);
    }

    /**
     * Página 5: Análise Financeira
     */
    async generateFinancialAnalysis(doc, projeto) {
        this.addHeader(doc, 'ANÁLISE FINANCEIRA');

        let yPos = 50;

        // Resumo financeiro
        this.addHighlightCard(doc, 20, yPos, 85, 45, 'INVESTIMENTO TOTAL', `R$ ${(projeto.valor_investimento || 0).toLocaleString('pt-BR')}`, null);
        this.addHighlightCard(doc, 110, yPos, 85, 45, 'ECONOMIA MENSAL', `R$ ${(projeto.economia_mensal || 0).toLocaleString('pt-BR')}`, null);

        yPos += 55;

        this.addHighlightCard(doc, 20, yPos, 85, 45, 'PAYBACK', `${projeto.payback_meses || 'N/A'} meses`, null);
        this.addHighlightCard(doc, 110, yPos, 85, 45, 'ECONOMIA EM 25 ANOS', `R$ ${((projeto.economia_mensal || 0) * 300).toLocaleString('pt-BR')}`, null);

        yPos += 65;

        // Fluxo de caixa projetado
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Fluxo de Caixa Projetado', 20, yPos);

        yPos += 15;

        // Gráfico de payback
        this.drawPaybackChart(doc, 20, yPos, 170, 80, projeto);

        this.addFooter(doc, 5);
    }

    /**
     * Página 6: Cronograma e Implementação
     */
    async generateImplementationSchedule(doc, projeto) {
        this.addHeader(doc, 'CRONOGRAMA DE IMPLEMENTAÇÃO');

        let yPos = 50;

        // Timeline do projeto
        const fases = [
            { nome: 'Assinatura do Contrato', duracao: '1 dia', descricao: 'Formalização da parceria' },
            { nome: 'Projeto Executivo', duracao: '5-7 dias', descricao: 'Elaboração do projeto detalhado' },
            { nome: 'Aprovação na Concessionária', duracao: '15-30 dias', descricao: 'Solicitação de acesso junto à distribuidora' },
            { nome: 'Aquisição de Materiais', duracao: '7-15 dias', descricao: 'Compra e logística dos equipamentos' },
            { nome: 'Instalação', duracao: '2-5 dias', descricao: 'Montagem e conexão do sistema' },
            { nome: 'Comissionamento', duracao: '1-2 dias', descricao: 'Testes e configuração final' },
            { nome: 'Vistoria da Concessionária', duracao: '15-45 dias', descricao: 'Aprovação final e ligação do sistema' }
        ];

        doc.setTextColor(6, 75, 89);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Fases do Projeto:', 20, yPos);

        yPos += 15;

        fases.forEach((fase, index) => {
            // Número da fase
            doc.setFillColor(6, 75, 89);
            doc.circle(25, yPos, 4, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text((index + 1).toString(), 25, yPos + 2, { align: 'center' });

            // Linha conectora (exceto última)
            if (index < fases.length - 1) {
                doc.setDrawColor(200, 200, 200);
                doc.line(25, yPos + 4, 25, yPos + 16);
            }

            // Conteúdo da fase
            doc.setTextColor(6, 75, 89);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(fase.nome, 35, yPos + 1);

            doc.setTextColor(100, 100, 100);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Duração: ${fase.duracao}`, 35, yPos + 6);
            doc.text(fase.descricao, 35, yPos + 11);

            yPos += 20;
        });

        yPos += 10;

        // Prazo total estimado
        doc.setFillColor(230, 255, 40, 0.3);
        doc.roundedRect(15, yPos, 180, 25, 3, 3, 'F');

        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Prazo Total Estimado: 60 a 90 dias', 105, yPos + 12, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('*Prazos podem variar conforme a concessionária local', 105, yPos + 20, { align: 'center' });

        this.addFooter(doc, 6);
    }

    /**
     * Página 7: Garantias e Suporte
     */
    async generateWarrantySupport(doc, projeto) {
        this.addHeader(doc, 'GARANTIAS E SUPORTE');

        let yPos = 50;

        // Garantias
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Garantias Oferecidas', 20, yPos);

        yPos += 15;

        const garantias = [
            { item: 'Painéis Solares', garantia: '25 anos de performance linear' },
            { item: 'Inversor', garantia: '12 anos do fabricante' },
            { item: 'Estruturas de Fixação', garantia: '10 anos contra corrosão' },
            { item: 'Instalação', garantia: '5 anos de garantia LURIX' },
            { item: 'Projeto', garantia: '5 anos de garantia técnica' }
        ];

        garantias.forEach(item => {
            doc.setFillColor(247, 250, 252);
            doc.roundedRect(15, yPos - 2, 180, 12, 2, 2, 'F');

            doc.setTextColor(6, 75, 89);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(item.item, 20, yPos + 4);

            doc.setTextColor(60, 60, 60);
            doc.setFont('helvetica', 'normal');
            doc.text(item.garantia, 100, yPos + 4);

            yPos += 18;
        });

        yPos += 10;

        // Suporte técnico
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Suporte Técnico', 20, yPos);

        yPos += 15;

        const suporte = [
            '✓ Monitoramento remoto 24/7 via aplicativo',
            '✓ Suporte técnico especializado',
            '✓ Manutenção preventiva anual',
            '✓ Atendimento prioritário',
            '✓ Relatórios mensais de performance',
            '✓ Treinamento para operação básica'
        ];

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);

        suporte.forEach(item => {
            doc.text(item, 25, yPos);
            yPos += 8;
        });

        this.addFooter(doc, 7);
    }

    /**
     * Página 8: Próximos Passos
     */
    async generateNextSteps(doc, projeto, cliente) {
        this.addHeader(doc, 'PRÓXIMOS PASSOS');

        let yPos = 50;

        // Validade da proposta
        doc.setFillColor(230, 255, 40, 0.3);
        doc.roundedRect(15, yPos, 180, 30, 5, 5, 'F');

        doc.setTextColor(6, 75, 89);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Proposta Válida por 30 dias', 105, yPos + 12, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Data limite: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}`, 105, yPos + 22, { align: 'center' });

        yPos += 45;

        // Como proceder
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Como Proceder:', 20, yPos);

        yPos += 15;

        const passos = [
            'Entre em contato conosco para esclarecer dúvidas',
            'Agende uma visita técnica gratuita (se necessário)',
            'Confirme a aprovação da proposta',
            'Assinatura do contrato',
            'Início imediato do seu projeto solar!'
        ];

        passos.forEach((passo, index) => {
            doc.setFillColor(6, 75, 89);
            doc.circle(25, yPos, 4, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text((index + 1).toString(), 25, yPos + 2, { align: 'center' });

            doc.setTextColor(60, 60, 60);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(passo, 35, yPos + 2);

            yPos += 15;
        });

        yPos += 20;

        // Contato
        doc.setFillColor(6, 75, 89);
        doc.roundedRect(15, yPos, 180, 50, 5, 5, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Entre em Contato', 105, yPos + 15, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('📧 contato@lurixenergia.com.br', 105, yPos + 25, { align: 'center' });
        doc.text('📱 (11) 1234-5678', 105, yPos + 32, { align: 'center' });
        doc.text('🌐 www.lurixenergia.com.br', 105, yPos + 39, { align: 'center' });

        // Agradecimento
        yPos += 65;
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Obrigado pela confiança na LURIX Energia Solar!', 105, yPos, { align: 'center' });

        this.addFooter(doc, 8);
    }

    /**
     * Métodos auxiliares para elementos visuais
     */
    addHeader(doc, title) {
        // Background do header
        doc.setFillColor(6, 75, 89);
        doc.rect(0, 0, 210, 35, 'F');

        // Logo simulado
        doc.setFillColor(255, 255, 255);
        doc.circle(25, 18, 8, 'F');
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('LURIX', 25, 20, { align: 'center' });

        // Título da página
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 105, 22, { align: 'center' });
    }

    addFooter(doc, pageNum) {
        // Linha decorativa
        doc.setDrawColor(6, 75, 89);
        doc.setLineWidth(1);
        doc.line(20, 280, 190, 280);

        // Informações da empresa
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('LURIX Energia Solar - Soluções em Energia Renovável', 20, 287);
        doc.text(`Página ${pageNum} de 8`, 190, 287, { align: 'right' });
    }

    addHighlightCard(doc, x, y, width, height, title, value, icon) {
        // Background do card
        doc.setFillColor(247, 250, 252);
        doc.roundedRect(x, y, width, height, 3, 3, 'F');

        // Border
        doc.setDrawColor(6, 75, 89);
        doc.setLineWidth(0.5);
        doc.roundedRect(x, y, width, height, 3, 3, 'S');

        // Título
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(title, x + 5, y + 12);

        // Valor
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        const valueLines = doc.splitTextToSize(value, width - 10);
        doc.text(valueLines, x + 5, y + 22);
    }

    drawSpecTable(doc, x, y, width, specs) {
        const rowHeight = 8;
        
        specs.forEach((spec, index) => {
            const currentY = y + (index * rowHeight);
            
            // Background alternado
            if (index % 2 === 0) {
                doc.setFillColor(250, 250, 250);
                doc.rect(x, currentY - 2, width, rowHeight, 'F');
            }

            // Label
            doc.setTextColor(60, 60, 60);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(spec[0], x + 5, currentY + 3);

            // Value
            doc.setFont('helvetica', 'normal');
            doc.text(spec[1], x + 90, currentY + 3);
        });

        // Border da tabela
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.rect(x, y - 2, width, specs.length * rowHeight, 'S');
    }

    drawConsumptionChart(doc, x, y, width, height, consumo) {
        // Background do gráfico
        doc.setFillColor(250, 250, 250);
        doc.rect(x, y, width, height, 'F');

        // Título do gráfico
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Consumo Mensal Estimado', x + 5, y + 15);

        // Simular barras de consumo
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const barWidth = (width - 40) / 12;
        
        meses.forEach((mes, index) => {
            const barHeight = (consumo * (0.8 + Math.random() * 0.4)) / consumo * (height - 30);
            const barX = x + 20 + (index * barWidth);
            const barY = y + height - barHeight - 10;

            // Barra
            doc.setFillColor(6, 75, 89);
            doc.rect(barX, barY, barWidth - 2, barHeight, 'F');

            // Label do mês
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(8);
            doc.text(mes, barX + (barWidth / 2), y + height - 2, { align: 'center' });
        });
    }

    drawPaybackChart(doc, x, y, width, height, projeto) {
        // Background
        doc.setFillColor(250, 250, 250);
        doc.rect(x, y, width, height, 'F');

        // Título
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Retorno do Investimento', x + 5, y + 15);

        // Linha do tempo (anos)
        const anos = 25;
        const investimento = projeto.valor_investimento || 50000;
        const economiaMensal = projeto.economia_mensal || 500;

        // Simular gráfico de payback
        for (let ano = 0; ano <= anos; ano += 5) {
            const xPos = x + 20 + ((ano / anos) * (width - 40));
            const economiaAcumulada = economiaMensal * 12 * ano;
            const yPos = y + height - 20 - ((economiaAcumulada / (investimento * 2)) * (height - 40));

            if (ano === 0) {
                doc.setDrawColor(6, 75, 89);
                doc.setLineWidth(2);
                doc.line(x + 20, y + height - 20, xPos, Math.max(yPos, y + 20));
            } else {
                const prevXPos = x + 20 + (((ano - 5) / anos) * (width - 40));
                const prevEconomia = economiaMensal * 12 * (ano - 5);
                const prevYPos = y + height - 20 - ((prevEconomia / (investimento * 2)) * (height - 40));
                
                doc.line(prevXPos, Math.max(prevYPos, y + 20), xPos, Math.max(yPos, y + 20));
            }

            // Labels dos anos
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(8);
            doc.text(ano.toString(), xPos, y + height - 5, { align: 'center' });
        }

        // Linha de break-even
        const paybackAnos = (investimento / (economiaMensal * 12));
        if (paybackAnos <= anos) {
            const breakEvenX = x + 20 + ((paybackAnos / anos) * (width - 40));
            doc.setDrawColor(230, 255, 40);
            doc.setLineWidth(1);
            doc.line(breakEvenX, y + 20, breakEvenX, y + height - 20);
            
            doc.setTextColor(6, 75, 89);
            doc.setFontSize(8);
            doc.text('Break-even', breakEvenX + 2, y + 30);
        }
    }

    addDecorativeElements(doc) {
        // Elementos decorativos para a capa
        doc.setFillColor(255, 255, 255, 0.1);
        doc.circle(180, 250, 30, 'F');
        doc.circle(40, 260, 20, 'F');
    }

    formatTipoCliente(tipo) {
        const tipos = {
            'residencial': 'Residencial',
            'comercial': 'Comercial',
            'industrial': 'Industrial',
            'rural': 'Rural'
        };
        return tipos[tipo] || 'Não informado';
    }
}

// Adicionar o gerador à instância de projetos
if (window.projetosManager) {
    window.projetosManager.modernPDFGenerator = new ModernPDFGenerator();
    
    // Atualizar o método de geração de PDF
    window.projetosManager.generateModernPDF = async function(projeto, cliente) {
        return await this.modernPDFGenerator.generateProfessionalPDF(projeto, cliente);
    };
}

console.log('✅ Gerador de PDF moderno carregado');