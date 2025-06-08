if (!window.janelaTamanho) {
    window.janelaTamanho = 8
    window.paginaAtual = 1
    window.registrosFiltrados = []
}

document.getElementById("pesquisa").addEventListener("input", function () {
    const termo = this.value.trim().toLowerCase()
    FiltrarRegistros(termo)
})

function FiltrarRegistros(termo) {
    const todosRegistros = JSON.parse(localStorage.getItem("registros")) || [];

    if (!termo) {
        registrosFiltrados = todosRegistros
    } else {
        registrosFiltrados = todosRegistros.filter(reg =>
            Object.values(reg).some(val =>
                String(val).toLowerCase().includes(termo)
            )
        )
    }

    paginaAtual = 1
    CriarPaginacao()
    RenderizarTabela()
}

function AtualizarTabela() {
    const dados = JSON.parse(localStorage.getItem("registros")) || []
    registrosFiltrados = dados

    const totalPaginas = Math.ceil(registrosFiltrados.length / janelaTamanho)
    if (paginaAtual > totalPaginas) {
        paginaAtual = totalPaginas || 1
    }

    CriarPaginacao()
    RenderizarTabela()
}

function CriarPaginacao() {
    const totalPaginas = Math.ceil(registrosFiltrados.length / janelaTamanho);
    const qtdPaginas = document.getElementById("qtdPaginas")
    qtdPaginas.innerHTML = ""

    const anterior = document.createElement("li")
    anterior.className = `page-item ${paginaAtual === 1 ? "disabled" : ""}`
    anterior.innerHTML = `<a class="page-link" href="#" onclick="TrocarPagina('anterior')">&lt;</a>`
    qtdPaginas.appendChild(anterior)

    for (let i = 1; i <= totalPaginas; i++) {
        const li = document.createElement("li")
        li.className = "page-item"
        li.innerHTML = `<a class="page-link ${i === paginaAtual ? "ativado" : ""}" onclick="TrocarPagina(${i})" href="#">${i}</a>`
        qtdPaginas.appendChild(li)
    }

    const proxima = document.createElement("li")
    proxima.className = `page-item ${paginaAtual === totalPaginas ? "disabled" : ""}`
    proxima.innerHTML = `<a class="page-link" href="#" onclick="TrocarPagina('proxima')">&gt;</a>`
    qtdPaginas.appendChild(proxima)
}

function RenderizarTabela() {
    const tabela = document.getElementById("tabela")
    tabela.innerHTML = ""

    const inicio = (paginaAtual - 1) * janelaTamanho
    const fim = inicio + janelaTamanho
    const registrosPagina = registrosFiltrados.slice(inicio, fim)

    if (registrosPagina.length === 0) {
        tabela.innerHTML = "<tr><td colspan='7'>Nenhum registro encontrado</td></tr>";
        return
    }

    registrosPagina.forEach((registro, index) => {
        const indexReal = inicio + index
        AumentarTabela(registro, indexReal)
    })
}


function TrocarPagina(valor) {
    const totalPaginas = Math.ceil(registrosFiltrados.length / janelaTamanho);

    if (valor === "anterior") {
        if (paginaAtual > 1) paginaAtual--
    } else if (valor === "proxima") {
        if (paginaAtual < totalPaginas) paginaAtual++
    } else {
        paginaAtual = valor;
    }

    CriarPaginacao()
    RenderizarTabela()
}

function Registrar(Paciente, Atendimento, Horario, Valor, Vencimento, Comprovante, Situacao) {
    const registro = {
        Paciente,
        Atendimento,
        Horario,
        Valor,
        Vencimento,
        Comprovante,
        Situacao
    }

    let registros = JSON.parse(localStorage.getItem("registros")) || []

    if (registros.some(r => JSON.stringify(r) === JSON.stringify(registro))) return

    registros.push(registro)
    localStorage.setItem("registros", JSON.stringify(registros))

    AtualizarTabela()
}

function AumentarTabela(registro, indexReal) {
    const tabela = document.getElementById("tabela")
    const linha = document.createElement("tr")

    for (let dado in registro) {
        const coluna = document.createElement("td")

        if (dado === "Situacao") {
            const span = document.createElement("span")
            span.innerHTML = registro[dado]
            span.className = `badge p-2 ${registro[dado] === "PAGO"
                    ? "status-pago"
                    : registro[dado] === "CANCELADO"
                        ? "status-cancelado"
                        : "status-pendente"
                }`

            // Torna o status editável ao clicar
            span.style.cursor = "pointer"
            span.addEventListener("click", () => {
                const select = document.createElement("select")
                select.className = "form-select form-select-sm"

                ["PAGO", "PENDENTE", "CANCELADO"].forEach(status => {
                    const option = document.createElement("option")
                    option.value = status
                    option.text = status
                    if (status === registro[dado]) option.selected = true
                    select.appendChild(option)
                })

                select.addEventListener("change", () => {
                    const registros = JSON.parse(localStorage.getItem("registros"))
                    registros[indexReal].Situacao = select.value
                    localStorage.setItem("registros", JSON.stringify(registros))
                    AtualizarTabela()
                })

                coluna.innerHTML = ""
                coluna.appendChild(select)
                select.focus()
            });

            coluna.appendChild(span)
        } else if (dado === "Comprovante") {
            coluna.innerHTML = `<button class="btn btn-light btn-upload"><i class="bi bi-upload"></i></button>`
        } else {
            coluna.innerHTML = dado === "Valor" ? "R$" + registro[dado] : registro[dado] 
        }

        linha.appendChild(coluna)
    }

    tabela.appendChild(linha)
}

document.getElementById("registroForm").addEventListener("submit", function (event) {
    event.preventDefault()

    const paciente = document.getElementById("paciente").value
    const atendimento = document.getElementById("atendimento").value
    const horario = document.getElementById("horario").value
    const valor = document.getElementById("valor").value
    const vencimento = document.getElementById("vencimento").value
    const situacao = document.getElementById("situacao").value

    Registrar(paciente, atendimento, horario, valor, vencimento, "bi bi-upload", situacao)

    document.getElementById("paciente").value = ""
    document.getElementById("atendimento").value = ""
    document.getElementById("horario").value = ""
    document.getElementById("valor").value = ""
    document.getElementById("vencimento").value = ""
    document.getElementById("situacao").value = "PENDENTE"


})

// Registros para aparecer na tabela

Registrar("Gabriel Machado", "2025-05-24", "16:00", "200", "2025-08-08", "bi bi-upload", "PENDENTE");
Registrar("Helenaldo da Silva", "2025-05-24", "9:30", "200", "2025-08-08", "bi bi-upload", "PAGO");
Registrar("Henrique Shroeder", "2025-05-17", "20:00", "200", "2025-08-08", "bi bi-upload", "PAGO");
Registrar("Igor Sodré", "2025-05-17", "18:30", "200", "2025-08-08", "bi bi-upload", "CANCELADO");
Registrar("Gabriel Machado", "2025-05-25", "16:00", "200", "2025-08-08", "bi bi-upload", "PENDENTE");
Registrar("Helenaldo da Silva", "2025-05-25", "9:30", "200", "2025-08-08", "bi bi-upload", "PAGO");
Registrar("Henrique Shroeder", "2025-05-18", "20:00", "200", "2025-08-08", "bi bi-upload", "PAGO");
Registrar("Igor Sodré", "2025-05-18", "18:30", "200", "2025-08-08", "bi bi-upload", "CANCELADO");
Registrar("Gabriel Machado", "2025-05-23", "16:00", "200", "2025-08-08", "bi bi-upload", "PENDENTE");
Registrar("Helenaldo da Silva", "2025-05-23", "9:30", "200", "2025-08-08", "bi bi-upload", "PAGO");
Registrar("Henrique Shroeder", "2025-05-16", "20:00", "200", "2025-08-08", "bi bi-upload", "PAGO");
Registrar("Igor Sodré", "2025-05-16", "18:30", "200", "2025-08-08", "bi bi-upload", "CANCELADO");
Registrar("Henrique Shroeder", "2025-05-14", "20:00", "200", "2025-08-08", "bi bi-upload", "PAGO");
Registrar("Igor Sodré", "2025-05-14", "18:30", "200", "2025-08-08", "bi bi-upload", "CANCELADO");
Registrar("Igor Sodré", "2025-05-12", "18:30", "200", "2025-08-08", "bi bi-upload", "CANCELADO");
Registrar("Igor Sodré", "2025-05-12", "18:30", "200", "2025-08-08", "bi bi-upload", "CANCELADO");
AtualizarTabela()
