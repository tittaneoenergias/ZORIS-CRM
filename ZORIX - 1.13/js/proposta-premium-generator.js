/**
 * LURIX CRM - Gerador de Proposta Premium
 * Design Profissional e Inovador
 * Paleta de Cores Personalizada
 * Versão: Premium 1.0
 */

class PropostaPremiumGenerator {
    constructor() {
        // Paleta de cores LURIX Premium
        this.colors = {
            // Cores principais
            amareloNeon: '#E6FF28',      // Destaques e números importantes
            azulPetroleo: '#064B59',     // Títulos e menus
            brancoSujo: '#F9F7F2',      // Fundo principal
            cinzaMedio: '#898A90',       // Textos auxiliares
            
            // Cores complementares
            branco: '#FFFFFF',
            preto: '#000000',
            verde: '#00C851',            // Economia e sustentabilidade
            vermelho: '#FF4444',         // Alertas
            azulClaro: '#007AFF'         // Links e informações
        };

        // Configurações de layout
        this.layout = {
            containerWidth: '1200px',
            sectionPadding: '60px 40px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        };

        console.log('🎨 Gerador de Proposta Premium inicializado');
    }

    /**
     * Gera proposta completa em nova aba
     * SEMPRE GERA A PROPOSTA - mesmo com dados inválidos ou em branco
     */
    async gerarPropostaPremium(dadosProjeto, dadosCliente) {
        try {
            console.log('🚀 Gerando Proposta Premium...', { dadosProjeto, dadosCliente });

            // Validar e normalizar dados de entrada
            const dadosValidados = this.validarEPrepararDados(dadosProjeto, dadosCliente);
            
            // Calcular dados financeiros (sempre funciona com dados validados)
            const dadosFinanceiros = this.calcularDadosFinanceiros(dadosValidados.projeto);
            
            // Gerar número da proposta
            const numeroProposta = this.gerarNumeroProposta();
            
            // Criar nova aba com a proposta
            const novaAba = window.open('', '_blank');
            
            if (!novaAba) {
                // Se pop-up foi bloqueado, ainda assim retorna sucesso
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
            
            // MESMO COM ERRO, TENTA GERAR UMA PROPOSTA BÁSICA
            try {
                console.log('🔄 Tentando gerar proposta básica de emergência...');
                return this.gerarPropostaEmergencia();
            } catch (emergencyError) {
                console.error('❌ Erro crítico na proposta de emergência:', emergencyError);
                return { success: false, error: error.message };
            }
        }
    }

    /**
     * Valida e prepara dados de entrada
     * Garante que SEMPRE temos dados válidos para gerar a proposta
     */
    validarEPrepararDados(dadosProjeto, dadosCliente) {
        console.log('🔍 Validando dados de entrada...');
        
        // Dados padrão do cliente
        const clienteValidado = {
            id: dadosCliente?.id || 'cli_default',
            nome: dadosCliente?.nome || 'Nome do Cliente', // OBRIGATÓRIO
            tipo_pessoa: dadosCliente?.tipo_pessoa || 'fisica',
            endereco: dadosCliente?.endereco || 'Endereço não informado',
            cidade: dadosCliente?.cidade || 'Cidade não informada',
            estado: dadosCliente?.estado || 'SP',
            telefone: dadosCliente?.telefone || '(11) 00000-0000',
            email: dadosCliente?.email || 'contato@email.com',
            consumo_mensal: this.validarNumero(dadosCliente?.consumo_mensal, 450), // Padrão: 450 kWh
            valor_conta: this.validarNumero(dadosCliente?.valor_conta, 380) // Padrão: R$ 380
        };

        // Dados padrão do projeto  
        const projetoValidado = {
            id: dadosProjeto?.id || 'proj_default',
            nome_projeto: dadosProjeto?.nome_projeto || `Sistema Solar - ${clienteValidado.nome}`,
            potencia_kwp: this.validarNumero(dadosProjeto?.potencia_kwp, 5.5), // OBRIGATÓRIO - Padrão: 5.5 kWp
            tipo_instalacao: dadosProjeto?.tipo_instalacao || 'telhado',
            geracao_estimada: this.validarNumero(dadosProjeto?.geracao_estimada, 825), // Padrão calculado
            economia_mensal: this.validarNumero(dadosProjeto?.economia_mensal, clienteValidado.valor_conta * 0.9),
            valor_investimento: this.validarNumero(dadosProjeto?.valor_investimento, 0) // Será calculado se for 0
        };

        // Calcular valor do investimento se não foi fornecido
        if (projetoValidado.valor_investimento === 0) {
            projetoValidado.valor_investimento = projetoValidado.potencia_kwp * 5000; // R$ 5.000 por kWp
        }

        console.log('✅ Dados validados:', { cliente: clienteValidado, projeto: projetoValidado });
        
        return {
            cliente: clienteValidado,
            projeto: projetoValidado
        };
    }

    /**
     * Valida se um valor é um número válido, caso contrário retorna o padrão
     */
    validarNumero(valor, padrao) {
        const numero = parseFloat(valor);
        return (isNaN(numero) || numero <= 0) ? padrao : numero;
    }

    /**
     * Gera proposta de emergência com dados mínimos
     */
    gerarPropostaEmergencia() {
        console.log('🚨 Gerando proposta de emergência...');
        
        const dadosEmergencia = this.validarEPrepararDados({}, {});
        const numeroProposta = this.gerarNumeroProposta();
        
        const novaAba = window.open('', '_blank');
        if (novaAba) {
            novaAba.document.write(`
                <html>
                <head><title>Proposta ${numeroProposta} - Emergência</title></head>
                <body style="font-family: Arial, sans-serif; padding: 40px; background: #F9F7F2;">
                    <div style="max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px;">
                        <h1 style="color: #064B59; text-align: center;">LURIX ENERGIA SOLAR</h1>
                        <h2 style="color: #E6FF28; background: #064B59; padding: 20px; text-align: center; border-radius: 8px;">
                            PROPOSTA COMERCIAL - ${numeroProposta}
                        </h2>
                        <p style="color: #898A90; text-align: center; margin: 40px 0;">
                            ⚠️ Esta é uma proposta gerada com dados padrão.<br>
                            Entre em contato para personalizar com seus dados reais.
                        </p>
                        <div style="background: #F9F7F2; padding: 30px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #064B59;">📞 Contato LURIX:</h3>
                            <p><strong>WhatsApp:</strong> (11) 99999-9999</p>
                            <p><strong>Email:</strong> comercial@lurix.com</p>
                            <p><strong>Telefone:</strong> (11) 3333-4444</p>
                        </div>
                    </div>
                </body>
                </html>
            `);
            novaAba.document.close();
        }
        
        return { success: true, numeroProposta, type: 'emergency' };
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
    
    <style>
        :root {
            --amarelo-neon: #E6FF28;
            --azul-petroleo: #064B59;
            --branco-sujo: #F9F7F2;
            --cinza-medio: #898A90;
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
        }
        
        .highlight-number {
            color: var(--amarelo-neon);
            text-shadow: 0 0 10px rgba(230, 255, 40, 0.5);
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
        }
        
        @media print {
            .no-print { display: none !important; }
            body { background: white !important; }
        }
    </style>
</head>
<body class="bg-gray-50">
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
        <!-- Logo LURIX -->
        <div class="mb-8">
            <div class="inline-flex items-center justify-center w-24 h-24 rounded-full neon-glow mb-4"
                 style="background: var(--amarelo-neon);">
                <i class="fas fa-solar-panel text-3xl" style="color: var(--azul-petroleo);"></i>
            </div>
            <h1 class="text-2xl font-bold" style="color: var(--amarelo-neon);">LURIX ENERGIA SOLAR</h1>
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
                         style="background: linear-gradient(45deg, #059669, #10B981);">
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
                         style="background: linear-gradient(45deg, #7C3AED, #8B5CF6);">
                        <i class="fas fa-home text-4xl text-white"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-2" style="color: var(--azul-petroleo);">5. Consumo</h3>
                    <p class="text-sm" style="color: var(--cinza-medio);">Energia limpa para sua residência</p>
                </div>
            </div>
        </div>
        
        <!-- Benefícios Principais -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${this.gerarCardBeneficio('🌱', 'Sustentável', '100% energia renovável e limpa', '#10B981')}
            ${this.gerarCardBeneficio('💰', 'Econômico', 'Redução de até 95% na conta de luz', '#F59E0B')}
            ${this.gerarCardBeneficio('🔧', 'Durável', 'Vida útil superior a 25 anos', '#6366F1')}
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
            <div class="section-card p-8 text-center">
                <div class="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
                     style="background: linear-gradient(45deg, #EF4444, #F87171);">
                    <i class="fas fa-bolt text-2xl text-white"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2" style="color: var(--azul-petroleo);">Consumo Médio Mensal</h3>
                <div class="text-4xl font-bold mb-2" style="color: #EF4444;">${consumoMensal} kWh</div>
                <p class="text-sm" style="color: var(--cinza-medio);">Média dos últimos 12 meses</p>
            </div>
            
            <!-- Geração Estimada -->
            <div class="section-card p-8 text-center neon-glow">
                <div class="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
                     style="background: linear-gradient(45deg, #10B981, #34D399);">
                    <i class="fas fa-solar-panel text-2xl text-white"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2" style="color: var(--azul-petroleo);">Geração Estimada</h3>
                <div class="text-4xl font-bold mb-2 highlight-number">${geracaoMensal} kWh</div>
                <p class="text-sm" style="color: var(--cinza-medio);">Por mês com sistema solar</p>
            </div>
            
            <!-- Economia Mensal -->
            <div class="section-card p-8 text-center">
                <div class="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
                     style="background: linear-gradient(45deg, var(--amarelo-neon), #FDE047);">
                    <i class="fas fa-piggy-bank text-2xl" style="color: var(--azul-petroleo);"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2" style="color: var(--azul-petroleo);">Economia Mensal</h3>
                <div class="text-4xl font-bold mb-2" style="color: #10B981;">R$ ${Math.round(valorConta * 0.9).toLocaleString('pt-BR')}</div>
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
                <h4 class="text-xl font-bold mb-6 text-center" style="color: #EF4444;">
                    ❌ Sem Sistema Solar
                </h4>
                <div class="space-y-4">
                    <div class="flex justify-between items-center">
                        <span>Gasto anual com energia:</span>
                        <span class="font-bold text-lg" style="color: #EF4444;">R$ ${(valorConta * 12).toLocaleString('pt-BR')}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Em 25 anos (com inflação):</span>
                        <span class="font-bold text-lg" style="color: #EF4444;">R$ ${Math.round(valorConta * 12 * 25 * 1.8).toLocaleString('pt-BR')}</span>
                    </div>
                </div>
            </div>
            
            <!-- Com Sistema Solar -->
            <div class="section-card p-8" style="border: 3px solid var(--amarelo-neon);">
                <h4 class="text-xl font-bold mb-6 text-center" style="color: #10B981;">
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
                     style="background: linear-gradient(45def, #10B981, #34D399);">
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
                     style="background: linear-gradient(45deg, #F59E0B, #FBBF24);">
                    <i class="fas fa-trophy text-3xl text-white"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2" style="color: var(--azul-petroleo);">ROI</h3>
                <div class="text-5xl font-bold mb-2" style="color: #F59E0B;">${Math.round(dados.financeiro.roi)}%</div>
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
     * Gera Seção de Investimento
     */
    gerarInvestimento(dados) {
        const numPaineis = Math.ceil(dados.projeto.potencia_kwp / 0.555);
        const numInversores = Math.ceil(dados.projeto.potencia_kwp / 5);
        
        return `
<!-- INVESTIMENTO -->
<div id="investimento" class="min-h-screen py-20" style="background: var(--branco-sujo);">
    <div class="max-w-6xl mx-auto px-8">
        <div class="text-center mb-16">
            <h2 class="text-5xl font-bold mb-6" style="color: var(--azul-petroleo);">
                <i class="fas fa-money-bill-wave mr-4"></i>Investimento e Condições Comerciais
            </h2>
            <p class="text-xl" style="color: var(--cinza-medio);">
                Detalhamento completo do investimento necessário
            </p>
        </div>
        
        <!-- Tabela de Equipamentos -->
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
                            <th class="p-4 text-center">Especificação</th>
                            <th class="p-4 text-right rounded-tr-lg">Valor Unit.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b hover:bg-gray-50">
                            <td class="p-4 font-semibold">
                                <i class="fas fa-solar-panel mr-2" style="color: var(--amarelo-neon);"></i>
                                Painéis Solares
                            </td>
                            <td class="p-4 text-center font-bold">${numPaineis}x</td>
                            <td class="p-4 text-center">555W Monocristalino Tier 1</td>
                            <td class="p-4 text-right font-bold">R$ ${Math.round(dados.financeiro.valorInvestimento * 0.6 / numPaineis).toLocaleString('pt-BR')}</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                            <td class="p-4 font-semibold">
                                <i class="fas fa-microchip mr-2" style="color: var(--amarelo-neon);"></i>
                                Inversor(es)
                            </td>
                            <td class="p-4 text-center font-bold">${numInversores}x</td>
                            <td class="p-4 text-center">String ${Math.ceil(dados.projeto.potencia_kwp / numInversores)}kW com WiFi</td>
                            <td class="p-4 text-right font-bold">R$ ${Math.round(dados.financeiro.valorInvestimento * 0.15 / numInversores).toLocaleString('pt-BR')}</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                            <td class="p-4 font-semibold">
                                <i class="fas fa-wrench mr-2" style="color: var(--amarelo-neon);"></i>
                                Estrutura de Fixação
                            </td>
                            <td class="p-4 text-center font-bold">1x</td>
                            <td class="p-4 text-center">Alumínio Anodizado Completa</td>
                            <td class="p-4 text-right font-bold">R$ ${Math.round(dados.financeiro.valorInvestimento * 0.1).toLocaleString('pt-BR')}</td>
                        </tr>
                        <tr class="border-b hover:bg-gray-50">
                            <td class="p-4 font-semibold">
                                <i class="fas fa-tools mr-2" style="color: var(--amarelo-neon);"></i>
                                Instalação e Projeto
                            </td>
                            <td class="p-4 text-center font-bold">1x</td>
                            <td class="p-4 text-center">Mão de Obra Especializada</td>
                            <td class="p-4 text-right font-bold">R$ ${Math.round(dados.financeiro.valorInvestimento * 0.15).toLocaleString('pt-BR')}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr style="background: var(--amarelo-neon);">
                            <td class="p-4 font-bold text-xl" style="color: var(--azul-petroleo);">VALOR TOTAL</td>
                            <td class="p-4"></td>
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- À Vista -->
            <div class="section-card p-8 hover:scale-105 transition-all duration-300">
                <div class="text-center">
                    <div class="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
                         style="background: linear-gradient(45deg, #10B981, #34D399);">
                        <i class="fas fa-hand-holding-usd text-2xl text-white"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-4" style="color: var(--azul-petroleo);">💵 À Vista</h3>
                    <div class="text-3xl font-bold mb-4" style="color: #10B981;">
                        R$ ${Math.round(dados.financeiro.valorInvestimento * 0.9).toLocaleString('pt-BR')}
                    </div>
                    <div class="bg-green-100 rounded-lg p-4 mb-4">
                        <div class="text-sm text-green-800 font-semibold">🎉 DESCONTO ESPECIAL</div>
                        <div class="text-lg font-bold text-green-800">10% OFF</div>
                    </div>
                    <ul class="text-sm text-left space-y-2" style="color: var(--cinza-medio);">
                        <li>✅ Maior desconto disponível</li>
                        <li>✅ Instalação prioritária</li>
                        <li>✅ Garantia estendida gratuita</li>
                    </ul>
                </div>
            </div>
            
            <!-- Financiado -->
            <div class="section-card p-8 hover:scale-105 transition-all duration-300" style="border: 2px solid var(--amarelo-neon);">
                <div class="text-center">
                    <div class="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
                         style="background: linear-gradient(45deg, var(--amarelo-neon), #FDE047);">
                        <i class="fas fa-credit-card text-2xl" style="color: var(--azul-petroleo);"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-4" style="color: var(--azul-petroleo);">💳 Financiado</h3>
                    <div class="text-lg mb-2">Entrada:</div>
                    <div class="text-2xl font-bold mb-4" style="color: var(--azul-petroleo);">
                        R$ ${Math.round(dados.financeiro.valorInvestimento * 0.3).toLocaleString('pt-BR')}
                    </div>
                    <div class="bg-yellow-100 rounded-lg p-4 mb-4">
                        <div class="text-sm" style="color: var(--azul-petroleo);">Parcelas de:</div>
                        <div class="text-2xl font-bold highlight-number">R$ ${Math.round(dados.financeiro.valorInvestimento * 0.7 / 60).toLocaleString('pt-BR')}</div>
                        <div class="text-sm" style="color: var(--azul-petroleo);">60x sem juros</div>
                    </div>
                    <ul class="text-sm text-left space-y-2" style="color: var(--cinza-medio);">
                        <li>✅ Parcelas que cabem no seu bolso</li>
                        <li>✅ Economia desde o primeiro mês</li>
                        <li>✅ Aprovação facilitada</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>`;
    }

    /**
     * Gera Garantias e Benefícios
     */
    gerarGarantiasBeneficios() {
        return `
<!-- GARANTIAS E BENEFÍCIOS -->
<div id="garantias" class="min-h-screen py-20 bg-white">
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
                    <h3 class="text-3xl font-bold" style="color: var(--azul-petroleo);">LURIX CRM</h3>
                    <p class="text-lg" style="color: var(--cinza-medio);">Energia Solar Profissional</p>
                </div>
                
                <div class="space-y-4 text-left">
                    ${this.gerarItemContato('fas fa-map-marker-alt', 'Endereço', 'Av. Paulista, 1000 - São Paulo, SP')}
                    ${this.gerarItemContato('fas fa-clock', 'Horário', 'Segunda a Sexta: 8h às 18h')}
                    ${this.gerarItemContato('fas fa-certificate', 'CNPJ', '12.345.678/0001-90')}
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
                                <div class="text-lg">(11) 99999-9999</div>
                            </div>
                        </div>
                        <button onclick="window.open('https://wa.me/5511999999999?text=Olá, tenho interesse na proposta de energia solar!', '_blank')"
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
                                <div class="text-lg">(11) 3333-4444</div>
                            </div>
                        </div>
                        <button onclick="window.open('tel:+551133334444', '_self')"
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
                                <div class="text-lg">comercial@lurixcrm.com</div>
                            </div>
                        </div>
                        <button onclick="window.open('mailto:comercial@lurixcrm.com?subject=Interesse em Energia Solar', '_blank')"
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
                        Proposta válida por <span class="highlight-number font-bold">30 dias</span>
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
    <button onclick="window.open('https://wa.me/5511999999999?text=Olá, tenho interesse na proposta de energia solar!', '_blank')"
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
        // Gráfico de Geração Mensal
        const ctxGeracao = document.getElementById('graficoGeracaoMensal');
        if (ctxGeracao) {
            new Chart(ctxGeracao, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    datasets: [{
                        label: 'Geração (kWh)',
                        data: [${geracaoMensal * 1.1}, ${geracaoMensal * 0.9}, ${geracaoMensal * 1.05}, 
                               ${geracaoMensal * 0.85}, ${geracaoMensal * 0.75}, ${geracaoMensal * 0.7},
                               ${geracaoMensal * 0.75}, ${geracaoMensal * 0.85}, ${geracaoMensal * 0.9},
                               ${geracaoMensal * 1.05}, ${geracaoMensal * 1.15}, ${geracaoMensal * 1.2}],
                        backgroundColor: 'var(--amarelo-neon)',
                        borderColor: 'var(--azul-petroleo)',
                        borderWidth: 2,
                        borderRadius: 8
                    }, {
                        label: 'Consumo (kWh)',
                        data: Array(12).fill(${consumoMensal}),
                        type: 'line',
                        borderColor: '#EF4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 3,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: { size: 14, weight: 'bold' },
                                color: 'var(--azul-petroleo)'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'var(--azul-petroleo)',
                            titleColor: 'var(--amarelo-neon)',
                            bodyColor: 'white'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0,0,0,0.1)' },
                            ticks: { color: 'var(--cinza-medio)', font: { weight: 'bold' } }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: 'var(--azul-petroleo)', font: { weight: 'bold' } }
                        }
                    }
                }
            });
        }
        
        // Gráfico Comparativo
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
                        borderColor: '#EF4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 4,
                        tension: 0.4
                    }, {
                        label: 'Com Sistema Solar',
                        data: Array.from({length: 26}, (_, i) => 
                            i === 0 ? ${dados.financeiro.valorInvestimento} : 
                            ${dados.cliente.valor_conta * 12 * 0.1} * Math.pow(1.08, i)
                        ),
                        borderColor: 'var(--amarelo-neon)',
                        backgroundColor: 'rgba(230, 255, 40, 0.2)',
                        borderWidth: 4,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: { size: 14, weight: 'bold' },
                                color: 'var(--azul-petroleo)'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0,0,0,0.1)' },
                            ticks: { 
                                color: 'var(--cinza-medio)',
                                callback: function(value) {
                                    return 'R$ ' + value.toLocaleString('pt-BR');
                                }
                            }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: 'var(--azul-petroleo)' }
                        }
                    }
                }
            });
        }`;
    }

    /**
     * Calcula dados financeiros - SEMPRE funciona mesmo com dados inválidos
     */
    calcularDadosFinanceiros(dadosProjeto) {
        try {
            // Valores com fallbacks seguros
            const potencia = this.validarNumero(dadosProjeto?.potencia_kwp, 5.5);
            const valorPorKwp = 5000; // R$ 5.000 por kWp
            const valorInvestimento = this.validarNumero(dadosProjeto?.valor_investimento, potencia * valorPorKwp);
            const economiaAnual = this.validarNumero(dadosProjeto?.economia_mensal, 380) * 12 * 0.9; // 90% de economia
            
            // Cálculos com proteção contra divisão por zero
            const paybackAnos = economiaAnual > 0 ? 
                Math.round((valorInvestimento / economiaAnual) * 100) / 100 : 
                99; // Se não há economia, payback muito alto
                
            const tirPorcentagem = valorInvestimento > 0 ? 
                Math.round((economiaAnual / valorInvestimento) * 100 * 100) / 100 : 
                0;
            
            const economiaTotal25Anos = economiaAnual * 25 * 1.5; // Com inflação energética
            const lucroLiquido = economiaTotal25Anos - valorInvestimento;
            const roi = valorInvestimento > 0 ? 
                Math.round((lucroLiquido / valorInvestimento) * 100) : 
                0;
            
            const resultado = {
                valorInvestimento: Math.round(valorInvestimento),
                economiaAnual: Math.round(economiaAnual),
                paybackAnos: Math.max(paybackAnos, 0), // Não pode ser negativo
                tirPorcentagem: Math.max(tirPorcentagem, 0),
                economiaTotal25Anos: Math.round(economiaTotal25Anos),
                lucroLiquido: Math.round(lucroLiquido),
                roi: roi
            };
            
            console.log('💰 Dados financeiros calculados:', resultado);
            return resultado;
            
        } catch (error) {
            console.warn('⚠️ Erro ao calcular dados financeiros, usando valores padrão:', error);
            
            // Dados financeiros de emergência
            return {
                valorInvestimento: 27500,
                economiaAnual: 4104,
                paybackAnos: 6.7,
                tirPorcentagem: 14.9,
                economiaTotal25Anos: 153900,
                lucroLiquido: 126400,
                roi: 459
            };
        }
    }

    /**
     * Gera número da proposta
     */
    gerarNumeroProposta() {
        const ano = new Date().getFullYear();
        const mes = String(new Date().getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `LX${ano}${mes}${random}`;
    }
}

// Inicializar globalmente
window.propostaPremiumGenerator = new PropostaPremiumGenerator();

console.log('✅ Gerador de Proposta Premium carregado com sucesso!');