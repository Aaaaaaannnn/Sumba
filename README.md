<div align="center">

# SUMBA
**Do campo à sua mesa.**

Marketplace agrícola digital de Angola — protótipo demonstrativo responsivo.

</div>

## 1. O que é a Sumba?

A **Sumba** é uma proposta de plataforma de comércio agrícola que aproxima produtores, bancadas, consumidores e empresas. A aplicação permite descobrir produtos por categoria e localização, conhecer fornecedores, simular pedidos, organizar compras e experimentar as ferramentas operacionais de diferentes perfis. O foco inicial do estudo é a província da Huíla, com possibilidade de expansão nacional.

Este repositório reúne a **experiência demonstrativa principal** e um **piloto técnico separado de autenticação**. Os dois ambientes não devem ser confundidos.

**Estado para avaliação (20/11/2026):** protótipo navegável, alimentado maioritariamente por dados fictícios, sem cobranças reais, sem contratos comerciais ou operações logísticas ativas. Algumas funcionalidades técnicas Supabase estão preparadas em ambiente piloto, mas dependem de configuração e validação operacional.

## 2. Como experimentar

**Sem instalar nada:** aceder à publicação atual, enquanto a migração de domínio não for concluída:

- [Abrir demonstração](https://zunga.stivenluanda04.workers.dev/)
- [Cliente](https://zunga.stivenluanda04.workers.dev/?app=client)
- [Produtor](https://zunga.stivenluanda04.workers.dev/?app=business)
- [Empresa](https://zunga.stivenluanda04.workers.dev/?app=company)
- [Administração de demonstração](https://zunga.stivenluanda04.workers.dev/?app=admin)
- [Entregas de demonstração](https://zunga.stivenluanda04.workers.dev/?app=courier)

Os endereços acima identificam **o ambiente antigo**, preservado para compatibilidade até validar `sumba.stivenluanda04.workers.dev`. A atualização do código no GitHub não confirma que a versão publicada no Cloudflare já mudou.

**Percurso recomendado para os avaliadores:**

1. Abrir a página inicial e explorar o carrossel, categorias, pesquisas e bancadas.
2. Entrar no perfil do cliente com uma conta **simulada** ou navegar como visitante. Não utilizar palavras-passe pessoais.
3. Adicionar produtos ao carrinho, criar outros **cestos**, mudar entre eles e separar produtos por bancada.
4. Finalizar **um único cesto**, escolher levantamento ou entrega fictícia e introduzir, se desejado, um NIF inventado de 10 algarismos.
5. No pagamento, selecionar **Multicaixa Express (simulação)**, introduzir um número fictício no formato `9XXXXXXXX` e observar a mudança automática do estado pendente para aprovado **sem pedido bancário**. Em alternativa, usar pagamento na entrega simulado.
6. Consultar **Pedidos** para ver histórico, detalhes, estados e opções demonstrativas de cancelamento/recompra; experimentar os perfis Produtor e Empresa.
7. Aceder à área de ajuda e tutoriais do próprio protótipo.

**Aviso:** os dados de teste ficam no armazenamento local do navegador. Não são sincronizados entre dispositivos. Limpar os dados do site pode apagar os cestos e pedidos simulados.

## 3. Funcionalidades por perfil

| Perfil | O que é possível demonstrar |
| --- | --- |
| Cliente | Catálogo, filtros, fornecedores, favoritos, vários cestos, quantidades mínimas, checkout em etapas, NIF fictício, pagamentos simulados, pedidos, cancelamentos elegíveis, avaliações, mensagens de exemplo e notificações locais |
| Produtor | Bancada digital, catálogo, disponibilidade, mínimos de venda, gestão de stock, pedidos, campanhas e relatórios demonstrativos |
| Empresa | Diretório de fornecedores, cotações, negociação de exemplo, compras, estatísticas e documentos simulados |
| Administração | Interface demonstrativa de moderação, operações, relatórios e configuração; não representa permissões reais |
| Entregador | Atribuição e acompanhamento fictícios de entregas e respetivo histórico |

Uma área de **autenticação real em desenvolvimento** encontra-se em `public/real/`. Usa Supabase Auth, configurações de email e estruturas de administração e notificações, mas não é a sessão utilizada na demonstração principal. A autenticação real requer URLs de redirecionamento e fornecedores corretamente configurados e **não é pré-requisito** para avaliar a aplicação principal.

## 4. Tecnologias e organização

A demonstração é uma aplicação web **HTML, CSS e JavaScript nativos**, sem framework de interface ou etapa de compilação. O site usa fotografias ilustrativas, SVG local da identidade Sumba e armazenamento `localStorage` para operações de teste.

| Componente | Papel |
| --- | --- |
| HTML/CSS/JavaScript | Interface responsiva, navegação, lógica demonstrativa de carrinho, cestos e pedidos |
| Cloudflare Workers + Static Assets | Publicação estática da demonstração e de um Worker separado de autenticação |
| GitHub + GitHub Actions | Código-fonte, revisão e fluxo de publicação manual |
| Supabase | Projeto técnico associado: Auth, PostgreSQL/RLS, Edge Functions e notificações do piloto |
| Brevo | Serviço previsto/configurado para envio de email do piloto; não utilizado para emitir emails na demo |
| Wikimedia Commons | Origem de diversas fotografias ilustrativas; ver `public/photo-credits.html` |

**Ficheiros importantes:**

- `public/index.html`: página principal publicada pelo Cloudflare; `index.html` é cópia sincronizada.
- `public/assets/sumba-icon.svg`: logótipo da Sumba.
- `public/real/`: área piloto de autenticação real, separada do funcionamento demo.
- `wrangler.jsonc`: Worker antigo `zunga`, mantido por compatibilidade.
- `wrangler.sumba.jsonc`: configuração de publicação **paralela** futura sob o nome `sumba`.
- `wrangler.auth.jsonc`: Worker de autenticação legado, não renomeado até validação.
- `supabase/`: SQL e templates de email do piloto.
- `tests/`: testes de contrato e consistência.
- `docs/`: arquitetura, autenticação e procedimento de migração.
- `CHANGELOG.md`: histórico de desenvolvimento, separado deste guia.

## 5. Como executar localmente

**Pré-requisitos:** navegador moderno e Python 3 ou outro servidor de ficheiros estáticos. Node.js é necessário apenas para os testes.

```bash
git clone https://github.com/Aaaaaaannnn/Zunga.git
cd Zunga
python3 -m http.server 8000 --directory public
```

Abrir **http://localhost:8000/**. O servidor deve servir o diretório `public` como raiz: abrir o ficheiro via `file://` pode falhar em rotas e recursos absolutos. Não é necessário configurar Supabase ou Brevo para a experiência demonstrativa.

**Verificações locais:**

```bash
node --test tests/sumba-v022.test.cjs tests/sumba-cestos-pagamento.test.cjs
node tests/auth-contract.mjs
node scripts/test-sumba-auth-runtime.mjs
```

Os testes do piloto de autenticação verificam contratos de código; **não** demonstram que OAuth, SMTP, envio de mensagens ou autorização bancária funcionam num ambiente real. Alguns testes de autenticação herdados podem exigir alinhamento com as configurações de fornecedores antes de passarem integralmente.

## 6. Dados, segurança e limitações

- O login, a criação de conta, os pedidos, os pagamentos, os comentários e outras ações da **demonstração principal** não criam transações externas nem comprovam identidade.
- Os cestos e o histórico ficam no `localStorage`. O NIF e o telefone fictícios **não são enviados a qualquer banco**; a simulação guarda somente os últimos algarismos necessários para identificação ilustrativa, quando aplicável.
- A aprovação automática do pagamento é **exclusivamente uma simulação local**; não existe ligação operacional ao Multicaixa Express neste percurso.
- A aplicação não oferece, neste momento, garantia de disponibilidade de fornecedores, inventário, rastreio real, faturação fiscal ou compensação financeira.
- Os perfis demo de administração e entregas não são contas com privilégios de produção.
- A segurança do piloto Supabase depende de autenticação no servidor, RLS, segredos privados e testes independentes. Nenhuma chave de serviço deve ser colocada no frontend.

## 7. Publicação e mudança do nome

**Marca oficial:** Sumba. O identificador técnico antigo `Zunga` continua temporariamente no repositório, em alguns nomes de `localStorage` e nos endereços do Worker para **não quebrar integrações nem perder dados guardados**.

A mudança segura é faseada: preparar o Worker `sumba` em paralelo; testar a nova URL; atualizar allowlists e ligações GitHub/Cloudflare/Supabase/Brevo; só então renomear o repositório no GitHub e aposentar a URL antiga, com possibilidade de reversão. O projeto Supabase pode continuar com o mesmo ID e credenciais.

Consultar **[Guia de migração de Zunga para Sumba](docs/migracao-zunga-sumba.md)**. Não alterar o nome do Worker de autenticação sem testar os redirecionamentos e configurações de Auth.

## 8. Próximos passos

Passar gradualmente do protótipo para uma operação real com autenticação validada, pedidos e inventário partilhados, autorização por perfil, pagamentos reais através de prestador autorizado, reconciliação de webhooks, faturação, logística e testes de ponta a ponta. Essas funcionalidades só serão consideradas concluídas depois de integração, testes e validação.

## 9. Histórico resumido

As melhorias recentes abrangeram identidade e logótipo, experiência responsiva, carrossel, múltiplos perfis demonstrativos, autenticação piloto, notificações, cestos separados e pagamento de teste. O histórico detalhado de cada alteração permanece em **[CHANGELOG.md](CHANGELOG.md)**.
