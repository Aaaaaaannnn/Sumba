# OTP por email — autenticação real de teste da SUMBA

**Âmbito:** apenas o portal de autenticação real em `https://zunga-auth.stivenluanda04.workers.dev/`; o marketplace demonstrativo não é alterado.

## Implementação

O login principal usa `supabase.auth.signInWithOtp` com `shouldCreateUser:false` e validação através de `supabase.auth.verifyOtp` no Supabase. A palavra-passe continua disponível como alternativa. A página apresenta seis caixas visuais, teclado numérico, colagem de códigos, reenvio limitado e logótipo oficial. O registo e a recuperação usam também modelos OTP em português.

**Atenção:** os modelos guardados no GitHub não alteram automaticamente a configuração de email no Supabase.

## Ativar o email OTP

Em [Supabase → Authentication → Email Templates](https://supabase.com/dashboard/project/asxyjhaujsowmdrpkcqc/auth/templates):

1. Abrir **Magic Link** e utilizar `supabase/auth-templates/magic-link.html`, com assunto **Código de acesso à SUMBA**.
2. Em **Confirm signup**, utilizar `supabase/auth-templates/confirm-signup.html`.
3. Em **Reset password**, utilizar `supabase/auth-templates/recovery.html`.
4. Guardar. Cada template contém `{{ .Token }}` e não `{{ .ConfirmationURL }}`.
5. Em **Authentication → Providers → Email**, confirmar OTP com **6 dígitos**, validade e limites de envio. O Brevo permanece responsável pelo SMTP existente.

Alternativa em terminal autorizado, sem expor segredos no GitHub:

```bash
node scripts/apply-sumba-otp-email.mjs
export SUPABASE_ACCESS_TOKEN="TOKEN_PESSOAL_DE_GESTAO"
node scripts/apply-sumba-otp-email.mjs --apply
unset SUPABASE_ACCESS_TOKEN
```

O script só modifica os três templates e o comprimento do código; não altera SMTP/Brevo, Google, domínio, Site URL, RLS ou dados. Não partilhar o token no chat.

## Publicar o portal de teste

Após integrar a alteração no GitHub, usar **Actions → Deploy SUMBA Auth (manual)** para publicar apenas o Worker `zunga-auth`. Esta alteração não exige nem autoriza publicar o Worker demonstrativo `zunga`/`sumba`.

## Testes após publicação

1. Pedir código com uma conta de teste existente; confirmar email com **6 números** em vez de magic link.
2. No Android, tocar nas caixas, verificar teclado numérico, colagem, apagar e mensagens de erro.
3. Confirmar OTP válido e sessão real; testar código errado, expirado e reenvio.
4. Testar registo, recuperação, Google, logout e políticas RLS sem modificar a demonstração.

Testes locais e GitHub CI não comprovam que o SMTP ou o portal publicado estejam funcionais.

**Logo no email:** os templates referenciam o SVG oficial da Sumba publicado no Worker. Alguns clientes de email bloqueiam imagens remotas/SVG; o nome e slogan SUMBA permanecem visíveis como fallback.
