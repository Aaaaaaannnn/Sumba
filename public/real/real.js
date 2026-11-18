'use strict';
(() => {
const $=id=>document.getElementById(id), cfg=window.ZUNGA_REAL_CONFIG||{}, roles={buyer:'Cliente',producer:'Fornecedor',company:'Empresa',courier:'Entregador',admin:'Administração'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validConfig=c=>c.enabled===true&&c.origin===location.origin&&/^https:\/\/[a-z0-9]{20}\.supabase\.co$/.test(c.url||'')&&/^sb_publishable_[A-Za-z0-9_-]+$/.test(c.publishableKey||'')&&location.protocol==='https:'&&location.pathname==='/'&&location.origin!=='https://zunga.stivenluanda04.workers.dev';
const redirect=location.origin+'/';
const providers={google:'Google',facebook:'Facebook'};
const otpTypes={register:'email',otp:'email',reset:'recovery'};
let pending=null,nextSend=0,otpTimer=null;
let client,user=null,profile=null,recovery=false,busy=false,generation=0;
const notice=(s='',error=false)=>{$('notice').textContent=s;$('notice').classList.toggle('error',error)};
const screen=html=>{if(otpTimer){clearInterval(otpTimer);otpTimer=null}$('content').innerHTML=html};
const label=(name,key,value='',attrs='')=>'<label>'+esc(name)+'<input name="'+key+'" value="'+esc(value)+'" '+attrs+'></label>';
const textarea=(name,key,value='',max=600)=>'<label>'+esc(name)+'<textarea name="'+key+'" maxlength="'+max+'">'+esc(value)+'</textarea></label>';
const button=(title,act)=>'<button type="button" class="outline" data-action="'+act+'">'+esc(title)+'</button>';
const terms='<details><summary>Condições do piloto (versão pilot-1)</summary><p>A SUMBA é uma plataforma em desenvolvimento. Neste piloto não há compras, pagamentos, cobranças, garantias de entrega ou contratos celebrados pelo sistema. O email é usado para autenticação; nome, localização aproximada, apresentação e foto são usados no perfil. Bancadas publicadas exibem publicamente nome comercial, localização e descrição. Não introduzas dados sensíveis, documentos, contactos de terceiros ou conteúdo ilegal. Usa apenas conteúdo que tens direito a publicar. A versão de teste não substitui os termos e política de privacidade definitivos. A eliminação da conta deverá ser disponibilizada antes do lançamento público; para testes, solicita apoio ao responsável pelo piloto.</p></details>';
const agree=()=>terms+'<label class="check"><input type="checkbox" name="agree" required> Li e aceito as condições do piloto.</label>';

function socialButtons(link=false,identities=[]){
 return Object.entries(providers).map(([id,name])=>{const linked=identities.includes(id);return '<button type="button" class="social '+id+'" data-action="'+(link?'link-':'oauth-')+id+'" '+(linked?'disabled':'')+'><span class="provider-icon" aria-hidden="true">'+(id==='google'?'G':'f')+'</span>'+esc(linked?name+' vinculado':(link?'Vincular ':'Continuar com ')+name)+'</button>'}).join('');
}
function authScreen(mode='login',email=''){
 const login=mode==='login',register=mode==='register',reset=mode==='reset',otp=mode==='otp';
 const password=login||register;
 screen('<div class="hero"><span class="pill">CONTA SUMBA</span><h1>'+ (login?'Entra na SUMBA':register?'Cria a tua conta':reset?'Recuperar acesso':'Entrar com código')+'</h1><p>Do campo ao mercado. Uma conta para o teu perfil real.</p></div><div class="panel auth-panel"><form id="authForm" data-mode="'+mode+'">'+label('Email','email',email,'type="email" required autocomplete="email" maxlength="254"')+(password?label('Palavra-passe','password','','type="password" required '+(register?'minlength="12" ':'')+'maxlength="128" autocomplete="'+(register?'new-password':'current-password')+'"'):'')+(register?label('Confirmar palavra-passe','confirm','','type="password" required minlength="12" maxlength="128" autocomplete="new-password"')+agree():'')+'<button type="submit">'+(login?'Entrar':register?'Criar conta':'Enviar código por email')+'</button></form><div class="actions">'+(login?button('Entrar com código','otp')+button('Esqueci a palavra-passe','reset')+button('Criar conta','register'):button('Voltar ao login','login'))+'</div>'+((login||register)?'<div class="or"><span>ou</span></div><div class="socials">'+socialButtons()+'</div>':'')+'</div><p class="muted">Piloto real separado do marketplace demonstrativo. Não uses a palavra-passe de demonstração.</p>');
}
function otpScreen(){
 if(!pending)return authScreen();
 const {mode,email}=pending;
 screen('<div class="hero"><h1>Verifica o teu email</h1><p>Introduz o código de seis algarismos.</p></div><div class="panel"><p>Se o pedido foi aceite, o código foi solicitado para <strong>'+esc(email)+'</strong>. Verifica também o spam.</p><form id="otpForm">'+label('Código de verificação','token','','inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" minlength="6" maxlength="6" required')+'<button type="submit">Verificar código</button></form><div class="actions"><button type="button" class="outline" data-action="resend" id="resendCode">Reenviar código</button>'+button('Alterar email','change-email')+'</div><p class="muted">O código expira conforme a configuração do servidor. Nunca partilhes o teu código.</p></div>');
 const tick=()=>{const b=$('resendCode');if(!b)return;const secs=Math.max(0,Math.ceil((nextSend-Date.now())/1000));b.disabled=busy||secs>0;b.textContent=secs?'Reenviar em '+secs+' s':'Reenviar código';if(!secs&&otpTimer){clearInterval(otpTimer);otpTimer=null}};
 tick();otpTimer=setInterval(tick,1000);
}
function authError(e){
 const code=String(e?.code||'');
 if(['invalid_credentials','email_not_confirmed'].includes(code))return 'Não foi possível entrar. Confirma o email e a palavra-passe, ou usa um código.';
 if(['otp_expired','otp_disabled','bad_code_verifier','flow_state_not_found','flow_state_expired'].includes(code))return 'Código inválido ou expirado. Solicita um novo código neste navegador.';
 if(['over_email_send_rate_limit','over_request_rate_limit','over_sms_send_rate_limit'].includes(code)||e?.status===429)return 'Aguarda antes de solicitar outro código.';
 if(['provider_disabled','oauth_provider_not_supported','manual_linking_disabled','identity_already_exists','identity_not_found'].includes(code))return 'Este método de acesso não está disponível ou já está associado a outra conta. Contacta o suporte.';
 if(['weak_password','same_password'].includes(code))return 'Escolhe uma palavra-passe nova e mais forte, com pelo menos 12 caracteres.';
 return e?.name==='AuthRetryableFetchError'?'Ligação indisponível. Tenta novamente.':'Não foi possível concluir. Verifica os dados ou tenta mais tarde.';
}
async function requestCode(mode,email,resend=false){
 if(!['register','otp','reset'].includes(mode))throw Error('invalid-mode');
 if(Date.now()<nextSend)throw {code:'over_email_send_rate_limit'};
 if(mode==='register'){if(!resend)throw Error('invalid-mode');checked(await client.auth.resend({type:'signup',email,options:{emailRedirectTo:redirect}}))}
 else if(mode==='reset')checked(await client.auth.resetPasswordForEmail(email,{redirectTo:redirect}));
 else checked(await client.auth.signInWithOtp({email,options:{shouldCreateUser:false,emailRedirectTo:redirect}}));
 nextSend=Date.now()+60000;pending={mode,email};otpScreen();notice('Pedido de código processado. Consulta a caixa de entrada.');
}
function onboarding(){
 screen('<h1>Completa o teu perfil</h1><div class="panel"><p>Conta autenticada. Escolhe o teu tipo de acesso. Administração e entregas são atribuídas pelo responsável, nunca por auto-registo.</p><form id="onboarding">'+label('Nome','name','','required minlength="2" maxlength="80" autocomplete="name"')+'<label>Tipo de conta<select name="role"><option value="buyer">Cliente</option><option value="producer">Fornecedor</option><option value="company">Empresa</option></select></label>'+label('Província','province','','maxlength="80"')+label('Município','city','','maxlength="80"')+agree()+'<button type="submit">Guardar perfil</button></form></div>'+button('Terminar sessão','logout'));
}
function recoveryScreen(){screen('<h1>Nova palavra-passe</h1><div class="panel"><form id="recovery">'+label('Nova palavra-passe','password','','type="password" minlength="12" required autocomplete="new-password"')+label('Confirmar palavra-passe','confirm','','type="password" minlength="12" required autocomplete="new-password"')+'<button type="submit">Atualizar palavra-passe</button></form></div>')}
const checked=r=>{if(r.error)throw r.error;return r.data};
async function load(){
 const ticket=++generation;
 try{
  const result=await client.auth.getUser();if(ticket!==generation)return;
  if(result.error||!result.data.user){user=null;profile=null;if(pending)otpScreen();else authScreen();notice('Entra ou cria uma conta de teste real.');return}
  user=result.data.user;if(!user.email_confirmed_at){await client.auth.signOut();user=null;profile=null;authScreen();notice('Confirma primeiro o email.',true);return}if(recovery){recoveryScreen();notice('Define uma nova palavra-passe.');return}
  profile=checked(await client.from('zunga_profiles').select('*').eq('user_id',user.id).maybeSingle());if(ticket!==generation)return;
  if(!profile){onboarding();notice('Completa o perfil para continuar.');return}
  await dashboard(ticket);
 }catch(e){if(ticket!==generation)return;notice('Não foi possível carregar os dados. Verifica a ligação e a configuração da base de dados.',true);screen('<div class="panel"><h2>Ligação indisponível</h2>'+button('Tentar novamente','reload')+button('Terminar sessão','logout')+'</div>')}
}
async function dashboard(ticket){
 let stall=null,company=null,avatar='',catalog=[];
 if(profile.role==='producer')stall=checked(await client.from('zunga_stalls').select('*').eq('owner_id',user.id).maybeSingle());
 if(profile.role==='company')company=checked(await client.from('zunga_companies').select('*').eq('owner_id',user.id).maybeSingle());
 if(profile.avatar_path){const r=await client.storage.from('zunga-avatars').createSignedUrl(profile.avatar_path,300);if(!r.error)avatar=r.data.signedUrl}
 const identities=checked(await client.auth.getUserIdentities()).identities.map(i=>i.provider);catalog=checked(await client.from('zunga_stalls').select('id,name,province,city,description').eq('published',true).order('name').limit(50));if(ticket!==generation)return;
 screen('<div class="hero"><span class="pill">'+esc(roles[profile.role])+'</span><h1>Olá, '+esc(profile.display_name)+'</h1><p>Perfil guardado na base de dados. Compras e outros módulos comerciais ainda não estão ligados.</p></div><div class="panel"><div class="row">'+(avatar?'<img class="avatar" alt="Foto de perfil" src="'+esc(avatar)+'">':'<div class="avatar avatar-fallback">'+esc(profile.display_name[0])+'</div>')+'<div><h2>'+esc(profile.display_name)+'</h2><span class="muted">'+esc(user.email)+'</span></div></div><form id="editProfile">'+label('Nome','name',profile.display_name,'required minlength="2" maxlength="80"')+label('Província','province',profile.province,'maxlength="80"')+label('Município','city',profile.city,'maxlength="80"')+textarea('Apresentação','bio',profile.bio)+'<label>Foto de perfil (até 1 MB)<input type="file" name="avatar" accept="image/jpeg,image/png,image/webp"></label><button type="submit">Guardar perfil</button></form>'+(profile.avatar_path?button('Remover foto','removeAvatar'):'')+'</div>'+
 (profile.role==='producer'?'<div class="panel"><h2>A minha bancada</h2><form id="stall" data-exists="'+!!stall+'">'+label('Nome comercial','name',stall?.name,'required minlength="2" maxlength="100"')+label('Província','province',stall?.province||profile.province,'required minlength="2" maxlength="80"')+label('Município','city',stall?.city||profile.city,'required minlength="2" maxlength="80"')+textarea('Descrição','description',stall?.description,1000)+'<label class="check"><input type="checkbox" name="published" '+(stall?.published?'checked':'')+'> Publicar nome, localização e descrição no diretório</label><button type="submit">Guardar bancada</button></form></div>':'')+
 (profile.role==='company'?'<div class="panel"><h2>A minha empresa</h2><form id="company" data-exists="'+!!company+'">'+label('Nome comercial','name',company?.name,'required minlength="2" maxlength="100"')+label('Setor','sector',company?.sector,'maxlength="100"')+label('Província','province',company?.province||profile.province,'maxlength="80"')+label('Município','city',company?.city||profile.city,'maxlength="80"')+'<button type="submit">Guardar empresa</button></form></div>':'')+
 '<div class="panel"><h2>Métodos de acesso</h2><p class="muted">Vincula um método adicional à mesma conta. A confirmação é feita pelo fornecedor, nunca pela aplicação.</p><div class="socials">'+socialButtons(true,identities)+'</div><p class="muted">Métodos associados: '+esc(identities.map(i=>providers[i]|| (i==='email'?'Email':i)).join(', '))+'</p></div>'+
 '<div class="panel"><h2>Bancadas publicadas</h2><p class="muted">Diretório real — sem dados fictícios.</p><div class="list">'+(catalog.length?catalog.map(s=>'<article><h2>'+esc(s.name)+'</h2><p class="muted">'+esc(s.city)+', '+esc(s.province)+'</p><p>'+esc(s.description)+'</p></article>').join(''):'<p>Ainda não existem bancadas publicadas.</p>')+'</div></div><div class="actions">'+button('Atualizar dados','reload')+button('Terminar sessão','logout')+'</div>');
 notice('Sessão autenticada · dados sincronizados com o servidor.');
}
async function execute(f){
 const v=new FormData(f),s=k=>String(v.get(k)||'').trim(),p=k=>String(v.get(k)||'');
 if(f.id==='authForm'){
  const mode=f.dataset.mode,email=s('email');
  if(mode==='register'){
   if(!v.has('agree')||p('password')!==p('confirm')||p('password').length<12){notice('Aceita as condições e confirma a palavra-passe de pelo menos 12 caracteres.',true);return}
   if(Date.now()<nextSend)throw {code:'over_email_send_rate_limit'};
   const r=checked(await client.auth.signUp({email,password:p('password'),options:{emailRedirectTo:redirect}}));
   if(r.session){await client.auth.signOut();notice('O servidor não está configurado para exigir confirmação de email. Contacta o responsável.',true);return}
   nextSend=Date.now()+60000;pending={mode,email};otpScreen();notice('Consulta o teu email para confirmar a conta.');return
  }
  if(mode==='reset'||mode==='otp'){await requestCode(mode,email);return}
  if(mode!=='login')return;
  pending=null;checked(await client.auth.signInWithPassword({email,password:p('password')}));await load();return
 }
 if(f.id==='otpForm'){
  if(!pending||!/^\d{6}$/.test(s('token'))) {notice('Introduz um código de seis algarismos.',true);return}
  const {mode,email}=pending;
  const resetting=mode==='reset';recovery=resetting;
  try{const result=checked(await client.auth.verifyOtp({email,token:s('token'),type:otpTypes[mode]}));if(!result.session)throw {code:'otp_expired'};pending=null;nextSend=0;await load()}catch(e){recovery=false;throw e}
  return
 }
 if(f.id==='recovery'){if(p('password')!==p('confirm')){notice('As palavras-passe não coincidem.',true);return}if(!recovery||p('password').length<12){notice('A recuperação não está activa ou a palavra-passe é curta.',true);return}checked(await client.auth.updateUser({password:p('password')}));recovery=false;pending=null;const result=await client.auth.signOut({scope:'global'});if(result.error){screen('<div class="panel"><h1>Palavra-passe alterada</h1><p>Não foi possível terminar todas as sessões. Tenta terminar a sessão novamente.</p>'+button('Terminar sessão','logout')+'</div>');notice('A alteração foi guardada; o logout não foi confirmado.',true);return}user=null;profile=null;authScreen();notice('Palavra-passe alterada. Entra novamente.');return}
 if(!user)throw Error('Inicia sessão.');
 if(f.id==='onboarding'){if(!v.has('agree')||!['buyer','producer','company'].includes(s('role')))throw Error('Confirma o tipo de conta e as condições.');checked(await client.from('zunga_profiles').insert({user_id:user.id,role:s('role'),display_name:s('name'),province:s('province'),city:s('city'),terms_version:'pilot-1'}));await load();return}
 if(!profile)throw Error('Completa o perfil.');
 if(f.id==='editProfile'){
  const change={display_name:s('name'),province:s('province'),city:s('city'),bio:s('bio')},file=v.get('avatar');
  if(file?.size){if(file.size>1048576||!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Escolhe JPG, PNG ou WebP até 1 MB.');const path=user.id+'/avatar';checked(await client.storage.from('zunga-avatars').upload(path,file,{upsert:true,contentType:file.type}));change.avatar_path=path}
  checked(await client.from('zunga_profiles').update(change).eq('user_id',user.id).select('user_id').single())
 }else if(f.id==='stall'&&profile.role==='producer'){
  const data={name:s('name'),province:s('province'),city:s('city'),description:s('description'),published:v.has('published')};const table=client.from('zunga_stalls');checked(await(f.dataset.exists==='true'?table.update(data).eq('owner_id',user.id).select('id').single():table.insert({...data,owner_id:user.id}).select('id').single()))
 }else if(f.id==='company'&&profile.role==='company'){
  const data={name:s('name'),sector:s('sector'),province:s('province'),city:s('city')};const table=client.from('zunga_companies');checked(await(f.dataset.exists==='true'?table.update(data).eq('owner_id',user.id).select('owner_id').single():table.insert({...data,owner_id:user.id}).select('owner_id').single()))
 }else return;
 await load();if(profile)notice('Alterações guardadas no servidor.');
}
async function run(work){if(busy)return;busy=true;const previous=Array.from(document.querySelectorAll('button')).map(b=>[b,b.disabled]);previous.forEach(([b])=>b.disabled=true);try{await work()}catch(e){notice(authError(e),true)}finally{busy=false;previous.forEach(([b,disabled])=>{b.disabled=disabled});const resend=$('resendCode');if(resend)resend.disabled=Date.now()<nextSend}}
document.addEventListener('submit',e=>{if(!['authForm','otpForm','onboarding','editProfile','stall','company','recovery'].includes(e.target.id))return;e.preventDefault();run(()=>execute(e.target))});
document.addEventListener('click',e=>{const action=e.target.closest('[data-action]')?.dataset.action;if(!action||busy)return;if(['login','register','reset','otp','change-email'].includes(action)){const old=pending;pending=null;authScreen(action==='change-email'?old?.mode||'login':action,action==='change-email'?old?.email||'':'');notice();return}run(async()=>{if(action==='resend'&&pending){await requestCode(pending.mode,pending.email,true);return}if(action.startsWith('oauth-')||action.startsWith('link-')){const provider=action.split('-')[1];if(!Object.hasOwn(providers,provider))return;const options={redirectTo:redirect};if(action.startsWith('link-')){if(!user||recovery)return;checked(await client.auth.linkIdentity({provider,options}))}else{pending=null;checked(await client.auth.signInWithOAuth({provider,options}))}return}if(action==='logout'){generation++;checked(await client.auth.signOut());user=null;profile=null;recovery=false;pending=null;authScreen();notice('Sessão terminada.')}else if(action==='reload')await load();else if(action==='removeAvatar'&&user&&profile){checked(await client.from('zunga_profiles').update({avatar_path:null}).eq('user_id',user.id).select('user_id').single());checked(await client.storage.from('zunga-avatars').remove([user.id+'/avatar']));await load()}})});
async function start(){
 if(!validConfig(cfg)){notice('Backend ainda não configurado. Não é possível criar contas reais.',true);screen('<div class="panel"><h1>A fundação real está preparada</h1><p>O ambiente de autenticação exige uma origem HTTPS dedicada e configuração do Supabase. Não introduzas credenciais nesta página.</p><a class="button outline" href="https://zunga.stivenluanda04.workers.dev/">Explorar demonstração</a></div>');return}
 const callback=new URLSearchParams(location.search),hasError=callback.has('error')||new URLSearchParams(location.hash.slice(1)).has('error');
 try{const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.0/+esm');client=createClient(cfg.url,cfg.publishableKey,{auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'zunga-real-auth-v012'}});
 client.auth.onAuthStateChange((event)=>{if(event==='PASSWORD_RECOVERY'){recovery=true;setTimeout(()=>{if(!busy)load()},0)}else if(event==='SIGNED_OUT'){generation++;user=null;profile=null;recovery=false;pending=null;authScreen();notice('Sessão terminada.')}});
 await load();
 if(hasError){history.replaceState(null,'',redirect);notice('Não foi possível concluir o acesso social. Tenta novamente.',true)}
 }catch(e){notice('Não foi possível ligar o serviço de autenticação.',true);screen('<div class="panel"><h1>Ligação indisponível</h1><a class="button outline" href="/">Tentar novamente</a></div>')}
}
start();
})();