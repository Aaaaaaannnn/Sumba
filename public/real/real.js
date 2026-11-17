'use strict';
(() => {
const $=id=>document.getElementById(id), cfg=window.ZUNGA_REAL_CONFIG||{}, roles={buyer:'Cliente',producer:'Fornecedor',company:'Empresa',courier:'Entregador',admin:'Administração'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validConfig=c=>/^https:\/\/[a-z0-9]{20}\.supabase\.co$/.test(c.url||'')&&/^sb_publishable_[A-Za-z0-9_-]+$/.test(c.publishableKey||'');
const redirect=location.origin+'/real/';
let client,user=null,profile=null,recovery=false,busy=false,generation=0;
const notice=(s='',error=false)=>{$('notice').textContent=s;$('notice').classList.toggle('error',error)};
const screen=html=>{$('content').innerHTML=html};
const label=(name,key,value='',attrs='')=>'<label>'+esc(name)+'<input name="'+key+'" value="'+esc(value)+'" '+attrs+'></label>';
const textarea=(name,key,value='',max=600)=>'<label>'+esc(name)+'<textarea name="'+key+'" maxlength="'+max+'">'+esc(value)+'</textarea></label>';
const button=(title,act)=>'<button type="button" class="outline" data-action="'+act+'">'+esc(title)+'</button>';
const terms='<details><summary>Condições do piloto (versão pilot-1)</summary><p>A ZUNGA é uma plataforma em desenvolvimento. Neste piloto não há compras, pagamentos, cobranças, garantias de entrega ou contratos celebrados pelo sistema. O email é usado para autenticação; nome, localização aproximada, apresentação e foto são usados no perfil. Bancadas publicadas exibem publicamente nome comercial, localização e descrição. Não introduzas dados sensíveis, documentos, contactos de terceiros ou conteúdo ilegal. Usa apenas conteúdo que tens direito a publicar. A versão de teste não substitui os termos e política de privacidade definitivos. A eliminação da conta deverá ser disponibilizada antes do lançamento público; para testes, solicita apoio ao responsável pelo piloto.</p></details>';
const agree=()=>terms+'<label class="check"><input type="checkbox" name="agree" required> Li e aceito as condições do piloto.</label>';
function authScreen(mode='login'){
 const login=mode==='login',register=mode==='register',reset=mode==='reset';
 screen('<div class="hero"><h1>'+ (login?'Entra na ZUNGA':register?'Cria a tua conta': 'Recuperar acesso')+'</h1><p>Do campo ao mercado · ambiente real de teste</p></div><div class="panel"><form id="authForm" data-mode="'+mode+'">'+label('Email','email','','type="email" required autocomplete="email" maxlength="254"')+(reset?'':label('Palavra-passe','password','','type="password" required minlength="12" autocomplete="'+(register?'new-password':'current-password')+'"'))+(register?agree():'')+'<button type="submit">'+(login?'Entrar':register?'Criar conta':'Enviar ligação de recuperação')+'</button></form><div class="actions">'+(login?button('Criar conta','register')+button('Esqueci a palavra-passe','reset'):button('Voltar ao login','login'))+'</div></div><p class="muted">Contas reais não utilizam a palavra-passe de demonstração. Não uses dados sensíveis no piloto.</p>');
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
  if(result.error||!result.data.user){user=null;profile=null;authScreen();notice('Entra ou cria uma conta de teste real.');return}
  user=result.data.user;if(recovery){recoveryScreen();notice('Define uma nova palavra-passe.');return}
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
 catalog=checked(await client.from('zunga_stalls').select('id,name,province,city,description').eq('published',true).order('name').limit(50));if(ticket!==generation)return;
 screen('<div class="hero"><span class="pill">'+esc(roles[profile.role])+'</span><h1>Olá, '+esc(profile.display_name)+'</h1><p>Perfil guardado na base de dados. Compras e outros módulos comerciais ainda não estão ligados.</p></div><div class="panel"><div class="row">'+(avatar?'<img class="avatar" alt="Foto de perfil" src="'+esc(avatar)+'">':'<div class="avatar" style="display:grid;place-items:center;font-size:26px">'+esc(profile.display_name[0])+'</div>')+'<div><h2>'+esc(profile.display_name)+'</h2><span class="muted">'+esc(user.email)+'</span></div></div><form id="editProfile">'+label('Nome','name',profile.display_name,'required minlength="2" maxlength="80"')+label('Província','province',profile.province,'maxlength="80"')+label('Município','city',profile.city,'maxlength="80"')+textarea('Apresentação','bio',profile.bio)+'<label>Foto de perfil (até 1 MB)<input type="file" name="avatar" accept="image/jpeg,image/png,image/webp"></label><button type="submit">Guardar perfil</button></form>'+(profile.avatar_path?button('Remover foto','removeAvatar'):'')+'</div>'+
 (profile.role==='producer'?'<div class="panel"><h2>A minha bancada</h2><form id="stall" data-exists="'+!!stall+'">'+label('Nome comercial','name',stall?.name,'required minlength="2" maxlength="100"')+label('Província','province',stall?.province||profile.province,'required minlength="2" maxlength="80"')+label('Município','city',stall?.city||profile.city,'required minlength="2" maxlength="80"')+textarea('Descrição','description',stall?.description,1000)+'<label class="check"><input type="checkbox" name="published" '+(stall?.published?'checked':'')+'> Publicar nome, localização e descrição no diretório</label><button type="submit">Guardar bancada</button></form></div>':'')+
 (profile.role==='company'?'<div class="panel"><h2>A minha empresa</h2><form id="company" data-exists="'+!!company+'">'+label('Nome comercial','name',company?.name,'required minlength="2" maxlength="100"')+label('Setor','sector',company?.sector,'maxlength="100"')+label('Província','province',company?.province||profile.province,'maxlength="80"')+label('Município','city',company?.city||profile.city,'maxlength="80"')+'<button type="submit">Guardar empresa</button></form></div>':'')+
 '<div class="panel"><h2>Bancadas publicadas</h2><p class="muted">Diretório real — sem dados fictícios.</p><div class="list">'+(catalog.length?catalog.map(s=>'<article><h2>'+esc(s.name)+'</h2><p class="muted">'+esc(s.city)+', '+esc(s.province)+'</p><p>'+esc(s.description)+'</p></article>').join(''):'<p>Ainda não existem bancadas publicadas.</p>')+'</div></div><div class="actions">'+button('Atualizar dados','reload')+button('Terminar sessão','logout')+'</div>');
 notice('Sessão autenticada · dados sincronizados com o servidor.');
}
async function execute(f){
 const v=new FormData(f),s=k=>String(v.get(k)||'').trim(),p=k=>String(v.get(k)||'');
 if(f.id==='authForm'){
  const mode=f.dataset.mode,email=s('email');
  if(mode==='register'){if(!v.has('agree'))throw Error('Aceita as condições.');const r=checked(await client.auth.signUp({email,password:p('password'),options:{emailRedirectTo:redirect}}));if(!r.session){authScreen();notice('Se o registo for aceite, consulta o email de confirmação.');return}}
  else if(mode==='reset'){checked(await client.auth.resetPasswordForEmail(email,{redirectTo:redirect}));authScreen();notice('Se a conta existir, receberás instruções de recuperação.');return}
  else checked(await client.auth.signInWithPassword({email,password:p('password')}));
  await load();return
 }
 if(f.id==='recovery'){if(p('password')!==p('confirm'))throw Error('As palavras-passe não coincidem.');checked(await client.auth.updateUser({password:p('password')}));recovery=false;await load();return}
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
 await load();notice('Alterações guardadas no servidor.');
}
async function run(work){if(busy)return;busy=true;document.querySelectorAll('button').forEach(b=>b.disabled=true);try{await work()}catch(e){notice(e?.message||'Não foi possível concluir. Tenta novamente.',true)}finally{busy=false;document.querySelectorAll('button').forEach(b=>b.disabled=false)}}
document.addEventListener('submit',e=>{if(!['authForm','onboarding','editProfile','stall','company','recovery'].includes(e.target.id))return;e.preventDefault();run(()=>execute(e.target))});
document.addEventListener('click',e=>{const action=e.target.closest('[data-action]')?.dataset.action;if(!action||busy)return;if(['login','register','reset'].includes(action)){authScreen(action);notice();return}run(async()=>{if(action==='logout'){generation++;checked(await client.auth.signOut());user=null;profile=null;recovery=false;authScreen();notice('Sessão terminada.')}else if(action==='reload')await load();else if(action==='removeAvatar'&&user&&profile){checked(await client.from('zunga_profiles').update({avatar_path:null}).eq('user_id',user.id).select('user_id').single());checked(await client.storage.from('zunga-avatars').remove([user.id+'/avatar']));await load()}})});
async function start(){
 if(!validConfig(cfg)){notice('Backend ainda não configurado. Não é possível criar contas reais.',true);screen('<div class="panel"><h1>A fundação real está preparada</h1><p>O ambiente real será ativado depois de ligar o projeto Supabase dedicado. Nenhuma conta ou informação é guardada aqui enquanto não houver configuração.</p><a class="button outline" href="/">Explorar demonstração</a></div>');return}
 try{const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.0/+esm');client=createClient(cfg.url,cfg.publishableKey,{auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'zunga-real-auth-v012'}});
 client.auth.onAuthStateChange((event)=>{if(event==='PASSWORD_RECOVERY'){recovery=true;setTimeout(()=>load(),0)}else if(event==='SIGNED_OUT'){generation++;user=null;profile=null;recovery=false;authScreen();notice('Sessão terminada.')}});
 await load();
 }catch(e){notice('Não foi possível ligar o serviço de autenticação.',true);screen('<div class="panel"><h1>Ligação indisponível</h1><a class="button outline" href="/real/">Tentar novamente</a></div>')}
}
start();
})();