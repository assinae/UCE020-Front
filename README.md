# Assinaê Front

Frontend organizado com Next.js, Tailwind CSS e Material UI.

## Tecnologias Utilizadas

- **Next.js 16** - Framework React com App Router
- **React 19** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Framework CSS utilitário
- **Material UI v9** - Biblioteca de componentes React
- **Geist Fonts** - Fontes otimizadas da Vercel

---

# Estrutura do Projeto

```txt
src/
├── app/                  # Rotas e páginas da aplicação (App Router)
│
├── components/           # Componentes reutilizáveis globais
│   ├── ui/               # Componentes genéricos reutilizáveis
│   ├── modals/           # Modais compartilhados
│   ├── event/            # Componentes relacionados a eventos
│   └── certificate/      # Componentes relacionados a certificados
│
├── features/             # Organização por domínio/feature
│   ├── auth/
│   ├── event/
│   ├── home/
│   ├── landing-page/
│   └── user-profile/
│
├── hooks/                # Hooks customizados do React
├── lib/                  # Configurações globais (tema, bibliotecas, etc.)
├── providers/            # Providers de contexto
├── services/             # Camada de comunicação com API
├── types/                # Tipagens TypeScript
├── utils/                # Funções utilitárias
└── constants/            # Constantes globais
```

---

# Arquitetura do Projeto

O projeto segue uma arquitetura baseada em:

- **Next.js App Router**
- **Arquitetura orientada a features**
- **Componentização modular**
- **Separação clara de responsabilidades**

---

# Estrutura da pasta `app/`

A pasta `app/` representa as rotas da aplicação utilizando o App Router do Next.js.

## Grupos de Rotas (Route Groups)

O projeto utiliza **Route Groups**:

```txt
(private)
(public)
(auth)
```

Pastas entre parênteses:

- servem apenas para organização
- NÃO aparecem na URL final

Exemplo:

```txt
app/(private)/home/page.tsx
```

gera a rota:

```txt
/home
```

---

## Rotas privadas

```txt
app/(private)/
├── certificate/
├── event/
├── home/
└── user-profile/
```

Essas rotas compartilham:

```txt
app/(private)/layout.tsx
```

Utilizado para conter as rotas de visualização interna do sistema.

---

## Rotas públicas

```txt
app/(public)/
├── (auth)/
└── landing-page/
```

Utilizado para conter as rotas de visualização externa do sistema.

### `(auth)`

Agrupa páginas relacionadas à autenticação.

Exemplos:

```txt
login/
register/
forgot-password/
```

---

# Padronização de Nomes

O projeto segue uma convenção de nomenclatura consistente.

## Pastas → `kebab-case`

```txt
certificate
landing-page
forgot-password
```

## Arquivos → `PascalCase`

```txt
ScheduleCard.tsx
TextInput.tsx
CertificateForm.tsx
```

### Observação

Arquivos `page`, `layout` e `index` permanecem em minúsculo.

---

# Separação de Responsabilidades

## `app/`

Responsável por:

- rotas
- layouts
- páginas
- navegação

---

## `components/`

Responsável por:

- componentes reutilizáveis
- UI compartilhada
- elementos visuais globais

---

## `features/`

Responsável por:

- regras de negócio
- organização por domínio
- lógica específica da aplicação

Cada feature pode conter:

```txt
components/
hooks/
services/
types/
schemas/
utils/
```

---

# Padrões Arquiteturais Utilizados

## Arquitetura Orientada a Features

Organização baseada em domínio:

```txt
features/event
features/auth
features/user-profile
```

Isso facilita:

- escalabilidade
- desacoplamento
- manutenção
- modularização

---

## Componentização

Separação entre:

| Tipo | Local |
|---|---|
| UI genérica | `components/ui` |
| Componentes de domínio | `components/event` |
| Regras de negócio | `features/*` |

---

## Layouts Compartilhados

Uso de:

```txt
layout.tsx
```

para compartilhamento de:

- headers
- sidebars
- providers
- estilos globais

---

# Primeiros Passos

## Versão do Node

Este projeto utiliza a versão `26.0.0` do Node.js definida no arquivo `.nvmrc`.

Se você utiliza `nvm`, execute:

```bash
nvm use
```

Caso não utilize um gerenciador de versões, instale o Node.js `26.0.0` antes de executar a aplicação.

---

## Instalar dependências

```bash
npm install
```

---

## Copiar variáveis de ambiente

```bash
cp .env.example .env.local
```

---

## Executar servidor de desenvolvimento

```bash
npm run dev
```

Abra no navegador:

```txt
http://localhost:3000
```

---

# Variáveis de Ambiente

Consulte o arquivo `.env.example` para visualizar as variáveis disponíveis:

- `NEXT_PUBLIC_API_URL` - URL base da API
- `NEXT_PUBLIC_APP_NAME` - Nome da aplicação
- `NEXTAUTH_SECRET` - Chave secreta do NextAuth

---

# Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a build de produção |
| `npm start` | Inicia o servidor em produção |
| `npm run lint` | Executa o ESLint |

---

# Saiba Mais

- Documentação do Next.js
- Documentação do Tailwind CSS
- Documentação do Material UI
- Documentação do TypeScript

---

# Deploy na Vercel

A forma mais simples de realizar o deploy da aplicação Next.js é utilizando a plataforma da Vercel.
