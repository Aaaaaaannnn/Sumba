# Histórico de versões — ZUNGA

Todas as alterações relevantes do projeto serão registadas neste ficheiro.

## [0.4.0] — 2026-11-17

### Adicionado
- Entrada e registo demonstrativo de produtor, com configuração inicial da bancada.
- Perfil comercial com fotografia de perfil e capa independentes, contacto, endereço, horário, modalidade de entrega e pré-visualização.
- Indicador de completude do perfil.
- Painel com produtos ativos, visualizações locais, pedidos em curso, valor entregue simulado e stock agrupado por unidade.
- Inventário com pesquisa, filtros, pausa/ativação de anúncios, ajuste de stock e alerta de stock baixo.
- Quantidade mínima por pedido, data opcional de colheita e validação de disponibilidade.
- Painel de promoções com rascunhos, orçamento planeado e links UTM.

### Validação
- Sintaxe JavaScript validada.
- Testes simulados de entrada, registo, configuração, login válido/inválido, perfil, painel, catálogo, exclusão de produtos pausados do mercado, promoções e preservação das interfaces Cliente/Empresa.
- Entradas HTML sincronizadas.
- Teste real de navegador, envio de fotografias e publicação Cloudflare ainda por confirmar.

### Limitações
- Contas, produtos e pedidos são locais ao navegador; sem autenticação real ou isolamento entre utilizadores.
- Taxa de exposição por definir, sem pagamento, sem publicação de campanhas Meta e sem métricas externas.
- Não existe rastreamento GPS nem confirmação de receita financeira.

## [0.3.0] — 2026-11-17

### Adicionado
- Entrada do cliente, três telas de introdução, login e registo em três passos com dados fictícios.
- Sessão demonstrativa, visitante, recuperação simulada e edição de preferências.
- Tutorial guiado em cinco passos com destaque, dedo, opção de saltar e repetição pelo perfil.
- Feed personalizado por categorias e localização, fotografias ilustrativas e categorias visuais.
- Página de perfil da bancada para o cliente: capa, avatar, localização, catálogo e partilha.
- Créditos e licenças das fotografias.

### Validação
- Sintaxe JavaScript validada.
- Testes simulados: entrada, etapas de registo, login válido/inválido, feed com fotografias, perfil de bancada, tutorial, painéis de produtor/empresa e pesquisa.
- Entradas HTML sincronizadas; publicação e teste completo em navegador por confirmar.

### Limitações
- Não existe autenticação real. O registo utiliza email fictício .test e palavra-passe demo fixa, não persistida.
- Dados guardados localmente; sem recuperação real por email, pagamentos, GPS ou comunicação entre dispositivos.
- Fotografias externas de Wikimedia Commons são ilustrativas, não imagens verificadas dos vendedores. Carregamento real no navegador ainda por confirmar.
- Área do produtor/empresa preservada; edição de capa e perfil completo da bancada pelo produtor fica para a próxima etapa.

## [0.2.0] — 2026-11-17

### Adicionado
- Navegação responsiva com áreas Cliente, Produtor e Empresa.
- Feed de ofertas, recomendações e favoritos.
- Bancadas individuais com localização, fotografia, descrição e catálogo.
- Pesquisa por palavras-chave e filtros de categoria, localização, preço e stock.
- Indicadores calculados a partir dos dados locais de cada perfil.
- Gestão de produtos e fotografias pelo produtor.
- Simulação de pedidos e acompanhamento por estados.
- Rascunhos de cotações empresariais.
- Rascunhos de campanhas e links diretos com parâmetros UTM.
- README atualizado e regras de manutenção.

### Alterado
- Interface anterior substituída por uma experiência de aplicação.
- Ficheiros index.html da raiz e public sincronizados.

### Validação
- Sintaxe JavaScript validada.
- Teste simulado da renderização dos três painéis, perfil empresarial, catálogo e pesquisa.
- Testes completos em navegador e publicação da V2 ainda por confirmar.

### Limitações
- Dados e permissões exclusivamente locais e demonstrativos.
- Sem pagamentos reais, integração Meta ativa, base de dados partilhada ou GPS.
- Dados da V1 não são migrados automaticamente para a V2.

## [0.1.0] — 2026-11-17

### Adicionado
- Catálogo inicial de produtos agrícolas.
- Pesquisa, filtros e formulário de anúncios locais.
- Contacto WhatsApp quando o vendedor fornece um número válido.
- Configuração do Cloudflare Workers Static Assets.

### Validação
- Primeiro deploy Cloudflare concluído, conforme captura fornecida pelo responsável do projeto.
