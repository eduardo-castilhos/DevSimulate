const App = {
    allowedQuantities: [1, 5, 10, 15, 20, 25],

    init() {
        window.addEventListener('hashchange', () => this.route());
        window.addEventListener('load', () => this.route());
        
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

    route() {
        const hash = window.location.hash || '#/pessoa';
        const type = hash.replace('#/', '');
        const view = document.getElementById('app-view');
        const title = document.getElementById('page-title');

        document.querySelectorAll('.nav-item').forEach(el => 
            el.classList.toggle('active', el.getAttribute('href') === hash));

        // Títulos Amigáveis
        const titles = {
            pessoa: "Gerador de Pessoa", cpf: "Gerador de CPF", cnpj: "Gerador de CNPJ",
            pix: "Gerador de Chave PIX", cartao: "Cartão de Crédito", contaBancaria: "Conta Bancária",
            boleto: "Gerador de Boleto", ie: "Inscrição Estadual", ip: "Endereço IP",
            mac: "MAC Address", userAgent: "User Agent", senha: "Gerador de Senha",
            guid: "GUID/UUID", cep: "Consulta de CEP", lorem: "Lorem Ipsum",
            cor: "Seletor de Cores", coordenadas: "Coordenadas & Mapas",
            placa: "Placa Mercosul", renavam: "RENAVAM",
            qrcode: "Gerador de QR Code"
        };
        title.innerText = titles[type] || "Gerador";

        // Casos Especiais (Ferramentas Interativas)
        if (type === 'lorem') return this.renderLorem(view);
        if (type === 'cor') return this.renderColorPicker(view);
        if (type === 'coordenadas') return this.renderMaps(view);
        if (type === 'qrcode') return this.renderQRCode(view);

        // Layout Padrão para Geradores Simples
        let filterSection = `
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
            filterSection += `
                <div class="group">
                    <label>Gênero</label>
                    <select id="pSex">
                        <option value="indiferente">Indiferente</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                    </select>
                </div>`;
        }

        filterSection += `
                </div> 
                <button class="btn-primary" onclick="App.generate('${type}')">Gerar Dados</button>
                <div id="result"></div>
            </div>`;

        view.innerHTML = filterSection;
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
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(val)}`;
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

    createObject(type) {
        // Usa o Generators[type] dinamicamente para os novos geradores
        if (type === 'pessoa') {
            const sexFilter = document.getElementById('pSex').value;
            const finalSex = sexFilter === 'indiferente' ? (Math.random() > 0.5 ? "Masculino" : "Feminino") : sexFilter.charAt(0).toUpperCase() + sexFilter.slice(1);
            const finalName = Generators.name(finalSex);
            const finalEmail = removerAcentos(finalName).trim().replace(/\s+/g, '.').toLowerCase() + '.ds@mail.com';

            return {
                dados_pessoais: {
                    nome: finalName,
                    cpf: Generators.cpf(),
                    rg: Generators.rg ? Generators.rg() : "48.231.552-X",
                    nascimento: "15/05/1992",
                    sexo: finalSex
                },
                endereco: Generators.getEndereco ? Generators.getEndereco() : { rua: "Rua Teste", cep: "01001-000" },
                acesso_e_contato: {
                    email: finalEmail,
                    senha: Generators.password(12, {upper:true, num:true, sym:true}),
                    celular: `(11) 9${Math.floor(10000000 + Math.random() * 90000000)}`
                }
            };
        }

        if (type === 'cartao') return Generators.cartao();
        if (type === 'contaBancaria') return Generators.contaBancaria();
        if (type === 'senha') return { senha: Generators.password(14, {upper:true, num:true, sym:true}) };
        
        // Retorno padrão para geradores simples (IP, MAC, Chave PIX, etc)
        const genFunc = Generators[type];
        return genFunc ? (typeof genFunc() === 'object' ? genFunc() : { [type]: genFunc() }) : { erro: "Não implementado" };
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

    copyFromBase64(base64) {
        const text = decodeURIComponent(escape(atob(base64)));
        this.copyText(text);
    },

    renderVisual(data, container) {
        let html = '<div class="dossie" style="margin-top:20px">';
        for (const [section, values] of Object.entries(data)) {
            if (typeof values === 'object' && values !== null) {
                html += `
                    <section>
                        <h3 class="sec-title">${section.replace(/_/g, ' ')}</h3>
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
    }
};

function removerAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

App.init();