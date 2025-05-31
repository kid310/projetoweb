const listaPacientesEl = document.getElementById('listaPacientes');
const buscaPacienteEl = document.getElementById('buscaPaciente');
const formPaciente = document.getElementById('formPaciente');
const modalPacienteEl = document.getElementById('modalPaciente');
const modalPaciente = new bootstrap.Modal(modalPacienteEl);
const modalTitulo = modalPacienteEl.querySelector('.modal-title');

let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

function salvarLocalStorage() {
  localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nasc = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
    idade--;
  }
  return idade;
}

function formatarDataBR(dataStr) {
  if (!dataStr) return '';
  const d = new Date(dataStr);
  if (isNaN(d)) return '';
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function montarEndereco(endereco) {
  if (!endereco) return '';
  return `${endereco.rua}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}, CEP: ${endereco.cep}`;
}

function listarPacientes(filtro = '') {
  filtro = filtro.toLowerCase();
  listaPacientesEl.innerHTML = '';

  pacientes.forEach((paciente, index) => {
    if (
      paciente.nome.toLowerCase().includes(filtro) ||
      (paciente.documento && paciente.documento.toLowerCase().includes(filtro))
    ) {
      const idade = calcularIdade(paciente.dataNascimento);
      const linha = document.createElement('tr');

      linha.innerHTML = `
        <td>${paciente.nome}</td>
        <td>${formatarDataBR(paciente.dataNascimento)} / ${idade} anos</td>
        <td>${montarEndereco(paciente.endereco)}</td>
        <td>${paciente.preferenciaPagamento || ''}</td>
        <td>${formatarDataBR(paciente.inicioTratamento)}</td>
      <td class="d-flex flex-nowrap">
  
      `;

      listaPacientesEl.appendChild(linha);
    }
  });
}

function limparFormulario() {
  formPaciente.reset();
  document.getElementById('indexPaciente').value = '';
  formPaciente.classList.remove('was-validated');
  esconderCamposExtras();
}

function esconderCamposExtras() {
  document.getElementById('infoPIX').classList.add('d-none');
  document.getElementById('infoTransferencia').classList.add('d-none');
  document.getElementById('chavePIX').required = false;
}

function preencherFormulario(paciente, index) {
  document.getElementById('indexPaciente').value = index;
  formPaciente.nome.value = paciente.nome || '';
  formPaciente.dataNascimento.value = paciente.dataNascimento || '';
  formPaciente.documento.value = paciente.documento || '';

  if (paciente.endereco) {
    formPaciente.rua.value = paciente.endereco.rua || '';
    formPaciente.numero.value = paciente.endereco.numero || '';
    formPaciente.bairro.value = paciente.endereco.bairro || '';
    formPaciente.cidade.value = paciente.endereco.cidade || '';
    formPaciente.cep.value = paciente.endereco.cep || '';
    formPaciente.estado.value = paciente.endereco.estado || '';
  } else {
    formPaciente.rua.value = '';
    formPaciente.numero.value = '';
    formPaciente.bairro.value = '';
    formPaciente.cidade.value = '';
    formPaciente.cep.value = '';
    formPaciente.estado.value = '';
  }

  formPaciente.inicioTratamento.value = paciente.inicioTratamento || '';
  formPaciente.fimTratamento.value = paciente.fimTratamento || '';
  formPaciente.preferenciaPagamento.value = paciente.preferenciaPagamento || '';
  atualizarCamposExtras();

  formPaciente.chavePIX.value = paciente.chavePIX || '';
  formPaciente.agencia.value = paciente.agencia || '';
  formPaciente.conta.value = paciente.conta || '';
  formPaciente.instituicao.value = paciente.instituicao || '';
}

function atualizarCamposExtras() {
  const pref = formPaciente.preferenciaPagamento.value;
  esconderCamposExtras();

  if (pref === 'PIX') {
    document.getElementById('infoPIX').classList.remove('d-none');
    formPaciente.chavePIX.required = true;
  } else if (pref === 'Transferência') {
    document.getElementById('infoTransferencia').classList.remove('d-none');
    formPaciente.chavePIX.required = false;
  }
}

formPaciente.preferenciaPagamento.addEventListener('change', atualizarCamposExtras);

formPaciente.addEventListener('submit', e => {
  e.preventDefault();
  if (!formPaciente.checkValidity()) {
    formPaciente.classList.add('was-validated');
    return;
  }

  const index = document.getElementById('indexPaciente').value;
  const paciente = {
    nome: formPaciente.nome.value.trim(),
    dataNascimento: formPaciente.dataNascimento.value,
    documento: formPaciente.documento.value.trim(),
    endereco: {
      rua: formPaciente.rua.value.trim(),
      numero: formPaciente.numero.value.trim(),
      bairro: formPaciente.bairro.value.trim(),
      cidade: formPaciente.cidade.value.trim(),
      cep: formPaciente.cep.value.trim(),
      estado: formPaciente.estado.value
    },
    inicioTratamento: formPaciente.inicioTratamento.value,
    fimTratamento: formPaciente.fimTratamento.value,
    preferenciaPagamento: formPaciente.preferenciaPagamento.value,
    chavePIX: formPaciente.chavePIX.value.trim(),
    agencia: formPaciente.agencia.value.trim(),
    conta: formPaciente.conta.value.trim(),
    instituicao: formPaciente.instituicao.value.trim()
  };

  if (index === '') {
    pacientes.push(paciente);
  } else {
    pacientes[index] = paciente;
  }

  salvarLocalStorage();
  listarPacientes(buscaPacienteEl.value);
  modalPaciente.hide();
  limparFormulario();
});

buscaPacienteEl.addEventListener('input', () => {
  listarPacientes(buscaPacienteEl.value);
});

listaPacientesEl.addEventListener('click', e => {
  if (e.target.classList.contains('btnEditar')) {
    const idx = e.target.dataset.index;
    preencherFormulario(pacientes[idx], idx);
    modalTitulo.textContent = 'Editar Paciente';
    modalPaciente.show();
  } else if (e.target.classList.contains('btnExcluir')) {
    const idx = e.target.dataset.index;
    if (confirm('Confirma exclusão do paciente?')) {
      pacientes.splice(idx, 1);
      salvarLocalStorage();
      listarPacientes(buscaPacienteEl.value);
    }
  } 
});

document.getElementById('btnNovoPaciente').addEventListener('click', () => {
  limparFormulario();
  modalTitulo.textContent = 'Novo Paciente';
});

listarPacientes();
const modalProntuarioEl = document.getElementById('modalProntuario');
const modalProntuario = new bootstrap.Modal(modalProntuarioEl);
const formProntuario = document.getElementById('formProntuario');
const listaRegistrosEl = document.getElementById('listaRegistros');
const indexPacienteProntuarioEl = document.getElementById('indexPacienteProntuario');
const indexRegistroEl = document.getElementById('indexRegistro');
const dataRegistroEl = document.getElementById('dataRegistro');
const descricaoRegistroEl = document.getElementById('descricaoRegistro');
const btnCancelarRegistro = document.getElementById('btnCancelarRegistro');

function salvarLocalStorage() {
  localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

function carregarRegistros(indexPaciente) {
  listaRegistrosEl.innerHTML = '';
  const paciente = pacientes[indexPaciente];
  if (!paciente.registros) paciente.registros = [];
  if (paciente.registros.length === 0) {
    listaRegistrosEl.innerHTML = '<p class="text-muted">Nenhum registro no prontuário.</p>';
    return;
  }
  paciente.registros.forEach((registro, i) => {
    const dataFormatada = formatarDataBR(registro.data);
    const div = document.createElement('div');
    div.className = 'border p-2 mb-2';
    div.innerHTML = `
      <div class="d-flex justify-content-between align-items-start">
        <strong>${dataFormatada}</strong>
        <div>
          <button class="btn btn-sm btn-warning me-1 btnEditarRegistro" data-index="${i}">Editar</button>
          <button class="btn btn-sm btn-danger btnExcluirRegistro" data-index="${i}">Excluir</button>
        </div>
      </div>
      <p>${registro.descricao.replace(/\n/g, '<br>')}</p>
    `;
    listaRegistrosEl.appendChild(div);
  });
}

listaPacientesEl.addEventListener('click', e => {
  if (e.target.classList.contains('btnProntuario')) {
    const idx = e.target.dataset.index;
    indexPacienteProntuarioEl.value = idx;
    indexRegistroEl.value = '';
    dataRegistroEl.value = '';
    descricaoRegistroEl.value = '';
    carregarRegistros(idx);
    modalProntuarioEl.querySelector('.modal-title').textContent = `Prontuário - ${pacientes[idx].nome}`;
    formProntuario.classList.remove('was-validated');
    modalProntuario.show();
  }
});

listaRegistrosEl.addEventListener('click', e => {
  const idxPaciente = indexPacienteProntuarioEl.value;
  if (e.target.classList.contains('btnEditarRegistro')) {
    const idxRegistro = e.target.dataset.index;
    const registro = pacientes[idxPaciente].registros[idxRegistro];
    indexRegistroEl.value = idxRegistro;
    dataRegistroEl.value = registro.data;
    descricaoRegistroEl.value = registro.descricao;
    formProntuario.classList.remove('was-validated');
  } else if (e.target.classList.contains('btnExcluirRegistro')) {
    const idxRegistro = e.target.dataset.index;
    if (confirm('Confirma exclusão deste registro?')) {
      pacientes[idxPaciente].registros.splice(idxRegistro, 1);
      salvarLocalStorage();
      carregarRegistros(idxPaciente);
    }
  }
});

btnCancelarRegistro.addEventListener('click', () => {
  indexRegistroEl.value = '';
  dataRegistroEl.value = '';
  descricaoRegistroEl.value = '';
  formProntuario.classList.remove('was-validated');
});

formProntuario.addEventListener('submit', e => {
  e.preventDefault();
  if (!formProntuario.checkValidity()) {
    formProntuario.classList.add('was-validated');
    return;
  }
  const idxPaciente = indexPacienteProntuarioEl.value;
  const idxRegistro = indexRegistroEl.value;
  const novoRegistro = {
    data: dataRegistroEl.value,
    descricao: descricaoRegistroEl.value.trim()
  };
  if (!pacientes[idxPaciente].registros) pacientes[idxPaciente].registros = [];
  if (idxRegistro === '') {
    pacientes[idxPaciente].registros.push(novoRegistro);
  } else {
    pacientes[idxPaciente].registros[idxRegistro] = novoRegistro;
  }
  salvarLocalStorage();
  carregarRegistros(idxPaciente);
  indexRegistroEl.value = '';
  dataRegistroEl.value = '';
  descricaoRegistroEl.value = '';
  formProntuario.classList.remove('was-validated');
});
