# Ecossistema ZUNGA — estudo de referência Sbzee

## Referências públicas consultadas
- [Sbzee — site oficial](https://sbzee.com/)
- [Sbzee — Google Play](https://play.google.com/store/apps/details?id=com.jvfpl.sbzee)
- [Sbzee — App Store](https://apps.apple.com/us/app/sbzee/id6752216196)
- [Política de privacidade](https://sbzee.com/privacy-policy/)
- [Termos](https://sbzee.com/terms.html)
- [Sbzee Captain](https://apps.apple.com/in/app/sbzee-captain/id6810197717)
- [Sbzee EV Cart](https://play.google.com/store/apps/details?id=com.neosprintindia.sbzee.evkart)
- [JVFPL — modelo de fornecimento e distribuição](https://jvfpl.co/sbzeeapp.html)

A análise é baseada em descrições e imagens públicas, não na inspeção do código, nem no acesso às áreas privadas dos aplicativos.

## Aprendizados
Sbzee organiza a compra de frescos por comunidades residenciais, fornecedores selecionados e horários de entrega. A experiência comercial utiliza categorias, fotografias, preços claros, quantidades, cesto, promoções, acompanhamento e apoio. Os parceiros e operadores de entrega dispõem de aplicativos próprios; Captain contempla inventário, entregas e vendas presenciais. A operação utiliza seleção e preparação de produtos e distribuição local. Não há evidência pública suficiente para reconstruir todos os processos internos.

## Adaptação para Angola
ZUNGA é um marketplace de bancadas, não uma cópia do modelo indiano. Preserva a escolha de produtores, vendas a retalho e compras empresariais, e a taxa de exposição proposta. Não promete entrega diária sem capacidade operacional. Deve validar zonas de cobertura, custos, prazos, qualidade e regras de reembolso antes de operar.

| Área | V0.5 | Evolução |
|---|---|---|
| Cliente | Feed, categorias, carrinho, endereços, checkout, pedidos, apoio | Conta real, pagamento local, notificação, avaliação |
| Produtor | Bancada, catálogo, inventário, pedidos e campanhas demo | Verificação, reservas de stock, vendas, faturação, exposição |
| Empresa | Compras, cotações e painel demo | Fornecedores, RFQ, propostas, negociação e compras a grosso |
| Logística | Preferência de entrega ou levantamento | Cobertura, cotação, preparação, expedição, rastreio e prova de entrega |
| Administração | Ainda não implementada | Moderação, verificação, qualidade, suporte e disputas |

## Dois aplicativos — arquitetura proposta
- ZUNGA: cliente final. Interface simples com cinco abas.
- ZUNGA Negócios (nome provisório): produtor e comprador empresarial. Navegação e permissões dependem do tipo de conta.
- Um backend partilhado, com autenticação, autorização no servidor e políticas de segurança por linha; não confiar no seletor de perfil.
- Entidades: profiles, businesses, stalls, products, inventory, addresses, carts, orders, order_items, order_events, quotes, campaigns, support_requests.
- Compras devem ser agrupadas por vendedor, reservar stock atomicamente, manter eventos de estado e calcular totais no servidor. Pagamentos e entrega devem ter estados separados.
- Preparar módulos de domínio partilhados e interfaces separadas antes de criar dois pacotes de aplicação.
- Logística inicialmente no portal de negócios/admin; uma aplicação de estafeta poderá ser avaliada depois.

## Próximos passos
1. Rever V0.5 em telemóvel e melhorar acessibilidade e imagens.
2. Completar experiência empresarial e separar módulos.
3. Ligar Supabase Auth, PostgreSQL e Storage com RLS.
4. Migrar carrinhos, pedidos e inventário para o servidor, implementar reservas e auditoria.
5. Validar fluxo operacional e pagamentos em ambiente de teste.
6. Separar aplicações cliente/negócios; manter APIs e dados comuns.
7. Integrar publicidade Meta somente com autorização e orçamento; nenhuma campanha real nesta fase.
