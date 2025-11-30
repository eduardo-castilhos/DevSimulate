// Função para trocar entre abas
function switchTab(tabName) {
    
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Navegação entre abas
    document.querySelectorAll('.nav-item').forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // quantidade de cpf a serem geradas apenas qunado for json
    document.querySelectorAll('input[name="cpfFormat"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const isJson = this.value === 'json';
            document.getElementById('quantityGenerateCpf').style.display = isJson ? 'block' : 'none';
        });
    });

    // quantidade de pessoas a serem geradas apenas qunado for json
    document.querySelectorAll('input[name="personFormat"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const isJson = this.value === 'json';
            document.getElementById('quantityGeneratePerson').style.display = isJson ? 'block' : 'none';
        });
    });
    
    // Botão de gerar CPF
    document.getElementById('generateCpfBtn').addEventListener('click', function() {
        const formatGenerate = document.querySelector('input[name="cpfFormat"]:checked').value;
        const block = document.getElementById('cpfValue');
        
        let quantityCpfGenerate = 1;

        if (formatGenerate === 'json') {
            quantityCpfGenerate = parseInt(document.querySelector('input[name="cpfQuantity"]:checked').value);

            if (quantityCpfGenerate > 20){
                quantityCpfGenerate = 20
            }
        }

        let cpfsGenerated = [];
        for(let i = 0; i < quantityCpfGenerate; i++) {
            const cpf = generateCPF();
            cpfsGenerated.push(cpf);
        }
        
        if (formatGenerate === 'json') {
            block.textContent = JSON.stringify(cpfsGenerated, null, 2);
            block.style.fontSize = '14px';
            block.style.whiteSpace = 'pre';
        } else {
            block.textContent = cpfsGenerated.join('\n');
            block.style.lineHeight = '1.5'
            block.style.fontSize = '';
            block.style.whiteSpace = 'pre-line';
        }
        
        document.getElementById('cpfResult').style.display = 'block';
    });
    
    document.getElementById('generateNameBtn').addEventListener('click', function () {
        const format = document.querySelector('input[name="personFormat"]:checked').value;
        const sexChoice = document.getElementById('personSexSelect').value;

        let quantity = format === 'json'
            ? parseInt(document.querySelector('input[name="personQuantity"]:checked').value)
            : 1;

        let peopleGenerated = [];

        for (let i = 0; i < quantity; i++) {

            let currentSex = sexChoice;

            if (currentSex === 'Indiferente') {
                currentSex = Math.random() < 0.5 ? 'Masculino' : 'Feminino';
            }

            const nameGenerated = generateName(currentSex);
            const dateGenerated = generateBirthDate();

            peopleGenerated.push({
                nome: nameGenerated,
                dataNascimento: dateGenerated,
                sexo: currentSex
            });
        }

        // --- Lógica de Exibição ---

        const nameBlock = document.getElementById('nameValue');
        const birthBlock = document.getElementById('birthDateValue');
        const nameResultDiv = document.getElementById('nameResult');
        const birthResultDiv = document.getElementById('birthDateResult');

        if (format === 'json') {
            // --- Formato JSON ---
            nameResultDiv.style.display = 'block';
            birthResultDiv.style.display = 'none'; // Esconde o bloco de data separado
            
            nameBlock.textContent = JSON.stringify(peopleGenerated, null, 2);
            
            // Estilização para código
            nameBlock.style.fontSize = '14px';
            nameBlock.style.whiteSpace = 'pre';
            nameBlock.style.fontFamily = "'SF Mono', 'Monaco', 'Courier New', monospace";
            nameBlock.style.lineHeight = '1.6';
            
            // Atualiza label
            document.querySelector('#nameResult .result-label').textContent = 'JSON Gerado:';
            
        } else {
            // --- Formato Visual ---
            nameResultDiv.style.display = 'block';
            birthResultDiv.style.display = 'block'; // Mostra o bloco de data
            
            // Restaura estilos visuais limpos
            nameBlock.style.fontSize = '';
            nameBlock.style.whiteSpace = 'pre-line';
            nameBlock.style.fontFamily = '';
            nameBlock.style.lineHeight = '2.2';
            birthBlock.style.lineHeight = '2.2';
            
            // Mapeia apenas os valores para exibição (Visualmente mostramos apenas o primeiro se for Visual, ou a lista simples)
            // Como forçamos quantity = 1 no modo visual, peopleGenerated tem apenas 1 item
            nameBlock.textContent = peopleGenerated.map(p => p.nome).join('\n');
            birthBlock.textContent = peopleGenerated.map(p => p.dataNascimento).join('\n');
            
            // Restaura label
            document.querySelector('#nameResult .result-label').textContent = 'Nome Gerado:';
        }
    });
});