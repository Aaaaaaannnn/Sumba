<div align="center">

# 🌱 ZUNGA

**Do campo ao mercado.**

Marketplace agrícola digital para Angola — conectando produtores, consumidores e empresas.

![Versão](https://img.shields.io/badge/vers%C3%A3o-0.2.0-123c2c)
![Estado](https://img.shields.io/badge/estado-prot%C3%B3tipo-f4a340)
![Plataforma](https://img.shields.io/badge/plataforma-Web%20responsiva-326846)

**Africa Builds Tech 2026 · Agricultura e inclusão digital**

</div>

## Visão

A ZUNGA pretende reduzir a distância entre a produção agrícola e os compradores, facilitar a descoberta de fornecedores e criar oportunidades de comercialização para agricultores angolanos. O foco inicial é a Huíla, com expansão prevista para as restantes províncias.

## Para quem é?

| Perfil | Funcionalidades do protótipo V2 |
|---|---|
| Cliente | Feed, ofertas, recomendações locais, pesquisa, favoritos, bancadas, pedidos e indicadores de compras |
| Produtor | Painel operacional, gestão de catálogo e stock, fotografias, pedidos, perfil da bancada e rascunhos de campanhas |
| Empresa | Painel de compras, pesquisa de fornecedores, cotações, acompanhamento de pedidos e perfil empresarial |

## Bancadas digitais

Cada produtor poderá gerir uma bancada com identificação, descrição, fotografia, localização, contacto e catálogo. A versão atual permite experimentar estas operações localmente.

## Modelo de negócio proposto

- Taxa de exposição de produtos e bancadas, com preço ainda por definir.
- Opções de destaque e promoção de produtos.
- Divulgação através de anúncios Facebook e Instagram com links diretos para a plataforma.
- Futuras ferramentas empresariais e serviços logísticos.

A V2 gera links com parâmetros UTM e permite preparar rascunhos de campanhas. Não efetua cobranças nem compra anúncios. A publicidade paga depende de orçamento próprio.

## Estado do projeto — V0.2.0

| Área | Estado |
|---|---|
| Interface adaptada a telemóveis e computadores | Protótipo implementado |
| Três perfis com navegação independente | Protótipo implementado |
| Catálogo, fotografias e bancadas | Registos locais |
| Pesquisa por palavras-chave, região, categoria, preço e stock | Implementada localmente |
| Recomendações e indicadores | Calculados a partir de dados locais |
| Pedidos e acompanhamento de estados | Simulação local, sem GPS |
| Cotações empresariais | Rascunhos locais |
| Promoções e links UTM | Rascunhos locais |
| Autenticação e permissões | Pendente |
| Base de dados e armazenamento partilhados | Pendente |
| Pagamentos, faturação e integração Meta | Pendente |
| Rastreamento logístico real | Pendente |

**Importante:** a V2 é um protótipo navegável. Os dados fictícios são identificados como exemplos e os dados introduzidos pelo utilizador ficam no navegador. Trocar de perfil não equivale a autenticação. Não existem transações reais nem comunicação entre dispositivos.

## Arquitetura atual

- HTML, CSS e JavaScript, sem dependências de execução externas.
- Persistência local através de localStorage.
- GitHub para controlo de versões.
- Cloudflare Workers Static Assets para alojamento.
- Supabase Free previsto para autenticação, PostgreSQL, armazenamento e políticas de acesso.

```text
Zunga/
├── public/
│   └── index.html     # Aplicação servida pela Cloudflare
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

Depois aceda a `http://localhost:8000`. Utilize o seletor de perfil para testar Cliente, Produtor e Empresa. Crie um produto como produtor, troque para cliente e experimente os pedidos locais.

Para publicar através da Cloudflare, use a branch `main`, sem comando de build, e o comando `npx wrangler deploy`. O endereço público definitivo será documentado quando confirmado.

## Roadmap

1. **V0.1.0 — concluído:** primeiro catálogo agrícola e publicação inicial.
2. **V0.2.0 — concluído:** experiência multi-perfil, bancadas, catálogo, pesquisa, painéis e simulações.
3. **Próxima etapa:** autenticação Supabase e perfis com permissões reais.
4. Base de dados partilhada, armazenamento de fotografias e segurança por linha.
5. Pedidos, stock, cotações e estatísticas persistentes.
6. Monetização, moderação e integração de campanhas.
7. Logística, rastreamento e evolução para PWA.

## Desenvolvimento e documentação

Cada alteração funcional deve atualizar este README quando modificar as funcionalidades, arquitetura, estado ou roadmap e registar as mudanças no [CHANGELOG](CHANGELOG.md). Consulte [AGENTS.md](AGENTS.md) para o procedimento de manutenção.

O objetivo é manter custos iniciais de desenvolvimento e alojamento dentro dos planos gratuitos, sujeitos aos limites dos serviços utilizados.

---

**ZUNGA · Do campo ao mercado · Angola 🇦🇴**
