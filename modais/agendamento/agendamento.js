if (!window.eventos) {
    window.eventos = [];
}

    window.prontuarios = [{
    id: 1,
    paciente: "Carlos Oliveira",
    historico: "Consulta Terpeutica"
}, {
    id: 2,
    paciente: "Carol do Santos",
    historico: "Consulta Terpeutica"
}];

function iniciarCalendario() {
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            locale: 'pt-br',
            height: 'parent', 
            contentHeight: 'auto',
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title'
            },
            events: window.eventos,
            dateClick: function(info) {
                abrirModalAgendamento(info.dateStr);
            },
            eventClick: function(info) {
                mostrarResumoEvento(info.event);
            },
            eventDidMount: function(info) {
                info.el.style.cursor = 'pointer';
            }
        });
        calendar.render();
    }
}

function abrirModalAgendamento(data) {
      const options = window.prontuarios.map(p => 
        `<option value="${p.id}">${p.paciente}</option>`
    ).join('');
    Swal.fire({
        title: 'Novo Agendamento',
        html: `
             <select id="prontuario" class="swal2-select" placeholder="Paciente">
                ${options}
            </select>
            <input type="time" id="hora-inicio" class="swal2-input" placeholder="Hora Início">
            <input type="time" id="hora-fim" class="swal2-input" placeholder="Hora Fim">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return {
                prontuario: document.getElementById('prontuario').value,
                start: data + 'T' + document.getElementById('hora-inicio').value,
                end: data + 'T' + document.getElementById('hora-fim').value
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const novoEvento = result.value;
            eventos.push(novoEvento);
            iniciarCalendario(); 
        }
    });
}

function excluirEvento(evento) {
    Swal.fire({
        title: 'Confirmar exclusão?',
        text: "Você não poderá reverter isso!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const eventoStart = evento.start.toISOString();
            const eventoEnd = evento.end ? evento.end.toISOString() : null;
            const eventoProntuario = evento.extendedProps.prontuario;

            const index = window.eventos.findIndex(e => {
                const eStart = new Date(e.start).toISOString();
                const eEnd = e.end ? new Date(e.end).toISOString() : null;
                return eStart === eventoStart && 
                       eEnd === eventoEnd && 
                       e.prontuario == eventoProntuario;
            });
            
            if (index !== -1) {
                window.eventos.splice(index, 1);
                iniciarCalendario(); 
                Swal.fire(
                    'Excluído!',
                    'O agendamento foi removido.',
                    'success'
                );
            } else {
                Swal.fire(
                    'Erro!',
                    'Agendamento não encontrado para exclusão.',
                    'error'
                );
            }
        }
    });
}

function mostrarResumoEvento(evento) {
    const prontuarioId = evento.extendedProps.prontuario;
    const prontuario = window.prontuarios.find(p => p.id == prontuarioId);
    
    const infoProntuario = prontuario ? 
        `<p><strong>Paciente:</strong> ${prontuario.paciente}<br>
        <strong>Histórico:</strong> ${prontuario.historico}</p>` : '';
    
    const start = new Date(evento.start).toLocaleString('pt-BR');
    const end = evento.end ? new Date(evento.end).toLocaleString('pt-BR') : 'Sem término';

    Swal.fire({
        title: 'Detalhes do Agendamento',
        html: `
            <div style="text-align: left">
                ${infoProntuario}
                <p><strong>Início:</strong> ${start}</p>
                <p><strong>Término:</strong> ${end}</p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Fechar',
        cancelButtonText: 'Excluir',
        cancelButtonColor: '#d33',
        focusConfirm: false
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
            excluirEvento(evento);
        }
    });
}
iniciarCalendario();