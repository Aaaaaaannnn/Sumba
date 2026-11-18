<div align="center">

# 🌱 ZUNGA

**Do campo ao mercado.**

Marketplace agrícola digital para Angola — conectando produtores, consumidores e empresas.

![Versão](https://img.shields.io/badge/vers%C3%A3o-0.16.0-123c2c)
![Estado](https://img.shields.io/badge/estado-prot%C3%B3tipo-f4a340)
![Plataforma](https://img.shields.io/badge/plataforma-Web%20responsiva-326846)

**Africa Builds Tech 2026 · Agricultura e inclusão digital**

</div>

## Visão

A ZUNGA pretende reduzir a distância entre a produção agrícola e os compradores, facilitar a descoberta de fornecedores e criar oportunidades de comercialização para agricultores angolanos. O foco inicial é a Huíla, com expansão prevista para as restantes províncias.

## Para quem é?

| Perfil | Funcionalidades do protótipo V16 |
|---|---|
| Cliente | Entrada e registo demo, preferências, tutorial, feed fotográfico com modos de visualização, perfis de bancadas, cesta básica, categorias, carrinho, checkout em três etapas, endereços, favoritos, encomendas agrupadas, recompra, apoio e comprovativos PDF |
| Produtor | Registo demo, painel operacional, perfil comercial com capa e avatar, inventário, anúncios ativos/pausados, quantidade mínima, pedidos, subscrições, estatísticas, campanhas e comprovativos |
| Empresa | Registo empresarial demo, painel, fornecedores, compras, cotações, subscrição, estatísticas, campanhas e comprovativos |
| Administração | Painel local, moderação, revisão de campanhas, configuração de preços, despacho, auditoria e comprovativos |
| Entregador | Painel, entregas atribuídas, aceitação, recolha, transporte, conclusão e comprovativos |

## Bancadas digitais

Cada produtor pode experimentar a gestão da sua bancada local: nome comercial, tipo de produtor, descrição, foto de perfil, capa independente, localização, contacto, horário, modalidade de entrega e catálogo. O painel mostra a percentagem de preenchimento e permite pré-visualizar o perfil apresentado aos clientes.

## Modelo de negócio proposto

A V0.8 introduz subscrições mensais demonstrativas e gestão de campanhas, com preços iniciais **hipotéticos, não aprovados comercialmente** e editáveis na Administração.

| Perfil | Plano | Preço mensal indicativo |
|---|---|---:|
| Produtor | Demonstração | 0 Kz |
| Produtor | Exposição | 5.000 Kz |
| Produtor | Exposição Pro | 12.000 Kz |
| Empresa | Essencial | 0 Kz |
| Empresa | Empresa Pro | 7.500 Kz |

- Taxa mensal de exposição de bancada e catálogo.
- Destaques e ferramentas profissionais propostos.
- Orçamento de publicidade Meta separado da subscrição; rascunhos, revisão administrativa e links UTM.
- Logística futura com custo e remuneração a definir; não há cobrança ativa.
- Não há checkout de subscrição real, renovação, ativação de benefícios pagos, publicação automática de anúncios ou cobrança. As métricas financeiras são valores locais solicitados/projetados, nunca receitas recebidas.

## Estado do projeto — V0.11.0 (demo) + V0.12.0 (fundação real preparada)

| Área | Estado |
|---|---|
| Interface adaptada a telemóveis e computadores | Protótipo implementado |
| Feed em Blocos/Fila, descrição opcional e microanimações | Implementados localmente |
| Cesta Básica, sete produtos de exemplo | Catálogo demonstrativo, fotografias ilustrativas |
| Carrinho multibancada e checkout em três etapas | Implementados localmente |
| Confirmação e histórico de encomendas agrupadas | Implementados localmente |
| Endereços, entrega/levantamento e preferências de horário | Simulação local, sem logística ativa |
| Cupão de teste, histórico, recompra e apoio | Implementados localmente; sem cobrança ou envio |
| Cinco perfis com navegação independente | Protótipo implementado |
| Entrada, registo e login do cliente | Demonstração local; sem credenciais reais |
| Preferências e tutorial guiado | Implementados localmente |
| Perfis de bancadas vistos pelo cliente | Página dedicada com capa, avatar e catálogo |
| Fotografias do catálogo e onboarding | Wikimedia Commons; imagens ilustrativas |
| Catálogo, fotografias e bancadas | Registos locais |
| Entrada e registo do produtor | Demonstração local |
| Perfil comercial, capa, avatar e dados de atendimento | Implementados localmente |
| Inventário, pausa de anúncios e stock por unidade | Implementados localmente |
| Quantidade mínima e validação de stock nos pedidos | Implementadas localmente |
| Pesquisa por palavras-chave, região, categoria, preço e stock | Implementada localmente |
| Recomendações e indicadores | Calculados a partir de dados locais |
| Pedidos e acompanhamento de estados | Simulação local, sem GPS |
| Atalhos Bancadas, Promoções e Favoritos; categorias sem duplicação | Implementados no cliente |
| Entrada, registo e perfil da empresa | Demonstração local |
| Diretório de fornecedores, filtros de stock e fornecedores guardados | Implementados localmente |
| Cotações empresariais, respostas do fornecedor e aceitação de proposta | Fluxo demonstrativo local, sem contrato |
| Promoções e links UTM | Rascunhos locais |
| Subscrições, preços e histórico | Simulação local, sem cobrança |
| Estatísticas comerciais e gráficos de seis meses | Calculados com operações locais |
| Gestão e revisão de campanhas | Fluxo demo, não publicado |
| Comprovativos digitais PDF | Disponíveis após operações e no arquivo; sem validade fiscal |
| Relatórios de estatísticas | Excel (.xlsx), Word (.docx), PDF e CSV, gerados localmente |
| Navegação e retorno | Barra inferior fixa, rolagem independente e histórico interno |
| Administração e despacho | Área demo, sem permissões reais |
| Entregador e estados de entrega | Fluxo local, sem GPS ou prova de identidade |
| Autenticação e permissões | Pendente |
| Base de dados e armazenamento partilhados | Pendente |
| Pagamentos, faturação e integração Meta | Pendente |
| Rastreamento logístico real | Pendente |

**Importante:** a V10 é um protótipo navegável. Os dados fictícios são identificados como exemplos e os dados introduzidos pelo utilizador ficam no navegador. Trocar de perfil não equivale a autenticação. Não existem transações reais nem comunicação entre dispositivos.

## Evolução do ecossistema

A referência pública estudada foi o [Sbzee](https://sbzee.com/): comércio de frescos, compras por localização, carrinho, entregas programadas, apoio e operações de parceiros. Ver [estudo e arquitetura proposta](docs/ecossistema.md). A ZUNGA mantém marca, bancadas e modelo de exposição próprios.

- **ZUNGA:** aplicação de consumo.
- **ZUNGA Negócios:** área de produtores e empresas.
- **ZUNGA Administração:** área restrita futura, para gestão, moderação, finanças e logística.
- **ZUNGA Entregas:** área de entregadores e acompanhamento operacional.

As quatro aplicações previstas deverão partilhar um backend com autorização real no servidor. Atualmente são cinco perfis demonstrativos num único protótipo. Os acessos diretos apenas selecionam a interface; não criam aplicações independentes nem concedem privilégios reais.

| Ambiente | Acesso de demonstração |
|---|---|
| Cliente | [Abrir](https://zunga.stivenluanda04.workers.dev/?app=client&v=0110) |
| Produtor | [Abrir](https://zunga.stivenluanda04.workers.dev/?app=business&v=0110) |
| Empresa | [Abrir](https://zunga.stivenluanda04.workers.dev/?app=company&v=0110) |
| Administração | [Abrir](https://zunga.stivenluanda04.workers.dev/?app=admin&v=0110) |
| Entregador | [Abrir](https://zunga.stivenluanda04.workers.dev/?app=courier&v=0110) |

## V0.12.0 — Fundação real, ainda não ativada

A interface demonstrativa V0.11 continua intacta e disponibiliza um acesso à nova área em `/real/`. O código da V0.12 prepara:
- autenticação Supabase por email/palavra-passe, confirmação, recuperação e logout;
- onboarding de cliente, fornecedor ou empresa, aceitação de termos piloto e perfil persistente;
- esquema PostgreSQL para perfis, bancadas e empresas, com RLS e grants por coluna para proteger o papel e o proprietário;
- avatares privados em Storage e diretório de bancadas publicadas;
- configuração desativada por defeito, sem dados fictícios e sem credenciais de serviço.

**Bloqueio:** não existe projeto Supabase dedicado ZUNGA na organização ligada. Os projetos existentes não foram alterados. Para ativar, escolher uma organização, criar projeto dedicado sem custos adicionais, aplicar e testar `supabase/setup-v012.sql`, configurar Auth/SMTP e publicar a área real em origem HTTPS separada do demo. Ver [procedimento e matriz de testes](docs/fundacao-real.md). Testes reais de RLS, autenticação e sincronização entre dispositivos ainda pendentes.

## Arquitetura atual

- HTML, CSS e JavaScript, sem bibliotecas externas; fotografias ilustrativas carregadas da Wikimedia Commons.
- Persistência local através de localStorage.
- GitHub para controlo de versões.
- Cloudflare Workers Static Assets para alojamento.
- Supabase Free previsto para autenticação, PostgreSQL, armazenamento e políticas de acesso.

```text
Zunga/
├── public/
│   ├── index.html     # Aplicação servida pela Cloudflare
│   └── photo-credits.html # Créditos e licenças das fotografias
├── index.html         # Entrada alternativa sincronizada
├── wrangler.jsonc     # Configuração de publicação
├── README.md          # Apresentação e documentação atual
├── CHANGELOG.md       # Histórico de versões
└── AGENTS.md          # Regras de manutenção e desenvolvimento
```

## Executar e testar

Abra `public/index.html` num navegador ou utilize um servidor HTTP local.

```bash
python -m http.server 8000 --directory public
```

Depois aceda a `http://localhost:8000`. Na primeira utilização, explore como visitante ou entre com a conta de teste `demo@zunga.test` e a palavra-passe demonstrativa `ZungaDemo123!`. Para criar uma conta simulada, use um email fictício terminado em `.test` e a mesma palavra-passe demo. Não use dados ou credenciais reais. Nenhuma palavra-passe é persistida. No perfil do cliente, entre na Área de negócios para testar Produtor ou Empresa. O seletor permanece nessas áreas. Para o produtor, entre com `produtor@zunga.test` e `ZungaDemo123!`, ou crie uma conta de teste com email `.test`. Crie um produto como produtor, troque para cliente e experimente os pedidos locais.

Para publicar através da Cloudflare, use a branch `main`, sem comando de build, e o comando `npx wrangler deploy`. Endereço de teste fornecido pelo responsável: [zunga.stivenluanda04.workers.dev](https://zunga.stivenluanda04.workers.dev/). A versão V0.11.0 pode ser identificada no rodapé do feed e na meta tag zunga-version. A publicação desta versão ainda não foi confirmada.

## Roadmap

1. **V0.1.0 — concluído:** primeiro catálogo agrícola e publicação inicial.
2. **V0.2.0 — concluído:** experiência multi-perfil, bancadas, catálogo, pesquisa, painéis e simulações.
3. **V0.3.0 — concluído no código:** sessão do cliente, onboarding, registo demo, preferências, tutorial e perfil visual das bancadas.
4. **V0.4.0 — concluído no código:** sessão do produtor, identidade da bancada, inventário, indicadores e promoção local.
5. **V0.5.0 — concluído no código:** experiência de compras inspirada no Sbzee, carrinho e checkout local.
6. **V0.6.0 — concluído no código:** simplificação do feed, visualização em Blocos ou Fila, animações leves, cesta básica e fluxo de compra organizado.
7. **V0.6.1 — concluído no código:** refinamento de movimento, fades, cantos squircle e renomeação de Empilhados para Fila.
8. **V0.6.2 — concluído no código:** cartões com botão Comprar, preço e ação alinhados, fotografias arredondadas nos quatro cantos e animações mais visíveis.
9. **V0.7.0 — concluído no código:** atalhos de descoberta do cliente, categorias sem seleção duplicada, área empresarial e fluxo de cotações fornecedor–empresa.
10. **V0.7.1 — concluído no código:** seletores próprios da ZUNGA em toda a aplicação.
11. **V0.8.0 — concluído no código:** subscrições, estatísticas, gestão de anúncios, comprovativos PDF, administração e entregas em demonstração.
12. **V0.9.0 — concluído no código:** navegação estável, botão Voltar e retorno do navegador, organização profissional, comprovativos contextuais e relatórios multi-formato.
13. **V0.10.0 — concluído no código:** gráficos e relatórios por período, fichas, perfis, galeria, mensagens, avaliações e termos demo.
14. **V0.12.0 — preparado no código:** fundação de Auth, perfis, bancadas, empresas e RLS; ativação dependente de projeto dedicado e testes reais.
14. Base de dados partilhada, armazenamento de fotografias e segurança por linha.
15. Pedidos, stock, cotações e estatísticas persistentes.
16. Monetização, moderação e integração de campanhas.
17. Logística, rastreamento e evolução para PWA.

Para testar compras: no Início, alterne Blocos/Fila e ative Mostrar descrição. Abra Cesta Básica, adicione produtos de duas bancadas, revise o carrinho, escolha o recebimento, reveja o resumo e confirme. O cupão fictício `ZUNGADEMO` (5%) está disponível na revisão. O histórico agrupa os produtos por compra. Não há pagamentos nem envio ao fornecedor.

A navegação usa transições horizontais de 480 ms; cartões entram com movimento e fade de 480 ms durante a rolagem, fotografias têm fade de 650 ms, e os controlos de quantidade usam 320 ms. As janelas abrem em 520 ms. O modo Fila tem fotografias arredondadas nos quatro cantos, com clipping e alternativa para navegadores sem squircle. O botão Comprar fica junto ao preço em Fila e numa linha compacta nos Blocos em ecrãs estreitos. Após a compra, transforma-se em controlos de quantidade. O feed mantém a posição e evita reconstrução integral ao alterar quantidades. A preferência de movimento reduzido continua respeitada.

## Testar o fluxo de negócios

No perfil do cliente, selecione Empresa e entre com `empresa@zunga.test` e `ZungaDemo123!`. Consulte fornecedores, guarde uma bancada, crie uma cotação (por exemplo, Arroz, 3 sacos, destino Lubango) e abra-a. Pode simular uma proposta de catálogo compatível. Mude para Produtor, entre na área Cotações e responda com preço unitário e prazo. Volte à Empresa, compare as propostas e aceite uma delas. Todos os registos ficam no mesmo navegador. Aceitar uma proposta não cria um contrato, não reserva stock e não gera pagamento.

No Início do cliente, os acessos Bancadas, Promoções e Favoritos ficam imediatamente abaixo da pesquisa. Categorias mostra apenas um seletor; após escolher uma categoria, aparece uma opção de voltar a todas.

## Seletores da ZUNGA (V0.7.1)

Os campos de seleção usam um painel próprio da ZUNGA: bottom sheet no telemóvel, janela no computador, pesquisa em listas longas, opção atual destacada e animação de entrada/saída. Os valores continuam associados aos formulários e filtros existentes. O controlo HTML original é preservado para dados e compatibilidade, não sendo aberto pelo toque quando a interface personalizada está disponível. Aplica-se a cliente, fornecedor e empresa.

## Testar operações V0.8

1. Como produtor, selecione um plano demo, consulte estatísticas, crie uma campanha e envie-a para revisão.
2. Em Administração, aprove a campanha em demonstração ou altere os preços propostos. Pode ocultar/restaurar produtos.
3. Crie um produto na bancada local, faça uma compra de teste como cliente com entrega e endereço fictício. No fornecedor, avance o pedido até Em preparação.
4. Em Administração > Entregas, atribua o pedido ao entregador. Em Entregador > Entregas, aceite, confirme recolha e conclusão. O estado do pedido é atualizado no mesmo navegador.
5. Descarregue os PDFs em Comprovativos, na confirmação ou nos detalhes dos pedidos. Cliente, fornecedor e empresa têm documentos das operações correspondentes ao perfil. Os PDFs são registos demonstrativos, sem validade fiscal, assinatura digital ou prova de pagamento.

Use sempre o mesmo navegador e origem para a demonstração do fluxo entre perfis. Não introduza informações reais: não existe autenticação, isolamento de dados, faturação, pagamento, GPS ou comunicação entre dispositivos.

## Navegação e relatórios V0.9

- Cliente: Início, Categorias, Carrinho, Pedidos, Perfil.
- Fornecedor: Painel, Catálogo, Pedidos, Dados, Plano, Mais.
- Empresa: Painel, Compras, Pedidos, Dados, Plano, Mais.
- Administração: Painel, Moderação, Entregas, Negócio, Mais.
- Entregador: Painel, Entregas, Histórico, Mais.

A área Mais reúne funções secundárias, como cotações, publicidade, fornecedores, perfil e arquivo. Os comprovativos continuam acessíveis junto de cada operação comercial e na confirmação, quando existe documento correspondente. Entregas concluídas têm histórico separado. A barra inferior mantém a posição e apenas o conteúdo da aplicação rola no telemóvel. O botão Voltar recupera o ecrã anterior e posição de rolagem; o retorno do navegador usa uma entrada de histórico e trata primeiro os seletores, janelas, onboarding e checkout. No início, o retorno seguinte pode sair normalmente. O histórico é mantido durante a sessão, não é persistente após fechar o navegador.

Em Dados, fornecedor e empresa podem gerar relatórios Excel (.xlsx), Word (.docx), PDF e CSV. Os ficheiros Office usam pacotes Open XML sem bibliotecas externas; os números no Excel são valores numéricos. Incluem indicadores, evolução de seis meses, pedidos detalhados, campanhas, cotações e inventário para fornecedor. Não são relatórios fiscais. A validação automatizada simulou navegação e verificou dados e estrutura dos ficheiros; a abertura em aplicações Office reais, download no Android e a posição da barra ainda precisam de teste visual em dispositivo.

## V0.10 — dados e colaboração

### Estatísticas e relatórios
Fornecedor, empresa, administração e entregador têm acesso a Dados. Períodos: hoje, últimos sete dias, mês atual, dois, três, seis e doze meses (incluindo o mês atual). Tipos: barras, linhas, área e circular. O gráfico circular distribui por estado ou tipo de visualização. Os restantes mostram evolução temporal. Pedidos são filtrados pela criação e entregas pela atribuição; estados são atuais. Eventos de visualização com data começam na V0.10; contagens anteriores permanecem acumuladas. Gerar relatório abre escolha Excel, PDF, Word ou CSV. Excel e Word incluem uma imagem do gráfico e dados editáveis, PDF inclui gráfico vetorial e CSV contém só dados. Não são métricas financeiras reais.

### Fichas operacionais
- Fornecedor: armazenagem, entradas, saídas, inventário e expedição.
- Empresa: receção, entradas, saídas, inventário e armazenagem.
- Entregador: recolha, transporte, entrega e ocorrências.
- Administração: inspeção, ocorrências e auditoria; consulta de fichas locais.
As fichas manuais podem ser editadas e exportadas em PDF, Excel e Word. Não atualizam stock, não substituem guias legais, documentos fiscais ou prova de entrega.

### Comunicação e reputação
Cliente tem aba Chat; os restantes perfis têm acesso por Mais e pelo ícone no cabeçalho. Mensagens e pedidos de operador são locais. O assistente responde por regras simples sobre catálogo, pedidos e pagamentos, e pode encaminhar à fila local. Não há modelo de IA nem entrega de mensagens entre aparelhos. Fornecedor ou administração podem assumir as conversas elegíveis.

Avaliações de 1 a 5 estrelas com comentário são associadas às operações concluídas, com avaliação recíproca dos participantes elegíveis. A área profissional mostra avaliações relevantes completas, a administração revê e pode aprovar ou ocultar. Bancadas apresentam apenas testemunhos favoráveis aprovados, explicitamente identificados como seleção, sem representar a distribuição total. O cliente pode consultar as próprias avaliações. Não existe verificação de identidade real.

### Perfis, galeria e termos
Todos os perfis podem editar nome, email fictício, localização, bio e fotografia. Fornecedor pode adicionar até quatro imagens de 350 KB e um vídeo MP4/WebM até 15 MB, armazenado localmente em IndexedDB. Não há upload para servidor. Termos demo 1.0 exigem concordância no registo e são consultáveis no perfil; contas de acesso rápido continuam demonstrativas. O filtro de palavras é uma heurística limitada, com ocorrências locais para revisão, não moderação abrangente. Termos e política de privacidade definitivos requerem revisão antes de lançamento.

## V0.10.1 — janelas e navegação

As janelas de detalhes, endereços, formulários, comprovativos e seletores fecham com um toque no fundo escurecido, no botão de retorno/fecho com ícone SVG ou no retorno do telefone. Toques dentro da janela e gestos iniciados no conteúdo não acionam o fecho pelo fundo. A animação de saída e a preferência de movimento reduzido são preservadas. Campos não guardados numa janela dispensada não são gravados. Validação de eventos simulada; teste visual e gestual no Android ainda pendente.

## V0.10.2 — perfil, modais e avaliações

- Cliente: um único cartão de identidade e uma única entrada Alterar tipo de acesso, que abre a escolha de ambientes demonstrativos. Compras, preferências, avaliações, comprovativos, apoio e privacidade estão agrupados. Limpeza de dados em opções avançadas.
- Perfis profissionais: escolha de ambiente apenas no seletor do cabeçalho; dados pessoais e comerciais distintos. Removida a repetição de acessos em Mais e no perfil.
- Modais e seletores fecham ao tocar no fundo, sem fechar quando se toca dentro do conteúdo. O formulário de endereço aberto a partir da lista regressa à lista. Controlos de retorno usam SVG.
- Avaliar fornecedor está disponível na bancada e nos pedidos concluídos. Estrelas selecionáveis por toque e comentário, com edição da avaliação existente. Quando não há encomenda concluída, a opinião de conta demo é marcada como não verificada, não sendo publicada como testemunho. As entidades envolvidas e a administração têm acesso às avaliações correspondentes; o cliente consulta as que escreveu.
- Testes simulados de toque dentro/fora, retorno da lista de endereços, perfil sem duplicação, avaliações verificadas e não verificadas. Deploy e teste visual Android ainda pendentes.

## V0.11.0 — experiência visual e dados de demonstração

- Dez bancadas fictícias de várias províncias, 25 produtos fixos de exemplo e três produtos de teste para a bancada local.
- Onze fotografias novas de Wikimedia Commons, créditos em `public/photo-credits.html`. São ilustrativas e não identificam os fornecedores fictícios.
- Destaque editorial no Início, cartões de bancada com capa, descoberta horizontal de produtores, transições de conteúdo, microinterações e respeito à preferência de movimento reduzido. A barra inferior não é animada.
- Conjunto inicial: 37 pedidos, 21 avaliações, 18 mensagens, 16 entregas concluídas, seis cotações e respetivas propostas, três campanhas, três fichas e 90 eventos de visualização. Diretório de oito identidades fictícias; perfis vazios de empresa, entregador e administração preenchidos com exemplos.
- Os registos de exemplo são identificados por IDs e marcações próprias. Perfil do cliente > Ambiente de teste > Dados de demonstração permite carregar ou remover exemplos. Carregar novamente não duplica IDs; a remoção preserva registos manuais e as suas dependências. Bancadas fixas e dados de perfil permanecem.
- Validação simulada de referências, carregamento sem duplicação, remoção, feed, comentários, estatísticas e diretório. Fotografias remotas, transições e deploy ainda necessitam de confirmação em navegador real.
- Não há novas contas autenticadas, mensagens entre dispositivos, transações reais ou pagamentos. Os dados e testemunhos são fictícios.

## Fotografias e licenças

As fotografias são ilustrativas, provenientes de Wikimedia Commons e não representam agricultores verificados. Ver [créditos](public/photo-credits.html). O carregamento depende da disponibilidade da Wikimedia; a transferência para alojamento próprio fica para uma etapa futura.

## Desenvolvimento e documentação

Cada alteração funcional deve atualizar este README quando modificar as funcionalidades, arquitetura, estado ou roadmap e registar as mudanças no [CHANGELOG](CHANGELOG.md). Consulte [AGENTS.md](AGENTS.md) para o procedimento de manutenção.

O objetivo é manter custos iniciais de desenvolvimento e alojamento dentro dos planos gratuitos, sujeitos aos limites dos serviços utilizados.

---

**ZUNGA · Do campo ao mercado · Angola 🇦🇴**


### Fundação real — atualização 18/11/2026
Projeto dedicado Zunga `asxyjhaujsowmdrpkcqc` conectado. Migração inicial aplicada; perfis, bancadas, empresas e bucket de avatares privado existem, RLS ativo. Chave pública configurada, ativação da interface bloqueada até origem HTTPS dedicada e configuração Auth. Ver [guia](docs/fundacao-real.md). Dados comerciais continuam demonstrativos.


## V0.13 — Comércio e armazém demonstrativos

- Preço por quantidade: até dois escalões opcionais definidos pelo produtor, aplicados à quantidade inteira; os produtos fictícios do catálogo também têm escalões demonstrativos.
- Carrinho: cálculo com preço unitário por escalão, cupão demonstrativo e estimativa de entrega por bancada (1 500 Kz no mesmo município, 3 500 Kz noutro município da mesma província, 8 000 Kz entre províncias). Valores fictícios, não são tarifas reais.
- Reservas: novas encomendas reduzem a disponibilidade; cancelamento antes da preparação, sem entrega atribuída, repõe o stock uma única vez. Encomendas anteriores não são recalculadas.
- Compras B2B: uma cotação aceite pode originar uma única encomenda, se o produto, fornecedor, unidade, quantidade e stock forem compatíveis. O preço negociado fica registado.
- Armazém: disponível, reservado e total em mãos por produto, entradas, saídas, histórico e bloqueio de stock negativo. Acesso em Fornecedor > Mais > Armazém.
- Comprovativos: preços unitários, descontos, cancelamentos e estimativa de transporte registados localmente.

Validação: sintaxe JavaScript e 21 verificações de lógica em ambiente simulado. Ficheiros `index.html` e `public/index.html` sincronizados. Sem pagamentos, sincronização de stock entre dispositivos, tarifas reais, contagem física, autenticação real ou migrações adicionais nesta versão. Teste visual em navegador e confirmação da publicação continuam pendentes.


## V0.14 — Armazéns e cancelamento

- Cancelar compra diretamente nos cartões de pedidos do cliente e cancelar pedido nos painéis profissionais. Inclui pedidos anteriores à V0.13, filtro Cancelados e confirmação por motivo. Permite cancelar até à preparação, sem entrega atribuída; não devolve stock de pedidos antigos sem reserva comprovada.
- Armazém do fornecedor: múltiplas localizações, lotes, classificação de stock existente, entradas, saídas, perdas, transferências, alertas a 7 dias e limite de reposição demonstrativo de 5 unidades de venda.
- Novas reservas usam primeiro os lotes vendáveis de validade mais próxima; lotes vencidos ficam excluídos do stock vendável, inclusive validação do checkout. Cancelamento repõe as alocações. Bloqueio de expedição de reservas vencidas; administração pode retirar atribuição antes da recolha.
- Fichas de movimentos de lote e sem lote geradas no mesmo registo de stock; exportação PDF, Excel e Word, arquivo e fichas operacionais. Fichas manuais continuam sem alterar stock. Ajustes diretos de catálogo não substituem movimentações de lote.
- Dados antigos mantidos, sem migrações Supabase nem autenticação real. Armazéns e lotes desta fase pertencem à bancada local do fornecedor; inventário independente de empresas e contabilização de receções ficam pendentes.
- Sintaxe e 19 verificações de lógica no DOM simulado da versão final. HTML público e raiz sincronizados; deploy e teste real em Android ainda por confirmar.


## V0.15.0 — Administração e logística profissional (demo)

- Administração: gestão pesquisável de encomendas, central de apoio com resposta e encerramento, auditoria local e indicadores operacionais.
- Logística: três entregadores fictícios, disponibilidade, atribuição e reatribuição, janela e instruções, filtros, ocorrências e resolução administrativa.
- Entregador: seleção explícita de identidade demo, tarefas e histórico separados, confirmação manual de recolha e entrega. Comprador consulta o histórico nos detalhes.
- Estados e apoio ficam neste navegador; não há GPS, prova real, autenticação, notificações externas ou pagamentos. A base Supabase não foi alterada.
- Validação: análise sintática dos scripts e 10 testes de transição (incluindo lote vencido, ocorrência aberta, cancelamento e conclusão duplicada). Teste visual/deploy pendentes.


## V0.16.0 — Centro de controlo avançado (protótipo)

- Painel ADM transversal: catálogo, utilizadores e bancadas, fluxo de encomendas, stock e armazéns, tesouraria simulada e auditoria.
- Parâmetros aplicados ao protótipo: cor principal/destaque, cantos, movimento, destaque da loja, aviso global, disponibilidade de novas compras B2C/B2B, novas entregas e publicação, valor mínimo, cupão, três tarifas de entrega e alertas de inventário.
- Administração pode verificar/suspender entidades de demonstração, ocultar produtos, editar preço e mínimo, ajustar stock não reservado sem afetar lotes, avançar e cancelar pedidos antes da recolha respeitando reservas e despacho. Verificação de pessoas fictícias é apenas uma etiqueta local.
- Repartição financeira simulada: comissão, processamento deduzido do fornecedor, parcela logística, líquido por fornecedor, marcação de liquidação de pedidos novos concluídos e exportação Excel. Regras fixadas nos novos pedidos; pedidos antigos são estimativas, sem liquidação. Nenhuma cobrança, custódia ou transferência real.
- Exportação de parâmetros JSON, auditoria Excel, motivo obrigatório e restauro de parâmetros padrão. Sem execução de código arbitrário, sem alteração do Supabase e sem serviços externos.
- Validação: sintaxe de scripts, 28 testes unitários de parâmetros, repartição e guardas de estados, 30 pontos de integração textual; teste de navegador e publicação ainda pendentes. A administração continua demonstrativa, não é autorização real.

- Complemento de validação: 12 testes de integração de tarifas, permissões locais de inventário, snapshot financeiro e suspensão. A administração também cria armazéns, regista e movimenta lotes, edita categoria/descrição e apresenta etiqueta de verificação demo; movimento desligado também no JavaScript. Sem teste visual real.
