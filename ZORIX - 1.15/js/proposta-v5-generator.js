/**
 * ZORIX CRM - Gerador de Proposta Premium v5.0
 * Nova versão com gráficos mensais, campo de assinatura e impressão A4
 * Mantém cores ZORIX e inclui numeração automática de propostas
 */

class PropostaGeneratorV5 {
    constructor() {
        // Paleta de cores ZORIX ORIGINAL
        this.colors = {
            amareloNeon: '#E6FF28',      // Destaques e números importantes
            azulPetroleo: '#064B59',     // Títulos e menus
            brancoSujo: '#F9F7F2',       // Fundo principal
            cinzaMedio: '#898A90',       // Textos auxiliares
            branco: '#FFFFFF',
            preto: '#000000',
            verde: '#00C851',            // Economia e sustentabilidade
            vermelho: '#FF4444',         // Alertas
            azulClaro: '#007AFF'         // Links e informações
        };

        this.meses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        console.log('🎨 Proposta Generator v5.0 inicializado');
    }

    /**
     * Gera proposta premium completa
     */
    async gerarPropostaPremium(projeto, cliente) {
        try {
            console.log('🚀 Gerando Proposta Premium...', { projeto, cliente });

            // Validar e normalizar dados de entrada
            const dadosValidados = this.validarEPrepararDados(projeto, cliente);
            
            // Calcular dados financeiros
            const dadosFinanceiros = this.calcularDadosFinanceiros(dadosValidados.projeto);
            
            // Gerar número da proposta
            const numeroProposta = this.gerarNumeroProposta();
            
            // Criar nova aba com a proposta
            const novaAba = window.open('', '_blank');
            
            if (!novaAba) {
                console.warn('⚠️ Pop-up bloqueado, mas proposta foi processada');
                alert('Pop-up bloqueado! Permita pop-ups para este site e tente novamente.');
                return { success: false, error: 'Pop-up bloqueado', numeroProposta };
            }

            // Gerar HTML completo da proposta
            const htmlProposta = this.gerarHTMLCompleto({
                cliente: dadosValidados.cliente,
                projeto: dadosValidados.projeto,
                financeiro: dadosFinanceiros,
                numeroProposta: numeroProposta,
                dataGeracao: new Date().toLocaleDateString('pt-BR')
            });

            // Escrever HTML na nova aba
            novaAba.document.write(htmlProposta);
            novaAba.document.close();

            // Adicionar título à aba
            const nomeCliente = dadosValidados.cliente.nome || 'Cliente';
            novaAba.document.title = `Proposta ${numeroProposta} - ${nomeCliente}`;

            console.log('✅ Proposta Premium gerada com sucesso!');
            return { success: true, numeroProposta };

        } catch (error) {
            console.error('❌ Erro ao gerar Proposta Premium:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Valida e prepara dados de entrada
     */
    validarEPrepararDados(dadosProjeto, dadosCliente) {
        console.log('🔍 Dados recebidos:', { dadosProjeto, dadosCliente });
        
        const projeto = {
            id: dadosProjeto?.id || 'proj_default',
            nome_projeto: dadosProjeto?.titulo || `Sistema Solar - ${dadosCliente?.nome || 'Cliente'}`,
            potencia_kwp: this.validarNumero(dadosProjeto?.kWp, 5.5),
            tipo_instalacao: dadosProjeto?.tipo_instalacao || 'telhado',
            tipo_telhado: dadosProjeto?.tipo_telhado || 'metalico',
            media_consumo: this.validarNumero(dadosProjeto?.media_consumo || dadosProjeto?.consumo_medio_kwh_mes, 450),
            geracao_estimada: this.validarNumero(dadosProjeto?.geracao_media_mensal, 825),
            economia_mensal: this.validarNumero(dadosProjeto?.economia_mensal, 380),
            valor_investimento: this.validarNumero(dadosProjeto?.preco_venda_total, 27500),
            modulos: dadosProjeto?.modulos || [],
            inversores: dadosProjeto?.inversores || [],
            outros_materiais: dadosProjeto?.outros_materiais || '',
            cidade: dadosProjeto?.cidade || 'São Paulo',
            estado: dadosProjeto?.estado || 'SP',
            concessionaria: dadosProjeto?.concessionaria || 'Concessionária Local',
            endereco: dadosProjeto?.endereco || '',
            consumo_medio_kWh_mes: this.validarNumero(dadosProjeto?.media_consumo || dadosProjeto?.consumo_medio_kwh_mes, 450),
            tarifa_kWh: this.validarNumero(dadosProjeto?.tarifa_kWh, 0.85),
            fator_sombra_perdas: this.validarNumero(dadosProjeto?.fator_sombra_perdas, 0.82),
            geracao_mensal: dadosProjeto?.geracao_mensal || {},
            preco_venda_total: this.validarNumero(dadosProjeto?.preco_venda_total, 27500)
        };

        const cliente = {
            id: dadosCliente?.id || 'cli_default',
            nome: dadosCliente?.nome || 'Nome do Cliente',
            tipo_pessoa: dadosCliente?.tipo_pessoa || 'fisica',
            endereco: dadosCliente?.endereco || 'Endereço não informado',
            telefone: dadosCliente?.telefone || '(11) 99999-9999',
            email: dadosCliente?.email || 'cliente@email.com',
            consumo_mensal: this.validarNumero(dadosCliente?.consumo_mensal || dadosProjeto?.consumo_medio_kwh_mes, 450),
            valor_conta: this.validarNumero(dadosCliente?.valor_conta || dadosProjeto?.valor_conta, 380)
        };

        console.log('✅ Dados validados:', { projeto, cliente });
        return { projeto, cliente };
    }

    /**
     * Valida se um valor é um número válido, caso contrário retorna o padrão
     */
    validarNumero(valor, padrao) {
        const numero = parseFloat(valor);
        return (isNaN(numero) || numero <= 0) ? padrao : numero;
    }

    /**
     * Calcula dados financeiros
     */
    calcularDadosFinanceiros(dadosProjeto) {
        try {
            const potencia = this.validarNumero(dadosProjeto?.potencia_kwp, 5.5);
            const valorPorKwp = 5000; // R$ 5.000 por kWp
            const valorInvestimento = this.validarNumero(dadosProjeto?.valor_investimento, potencia * valorPorKwp);
            const economiaMensal = this.validarNumero(dadosProjeto?.economia_mensal, 380);
            const economiaAnual = economiaMensal * 12;
            
            const paybackAnos = economiaAnual > 0 ? 
                Math.round((valorInvestimento / economiaAnual) * 100) / 100 : 
                99;
                
            const tirPorcentagem = valorInvestimento > 0 ? 
                Math.round((economiaAnual / valorInvestimento) * 100 * 100) / 100 : 
                0;
            
            const economiaTotal25Anos = economiaAnual * 25 * 1.5;
            const lucroLiquido = economiaTotal25Anos - valorInvestimento;
            const roi = valorInvestimento > 0 ? 
                Math.round((lucroLiquido / valorInvestimento) * 100) : 
                0;
            
            return {
                valorInvestimento: Math.round(valorInvestimento),
                economiaAnual: Math.round(economiaAnual),
                paybackAnos: Math.max(paybackAnos, 0),
                tirPorcentagem: Math.max(tirPorcentagem, 0),
                economiaTotal25Anos: Math.round(economiaTotal25Anos),
                lucroLiquido: Math.round(lucroLiquido),
                roi: roi,
                economia_mensal: economiaMensal
            };
            
        } catch (error) {
            console.warn('⚠️ Erro ao calcular dados financeiros, usando valores padrão:', error);
            return {
                valorInvestimento: 27500,
                economiaAnual: 4104,
                paybackAnos: 6.7,
                tirPorcentagem: 14.9,
                economiaTotal25Anos: 153900,
                lucroLiquido: 126400,
                roi: 459,
                economia_mensal: 380
            };
        }
    }

    /**
     * Gera número único da proposta no formato PROP-AAAAMMDD-SEQ
     */
    gerarNumeroProposta() {
        const agora = new Date();
        const ano = agora.getFullYear();
        const mes = String(agora.getMonth() + 1).padStart(2, '0');
        const dia = String(agora.getDate()).padStart(2, '0');
        
        // Obter sequencial do dia
        const chaveData = `${ano}${mes}${dia}`;
        let sequencial = parseInt(localStorage.getItem(`zorix:seq_${chaveData}`) || '0') + 1;
        localStorage.setItem(`zorix:seq_${chaveData}`, sequencial.toString());
        
        return `PROP-${ano}${mes}${dia}-${String(sequencial).padStart(3, '0')}`;
    }

    /**
     * Gera HTML completo da proposta
     */
    gerarHTMLCompleto(dados) {
        return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proposta ${dados.numeroProposta} - ${dados.cliente.nome}</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- jsPDF for PDF generation -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    
    <style>
        :root {
            --amarelo-neon: #E6FF28;
            --azul-petroleo: #064B59;
            --branco-sujo: #F9F7F2;
            --cinza-medio: #898A90;
        }
        
        .pdf-button {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: linear-gradient(45deg, var(--azul-petroleo), #00C851);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 50px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }
        
        .pdf-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }
        
        body { 
            font-family: 'Inter', sans-serif; 
            background: var(--branco-sujo);
            line-height: 1.6;
        }
        
        .gradient-bg {
            background: linear-gradient(135deg, var(--azul-petroleo) 0%, #0A7080 100%);
        }
        
        .neon-glow {
            box-shadow: 0 0 20px rgba(230, 255, 40, 0.3);
        }
        
        .section-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(6, 75, 89, 0.1);
            transition: all 0.3s ease;
        }
        
        .section-card:hover {
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12);
            transform: translateY(-2px);
        }
        
        .highlight-number {
            color: var(--amarelo-neon);
            background: rgba(6, 75, 89, 0.8);
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
        }
        
        .solar-animation {
            animation: solarPulse 3s ease-in-out infinite;
        }
        
        @keyframes solarPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        .chart-container {
            position: relative;
            height: 400px;
            width: 100%;
            background: rgba(249, 247, 242, 0.5);
            border-radius: 12px;
            padding: 20px;
        }
        
        .smooth-transition {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }
        
        @media print {
            .no-print { display: none !important; }
            .pdf-button { display: none !important; }
            
            @page {
                size: A4;
                margin: 12mm;
            }
            
            /* Preservar cores e fundos exatos da tela */
            * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* Manter estrutura original - não forçar reset */
            body {
                font-size: 12pt !important;
                line-height: 1.3 !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #F9F7F2 !important;
            }
            
            /* Preservar estrutura de blocos como na tela */
            div, section, article {
                display: block !important;
            }
            
            /* Preservar elementos inline como na tela */  
            span, strong, em, i, b, small {
                display: inline !important;
            }
            
            /* Manter flexbox e grid como na tela quando necessário */
            .grid {
                display: grid !important;
            }
            
            .flex {
                display: flex !important;
            }
            
            /* Preservar layout original dos containers */
            .max-w-6xl {
                max-width: 1152px !important;
                margin: 0 auto !important;
            }
            
            .max-w-4xl {
                max-width: 896px !important;  
                margin: 0 auto !important;
            }
            
            /* Manter espaçamentos originais reduzidos proporcionalmente */
            .py-20 { 
                padding-top: 24pt !important;
                padding-bottom: 24pt !important;
            }
            .px-8 { 
                padding-left: 12pt !important;
                padding-right: 12pt !important;
            }
            .p-8 { padding: 12pt !important; }
            .p-6 { padding: 9pt !important; }
            .p-4 { padding: 6pt !important; }
            
            .mb-16 { margin-bottom: 16pt !important; }
            .mb-12 { margin-bottom: 12pt !important; }
            .mb-8 { margin-bottom: 8pt !important; }
            .mb-6 { margin-bottom: 6pt !important; }
            .mb-4 { margin-bottom: 4pt !important; }
            .mb-2 { margin-bottom: 2pt !important; }
            
            /* Preservar hierarquia de títulos */
            .text-5xl { font-size: 24pt !important; }
            .text-4xl { font-size: 20pt !important; }
            .text-3xl { font-size: 18pt !important; }
            .text-2xl { font-size: 16pt !important; }
            .text-xl { font-size: 14pt !important; }
            .text-lg { font-size: 13pt !important; }
            .text-sm { font-size: 11pt !important; }
            .text-xs { font-size: 10pt !important; }
            
            /* Manter alinhamentos */
            .text-center { text-align: center !important; }
            .text-left { text-align: left !important; }
            .text-right { text-align: right !important; }
            
            /* QUEBRAS DE PÁGINA RESPEITANDO A ESTRUTURA ORIGINAL */
            
            /* Página 1: CAPA - manter layout idêntico à tela */
            .gradient-bg:first-child {
                page-break-after: always !important;
                min-height: 100vh !important;
                background: linear-gradient(135deg, #064B59, #0A5B69) !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                text-align: center !important;
            }
            
            /* Seções principais - uma por página respeitando títulos */
            #como-funciona {
                page-break-before: always !important;
                page-break-after: always !important;
                background: #F9F7F2 !important;
            }
            
            #dados-consumo {
                page-break-before: always !important;
                page-break-after: always !important;
                background: #F9F7F2 !important;
            }
            
            #projecoes {
                page-break-before: always !important;
                page-break-after: always !important;
                background: #F9F7F2 !important;
            }
            
            #investimento {
                page-break-before: always !important;
                page-break-after: always !important;
                background: #F9F7F2 !important;
            }
            
            #garantias {
                page-break-before: always !important;
                page-break-after: always !important;
                background: #F9F7F2 !important;
            }
            
            #contato {
                page-break-before: always !important;
                background: #F9F7F2 !important;
            }
            
            /* Preservar hierarquia de títulos original */
            h1, h2, h3, h4, h5, h6 {
                page-break-after: avoid !important;
                font-weight: bold !important;
            }
            
            /* Manter cores dos destaques como na tela */
            .highlight-number {
                background: #E6FF28 !important;
                color: #064B59 !important;
                padding: 8px 16px !important;
                border-radius: 50px !important;
                font-weight: bold !important;
                display: inline-block !important;
            }
            
            /* Preservar formatação como na tela */
            strong, b {
                font-weight: bold !important;
            }
            
            em, i:not(.fas):not(.far) {
                font-style: italic !important;
            }
            
            /* Ícones FontAwesome mantidos */
            .fas, .far {
                font-family: "Font Awesome 5 Free" !important;
            }
            
            /* Listas mantendo estrutura original */
            ul, ol {
                list-style-position: outside !important;
                padding-left: 16pt !important;
            }
            
            li {
                display: list-item !important;
                margin: 2pt 0 !important;
            }
            
            /* Tabelas preservando estrutura original */
            table {
                border-collapse: collapse !important;
                width: 100% !important;
                margin: 12pt 0 !important;
                page-break-inside: avoid !important;
            }
            
            th {
                background-color: #064B59 !important;
                color: white !important;
                padding: 8pt !important;
                font-weight: bold !important;
            }
            
            td {
                padding: 8pt !important;
                border: 1px solid #ddd !important;
                vertical-align: top !important;
            }
            
            /* Seções e cards preservando cores originais */
            .section-card {
                background: white !important;
                border: 1px solid rgba(0,0,0,0.1) !important;
                border-radius: 12pt !important;
                box-shadow: 0 4pt 6pt rgba(0,0,0,0.1) !important;
                margin: 12pt 0 !important;
                padding: 16pt !important;
                page-break-inside: avoid !important;
            }
            
            /* Cores de fundo preservadas */
            .bg-gray-50 {
                background-color: #F9F9F9 !important;
            }
            
            .bg-green-50 {
                background-color: #F0FDF4 !important;
            }
            
            .bg-blue-50 {
                background-color: #EFF6FF !important;
            }
            
            .bg-yellow-50 {
                background-color: #FFFBEB !important;
            }
            
            .bg-blue-50 {
                background-color: #EFF6FF !important;
            }
            
            /* Grid responsivo mantido quando possível */
            .grid-cols-1 {
                display: block !important;
            }
            
            .grid-cols-2 {
                display: block !important;
            }
            
            .grid-cols-3 {
                display: block !important;
            }
            
            .grid > div {
                margin-bottom: 8pt !important;
                page-break-inside: avoid !important;
            }
            
            /* Flexbox simplificado mas organizado */
            .flex {
                display: block !important;
            }
            
            .flex > div {
                margin-bottom: 6pt !important;
            }
            
            /* Container de gráficos otimizado */
            .chart-container {
                background: white !important;
                border: 1px solid #E5E7EB !important;
                border-radius: 8pt !important;
                padding: 12pt !important;
                margin: 12pt 0 !important;
                height: 200pt !important;
                page-break-inside: avoid !important;
            }
            
            /* Evitar quebras inadequadas */
            .page-break-before {
                page-break-before: always !important;
            }
            
            .page-break-after {
                page-break-after: always !important;
            }
            
            .page-break-inside-avoid {
                page-break-inside: avoid !important;
            }
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Botão PDF -->
    <button onclick="gerarPDF()" class="pdf-button no-print">
        <i class="fas fa-file-pdf mr-2"></i>
        Gerar PDF
    </button>
    ${this.gerarCapa(dados)}
    ${this.gerarSumario()}
    ${this.gerarComoFunciona()}
    ${this.gerarDadosConsumo(dados)}
    ${this.gerarProjecaoFinanceira(dados)}
    ${this.gerarInvestimento(dados)}
    ${this.gerarGarantiasBeneficios()}
    ${this.gerarContato()}
    
    <!-- Scripts para gráficos -->
    <script>
        // Inicializar quando a página carregar
        document.addEventListener('DOMContentLoaded', function() {
            inicializarGraficos();
            inicializarAnimacoes();
        });
        
        function inicializarGraficos() {
            ${this.gerarScriptsGraficos(dados)}
        }
        
        function inicializarAnimacoes() {
            // Animações suaves ao rolar a página
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            });
            
            document.querySelectorAll('.section-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.6s ease';
                observer.observe(card);
            });
        }
        
        // Função para gerar PDF com cores preservadas e paginação correta
        async function gerarPDF() {
            try {
                // Mostrar loading
                const btn = document.querySelector('.pdf-button');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Gerando PDF...';
                btn.disabled = true;
                
                // Ocultar botão PDF temporariamente para captura
                btn.style.display = 'none';
                
                // Aguardar um pouco para garantir que o botão suma da captura
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Configurações para impressão profissional
                const options = {
                    scale: 2, // Alta qualidade
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#F9F7F2',
                    width: 794, // Largura A4 em pixels (210mm)
                    height: 1123, // Altura A4 em pixels (297mm)
                    foreignObjectRendering: true,
                    logging: false
                };
                
                // Usar impressão nativa do navegador para melhor qualidade
                window.print();

                
                // Restaurar botão
                btn.style.display = 'block';
                btn.innerHTML = originalText;
                btn.disabled = false;
                
            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
                alert('Erro ao gerar PDF. Tente usar Ctrl+P para imprimir.');
                
                // Restaurar botão
                const btn = document.querySelector('.pdf-button');
                btn.style.display = 'block';
                btn.innerHTML = '<i class="fas fa-file-pdf mr-2"></i>Gerar PDF';
                btn.disabled = false;
            }
        }
    </script>
</body>
</html>`;
    }

    /**
     * Gera a Capa da Proposta
     */
    gerarCapa(dados) {
        return `
<!-- CAPA -->
<div class="min-h-screen gradient-bg relative overflow-hidden flex items-center justify-center">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="solarPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="3" fill="var(--amarelo-neon)" opacity="0.3"/>
                    <path d="M10,2 L10,18 M2,10 L18,10 M4.93,4.93 L15.07,15.07 M15.07,4.93 L4.93,15.07" 
                          stroke="var(--amarelo-neon)" stroke-width="0.5" opacity="0.2"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#solarPattern)"/>
        </svg>
    </div>
    
    <!-- Elementos Decorativos -->
    <div class="absolute top-20 right-20 w-32 h-32 rounded-full" 
         style="background: radial-gradient(circle, var(--amarelo-neon) 0%, transparent 70%); opacity: 0.3;"></div>
    <div class="absolute bottom-20 left-20 w-48 h-48 rounded-full" 
         style="background: radial-gradient(circle, var(--amarelo-neon) 0%, transparent 70%); opacity: 0.2;"></div>
    
    <!-- Container Principal da Capa -->
    <div class="relative z-10 text-center text-white max-w-4xl mx-auto px-8">
        <!-- Logo ZORIX -->
        <div class="mb-8">
            <div class="inline-flex items-center justify-center w-24 h-24 rounded-full neon-glow mb-4"
                 style="background: var(--amarelo-neon);">
                <i class="fas fa-solar-panel text-3xl" style="color: var(--azul-petroleo);"></i>
            </div>
            <h1 class="text-2xl font-bold" style="color: var(--amarelo-neon);">ZORIX ENERGIA SOLAR</h1>
        </div>
        
        <!-- Título Principal -->
        <h2 class="text-6xl font-extrabold mb-6 leading-tight">
            PROPOSTA COMERCIAL
            <br>
            <span class="highlight-number">ENERGIA SOLAR</span>
        </h2>
        
        <!-- Informações do Cliente -->
        <div class="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white border-opacity-20">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-lg">
                <div class="text-center">
                    <div class="text-sm opacity-75 mb-1">Cliente</div>
                    <div class="font-bold text-xl" style="color: var(--amarelo-neon);">${dados.cliente.nome}</div>
                </div>
                <div class="text-center">
                    <div class="text-sm opacity-75 mb-1">Proposta Nº</div>
                    <div class="font-bold text-xl">${dados.numeroProposta}</div>
                </div>
                <div class="text-center">
                    <div class="text-sm opacity-75 mb-1">Potência</div>
                    <div class="font-bold text-xl highlight-number">${dados.projeto.potencia_kwp} kWp</div>
                </div>
                <div class="text-center">
                    <div class="text-sm opacity-75 mb-1">Data</div>
                    <div class="font-bold text-xl">${dados.dataGeracao}</div>
                </div>
            </div>
        </div>
        
        <!-- Destaque de Economia -->
        <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 neon-glow">
            <div class="text-sm opacity-90 mb-2">💰 Economia Projetada Anual</div>
            <div class="text-4xl font-black highlight-number">
                R$ ${dados.financeiro.economiaAnual.toLocaleString('pt-BR')}
            </div>
            <div class="text-sm opacity-90 mt-2">Payback: ${dados.financeiro.paybackAnos} anos</div>
        </div>
    </div>
    
    <!-- Botão de Navegação -->
    <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 no-print">
        <button onclick="document.getElementById('sumario').scrollIntoView({behavior: 'smooth'})" 
                class="bg-white bg-opacity-20 backdrop-blur-lg rounded-full p-4 hover:bg-opacity-30 transition-all duration-300">
            <i class="fas fa-chevron-down text-white text-xl animate-bounce"></i>
        </button>
    </div>
</div>`;
    }

    /**
     * Gera Sumário
     */
    gerarSumario() {
        return `
<!-- SUMÁRIO -->
<div id="sumario" class="min-h-screen py-20" style="background: var(--branco-sujo);">
    <div class="max-w-6xl mx-auto px-8">
        <div class="text-center mb-16">
            <h2 class="text-5xl font-bold mb-6" style="color: var(--azul-petroleo);">
                <i class="fas fa-list-ul mr-4"></i>Sumário
            </h2>
            <p class="text-xl" style="color: var(--cinza-medio);">
                Navegue pelos tópicos desta proposta comercial
            </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            ${this.gerarItemSumario('1', 'Introdução', 'fas fa-home', '#introducao')}
            ${this.gerarItemSumario('2', 'Como Funciona', 'fas fa-cogs', '#como-funciona')}
            ${this.gerarItemSumario('3', 'Dados de Consumo', 'fas fa-chart-bar', '#dados-consumo')}
            ${this.gerarItemSumario('4', 'Dimensionamento', 'fas fa-calculator', '#dimensionamento')}
            ${this.gerarItemSumario('5', 'Projeções Financeiras', 'fas fa-chart-line', '#projecoes')}
            ${this.gerarItemSumario('6', 'Investimento', 'fas fa-money-bill-wave', '#investimento')}
            ${this.gerarItemSumario('7', 'Garantias', 'fas fa-shield-alt', '#garantias')}
            ${this.gerarItemSumario('8', 'Contatos', 'fas fa-phone', '#contatos')}
        </div>
    </div>
</div>`;
    }

    gerarItemSumario(numero, titulo, icone, link) {
        return `
        <div onclick="document.querySelector('${link}').scrollIntoView({behavior: 'smooth'})"
             class="section-card p-6 cursor-pointer hover:scale-105 transition-all duration-300 group">
            <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 group-hover:neon-glow transition-all duration-300"
                     style="background: var(--amarelo-neon);">
                    <span class="text-2xl font-bold" style="color: var(--azul-petroleo);">${numero}</span>
                </div>
                <i class="${icone} text-3xl mb-4" style="color: var(--azul-petroleo);"></i>
                <h3 class="text-lg font-semibold" style="color: var(--azul-petroleo);">${titulo}</h3>
            </div>
        </div>`;
    }

    /**
     * Gera Como Funciona
     */
    gerarComoFunciona() {
        return `
<!-- COMO FUNCIONA -->
<div id="como-funciona" class="min-h-screen py-20 bg-white">
    <div class="max-w-6xl mx-auto px-8">
        <div class="text-center mb-16">
            <h2 class="text-5xl font-bold mb-6" style="color: var(--azul-petroleo);">
                <i class="fas fa-lightbulb mr-4"></i>Como Funciona a Energia Solar
            </h2>
            <p class="text-xl" style="color: var(--cinza-medio);">
                Processo simples e eficiente de geração de energia limpa
            </p>
        </div>
        
        <!-- Infográfico do Fluxo -->
        <div class="section-card p-12 mb-12">
            <div class="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-8">
                
                <!-- 1. Sol -->
                <div class="text-center">
                    <div class="relative mb-6">
                        <div class="w-24 h-24 mx-auto rounded-full flex items-center justify-center solar-animation"
                             style="background: linear-gradient(45deg, #FFD700, var(--amarelo-neon));">
                            <i class="fas fa-sun text-4xl text-white"></i>
                        </div>
                        <div class="absolute -top-2 -right-2 w-8 h-8 rounded-full animate-ping"
                             style="background: var(--amarelo-neon); opacity: 0.3;"></div>
                    </div>
                    <h3 class="text-lg font-bold mb-2" style="color: var(--azul-petroleo);">1. Radiação Solar</h3>
                    <p class="text-sm" style="color: var(--cinza-medio);">O sol emite energia luminosa gratuitamente</p>
                </div>
                
                <!-- Seta 1 -->
                <div class="transform lg:rotate-0 rotate-90">
                    <i class="fas fa-arrow-right text-3xl" style="color: var(--amarelo-neon);"></i>
                </div>
                
                <!-- 2. Painéis -->
                <div class="text-center">
                    <div class="w-24 h-24 mx-auto rounded-lg flex items-center justify-center mb-6 hover:scale-110 transition-transform"
                         style="background: linear-gradient(45deg, var(--azul-petroleo), #0A7080);">
                        <i class="fas fa-solar-panel text-4xl" style="color: var(--amarelo-neon);"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-2" style="color: var(--azul-petroleo);">2. Painéis Solares</h3>
                    <p class="text-sm" style="color: var(--cinza-medio);">Convertem luz em energia elétrica (DC)</p>
                </div>
                
                <!-- Seta 2 -->
                <div class="transform lg:rotate-0 rotate-90">
                    <i class="fas fa-arrow-right text-3xl" style="color: var(--amarelo-neon);"></i>
                </div>
                
                <!-- 3. Inversor -->
                <div class="text-center">
                    <div class="w-24 h-24 mx-auto rounded-lg flex items-center justify-center mb-6 hover:scale-110 transition-transform"
                         style="background: linear-gradient(45deg, var(--cinza-medio), #6B7280);">
                        <i class="fas fa-microchip text-4xl text-white"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-2" style="color: var(--azul-petroleo);">3. Inversor</h3>
                    <p class="text-sm" style="color: var(--cinza-medio);">Converte DC para AC (energia utilizável)</p>
                </div>
                
                <!-- Seta 3 -->
                <div class="transform lg:rotate-0 rotate-90">
                    <i class="fas fa-arrow-right text-3xl" style="color: var(--amarelo-neon);"></i>
                </div>
                
                <!-- 4. Quadro Elétrico -->
                <div class="text-center">
                    <div class="w-24 h-24 mx-auto rounded-lg flex items-center justify-center mb-6 hover:scale-110 transition-transform"
                         style="background: linear-gradient(45deg, #059669, #00C851);">
                        <i class="fas fa-plug text-4xl text-white"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-2" style="color: var(--azul-petroleo);">4. Distribuição</h3>
                    <p class="text-sm" style="color: var(--cinza-medio);">Energia distribuída pela residência</p>
                </div>
                
                <!-- Seta 4 -->
                <div class="transform lg:rotate-0 rotate-90">
                    <i class="fas fa-arrow-right text-3xl" style="color: var(--amarelo-neon);"></i>
                </div>
                
                <!-- 5. Consumo -->
                <div class="text-center">
                    <div class="w-24 h-24 mx-auto rounded-lg flex items-center justify-center mb-6 hover:scale-110 transition-transform"
                         style="background: linear-gradient(45deg, var(--azul-petroleo), #0A8FAF);">
                        <i class="fas fa-home text-4xl text-white"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-2" style="color: var(--azul-petroleo);">5. Consumo</h3>
                    <p class="text-sm" style="color: var(--cinza-medio);">Energia limpa para sua residência</p>
                </div>
            </div>
        </div>
        
        <!-- Benefícios Principais -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${this.gerarCardBeneficio('🌱', 'Sustentável', '100% energia renovável e limpa', '#00C851')}
            ${this.gerarCardBeneficio('💰', 'Econômico', 'Redução de até 95% na conta de luz', 'var(--amarelo-neon)')}
            ${this.gerarCardBeneficio('🔧', 'Durável', 'Vida útil superior a 25 anos', 'var(--azul-petroleo)')}
        </div>
    </div>
</div>`;
    }

    gerarCardBeneficio(icone, titulo, descricao, cor) {
        return `
        <div class="section-card p-8 text-center hover:scale-105 transition-all duration-300">
            <div class="text-6xl mb-4">${icone}</div>
            <h3 class="text-xl font-bold mb-3" style="color: ${cor};">${titulo}</h3>
            <p style="color: var(--cinza-medio);">${descricao}</p>
        </div>`;
    }

    /**
     * Gera Dados de Consumo
     */
    gerarDadosConsumo(dados) {
        const consumoMensal = dados.cliente.consumo_mensal || 450;
        const valorConta = dados.cliente.valor_conta || 380;
        const geracaoMensal = Math.round(dados.projeto.potencia_kwp * 150);
        
        return `
<!-- DADOS DE CONSUMO -->
<div id="dados-consumo" class="min-h-screen py-20" style="background: var(--branco-sujo);">
    <div class="max-w-6xl mx-auto px-8">
        <div class="text-center mb-16">
            <h2 class="text-5xl font-bold mb-6" style="color: var(--azul-petroleo);">
                <i class="fas fa-chart-bar mr-4"></i>Dados de Consumo e Geração
            </h2>
            <p class="text-xl" style="color: var(--cinza-medio);">
                Análise detalhada do seu perfil energético
            </p>
        </div>
        
        <!-- Cards Principais -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <!-- Consumo Atual -->
            <div class="section-card p-8 text-center smooth-transition card-hover">
                <div class="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
                     style="background: linear-gradient(45deg, #FF4444, #F87171);">
                    <i class="fas fa-bolt text-2xl text-white"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2" style="color: var(--azul-petroleo);">Consumo Médio Mensal</h3>
                <div class="text-4xl font-bold mb-2" style="color: #FF4444;">${consumoMensal} kWh</div>
                <p class="text-sm" style="color: var(--cinza-medio);">Média dos últimos 12 meses</p>
            </div>
            
            <!-- Geração Estimada -->
            <div class="section-card p-8 text-center neon-glow smooth-transition card-hover">
                <div class="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
                     style="background: linear-gradient(45deg, #00C851, #17A2B8);">
                    <i class="fas fa-solar-panel text-2xl text-white"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2" style="color: var(--azul-petroleo);">Geração Estimada</h3>
                <div class="text-4xl font-bold mb-2 highlight-number">${geracaoMensal} kWh</div>
                <p class="text-sm" style="color: var(--cinza-medio);">Por mês com sistema solar</p>
            </div>
            
            <!-- Economia Mensal -->
            <div class="section-card p-8 text-center smooth-transition card-hover">
                <div class="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
                     style="background: linear-gradient(45deg, var(--amarelo-neon), #FDE047);">
                    <i class="fas fa-piggy-bank text-2xl" style="color: var(--azul-petroleo);"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2" style="color: var(--azul-petroleo);">Economia Mensal</h3>
                <div class="text-4xl font-bold mb-2 highlight-number">R$ ${Math.round(valorConta * 0.9).toLocaleString('pt-BR')}</div>
                <p class="text-sm" style="color: var(--cinza-medio);">Redução na conta de luz</p>
            </div>
        </div>
        
        <!-- Gráfico de Geração Mensal -->
        <div class="section-card p-8">
            <h3 class="text-2xl font-bold mb-8 text-center" style="color: var(--azul-petroleo);">
                📊 Geração Mensal Estimada
            </h3>
            <div class="chart-container">
                <canvas id="graficoGeracaoMensal"></canvas>
            </div>
        </div>
        
        <!-- Comparativo Anual -->
        <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Sem Sistema Solar -->
            <div class="section-card p-8">
                <h4 class="text-xl font-bold mb-6 text-center" style="color: #FF4444;">
                    ❌ Sem Sistema Solar
                </h4>
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <span>Gasto anual com energia:</span>
                        <span class="font-bold text-lg" style="color: #FF4444;">R$ ${(valorConta * 12).toLocaleString('pt-BR')}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Em 25 anos (com inflação):</span>
                        <span class="font-bold text-lg" style="color: #FF4444;">R$ ${Math.round(valorConta * 12 * 25 * 1.8).toLocaleString('pt-BR')}</span>
                    </div>
                </div>
            </div>
            
            <!-- Com Sistema Solar -->
            <div class="section-card p-8" style="border: 3px solid var(--amarelo-neon);">
                <h4 class="text-xl font-bold mb-6 text-center" style="color: #00C851;">
                    ✅ Com Sistema Solar
                </h4>
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <span>Gasto anual com energia:</span>
                        <span class="font-bold text-lg highlight-number">R$ ${Math.round(valorConta * 12 * 0.1).toLocaleString('pt-BR')}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Economia em 25 anos:</span>
                        <span class="font-bold text-lg highlight-number">R$ ${dados.financeiro.economiaTotal25Anos.toLocaleString('pt-BR')}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
    }

    /**
     * Gera Projeção Financeira
     */
    gerarProjecaoFinanceira(dados) {
        return `
<!-- PROJEÇÃO FINANCEIRA -->
<div id="projecoes" class="min-h-screen py-20 bg-white">
    <div class="max-w-6xl mx-auto px-8">
        <div class="text-center mb-16">
            <h2 class="text-5xl font-bold mb-6" style="color: var(--azul-petroleo);">
                <i class="fas fa-chart-line mr-4"></i>Projeções Financeiras
            </h2>
            <p class="text-xl" style="color: var(--cinza-medio);">
                Análise completa de retorno do investimento
            </p>
        </div>
        
        <!-- Indicadores Principais -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <!-- Payback -->
            <div class="section-card p-8 text-center hover:scale-105 transition-all duration-300">
                <div class="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
                     style="background: linear-gradient(45deg, #3B82F6, #60A5FA);">
                    <i class="fas fa-clock text-3xl text-white"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2" style="color: var(--azul-petroleo);">Payback</h3>
                <div class="text-5xl font-bold mb-2 highlight-number">${dados.financeiro.paybackAnos}</div>
                <div class="text-xl font-medium" style="color: var(--azul-petroleo);">anos</div>
                <p class="text-sm mt-2" style="color: var(--cinza-medio);">Tempo de retorno do investimento</p>
            </div>
            
            <!-- TIR -->
            <div class="section-card p-8 text-center hover:scale-105 transition-all duration-300 neon-glow">
                <div class="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
                     style="background: linear-gradient(45deg, #00C851, #17A2B8);">
                    <i class="fas fa-percentage text-3xl text-white"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2" style="color: var(--azul-petroleo);">TIR</h3>
                <div class="text-5xl font-bold mb-2 highlight-number">${dados.financeiro.tirPorcentagem}%</div>
                <div class="text-xl font-medium" style="color: var(--azul-petroleo);">ao ano</div>
                <p class="text-sm mt-2" style="color: var(--cinza-medio);">Taxa Interna de Retorno</p>
            </div>
            
            <!-- ROI -->
            <div class="section-card p-8 text-center hover:scale-105 transition-all duration-300">
                <div class="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
                     style="background: linear-gradient(45deg, var(--amarelo-neon), #F4D03F);">
                    <i class="fas fa-trophy text-3xl text-white"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2" style="color: var(--azul-petroleo);">ROI</h3>
                <div class="text-5xl font-bold mb-2" style="color: var(--amarelo-neon);">${Math.round(dados.financeiro.roi)}%</div>
                <div class="text-xl font-medium" style="color: var(--azul-petroleo);">em 25 anos</div>
                <p class="text-sm mt-2" style="color: var(--cinza-medio);">Retorno sobre Investimento</p>
            </div>
        </div>
        
        <!-- Gráfico Comparativo -->
        <div class="section-card p-8 mb-12">
            <h3 class="text-2xl font-bold mb-8 text-center" style="color: var(--azul-petroleo);">
                💰 Comparativo: Com vs Sem Energia Solar
            </h3>
            <div class="chart-container">
                <canvas id="graficoComparativo"></canvas>
            </div>
        </div>
        
        <!-- Especificações Técnicas -->
        <div class="section-card p-8 mb-8">
            <h3 class="text-2xl font-bold mb-6 text-center" style="color: var(--azul-petroleo);">
                🔧 Especificações do Sistema
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="text-center p-4 rounded-lg" style="background: linear-gradient(45deg, #F0F9FF, #E0F2FE);">
                    <i class="fas fa-solar-panel text-2xl mb-2" style="color: var(--amarelo-neon);"></i>
                    <div class="text-sm opacity-75 mb-1">Potência</div>
                    <div class="font-bold text-lg highlight-number">${dados.projeto.potencia_kwp} kWp</div>
                </div>
                <div class="text-center p-4 rounded-lg" style="background: linear-gradient(45deg, #F0FDF4, #DCFCE7);">
                    <i class="fas fa-home text-2xl mb-2" style="color: var(--verde-sucesso);"></i>
                    <div class="text-sm opacity-75 mb-1">Instalação</div>
                    <div class="font-bold text-lg">${dados.projeto.tipo_instalacao.charAt(0).toUpperCase() + dados.projeto.tipo_instalacao.slice(1)}</div>
                </div>
                ${dados.projeto.tipo_instalacao === 'telhado' ? `
                <div class="text-center p-4 rounded-lg" style="background: linear-gradient(45deg, #FFFBEB, #FEF3C7);">
                    <i class="fas fa-building text-2xl mb-2" style="color: var(--amarelo-neon);"></i>
                    <div class="text-sm opacity-75 mb-1">Tipo de Telhado</div>
                    <div class="font-bold text-lg">${dados.projeto.tipo_telhado ? dados.projeto.tipo_telhado.charAt(0).toUpperCase() + dados.projeto.tipo_telhado.slice(1) : 'Metálico'}</div>
                </div>
                ` : `
                <div class="text-center p-4 rounded-lg" style="background: linear-gradient(45deg, #F5F3FF, #EDE9FE);">
                    <i class="fas fa-map-marker-alt text-2xl mb-2" style="color: var(--azul-petroleo);"></i>
                    <div class="text-sm opacity-75 mb-1">Localização</div>
                    <div class="font-bold text-lg">${dados.projeto.cidade}</div>
                </div>
                `}
                <div class="text-center p-4 rounded-lg" style="background: linear-gradient(45deg, #FEF2F2, #FECACA);">
                    <i class="fas fa-bolt text-2xl mb-2" style="color: #FF4444;"></i>
                    <div class="text-sm opacity-75 mb-1">Consumo Base</div>
                    <div class="font-bold text-lg">${dados.projeto.media_consumo} kWh/mês</div>
                </div>
            </div>
        </div>
        
        <!-- Resumo Financeiro -->
        <div class="section-card p-8" style="background: linear-gradient(135deg, var(--azul-petroleo), #0A7080);">
            <div class="text-white text-center">
                <h3 class="text-3xl font-bold mb-8">💎 Resumo Financeiro - 25 Anos</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div class="text-sm opacity-75 mb-2">Investimento Total</div>
                        <div class="text-3xl font-bold">R$ ${dados.financeiro.valorInvestimento.toLocaleString('pt-BR')}</div>
                    </div>
                    <div>
                        <div class="text-sm opacity-75 mb-2">Economia Total</div>
                        <div class="text-3xl font-bold highlight-number">R$ ${dados.financeiro.economiaTotal25Anos.toLocaleString('pt-BR')}</div>
                    </div>
                    <div>
                        <div class="text-sm opacity-75 mb-2">Lucro Líquido</div>
                        <div class="text-3xl font-bold highlight-number">R$ ${dados.financeiro.lucroLiquido.toLocaleString('pt-BR')}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
    }

    /**
     * Gera Seção de Investimento com materiais reais
     */
    gerarInvestimento(dados) {
        return `
<!-- INVESTIMENTO -->
<div id="investimento" class="min-h-screen py-20 page-break-before" style="background: var(--branco-sujo);">
    <div class="max-w-6xl mx-auto px-8">
        <div class="text-center mb-16">
            <h2 class="text-5xl font-bold mb-6" style="color: var(--azul-petroleo);">
                <i class="fas fa-money-bill-wave mr-4"></i>Investimento e Condições Comerciais
            </h2>
            <p class="text-xl" style="color: var(--cinza-medio);">
                Detalhamento completo do investimento necessário
            </p>
        </div>
        
        <!-- Tabela de Equipamentos REAIS -->
        <div class="section-card p-8 mb-12">
            <h3 class="text-2xl font-bold mb-8 text-center" style="color: var(--azul-petroleo);">
                🛠️ Equipamentos e Materiais
            </h3>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr style="background: var(--azul-petroleo);" class="text-white">
                            <th class="p-4 text-left rounded-tl-lg">Item</th>
                            <th class="p-4 text-center">Quantidade</th>
                            <th class="p-4 text-center rounded-tr-lg">Especificação</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.gerarLinhasMateriais(dados)}
                    </tbody>
                    <tfoot>
                        <tr style="background: var(--amarelo-neon);">
                            <td class="p-4 font-bold text-xl" style="color: var(--azul-petroleo);">VALOR TOTAL</td>
                            <td class="p-4"></td>
                            <td class="p-4 text-right text-2xl font-bold" style="color: var(--azul-petroleo);">
                                R$ ${dados.financeiro.valorInvestimento.toLocaleString('pt-BR')}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        
        <!-- Formas de Pagamento -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- À Vista -->
            <div class="section-card p-6 hover:scale-105 transition-all duration-300">
                <div class="text-center">
                    <div class="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4"
                         style="background: linear-gradient(45deg, #00C851, #17A2B8);">
                        <i class="fas fa-hand-holding-usd text-xl text-white"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3" style="color: var(--azul-petroleo);">💵 À Vista</h3>
                    <div class="text-2xl font-bold mb-3" style="color: #00C851;">
                        R$ ${Math.round(dados.financeiro.valorInvestimento * 0.95).toLocaleString('pt-BR')}
                    </div>
                    <div class="bg-green-100 rounded-lg p-3 mb-3">
                        <div class="text-xs text-green-800 font-semibold">🎉 DESCONTO ESPECIAL</div>
                        <div class="text-sm font-bold text-green-800">5% OFF</div>
                    </div>
                    <ul class="text-xs text-left space-y-1" style="color: var(--cinza-medio);">
                        <li>✅ Maior desconto disponível</li>
                        <li>✅ Instalação prioritária</li>
                        <li>✅ Garantia estendida gratuita</li>
                    </ul>
                </div>
            </div>
            
            <!-- Financiado -->
            <div class="section-card p-6 hover:scale-105 transition-all duration-300" style="border: 2px solid var(--amarelo-neon);">
                <div class="text-center">
                    <div class="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4"
                         style="background: linear-gradient(45deg, var(--amarelo-neon), #FDE047);">
                        <i class="fas fa-university text-xl" style="color: var(--azul-petroleo);"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3" style="color: var(--azul-petroleo);">🏦 Financiado</h3>
                    <div class="text-lg font-bold mb-3 highlight-number">Até 60x</div>
                    <div class="bg-yellow-100 rounded-lg p-3 mb-3">
                        <div class="text-xs" style="color: var(--azul-petroleo);">Consulte condições</div>
                        <div class="text-sm font-bold" style="color: var(--azul-petroleo);">Sem entrada*</div>
                    </div>
                    <ul class="text-xs text-left space-y-1" style="color: var(--cinza-medio);">
                        <li>✅ Parcelas que cabem no orçamento</li>
                        <li>✅ Economia desde o primeiro mês</li>
                        <li>✅ Aprovação facilitada</li>
                    </ul>
                </div>
            </div>
            
            <!-- Cartão de Crédito -->
            <div class="section-card p-6 hover:scale-105 transition-all duration-300" style="border: 2px solid var(--azul-petroleo);">
                <div class="text-center">
                    <div class="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4"
                         style="background: linear-gradient(45deg, var(--azul-petroleo), #0A8FAF);">
                        <i class="fas fa-credit-card text-xl text-white"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3" style="color: var(--azul-petroleo);">💳 Cartão</h3>
                    <div class="text-lg font-bold mb-3" style="color: var(--azul-petroleo);">Até 18x</div>
                    <div class="bg-blue-100 rounded-lg p-3 mb-3">
                        <div class="text-xs text-blue-800">💡 FLEXIBILIDADE</div>
                        <div class="text-sm font-bold text-blue-800">Sem consulta SPC</div>
                    </div>
                    <ul class="text-xs text-left space-y-1" style="color: var(--cinza-medio);">
                        <li>✅ Parcelamento no cartão</li>
                        <li>✅ Aprovação imediata</li>
                        <li>✅ Sem burocracia</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>`;
    }

    /**
     * Gera linhas da tabela de materiais usando dados reais do projeto
     */
    gerarLinhasMateriais(dados) {
        let linhas = '';
        let valorTotal = 0;
        
        // Módulos reais
        if (dados.projeto.modulos && dados.projeto.modulos.length > 0) {
            dados.projeto.modulos.forEach(modulo => {
                const valorModulo = modulo.preco_modulo || 0;
                const quantidade = modulo.quantidade || 0;
                valorTotal += valorModulo * quantidade;
                
                linhas += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="p-4 font-semibold">
                        <i class="fas fa-solar-panel mr-2" style="color: var(--amarelo-neon);"></i>
                        Painéis Solares
                    </td>
                    <td class="p-4 text-center font-bold">${quantidade}x</td>
                    <td class="p-4 text-center">${modulo.descricao || 'Módulo Fotovoltaico'}</td>
                </tr>`;
            });
        }
        
        // Inversores reais
        if (dados.projeto.inversores && dados.projeto.inversores.length > 0) {
            dados.projeto.inversores.forEach(inversor => {
                const valorInversor = inversor.preco_inversor || 0;
                const quantidade = inversor.quantidade || 0;
                valorTotal += valorInversor * quantidade;
                
                linhas += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="p-4 font-semibold">
                        <i class="fas fa-microchip mr-2" style="color: var(--amarelo-neon);"></i>
                        Inversor(es)
                    </td>
                    <td class="p-4 text-center font-bold">${quantidade}x</td>
                    <td class="p-4 text-center">${inversor.descricao || 'Inversor String'}</td>
                </tr>`;
            });
        }
        
        // Outros materiais se houver
        if (dados.projeto.outros_materiais && dados.projeto.outros_materiais.trim() !== '') {
            // Dividir outros materiais por linha para melhor apresentação
            const outrosMateriais = dados.projeto.outros_materiais.split('\n').filter(item => item.trim() !== '');
            
            outrosMateriais.forEach((material, index) => {
                linhas += `
                <tr class="border-b hover:bg-gray-50">
                    <td class="p-4 font-semibold">
                        <i class="fas fa-tools mr-2" style="color: var(--amarelo-neon);"></i>
                        ${index === 0 ? 'Outros Materiais' : ''}
                    </td>
                    <td class="p-4 text-center font-bold">1x</td>
                    <td class="p-4 text-center">${material.trim()}</td>
                </tr>`;
            });
        }
        
        // Se não há dados reais de materiais, usar padrão
        if (linhas === '') {
            const numPaineis = Math.ceil(dados.projeto.potencia_kwp / 0.555);
            const numInversores = Math.ceil(dados.projeto.potencia_kwp / 5);
            
            linhas = `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-4 font-semibold">
                    <i class="fas fa-solar-panel mr-2" style="color: var(--amarelo-neon);"></i>
                    Painéis Solares
                </td>
                <td class="p-4 text-center font-bold">${numPaineis}x</td>
                <td class="p-4 text-center">555W Monocristalino Tier 1</td>
            </tr>
            <tr class="border-b hover:bg-gray-50">
                <td class="p-4 font-semibold">
                    <i class="fas fa-microchip mr-2" style="color: var(--amarelo-neon);"></i>
                    Inversor(es)
                </td>
                <td class="p-4 text-center font-bold">${numInversores}x</td>
                <td class="p-4 text-center">String ${Math.ceil(dados.projeto.potencia_kwp / numInversores)}kW com WiFi</td>
            </tr>
            <tr class="border-b hover:bg-gray-50">
                <td class="p-4 font-semibold">
                    <i class="fas fa-wrench mr-2" style="color: var(--amarelo-neon);"></i>
                    Estrutura de Fixação
                </td>
                <td class="p-4 text-center font-bold">1x</td>
                <td class="p-4 text-center">Alumínio Anodizado Completa</td>
            </tr>
            <tr class="border-b hover:bg-gray-50">
                <td class="p-4 font-semibold">
                    <i class="fas fa-tools mr-2" style="color: var(--amarelo-neon);"></i>
                    Instalação e Projeto
                </td>
                <td class="p-4 text-center font-bold">1x</td>
                <td class="p-4 text-center">Mão de Obra Especializada</td>
            </tr>`;
        }
        
        return linhas;
    }

    /**
     * Gera Garantias e Benefícios
     */
    gerarGarantiasBeneficios() {
        return `
<!-- GARANTIAS E BENEFÍCIOS -->
<div id="garantias" class="min-h-screen py-20 bg-white page-break-before">
    <div class="max-w-6xl mx-auto px-8">
        <div class="text-center mb-16">
            <h2 class="text-5xl font-bold mb-6" style="color: var(--azul-petroleo);">
                <i class="fas fa-shield-alt mr-4"></i>Garantias e Benefícios
            </h2>
            <p class="text-xl" style="color: var(--cinza-medio);">
                Segurança e tranquilidade no seu investimento
            </p>
        </div>
        
        <!-- Garantias -->
        <div class="section-card p-8 mb-12">
            <h3 class="text-2xl font-bold mb-8 text-center" style="color: var(--azul-petroleo);">
                🛡️ Garantias Inclusas
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${this.gerarCardGarantia('25', 'anos', 'Painéis Solares', 'Performance garantida', 'fas fa-solar-panel')}
                ${this.gerarCardGarantia('10', 'anos', 'Inversor', 'Garantia de fábrica', 'fas fa-microchip')}
                ${this.gerarCardGarantia('20', 'anos', 'Estruturas', 'Contra corrosão', 'fas fa-wrench')}
                ${this.gerarCardGarantia('5', 'anos', 'Instalação', 'Mão de obra', 'fas fa-tools')}
            </div>
        </div>
        
        <!-- Benefícios Ambientais -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div class="section-card p-8">
                <h3 class="text-2xl font-bold mb-6" style="color: var(--azul-petroleo);">
                    🌱 Benefícios Ambientais
                </h3>
                <div class="space-y-6">
                    ${this.gerarItemBeneficio('🌍', 'Redução de CO₂', '15,2 toneladas/ano', 'Equivale a plantar 180 árvores')}
                    ${this.gerarItemBeneficio('♻️', 'Energia Renovável', '100% limpa', 'Fonte inesgotável e sustentável')}
                    ${this.gerarItemBeneficio('🏭', 'Pegada Carbono', 'Zero emissões', 'Contribuição para um planeta melhor')}
                </div>
            </div>
            
            <div class="section-card p-8">
                <h3 class="text-2xl font-bold mb-6" style="color: var(--azul-petroleo);">
                    💎 Vantagens Exclusivas
                </h3>
                <div class="space-y-6">
                    ${this.gerarItemBeneficio('🏠', 'Valorização Imóvel', '+8% no valor', 'Aumento comprovado do valor de venda')}
                    ${this.gerarItemBeneficio('🔒', 'Proteção Inflação', 'Energia fixa', 'Blindagem contra aumentos na tarifa')}
                    ${this.gerarItemBeneficio('📱', 'Monitoramento', 'App gratuito', 'Acompanhe a geração em tempo real')}
                </div>
            </div>
        </div>
        
        <!-- CTA Principal -->
        <div class="section-card p-12 text-center" 
             style="background: linear-gradient(135deg, var(--azul-petroleo), #0A7080);">
            <div class="text-white">
                <h3 class="text-4xl font-bold mb-4">🎯 Pronto para Economizar?</h3>
                <p class="text-xl mb-8 opacity-90">
                    Comece a gerar sua própria energia hoje mesmo!
                </p>
                <div class="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <div class="text-center">
                        <div class="text-sm opacity-75">Economia anual de:</div>
                        <div class="text-3xl font-bold highlight-number">R$ 4.560</div>
                    </div>
                    <div class="text-4xl">➡️</div>
                    <div class="text-center">
                        <div class="text-sm opacity-75">Em 25 anos:</div>
                        <div class="text-3xl font-bold highlight-number">R$ 228.000</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
    }

    gerarCardGarantia(numero, unidade, titulo, descricao, icone) {
        return `
        <div class="text-center p-6 rounded-lg hover:scale-105 transition-all duration-300"
             style="background: linear-gradient(45deg, var(--amarelo-neon), #FDE047);">
            <i class="${icone} text-3xl mb-4" style="color: var(--azul-petroleo);"></i>
            <div class="text-3xl font-bold" style="color: var(--azul-petroleo);">${numero}</div>
            <div class="text-lg font-semibold" style="color: var(--azul-petroleo);">${unidade}</div>
            <div class="text-sm font-bold mt-2" style="color: var(--azul-petroleo);">${titulo}</div>
            <div class="text-xs mt-1" style="color: var(--cinza-medio);">${descricao}</div>
        </div>`;
    }

    gerarItemBeneficio(icone, titulo, valor, descricao) {
        return `
        <div class="flex items-start space-x-4">
            <div class="text-3xl">${icone}</div>
            <div class="flex-1">
                <div class="font-bold" style="color: var(--azul-petroleo);">${titulo}</div>
                <div class="text-lg font-semibold highlight-number">${valor}</div>
                <div class="text-sm" style="color: var(--cinza-medio);">${descricao}</div>
            </div>
        </div>`;
    }

    /**
     * Gera Seção de Contato
     */
    gerarContato() {
        return `
<!-- CONTATO -->
<div id="contatos" class="min-h-screen py-20" style="background: var(--branco-sujo);">
    <div class="max-w-6xl mx-auto px-8">
        <div class="text-center mb-16">
            <h2 class="text-5xl font-bold mb-6" style="color: var(--azul-petroleo);">
                <i class="fas fa-phone mr-4"></i>Entre em Contato
            </h2>
            <p class="text-xl" style="color: var(--cinza-medio);">
                Estamos prontos para tirar suas dúvidas e finalizar sua proposta
            </p>
        </div>
        
        <!-- Informações de Contato -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <!-- Logo e Empresa -->
            <div class="section-card p-8 text-center">
                <div class="mb-8">
                    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 neon-glow"
                         style="background: var(--amarelo-neon);">
                        <i class="fas fa-solar-panel text-3xl" style="color: var(--azul-petroleo);"></i>
                    </div>
                    <h3 class="text-3xl font-bold" style="color: var(--azul-petroleo);">ZORIX CRM</h3>
                    <p class="text-lg" style="color: var(--cinza-medio);">Energia Solar Profissional</p>
                </div>
                
                <div class="space-y-4 text-left">
                    ${this.gerarItemContato('fas fa-map-marker-alt', 'Endereço', 'Av. Visconde de Taunay, 420 - Ed. Guanabara sala 62')}
                    ${this.gerarItemContato('fas fa-clock', 'Horário', 'Segunda a Sexta: 8h às 18h')}
                    ${this.gerarItemContato('fas fa-certificate', 'CNPJ', '53.967.349/0001-63')}
                </div>
            </div>
            
            <!-- Contatos Diretos -->
            <div class="section-card p-8">
                <h3 class="text-2xl font-bold mb-6 text-center" style="color: var(--azul-petroleo);">
                    📞 Fale Conosco Agora
                </h3>
                
                <div class="space-y-6">
                    <!-- WhatsApp -->
                    <div class="flex items-center justify-between p-4 rounded-lg hover:scale-105 transition-all duration-300"
                         style="background: linear-gradient(45deg, #25D366, #128C7E);">
                        <div class="flex items-center space-x-4 text-white">
                            <i class="fab fa-whatsapp text-3xl"></i>
                            <div>
                                <div class="font-bold">WhatsApp</div>
                                <div class="text-lg">(19) 99931-7868</div>
                            </div>
                        </div>
                        <button onclick="window.open('https://wa.me/5519999317868?text=Olá, tenho interesse na proposta de energia solar!', '_blank')"
                                class="bg-white text-green-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                            Conversar
                        </button>
                    </div>
                    
                    <!-- Telefone -->
                    <div class="flex items-center justify-between p-4 rounded-lg"
                         style="background: linear-gradient(45deg, var(--azul-petroleo), #0A7080);">
                        <div class="flex items-center space-x-4 text-white">
                            <i class="fas fa-phone text-3xl"></i>
                            <div>
                                <div class="font-bold">Telefone</div>
                                <div class="text-lg">(19) 99931-7868</div>
                            </div>
                        </div>
                        <button onclick="window.open('tel:+5519999317868', '_self')"
                                class="bg-white px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                                style="color: var(--azul-petroleo);">
                            Ligar
                        </button>
                    </div>
                    
                    <!-- Email -->
                    <div class="flex items-center justify-between p-4 rounded-lg"
                         style="background: linear-gradient(45deg, var(--amarelo-neon), #FDE047);">
                        <div class="flex items-center space-x-4" style="color: var(--azul-petroleo);">
                            <i class="fas fa-envelope text-3xl"></i>
                            <div>
                                <div class="font-bold">E-mail</div>
                                <div class="text-lg">comercial@ienergyrenovaveis.com.br</div>
                            </div>
                        </div>
                        <button onclick="window.open('mailto:comercial@ienergyrenovaveis.com.br?subject=Interesse em Energia Solar', '_blank')"
                                class="px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                                style="background: var(--azul-petroleo); color: white;">
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- QR Code WhatsApp -->
        <div class="section-card p-8 text-center">
            <h3 class="text-2xl font-bold mb-6" style="color: var(--azul-petroleo);">
                📱 QR Code - WhatsApp Direto
            </h3>
            <div class="flex flex-col md:flex-row items-center justify-center gap-8">
                <div class="w-48 h-48 border-4 rounded-lg flex items-center justify-center text-6xl"
                     style="border-color: var(--amarelo-neon); background: var(--branco-sujo);">
                    <i class="fas fa-qrcode" style="color: var(--azul-petroleo);"></i>
                </div>
                <div class="text-left">
                    <h4 class="text-xl font-bold mb-4" style="color: var(--azul-petroleo);">
                        Escaneie e fale conosco!
                    </h4>
                    <ul class="space-y-2" style="color: var(--cinza-medio);">
                        <li>✅ Atendimento instantâneo</li>
                        <li>✅ Tire todas suas dúvidas</li>
                        <li>✅ Agende uma visita técnica</li>
                        <li>✅ Negocie condições especiais</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- CTA Final -->
        <div class="text-center mt-12">
            <div class="section-card p-12" style="background: linear-gradient(135deg, var(--azul-petroleo), #0A7080);">
                <div class="text-white">
                    <h3 class="text-4xl font-bold mb-4">🚀 Não Perca Esta Oportunidade!</h3>
                    <p class="text-xl mb-8">
                        Proposta válida por <span class="font-bold highlight-number">30 dias</span>
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div class="text-2xl font-bold highlight-number">95%</div>
                            <div class="text-sm">Redução na conta</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold highlight-number">25 anos</div>
                            <div class="text-sm">De economia garantida</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold highlight-number">6 anos</div>
                            <div class="text-sm">Payback médio</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Botão Flutuante WhatsApp -->
<div class="fixed bottom-6 right-6 z-50 no-print">
    <button onclick="window.open('https://wa.me/5519999317868?text=Olá, tenho interesse na proposta de energia solar!', '_blank')"
            class="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:scale-110 transition-all duration-300 animate-pulse"
            style="background: linear-gradient(45deg, #25D366, #128C7E);">
        <i class="fab fa-whatsapp"></i>
    </button>
</div>`;
    }

    gerarItemContato(icone, titulo, valor) {
        return `
        <div class="flex items-center space-x-3">
            <i class="${icone} text-xl" style="color: var(--amarelo-neon);"></i>
            <div>
                <div class="font-semibold text-sm" style="color: var(--azul-petroleo);">${titulo}:</div>
                <div style="color: var(--cinza-medio);">${valor}</div>
            </div>
        </div>`;
    }

    /**
     * Gera scripts dos gráficos
     */
    gerarScriptsGraficos(dados) {
        const consumoMensal = dados.cliente.consumo_mensal || 450;
        const geracaoMensal = Math.round(dados.projeto.potencia_kwp * 150);
        
        return `
        // Gráfico de Geração Mensal - Cores do Sistema ZORIX
        const ctxGeracao = document.getElementById('graficoGeracaoMensal');
        if (ctxGeracao) {
            new Chart(ctxGeracao, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    datasets: [{
                        label: 'Geração Solar (kWh)',
                        data: [${Math.round(geracaoMensal * 1.1)}, ${Math.round(geracaoMensal * 0.9)}, ${Math.round(geracaoMensal * 1.05)}, 
                               ${Math.round(geracaoMensal * 0.85)}, ${Math.round(geracaoMensal * 0.75)}, ${Math.round(geracaoMensal * 0.7)},
                               ${Math.round(geracaoMensal * 0.75)}, ${Math.round(geracaoMensal * 0.85)}, ${Math.round(geracaoMensal * 0.9)},
                               ${Math.round(geracaoMensal * 1.05)}, ${Math.round(geracaoMensal * 1.15)}, ${Math.round(geracaoMensal * 1.2)}],
                        backgroundColor: 'rgba(230, 255, 40, 0.2)',
                        borderColor: '#E6FF28',
                        borderWidth: 4,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#E6FF28',
                        pointBorderColor: '#064B59',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }, {
                        label: 'Consumo Residencial (kWh)',
                        data: [${Math.round(consumoMensal * 1.1)}, ${Math.round(consumoMensal * 0.95)}, ${Math.round(consumoMensal * 1.0)}, 
                               ${Math.round(consumoMensal * 0.9)}, ${Math.round(consumoMensal * 0.85)}, ${Math.round(consumoMensal * 0.8)},
                               ${Math.round(consumoMensal * 0.85)}, ${Math.round(consumoMensal * 0.9)}, ${Math.round(consumoMensal * 0.95)},
                               ${Math.round(consumoMensal * 1.0)}, ${Math.round(consumoMensal * 1.05)}, ${Math.round(consumoMensal * 1.1)}],
                        backgroundColor: 'rgba(6, 75, 89, 0.2)',
                        borderColor: '#064B59',
                        borderWidth: 4,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#064B59',
                        pointBorderColor: '#E6FF28',
                        pointBorderWidth: 2,
                        pointRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: { size: 14, weight: 'bold' },
                                color: '#064B59',
                                usePointStyle: true,
                                padding: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: '#064B59',
                            titleColor: '#E6FF28',
                            bodyColor: 'white',
                            borderColor: '#E6FF28',
                            borderWidth: 2,
                            cornerRadius: 8,
                            displayColors: true
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { 
                                color: 'rgba(6, 75, 89, 0.1)',
                                drawBorder: false
                            },
                            ticks: { 
                                color: '#064B59', 
                                font: { weight: 'bold' },
                                callback: function(value) {
                                    return value + ' kWh';
                                }
                            },
                            border: {
                                display: false
                            }
                        },
                        x: {
                            grid: { 
                                display: false
                            },
                            ticks: { 
                                color: '#064B59', 
                                font: { weight: 'bold', size: 12 }
                            },
                            border: {
                                color: '#064B59',
                                width: 2
                            }
                        }
                    },
                    elements: {
                        point: {
                            hoverRadius: 8
                        }
                    }
                }
            });
        }
        
        // Gráfico Comparativo - Cores do Sistema ZORIX
        const ctxComparativo = document.getElementById('graficoComparativo');
        if (ctxComparativo) {
            new Chart(ctxComparativo, {
                type: 'line',
                data: {
                    labels: Array.from({length: 26}, (_, i) => \`Ano \${i}\`),
                    datasets: [{
                        label: 'Sem Sistema Solar',
                        data: Array.from({length: 26}, (_, i) => 
                            ${dados.cliente.valor_conta * 12} * Math.pow(1.08, i)
                        ),
                        borderColor: '#064B59',
                        backgroundColor: 'rgba(6, 75, 89, 0.1)',
                        borderWidth: 4,
                        tension: 0.4,
                        pointBackgroundColor: '#064B59',
                        pointBorderColor: '#E6FF28',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }, {
                        label: 'Com Sistema Solar',
                        data: Array.from({length: 26}, (_, i) => 
                            i === 0 ? ${dados.financeiro.valorInvestimento} : 
                            ${dados.cliente.valor_conta * 12 * 0.1} * Math.pow(1.08, i)
                        ),
                        borderColor: '#E6FF28',
                        backgroundColor: 'rgba(230, 255, 40, 0.2)',
                        borderWidth: 4,
                        tension: 0.4,
                        pointBackgroundColor: '#E6FF28',
                        pointBorderColor: '#064B59',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: { size: 14, weight: 'bold' },
                                color: '#064B59',
                                usePointStyle: true,
                                padding: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: '#064B59',
                            titleColor: '#E6FF28',
                            bodyColor: 'white',
                            borderColor: '#E6FF28',
                            borderWidth: 2,
                            cornerRadius: 8
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { 
                                color: 'rgba(6, 75, 89, 0.1)',
                                drawBorder: false
                            },
                            ticks: { 
                                color: '#064B59',
                                font: { weight: 'bold' },
                                callback: function(value) {
                                    return 'R$ ' + value.toLocaleString('pt-BR');
                                }
                            },
                            border: {
                                display: false
                            }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { 
                                color: '#064B59',
                                font: { weight: 'bold' }
                            },
                            border: {
                                color: '#064B59',
                                width: 2
                            }
                        }
                    },
                    elements: {
                        point: {
                            hoverRadius: 6
                        }
                    }
                }
            });
        }`;
    }

    /**
     * Prepara dados para os gráficos
     */
    prepararDadosGraficos(projeto) {
        const geracaoMensal = projeto.geracao_mensal || {};
        const dadosGeracao = [];
        const labelsGeracao = [];
        
        this.meses.forEach((mes, index) => {
            const mesKey = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun',
                           'jul', 'ago', 'set', 'out', 'nov', 'dez'][index];
            
            labelsGeracao.push(mes.substr(0, 3));
            dadosGeracao.push(Math.round(geracaoMensal[mesKey] || 0));
        });
        
        return {
            geracao: {
                labels: labelsGeracao,
                data: dadosGeracao
            }
        };
    }

    /**
     * Configura a janela da proposta após carregamento
     */
    configurarJanelaProposta(janela, dadosGraficos) {
        try {
            // Verificar se Chart.js está disponível
            if (!janela.Chart) {
                console.warn('Chart.js não carregado, tentando novamente...');
                setTimeout(() => this.configurarJanelaProposta(janela, dadosGraficos), 500);
                return;
            }

            // Configurar gráfico de geração
            const ctx = janela.document.getElementById('graficoGeracao');
            if (ctx) {
                new janela.Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: dadosGraficos.geracao.labels,
                        datasets: [{
                            label: 'Geração (kWh)',
                            data: dadosGraficos.geracao.data,
                            backgroundColor: this.colors.amareloNeon,
                            borderColor: this.colors.azulPetroleo,
                            borderWidth: 2,
                            borderRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return value + ' kWh';
                                    }
                                }
                            }
                        }
                    }
                });
            }

            console.log('✅ Gráficos configurados na proposta');

        } catch (error) {
            console.error('Erro ao configurar gráficos:', error);
        }
    }
}

// Instância global
window.propostaV5Generator = new PropostaGeneratorV5();

console.log('✅ Proposta Generator v5.0 carregado com sucesso!');