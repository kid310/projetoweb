const $ = (id) => document.getElementById(id);

const btnNovaPesquisa = $("btnNovaPesquisa");
const btnListarPesquisas = $("btnListarPesquisas");
const formPesquisa = $("formPesquisa");
const areaPerguntas = $("areaPerguntas");
const btnAddRadio = $("btnAddRadio");
const btnAddTexto = $("btnAddTexto");
const btnSalvarPesquisa = $("btnSalvarPesquisa");
const listaPesquisas = $("listaPesquisas");

let pesquisas = [];

// Mostrar formulário
btnNovaPesquisa.addEventListener("click", () => {
  formPesquisa.style.display = "block";
  areaPerguntas.innerHTML = "";
  listaPesquisas.innerHTML = "";
});

// Mostrar lista
btnListarPesquisas.addEventListener("click", () => {
  renderizarPesquisas();
  formPesquisa.style.display = "none";
});

// Adicionar pergunta objetiva
btnAddRadio.addEventListener("click", () => {
  areaPerguntas.appendChild(criarPerguntaRadio());
});

// Adicionar pergunta discursiva
btnAddTexto.addEventListener("click", () => {
  areaPerguntas.appendChild(criarPerguntaTexto());
});

// Salvar pesquisa
btnSalvarPesquisa.addEventListener("click", () => {
  const nome = $("nomePesquisa").value;
  const paciente = $("vinculoProntuario").value;
  const incidencia = $("incidencia").value;

  if (!nome || !paciente || !incidencia) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const perguntas = Array.from(areaPerguntas.querySelectorAll(".pergunta")).map(bloco => {
    const texto = bloco.querySelector("input").value;

    if (bloco.classList.contains("pergunta-radio")) {
      const opcoes = Array.from(bloco.querySelectorAll(".opcao input"))
                          .map(inp => inp.value.trim())
                          .filter(Boolean);
      return texto && opcoes.length ? { tipo: "radio", texto, opcoes } : null;
    } else {
      return texto ? { tipo: "texto", texto } : null;
    }
  }).filter(Boolean);

  pesquisas.push({ nome, paciente, incidencia, perguntas });

  formPesquisa.style.display = "none";
  areaPerguntas.innerHTML = "";
  $("nomePesquisa").value = "";
  $("incidencia").value = "";
  alert("Pesquisa salva com sucesso!");
});

// Criação de perguntas
function criarPerguntaRadio() {
  const div = document.createElement("div");
  div.className = "pergunta pergunta-radio";
  div.innerHTML = `
    <label>Pergunta (Objetiva):</label>
    <input type="text" class="pergunta-texto" />
    <div class="opcao">
      <input type="text" placeholder="Opção 1" />
      <input type="text" placeholder="Opção 2" />
    </div>
  `;
  return div;
}

function criarPerguntaTexto() {
  const div = document.createElement("div");
  div.className = "pergunta pergunta-texto";
  div.innerHTML = `
    <label>Pergunta (Discursiva):</label>
    <input type="text" class="pergunta-texto" />
  `;
  return div;
}

// Listagem
function renderizarPesquisas() {
  listaPesquisas.innerHTML = pesquisas.length === 0
    ? "<p>Nenhuma pesquisa cadastrada.</p>"
    : pesquisas.map((p, i) => `
        <div class="lista-pesquisa">
          <strong>${p.nome}</strong><br />
          Paciente: ${p.paciente}<br />
          Incidência: ${p.incidencia}<br />
          <em>${p.perguntas.length} pergunta(s)</em><br />
          <button onclick="excluirPesquisa(${i})">🗑️ Excluir</button>
        </div>
      `).join("");
}

// Função global para exclusão
window.excluirPesquisa = function(index) {
  if (confirm("Deseja excluir esta pesquisa?")) {
    pesquisas.splice(index, 1);
    renderizarPesquisas();
  }
};

