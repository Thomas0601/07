document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('formulario');
  const mensagem = document.getElementById('mensagem'); // Elemento para exibir mensagens ao usuário

  // Função para buscar dados
  const buscarDados = () => {
    fetch('/dados')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Limpa a lista de usuários
        const listaUsuarios = document.getElementById('lista-usuarios');
        listaUsuarios.innerHTML = '';

        // Adiciona cada usuário à lista
        data.forEach(usuario => {
          const li = document.createElement('li');
          li.textContent = `${usuario.nome} - ${usuario.email}`;
          listaUsuarios.appendChild(li);
        });
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
        mensagem.textContent = 'Erro ao buscar dados.';
        mensagem.style.color = 'red';
      });
  };

  // Função para adicionar dado
  const adicionarDado = (event) => {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;

    // Validação básica
    if (!nome || !email) {
      mensagem.textContent = 'Nome e email são obrigatórios.';
      mensagem.style.color = 'red';
      return;
    }

    fetch('/dados', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nome, email })
    })
      .then(response => response.text())
      .then(message => {
        console.log(message);
        mensagem.textContent = 'Dado adicionado com sucesso!';
        mensagem.style.color = 'green';
        buscarDados(); // Atualiza a lista após adicionar o dado
        formulario.reset(); // Limpa o formulário após o envio
      })
      .catch(error => {
        console.error('Erro ao adicionar dado:', error);
        mensagem.textContent = 'Erro ao adicionar dado.';
        mensagem.style.color = 'red';
      });
  };

  formulario.addEventListener('submit', adicionarDado);
  buscarDados(); // Busca dados ao carregar a página
});
