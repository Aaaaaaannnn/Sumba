<div align="center">

# 🌱 ZUNGA

**Do campo ao mercado.**

Marketplace agrícola digital para Angola — conectando produtores, consumidores e empresas.

![Versão](https://img.shields.io/badge/vers%C3%A3o-0.5.0-123c2c)
![Estado](https://img.shields.io/badge/estado-prot%C3%B3tipo-f4a340)
![Plataforma](https://img.shields.io/badge/plataforma-Web%20responsiva-326846)

**Africa Builds Tech 2026 · Agricultura e inclusão digital**

</div>

## Visão

A ZUNGA pretende reduzir a distância entre a produção agrícola e os compradores, facilitar a descoberta de fornecedores e criar oportunidades de comercialização para agricultores angolanos. O foco inicial é a Huíla, com expansão prevista para as restantes províncias.

## Para quem é?

| Perfil | Funcionalidades do protótipo V5 |
|---|---|
| Cliente | Entrada e registo demo, preferências, tutorial, feed fotográfico, perfis de bancadas, categorias, carrinho, checkout, endereços, favoritos, pedidos, recompra e apoio |
| Produtor | Registo demo, painel operacional, perfil comercial com capa e avatar, inventário, anúncios ativos/pausados, quantidade mínima, pedidos e rascunhos de campanhas |
| Empresa | Painel de compras, pesquisa de fornecedores, cotações, acompanhamento de pedidos e perfil empresarial |

## Bancadas digitais

Cada produtor pode experimentar a gestão da sua bancada local: nome comercial, tipo de produtor, descrição, foto de perfil, capa independente, localização, contacto, horário, modalidade de entrega e catálogo. O painel mostra a percentagem de preenchimento e permite pré-visualizar o perfil apresentado aos clientes.

## Modelo de negócio proposto

- Taxa de exposição de produtos e bancadas, com preço ainda por definir.
- Opções de destaque e promoção de produtos.
- Divulgação através de anúncios Facebook e Instagram com links diretos para a plataforma.
- Futuras ferramentas empresariais e serviços logísticos.

A V2 gera links com parâmetros UTM e permite preparar rascunhos de campanhas. Não efetua cobranças nem compra anúncios. A publicidade paga depende de orçamento próprio.

## Estado do projeto — V0.5.0

| Área | Estado |
|---|---|
| Interface adaptada a telemóveis e computadores | Protótipo implementado |
| Carrinho multibancada, quantidades nos cartões, checkout | Implementados localmente |
| Endereços, entrega/levantamento e preferências de horário | Simulação local, sem logística ativa |
| Cupão de teste, histórico, recompra e apoio | Implementados localmente; sem cobrança ou envio |
| Três perfis com navegação independente | Protótipo implementado |
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
| Cotações empresariais | Rascunhos locais |
| Promoções e links UTM | Rascunhos locais |
| Autenticação e permissões | Pendente |
| Base de dados e armazenamento partilhados | Pendente |
| Pagamentos, faturação e integração Meta | Pendente |
| Rastreamento logístico real | Pendente |

**Importante:** a V5 é um protótipo navegável. Os dados fictícios são identificados como exemplos e os dados introduzidos pelo utilizador ficam no navegador. Trocar de perfil não equivale a autenticação. Não existem transações reais nem comunicação entre dispositivos.

## Evolução do ecossistema

A referência pública estudada foi o [Sbzee](https://sbzee.com/): comércio de frescos, compras por localização, carrinho, entregas programadas, apoio e operações de parceiros. Ver [estudo e arquitetura proposta](docs/ecossistema.md). A ZUNGA mantém marca, bancadas e modelo de exposição próprios.

- **ZUNGA:** aplicação de consumo (Início, Categorias, Carrinho, Pedidos, Perfil).
- **ZUNGA Negócios** (nome provisório): aplicação futura de produtores e empresas, com áreas de venda e compras profissionais.
- Ambas deverão partilhar autenticação, dados, catálogo e encomendas, com permissões no servidor.

Por enquanto há um único protótipo: os acessos de teste de Produtor e Empresa ficam no Perfil do Cliente.

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

Para publicar através da Cloudflare, use a branch `main`, sem comando de build, e o comando `npx wrangler deploy`. O endereço público definitivo será documentado quando confirmado.

## Roadmap

1. **V0.1.0 — concluído:** primeiro catálogo agrícola e publicação inicial.
2. **V0.2.0 — concluído:** experiência multi-perfil, bancadas, catálogo, pesquisa, painéis e simulações.
3. **V0.3.0 — concluído no código:** sessão do cliente, onboarding, registo demo, preferências, tutorial e perfil visual das bancadas.
4. **V0.4.0 — concluído no código:** sessão do produtor, identidade da bancada, inventário, indicadores e promoção local.
5. **V0.5.0 — concluído no código:** experiência de compras inspirada no Sbzee, carrinho e checkout local.
6. **Próxima etapa:** aperfeiçoar experiência empresarial, compras a grosso e cotações; preparar separação dos aplicativos e infraestrutura partilhada.
7. Base de dados partilhada, armazenamento de fotografias e segurança por linha.
8. Pedidos, stock, cotações e estatísticas persistentes.
9. Monetização, moderação e integração de campanhas.
10. Logística, rastreamento e evolução para PWA.

Para testar compras: adicione produtos de duas bancadas, abra o carrinho, escolha levantamento ou entrega, experimente o cupão fictício `ZUNGADEMO` (5%) e confirme o pedido local. Não há pagamentos nem envio ao fornecedor.

## Fotografias e licenças

As fotografias são ilustrativas, provenientes de Wikimedia Commons e não representam agricultores verificados. Ver [créditos](public/photo-credits.html). O carregamento depende da disponibilidade da Wikimedia; a transferência para alojamento próprio fica para uma etapa futura.

## Desenvolvimento e documentação

Cada alteração funcional deve atualizar este README quando modificar as funcionalidades, arquitetura, estado ou roadmap e registar as mudanças no [CHANGELOG](CHANGELOG.md). Consulte [AGENTS.md](AGENTS.md) para o procedimento de manutenção.

O objetivo é manter custos iniciais de desenvolvimento e alojamento dentro dos planos gratuitos, sujeitos aos limites dos serviços utilizados.

---

**ZUNGA · Do campo ao mercado · Angola 🇦🇴**
