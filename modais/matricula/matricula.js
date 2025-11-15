(function() {
const $ = (id) => document.getElementById(id);

let matriculas = JSON.parse(localStorage.getItem('matriculas')) || [];
let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
let turmas = JSON.parse(localStorage.getItem('turmas')) || [];
let disciplinasTemporarias = [];
let matriculaEmEdicao = null;

function carregarAlunos() {
  const alunoSelect = $('alunoMatricula');
  if (!alunoSelect) return;
  
  alunoSelect.innerHTML = '<option value="">Escolha um aluno</option>';
  
  alunos.forEach((aluno, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${aluno.nome} (${aluno.cpf})`;
    alunoSelect.appendChild(option);
  });
}

function carregarTurmas() {
  const turmaSelect = $('turmaMatricula');
  if (!turmaSelect) return;
  
  turmaSelect.innerHTML = '<option value="">Escolha uma disciplina</option>';
  
  turmas.forEach((turma, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${turma.disciplina} - ${turma.professor}`;
    turmaSelect.appendChild(option);
  });
}

function renderizarDisciplinas() {
  const listaDisciplinasEl = $('listaDisciplinas');
  if (!listaDisciplinasEl) return;
  
  listaDisciplinasEl.innerHTML = '';
  
  if (disciplinasTemporarias.length === 0) {
    listaDisciplinasEl.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Nenhuma disciplina adicionada</td></tr>';
    return;
  }

  disciplinasTemporarias.forEach((disciplina, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${disciplina.nome}</td>
      <td>${disciplina.professor}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="removerDisciplina(${i})">✕</button>
      </td>
    `;
    listaDisciplinasEl.appendChild(row);
  });
}

function renderizarMatriculas(filtro = '') {
  const listaEl = $('listaMatriculas');
  if (!listaEl) return;
  
  listaEl.innerHTML = '';
  filtro = filtro.toLowerCase();

  const matriculasFiltradas = matriculas.filter(m => 
    m.alunoNome.toLowerCase().includes(filtro) || 
    m.numeroMatricula.toLowerCase().includes(filtro)
  );

  if (matriculasFiltradas.length === 0) {
    listaEl.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Nenhuma matrícula registrada</td></tr>';
    return;
  }

  matriculasFiltradas.forEach((matricula) => {
    const realIndex = matriculas.indexOf(matricula);
    const statusBadge = getStatusBadge(matricula.status);
    const disciplinasTexto = (matricula.disciplinas && matricula.disciplinas.length > 0) 
      ? matricula.disciplinas.map(d => d.nome).join(', ')
      : 'N/A';
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${matricula.numeroMatricula}</strong></td>
      <td>${matricula.alunoNome}</td>
      <td>${disciplinasTexto}</td>
      <td>${formatarData(matricula.dataMatricula)}</td>
      <td>${statusBadge}</td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="editarMatricula(${realIndex})">✏️ Editar</button>
        <button class="btn btn-sm btn-danger" onclick="excluirMatricula(${realIndex})">🗑️ Excluir</button>
      </td>
    `;
    listaEl.appendChild(row);
  });
}

function getStatusBadge(status) {
  const statusMap = {
    'ativa': '<span class="badge bg-success">Ativa</span>',
    'trancada': '<span class="badge bg-warning text-dark">Trancada</span>',
    'cancelada': '<span class="badge bg-danger">Cancelada</span>'
  };
  return statusMap[status] || status;
}

function formatarData(data) {
  if (!data) return '';
  const d = new Date(data + 'T00:00:00');
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function atualizarBotaoFinalizar() {
  const btnFinalizar = $('btnFinalizarMatricula');
  if (matriculaEmEdicao !== null) {
    btnFinalizar.textContent = '💾 Salvar Alterações';
  } else {
    btnFinalizar.textContent = '💾 Finalizar Matrícula';
  }
}

function limparFormulario() {
  $('alunoMatricula').value = '';
  $('alunoMatricula').disabled = false;
  $('dataMatricula').value = '';
  $('statusMatricula').value = 'ativa';
  $('turmaMatricula').value = '';
  disciplinasTemporarias = [];
  matriculaEmEdicao = null;
  renderizarDisciplinas();
  atualizarBotaoFinalizar();
}

function inicializar() {
  const btnAdicionarDisciplina = $('btnAdicionarDisciplina');
  const btnFinalizarMatricula = $('btnFinalizarMatricula');
  const buscaInput = $('buscaMatricula');
  const alunoSelect = $('alunoMatricula');
  
  if (!btnAdicionarDisciplina || !btnFinalizarMatricula || !buscaInput) return;
  
  // Recarregar dados do localStorage sempre que a modal abrir
  alunos = JSON.parse(localStorage.getItem('alunos')) || [];
  turmas = JSON.parse(localStorage.getItem('turmas')) || [];
  matriculas = JSON.parse(localStorage.getItem('matriculas')) || [];
  
  carregarAlunos();
  carregarTurmas();
  renderizarMatriculas();
  renderizarDisciplinas();

  btnAdicionarDisciplina.addEventListener('click', () => {
    const alunoIndex = parseInt($('alunoMatricula').value);
    const dataMatricula = $('dataMatricula').value;
    const turmaIndex = parseInt($('turmaMatricula').value);
    
    if (isNaN(alunoIndex) || !dataMatricula) {
      alert('Por favor, selecione um aluno e informe a data!');
      return;
    }

    if (isNaN(turmaIndex)) {
      alert('Por favor, selecione uma disciplina!');
      return;
    }

    const turma = turmas[turmaIndex];
    const jaAdicionada = disciplinasTemporarias.some(d => d.index === turmaIndex);
    
    if (jaAdicionada) {
      alert('Esta disciplina já foi adicionada!');
      return;
    }

    disciplinasTemporarias.push({
      index: turmaIndex,
      nome: turma.disciplina,
      professor: turma.professor,
      dia: turma.dia,
      turno: turma.turno
    });

    $('turmaMatricula').value = '';
    renderizarDisciplinas();
  });

  btnFinalizarMatricula.addEventListener('click', () => {
    if (disciplinasTemporarias.length === 0) {
      alert('Adicione pelo menos uma disciplina!');
      return;
    }

    const alunoIndex = parseInt($('alunoMatricula').value);
    const dataMatricula = $('dataMatricula').value;
    const status = $('statusMatricula').value;
    const aluno = alunos[alunoIndex];

    if (matriculaEmEdicao !== null) {
      // Atualizar matrícula existente
      matriculas[matriculaEmEdicao].dataMatricula = dataMatricula;
      matriculas[matriculaEmEdicao].status = status;
      matriculas[matriculaEmEdicao].disciplinas = [...disciplinasTemporarias];
      localStorage.setItem('matriculas', JSON.stringify(matriculas));
      alert(`Matrícula ${matriculas[matriculaEmEdicao].numeroMatricula} atualizada com sucesso!`);
    } else {
      // Criar nova matrícula
      const novaMatricula = {
        numeroMatricula: `MAT${Date.now()}`,
        alunoIndex: alunoIndex,
        alunoNome: aluno.nome,
        dataMatricula: dataMatricula,
        status: status,
        disciplinas: [...disciplinasTemporarias]
      };

      matriculas.push(novaMatricula);
      localStorage.setItem('matriculas', JSON.stringify(matriculas));
      alert(`Matrícula ${novaMatricula.numeroMatricula} criada com sucesso!`);
    }

    limparFormulario();
    renderizarMatriculas();
  });

  buscaInput.addEventListener('input', () => {
    renderizarMatriculas(buscaInput.value);
  });
}

window.removerDisciplina = function(index) {
  disciplinasTemporarias.splice(index, 1);
  renderizarDisciplinas();
};

window.editarMatricula = function(index) {
  const matricula = matriculas[index];
  
  // Carregar dados da matrícula no formulário
  $('alunoMatricula').value = matricula.alunoIndex;
  $('alunoMatricula').disabled = true;
  $('dataMatricula').value = matricula.dataMatricula;
  $('statusMatricula').value = matricula.status;
  
  // Carregar disciplinas
  disciplinasTemporarias = matricula.disciplinas.map(d => ({...d}));
  renderizarDisciplinas();
  
  // Marcar como em edição
  matriculaEmEdicao = index;
  atualizarBotaoFinalizar();
  
  // Scroll para o topo do formulário
  window.scrollTo(0, 0);
};

window.excluirMatricula = function(index) {
  if (confirm('Deseja excluir esta matrícula?')) {
    const numeroMatricula = matriculas[index].numeroMatricula;
    matriculas.splice(index, 1);
    localStorage.setItem('matriculas', JSON.stringify(matriculas));
    alert(`Matrícula ${numeroMatricula} excluída com sucesso!`);
    renderizarMatriculas();
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  inicializar();
}
})();


