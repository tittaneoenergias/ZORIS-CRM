/**
 * LURIX CRM - Gerador de PDF Estilo Apple
 * Design Moderno e Minimalista - 8 Páginas Profissionais
 * Inspirado no design Apple: limpo, elegante, focado
 * Versão: 2.0
 * Data: Outubro 2024
 */

class ApplePDFGenerator {
    constructor() {
        this.colors = {
            // Paleta Apple-inspired
            primary: '#007AFF',      // Apple Blue
            secondary: '#34C759',    // Apple Green  
            accent: '#FF9F00',       // Apple Orange
            dark: '#1D1D1F',         // Apple Dark
            lightGray: '#F2F2F7',   // Apple Light Gray
            mediumGray: '#8E8E93',  // Apple Medium Gray
            white: '#FFFFFF',
            
            // LURIX Colors
            lurixBlue: '#064B59',
            lurixYellow: '#E6FF28',
            lurixLight: '#F7FAFC'
        };

        this.fonts = {
            primary: 'helvetica',
            secondary: 'helvetica',
            mono: 'courier'
        };

        console.log('🎨 Apple PDF Generator inicializado');
    }

    /**
     * Gera PDF completo com 8 páginas estilo Apple
     */
    async generateProfessionalPDF(projeto, cliente) {
        try {
            console.log('📄 Gerando PDF estilo Apple para:', projeto.nome_projeto);

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');

            // Página 1: Capa Minimalista
            this.generateCoverPage(doc, projeto, cliente);

            // Página 2: Visão Geral
            doc.addPage();
            this.generateOverviewPage(doc, projeto, cliente);

            // Página 3: Cliente & Necessidades
            doc.addPage();
            this.generateClientPage(doc, projeto, cliente);

            // Página 4: Solução Proposta
            doc.addPage();
            this.generateSolutionPage(doc, projeto);

            // Página 5: Análise Técnica
            doc.addPage();
            this.generateTechnicalPage(doc, projeto);

            // Página 6: Investimento & Retorno
            doc.addPage();
            this.generateInvestmentPage(doc, projeto);

            // Página 7: Implementação
            doc.addPage();
            this.generateImplementationPage(doc, projeto);

            // Página 8: Próximos Passos
            doc.addPage();
            this.generateNextStepsPage(doc, projeto, cliente);

            // Salvar com nome Apple-style
            const timestamp = new Date().toISOString().slice(0, 10);
            const clienteName = cliente?.nome?.replace(/\s+/g, '_') || 'Cliente';
            const filename = `LURIX_Solar_${clienteName}_${timestamp}.pdf`;
            
            doc.save(filename);
            
            console.log('✅ PDF Apple gerado:', filename);
            return { success: true, filename };

        } catch (error) {
            console.error('❌ Erro na geração do PDF Apple:', error);
            throw error;
        }
    }

    /**
     * Página 1: Capa Minimalista Estilo Apple
     */
    generateCoverPage(doc, projeto, cliente) {
        const { primary, white, dark, lightGray, lurixBlue } = this.colors;

        // Background limpo
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 297, 'F');

        // Elementos geométricos minimalistas
        this.addGeometricElements(doc);

        // Logo LURIX minimalista (círculo + texto)
        doc.setFillColor(6, 75, 89);
        doc.circle(105, 70, 20, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('LURIX', 105, 73, { align: 'center' });

        // Título principal - Typography focada
        doc.setTextColor(29, 29, 31);
        doc.setFontSize(42);
        doc.setFont('helvetica', 'light');
        doc.text('Solar', 105, 120, { align: 'center' });
        
        doc.setFontSize(48);
        doc.setFont('helvetica', 'bold');
        doc.text('Energy', 105, 135, { align: 'center' });

        // Subtítulo elegante
        doc.setTextColor(142, 142, 147);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'normal');
        doc.text('Proposta Personalizada', 105, 150, { align: 'center' });

        // Card clean do cliente
        doc.setFillColor(242, 242, 247);
        doc.roundedRect(40, 170, 130, 50, 8, 8, 'F');

        doc.setTextColor(29, 29, 31);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'semibold');
        doc.text(cliente?.nome || 'Cliente', 105, 185, { align: 'center' });

        doc.setTextColor(142, 142, 147);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text(`Sistema Fotovoltaico ${projeto.potencia_kwp || 'X'} kWp`, 105, 200, { align: 'center' });

        // Data minimalista
        doc.setTextColor(142, 142, 147);
        doc.setFontSize(12);
        doc.text(new Date().toLocaleDateString('pt-BR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        }), 105, 250, { align: 'center' });
    }

    /**
     * Página 2: Visão Geral
     */
    generateOverviewPage(doc, projeto, cliente) {
        this.addMinimalHeader(doc, 'Visão Geral');

        let y = 60;

        // Hero section
        doc.setTextColor(29, 29, 31);
        doc.setFontSize(32);
        doc.setFont('helvetica', 'bold');
        doc.text('Transforme', 20, y);
        doc.text('sua energia', 20, y + 12);

        y += 35;
        doc.setTextColor(142, 142, 147);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        const introText = `Um sistema fotovoltaico de ${projeto.potencia_kwp || 'X'} kWp projetado especificamente para ${cliente?.nome || 'você'}, combinando tecnologia de ponta com design sustentável.`;
        const introLines = doc.splitTextToSize(introText, 170);
        doc.text(introLines, 20, y);

        y += (introLines.length * 6) + 25;

        // Cards de benefícios estilo Apple
        const benefits = [
            { icon: '⚡', title: 'Energia Limpa', desc: 'Redução de até 95% na conta de luz' },
            { icon: '🌱', title: 'Sustentável', desc: 'Zero emissão de carbono' },
            { icon: '💰', title: 'Economia', desc: `R$ ${(projeto.economia_mensal || 0).toLocaleString('pt-BR')}/mês` },
            { icon: '🏆', title: 'Qualidade', desc: '25 anos de garantia' }
        ];

        this.drawBenefitCards(doc, benefits, y);

        y += 120;

        // Números principais
        this.drawKeyNumbers(doc, projeto, y);

        this.addMinimalFooter(doc, 2);
    }

    /**
     * Página 3: Cliente & Necessidades
     */
    generateClientPage(doc, projeto, cliente) {
        this.addMinimalHeader(doc, 'Seu Perfil');

        let y = 60;

        // Título da seção
        doc.setTextColor(29, 29, 31);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('Entendendo suas necessidades', 20, y);

        y += 25;

        // Card do cliente
        doc.setFillColor(242, 242, 247);
        doc.roundedRect(15, y, 180, 80, 12, 12, 'F');

        y += 20;
        doc.setTextColor(29, 29, 31);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'semibold');
        doc.text('Informações do Cliente', 25, y);

        y += 15;
        const clientInfo = [
            ['Nome', cliente?.nome || 'N/A'],
            ['Localização', `${cliente?.cidade || 'N/A'}, ${cliente?.estado || 'N/A'}`],
            ['Tipo', this.formatTipoCliente(cliente?.tipo_cliente)],
            ['Consumo Atual', `${cliente?.consumo_mensal || 'N/A'} kWh/mês`]
        ];

        doc.setFontSize(13);
        clientInfo.forEach(([label, value]) => {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(142, 142, 147);
            doc.text(label, 25, y);
            
            doc.setFont('helvetica', 'semibold');
            doc.setTextColor(29, 29, 31);
            doc.text(value, 100, y);
            
            y += 8;
        });

        y += 25;

        // Análise de consumo
        doc.setTextColor(29, 29, 31);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Análise de Consumo', 20, y);

        y += 20;
        this.drawConsumptionAnalysis(doc, cliente, y);

        this.addMinimalFooter(doc, 3);
    }

    /**
     * Página 4: Solução Proposta
     */
    generateSolutionPage(doc, projeto) {
        this.addMinimalHeader(doc, 'Nossa Solução');

        let y = 60;

        // Hero da solução
        doc.setTextColor(29, 29, 31);
        doc.setFontSize(32);
        doc.setFont('helvetica', 'bold');
        doc.text('Solução', 20, y);
        doc.text('Personalizada', 20, y + 12);

        y += 35;
        doc.setTextColor(142, 142, 147);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        const solutionText = `Sistema fotovoltaico ${projeto.nome_projeto || ''} com componentes premium e tecnologia de última geração.`;
        const solutionLines = doc.splitTextToSize(solutionText, 170);
        doc.text(solutionLines, 20, y);

        y += (solutionLines.length * 6) + 25;

        // Especificações técnicas em cards
        const specs = [
            { label: 'Potência Total', value: `${projeto.potencia_kwp || 'N/A'} kWp`, icon: '⚡' },
            { label: 'Geração Mensal', value: `${projeto.geracao_estimada || 'N/A'} kWh`, icon: '☀️' },
            { label: 'Tipo', value: projeto.tipo_instalacao || 'Telhado', icon: '🏠' },
            { label: 'Área Necessária', value: `${((projeto.potencia_kwp || 0) * 7).toFixed(0)} m²`, icon: '📐' }
        ];

        this.drawSpecCards(doc, specs, y);

        y += 100;

        // Componentes
        if (projeto.lista_materiais) {
            doc.setTextColor(29, 29, 31);
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text('Componentes Premium', 20, y);

            y += 15;
            doc.setFillColor(242, 242, 247);
            doc.roundedRect(15, y, 180, 60, 8, 8, 'F');

            y += 15;
            doc.setTextColor(29, 29, 31);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            
            const materials = projeto.lista_materiais.split('\n').slice(0, 4);
            materials.forEach(material => {
                if (material.trim()) {
                    doc.text(material.trim(), 25, y);
                    y += 6;
                }
            });
        }

        this.addMinimalFooter(doc, 4);
    }

    /**
     * Página 5: Análise Técnica
     */
    generateTechnicalPage(doc, projeto) {
        this.addMinimalHeader(doc, 'Análise Técnica');

        let y = 60;

        // Título
        doc.setTextColor(29, 29, 31);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('Performance & Eficiência', 20, y);

        y += 25;

        // Métricas técnicas
        const techMetrics = [
            { 
                title: 'Geração Anual', 
                value: `${((projeto.geracao_estimada || 0) * 12).toLocaleString('pt-BR')} kWh`,
                subtitle: 'Energia limpa por ano'
            },
            { 
                title: 'Eficiência do Sistema', 
                value: '84.5%',
                subtitle: 'Conversão solar-elétrica'
            }
        ];

        this.drawTechMetrics(doc, techMetrics, y);

        y += 80;

        // Gráfico de produção (simulado)
        doc.setTextColor(29, 29, 31);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Produção Mensal Estimada', 20, y);

        y += 20;
        this.drawProductionChart(doc, projeto, y);

        y += 70;

        // Dados ambientais
        doc.setTextColor(52, 199, 89);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Impacto Ambiental', 20, y);

        y += 20;
        const co2Saved = ((projeto.geracao_estimada || 0) * 12 * 0.0817).toFixed(1); // kg CO2/kWh
        const treesEquivalent = Math.round(co2Saved / 22); // 1 árvore = ~22kg CO2/ano

        doc.setTextColor(29, 29, 31);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text(`• Redução de ${co2Saved} kg de CO² por ano`, 25, y);
        doc.text(`• Equivale ao plantio de ${treesEquivalent} árvores`, 25, y + 8);
        doc.text(`• Contribuição para um futuro mais sustentável`, 25, y + 16);

        this.addMinimalFooter(doc, 5);
    }

    /**
     * Página 6: Investimento & Retorno
     */
    generateInvestmentPage(doc, projeto) {
        this.addMinimalHeader(doc, 'Investimento');

        let y = 60;

        // Título financeiro
        doc.setTextColor(29, 29, 31);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('Retorno Inteligente', 20, y);

        y += 25;

        // Investimento principal
        doc.setFillColor(0, 122, 255);
        doc.roundedRect(15, y, 180, 60, 12, 12, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.text('Investimento Total', 105, y + 20, { align: 'center' });

        doc.setFontSize(36);
        doc.setFont('helvetica', 'bold');
        doc.text(`R$ ${(projeto.valor_investimento || 0).toLocaleString('pt-BR')}`, 105, y + 40, { align: 'center' });

        y += 80;

        // Economia e payback
        const financialData = [
            { label: 'Economia Mensal', value: `R$ ${(projeto.economia_mensal || 0).toLocaleString('pt-BR')}` },
            { label: 'Payback', value: `${projeto.payback_meses || 'N/A'} meses` },
            { label: 'Economia em 25 anos', value: `R$ ${((projeto.economia_mensal || 0) * 300).toLocaleString('pt-BR')}` }
        ];

        this.drawFinancialCards(doc, financialData, y);

        y += 80;

        // Fluxo de caixa
        doc.setTextColor(29, 29, 31);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Fluxo de Caixa Projetado', 20, y);

        y += 20;
        this.drawCashFlowChart(doc, projeto, y);

        this.addMinimalFooter(doc, 6);
    }

    /**
     * Página 7: Implementação
     */
    generateImplementationPage(doc, projeto) {
        this.addMinimalHeader(doc, 'Implementação');

        let y = 60;

        // Título do processo
        doc.setTextColor(29, 29, 31);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('Processo Simples', 20, y);

        y += 25;

        // Timeline das etapas
        const steps = [
            { step: '01', title: 'Contrato', duration: '1 dia', desc: 'Assinatura e início do projeto' },
            { step: '02', title: 'Projeto', duration: '3-5 dias', desc: 'Elaboração do projeto executivo' },
            { step: '03', title: 'Aprovação', duration: '15-30 dias', desc: 'Processo na concessionária' },
            { step: '04', title: 'Instalação', duration: '1-3 dias', desc: 'Montagem do sistema' },
            { step: '05', title: 'Conexão', duration: '15-45 dias', desc: 'Ligação e funcionamento' }
        ];

        this.drawTimeline(doc, steps, y);

        y += 140;

        // Garantias
        doc.setTextColor(52, 199, 89);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Garantias Inclusas', 20, y);

        y += 20;
        const warranties = [
            '25 anos de performance dos painéis',
            '12 anos de garantia do inversor',
            '5 anos de garantia da instalação',
            'Suporte técnico especializado'
        ];

        warranties.forEach(warranty => {
            doc.setTextColor(29, 29, 31);
            doc.setFontSize(13);
            doc.setFont('helvetica', 'normal');
            doc.text(`✓ ${warranty}`, 25, y);
            y += 8;
        });

        this.addMinimalFooter(doc, 7);
    }

    /**
     * Página 8: Próximos Passos
     */
    generateNextStepsPage(doc, projeto, cliente) {
        this.addMinimalHeader(doc, 'Próximos Passos');

        let y = 60;

        // Call to action principal
        doc.setTextColor(29, 29, 31);
        doc.setFontSize(32);
        doc.setFont('helvetica', 'bold');
        doc.text('Vamos', 20, y);
        doc.text('começar?', 20, y + 12);

        y += 40;

        // Validade da proposta
        doc.setFillColor(255, 159, 0);
        doc.roundedRect(15, y, 180, 40, 12, 12, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'semibold');
        doc.text('Proposta válida por 30 dias', 105, y + 15, { align: 'center' });

        doc.setFontSize(13);
        doc.setFont('helvetica', 'normal');
        const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');
        doc.text(`Até ${validUntil}`, 105, y + 28, { align: 'center' });

        y += 60;

        // Como proceder
        doc.setTextColor(29, 29, 31);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Como Proceder', 20, y);

        y += 20;
        const nextSteps = [
            'Entre em contato para esclarecer dúvidas',
            'Agende uma visita técnica (se necessário)',
            'Confirme a aprovação da proposta',
            'Assinatura do contrato',
            'Início imediato do seu projeto!'
        ];

        nextSteps.forEach((step, index) => {
            // Número do passo
            doc.setFillColor(0, 122, 255);
            doc.circle(30, y + 2, 6, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text((index + 1).toString(), 30, y + 4, { align: 'center' });

            // Texto do passo
            doc.setTextColor(29, 29, 31);
            doc.setFontSize(13);
            doc.setFont('helvetica', 'normal');
            doc.text(step, 45, y + 4);

            y += 15;
        });

        y += 20;

        // Contato final
        doc.setFillColor(6, 75, 89);
        doc.roundedRect(15, y, 180, 50, 12, 12, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('LURIX Energia Solar', 105, y + 18, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('contato@lurixenergia.com.br', 105, y + 30, { align: 'center' });
        doc.text('(11) 1234-5678', 105, y + 40, { align: 'center' });

        this.addMinimalFooter(doc, 8);
    }

    /**
     * Métodos auxiliares para elementos visuais
     */
    addGeometricElements(doc) {
        // Elementos geométricos sutis estilo Apple
        doc.setFillColor(242, 242, 247, 0.3);
        doc.circle(190, 30, 25, 'F');
        doc.circle(20, 270, 15, 'F');
        
        doc.setFillColor(0, 122, 255, 0.1);
        doc.rect(160, 250, 50, 47, 'F');
    }

    addMinimalHeader(doc, title) {
        // Header limpo estilo Apple
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 40, 'F');

        // Logo pequeno
        doc.setFillColor(6, 75, 89);
        doc.circle(25, 20, 6, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('LURIX', 25, 22, { align: 'center' });

        // Título da página
        doc.setTextColor(29, 29, 31);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'semibold');
        doc.text(title, 105, 22, { align: 'center' });

        // Linha sutil
        doc.setDrawColor(242, 242, 247);
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);
    }

    addMinimalFooter(doc, pageNum) {
        // Footer minimalista
        doc.setTextColor(142, 142, 147);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`${pageNum}`, 105, 285, { align: 'center' });
    }

    drawBenefitCards(doc, benefits, y) {
        const cardWidth = 85;
        const cardHeight = 50;
        let x = 20;

        benefits.forEach((benefit, index) => {
            if (index === 2) {
                x = 20;
                y += 60;
            }

            // Card background
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(x, y, cardWidth, cardHeight, 8, 8, 'F');
            
            // Sombra sutil
            doc.setDrawColor(0, 0, 0, 0.1);
            doc.setLineWidth(0.5);
            doc.roundedRect(x, y, cardWidth, cardHeight, 8, 8, 'S');

            // Ícone
            doc.setFontSize(20);
            doc.text(benefit.icon, x + 15, y + 20);

            // Título
            doc.setTextColor(29, 29, 31);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(benefit.title, x + 10, y + 30);

            // Descrição
            doc.setTextColor(142, 142, 147);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            const descLines = doc.splitTextToSize(benefit.desc, cardWidth - 20);
            doc.text(descLines, x + 10, y + 38);

            x += cardWidth + 10;
        });
    }

    drawKeyNumbers(doc, projeto, y) {
        const numbers = [
            { number: `${projeto.potencia_kwp || 'X'} kWp`, label: 'Potência' },
            { number: `R$ ${(projeto.economia_mensal || 0).toLocaleString('pt-BR')}`, label: 'Economia/mês' },
            { number: `${projeto.payback_meses || 'X'} meses`, label: 'Payback' }
        ];

        let x = 20;
        numbers.forEach(item => {
            doc.setTextColor(29, 29, 31);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text(item.number, x, y);

            doc.setTextColor(142, 142, 147);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(item.label, x, y + 10);

            x += 60;
        });
    }

    drawConsumptionAnalysis(doc, cliente, y) {
        // Gráfico simples de consumo
        doc.setFillColor(242, 242, 247);
        doc.roundedRect(15, y, 180, 80, 8, 8, 'F');

        doc.setTextColor(29, 29, 31);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'semibold');
        doc.text('Consumo Atual vs Produção Solar', 25, y + 20);

        // Barras representativas
        const consumoAtual = cliente?.consumo_mensal || 400;
        const producaoSolar = consumoAtual * 0.95; // 95% de cobertura

        // Barra consumo atual
        doc.setFillColor(255, 59, 48);
        doc.rect(25, y + 35, (consumoAtual / 500) * 120, 10, 'F');
        doc.setTextColor(29, 29, 31);
        doc.setFontSize(10);
        doc.text(`Consumo: ${consumoAtual} kWh`, 25, y + 50);

        // Barra produção solar
        doc.setFillColor(52, 199, 89);
        doc.rect(25, y + 55, (producaoSolar / 500) * 120, 10, 'F');
        doc.text(`Produção Solar: ${producaoSolar.toFixed(0)} kWh`, 25, y + 70);
    }

    drawSpecCards(doc, specs, y) {
        let x = 20;
        specs.forEach((spec, index) => {
            if (index === 2) {
                x = 20;
                y += 45;
            }

            doc.setFillColor(255, 255, 255);
            doc.roundedRect(x, y, 85, 35, 6, 6, 'F');
            
            doc.setDrawColor(242, 242, 247);
            doc.roundedRect(x, y, 85, 35, 6, 6, 'S');

            doc.setFontSize(16);
            doc.text(spec.icon, x + 10, y + 15);

            doc.setTextColor(29, 29, 31);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(spec.label, x + 25, y + 12);

            doc.setFontSize(12);
            doc.text(spec.value, x + 25, y + 22);

            x += 90;
        });
    }

    drawTechMetrics(doc, metrics, y) {
        metrics.forEach((metric, index) => {
            const x = 20 + (index * 90);

            doc.setFillColor(0, 122, 255, 0.1);
            doc.roundedRect(x, y, 80, 60, 8, 8, 'F');

            doc.setTextColor(0, 122, 255);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text(metric.value, x + 10, y + 25);

            doc.setTextColor(29, 29, 31);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'semibold');
            doc.text(metric.title, x + 10, y + 35);

            doc.setTextColor(142, 142, 147);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            const subtitleLines = doc.splitTextToSize(metric.subtitle, 70);
            doc.text(subtitleLines, x + 10, y + 45);
        });
    }

    drawProductionChart(doc, projeto, y) {
        // Gráfico de barras simples
        doc.setFillColor(242, 242, 247);
        doc.rect(20, y, 170, 50, 'F');

        const meses = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
        const barWidth = 12;
        const maxHeight = 35;

        meses.forEach((mes, index) => {
            const height = maxHeight * (0.7 + Math.random() * 0.6);
            const x = 30 + (index * 14);
            const barY = y + 50 - height;

            doc.setFillColor(52, 199, 89);
            doc.rect(x, barY, barWidth, height, 'F');

            doc.setTextColor(142, 142, 147);
            doc.setFontSize(8);
            doc.text(mes, x + 4, y + 45);
        });
    }

    drawFinancialCards(doc, data, y) {
        data.forEach((item, index) => {
            const cardY = y + (index * 25);

            doc.setFillColor(255, 255, 255);
            doc.roundedRect(15, cardY, 180, 20, 6, 6, 'F');
            
            doc.setDrawColor(242, 242, 247);
            doc.roundedRect(15, cardY, 180, 20, 6, 6, 'S');

            doc.setTextColor(29, 29, 31);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'semibold');
            doc.text(item.label, 25, cardY + 12);

            doc.setFont('helvetica', 'bold');
            doc.text(item.value, 180, cardY + 12, { align: 'right' });
        });
    }

    drawCashFlowChart(doc, projeto, y) {
        // Gráfico de linha simples
        doc.setFillColor(242, 242, 247);
        doc.rect(20, y, 170, 50, 'F');

        // Linha de break-even
        const breakEvenY = y + 25;
        doc.setDrawColor(52, 199, 89);
        doc.setLineWidth(2);
        doc.line(30, breakEvenY, 180, y + 10); // Linha ascendente

        doc.setTextColor(52, 199, 89);
        doc.setFontSize(10);
        doc.text('Retorno Positivo', 140, y + 15);
    }

    drawTimeline(doc, steps, y) {
        steps.forEach((step, index) => {
            const stepY = y + (index * 25);

            // Círculo do número
            doc.setFillColor(0, 122, 255);
            doc.circle(30, stepY + 5, 8, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(step.step, 30, stepY + 7, { align: 'center' });

            // Linha conectora (exceto último)
            if (index < steps.length - 1) {
                doc.setDrawColor(242, 242, 247);
                doc.setLineWidth(2);
                doc.line(30, stepY + 13, 30, stepY + 25);
            }

            // Conteúdo
            doc.setTextColor(29, 29, 31);
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text(step.title, 45, stepY + 3);

            doc.setTextColor(142, 142, 147);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(step.duration, 45, stepY + 10);
            doc.text(step.desc, 45, stepY + 17);
        });
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

// Integrar o gerador Apple ao sistema
window.applePDFGenerator = new ApplePDFGenerator();
window.modernPDFGenerator = window.applePDFGenerator; // Compatibilidade

console.log('✅ Apple PDF Generator carregado com sucesso');