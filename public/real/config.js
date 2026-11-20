// Configuração pública: apenas chave publicável. Nunca incluir service_role ou credenciais de SMS/Google.
// Esta lista fixa impede o uso da página de autenticação noutras origens sem autorização.
window.ZUNGA_REAL_CONFIG=Object.freeze({
  enabled:true,
  routes:Object.freeze([
    Object.freeze({origin:"https://zunga-auth.stivenluanda04.workers.dev",path:"/"}),
    Object.freeze({origin:"https://zunga.stivenluanda04.workers.dev",path:"/real/"})
  ]),
  url:"https://asxyjhaujsowmdrpkcqc.supabase.co",
  // O botão Google inicia OAuth real e apresenta erro do servidor se o fornecedor ainda não foi activado.
  oauth:Object.freeze({google:true}),
  publishableKey:"sb_publishable_UefqqSeU3aZBX0k_vrKwaA_oTOOxxFt"
});
