const params = new URLSearchParams(window.location.search);
const titulo = params.get('titulo');
const corpo = params.get('corpo');

if (titulo) {
    document.querySelector('.nota-titulo-edit').textContent = titulo;
    document.querySelector('.header-titulo').textContent = titulo;
}

if (corpo) {
    const paragrafos = corpo.split('||');
    const html = paragrafos.map(p => `<p>${p}</p>`).join('');
    document.querySelector('.nota-corpo').innerHTML = html;
}

function formatar(comando) {
    document.execCommand(comando, false, null);
}