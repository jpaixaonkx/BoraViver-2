/**
 * BORAVIVER VIAGENS - Painel Administrativo Core (admin.js)
 * Ano: 2026
 * Funcionalidades: Inicialização de Gráficos (Chart.js), CRUD de Links/Promoções,
 *                  Atualizações em tempo real (Supabase Realtime) e Métricas.
 */

// Inicialização segura do cliente Supabase (Certifique-se de herdar os dados corretos do .env)
const SUPABASE_URL = "https://phwmvivnrlgucomktgkw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_wPdVmvf5EzMGCXrjMt0eDQ_qF62zpgS";
const adminSupabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

document.addEventListener('DOMContentLoaded', async () => {
    // Garante que apenas administradores acessem este escopo de execução
    if (window.BoraViverAuth) {
        await window.BoraViverAuth.protegerRota('ADMIN');
    }

    AdminDashboard.init();
    AdminCrudLinks.init();
    AdminSettings.init();
});

/**
 * 1. GERENCIAMENTO DE MÉTRICAS E GRÁFICOS (CHART.JS)
 */
const AdminDashboard = {
    init() {
        this.renderizarGraficoVendas();
        this.renderizarGraficoOrigemCliques();
        this.escutarMetricasRealtime();
    },

    renderizarGraficoVendas() {
        const ctxVendas = document.getElementById('chartVendas');
        if (!ctxVendas) return;

        // Gráfico de Linha e Barras Combinados para Faturamento e Conversões
        this.vendasChart = new Chart(ctxVendas, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Faturamento Mensal (R$)',
                    data: [12000, 19000, 32000, 50000, 41000, 65000],
                    borderColor: '#00f0ff', // Azul Neon
                    backgroundColor: 'rgba(0, 240, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Simulações Convertidas',
                    type: 'bar',
                    data: [15, 22, 30, 45, 38, 52],
                    backgroundColor: '#ff007f', // Rosa Magenta
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#ffffff' } }
                },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#ffffff' } },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#ffffff' } }
                }
            }
        });
    },

    renderizarGraficoOrigemCliques() {
        const ctxPizza = document.getElementById('chartCliques');
        if (!ctxPizza) return;

        // Gráfico de Pizza/Donut para cliques e origens de interesse
        this.cliquesChart = new Chart(ctxPizza, {
            type: 'doughnut',
            data: {
                labels: ['Passagens', 'Hospedagens', 'Pacotes'],
                datasets: [{
                    data: [45, 25, 30],
                    backgroundColor: ['#0072ff', '#ff007f', '#ffbd59'], // Oceano, Magenta, Dourado
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#ffffff' } }
                }
            }
        });
    },

    escutarMetricasRealtime() {
        if (!adminSupabase) return;

        // Escuta novas simulações em tempo real para atualizar os contadores do painel instantaneamente
        adminSupabase
            .channel('public:simulations')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'simulations' }, payload => {
                this.incrementarContadorDinamico('totalSimulacoes');
                this.incrementarContadorDinamico('totalFaturamentoDiario', payload.new.valor_total);
            })
            .subscribe();
    },

    incrementarContadorDinamico(elementId, valorAdicional = null) {
        const el = document.getElementById(elementId);
        if (!el) return;

        if (valorAdicional) {
            let atual = parseFloat(el.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            atual += parseFloat(valorAdicional);
            el.textContent = `R$ ${atual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        } else {
            let atual = parseInt(el.textContent) || 0;
            el.textContent = atual + 1;
        }
    }
};

/**
 * 2. GERENCIAMENTO DE LINKS DE VIAGEM E PROMOÇÕES (CRUD)
 */
const AdminCrudLinks = {
    init() {
        this.linkForm = document.getElementById('linkForm');
        this.promoForm = document.getElementById('promoForm');

        if (this.linkForm) {
            this.linkForm.addEventListener('submit', (e) => this.salvarLink(e));
        }
        if (this.promoForm) {
            this.promoForm.addEventListener('submit', (e) => this.salvarPromocao(e));
        }
    },

    async salvarLink(e) {
        e.preventDefault();
        const tipo = document.getElementById('linkTipo').value;
        const nome = document.getElementById('linkNome').value;
        const url = document.getElementById('linkUrl').value;

        try {
            const { error } = await adminSupabase
                .from('travel_links')
                .insert([{ tipo, nome, url, status: true }]);

            if (error) throw error;
            alert("Link de Viagem cadastrado com sucesso! Atualizado no app do cliente em tempo real.");
            this.linkForm.reset();
        } catch (err) {
            alert("Erro ao salvar link: " + err.message);
        }
    },

    async salvarPromocao(e) {
        e.preventDefault();
        const titulo = document.getElementById('promoTitleInput').value;
        const destino = document.getElementById('promoDestinoInput').value;
        const valor = parseFloat(document.getElementById('promoValorInput').value);
        const descricao = document.getElementById('promoDescInput').value;
        const dataValidade = document.getElementById('promoValidadeInput').value;

        try {
            const { error } = await adminSupabase
                .from('promotions')
                .insert([{ 
                    titulo, 
                    destino, 
                    valor, 
                    descricao, 
                    data_validade: dataValidade,
                    imagem: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21', 
                    status: true 
                }]);

            if (error) throw error;
            alert("Nova promoção lançada com sucesso no sistema!");
            this.promoForm.reset();
        } catch (err) {
            alert("Erro ao lançar promoção: " + err.message);
        }
    }
};

/**
 * 3. CONFIGURAÇÕES DA EMPRESA
 */
const AdminSettings = {
    init() {
        this.settingsForm = document.getElementById('settingsForm');
        if (this.settingsForm) {
            this.settingsForm.addEventListener('submit', (e) => this.atualizarEmpresa(e));
        }
    },

    async atualizarEmpresa(e) {
        e.preventDefault();
        const empresa = document.getElementById('cfgEmpresa').value;
        const whatsapp = document.getElementById('cfgWhatsapp').value;
        const email = document.getElementById('cfgEmail').value;
        const sobre = document.getElementById('cfgSobre').value;

        try {
            const { error } = await adminSupabase
                .from('company_settings')
                .update({ empresa, whatsapp, email, sobre })
                .eq('id', 1); // Atualiza o registro fixo e exclusivo de ID 1

            if (error) throw error;
            alert("Configurações institucionais salvas. O cliente visualizará imediatamente!");
        } catch (err) {
            alert("Erro ao atualizar empresa: " + err.message);
        }
    }
};