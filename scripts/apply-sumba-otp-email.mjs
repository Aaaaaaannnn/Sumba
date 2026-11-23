// SUMBA — aplicar apenas os modelos OTP do piloto via API Supabase Management.
// Não modifica SMTP, credenciais de fornecedores, URLs, domínios ou políticas RLS.
import {readFile} from 'node:fs/promises';
const REF='asxyjhaujsowmdrpkcqc';
const API_URL='https://api.supabase.com/v1/projects/'+REF+'/config/auth';
const required=['mailer_templates_magic_link_content','mailer_templates_confirmation_content','mailer_templates_recovery_content'];
const templates={
 mailer_subjects_magic_link:'Código de acesso à SUMBA',
 mailer_templates_magic_link_content:await readFile(new URL('../supabase/auth-templates/magic-link.html',import.meta.url),'utf8'),
 mailer_subjects_confirmation:'Confirma a tua conta SUMBA',
 mailer_templates_confirmation_content:await readFile(new URL('../supabase/auth-templates/confirm-signup.html',import.meta.url),'utf8'),
 mailer_subjects_recovery:'Código de recuperação SUMBA',
 mailer_templates_recovery_content:await readFile(new URL('../supabase/auth-templates/recovery.html',import.meta.url),'utf8'),
 mailer_otp_length:6
};
for(const key of required){
 const html=templates[key];
 if(!html.includes('{{ .Token }}')||html.includes('{{ .ConfirmationURL }}'))
   throw Error('O modelo '+key+' precisa apresentar o código, não um magic link.');
}
const doApply=process.argv.includes('--apply');
if(process.argv.slice(2).some(a=>a!=='--apply'))throw Error('Uso: node scripts/apply-sumba-otp-email.mjs [--apply]');
console.log('Projeto Supabase: '+REF);
console.log('Alterações previstas: email OTP, confirmação e recuperação em português, código de 6 dígitos.');
console.log('Não se alteram SMTP/Brevo, callbacks OAuth, site_url, RLS, base de dados ou secrets.');
if(!doApply){
 console.log('Pré-visualização apenas. Para aplicar, exporta SUPABASE_ACCESS_TOKEN localmente e usa --apply.');
 process.exit(0);
}
const token=String(process.env.SUPABASE_ACCESS_TOKEN||'').trim();
if(!token)throw Error('É necessário SUPABASE_ACCESS_TOKEN no ambiente local. Não partilhes a chave no chat.');
const call=async(method,body)=>{
 const resp=await fetch(API_URL,{method,redirect:'error',signal:AbortSignal.timeout(25000),
   headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},
   ...(body?{body:JSON.stringify(body)}:{})});
 if(!resp.ok)throw Error('Supabase Management API '+method+' HTTP '+resp.status+'. Confirma a autorização no dashboard.');
 return resp.json();
};
const before=await call('GET');
if(before.external_email_enabled!==true)throw Error('Login por email não está habilitado neste projeto. Confirma no Supabase Auth.');
if(!String(before.site_url||'').includes('zunga-auth.stivenluanda04.workers.dev'))
 console.warn('Atenção: URL principal diferente da origem de teste. O script não a altera.');
await call('PATCH',templates);
const after=await call('GET');
const mismatch=Object.entries(templates).filter(([key,value])=>String(after[key])!==String(value)).map(([key])=>key);
if(mismatch.length)throw Error('Aplicação incompleta: '+mismatch.join(', ')+'. Verifica no dashboard.');
console.log('Confirmado: modelos OTP em português e comprimento configurado para 6. Não foi enviado email de teste.');
console.log('SMTP Brevo e validade/rate limits permanecem nos valores previamente configurados.');
