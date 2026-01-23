const App = {
    allowedQuantities: [1, 5, 10, 15, 20, 25],

    // Textos informativos para SEO e conformidade com o AdSense
    descriptions: {
        pessoa: "Gera perfis completos com nomes, documentos e endereços baseados em dados estatísticos brasileiros. O algoritmo seleciona nomes e sobrenomes de bases reais para garantir verossimilhança em testes de software.",
        cpf: "O CPF (Cadastro de Pessoas Físicas) utiliza um algoritmo de Módulo 11. Os nove primeiros dígitos são aleatórios e os dois últimos são calculados para garantir a integridade do documento.",
        cnpj: "O Cadastro Nacional da Pessoa Jurídica (CNPJ) consiste em 14 dígitos. O cálculo utiliza pesos matemáticos específicos para validar se o número é estruturalmente correto.",
        'validador-cpf': "Esta ferramenta utiliza o cálculo oficial do dígito verificador para confirmar se um CPF inserido é matematicamente válido perante as regras da Receita Federal.",
        'validador-cnpj': "Valida a estrutura de 14 dígitos de um CNPJ empresarial, verificando se os dígitos de controle correspondem ao cálculo dos 12 dígitos iniciais.",
        'validador-json': "Analisa a sintaxe de um código JSON. Se o código for válido, ele identifica a estrutura de objetos e arrays; se for inválido, aponta erro de formatação.",
        'validador-email': "Verifica se o endereço eletrônico segue o padrão estabelecido pelas RFCs de comunicação, garantindo a presença de usuário, @ e domínio válido."
    },

    disclaimer: `
        <div class="info-box" style="background: #f1f5f9; padding: 15px; border-radius: 8px; font-size: 0.85rem; margin-top: 20px; border-left: 4px solid #469146; color: #475569;">
            <strong>IMPORTANTE:</strong> Nosso gerador online de Pessoa tem como intenção ajudar estudantes, programadores, analistas e testadores a gerar documentos. Normalmente necessários para testar seus softwares em desenvolvimento.
            A má utilização dos dados aqui gerados é de total responsabilidade do usuário.
            Os números são gerados de forma aleatória, respeitando as regras de criação de cada documento.
            <br><small>*Este conteúdo contém links patrocinados. Ao comprar através dos nossos links, podemos receber uma comissão.</small>
        </div>`,

    staticPages: {
        sobre: `
            <h3>Sobre o DevSimulate</h3>
            <p>O DevSimulate é uma plataforma de ferramentas online projetada exclusivamente para auxiliar desenvolvedores, programadores, analistas de sistemas e estudantes em seus fluxos de trabalho e testes de software.</p>
            <p>Entendemos que o processo de desenvolvimento exige rapidez. Por isso, oferecemos geradores de massa de dados e validadores técnicos que respeitam rigorosamente os algoritmos oficiais (como Módulo 11 para documentos brasileiros e RFC 8259 para JSON). Nossa missão é centralizar as utilitários essenciais do dia a dia em uma interface moderna, rápida e intuitiva.</p>`,
        
        privacidade: `
            <h3>Política de Privacidade</h3>
            <p>A sua privacidade é importante para nós. É política do DevSimulate respeitar a sua privacidade em relação a qualquer informação que possamos coletar no site.</p>
            <p><strong>Coleta de Dados:</strong> Não coletamos dados pessoais sensíveis. Os dados gerados pelas ferramentas são processados localmente no seu navegador e não são armazenados em nossos servidores.</p>
            <p><strong>Anúncios:</strong> Utilizamos o Google AdSense para exibir anúncios. O Google utiliza cookies para veicular anúncios baseados em visitas anteriores do usuário.</p>`,
        
        termos: `
            <h3>Termos de Uso</h3>
            <p>1. Aceitação: Ao acessar este site, você concorda em cumprir estes termos de serviço.</p>
            <p>2. Uso de Licença: As ferramentas são fornecidas "como estão" para fins de teste e desenvolvimento.</p>
            <p>3. Responsabilidade: O DevSimulate não se responsabiliza pelo uso indevido dos dados gerados. Estes dados não devem ser utilizados para fins ilícitos ou cadastros reais em serviços de terceiros.</p>`,
        
        contato: `
            <h3>Contato</h3>
            <p>Dúvidas, sugestões ou reporte de erros? Entre em contato connosco através do e-mail abaixo:</p>
            <div class="field-box">
                <div class="field-content">
                    <span>suporte@devsimulate.com.br</span>
                </div>
            </div>`
    },

    init() {
        window.addEventListener('hashchange', () => this.route());
        window.addEventListener('load', () => this.route());

        this.initTheme();
        
        const menuBtn = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            } else {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('expanded');
            }
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    },

    initTheme() {
        const themeBtn = document.getElementById('theme-toggle');
        if (!themeBtn) return;

        // Verifica o cache
        const savedTheme = localStorage.getItem('theme');
        
        // Se for a primeira vez (null) ou se estiver salvo como 'dark'
        if (savedTheme === 'dark' || savedTheme === null) {
            document.body.classList.add('dark-mode');
            this.updateThemeIcon(true);
            // Garante que o cache tenha 'dark' na primeira visita
            if (savedTheme === null) localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            this.updateThemeIcon(false);
        }

        themeBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            this.updateThemeIcon(isDark);
        });
    },

    updateThemeIcon(isDark) {
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            // Trocamos o ícone e RE-INICIALIZAMOS o Lucide
            themeBtn.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
            
            // Isso aqui é o que faz o ícone aparecer de verdade!
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    },

    route() {
        const hash = window.location.hash || '#/pessoa';
        const type = hash.replace('#/', '');
        const view = document.getElementById('app-view');
        const title = document.getElementById('page-title');

        document.querySelectorAll('.nav-item').forEach(el => 
            el.classList.toggle('active', el.getAttribute('href') === hash));

        if (['sobre', 'privacidade', 'termos', 'contato'].includes(type)) {
            this.renderStaticPage(type);
            return; // Importante parar a execução aqui
        }

        const titles = {
            pessoa: "Gerador de Pessoa", cpf: "Gerador de CPF", cnpj: "Gerador de CNPJ",
            pix: "Gerador de Chave PIX", cartao: "Cartão de Crédito", contaBancaria: "Conta Bancária",
            boleto: "Gerador de Boleto", ie: "Inscrição Estadual", ip: "Endereço IP",
            mac: "MAC Address", userAgent: "User Agent", senha: "Gerador de Senha",
            guid: "GUID/UUID", cep: "Consulta de CEP", lorem: "Lorem Ipsum",
            cor: "Seletor de Cores", coordenadas: "Coordenadas & Mapas",
            placa: "Placa Mercosul", renavam: "RENAVAM", qrcode: "Gerador de QR Code",
            'validador-cpf': "Validador de CPF", 'validador-cnpj': "Validador de CNPJ",
            'validador-json': "Validador de JSON", 'validador-email': "Validador de E-mail"
        };
        title.innerText = titles[type] || "Gerador";

        // Renderização Dinâmica conforme o tipo
        if (type.startsWith('validador-')) return this.renderValidatorPage(type, view);
        if (type === 'lorem') return this.renderLorem(view);
        if (type === 'cor') return this.renderColorPicker(view);
        if (type === 'coordenadas') return this.renderMaps(view);
        if (type === 'qrcode') return this.renderQRCode(view);

        // Layout Padrão para Geradores
        this.renderDefaultGenerator(type, view);
    },

    renderStaticPage(type) {
        const view = document.getElementById('app-view');
        const titles = { 
            sobre: "Sobre o DevSimulate", 
            privacidade: "Política de Privacidade", 
            termos: "Termos de Uso", 
            contato: "Fale Conosco" 
        };
        
        document.getElementById('page-title').innerText = titles[type] || "Informação";

        // Aqui pegamos o HTML formatado que está lá no topo do seu App.staticPages
        const htmlContent = this.staticPages[type] || "<p>Conteúdo não encontrado.</p>";

        view.innerHTML = `
            <div class="card static-content">
                <div style="line-height:1.8; color: inherit;">
                    ${htmlContent}
                </div>
                <div class="info-box" style="margin-top:30px; font-size:12px; opacity:0.7; border-left: 2px solid var(--primary);">
                    Última atualização: Janeiro de 2026.
                </div>
            </div>`;
        
        if(window.lucide) lucide.createIcons();
    },

    renderDefaultGenerator(type, view) {
        let html = `
            <div class="tool-intro" style="margin-bottom:20px; color: #64748b; font-size: 0.95rem;">
                <p>${this.descriptions[type] || "Ferramenta utilitária para auxílio em desenvolvimento e testes."}</p>
            </div>
            <div class="card">
                <div class="config-row">
                    <div class="group">
                        <label>Saída</label>
                        <select id="outFormat" onchange="App.toggleQty()">
                            <option value="screen">Visualização</option>
                            <option value="json">JSON</option>
                        </select>
                    </div>
                    <div class="group" id="qtyGroup" style="display:none">
                        <label>Quantidade</label>
                        <select id="outQty">
                            ${this.allowedQuantities.map(q => `<option value="${q}">${q}</option>`).join('')}
                        </select>
                    </div>`;
        
        if (type === 'pessoa') {
            html += `
                <div class="group">
                    <label>Gênero</label>
                    <select id="pSex">
                        <option value="indiferente">Indiferente</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                    </select>
                </div>`;
        }

        html += `
                </div> 
                <button class="btn-primary" onclick="App.generate('${type}')">Gerar Dados</button>
                <div id="result"></div>
                ${this.disclaimer}
            </div>`;

        view.innerHTML = html;
        if(window.lucide) lucide.createIcons();
    },

    renderValidatorPage(type, view) {
        const isJson = type === 'validador-json';
        view.innerHTML = `
            <div class="tool-intro" style="margin-bottom:20px; color: #64748b;">
                <p>${this.descriptions[type] || "Ferramenta de validação técnica."}</p>
            </div>
            <div class="card">
                <div class="group">
                    <label>Insira o conteúdo para analisar</label>
                    <textarea id="val-input" class="field-box" style="width:100%; height:300px; padding:15px; margin-top:10px; border-radius:8px; border:1px solid #e2e8f0; font-family:'JetBrains Mono'; font-size: 13px; line-height:1.5; resize: vertical;"></textarea>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                    <button class="btn-primary" onclick="App.executeValidation('${type}')">Apenas Validar</button>
                    ${isJson ? `<button class="btn-secondary" style="background: #6366f1; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight:600;" onclick="App.formatJson()">Validar e Formatar JSON</button>` : ''}
                    <button class="btn-outline" style="background: transparent; border: 1px solid #e2e8f0; padding: 10px 15px; border-radius: 8px; cursor: pointer;" onclick="document.getElementById('val-input').value = ''">Limpar</button>
                </div>
                <div id="val-result" style="margin-top:20px"></div>
            </div>`;
    },

    formatJson() {
        const inputField = document.getElementById('val-input');
        const resultDiv = document.getElementById('val-result');
        const rawValue = inputField.value.trim();

        if (!rawValue) {
            resultDiv.innerHTML = `<div style="color:#64748b; background:#f8fafc; padding:15px; border-radius:8px;">⚠️ Insira um código JSON para formatar.</div>`;
            return;
        }

        try {
            // Converte string para Objeto
            const obj = JSON.parse(rawValue);
            
            // Converte Objeto de volta para String com indentação de 4 espaços
            const formatted = JSON.stringify(obj, null, 4);
            
            // Devolve para o campo de texto
            inputField.value = formatted;

            resultDiv.innerHTML = `
                <div style="color:#16a34a; background:#f0fdf4; padding:15px; border-radius:8px; border:1px solid #bcf0da; display:flex; justify-content:space-between; align-items:center;">
                    <span>✅ JSON Válido e Formatado!</span>
                    <button class="btn-copy-small" onclick="App.copyText(document.getElementById('val-input').value)">
                        <i data-lucide="copy" style="width:14px;height:14px"></i> Copiar Código
                    </button>
                </div>`;
            
            if(window.lucide) lucide.createIcons();
        } catch (e) {
            // Se der erro, mostra onde está o erro no JSON
            resultDiv.innerHTML = `
                <div style="color:#dc2626; background:#fef2f2; padding:15px; border-radius:8px; border:1px solid #fbd5d5;">
                    <strong>❌ JSON Inválido:</strong> ${e.message}
                </div>`;
        }
    },

    executeValidation(type) {
        const input = document.getElementById('val-input').value.trim();
        const resultDiv = document.getElementById('val-result');
        
        if (!input) return;

        let isValid = false;
        try {
            if (type === 'validador-json') {
                JSON.parse(input);
                isValid = true;
            } else if (type === 'validador-email') {
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
            }
            // ... outras validações (CPF/CNPJ)
        } catch (e) {
            isValid = false;
        }

        resultDiv.innerHTML = isValid 
            ? `<div style="color:#16a34a; background:#f0fdf4; padding:15px; border-radius:8px; border:1px solid #bcf0da;">✅ O dado informado é válido.</div>`
            : `<div style="color:#dc2626; background:#fef2f2; padding:15px; border-radius:8px; border:1px solid #fbd5d5;">❌ O dado informado é inválido.</div>`;
    },

    renderQRCode(container){

        container.innerHTML = `

            <div class="card">

                <div class="group">

                    <label>Conteúdo (Link ou Texto)</label>

                    <div class="field-box">

                        <div class="field-content">

                            <input type="text" id="qr-input" placeholder="https://google.com" spellcheck="false">

                        </div>

                    </div>

                </div>

                <button class="btn-primary" style="margin-top:20px" onclick="App.generateQR()">Gerar QR Code</button>

                <div id="qr-result" style="margin-top:20px; text-align:center; display:none;">

                    <img id="qr-img" src="" alt="QR Code" style="border: 10px solid white; border-radius: 8px; box-shadow: var(--shadow);">

                </div>

            </div>`;



        if(window.lucide) lucide.createIcons();

    },



    generateQR(){

        const val = document.getElementById('qr-input').value;

        if(!val) return alert("Digite um link ou texto!");

        const img = document.getElementById('qr-img');

        const res = document.getElementById('qr-result');

        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(val)}`;

        res.style.display = 'block';

    },



    renderLorem(container) {

        container.innerHTML = `

            <div class="card">

                <div class="config-row">

                    <div class="group">

                        <label>Tipo de Saída</label>

                        <select id="lorem-type" class="select-modern">

                            <option value="chars">Caracteres</option>

                            <option value="words">Palavras</option>

                            <option value="paragraphs">Parágrafos</option>

                        </select>

                    </div>



                    <div class="group">

                        <label>Quantidade</label>

                        <div class="field-box">

                            <div class="field-content">

                                <input type="number" id="lorem-qty" value="500" min="1" max="10000" spellcheck="false">

                            </div>

                        </div>

                    </div>

                </div>

               

                <button class="btn-primary" onclick="App.generateLorem()">Gerar Lorem Ipsum</button>



                <div id="lorem-result-container" class="json-box" style="margin-top:20px; display:none; position: relative;">

                    <button class="btn-copy-all" onclick="App.copyText(document.getElementById('lorem-text').innerText)" style="position: absolute; right: 15px; top: 15px;">

                        Copiar Tudo

                    </button>

                    <pre id="lorem-text" style="white-space: pre-wrap; font-family: 'Plus Jakarta Sans', sans-serif; color: #94a3b8; padding-top: 30px; font-size: 14px; line-height: 1.6;"></pre>

                </div>

            </div>`;

       

        if(window.lucide) lucide.createIcons();

    },



    renderColorPicker(container) {

        container.innerHTML = `

            <div class="card">

                <div class="color-tool-layout" style="display: flex; gap: 30px; align-items: center;">

                    <div id="color-preview" class="color-preview-large"></div>

                   

                    <div class="color-controls" style="flex: 1;">

                        <div class="group">

                            <label>Escolha na Paleta</label>

                            <div class="color-picker-container" id="picker-wrapper" style="background-color: #6366f1;">

                                <span class="picker-label">Clique aqui para escolher</span>

                                <input type="color" id="color-picker" value="#6366f1">

                            </div>

                        </div>

                       

                        <div class="group" style="margin-top:15px">

                            <label>Código HEX</label>

                            <div class="field-box">

                                <div class="field-content">

                                    <input type="text" id="color-hex-field" value="#6366F1" spellcheck="false">

                                    <button class="btn-copy-small" onclick="App.copyText(document.getElementById('color-hex-field').value)">

                                        <i data-lucide="copy" style="width:14px;height:14px"></i>

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>`;



        const picker = document.getElementById('color-picker');

        const hexField = document.getElementById('color-hex-field');

        const preview = document.getElementById('color-preview');

        const wrapper = document.getElementById('picker-wrapper');



        const updateAll = (color) => {

            const hex = color.toUpperCase();

            hexField.value = hex; // Atualiza o texto do input

            preview.style.backgroundColor = hex;

            wrapper.style.backgroundColor = hex;

           

            // Ajusta contraste do texto "Clique aqui"

            const r = parseInt(hex.slice(1,3), 16);

            const g = parseInt(hex.slice(3,5), 16);

            const b = parseInt(hex.slice(5,7), 16);

            const brightness = (r * 299 + g * 587 + b * 114) / 1000;

            document.querySelector('.picker-label').style.color = brightness > 125 ? '#0f172a' : '#ffffff';

        };



        // Evento quando muda na paleta

        picker.oninput = (e) => updateAll(e.target.value);



        // Evento quando o usuário DIGITA no campo

        hexField.oninput = (e) => {

            let val = e.target.value;

            if(!val.startsWith('#')) val = '#' + val;

            if(/^#[0-9A-F]{6}$/i.test(val)) {

                picker.value = val;

                updateAll(val);

            }

        };



        if(window.lucide) lucide.createIcons();

    },



    renderMaps(view) {

        const coords = Generators.coordenadas();

        view.innerHTML = `

            <div class="card">

                <div class="profile-grid">

                    ${this.buildField('Latitude', coords.latitude)}

                    ${this.buildField('Longitude', coords.longitude)}

                </div>

                <div class="map-container" style="margin-top: 25px; border-radius: 15px; overflow: hidden; height: 350px; border: 1px solid #e2e8f0;">

                    <iframe width="100%" height="100%" frameborder="0" src="https://maps.google.com/maps?q=${coords.latitude},${coords.longitude}&z=15&output=embed"></iframe>

                </div>

                <button class="btn-primary" style="margin-top: 20px;" onclick="App.route()">Gerar Nova Localização</button>

            </div>`;

        if(window.lucide) lucide.createIcons();

    },



    // --- LÓGICA DE GERAÇÃO ---



    generateLorem() {

        const qty = parseInt(document.getElementById('lorem-qty').value) || 100;

        const type = document.getElementById('lorem-type').value;

       

        // Texto base (você pode expandir essa string se quiser parágrafos mais variados)

        const baseText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ";

       

        let result = "";



        if (type === 'chars') {

            while(result.length < qty) result += baseText;

            result = result.substring(0, qty);

        }

        else if (type === 'words') {

            const words = baseText.repeat(10).split(' ');

            result = words.slice(0, qty).join(' ');

        }

        else if (type === 'paragraphs') {

            for(let i = 0; i < qty; i++) {

                result += baseText + "\n\n";

            }

        }



        const resDiv = document.getElementById('lorem-result-container');

        const pre = document.getElementById('lorem-text');

       

        pre.innerText = result.trim();

        resDiv.style.display = 'block';

    },



    toggleQty() {

        const isJson = document.getElementById('outFormat').value === 'json';

        const qtyGroup = document.getElementById('qtyGroup');

        if(qtyGroup) qtyGroup.style.display = isJson ? 'block' : 'none';

    },

    generate(type) {
        const format = document.getElementById('outFormat').value;
        const qtySelect = document.getElementById('outQty');
        const qty = (format === 'json' && qtySelect) ? parseInt(qtySelect.value) : 1;
        const dataList = Array.from({ length: qty }, () => this.createObject(type));
        const container = document.getElementById('result');

        if (format === 'json') {
            const jsonText = JSON.stringify(qty === 1 ? dataList[0] : dataList, null, 2);
            const encodedJson = btoa(unescape(encodeURIComponent(jsonText)));
            container.innerHTML = `
                <div class="json-box" style="margin-top:20px">
                    <button class="btn-copy-all" onclick="App.copyFromBase64('${encodedJson}')">Copiar JSON</button>
                    <pre><code>${jsonText}</code></pre>
                </div>`;
        } else {
            this.renderVisual(dataList[0], container);
        }
    },

    createObject(type) {
        if (type === 'pessoa') {
            const sexFilter = document.getElementById('pSex').value;
            const finalSex = sexFilter === 'indiferente' ? (Math.random() > 0.5 ? "Masculino" : "Feminino") : sexFilter.charAt(0).toUpperCase() + sexFilter.slice(1);
            const finalName = Generators.name(finalSex);
            const finalEmail = removerAcentos(finalName).trim().replace(/\s+/g, '.').toLowerCase() + '.test@mail.com';

            return {
                dados_pessoais: {
                    nome: finalName,
                    cpf: Generators.cpf(),
                    rg: Generators.rg(),
                    nascimento: Generators.birthDate(),
                    sexo: finalSex,
                    signo: Generators.getSigno(Generators.birthDate())
                },
                endereco: Generators.getEndereco(),
                acesso_e_contato: {
                    email: finalEmail,
                    senha: Generators.password(12, {upper:true, num:true, sym:true}),
                    celular: Generators.telefone()
                }
            };
        }
        
        const genFunc = Generators[type];
        return genFunc ? (typeof genFunc() === 'object' ? genFunc() : { [type]: genFunc() }) : { erro: "Não implementado" };
    },

    toggleQty() {
        const isJson = document.getElementById('outFormat').value === 'json';
        const qtyGroup = document.getElementById('qtyGroup');
        if(qtyGroup) qtyGroup.style.display = isJson ? 'block' : 'none';
    },

    renderVisual(data, container) {
        let html = '<div class="dossie" style="margin-top:20px">';
        for (const [section, values] of Object.entries(data)) {
            if (typeof values === 'object' && values !== null) {
                html += `
                    <section>
                        <h3 class="sec-title" style="text-transform: capitalize;">${section.replace(/_/g, ' ')}</h3>
                        <div class="profile-grid">
                            ${Object.entries(values).map(([k, v]) => this.buildField(k, v)).join('')}
                        </div>
                    </section>`;
            } else {
                html += `<div class="profile-grid" style="margin-top:10px">${this.buildField(section, values)}</div>`;
            }
        }
        container.innerHTML = html + '</div>';
        if(window.lucide) lucide.createIcons();
    },

    buildField(label, value) {
        return `
            <div class="field-box">
                <label>${label.toUpperCase().replace(/_/g, ' ')}</label>
                <div class="field-content">
                    <span>${value}</span>
                    <button class="btn-copy-small" onclick="App.copyText('${value}')">
                        <i data-lucide="copy" style="width:14px;height:14px"></i>
                    </button>
                </div>
            </div>`;
    },

    copyText(text) {
        navigator.clipboard.writeText(text).then(() => {
            const t = document.getElementById('toast');
            if(t) {
                t.classList.add('show');
                setTimeout(() => t.classList.remove('show'), 2000);
            }
        });
    },

    copyFromBase64(base64) {
        const text = decodeURIComponent(escape(atob(base64)));
        this.copyText(text);
    }
};

// Logica auxiliar de validação matemática
const Validators = {
    calcCpf: (cpf) => {
        if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
        let s = 0, r;
        for (let i = 1; i <= 9; i++) s += parseInt(cpf.substring(i-1, i)) * (11 - i);
        r = (s * 10) % 11;
        if (r === 10 || r === 11) r = 0;
        if (r !== parseInt(cpf.substring(9, 10))) return false;
        s = 0;
        for (let i = 1; i <= 10; i++) s += parseInt(cpf.substring(i-1, i)) * (12 - i);
        r = (s * 10) % 11;
        if (r === 10 || r === 11) r = 0;
        return r === parseInt(cpf.substring(10, 11));
    },
    calcCnpj: (cnpj) => {
        if (cnpj.length !== 14 || !!cnpj.match(/(\d)\1{13}/)) return false;
        const calc = (s, n) => {
            let p = n, t = 0;
            for (let i = 0; i < s.length; i++) {
                t += s[i] * p--;
                if (p < 2) p = 9;
            }
            let r = t % 11;
            return r < 2 ? 0 : 11 - r;
        };
        const d1 = calc(cnpj.substring(0, 12), 5);
        const d2 = calc(cnpj.substring(0, 12) + d1, 6);
        return cnpj.endsWith("" + d1 + d2);
    }
};

function removerAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

App.init();