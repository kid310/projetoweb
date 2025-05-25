// Função para abrir os modais dinamicamente
function abrirModal(modalName) {
    fetch(`modais/${modalName}/${modalName}.html`)
        .then(response => response.text())
        .then(html => {
            const oldScript = document.getElementById('modalScript');
            if (oldScript) oldScript.remove();
            document.getElementById('modalTitle').innerText = modalName.charAt(0).toUpperCase() + modalName.slice(1);
            document.getElementById('modalBody').innerHTML = html;
            const modal = new bootstrap.Modal(document.getElementById('modalContainer'));
            
            // Adicione este listener
            modal._element.addEventListener('shown.bs.modal', () => {
                const script = document.createElement('script');
                script.src = `modais/${modalName}/${modalName}.js`;
                script.id = 'modalScript';
                document.body.appendChild(script);
            });

            modal.show();
        });
}

// Função para expandir ou recolher a sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const icon = document.getElementById('toggleIcon');
    sidebar.classList.toggle('collapsed');
    
    if (sidebar.classList.contains('collapsed')) {
        icon.classList.remove('bi-chevron-left');
        icon.classList.add('bi-chevron-right');
    } else {
        icon.classList.remove('bi-chevron-right');
        icon.classList.add('bi-chevron-left');
    }
}
