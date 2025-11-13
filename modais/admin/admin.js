const $ = (id) => document.getElementById(id);

// Botões
const btnNovaTurma = $("btnNovaTurma");
const btnListarTurmas = $("btnListarTurmas");
const btnSalvarTurma = $("btnSalvarTurma");

// Elementos de interface
const formTurma = $("formTurma");
const listaTurmas = $("listaTurmas");

// Campos do formulário
const disciplinaInput = $("disciplina");
const professorInput = $("professor");
const diaInput = $("dia");
const turnoInput = $("turno");

// Banco local
let turmas = JSON.parse(localStorage.getItem("turmas")) || [];

// Mostrar formulário
btnNovaTurma.addEventListener("click", () => {
  formTurma.style.display = "block";
  listaTurmas.innerHTML = "";
});

// Mostrar lista
btnListarTurmas.addEventListener("click", () => {
  renderizarTurmas();
  formTurma.style.display = "none";
});

// Salvar turma
btnSalvarTurma.addEventListener("click", () => {
  const disciplina = disciplinaInput.value.trim();
  const professor = professorInput.value.trim();
  const dia = diaInput.value.trim();
  const turno = turnoInput.value.trim();

  if (!disciplina || !professor || !dia || !turno) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const turma = {
    id: Date.now(),
    disciplina,
    professor,
    dia,
    turno
  };

  turmas.push(turma);
  localStorage.setItem("turmas", JSON.stringify(turmas));

  disciplinaInput.value = "";
  professorInput.value = "";
  diaInput.value = "";

  formTurma.style.display = "none";
  alert("Turma cadastrada com sucesso!");
});

// Renderizar lista

function renderizarTurmas() {
  if (turmas.length === 0) {
    listaTurmas.innerHTML = "<p>Nenhuma turma cadastrada.</p>";
    return;
  }

  listaTurmas.innerHTML = turmas
    .map(
      (t, i) => `
      <div class="lista-turma">
        <strong>${t.disciplina}</strong><br />
        Professor: ${t.professor}<br />
        Horário: ${t.dia}${t.turno.charAt(0)}<br />
        <button onclick="excluirTurma(${i})">🗑️ Excluir</button>
      </div>
    `
    )
    .join("");
}

// Excluir turma
window.excluirTurma = function (index) {
  if (confirm("Deseja excluir esta turma?")) {
    turmas.splice(index, 1);
    localStorage.setItem("turmas", JSON.stringify(turmas));
    renderizarTurmas();
  }
};
