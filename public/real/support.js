/* Support inbox shared by signed-in customers and authorised operators. */
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=value=>new Date(value).toLocaleString('pt-AO');
const read=async query=>{const {data,error}=await query;if(error)throw Error(error.message);return data;};

export async function mountSupport(client,root,user,{operator=false,initial=null}={}){
 if(!root?.isConnected)return;
 root.innerHTML='<div class="actions"><button type="button" class="outline" data-support="refresh">Atualizar conversas</button></div><p role="status" data-support-status></p><div class="sumba-support-grid"><div data-support-recent></div><div data-support-thread></div></div>';
 const status=root.querySelector('[data-support-status]');
 const recent=root.querySelector('[data-support-recent]');
 const thread=root.querySelector('[data-support-thread]');
 let selected=initial||(!operator?user.id:null),inbox=[],listLimit=50,history=[],older=false,busy=false;
 async function run(action){
  if(busy)return;
  busy=true;status.textContent='';
  const buttons=[...root.querySelectorAll('button:not(:disabled)')];
  buttons.forEach(button=>button.disabled=true);
  try{await action()}catch(error){status.textContent=error.message}
  finally{busy=false;buttons.forEach(button=>{if(button.isConnected)button.disabled=false})}
 }
 async function list(){
  if(!operator){recent.hidden=true;return}
  inbox=await read(client.rpc('sumba_support_inbox').neq('account_id',user.id).range(0,listLimit));
  recent.innerHTML='<h3>Recentes</h3>'+(inbox.length?inbox.slice(0,listLimit).map(row=>'<button type="button" class="outline sumba-support-row" data-support="open" data-id="'+esc(row.account_id)+'" aria-pressed="'+(selected===row.account_id)+'"><strong>'+esc(row.account_name)+'</strong><small>'+esc(row.last_message||'Sem mensagens')+' · '+esc(date(row.updated_at))+'</small></button>').join(''):'<p>Sem conversas.</p>')+
   (inbox.length>listLimit?'<button type="button" class="outline" data-support="more">Mais conversas</button>':'');
 }
 function showHistory({bottom=false,keep=false}={}){
  const box=thread.querySelector('[data-support-history]');
  const oldHeight=box.scrollHeight;
  box.innerHTML=history.length?history.map(row=>'<article class="support-message"><small>'+esc(row.from_support?'Apoio SUMBA':'Cliente')+' · '+esc(date(row.created_at))+'</small><p>'+esc(row.body)+'</p></article>').join(''):'<p>Sem mensagens. Escreve para iniciar a conversa.</p>';
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
  if(!selected){thread.innerHTML='<p>Seleciona uma conversa recente ou abre a ficha de um utilizador para o contactar.</p>';return}
  const row=inbox.find(item=>item.account_id===selected)||
   (operator?await read(client.from('sumba_support_threads').select('assigned_to').eq('account_id',selected).maybeSingle()):null);
  const canSend=!operator||row?.assigned_to===user.id;
  const draft=thread.querySelector('textarea')?.value||'';
  await loadHistory();
  thread.innerHTML='<h3>'+esc(row?.account_name||(operator?'Conversa com utilizador':'Apoio SUMBA'))+'</h3>'+
   '<button type="button" class="outline" data-support="older" hidden>Carregar mensagens anteriores</button>'+
   '<div class="sumba-support-history" data-support-history tabindex="0" aria-label="Histórico de mensagens"></div>'+
   (canSend?'<form data-support-form><label>Mensagem<textarea name="message" required maxlength="2000" rows="3"></textarea></label><button type="submit">Enviar</button></form>':
    row?.assigned_to?'<p>Outro operador assumiu esta conversa.</p>':'<button type="button" data-support="claim">Assumir conversa</button>');
  if(thread.querySelector('textarea'))thread.querySelector('textarea').value=draft;
  showHistory({bottom:true});
 }
 root.addEventListener('click',event=>{
  const button=event.target.closest('[data-support]');
  if(!button||!root.contains(button))return;
  run(async()=>{
   switch(button.dataset.support){
    case 'refresh': await list();await open();break;
    case 'more': listLimit+=50;await list();break;
    case 'open': if(selected!==button.dataset.id)thread.innerHTML='';selected=button.dataset.id;await list();await open();break;
    case 'claim': await read(client.rpc('sumba_support_claim',{target:selected}));await list();await open();break;
    case 'older': if(older){await loadHistory(history[0].id);showHistory({keep:true})}break;
   }
  });
 });
 root.addEventListener('submit',event=>{
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
  await list();await open();
 });
}
