const params = new URLSearchParams(window.location.search);
const foto = params.get('foto');

const resumos = {
    '0': {
        titulo: 'Design Thinking - Process (Resumo)',
        corpo: `Design Thinking é uma abordagem de inovação centrada no usuário, que utiliza pesquisa para entender profundamente suas necessidades, dores e comportamentos, com o objetivo de criar soluções mais relevantes.

Inovação é um processo criativo que gera impacto positivo, podendo ser incremental (melhorias contínuas) ou disruptiva (mudanças que transformam mercados e comportamentos).

Para inovar de forma eficaz, uma solução deve equilibrar três pilares: ser desejável para as pessoas, viável como negócio e tecnicamente possível de ser implementada.`
    },
    '1': {
        titulo: 'Holiday at Sea (Resumo)',
        corpo: `O texto relata a experiência de uma família em um cruzeiro pelo Caribe, que inicialmente hesitava por ter quatro filhos menores de 14 anos.

A bordo, as crianças tinham clubes e atividades próprias, enquanto os pais podiam relaxar. As instalações incluíam lojas, pista de corrida e restaurantes variados.

O autor recomenda cruzeiros, mas aconselha buscar descontos antecipados. Alerta que celulares não funcionam no mar e que gorjetas são esperadas, porém orientadas.`
    },
    '2': {
        titulo: 'Férias no Mar — Tradução (Resumo)',
        corpo: `O texto narra a experiência de uma família em um cruzeiro pelo Caribe, inicialmente receosa por ter quatro filhos pequenos.

A bordo, as crianças participavam de clubes por faixa etária, enquanto os pais relaxavam. As instalações eram excelentes: lojas, quadras e restaurantes de qualidade.

O autor recomenda cruzeiros e orienta buscar os melhores preços. Lembra que celulares não funcionam no mar e que gorjetas são esperadas, mas sempre informadas.`
    }
};

const resumo = resumos[foto] || resumos['0'];
document.getElementById('resumo-titulo').textContent = resumo.titulo;

const corpo = document.getElementById('resumo-corpo');
resumo.corpo.split('\n\n').forEach(p => {
    const el = document.createElement('p');
    el.textContent = p;
    corpo.appendChild(el);
});