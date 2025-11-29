// Aplicação principal - gerencia navegação e eventos

// Função para trocar entre abas
function switchTab(tabName) {
    // Remove active de todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active de todos os botões de navegação
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Adiciona active na aba selecionada
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Adiciona active no botão selecionado
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Event Listeners quando o documento carregar
document.addEventListener('DOMContentLoaded', function() {
    
    // Navegação entre abas
    document.querySelectorAll('.nav-item').forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    document.querySelectorAll('input[name="personFormat"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const isJson = this.value === 'json';
            document.getElementById('quantityGeneratePerson').style.display = isJson ? 'block' : 'none';
        });
    });
    
    // Botão de gerar CPF
    document.getElementById('generateCpfBtn').addEventListener('click', function() {
        const quantityCpfGenerate = parseInt(document.querySelector('input[name="cpfQuantity"]:checked').value);
        const formatGenerate = document.querySelector('input[name="cpfFormat"]:checked').value;
        const block = document.getElementById('cpfValue');
        
        if (quantityCpfGenerate > 20){
            return;
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
    
    document.getElementById('generateNameBtn').addEventListener('click', function() {
        const quantity = parseInt(document.querySelector('input[name="personQuantity"]:checked').value);
        const format = document.querySelector('input[name="personFormat"]:checked').value;

        let peopleGenerated = [];
        if (format === 'json'){
            for(let i = 0; i < quantity; i++) {
                const person = {
                    nome: generateName(),
                    dataNascimento: generateBirthDate()
                };
                peopleGenerated.push(person);
            }
        } else {
            const person = {
                nome: generateName(),
                dataNascimento: generateBirthDate()
            };
            peopleGenerated.push(person);
        }

        // Exibir conforme o formato selecionado
        if (format === 'json') {
            // Formato JSON
            document.getElementById('nameResult').style.display = 'block';
            document.getElementById('birthDateResult').style.display = 'none';
            
            const nameBlock = document.getElementById('nameValue');
            nameBlock.textContent = JSON.stringify(peopleGenerated, null, 2);
            nameBlock.style.fontSize = '14px';
            nameBlock.style.whiteSpace = 'pre';
            nameBlock.style.fontFamily = "'SF Mono', 'Monaco', 'Courier New', monospace";
            nameBlock.style.lineHeight = '1.6';
            
            // Mudar o label
            document.querySelector('#nameResult .result-label').textContent = 'JSON Gerado:';
            
        } else {
            // Formato Visual
            document.getElementById('nameResult').style.display = 'block';
            document.getElementById('birthDateResult').style.display = 'block';
            
            const nameBlock = document.getElementById('nameValue');
            const birthBlock = document.getElementById('birthDateValue');
            
            // Restaurar estilos
            nameBlock.style.fontSize = '';
            nameBlock.style.whiteSpace = 'pre-line';
            nameBlock.style.fontFamily = '';
            nameBlock.style.lineHeight = '2.2';
            birthBlock.style.lineHeight = '2.2';
            
            // Preencher os dados
            nameBlock.textContent = peopleGenerated.map(p => p.nome).join('\n');
            birthBlock.textContent = peopleGenerated.map(p => p.dataNascimento).join('\n');
            
            // Restaurar o label
            document.querySelector('#nameResult .result-label').textContent = 'Nome Gerado:';
        }
    });
    
    // Botão de gerar Registros
    document.getElementById('generateRecordsBtn').addEventListener('click', function() {
        const count = parseInt(document.getElementById('recordCount').value) || 10;
        generateRecords(count);
        renderRecordsTable();
        document.getElementById('recordsContainer').style.display = 'block';
    });
    
    // Botão de baixar JSON
    document.getElementById('downloadJsonBtn').addEventListener('click', function() {
        downloadJSON();
    });
    
    // Validação do input de quantidade de registros
    document.getElementById('recordCount').addEventListener('input', function() {
        let value = parseInt(this.value);
        if (value < 1) this.value = 1;
        if (value > 25) this.value = 25;
    });
    
});