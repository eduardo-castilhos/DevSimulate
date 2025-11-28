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
    
    // Botão de gerar CPF
    document.getElementById('generateCpfBtn').addEventListener('click', function() {
        const cpf = generateCPF();
        document.getElementById('cpfValue').textContent = cpf;
        document.getElementById('cpfResult').style.display = 'block';
    });
    
    document.getElementById('generateNameBtn').addEventListener('click', function() {

        const name = generateName();
        document.getElementById('nameValue').textContent = name;
        document.getElementById('nameResult').style.display = 'block';
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