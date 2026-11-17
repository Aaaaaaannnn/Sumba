# V0.12 — Fundação real (pré-ativação)

## Estado
Não há projeto ZUNGA associado no Supabase. Nenhum banco existente foi alterado. O protótipo V0.11 mantém-se disponível. A nova área `/real/` está desativada por defeito. O código não oferece login fictício na área real e não importa dados de demonstração.

## Ativação
1. O responsável escolhe uma organização Supabase e confirma que é possível criar um projeto dedicado gratuito ZUNGA. Não reutilizar LUME ou qualquer projeto sem autorização específica.
2. Criar o projeto e verificar estado ACTIVE_HEALTHY. Confirmar que o projeto é exclusivamente ZUNGA.
3. Executar `supabase/setup-v012.sql` uma única vez no SQL Editor do projeto novo. O script é transacional e não deve ser executado num projeto que já tenha tabelas ZUNGA. Verificar as tabelas, RLS, grants e bucket privado; executar os advisors e resolver falhas.
4. Configurar Email Auth com confirmação de email e palavra-passe mínima de 12 caracteres, URLs permitidos e SMTP apropriado para piloto. O SMTP predefinido do Supabase tem restrições; verificar envio para as contas de teste autorizadas antes de prometer registo público. Nunca desativar a confirmação para contornar problemas de entrega.
5. Publicar a área real numa origem HTTPS dedicada (outro Worker/site), **sem publicar o HTML demonstrativo nessa origem**. Manter a pasta real sob /real/ e configurar a Site URL e redirecionamento permitido com o endereço exato da área real. Não partilhar tokens com a origem do demo. Ajustar o link de retorno para o demo explícito. Usar uma política CSP e rever dependências e scripts antes de permitir credenciais reais.
6. Em `public/real/config.js`, configurar enabled:true, origin com a origem exata, url com o URL do projeto e publishableKey com a chave pública moderna do projeto. Nunca adicionar chave secret/service_role, token pessoal ou senha do banco. O SDK Supabase JS é carregado de um CDN com versão fixa 2.119.0 apenas quando habilitado; antes de lançamento preferir bundle local auditado com lockfile.
7. Confirmar deploy e fazer testes abaixo. Só depois disponibilizar a área real aos participantes. A interface real é a fundação, não o marketplace completo.

## Modelo de segurança
- zunga_profiles: uma linha por auth.users; leitura e edição do próprio perfil. Autocadastro limitado a buyer/producer/company; grants por coluna impedem alteração do papel, ID, termos e data após criação. Admin/courier exigem provisionamento administrativo autorizado no servidor; não há opção de escolher esses papéis. O papel guardado no banco, e não o seletor ou metadata editável, define permissões.
- zunga_stalls: proprietário fornecedor autenticado pode criar/editar a sua bancada; apenas bancadas publicadas são legíveis publicamente. Não incluir contactos privados. Uma bancada por proprietário.
- zunga_companies: dados legíveis/editáveis só pelo proprietário com papel empresa.
- zunga-avatars: bucket privado; caminho user_id/avatar; limite de 1 MB e formatos JPEG/PNG/WebP. Acesso do dono via URL assinada de curta duração. Remover foto elimina a referência e o objeto.
- A aceitação dos termos piloto-1 é gravada no onboarding com data no servidor. Necessária revisão jurídica e política de privacidade antes do piloto com pessoas externas. Exclusão de conta, suporte e retenção ainda por implementar. Não usar dados sensíveis.

## Teste obrigatório antes de ativar
Criar duas contas de teste distintas e confirmar email. Em dois navegadores:
| Teste | Resultado esperado |
|---|---|
| Registo, confirmação, login, logout, recuperação | Sessão válida só após confirmação; logout termina acesso |
| Conta A atualiza nome/foto e entra no outro aparelho | Alterações reaparecem sem copiar localStorage |
| Conta B tenta ler/editar perfil ou avatar de A pela API | Negado ou nenhum registo |
| Conta buyer tenta inserir role admin/courier, alterar role ou editar user_id | Negado |
| Conta buyer tenta criar bancada ou empresa | Negado |
| Fornecedor cria bancada não publicada | Apenas dono consegue ler |
| Fornecedor publica bancada | Visível no diretório de outra conta; não editável por ela |
| Empresa cria organização; outra conta tenta consultar | Negado |
| Sem sessão | Não lê perfis/empresas/avatares; apenas diretório publicado |
| Chave/configuração ausente ou origem demo | Sem formulário de credenciais, sem chamadas ao Auth |
| Android/desktop e ligação instável | Erros claros; sem falsa confirmação |

A validação com banco real, advisors, SMTP, deploy e teste de dois dispositivos está pendente. Os testes locais apenas verificam sintaxe e bloqueio por configuração. Próxima fase: migrar catálogo, pedidos e restantes módulos gradualmente sem misturar exemplos com produção.
