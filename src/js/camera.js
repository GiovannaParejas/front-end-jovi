let modoAtual = null;

document.querySelectorAll('.modo').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.modo').forEach(b => b.classList.remove('ativo'));
        btn.classList.add('ativo');
    });
});

document.querySelectorAll('.zoom-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.zoom-btn').forEach(b => b.classList.remove('ativo'));
        btn.classList.add('ativo');
    });
});

function limparModo() {
    const video = document.getElementById('camera-feed');

    document.getElementById('msg-reconhecimento')?.remove();
    document.getElementById('resultado-traducao')?.remove();
    document.getElementById('canvas-selecao')?.remove();
    document.getElementById('resultado-copia')?.remove();
    document.getElementById('botoes-copia')?.remove();
    document.getElementById('aviso-copia')?.remove();
    document.getElementById('btn-fechar-selecao')?.remove();

    video.style.display = 'block';
    video.onended = null;
}

function voltarParaLoop() {
    const video = document.getElementById('camera-feed');
    limparModo();
    modoAtual = null;
    document.querySelectorAll('.modo-acao').forEach(b => b.classList.remove('ativo'));
    video.loop = true;
    video.src = '../assets/loopmesa.mp4';
    video.play();
}

function selecionarAcao(acao) {
    document.querySelectorAll('.modo-acao').forEach(b => b.classList.remove('ativo'));
    event.target.classList.add('ativo');
    modoAtual = acao;

    limparModo();

    const video = document.getElementById('camera-feed');

    if (acao === 'digitalizar') {
        video.loop = false;
        video.src = '../assets/cadernoNaMesa.mp4';
        video.play();

    } else if (acao === 'traduzir') {
        video.loop = false;
        video.src = '../assets/videoFolhaIngles.mp4';
        video.play();

        const msg = document.createElement('div');
        msg.id = 'msg-reconhecimento';
        msg.textContent = 'Aguarde o reconhecimento do texto';
        document.querySelector('.camera-wrapper').appendChild(msg);

        video.onended = () => {
            msg.remove();
            video.style.display = 'none';

            const img = document.createElement('img');
            img.id = 'resultado-traducao';
            img.src = '../assets/traducao.png';
            document.querySelector('.camera-wrapper').appendChild(img);
        };

    } else if (acao === 'copiar') {
        video.loop = false;
        video.src = '../assets/cadernoNaMesa.mp4';
        video.play();

        const msg = document.createElement('div');
        msg.id = 'msg-reconhecimento';
        msg.textContent = 'Aguarde o reconhecimento do texto';
        document.querySelector('.camera-wrapper').appendChild(msg);

        video.onended = () => {
            msg.remove();
            video.style.display = 'none';

            // Imagem
            const img = document.createElement('img');
            img.id = 'resultado-copia';
            img.src = '../assets/caderno.jpeg';
            document.querySelector('.camera-wrapper').appendChild(img);

            // Botão fechar
            const btnFechar = document.createElement('button');
            btnFechar.id = 'btn-fechar-selecao';
            btnFechar.innerHTML = '<span class="material-icons">close</span>';
            btnFechar.onclick = voltarParaLoop;
            document.querySelector('.camera-wrapper').appendChild(btnFechar);

            // Canvas
            const wrapper = document.querySelector('.camera-wrapper');
            const canvas = document.createElement('canvas');
            canvas.id = 'canvas-selecao';
            canvas.width = wrapper.offsetWidth;
            canvas.height = wrapper.offsetHeight;
            wrapper.appendChild(canvas);

            let startX, startY, drawing = false;
            const ctx = canvas.getContext('2d');

            canvas.addEventListener('mousedown', (e) => {
                const rect = canvas.getBoundingClientRect();
                startX = e.clientX - rect.left;
                startY = e.clientY - rect.top;
                drawing = true;
                document.getElementById('botoes-copia')?.remove();
            });

            canvas.addEventListener('mousemove', (e) => {
                if (!drawing) return;
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'rgba(200, 255, 0, 0.25)';
                ctx.strokeStyle = '#C8FF00';
                ctx.lineWidth = 2;
                ctx.fillRect(startX, startY, x - startX, y - startY);
                ctx.strokeRect(startX, startY, x - startX, y - startY);
            });

            canvas.addEventListener('mouseup', (e) => {
                if (!drawing) return;
                drawing = false;
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const w = Math.abs(x - startX);
                const h = Math.abs(y - startY);

                if (w > 10 && h > 10) {
                    document.getElementById('botoes-copia')?.remove();
                    const botoes = document.createElement('div');
                    botoes.id = 'botoes-copia';
                    botoes.innerHTML = `
                            <button onclick="copiarTexto('trecho')">Copiar trecho selecionado</button>
                            <button onclick="copiarTexto('tudo')">Copiar tudo</button>
                        `;
                    document.querySelector('.camera-wrapper').appendChild(botoes);
                }
            });

            canvas.addEventListener('touchstart', (e) => {
                const rect = canvas.getBoundingClientRect();
                startX = e.touches[0].clientX - rect.left;
                startY = e.touches[0].clientY - rect.top;
                drawing = true;
                document.getElementById('botoes-copia')?.remove();
            });

            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (!drawing) return;
                const rect = canvas.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const y = e.touches[0].clientY - rect.top;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'rgba(200, 255, 0, 0.25)';
                ctx.strokeStyle = '#C8FF00';
                ctx.lineWidth = 2;
                ctx.fillRect(startX, startY, x - startX, y - startY);
                ctx.strokeRect(startX, startY, x - startX, y - startY);
            }, { passive: false });

            canvas.addEventListener('touchend', (e) => {
                if (!drawing) return;
                drawing = false;
                const rect = canvas.getBoundingClientRect();
                const x = e.changedTouches[0].clientX - rect.left;
                const y = e.changedTouches[0].clientY - rect.top;
                const w = Math.abs(x - startX);
                const h = Math.abs(y - startY);

                if (w > 10 && h > 10) {
                    document.getElementById('botoes-copia')?.remove();
                    const botoes = document.createElement('div');
                    botoes.id = 'botoes-copia';
                    botoes.innerHTML = `
                            <button onclick="copiarTexto('trecho')">Copiar trecho selecionado</button>
                            <button onclick="copiarTexto('tudo')">Copiar tudo</button>
                        `;
                    document.querySelector('.camera-wrapper').appendChild(botoes);
                }
            });
        };

    } else {
        video.loop = true;
        video.src = '../assets/loopmesa.mp4';
        video.play();
    }
}

function copiarTexto(tipo) {
    const texto = tipo === 'tudo'
        ? 'Texto completo do documento copiado.'
        : 'Trecho selecionado copiado.';

    navigator.clipboard.writeText(texto).catch(() => { });

    document.getElementById('aviso-copia')?.remove();

    const aviso = document.createElement('div');
    aviso.id = 'aviso-copia';
    aviso.textContent = tipo === 'tudo' ? 'Tudo copiado!' : 'Trecho copiado!';
    document.querySelector('.camera-wrapper').appendChild(aviso);

    setTimeout(() => aviso.remove(), 2000);
}

function irParaFoto() {
    if (modoAtual === 'digitalizar') {
        window.location.href = '../pages/galeria.html?foto=0';
    } else if (modoAtual === 'traduzir') {
        window.location.href = '../pages/galeria.html?foto=1';
    } else {
        window.location.href = '../pages/galeria.html';
    }
}