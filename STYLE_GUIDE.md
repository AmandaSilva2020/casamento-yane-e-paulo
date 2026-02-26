# Style Guide - Casamento Yane & Paulo

## 1. Objetivo
Este guia define os padrões visuais e de implementação para manter o site consistente e fácil de personalizar.

## 2. Princípios
- Visual romântico, leve e elegante, com base em azul suave e detalhes rosados.
- Componentes com cantos arredondados, gradientes suaves e sombras discretas.
- Mobile-first na prática: layout deve funcionar bem em telas pequenas e grandes.
- Manutenção simples: usar tokens no `:root`, evitando valores literais espalhados.

## 3. Tokens de Design
Todos os tokens ficam em [`styles.css`](./styles.css), no bloco `:root`.

### 3.1 Formato de cor
- Padrão único: triplet `rgb` sem alfa no token.
- Exemplo de token: `--primary: 47 101 136;`
- Uso:
1. Opaco: `color: rgb(var(--primary));`
2. Com transparência: `background: rgb(var(--primary) / 0.2);`

### 3.2 Tokens principais (versão enxuta)
- Neutros: `--white`, `--black`, `--text`, `--muted`
- Base: `--bg`, `--surface`, `--border`
- Marca: `--primary`, `--primary-2`, `--primary-dark`
- Apoio: `--sky`, `--rose`
- Estado e interação: `--success`, `--info`, `--focus`

### 3.3 Tokens de layout
- `--radius`: raio base de componentes.
- `--nav-width`: largura da sidebar desktop.
- `--shadow`: sombra padrão de cards/seções.

## 4. Tipografia
- Fonte base: `Manrope` (texto e UI).
- Fonte de destaque: `Playfair Display` (títulos e momentos especiais).
- Hierarquia:
1. `h1/h2/h3` em `Playfair Display`.
2. Texto corrido e controles em `Manrope`.

## 5. Espaçamento e Forma
- Seções principais: classe `.section` com fundo translúcido, borda e sombra.
- Canto arredondado padrão: usar `var(--radius)` ou variações próximas já existentes.
- Espaçamento deve priorizar leitura: blocos respirando mais em desktop e compactação no `@media`.

## 6. Componentes e Padrões

### 6.1 Botões e CTAs
- Classes base: `.map-btn`, `.gift-btn`, `.rsvp-form button`, `.memories-upload-btn`.
- Gradiente padrão: `primary -> primary-2`.
- Estados: `:hover` com `brightness`, `:active` com deslocamento leve.

### 6.2 Cards
- Estrutura recorrente: borda suave + fundo claro + borda arredondada.
- Exemplos: `.info-card`, `.map-card`, `.story-card`, `.gift-item`.

### 6.3 Formulário RSVP
- Campos com borda suave, label flutuante e foco com `--focus`.
- Estados de disponibilidade são controlados por JS (ex.: ocultar formulário após data limite).

### 6.4 Seções condicionais por data
- Visibilidade controlada por `hidden` + `aria-hidden` em `script.js`.
- Exemplo: `#fotos-casamento`, `#localizacao`, `#rsvp` em fases específicas.

## 7. Responsividade
- Breakpoints ativos:
1. `@media (max-width: 1024px)`
2. `@media (max-width: 860px)`
- Comportamentos-chave:
1. Sidebar vira menu mobile com botão hambúrguer.
2. Grids passam para coluna única.
3. Hero e callouts reduzem densidade visual sem perder legibilidade.

## 8. Movimento e Interação
- Animações suaves e curtas, com foco em elegância.
- Evitar excesso de microanimações.
- Respeitar feedback visual claro para hover/focus/active.

## 9. Acessibilidade
- Preservar `aria-label`, `aria-hidden`, `aria-live` já existentes.
- Manter contraste suficiente entre texto e fundo.
- Não remover foco visível sem substituir por alternativa clara.

## 10. Convenções de Código CSS
- Não usar cor literal fora do `:root`.
- Não misturar formatos de cor no projeto (manter `rgb(var(--token))`).
- Preferir reutilizar classes e tokens existentes antes de criar novos.
- Evitar criar token de seção quando o token core já resolve.
- Só criar token novo se houver necessidade real de identidade diferente.

## 11. Checklist para novas mudanças visuais
1. O valor visual pode ser coberto por token existente?
2. Se criar token novo, ele foi adicionado no `:root`?
3. Foi usado `rgb(var(--token))` (com ou sem alfa)?
4. O layout permanece consistente em `1024px` e `860px`?
5. Estados `hover/focus/active` foram considerados?
