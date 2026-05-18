# Timeline — Calendário inteligente

Sistema web moderno e minimalista de organização pessoal focado em datas importantes, compromissos e eventos futuros. Inspirado em **Linear**, **Notion Calendar**, **Apple Calendar**, **TickTick** e **Cron**.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **TailwindCSS** com tema dark premium
- **Framer Motion** para animações fluidas
- **lucide-react** ícones
- **date-fns** (pt-BR)

Persistência atual: `localStorage` por trás de uma camada de serviço (`services/events.ts`). Trocar por **Supabase** ou **Firebase** depois é uma única substituição — toda a UI consome `useEvents` que chama `eventsService`.

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Estrutura

```
app/                 # rotas (App Router)
components/          # UI features + ui/ primitives
hooks/               # useEvents, useNow
lib/                 # utils (date, categorias, cn)
services/            # camada de dados (swappable)
types/               # tipos compartilhados
```

## Funcionalidades (MVP)

- Saudação dinâmica (bom dia / boa tarde / boa noite)
- Resumo do dia (total, pendentes, concluídos)
- Card de próximo evento com countdown
- Prioridade do dia
- Timeline vertical com destaque para HOJE, atrasados e urgentes
- Calendário mensal com indicadores por categoria
- Criar / editar / excluir / concluir compromisso
- Categorias com cor, prioridades (normal / importante / urgente)
- Busca instantânea
- Dark mode premium, responsivo desktop / tablet / mobile
- Animações Framer Motion discretas

## Próximos passos (preparado para)

- Autenticação + Supabase (substituir `services/events.ts`)
- Notificações push / WhatsApp
- Integração Google Calendar
- Recorrência
- Resumo semanal por IA
- Anexos

## Paleta

- Background `#0f1115`
- Cards `#181b22`
- Accent `#6C63FF`
- Texto `#F5F7FA` / `#9BA3AF`
