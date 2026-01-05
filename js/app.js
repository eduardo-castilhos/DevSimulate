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
            title.innerText = "Gerador de Pessoa";
            filterSection += `
                    <div class="group">
                        <label>Gênero</label>
                        <select id="pSex">
                            <option value="indiferente">Indiferente</option>
                            <option value="masculino">Masculino</option>
                            <option value="feminino">Feminino</option>
                        </select>
                    </div>`;
        } else {
            title.innerText = "Gerador de " + type.toUpperCase();
        }

        filterSection += `
                </div> 
                <button class="btn-primary" onclick="App.generate('${type}')">Gerar Dados</button>
                <div id="result"></div>
            </div>`;

        view.innerHTML = filterSection;
    },

    toggleQty() {
        const isJson = document.getElementById('outFormat').value === 'json';
        document.getElementById('qtyGroup').style.display = isJson ? 'block' : 'none';
    },

    createObject(type) {
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
                    nascimento: Generators.birthDate ? Generators.birthDate() : "15/05/1992",
                    sexo: finalSex
                },
                endereco: Generators.getEndereco(),
                acesso_e_contato: {
                    email: finalEmail,
                    senha: Generators.password(12, {upper:true, num:true, sym:true}),
                    celular: `(11) 9${Math.floor(10000000 + Math.random() * 90000000)}`
                }
            };
        }
        if (type === 'cartao') return Generators.cartao();
        if (type === 'senha') return { senha: Generators.password(14, {upper:true, num:true, sym:true}) };
        if (type === 'guid') return { guid: Generators.guid ? Generators.guid() : "550e8400-e29b-41d4-a716-446655440000" };
        
        return { [type]: Generators[type] ? Generators[type]() : "N/A" };
    },

    generate(type) {
        const format = document.getElementById('outFormat').value;
        const qty = format === 'json' ? parseInt(document.getElementById('outQty').value) : 1;
        const dataList = Array.from({ length: qty }, () => this.createObject(type));
        const container = document.getElementById('result');

        if (format === 'json') {
            const jsonText = JSON.stringify(qty === 1 ? dataList[0] : dataList, null, 2);
            // Uso de base64 para evitar quebra de aspas no HTML onclick
            const encodedJson = btoa(unescape(encodeURIComponent(jsonText)));
            container.innerHTML = `
                <div class="json-box">
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
        let html = '<div class="dossie">';
        for (const [section, values] of Object.entries(data)) {
            if (typeof values === 'object') {
                html += `<section><h3 class="sec-title">${section.replace(/_/g, ' ')}</h3>
                        <div class="profile-grid">${Object.entries(values).map(([k, v]) => this.buildField(k, v)).join('')}</div></section>`;
            } else {
                html += `<div class="profile-grid" style="margin-top:10px">${this.buildField(section, values)}</div>`;
            }
        }
        container.innerHTML = html + '</div>';
    },

    buildField(label, value) {
        return `
            <div class="field-box">
                <label>${label.toUpperCase().replace(/_/g, ' ')}</label>
                <div class="field-content">
                    <span>${value}</span>
                    <button onclick="App.copyText('${value}')">Copiar</button>
                </div>
            </div>`;
    },

    copyText(text) {
        navigator.clipboard.writeText(text).then(() => {
            const t = document.getElementById('toast');
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 2000);
        });
    }
};

App.init();

function removerAcentos(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}