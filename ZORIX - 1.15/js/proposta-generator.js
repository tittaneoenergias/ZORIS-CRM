// Gerador de Propostas PDF Avançado - LURIX CRM
class PropostaGenerator {
    constructor() {
        // Paleta de cores profissional LURIX
        this.colors = {
            // Cores principais
            primary: '#064B59',           // Azul petróleo LURIX
            secondary: '#E6FF28',         // Amarelo neon LURIX
            accent: '#0A7080',           // Azul petróleo claro
            
            // Cores neutras profissionais
            darkGray: '#2D3748',         // Cinza escuro para texto
            mediumGray: '#4A5568',       // Cinza médio
            lightGray: '#E2E8F0',       // Cinza claro para fundos
            offWhite: '#F7FAFC',         // Off-white para fundos
            
            // Cores de destaque
            success: '#38A169',          // Verde para valores positivos
            warning: '#D69E2E',          // Dourado para alertas
            info: '#3182CE',             // Azul para informações
            
            // RGB para gráficos
            primaryRGB: [6, 75, 89],     // Azul petróleo
            secondaryRGB: [230, 255, 40], // Amarelo neon
            accentRGB: [10, 112, 128],   // Azul claro
            successRGB: [56, 161, 105],  // Verde
            warningRGB: [214, 158, 46],  // Dourado
            infoRGB: [49, 130, 206]      // Azul info
        };

        // Imagens profissionais para uso na proposta
        this.images = {
            // Capa corporativa
            capaCorporativa: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            
            // Sistemas solares
            sistemaResidencial: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            paineisSolares: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            instalacaoTelhado: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            
            // Tecnologia e sustentabilidade
            tecnologiaSolar: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            energiaLimpa: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            sustentabilidade: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            
            // Gráficos e análises
            graficoFinanceiro: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            analiseInvestimento: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            
            // Elementos decorativos
            padraoProfissional: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRTJFOEYwIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4K'
        };
        
        // Configurações de tipografia
        this.fonts = {
            title: { size: 24, weight: 'bold' },
            subtitle: { size: 18, weight: 'bold' },
            heading: { size: 16, weight: 'bold' },
            subheading: { size: 14, weight: 'normal' },
            body: { size: 12, weight: 'normal' },
            caption: { size: 10, weight: 'normal' },
            large: { size: 20, weight: 'bold' }
        };
        
        // Margens e espaçamentos profissionais
        this.layout = {
            margin: { top: 25, right: 25, bottom: 25, left: 25 },
            contentWidth: 160, // A4 width - margins
            contentHeight: 247, // A4 height - margins
            sectionSpacing: 15,
            paragraphSpacing: 8,
            lineHeight: 1.4
        };
    }

    async loadLibraries() {
        console.log('Carregando bibliotecas PDF...');
        
        // Load jsPDF library
        if (!window.jsPDF && !window.jspdf) {
            console.log('Carregando jsPDF...');
            try {
                await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
                console.log('jsPDF carregado com sucesso');
            } catch (error) {
                console.error('Erro ao carregar jsPDF:', error);
                throw new Error('Falha ao carregar biblioteca jsPDF');
            }
        }

        // Load Chart.js for charts
        if (!window.Chart) {
            console.log('Carregando Chart.js...');
            try {
                await this.loadScript('https://cdn.jsdelivr.net/npm/chart.js');
                console.log('Chart.js carregado com sucesso');
            } catch (error) {
                console.warn('Chart.js não pôde ser carregado, usando gráficos simples');
            }
        }
        
        console.log('Bibliotecas carregadas');
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async gerarProposta(dadosProposta) {
        try {
            console.log('🚀 Iniciando geração de proposta avançada...', dadosProposta);
            
            await this.loadLibraries();
            
            // Verificar se jsPDF está disponível
            if (!window.jsPDF && !window.jspdf) {
                throw new Error('jsPDF não foi carregado corretamente');
            }
            
            const jsPDFConstructor = window.jsPDF || (window.jspdf && window.jspdf.jsPDF);
            if (!jsPDFConstructor) {
                throw new Error('Construtor jsPDF não encontrado');
            }
            
            console.log('📄 Criando documento PDF...');
            const doc = new jsPDFConstructor('p', 'mm', 'a4');
            
            // Gerar número da proposta
            const numeroProposta = this.gerarNumeroProposta();
            
            // Calcular dados financeiros
            const dadosCalculados = this.calcularDadosFinanceiros(dadosProposta);
            
            // PÁGINA 1: Capa
            await this.criarCapa(doc, dadosProposta, numeroProposta);
            
            // PÁGINA 2: Sumário Executivo
            doc.addPage();
            await this.criarSumarioExecutivo(doc, dadosProposta, dadosCalculados);
            
            // PÁGINA 3: Informações do Cliente e Projeto
            doc.addPage();
            await this.criarPaginaCliente(doc, dadosProposta);
            
            // PÁGINA 4: Como Funciona o Sistema Solar
            doc.addPage();
            await this.criarPaginaComoFunciona(doc);
            
            // PÁGINA 5: Componentes do Sistema
            doc.addPage();
            await this.criarPaginaComponentes(doc, dadosProposta);
            
            // PÁGINA 6: Análise Financeira e ROI
            doc.addPage();
            await this.criarPaginaAnaliseFinanceira(doc, dadosCalculados);
            
            // PÁGINA 7: Gráficos de Performance
            doc.addPage();
            await this.criarPaginaGraficos(doc, dadosCalculados);
            
            // PÁGINA 8: Cronograma e Próximos Passos
            doc.addPage();
            await this.criarPaginaCronograma(doc);
            
            // PÁGINA 9: Termos e Condições
            doc.addPage();
            await this.criarPaginaTermos(doc);
            
            // PÁGINA 10: Contato e Assinatura
            doc.addPage();
            await this.criarPaginaContato(doc, dadosProposta, numeroProposta);
            
            // Salvar PDF
            const nomeArquivo = `Proposta_LURIX_${numeroProposta}_${dadosProposta.cliente.nome.replace(/\s+/g, '_')}.pdf`;
            doc.save(nomeArquivo);
            
            // Salvar proposta no sistema
            await this.salvarProposta({
                ...dadosProposta,
                numeroProposta,
                nomeArquivo,
                dadosCalculados,
                dataGeracao: new Date().toISOString()
            });
            
            console.log('✅ Proposta gerada com sucesso!');
            return { success: true, numeroProposta, nomeArquivo };
            
        } catch (error) {
            console.error('❌ Erro ao gerar proposta:', error);
            throw error;
        }
    }

    // PÁGINA 1: CAPA MODERNA E INTERATIVA
    async criarCapa(doc, dados, numeroProposta) {
        const { margin, contentWidth, contentHeight } = this.layout;
        const pageWidth = 210;
        const pageHeight = 297;
        
        try {
            // ===== FUNDO PROFISSIONAL =====
            // Fundo principal em off-white
            doc.setFillColor(247, 250, 252);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');
            
            // Faixa lateral esquerda em azul petróleo
            doc.setFillColor(6, 75, 89);
            doc.rect(0, 0, 8, pageHeight, 'F');
            
            // Header com gradiente sutil
            doc.setFillColor(6, 75, 89);
            doc.rect(0, 0, pageWidth, 60, 'F');
            
            // Elemento decorativo no canto superior direito
            doc.setFillColor(230, 255, 40);
            doc.triangle(pageWidth-40, 0, pageWidth, 0, pageWidth, 40, 'F');
            
            // ===== IMAGEM CORPORATIVA NO HEADER =====
            // Tentativa de adicionar imagem de energia solar (se suportado)
            try {
                // Placeholder para futura implementação de imagens
                // Adicionar elementos visuais decorativos no lugar
                doc.setFillColor(255, 255, 255, 0.1);
                for (let i = 0; i < 3; i++) {
                    doc.circle(160 + (i * 15), 30, 8, 'F');
                }
            } catch (error) {
                console.log('Imagens não suportadas, usando elementos decorativos');
            }
            
            // ===== LOGO E BRANDING =====
            // Box do logo com sombra
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(25, 15, 80, 30, 4, 4, 'F');
            
            // Logo LURIX
            doc.setTextColor(6, 75, 89);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.text('LURIX', 35, 32);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(10, 112, 128);
            doc.text('ENERGIA SOLAR', 35, 39);
            
            // ===== TÍTULO PRINCIPAL =====
            // Título com background semi-transparente
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(20, 80, 170, 45, 6, 6, 'F');
            
            // Sombra do título
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.5);
            doc.roundedRect(21, 81, 170, 45, 6, 6, 'S');
            
            doc.setTextColor(45, 55, 72);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(28);
            doc.text('PROPOSTA COMERCIAL', 30, 100);
            
            doc.setTextColor(6, 75, 89);
            doc.setFontSize(18);
            doc.text('Sistema de Energia Solar Fotovoltaica', 30, 115);
            
            // ===== INFORMAÇÕES DO CLIENTE =====
            // Container principal das informações com sombra profissional
            doc.setFillColor(45, 55, 72, 0.1); // Sombra sutil
            doc.roundedRect(22, 142, 170, 100, 8, 8, 'F');
            
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(20, 140, 170, 100, 8, 8, 'F');
            
            // Borda com gradiente visual
            doc.setDrawColor(6, 75, 89);
            doc.setLineWidth(2);
            doc.roundedRect(20, 140, 170, 100, 8, 8, 'S');
            
            // Linha decorativa superior
            doc.setFillColor(230, 255, 40);
            doc.roundedRect(25, 145, 160, 4, 2, 2, 'F');
            
            // Cabeçalho da seção cliente com ícone
            doc.setFillColor(6, 75, 89);
            doc.roundedRect(25, 155, 160, 20, 4, 4, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text('👤 INFORMAÇÕES DO CLIENTE', 35, 168);
            
            // Nome do cliente
            doc.setTextColor(45, 55, 72);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text(dados.cliente.nome.toUpperCase(), 35, 190);
            
            // Detalhes do cliente
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(74, 85, 104);
            
            let yPos = 205;
            if (dados.cliente.endereco) {
                doc.text(`📍 ${dados.cliente.endereco}`, 35, yPos);
                yPos += 12;
            }
            if (dados.cliente.cidade && dados.cliente.estado) {
                doc.text(`🏙️ ${dados.cliente.cidade} - ${dados.cliente.estado}`, 35, yPos);
                yPos += 12;
            }
            if (dados.cliente.email) {
                doc.text(`📧 ${dados.cliente.email}`, 35, yPos);
                yPos += 12;
            }
            if (dados.cliente.telefone) {
                doc.text(`📱 ${dados.cliente.telefone}`, 35, yPos);
            }
            
            // ===== INFORMAÇÕES DO PROJETO =====
            // Container das especificações com design aprimorado
            doc.setFillColor(226, 232, 240);
            doc.roundedRect(22, 257, 85, 30, 6, 6, 'F'); // Sombra
            
            doc.setFillColor(49, 130, 206, 0.15);
            doc.roundedRect(20, 255, 85, 30, 6, 6, 'F');
            
            // Ícone de energia
            doc.setFillColor(49, 130, 206);
            doc.circle(30, 262, 4, 'F');
            
            doc.setTextColor(45, 55, 72);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text('⚡ POTÊNCIA DO SISTEMA', 37, 262);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(49, 130, 206);
            doc.text(`${dados.potenciaKwp || 0} kWp`, 25, 275);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(74, 85, 104);
            doc.text('Capacidade instalada', 25, 282);
            
            // Container do investimento aprimorado
            doc.setFillColor(226, 232, 240);
            doc.roundedRect(112, 257, 80, 30, 6, 6, 'F'); // Sombra
            
            doc.setFillColor(56, 161, 105, 0.15);
            doc.roundedRect(110, 255, 80, 30, 6, 6, 'F');
            
            // Ícone de investimento
            doc.setFillColor(56, 161, 105);
            doc.circle(120, 262, 4, 'F');
            
            doc.setTextColor(45, 55, 72);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text('💰 INVESTIMENTO', 127, 262);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(56, 161, 105);
            doc.text(this.formatCurrency(dados.valorInvestimento || 0), 115, 275);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(74, 85, 104);
            doc.text('Valor total do projeto', 115, 282);
            
            // ===== RODAPÉ PROFISSIONAL =====
            // Faixa inferior com gradiente
            doc.setFillColor(6, 75, 89);
            doc.rect(0, 285, pageWidth, 12, 'F');
            
            // Linha decorativa amarela
            doc.setFillColor(230, 255, 40);
            doc.rect(0, 285, pageWidth, 3, 'F');
            
            // Data e número da proposta
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.text(`📋 Proposta Nº ${numeroProposta}`, 25, 294);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.text(`📅 ${new Date().toLocaleDateString('pt-BR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}`, 90, 294);
            
            // Website/contato com ícones
            doc.setTextColor(230, 255, 40);
            doc.text('🌐 www.lurix.com.br', 135, 294);
            
            // Selo de qualidade
            doc.setFillColor(230, 255, 40);
            doc.circle(200, 291, 6, 'F');
            doc.setTextColor(6, 75, 89);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.text('✓', 197, 294);
            
        } catch (error) {
            console.warn('Erro ao criar capa profissional, usando capa simplificada:', error);
            this.criarCapaSimplificada(doc, dados, numeroProposta);
        }
    }
    
    // Método auxiliar para conversão de hex para RGB
    hexToRGB(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [0, 0, 0];
    }
    
    // Capa simplificada como fallback
    criarCapaSimplificada(doc, dados, numeroProposta) {
        doc.setFillColor(6, 75, 89);
        doc.rect(0, 0, 210, 297, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.text('LURIX ENERGIA SOLAR', 20, 50);
        
        doc.setFontSize(20);
        doc.text('PROPOSTA COMERCIAL', 20, 80);
        
        doc.setFontSize(16);
        doc.text(dados.cliente.nome, 20, 120);
        
        doc.setFontSize(12);
        doc.text(`Proposta: ${numeroProposta}`, 20, 140);
        doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 155);
    }
    
    // Método de formatação de moeda
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    }
    
    // Método auxiliar para criar cabeçalhos profissionais
    criarCabecalhoProfissional(doc, titulo, yPos = 20) {
        const { contentWidth } = this.layout;
        
        // Fundo do cabeçalho
        doc.setFillColor(6, 75, 89);
        doc.roundedRect(this.layout.margin.left, yPos - 8, contentWidth, 20, 3, 3, 'F');
        
        // Texto do cabeçalho
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(titulo, this.layout.margin.left + 5, yPos + 5);
        
        return yPos + 25; // Retorna próxima posição Y
    }
    
    // Método auxiliar para criar seções com bordas profissionais
    criarSecaoProfissional(doc, x, y, width, height, titulo = '') {
        // Sombra sutil
        doc.setFillColor(200, 200, 200);
        doc.roundedRect(x + 1, y + 1, width, height, 4, 4, 'F');
        
        // Container principal
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(x, y, width, height, 4, 4, 'F');
        
        // Borda
        doc.setDrawColor(226, 232, 240); // Light gray
        doc.setLineWidth(0.5);
        doc.roundedRect(x, y, width, height, 4, 4, 'S');
        
        // Título da seção se fornecido
        if (titulo) {
            doc.setFillColor(6, 75, 89);
            doc.roundedRect(x + 2, y + 2, width - 4, 15, 2, 2, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text(titulo, x + 5, y + 12);
        }
        
        return titulo ? y + 22 : y + 5; // Retorna posição Y para conteúdo
    }

    // PÁGINA 2: SUMÁRIO EXECUTIVO
    async criarSumarioExecutivo(doc, dados, dadosCalculados) {
        // Cabeçalho da página
        let yPos = this.criarCabecalhoProfissional(doc, 'SUMÁRIO EXECUTIVO');
        
        // ===== DESTAQUE PRINCIPAL - ECONOMIA =====
        // Container hero com design impactante
        doc.setFillColor(226, 232, 240);
        doc.roundedRect(27, yPos + 2, 160, 50, 8, 8, 'F'); // Sombra
        
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(25, yPos, 160, 50, 8, 8, 'F');
        
        // Borda com gradiente visual
        doc.setDrawColor(56, 161, 105);
        doc.setLineWidth(3);
        doc.roundedRect(25, yPos, 160, 50, 8, 8, 'S');
        
        // Header da seção com ícone grande
        doc.setFillColor(56, 161, 105);
        doc.roundedRect(30, yPos + 5, 150, 18, 4, 4, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text('💰 ECONOMIA PROJETADA ANUAL', 40, yPos + 16);
        
        // Valor principal destacado
        doc.setTextColor(56, 161, 105);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text(`${this.formatCurrency(dadosCalculados.economiaAnual)}`, 40, yPos + 35);
        
        // Informação adicional
        doc.setTextColor(74, 85, 104);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`💡 Economia total em 25 anos: ${this.formatCurrency(dadosCalculados.economiaAnual * 25)}`, 40, yPos + 44);
        
        yPos += 65;
        
        // ===== GRID DE INDICADORES FINANCEIROS =====
        const indicadores = [
            { 
                titulo: 'PAYBACK', 
                valor: `${dadosCalculados.paybackAnos} anos`,
                cor: [49, 130, 206], // Azul info
                descricao: 'Tempo de retorno',
                icone: '⏱️'
            },
            { 
                titulo: 'TIR', 
                valor: `${dadosCalculados.tirPorcentagem}%`,
                cor: [214, 158, 46], // Dourado
                descricao: 'Taxa interna de retorno',
                icone: '📈'
            },
            { 
                titulo: 'REDUÇÃO', 
                valor: '95%',
                cor: [56, 161, 105], // Verde
                descricao: 'Na conta de energia',
                icone: '⚡'
            }
        ];
        
        let xPos = 25;
        indicadores.forEach((ind, index) => {
            // Card com sombra e gradiente
            doc.setFillColor(200, 200, 200, 0.3);
            doc.roundedRect(xPos + 2, yPos + 2, 50, 40, 6, 6, 'F'); // Sombra
            
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(xPos, yPos, 50, 40, 6, 6, 'F');
            
            // Borda colorida
            doc.setDrawColor(ind.cor[0], ind.cor[1], ind.cor[2]);
            doc.setLineWidth(2);
            doc.roundedRect(xPos, yPos, 50, 40, 6, 6, 'S');
            
            // Header do card com cor do tema
            doc.setFillColor(ind.cor[0], ind.cor[1], ind.cor[2], 0.1);
            doc.roundedRect(xPos + 2, yPos + 2, 46, 12, 4, 4, 'F');
            
            // Ícone e título
            doc.setTextColor(ind.cor[0], ind.cor[1], ind.cor[2]);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.text(`${ind.icone} ${ind.titulo}`, xPos + 5, yPos + 10);
            
            // Valor principal destacado
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text(ind.valor, xPos + 5, yPos + 25);
            
            // Descrição
            doc.setTextColor(74, 85, 104);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            const descLines = doc.splitTextToSize(ind.descricao, 40);
            doc.text(descLines, xPos + 5, yPos + 32);
            
            xPos += 55;
        });
        
        yPos += 55;
        
        // ===== BENEFÍCIOS DESTACADOS =====
        // Container principal com design moderno
        doc.setFillColor(226, 232, 240);
        doc.roundedRect(27, yPos + 2, 160, 80, 8, 8, 'F'); // Sombra
        
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(25, yPos, 160, 80, 8, 8, 'F');
        
        // Header com gradiente
        doc.setFillColor(6, 75, 89);
        doc.roundedRect(30, yPos + 5, 150, 15, 4, 4, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text('🌟 PRINCIPAIS BENEFÍCIOS', 35, yPos + 15);
        
        const beneficios = [
            { icone: '🌱', texto: 'Energia 100% renovável', cor: [56, 161, 105] },
            { icone: '💰', texto: 'Valorização do imóvel +8%', cor: [214, 158, 46] },
            { icone: '🔧', texto: 'Garantia 25 anos', cor: [49, 130, 206] },
            { icone: '📱', texto: 'Monitoramento remoto', cor: [6, 75, 89] },
            { icone: '⚡', texto: 'Redução 95% conta luz', cor: [230, 67, 47] },
            { icone: '🛡️', texto: 'Proteção inflação energia', cor: [128, 90, 213] }
        ];
        
        let beneficioY = yPos + 25;
        beneficios.forEach((beneficio, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            
            const x = 35 + (col * 75);
            const y = beneficioY + (row * 15);
            
            // Mini card para cada benefício
            doc.setFillColor(beneficio.cor[0], beneficio.cor[1], beneficio.cor[2], 0.1);
            doc.roundedRect(x - 2, y - 7, 70, 12, 3, 3, 'F');
            
            // Bullet point colorido
            doc.setFillColor(beneficio.cor[0], beneficio.cor[1], beneficio.cor[2]);
            doc.circle(x + 2, y - 2, 2, 'F');
            
            doc.setTextColor(45, 55, 72);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.text(`${beneficio.icone} ${beneficio.texto}`, x + 7, y);
        });
        
        yPos += 95;
        
        // ===== RESUMO TÉCNICO =====
        // Container com design técnico
        doc.setFillColor(226, 232, 240);
        doc.roundedRect(27, yPos + 2, 160, 60, 8, 8, 'F'); // Sombra
        
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(25, yPos, 160, 60, 8, 8, 'F');
        
        // Borda técnica
        doc.setDrawColor(6, 75, 89);
        doc.setLineWidth(2);
        doc.roundedRect(25, yPos, 160, 60, 8, 8, 'S');
        
        // Header técnico
        doc.setFillColor(6, 75, 89);
        doc.roundedRect(30, yPos + 5, 150, 15, 4, 4, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text('⚙️ RESUMO TÉCNICO DO PROJETO', 35, yPos + 15);
        
        // Grid de especificações com ícones
        const specs = [
            { 
                icone: '⚡', 
                label: 'Potência instalada:', 
                valor: `${dados.potenciaKwp} kWp`,
                cor: [230, 67, 47]
            },
            { 
                icone: '📊', 
                label: 'Geração estimada/mês:', 
                valor: `${this.calcularGeracaoMensal(dados.potenciaKwp)} kWh`,
                cor: [49, 130, 206]
            },
            { 
                icone: '💰', 
                label: 'Investimento total:', 
                valor: this.formatCurrency(dados.valorInvestimento),
                cor: [56, 161, 105]
            },
            { 
                icone: '🏠', 
                label: 'Tipo de instalação:', 
                valor: (dados.tipoInstalacao || 'Telhado').toUpperCase(),
                cor: [214, 158, 46]
            }
        ];
        
        specs.forEach((spec, index) => {
            const row = Math.floor(index / 2);
            const col = index % 2;
            
            const x = 35 + (col * 75);
            const y = yPos + 25 + (row * 20);
            
            // Mini container para cada spec
            doc.setFillColor(spec.cor[0], spec.cor[1], spec.cor[2], 0.1);
            doc.roundedRect(x - 2, y - 8, 70, 16, 3, 3, 'F');
            
            // Ícone colorido
            doc.setTextColor(spec.cor[0], spec.cor[1], spec.cor[2]);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.text(spec.icone, x, y - 2);
            
            // Label
            doc.setTextColor(74, 85, 104);
            doc.text(spec.label, x + 8, y - 2);
            
            // Valor destacado
            doc.setTextColor(45, 55, 72);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.text(spec.valor, x + 8, y + 6);
        });
        
        // ===== RODAPÉ DA PÁGINA =====
        this.criarRodapeProfissional(doc, 2);
    }
    
    // Método auxiliar para calcular geração mensal
    calcularGeracaoMensal(potenciaKwp, irradiacao = 4.5) {
        // Fórmula: Potência (kWp) × Irradiação (h/dia) × 30 dias × 0.8 (fator de performance)
        return Math.round(potenciaKwp * irradiacao * 30 * 0.8);
    }
    
    // Método para criar rodapé profissional
    criarRodapeProfissional(doc, numeroPagina) {
        const pageHeight = 297;
        const { margin } = this.layout;
        
        // Linha decorativa
        doc.setDrawColor(6, 75, 89);
        doc.setLineWidth(1);
        doc.line(margin.left, pageHeight - 20, 210 - margin.right, pageHeight - 20);
        
        // Informações do rodapé
        doc.setTextColor(...this.colors.mediumGray);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        
        // Lado esquerdo - empresa
        doc.text('LURIX Energia Solar • www.lurix.com.br', margin.left, pageHeight - 12);
        
        // Lado direito - página
        doc.text(`Página ${numeroPagina}`, 210 - margin.right - 20, pageHeight - 12);
        
        // Data
        doc.text(new Date().toLocaleDateString('pt-BR'), 210 - margin.right - 40, pageHeight - 5);

    }

    // PÁGINA 3: INFORMAÇÕES DO CLIENTE E PROJETO
    async criarPaginaCliente(doc, dados) {
        this.criarCabecalho(doc, 'INFORMAÇÕES DO PROJETO');
        
        let yPos = 60;
        
        // Informações do cliente
        doc.setFillColor(249, 247, 242);
        doc.roundedRect(20, yPos, 80, 100, 5, 5, 'F');
        
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text('👤 DADOS DO CLIENTE', 25, yPos + 15);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        let clienteY = yPos + 25;
        
        doc.text(`Nome: ${dados.cliente.nome}`, 25, clienteY);
        clienteY += 10;
        
        if (dados.cliente.cpf_cnpj) {
            doc.text(`CPF/CNPJ: ${dados.cliente.cpf_cnpj}`, 25, clienteY);
            clienteY += 10;
        }
        
        if (dados.cliente.endereco) {
            doc.text(`Endereço: ${dados.cliente.endereco}`, 25, clienteY);
            clienteY += 10;
        }
        
        if (dados.cliente.telefone) {
            doc.text(`Telefone: ${dados.cliente.telefone}`, 25, clienteY);
            clienteY += 10;
        }
        
        // Informações do projeto
        doc.setFillColor(230, 255, 40);
        doc.roundedRect(110, yPos, 80, 100, 5, 5, 'F');
        
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text('⚡ DADOS TÉCNICOS', 115, yPos + 15);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        let projetoY = yPos + 25;
        
        doc.text(`Potência: ${dados.projeto?.potencia_kwp || '5.5'} kWp`, 115, projetoY);
        projetoY += 10;
        
        doc.text(`Tipo: ${dados.projeto?.tipo_instalacao || 'Residencial'}`, 115, projetoY);
        projetoY += 10;
        
        const consumoMensal = dados.cliente?.consumo_mensal || 450;
        doc.text(`Consumo Atual: ${consumoMensal} kWh/mês`, 115, projetoY);
        projetoY += 10;
        
        doc.text(`Irradiação Solar: 5.2 kWh/m²/dia`, 115, projetoY);
        projetoY += 10;
        
        doc.text(`Orientação: Sul`, 115, projetoY);
        
        yPos += 120;
        
        // Análise do consumo atual
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text('📊 ANÁLISE DO CONSUMO ATUAL', 20, yPos);
        
        yPos += 15;
        
        const valorConta = dados.cliente?.valor_conta || 380;
        
        doc.setFillColor(6, 75, 89);
        doc.roundedRect(20, yPos, 170, 80, 5, 5, 'F');
        
        doc.setTextColor(249, 247, 242);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        
        doc.text(`• Consumo mensal médio: ${consumoMensal} kWh`, 30, yPos + 20);
        doc.text(`• Valor médio da conta: R$ ${valorConta.toFixed(2)}`, 30, yPos + 35);
        doc.text(`• Gasto anual com energia: R$ ${(valorConta * 12).toFixed(2)}`, 30, yPos + 50);
        doc.text(`• Projeção de aumento anual: 8% (inflação energética)`, 30, yPos + 65);
        
        this.criarRodape(doc);
    }

    // PÁGINA 4: COMO FUNCIONA O SISTEMA SOLAR
    async criarPaginaComoFunciona(doc) {
        this.criarCabecalho(doc, 'COMO FUNCIONA O SISTEMA SOLAR');
        
        let yPos = 60;
        
        // Título da seção
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text('O sistema fotovoltaico converte a luz solar em energia elétrica através de um processo simples e eficiente:', 20, yPos);
        
        yPos += 20;
        
        // Etapas do funcionamento
        const etapas = [
            {
                numero: '1',
                titulo: 'CAPTAÇÃO DA LUZ SOLAR',
                descricao: 'Os painéis fotovoltaicos captam a radiação solar e convertem em energia elétrica contínua (DC).'
            },
            {
                numero: '2', 
                titulo: 'CONVERSÃO DA ENERGIA',
                descricao: 'O inversor converte a energia contínua (DC) em energia alternada (AC), compatível com sua residência.'
            },
            {
                numero: '3',
                titulo: 'DISTRIBUIÇÃO DE ENERGIA',
                descricao: 'A energia gerada alimenta os equipamentos da sua casa, reduzindo o consumo da rede elétrica.'
            },
            {
                numero: '4',
                titulo: 'COMPENSAÇÃO DE ENERGIA',
                descricao: 'O excesso de energia é injetado na rede elétrica, gerando créditos para uso posterior.'
            }
        ];
        
        etapas.forEach((etapa, index) => {
            // Círculo numerado
            doc.setFillColor(230, 255, 40);
            doc.circle(30, yPos + 10, 8, 'F');
            
            doc.setTextColor(6, 75, 89);
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(etapa.numero, 27, yPos + 13);
            
            // Título da etapa
            doc.setFontSize(12);
            doc.text(etapa.titulo, 45, yPos + 8);
            
            // Descrição
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            const linhas = doc.splitTextToSize(etapa.descricao, 140);
            doc.text(linhas, 45, yPos + 18);
            
            yPos += 35;
        });
        
        yPos += 10;
        
        // Box de vantagens
        doc.setFillColor(6, 75, 89);
        doc.roundedRect(20, yPos, 170, 60, 5, 5, 'F');
        
        doc.setTextColor(249, 247, 242);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text('🌟 VANTAGENS DO SISTEMA FOTOVOLTAICO', 30, yPos + 15);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text('• Energia limpa e renovável', 30, yPos + 30);
        doc.text('• Baixíssima manutenção', 100, yPos + 30);
        doc.text('• Tecnologia comprovada', 30, yPos + 40);
        doc.text('• Vida útil superior a 25 anos', 100, yPos + 40);
        doc.text('• Valorização do imóvel', 30, yPos + 50);
        doc.text('• Proteção contra inflação energética', 100, yPos + 50);
        
        this.criarRodape(doc);
    }

    // PÁGINA 5: COMPONENTES DO SISTEMA
    async criarPaginaComponentes(doc, dados) {
        this.criarCabecalho(doc, 'COMPONENTES DO SISTEMA');
        
        let yPos = 60;
        
        // Componentes principais
        const componentes = [
            {
                nome: 'PAINÉIS FOTOVOLTAICOS',
                quantidade: Math.ceil((dados.projeto?.potencia_kwp || 5.5) / 0.555),
                especificacao: '555W Monocristalino Tier 1',
                funcao: 'Convertem a luz solar em energia elétrica contínua',
                garantia: '25 anos de performance'
            },
            {
                nome: 'INVERSOR',
                quantidade: 1,
                especificacao: '5kW String com WiFi',
                funcao: 'Converte energia DC em AC e monitora o sistema',
                garantia: '10 anos de fábrica'
            },
            {
                nome: 'ESTRUTURA DE FIXAÇÃO',
                quantidade: 1,
                especificacao: 'Alumínio anodizado',
                funcao: 'Fixa os painéis no telhado com segurança',
                garantia: '20 anos contra corrosão'
            },
            {
                nome: 'STRING BOX',
                quantidade: 1,
                especificacao: 'CC/CA com DPS',
                funcao: 'Proteção e seccionamento do sistema',
                garantia: '5 anos'
            }
        ];
        
        componentes.forEach((comp, index) => {
            // Box do componente
            const boxColor = index % 2 === 0 ? [230, 255, 40] : [249, 247, 242];
            doc.setFillColor(...boxColor);
            doc.roundedRect(20, yPos, 170, 45, 3, 3, 'F');
            
            doc.setTextColor(6, 75, 89);
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(`${comp.quantidade}x ${comp.nome}`, 25, yPos + 12);
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Especificação: ${comp.especificacao}`, 25, yPos + 22);
            doc.text(`Função: ${comp.funcao}`, 25, yPos + 32);
            doc.text(`Garantia: ${comp.garantia}`, 25, yPos + 42);
            
            yPos += 50;
        });
        
        yPos += 10;
        
        // Monitoramento
        doc.setFillColor(6, 75, 89);
        doc.roundedRect(20, yPos, 170, 30, 5, 5, 'F');
        
        doc.setTextColor(249, 247, 242);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text('📱 MONITORAMENTO EM TEMPO REAL', 30, yPos + 15);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text('Aplicativo gratuito para acompanhar a geração, economia e performance do seu sistema 24/7', 30, yPos + 25);
        
        this.criarRodape(doc);
    }

    // PÁGINA 6: ANÁLISE FINANCEIRA E ROI
    async criarPaginaAnaliseFinanceira(doc, dadosCalculados) {
        this.criarCabecalho(doc, 'ANÁLISE FINANCEIRA');
        
        let yPos = 60;
        
        // Investimento vs Economia
        doc.setFillColor(230, 255, 40);
        doc.roundedRect(20, yPos, 80, 60, 5, 5, 'F');
        
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text('💰 INVESTIMENTO', 25, yPos + 15);
        
        doc.setFontSize(18);
        doc.text(`R$ ${dadosCalculados.valorInvestimento.toLocaleString('pt-BR')}`, 25, yPos + 35);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text('Pagamento facilitado', 25, yPos + 45);
        doc.text('À vista ou financiado', 25, yPos + 55);
        
        doc.setFillColor(6, 75, 89);
        doc.roundedRect(110, yPos, 80, 60, 5, 5, 'F');
        
        doc.setTextColor(249, 247, 242);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text('💸 ECONOMIA ANUAL', 115, yPos + 15);
        
        doc.setFontSize(18);
        doc.text(`R$ ${dadosCalculados.economiaAnual.toLocaleString('pt-BR')}`, 115, yPos + 35);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text('Economia garantida', 115, yPos + 45);
        doc.text('Por mais de 25 anos', 115, yPos + 55);
        
        yPos += 80;
        
        // Indicadores financeiros
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text('📈 INDICADORES FINANCEIROS', 20, yPos);
        
        yPos += 20;
        
        // TIR
        doc.setFillColor(249, 247, 242);
        doc.roundedRect(20, yPos, 50, 40, 3, 3, 'F');
        
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text('TIR', 30, yPos + 15);
        
        doc.setFontSize(16);
        doc.setTextColor(230, 255, 40);
        doc.text(`${dadosCalculados.tirPorcentagem}%`, 30, yPos + 30);
        
        // Payback
        doc.setFillColor(249, 247, 242);
        doc.roundedRect(80, yPos, 50, 40, 3, 3, 'F');
        
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text('PAYBACK', 90, yPos + 15);
        
        doc.setFontSize(16);
        doc.setTextColor(230, 255, 40);
        doc.text(`${dadosCalculados.paybackAnos} anos`, 90, yPos + 30);
        
        // VPL
        doc.setFillColor(249, 247, 242);
        doc.roundedRect(140, yPos, 50, 40, 3, 3, 'F');
        
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text('VPL (25 anos)', 150, yPos + 15);
        
        doc.setFontSize(16);
        doc.setTextColor(230, 255, 40);
        doc.text(`R$ ${dadosCalculados.vpl.toLocaleString('pt-BR')}`, 150, yPos + 30);
        
        yPos += 60;
        
        // Fluxo de caixa resumido
        doc.setFillColor(6, 75, 89);
        doc.roundedRect(20, yPos, 170, 60, 5, 5, 'F');
        
        doc.setTextColor(249, 247, 242);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text('📊 FLUXO DE CAIXA RESUMIDO (25 ANOS)', 30, yPos + 15);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`• Investimento inicial: R$ ${dadosCalculados.valorInvestimento.toLocaleString('pt-BR')}`, 30, yPos + 30);
        doc.text(`• Economia total: R$ ${dadosCalculados.economiaTotal25Anos.toLocaleString('pt-BR')}`, 30, yPos + 40);
        doc.text(`• Lucro líquido: R$ ${dadosCalculados.lucroLiquido.toLocaleString('pt-BR')}`, 30, yPos + 50);
        
        this.criarRodape(doc);
    }

    // PÁGINA 7: GRÁFICOS DE PERFORMANCE
    async criarPaginaGraficos(doc, dadosCalculados) {
        this.criarCabecalho(doc, 'PERFORMANCE E GERAÇÃO');
        
        let yPos = 60;
        
        // Título da seção
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(12);
        doc.text('Gráficos de geração mensal e retorno do investimento:', 20, yPos);
        
        yPos += 20;
        
        // Simulação de gráfico de geração mensal
        this.criarGraficoGeracaoMensal(doc, yPos, dadosCalculados);
        
        yPos += 90;
        
        // Simulação de gráfico de payback
        this.criarGraficoPayback(doc, yPos, dadosCalculados);
        
        this.criarRodape(doc);
    }

    // PÁGINA 8: CRONOGRAMA E PRÓXIMOS PASSOS
    async criarPaginaCronograma(doc) {
        this.criarCabecalho(doc, 'CRONOGRAMA DE INSTALAÇÃO');
        
        let yPos = 60;
        
        const etapas = [
            { etapa: 'Aprovação da Proposta', prazo: '1 dia', descricao: 'Assinatura do contrato e início do processo' },
            { etapa: 'Projeto Executivo', prazo: '5-7 dias', descricao: 'Elaboração do projeto técnico detalhado' },
            { etapa: 'Aprovação na Distribuidora', prazo: '15-30 dias', descricao: 'Solicitação de acesso junto à concessionária' },
            { etapa: 'Aquisição dos Equipamentos', prazo: '7-15 dias', descricao: 'Compra e logística dos materiais' },
            { etapa: 'Instalação do Sistema', prazo: '1-2 dias', descricao: 'Montagem e instalação dos equipamentos' },
            { etapa: 'Comissionamento', prazo: '1 dia', descricao: 'Testes finais e liberação do sistema' },
            { etapa: 'Conexão à Rede', prazo: '5-15 dias', descricao: 'Vistoria da concessionária e ativação' }
        ];
        
        // Cabeçalho da tabela
        doc.setFillColor(6, 75, 89);
        doc.roundedRect(20, yPos, 170, 15, 3, 3, 'F');
        
        doc.setTextColor(249, 247, 242);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text('ETAPA', 25, yPos + 10);
        doc.text('PRAZO', 80, yPos + 10);
        doc.text('DESCRIÇÃO', 120, yPos + 10);
        
        yPos += 15;
        
        etapas.forEach((item, index) => {
            const bgColor = index % 2 === 0 ? [249, 247, 242] : [230, 255, 40];
            doc.setFillColor(...bgColor);
            doc.rect(20, yPos, 170, 15, 'F');
            
            doc.setTextColor(6, 75, 89);
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.text(item.etapa, 25, yPos + 10);
            doc.text(item.prazo, 80, yPos + 10);
            
            const descricaoLinhas = doc.splitTextToSize(item.descricao, 65);
            doc.text(descricaoLinhas, 120, yPos + 10);
            
            yPos += 15;
        });
        
        yPos += 20;
        
        // Observações importantes
        doc.setFillColor(230, 255, 40);
        doc.roundedRect(20, yPos, 170, 40, 5, 5, 'F');
        
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text('⚠️ OBSERVAÇÕES IMPORTANTES:', 30, yPos + 15);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text('• Prazo total estimado: 45-60 dias após assinatura do contrato', 30, yPos + 25);
        doc.text('• Prazos podem variar conforme disponibilidade da concessionária', 30, yPos + 35);
        
        this.criarRodape(doc);
    }

    // PÁGINA 9: TERMOS E CONDIÇÕES
    async criarPaginaTermos(doc) {
        this.criarCabecalho(doc, 'TERMOS E CONDIÇÕES');
        
        let yPos = 60;
        
        const termos = [
            {
                titulo: '📋 VALIDADE DA PROPOSTA',
                conteudo: 'Esta proposta tem validade de 30 dias a partir da data de emissão. Após este período, preços e condições podem sofrer alterações.'
            },
            {
                titulo: '💳 CONDIÇÕES DE PAGAMENTO',
                conteudo: 'Pagamento à vista com desconto ou parcelado em até 60x. Entrada de 30% na assinatura do contrato, 40% no início da instalação e 30% na finalização.'
            },
            {
                titulo: '🔧 GARANTIAS',
                conteudo: 'Painéis: 25 anos de performance. Inversor: 10 anos. Instalação: 5 anos. Estruturas: 20 anos contra corrosão.'
            },
            {
                titulo: '📦 ESCOPO DO FORNECIMENTO',
                conteudo: 'Inclui todos os equipamentos, materiais, mão de obra especializada, projeto executivo, homologação junto à concessionária e comissionamento.'
            },
            {
                titulo: '🏗️ CONDIÇÕES DA INSTALAÇÃO',
                conteudo: 'Telhado em boas condições estruturais, acesso adequado, ponto de energia próximo. Alterações estruturais não inclusas.'
            },
            {
                titulo: '⚡ RESPONSABILIDADES DO CLIENTE',
                conteudo: 'Fornecer documentação necessária, garantir acesso ao local, disponibilizar ponto de energia e manter a área limpa durante instalação.'
            }
        ];
        
        termos.forEach((termo, index) => {
            doc.setTextColor(6, 75, 89);
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(termo.titulo, 20, yPos);
            
            yPos += 10;
            
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            const linhas = doc.splitTextToSize(termo.conteudo, 170);
            doc.text(linhas, 20, yPos);
            
            yPos += linhas.length * 5 + 10;
        });
        
        this.criarRodape(doc);
    }

    // PÁGINA 10: CONTATO E ASSINATURA
    async criarPaginaContato(doc, dados, numeroProposta) {
        this.criarCabecalho(doc, 'APROVAÇÃO E CONTATO');
        
        let yPos = 60;
        
        // Dados para contato
        doc.setFillColor(6, 75, 89);
        doc.roundedRect(20, yPos, 170, 80, 5, 5, 'F');
        
        doc.setTextColor(249, 247, 242);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text('📞 LURIX ENERGIA SOLAR', 30, yPos + 20);
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text('📧 comercial@lurixcrm.com', 30, yPos + 35);
        doc.text('📱 (11) 99999-9999', 30, yPos + 45);
        doc.text('🌐 www.lurixcrm.com', 30, yPos + 55);
        doc.text('📍 São Paulo - SP', 30, yPos + 65);
        
        yPos += 100;
        
        // Campos de assinatura
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text('✍️ APROVAÇÃO DA PROPOSTA', 20, yPos);
        
        yPos += 20;
        
        // Campo do cliente
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text('CLIENTE:', 20, yPos);
        doc.line(20, yPos + 20, 90, yPos + 20);
        doc.text(dados.cliente.nome, 20, yPos + 25);
        
        doc.text('DATA:', 100, yPos);
        doc.line(100, yPos + 20, 140, yPos + 20);
        doc.text('___/___/_____', 100, yPos + 25);
        
        doc.text('ASSINATURA:', 150, yPos);
        doc.line(150, yPos + 20, 190, yPos + 20);
        
        yPos += 40;
        
        // Campo da empresa
        doc.text('LURIX ENERGIA SOLAR:', 20, yPos);
        doc.line(20, yPos + 20, 90, yPos + 20);
        
        doc.text('DATA:', 100, yPos);
        doc.line(100, yPos + 20, 140, yPos + 20);
        
        doc.text('ASSINATURA:', 150, yPos);
        doc.line(150, yPos + 20, 190, yPos + 20);
        
        yPos += 50;
        
        // Agradecimento
        doc.setFillColor(230, 255, 40);
        doc.roundedRect(20, yPos, 170, 30, 5, 5, 'F');
        
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text('🤝 Obrigado pela confiança!', 30, yPos + 15);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text('Juntos, vamos construir um futuro mais sustentável com energia solar.', 30, yPos + 25);
        
        this.criarRodape(doc);
    }

    // Função auxiliar para criar gráfico de geração mensal
    criarGraficoGeracaoMensal(doc, yPos, dados) {
        // Título do gráfico
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text('📊 GERAÇÃO MENSAL ESTIMADA (kWh)', 20, yPos);
        
        // Dados de irradiação por mês (São Paulo)
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const geracao = [580, 520, 610, 480, 420, 380, 410, 460, 480, 550, 590, 620]; // kWh por mês
        
        yPos += 15;
        
        // Desenhar gráfico simples de barras
        const graficoPosX = 20;
        const graficoWidth = 170;
        const graficoHeight = 60;
        const barWidth = graficoWidth / 12 - 2;
        
        // Fundo do gráfico
        doc.setFillColor(249, 247, 242);
        doc.rect(graficoPosX, yPos, graficoWidth, graficoHeight, 'F');
        
        // Barras
        const maxGeracao = Math.max(...geracao);
        geracao.forEach((valor, index) => {
            const barHeight = (valor / maxGeracao) * (graficoHeight - 10);
            const barX = graficoPosX + (index * (barWidth + 2)) + 5;
            const barY = yPos + graficoHeight - barHeight - 5;
            
            // Cor da barra (gradiente visual simulado)
            doc.setFillColor(230, 255, 40);
            doc.rect(barX, barY, barWidth, barHeight, 'F');
            
            // Labels dos meses
            doc.setTextColor(6, 75, 89);
            doc.setFontSize(7);
            doc.text(meses[index], barX + 1, yPos + graficoHeight + 8);
            
            // Valores
            doc.setFontSize(6);
            doc.text(valor.toString(), barX, barY - 2);
        });
        
        // Média anual
        const mediaAnual = geracao.reduce((a, b) => a + b, 0);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Geração anual total: ${mediaAnual.toLocaleString('pt-BR')} kWh`, graficoPosX, yPos + graficoHeight + 20);
    }

    // Função auxiliar para criar gráfico de payback
    criarGraficoPayback(doc, yPos, dados) {
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text('📈 RETORNO DO INVESTIMENTO', 20, yPos);
        
        yPos += 15;
        
        // Gráfico simples de linha do payback
        const graficoPosX = 20;
        const graficoWidth = 170;
        const graficoHeight = 50;
        
        // Fundo
        doc.setFillColor(249, 247, 242);
        doc.rect(graficoPosX, yPos, graficoWidth, graficoHeight, 'F');
        
        // Linha do investimento
        doc.setDrawColor(255, 0, 0);
        doc.setLineWidth(1);
        doc.line(graficoPosX, yPos + 10, graficoPosX + graficoWidth, yPos + 10);
        
        // Linha da economia acumulada
        doc.setDrawColor(0, 255, 0);
        const paybackPoint = (dados.paybackAnos / 25) * graficoWidth;
        doc.line(graficoPosX, yPos + graficoHeight - 10, graficoPosX + paybackPoint, yPos + 10);
        doc.line(graficoPosX + paybackPoint, yPos + 10, graficoPosX + graficoWidth, yPos + 10);
        
        // Legenda
        doc.setDrawColor(0, 0, 0);
        doc.setTextColor(6, 75, 89);
        doc.setFontSize(8);
        doc.text('Investimento inicial', graficoPosX, yPos + graficoHeight + 10);
        doc.text('Economia acumulada', graficoPosX + 60, yPos + graficoHeight + 10);
        doc.text(`Payback: ${dados.paybackAnos} anos`, graficoPosX + 120, yPos + graficoHeight + 10);
    }

    // Funções auxiliares para layout
    criarCabecalho(doc, titulo) {
        // Faixa superior
        doc.setFillColor(6, 75, 89);
        doc.rect(0, 0, 210, 35, 'F');
        
        // Logo
        doc.setTextColor(249, 247, 242);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text('LURIX', 20, 15);
        
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text('ENERGIA SOLAR', 20, 22);
        
        // Título da página
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(titulo, 20, 45);
        
        // Linha decorativa
        doc.setFillColor(230, 255, 40);
        doc.rect(20, 48, 170, 2, 'F');
    }

    criarRodape(doc) {
        doc.setFillColor(6, 75, 89);
        doc.rect(0, 280, 210, 17, 'F');
        
        doc.setTextColor(249, 247, 242);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text('LURIX CRM - Sistema de Gestão para Energia Solar', 20, 290);
        doc.text('www.lurixcrm.com | comercial@lurixcrm.com | (11) 99999-9999', 120, 290);
    }

    // Cálculos financeiros
    calcularDadosFinanceiros(dados) {
        const potencia = dados.projeto?.potencia_kwp || 5.5;
        const consumoMensal = dados.cliente?.consumo_mensal || 450;
        const valorConta = dados.cliente?.valor_conta || 380;
        
        // Cálculos básicos
        const valorPorKwp = 5000; // R$ por kWp instalado
        const valorInvestimento = potencia * valorPorKwp;
        const geracaoMensalKwh = potencia * 150; // Estimativa conservadora
        const economiaAnual = valorConta * 12 * 0.9; // 90% de economia
        
        // Indicadores financeiros
        const paybackAnos = Math.round((valorInvestimento / economiaAnual) * 100) / 100;
        const tirPorcentagem = Math.round((economiaAnual / valorInvestimento) * 100 * 100) / 100;
        
        // VPL calculado para 25 anos com taxa de desconto de 8%
        let vpl = -valorInvestimento;
        const taxaDesconto = 0.08;
        const inflacaoEnergia = 0.08;
        
        for (let ano = 1; ano <= 25; ano++) {
            const economiaAnoAjustada = economiaAnual * Math.pow(1 + inflacaoEnergia, ano - 1);
            vpl += economiaAnoAjustada / Math.pow(1 + taxaDesconto, ano);
        }
        
        const economiaTotal25Anos = economiaAnual * 25 * 1.5; // Com inflação energética
        const lucroLiquido = economiaTotal25Anos - valorInvestimento;
        
        return {
            valorInvestimento: Math.round(valorInvestimento),
            geracaoMensalKwh: Math.round(geracaoMensalKwh),
            economiaAnual: Math.round(economiaAnual),
            paybackAnos,
            tirPorcentagem,
            vpl: Math.round(vpl),
            economiaTotal25Anos: Math.round(economiaTotal25Anos),
            lucroLiquido: Math.round(lucroLiquido)
        };
    }

    gerarNumeroProposta() {
        const ano = new Date().getFullYear();
        const mes = String(new Date().getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `LX${ano}${mes}${random}`;
    }

    async salvarProposta(dadosProposta) {
        try {
            // Salvar no localStorage
            const propostas = JSON.parse(localStorage.getItem('propostas') || '[]');
            propostas.push(dadosProposta);
            localStorage.setItem('propostas', JSON.stringify(propostas));
            
            console.log('Proposta salva com sucesso');
        } catch (error) {
            console.warn('Erro ao salvar proposta:', error);
        }
    }
}

// Inicializar a instância global
console.log('Criando instância do PropostaGenerator...');
window.propostaGenerator = new PropostaGenerator();
console.log('Instância criada:', window.propostaGenerator ? 'PropostaGenerator' : 'Erro');