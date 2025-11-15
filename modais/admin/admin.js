(function() {
const $ = (id) => document.getElementById(id);

let turmas = JSON.parse(localStorage.getItem("turmas")) || [];

function inicializar() {
  const btnNovaTurma = $("btnNovaTurma");
  const btnListarTurmas = $("btnListarTurmas");
  const btnSalvarTurma = $("btnSalvarTurma");

  const formTurma = $("formTurma");
  const listaTurmas = $("listaTurmas");

  const disciplinaInput = $("disciplina");
  const professorInput = $("professor");
  const diaInput = $("dia");
  const turnoInput = $("turno");

  renderizarTurmas();

  btnNovaTurma.addEventListener("click", () => {
    formTurma.style.display = "block";
    listaTurmas.innerHTML = "";
  });

  btnListarTurmas.addEventListener("click", () => {
    renderizarTurmas();
    formTurma.style.display = "none";
  });

  btnSalvarTurma.addEventListener("click", () => {
    const disciplina = disciplinaInput.value.trim();
    const professor = professorInput.value.trim();
    const dia = diaInput.value.trim();
    const turno = turnoInput.value.trim();

    if (!disciplina || !professor || !dia || !turno) {
      alert('Preencha todos os campos obrigatórios.');
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
    turnoInput.value = "";

    formTurma.style.display = "none";
    alert(`${disciplina} foi adicionada com sucesso!`);
    renderizarTurmas();
  });

  function renderizarTurmas() {
    if (turmas.length === 0) {
      listaTurmas.innerHTML = "<p>Nenhuma turma cadastrada.</p>";
      return;
    }

    const cores = ['cor-1', 'cor-2', 'cor-3', 'cor-4', 'cor-5', 'cor-6'];

    listaTurmas.innerHTML = turmas
      .map(
        (t, i) => `
        <div class="lista-turma ${cores[i % cores.length]}">
          <div>
            <strong>${t.disciplina}</strong>
            <p><strong>Professor:</strong> ${t.professor}</p>
            <p><strong>Dia:</strong> ${t.dia}</p>
            <p><strong>Turno:</strong> ${t.turno}</p>
          </div>
          <button onclick="excluirTurma(${i})">🗑️ Excluir</button>
        </div>
      `
      )
      .join("");
  }

  window.excluirTurma = function (index) {
    if (confirm("Deseja excluir esta turma?")) {
      turmas.splice(index, 1);
      localStorage.setItem("turmas", JSON.stringify(turmas));
      renderizarTurmas();
    }
  };
}

inicializar();
})();
