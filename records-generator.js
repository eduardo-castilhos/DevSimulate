// Variável global para armazenar os registros gerados
let generatedRecords = [];

// Função para gerar múltiplos registros
function generateRecords(count) {
    // Garante que o número está entre 1 e 25
    const recordCount = Math.min(Math.max(1, count), 25);
    
    // Gera os registros
    generatedRecords = Array.from({ length: recordCount }, (_, index) => ({
        id: index + 1,
        nome: generateName(),
        cpf: generateCPF(),
        dataNascimento: generateBirthDate()
    }));
    
    return generatedRecords;
}

// Função para renderizar a tabela de registros
function renderRecordsTable() {
    const tableBody = document.getElementById('recordsTableBody');
    tableBody.innerHTML = '';
    
    generatedRecords.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.id}</td>
            <td>${record.nome}</td>
            <td>${record.cpf}</td>
            <td>${record.dataNascimento}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Função para baixar os registros em JSON
function downloadJSON() {
    const dataStr = JSON.stringify(generatedRecords, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'registros_ficticios.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}