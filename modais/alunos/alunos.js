(function() {
const $ = (id) => document.getElementById(id);

let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
let modalAluno = null;
let listaAlunosEl = null;
let buscaAlunoEl = null;
let formAluno = null;

function limparFormulario() {
  formAluno.reset();
  $('indexAluno').value = '';
  formAluno.classList.remove('was-validated');
}

function renderizarAlunos(filtro = '') {
  listaAlunosEl.innerHTML = '';
  filtro = filtro.toLowerCase();

  const alunosFiltrados = alunos.filter(a => 
    a.nome.toLowerCase().includes(filtro) || 
    a.cpf.toLowerCase().includes(filtro)
  );

  if (alunosFiltrados.length === 0) {
    listaAlunosEl.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum aluno cadastrado</td></tr>';
    return;
  }

  alunosFiltrados.forEach((aluno) => {
    const realIndex = alunos.indexOf(aluno);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${aluno.nome}</strong></td>
      <td>${aluno.cpf}</td>
      <td>${aluno.email}</td>
      <td>${aluno.telefone}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editarAluno(${realIndex})">✏️ Editar</button>
        <button class="btn btn-sm btn-danger" onclick="excluirAluno(${realIndex})">🗑️ Excluir</button>
      </td>
    `;
    listaAlunosEl.appendChild(row);
  });
}

window.editarAluno = function(index) {
  const aluno = alunos[index];
  $('indexAluno').value = index;
  $('nomeAluno').value = aluno.nome;
  $('cpfAluno').value = aluno.cpf;
  $('dataNascimento').value = aluno.dataNascimento;
  $('email').value = aluno.email;
  $('telefone').value = aluno.telefone;
  
  $('modalAlunoLabel').textContent = 'Editar Aluno';
  modalAluno.show();
};

window.excluirAluno = function(index) {
  if (confirm('Deseja excluir este aluno?')) {
    alunos.splice(index, 1);
    localStorage.setItem('alunos', JSON.stringify(alunos));
    renderizarAlunos();
  }
};

function inicializar() {
  listaAlunosEl = $('listaAlunos');
  buscaAlunoEl = $('buscaAluno');
  const btnNovoAlunoEl = $('btnNovoAluno');
  formAluno = $('formAluno');

  if (!listaAlunosEl || !formAluno) return;

  modalAluno = new bootstrap.Modal($('modalAluno'));
  
  $('modalAluno').addEventListener('hidden.bs.modal', () => {
    formAluno.classList.remove('was-validated');
  });
  
  renderizarAlunos();

  btnNovoAlunoEl.addEventListener('click', () => {
    alunos = JSON.parse(localStorage.getItem('alunos')) || [];
    renderizarAlunos();
    limparFormulario();
    $('modalAlunoLabel').textContent = 'Novo Aluno';
    modalAluno.show();
  });

  formAluno.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!formAluno.checkValidity()) {
      formAluno.classList.add('was-validated');
      return;
    }

    const index = $('indexAluno').value;
    const novoAluno = {
      nome: $('nomeAluno').value.trim(),
      cpf: $('cpfAluno').value.trim(),
      dataNascimento: $('dataNascimento').value,
      email: $('email').value.trim(),
      telefone: $('telefone').value.trim(),
      dataCadastro: new Date().toISOString().split('T')[0]
    };

    if (index === '') {
      alunos.push(novoAluno);
      alert('Aluno cadastrado com sucesso!');
    } else {
      alunos[index] = novoAluno;
      alert('Aluno atualizado com sucesso!');
    }

    localStorage.setItem('alunos', JSON.stringify(alunos));
    renderizarAlunos();
    limparFormulario();
    modalAluno.hide();
  });

  buscaAlunoEl.addEventListener('input', () => {
    renderizarAlunos(buscaAlunoEl.value);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  inicializar();
}
})();
