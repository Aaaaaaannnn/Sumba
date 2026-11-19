// SUMBA only. Node >= 20. No dependency, no secret output, no persistent secret files.
import {readFile} from 'node:fs/promises';
import {createInterface} from 'node:readline/promises';
import {stdin,stdout} from 'node:process';
const REF='asxyjhaujsowmdrpkcqc';
const SITE='https://zunga-auth.stivenluanda04.workers.dev/';
const API='https://api.supabase.com/v1/projects/'+REF+'/config/auth';
const SMTP=(env,key)=>String(env['SUMBA_'+key]||env['ZUNGA_'+key]||'').trim();
// Legacy ZUNGA env names continue to work until the operator rotates credentials.
const file=(name)=>readFile(new URL('../supabase/auth-templates/'+name+'.html',import.meta.url),'utf8');
const templates=async()=>({
 mailer_subjects_invite:'Convite para a SUMBA',
 mailer_templates_invite_content:await file('invite'),
 mailer_subjects_email_change:'Confirma a alteração de email na SUMBA',
 mailer_templates_email_change_content:await file('email-change'),
 mailer_subjects_reauthentication:'Código de segurança SUMBA',
 mailer_templates_reauthentication_content:await file('reauthentication'),
 mailer_subjects_confirmation:'Confirma a tua conta SUMBA',
 mailer_templates_confirmation_content:await file('confirm-signup'),
 mailer_subjects_magic_link:'Código de acesso SUMBA',
 mailer_templates_magic_link_content:await file('magic-link'),
 mailer_subjects_recovery:'Recupera o acesso à SUMBA',
 mailer_templates_recovery_content:await file('recovery'),
 mailer_subjects_password_changed_notification:'Palavra-passe alterada na SUMBA',
 mailer_templates_password_changed_notification_content:await file('password-changed')
});
function emailConfig(env,t){
 const email=SMTP(env,'SMTP_EMAIL'),user=SMTP(env,'SMTP_USER'),key=SMTP(env,'SMTP_KEY');
 const host=SMTP(env,'SMTP_HOST')||'smtp-relay.brevo.com',port=SMTP(env,'SMTP_PORT')||'587';
 if(!/^[a-z0-9.-]{4,253}$/i.test(host)||!/^(?:25|465|587|2525)$/.test(port))throw Error('Host ou porta SMTP inválidos.');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!user||!key||user==='smtp-relay.brevo.com')throw Error('Dados SMTP incompletos ou inválidos.');
 return {...t,site_url:SITE,uri_allow_list:SITE,external_email_enabled:true,external_anonymous_users_enabled:false,mailer_autoconfirm:false,mailer_allow_unverified_email_sign_ins:false,mailer_secure_email_change_enabled:true,password_min_length:12,mailer_otp_length:6,mailer_otp_exp:600,smtp_max_frequency:60,smtp_host:host,smtp_port:port,smtp_admin_email:email,smtp_sender_name:'SUMBA',smtp_user:user,smtp_pass:key,mailer_notifications_password_changed_enabled:true};
}
function socialConfig(provider,env){
 if(!['google','facebook'].includes(provider))throw Error('Fornecedor não permitido.');
 const id=SMTP(env,provider.toUpperCase()+'_ID'),secret=SMTP(env,provider.toUpperCase()+'_SECRET');
 if(!id||!secret)throw Error('Credenciais OAuth em falta.');
 return {['external_'+provider+'_enabled']:true,['external_'+provider+'_client_id']:id,['external_'+provider+'_secret']:secret,['external_'+provider+'_email_optional']:false,security_manual_linking_enabled:true,...(provider==='google'?{external_google_skip_nonce_check:false}:{})};
}
function validateDeployed(html,csp,config){
 return /name="sumba-version"\s+content="0\.21\.2"/.test(html)&&html.includes('real.js')&&!html.includes('installV19')&&csp.includes("frame-ancestors 'none'")&&config.includes('origin:"'+SITE.slice(0,-1)+'"')&&config.includes('enabled:true');
}
async function checkSite(){
 const [page,cfg]=await Promise.all([fetch(SITE,{redirect:'error',signal:AbortSignal.timeout(15000)}),fetch(SITE+'config.js',{redirect:'error',signal:AbortSignal.timeout(15000)})]);
 if(!page.ok||!cfg.ok||!validateDeployed(await page.text(),page.headers.get('content-security-policy')||'',await cfg.text()))throw Error('Worker isolado não confirmado. Publica zunga-auth primeiro, sem alterar o Worker zunga.');
}
async function api(token,method,body){
 const r=await fetch(API,{method,redirect:'error',signal:AbortSignal.timeout(30000),headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 if(!r.ok)throw Error('Management API: HTTP '+r.status+' ('+method+'). Confirma permissões e configuração no dashboard. Resposta omitida por segurança.');
 return r.json();
}
function safeSummary(config){
 const keys=['site_url','external_email_enabled','external_anonymous_users_enabled','mailer_autoconfirm','mailer_otp_length','mailer_otp_exp','password_min_length','smtp_host','smtp_port','smtp_sender_name','external_google_enabled','external_facebook_enabled','security_manual_linking_enabled'];
 return Object.fromEntries(keys.filter(k=>k in config).map(k=>[k,config[k]]));
}
async function main(){
 const args=process.argv.slice(2),mode=args[0]||'email',apply=args.includes('--apply');
 if(!['email','google','facebook','status'].includes(mode)||args.some((x,i)=>i>0&&x!=='--apply')||mode==='status'&&apply)throw Error('Uso: node scripts/configure-sumba-auth.mjs email|google|facebook [--apply] ou status');
 if(!apply&&mode!=='status'){console.log('MODO DE PLANEAMENTO — nenhuma chamada à API.\nProjeto: '+REF+'\nOrigem dedicada: '+SITE+'\nOperação: '+mode+'\nUse --apply após configurar as variáveis de ambiente e confirmar o Worker.');return}
 const token=String(process.env.SUPABASE_ACCESS_TOKEN||'').trim();if(!token)throw Error('SUPABASE_ACCESS_TOKEN em falta. Não partilhes este token no chat.');
 if(mode==='status'){const current=await api(token,'GET');console.log('Auth SUMBA (sem segredos):',safeSummary(current));try{await checkSite();console.log('Worker: origin, conteúdo e CSP verificados.')}catch{console.log('Worker: publicação ou verificação pendente.')}return}
 const patch=mode==='email'?emailConfig(process.env,await templates()):socialConfig(mode,process.env);
 await checkSite();
 const before=await api(token,'GET');
 console.log('Configuração actual (sem segredos):',safeSummary(before));
 if(mode!=='email'&&before.site_url!==SITE)throw Error('Primeiro aplica a configuração de email/origem.');
 if(mode==='email'){
  const existing=String(before.uri_allow_list||'').split(',').map(x=>x.trim()).filter(x=>x&&x!==SITE);
  if(existing.length){console.log('ATENÇÃO: esta operação substitui a lista actual de redirects por apenas '+SITE+'; há '+existing.length+' endereço(s) anterior(es). Confirma que o projecto é exclusivamente SUMBA.')}
 }
 console.log('Alterações pretendidas (sem segredos):',safeSummary(patch));
 const rl=createInterface({input:stdin,output:stdout});
 let answer;try{answer=await rl.question('Escreve SUMBA para aplicar APENAS neste projecto: ')}finally{rl.close()}
 if(answer!=='SUMBA'){console.log('Cancelado.');return}
 await api(token,'PATCH',patch);
 const after=await api(token,'GET');
 const mismatches=Object.entries(safeSummary(patch)).filter(([k,v])=>String(after[k])!==String(v)).map(([k])=>k);
 for(const key of ['mailer_templates_confirmation_content','mailer_templates_magic_link_content','mailer_templates_recovery_content','mailer_templates_email_change_content','mailer_templates_reauthentication_content','mailer_templates_invite_content'])if(key in patch&&after[key]!==patch[key])mismatches.push(key);
 if(mismatches.length)throw Error('Configuração parcialmente não confirmada: '+mismatches.join(', ')+'. Verifica no Dashboard.');
 console.log('Configuração confirmada por leitura: ',safeSummary(after));
 console.log('Isto não confirma entrega de email nem login OAuth. Faz o ensaio real no Worker dedicado.');
}
main().catch(e=>{console.error(e?.message||'Falha.');process.exitCode=1});
