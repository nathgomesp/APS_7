document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos da interface
    const importButton = document.getElementById('importButton');
    const calculateButton = document.getElementById('calculateButton');
    const viewResultsButton = document.getElementById('viewResultsButton');
    const configButton = document.getElementById('configButton');
    const fileInput = document.getElementById('fileInput');
    const statusArea = document.getElementById('statusArea');
    const resultsArea = document.getElementById('resultsArea');
    const resultsContent = document.getElementById('resultsContent');

    // Função para exibir mensagens de status
    function showStatus(message, isError = false) {
        statusArea.style.display = 'block';
        statusArea.style.backgroundColor = isError ? '#ffebee' : '#e8f5e9';
        statusArea.style.border = isError ? '1px solid #ffcdd2' : '1px solid #c8e6c9';
        statusArea.innerHTML = message;
    }

    // Função para limpar mensagens de status
    function clearStatus() {
        statusArea.style.display = 'none';
        statusArea.innerHTML = '';
    }

    // Função para exibir resultados
    function showResults(results) {
        resultsArea.style.display = 'block';
        let html = `
        <p><strong>Emergia Total:</strong> ${results.emergia_total_cientifica} sej</p>
        <p><strong>Valor por extenso:</strong> ${results.emergia_total_decimal} sej</p>
        <p><strong>Sumário:</strong> ${results.sumario}</p>
        `;
        resultsContent.innerHTML = html;
    }

    // Evento para o botão de importação
    importButton.addEventListener('click', function() {
        fileInput.click();
    });

    // Evento para quando um arquivo é selecionado
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);
            showStatus('Enviando arquivo... Por favor, aguarde.');

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showStatus(`Arquivo "${data.filename}" importado com sucesso!`);
                    calculateButton.disabled = false;
                } else {
                    showStatus(`Erro: ${data.message}`, true);
                }
            })
            .catch(error => {
                showStatus(`Erro ao enviar arquivo: ${error}`, true);
            });
        }
    });

    // Evento para o botão de cálculo
    calculateButton.addEventListener('click', function() {
        showStatus('Calculando emergia... Por favor, aguarde.');

        fetch('/calculate', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showStatus('Cálculo realizado com sucesso!');
                viewResultsButton.disabled = false;
            } else {
                showStatus(`Erro: ${data.message}`, true);
            }
        })
        .catch(error => {
            showStatus(`Erro ao calcular emergia: ${error}`, true);
        });
    });

    // Evento para o botão de visualização de resultados
    viewResultsButton.addEventListener('click', function() {
        showStatus('Carregando resultados...');

        fetch('/results')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                clearStatus();
                showResults(data.results);
            } else {
                showStatus(`Erro: ${data.message}`, true);
            }
        })
        .catch(error => {
            showStatus(`Erro ao carregar resultados: ${error}`, true);
        });
    });

    // Evento para o botão de configurações
    configButton.addEventListener('click', function() {
        showStatus('Funcionalidade de configurações não implementada nesta versão.');
    });
});
