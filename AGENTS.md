# SUMBA — Instruções de manutenção

## Identidade e âmbito
- SUMBA: Do campo à sua casa.
- Marketplace agrícola de Angola; foco inicial na Huíla.
- Três perfis: Cliente, Produtor e Empresa.
- Repositório exclusivo: Aaaaaaannnn/Zunga (marca SUMBA; renomeação do repositório pendente em GitHub Settings).
- Não alterar outros projetos.
- Priorizar serviços gratuitos e não ativar cobranças, publicidade paga ou serviços de terceiros com custos sem autorização expressa.

## Em cada alteração
1. Inspecionar os ficheiros existentes e preservar funcionalidades que não precisam de mudar.
2. Implementar as mudanças com atenção à experiência mobile, acessibilidade e segurança.
3. Executar os testes disponíveis e registar o que foi realmente verificado.
4. Atualizar README.md para refletir a versão, novas funcionalidades, arquitetura, estado e roadmap quando aplicável.
5. Atualizar CHANGELOG.md com a data, alterações, testes realizados e limitações.
6. Manter a documentação sincronizada com o código, preferencialmente no mesmo commit ou pull request.
7. Quando necessário, documentar configuração, dependências e migrações sem incluir segredos.
8. Confirmar o estado do deploy separadamente; não confundir commit com publicação bem-sucedida.

## Aplicação atual
- A Cloudflare serve public/index.html; a entrada index.html na raiz deve permanecer sincronizada enquanto existir.
- Preservar o caráter demonstrativo claramente identificado enquanto não houver serviços reais.
- Não apresentar dados fictícios como reais, nem alegar autenticação, pagamentos, campanhas ou rastreamento que não estejam implementados.

## Próximas etapas
- Supabase Auth, perfis e políticas de acesso por linha.
- PostgreSQL e armazenamento partilhado.
- Pedidos, catálogo e estatísticas persistentes.
- Moderação, monetização e integração de anúncios com autorização.
