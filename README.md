# Biblioteca de Música Litúrgica

Uma aplicação web responsiva para gerenciar e exibir partituras de música litúrgica, otimizada para dispositivos desktop e móveis.

## Funcionalidades

- **Funcionalidade de Pesquisa**: Pesquise por compositor, título, estilo musical, tipo litúrgico e nível musical
- **Construtor de Missa**: Selecione múltiplas partituras para compilar uma Missa completa
- **Exportação PDF**: Exporte seleções compiladas como um único documento PDF
- **Links de Áudio**: Cada partitura inclui um link de áudio associado para audição
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e dispositivos móveis
- **Acessibilidade**: Construído com padrões de acessibilidade em mente

## Começando

### Pré-requisitos

- Node.js 18 ou posterior
- npm ou yarn

### Instalação

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/seuusuario/biblioteca-musica-liturgica.git
cd biblioteca-musica-liturgica
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

3. Execute o servidor de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Construindo para Produção

Para construir a aplicação para produção:

\`\`\`bash
npm run build
\`\`\`

Isso criará uma build otimizada no diretório \`out\`, pronta para implantação no GitHub Pages.

## Implantação no GitHub Pages

Este projeto está configurado para implantação automática no GitHub Pages usando GitHub Actions.

1. Faça push do seu código para a branch \`main\`
2. O GitHub Action irá automaticamente construir e implantar o site
3. Seu site estará disponível em \`https://seuusuario.github.io/biblioteca-musica-liturgica\`

## Estrutura do Projeto

\`\`\`
src/
├── app/
│   ├── page.tsx          # Componente principal da aplicação
│   ├── layout.tsx        # Layout raiz
│   └── globals.css       # Estilos globais
├── components/ui/        # Componentes shadcn/ui
└── hooks/               # Hooks React customizados
\`\`\`

## Tecnologias Utilizadas

- **Next.js 14**: Framework React com App Router
- **React**: Biblioteca de UI
- **TypeScript**: Segurança de tipos
- **Tailwind CSS**: Framework CSS utility-first
- **shadcn/ui**: Componentes React de alta qualidade
- **Lucide React**: Biblioteca de ícones

## Contribuindo

1. Faça um fork do repositório
2. Crie uma branch de funcionalidade (\`git checkout -b feature/funcionalidade-incrivel\`)
3. Commit suas mudanças (\`git commit -m 'Adiciona alguma funcionalidade incrível'\`)
4. Push para a branch (\`git push origin feature/funcionalidade-incrivel\`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## Sobre a Música Litúrgica

Esta biblioteca contém uma coleção cuidadosamente selecionada de música litúrgica católica, incluindo:

- **Ordinário da Missa**: Kyrie, Gloria, Credo, Sanctus, Agnus Dei
- **Próprio da Missa**: Antífonas, Aleluias, Oferendas
- **Música Mariana**: Ave Maria, Salve Regina, Magnificat
- **Hinos Litúrgicos**: Te Deum, Veni Creator, Pange Lingua
- **Música para Tempos Litúrgicos**: Advento, Natal, Quaresma, Páscoa

### Estilos Musicais Incluídos

- **Canto Gregoriano**: A tradição musical mais antiga da Igreja
- **Polifonia Renascentista**: Palestrina, Victoria, Lassus
- **Música Barroca**: Bach, Vivaldi, Handel
- **Período Clássico**: Mozart, Haydn, Beethoven
- **Música Romântica**: Schubert, Franck, Fauré
- **Música Contemporânea**: Composições modernas para liturgia

Esta aplicação é ideal para:
- Maestros e regentes de coro
- Músicos litúrgicos
- Paróquias e comunidades religiosas
- Estudantes de música sacra
- Pesquisadores de musicologia
\`\`\`
