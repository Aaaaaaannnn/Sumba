
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
 '<div class="admin-tabs" role="tablist"><button type="button" data-tab="users" aria-selected="true">Utilizadores</button><button type="button" data-tab="inbox" aria-selected="false">Conversas</button><button type="button" data-tab="compose" aria-selected="false">Mensagens e avisos</button><button type="button" data-tab="delivery" aria-selected="false">Envios</button></div>'+
 '<div id="adminMessage" role="status" aria-live="polite"></div><div id="adminContent"></div>';
 host.appendChild(section);
 const content=section.querySelector('#adminContent'),message=section.querySelector('#adminMessage');
 let current='users',users=[],page=1,total=0,search='',filter='all',ordering='newest',busy=false,recipient=null;
 const announce=msg=>{message.textContent=msg||'';};
 const busyRun=async fn=>{if(busy)return;busy=true;const previous=[...section.querySelectorAll('button')].map(b=>[b,b.disabled]);previous.forEach(([b])=>b.disabled=true);
  try{await fn()}catch(e){announce('Não foi possível concluir: '+e.message)}
  finally{busy=false;previous.forEach(([b,disabled])=>{if(b.isConnected)b.disabled=disabled})}};
 const tabs=()=>{section.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===current?'true':'false'));};
 const userCard=u=>{
  const status=u.state==='active'?'Activa':u.state==='suspended'?'Suspensa':'Bloqueada';
  return '<article class="admin-user"><details><summary class="admin-user-head" data-account="'+escapeHtml(u.id)+'"><strong>'+escapeHtml(u.name||u.email||u.phone||'Conta sem perfil')+'</strong><span class="pill">'+escapeHtml(status)+'</span></summary>'+
   '<div class="muted">'+escapeHtml(roleName[u.role]||u.role)+' · '+escapeHtml(u.email||'Sem email')+
   (u.phone?' · '+escapeHtml(u.phone):'')+'</div>'+
   '<div class="muted">'+escapeHtml([u.city,u.province].filter(Boolean).join(', '))+'</div><div class="muted">Registo: '+date(u.createdAt)+' · Último acesso: '+date(u.lastSignIn)+'</div>'+
   '<div class="admin-user-actions"><button type="button" class="outline" data-a="thread" data-id="'+u.id+'">Conversar</button>'+
   '<button type="button" class="outline" data-a="contact" data-id="'+u.id+'">Mensagem</button>'+
   (u.state==='active'?'<button type="button" class="outline" data-a="suspend" data-id="'+u.id+'">Suspender</button><button type="button" class="outline" data-a="block" data-id="'+u.id+'">Bloquear</button>':
    '<button type="button" class="outline" data-a="activate" data-id="'+u.id+'">Reactivar</button>')+
   '</div><div id="activity-'+u.id+'" class="admin-activity"></div></details></article>';
 };
 const drawUsers=()=>{
  const visible=users;
  content.innerHTML='<form class="admin-tools" id="adminFilters"><label>Pesquisar<input name="search" maxlength="120" id="adminSearch" value="'+escapeHtml(search)+'" placeholder="Nome, email, telefone ou localização"></label>'+
   '<label>Tipo de conta<select name="role" id="adminRole">'+Object.entries({all:'Todos',...roleName}).map(([id,label])=>'<option value="'+id+'" '+(filter===id?'selected':'')+'>'+escapeHtml(label)+'</option>').join('')+'</select></label><label>Ordenar por<select name="ordering">'+Object.entries({newest:'Criação mais recente',oldest:'Criação mais antiga',name:'Nome A–Z',reverse:'Nome Z–A'}).map(([id,label])=>'<option value="'+id+'" '+(ordering===id?'selected':'')+'>'+label+'</option>').join('')+'</select></label><button type="submit" class="outline">Aplicar filtros</button></form>'+
   '<p class="muted">Contas no servidor: '+total+' · Página '+page+' · '+visible.length+' visíveis</p>'+
   '<div class="admin-users">'+(visible.length?visible.map(userCard).join(''):'<p class="muted">Nenhuma conta encontrada.</p>')+'</div>'+
   '<div class="actions"><button type="button" class="outline" data-a="prev" '+(page===1?'disabled':'')+'>Anterior</button>'+
   '<button type="button" class="outline" data-a="next" '+(page*100>=total?'disabled':'')+'>Próxima página</button></div>';
 };
 const loadUsers=async()=>{
  announce('A consultar utilizadores reais...');
  const {data:res,error}=await client.rpc('sumba_admin_accounts_page',{term:search,account_type:filter,ordering,page_number:page});
  if(error)throw Error(error.message);
  users=res.users||[];total=res.total||0;
  if(current==='users')drawUsers();announce('');
 };
 const drawCompose=()=>{
  content.innerHTML='<h3>Mensagem ou aviso global</h3><p class="muted">Os envios colectivos promocionais respeitam as preferências de comunicação. Emails e SMS entram na fila até existir fornecedor activo.</p>'+
  '<form id="sumbaAnnounce">'+
  '<label>Destinatários<select name="audience"><option value="all">Todos os utilizadores</option><option value="buyer">Clientes</option><option value="producer">Fornecedores</option><option value="company">Empresas</option><option value="courier">Entregadores</option>'+
  (recipient?'<option selected value="individual">Utilizador seleccionado</option>':'')+'</select></label>'+
  '<label>Tipo de comunicação<select name="kind"><option value="message">Mensagem</option><option value="notice">Aviso</option></select></label>'+
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
 const switchTab=async (tab,target=null)=>{
  current=tab;tabs();announce('');
  if(tab==='users'){if(!users.length)await loadUsers();else drawUsers();}
  else if(tab==='compose')drawCompose();
  else if(tab==='inbox'){
   content.innerHTML='<section data-admin-inbox></section>';
   const {data,error}=await client.auth.getUser();if(error)throw Error(error.message);
   const {mountSupport}=await import('./support.js');
   await mountSupport(client,content.querySelector('[data-admin-inbox]'),data.user,{operator:true,initial:target});
  }
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
   if(action==='thread'){await switchTab('inbox',id);return}
   if(action==='activity-more'){
    const activity=section.querySelector('#activity-'+id);
    if(activity)await drawActivity(id,activity,Number(b.dataset.page));
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
 async function drawActivity(id,activity,number=1){
  const {data,error}=await client.rpc('sumba_admin_activity_page',{target:id,page_number:number});
  if(error)throw Error(error.message);
  if(!activity.isConnected)return;
  if(number===1)activity.innerHTML='<h4>Atividade registada</h4><div data-activity-log class="sumba-support-history" tabindex="0" aria-label="Histórico de atividade"></div>';
  activity.querySelector('[data-activity-log]').insertAdjacentHTML('beforeend',
   data.slice(0,40).map(row=>'<p>'+escapeHtml(date(row.occurred_at))+' · '+escapeHtml(row.event_type)+'</p>').join('')||'<p>Sem atividade registada.</p>');
  activity.querySelector('[data-a="activity-more"]')?.remove();
  if(data.length>40)activity.insertAdjacentHTML('beforeend','<button type="button" class="outline" data-a="activity-more" data-id="'+escapeHtml(id)+'" data-page="'+(number+1)+'">Mais atividade</button>');
 }
 section.addEventListener('toggle',event=>{
  const details=event.target,summary=details.querySelector?.('[data-account]'),activity=details.querySelector?.('.admin-activity');
  if(!details.open||!summary||!activity||activity.dataset.loaded)return;
  activity.dataset.loaded='pending';
  drawActivity(summary.dataset.account,activity).then(()=>{activity.dataset.loaded='true'}).catch(error=>{delete activity.dataset.loaded;announce(error.message)});
 },true);
 section.addEventListener('submit',e=>{
  if(e.target.id==='adminFilters'){
   e.preventDefault();const fields=new FormData(e.target);
   search=String(fields.get('search')||'');filter=String(fields.get('role'));ordering=String(fields.get('ordering'));page=1;
   busyRun(loadUsers);return;
  }
  if(e.target.id!=='sumbaAnnounce')return;e.preventDefault();
  busyRun(async()=>{
   const v=new FormData(e.target),audience=String(v.get('audience'));
   if(!window.confirm('Confirmas o envio aos destinatários seleccionados?'))return;
   const res=await api(client,'announce',{
    audience,recipient:audience==='individual'?recipient:null,
    subject:(v.get('kind')==='notice'?'Aviso: ':'')+String(v.get('subject')||'').trim().slice(0,v.get('kind')==='notice'?133:140),message:String(v.get('message')||'').trim(),
    inapp:v.has('inapp'),email:v.has('email'),sms:v.has('sms'),confirmed:v.has('confirm')
   });
   const r=res.result;announce('Notificados no site: '+r.inapp+' · emails na fila: '+r.email_queued+' · SMS na fila: '+r.sms_queued+'.');
   e.target.reset();recipient=null;drawCompose();
  });
 });
 await loadUsers();
}
