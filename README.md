<h1 align="center">
Sekai Dragon API 🐉 
</h1>

<p align="center"\>
<img src="https://img.shields.io/badge/Status-Em%20Andamento-yellow" alt="Status do Projeto"\>
<img src="https://img.shields.io/badge/Linguagem%20API-TypeScript-blue" alt="Linguagem da API"\>
<img src="https://img.shields.io/badge/Framework-Node.js-green" alt="Framework"\>
</p\>

## 📜 Sobre o Projeto

O **SekaiDragon** é um ambicioso projeto de Bot de Discord focado em RPG (Role-Playing Game) dinâmico e narrativo. Ele se diferencia por utilizar uma **API de Inteligência Artificial Generativa (IA)** para criar histórias, desafios e reviravoltas únicas em tempo real, garantindo que nenhuma aventura seja igual à outra.

Este repositório (`SekaiDragonAPI`) contém o *backend* essencial em TypeScript/Node.js que gerencia a lógica do jogo, a integração com o banco de dados e a comunicação com os modelos de IA. Ele é o coração que pulsa a vida nas histórias dos jogadores.

### ✨ Visão Geral

  - **Geração de Conteúdo com IA:** Utiliza modelos de IA para gerar narrativas ricas, descrições de ambientes e desafios de combate ou enigma de forma procedural e contextualizada.
  - **RPG Flexível:** Permite aos jogadores interagir com o mundo gerado, tomar decisões que realmente afetam o curso da história e desenvolver seus personagens.
  - **Estrutura Escalável:** Desenvolvido como uma API robusta para garantir alta performance e escalabilidade ao lidar com múltiplos jogos e comandos simultâneos no Discord.

-----

## ✅ Funcionalidades Atuais (API)

A **SekaiDragonAPI** está em fase inicial de desenvolvimento, focada em estabelecer a base de dados e a comunicação com a IA.

| Recurso | Status | Descrição |
| :--- | :--- | :--- |
| **Estrutura de Projeto** | **Concluído** | Configuração inicial em TypeScript, Node.js e estrutura modular (`src/`). |
| **Configuração de Banco de Dados** | **Concluído** | Implementação com **Prisma** (ORM) para modelagem de dados (usuários e personagens). |
| **Integração Básica com IA** | **Concluído** | Configuração da chave e do cliente da API de IA para testes de chamada e resposta. |
| **Esquema de Personagem (Base)** | **Em Andamento** | Definição do *Schema* básico para armazenar informações vitais do personagem (nome, classe, nível). |
| **Comando de Teste** | **Concluído** | Rota ou função de teste que chama a IA com um *prompt* simples para validar a conexão. |

-----

## ⚙️ Tecnologias Utilizadas

A API é construída com tecnologias modernas para garantir robustez e manutenibilidade.

| Categoria | Tecnologia |
| :--- | :--- |
| **Linguagem** | TypeScript |
| **Runtime** | Node.js |
| **ORM** | Prisma |
| **Banco de Dados** | (A definir, mas compatível com Prisma: PostgreSQL, MySQL, SQLite) |
| **API de IA** | Gemini (ou similar, dependendo da sua escolha) |
| **Versionamento** | Git/GitHub |

-----

## 🚀 Próximos Passos (Roadmap)

O futuro do SekaiDragon envolve a expansão das funcionalidades da API e a integração do Bot no Discord para uma experiência completa.

### 🌟 Fase 1: API de Jogabilidade (Prioridade)

  - [ ] **Endpoints de Usuário/Personagem:** Criar rotas para registrar novos jogadores e criar/gerenciar personagens.
  - [ ] **Módulo de Prompt Engineering:** Desenvolver a lógica e os *templates* de *prompt* para garantir que a IA gere histórias e desafios coerentes com o contexto do jogo.
  - [ ] **Sistema de Salve e Progresso:** Implementar a persistência do estado do jogo (história atual, localização, inventário) no banco de dados.
  - [ ] **Endpoints de Ação:** Rotas para enviar ações do jogador para a API, processar o resultado com a IA e retornar o próximo passo da narrativa.

### 🤖 Fase 2: Integração com Discord (Bot Client)

  - [ ] **Configuração do Bot:** Criar o cliente Discord usando `discord.js` ou similar.
  - [ ] **Comandos Básicos:** Implementar `/start` (inicia a aventura), `/perfil` (mostra o personagem), `/ajuda`.
  - [ ] **Comandos de Ação:** Criar comandos que interagem com a API (ex: `/agir [ação]`, `/explorar`, `/combater`).
  - [ ] **Embeds e Interface:** Desenvolver a apresentação visual das narrativas da IA através de *embeds* atraentes do Discord.

### 💡 Fase 3: Recursos Avançados

  - [ ] **Sistema de Inventário:** Gerenciamento de itens e equipamentos.
  - [ ] **Mecânica de Combate:** Integração de rolagens de dados e resolução de combate pela IA.
  - [ ] **Mundo Persistente:** Implementação de um mundo onde as ações dos jogadores afetam o estado global do servidor.

-----

## 🤝 Como Contribuir

Se você gostou da ideia e deseja contribuir com o desenvolvimento da **SekaiDragon API** ou do Bot, siga os passos abaixo:

1.  Faça um **Fork** do projeto.
2.  Crie uma *branch* para sua funcionalidade (`git checkout -b feature/nome-da-feature`).
3.  Faça o *commit* das suas alterações (`git commit -m 'feat: Adiciona nova funcionalidade...'`).
4.  Envie para o *branch* original (`git push origin feature/nome-da-feature`).
5.  Abra um **Pull Request**.

-----

## 🔑 Licença

Distribuído sob a Licença MIT. Veja `LICENSE` para mais informações.

-----

## 📧 Contato

  - **Seu Nick/Nome:** NovachronoXXX
  - **Link do Projeto:** [https://github.com/NovachronoXXX/SekaiDragonAPI](https://github.com/NovachronoXXX/SekaiDragonAPI)
