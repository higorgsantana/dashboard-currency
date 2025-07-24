# 💱 Currency Comparison Dashboard

Dashboard interativo para visualização comparativa de moedas, com gráficos dinâmicos e tema claro/escuro.

![Demo do Projeto](caminho/para/screenshot-ou-gif.gif)

## ✨ Funcionalidades

- Comparação de até 3 pares de moedas simultaneamente
- Gráficos históricos interativos (7, 30 ou 90 dias)
- Tema claro/escuro com persistência
- Layout responsivo
- Dados em tempo real usando a API pública [Frankfurter.app](https://www.frankfurter.app)
- Salvamento das comparações no `localStorage`
- Fallback amigável para erros nos gráficos

## 🧪 Tecnologias

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Chart.js**
- **React Context** para controle de tema
- **localStorage** para persistência de estado
- **API pública Frankfurter** para dados de câmbio

## 📦 Instalação e uso local

```bash
# Clone o projeto
git clone https://github.com/seu-usuario/seu-repo.git

# Acesse a pasta
cd seu-repo

# Instale as dependências
npm install

# Rode em ambiente de desenvolvimento
npm run dev

