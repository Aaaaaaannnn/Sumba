
/* SUMBA V0.22 — Administração REAL; a autorização é confirmada na Edge Function. */
const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const roleName={buyer:'Cliente',producer:'Fornecedor',company:'Empresa',courier:'Entregador',admin:'Administração',unassigned:'Sem perfil'};
const date=v=>v?new Date(v).toLocaleString('pt-AO'):'—';
async function api(client,action,fields={}){
 const {data:{session},error}=await client.auth.getSession();
 if(error||!session?.access_token)throw new Error('Sessão expirada. Entra novamente.');
 const response=await fetch(client.supabaseUrl+'/functions/v1/sumba-admin',{
  method:'POST',
  headers:{'Content-Type':'application/json','apikey':client.supabaseKey,'Authorization':'Bearer '+session.access_token},
  body:JSON.stringify({action,...fields})
 });
 const data=await response.json().catch(()=>({error:'invalid_response'}));
 if(!response.ok||data.error)throw new Error(data.message||data.detail||data.error||'Erro de ligação');
 return data;
}
export async function mountAdmin(client,host){
 if(!host||!host.isConnected)return;
 const role=await api(client,'me').catch(()=>null);
 if(role?.admin!==true||!host.isConnected)return;
 const section=document.createElement('section');section.id='sumbaAdmin';section.className='panel sumba-admin';
 section.innerHTML='<div class="admin-head"><div><span class="pill">ADMINISTRAÇÃO</span><h2>Utilizadores e comunicação</h2><p class="muted">Contas reais, actividades registadas e envios sujeitos a confirmação.</p></div>'+
 '<button type="button" class="outline" data-a="reload">Actualizar lista</button></div>'+
 '<div class="admin-tabs" role="tablist"><button type="button" data-tab="users" aria-selected="true">Utilizadores</button><button type="button" data-tab="compose" aria-selected="false">Comunicação</button><button type="button" data-tab="delivery" aria-selected="false">Envios</button></div>'+
 '<div id="adminMessage" role="status" aria-live="polite"></div><div id="adminContent"></div>';
 host.appendChild(section);
 const content=section.querySelector('#adminContent'),message=section.querySelector('#adminMessage');
 let current='users',users=[],page=1,total=0,search='',filter='all',busy=false,recipient=null;
 const announce=msg=>{message.textContent=msg||'';};
 const busyRun=async fn=>{if(busy)return;busy=true;section.querySelectorAll('button').forEach(b=>b.disabled=true);
  try{await fn()}catch(e){announce('Não foi possível concluir: '+e.message)}
  finally{busy=false;section.querySelectorAll('button').forEach(b=>b.disabled=false)}};
 const tabs=()=>{section.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===current?'true':'false'));};
 const userCard=u=>{
  const status=u.state==='active'?'Activa':u.state==='suspended'?'Suspensa':'Bloqueada';
  return '<article class="admin-user"><div class="admin-user-head"><strong>'+escapeHtml(u.name||u.email||u.phone||'Conta sem perfil')+'</strong><span class="pill">'+escapeHtml(status)+'</span></div>'+
   '<div class="muted">'+escapeHtml(roleName[u.role]||u.role)+' · '+escapeHtml(u.email||'Sem email')+
   (u.phone?' · '+escapeHtml(u.phone):'')+'</div>'+
   '<div class="muted">Registo: '+date(u.createdAt)+' · Último acesso: '+date(u.lastSignIn)+'</div>'+
   '<div class="admin-user-actions"><button type="button" class="outline" data-a="activity" data-id="'+u.id+'">Actividades</button>'+
   '<button type="button" class="outline" data-a="contact" data-id="'+u.id+'">Mensagem</button>'+
   (u.state==='active'?'<button type="button" class="outline" data-a="suspend" data-id="'+u.id+'">Suspender</button><button type="button" class="outline" data-a="block" data-id="'+u.id+'">Bloquear</button>':
    '<button type="button" class="outline" data-a="activate" data-id="'+u.id+'">Reactivar</button>')+
   '</div><div id="activity-'+u.id+'" class="admin-activity"></div></article>';
 };
 const drawUsers=()=>{
  const normalized=search.trim().toLowerCase();
  const visible=users.filter(u=>(filter==='all'||u.role===filter)&&[u.email,u.phone,u.name,u.city,u.province].join(' ').toLowerCase().includes(normalized));
  content.innerHTML='<div class="admin-tools"><label>Pesquisar<input id="adminSearch" value="'+escapeHtml(search)+'" placeholder="Nome, email, telefone ou localização"></label>'+
   '<label>Tipo<select id="adminRole">'+Object.entries({all:'Todos',...roleName}).map(([id,label])=>'<option value="'+id+'" '+(filter===id?'selected':'')+'>'+escapeHtml(label)+'</option>').join('')+'</select></label></div>'+
   '<p class="muted">Contas no servidor: '+total+' · Página '+page+' · '+visible.length+' visíveis</p>'+
   '<div class="admin-users">'+(visible.length?visible.map(userCard).join(''):'<p class="muted">Nenhuma conta encontrada.</p>')+'</div>'+
   '<div class="actions"><button type="button" class="outline" data-a="prev" '+(page===1?'disabled':'')+'>Anterior</button>'+
   '<button type="button" class="outline" data-a="next" '+(page*100>=total?'disabled':'')+'>Próxima página</button></div>';
 };
 const loadUsers=async()=>{
  announce('A consultar utilizadores reais...');
  const res=await api(client,'users',{page});users=res.users||[];total=res.total||0;
  if(current==='users')drawUsers();announce('');
 };
 const drawCompose=()=>{
  content.innerHTML='<h3>Nova comunicação</h3><p class="muted">Os envios colectivos promocionais respeitam as preferências de comunicação. Emails e SMS entram na fila até existir fornecedor activo.</p>'+
  '<form id="sumbaAnnounce">'+
  '<label>Destinatários<select name="audience"><option value="all">Todos os utilizadores</option><option value="buyer">Clientes</option><option value="producer">Fornecedores</option><option value="company">Empresas</option><option value="courier">Entregadores</option>'+
  (recipient?'<option selected value="individual">Utilizador seleccionado</option>':'')+'</select></label>'+
  '<label>Assunto<input name="subject" minlength="3" maxlength="140" required placeholder="Ex.: Novidades na SUMBA"></label>'+
  '<label>Mensagem<textarea name="message" minlength="3" maxlength="2000" required rows="5" placeholder="Escreve uma mensagem clara e útil"></textarea></label>'+
  '<fieldset class="admin-channels"><legend>Onde notificar</legend>'+
  '<label class="check"><input type="checkbox" name="inapp" checked> Notificação no site / pop-up</label>'+
  '<label class="check"><input type="checkbox" name="email"> Email (respeitar consentimento)</label>'+
  '<label class="check"><input type="checkbox" name="sms"> SMS (respeitar consentimento)</label></fieldset>'+
  '<label class="check"><input type="checkbox" name="confirm" required> Confirmo os destinatários, o conteúdo e a finalidade do envio.</label>'+
  '<button type="submit">Enviar notificação / colocar na fila</button></form>'+
  (recipient?'<p class="muted">Contacto individual seleccionado: '+escapeHtml(users.find(u=>u.id===recipient)?.email||recipient)+'</p>':'');
 };
 const drawDelivery=async()=>{
  content.innerHTML='<p class="muted">A verificar fornecedores e a fila de envios...</p>';
  const result=await api(client,'delivery_status'),provider=result.providers||{};
  content.innerHTML='<h3>Estado das integrações</h3>'+
   '<div class="admin-delivery"><p><strong>Email Brevo:</strong> '+(provider.email?'configurado':'aguarda chave e remetente')+'</p>'+
   '<p><strong>SMS Twilio:</strong> '+(provider.sms?'configurado':'aguarda credenciais e número de envio')+'</p></div>'+
   '<h3>Fila de mensagens</h3><div class="admin-users">'+(result.queue?.length?result.queue.map(q=>
    '<p class="muted">'+escapeHtml(q.channel)+' · '+escapeHtml(q.status)+': '+Number(q.total)+'</p>').join(''):'<p class="muted">Ainda sem envios em fila.</p>')+'</div>'+
   '<button type="button" data-a="dispatch">Processar a fila configurada</button>'+
   '<p class="muted">Mensagens não são declaradas enviadas até o fornecedor confirmar.</p>';
 };
 const switchTab=async tab=>{
  current=tab;tabs();announce('');
  if(tab==='users'){if(!users.length)await loadUsers();else drawUsers();}
  else if(tab==='compose')drawCompose();
  else if(tab==='delivery')await drawDelivery();
 };
 section.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||busy||!section.contains(b))return;
  if(b.dataset.tab){busyRun(()=>switchTab(b.dataset.tab));return}
  const action=b.dataset.a,id=b.dataset.id;
  if(!action)return;
  busyRun(async()=>{
   if(action==='reload'){await loadUsers();return}
   if(action==='prev'){page=Math.max(1,page-1);await loadUsers();return}
   if(action==='next'){page++;await loadUsers();return}
   if(action==='contact'){recipient=id;await switchTab('compose');return}
   if(action==='activity'){
    const res=await api(client,'activity',{target:id});
    const dst=section.querySelector('#activity-'+id);
    if(dst)dst.innerHTML='<h4>Actividades registadas</h4>'+(res.activities?.length?
      res.activities.map(a=>'<p class="muted">'+date(a.occurred_at)+' · '+escapeHtml(a.event_type)+'</p>').join(''):
      '<p class="muted">Ainda não existem actividades desta conta no servidor.</p>');
    return;
   }
   if(['suspend','block','activate'].includes(action)){
    const next=action==='activate'?'active':action==='suspend'?'suspended':'blocked';
    let hours=null;
    if(next==='suspended'){const h=window.prompt('Duração: 24, 168 ou 720 horas','24');if(h===null)return;hours=Number(h);if(![24,168,720].includes(hours))throw Error('Escolhe 24, 168 ou 720 horas.')}
    const reason=next==='active'?'Reactivação pelo administrador':window.prompt('Motivo da moderação (não incluas dados sensíveis)','') ;
    if(reason===null)return;
    if(!window.confirm('Confirma a alteração do estado desta conta?'))return;
    await api(client,'moderate',{target:id,state:next,durationHours:hours,reason});
    announce('Estado alterado e actividade registada.');await loadUsers();return;
   }
   if(action==='dispatch'){
    const res=await api(client,'dispatch');
    announce('Processados: '+res.result.processed+' · enviados: '+res.result.sent+' · falhas: '+res.result.failed);
    await drawDelivery();return;
   }
  });
 });
 section.addEventListener('input',e=>{
  if(e.target.id==='adminSearch'){search=e.target.value;const pos=e.target.selectionStart;drawUsers();
   const input=section.querySelector('#adminSearch');input.focus();input.setSelectionRange(pos,pos);}
 });
 section.addEventListener('change',e=>{if(e.target.id==='adminRole'){filter=e.target.value;drawUsers();}});
 section.addEventListener('submit',e=>{
  if(e.target.id!=='sumbaAnnounce')return;e.preventDefault();
  busyRun(async()=>{
   const v=new FormData(e.target),audience=String(v.get('audience'));
   if(!window.confirm('Confirmas o envio aos destinatários seleccionados?'))return;
   const res=await api(client,'announce',{
    audience,recipient:audience==='individual'?recipient:null,
    subject:String(v.get('subject')||'').trim(),message:String(v.get('message')||'').trim(),
    inapp:v.has('inapp'),email:v.has('email'),sms:v.has('sms'),confirmed:v.has('confirm')
   });
   const r=res.result;announce('Notificados no site: '+r.inapp+' · emails na fila: '+r.email_queued+' · SMS na fila: '+r.sms_queued+'.');
   e.target.reset();recipient=null;
  });
 });
 await loadUsers();
}
