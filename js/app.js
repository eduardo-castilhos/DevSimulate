const App = {
    init() {
        Utils.loadComponent('sidebar-container', '/components/sidebar.html', () => {
            Utils.initSidebar();
            lucide.createIcons();
        });
        Utils.loadComponent('header-container', '/components/header.html', () => {
            Utils.initTheme();
            const title = document.querySelector('meta[name="page-title"]')?.content || 'DevSimulate';
            document.getElementById('page-title').innerText = title;
            lucide.createIcons();
        });
        Utils.loadComponent('footer-container', '/components/footer.html', () => {
            lucide.createIcons();
        });
    },

    generate(type) {
        const format = document.getElementById('outFormat')?.value || 'visual';
        const qtySelect = document.getElementById('outQty');
        const qty = (format === 'json' && qtySelect) ? parseInt(qtySelect.value) : 1;
        
        const dataList = Array.from({ length: qty }, () => this.createObject(type));
        
        if (format === 'json') {
            UI.renderJson(qty === 1 ? dataList[0] : dataList, 'result');
        } else {
            UI.renderVisual(dataList[0], 'result');
        }
    },

    createObject(type) {
        if (type === 'pessoa') {
            const sexFilter = document.getElementById('pSex')?.value || 'indiferente';
            const finalSex = sexFilter === 'indiferente' ? (Math.random() > 0.5 ? "Masculino" : "Feminino") : sexFilter.charAt(0).toUpperCase() + sexFilter.slice(1);
            const finalName = Generators.name(finalSex);
            const finalEmail = Utils.removerAcentos(finalName).trim().replace(/\s+/g, '.').toLowerCase() + '.test@mail.com';

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
                    senha: Generators.senha(),
                    celular: Generators.telefone()
                }
            };
        }
        
        const genFunc = Generators[type];
        if (genFunc) {
            const result = genFunc();
            return typeof result === 'object' ? result : { [type]: result };
        }
        return { erro: "Não implementado" };
    },

    toggleQty() {
        const isJson = document.getElementById('outFormat').value === 'json';
        const qtyGroup = document.getElementById('qtyGroup');
        if(qtyGroup) qtyGroup.style.display = isJson ? 'block' : 'none';
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
