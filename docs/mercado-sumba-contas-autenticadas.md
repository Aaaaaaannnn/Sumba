# SUMBA — catálogo e contactos de contas autenticadas

As funcionalidades desta etapa funcionam **exclusivamente na conta autenticada por Supabase Auth**, em `https://zunga-auth.stivenluanda04.workers.dev/`. O marketplace de demonstração em `zunga.stivenluanda04.workers.dev` continua separado e sem capacidade de concluir compras para visitantes.

## O que é persistido no servidor

- `sumba_products`: produtos registados por produtores com bancada própria, incluindo categoria, unidade, preço indicativo, stock, mínimo e publicação.
- `sumba_cart_items`: cesto privado de clientes e empresas, guardado no Supabase e associado ao utilizador.
- `sumba_inquiries`: contactos reais de clientes/empresas com produtores sobre produtos e quantidades, com estado e resposta.
- `sumba_inquiry_messages`: mensagens persistentes entre quem solicitou e o fornecedor correspondente.

**Não existem dados artificiais criados nesta migração.** Os catálogos começam vazios e só aparecem ofertas publicadas por contas de produtores autorizadas.

As tabelas têm **Row Level Security** por proprietário e permissões explícitas: visitantes e contas anónimas não podem ler ou modificar estes dados. Um comprador não pode alterar o destinatário, produto ou outros campos de um pedido depois de submetido, e um produtor não pode alterar os pedidos de outros fornecedores.

## Como utilizar

1. Entrar com OTP/Google na SUMBA, criar o perfil e escolher **Cliente**, **Produtor agrícola** ou **Empresa**.
2. Produtor: preencher e publicar a bancada, depois acrescentar produtos no Mercado SUMBA com preços e stock.
3. Cliente/empresa: consultar os produtos publicados, guardar quantidades no cesto e contactar o fornecedor.
4. Fornecedor: consultar os pedidos recebidos e responder. Cliente/empresa: abrir o contacto e acompanhar mensagens.
5. O tutorial é mostrado na primeira entrada de cada perfil autenticado, gravando o progresso no Supabase.

**Limites atuais:** este módulo **não** executa encomendas definitivas, pagamentos por Multicaixa Express, cobranças, faturação fiscal, entregas, reserva de stock ou logística. Essas operações precisam de integração segura com fornecedores autorizados e testes completos antes de se tornarem disponíveis. A etiqueta «pedido ao fornecedor» significa pedido de informação/contacto, não uma compra concluída.

## Segurança e validação

Implementação SQL: `supabase/sql/sumba_live_market_v1.sql`.
Aplicado no projeto Supabase associado `asxyjhaujsowmdrpkcqc` (sem eliminar tabelas existentes).

Validações feitas por SQL após aplicar a migração:
- As quatro tabelas têm RLS ativo com 4, 4, 3 e 2 políticas.
- `anon` não tem acesso de leitura a produtos ou mensagens.
- `authenticated` tem acesso apenas à atualização das colunas `status` e `response` dos pedidos, não a `buyer_id`.

Testes automatizados em `tests/sumba-live-market.test.cjs` cobrem isolamento de dados, ausência de dados demonstrativos e renderização de estados vazios. Falta validar com **duas contas reais diferentes** (um produtor e um comprador), em dispositivos separados, para confirmar transições, mensagens e as restrições RLS de ponta a ponta.

## Próximas integrações

Encomendas reais com atomicidade de stock, reconciliação de pagamentos, notificação de pedidos e mensagens, avaliações verificadas, entrega, faturação, denúncia/moderação de produtos e gestão do comerciante. Só serão descritas como operacionais após validação.
