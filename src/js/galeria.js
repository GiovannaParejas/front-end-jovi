const fotos = [
    { src: '../assets/digitalizacao.png', titulo: 'Design Thinking - Process', nota: 2 },
    { src: '../assets/holiday.png', titulo: 'Holiday at Sea', nota: 0 },
    { src: '../assets/traducao.png', titulo: 'Férias no Mar (Tradução)', nota: 1 },
];

let fotoAtual = null;

const notaUrls = [
    'nota-editor.html?titulo=Holiday at Sea&tag=Estudo&tagcor=azul&corpo=My wife and I had never considered a cruise holiday...',
    'nota-editor.html?titulo=Férias no Mar&tag=Pessoal&tagcor=verde&corpo=Minha esposa e eu nunca tínhamos considerado...',
    'nota-editor.html?titulo=Design Thinking - Process&tag=Rascunho&tagcor=amarelo&corpo=Nano Course – Design como ferramenta de inovação...',
];

const params = new URLSearchParams(window.location.search);
const fotoParam = params.get('foto');
if (fotoParam !== null) abrirFoto(parseInt(fotoParam));

function abrirFoto(index) {
    fotoAtual = index;
    const foto = fotos[index];
    document.getElementById('foto-ampliada').src = foto.src;
    document.getElementById('foto-titulo').textContent = foto.titulo;
    document.getElementById('tela-galeria').classList.add('oculto');
    document.getElementById('tela-foto').classList.remove('oculto');
    fecharMenuAnotacoes();
    fecharGrifar();
    fecharPDF();

    const btnEsquerda = document.getElementById('btn-esquerda');
    if (index === 1) {
        btnEsquerda.innerHTML = '<span class="material-icons">translate</span><span>Traduzir</span>';
        btnEsquerda.onclick = () => abrirFoto(2);
    } else if (index === 2) {
        btnEsquerda.innerHTML = '<span class="material-icons">arrow_back</span><span>Voltar</span>';
        btnEsquerda.onclick = () => abrirFoto(1);
    } else {
        btnEsquerda.innerHTML = '<span class="material-icons">share</span><span>Compartilhar</span>';
        btnEsquerda.onclick = null;
    }
    btnEsquerda.classList.remove('ativo');
}

function fecharFoto() {
    document.getElementById('tela-foto').classList.add('oculto');
    document.getElementById('tela-galeria').classList.remove('oculto');
    fecharMenuAnotacoes();
    fecharGrifar();
    fecharPDF();
}

function voltarOuHistorico() {
    const pdfAberto = !document.getElementById('tela-pdf').classList.contains('oculto');
    if (pdfAberto) { fecharVisualizadorPDF(); return; }
    const fotoAberta = !document.getElementById('tela-foto').classList.contains('oculto');
    if (fotoAberta) fecharFoto();
    else history.back();
}

function abrirAnotacoes() {
    fecharGrifar();
    fecharPDF();
    document.getElementById('menu-anotacoes').classList.remove('oculto');
}

function fecharMenuAnotacoes() {
    document.getElementById('menu-anotacoes').classList.add('oculto');
}

function abrirNota() {
    const foto = fotos[fotoAtual];
    window.location.href = notaUrls[foto.nota];
}

function abrirGrifar() {
    fecharMenuAnotacoes();
    document.getElementById('overlay-grifar').classList.remove('oculto');
    document.querySelector('.foto-header').style.display = 'none';
    document.querySelector('.foto-acoes').style.display = 'none';
    document.querySelector('.barra-inferior').style.display = 'none';

    const canvasExistente = document.getElementById('canvas-grifo');
    if (canvasExistente) canvasExistente.remove();

    const visualizacao = document.querySelector('.foto-visualizacao');
    const rect = visualizacao.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas-grifo';
    canvas.width = rect.width;
    canvas.height = rect.height;
    visualizacao.style.position = 'relative';
    visualizacao.appendChild(canvas);

    let startX, startY, drawing = false;
    const ctx = canvas.getContext('2d');
    const grifos = [];

    function redesenhar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        grifos.forEach(g => {
            ctx.fillStyle = 'rgba(200, 255, 0, 0.35)';
            ctx.fillRect(g.x, g.y, g.w, g.h);
        });
    }

    canvas.addEventListener('mousedown', (e) => {
        const r = canvas.getBoundingClientRect();
        startX = e.clientX - r.left;
        startY = e.clientY - r.top;
        drawing = true;
    });
    canvas.addEventListener('mousemove', (e) => {
        if (!drawing) return;
        const r = canvas.getBoundingClientRect();
        redesenhar();
        ctx.fillStyle = 'rgba(200, 255, 0, 0.35)';
        ctx.fillRect(startX, startY, e.clientX - r.left - startX, e.clientY - r.top - startY);
    });
    canvas.addEventListener('mouseup', (e) => {
        if (!drawing) return;
        drawing = false;
        const r = canvas.getBoundingClientRect();
        grifos.push({ x: startX, y: startY, w: e.clientX - r.left - startX, h: e.clientY - r.top - startY });
    });
    canvas.addEventListener('touchstart', (e) => {
        const r = canvas.getBoundingClientRect();
        startX = e.touches[0].clientX - r.left;
        startY = e.touches[0].clientY - r.top;
        drawing = true;
    });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!drawing) return;
        const r = canvas.getBoundingClientRect();
        redesenhar();
        ctx.fillStyle = 'rgba(200, 255, 0, 0.35)';
        ctx.fillRect(startX, startY, e.touches[0].clientX - r.left - startX, e.touches[0].clientY - r.top - startY);
    }, { passive: false });
    canvas.addEventListener('touchend', (e) => {
        if (!drawing) return;
        drawing = false;
        const r = canvas.getBoundingClientRect();
        grifos.push({ x: startX, y: startY, w: e.changedTouches[0].clientX - r.left - startX, h: e.changedTouches[0].clientY - r.top - startY });
    });
}

function fecharGrifar() {
    document.getElementById('overlay-grifar').classList.add('oculto');
    document.querySelector('.foto-header').style.display = '';
    document.querySelector('.foto-acoes').style.display = '';
    document.querySelector('.barra-inferior').style.display = '';
    const canvas = document.getElementById('canvas-grifo');
    if (canvas) canvas.remove();
}

function confirmarGrifar() {
    document.getElementById('overlay-grifar').classList.add('oculto');
    document.querySelector('.foto-header').style.display = '';
    document.querySelector('.foto-acoes').style.display = '';
    document.querySelector('.barra-inferior').style.display = '';
}

function abrirPDF() {
    fecharGrifar();
    fecharMenuAnotacoes();
    document.getElementById('menu-pdf').classList.remove('oculto');
}

function fecharPDF() {
    document.getElementById('menu-pdf').classList.add('oculto');
}

function abrirVisualizadorPDF(tipo) {
    fecharPDF();
    document.getElementById('tela-foto').classList.add('oculto');
    document.getElementById('tela-pdf').classList.remove('oculto');
    document.getElementById('pdf-titulo').textContent = tipo === 'texto' ? 'Texto em PDF' : 'Foto em PDF';

    const pdfPorFoto = {
        0: { foto: '../assets/DesignCadernoPDF.png', texto: '../assets/designTextoPDF.png' },
        1: { foto: '../assets/HolidayCadernoPDF.png', texto: '../assets/holidayTextoPDF.png' },
        2: { foto: '../assets/FeriasCadernoPDF.png', texto: '../assets/FeriasTextoPDF.png' },
    };

    const imagens = pdfPorFoto[fotoAtual];
    document.getElementById('pdf-p1').src = tipo === 'foto' ? imagens.foto : imagens.texto;
}

function fecharVisualizadorPDF() {
    document.getElementById('tela-pdf').classList.add('oculto');
    document.getElementById('tela-foto').classList.remove('oculto');
}

function abrirResumo() {
    window.location.href = `ia.html?foto=${fotoAtual}`;
}