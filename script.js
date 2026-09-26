const formulario = document.querySelector('form');
const campoNome = document.getElementById('nome');
const campoEmail = document.getElementById('email');
const campoServico = document.getElementById('servico');

// Elementos de UI
const btnEnviar = formulario.querySelector('button[type="submit"]');
const msgStatus = document.getElementById('mensagem-status');

function exibirMensagem(texto, tipo) {
    msgStatus.textContent = texto;
    msgStatus.className = `status-msg ${tipo}`; // Aplica 'sucesso' ou 'erro'
}

function limparMensagem() {
    msgStatus.textContent = '';
    msgStatus.className = 'status-msg';
}

formulario.addEventListener('submit', function(event) {
    event.preventDefault();
    limparMensagem();

    const nome = campoNome.value.trim();
    const email = campoEmail.value.trim();
    const servico = campoServico.value;

    if (nome === '' || email === '') {
        exibirMensagem('Por favor, preencha todos os campos obrigatórios.', 'erro');
        return;
    }

    const dadosFormulario = {
        cliente: nome,
        emailContato: email,
        servicoDesejado: servico,
        dataSolicitacao: new Date().toLocaleDateString('pt-BR', {timeZone: 'America/Sao_Paulo'})
    };

    // UI: Estado de carregamento
    btnEnviar.disabled = true;
    const textoOriginalBotao = btnEnviar.textContent;
    btnEnviar.textContent = 'Enviando...';

    fetch('https://hook.us2.make.com/rtfe4gmvx4dh6k1qy6qn2lcq1kvqy06q', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosFormulario)
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error(`Erro no servidor: Status ${response.status}`);
    })
    .then(data => {
        exibirMensagem(`Sucesso! Obrigado, ${nome}. Seus dados foram enviados!`, 'sucesso');
        formulario.reset();
    })
    .catch(error => {
        console.error('Detalhe do erro:', error);
        exibirMensagem('Ops! Ocorreu um erro ao enviar. Tente novamente.', 'erro');
    })
    .finally(() => {
        // Restaura o botão independente de dar certo ou errado
        btnEnviar.disabled = false;
        btnEnviar.textContent = textoOriginalBotao;
    });
});