// SUMBA Auth · verificador read-only da origem publicada. Sem tokens/segredos.
const origin='https://zunga-auth.stivenluanda04.workers.dev';
let failed=0;
for(const path of ['/','/config.js','/real.js','/real.css']){
 try{
  const response=await fetch(origin+path,{redirect:'error',signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('HTTP '+response.status);
  const body=await response.text();
  if(path==='/'){
   if(!body.includes('name="sumba-version" content="0.24.0"')||!body.includes('real.js'))throw Error('Página/versão inesperada');
   if(!(response.headers.get('content-security-policy')||'').includes("frame-ancestors 'none'"))throw Error('CSP em falta');
   if(response.headers.get('x-frame-options')!=='DENY')throw Error('X-Frame-Options em falta');
  }
  if(path==='/config.js'){
   if(!body.includes('origin:"'+origin+'"')||!body.includes('enabled:true'))throw Error('Origem/configuração inválida');
   if(/(?:publishableKey|secretKey)\s*:\s*["']sb_secret_/.test(body)||/\bservice_role\s*[:=]\s*["']/.test(body))throw Error('Segredo não permitido');
  }
  console.log('OK '+path);
 }catch(e){console.error('FALHA '+path+': '+e.message);failed++}
}
if(failed)process.exitCode=1;else console.log('Página isolada verificada. A entrega real de e-mails ainda precisa de ensaio.');
