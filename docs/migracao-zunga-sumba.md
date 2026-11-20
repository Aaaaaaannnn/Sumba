# Migração controlada de Zunga para Sumba

**Objetivo:** usar **Sumba** como nome visível, identificador GitHub e Worker Cloudflare, sem interromper o protótipo, o piloto de autenticação ou os serviços ligados.

## Inventário confirmado no código

| Elemento | Estado atual | Destino |
| --- | --- | --- |
| Marca visível | SUMBA e logótipo oficial | Preservar |
| Repositório | `Aaaaaaannnn/Zunga` | `Aaaaaaannnn/Sumba` após validação |
| Cloudflare demo | `zunga.stivenluanda04.workers.dev` | `sumba.stivenluanda04.workers.dev` |
| Cloudflare autenticação | `zunga-auth.stivenluanda04.workers.dev` | **Manter por enquanto** |
| Supabase | Projeto **Zunga**, ref `asxyjhaujsowmdrpkcqc` | Renomear só o **nome exibido**, preservar a ref |
| Brevo | Remetente e SMTP configurados fora deste repositório | Manter até validar o envio |
| Chaves de `localStorage` | Algumas ainda começam por `zunga-` | **Manter** para não perder dados do navegador |

A ligação entre serviços depende de **URLs, nomes de Workers, identificadores, secrets, webhooks e allowlists**. Alterar a marca visível não modifica esses identificadores automaticamente.

## Procedimento recomendado

1. **Guardar um ponto de reversão.** Confirmar que a branch `main` está funcional, identificar o commit da última publicação e verificar que os secrets de Cloudflare e Supabase permanecem nos painéis adequados. Não colocar chaves no GitHub.
2. **Rever e integrar as melhorias** a partir da branch `feat/sumba-cestos-pagamento-demo-readme`; executar testes de código e verificar manualmente num dispositivo.
3. **Criar o Worker paralelo.** Na aba GitHub **Actions**, executar manualmente `Deploy SUMBA Demo (manual, parallel)`. Este workflow usa `wrangler.sumba.jsonc` e cria/atualiza o Worker `sumba` **sem modificar o Worker `zunga`**. Exige `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` configurados como secrets. Em alternativa, com Wrangler autenticado: `npx wrangler deploy --config wrangler.sumba.jsonc`.
4. **Validar o novo endereço** `https://sumba.stivenluanda04.workers.dev/`: logo, catálogo, sessão demo, notificações, cestos separados, encomendas e pagamento fictício. No mesmo browser, **não esperar que os dados do `localStorage` do endereço Zunga apareçam automaticamente na origem Sumba** — origens distintas têm armazenamento isolado. Não eliminar o endereço anterior.
5. **Preservar o piloto real.** O código em `public/real/config.js`, os testes e as configurações Supabase autorizam os endereços antigos. A migração do piloto requer permitir a nova origem, rever **Auth → URL Configuration → Redirect URLs**, configurações OAuth de Google/Facebook, templates e redirecionamentos de email. Enquanto isso, usar `https://zunga-auth.stivenluanda04.workers.dev/` como endereço canónico do piloto. Não renomear `zunga-auth` antes de concluir testes de login, confirmação, recuperação, OAuth e logout.
6. **Verificar Brevo.** O endereço e identidade do remetente não dependem do nome do repositório; contudo, templates, links de confirmação e domínios autenticados podem conter URLs antigas. Inspecionar remetente, domínio, SMTP/API, URLs de resposta e logs de entrega, sem regenerar chaves desnecessariamente.
7. **Renomear o repositório** em GitHub → repositório → **Settings → General → Repository name → Sumba**. Depois atualizar a origem ligada no Cloudflare (se o deploy usa integração GitHub), checkouts locais, referências explícitas ao nome `Zunga` em scripts/workflows/docs e eventuais webhooks. O GitHub costuma redirecionar URLs antigas do repositório, mas não deve ser a única garantia para automatizações.
8. **Mudar o nome visível do projeto Supabase**, caso desejado, em Project Settings; **não recriar o projeto**, não alterar `SUPABASE_URL`, `publishableKey`, ref do projeto ou policies apenas para rebranding.
9. **Atualizar referências externas** de navegação, redes sociais, documentação, templates e remetentes para o novo endereço, depois de concluídos testes reais. Manter redirecionamento ou Worker antigo de compatibilidade durante a transição.

## Testes mínimos antes de desativar o endereço antigo

- Dois dispositivos e sessões de navegador distintos; visitante, cliente demo e cada perfil simulado.
- Adicionar produtos, criar e mudar cestos, separar uma bancada, finalizar cestos individualmente e rever pedidos antigos.
- Pagamento fictício pendente → aprovado, sem chamadas a serviços bancários, NIF fictício opcional e dados sem exposição indevida.
- Notificações e ícones do cabeçalho em telemóvel e computador.
- Se piloto real for incluído na migração: confirmação por email, reset, Google, papéis/autorizações do Supabase, RLS, links, Edge Functions e logs Brevo.
- Verificar que o domínio antigo continua operacional até a última validação.

## Reversão

Em caso de falha, voltar a anunciar **`zunga.stivenluanda04.workers.dev`** e publicar o commit estável no Worker antigo com `wrangler.jsonc`. O Worker paralelo `sumba` pode permanecer desativado sem afetar o anterior. Se o GitHub já tiver sido renomeado, restaurar o vínculo Cloudflare/GitHub ou renomear de volta. **Nunca apagar tabelas Supabase, secrets, DNS ou dados de utilizadores como parte da reversão.**

## Estado desta preparação

A configuração e o workflow criados neste repositório permitem um **deploy paralelo manual**; não representam publicação executada nem confirmam a alteração de nome nas contas GitHub, Cloudflare, Brevo ou Supabase. A renomeação do repositório e a configuração externa final dependem de acesso de administração aos respetivos painéis.
