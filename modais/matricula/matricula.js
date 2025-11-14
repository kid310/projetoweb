const $ = (id) => document.getElementById(id);

// Elementos
const listaMatriculasEl = $('listaMatriculas');
const buscaMatriculaEl = $('buscaMatricula');
const btnNovaMatriculaEl = $('btnNovaMatricula');
const formMatricula = $('formMatricula');
const turmaMatriculaEl = $('turmaMatricula');

let matriculas = JSON.parse(localStorage.getItem('matriculas')) || [];
let turmas = JSON.parse(localStorage.getItem('turmas')) || [];

// Modal
let modalMatricula = null;

// Inicializar modal
window.addEventListener('DOMContentLoaded', () => {
  modalMatricula = new bootstrap.Modal($('modalMatricula'));
  carregarTurmas();
  renderizarMatriculas();
});

// Carregar turmas no select
function carregarTurmas() {
  turmaMatriculaEl.innerHTML = '<option value="">Selecione uma turma</option>';
  
  turmas.forEach((turma, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${turma.disciplina} - ${turma.professor} (${turma.dia})`;
    turmaMatriculaEl.appendChild(option);
  });
}

// Abrir modal para nova matrícula
btnNovaMatriculaEl.addEventListener('click', () => {
  limparFormulario();
  $('modalMatriculaLabel').textContent = 'Nova Matrícula';
  modalMatricula.show();
});

// Limpar formulário
function limparFormulario() {
  formMatricula.reset();
  $('indexMatricula').value = '';
  formMatricula.classList.remove('was-validated');
}

// Salvar matrícula
formMatricula.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!formMatricula.checkValidity()) {
    formMatricula.classList.add('was-validated');
    return;
  }

  const index = $('indexMatricula').value;
  const novaMatricula = {
    numeroMatricula: `MAT${Date.now()}`,
    nomeAluno: $('nomeAluno').value.trim(),
    cpf: $('cpfAluno').value.trim(),
    dataNascimento: $('dataNascimento').value,
    email: $('email').value.trim(),
    telefone: $('telefone').value.trim(),
    turma: parseInt($('turmaMatricula').value),
    dataMatricula: $('dataMatricula').value,
    status: $('statusMatricula').value,
    observacoes: $('observacoes').value.trim()
  };

  if (index === '') {
    matriculas.push(novaMatricula);
  } else {
    matriculas[index] = novaMatricula;
  }

  localStorage.setItem('matriculas', JSON.stringify(matriculas));
  renderizarMatriculas();
  modalMatricula.hide();
  limparFormulario();
});

// Renderizar lista de matrículas
function renderizarMatriculas(filtro = '') {
  listaMatriculasEl.innerHTML = '';
  filtro = filtro.toLowerCase();

  const matriculasFiltradas = matriculas.filter(m => 
    m.nomeAluno.toLowerCase().includes(filtro) || 
    m.numeroMatricula.toLowerCase().includes(filtro)
  );

  if (matriculasFiltradas.length === 0) {
    listaMatriculasEl.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhuma matrícula cadastrada</td></tr>';
    return;
  }

  matriculasFiltradas.forEach((matricula, index) => {
    const realIndex = matriculas.indexOf(matricula);
    const turma = turmas[matricula.turma];
    const statusBadge = getStatusBadge(matricula.status);
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${matricula.numeroMatricula}</strong></td>
      <td>${matricula.nomeAluno}</td>
      <td>${turma ? turma.disciplina : 'N/A'}</td>
      <td>${formatarData(matricula.dataMatricula)}</td>
      <td>${statusBadge}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editarMatricula(${realIndex})">✏️ Editar</button>
        <button class="btn btn-sm btn-danger" onclick="excluirMatricula(${realIndex})">🗑️ Excluir</button>
      </td>
    `;
    listeMatriculasEl.appendChild(row);
  });
}

// Badge de status
function getStatusBadge(status) {
  const statusMap = {
    'ativa': '<span class="badge bg-success">Ativa</span>',
    'trancada': '<span class="badge bg-warning text-dark">Trancada</span>',
    'cancelada': '<span class="badge bg-danger">Cancelada</span>'
  };
  return statusMap[status] || status;
}

// Formatar data
function formatarData(data) {
  if (!data) return '';
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Editar matrícula
window.editarMatricula = function(index) {
  const matricula = matriculas[index];
  $('indexMatricula').value = index;
  $('nomeAluno').value = matricula.nomeAluno;
  $('cpfAluno').value = matricula.cpf;
  $('dataNascimento').value = matricula.dataNascimento;
  $('email').value = matricula.email;
  $('telefone').value = matricula.telefone;
  $('turmaMatricula').value = matricula.turma;
  $('dataMatricula').value = matricula.dataMatricula;
  $('statusMatricula').value = matricula.status;
  $('observacoes').value = matricula.observacoes;
  
  $('modalMatriculaLabel').textContent = 'Editar Matrícula';
  modalMatricula.show();
};

// Excluir matrícula
window.excluirMatricula = function(index) {
  if (confirm('Deseja excluir esta matrícula?')) {
    matriculas.splice(index, 1);
    localStorage.setItem('matriculas', JSON.stringify(matriculas));
    renderizarMatriculas();
  }
};

// Busca em tempo real
buscaMatriculaEl.addEventListener('input', () => {
  renderizarMatriculas(buscaMatriculaEl.value);
});
