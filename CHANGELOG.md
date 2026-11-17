# Histórico de versões — ZUNGA

Todas as alterações relevantes do projeto serão registadas neste ficheiro.

## [0.10.1] — 2026-11-17

### Corrigido
- Toque no fundo escurecido fecha janelas e seletores personalizados; toques internos e gestos iniciados no conteúdo não fecham.
- Botão de retorno circular com seta SVG e botão de seleção com ícone SVG de fechar.
- Animação de fecho também no retorno do telefone, com movimento reduzido respeitado.

### Validação
- Sintaxe JavaScript e testes simulados de toque exterior, interior, arrasto, cancelamento e reabertura.
- Entradas HTML sincronizadas; teste em Android e deploy ainda por confirmar.

## [0.10.0] — 2026-11-17

### Adicionado
- Estatísticas para fornecedor, empresa, administrador e entregador; períodos diário, semanal e de 1, 2, 3, 6 e 12 meses, com gráficos de barras, linhas, área e circular.
- Escolha do formato ao gerar relatório; gráficos incorporados em PDF, Excel e Word, CSV só dados.
- Fichas operacionais por perfil, edição, comprovativos e exportação PDF/Excel/Word.
- Chat local entre perfis, respostas automáticas por regras e fila de operador.
- Avaliações recíprocas de participantes de pedidos concluídos, estrelas, comentários, revisão administrativa e testemunhos públicos selecionados.
- Edição de perfil e foto nos cinco perfis, galeria e vídeo de bancada com armazenamento local.
- Termos demo com aceitação no registo, filtro de linguagem e revisão de ocorrências.
- Eventos de visualização datados a partir da V0.10.

### Validação
- Sintaxe JavaScript e testes simulados dos gráficos, filtros por período, estrutura de PDF/Office, fichas, chat, fila, moderação, avaliações, perfis e termos.
- HTML raiz e public sincronizados.

### Limitações
- Assistente por regras, não IA real. Sem comunicação entre dispositivos, autenticação ou autorização real.
- Fichas manuais não alteram stock. Gráficos Office são imagens incorporadas, com tabelas editáveis; CSV não comporta gráficos.
- Vídeos, fotografias e downloads dependem do armazenamento e navegador. Abertura em Office, vídeo, UX em Android e deploy ainda por confirmar.
- Filtro de palavras limitado; avaliações e termos são demonstrativos, não validam identidade nem substituem revisão jurídica ou política de privacidade definitiva.

## [0.9.0] — 2026-11-17

### Alterado
- Barra inferior fixa e independente da rolagem no telemóvel, com altura e área segura reservadas; animação de página sem deslocamento do menu.
- Botão Voltar e histórico interno da sessão, restauração de posição de rolagem, retorno do navegador e tratamento de janelas, seletores, onboarding e checkout.
- Ícones específicos das funções de cada perfil; fornecedor e empresa com abas Dados e Plano, funções secundárias em Mais.
- Painéis comerciais mais compactos, histórico de entregas separado de tarefas pendentes e arquivo de documentos acessível em Mais.
- Comprovativos junto aos pedidos e cotações, e confirmação contextual de subscrição, campanha, proposta, mudança de estado, compra e entrega.
- Relatórios de estatísticas em Excel (.xlsx), Word (.docx), PDF e CSV com indicadores e operações detalhadas.

### Validação
- Sintaxe JavaScript e testes simulados de navegação, retorno do navegador, modais, recuperação de rolagem, abas, ícones, relatórios, dados e comprovativos.
- Verificada a estrutura básica ZIP/Open XML dos relatórios Excel e Word e tratamento de fórmulas em CSV.
- HTML raiz e public sincronizados.

### Limitações
- Teste visual da barra no Android, botão físico no navegador real, abertura em Office e downloads reais ainda por confirmar.
- Histórico interno dura a sessão; a saída a partir do início permanece possível.
- Dados locais demonstrativos; não há autenticação segura, cobranças ou faturação fiscal.
- Publicação Cloudflare V0.9.0 ainda por confirmar.

## [0.8.0] — 2026-11-17

### Adicionado
- Planos mensais demonstrativos de exposição e serviços empresariais, preços iniciais hipotéticos e histórico de subscrições.
- Painéis de estatísticas comerciais, consultas, visitas à bancada, valores solicitados/entregues, cotações e gráfico de seis meses.
- Gestão de campanhas, orçamento, duração, canal, objetivo, revisão administrativa, pausa e links UTM; sem compra de anúncios.
- Comprovativos PDF no navegador para compras, vendas, cotações, seleção de planos, campanhas e entregas concluídas, com aviso de demonstração.
- Administração demo com moderação de produtos, revisão de campanhas, configuração de preços, despacho e atividade.
- Entregador demo com atribuição, aceitação, recolha e conclusão, atualizando o estado do pedido.
- Cinco perfis e URLs de entrada para as quatro futuras aplicações.

### Validação
- Sintaxe JavaScript e testes simulados de subscrições, estatísticas, revisão de campanha, moderação, despacho, entrega e seleção dos documentos por perfil.
- Estrutura PDF testada, incluindo referências xref e múltiplas páginas.
- Entradas HTML sincronizadas.

### Limitações
- Preços propostos não aprovados comercialmente. Não há cobrança, benefícios pagos efetivos, integração Meta ativa, faturação fiscal, autenticação ou autorização real.
- Acesso administrativo é explicitamente demonstrativo e não deve ser usado com dados reais.
- Entregas locais sem GPS, roteamento, remuneração ou prova de identidade.
- Os quatro aplicativos ainda compartilham um único protótipo; a separação física, backend seguro, teste visual e deploy Cloudflare continuam pendentes.

## [0.7.1] — 2026-11-17

### Alterado
- Seletores de escolha única substituídos visualmente por controlos próprios da ZUNGA nos três perfis.
- Bottom sheet mobile e janela desktop com animação, pesquisa em listas longas, seleção destacada e fecho ao tocar fora, cancelar ou selecionar.
- Preservação dos valores e eventos dos formulários HTML, foco acessível e fallback nativo quando o diálogo não é suportado.

### Validação
- Sintaxe JavaScript e testes simulados de abertura, pesquisa sem acento, escolha e eventos input/change, cancelamento, opções desativadas e preservação dos painéis.
- HTML da raiz e public sincronizados.
- Deploy Cloudflare e teste visual em navegador real ainda por confirmar.

## [0.7.0] — 2026-11-17

### Cliente
- Atalhos de Bancadas, Promoções e Favoritos imediatamente abaixo da pesquisa.
- Uma única seleção de categorias; seleção individual com retorno a todas e limpeza de filtros.
- Feed mais curto, sem repetir acessos de promoção e bancadas no final.
- Filtros de província e ordenação sincronizados, com reset ao entrar nas categorias.

### Negócios
- Registo e login empresarial demonstrativos, perfil comercial com endereço.
- Diretório pesquisável de fornecedores, fornecedores guardados e catálogo com filtros de stock.
- Cotações abertas ou dirigidas, rascunhos editáveis, abertura e encerramento.
- Inbox de cotações no painel do produtor, respostas com preço por unidade e prazo.
- Propostas de exemplo apenas para produtos, unidades e stock compatíveis; comparação por preço e aceitação local.
- Navegação de fornecedor e empresa com ícones consistentes.

### Validação
- Sintaxe JavaScript e testes simulados: atalhos, seleção única, categoria individual, promoções, favoritos, registo empresarial, diretório, stock, abertura de cotação, proposta de exemplo, resposta do produtor, aceitação e persistência.
- Corrigida durante os testes a exclusão da quarta bancada de exemplo nas propostas.
- HTML raiz e public sincronizados.

### Limitações
- Um único protótipo com dados locais e contas demonstrativas. As cotações não são enviadas entre dispositivos, a aceitação não gera contrato nem reserva stock e não existem pagamentos.
- Teste visual em navegador real e publicação Cloudflare ainda por confirmar.

## [0.6.2] — 2026-11-17

### Corrigido
- Botão principal Comprar em vez de + Adicionar, com quantidade após adicionar ao carrinho.
- Preço e botão na mesma linha no modo Fila; layout compacto nos Blocos e adaptação a ecrãs estreitos.
- Fotografias com quatro cantos arredondados, recorte independente do cartão e suporte progressivo a squircle.
- Transições horizontais de 480 ms, entrada dos cartões durante a rolagem, fade das fotografias de 650 ms, transições dos controlos de 320 ms e janelas de 520 ms.
- Gradientes suaves de imagens e indicação visível da versão no rodapé.

### Validação
- Sintaxe JavaScript e testes simulados de Comprar, Fila, descrição, quantidade localizada, tempos de animação, movimento reduzido e criação de pedido.
- HTML da raiz e public sincronizados.
- Endereço de teste indicado pelo responsável; a ferramenta de verificação não conseguiu abrir o endereço. Deploy V0.6.2 e aparência real em telemóvel ainda por confirmar.

## [0.6.1] — 2026-11-17

### Alterado
- Nome visível do modo Empilhados para Fila, mantendo a compatibilidade com preferências guardadas.
- Curvas de movimento mais suaves, duração de 240–260 ms nas microinterações, 380–390 ms na navegação, 430 ms na abertura de janelas, 260 ms no fecho, 500 ms na entrada de fotografias e 540 ms na confirmação.
- Transições de layout com pequeno escalonamento, navegação de retorno e abertura suave de onboarding.
- Atualização localizada das quantidades, sem reconstrução integral do feed.
- Fades fotográficos no onboarding, banner, capas de bancadas e cartões em Fila; entrada animada de fotografias apenas na primeira carga bem-sucedida de cada URL.
- Cantos squircle progressivos nas superfícies do cliente, com fallback de cantos arredondados.
- Preferência de movimento reduzido preservada.

### Validação
- Sintaxe JavaScript validada.
- Testes simulados: rótulo Fila, descrição e layout, atualização localizada de quantidade, durações das animações, fade único por imagem, movimento reduzido, carrinho, checkout e pedidos, preservação dos painéis de negócio.
- HTML da raiz e public sincronizados.

### Limitações
- A fluidez e aparência dependem do navegador e do dispositivo; ainda não foram verificadas num telemóvel real.
- Suporte a corner-shape varia entre navegadores; o fallback mantém cantos arredondados.
- Deploy Cloudflare ainda por confirmar. Nenhum serviço pago, autenticação real ou transação financeira foi ativado.

## [0.6.0] — 2026-11-17

### Adicionado
- Preferências persistidas de visualização em blocos ou empilhada, com descrição opcional.
- Animações leves de navegação, abertura de janelas, botões, quantidades e confirmação; suporte a movimento reduzido.
- Feed simplificado, sem repetir as ofertas em várias secções.
- Categoria Cesta Básica com arroz, massa, fuba de milho, sal, leite, óleo e açúcar; embalagens, fotografias ilustrativas e preços fictícios.
- Checkout em três passos: carrinho, recebimento e revisão/confirmar, com cupão opcional.
- Confirmação com referência de compra, histórico agrupado por encomenda, detalhes por bancada e recompra.
- Unidades adicionais para produtos embalados.

### Validação
- Sintaxe JavaScript validada.
- Testes simulados: modos de layout e persistência, descrição, oferta única, sete produtos da cesta básica, adição de produtos de duas bancadas, etapas do checkout, desconto e total, validação de endereço, criação agrupada de pedidos, confirmação, histórico, detalhes e preservação dos painéis de produtor e empresa.
- HTML raiz e public sincronizados.

### Limitações
- Fotografias ilustrativas de Wikimedia Commons, com créditos atualizados; carregamento no navegador ainda por confirmar.
- Preços, produtos de exemplo e compras são demonstrativos. Sem cobrança, envio ao fornecedor, autenticação real ou logística ativa.
- Publicação Cloudflare e testes visuais em telemóvel ainda por confirmar.

## [0.5.0] — 2026-11-17

### Adicionado
- Interface de compras do cliente inspirada na experiência pública do Sbzee, com identidade ZUNGA própria.
- Navegação inferior: Início, Categorias, Carrinho, Pedidos e Perfil; bancadas acessíveis pelo feed e categorias.
- Cabeçalho de localização, pesquisa, promoções, categorias fotográficas e cartões com controlo direto de quantidades.
- Carrinho multibancada persistido localmente, resumo, checkout, endereços guardados, entrega a combinar ou levantamento, preferência de horário e cupão demo.
- Histórico, filtros de pedidos, recompra e registos locais de apoio, substituição e reembolso.
- Acesso de teste aos perfis de negócio no Perfil do Cliente.
- Estudo das funcionalidades públicas do Sbzee e arquitetura proposta de dois aplicativos.

### Validação
- Sintaxe JavaScript validada.
- Testes simulados de adição de produtos de duas bancadas, quantidade, subtotal, cupão, validação de endereço, criação de pedidos, total final, limpeza do carrinho, perfil, histórico e preservação dos painéis de produtor e empresa.
- HTML da raiz e public sincronizados.

### Limitações
- Checkout e apoio são simulações locais. Cada produto gera um registo de pedido, ligado a um identificador de compra comum; agrupamento comercial definitivo por vendedor fica para a infraestrutura real.
- Sem pagamentos, disponibilidade logística, janelas garantidas, autenticação real ou envio de solicitações.
- Fotografias externas, publicação Cloudflare e experiência visual em navegador real ainda por validar.
- Os dois aplicativos não foram separados fisicamente nesta versão.

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
