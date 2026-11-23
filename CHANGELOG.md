# SUMBA — entrada demonstrativa e composição fotográfica (23/11/2026)

- A fotografia enviada da agricultora foi guardada em `public/assets/sumba-home.jpg` e aplicada como fundo integral do ecrã de entrada, com object-fit cover, logótipo original por cima da imagem e degradê verde apenas atrás do conteúdo inferior.
- Os percursos «Criar conta» e «Entrar na minha conta» permanecem no protótipo demonstrativo e deixam claro que não validam credenciais nem criam sessão Supabase; login de teste reduzido a dois campos e criação de perfil a nome/email.
- O teste de autenticação Supabase permanece no perfil do cliente, com sessão e dados separados da experiência demonstrativa.
- Confirmada a ligação da área real a Supabase Auth, perfis, produtos, cestos, propostas e mensagens; sem mudanças de esquema, segredos ou pagamentos.
- Verificação: revisão estática das rotas, formulários e CSS. Testes automatizados e publicação não foram executados nesta alteração.

# SUMBA — entrada e introdução fotográficas (23/11/2026)

- Página inicial e introdução mantidas em ecrã completo: logótipo oficial transparente ao centro, com slogan «Do campo à sua mesa.», fotografia original sem desfoque e degradê verde na zona inferior.
- Integração das duas fotografias de agricultores fornecidas em alta resolução (1536 px), guardadas no próprio repositório.
- Botões da entrada: «Criar conta», «Entrar na minha conta» e «Entrar como visitante»; preservados os destinos de autenticação Supabase e demonstração.
- Introdução: «Compre diretamente dos agricultores.», «Valoriza quem trabalha a terra.» e «Mais escolhas. Mais proximidade.», sem mensagens genéricas sobre bancadas.
- «Saltar introdução» e o fim dos diapositivos regressam à página de escolha de acesso, sem iniciar um registo não solicitado.
- Não foram alterados os pagamentos, dados, emails, Supabase, Brevo nem o Worker de autenticação. Verificações automatizadas em CI e Cloudflare antes de considerar a publicação concluída.

# SUMBA — entrada e contas (23/11/2026)

- Corrigida a imagem da entrada para enquadramento proporcional sem filtros de desfoque; logótipo original mantém-se em destaque.
- «Criar conta» e «Já tenho conta» encaminham para o serviço de autenticação Supabase, em registo ou login, sem criar sessões fictícias na interface principal.
- Google permanece disponível mediante configuração OAuth; botão Facebook desativado com a indicação «brevemente».
- Visitantes escolhem apenas nome e tipo de utilizador (cliente, produtor, empresa ou entregador) e acedem à experiência local de demonstração. A aplicação obriga esta escolha antes de entrar.
- Visitantes podem explorar catálogos e cestos, mas não podem confirmar encomendas ou pagamentos. Compras reais continuam a exigir integração operacional posterior.
- Tutorial inicial por perfil: progresso da conta autenticada persistido no Supabase com RLS; percurso demonstrativo guardado por nome e perfil no navegador.
- Preparadas publicações isoladas dos Workers principal e de autenticação, sem mexer na configuração SMTP/Brevo.

# SUMBA — entrada full-screen conforme referência (23/11/2026)

- A entrada do cliente e o tutorial de três cartões passaram a usar uma composição fotográfica vertical contínua: imagem de fundo até ao rodapé, degradê verde e texto branco sobre a fotografia.
- Logótipo original transparente ampliado na parte superior, sem painel ou duplicações.
- Indicadores do carrossel e botões mantidos como elementos HTML funcionais, agora sobrepostos na parte inferior, com botão principal verde-lima e secundário contornado.
- Fotografia do mercado com duas vendedoras na etapa «Conhece as bancadas», de acordo com a referência enviada.
- Formulários posteriores de login e registo não foram convertidos em fundos fotográficos para preservar legibilidade, foco e validação.
- Testes adicionais para garantir o layout e a continuidade dos botões, sem alterar autenticação real, Supabase ou Brevo.

# SUMBA — renovação visual da entrada (23/11/2026)

- Identidade: logótipo original fornecido, com símbolo e letras mantidos e slogan corrigido para «Do campo à sua mesa.», sem fundo ou cartão.
- Fotografias de entrada trocadas pelas três imagens fornecidas. Cada uma está incorporada como ficheiro local, sem dependência de ligações do Pinterest.
- Removida a apresentação duplicada do logótipo nos ecrãs de início, introdução, registo e login demonstrativo de cliente, produtor, empresa e operações.
- Logótipo de maior dimensão sobre a própria fotografia, com sobreposição suave para legibilidade e formato responsivo.
- Não alterados autenticação real, backend Supabase, Brevo, pagamentos ou dados de demonstração.

# SUMBA — produtos, cestos e pedidos persistentes (23/11/2026)

- Adicionadas quatro tabelas Supabase protegidas por RLS para produtos de produtores, cestos privados, contactos com fornecedores e mensagens entre as partes.
- Contas autenticadas têm um mercado sem produtos fictícios, com publicação de produtos, cesto e contacto comercial registados no servidor.
- Nenhuma cobrança, encomenda definitiva ou logística foi ativada; pagamentos continuam indisponíveis nesta área.
- Testes de segurança SQL e regressão do mercado, com documentação separada.

# SUMBA — ajuste OTP do portal real (23/11/2026)

- Ícone de envelope redesenhado com SVG, apenas na página do código real.
- Email de acesso OTP passa a incluir um botão para abrir diretamente as seis caixas de verificação, preservando a validação do código no Supabase.
- Sem alterações à demonstração pública, às credenciais SMTP, aos outros modelos de email ou aos dados.

# SUMBA V0.26.0 — 23/11/2026 (autenticação real de teste)

- Portal real isolado: login prioritário por OTP email com seis caixas visuais, teclado numérico, colagem e preenchimento automático suportado; acesso por palavra-passe continua opcional.
- Emails de acesso, confirmação e recuperação com template em português, emblema SUMBA e variável de seis dígitos `{{ .Token }}`; aplicação externa no Supabase Auth e SMTP real carecem de verificação.
- Adicionado script limitado para aplicar templates OTP no Supabase sem alterar Brevo, URLs ou RLS, e testes automatizados em GitHub CI.
- Site demonstrativo principal, lógica de compras e Worker antigo mantidos intactos.

# SUMBA V0.25.0 — 20/11/2026

- Cabeçalho da demonstração: botão «Entrar» ocultado após sessão simulada, notificações movidas para a direita e espaço mobile revisto.
- Carrinho reorganizado com cestos independentes (criar, escolher, renomear, eliminar) e separação de produtos por bancada; histórico de pedidos preservado.
- Checkout limitado ao cesto activo, com NIF fictício opcional, Multicaixa Express simulado com referência local, estado pendente e aprovação automática demonstrativa, ou pagamento na entrega simulado. Nenhuma solicitação de pagamento ou dados pessoais foram enviados a bancos.
- Página vazia do carrinho e botão «Explorar produtos» alinhados e adaptados a telemóvel.
- README reescrito como guia técnico e de avaliação; histórico detalhado mantido neste CHANGELOG.
- Preparados configuração e workflow manuais para Worker paralelo `sumba`, documentação de migração, regressões e CI. Workers `zunga` e `zunga-auth` e Supabase ref não foram modificados.
- Em `/real/` no novo endereço, encaminhamento para o Worker de autenticação existente, de modo a preservar as allowlists atuais.
- Verificações executadas: JavaScript principal validado sintacticamente e entradas HTML sincronizadas por SHA. Testes automatizados CI e validação visual num navegador real devem ser confirmados no PR. Publicação Cloudflare e renomeação do repositório **ainda não executadas**.

# SUMBA V0.24.0 — 20/11/2026

- Emblema familiar escolhido (folha, sol, família, campos) vectorizado a partir do original em PNG transparente.
- Substituídos os antigos recursos vazios/PNG incorporados em ambos os portais; novo SVG oficial independente, sem texto embutido.
- Marca aplicada ao cabeçalho móvel, menu lateral desktop e administração, perfis de todos os tipos e favicon.
- Nos formulários demo de login/registo aparece em destaque com até 132 px; autenticação real piloto também actualizada em login, OTP, onboarding, recuperação e perfil.
- Fotografia/avatares dos utilizadores preservados. Slogan «Do campo à sua mesa.».
- 18 verificações estáticas e funcionais isoladas passaram; deploy e teste visual final não comprovados.

# SUMBA v0.23.0 — 20/11/2026

Restituição para demonstração: navegação livre, perfis locais, login e criação de conta simulados (Google, Facebook, email, telefone), carrossel com pré-visualização do próximo cartão, logótipo e slogan legíveis, notificações lidas/não lidas, histórico local de emails de actividade sem envio real. Não foram efectuados envios externos de mensagens nem cobranças. A publicação na Cloudflare depende de deployment separado.

# SUMBA V0.22.0 — 20/11/2026

- Login real por email/telefone, OTP e início de Google OAuth; ligação da loja pública a `/real/`.
- Carrossel com setas e indicadores sobrepostos ao cartão; identidade visual e logótipo preservados.
- Supabase: base de dados de notificações, preferências, actividades, administração, moderação e fila de entrega. RLS e permissões testadas.
- ADM real: lista de contas, filtros, actividade, suspender/bloquear/reactivar, comunicações individuais e colectivas com confirmação e consentimento.
- Notificações com ponto vermelho, leituras persistentes, actualização em tempo real e pop-up no site.
- Edge Function segura `sumba-admin` para gestão e envio via Brevo/Twilio quando configurados.
- Não activados automaticamente: fornecedores Google/SMS, segredos Brevo/Twilio, agendamento da fila, compras e pedidos reais ou publicação Cloudflare.

# SUMBA V0.21.3 — 20/11/2026

- Símbolo da marca da última proposta (família, sol, folha e campos) optimizado e incluído como recurso local para a loja e o piloto real.
- Aplicação do logótipo e do slogan «Do campo à sua mesa.» ao cabeçalho mobile/desktop, ecrãs de entrada e registo de todos os perfis demo, login, registo, OTP e recuperação do piloto real.
- Ícone do separador utiliza a marca; sem redesign global da paleta ou mudança do fluxo de autenticação.
- Duas entradas da loja mantidas sincronizadas; JavaScript dos fluxos demo e real validado sintacticamente, sem alterar lógica de negócio ou segredos.
- Não foram confirmados a publicação na Cloudflare nem os testes visuais em dispositivos reais.

# SUMBA V0.21.2 — 20/11/2026

- Página inicial: carrossel com cinco fotografias e mensagens diferentes; conserva o tema verde existente.
- Navegação por swipe horizontal, setas de 44px, pontos, teclado e scroll-snap; mudança automática de 6 em 6 segundos e pausa ao interagir.
- Preferências de movimento reduzido respeitadas. Rotas existentes reutilizadas para Promoções, Cesta básica, Bancadas e Catálogo.
- Removido emoji de planta do cabeçalho, sem inventar logótipo novo; slogan actualizado para «Do campo à sua casa.»
- Validação pré-commit: sintaxe do JavaScript, estrutura dos cartões, destinos e consistência das duas entradas HTML; testes reais de navegador e publicação tratados separadamente.


## SUMBA Auth — envio automático de email e operação (V0.21.2)
- Templates adicionais confirmados pelas referências oficiais: convites, mudança de email (link de confirmação), reautenticação (OTP), além dos já preparados para registo, login OTP, recuperação e alerta de alteração de palavra-passe.
- Script `scripts/configure-sumba-auth.mjs`: aceita variáveis `SUMBA_SMTP_EMAIL`, `SUMBA_SMTP_USER`, `SUMBA_SMTP_KEY`, `SUMBA_SMTP_HOST` e `SUMBA_SMTP_PORT` (ou aliases `ZUNGA_*` antigos); valores predefinidos Brevo host `smtp-relay.brevo.com` e porta 587. Comando `status` consulta a configuração da Management API apenas no terminal com token, sem mostrar credenciais. `email --apply` exige confirmação literal SUMBA e Worker isolado publicado. Configura automaticamente os modelos e a confirmação obrigatória; `google --apply` e `facebook --apply` ficam opcionais depois de criares aplicações nesses fornecedores.
- Workflow `Deploy SUMBA Auth (manual)` preparado: só se executa por acção manual em GitHub Actions, requer `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` nos Secrets do repositório; publica apenas `wrangler.auth.jsonc`, sem substituir o Worker do marketplace.
- Validação local de código disponível em `node tests/auth-contract.mjs`; não cria contas, não envia e-mails e não toca na base de dados. Sem entrega SMTP comprovada ou deploy confirmado.


## Autenticação V0.21.2 — Fluxos reais e segurança
- Área real em origem isolada: conserva o pedido de código apenas na sessão do navegador (modo, email e cooldown; nunca armazena código ou palavra-passe), permite alterar o email pela confirmação do Supabase e distingue integrações sociais não activadas. Google/Facebook ficam visualmente indisponíveis até a configuração e teste do fornecedor; mantém código de ligação. Melhorias de acessibilidade e mobile.
- A SUMBA continua com as tabelas técnicas `zunga_*` e origem prevista `zunga-auth.stivenluanda04.workers.dev` para compatibilidade. Nada de service_role no browser, nenhuma sessão real partilhada com o protótipo e nenhum pagamento real.
- Supabase confirmado saudável, sem contas, perfis ou alertas de segurança. **Não foi possível configurar SMTP/URL/fornecedores OAuth via conector nem verificar o deploy.** A entrega real de emails depende das credenciais SMTP verificadas introduzidas apenas no serviço. Não apresentar este trabalho como envio de email activo.

# Histórico de versões — SUMBA


## [0.21.1] — 2026-11-18 — Rebranding SUMBA
- Marca pública SUMBA nos perfis, tutoriais, títulos, textos, exportações, autenticação real, templates de email e documentação. Contas exclusivamente demo: demo@sumba.test, produtor@sumba.test, empresa@sumba.test / SumbaDemo123!; cupão SUMBADEMO. Aliases das credenciais e cupão antigos preservados; migração restrita a identidades incorporadas e preferência de tutorial, sem alterar histórico de encomendas.
- Compatibilidade: nomes físicos das tabelas, bucket privado, storageKey Auth, localStorage/IndexedDB, DOM IDs, endereços e nomes dos Workers mantidos; meta de versão antiga continua como alias. Não alterar URLs sem migração coordenada. O nome do repositório GitHub ainda precisa de alteração em Settings > General > Repository name; o conector não disponibiliza rename. Não modificar histórico Git. A origem real ainda não foi publicada; templates alterados no repositório, não no dashboard Supabase. O projecto Supabase mantém nome técnico anterior até alteração manual, sem recriar a base.
- Comando recomendado: scripts/configure-sumba-auth.mjs; caminho antigo mantido como shim. Variáveis de ambiente legadas preservadas para não quebrar configuração. Confirmação de aplicação agora SUMBA.


Todas as alterações relevantes do projeto serão registadas neste ficheiro.








## [0.21.0] — 2026-11-18
- 28 guias, 81 passos, seis percursos (cliente, fornecedor, empresa, entregador, ADM e consola de hub). Introdução automática apenas na primeira entrada de cada identidade demo/perfil neste navegador; saltar ou concluir memoriza a visita. Clientes que concluíram o tutorial anterior mantêm a preferência. Guias manuais no menu lateral/perfil/mais, central com instruções e indicação de vídeo a adicionar; nenhum vídeo fictício. Hub continua consola ADM, não conta independente. Tutorial não altera pedidos, stock, pagamentos ou parâmetros e restaura página, scroll e histórico ao terminar.
- Layout: tamanho intrínseco e overflow, pesquisa, filtros, grelhas, quantidades, menus, modal e zona ADM no mobile, cartões e cabeçalhos; animações discretas de cliente e respeito por movimento reduzido. Sem alterações aos dados do Supabase ou à autenticação isolada V0.20.
- Validação: sintaxe JS, 87 testes de configuração dos guias, identidade e posicionamento em ecrãs simulados. Navegador real, dimensões efectivas e deploy não confirmados.


- Complemento: 20 verificações de fluxo com DOM simulado — primeira entrada, repetição manual, saída/restauro, memória independente por perfil, convidado/conta, entregador, hub e ADM, bloqueio durante autenticação. Melhorado estado activo do menu, medição da janela e isolamento da preferência de convidado.

## [0.20.0] — 2026-11-18
- Área real isolada: registo, códigos por email, login por código/password, recuperação por código, reenvio, Google/Facebook OAuth e vinculação. Templates de autenticação e segurança, configuração Worker dedicado, headers de segurança, instruções de activação em docs/autenticacao-v020.md.
- Supabase dedicado confirmado saudável, RLS activa nas três tabelas, 10 políticas, role protegido, bucket avatar privado. Não executada migração nem modificações de settings. Sem envio real, configuração OAuth ou deploy confirmado. Não há acesso real aos módulos do protótipo; nenhuma credencial sensível publicada.

- 11 verificações estáticas e sintaxe aprovadas; teste real pendente.


- Complemento: 15 verificações do fluxo com SDK e DOM simulados (registo, reenvio, verificação, recuperação, logout), correção de confirmação do logout e captura do erro OAuth. Não são testes de entrega de email ou login real.

## [0.19.0] — 2026-11-18

- Arquitectura alvo completa em [docs/arquitectura-cross-docking.md](docs/arquitectura-cross-docking.md): DER, tabelas/relacionamentos, RBAC, estados, APIs, eventos, segurança e plano de migração.
- V0.18 já disponibiliza os painéis Empresa, Fornecedor e Entregador e tema escuro individual. V0.19 acrescenta área de ensaio a cada perfil e Torre de Controlo / consola Hub no ADM.
- Laboratório separado dos pedidos existentes: cenário fictício com três compras validadas e uma pendente; consolidação por produtor, SKU e unidade, corte manual simulado, etiqueta mestre/sub-etiquetas textuais, prioridade B2B por segmento/zona, transporte primário, check-in, triagem, expedição e última milha, códigos POD fictícios por paragem, recusa por quantidade e mediação, split simulado após prova/resolução. Não altera stock, encomendas ou pagamentos reais nem de demonstração do fluxo V0.18.
- Política configurável de horários e percentagens para novos ensaios; não é agendamento real, optimização GPS, scan QR, foto/POD real, PSP, escrow, emissão fiscal, sincronização multi-dispositivo nem RBAC real. Hub é uma consola ADM de ensaio, não uma sexta conta autenticada.
- Validação: sintaxe JS e 29 testes de lógica (consolidação, estados, autorização simulada, horários e conservação financeira). Sem execução de migração Supabase ou activação de serviços; validação de navegador e deploy pendentes.

## [0.18.0] — 2026-11-18

- Fornecedor: interface simples e prioritariamente mobile, tarefas e pedidos destacados, catálogo com preço/stock e opções avançadas recolhidas, alertas e acessos a cotações e armazéns. Estados de pedido com linguagem orientada a tarefas.
- Empresa: central de abastecimento com KPIs, gráfico de compras, fornecedores guardados, cotações por estado, encomendas com pesquisa/filtros/tabelas e orçamento mensal persistente (alerta não bloqueante), exportação Excel.
- Entregador: disponibilidade local, tarefas por estado, remuneração nas fichas, histórico e ganhos previstos/a receber/liquidados demo, exportação Excel; valores fixados pelo snapshot financeiro da compra, registos antigos sem valor fixado não recebem valor inventado, isolamento por entregador simulado.
- Tema claro/escuro persistente e independente para cada perfil, navegação especializada no desktop e mobile, cliente e ADM preservados. Novas funcionalidades continuam locais; sem autenticação real, GPS, pagamentos ou transferências. Não foram alteradas as percentagens financeiras existentes.
- Validação: sintaxe JavaScript, 15 testes de lógica e integração textual; testes visuais e publicação pendentes. Sem alterações Supabase ou custos externos.


- Complemento: catálogo e directório de compras da empresa em tabelas ordenáveis/paginadas com ações preservadas; validação de cotação respeita parâmetros B2B. 14 testes de renderização e isolamento com DOM simulado; modo escuro e responsividade ainda requerem verificação visual.

## [0.17.0] — 2026-11-18

- Interface administrativa independente: menu lateral por áreas, recolhível no desktop e gaveta no mobile, topo com pesquisa global, alertas, perfil e tema claro/escuro; navegação de cliente preservada.
- Páginas de administração inline para utilizadores, catálogo, pedidos, inventário, tesouraria, parâmetros visuais/comerciais e auditoria; formulários de edição continuam em janelas. Cotações em consulta administrativa; suporte, logística, moderação, documentos e relatórios ligados ao menu.
- Dashboard com período de 7/30/90/180 dias, KPIs com comparação, gráfico de volume de produtos, estados, alertas, top produtos/bancadas/províncias, atividade, previsão indicativa baseada em semanas completas e exportação Excel. Sem valores inventados além do dataset demo; previsão é ocultada com histórico insuficiente.
- Tabelas de encomendas, produtos, entidades e cotações com ordenação, paginação e controlos anteriores; pesquisa global por módulo, produto, pedido e entidade. Operações em massa, permissões reais e reconciliação ficam para fases seguintes.
- Validação: sintaxe JavaScript, 18 verificações de lógica e integração textual, HTML raiz/public sincronizado. Teste visual de navegador e publicação não confirmados. Sem alterações ao Supabase, sem serviços pagos, sem segurança ou transações reais.


- Validação complementar: 11 testes com DOM simulado para dashboard, menu, captura de módulos, manutenção de modais de edição, cotações, apoio, tabela e retorno ao cliente. Melhorado foco/inert do menu em ecrãs pequenos. Não substitui teste visual em navegador.

## [0.16.0] — 2026-11-18

- Painel ADM transversal: catálogo, utilizadores e bancadas, fluxo de encomendas, stock e armazéns, tesouraria simulada e auditoria.
- Parâmetros aplicados ao protótipo: cor principal/destaque, cantos, movimento, destaque da loja, aviso global, disponibilidade de novas compras B2C/B2B, novas entregas e publicação, valor mínimo, cupão, três tarifas de entrega e alertas de inventário.
- Administração pode verificar/suspender entidades de demonstração, ocultar produtos, editar preço e mínimo, ajustar stock não reservado sem afetar lotes, avançar e cancelar pedidos antes da recolha respeitando reservas e despacho. Verificação de pessoas fictícias é apenas uma etiqueta local.
- Repartição financeira simulada: comissão, processamento deduzido do fornecedor, parcela logística, líquido por fornecedor, marcação de liquidação de pedidos novos concluídos e exportação Excel. Regras fixadas nos novos pedidos; pedidos antigos são estimativas, sem liquidação. Nenhuma cobrança, custódia ou transferência real.
- Exportação de parâmetros JSON, auditoria Excel, motivo obrigatório e restauro de parâmetros padrão. Sem execução de código arbitrário, sem alteração do Supabase e sem serviços externos.
- Validação: sintaxe de scripts, 28 testes unitários de parâmetros, repartição e guardas de estados, 30 pontos de integração textual; teste de navegador e publicação ainda pendentes. A administração continua demonstrativa, não é autorização real.


- Complemento de validação: 12 testes de integração de tarifas, permissões locais de inventário, snapshot financeiro e suspensão. A administração também cria armazéns, regista e movimenta lotes, edita categoria/descrição e apresenta etiqueta de verificação demo; movimento desligado também no JavaScript. Sem teste visual real.

## [0.15.0] — 2026-11-18

- Administração: gestão pesquisável de encomendas, central de apoio com resposta e encerramento, auditoria local e indicadores operacionais.
- Logística: três entregadores fictícios, disponibilidade, atribuição e reatribuição, janela e instruções, filtros, ocorrências e resolução administrativa.
- Entregador: seleção explícita de identidade demo, tarefas e histórico separados, confirmação manual de recolha e entrega. Comprador consulta o histórico nos detalhes.
- Estados e apoio ficam neste navegador; não há GPS, prova real, autenticação, notificações externas ou pagamentos. A base Supabase não foi alterada.
- Validação: análise sintática dos scripts e 10 testes de transição (incluindo lote vencido, ocorrência aberta, cancelamento e conclusão duplicada). Teste visual/deploy pendentes.

## [0.14.0] — 2026-11-18

- Cancelamento visível nos pedidos antigos e novos, agrupado ou por item; filtro Cancelados e reposição só quando existe reserva comprovada.
- Gestão de armazéns, lotes, validade, alertas, perdas e transferências; reservas por validade e reposição dos lotes.
- Fichas de movimento com exportação PDF, XLSX e DOCX; bloqueio de expedição de lote vencido.
- 19 testes de lógica na versão final, HTML sincronizado. Ambiente local; sem deploy confirmado, autenticação real ou alteração ao Supabase.

## [0.13.0] — 2026-11-18

- Escalões de preço por quantidade e subtotal coerente no carrinho e checkout.
- Reservas das novas encomendas, cancelamento com reposição única, preservação dos registos anteriores.
- Estimativas fictícias de entrega por bancada; total separado do custo dos produtos.
- Conversão de propostas aceites em encomenda B2B com preço negociado, validação de catálogo e prevenção de duplicação.
- Área de armazém do fornecedor com disponibilidade, reservas, entradas, saídas e histórico de ajustes.
- Comprovativos enriquecidos com preço unitário, desconto e estado.
- Sintaxe e 21 testes de lógica em ambiente simulado aprovados. HTML principal e public sincronizados.
- Autenticação real permanece desativada. Dados e operações são locais; sem migrações no Supabase. Publicação e teste visual pendentes.

## [0.12.0] — 2026-11-18 (backend instalado, interface pendente)

- Nova área real separada do protótipo V0.11, mantendo a interface demonstrativa.
- Fluxos de registo, login, confirmação, recuperação, onboarding e edição de perfil via Supabase JS; configuração vazia/desativada bloqueia credenciais.
- RLS adicional impede sessões anónimas de ler/escrever dados privados, mesmo se o login anónimo for ativado por engano.
- SQL inicial para perfis, bancadas, empresas, RLS, grants por coluna e avatares privados. Auto-registo não concede admin/entregador.
- Diretório real de bancadas publicadas, sem importação de exemplos.
- Guia de ativação e testes em docs/fundacao-real.md.
- Verificada sintaxe JavaScript e bloqueio de configuração em DOM simulado; HTML raiz e public sincronizados.
- Projeto dedicado Sumba autorizado; migração inicial aplicada, três tabelas RLS e bucket privado verificados; advisor de segurança sem avisos. Avisos de desempenho RLS permanecem. Chave pública configurada, interface desativada até origem dedicada, SMTP, redirects e testes reais.

## [0.11.0] — 2026-11-18

- Dez bancadas de exemplo e 25 produtos fixos, três produtos locais de teste.
- Onze fotografias novas com créditos, capas de bancadas, destaque no feed e descoberta horizontal.
- Animações de conteúdo e microinterações, sem deslocar a barra inferior.
- Dataset inicial interligado: 37 pedidos, 21 avaliações, 18 mensagens, 16 entregas, seis cotações, três campanhas, três fichas e 90 eventos de visualização.
- Diretório fictício, perfis vazios de exemplo e controlo de carregamento/remoção sem duplicar IDs ou eliminar operações manuais.
- Testes simulados aprovados para referências, feed, comentários, estatísticas, diretório e remoção. Deploy, fotografias remotas e teste visual ainda por confirmar.

## [0.10.2] — 2026-11-17

- Perfil do cliente unificado, com uma única identidade, funções agrupadas e um único seletor de tipo de acesso.
- Removidos acessos repetidos nos perfis profissionais e em Mais; dados pessoais separados dos dados da bancada.
- Reforçado o fecho dos modais por toque exterior, preservando toques internos; retorno do formulário de endereço à lista de endereços e ícones SVG.
- Avaliar fornecedor na bancada e nos pedidos concluídos, estrelas interativas e comentários editáveis.
- Opiniões sem encomenda concluída são não verificadas e privadas; testemunhos selecionados exigem encomenda concluída e aprovação.
- Testes simulados aprovados para modais, perfil, avaliação e visibilidade. A publicação e o teste em Android real ainda não foram verificados.

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
- Seletores de escolha única substituídos visualmente por controlos próprios da SUMBA nos três perfis.
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
- Interface de compras do cliente inspirada na experiência pública do Sbzee, com identidade SUMBA própria.
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

- Complemento: triagem individual por sub-etiqueta com rejeição de duplicados, POD por paragem/linha em sequência B2B prioritária, quantidade recusada e cálculo proporcional do ajuste, bloqueio da liquidação até mediação. 8 testes adicionais de POD e 20 verificações do fluxo integrado com DOM simulado. Não substituem teste de navegador.

- Configurador assistido de Auth por Management API, separado por email, Google e Facebook; modo de planeamento, confirmação e verificação do Worker, sem segredos. 10 testes de lógica de configuração aprovados. Não executado contra a API de gestão; SMTP e OAuth permanecem pendentes.

- Validação: 46 verificações de marca, aliases, preservação de identidades, tutorial, SQL e configuração, além de sintaxe JS. Sem teste em navegador ou deploy confirmado.

## Ensaios de segurança adicionais — 19/11/2026
- Verificação de código OTP mantida no servidor. A referência local do pedido expira agora após **10 minutos**, alinhada à configuração de email OTP do projecto; o cliente só guarda email, modo e instante do pedido no separador.
- `scripts/test-sumba-auth-runtime.mjs` simula registo, reenvio lógico, login por código, confirmação, recuperação e logout, sem enviar e-mails nem criar utilizadores. `scripts/check-sumba-auth.mjs` valida a publicação, origem dedicada e headers de segurança (depois de usar manualmente o workflow Cloudflare). Integração com Brevo/SMTP depende de segredos e remetente verificado fornecidos apenas nos painéis oficiais.
- Após configurar `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` em GitHub Actions Secrets, executar manualmente **Deploy SUMBA Auth**. Se a origem prevista não coincidir com a conta Cloudflare, ajustar as origens antes de executar.
