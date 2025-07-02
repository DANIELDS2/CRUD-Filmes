const apiUrl = 'http://localhost:3000/produtos'; // URL da API
    const token = localStorage.getItem('token');
    console.log(token);
// Carregar produtos ao carregar a página
document.addEventListener('DOMContentLoaded', carregarFilmes);

// Referências aos elementos DOM
var form = document.getElementById("filme-form");
const tituloInput = document.getElementById('titulo');
const diretorInput = document.getElementById('preco');
const ano_lancamentoInput = document.getElementById('ano-lancamento');
const genroInput = document.getElementById('genro');
const notaInput = document.getElementById('nota');
const filmeIdInput = document.getElementById('filme-id');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const tabelaCorpo = document.querySelector('#filmes-tabela tbody');

// Carregar a lista de produtos
function carregarFilmes() {
    fetch(apiUrl, {
        method:'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(filmes => {
            console.log(filmes);
            tabelaCorpo.innerHTML = ''; // Limpa a tabela
            filmes.forEach(filme => {
                adicionarFilmeNaTabela(filme);
            });
        })
        .catch(function (error) { console.log('Erro ao carregar filmes:' + error) });
}

// Adicionar filme na tabela
function adicionarFilmeNaTabela(filme) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${filme.id}</td>
        <td>${filme.titulo}</td>
        <td>${filme.diretor}</td>
        <td>${filme.ano-lancamento}</td>
        <td>${filme.genero}</td>
        <td>${filme.nota}</td>
        <td>
            ${primeiraImagem}
        </td>
        <td>
            <button class="action-btn edit-btn" 
            onclick="editarFilme(${filme.id})">Editar</button>
            <button class="action-btn delete-btn" 
            onclick="deletarFilme(${filme.id})">Excluir</button>
        </td>
    `;
    tabelaCorpo.appendChild(row);
}

// Enviar formulário (Cadastrar ou Atualizar)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const filme = {
        titulo: tituloInput.value,
        diretor: parseFloat(diretorInput.value),
        ano_lancamento: ano_lancamentoInput.value,
        genero: genroInput.value,
        nota: notaInput.value
    };

    const filmeId = filmeIdInput.value;

    if (filmeId) {
        atualizarFilme(filmeId, filme);
    } else {
        cadastrarFilme(filme);
    }
});

// Cadastrar novo filme
async function cadastrarFilme(filme) {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(filme)
    });

    const filmedb = await response.json();
}

// Editar filme
function editarFilme(id) {
    fetch(`${apiUrl}/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(filme => {
            filmeIdInput.value = filme.id;
            tituloInput.value = filme.titulo;
            diretorInput.value = filme.diretor;
            ano_lancamentoInput.value = filme.ano_lancamento;
            genroInput.value = filme.genero;
            notaInput.value = filme.nota;

            submitBtn.textContent = 'Atualizar';
            resetBtn.classList.remove('hidden');
        })
        .catch(error => console.error('Erro ao buscar filme:', error));
}

// Atualizar filme
function atualizarFilme(id, filme) {
    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(filme)
    })
        .then(response => response.json())
        .then(filmeAtualizado => {
            carregarFilmes();
            form.reset();
            filmeIdInput.value = '';
            submitBtn.textContent = 'Cadastrar';
            resetBtn.classList.add('hidden');
        })
        .catch(error => console.error('Erro ao atualizar filme:', error));
}

// Deletar filme
function deletarProduto(id) {
    if (confirm('Tem certeza que deseja excluir este filme?')) {
        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(() => {
                carregarFilmes();
            })
            .catch(error => console.error('Erro ao excluir filme:', error));
    }
}

document.getElementById('btnLogout').addEventListener('click', () => {
    // Limpa o token de autenticação
    localStorage.removeItem('token');
});

// Resetar formulário ao cancelar edição
resetBtn.addEventListener('click', () => {
    form.reset();
    filmeIdInput.value = '';
    submitBtn.textContent = 'Cadastrar';
    resetBtn.classList.add('hidden');
});