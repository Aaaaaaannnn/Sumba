/* Support inbox shared by signed-in customers and authorised operators. */
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=value=>new Date(value).toLocaleString('pt-AO');
const read=async query=>{const {data,error}=await query;if(error)throw Error(error.message);return data;};

const inboxIcons={
 new:'<path d="M12 5v14M5 12h14"/>',
 bell:'<path d="M18 8a6 6 0 0 0-12 0c0 8-3 8-3 10h18c0-2-3-2-3-10zM10 21h4"/>',
 back:'<path d="m14 6-6 6 6 6M8 12h12"/>',
 refresh:'<path d="M20 7v5h-5M4 17v-5h5M5 10a7 7 0 0 1 12-4l3 4M19 14a7 7 0 0 1-12 4l-3-4"/>'
};
const inboxSvg=name=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+inboxIcons[name]+'</svg>';
const inboxInitial=name=>String(name||'').trim().split(/\s+/).slice(0,2).map(word=>word[0]||'').join('').toUpperCase()||'S';
const inboxTime=value=>{const date=new Date(value);if(!value||Number.isNaN(+date))return '';return date.toDateString()===new Date().toDateString()?date.toLocaleTimeString('pt-AO',{hour:'2-digit',minute:'2-digit'}):date.toLocaleDateString('pt-AO',{day:'numeric',month:'short'});};
export async function mountSupport(client,root,user,{operator=false,initial=null}={}){
 if(!root?.isConnected)return;
 const icon=(action,name,label,extra='')=>'<button type="button" class="inbox-icon '+extra+'" data-support="'+action+'" title="'+label+'" aria-label="'+label+'">'+inboxSvg(name)+(action==='notifications'?'<span class="inbox-badge" data-unread-badge hidden></span>':'')+'</button>';
 root.innerHTML='<p role="status" data-support-status></p><div class="sumba-inbox" data-open="'+!!initial+'"><aside class="inbox-card inbox-sidebar"><header class="inbox-header"><h2 data-inbox-title>Recentes</h2><div class="inbox-actions">'+icon('notifications','bell','Conversas não lidas')+icon('refresh','refresh','Atualizar conversas')+icon('new','new','Nova mensagem')+'</div></header><div data-inbox-controls></div><div class="inbox-list" data-support-recent></div></aside><section class="inbox-card inbox-thread" data-support-thread></section></div>';
 const status=root.querySelector('[data-support-status]');
 const recent=root.querySelector('[data-support-recent]');
 const thread=root.querySelector('[data-support-thread]');
 const layout=root.querySelector('.sumba-inbox');
 const controls=root.querySelector('[data-inbox-controls]');
 let selected=initial,inbox=[],contacts=[],recipientName='',listLimit=50,history=[],older=false,busy=false,query='',unreadOnly=false,composing=false;
 let seen={};
 const storageKey='sumba-support-seen:'+user.id+(operator?':operator':'');
 try{seen=JSON.parse(localStorage.getItem(storageKey)||'{}')||{}}catch{}
 const isUnread=row=>Boolean(row.last_message)&&row.updated_at!==(seen[row.account_id]||null);
 function markRead(){
  const row=inbox.find(item=>item.account_id===selected);
  if(!row)return;
  seen[row.account_id]=row.updated_at;
  try{localStorage.setItem(storageKey,JSON.stringify(seen))}catch{}
 }
 async function run(action){
  if(busy)return;
  busy=true;status.textContent='';
  const buttons=[...root.querySelectorAll('button:not(:disabled)')];
  buttons.forEach(button=>button.disabled=true);
  try{await action()}catch(error){status.textContent=error.message}
  finally{busy=false;buttons.forEach(button=>{if(button.isConnected)button.disabled=false})}
 }
 function paintControls(){
  const search='<label class="inbox-search"><input type="search" name="search" aria-label="'+(composing?'Pesquisar conta':'Pesquisar recentes')+'" placeholder="'+(composing?'Nome ou e-mail':'Pesquisar conversas')+'" value="'+esc(query)+'"></label>';
  root.querySelector('[data-inbox-title]').textContent=composing?'Nova mensagem':'Recentes';
  controls.innerHTML=composing?'<form data-support-contacts>'+search+'<div class="inbox-filters"><button type="submit" class="inbox-chip">Pesquisar</button>'+icon('all','back','Voltar aos recentes')+'</div></form>':search+'<div class="inbox-filters"><button type="button" class="inbox-chip" data-support="all" aria-pressed="'+!unreadOnly+'">Todas</button><button type="button" class="inbox-chip" data-support="notifications" aria-pressed="'+unreadOnly+'">Não lidas</button></div>';
 }
 function paintList(){
  const count=inbox.filter(isUnread).length,badge=root.querySelector('[data-unread-badge]');
  badge.hidden=!count;
  badge.textContent=String(Math.min(count,99));
  const normalized=query.trim().toLocaleLowerCase('pt-AO');
  const show=composing?contacts:inbox.slice(0,listLimit).filter(row=>(!unreadOnly||isUnread(row))&&((row.account_name||'')+' '+(row.last_message||'')).toLocaleLowerCase('pt-AO').includes(normalized));
  recent.innerHTML=show.map(row=>{
   const unread=isUnread(row);
   return '<button type="button" class="inbox-row" data-support="open" data-id="'+esc(row.account_id)+'" aria-current="'+(selected===row.account_id)+'"><span class="inbox-avatar" aria-hidden="true">'+esc(inboxInitial(row.account_name))+'</span><span class="inbox-copy"><strong>'+esc(row.account_name)+'</strong><small>'+esc(row.last_message||'Abrir conversa')+'</small></span><span class="inbox-meta"><time class="inbox-time">'+esc(inboxTime(row.updated_at))+'</time>'+(unread?'<span class="inbox-dot" role="img" aria-label="Não lida"></span>':'')+'</span></button>';
  }).join('')||'<p class="inbox-empty">'+(composing?'Pesquisa para escolher uma conta.':normalized?'Nenhuma conversa encontrada.':unreadOnly?'Estás em dia com as mensagens.':'Ainda não há conversas recentes.')+'</p>';
  if(!composing&&inbox.length>listLimit)recent.insertAdjacentHTML('beforeend','<button type="button" class="inbox-chip" data-support="more">Mais conversas</button>');
 }
 async function list(){
  if(operator){
   inbox=await read(client.rpc('sumba_support_inbox').neq('account_id',user.id).range(0,listLimit));
  }else{
   const last=await read(client.from('sumba_support_messages').select('id,body,created_at,from_support').eq('account_id',user.id).order('id',{ascending:false}).limit(1).maybeSingle());
   inbox=[{account_id:user.id,account_name:'Apoio SUMBA',last_message:last?.body,updated_at:last?.created_at}];
   if(last&&!last.from_support)seen[user.id]=last.created_at;
  }
  paintList();
 }
 function showHistory({bottom=false,keep=false}={}){
  const box=thread.querySelector('[data-support-history]');
  const oldHeight=box.scrollHeight;
  box.innerHTML=history.length?history.map(row=>'<article class="inbox-bubble '+(row.from_support===operator?'mine':'')+'"><p>'+esc(row.body)+'</p><small>'+esc(row.from_support===operator?'Tu':row.from_support?'Apoio SUMBA':'Cliente')+' · '+esc(date(row.created_at))+'</small></article>').join(''):'<p>Sem mensagens. Escreve para iniciar a conversa.</p>';
  if(bottom)box.scrollTop=box.scrollHeight;
  if(keep)box.scrollTop+=box.scrollHeight-oldHeight;
  thread.querySelector('[data-support="older"]').hidden=!older;
 }
 async function loadHistory(before=null){
  let q=client.from('sumba_support_messages').select('id,from_support,body,created_at').eq('account_id',selected).order('id',{ascending:false}).limit(41);
  if(before!==null)q=q.lt('id',before);
  const rows=await read(q);older=rows.length>40;
  const batch=rows.slice(0,40).reverse();
  history=before===null?batch:[...batch,...history];
 }
 async function open(){
  if(!selected){thread.innerHTML='<p class="inbox-empty">Seleciona uma conversa ou inicia uma nova mensagem.</p>';return}
  const row=inbox.find(item=>item.account_id===selected)||
   (operator?await read(client.from('sumba_support_threads').select('assigned_to').eq('account_id',selected).maybeSingle()):null);
  const canSend=!operator||row?.assigned_to===user.id;
  const draft=thread.querySelector('textarea')?.value||'';
  await loadHistory();
  const name=row?.account_name||recipientName||(operator?'Conversa com utilizador':'Apoio SUMBA');
  layout.dataset.open='true';
  thread.innerHTML='<header class="inbox-header"><div class="inbox-thread-title">'+icon('back','back','Voltar às conversas','inbox-back')+'<span class="inbox-avatar" aria-hidden="true">'+esc(inboxInitial(name))+'</span><h3>'+esc(name)+'</h3></div>'+icon('refresh','refresh','Atualizar conversa')+'</header>'+
   '<button type="button" class="outline" data-support="older" hidden>Carregar mensagens anteriores</button>'+
   '<div class="inbox-history" data-support-history tabindex="0" aria-label="Histórico de mensagens"></div>'+
   (canSend?'<form data-support-form class="inbox-composer"><textarea name="message" aria-label="Mensagem" placeholder="Escreve uma mensagem…" required maxlength="2000" rows="1"></textarea><button type="submit">Enviar</button></form>':
    row?.assigned_to?'<p>Outro operador assumiu esta conversa.</p>':'<button type="button" data-support="claim">Assumir conversa</button>');
  if(thread.querySelector('textarea'))thread.querySelector('textarea').value=draft;
  showHistory({bottom:true});markRead();paintList();
 }
 root.addEventListener('click',event=>{
  const button=event.target.closest('[data-support]');
  if(!button||!root.contains(button))return;
  run(async()=>{
   switch(button.dataset.support){
    case 'refresh': await list();await open();break;
    case 'more': listLimit+=50;await list();break;
    case 'open':
     if(selected!==button.dataset.id)thread.innerHTML='';
     selected=button.dataset.id;
     recipientName=contacts.find(row=>row.account_id===selected)?.account_name||'';
     composing=false;query='';unreadOnly=false;paintControls();await open();break;
    case 'back': selected=null;layout.dataset.open='false';thread.innerHTML='';paintList();break;
    case 'all':
    case 'notifications':
     composing=false;unreadOnly=button.dataset.support==='notifications';query='';paintControls();paintList();break;
    case 'new':
     if(!operator){selected=user.id;await open();break}
     query='';contacts=[];composing=true;paintControls();paintList();controls.querySelector('input')?.focus();break;
    case 'claim': await read(client.rpc('sumba_support_claim',{target:selected}));await list();await open();break;
    case 'older': if(older){await loadHistory(history[0].id);showHistory({keep:true})}break;
   }
  });
 });
 root.addEventListener('input',event=>{
  if(event.target.name==='search'&&!composing){query=event.target.value;paintList()}
 });
 root.addEventListener('submit',event=>{
  if(event.target.matches('[data-support-contacts]')){
   event.preventDefault();
   run(async()=>{
    const term=event.target.elements.search.value.trim();
    const result=await read(client.rpc('sumba_admin_accounts_page',{term,account_type:'all',ordering:'name',page_number:1}));
    contacts=result.users.filter(account=>account.id!==user.id).map(account=>({account_id:account.id,account_name:account.name||account.email||account.phone||'Conta sem nome'}));
    paintList();
    if(!contacts.length)status.textContent='Nenhuma conta encontrada.';
   });return;
  }
  if(!event.target.matches('[data-support-form]'))return;
  event.preventDefault();
  run(async()=>{
   const field=event.target.elements.message,message=field.value.trim();
   if(!message)return;
   await read(client.rpc('sumba_support_send',{target:selected,message}));
   field.value='';await list();await open();status.textContent='Mensagem enviada.';
  });
 });
 await run(async()=>{
  if(initial===user.id&&operator)selected=null;
  paintControls();await list();await open();
 });
 const refreshTimer=setInterval(()=>{
  if(!root.isConnected){clearInterval(refreshTimer);return}
  if(document.hidden||busy||composing)return;
  run(async()=>{
   await list();
   const row=inbox.find(item=>item.account_id===selected);
   if(!row||!isUnread(row)||!thread.querySelector('[data-support-history]'))return;
   const newest=history.at(-1)?.id;
   let q=client.from('sumba_support_messages').select('id,from_support,body,created_at').eq('account_id',selected).order('id',{ascending:true}).limit(100);
   if(newest!==undefined)q=q.gt('id',newest);
   const additions=await read(q);
   if(additions.length===100){await open();return}
   if(additions.length){
    const box=thread.querySelector('[data-support-history]');
    const bottom=box.scrollHeight-box.scrollTop-box.clientHeight<60;
    history.push(...additions);showHistory({bottom});
   }
   markRead();paintList();
  });
 },15000);
}
