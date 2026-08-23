# Efeito de sobreposição no header da /bussola

Trocar o parallax do bloco 2 por um efeito no próprio header: o hero fica "preso" (sticky) enquanto o usuário desce, e o bloco de baixo sobe por cima dele, cobrindo a tela.

## Como vai funcionar

1. **Header fixo no scroll**: o hero da Bússola permanece na tela enquanto o scroll avança, em vez de sair empurrado para cima.
2. **Bloco de baixo sobe por cima**: a seção "Tem semana que tudo flui" desliza de baixo para cima, sobrepondo o header como uma camada nova, com cantos superiores arredondados e uma linha dourada fina no topo da camada.
3. **Header responde ao movimento**: conforme a camada sobe, o hero recua sutilmente (leve redução de escala e escurecimento) — dá a sensação de profundidade, como se a tela de cima ficasse para trás.
4. **Bloco 2 sem parallax próprio**: o movimento passa a ser esse deslizamento único; a imagem apenas faz um fade/subida discreta ao entrar.

## Mobile

- Mesmo efeito, com amplitude menor e apenas `transform`/`opacity`.
- Sem blur pesado, sem sombra grande.
- `prefers-reduced-motion`: sem sticky nem deslizamento — as seções aparecem empilhadas normalmente.

## Detalhes técnicos

- `src/routes/bussola.tsx`: hero envolvido em wrapper `sticky top-0` com o bloco seguinte em `relative z-10`, para que ele suba por cima naturalmente.
- `src/components/bussola/bloco-tudo-flui.tsx`: remover o parallax de imagem/halo atual e manter só a entrada suave; adicionar topo arredondado, fundo sólido e borda dourada sutil.
- Escala/escurecimento do hero via ScrollTrigger (GSAP já instalado) aplicado no wrapper, com cleanup no unmount.
- Sem mudanças em copy, tracking, backend ou nas outras páginas.
