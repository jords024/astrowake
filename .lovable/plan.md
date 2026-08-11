# Ancoragem de preço + escassez abaixo do CTA

## O que será feito

Adicionar, abaixo do botão "QUERO PARTICIPAR" no hero (`src/routes/index.tsx`), um bloco de percepção de valor com ancoragem de preço e escassez de vagas.

### Layout do bloco (hero, centralizado à esquerda)

```
R$197,00        →        R$0,00
(riscado, cinza)          (dourado, destaque)

Ingresso ao vivo • Vagas limitadas: máximo 400 pessoas
```

- A linha de preço mostra **R$197,00 riscado** (valor âncora) ao lado do **R$0,00 em dourado** (valor real).
- Logo abaixo, a frase de escassez: **"Ingresso ao vivo • Máximo 400 pessoas"**, reforçando exclusividade e urgência.
- Estilo consistente com o tema: riscado em `text-muted-foreground/70`, o "R$0,00" em `text-gold` com peso extrabold, e um pequeno rótulo "VALOR DO EVENTO" opcional acima para dar contexto ao número riscado.

## Análise — a ideia é boa para essa audiência?

**Resumo: sim, mas a execução importa muito mais que a ideia.** Ancoragem de preço + escassez é uma das técnicas mais testadas de conversão — mas justamente por ser conhecida, o "nível de consciência alto" da audiência faz com que ela funcione **quando parece verdade e falha quando parece manipulação**.

### O que funciona a favor
- **Percepção de valor real:** o evento entrega conteúdo denso (o "manual" de astrologia aplicada). Âncorar isso em R$197 dá um número concreto ao valor do conteúdo, em vez de deixá-lo abstrato. Para quem é cético, "vale R$197 e está R$0" comunica a proposta antes do clique.
- **Escassez credível:** "máximo 400 pessoas" é um limite plausível para uma sala ao vivo (não um "só 3 vagas restantes" que soa falso). Audiência consciente aceita capacidade real de sala muito mais que falsa urgência de estoque.
- **Reduz o risco percebido:** "grátis + vaga limitada" convida a garantir o lugar sem custo — baixa fricção, decisão fácil.

### O risco
- **Âncora fabricada:** se a audiência perceber o R$197 como um "preço inventado só para riscar", o efeito inverte — o usuário sente que está sendo "ludibriado" e a credibilidade (o maior ativo desta página) cai. É o risco clássico em públicos alertas.
- **Não matar o gancho:** a promessa do hero é "sem misticismo, sem decoreba, 100% prático". Um anúncio de preço agressivo demais pode soar comercial e conflitar com essa voz honesta.

### Recomendação de execução
1. **Framear como "VALOR DO EVENTO", não "preço do produto":** em vez de um preço solto, deixe claro que R$197 é o valor de referência do conteúdo que ele recebe grátis hoje. Isso transforma a âncora em comunicação de valor, não em "desconto fake".
2. **Escassez real e discreta:** manter "máximo 400 pessoas" (capacidade da sala), sem contadores de "restam N" que pareçam truque.
3. **Tom consistente:** dourado + serifado suave, sem elementos de "urgenzinha" (sem vermelho, sem "ÚLTIMAS VAGAS" gritado). Luxo em vez de pressa.

Se a âncora for apresentada assim, ela **fortalece** a percepção de valor e conversão sem ferir a confiança. Se virar um "preço fake riscado", o efeito é negativo justamente no público que a página mais quer converter.

## Técnico

- Alteração restrita a `src/routes/index.tsx`, no bloco do hero (após o botão, antes da linha do cadeado).
- Sem novas dependências; reutiliza tokens existentes (`text-gold`, `text-muted-foreground`, `font-display`, `font-body`).
- Classes de riscado: `line-through text-muted-foreground/70`; destaque `text-gold font-extrabold`.
