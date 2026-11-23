'use strict';
(() => {
const $=id=>document.getElementById(id), cfg=window.ZUNGA_REAL_CONFIG||{}, roles={buyer:'Cliente',producer:'Fornecedor',company:'Empresa',courier:'Entregador',admin:'Administração'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validConfig=c=>c.enabled===true&&c.routes?.some?.(r=>r.origin===location.origin&&r.path===location.pathname)&&/^https:\/\/[a-z0-9]{20}\.supabase\.co$/.test(c.url||'')&&/^sb_publishable_[A-Za-z0-9_-]+$/.test(c.publishableKey||'')&&location.protocol==='https:';
const redirect=location.origin+location.pathname;
const entryMode=new URLSearchParams(location.search).get('flow')==='register'?'register':'login';
const providers={google:'Google'};
const otpTypes={register:'email',otp:'email',reset:'recovery'};
const pendingKey='sumba-auth-otp-v2';
let pending=null,nextSend=0,otpTimer=null;

const isEmail=value=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone=value=>/^\+[1-9]\d{7,14}$/.test(value);
let authChannel='email';
const restorePending=()=>{try{
 const x=JSON.parse(sessionStorage.getItem(pendingKey)||'null');
 if(x&&['register','reset','otp'].includes(x.mode)&&['email','phone'].includes(x.channel)&&
 (x.channel==='email'?isEmail(x.identifier):isPhone(x.identifier))&&x.expiresAt>Date.now()&&x.expiresAt<=Date.now()+601000){
  pending={mode:x.mode,identifier:x.identifier,channel:x.channel};
  authChannel=x.channel;nextSend=Math.max(0,Math.min(x.nextSend||0,Date.now()+60000));
 }
}catch{}};
const setPending=(mode,identifier,channel)=>{pending={mode,identifier,channel};
 try{sessionStorage.setItem(pendingKey,JSON.stringify({mode,identifier,channel,nextSend,expiresAt:Date.now()+600000}))}catch{}};
const clearPending=()=>{pending=null;nextSend=0;try{sessionStorage.removeItem(pendingKey)}catch{}};
restorePending();

// Email-only navigation aid: the link carries an address, never a token or a session.
// Supabase still validates the six-digit OTP on the server.
function resumeOtpFromEmailLink(){
 const prefix='#email-otp=';
 if(!location.hash?.startsWith(prefix))return false;
 let identifier;
 try{identifier=decodeURIComponent(location.hash.slice(prefix.length)).trim().toLowerCase()}catch{return false}
 if(!isEmail(identifier))return false;
 setPending('otp',identifier,'email');nextSend=0;
 history.replaceState?.(null,'',redirect); // remove the email from browser history/navigation URL
 return true;
}

let client,user=null,profile=null,recovery=false,busy=false,generation=0;
const notice=(s='',error=false)=>{$('notice').textContent=s;$('notice').classList.toggle('error',error)};
const screen=html=>{if(otpTimer){clearInterval(otpTimer);otpTimer=null}$('content').innerHTML=html};
const label=(name,key,value='',attrs='')=>'<label>'+esc(name)+'<input name="'+key+'" value="'+esc(value)+'" '+attrs+'></label>';
const textarea=(name,key,value='',max=600)=>'<label>'+esc(name)+'<textarea name="'+key+'" maxlength="'+max+'">'+esc(value)+'</textarea></label>';
const button=(title,act)=>'<button type="button" class="outline" data-action="'+act+'">'+esc(title)+'</button>';
const terms='<details><summary>Condições de utilização</summary><p>A SUMBA é uma plataforma em desenvolvimento. Perfis, bancadas, produtos, cestos e contactos com fornecedores são guardados na conta autenticada. Compras concluídas, pagamentos, cobranças, garantias de entrega e contratos ainda não são processados pelo sistema. O email ou o número de telemóvel é usado para autenticação; nome, localização aproximada, apresentação e foto são usados no perfil. Bancadas publicadas exibem publicamente nome comercial, localização e descrição. Não introduzas dados sensíveis, documentos, contactos de terceiros ou conteúdo ilegal. Usa apenas conteúdo que tens direito a publicar. As condições e a política de privacidade definitivas serão publicadas antes do lançamento comercial. A eliminação da conta deverá ser disponibilizada antes do lançamento público; para testes, solicita apoio ao responsável pelo piloto.</p></details>';
const agree=()=>terms+'<label class="check"><input type="checkbox" name="agree" required> Li e aceito as condições do piloto.</label>';


function socialButtons(link=false,identities=[]){
 return Object.entries(providers).map(([id,name])=>{
  const linked=identities.includes(id);
  return '<button type="button" class="social '+id+'" data-action="'+(link?'link-':'oauth-')+id+'" '+(linked?'disabled':'')+'><span class="provider-icon" aria-hidden="true">G</span>'+esc(linked?name+' vinculado':(link?'Vincular ':'Continuar com ')+name)+'</button>';
 }).join('')+(link?'':'<button type="button" class="social facebook" disabled aria-disabled="true" title="Disponível brevemente"><span class="provider-icon" aria-hidden="true">f</span>Continuar com Facebook (brevemente)</button>');
}


function authScreen(mode='login',identifier='',channel=authChannel){
 document.getElementById('sumbaNotifications')?.remove();
 authChannel=channel==='phone'?'phone':'email';
 const login=mode==='login'||mode==='password',register=mode==='register',reset=mode==='reset',passwordLogin=mode==='password';
 const password=passwordLogin||register,phone=authChannel==='phone';
 const tabs='<div class="auth-tabs" role="group" aria-label="Método de acesso"><button type="button" class="'+(!phone?'selected':'')+'" data-action="channel-email" aria-pressed="'+(!phone)+'">Email</button><button type="button" class="'+(phone?'selected':'')+'" data-action="channel-phone" aria-pressed="'+phone+'">Telemóvel</button></div>';
 const field=phone?
  label('Número de telemóvel','phone',identifier,'type="tel" inputmode="tel" placeholder="+2449XXXXXXXX" pattern="\\+[1-9][0-9]{7,14}" required autocomplete="tel" maxlength="16"'):
  label('Email','email',identifier,'type="email" required autocomplete="email" maxlength="254"');
 screen('<div class="hero"><div class="auth-hero-identity"><img src="./assets/sumba-icon.svg" alt="Emblema da SUMBA" width="132" height="132"><div><strong>SUMBA</strong><small>Do campo à sua mesa.</small></div></div><span class="pill">CONTA SUMBA</span><h1>'+
 (login?(passwordLogin?'Entrar com palavra-passe':'Entra na SUMBA'):register?'Cria a tua conta':reset?'Recuperar acesso':'Entrar com código')+
 '</h1><p>Uma conta pessoal, protegida e confirmada por '+(phone?'SMS.':'email.')+'</p></div>'+
 '<div class="panel auth-panel">'+tabs+
 '<form id="authForm" data-mode="'+mode+'" data-channel="'+authChannel+'">'+field+
 (password?label('Palavra-passe','password','','type="password" required '+(register?'minlength="12" ':'')+'maxlength="128" autocomplete="'+(register?'new-password':'current-password')+'"'):'')+
 (register?label('Confirmar palavra-passe','confirm','','type="password" required minlength="12" maxlength="128" autocomplete="new-password"')+agree():'')+
 '<button type="submit">'+(login?(passwordLogin?'Entrar com palavra-passe':'Receber código de 6 dígitos'):register?'Criar conta':reset?'Receber código de recuperação':'Enviar código de acesso')+'</button></form>'+
 '<div class="actions">'+(login?(passwordLogin?button('Entrar com código','login'):button('Usar palavra-passe','password'))+button('Esqueci a palavra-passe','reset')+button('Criar conta','register'):button('Voltar ao login','login'))+'</div>'+
 ((login||register)?'<div class="or"><span>ou</span></div><div class="socials">'+socialButtons()+'</div>':'')+
 '<p class="muted">'+(phone?'Usa o formato internacional, por exemplo +2449XXXXXXXX. O envio depende da activação do serviço SMS.':'A confirmação e os códigos são enviados pelo serviço de email da SUMBA.')+'</p></div>');
}


function otpScreen(){
 if(!pending)return authScreen();
 const {identifier,channel,mode}=pending,phone=channel==='phone';
 const title=mode==='reset'?'Recupera o teu acesso':'Verifica o teu '+(phone?'telemóvel':'email');
 screen('<div class="hero sumba-otp-hero">'+
 '<div class="auth-hero-identity compact"><img src="./assets/sumba-icon.svg" alt="Emblema SUMBA"><div><strong>SUMBA</strong><small>Do campo à sua mesa.</small></div></div>'+
 '<span class="pill">VERIFICAÇÃO SEGURA</span><h1>'+title+'</h1>'+
 '<p>Introduz o código de 6 dígitos enviado '+(phone?'por SMS.':'para o teu email. Nenhum link é necessário.')+'</p></div>'+
 '<div class="panel sumba-otp-panel"><div class="otp-identity"><span class="otp-identity-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"></rect><path d="m3.5 7 8.5 6.3L20.5 7"></path></svg></span><div><span class="muted">Código enviado para</span><strong>'+esc(identifier)+'</strong></div></div>'+
 '<form id="otpForm" autocomplete="on"><label for="otpCode" class="otp-label">Código de verificação</label>'+
 '<div class="otp-control" id="otpControl"><input id="otpCode" class="otp-input" name="token" type="text" inputmode="numeric" pattern="[0-9]{6}" autocomplete="one-time-code" maxlength="6" minlength="6" required aria-label="Código de verificação de seis dígitos" aria-describedby="otpHint">'+
 '<div class="otp-digits" aria-hidden="true">'+Array.from({length:6},(_,i)=>'<span class="otp-digit'+(i===0?' current':'')+'"></span>').join('')+'</div></div>'+
 '<p class="otp-hint" id="otpHint">Toca nas caixas para abrir o teclado numérico. Também podes colar o código completo.</p>'+
 '<button class="otp-submit" type="submit">Confirmar código</button></form>'+
 '<div class="otp-divider"></div><div class="actions otp-actions">'+
 '<button type="button" class="outline" data-action="resend" id="resendCode">Reenviar código</button>'+
 button('Alterar '+(phone?'número':'email'),'change-identifier')+'</div>'+
 '<p class="muted otp-security">O código é de utilização única e tem validade limitada. Nunca o partilhes.</p></div>');
 const input=$('otpCode'),slots=Array.from(document.querySelectorAll('.otp-digit'));
 const update=()=>{
  if(!input)return;
  const clean=input.value.replace(/[^0-9]/g,'').slice(0,6);
  if(clean!==input.value)input.value=clean;
  slots.forEach((slot,i)=>{
   slot.textContent=clean[i]||'';
   slot.classList.toggle('filled',i<clean.length);
   slot.classList.toggle('current',i===Math.min(clean.length,5));
  });
  $('otpControl')?.classList.toggle('complete',clean.length===6);
 };
 if(input){
  input.addEventListener('input',update);
  input.addEventListener('paste',event=>{
   const digits=(event.clipboardData?.getData('text')||'').replace(/[^0-9]/g,'').slice(0,6);
   if(!digits)return;
   event.preventDefault();
   input.value=digits;update();
  });
  input.addEventListener('focus',update);
  update();
 }
 const tick=()=>{const b=$('resendCode');if(!b)return;const secs=Math.max(0,Math.ceil((nextSend-Date.now())/1000));b.disabled=busy||secs>0;b.textContent=secs?'Reenviar em '+secs+' s':'Reenviar código';if(!secs&&otpTimer){clearInterval(otpTimer);otpTimer=null}};
 tick();otpTimer=setInterval(tick,1000);
 // A maioria dos browsers móveis só abre o teclado após gesto do utilizador.
 // O toque nas caixas foca o único input real e ativa o teclado numérico.
}


function authError(e){
 const code=String(e?.code||''),message=String(e?.message||'').toLowerCase();
 if(['invalid_credentials','email_not_confirmed','phone_not_confirmed'].includes(code))return 'Não foi possível entrar. Confirma a identidade e a palavra-passe, ou usa um código.';
 if(['otp_expired','otp_disabled','bad_code_verifier','flow_state_not_found','flow_state_expired'].includes(code))return 'Código inválido ou expirado. Solicita um novo código.';
 if(['over_email_send_rate_limit','over_request_rate_limit','over_sms_send_rate_limit'].includes(code)||e?.status===429)return 'Aguarda antes de solicitar outro código.';
 if(['sms_provider_disabled','phone_provider_disabled','sms_send_failed','sms_send_error','sms_not_configured'].includes(code)||message.includes('sms provider')||message.includes('sms not enabled')||message.includes('phone signups are disabled'))
  return 'O envio de SMS ainda não está activo. É necessário configurar um fornecedor SMS no Supabase.';
 if(['provider_disabled','oauth_provider_not_supported'].includes(code)||message.includes('provider is not enabled'))
  return 'O login com Google precisa de ser activado e configurado no Supabase.';
 if(['manual_linking_disabled','identity_already_exists','identity_not_found'].includes(code))return 'Este método já está associado a outra conta ou ainda não pode ser vinculado.';
 if(['weak_password','same_password'].includes(code))return 'Escolhe uma palavra-passe nova e mais forte, com pelo menos 12 caracteres.';
 if(code==='invalid_phone'||message.includes('invalid phone'))return 'Número inválido. Usa o formato internacional, por exemplo +2449XXXXXXXX.';
 return e?.name==='AuthRetryableFetchError'?'Ligação indisponível. Tenta novamente.':'Não foi possível concluir. Confirma os dados e a configuração do serviço.';
}


async function requestCode(mode,identifier,channel='email',resend=false){
 if(!['register','otp','reset'].includes(mode))throw Error('invalid-mode');
 if(Date.now()<nextSend)throw {code:'over_request_rate_limit'};
 if(channel==='phone'){
  if(!isPhone(identifier))throw {code:'invalid_phone'};
  if(mode==='register'){
   if(!resend)throw Error('invalid-mode');
   checked(await client.auth.resend({type:'sms',phone:identifier}));
  }else{
   checked(await client.auth.signInWithOtp({phone:identifier,options:{shouldCreateUser:false,channel:'sms'}}));
  }
 }else{
  if(!isEmail(identifier))throw Error('invalid-email');
  if(mode==='register'){
   if(!resend)throw Error('invalid-mode');
   checked(await client.auth.resend({type:'signup',email:identifier,options:{emailRedirectTo:redirect}}));
  }else if(mode==='reset')checked(await client.auth.resetPasswordForEmail(identifier,{redirectTo:redirect}));
  else checked(await client.auth.signInWithOtp({email:identifier,options:{shouldCreateUser:false,emailRedirectTo:redirect}}));
 }
 nextSend=Date.now()+60000;
 setPending(mode,identifier,channel);otpScreen();
 notice('Se o pedido foi aceite, receberás um código por '+(channel==='phone'?'SMS.':'email.'));
}

function onboarding(){
 screen('<div class="auth-hero-identity compact"><img src="./assets/sumba-icon.svg" alt="Emblema SUMBA"><div><strong>SUMBA</strong><small>Do campo à sua mesa.</small></div></div>'+'<h1>Completa o teu perfil</h1><div class="panel"><p>Conta autenticada. Escolhe o teu tipo de acesso. Administração e entregas são atribuídas pelo responsável, nunca por auto-registo.</p><form id="onboarding">'+label('Nome','name','','required minlength="2" maxlength="80" autocomplete="name"')+'<label>Tipo de conta<select name="role"><option value="buyer">Cliente</option><option value="producer">Fornecedor</option><option value="company">Empresa</option></select></label>'+label('Província','province','','maxlength="80"')+label('Município','city','','maxlength="80"')+agree()+'<button type="submit">Guardar perfil</button></form></div>'+button('Terminar sessão','logout'));
}
function recoveryScreen(){screen('<div class="auth-hero-identity compact"><img src="./assets/sumba-icon.svg" alt="Emblema SUMBA"><div><strong>SUMBA</strong><small>Do campo à sua mesa.</small></div></div>'+'<h1>Nova palavra-passe</h1><div class="panel"><form id="recovery">'+label('Nova palavra-passe','password','','type="password" minlength="12" required autocomplete="new-password"')+label('Confirmar palavra-passe','confirm','','type="password" minlength="12" required autocomplete="new-password"')+'<button type="submit">Atualizar palavra-passe</button></form></div>')}
const checked=r=>{if(r.error)throw r.error;return r.data};
async function load(){
 const ticket=++generation;
 try{
  const result=await client.auth.getUser();if(ticket!==generation)return;
  if(result.error||!result.data.user){user=null;profile=null;if(pending)otpScreen();else authScreen(entryMode);notice('Entra ou cria uma conta SUMBA.');return}
  user=result.data.user;if(!user.email_confirmed_at&&!user.phone_confirmed_at&&!user.identities?.some(i=>i.provider==='google')){await client.auth.signOut();user=null;profile=null;clearPending();authScreen();notice('Confirma primeiro o email.',true);return}if(recovery){recoveryScreen();notice('Define uma nova palavra-passe.');return}
  profile=checked(await client.from('zunga_profiles').select('*').eq('user_id',user.id).maybeSingle());if(ticket!==generation)return;
  if(!profile){onboarding();notice('Completa o perfil para continuar.');return}
  await dashboard(ticket);
  if(ticket===generation)await maybeShowFirstAccountGuide(ticket);
 }catch(e){if(ticket!==generation)return;notice('Não foi possível carregar os dados. Verifica a ligação e a configuração da base de dados.',true);screen('<div class="panel"><h2>Ligação indisponível</h2>'+button('Tentar novamente','reload')+button('Terminar sessão','logout')+'</div>')}
}
async function dashboard(ticket){
 let stall=null,company=null,avatar='',catalog=[];
 if(profile.role==='producer')stall=checked(await client.from('zunga_stalls').select('*').eq('owner_id',user.id).maybeSingle());
 if(profile.role==='company')company=checked(await client.from('zunga_companies').select('*').eq('owner_id',user.id).maybeSingle());
 if(profile.avatar_path){const r=await client.storage.from('zunga-avatars').createSignedUrl(profile.avatar_path,300);if(!r.error)avatar=r.data.signedUrl}
 const identities=checked(await client.auth.getUserIdentities()).identities.map(i=>i.provider);catalog=checked(await client.from('zunga_stalls').select('id,name,province,city,description').eq('published',true).order('name').limit(50));if(ticket!==generation)return;
 screen('<div class="hero"><div class="sumba-real-profile-brand"><img src="./assets/sumba-icon.svg" alt="Emblema SUMBA"><div><strong>SUMBA</strong><small>Do campo à sua mesa.</small></div></div><span class="pill">'+esc(roles[profile.role])+'</span><h1>Olá, '+esc(profile.display_name)+'</h1><p>Explora fornecedores, gere o teu perfil e utiliza os serviços disponíveis na SUMBA.</p><p>Produtos, cestos e pedidos aos fornecedores são sincronizados com a tua conta. A finalização de compras e pagamentos ainda não está disponível.</p></div><div class="panel"><div class="row">'+(avatar?'<img class="avatar" alt="Foto de perfil" src="'+esc(avatar)+'">':'<div class="avatar avatar-fallback">'+esc(profile.display_name[0])+'</div>')+'<div><h2>'+esc(profile.display_name)+'</h2><span class="muted">'+esc(user.email||user.phone||'Identidade verificada')+'</span></div></div><form id="editProfile">'+label('Nome','name',profile.display_name,'required minlength="2" maxlength="80"')+label('Província','province',profile.province,'maxlength="80"')+label('Município','city',profile.city,'maxlength="80"')+textarea('Apresentação','bio',profile.bio)+'<label>Foto de perfil (até 1 MB)<input type="file" name="avatar" accept="image/jpeg,image/png,image/webp"></label><button type="submit">Guardar perfil</button></form>'+(profile.avatar_path?button('Remover foto','removeAvatar'):'')+'</div>'+
 (profile.role==='producer'?'<div class="panel"><h2>A minha bancada</h2><form id="stall" data-exists="'+!!stall+'">'+label('Nome comercial','name',stall?.name,'required minlength="2" maxlength="100"')+label('Província','province',stall?.province||profile.province,'required minlength="2" maxlength="80"')+label('Município','city',stall?.city||profile.city,'required minlength="2" maxlength="80"')+textarea('Descrição','description',stall?.description,1000)+'<label class="check"><input type="checkbox" name="published" '+(stall?.published?'checked':'')+'> Publicar nome, localização e descrição no diretório</label><button type="submit">Guardar bancada</button></form></div>':'')+
 (profile.role==='company'?'<div class="panel"><h2>A minha empresa</h2><form id="company" data-exists="'+!!company+'">'+label('Nome comercial','name',company?.name,'required minlength="2" maxlength="100"')+label('Setor','sector',company?.sector,'maxlength="100"')+label('Província','province',company?.province||profile.province,'maxlength="80"')+label('Município','city',company?.city||profile.city,'maxlength="80"')+'<button type="submit">Guardar empresa</button></form></div>':'')+
 '<div class="panel"><h2>Segurança da conta</h2><p class="muted">Para alterar o email, poderá ser necessário confirmar a operação tanto no endereço actual como no novo.</p><form id="changeEmail">'+label('Novo email de acesso','newEmail','','type="email" required autocomplete="email" maxlength="254"')+'<button type="submit" class="outline">Solicitar alteração de email</button></form><p class="muted">Para recuperar a palavra-passe, termina a sessão e escolhe Recuperar acesso.</p></div>'+
 '<div class="panel"><h2>Métodos de acesso</h2><p class="muted">Vincula um método adicional à mesma conta. A confirmação é feita pelo fornecedor, nunca pela aplicação.</p><div class="socials">'+socialButtons(true,identities)+'</div><p class="muted">Métodos associados: '+esc(identities.map(i=>providers[i]|| (i==='email'?'Email':i)).join(', '))+'</p></div>'+
 '<div class="panel"><h2>Bancadas publicadas</h2><p class="muted">Bancadas publicadas por fornecedores registados.</p><div class="list">'+(catalog.length?catalog.map(s=>'<article><h2>'+esc(s.name)+'</h2><p class="muted">'+esc(s.city)+', '+esc(s.province)+'</p><p>'+esc(s.description)+'</p></article>').join(''):'<p>Ainda não existem bancadas publicadas.</p>')+'</div></div><div id="sumbaMarketRoot"></div><div class="actions">'+button('Atualizar dados','reload')+button('Terminar sessão','logout')+'</div>');

 notice('Sessão autenticada · dados sincronizados com o servidor.');
 const activeUser=user?.id;
 try{
  const module=await import('./market.js');
  if(user?.id===activeUser)await module.mountMarket(client,document.getElementById('sumbaMarketRoot'),user,profile);
 }catch(e){console.warn('Mercado indisponível:',String(e?.message||e))}
 try{
  const module=await import('./notifications.js');
  if(user?.id===activeUser)await module.mountNotifications(client,document.querySelector('header'),$('content'));
 }catch(e){console.warn('Notificações indisponíveis:',String(e?.message||e))}
 try{
  const module=await import('./admin.js');
  if(user?.id===activeUser)await module.mountAdmin(client,$('content'));
 }catch(e){console.warn('Administração indisponível:',String(e?.message||e))}
}

/* First-use guide, persisted in Supabase and protected by auth.uid() RLS. */
const accountGuideTopics={
 buyer:[['Encontra fornecedores','Conhece as bancadas publicadas e consulta a sua localização e apresentação.'],['Gere a tua conta','Atualiza nome, fotografia e informações da tua conta.'],['Organiza o teu cesto','Produtos publicados por fornecedores registados podem ser guardados no teu cesto e consultados noutros dispositivos.']],
 producer:[['Cria a tua bancada','Preenche os dados comerciais e a descrição da tua produção.'],['Publica no diretório','Ativa a publicação e adiciona produtos com disponibilidade e preços na tua bancada.'],['Mantém os dados atualizados','Consulta e revê a tua bancada sempre que necessário.']],
 company:[['Apresenta a tua empresa','Guarda o nome comercial, setor e localização.'],['Descobre fornecedores','Consulta produtos publicados, guarda-os no cesto e contacta fornecedores.'],['Gere a tua conta','Atualiza os teus dados diretamente na plataforma.']],
 courier:[['Conhece o teu perfil','Consulta as áreas disponíveis para a tua conta.'],['Segurança','Mantém o acesso e os dados atualizados.'],['Entregas','As tarefas estarão disponíveis quando a logística for integrada.']],
 admin:[['Acesso atribuído','A administração é atribuída pela equipa autorizada.'],['Revê operações','Consulta os painéis disponíveis para a tua função.'],['Segurança','Utiliza as ferramentas de gestão apenas quando autorizadas.']]
};
let accountGuide=null;
function renderAccountGuide(){
 const overlay=document.getElementById('sumbaAccountGuide');if(!overlay||!accountGuide)return;
 const steps=accountGuideTopics[accountGuide.role]||accountGuideTopics.buyer;
 const [title,description]=steps[accountGuide.index];
 overlay.innerHTML='<section class="sumba-first-guide-card" role="document">'+
 '<span class="pill">BEM-VINDO À SUMBA</span><p class="muted">Passo '+(accountGuide.index+1)+' de '+steps.length+' · '+esc(roles[accountGuide.role]||'Conta')+'</p>'+
 '<h2>'+esc(title)+'</h2><p>'+esc(description)+'</p>'+
 '<div class="sumba-guide-actions"><button type="button" class="outline" data-sumba-first-guide="skip">Saltar</button>'+
 '<button type="button" data-sumba-first-guide="next">'+(accountGuide.index===steps.length-1?'Concluir':'Seguinte')+'</button></div></section>';
 overlay.querySelector('[data-sumba-first-guide="next"]')?.focus({preventScroll:true});
}
async function maybeShowFirstAccountGuide(ticket){
 if(!user||!profile||ticket!==generation||accountGuide)return;
 const result=await client.from('sumba_tutorial_progress').select('role').eq('user_id',user.id).eq('role',profile.role).maybeSingle();
 if(result.error){console.warn('Guia de primeira utilização indisponível:',result.error.code);return}
 if(result.data||ticket!==generation||!user||!profile)return;
 accountGuide={userId:user.id,role:profile.role,index:0};
 const overlay=document.createElement('div');overlay.id='sumbaAccountGuide';
 overlay.className='sumba-first-guide';overlay.setAttribute('role','dialog');
 overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Tutorial de primeira utilização');
 document.body.append(overlay);renderAccountGuide();
}
async function completeAccountGuide(){
 if(!accountGuide||!user||user.id!==accountGuide.userId)return;
 checked(await client.from('sumba_tutorial_progress').upsert({user_id:user.id,role:accountGuide.role},{onConflict:'user_id,role'}));
 document.getElementById('sumbaAccountGuide')?.remove();accountGuide=null;
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-sumba-first-guide]');if(!b||!accountGuide||busy)return;
 const action=b.dataset.sumbaFirstGuide,steps=accountGuideTopics[accountGuide.role]||accountGuideTopics.buyer;
 if(action==='next'&&accountGuide.index<steps.length-1){accountGuide.index++;renderAccountGuide();return}
 if(action==='skip'||action==='next')run(()=>completeAccountGuide());
});

async function execute(f){
 const v=new FormData(f),s=k=>String(v.get(k)||'').trim(),p=k=>String(v.get(k)||'');

 if(f.id==='authForm'){
  const mode=f.dataset.mode,channel=f.dataset.channel==='phone'?'phone':'email';
  const identifier=s(channel==='phone'?'phone':'email').toLowerCase();
  if(!(channel==='phone'?isPhone(identifier):isEmail(identifier))){
   notice(channel==='phone'?'Escreve o número no formato internacional (+2449XXXXXXXX).':'Introduz um email válido.',true);return;
  }
  if(mode==='register'){
   if(!v.has('agree')||p('password')!==p('confirm')||p('password').length<12){notice('Aceita as condições e confirma a palavra-passe com pelo menos 12 caracteres.',true);return}
   if(Date.now()<nextSend)throw {code:'over_request_rate_limit'};
   const credentials=channel==='phone'?{phone:identifier,password:p('password')}:
    {email:identifier,password:p('password'),options:{emailRedirectTo:redirect}};
   const result=checked(await client.auth.signUp(credentials));
   if(result.session){await client.auth.signOut();notice('O servidor aceitou a conta sem confirmação. A verificação é obrigatória; contacta o suporte.',true);return}
   nextSend=Date.now()+60000;
   setPending(mode,identifier,channel);
   otpScreen();notice('Se o registo foi aceite, consulta o teu '+(channel==='phone'?'SMS.':'email.'));return;
  }
  if(mode==='reset'||mode==='otp'||mode==='login'){await requestCode(mode==='login'?'otp':mode,identifier,channel);return}
  if(mode!=='password')return;
  clearPending();
  checked(await client.auth.signInWithPassword(channel==='phone'?{phone:identifier,password:p('password')}:{email:identifier,password:p('password')}));
  await load();return;
 }


 if(f.id==='otpForm'){
  if(!pending||!(/^\d{6}$/).test(s('token'))){notice('Introduz um código de seis algarismos.',true);$('otpCode')?.focus();return}
  const {mode,identifier,channel}=pending,resetting=mode==='reset';
  recovery=resetting;
  const options=channel==='phone'?{phone:identifier,token:s('token'),type:'sms'}:
   {email:identifier,token:s('token'),type:otpTypes[mode]};
  try{const result=checked(await client.auth.verifyOtp(options));if(!result.session)throw {code:'otp_expired'};clearPending();await load()}catch(e){recovery=false;throw e}
  return;
 }

 if(f.id==='recovery'){if(p('password')!==p('confirm')){notice('As palavras-passe não coincidem.',true);return}if(!recovery||p('password').length<12){notice('A recuperação não está activa ou a palavra-passe é curta.',true);return}checked(await client.auth.updateUser({password:p('password')}));recovery=false;clearPending();const result=await client.auth.signOut({scope:'global'});if(result.error){screen('<div class="panel"><h1>Palavra-passe alterada</h1><p>Não foi possível terminar todas as sessões. Tenta terminar a sessão novamente.</p>'+button('Terminar sessão','logout')+'</div>');notice('A alteração foi guardada; o logout não foi confirmado.',true);return}user=null;profile=null;authScreen();notice('Palavra-passe alterada. Entra novamente.');return}
 if(!user)throw Error('Inicia sessão.');
 if(f.id==='onboarding'){if(!v.has('agree')||!['buyer','producer','company'].includes(s('role')))throw Error('Confirma o tipo de conta e as condições.');checked(await client.from('zunga_profiles').insert({user_id:user.id,role:s('role'),display_name:s('name'),province:s('province'),city:s('city'),terms_version:'pilot-1'}));await load();return}
 if(!profile)throw Error('Completa o perfil.');
 if(f.id==='changeEmail'){const email=s('newEmail').toLowerCase();if(email===user.email?.toLowerCase()){notice('Este já é o teu email.',true);return}checked(await client.auth.updateUser({email},{emailRedirectTo:redirect}));notice('Se o pedido foi aceite, consulta os emails de confirmação antes de utilizar o novo endereço.');return}
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
document.addEventListener('submit',e=>{if(!['authForm','otpForm','onboarding','editProfile','changeEmail','stall','company','recovery'].includes(e.target.id))return;e.preventDefault();run(()=>execute(e.target))});

document.addEventListener('click',e=>{
 const action=e.target.closest('[data-action]')?.dataset.action;
 if(!action||busy)return;
 if(action==='channel-email'||action==='channel-phone'){
  authScreen($('authForm')?.dataset.mode||'login','',action==='channel-phone'?'phone':'email');notice();return;
 }
 if(['login','password','register','reset','otp','change-identifier'].includes(action)){
  const previous=pending,channel=previous?.channel||authChannel,mode=action==='change-identifier'?previous?.mode||'login':action;
  clearPending();authScreen(mode,'',channel);notice();return;
 }
 run(async()=>{
  if(action==='resend'&&pending){await requestCode(pending.mode,pending.identifier,pending.channel,true);return}
  if(action.startsWith('oauth-')||action.startsWith('link-')){
   const provider=action.split('-')[1];if(!Object.hasOwn(providers,provider))return;
   const options={redirectTo:redirect};
   if(action.startsWith('link-')){if(!user||recovery)return;checked(await client.auth.linkIdentity({provider,options}))}
   else{clearPending();checked(await client.auth.signInWithOAuth({provider,options}))}
   return;
  }
  if(action==='logout'){document.getElementById('sumbaAccountGuide')?.remove();accountGuide=null;generation++;checked(await client.auth.signOut());user=null;profile=null;recovery=false;clearPending();authScreen();notice('Sessão terminada.')}
  else if(action==='reload')await load();
  else if(action==='removeAvatar'&&user&&profile){
   checked(await client.from('zunga_profiles').update({avatar_path:null}).eq('user_id',user.id).select('user_id').single());
   checked(await client.storage.from('zunga-avatars').remove([user.id+'/avatar']));await load();
  }
 });
});

async function start(){
 if(!validConfig(cfg)){notice('Não é possível aceder à SUMBA neste momento.',true);screen('<div class="panel"><h1>Serviço temporariamente indisponível</h1><p>O ambiente de autenticação exige uma origem HTTPS dedicada e configuração do Supabase. Não introduzas credenciais nesta página.</p><a class="button outline" href="https://zunga.stivenluanda04.workers.dev/">Explorar demonstração</a></div>');return}
 resumeOtpFromEmailLink();
 const callback=new URLSearchParams(location.search),hasError=callback.has('error')||new URLSearchParams(location.hash.slice(1)).has('error');
 try{const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.0/+esm');client=createClient(cfg.url,cfg.publishableKey,{auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'zunga-real-auth-v012'}});
 client.auth.onAuthStateChange((event)=>{if(event==='PASSWORD_RECOVERY'){recovery=true;setTimeout(()=>{if(!busy)load()},0)}else if(event==='SIGNED_OUT'){generation++;user=null;profile=null;recovery=false;clearPending();authScreen();notice('Sessão terminada.')}});
 await load();
 if(hasError){history.replaceState(null,'',redirect);notice('Não foi possível concluir o acesso social. Tenta novamente.',true)}
 }catch(e){notice('Não foi possível ligar o serviço de autenticação.',true);screen('<div class="panel"><h1>Ligação indisponível</h1><a class="button outline" href="/">Tentar novamente</a></div>')}
}
start();
})();