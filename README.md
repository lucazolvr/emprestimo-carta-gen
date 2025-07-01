# Gerador de Cartas de Consignado

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Uma aplicação web robusta desenhada para automatizar e otimizar a criação de cartas de confirmação para empréstimos consignados. A ferramenta lê propostas em formato PDF, extrai os dados relevantes de forma inteligente e gera um documento final formatado, pronto para ser utilizado, eliminando erros manuais e acelerando o fluxo de trabalho.

![Captura de Tela da Aplicação](https://i.imgur.com/fg5oUf3.png)

## 🌟 Funcionalidades Principais

* **Extração Inteligente de Dados:** Carregue um ficheiro PDF e a aplicação extrai automaticamente informações cruciais como nome do cliente, CPF, RG, valores do empréstimo, prazos e número da proposta.
* **Sistema de Convênios Dinâmico:** Gerencie múltiplos convênios (empregadores) de forma centralizada. O sistema seleciona automaticamente o modelo de carta correto com base no CNPJ encontrado no PDF.
* **Geração de PDF Profissional:** Cria documentos PDF com um layout limpo e profissional, utilizando alinhamento justificado, secções em negrito e dados posicionados corretamente para uma apresentação impecável.
* **Pré-visualização Instantânea:** Permite que o utilizador reveja todo o conteúdo da carta em texto simples antes de se comprometer com a geração do PDF final, garantindo a precisão dos dados.
* **Interface Moderna e Intuitiva:** Um design minimalista e focado na usabilidade, que guia o utilizador através do processo de três passos simples: carregar, gerar e descarregar.

## 🚀 Stack Tecnológico

A aplicação foi construída com um conjunto de tecnologias modernas e eficientes:

* **Frontend:** [React](https://react.dev/) com [TypeScript](https://www.typescriptlang.org/) para uma base de código robusta e escalável.
* **Build Tool:** [Vite](https://vitejs.dev/) para um ambiente de desenvolvimento extremamente rápido.
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) para uma estilização rápida e customizável.
* **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) como base para componentes reutilizáveis.
* **Processamento de PDF (Leitura):** [PDF.js](https://mozilla.github.io/pdf.js/) da Mozilla para uma extração de texto confiável.
* **Geração de PDF (Escrita):** [jsPDF](https://github.com/parallax/jsPDF) para a criação de documentos PDF no lado do cliente.

## 🛠️ Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar a aplicação no seu ambiente de desenvolvimento.

**Pré-requisitos:**
* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

**1. Clone o repositório:**
```bash
git clone [https://github.com/lucazolvr/emprestimo-carta-gen.git]
cd [emprestimo-carta-gen]
```
**2. Instale as dependências:**
```bash
npm install
```
**3. Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

A aplicação estará disponível em http://localhost:5173 (ou outra porta indicada no seu terminal).

⚙️ **Configuração e Customização**

A aplicação foi projetada para ser facilmente extensível.

Adicionar um Novo Convênio

Para adicionar um novo empregador ou modelo de carta:

    Abra o arquivo src/types/index.ts.

    Encontre a constante LETTER_TEMPLATES.

    Adicione um novo objeto ao array, seguindo a estrutura existente:
```bash
export const LETTER_TEMPLATES: LetterTemplate[] = [
  // ... outros convênios
  {
    id: '3', // Use um ID único
    name: 'NOME DO NOVO CONVÊNIO',
    cnpj: '00.000.000/0001-00', // CNPJ exato que será lido do PDF
    signatory: 'Nome do Responsável pela Assinatura',
    signatoryRole: 'Cargo do Responsável',
    signatoryCpf: '123.456.789-00',
  },
];
```
O sistema usará o campo cnpj para selecionar automaticamente este modelo quando um PDF correspondente for processado.