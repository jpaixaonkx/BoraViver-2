/**
 * BORAVIVER VIAGENS - Core Frontend Engine (main.js)
 * Ano: 2026
 * Funcionalidades: Geolocalização ativa, Integração com API de Clima,
 *                  Controle de busca e animações de interface.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa os módulos principais da Landing Page
    BoraViverGeo.init();
    BoraViverSearch.init();
});

/**
 * Módulo de Geolocalização e Clima
 */
const BoraViverGeo = {
    // Chave padrão de fallback (Em produção, o backend interceptará para mascarar chaves sensíveis)
    // Conforme definido no ecossistema .env
    init() {
        this.geoTarget = document.getElementById('geoTarget');
        this.weatherTarget = document.getElementById('weatherTarget');
        
        if (!this.geoTarget || !this.weatherTarget) return;

        this.detectarLocalizacao();
    },

    detectarLocalizacao() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    this.obterDadosClimaEMunicipio(lat, lon);
                },
                (error) => {
                    console.warn("Geolocalização recusada ou indisponível. Usando fallback premium.");
                    this.aplicarFallback();
                },
                { timeout: 7000 }
            );
        } else {
            this.aplicarFallback();
        }
    },

    async obterDadosClimaEMunicipio(lat, lon) {
        try {
            // Em produção, esta chamada consome o microserviço em Node.js do próprio projeto (backend/controllers/travelController)
            // que por sua vez consome a API do OpenWeatherMap/WeatherAPI usando a WEATHER_API_KEY do .env
            const response = await fetch(`/api/travel/local-status?lat=${lat}&lon=${lon}`);
            
            if (!response.ok) throw new Error("Erro na requisição do servidor.");
            
            const data = await response.json();
            
            // Atualiza a interface de forma fluida
            this.atualizarInterfaceGeo(data.cidade, data.temperatura, data.condicao);
        } catch (err) {
            console.error("Falha ao consultar API externa. Usando mock dinâmico local de contingência.");
            this.aplicarFallback();
        }
    },

    atualizarInterfaceGeo(cidade, temp, condicao) {
        if (this.geoTarget && this.weatherTarget) {
            this.geoTarget.textContent = `${cidade}, BR`;
            this.weatherTarget.innerHTML = `<i class="fas ${this.getIconeCondicao(condicao)} me-1 animate__animated animate__pulse infinite"></i> ${temp}°C`;
        }
    },

    aplicarFallback() {
        // Fallback padrão elegante caso as APIs externas ou permissões falhem
        this.atualizarInterfaceGeo("São Paulo", 22, "clear");
    },

    getIconeCondicao(condicao) {
        const mapeamento = {
            'clear': 'fa-sun text-warning',
            'clouds': 'fa-cloud text-light',
            'rain': 'fa-cloud-showers-heavy text-info',
            'snow': 'fa-snowflake text-primary'
        };
        return mapeamento[condicao] || 'fa-cloud-sun text-warning';
    }
};

/**
 * Módulo de Captura e Validação do Formulário de Busca Rápida
 */
const BoraViverSearch = {
    init() {
        this.searchForm = document.getElementById('searchForm');
        if (!this.searchForm) return;

        this.bindEvents();
    },

    bindEvents() {
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processarBusca();
        });
    },

    processarBusca() {
        // Captura os dados inseridos de forma higienizada
        const origem = this.searchForm.elements[0].value.trim();
        const destino = this.searchForm.elements[1].value.trim();
        const dataIda = this.searchForm.elements[2].value;
        const dataVolta = this.searchForm.elements[3].value;

        if (!origem || !destino || !dataIda) {
            alert("Por favor, preencha todos os campos obrigatórios (Origem, Destino e Data de Ida).");
            return;
        }

        // Armazena temporariamente no sessionStorage para preenchimento automático caso o usuário vá se logar ou cadastrar
        const dadosBusca = { origem, destino, dataIda, dataVolta };
        sessionStorage.setItem('boraviver_last_search', JSON.stringify(dadosBusca));

        // Como o usuário não está logado na Landing Page, redireciona suavemente para o Login para concluir a simulação detalhada
        window.location.href = './login.html';
    }
};